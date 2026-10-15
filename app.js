'use strict';
const chartList=[['chart-map','02-participation-map'],['chart-trend','01-national-trend'],['chart-heatmap','03-state-heatmap'],['chart-change','04-state-change'],['chart-age','05-age'],['chart-gender','06-gender'],['chart-quiet','07-quiet-routes'],['chart-frequency','08-frequency'],['chart-trail-map','09-trail-map'],['chart-lengths','10-trail-lengths'],['chart-boxplot','11-trail-boxplot'],['chart-route','12-route-map'],['chart-scatter','13-reach-routine']];
const views=new Map();
window.chartStatus={ready:0,errors:[]};
async function draw(id,name){
 const el=document.getElementById(id);el.innerHTML='<p class="loading">Drawing the data…</p>';
 try{
  const response=await fetch(`specs/${name}.json`);if(!response.ok)throw new Error(`Chart source: ${response.status}`);
  const spec=await response.json();
  // Keep national maps legible on narrow screens while preserving their aspect.
  if(['chart-map','chart-trail-map'].includes(id)) spec.height=Math.max(270,Math.min(spec.height,el.clientWidth*.8));
  if(id==='chart-route') spec.height=Math.max(210,Math.min(380,el.clientWidth*.6));
  if(id==='chart-lengths'&&el.clientWidth<450){for(const layer of spec.layer){if(layer.encoding?.y?.axis)layer.encoding.y.axis.labelLimit=135;}}
  const result=await vegaEmbed(el,spec,{actions:false,renderer:'svg',tooltip:{theme:'light'}});
  views.set(id,result.view);
  if(id==='chart-map')await result.view.signal('period',document.getElementById('period').value).runAsync();
  if(['chart-trail-map','chart-lengths'].includes(id))await result.view.signal('surface',document.getElementById('surface').value).runAsync();
  window.chartStatus.ready++;
 }catch(err){window.chartStatus.errors.push({id,message:err.message});el.innerHTML='<p class="chart-error">This chart could not load. Reload the page, or use the chart JSON and data downloads below.</p>';console.error(id,err);}
}
document.getElementById('period').addEventListener('change',async e=>{const v=views.get('chart-map');if(v)await v.signal('period',e.target.value).runAsync();});
let trailData=[];
document.getElementById('surface').addEventListener('change',async e=>{const value=e.target.value;await Promise.all(['chart-trail-map','chart-lengths'].map(id=>views.get(id)?.signal('surface',value).runAsync()));const n=trailData.filter(t=>value==='All'||t.surface_group===value).length;document.getElementById('trail-count').textContent=`${n} of 14 selected listings`;});
function cell(text,tag='td'){const el=document.createElement(tag);el.textContent=text;return el;}
async function setupData(){
 trailData=await(await fetch('data/trails.json')).json();
 const tbody=document.getElementById('trail-table');
 for(const t of trailData){const tr=document.createElement('tr');const td=document.createElement('td');const a=document.createElement('a');a.href=t.url;a.textContent=t.name;a.target='_blank';a.rel='noopener';td.append(a);tr.append(td,...[t.state,t.km,t.surface_group,t.status.replace('Trail ','')].map(v=>cell(v)));tbody.append(tr);}
 await updateTable('participation');
}
async function updateTable(name){
 const data=await(await fetch(`data/${name}.json`)).json();const cols=Object.keys(data[0]).filter(k=>!['coordinate_note','lon','lat','url','accessed','short_name'].includes(k));
 const table=document.createElement('table'),head=document.createElement('thead'),hr=document.createElement('tr'),body=document.createElement('tbody');
 for(const k of cols){const th=cell(k.replaceAll('_',' '),'th');th.scope='col';hr.append(th);}head.append(hr);
 for(const row of data){const tr=document.createElement('tr');for(const k of cols)tr.append(cell(row[k]));body.append(tr);}table.append(head,body);document.getElementById('accessible-data').replaceChildren(table);
}
document.getElementById('table-dataset').addEventListener('change',e=>updateTable(e.target.value));
// Render every chart on load: all story sections remain visible and searchable.
Promise.all(chartList.map(([id,name])=>draw(id,name))).then(()=>{document.documentElement.dataset.chartsReady=String(window.chartStatus.ready);});
setupData().catch(console.error);
let resizeTimer;window.addEventListener('resize',()=>{clearTimeout(resizeTimer);resizeTimer=setTimeout(()=>{for(const v of views.values())v.resize().runAsync();},150);});
