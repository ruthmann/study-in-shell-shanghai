const assert=require('node:assert/strict');
const fs=require('node:fs'),vm=require('node:vm');
const source=fs.readFileSync('src/geolocation.js','utf8');
function harness(geoEnabled=true){
 const listeners={},queue=[],layers=[],views=[];let calls=0,fit=0;
 const element=()=>({textContent:'',hidden:true,disabled:false,attrs:{},addEventListener(t,f){this[t]=f},setAttribute(k,v){this.attrs[k]=v},removeAttribute(k){delete this.attrs[k]},focus(){}});
 const button=element(),back=element(),status=element();
 const root={module:{exports:{}},addEventListener(t,f){listeners[t]=f},setTimeout(f){queue.push(f);return f},clearTimeout(f){const i=queue.indexOf(f);if(i>=0)queue.splice(i,1)}};
 vm.runInNewContext(source,root);
 const responses=[];const geo=geoEnabled?{getCurrentPosition(ok,bad,options){calls++;responses.push({ok,bad,options})}}:null;
 const L={divIcon:o=>o,circle:(p,o)=>layer('accuracy',p,o),marker:(p,o)=>layer('marker',p,o)};
 function layer(type,p,o){return {type,p,o,addTo(){layers.push(this);return this},bindTooltip(){return this}}}
 const map={removeLayer(l){layers.splice(layers.indexOf(l),1)},stop(){},setView(p,z){views.push({p,z})}};
 root.module.exports.attach({map,L,button,back,status,bounds:[[30.97,121.28],[31.36,121.65]],city:'Shanghai',geo,timers:root,fitCircuit(){fit++}});
 return {button,back,status,layers,views,responses,queue,listeners,get calls(){return calls},get fit(){return fit}};
}
const point=(lat=31.2063889453,lon=121.4550962445,accuracy=30)=>({coords:{latitude:lat,longitude:lon,accuracy}});
let h=harness();assert.equal(h.calls,0,'no request on initialization');h.button.click();h.button.click();assert.equal(h.calls,1,'repeated tap deduplicated');assert(h.button.disabled);assert.equal(h.responses[0].options.maximumAge,0);h.responses[0].ok(point());assert.equal(h.layers.length,2);assert.equal(h.views[0].p[0],point().coords.latitude,'WGS84 latitude unchanged');assert.equal(h.views[0].p[1],point().coords.longitude,'WGS84 longitude unchanged');assert.equal(h.layers[0].o.radius,30);assert(!h.button.disabled);h.button.click();h.responses[1].ok(point(31.21,121.46,2500));assert.equal(h.layers.length,2,'refresh replaces overlays');assert.equal(h.views.at(-1).z,12);assert.match(h.status.textContent,/approximate/);h.back.click();assert.equal(h.layers.length,0);assert.equal(h.fit,1);
for(const [code,text] of [[1,/permission/],[2,/unavailable/],[3,/too long/]]){h=harness();h.button.click();h.responses[0].bad({code});assert.match(h.status.textContent,text);assert(!h.button.disabled);h.button.click();assert.equal(h.calls,2,'retry allowed');}
h=harness(false);h.button.click();assert.match(h.status.textContent,/does not support/);
h=harness();h.button.click();h.responses[0].ok(point(40.73,-74));assert.equal(h.views.length,0,'outside city does not move map');assert.equal(h.layers.length,0);assert.match(h.status.textContent,/outside/);
h=harness();h.button.click();h.back.click();h.responses[0].ok(point());assert.equal(h.layers.length,0,'canceled request cannot reappear');
h=harness();h.button.click();h.queue[0]();h.button.click();h.responses[0].ok(point());assert.equal(h.layers.length,0,'stale response ignored during retry');h.responses[1].ok(point());assert.equal(h.layers.length,2);
h.listeners.pagehide();assert.equal(h.layers.length,0,'location forgotten on page leave');
for(const p of [point(NaN),point(31.21,121.45,-1),point(31.21,121.45,NaN)]){h=harness();h.button.click();h.responses[0].ok(p);assert.equal(h.layers.length,0);assert.match(h.status.textContent,/unavailable/);}
assert(!/localStorage|sessionStorage|fetch\(|sendBeacon|watchPosition/.test(source),'location code neither persists, sends nor watches coordinates');
console.log('PASS: intentional tap only, WGS84 alignment, accuracy, refresh, denied/unavailable/timeout/unsupported, out-of-city, cancellation, stale callbacks, pagehide and privacy.');
