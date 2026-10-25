// Final marks-and-channels revision. Run from the repository root.
import './revise-specs.mjs';
import fs from 'node:fs';
const get=n=>JSON.parse(fs.readFileSync(`specs/${n}.json`,'utf8'));
const put=(n,s)=>fs.writeFileSync(`specs/${n}.json`,JSON.stringify(s,null,2));
const G='#245646',R='#a4482f',U='#806926',I='#203b32',P='#f7f5ed';
const domain=[0,45],range=['#f1f4e9',G];
const rgb=s=>s.slice(1).match(/../g).map(x=>parseInt(x,16));
const lum=rgb=>rgb.map(x=>x/255).map(x=>x<=.04045?x/12.92:((x+.055)/1.055)**2.4).reduce((n,x,i)=>n+x*[.2126,.7152,.0722][i],0);
const fillFor=rate=>{const a=rgb(range[0]),b=rgb(range[1]),t=Math.max(0,Math.min(1,(rate-domain[0])/(domain[1]-domain[0])));return a.map((x,i)=>Math.round(x+(b[i]-x)*t));};
const textFor=rate=>{const l=lum(fillFor(rate));return (l+.05)/.05 >= 1.05/(l+.05) ? '#000000' : '#ffffff';};
let s=get('03-state-heatmap');
for(const d of s.data.values)d.labelColor=textFor(d.rate);
s.layer[0].encoding.color.scale={domain,range,interpolate:'rgb'};
s.layer[0].encoding.color.title='Participation (%) · same scale as map';
s.layer[0].encoding.color.legend={orient:'bottom',direction:'horizontal',gradientLength:170,values:[0,15,30,45],titleLimit:330};
delete s.layer[1].encoding.color;s.layer[1].mark.color={expr:'datum.labelColor'};put('03-state-heatmap',s);
s=get('02-participation-map');s.layer[0].encoding.color.scale={domain,range,interpolate:'rgb'};s.layer[0].encoding.color.title='Participation (%) · common 0–45% scale';
for(const d of s.layer[1].data.values)for(const period of ['Week','Month','Year'])d[period+'Text']=textFor(d[period]);
delete s.layer[1].encoding.color;s.layer[1].mark.color={expr:"datum.state==='ACT' ? '#000000' : datum.labelColor"};
s.layer[1].transform.push({calculate:"datum[period+'Text']",as:'labelColor'});put('02-participation-map',s);
s=get('11-trail-boxplot');s.layer[0].mark.box={fillOpacity:.16,stroke:'#526354',strokeWidth:1.3};s.layer[0].mark.median={color:'#000000',strokeWidth:2};s.layer[0].mark.rule={color:'#526354',strokeWidth:1.3};
s.layer[1].mark={type:'point',filled:true,fill:'#ffffff',stroke:'#10251d',strokeWidth:1.7,opacity:1,size:55};put('11-trail-boxplot',s);
s=get('09-trail-map');const bubbles=s.layer[1];bubbles.mark.opacity=1;bubbles.mark.strokeWidth=1.6;
bubbles.encoding.opacity={condition:[{test:"highlight===''",value:.68},{test:'datum.short_name===highlight',value:1}],value:.14};bubbles.encoding.size.scale.range=[0,1100];put('09-trail-map',s);
s=get('07-quiet-routes');for(const d of s.data.values)d.row=Math.floor((d.cell-1)/10);put('07-quiet-routes',s);
s=get('01-national-trend');
for(const layer of s.layer){if(layer.encoding?.color?.field==='period')layer.encoding.color.scale.range=[G,'#477bad','#7c5a87'];if(layer.encoding?.x?.field==='year')layer.encoding.x={field:'year',type:'quantitative',title:null,scale:{zero:false,domain:[2014.5,2025.8]},axis:{values:[2015,2017,2019,2021,2023,2025],format:'d',grid:false,labelAngle:0}};}
put('01-national-trend',s);
s=get('06-gender');s.layer[1].encoding.color.scale.range=['#7c5a87',G];put('06-gender',s);
s=get('05-age');s.layer[1].encoding.color.scale.range=[G,'#477bad'];put('05-age',s);
s=get('08-frequency');s.layer[0].encoding.color.scale.range=[R,'#d9ddc9',G];put('08-frequency',s);
s=get('13-reach-routine');for(const d of s.data.values)d.ratioLabel=d.ratio.toFixed(1)+'%';s.layer[0].encoding.x={field:'ratio',type:'quantitative',title:'Weekly rate as % of annual rate',scale:{domain:[0,100]},axis:{values:[0,20,40,60,80,100],labelExpr:"datum.value+'%'"}};s.layer[1].encoding.text={field:'ratioLabel'};
s.layer.push({data:{values:[{}]},mark:{type:'rule',color:'#526354',strokeDash:[2,3],strokeWidth:1.3},encoding:{x:{datum:50}}});put('13-reach-routine',s);
// Separate, verified OSM way-level surface attributes from the broad listing tag.
const segments=JSON.parse(fs.readFileSync('data/route-segments.geojson','utf8')).features;
const ends=JSON.parse(fs.readFileSync('data/route-endpoints.json','utf8'));
s=get('12-route-map');s.height=280;
s.layer[0].mark.strokeWidth=9;s.layer[1].data={values:segments};s.layer[1].mark={type:'geoshape',filled:false,strokeWidth:3.7};
s.layer[1].encoding={color:{field:'properties.surface_group',type:'nominal',title:'OSM way-level surface',scale:{domain:['Sealed','Unsealed','Not recorded'],range:[G,U,'#777777']},legend:{orient:'bottom',columns:1,symbolType:'stroke',symbolStrokeWidth:3.7}},tooltip:[{field:'properties.surface_group',type:'nominal',title:'Surface class'},{field:'properties.surface_tag',type:'nominal',title:'Original OSM tag'},{field:'properties.way_id',type:'nominal',title:'OSM way ID'}]};
s.layer[2].data={values:ends};s.layer[3].data={values:ends};s.layer[3].encoding.text={field:'label'};s.layer[2].mark.fill='#203b32';s.description='Actual OSM member-way geometry coloured by each way’s recorded surface. Explicit terminal node IDs were checked for degree-one topology and the relation from/to towns. This is a dated community mapping snapshot, not navigation or a surface inspection.';put('12-route-map',s);
// Reduce avoidable ribbon crossings without changing categories, widths or records.
const av=get('15-trail-alluvial'),flows=av.data.find(d=>d.name==='flows').values,nodes=av.data.find(d=>d.name==='nodes').values;
const nodeOrders=nodes.map(n=>({node:n,flows:flows.filter(f=>f.cats[n.axis]===n.cat).sort((a,b)=>a[`p${n.axis}`]-b[`p${n.axis}`])}));
const assign=()=>{for(const {node,flows:items} of nodeOrders){let p=node.start;for(const f of items){f[`p${node.axis}`]=p;p+=f.count;}}};
const cost=()=>{let c=0;for(let a=0;a<2;a++)for(let i=0;i<flows.length;i++)for(let j=i+1;j<flows.length;j++){const x=flows[i],y=flows[j];if((x[`p${a}`]+x.count/2-y[`p${a}`]-y.count/2)*(x[`p${a+1}`]+x.count/2-y[`p${a+1}`]-y.count/2)<0)c+=x.count*y.count;}return c;};
assign();const before=cost();let score=before;
for(let pass=0;pass<30;pass++){let changed=false;for(const group of pass%2?[...nodeOrders].reverse():nodeOrders){const list=group.flows;for(let i=0;i<list.length-1;i++){[list[i],list[i+1]]=[list[i+1],list[i]];assign();const candidate=cost();if(candidate<score){score=candidate;changed=true;}else{[list[i],list[i+1]]=[list[i+1],list[i]];assign();}}}if(!changed)break;}
av.marks[0].encode.update.fillOpacity.signal='hoverFlow===-1 ? .82 : hoverFlow===datum.id ? 1 : .1';av.marks[0].encode.update.strokeWidth.value=1.1;put('15-trail-alluvial',av);
const summary=JSON.parse(fs.readFileSync('data/trail-summary.json','utf8'));summary.flows=flows;fs.writeFileSync('data/trail-summary.json',JSON.stringify(summary,null,2));
console.log(`Alluvial weighted crossing proxy: ${before} → ${score}; all 14 records retained.`);
// Raise SVG text itself, including explicit per-mark overrides.
for(const name of fs.readdirSync('specs').filter(f=>f.endsWith('.json'))){
 const n=name.slice(0,-5),spec=get(n);
 if(spec.config){spec.config.text={...spec.config.text,fontSize:12};}
 const walk=o=>{if(!o||typeof o!=='object')return;if(typeof o.fontSize==='number'&&o.fontSize<12)o.fontSize=12;for(const v of Object.values(o))if(typeof v==='object')walk(v);};walk(spec);put(n,spec);
}
console.log('Contrast, shared rate scale, mark visibility, unit labels and verified route attributes updated.');
