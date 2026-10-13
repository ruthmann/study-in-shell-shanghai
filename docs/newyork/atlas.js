/* Browser geolocation is WGS84. Both atlases render WGS84 positions on Leaflet's
   EPSG:3857 map; do not apply China's GCJ-02 offset here. Coordinates stay in memory. */
(function(root){
  'use strict';
  function attach({map,L,button,back,status,bounds,city,beforeCenter=()=>{},fitCircuit,geo=root.navigator?.geolocation,timers=root}){
    let generation=0,pending=false,watchdog,marker,accuracy;
    const say=text=>{status.textContent=text;};
    function clearLayers(){if(marker)map.removeLayer(marker);if(accuracy)map.removeLayer(accuracy);marker=accuracy=null;}
    function finish(){pending=false;timers.clearTimeout(watchdog);button.disabled=false;button.removeAttribute('aria-busy');button.textContent='My location';}
    function cancel(){generation++;finish();clearLayers();back.hidden=true;}
    function failure(code){say(code===1?'Location permission is off. Allow location in your browser settings, then tap My location to try again.':code===3?'Finding your location took too long. Tap My location to retry.':'Your location is unavailable. Check location services and try again.');}
    button.addEventListener('click',()=>{
      if(pending)return;
      if(!geo?.getCurrentPosition){say('This browser does not support location. You can still explore the circuit.');return;}
      clearLayers();pending=true;const request=++generation;
      button.disabled=true;button.setAttribute('aria-busy','true');button.textContent='Locating…';back.hidden=false;
      say('Finding your location… Used only on this map; never saved.');
      const fail=error=>{if(request!==generation||!pending)return;finish();failure(error?.code);};
      watchdog=timers.setTimeout(()=>fail({code:3}),15000);
      try{geo.getCurrentPosition(position=>{
        if(request!==generation||!pending)return;
        finish();
        const {latitude:lat,longitude:lon,accuracy:meters}=position.coords||{};
        if(!Number.isFinite(lat)||!Number.isFinite(lon)||lat< -90||lat>90||lon< -180||lon>180||!Number.isFinite(meters)||meters<0){failure(2);return;}
        if(lat<bounds[0][0]||lat>bounds[1][0]||lon<bounds[0][1]||lon>bounds[1][1]){say(`Your location is outside this ${city} atlas. The circuit is still on the map.`);return;}
        const point=[lat,lon];
        accuracy=L.circle(point,{radius:meters,color:'#176ba0',weight:1,fillColor:'#2188c7',fillOpacity:.12,interactive:false}).addTo(map);
        marker=L.marker(point,{title:'Your current location',alt:'Your current location',keyboard:false,zIndexOffset:2000,icon:L.divIcon({className:'user-location',html:'<span aria-hidden="true"></span>',iconSize:[22,22],iconAnchor:[11,11]})}).addTo(map);
        marker.bindTooltip('Your location',{permanent:true,direction:'top',offset:[0,-12]});
        beforeCenter();map.stop();map.setView(point,meters>2000?12:meters>300?14:16,{animate:false});
        say(`Your location · accuracy about ${Math.max(1,Math.round(meters))} meters.${meters>1000?' This is an approximate location.':''} Tap My location to refresh or recenter.`);
      },fail,{enableHighAccuracy:true,timeout:12000,maximumAge:0});}catch{fail({code:2});}
    });
    back.addEventListener('click',()=>{cancel();fitCircuit();say('Back to your circuit. Location cleared.');button.focus({preventScroll:true});});
    // Invalidate pending callbacks and forget location when leaving or entering bfcache.
    root.addEventListener?.('pagehide',()=>{cancel();say('');});
    return {clear:cancel};
  }
  if(typeof module==='object'&&module.exports)module.exports={attach};
  else root.AtlasLocation={attach};
})(typeof window==='undefined'?globalThis:window);

