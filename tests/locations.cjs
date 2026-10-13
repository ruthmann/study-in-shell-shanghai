const assert=require('assert'),fs=require('fs');const {toWgs,wgsToGcj,gcjToWgs}=require('../src/coordinates.cjs');const {shops,routes}=require('../src/data.json');
const dist=(a,b)=>Math.hypot((a.lat-b.lat)*111195,(a.lon-b.lon)*95100);
const itc=shops.find(s=>s.id==='no2');assert.equal(itc.lat,31.1996218);assert.equal(itc.lon,121.4334436);
// An independently sourced China POI for the same mall must align after conversion.
assert(dist(toWgs({datum:'GCJ02',lat:31.197865,lon:121.437658}),itc)<80);
// The independently mapped street address and Apple eth0s shop must agree closely.
const eth=shops.find(s=>s.id==='eth');assert(dist(eth,toWgs({datum:'BD09MC',x:13521757,y:3638209}))<5);
assert(dist(shops.find(s=>s.id==='gm'),toWgs({datum:'GCJ02',lat:31.228408,lon:121.392082}))<30);
for(const s of shops){assert(s.lat>31.19&&s.lat<31.27&&s.lon>121.38&&s.lon<121.52,s.id);assert(s.pinLabel&&s.locationChecked&&s.sources.length,s.id);assert(!s.coordNote.includes('inherited'),s.id);assert.equal(s.addr,s.street);const g=wgsToGcj(s.lat,s.lon);assert(dist(s,gcjToWgs(g.lat,g.lon))<.01);for(const x of s.sources){assert(/^https?:\/\//.test(x.url),s.id)}}
for(const r of routes)for(const id of [...r.ids,...r.optional])assert(shops.some(s=>s.id===id));
assert(shops.find(s=>s.id==='fy').zh.includes('乌鲁木齐中路206号'));
assert(shops.find(s=>s.id==='rv').zh.includes('吉安路111号'));
assert(shops.find(s=>s.id==='rl').zh.includes('北区'));
assert(shops.find(s=>s.id==='no').zh.includes('南区'));
assert.equal(shops.find(s=>s.id==='rr').warning,null);
assert(!shops.some(s=>s.id==='tk'));
assert.equal(shops.length,26);
assert(shops.find(s=>s.id==='cmxt').zh.includes('马当路245号 新天地时尚B1层'));
assert(shops.find(s=>s.id==='juice').zh.includes('巨鹿路832号'));
assert(!shops.some(s=>/innersect/i.test(s.name)));
assert.equal(shops.find(s=>s.id==='fy').number,8);
assert.equal(shops.find(s=>s.id==='cmxt').number,22);
assert.equal(shops.find(s=>s.id==='juice').number,23);
assert(shops.find(s=>s.id==='jl').zh.includes('B1'));
assert(shops.find(s=>s.id==='rb').zh.includes('3层'));
assert(shops.find(s=>s.id==='eth').selection.length===4);
console.log('PASS: 26 stops with sourced coordinates; independent datum controls; matching taxi/model addresses; Kerry wings; Culture Matters and Rivets branches; route integrity; retained selection evidence.');
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
