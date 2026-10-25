# Review after revision — 25 October 2026

This review covers the revised source. It does not certify a grade or confirm that the same revision has been uploaded to GitHub Pages.

## Storytelling, annotations, grammar and metadata

The narrative now follows the chosen topic more closely: trail possibilities, national participation, rider preferences, and one local route. Participation supplies context; it is not presented as measured use of these trails. The conclusion investigates the growth claim rather than assuming growth.

Annotations include the 2021 participation peak, direct 2025 line labels, a highlighted latest-year heatmap column, labelled gender gaps, all three riding-preference shares, frequency percentages, boxplot group sizes, treemap group totals, alluvial listing counts, the route's scale/north reference, and a national benchmark for the final derived ratio. The surface guide comes before all diagrams that use it.

The hero date remains removed. The revision date appears in Sources & Methods alongside the author, original data dates, source links, methods, licences and AI acknowledgement. Text distinguishes percentages from percentage-point change, listing-kilometres from network length, and a cross-sectional ratio from individual riding habit.

**Remaining limitation:** The 14 listings are selected examples, not a representative national inventory. Trail conclusions must remain about this selection. Survey estimates do not establish that every observed difference is statistically significant.

## Layout, colour and figure–ground

Four chapters, aligned figure boundaries and a stable page width establish a clear hierarchy. Chart labels and captions are larger. The same dark green, terracotta and olive surface mapping is retained across the guide, map, bars, treemap, alluvial and boxplot. Darker surface fills improve contrast with light text. The map and heatmap now share an explicit 0–45% RGB colour scale. Cell labels use measured black/white contrast against the actual fill, with a rendered minimum of 6.67:1 in the heatmap. A visible legend explains the common scale. Numeric chart text is at least 12px at its intended display size; phone views still require close reading of dense tables.

The local route has an Australia/Victoria locator, north indication and approximate 5 km reference. The locator is contextual and is not counted as another chart. On narrow screens, columns stack and the alluvial flows vertically with 12px category labels. The tested mobile page had no horizontal overflow.

**Remaining limitations:** Small treemap tiles shorten some labels; tooltips, a persistent selection readout and the accessible data table retain complete names. Nearby map symbols overlap; coordinated highlighting identifies them without moving their geographic locations. The choropleth intentionally uses one 0–45% scale across recall windows, so weekly differences appear subtler; numeric labels preserve the values on wider screens. On a phone, state codes avoid label collisions and a live text summary gives the highest, lowest and national rate; the accessible data table retains every value.

## Idioms and complexity

The page contains **15 main chart panels** plus one contextual inset. Eight distinct idioms fall outside the supplied basic-idiom list:

| Figure | Advanced idiom | Task and encoding |
|---|---|---|
| 1 | Proportional-symbol map | Locate selected trails. Geographic position identifies location, circle area represents published listing kilometres and colour identifies surface. It is not a usage map or complete network inventory. |
| 3 | Treemap | Inspect composition of summed listing length. Nested rectangle area represents kilometres, grouped by surface. Group totals and individual lengths are labelled; the sum is not unique, continuous or national network distance. |
| 4 | Alluvial / parallel sets | Inspect joint surface, length-band and opening-status combinations. Ribbon width represents the number of listings sharing those attributes. The stages are not changes over time. |
| 5 | Box-and-whisker plot | Inspect variation within surface groups. Quartiles, median and whiskers summarise lengths, while all 14 individual observations remain visible. Group sizes of 4 or 5 are explicit. |
| 6 | Choropleth | Compare population participation rates across jurisdictions using sequential colour on an equal-area conic map. ACT has a connected label. |
| 8 | Heatmap | Compare state-by-year rates through position, a common colour scale and numeric labels. Rows follow the latest rate; 2025 is outlined. |
| 12 | Waffle | Communicate preference composition with 100 equal cells. A square represents one percentage point, not one respondent. All three shares are labelled. |
| 14 | Geographic route-line map | Inspect actual OSM member-way geometry and recorded sealed/unsealed/missing surface classes at local scale, supported by verified mapped ends, geographic context, north indication and a distance reference. |

The remaining panels use basic idioms: three bar-based comparisons, the national line chart, age lollipops, gender dumbbells and stacked composition. They are not claimed as advanced merely because they are layered or interactive.

**Conservative count:** Merging the three horizontal-bar panels into one chart family and the lollipop/dumbbell panels into one point-comparison family still leaves **12 chart groups**: eight advanced groups plus four basic groups. The page does not depend on counting similar bars, small multiples or the locator inset separately to exceed ten. Final classification and marks remain the assessor's judgement.

## Further marks-and-channels corrections

- Map symbols retain area-based length encoding, with smaller maximum area and 0.68 default opacity to expose overlap. A pinned highlight remains opaque while other trails fade. Exact comparisons remain easier in the aligned length chart.
- Boxplots use pale fills and dark outlines; all 14 observations are white-filled, dark-outlined points. This preserves individual evidence in groups of only four or five.
- Alluvial ribbon order reduces the weighted crossing proxy from 66 to 30 without changing a category or record. Annotation describes the strongest observed combinations. Crossing ribbons still require more effort than aligned bars; counts at category boundaries and the accessible table remain the precise reading aids.
- Waffle cells now start at the top left. One square represents one percentage point, and all three category totals remain labelled.
- Gender and recall-window palettes are scoped separately from trail-surface colours. The trend uses quantitative years with explicit ticks; years retain their actual spacing.
- The closing rate ratio has percentage labels, a 0–100% axis, a 50% reference and the 42.8% national benchmark. It remains a cross-sectional ratio of rounded population rates, not individual retention.
- The route now shows 94 actual way geometries: 74 unsealed, 19 sealed and one without a recorded surface tag. These are counts of mapped ways, not length shares. Missing data is grey. Explicit terminal node IDs replace inference from longitude extrema; the labels describe mapped ends rather than certified access points.

## Verification

- All 16 specifications (15 main charts plus inset) compile/parse and render in Vega without NaN output.
- The browser rendered 16 SVGs without chart errors or warnings in the revised preview.
- Map geometry is embedded in the chart specifications, removing the earlier separate GeoJSON-request failure point.
- Desktop and mobile layouts were inspected; the alluvial switches orientation on mobile.
- The recall-window selector, surface filter, coordinated trail highlight and accessible table were exercised.
- Source counts reconcile: 14 listings; 5 sealed, 5 mixed, 4 unsealed. Published lengths sum to 905 listing-km: 258 sealed, 448 mixed, 199 unsealed.
- Alluvial widths sum to 14 records, including exactly two partly open listings. No artificial transitions, riders or kilometres were invented.

## Final judgement

The revision addresses the narrative and marks-and-channels reviews' main issues and gives an auditable case for the requested complexity threshold. Explanatory annotations and clear limitations are its strongest features. The main residual constraints are the selected trail sample, dense alluvial paths, small labels in the treemap and community-maintained route attributes; a wider validated inventory would support broader geographic conclusions. Upload this revision and verify the public GitHub Pages site while signed out before submitting.
