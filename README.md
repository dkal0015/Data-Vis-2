# Australia on Two Wheels

**Duveen Kalansooriya · FIT3179 Data Visualisation 2 · 15 October 2026**

A single scrolling data story about Australian cycling participation and recreational rail trails. It includes **13 original Vega-Lite charts**, with three map idioms: choropleth, proportional-symbol and geographic route-line maps.

## Website

GitHub Pages address: https://dkal0015.github.io/Data-Vis-2/

To enable publishing, use **Settings → Pages → Build and deployment → Deploy from a branch → main → / (root)**. The address above is the intended Pages address; check deployment before submitting it.

## Local preview

From this repository run `python -m http.server 8000` and open http://localhost:8000. There is no build step or package installation. Use an HTTP server because browsers restrict requests from `file://` pages.

## Source files

- `index.html`, `style.css`, `app.js`: narrative, layout and chart embedding.
- `specs/`: all 13 human-readable Vega-Lite JSON specifications, each linked from the page.
- `data/`: prepared CSV/JSON tables and geographic data. Data is a dated local snapshot; no live external API is required to view charts.
- `vendor/`: local Vega 5.33.0, Vega-Lite 5.23.0, Vega-Embed 6.29.0 and their licence notices.
- `development/`: chart generation/validation and data-preparation source for reproducibility. Chart scripts run from repository root; preparation scripts require the original report/research inputs described in the provenance notes.
- [SUBMISSION-NOTES.md](SUBMISSION-NOTES.md): draft domain/audience/purpose and What/Why/How rationale; remaining student submission tasks.
- [DATA-PROVENANCE.md](DATA-PROVENANCE.md): trail selection, surface grouping, geometry and licensing details.

## Interactions and accessibility

The participation-map selector switches between weekly, monthly and annual recall windows. The surface selector filters the selected-trail map and ranked-length chart together. The national line-chart legend can focus a series. All sections stay on the page. Source links, chart JSON, downloadable data, accessible tables and chart descriptions remain available.

## Sources

- [CWANZ / Painted Dog Research, 2025 National Walking and Cycling Participation Survey](https://www.cwanz.com.au/wp-content/uploads/2025/10/251001-CWANZ-National-Walking-and-Cycling-Participation-Survey-Report-National.pdf): revised participation series and rider preferences. Charts cite pages, bases and limitations.
- [Rail Trails Australia](https://www.railtrails.org.au/trails/): individually researched factual lengths, surfaces, status and location pins for 14 deliberately selected examples. This is not a national inventory. No RTA route artwork or geometry is included; do not label RTA content openly licensed.
- [OpenStreetMap relation 29695](https://www.openstreetmap.org/relation/29695): Lilydale–Warburton route geometry. © OpenStreetMap contributors, [ODbL 1.0](https://www.openstreetmap.org/copyright). Includes Lilydale–Warburton only, not the additional Yarra Valley branch in the separate 48 km listing.
- [Natural Earth](https://www.naturalearthdata.com/): public-domain 1:50m state boundaries.
- [Australian Sports Commission / AusPlay](https://www.ausport.gov.au/clearinghouse/research/archive/cycling): separate 2025 adult participation context; not combined with CWANZ estimates.

## AI acknowledgement

OpenAI Codex assisted with research, data preparation, narrative, implementation and Vega-Lite specifications. Duveen Kalansooriya is responsible for reviewing, adapting and understanding the submission. The page includes this acknowledgement visibly.

## Validation

Run `node development/validate.mjs` to compile/render all charts, verify selected source values and exercise filter signals. Browser checks covered desktop and mobile widths, all 13 chart renders, the annual recall-window selection and five sealed trails in the linked filter. Numerical survey estimates and source definitions should be reviewed before submission.
