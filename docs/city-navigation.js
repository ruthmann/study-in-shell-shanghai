/* Native disclosure works without JavaScript; enhance dismissal without a focus trap. */
(() => {
  const menu = document.querySelector('.city-atlases');
  if (!menu) return;
  const trigger = menu.querySelector('summary');
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && menu.open) {
      menu.open = false;
      if (menu.contains(document.activeElement)) trigger.focus();
    }
  });
  document.addEventListener('click', event => {
    if (!menu.contains(event.target)) menu.open = false;
  });
  document.addEventListener('focusin', event => {
    if (!menu.contains(event.target)) menu.open = false;
  });
  menu.querySelectorAll('a').forEach(link => link.addEventListener('click', () => { menu.open = false; }));
})();