'use strict';
(() => {
  const data = JSON.parse(document.getElementById('atlas-data').textContent);
  const {stops, routes} = data;
  const byId = new Map(stops.map(s => [s.id, s]));
  const $ = id => document.getElementById(id);
  const results = $('results');
  const cardHtml = new Map([...results.children].map(el => [Number(el.dataset.id), el.outerHTML]));
  const esc = s => String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const colors = {"Benchmade & Buyer's":'#743c40','Heritage & Workwear':'#426458','Care & Recraft':'#9b763f','Local Color':'#566f83'};
  const key = 'sis-newyork-circuit-v1';
  let saved = [], storageOK = true;
  try {const v = JSON.parse(localStorage.getItem(key) || '[]'); if (Array.isArray(v)) saved = [...new Set(v.filter(id => byId.has(id)))];} catch {storageOK = false;}
  const state = {view:'shops', selected:null, route:null};
  let map, pins, routeLine, mapStops = stops, fitOnResize = true;
  function fitStops() {
    const points = mapStops.filter(s => s.point).map(s => s.point);
    if (points.length) map.fitBounds(points, {padding:[32,32], maxZoom:16, animate:false});
    fitOnResize = true;
  }
  function filtered() {
    if (state.view === 'saved') return saved.map(id => byId.get(id));
    const q = $('search').value.toLowerCase().trim();
    return stops.filter(s => ($('area').value === 'all' || s.zone === $('area').value)
      && ($('category').value === 'all' || s.category === $('category').value)
      && (!$('discoveries').checked || s.role === 'Discovery')
      && (!q || [s.name,s.area,s.address,s.focus,s.note,s.category].join(' ').toLowerCase().includes(q)));
  }
  function updateSaves() {
    $('saved-count').textContent = saved.length;
    document.querySelectorAll('.save').forEach(b => {
      const has = saved.includes(Number(b.dataset.id));
      b.setAttribute('aria-pressed', String(has)); b.textContent = has ? 'Saved ✓' : 'Save to my circuit';
    });
    $('storage-note').textContent = storageOK ? 'Saved in this browser, on this device. Download a portable address list below.' : 'This browser cannot retain saves. Download your address list to keep it.';
  }
  function render() {
    document.querySelectorAll('[data-view]').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.view === state.view)));
    $('filters').hidden = state.view !== 'shops';
    $('saved-tools').hidden = state.view !== 'saved' || !saved.length;
    $('routes-intro').hidden = state.view !== 'routes';
    $('empty').hidden = true;
    if (state.view === 'routes') {
      $('list-title').textContent = 'Four ways into the city.';
      $('results-count').textContent = 'Choose a circuit, then a few stops';
      $('routes-intro').textContent = 'Scroll the circuits to follow them on the map. Pick five or six stops for serious fitting. Dashed lines suggest visit order, not walking directions. Brooklyn is a set of separate clusters.';
      results.innerHTML = routes.map(r => `<article class="route ${state.route===r.id?'active':''}" data-route-card="${r.id}" ${state.route===r.id?'aria-current="true"':''}><p class="eyebrow">Circuit 0${r.id} / ${esc(r.area)}</p><h3>${esc(r.title)}</h3><p>${esc(r.note)}</p><span class="route-map-label">Showing on the map</span><ol>${r.ids.map(id => `<li><button type="button" data-open="${id}">${esc(byId.get(id).name)}</button><span>${String(id).padStart(2,'0')}</span></li>`).join('')}</ol><p>${esc(r.extensions)}</p><button type="button" data-route="${r.id}">Show circuit on map ↗</button></article>`).join('');
      const route = routes.find(r => r.id === state.route);
      mapStops = route ? route.all.map(id => byId.get(id)) : stops;
    } else {
      const list = filtered();
      $('list-title').textContent = state.view === 'saved' ? 'Your New York afternoon.' : 'The destinations.';
      $('results-count').textContent = `${list.length} destination${list.length===1?'':'s'} · ${list.filter(s=>s.point).length} address pins`;
      results.innerHTML = list.map(s => cardHtml.get(s.id)).join('');
      if (!list.length) {
        $('empty').hidden = false;
        $('empty-message').textContent = state.view === 'saved' ? 'Save a destination to start planning your own circuit.' : 'Try another maker or clear the filters.';
      }
      if (state.selected) {
        const c = document.getElementById('stop-'+state.selected);
        if (c) {c.open=true; c.classList.add('selected');}
      }
      mapStops = list;
    }
    updateSaves(); updateMap(true);
  }
  function reset() {
    $('search').value=''; $('area').value='all'; $('category').value='all'; $('discoveries').checked=false;
    state.selected=null;state.route=null;
  }
  // As in Shanghai, update only the active card and map, never the reading position.
  function activateRoute(id, {showMap=false}={}) {
    const route=routes.find(r=>r.id===id);
    if(state.view!=='routes'||!route)return;
    if(state.route!==id||showMap) {
      state.route=id;state.selected=null;
      results.querySelectorAll('[data-route-card]').forEach(card=>{
        const active=Number(card.dataset.routeCard)===id;
        card.classList.toggle('active',active);
        if(active)card.setAttribute('aria-current','true');else card.removeAttribute('aria-current');
      });
      mapStops=route.all.map(id=>byId.get(id));
      updateMap(true);
    }
    if(showMap&&window.innerWidth<=720)$('map').scrollIntoView({block:'center'});
  }
  function followRouteScroll() {
    if(state.view!=='routes'||state.selected!==null)return;
    const box=results.getBoundingClientRect(),readingLine=box.top+Math.min(100,box.height*.3);
    const cards=[...results.querySelectorAll('[data-route-card]')];
    const atEnd=results.scrollTop+results.clientHeight>=results.scrollHeight-2;
    const card=(atEnd?cards.at(-1):null)||cards.find(card=>{const r=card.getBoundingClientRect();return r.top<=readingLine&&r.bottom>readingLine;})
      ||cards.find(card=>{const r=card.getBoundingClientRect();return r.bottom>box.top&&r.top<box.bottom;});
    if(card)activateRoute(Number(card.dataset.routeCard));
  }
  let routeScrollFrame=0;
  results.addEventListener('scroll',()=>{
    if(routeScrollFrame||state.view!=='routes')return;
    routeScrollFrame=requestAnimationFrame(()=>{routeScrollFrame=0;followRouteScroll();});
  },{passive:true});
  function selectStop(id, focus=true) {
    if (!byId.has(id)) return;
    if (state.view==='routes' || !document.getElementById('stop-'+id)) {state.view='shops'; reset();}
    state.selected=id; render();
    const c=document.getElementById('stop-'+id);
    if(c){results.scrollTop=Math.max(0,c.offsetTop-results.offsetTop);if(focus)c.querySelector('summary').focus({preventScroll:true});}
    const s=byId.get(id);
    if(map&&s.point){fitOnResize=false;map.setView(s.point,16,{animate:false});}
  }
  function routeMarkup(r) {return r.ids.filter(id => byId.get(id).point).map(id => byId.get(id).point);}
  function updateMap(fit) {
    if (!map) return;
    if (routeLine) {map.removeLayer(routeLine);routeLine=null;}
    const r=state.view==='routes'&&routes.find(r=>r.id===state.route);
    if(r&&r.id!==4)routeLine=L.layerGroup([
      L.polyline(routeMarkup(r),{color:'#f7f3eb',weight:7,opacity:1,dashArray:'7 6',interactive:false}),
      L.polyline(routeMarkup(r),{color:'#743c40',weight:4,opacity:1,dashArray:'7 6',interactive:false})
    ]).addTo(map);
    drawPins();
    const p=mapStops.filter(s=>s.point).map(s=>s.point);
    if(fit)fitStops();
    if(!p.length)$('map-status').textContent='No public address pins for this selection. Use the destination’s source link to arrange access.';
    else $('map-status').textContent='Address-level pins, not verified entrances. Open a destination for its floor, access details and directions.';
  }
  function drawPins() {
    if(!map)return; pins.clearLayers();
    const groups=new Map();
    for(const s of mapStops.filter(s=>s.point)) {
      const p=map.project(s.point,map.getZoom());
      // A selected destination must remain individually visible at every zoom.
      const k=s.id===state.selected?`selected-${s.id}`:map.getZoom()<15?`${Math.floor(p.x/38)}:${Math.floor(p.y/38)}`:`stop-${s.id}`;
      if(!groups.has(k))groups.set(k,[]);groups.get(k).push(s);
    }
    for(const group of groups.values()) {
      const cluster=group.length>1,s=group[0];
      const point=cluster?[group.reduce((v,s)=>v+s.point[0],0)/group.length,group.reduce((v,s)=>v+s.point[1],0)/group.length]:s.point;
      const label=cluster?`${group.length} destinations; zoom to explore`:`${s.id}. ${s.name}`;
      const icon=L.divIcon({className:'number-pin'+(!cluster&&s.id===state.selected?' active':''),iconSize:[29,29],iconAnchor:[14,14],html:`<span style="--pin-color:${cluster?'#302d29':colors[s.category]}">${cluster?'+'+group.length:String(s.id).padStart(2,'0')}</span>`});
      const marker=L.marker(point,{icon,title:label,alt:label,keyboard:true,zIndexOffset:s.id===state.selected?1000:0}).addTo(pins);
      if(!cluster&&s.id===state.selected){
        marker.getElement().setAttribute('aria-current','location');
        marker.bindTooltip(`Selected: ${esc(s.name)}`,{permanent:true,direction:'top',offset:[0,-18],className:'selected-pin-label'});
      }
      if(cluster)marker.on('click',()=>{fitOnResize=false;map.fitBounds(group.map(s=>s.point),{padding:[45,45],maxZoom:16,animate:false});});
      else {
        marker.bindPopup(`<strong>${esc(s.name)}</strong><p>${esc(s.address)}</p><p>${esc(s.area)}</p><button type="button" data-open="${s.id}">Read destination →</button>`);
        marker.on('popupopen',e=>{const b=e.popup.getElement().querySelector('[data-open]');if(b)b.onclick=()=>selectStop(s.id);});
      }
    }
  }
  document.querySelectorAll('[data-view]').forEach(b=>b.addEventListener('click',()=>{state.view=b.dataset.view;state.selected=null;state.route=state.view==='routes'?routes[0].id:null;render();results.scrollTo({top:0,behavior:'instant'});}));
  ['search','area','category','discoveries'].forEach(id=>$(id).addEventListener(id==='search'?'input':'change',()=>{state.selected=null;render();}));
  ['reset','empty-reset'].forEach(id=>$(id).onclick=()=>{state.view='shops';reset();render();});
  results.addEventListener('click',e=>{
    const b=e.target.closest('button');if(!b)return;
    if(b.matches('.save')) {
      const id=Number(b.dataset.id);
      saved=saved.includes(id)?saved.filter(v=>v!==id):[...saved,id];
      try{localStorage.setItem(key,JSON.stringify(saved));}catch{storageOK=false;}
      if(state.view==='saved')render();else updateSaves();
    }
    if(b.dataset.open)selectStop(Number(b.dataset.open));
    if(b.dataset.route)activateRoute(Number(b.dataset.route),{showMap:true});
    if(b.dataset.map){const s=byId.get(Number(b.dataset.map));state.selected=s.id;drawPins();if(map&&s.point){fitOnResize=false;map.setView(s.point,17,{animate:false});if(window.innerWidth<721)$('map').scrollIntoView({block:'center'});}}
  });
  results.addEventListener('toggle',e=>{
    if(!e.target.matches('.stop'))return;
    if(!e.target.open){if(state.selected===Number(e.target.dataset.id)){state.selected=null;e.target.classList.remove('selected');drawPins();}return;}
    state.selected=Number(e.target.dataset.id);
    results.querySelectorAll('.stop').forEach(c=>c.classList.toggle('selected',c===e.target));
    drawPins();
    const s=byId.get(state.selected);
    if(map&&s?.point){fitOnResize=false;map.panInside(s.point,{padding:[55,55],animate:false});}
  },true);
  $('fit-map').onclick=()=>updateMap(true);
  $('download').onclick=()=>{
    const text=['STUDY IN SHELL / MY NEW YORK CIRCUIT','Research 12 October; revised 13 October 2026; reconfirm access and hours.','',...saved.map(id=>{const s=byId.get(id);return `${String(id).padStart(2,'0')} / ${s.name}\n${s.address}, ${s.area}\n${s.visit}\n${s.sources[0]}\n`;})].join('\n');
    const u=URL.createObjectURL(new Blob([text],{type:'text/plain;charset=utf-8'}));const a=document.createElement('a');a.href=u;a.download='study-in-shell-my-new-york-circuit.txt';a.click();setTimeout(()=>URL.revokeObjectURL(u),1000);
  };
  $('print').onclick=()=>{const details=[...results.querySelectorAll('details')];const open=details.map(d=>d.open);details.forEach(d=>d.open=true);window.addEventListener('afterprint',()=>details.forEach((d,i)=>d.open=open[i]),{once:true});window.print();};
  render();
  try {
    if(typeof L==='undefined')throw new Error('Map library unavailable');
    $('map').innerHTML='';
    map=L.map('map',{scrollWheelZoom:false,preferCanvas:true,zoomSnap:.25})
      .fitBounds(stops.filter(s=>s.point).map(s=>s.point),{padding:[32,32],maxZoom:16,animate:false});
    pins=L.layerGroup().addTo(map);
    AtlasLocation.attach({map,L,button:$('my-location'),back:$('back-to-circuit'),status:$('location-status'),bounds:[[40.45,-74.3],[40.95,-73.65]],city:'New York',beforeCenter:()=>{fitOnResize=false;},fitCircuit:()=>updateMap(true)});
    let loaded=false;
    const tiles=L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png',{maxZoom:19,attribution:'© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> · Addresses: <a href="https://geosearch.planninglabs.nyc/">NYC Planning</a>'}).addTo(map);
    tiles.on('tileload',()=>{loaded=true;});
    tiles.on('tileerror',()=>{if(!loaded)$('map-status').textContent='Street tiles are unavailable. Address pins and the directory still work; use each destination’s Directions link.';});
    map.on('zoomend',drawPins);
    map.on('dragstart zoomstart',()=>{fitOnResize=false;});
    updateMap(true);
    let resizeFrame;
    const resizeMap=()=>{
      cancelAnimationFrame(resizeFrame);
      resizeFrame=requestAnimationFrame(()=>{
        const refit=fitOnResize;
        map.invalidateSize({pan:true,animate:false});
        if(refit)fitStops();
      });
    };
    if(typeof ResizeObserver!=='undefined')new ResizeObserver(resizeMap).observe($('map'));
    else window.addEventListener('resize',resizeMap);
  } catch {
    $('map-status').textContent='The map could not load. All addresses, source links and directions remain available in the directory.';
    $('fit-map').disabled=true;
    $('my-location').disabled=true;
  }
})();
