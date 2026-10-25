"""Order the stored OSM corridor; retain tiny geometry gaps explicitly.
Run from repository root with the original full-relation JSON and town-query JSON.
"""
import collections, heapq, json, math, pathlib, sys
source=json.loads(pathlib.Path(sys.argv[1]).read_text(encoding='utf-8'))
town_source=json.loads(pathlib.Path(sys.argv[2]).read_text(encoding='utf-8'))
nodes={e['id']:e for e in source['elements'] if e['type']=='node'}
ways={e['id']:e for e in source['elements'] if e['type']=='way'}
relation=next(e for e in source['elements'] if e['type']=='relation' and e['id']==29695)
def km(a,b):
    p,q=nodes[a],nodes[b];la,lb=map(math.radians,[p['lat'],q['lat']]);dl=math.radians(q['lat']-p['lat']);do=math.radians(q['lon']-p['lon'])
    return 6371.0088*2*math.asin(min(1,math.sqrt(math.sin(dl/2)**2+math.cos(la)*math.cos(lb)*math.sin(do/2)**2)))
adj=collections.defaultdict(list)
for member in relation['members']:
    if member['type']!='way':continue
    w=ways[member['ref']]
    for a,b in zip(w['nodes'],w['nodes'][1:]):
        d=km(a,b);adj[a].append((b,d,w['id']));adj[b].append((a,d,w['id']))
component={};components=[]
for n in adj:
    if n in component:continue
    i=len(components);part={n};component[n]=i;todo=[n]
    while todo:
        for other,_,_ in adj[todo.pop()]:
            if other not in part:part.add(other);component[other]=i;todo.append(other)
    components.append(part)
terminals=[n for n in adj if len(adj[n])==1]
parent=list(range(len(components)))
def find(x):
    while parent[x]!=x:x=parent[x]
    return x
gaps=[]
for d,a,b in sorted((km(a,b),a,b) for i,a in enumerate(terminals) for b in terminals[i+1:] if component[a]!=component[b]):
    ca,cb=find(component[a]),find(component[b])
    if ca==cb:continue
    assert d<.01,'A gap over 10 m must not be bridged by this preparation rule'
    parent[cb]=ca;gaps.append({'from_node':a,'to_node':b,'length_m':d*1000})
    adj[a].append((b,d,None));adj[b].append((a,d,None))
start,end=634093804,4383369108
distance={start:0};previous={};queue=[(0,start)]
while queue:
    d,n=heapq.heappop(queue)
    if d!=distance[n]:continue
    if n==end:break
    for other,length,way in adj[n]:
        candidate=d+length
        if candidate<distance.get(other,float('inf')):distance[other]=candidate;previous[other]=(n,length,way);heapq.heappush(queue,(candidate,other))
assert end in previous
path=[];n=end
while n!=start:
    p,d,w=previous[n];path.append((p,n,d,w));n=p
path.reverse();profile=[];cursor=0;vertices=[(start,0)]
for a,b,d,w in path:
    tag=ways[w].get('tags',{}).get('surface') if w else None
    group='Geometry gap' if w is None else 'Sealed' if tag in {'paved','asphalt','concrete'} else 'Unsealed' if tag in {'unpaved','dirt','gravel','fine_gravel'} else 'Not recorded'
    if profile and profile[-1]['way_id']==w:profile[-1]['end_km']=cursor+d
    else:profile.append({'start_km':cursor,'end_km':cursor+d,'surface':group,'surface_tag':tag or ('gap' if w is None else 'not recorded'),'way_id':w})
    cursor+=d;vertices.append((b,cursor))
towns=[]
for town in town_source['elements']:
    nearest,chainage=min(vertices,key=lambda v:(nodes[v[0]]['lon']-town['lon'])**2*math.cos(math.radians(town['lat']))**2+(nodes[v[0]]['lat']-town['lat'])**2)
    p=nodes[nearest]
    towns.append({'name':town['tags']['name'],'lon':town['lon'],'lat':town['lat'],'route_lon':p['lon'],'route_lat':p['lat'],'km':chainage,'osm_place_id':town['id'],'place_search_url':town.get('source_url','https://nominatim.openstreetmap.org/'),'kind':'Town centre; strip marker uses nearest mapped route vertex'})
metadata={'source':'OpenStreetMap relation 29695, geometry snapshot 15 October 2026','licence':'ODbL 1.0','attribution':'OpenStreetMap contributors','method':'Shortest node-edge path between explicit mapped termini, with two sub-10 m geometry gaps included as straight-distance allowances. Haversine edge lengths; branches off this path excluded. Town strip positions use nearest path vertex to the mapped town centre. Approximate cartographic chainage, not surveyed riding distance.','total_km':cursor,'gap_m':sum(g['length_m'] for g in gaps),'gaps':gaps,'town_query_date':'2026-10-25'}
pathlib.Path('data/route-profile.json').write_text(json.dumps({'metadata':metadata,'segments':profile,'towns':towns},ensure_ascii=False,indent=2),encoding='utf-8')
print('Route km',round(cursor,3),'gap metres',round(metadata['gap_m'],2),'segments',len(profile),'towns',[(t['name'],round(t['km'],1)) for t in towns])
