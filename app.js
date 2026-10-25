'use strict';
const chartList=[['chart-trail-map','09-trail-map'],['chart-trail-inset','17-eastern-trail-inset'],['chart-lengths','10-trail-lengths'],['chart-treemap','14-trail-treemap'],['chart-alluvial','15-trail-alluvial'],['chart-length-distribution','11-trail-grouped-dots'],['chart-map','02-participation-map'],['chart-trend','01-national-trend'],['chart-heatmap','03-state-heatmap'],['chart-change','04-state-change'],['chart-age','05-age'],['chart-gender','06-gender'],['chart-quiet','07-quiet-routes'],['chart-frequency','08-frequency'],['chart-locator','16-route-locator'],['chart-route','12-route-map'],['chart-route-profile','18-route-surface-strip'],['chart-scatter','13-reach-routine']];
const views=new Map();
const nativeViews=new Set();
let lockedFocus='',currentFocus='';
window.chartStatus={ready:0,errors:[]};
async function draw(id,name){
 const el=document.getElementById(id);el.innerHTML='<p class="loading">Drawing the data…</p>';
 try{
  const response=await fetch(`specs/${name}.json?rev=20261025-layout-polish-final3`);if(!response.ok)throw new Error(`Chart source: ${response.status}`);
  const spec=await response.json();
  const native=spec.$schema.includes('/vega/v5');
  if(native){spec.width=el.clientWidth;spec.height=id==='chart-alluvial'?360:id==='chart-quiet'?(el.clientWidth<450?300:360):440;nativeViews.add(id);}
  // Keep national maps legible on narrow screens while preserving their aspect.
  if(['chart-map','chart-trail-map','chart-trail-inset'].includes(id)) spec.height=Math.max(270,Math.min(spec.height,el.clientWidth*.8));
  if(id==='chart-map'&&el.clientWidth<500)spec.layer[1].transform[0].calculate='datum.state';
  if(id==='chart-route'){spec.height=el.clientWidth<500?170:240;if(el.clientWidth<500)for(const layer of spec.layer.slice(7))if(layer.data?.values)layer.data.values=layer.data.values.filter(d=>d.name!=='Yarra Junction');}
  if(id==='chart-lengths'&&el.clientWidth<450){for(const layer of spec.layer){if(layer.encoding?.y?.axis)layer.encoding.y.axis.labelLimit=140;}}
  const result=await vegaEmbed(el,spec,{mode:native?'vega':'vega-lite',actions:false,renderer:'svg',tooltip:{theme:'light'}});
  views.set(id,result.view);
  if(id==='chart-map')await result.view.signal('period',document.getElementById('period').value).runAsync();
  if(['chart-trail-map','chart-trail-inset','chart-lengths'].includes(id))await result.view.signal('surface',document.getElementById('surface').value).runAsync();
  if(['chart-trail-map','chart-trail-inset','chart-lengths','chart-treemap'].includes(id)){
   result.view.addEventListener('mouseover',(_event,item)=>{if(!lockedFocus&&item?.datum?.short_name)setHighlight(item.datum.short_name);});
   result.view.addEventListener('click',(_event,item)=>{if(item?.datum?.short_name){lockedFocus=lockedFocus===item.datum.short_name?'':item.datum.short_name;document.getElementById('trail-focus').value=lockedFocus;setHighlight(lockedFocus);updateTrailReadout();}});
   el.addEventListener('mouseleave',()=>setHighlight(lockedFocus));
  }
  window.chartStatus.ready++;
 }catch(err){window.chartStatus.errors.push({id,message:err.message});el.innerHTML='<p class="chart-error">This chart could not load. Reload the page, or use the chart JSON and data downloads below.</p>';console.error(id,err);}
}
document.getElementById('period').addEventListener('change',async e=>{const v=views.get('chart-map');if(v)await v.signal('period',e.target.value).runAsync();updateMapSummary();});
let trailData=[];
let participationData=[];
function updateMapSummary(){const period=document.getElementById('period').value;const selected=participationData.filter(d=>d.year===2025&&d.period===period&&d.state!=='AUS').sort((a,b)=>b.rate-a.rate);if(!selected.length)return;const national=participationData.find(d=>d.year===2025&&d.period===period&&d.state==='AUS');document.getElementById('map-summary').textContent=`Last ${period.toLowerCase()}: ${selected[0].state} ${selected[0].rate.toFixed(1)}% (highest), ${selected.at(-1).state} ${selected.at(-1).rate.toFixed(1)}% (lowest); national ${national.rate.toFixed(1)}%. Colour range: ${{Week:"10–22",Month:"20–34",Year:"30–43"}[period]}%; rescaled for each window.`;}
document.getElementById('surface').addEventListener('change',async e=>{const value=e.target.value;await Promise.all(['chart-trail-map','chart-trail-inset','chart-lengths'].map(id=>views.get(id)?.signal('surface',value).runAsync()));const n=trailData.filter(t=>value==='All'||t.surface_group===value).length;document.getElementById('trail-count').textContent=`${n} of 14 selected listings`;for(const option of document.getElementById('trail-focus').options){const trail=trailData.find(t=>t.short_name===option.value);option.disabled=!!trail&&value!=='All'&&trail.surface_group!==value;}lockedFocus='';document.getElementById('trail-focus').value='';await setHighlight('');updateTrailReadout();});
async function setHighlight(name){if(name===currentFocus)return;currentFocus=name;await Promise.all(['chart-trail-map','chart-trail-inset','chart-lengths','chart-treemap'].map(id=>views.get(id)?.signal('highlight',name).runAsync()));}
function updateTrailReadout(){const t=trailData.find(t=>t.short_name===lockedFocus);document.getElementById('trail-readout').textContent=t?`Selected listing: ${t.name} — ${t.state} · ${t.km} listed km · ${t.surface_group} · ${t.status.replace('Trail ','')}.`:'Choose a trail to read its full name, surface and published length. Hover to preview a highlight; click or use the selector to keep it selected.';}
document.getElementById('trail-focus').addEventListener('change',e=>{lockedFocus=e.target.value;setHighlight(lockedFocus);updateTrailReadout();});
function cell(text,tag='td'){const el=document.createElement(tag);el.textContent=text;return el;}
async function setupData(){
 trailData=await(await fetch('data/trails.json')).json();
 participationData=await(await fetch('data/participation.json')).json();updateMapSummary();
 const focus=document.getElementById('trail-focus');for(const t of [...trailData].sort((a,b)=>a.short_name.localeCompare(b.short_name))){const option=document.createElement('option');option.value=t.short_name;option.textContent=t.short_name;focus.append(option);}
 const tbody=document.getElementById('trail-table');
 for(const t of trailData){const tr=document.createElement('tr');const td=document.createElement('td');const a=document.createElement('a');a.href=t.url;a.textContent=t.name;a.target='_blank';a.rel='noopener';td.append(a);tr.append(td,...[t.state,t.km,t.surface_group,t.status.replace('Trail ','')].map(v=>cell(v)));tbody.append(tr);}
 await updateTable('participation');
}
async function updateTable(name){
 let data;if(name==='trail-combinations'){const summary=await(await fetch('data/trail-summary.json')).json();data=summary.flows.map(f=>({surface:f.cats[0],length_band:f.cats[1],listings:f.count,trails:f.names}));}else data=await(await fetch(`data/${name}.json`)).json();const cols=Object.keys(data[0]).filter(k=>!['coordinate_note','lon','lat','url','accessed','short_name','order'].includes(k));
 const table=document.createElement('table'),head=document.createElement('thead'),hr=document.createElement('tr'),body=document.createElement('tbody');
 for(const k of cols){const th=cell(k.replaceAll('_',' '),'th');th.scope='col';hr.append(th);}head.append(hr);
 for(const row of data){const tr=document.createElement('tr');for(const k of cols)tr.append(cell(row[k]));body.append(tr);}table.append(head,body);document.getElementById('accessible-data').replaceChildren(table);
}
document.getElementById('table-dataset').addEventListener('change',e=>updateTable(e.target.value));
// Render every chart on load: all story sections remain visible and searchable.
Promise.all(chartList.map(([id,name])=>draw(id,name))).then(()=>{document.documentElement.dataset.chartsReady=String(window.chartStatus.ready);});
setupData().catch(console.error);
let resizeTimer;window.addEventListener('resize',()=>{clearTimeout(resizeTimer);resizeTimer=setTimeout(()=>{for(const [id,v] of views){if(nativeViews.has(id))v.width(document.getElementById(id).clientWidth);v.resize().runAsync();}},150);});
