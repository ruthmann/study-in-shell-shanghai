// Avoid oversized composited SVG layers in WebKit while the embedded map is laid out.
window.L_DISABLE_3D=true;
window.atlasStartup=(()=>{
 let complete=false;
 const fail=(slow=false)=>{
  if(complete)return;
  const app=document.getElementById('app'),status=document.getElementById('loading-status'),retry=document.getElementById('loading-retry');
  if(!app||!status)return;
  app.inert=false;app.setAttribute('aria-busy','false');
  status.textContent=slow?'The atlas is taking longer than expected.':'The atlas could not finish opening.';
  document.getElementById('loading-note').textContent=slow?'You can keep waiting or reload to try again.':'Please reload to try again.';
  retry.hidden=false;retry.href=location.href;
  document.getElementById('atlas-loading').classList.add('load-failed');
 };
 const timeout=setTimeout(()=>fail(true),15000);
 window.addEventListener('error',event=>{if(event.target===window)fail();});
 return {ready(){complete=true;clearTimeout(timeout);const app=document.getElementById('app');app.removeAttribute('data-loading');app.inert=false;app.setAttribute('aria-busy','false');app.querySelectorAll('[data-startup-inert]').forEach(element=>{element.inert=false;element.removeAttribute('data-startup-inert');});document.getElementById('atlas-loading').hidden=true;},fail};
})();
