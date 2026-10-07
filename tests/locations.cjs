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
assert(shops.find(s=>s.id==='rr').warning.includes('could not independently confirm'));
assert(shops.find(s=>s.id==='eth').selection.length===4);
console.log('PASS: 22 sourced coordinates; independent datum controls; matching taxi/model addresses; Kerry wings; Culture Matters and Rivets branches; route integrity; retained selection evidence.');
