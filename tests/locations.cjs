const assert=require('assert'),fs=require('fs');const {toWgs,wgsToGcj,gcjToWgs}=require('../src/coordinates.cjs');const {shops,routes}=require('../src/data.json');
const dist=(a,b)=>Math.hypot((a.lat-b.lat)*111195,(a.lon-b.lon)*95100);
const itc=shops.find(s=>s.id==='no2');assert.equal(itc.lat,31.1996218);assert.equal(itc.lon,121.4334436);
// An independently sourced China POI for the same mall must align after conversion.
assert(dist(toWgs({datum:'GCJ02',lat:31.197865,lon:121.437658}),itc)<80);
// The independently mapped street address and Apple eth0s shop must agree closely.
const eth=shops.find(s=>s.id==='eth');assert(dist(eth,toWgs({datum:'BD09MC',x:13521757,y:3638209}))<5);
assert(dist(shops.find(s=>s.id==='gm'),toWgs({datum:'GCJ02',lat:31.228408,lon:121.392082}))<30);
for(const s of shops){if(s.id==='lottusse'){assert.equal(s.lat,null);assert.equal(s.lon,null);assert(s.street.includes('2108'));assert(s.phone==='+86 21 6040 0755');assert(s.pinLabel.includes('Outside'));assert(s.sources.some(x=>x.url.includes('lottusse-letushi')));continue;}assert(s.lat>31.19&&s.lat<31.27&&s.lon>121.38&&s.lon<121.52,s.id);assert(s.pinLabel&&s.locationChecked&&s.sources.length,s.id);assert(!s.coordNote.includes('inherited'),s.id);assert.equal(s.addr,s.street);const g=wgsToGcj(s.lat,s.lon);assert(dist(s,gcjToWgs(g.lat,g.lon))<.01);for(const x of s.sources){assert(/^https?:\/\//.test(x.url),s.id)}}
for(const r of routes)for(const id of [...r.ids,...r.optional])assert(shops.some(s=>s.id===id));
assert(shops.find(s=>s.id==='fy').zh.includes('乌鲁木齐中路206号'));
assert(shops.find(s=>s.id==='rv').zh.includes('吉安路111号'));
assert(shops.find(s=>s.id==='rl').zh.includes('北区'));
assert(shops.find(s=>s.id==='no').zh.includes('南区'));
assert.equal(shops.find(s=>s.id==='rr').warning,null);
assert(!shops.some(s=>s.id==='tk'));
assert.equal(shops.length,29);
assert(shops.find(s=>s.id==='cmxt').zh.includes('马当路245号 新天地时尚B1层'));
assert(shops.find(s=>s.id==='juice').zh.includes('巨鹿路832号'));
assert(!shops.some(s=>/innersect/i.test(s.name)));
assert.equal(shops.find(s=>s.id==='fy').number,8);
assert.equal(shops.find(s=>s.id==='cmxt').number,22);
assert.equal(shops.find(s=>s.id==='juice').number,23);
assert(shops.find(s=>s.id==='jl').zh.includes('B1'));
const radiance=shops.find(s=>s.id==='rb');assert(radiance.zh.includes('2层L278'));assert(radiance.street.includes('Unit L278, 2F'));
assert(shops.find(s=>s.id==='eth').selection.length===4);
console.log('PASS: 29 stops, including a verified directory-only outlet; independent datum controls; matching taxi/model addresses; Kerry wings; Culture Matters and Rivets branches; route integrity; retained selection evidence.');
// Published copy must not expose private research handoffs or editorial instructions.
const published=JSON.stringify(require('../src/data.json'));
assert(!/handoff|screenshot-backed|user-confirmed|inherited|supplied in|editorial (?:notes|example|corrections)|confirmed by the editor|candidate for a future|not attached to this edit/i.test(published));
const app=fs.readFileSync('src/app.js','utf8');
assert(!/Twenty-two|occupancy and Radiance|possibilities being explored|future factory and atelier visits/.test(app));
assert(require('../src/data.json').factories.find(f=>f.id==='h-oct').description.includes('Oct Tenth and Axen share a factory'));
console.log('PASS: public copy excludes internal handoffs, obsolete warnings and speculative tour plans.');

// New pins use the current address/venue, not the old NikeLab X158 location.
assert(dist(shops.find(s=>s.id==='fly'),toWgs({datum:'GCJ02',lat:31.21787,lon:121.452763}))<1);
const nike=shops.find(s=>s.id==='nikelab');assert.equal(nike.pinPrecision,'venue');assert(nike.zh.includes('延庆路122号'));assert(nike.warning.includes('Temporary location'));
assert.deepEqual(routes.find(r=>r.id==='sport').ids,['doet','pn','juice','fly','nikelab','fy','eth']);

const mandom=shops.find(s=>s.id==='mandom');
assert.equal(mandom.number,27);assert(mandom.zh.includes('嘉善路508号'));assert(mandom.tags.includes('Yuketen'));assert(routes.find(r=>r.id==='central').ids.includes('mandom'));assert(dist(mandom,toWgs({datum:'BD09MC',x:13521694.74,y:3637794.30}))<1);assert.equal(mandom.profileAccounts[0].handle,'LongTimeNoSeeWei');

const galeries=shops.find(s=>s.id==='gl');assert(galeries&&galeries.tags.includes('Church’s')&&galeries.tags.includes('Officine Creative'));assert(galeries.street.includes('2F')&&galeries.pinPrecision==='building');assert(routes.find(r=>r.id==='bund').ids.includes('gl'));

const outletAudit=require('../src/location-audit.json').locations.find(x=>x.id==='lottusse');assert.equal(outletAudit.displayOnMap,false);assert(toWgs(outletAudit.position).lon>require('../src/basemap.json').bounds[1][1]);
