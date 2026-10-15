# FIT3179 submission notes — draft for Duveen Kalansooriya

## Domain, audience and purpose

**Domain:** Cycling participation and recreational rail trails in Australia.

**Who:** An Australian general audience, including occasional riders considering recreational cycling. The page avoids requiring specialist cycling or statistical knowledge; unfamiliar boxplot components are explained.

**Why:** Compare the geographic distribution of participation, investigate the claim that cycling is growing, identify differences among population groups, and connect rider preferences with the variety of recreational trail options. The evidence supports an uneven recovery and stable national weekly participation, rather than a blanket growth claim.

## What: the data

1. **CWANZ / Painted Dog Research — National Walking and Cycling Participation Survey 2025.** Public report: https://www.cwanz.com.au/wp-content/uploads/2025/10/251001-CWANZ-National-Walking-and-Cycling-Participation-Survey-Report-National.pdf. Participation by state/year/window was extracted from p. 127; gender from p. 130; age from p. 51; riding frequency from p. 60; riding style from p. 76. Historical participation uses the revised values published in the 2025 report. Values are weighted survey estimates, not counts from trail counters. Some report bases vary, and these are retained in the citations. Age chart omits the national and 'prefer not to say' rows to display the substantive age bands.
2. **Rail Trails Australia.** Fourteen chosen public listings, researched 15 October 2026. The selection covers six states and a variety of lengths and surfaces. Exact page URLs and status are retained per row. Headline length is not always a continuous open ride length. Surface groups are derived from factual surface tags: sealed materials only, unsealed materials only, or both. No kilometre shares are inferred. This is a purposefully selected illustrative sample; do not make state totals or representativeness claims from it. No RTA geometry, prose descriptions, map artwork or photographs are reproduced.
3. **OpenStreetMap.** Official API for https://www.openstreetmap.org/relation/29695, retrieved 15 October 2026. Relation version 75, edited 5 October 2026. Original node coordinates from 94 member ways are converted to a MultiLineString with no invented connecting segments. This covers Lilydale–Warburton only, whereas the separate RTA 48 km listing includes the additional Yarra Valley branch. ODbL notice and source link are displayed and the GeoJSON remains available under ODbL.
4. **Natural Earth.** Public-domain state/territory boundaries at 1:50m. Australia features are filtered from the admin-1 GeoJSON, postal abbreviations standardised, and 2025 participation attributes joined by state. Jervis Bay is omitted as it has no separate survey estimate. Boundary geometry is cartographic, not a survey/cadastral representation.
5. **Australian Sports Commission / AusPlay.** https://www.ausport.gov.au/clearinghouse/research/archive/cycling. A separate 2025 adult cycling estimate provides context. Its sport/physical activity definition and population differ, so it is not combined with the travel survey or plotted as a comparable time point.

## How: marks, channels and tasks

| Figure | Idiom and encoding | Reader task and design rationale |
|---|---|---|
| 1 | Choropleth: state area, sequential colour | Locate high/low population participation rates. Equal-area conic projection; constant 10–45% colour domain across recall windows; ACT label offset. |
| 2 | Multi-line chart: year position, rate height, colour | Follow national survey history. Zero baseline; distinct recall windows; legend focus. Recall windows overlap and are not additive. |
| 3 | Heatmap: year × jurisdiction, colour and numeric labels | Compare many state/year values compactly with a common 0–30% scale. |
| 4 | Diverging bars: signed length from zero | Compare the direction and size of recent change, in percentage points. Does not label all differences statistically significant. |
| 5 | Lollipop: age order and common rate position | Compare age groups and identify the childhood/young-adult contrast. A dashed line supplies the national reference. It is not a tracked cohort. |
| 6 | Dumbbell: paired positions joined within recall window | Compare source-reported male/female rates within each gender population. |
| 7 | Waffle: 100 equal cells, colour category | Communicate a 69/22/9 split in riding preferences in an approachable form. One cell is one percentage point, not one respondent. |
| 8 | Stacked composition: common 0–100% scale and colour | Compare the balance of more/same/less riding across survey waves. Different respondents each wave. |
| 9 | Proportional-symbol map: location, symbol area and surface colour | Locate selected trail examples; compare listed lengths without confusing larger land areas with more trails. |
| 10 | Ranked horizontal bars: common length baseline and surface colour | Compare individual published listing lengths and filter surface categories. Long labels are shortened only on the chart; complete names remain in tooltips/table. |
| 11 | Boxplots with all observed dots | Compare distributions within this selection. Explain median, middle half and whiskers; avoid population inference from the small selected groups. |
| 12 | Geographic line map: actual route geometry | Inspect a route corridor at local scale. Mercator is suitable for this small extent; north is up. This is not navigation. |
| 13 | Scatterplot with direct labels: annual vs weekly rate | Compare occasional reach with weekly routine. Truncated axes are explicitly disclosed; association is not a causal claim. |

## Munzner What / Why / How

**What:** Geographic regions/routes, quantitative rates/lengths, ordered years/age groups, nominal states/surfaces/gender, and route geometry. Data is aggregated survey and published geographic/listing information.

**Why:** Present a coherent narrative; compare, rank, locate, identify trends and inspect a geographic detail. The main task is communication for the public, not expert open-ended analysis.

**How:** A single scrolling page, four chapters, restrained green/rust palette, serif chapter headings, aligned figures, direct numeric annotations, source-level captions and limited meaningful interactions. The two national maps use equal-area conic projection; the local route uses Mercator. Symbol size represents area, not radius. Rates and raw lengths remain separate. Controls alter chart elements without swapping major page sections. All maps/charts use original Vega-Lite JSON.

## Technical delivery and validation

- 13 chart panels and three map idioms: choropleth, proportional symbols and route lines.
- More than two substantive sources; local data and libraries, with no live API requests required to view charts.
- Readable chart JSON in `specs/`; prepared CSV/JSON/GeoJSON in `data/`.
- All charts compiled and rendered in Vega; selector signals exercised. Desktop/mobile browser checks recorded during implementation.
- Responsive CSS, chart descriptions, labelled controls, visible source links, downloadable data and a keyboard-accessible data table.
- No external photographs or copied charts. The small bicycle icon is original inline SVG decoration.

## Student review and submission

- Read, adapt and understand the code and narrative before submission and the Week 12 interview. This is an AI-assisted draft, not a guarantee of any grade; the rubric requires effective advanced idioms for higher bands.
- Verify the final public GitHub Pages URL, every chart, and chart JSON access in a signed-out browser before submitting. A private Sites preview alone does not satisfy the GitHub requirement.
- Complete the supplied Moodle submission template in your own words, using this rationale as a starting point.
- The specification separately requires a hand-drawn A4 sketch and a PDF image of it. No sketch was supplied and none has been fabricated; this deliverable is intentionally excluded at your request. The brief describes penalties for a missing sketch. A digital mock-up is not a substitute under the rubric.
- The specification gives the deadline as Sunday 25 October 2026, 11:55 PM. Check Moodle for the campus timezone and any later updates.
- AI acknowledgement in the page: OpenAI Codex assisted with source research, data preparation, narrative, implementation and specifications. Adapt the acknowledgement to accurately reflect your use and the university's required format.
