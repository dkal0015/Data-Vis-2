"""Derive surface segments and verified mapped ends from the saved OSM full relation.
Run from repository root: python development/prepare-route-details.py PATH_TO_OSM_JSON
Input snapshot: https://www.openstreetmap.org/api/0.6/relation/29695/full.json
"""
import collections, json, pathlib, sys
source=json.loads(pathlib.Path(sys.argv[1]).read_text(encoding='utf-8'))
nodes={e['id']:e for e in source['elements'] if e['type']=='node'}
ways={e['id']:e for e in source['elements'] if e['type']=='way'}
relation=next(e for e in source['elements'] if e['type']=='relation' and e['id']==29695)
degree=collections.Counter();features=[]
for member in relation['members']:
    if member['type']!='way' or member['ref'] not in ways:continue
    way=ways[member['ref']];degree[way['nodes'][0]]+=1;degree[way['nodes'][-1]]+=1
    tag=way.get('tags',{}).get('surface')
    group='Sealed' if tag in {'asphalt','concrete','paved','paving_stones','concrete:plates','concrete:lanes'} else 'Unsealed' if tag in {'unpaved','dirt','gravel','fine_gravel','compacted','ground','earth','grass','sand','woodchips'} else 'Not recorded'
    features.append({'type':'Feature','id':way['id'],'properties':{'name':'Lilydale–Warburton Rail Trail','way_id':way['id'],'surface_tag':tag or 'not recorded','surface_group':group,'source':'OpenStreetMap relation 29695, snapshot 15 October 2026'},'geometry':{'type':'LineString','coordinates':[[nodes[n]['lon'],nodes[n]['lat']] for n in way['nodes']]}})
ends=[]
for town,node_id in [('Lilydale',634093804),('Warburton',4383369108)]:
    assert degree[node_id]==1, 'A mapped endpoint must be a degree-one terminal node'
    node=nodes[node_id]
    assert any(node_id in [ways[m['ref']]['nodes'][0],ways[m['ref']]['nodes'][-1]] for m in relation['members'] if m['type']=='way' and m['ref'] in ways)
    ends.append({'town':town,'label':town+' mapped end','node_id':node_id,'lon':node['lon'],'lat':node['lat'],'role':'Mapped relation terminus, not a certified navigation trailhead','verification':'Degree-one node in relation member-way topology; relation from/to towns agree with the Rail Trails Australia trail guide','checked':'2026-10-25','source_url':f'https://www.openstreetmap.org/node/{node_id}'})
assert relation['tags']['from']=='Lilydale' and relation['tags']['to']=='Warburton'
metadata={'source_url':'https://www.openstreetmap.org/relation/29695','snapshot_date':'2026-10-15','verification_date':'2026-10-25','licence':'ODbL 1.0','attribution':'© OpenStreetMap contributors','classification':'Way-level surface tags: paved/asphalt/concrete = Sealed; unpaved/dirt/gravel/fine_gravel = Unsealed. Missing or unsupported tags are Not recorded. These are community records, not a current surface inspection.','way_count':len(features),'surface_counts':dict(collections.Counter(f['properties']['surface_group'] for f in features))}
root=pathlib.Path('data')
(root/'route-segments.geojson').write_text(json.dumps({'type':'FeatureCollection','metadata':metadata,'features':features},ensure_ascii=False,separators=(',',':')),encoding='utf-8')
(root/'route-endpoints.json').write_text(json.dumps(ends,ensure_ascii=False,indent=2),encoding='utf-8')
print(metadata['surface_counts'], 'and two topologically verified termini saved')
