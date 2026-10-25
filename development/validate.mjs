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
const summary=JSON.parse(fs.readFileSync('data/trail-summary.json'));assert.equal(summary.totalListedKm,905);assert.equal(summary.flows.reduce((n,d)=>n+d.count,0),14);assert.equal(summary.flows.filter(d=>d.cats[2]==='Partly open').reduce((n,d)=>n+d.count,0),2);
const specs=fs.readdirSync('specs').filter(f=>f.endsWith('.json'));assert.equal(specs.length,16);
let failures=0;
for(const file of specs){try{
 const spec=JSON.parse(fs.readFileSync(`specs/${file}`,'utf8'));inline(spec);spec.width=500;spec.autosize={type:'fit',contains:'padding'};
 const vega=spec.$schema.includes('/vega/v5')?spec:ctx.vegaLite.compile(spec).spec;
 const view=new ctx.vega.View(ctx.vega.parse(vega),{renderer:'none'});await view.runAsync();
 if(file.startsWith('02-')){await view.signal('period','Year').runAsync();assert.equal(view.signal('period'),'Year');}
 if(file.startsWith('09-')||file.startsWith('10-')){await view.signal('surface','Sealed').runAsync();assert.equal(view.signal('surface'),'Sealed');}
 if(file.startsWith('03-')){const nodes=items(view),rects=nodes.filter(n=>n.mark?.marktype==='rect'&&n.datum?.state),labels=nodes.filter(n=>n.mark?.marktype==='text'&&n.datum?.state);let minimum=100;for(const r of rects){const t=labels.find(t=>t.datum.state===r.datum.state&&t.datum.year===r.datum.year);minimum=Math.min(minimum,contrast(r.fill,t.fill));}assert(minimum>=4.5);console.log('CHECK heatmap minimum text contrast',minimum.toFixed(2)+':1');}
 if(file.startsWith('02-')){for(const period of ['Week','Month','Year']){await view.signal('period',period).runAsync();const nodes=items(view),regions=nodes.filter(n=>n.mark?.marktype==='shape'&&n.datum?.properties?.state),labels=nodes.filter(n=>n.mark?.marktype==='text'&&n.datum?.state);for(const t of labels){const region=regions.find(r=>r.datum.properties.state===t.datum.state);assert(contrast(t.fill,t.datum.state==='ACT'?'#f7f5ed':region.fill)>=4.5);}}}
 if(file.startsWith('09-')){let b=items(view).filter(n=>n.mark?.marktype==='symbol'&&n.datum?.km);assert.equal(b.length,5);assert(b.every(n=>n.opacity===.68));await view.signal('highlight','Murray to Mountains').runAsync();b=items(view).filter(n=>n.mark?.marktype==='symbol'&&n.datum?.km);assert.equal(b.filter(n=>n.opacity===1).length,1);}
 if(file.startsWith('11-')){const dots=items(view).filter(n=>n.mark?.marktype==='symbol'&&n.datum?.km);assert.equal(dots.length,14);assert(dots.every(n=>n.fill==='#ffffff'&&n.stroke==='#10251d'&&n.opacity===1));}
 if(file.startsWith('12-')){const segments=items(view).filter(n=>n.mark?.marktype==='shape'&&n.datum?.properties?.way_id);assert.equal(segments.length,94);assert.equal(new Set(segments.map(n=>n.datum.properties.surface_group)).size,3);const ends=items(view).filter(n=>n.mark?.marktype==='text'&&n.datum?.node_id);assert.deepEqual(ends.map(n=>n.text).sort(),['Lilydale mapped end','Warburton mapped end']);}
 const svg=await view.toSVG();assert(svg.includes('<svg'));assert(!/\bNaN\b/.test(svg));
 if(file.startsWith('15-')){await view.width(330).signal('hoverFlow',0).runAsync();const small=await view.toSVG();assert(!/\bNaN\b/.test(small));assert(small.includes('Partly open'));}

 view.finalize();console.log('PASS',file);
 }catch(e){console.error('FAIL',file,e);failures++;}}
assert.equal(failures,0,'Every chart must compile and render');
const total=fs.readdirSync('data').reduce((n,f)=>n+fs.statSync(`data/${f}`).size,0);
console.log('PASS data size:',total,'bytes; 16 specs (15 charts + inset) compiled and rendered; filter signals updated.');

