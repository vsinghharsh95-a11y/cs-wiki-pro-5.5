(() => {
  const navLinks = document.querySelector('.navbar .nav-links');
  if (!navLinks) return;

  const searchButton = document.createElement('button');
  searchButton.className = 'discovery-search-button';
  searchButton.type = 'button';
  searchButton.setAttribute('aria-haspopup', 'dialog');
  searchButton.setAttribute('aria-label', 'Search concepts and articles. Press slash or Control K.');
  searchButton.innerHTML = '<span class="discovery-search-glyph" aria-hidden="true">⌕</span><span>Search</span><span class="discovery-shortcut" aria-hidden="true">/</span>';
  navLinks.insertBefore(searchButton, navLinks.firstElementChild);

  const dialog = document.createElement('dialog');
  dialog.className = 'discovery-dialog';
  dialog.setAttribute('aria-labelledby', 'discovery-title');
  dialog.innerHTML = '<div class="discovery-dialog-inner">' +
    '<div class="discovery-dialog-head"><span class="discovery-dialog-kicker">CS Wiki / Quick search</span><button class="discovery-dialog-close" type="button" aria-label="Close search">×</button></div>' +
    '<h2 id="discovery-title">Find your next idea.</h2>' +
    '<p class="discovery-dialog-intro">Search article titles, topics, and explanations from anywhere on the site.</p>' +
    '<label class="discovery-search-label" for="discovery-query">Search concepts and articles</label>' +
    '<input class="discovery-search-input" id="discovery-query" type="search" autocomplete="off" placeholder="Try “how the web works” or “binary”">' +
    '<div class="discovery-shortcuts"><span>Open:</span><kbd>/</kbd><span>or</span><kbd>Ctrl</kbd><kbd>K</kbd><span>· Close:</span><kbd>Esc</kbd></div>' +
    '<div class="discovery-results" id="discovery-results" role="list" aria-live="polite" aria-relevant="additions text"></div>' +
    '</div>';
  document.body.appendChild(dialog);

  const queryInput = dialog.querySelector('#discovery-query');
  const resultList = dialog.querySelector('#discovery-results');
  const closeButton = dialog.querySelector('.discovery-dialog-close');

  function esc(value) {
    return String(value == null ? '' : value).replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
  }
  function slugify(value) {
    return String(value || '').toLowerCase().normalize('NFKD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  }
  function articleSlug(item) {
    return item.custom ? slugify(item.title) + '-custom-' + item.id : slugify(item.title);
  }
  function allArticles() {
    const builtIns = typeof articles !== 'undefined' && Array.isArray(articles) ? articles : [];
    let custom = [];
    try {
      const saved = JSON.parse(localStorage.getItem('csw-articles') || '[]');
      if (Array.isArray(saved)) custom = saved;
    } catch {}
    const seen = new Set();
    return [...builtIns, ...custom].filter(item => {
      if (!item || !item.title) return false;
      const key = articleSlug(item);
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }
  function readHistory() {
    try {
      const saved = JSON.parse(localStorage.getItem('csw-reading-history') || '[]');
      return Array.isArray(saved) ? saved : [];
    } catch { return []; }
  }
  function normalized(value) {
    return String(value || '').toLowerCase().normalize('NFKD').replace(/[\u0300-\u036f]/g, '');
  }
  function rank(item, query) {
    if (!query) return 1;
    const title = normalized(item.title);
    const category = normalized(item.category);
    const summary = normalized(item.summary);
    const content = normalized(Array.isArray(item.content) ? item.content.join(' ') : '');
    const haystack = title + ' ' + category + ' ' + summary + ' ' + content;
    const terms = normalized(query).trim().split(/\s+/).filter(Boolean);
    if (!terms.length || !terms.every(term => haystack.includes(term))) return 0;
    let score = 0;
    const q = normalized(query).trim();
    if (title === q) score += 120;
    else if (title.startsWith(q)) score += 85;
    else if (title.includes(q)) score += 60;
    if (category.includes(q)) score += 35;
    if (summary.includes(q)) score += 22;
    if (content.includes(q)) score += 8;
    for (const term of terms) if (title.includes(term)) score += 6;
    return score;
  }
  function suggestions(items) {
    const history = readHistory();
    const recent = history.map(entry => items.find(item => articleSlug(item) === entry.slug)).filter(Boolean);
    const merged = [...recent, ...items];
    const seen = new Set();
    return merged.filter(item => {
      const key = articleSlug(item);
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    }).slice(0, 6);
  }
  function renderResult(item) {
    const slug = encodeURIComponent(articleSlug(item));
    const difficulty = item.difficulty || 'Beginner';
    const content = esc(item.summary || (Array.isArray(item.content) ? item.content[0] : 'Open this guide to explore the idea.'));
    return '<a role="listitem" class="discovery-result" href="article.html?slug=' + slug + '">' +
      '<span class="discovery-result-top"><span>' + esc(item.category || 'Field guide') + '</span><span>' + esc(difficulty) + '</span></span>' +
      '<b>' + esc(item.title) + '</b><small>' + content + '</small></a>';
  }
  function renderResults() {
    const items = allArticles();
    const query = queryInput.value.trim();
    let results;
    if (!query) results = suggestions(items);
    else results = items.map(item => ({item, score:rank(item,query)})).filter(row => row.score > 0).sort((a,b)=>b.score-a.score || a.item.title.localeCompare(b.item.title)).map(row=>row.item).slice(0,8);
    resultList.innerHTML = results.length ? results.map(renderResult).join('') :
      '<p class="discovery-empty">No matching ideas yet. Try a broader topic or a different word.</p>';
    if (!query && results.length) {
      resultList.setAttribute('aria-label', readHistory().length ? 'Recently explored and popular ideas' : 'Popular ideas');
    } else {
      resultList.setAttribute('aria-label', 'Search results');
    }
  }
  function openSearch() {
    if (!dialog.open) {
      queryInput.value = '';
      renderResults();
      if (typeof dialog.showModal === 'function') dialog.showModal();
      else dialog.setAttribute('open', '');
      queryInput.focus();
    }
  }
  function closeSearch() {
    if (typeof dialog.close === 'function' && dialog.open) dialog.close();
    else dialog.removeAttribute('open');
  }

  searchButton.addEventListener('click', openSearch);
  closeButton.addEventListener('click', closeSearch);
  queryInput.addEventListener('input', renderResults);
  dialog.addEventListener('click', event => { if (event.target === dialog) closeSearch(); });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && dialog.open) closeSearch();
  }, true);
  document.addEventListener('keydown', event => {
    const shortcut = (event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k';
    const slash = event.key === '/' && !event.ctrlKey && !event.metaKey && !event.altKey;
    if (!shortcut && !slash) return;
    const active = document.activeElement;
    const typing = active && (['INPUT','TEXTAREA','SELECT'].includes(active.tagName) || active.isContentEditable);
    if (typing) return;
    if (slash) {
      const librarySearch = document.getElementById('search');
      const visible = librarySearch && librarySearch.getClientRects().length > 0;
      if (visible) return;
    }
    event.preventDefault();
    event.stopImmediatePropagation();
    openSearch();
  }, true);
})();
