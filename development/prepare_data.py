import json, csv, re, pathlib, argparse
from pypdf import PdfReader
parser=argparse.ArgumentParser();parser.add_argument('report',help='Path to the CWANZ 2025 national PDF');args=parser.parse_args()
root=pathlib.Path('data')
report=PdfReader(args.report)
states=['AUS','NSW','QLD','VIC','WA','ACT','SA','NT','TAS']
records=[]
year=None
for line in report.pages[126].extract_text().splitlines():
    m=re.match(r'(?:(20\d\d) )?(Week|Month|Year) ([\d. ]+)$',line.strip())
    if not m: continue
    if m[1]: year=int(m[1])
    values=list(map(float,m[3].split()))
    assert len(values)==9
    records += [dict(year=year,period=m[2],state=s,rate=v) for s,v in zip(states,values)]
assert len(records)==162
def save(name,data):
    (root/(name+'.json')).write_text(json.dumps(data,indent=2),encoding='utf-8')
    if isinstance(data,list) and data:
        with (root/(name+'.csv')).open('w',newline='',encoding='utf-8') as f:
            w=csv.DictWriter(f,fieldnames=list(data[0]));w.writeheader();w.writerows(data)
save('participation',records)
genders=[]; year=None
for line in report.pages[129].extract_text().splitlines():
    m=re.match(r'(?:(20\d\d) )?(Week|Month|Year) ([\d. ]+)$',line.strip())
    if not m: continue
    if m[1]:year=int(m[1])
    values=list(map(float,m[3].split()))
    genders += [dict(year=year,period=m[2],gender=s,rate=v) for s,v in zip(['Male','Female'],values)]
save('gender',genders)
save('age',[dict(age=a,rate=v,order=i) for i,(a,v) in enumerate(zip(['2â€“4','5â€“9','10â€“17','18â€“24','25â€“29','30â€“39','40â€“49','50â€“59','60â€“69','70â€“79','80+'],[31.7,37.1,25.2,7.4,9.3,14.8,12.6,13.4,10.9,8.4,6.5]))])
save('riding-style',[dict(style=a,rate=v,order=i) for i,(a,v) in enumerate(zip(['Prefer paths or quiet streets','Prefer the most direct route','Would never ride on a road'],[69,22,9]))])
save('frequency',[dict(year=y,change=k,rate=v,order=i) for y,vs in [(2021,[47.9,32.9,19.2]),(2023,[34.0,43.2,22.9]),(2025,[35.0,50.2,14.8])] for i,(k,v) in enumerate(zip(['Less often','About the same','More often'],vs))])
# Public-domain Natural Earth boundaries. Restore Australian abbreviations.
j=json.loads((root/'states.geojson').read_text())
ab={'Western Australia':'WA','Northern Territory':'NT','South Australia':'SA','Queensland':'QLD','Tasmania':'TAS','Victoria':'VIC','Australian Capital Territory':'ACT','New South Wales':'NSW'}
j['features']=[f for f in j['features'] if f['properties']['name'] in ab]
for f in j['features']:
    s=ab[f['properties']['name']];f['properties']['state']=s
    for p in ['Week','Month','Year']:
        f['properties'][p]=next(r['rate'] for r in records if r['year']==2025 and r['state']==s and r['period']==p)
(root/'states.geojson').write_text(json.dumps(j,separators=(',',':')),encoding='utf-8')
trails=json.loads(pathlib.Path('data/trails.json').read_text(encoding='utf-8'))
for t in trails:
    parts={s.strip().lower() for s in t['surface'].split(',')}
    sealed={'sealed','asphalt','bitumen','concrete'}
    t['surface_group']='Sealed' if parts<=sealed else 'Mixed' if parts&sealed else 'Unsealed'
    t['short_name']=t['name'].replace(' Rail Trail','').replace(' Heritage Trail','').replace('Railway Reserves','Railway Reserves').replace('Riverina Highlands (Tumbarumba)','Tumbarumba').replace('North-West Tasmanian Coastal Pathway','NW Tasmanian Coastal Pathway')
save('trails',trails)
print('Data written:',len(records),'participation rows;',len(trails),'selected trails')
