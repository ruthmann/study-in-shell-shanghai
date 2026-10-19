const fs=require('node:fs'),path=require('node:path');
const dir=__dirname,out=path.resolve(dir,'../../dist/seattle');
const data=JSON.parse(fs.readFileSync(path.join(dir,'data.json'),'utf8'));
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const link=(url,label)=>`<a href="${esc(url)}" target="_blank" rel="noopener">${esc(label)}</a>`;
const cards=data.stops.map(s=>{
 const borough='';
 const directions='https://www.google.com/maps/search/?api=1&query='+encodeURIComponent(s.name+' '+s.address+' '+borough);
 return `<details class="stop" id="stop-${s.id}" data-id="${s.id}"><summary><span class="meta">${String(s.id).padStart(2,'0')} / ${esc(s.area)} / ${esc(s.role)}</span><h3>${esc(s.name)}</h3><span class="address">${esc(s.address)}</span><span class="focus">${esc(s.focus)}</span></summary><div class="stop-content">${s.profileLinks?.length?`<div class="profile-links" aria-label="Website and social media">${s.profileLinks.map(l=>link(l.url,l.label+' ↗')).join('')}</div>`:''}<p>${esc(s.note)}</p><p class="visit"><strong>Visit:</strong> ${esc(s.visit)}</p><span class="category-label">${esc(s.category)}</span><div class="stop-actions">${s.point?link(directions,'Directions ↗')+`<button type="button" data-map="${s.id}">On the map</button>`:link(s.sources[0],'Arrange a visit ↗')}<button type="button" class="save" data-id="${s.id}" aria-pressed="false">Save to my circuit</button></div><div class="sources">${s.sources.map((u,i)=>link(u,'Source '+(i+1))).join('')}</div><div class="source-date">Research checked ${esc(s.checked)}${s.point?' · Address / building pin':' · No public street pin'}</div></div></details>`;
}).join('\n');
const watch=data.watchlist.map(w=>`<details class="watch"><summary>${esc(w.title)}</summary><p>${esc(w.note)} ${link(w.url,'Source ↗')}</p></details>`).join('\n');
let html=fs.readFileSync(path.join(dir,'template.html'),'utf8');
const replacements={__STOP_COUNT__:data.stops.length,__ROUTE_COUNT__:data.routes.length,__CARDS__:cards,__DATA__:JSON.stringify(data).replace(/</g,'\\u003c'),__WATCHLIST__:watch,__MAPPED_COUNT__:data.stops.filter(s=>s.point).length,__CATEGORY_OPTIONS__:[...new Set(data.stops.map(s=>s.category))].map(c=>`<option value="${esc(c)}">${esc(c)}</option>`).join('')};
for(const [k,v] of Object.entries(replacements))html=html.replaceAll(k,()=>v);
fs.mkdirSync(out,{recursive:true});fs.writeFileSync(path.join(out,'index.html'),html);
fs.writeFileSync(path.join(out,'atlas.js'),fs.readFileSync(path.resolve(dir,'../../src/geolocation.js'),'utf8')+'\n'+fs.readFileSync(path.join(dir,'atlas.js'),'utf8'));
for(const f of ['atlas.css'])fs.copyFileSync(path.join(dir,f),path.join(out,f));
fs.cpSync(path.resolve(dir,'../../vendor/leaflet'),path.join(out,'leaflet'),{recursive:true});
console.log(`Built /seattle/: ${data.stops.length} entries, ${data.stops.filter(s=>s.point).length} address pins, ${data.routes.length} circuits`);
