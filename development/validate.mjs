import fs from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';
const ctx=vm.createContext({console,setTimeout,clearTimeout,URL,structuredClone,performance});
function rgb(s){if(/^#[0-9a-f]{3}$/i.test(s))s='#'+s.slice(1).split('').map(x=>x+x).join('');return s.startsWith('#')?s.slice(1).match(/../g).map(x=>parseInt(x,16)):s.match(/[\d.]+/g).slice(0,3).map(Number);}
function luminance(s){return rgb(s).map(x=>x/255).map(x=>x<=.04045?x/12.92:((x+.055)/1.055)**2.4).reduce((n,x,i)=>n+x*[.2126,.7152,.0722][i],0);}
function contrast(a,b){const x=luminance(a),y=luminance(b);return (Math.max(x,y)+.05)/(Math.min(x,y)+.05);}
function items(view){const result=[];const walk=n=>{result.push(n);for(const x of n.items||[])walk(x);};walk(view.scenegraph().root);return result;}
for(const lib of ['vega','vega-lite'])vm.runInContext(fs.readFileSync(`vendor/${lib}.min.js`,'utf8'),ctx);
function inline(node){if(!node||typeof node!=='object')return;if(node.url?.startsWith('data/')){let d=JSON.parse(fs.readFileSync(`${node.url.split('?')[0]}`,'utf8'));if(node.format?.property)d=d[node.format.property];delete node.url;delete node.format;node.values=d;}for(const v of Object.values(node))if(typeof v==='object')inline(v);}
const data=JSON.parse(fs.readFileSync('data/participation.json'));
assert.equal(data.length,162);assert.equal(data.filter(r=>r.year===2025&&r.period==='Week'&&r.state==='AUS')[0].rate,14.9);
const trails=JSON.parse(fs.readFileSync('data/trails.json'));assert.equal(trails.length,14);
assert.deepEqual(['Sealed','Mixed','Unsealed'].map(g=>trails.filter(t=>t.surface_group===g).length),[5,5,4]);
const summary=JSON.parse(fs.readFileSync('data/trail-summary.json'));assert.equal(summary.totalListedKm,905);assert.equal(summary.flows.reduce((n,d)=>n+d.count,0),14);assert.equal(summary.partlyOpen.length,2);
const specs=fs.readdirSync('specs').filter(f=>f.endsWith('.json'));assert.equal(specs.length,18);
const profile=JSON.parse(fs.readFileSync('data/route-profile.json'));
assert(profile.metadata.total_km>38&&profile.metadata.total_km<41);
assert.equal(profile.metadata.gaps.length,2);assert(profile.metadata.gap_m>9&&profile.metadata.gap_m<10);
assert.equal(profile.segments[0].start_km,0);
for(let i=0;i<profile.segments.length;i++){const d=profile.segments[i];assert(d.end_km>d.start_km);if(i)assert(Math.abs(d.start_km-profile.segments[i-1].end_km)<1e-9);}
assert(Math.abs(profile.segments.at(-1).end_km-profile.metadata.total_km)<1e-9);
assert.equal(summary.flows.length,7);assert(summary.flows.every(f=>f.cats.length===2));
assert.deepEqual(['0–49 km','50–99 km','100–149 km','150–199 km'].map(b=>summary.flows.filter(f=>f.cats[1]===b).reduce((n,f)=>n+f.count,0)),[6,6,1,1]);
let failures=0;
for(const file of specs){try{
 const spec=JSON.parse(fs.readFileSync(`specs/${file}`,'utf8'));inline(spec);if(spec.vconcat){for(const p of spec.vconcat)p.width=450;}else{spec.width=500;if(spec.autosize?.type!=='fit-x')spec.autosize={type:'fit',contains:'padding'};}
 const vega=spec.$schema.includes('/vega/v5')?spec:ctx.vegaLite.compile(spec).spec;
 const view=new ctx.vega.View(ctx.vega.parse(vega),{renderer:'none'});await view.runAsync();
 if(file.startsWith('02-')){await view.signal('period','Year').runAsync();assert.equal(view.signal('period'),'Year');}
 if(file.startsWith('09-')||file.startsWith('10-')){await view.signal('surface','Sealed').runAsync();assert.equal(view.signal('surface'),'Sealed');}
 if(file.startsWith('03-')){const nodes=items(view),rects=nodes.filter(n=>n.mark?.marktype==='rect'&&n.datum?.state),labels=nodes.filter(n=>n.mark?.marktype==='text'&&n.datum?.state);let minimum=100;for(const r of rects){const t=labels.find(t=>t.datum.state===r.datum.state&&t.datum.year===r.datum.year);minimum=Math.min(minimum,contrast(r.fill,t.fill));}assert(minimum>=4.5);console.log('CHECK heatmap minimum text contrast',minimum.toFixed(2)+':1');}
 if(file.startsWith('02-')){for(const period of ['Week','Month','Year']){await view.signal('period',period).runAsync();assert.deepEqual([...view.scale('color').domain()],{Week:[10,22],Month:[20,34],Year:[30,43]}[period]);const nodes=items(view),regions=nodes.filter(n=>n.mark?.marktype==='shape'&&n.datum?.properties?.state),labels=nodes.filter(n=>n.mark?.marktype==='text'&&n.datum?.state);for(const t of labels){const region=regions.find(r=>r.datum.properties.state===t.datum.state);assert(contrast(t.fill,t.datum.state==='ACT'?'#f7f5ed':region.fill)>=4.5);}}}
 if(file.startsWith('09-')){const land=items(view).filter(n=>n.mark?.marktype==='shape'&&n.datum?.properties?.state);assert(land.length>=8);const landWidth=Math.max(...land.map(n=>n.bounds.x2))-Math.min(...land.map(n=>n.bounds.x1));assert(landWidth>180,'Australia must occupy a useful width rather than shrinking to a global polygon complement');let b=items(view).filter(n=>n.mark?.marktype==='symbol'&&n.datum?.km);assert.equal(b.length,5);assert(b.every(n=>n.opacity===.85));await view.signal('highlight','Murray to Mountains').runAsync();b=items(view).filter(n=>n.mark?.marktype==='symbol'&&n.datum?.km);assert.equal(b.filter(n=>n.opacity===1).length,1);}
 if(file.startsWith('11-')){const dots=items(view).filter(n=>n.mark?.marktype==='symbol'&&n.datum?.short_name);assert.equal(dots.length,14);assert.deepEqual(dots.map(n=>n.datum.km).sort((a,b)=>a-b),trails.map(t=>t.km).sort((a,b)=>a-b));assert.deepEqual(['Sealed','Mixed','Unsealed'].map(g=>dots.filter(n=>n.datum.surface_group===g).length),[5,5,4]);assert(dots.every(n=>n.opacity===1));await view.width(330).runAsync();const smallDots=items(view).filter(n=>n.mark?.marktype==='symbol'&&n.datum?.short_name);assert.equal(smallDots.length,14);assert(smallDots.every(n=>Number.isFinite(n.x)&&Number.isFinite(n.y)));}
 if(file.startsWith('07-')){const cells=items(view).filter(n=>n.mark?.marktype==='rect'&&n.datum?.cell);assert.equal(cells.length,100);assert(Math.abs(Math.max(...cells.map(n=>n.y+n.height))-Math.min(...cells.map(n=>n.y))-view.signal('plot'))<.01,'Waffle grid must fill its declared plot height');assert.deepEqual(['Quiet','Direct','Never'].map(g=>cells.filter(n=>n.datum.group===g).length),[69,22,9]);}
 if(file.startsWith('17-')){const points=items(view).filter(n=>n.mark?.marktype==='symbol'&&n.datum?.km);assert.equal(points.length,9);const north=points.find(n=>n.datum.short_name==='Northern Rivers'),south=points.find(n=>n.datum.short_name==='North-East Tasmania');assert(Math.hypot(north.x-south.x,north.y-south.y)>90,'Eastern inset must zoom into the selected locations');assert(points.every(n=>['#245646','#a4482f','#806926'].includes(n.stroke)));await view.signal('surface','Sealed').runAsync();assert.equal(items(view).filter(n=>n.mark?.marktype==='symbol'&&n.datum?.km).length,3);}
 if(file.startsWith('18-')){const runs=spec.layer[0].data.values;assert(Math.abs(runs.reduce((n,d)=>n+d.end_km-d.start_km,0)-profile.metadata.total_km)<1e-8);assert.equal(runs.filter(d=>d.surface==='Geometry gap').length,2);}
 if(file.startsWith('12-')){const segments=items(view).filter(n=>n.mark?.marktype==='shape'&&n.datum?.properties?.way_id);assert.equal(segments.length,94);assert.equal(new Set(segments.map(n=>n.datum.properties.surface_group)).size,3);const ends=items(view).filter(n=>n.mark?.marktype==='text'&&n.datum?.node_id);assert.deepEqual(ends.map(n=>n.text).sort(),['Lilydale','Warburton']);}
 if(file.startsWith('01-')){const lines=items(view).filter(n=>n.mark?.marktype==='line'&&n.stroke);assert.equal(new Set(lines.map(n=>n.datum.period)).size,3);assert(lines.every(n=>contrast(n.stroke,'#f7f5ed')>=3),'Trend lines must remain distinguishable from the page');}
 if(file.startsWith('05-')||file.startsWith('06-'))assert.equal(view.height(),320,'Paired demographic plots must have the same inner height');
 if(file.startsWith('08-')){assert.equal(view.height(),280);const nodes=items(view),bars=nodes.filter(n=>n.mark?.marktype==='rect'&&n.datum?.change),labels=nodes.filter(n=>n.mark?.marktype==='text'&&n.datum?.change);for(const bar of bars){const label=labels.find(n=>n.datum.year===bar.datum.year&&n.datum.change===bar.datum.change);assert(label);assert(contrast(bar.fill,label.fill)>=4.5,'Frequency percentages must remain readable');}}
 const svg=await view.toSVG();assert(svg.includes('<svg'));if(file.startsWith('04-'))assert(svg.includes('Increase')&&svg.includes('Decrease'),'Direction must be explicitly labelled');assert(!/\bNaN\b/.test(svg));
 if(file.startsWith('15-')){await view.width(330).signal('hoverFlow',0).runAsync();const small=await view.toSVG();assert(!/\bNaN\b/.test(small));assert(small.includes('150–199 km'));}

 view.finalize();console.log('PASS',file);
 }catch(e){console.error('FAIL',file,e);failures++;}}
assert.equal(failures,0,'Every chart must compile and render');
const total=fs.readdirSync('data').reduce((n,f)=>n+fs.statSync(`data/${f}`).size,0);
console.log('PASS data size:',total,'bytes; 18 specs (15 main figures, locator, eastern detail and route strip) compiled and rendered; filter signals updated.');

