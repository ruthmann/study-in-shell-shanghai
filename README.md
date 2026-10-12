# Shanghai Shoe Circuit — Study in Shell

## Study in Shell website — 9 October 2026

`npm run build:site` builds the editorial homepage from `site/` and the complete guide at `/shanghai/` into `dist/`, then copies the public output to `docs/`. GitHub Pages publishes **main → /docs**. After edits, run `npm run build:site` and `npm test`, and commit the generated `docs/` files with the source. `CNAME` and `docs/CNAME` preserve `studyinshell.com`.

Namecheap manages DNS: four GitHub Pages apex A records and `www` CNAME to `ruthmann.github.io`. Existing Private Email MX and SPF records must be preserved. HTTPS certificate issuance/enforcement must be verified in Pages settings; a successful build does not establish HTTPS readiness.

The editorial homepage uses the existing cinnabar seal and Shopify photographs, links to Substack and the separate Archive Drops store at `https://fee827-kv.myshopify.com/`, and keeps the slicker in development. No personal name or Xianyu reference belongs in the public site, including embedded map evidence. Commerce and checkout remain on Shopify.

At the launch audit, six Shopify products were drafts and one duplicate was archived. The live Rise-based theme had the cinnabar logo assigned. Shipping had no active rates or zones; payment activation was not verified. Product photos, condition, prices, availability, final slicker specifications, shipping arrangements, and checkout tests remain prerequisites to product publication.

Preserve the corrected addresses and stated access requirements below; do not turn published hours or historical evidence into claims of verified visits.

An independent visitor guide to Shanghai’s shoe shops, specialist makers and footwear history. Includes 24 retail/service destinations, three primary circuits and four factory/workshop records. No factory tours are offered or bookable.

## Use and publish

Open `index.html` directly for the complete offline guide. For the complete editorial website on GitHub Pages, publish **main → /docs** in Settings → Pages. `.nojekyll` disables Jekyll processing. No keys, server, package installation or runtime network requests are needed. External navigation and source links need a connection.

## Edit and rebuild

Requires Node.js. Run `npm run build` and `npm test`. Editable UI files are in `src/`. `src/location-audit.json` holds dated address overrides, source coordinates, coordinate systems and pin-precision notes. `src/editorial-descriptions.json` holds the replacement visitor descriptions. `src/routes.json` holds the Central Shanghai, Bund and Westward circuits, with NOOS One ITC as an alternative to the Kerry Centre branch. `src/prepare-data.cjs` applies them to the original guide and produces `src/data.json`, shared by markers, cards, routes, taxi cards and exports. `address-index.csv` is the reviewed address index for this edition.

`src/startup.js` keeps the loading message visible until fonts, panels and the initial map are ready, with a reload link on failure. The embedded map uses two-dimensional positioning to avoid WebKit paint glitches. Route cards retain their DOM and scroll position; scrolling the list updates the active map route, and “Show on map” opens it on mobile.

All rendered coordinates are **WGS84**, matching OpenStreetMap. GCJ-02 and BD-09 sources are explicitly converted once using `src/coordinates.cjs`; original source values remain in the audit. Do not assume coordinates from China map providers are WGS84, or convert coordinates whose datum is unknown. A source POI is not a surveyed entrance. Building and address anchors are labelled in the guide.

## 7 October 2026 location review

All 22 stops were researched and repinned or retained with source evidence. Major corrections include eth0s, DOE Tongren, Tricker’s and GentleMaker. Culture Matters is now the documented **206 Wulumuqi Middle Road** branch; Rivets is **D Building, L256, 111 Ji’an Road, Xintiandi Dongtai Li**. Ralph Lauren and NOOS are in different Kerry Centre buildings. One ITC’s existing WGS84 point was retained.

9 October editorial corrections: The Real Real Co.’s address is confirmed; Radiance Blue is on Level 3 and John Lobb on B1 of Plaza 66. Tricker’s Shanghai closed in September and has been removed from the active stops and routes. GentleMaker is the documented **Changfeng, Putuo** Shoecare branch; a separate Changning branch has not been established. Hours, live stock and visitor access are not guaranteed. The history layer retains two approximate mapped anchors and two unmapped research records.

## 12 October 2026 targeted additions

Added Culture Matters at **B1, Xintiandi Style, 245 Madang Road** (stop 22) and JUICE at **832 Julu Road** (stop 23). The existing Culture Matters Wulumuqi branch remains stop 8; earlier numbering is unchanged. JUICE joins the central circuit before Industrial Co.; Xintiandi Style starts the Bund circuit, with a note to choose one Culture Matters branch if preferred.

The official JUICE directory supplies its address, phone and hours. Current Baidu listings supply both map points, with source coordinates retained in the audit. The Xintiandi listing includes 2025 and 2026 visitor reviews and agrees with CMShanghai’s B1 announcement. Fumin Road and The Hub remain deferred because their current status could not be corroborated; historical listings alone do not establish current operation. INNERSECT is excluded following the editor’s closure correction. No other sneaker stores were added.

## 12 October 2026 Autumn Sonata addition

Added Autumn Sonata as stop **24**, at **74 Taiyuan Road**, between La Maison and eth0s in the central circuit. Its own [published brand list](https://autumnsonatash.tumblr.com/brandlist) supplies the footwear entries Cherevichkiotvichki, Muñoz Vrandecic and Paul Harnden Shoemakers; the undated list is not a live inventory. [Margaret Howell’s official stockist directory](https://www.margarethowell.co.uk/pages/worldwide) confirms the current Taiyuan Road address. Older Wuyuan Road listings are obsolete. Baidu supplies the mapped shop point; its source datum and coordinates remain in the audit. Hours remain unconfirmed.

## Credits

Map data © OpenStreetMap contributors, ODbL: https://www.openstreetmap.org/copyright . Embedded vector base derived from OpenFreeMap / OpenMapTiles, snapshot 27 September 2026. It is a modern map, not a reconstruction of historic streets. Map interaction: Leaflet 1.9.4 (BSD-2-Clause; licence included). Fonts: DM Sans, Libre Caslon Display and Noto Sans SC, under the SIL Open Font License; notices included. Conversion polynomial reference: https://github.com/46319943/BD09Convertor (MIT). Source links and evidence distinctions are embedded in each destination card and the location audit.

Guide text and design prepared for Study in Shell. No repository-wide open-source licence is assigned to the original editorial material. Third-party components retain their respective licences. No analytics, accounts or server-side storage; circuit saves remain in the browser’s local storage.
