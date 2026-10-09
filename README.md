# Shanghai Shoe Circuit — Study in Shell

## Study in Shell website — 9 October 2026

`npm run build:site` builds the editorial homepage from `site/` and the complete guide at `/shanghai/` into `dist/`, then copies the public output to `docs/`. GitHub Pages publishes **main → /docs**. After edits, run `npm run build:site` and `npm test`, and commit the generated `docs/` files with the source. `CNAME` and `docs/CNAME` preserve `studyinshell.com`.

Namecheap manages DNS: four GitHub Pages apex A records and `www` CNAME to `ruthmann.github.io`. Existing Private Email MX and SPF records must be preserved. HTTPS certificate issuance/enforcement must be verified in Pages settings; a successful build does not establish HTTPS readiness.

The editorial homepage uses the existing cinnabar seal and Shopify photographs, links to Substack and the separate Archive Drops store at `https://fee827-kv.myshopify.com/`, and keeps the slicker in development. No personal name or Xianyu reference belongs in the public site, including embedded map evidence. Commerce and checkout remain on Shopify.

At the launch audit, six Shopify products were drafts and one duplicate was archived. The live Rise-based theme had the cinnabar logo assigned. Shipping had no active rates or zones; payment activation was not verified. Product photos, condition, prices, availability, final slicker specifications, shipping arrangements, and checkout tests remain prerequisites to product publication.

Atlas research still carries the documented occupancy/unit uncertainties below. Preserve those labels; do not replace them with claims of current opening hours or verified visits.

An independent visitor guide to Shanghai’s shoe shops, specialist makers and footwear history. Includes 21 retail/service destinations, three editorial routes and four factory/workshop records. No factory tours are offered or bookable.

## Use and publish

Open `index.html` directly for the complete offline guide. For the complete editorial website on GitHub Pages, publish **main → /docs** in Settings → Pages. `.nojekyll` disables Jekyll processing. No keys, server, package installation or runtime network requests are needed. External navigation and source links need a connection.

## Edit and rebuild

Requires Node.js. Run `npm run build` and `npm test`. Editable UI files are in `src/`. `src/location-audit.json` holds dated address overrides, source coordinates, coordinate systems and pin-precision notes. `src/editorial-descriptions.json` holds the replacement visitor descriptions. `src/prepare-data.cjs` applies them to the original guide and produces `src/data.json`, shared by markers, cards, routes, taxi cards and exports. `address-index.csv` is the reviewed address index for this edition.

All rendered coordinates are **WGS84**, matching OpenStreetMap. GCJ-02 and BD-09 sources are explicitly converted once using `src/coordinates.cjs`; original source values remain in the audit. Do not assume coordinates from China map providers are WGS84, or convert coordinates whose datum is unknown. A source POI is not a surveyed entrance. Building and address anchors are labelled in the guide.

## 7 October 2026 location review

All 22 stops were researched and repinned or retained with source evidence. Major corrections include eth0s, DOE Tongren, Tricker’s and GentleMaker. Culture Matters is now the documented **206 Wulumuqi Middle Road** branch; Rivets is **D Building, L256, 111 Ji’an Road, Xintiandi Dongtai Li**. Ralph Lauren and NOOS are in different Kerry Centre buildings. One ITC’s existing WGS84 point was retained.

9 October editorial corrections: The Real Real Co.’s address is confirmed; Radiance Blue is on Level 3 and John Lobb on B1 of Plaza 66. Tricker’s Shanghai closed in September and has been removed from the active stops and routes. GentleMaker is the documented **Changfeng, Putuo** Shoecare branch; a separate Changning branch has not been established. Hours, live stock and visitor access are not guaranteed. The history layer retains two approximate mapped anchors and two unmapped research records.

## Credits

Map data © OpenStreetMap contributors, ODbL: https://www.openstreetmap.org/copyright . Embedded vector base derived from OpenFreeMap / OpenMapTiles, snapshot 27 September 2026. It is a modern map, not a reconstruction of historic streets. Map interaction: Leaflet 1.9.4 (BSD-2-Clause; licence included). Fonts: DM Sans, Libre Caslon Display and Noto Sans SC, under the SIL Open Font License; notices included. Conversion polynomial reference: https://github.com/46319943/BD09Convertor (MIT). Source links and evidence distinctions are embedded in each destination card and the location audit.

Guide text and design prepared for Study in Shell. No repository-wide open-source licence is assigned to the original editorial material. Third-party components retain their respective licences. No analytics, accounts or server-side storage; circuit saves remain in the browser’s local storage.
