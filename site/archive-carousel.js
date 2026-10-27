/* Public storefront data only. Refreshes once per page load; never caches availability. */
(() => {
  'use strict';
  const shop = 'https://studyinshell.myshopify.com';
  // Curated footwear handles prevent future non-shoe releases entering this row.
  const handles = [
  "alden-2160-color-8-shell-cordovan-straight-tip-blucher-10-b-d-1",
  "alden-2161-black-shell-cordovan-straight-tip-blucher-10-5-b-d",
  "alden-2259-ravello-shell-cordovan-straight-tip-blucher-10-b-d",
  "solovair-brogue-boot-oxblood-rub-off",
  "tricker-s-stow-5634-24-acorn-antique-calf-owner-patinated-uk-9-5",
  "knutsford-tricker-s-bourton-brown-leather-brogue-derby",
  "alden-913-brown-calf-semi-brogue-oxford-resoled-10-5-c-e",
  "alden-91842y-whiskey-shell-cordovan-george-boot-resoled-10-5-c-e"
];
  const list = document.getElementById('archive-pairs');
  const status = document.getElementById('archive-status');
  const controls = document.querySelector('.archive-controls');
  const prev = document.getElementById('archive-prev');
  const next = document.getElementById('archive-next');
  if (!list) return;
  function updateControls() {
    prev.disabled = list.scrollLeft < 2;
    next.disabled = list.scrollLeft + list.clientWidth >= list.scrollWidth - 2;
  }
  function move(direction) {
    list.scrollBy({left: direction * (list.firstElementChild.getBoundingClientRect().width + 24),
      behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth'});
  }
  prev.addEventListener('click', () => move(-1));
  next.addEventListener('click', () => move(1));
  list.addEventListener('scroll', updateControls, {passive:true});
  window.addEventListener('resize', updateControls);
  list.addEventListener('keydown', event => {
    if (event.target !== list) return;
    if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
      event.preventDefault(); move(event.key === 'ArrowRight' ? 1 : -1);
    }
  });
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 8000);
  status.textContent = 'Checking the current selection…';
  fetch(shop + '/products.json?limit=250', {signal:controller.signal, cache:'no-store', credentials:'omit'})
    .then(response => { if (!response.ok) throw new Error('Store unavailable'); return response.json(); })
    .then(data => {
      if (!Array.isArray(data.products)) throw new Error('Invalid product feed');
      const products = handles.map(handle => data.products.find(p => p.handle === handle))
        .filter(p => p && typeof p.title === 'string' && Array.isArray(p.variants) && p.variants.some(v => v.available === true));
      for (const product of products) {
        const item = document.createElement('li');
        const link = document.createElement('a');
        link.href = shop + '/products/' + encodeURIComponent(product.handle);
        const image = document.createElement('img');
        const src = product.images?.[0]?.src;
        if (typeof src === 'string' && src.startsWith('https://cdn.shopify.com/')) {
          image.src = src; image.alt = ''; image.loading = 'lazy'; image.width = 600; image.height = 600;
          link.append(image);
        }
        const title = document.createElement('h3'); title.textContent = product.title;
        const action = document.createElement('span'); action.className = 'archive-action'; action.textContent = 'View pair ↗';
        link.append(title, action); item.append(link); list.append(item);
      }
      list.hidden = products.length === 0;
      controls.hidden = products.length === 0;
      status.textContent = products.length ? 'Swipe or use the arrows to explore. Availability checked when this page opened.' : 'No featured pairs are available right now. Explore the shop for the latest releases.';
      updateControls();
    })
    .catch(() => { status.textContent = 'The current selection couldn’t load. Explore Archive Drops in the shop.'; })
    .finally(() => clearTimeout(timeout));
})();
