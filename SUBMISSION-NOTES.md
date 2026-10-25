# FIT3179 submission notes — draft for Duveen Kalansooriya

The current figure inventory, encoding rationale and second review are in REVIEW.md. Use REVIEW.md for the revised figure numbers and idioms.

## Domain, audience and purpose

**Domain:** Cycling participation and recreational rail trails in Australia.

**Who:** An Australian general audience, including occasional riders considering recreational cycling. The page avoids requiring specialist cycling or statistical knowledge; Figure 5 uses one dot per selected trail on a common kilometre scale, grouped into surface rows. Slight vertical offsets keep close lengths visible and carry no data meaning.

**Why:** Compare the geographic distribution of participation, investigate the claim that cycling is growing, identify differences among population groups, and connect rider preferences with the variety of recreational trail options. The evidence supports an uneven recovery and stable national weekly participation, rather than a blanket growth claim.

## What: the data

1. **CWANZ / Painted Dog Research — National Walking and Cycling Participation Survey 2025.** Public report: https://www.cwanz.com.au/wp-content/uploads/2025/10/251001-CWANZ-National-Walking-and-Cycling-Participation-Survey-Report-National.pdf. Participation by state/year/window was extracted from p. 127; gender from p. 130; age from p. 51; riding frequency from p. 60; riding style from p. 76. Historical participation uses the revised values published in the 2025 report. Values are weighted survey estimates, not counts from trail counters. Some report bases vary, and these are retained in the citations. Age chart omits the national and 'prefer not to say' rows to display the substantive age bands.
2. **Rail Trails Australia.** Fourteen chosen public listings, researched 15 October 2026. The selection covers six states and a variety of lengths and surfaces. Exact page URLs and status are retained per row. Headline length is not always a continuous open ride length. Surface groups are derived from factual surface tags: sealed materials only, unsealed materials only, or both. No kilometre shares are inferred. This is a purposefully selected illustrative sample; do not make state totals or representativeness claims from it. No RTA geometry, prose descriptions, map artwork or photographs are reproduced.
3. **OpenStreetMap.** Official API for https://www.openstreetmap.org/relation/29695, retrieved 15 October 2026. Relation version 75, edited 5 October 2026. Original node coordinates from 94 member ways are retained in a MultiLineString and a separate per-way surface GeoJSON with no invented connecting segments. Recorded way tags classify 74 ways as unsealed, 19 as sealed and one as not recorded; these counts are not distance shares. Named mapped ends use explicit terminal IDs checked on 25 October 2026 against the stored topology and published guide. These are not certified access points or current surface inspections. This covers Lilydale–Warburton only, whereas the separate RTA 48 km listing includes the additional Yarra Valley branch. ODbL notice and source link are displayed and the GeoJSON remains available under ODbL.
4. **Natural Earth.** Public-domain state/territory boundaries at 1:50m. Australia features are filtered from the admin-1 GeoJSON, postal abbreviations standardised, and 2025 participation attributes joined by state. Jervis Bay is omitted as it has no separate survey estimate. Boundary geometry is cartographic, not a survey/cadastral representation.
5. **Australian Sports Commission / AusPlay.** https://www.ausport.gov.au/clearinghouse/research/archive/cycling. A separate 2025 adult cycling estimate provides context. Its sport/physical activity definition and population differ, so it is not combined with the travel survey or plotted as a comparable time point.

## How: marks, channels and tasks

The revised page leads with the trail selection, then presents participation, rider preferences and a local route. See [REVIEW.md](REVIEW.md) for the current figure-by-figure inventory and justification of the seven remaining advanced idioms. The grouped dot plot is basic under the supplied rubric, so the current version is below the eight-advanced-idiom criterion. Basic diagrams are not classified as advanced simply because they are interactive.

Additional derived views: the treemap sums published listing lengths within this selection; its areas are not unique network kilometres. The alluvial preserves joint surface and equal 50 km length-band attributes; opening status is marked with a dagger in the ranked-length chart, with width counting listings rather than distance. Its stages are not changes over time. The final rate comparison uses a 0–100% scale with national and 50% references. It is weekly population rate divided by annual population rate, multiplied by 100; it is not individual retention or measured riding frequency.

## Munzner What / Why / How

**What:** Geographic regions/routes, quantitative rates/lengths, ordered years/age groups, nominal states/surfaces/gender, and route geometry. Data is aggregated survey and published geographic/listing information.

**Why:** Present a coherent narrative; compare, rank, locate, identify trends and inspect a geographic detail. The main task is communication for the public, not expert open-ended analysis.

**How:** A single scrolling page, four chapters, restrained green/rust palette, serif chapter headings, aligned figures, direct numeric annotations, source-level captions and limited meaningful interactions. The two national maps use equal-area conic projection; the local route uses Mercator. Symbol size represents area, not radius. Rates and raw lengths remain separate. Controls alter chart elements without swapping major page sections. All maps/charts use original Vega-Lite or Vega JSON.

## Technical delivery and validation

- 15 main chart panels and three map idioms: choropleth, proportional symbols and route lines.
- More than two substantive sources; local data and libraries, with no live API requests required to view charts.
- Readable chart JSON in `specs/`; prepared CSV/JSON/GeoJSON in `data/`.
- All 18 specifications (15 main figures, locator, eastern detail and route surface strip) compiled and rendered in Vega; selector signals exercised. Desktop/mobile browser checks recorded during implementation.
- Responsive CSS, chart descriptions, labelled controls, visible source links, downloadable data and a keyboard-accessible data table.
- Metadata includes author, source dates, licences and an AI acknowledgement with the supplied conversation link. Public revision dates are omitted at the author’s request. No external photographs or copied charts. The small bicycle icon is original inline SVG decoration.

## Student review and submission

- Read, adapt and understand the code and narrative before submission and the Week 12 interview. This is an AI-assisted draft, not a guarantee of any grade; the rubric requires effective advanced idioms for higher bands.
- Verify the final public GitHub Pages URL, every chart, and chart JSON access in a signed-out browser before submitting. A private Sites preview alone does not satisfy the GitHub requirement.
- Complete the supplied Moodle submission template in your own words, using this rationale as a starting point.
- The specification separately requires a hand-drawn A4 sketch and a PDF image of it. No sketch was supplied and none has been fabricated; this deliverable is intentionally excluded at your request. The brief describes penalties for a missing sketch. A digital mock-up is not a substitute under the rubric.
- The specification gives the deadline as Sunday 25 October 2026, 11:55 PM. Check Moodle for the campus timezone and any later updates.
- AI acknowledgement in the page: OpenAI Codex assisted with source research, data preparation, narrative, implementation and specifications. Adapt the acknowledgement to accurately reflect your use and the university's required format.

## Final presentation refinements

Figure 1 pairs the national overview with a cropped eastern detail using the same smaller outlined symbols and shared filter/highlight. Figure 3 wraps tile labels and retains complete unsealed names below the diagram. Figure 4 has two stages and four equal 50 km bands, with external labels and surface order based on median listed length. Figure 11 places gaps above lines and endpoint values below. Figure 12 directly connects three labels to waffle regions and has no separate legend. Figure 14 uses a full-width card, thicker surface colours, mapped town centres and an explicitly approximate distance strip; supporting views are not counted as additional advanced idioms.
