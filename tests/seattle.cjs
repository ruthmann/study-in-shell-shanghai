const assert=require('node:assert/strict'),fs=require('node:fs');
const {stops,routes}=require('../site/seattle/data.json'),audit=require('../site/seattle/location-audit.json');
assert.equal(stops.length,5);assert.equal(routes.length,3);assert.equal(new Set(stops.map(s=>s.id)).size,5);
for(const s of stops){const a=audit[s.id-1],m=a.matches[0];assert(m,'address match');assert.equal(s.point[0],m.coordinates.y);assert.equal(s.point[1],m.coordinates.x);assert(s.point[0]>47.4&&s.point[0]<47.8&&s.point[1]>-122.5&&s.point[1]<-122.1);assert(s.sources.length>=2);assert(s.profileLinks.length);assert(s.visit&&s.checked);assert(s.sources.every(u=>u.startsWith('https://')))}
for(const r of routes){assert.deepEqual(r.ids,r.all);for(const id of r.ids)assert(stops.some(s=>s.id===id))}
assert(stops[4].note.includes('NOT OPEN YET'));assert(stops[4].note.includes('NOW OPEN'));assert(stops[4].visit.includes('206-350-5970'));assert.equal(stops[4].role,'Confirm first');assert(!routes[0].ids.includes(5));assert(!routes[1].ids.includes(5));
const html=fs.readFileSync('docs/seattle/index.html','utf8');assert(!/__\w+__/.test(html));assert(!/atlas\.pdf|Division Road|David Lawrence|Sentinel_|Alex|sar17/.test(html));assert(html.includes('Seattle Shoe Atlas'));assert(html.includes('US Census'));assert(html.includes('Current')||html.includes('current'));assert(html.includes('three circuits'));assert(html.includes('/newyork/')&&html.includes('/shanghai/'));
const app=fs.readFileSync('site/seattle/atlas.js','utf8');assert(app.includes('sis-seattle-circuit-v1'));assert(!/New York|Brooklyn|NYC Planning|sis-newyork/.test(app));assert(app.includes("city:'Seattle'"));
for(const file of ['docs/index.html','docs/newyork/index.html','docs/shanghai/index.html'])assert(fs.readFileSync(file,'utf8').includes('/seattle/'));
console.log('PASS: five sourced Seattle destinations and Census address anchors; three valid circuits; JK call-first; isolated saves; navigation; no private data or copied NYC content.');
