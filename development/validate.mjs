import fs from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';
const ctx=vm.createContext({console,setTimeout,clearTimeout,URL,structuredClone,performance});
for(const lib of ['vega','vega-lite'])vm.runInContext(fs.readFileSync(`vendor/${lib}.min.js`,'utf8'),ctx);
function inline(node){if(!node||typeof node!=='object')return;if(node.url?.startsWith('data/')){let d=JSON.parse(fs.readFileSync(`${node.url.split('?')[0]}`,'utf8'));if(node.format?.property)d=d[node.format.property];delete node.url;delete node.format;node.values=d;}for(const v of Object.values(node))if(typeof v==='object')inline(v);}
const data=JSON.parse(fs.readFileSync('data/participation.json'));
assert.equal(data.length,162);assert.equal(data.filter(r=>r.year===2025&&r.period==='Week'&&r.state==='AUS')[0].rate,14.9);
const trails=JSON.parse(fs.readFileSync('data/trails.json'));assert.equal(trails.length,14);
assert.deepEqual(['Sealed','Mixed','Unsealed'].map(g=>trails.filter(t=>t.surface_group===g).length),[5,5,4]);
const specs=fs.readdirSync('specs').filter(f=>f.endsWith('.json'));assert.equal(specs.length,13);
let failures=0;
for(const file of specs){try{
 const spec=JSON.parse(fs.readFileSync(`specs/${file}`,'utf8'));inline(spec);spec.width=500;spec.autosize={type:'fit',contains:'padding'};
 const {spec:vega}=ctx.vegaLite.compile(spec);
 const view=new ctx.vega.View(ctx.vega.parse(vega),{renderer:'none'});await view.runAsync();
 if(file.startsWith('02-')){await view.signal('period','Year').runAsync();assert.equal(view.signal('period'),'Year');}
 if(file.startsWith('09-')||file.startsWith('10-')){await view.signal('surface','Sealed').runAsync();assert.equal(view.signal('surface'),'Sealed');}
 const svg=await view.toSVG();assert(svg.includes('<svg'));assert(!/\bNaN\b/.test(svg));

 view.finalize();console.log('PASS',file);
 }catch(e){console.error('FAIL',file,e);failures++;}}
assert.equal(failures,0,'Every chart must compile and render');
const total=fs.readdirSync('data').reduce((n,f)=>n+fs.statSync(`data/${f}`).size,0);
console.log('PASS data size:',total,'bytes; 13 specs compiled and rendered; filter signals updated.');
