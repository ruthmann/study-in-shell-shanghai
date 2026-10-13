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
