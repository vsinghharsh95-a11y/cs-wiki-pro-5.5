(() => {
  const nav = document.querySelector('.navbar');
  const links = nav?.querySelector('.nav-links');
  if (!nav || !links) return;

  const labels = {
    en: {
      skip: 'Skip to main content',
      nav: 'Main navigation',
      language: 'Navigation language',
      theme: 'Toggle color theme',
      menuOpen: 'Open navigation menu',
      menuClose: 'Close navigation menu',
      pages: { home:'Home', map:'Map', paths:'Paths', articles:'Articles', labs:'Labs', challenges:'Challenges', space:'My Space', about:'About' }
    },
    hi: {
      skip: 'मुख्य सामग्री पर जाएँ',
      nav: 'मुख्य नेविगेशन',
      language: 'नेविगेशन की भाषा',
      theme: 'रंग थीम बदलें',
      menuOpen: 'नेविगेशन मेनू खोलें',
      menuClose: 'नेविगेशन मेनू बंद करें',
      pages: { home:'मुख्य पृष्ठ', map:'मानचित्र', paths:'सीखने के रास्ते', articles:'लेख', labs:'प्रयोगशालाएँ', challenges:'चुनौतियाँ', space:'मेरी जगह', about:'परिचय' }
    }
  };

  const menuButton = document.createElement('button');
  menuButton.className = 'global-menu-toggle';
  menuButton.type = 'button';
  menuButton.setAttribute('aria-controls', links.id || 'global-site-navigation');
  menuButton.setAttribute('aria-expanded', 'false');
  menuButton.innerHTML = '<span></span><span></span>';
  links.id = links.id || 'global-site-navigation';
  nav.insertBefore(menuButton, links);

  const languageLabel = document.createElement('label');
  languageLabel.className = 'global-language-control';
  languageLabel.htmlFor = 'global-language';
  languageLabel.innerHTML = '<span></span><select id="global-language"><option value="en">English</option><option value="hi">हिन्दी</option></select>';
  const themeButton = links.querySelector('#theme-btn');
  links.insertBefore(languageLabel, themeButton || null);
  const languageSelect = languageLabel.querySelector('select');

  const skipLink = document.querySelector('.global-skip-link');
  const safelyGetLanguage = () => {
    try {
      const saved = localStorage.getItem('csw-language');
      if (saved === 'en' || saved === 'hi') return saved;
    } catch {}
    return navigator.language?.toLowerCase().startsWith('hi') ? 'hi' : 'en';
  };
  let currentLanguage = safelyGetLanguage();

  function closeMenu(returnFocus) {
    document.body.classList.remove('global-menu-open');
    links.classList.remove('is-open');
    menuButton.setAttribute('aria-expanded', 'false');
    menuButton.setAttribute('aria-label', labels[currentLanguage].menuOpen);
    if (returnFocus) menuButton.focus();
  }
  function applyLanguage(language, persist) {
    currentLanguage = language === 'hi' ? 'hi' : 'en';
    const copy = labels[currentLanguage];
    languageSelect.value = currentLanguage;
    if (persist) {
      try { localStorage.setItem('csw-language', currentLanguage); } catch {}
    }
    nav.setAttribute('aria-label', copy.nav);
    links.querySelectorAll('a[data-page]').forEach((link) => {
      const translated = copy.pages[link.dataset.page];
      if (!translated) return;
      link.textContent = translated;
      link.lang = currentLanguage;
    });
    if (skipLink) {
      skipLink.textContent = copy.skip;
      skipLink.lang = currentLanguage;
    }
    if (themeButton) {
      themeButton.setAttribute('aria-label', copy.theme);
      themeButton.title = copy.theme;
    }
    languageSelect.setAttribute('aria-label', copy.language);
    languageLabel.querySelector('span').textContent = currentLanguage === 'hi' ? 'भाषा' : 'Navigation';
    menuButton.setAttribute('aria-label', document.body.classList.contains('global-menu-open') ? copy.menuClose : copy.menuOpen);
  }

  menuButton.addEventListener('click', () => {
    const open = menuButton.getAttribute('aria-expanded') !== 'true';
    document.body.classList.toggle('global-menu-open', open);
    links.classList.toggle('is-open', open);
    menuButton.setAttribute('aria-expanded', String(open));
    menuButton.setAttribute('aria-label', open ? labels[currentLanguage].menuClose : labels[currentLanguage].menuOpen);
  });
  links.querySelectorAll('a[href]').forEach((link) => link.addEventListener('click', () => closeMenu(false)));
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && menuButton.getAttribute('aria-expanded') === 'true') closeMenu(true);
  });
  document.addEventListener('click', (event) => {
    if (menuButton.getAttribute('aria-expanded') === 'true' && !nav.contains(event.target)) closeMenu(false);
  });
  window.matchMedia('(min-width: 861px)').addEventListener?.('change', (event) => {
    if (event.matches) closeMenu(false);
  });
  languageSelect.addEventListener('change', () => applyLanguage(languageSelect.value, true));
  applyLanguage(currentLanguage, false);

  function addDiagramCaptions() {
    document.querySelectorAll('.article-visual-section .diagram-panel').forEach((panel, index) => {
      if (panel.querySelector('.global-visual-caption')) return;
      const graphic = panel.querySelector('[aria-label]');
      const description = graphic?.getAttribute('aria-label')?.trim();
      if (!description) return;
      const caption = document.createElement('p');
      caption.className = 'global-visual-caption';
      caption.id = 'global-visual-caption-' + (index + 1);
      caption.textContent = description;
      panel.appendChild(caption);
      graphic.setAttribute('aria-describedby', caption.id);
    });
  }
  document.addEventListener('DOMContentLoaded', addDiagramCaptions, { once:true });
  const diagram = document.getElementById('article-diagram');
  if (diagram && 'MutationObserver' in window) {
    new MutationObserver(addDiagramCaptions).observe(diagram, { childList:true, subtree:true });
  }
})();
