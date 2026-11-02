(() => {
  const page = document.body.dataset.page || document.body.className.replace('page-', '');
  if (page === 'map' || page === 'paths' || page === 'challenges' || document.body.classList.contains('page-article')) {
    const themeButton = document.getElementById('theme-btn');
    const storedTheme = localStorage.getItem('csw-theme') || 'dark';
    document.documentElement.setAttribute('data-theme', storedTheme);
    themeButton.textContent = storedTheme === 'light' ? '☀️' : '🌙';
    themeButton.addEventListener('click', () => {
      const nextTheme = document.documentElement.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
      document.documentElement.setAttribute('data-theme', nextTheme);
      localStorage.setItem('csw-theme', nextTheme);
      themeButton.textContent = nextTheme === 'light' ? '☀️' : '🌙';
    });
    const bar = document.getElementById('progress');
    window.addEventListener('scroll', () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      bar.style.width = (max > 0 ? (window.scrollY / max) * 100 : 0) + '%';
    }, { passive:true });
  }
  document.querySelectorAll('.nav-links a[data-page]').forEach((link) => {
    if (link.dataset.page === page) link.setAttribute('aria-current', 'page');
  });
  document.querySelectorAll('a[href$=".html"]').forEach((link) => {
    link.addEventListener('click', (event) => {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      if (link.origin !== location.origin || link.pathname === location.pathname) return;
      if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
      event.preventDefault();
      document.body.classList.add('page-leave');
      setTimeout(() => { location.href = link.href; }, 170);
    });
  });

  // Soft pointer tilt on the artwork. It is disabled for touch and reduced-motion users.
  if (matchMedia('(pointer:fine) and (prefers-reduced-motion: no-preference)').matches) {
    document.querySelectorAll('.scene-card, .topic-tile, .card').forEach((tile) => {
      tile.addEventListener('pointermove', (event) => {
        const box = tile.getBoundingClientRect();
        const x = (event.clientX - box.left) / box.width - .5;
        const y = (event.clientY - box.top) / box.height - .5;
        tile.style.setProperty('--pointer-x', `${(x + .5) * 100}%`);
        tile.style.setProperty('--pointer-y', `${(y + .5) * 100}%`);
      }, { passive:true });
      tile.addEventListener('pointerleave', () => {
        tile.style.removeProperty('--pointer-x');
        tile.style.removeProperty('--pointer-y');
      }, { passive:true });
    });
  }
})();
