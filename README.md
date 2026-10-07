# Shanghai Shoe Circuit — Study in Shell

An independent visitor guide to Shanghai’s shoe shops, specialist makers and footwear history. Includes 22 retail/service destinations, three editorial routes and four factory/workshop records. No factory tours are offered or bookable.

## Use and publish

Open `index.html` directly for the complete offline guide. For GitHub Pages, publish the **main** branch from **/ (root)** in Settings → Pages. `.nojekyll` disables Jekyll processing. No keys, server, package installation or runtime network requests are needed. External navigation and source links need a connection.

## Edit and rebuild

Requires Node.js. Run `npm run build` and `npm test`. Editable UI files are in `src/`. `src/location-audit.json` holds dated address overrides, source coordinates, coordinate systems and pin-precision notes. `src/prepare-data.cjs` applies them to the original guide and produces `src/data.json`, shared by markers, cards, routes, taxi cards and exports. `address-index.csv` is the reviewed address index for this edition.

All rendered coordinates are **WGS84**, matching OpenStreetMap. GCJ-02 and BD-09 sources are explicitly converted once using `src/coordinates.cjs`; original source values remain in the audit. Do not assume coordinates from China map providers are WGS84, or convert coordinates whose datum is unknown. A source POI is not a surveyed entrance. Building and address anchors are labelled in the guide.

## 7 October 2026 location review

All 22 stops were researched and repinned or retained with source evidence. Major corrections include eth0s, DOE Tongren, Tricker’s and GentleMaker. Culture Matters is now the documented **206 Wulumuqi Middle Road** branch; Rivets is **D Building, L256, 111 Ji’an Road, Xintiandi Dongtai Li**. Ralph Lauren and NOOS are in different Kerry Centre buildings. One ITC’s existing WGS84 point was retained.

Unresolved: The Real Real Co.’s numbered address is mapped but shop occupancy is unverified. Radiance Blue’s unit conflicts across published directories. GentleMaker is the documented **Changfeng, Putuo** Shoecare branch; a separate Changning branch has not been established. Hours, live stock and visitor access are not guaranteed. The history layer retains two approximate mapped anchors and two unmapped research records.

## Credits

Map data © OpenStreetMap contributors, ODbL: https://www.openstreetmap.org/copyright . Embedded vector base derived from OpenFreeMap / OpenMapTiles, snapshot 27 September 2026. It is a modern map, not a reconstruction of historic streets. Map interaction: Leaflet 1.9.4 (BSD-2-Clause; licence included). Fonts: DM Sans, Libre Caslon Display and Noto Sans SC, under the SIL Open Font License; notices included. Conversion polynomial reference: https://github.com/46319943/BD09Convertor (MIT). Source links and evidence distinctions are embedded in each destination card and the location audit.

Guide text and design prepared for Study in Shell. No repository-wide open-source licence is assigned to the original editorial material. Third-party components retain their respective licences. No analytics, accounts or server-side storage; circuit saves remain in the browser’s local storage.
