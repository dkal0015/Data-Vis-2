import urllib.request,json,pathlib
u='https://raw.githubusercontent.com/nvkelso/natural-earth-vector/master/geojson/ne_50m_admin_1_states_provinces.geojson'
j=json.load(urllib.request.urlopen(u))
f=[x for x in j['features'] if x['properties'].get('admin')=='Australia']
print([(x['properties'].get('name'),x['properties'].get('postal')) for x in f],flush=True)
for x in f:
 x['properties']={'name':x['properties']['name'],'state':x['properties']['postal']}
# Natural Earth supplies clockwise exterior rings; retain their winding for Vega.
pathlib.Path('data/states.geojson').write_text(json.dumps({'type':'FeatureCollection','features':f},separators=(',',':')))
