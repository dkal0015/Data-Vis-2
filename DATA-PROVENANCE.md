# Trail data provenance

## Selected trail metadata

Manually researched/compiled from public Rail Trails Australia trail pages on 15 October 2026. Fourteen selected trails across six states. This is a purposive sample, not a complete inventory; do not use it to compare total state network length or trail counts. Distances are the published headline lengths and can include branches, disconnected sections or partly open networks. Surfaces retain the exact short factual source categories. No descriptions, images or designs are reproduced. Coordinates are numerical source map marker positions or one route vertex (specified per record); they are location pins, not navigation-ready trailheads.

No open licence was found for the RTA website or embedded route geometry. The [RTA terms](https://www.railtrails.org.au/terms-of-service/) reserve rights in content/data compilations and restrict reproduction beyond individual use. These researched numerical facts/brief categories should be attributed; do not describe the RTA dataset as openly licensed. No RTA geometry is included in the final site.

## Surface grouping

Paved = Asphalt, Bitumen, Concrete, Sealed. Unpaved = Coarse gravel, Fine gravel, Compacted earth. Mixed = at least one paved AND one unpaved category. Multiple unpaved categories alone are not mixed; multiple paved synonyms alone are paved. Sample groups: 5 paved, 4 unpaved, 5 mixed. Grouping is analytical and not a source-supplied label or a measure of the share of paved kilometres.

## Route geometry

Final GeoJSON is independent OpenStreetMap data for [relation 29695](https://www.openstreetmap.org/relation/29695), Lilydale-Warburton Rail Trail (Lilydale to Warburton), retrieved from the [official API](https://www.openstreetmap.org/api/0.6/relation/29695/full.json) on 15 October 2026. The relation version is 75, last edited 2026-10-05T19:25:02Z. The 94 member ways are converted into MultiLineString segments using their original node coordinates. No simplification or invented connections. This line excludes the Yarra Valley branch; the metadata's 48 km network length includes both trails.

OpenStreetMap data is licensed under [ODbL 1.0](https://opendatacommons.org/licenses/odbl/1-0/). Display **© OpenStreetMap contributors** with a link to [OpenStreetMap copyright](https://www.openstreetmap.org/copyright), and provide a link to the ODbL for the downloadable GeoJSON. The data remains ODbL. Geometry is a community mapping snapshot, not a guarantee of current access.

An initial Overpass query timed out because the server was busy; the official OSM relation API then succeeded. No ongoing API request is needed to view the website.

## Metadata sources

- [Brisbane Valley Rail Trail](https://www.railtrails.org.au/trails/brisbane-valley-rail-trail/) — 161 km; Coarse gravel, Compacted earth, Fine gravel, Sealed; Trail Open.
- [Coast to Vines Rail Trail](https://www.railtrails.org.au/trails/coast-to-vines-rail-trail/) — 37 km; Sealed; Trail Open.
- [Denmark – Nornalup Heritage Rail Trail](https://www.railtrails.org.au/trails/denmark-to-nornalup-including-wilsons-inlet-rail-trail/) — 61 km; Coarse gravel, Compacted earth, Fine gravel; Trail Partially open.
- [East Gippsland Rail Trail](https://www.railtrails.org.au/trails/east-gippsland-rail-trail/) — 96 km; Asphalt, Concrete, Fine gravel; Trail Open.
- [Kilkivan – Kingaroy Rail Trail](https://www.railtrails.org.au/trails/kilkivan-kingaroy-rail-trail/) — 89 km; Coarse gravel, Fine gravel, Sealed; Trail Open.
- [Warburton Rail Trail/Yarra Valley Trail](https://www.railtrails.org.au/trails/lilydale-to-warburton-yarra-valley-rail-trail/) — 48 km; Asphalt, Fine gravel; Trail Open.
- [Murray to Mountains Rail Trail](https://www.railtrails.org.au/trails/murray-to-mountains-rail-trail/) — 137 km; Asphalt; Trail Open.
- [North-East Tasmania Rail Trail](https://www.railtrails.org.au/trails/north-east-tasmania-rail-trail/) — 26 km; Compacted earth; Trail Open.
- [North-West Tasmanian Coastal Pathway](https://www.railtrails.org.au/trails/north-west-coastal-cycleway/) — 20 km; Asphalt, Bitumen, Concrete, Sealed; Trail Partially open.
- [Northern Rivers Rail Trail](https://www.railtrails.org.au/trails/northern-rivers-rail-trail/) — 54 km; Asphalt, Concrete, Fine gravel; Trail Open.
- [Railway Reserves Heritage Trail](https://www.railtrails.org.au/trails/railway-reserves-heritage-trail/) — 59 km; Coarse gravel, Compacted earth, Fine gravel; Trail Open.
- [Barossa Rail Trail](https://www.railtrails.org.au/trails/the-barossa-trail/) — 43 km; Sealed; Trail Open.
- [Riesling and Rattler Trails](https://www.railtrails.org.au/trails/the-riesling-and-rattler-trail/) — 53 km; Fine gravel; Trail Open.
- [Riverina Highlands (Tumbarumba) Rail Trail](https://www.railtrails.org.au/trails/tumbarumba-to-rosewood-riverina-highlands-rail-trail/) — 21 km; Sealed; Trail Open.


## Derived diagrams added in the 24 October revision

The treemap sums the 14 published listing lengths within surface groups: mixed 448, sealed 258, unsealed 199, total 905 listing-km. This is neither deduplicated nor continuous network length. The alluvial groups the same records by surface and equal 50 km length bands (0–49, 50–99, 100–149 and 150–199 km). Seven observed combinations sum to 14 listings. Ribbon widths count listings; stages do not represent changes over time. The two partly open listings are marked with a dagger in Figure 2.

The closing comparison is a derived ratio of CWANZ's rounded weekly and annual population participation rates. It is not a longitudinal estimate of retention or an individual riding frequency. The approximate 5 km map reference is calculated along latitude using 111.32 × cos(latitude) kilometres per longitude degree; it is a local cartographic reference, not a trail-distance measurement.

## Way-level surface and terminal verification — 25 October 2026

`data/route-segments.geojson` retains the 94 member ways separately, including the original `surface` tag and OSM way ID. Paved, asphalt and concrete map to Sealed; unpaved, dirt, gravel and fine_gravel map to Unsealed; missing or unsupported tags map to Not recorded. The snapshot has 19 sealed ways, 74 unsealed ways and one way without a surface tag. These are counts of ways, not proportions of route distance. No surface is inferred from the separate RTA listing or from adjacent ways. The colours describe the stored community tags, not a site inspection.

`data/route-endpoints.json` records terminal node 634093804 (Lilydale) and 4383369108 (Warburton). Both have degree one in the member-way topology and agree with the relation's from/to town tags and the [published RTA guide](https://www.railtrails.org.au/trails/lilydale-to-warburton-yarra-valley-rail-trail/). Minor side branches also have terminals, so generic minimum/maximum longitude is not used as a trailhead rule. The two selected nodes identify the mapped ends; the map labels their towns and does not certify navigation access points. Verification used the stored 15 October snapshot on 25 October; it is not a fresh field or network survey.

Reproduce these files from the original official full API JSON with `python development/prepare-route-details.py PATH_TO_OSM_FULL_JSON`, then run `node development/polish-specs.mjs` from repository root. The original snapshot location is described in the preparation script; no live API is required to view the site. All derived OSM data remains under ODbL 1.0.

## Grouped-dot replacement for Figure 5

All 14 existing published lengths are plotted directly in kilometres, in rows for sealed (5), mixed (5) and unsealed (4). No binning, smoothing or estimated density is used. Close lengths are assigned deterministic vertical offsets to prevent point overlap; horizontal positions remain unchanged and these offsets do not encode data. The 137 km sealed listing is labelled as an exception to the other four sealed examples (20, 21, 37 and 43 km). The selected sample and source limitations remain unchanged.

## Ordered route surface strip — 25 October 2026

The full relation has three connected components. Only two component joins are required; each is under 5 m. The strip preparation uses the minimum terminal-to-terminal joins only when every gap is under 10 m, retains both as explicit Geometry gap records, and uses Dijkstra's shortest path between nodes 634093804 and 4383369108. Original route geometry is not joined on the geographic map. Haversine edge lengths plus 9.53 m of explicit gap allowances yield approximately 39.482 km. Branches outside this main path are excluded. The strip merges adjacent intervals of the same surface only for display; source way intervals and tags remain in the profile data. This is cartographic chainage and cannot certify ride distance or present-day access.

Town locations were retrieved from OpenStreetMap Nominatim on 25 October 2026 for Mount Evelyn, Woori Yallock, Yarra Junction and Millgrove. The query URLs and returned centres are retained in `data/route-town-centres.json`. Map markers represent those centres. Strip positions use their nearest vertex on the ordered path and are approximate; no station or access-point coordinates are inferred. The original relation snapshot remains dated 15 October 2026. All OSM-derived data, including the profile and town centres, remains under ODbL 1.0.
