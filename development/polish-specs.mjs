// Final presentation refinements. Run from repository root.
import './refine-encodings.mjs';
import fs from 'node:fs';
const get=n=>JSON.parse(fs.readFileSync(`specs/${n}.json`,'utf8'));
const put=(n,s)=>fs.writeFileSync(`specs/${n}.json`,JSON.stringify(s,null,2));
const G='#245646',R='#a4482f',U='#806926',I='#203b32',P='#f7f5ed';
const trails=JSON.parse(fs.readFileSync('data/trails.json','utf8'));
let s=get('09-trail-map');s.height=330;
const circles=s.layer[1];circles.mark.filled=false;delete circles.mark.stroke;circles.mark.strokeWidth=2.2;circles.encoding.size.scale.range=[0,500];circles.encoding.opacity.condition[0].value=.85;put('09-trail-map',s);
const inset=structuredClone(s);inset.description='Eastern detail of the same selected trail locations, with the same circle-area scale and shared highlighting as the overview.';
const states=inset.layer[0].data.values.filter(d=>['QLD','NSW','VIC','TAS'].includes(d.properties.state));
inset.layer[0].data.values=states;inset.layer[1].transform.push({filter:"indexof(['QLD','NSW','VIC','TAS'],datum.state)>=0"});
const zoomBox={type:'Feature',geometry:{type:'Polygon',coordinates:[[[143.5,-43],[155,-43],[155,-24.5],[143.5,-24.5],[143.5,-43]]]}};
inset.projection.fit=zoomBox;for(const layer of inset.layer)layer.mark.clip=true;inset.layer[1].encoding.size.legend=null;inset.layer[1].encoding.color.legend=null;inset.config.view.stroke='#c7cdb9';put('17-eastern-trail-inset',inset);
s.layer.push({data:{values:[zoomBox]},mark:{type:'geoshape',filled:false,stroke:'#526354',strokeDash:[3,3],strokeWidth:1}});put('09-trail-map',s);
// Wrap names inside tiles; hide lines that cannot fit instead of writing outside a tile.
function wrap(text,max){const result=[];let line='';for(let word of text.split(/\s+/)){while(word.length>max){if(line){result.push(line);line='';}result.push(word.slice(0,max));word=word.slice(max);}if(!word)continue;if((line+' '+word).trim().length>max){result.push(line);line=word;}else line=(line+' '+word).trim();}if(line)result.push(line);return result;}
s=get('14-trail-treemap');s.height=440;
for(const d of s.data[0].values.filter(d=>d.parent&&d.parent!=='root')){const name=d.short_name.replace(/-/g,'- ');d.wide=wrap(name,20);d.medium=wrap(name,13);d.compact=wrap(name,9);d.narrow=wrap(name,6);}
const lines="(datum.x1-datum.x0>145 ? datum.wide : datum.x1-datum.x0>95 ? datum.medium : datum.x1-datum.x0>65 ? datum.compact : datum.narrow)";
const visible=`slice(${lines},0,max(0,floor((datum.y1-datum.y0-30)/14)))`;
Object.assign(s.marks[2].encode.update,{text:{signal:visible},lineHeight:{value:14},baseline:{value:'top'},y:{signal:'datum.y0+8'},opacity:{signal:'datum.x1-datum.x0>48 && datum.y1-datum.y0>45 ? 1 : 0'}});
Object.assign(s.marks[3].encode.update,{baseline:{value:'top'},y:{signal:`datum.y0+12+length(${visible})*14`},opacity:{signal:'datum.x1-datum.x0>48 && datum.y1-datum.y0>45 ? 1 : 0'}});put('14-trail-treemap',s);
// Opening status belongs with the individual listing, not a nearly uniform third stage.
s=get('10-trail-lengths');s.layer[0].encoding.y.axis.labelExpr="(datum.label==='Denmark – Nornalup Heritage' || datum.label==='NW Tasmanian Coastal Pathway' ? '† ' : '') + datum.label";put('10-trail-lengths',s);
const surfaceOrder=['Sealed','Unsealed','Mixed'],bands=['0–49 km','50–99 km','100–149 km','150–199 km'];
const band=t=>bands[Math.floor(t.km/50)];
const grouped=new Map();for(const t of trails){const cats=[t.surface_group,band(t)],key=cats.join('|');if(!grouped.has(key))grouped.set(key,{cats,surface:t.surface_group,count:0,names:[]});const f=grouped.get(key);f.count++;f.names.push(t.short_name);}
const flows=[...grouped.values()].sort((a,b)=>surfaceOrder.indexOf(a.surface)-surfaceOrder.indexOf(b.surface)||bands.indexOf(a.cats[1])-bands.indexOf(b.cats[1]));
const nodes=[];for(let axis=0;axis<2;axis++){let cursor=0;for(const cat of axis?bands:surfaceOrder){const matching=flows.filter(f=>f.cats[axis]===cat).sort((a,b)=>axis?surfaceOrder.indexOf(a.surface)-surfaceOrder.indexOf(b.surface):bands.indexOf(a.cats[1])-bands.indexOf(b.cats[1]));const count=matching.reduce((n,f)=>n+f.count,0);nodes.push({axis,cat,count,start:cursor,end:cursor+count});let p=cursor;for(const f of matching){f[`p${axis}`]=p;p+=f.count;}cursor+=count+.9;}}
flows.forEach((f,i)=>{f.id=i;f.names=f.names.join('; ');});
const av={$schema:'https://vega.github.io/schema/vega/v5.json',width:700,height:360,padding:5,autosize:{type:'fit',contains:'padding',resize:true},background:'transparent',description:'Two-stage parallel sets of surface and equal-width 50 km length bands for 14 selected listings. Width counts listings; labels are outside ribbons. Partly open status is marked on Figure 2.',signals:[{name:'left',update:'width<500 ? 83 : 145'},{name:'right',update:'width-(width<500 ? 88 : 145)'},{name:'unit',update:'(height-55)/16.7'},{name:'hoverFlow',value:-1,on:[{events:'@ribbons:mouseover',update:'datum.id'},{events:'@ribbons:mouseout',update:'-1'}]}],data:[{name:'flows',values:flows},{name:'nodes',values:nodes}],scales:[{name:'surface',type:'ordinal',domain:['Sealed','Mixed','Unsealed'],range:[G,R,U]}],marks:[
 {name:'ribbons',type:'path',from:{data:'flows'},encode:{update:{path:{signal:"'M'+left+','+(36+unit*datum.p0)+'C'+((left+right)/2)+','+(36+unit*datum.p0)+' '+((left+right)/2)+','+(36+unit*datum.p1)+' '+right+','+(36+unit*datum.p1)+'L'+right+','+(36+unit*(datum.p1+datum.count))+'C'+((left+right)/2)+','+(36+unit*(datum.p1+datum.count))+' '+((left+right)/2)+','+(36+unit*(datum.p0+datum.count))+' '+left+','+(36+unit*(datum.p0+datum.count))+'Z'"},fill:{scale:'surface',field:'surface'},fillOpacity:{signal:'hoverFlow===-1 ? .8 : hoverFlow===datum.id ? 1 : .12'},stroke:{value:P},strokeWidth:{value:1.2},tooltip:{signal:"{'Surface':datum.cats[0],'Length band':datum.cats[1],'Listings':datum.count,'Trails':datum.names}"}}}},
 {type:'rect',from:{data:'nodes'},encode:{update:{x:{signal:'datum.axis===0 ? left-6 : right'},width:{value:6},y:{signal:'36+unit*datum.start'},y2:{signal:'36+unit*datum.end'},fill:{value:I}}}},
 {type:'text',from:{data:'nodes'},interactive:false,encode:{update:{x:{signal:'datum.axis===0 ? left-13 : right+13'},y:{signal:'29+unit*(datum.start+datum.end)/2'},text:{signal:"[datum.cat,datum.count+(datum.count===1 ? ' listing' : ' listings')]"},align:{signal:"datum.axis===0 ? 'right' : 'left'"},lineHeight:{value:14},fontSize:{value:12},fill:{value:I}}}},
 ...[{x:'left-13',align:'right',text:'Surface'},{x:'right+13',align:'left',text:'Length band'}].map(d=>({type:'text',interactive:false,encode:{update:{x:{signal:d.x},y:{value:15},align:{value:d.align},text:{value:d.text},fontSize:{value:12},fontWeight:{value:600},fill:{value:I}}}}))
]};put('15-trail-alluvial',av);
const summary=JSON.parse(fs.readFileSync('data/trail-summary.json','utf8'));summary.flows=flows;summary.partlyOpen=trails.filter(t=>t.status.includes('Partially')).map(t=>t.name);fs.writeFileSync('data/trail-summary.json',JSON.stringify(summary,null,2));
// Separate the gap annotation from endpoint values in the dumbbell.
s=get('06-gender');s.height=300;s.layer[2].mark.dy=18;s.layer[3].mark.dy=-23;s.layer[3].mark.fontWeight=600;put('06-gender',s);
// Directly connect text to the waffle regions; no separate legend or hidden tiles.
const waffleData=get('07-quiet-routes').data.values.map(d=>({...d,group:d.style.startsWith('Paths')?'Quiet':d.style.startsWith('Most')?'Direct':'Never'}));
const waffle={$schema:'https://vega.github.io/schema/vega/v5.json',width:500,height:300,padding:5,autosize:{type:'fit',contains:'padding',resize:true},background:'transparent',description:'100 visible waffle cells, with direct connected labels for 69% paths or quiet streets, 22% most direct route, and 9% never on a road. One cell is one percentage point.',signals:[{name:'plot',update:'min(280,width-125)'}],data:[{name:'cells',values:waffleData},{name:'labels',values:[{group:'Quiet',source:.35,target:.24,lines:['69%','Paths or','quiet streets']},{group:'Direct',source:.78,target:.66,lines:['22%','Most direct','route']},{group:'Never',source:.95,target:1.04,lines:['9%','Never on','a road']}]}],scales:[{name:'style',type:'ordinal',domain:['Quiet','Direct','Never'],range:[G,'#a4bc69',R]}],marks:[{type:'rect',from:{data:'cells'},encode:{update:{x:{signal:'datum.col*plot/10'},y:{signal:'10+datum.row*plot/10'},width:{signal:'plot/10-2'},height:{signal:'plot/10-2'},cornerRadius:{value:2},fill:{scale:'style',field:'group'},tooltip:{signal:"{'Preference':datum.style,'One square':'one percentage point'}"}}}},{type:'path',from:{data:'labels'},interactive:false,encode:{update:{path:{signal:"'M'+plot+','+(10+plot*datum.source)+'L'+(plot+10)+','+(10+plot*datum.target)+'L'+(plot+18)+','+(10+plot*datum.target)"},stroke:{scale:'style',field:'group'},strokeWidth:{value:1.3}}}},{type:'text',from:{data:'labels'},interactive:false,encode:{update:{x:{signal:'plot+24'},y:{signal:'plot*datum.target-1'},text:{field:'lines'},lineHeight:{value:14},fontSize:{value:12},fontWeight:{value:600},fill:{value:I},baseline:{value:'top'}}}}]};put('07-quiet-routes',waffle);
// Tighter route map and independently computed cartographic surface chainage.
const profile=JSON.parse(fs.readFileSync('data/route-profile.json','utf8'));
s=get('12-route-map');s.height=240;s.layer[0].mark.strokeWidth=12;s.layer[1].mark.strokeWidth=7;s.layer[1].encoding.color.legend=null;
s.layer[3].data.values=s.layer[3].data.values.map(d=>({...d,label:d.town}));
s.layer[3].mark.dy=-20;
s.layer[6].encoding.x.value=18;s.layer[6].encoding.y.value=12;
const scaleDelta=s.layer[4].data.values[0].lon2-s.layer[4].data.values[0].lon;
s.layer[4].data.values[0].lon=145.56;s.layer[4].data.values[0].lon2=145.56+scaleDelta;s.layer[5].data.values[0].lon=145.56+scaleDelta/2;
const towns=profile.towns.filter(t=>t.name!=='Millgrove').map((t,i)=>({...t,labelDy:i===1?-22:25}));
s.layer.push({data:{values:towns},mark:{type:'point',filled:true,fill:P,stroke:I,strokeWidth:1.5,size:58},encoding:{longitude:{field:'lon',type:'quantitative'},latitude:{field:'lat',type:'quantitative'},tooltip:[{field:'name',type:'nominal',title:'Mapped town centre'}]}});
s.layer.push({data:{values:towns},mark:{type:'text',fontSize:12,color:I,dy:{expr:'datum.labelDy'}},encoding:{longitude:{field:'lon',type:'quantitative'},latitude:{field:'lat',type:'quantitative'},text:{field:'name'}}});
s.description='OSM surface-tagged route geometry with mapped town centres. Line width is constant. Original gaps remain unconnected on the geographic map; the companion strip records their small distance allowances explicitly.';put('12-route-map',s);
const total=profile.metadata.total_km;
const runs=[];for(const segment of profile.segments){const last=runs.at(-1);if(last&&last.surface===segment.surface){last.end_km=segment.end_km;if(!last.surface_tag.split(', ').includes(segment.surface_tag))last.surface_tag+=', '+segment.surface_tag;}else runs.push({...segment});}
const strip={...get('11-trail-grouped-dots'),height:165,description:'Surface by approximate cartographic distance from the Lilydale mapped end along the ordered main OSM corridor. Two geometry gaps totalling under ten metres are explicit. This is not surveyed ride distance.',layer:[
 {data:{values:runs},mark:{type:'rect'},encoding:{x:{field:'start_km',type:'quantitative',title:'Approx. distance from Lilydale (km)',scale:{domain:[0,total],nice:false},axis:{values:[0,10,20,30],grid:false}},x2:{field:'end_km'},y:{value:48},y2:{value:72},color:{field:'surface',type:'nominal',scale:{domain:['Sealed','Unsealed','Not recorded','Geometry gap'],range:[G,U,'#777777','#ffffff']},legend:null},tooltip:[{field:'surface',type:'nominal',title:'Surface / mapping status'},{field:'start_km',type:'quantitative',title:'Start km',format:'.2f'},{field:'end_km',type:'quantitative',title:'End km',format:'.2f'},{field:'surface_tag',type:'nominal',title:'Original OSM tag(s)'}]}},
 {data:{values:profile.towns.filter(t=>['Mount Evelyn','Woori Yallock'].includes(t.name))},mark:{type:'rule',color:I},encoding:{x:{field:'km',type:'quantitative'},y:{value:32},y2:{value:48}}},
 {data:{values:profile.towns.filter(t=>['Mount Evelyn','Woori Yallock'].includes(t.name))},mark:{type:'text',fontSize:12,color:I},encoding:{x:{field:'km',type:'quantitative'},y:{value:22},text:{field:'name'}}},
 {data:{values:[{km:0,label:'Lilydale'}]},mark:{type:'text',align:'left',fontSize:12,color:I},encoding:{x:{field:'km',type:'quantitative'},y:{value:93},text:{field:'label'}}},
 {data:{values:[{km:total,label:`Warburton · ${total.toFixed(1)} km`}]},mark:{type:'text',align:'right',fontSize:12,color:I},encoding:{x:{field:'km',type:'quantitative'},y:{value:93},text:{field:'label'}}}
]};put('18-route-surface-strip',strip);
console.log('Presentation refinements: eastern inset, wrapped names, two-stage alluvial, separated dumbbell labels, direct waffle labels, thicker route and surface strip.');
