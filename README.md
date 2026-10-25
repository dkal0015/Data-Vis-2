# Australia on Two Wheels

**Duveen Kalansooriya · FIT3179 Data Visualisation 2**

A single scrolling data story about Australian cycling participation and recreational rail trails. It includes **15 original Vega/Vega-Lite charts**, with three map idioms: choropleth, proportional-symbol and geographic route-line maps.

## Website

GitHub Pages address: https://dkal0015.github.io/Data-Vis-2/

## Source files

- `index.html`, `style.css`, `app.js`: narrative, layout and chart embedding.
- `specs/`: 15 main chart specifications plus a contextual map inset, each linked from the page.
- `data/`: prepared CSV/JSON tables and geographic data. Data is a dated local snapshot; no live external API is required to view charts.
- `vendor/`: local Vega 5.33.0, Vega-Lite 5.23.0, Vega-Embed 6.29.0 and their licence notices.
- `development/`: chart generation/validation and data-preparation source for reproducibility. Run `node development/refine-encodings.mjs` from repository root to regenerate the reviewed charts. Validation scripts run from repository root; preparation scripts require the original report/research inputs described in the provenance notes.
- [SUBMISSION-NOTES.md](SUBMISSION-NOTES.md): draft domain/audience/purpose and What/Why/How rationale; remaining student submission tasks.
- [DATA-PROVENANCE.md](DATA-PROVENANCE.md): trail selection, surface grouping, geometry and licensing details.

## Interactions and accessibility

The participation-map selector switches between weekly, monthly and annual recall windows. The surface selector filters the selected-trail map and ranked-length chart together. The national line-chart legend can focus a series. A pinned trail selection shows its complete name, state, surface and published length in a persistent readout. The map and heatmap share a 0–45% scale; route colours show recorded OSM way surfaces. All sections stay on the page. Source links, chart JSON, downloadable data, accessible tables and chart descriptions remain available.

## Sources

- [CWANZ / Painted Dog Research, 2025 National Walking and Cycling Participation Survey](https://www.cwanz.com.au/wp-content/uploads/2025/10/251001-CWANZ-National-Walking-and-Cycling-Participation-Survey-Report-National.pdf): revised participation series and rider preferences. Charts cite pages, bases and limitations.
- [Rail Trails Australia](https://www.railtrails.org.au/trails/): individually researched factual lengths, surfaces, status and location pins for 14 deliberately selected examples. This is not a national inventory. No RTA route artwork or geometry is included; do not label RTA content openly licensed.
- [OpenStreetMap relation 29695](https://www.openstreetmap.org/relation/29695): Lilydale–Warburton route geometry. © OpenStreetMap contributors, [ODbL 1.0](https://www.openstreetmap.org/copyright). Includes Lilydale–Warburton only, not the additional Yarra Valley branch in the separate 48 km listing.
- [Natural Earth](https://www.naturalearthdata.com/): public-domain 1:50m state boundaries.
- [Australian Sports Commission / AusPlay](https://www.ausport.gov.au/clearinghouse/research/archive/cycling): separate 2025 adult participation context; not combined with CWANZ estimates.

## AI acknowledgement

OpenAI Codex was used to support research, data preparation, narrative, implementation and Vega-Lite specifications.
