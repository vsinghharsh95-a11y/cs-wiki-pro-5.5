(() => {
  const storage = {
    name: 'csw-display-name',
    bookmarks: 'csw-bookmarks',
    history: 'csw-reading-history',
    notes: 'csw-notes',
    paths: 'csw-learning-paths',
    challenges: 'csw-daily-challenges-v1',
    articles: 'csw-articles'
  };
  const knownPaths = [
    { id: 'code-foundations', title: 'From zeroes to software', total: 5, next: 'paths.html#path-card-code-foundations' },
    { id: 'web-journey', title: 'How a web page comes alive', total: 5, next: 'paths.html#path-card-web-journey' }
  ];
  const $ = id => document.getElementById(id);
  const read = (key, fallback) => {
    try {
      const value = JSON.parse(localStorage.getItem(key) || 'null');
      return value === null ? fallback : value;
    } catch { return fallback; }
  };
  const readName = () => {
    try { return localStorage.getItem(storage.name) || ''; } catch { return ''; }
  };

  const esc = value => String(value == null ? '' : value).replace(/[&<>"']/g, char => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' }[char]));
  const slugify = value => String(value || '').toLowerCase().normalize('NFKD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  const customArticles = read(storage.articles, []);
  const allArticles = [...(typeof articles !== 'undefined' && Array.isArray(articles) ? articles : []), ...(Array.isArray(customArticles) ? customArticles : [])];
  const articleById = new Map(allArticles.map(item => [String(item.id), item]));
  const articleLink = item => 'article.html?slug=' + encodeURIComponent(item.custom ? slugify(item.title) + '-custom-' + item.id : slugify(item.title));
  const bookmarks = () => {
    const list = read(storage.bookmarks, []);
    return Array.isArray(list) ? list : [];
  };

  function setCount(id, value) {
    $(id).textContent = String(value).padStart(2, '0');
  }

  function renderProfile() {
    const name = readName().trim();
    $('space-name').value = name;
    $('space-greeting').innerHTML = name
      ? 'Welcome back,<br><span class="gradient-text">' + esc(name) + '.</span>'
      : 'Your ideas,<br><span class="gradient-text">all in one place.</span>';
  }

  function renderPath() {
    const saved = read(storage.paths, {});
    const progress = saved && saved.progress && typeof saved.progress === 'object' ? saved.progress : {};
    const doneFor = path => Array.isArray(progress[path.id]) ? [...new Set(progress[path.id])].slice(0, path.total) : [];
    const completed = knownPaths.reduce((sum, path) => sum + doneFor(path).length, 0);
    const total = knownPaths.reduce((sum, path) => sum + path.total, 0);
    const active = knownPaths.find(path => path.id === saved.activePath && doneFor(path).length < path.total);
    const selected = active || knownPaths.find(path => doneFor(path).length > 0) || knownPaths[0];
    const done = doneFor(selected).length;
    const complete = done === selected.total;
    const percent = Math.round(done / selected.total * 100);
    setCount('space-lesson-count', completed);
    $('space-path-content').innerHTML =
      '<div class="space-path-mark" aria-hidden="true"><span>' + (selected.id === 'code-foundations' ? '01' : '02') + '</span><b>' + (selected.id === 'code-foundations' ? '0101' : 'WWW') + '</b><i></i></div>' +
      '<div class="space-path-copy"><span class="space-path-label">' + (active ? 'CURRENT TRAIL' : complete ? 'TRAIL COMPLETE' : completed ? 'RECENT TRAIL' : 'A GOOD PLACE TO BEGIN') + '</span><h3>' + esc(selected.title) + '</h3><p>' + (done ? esc(done + ' of ' + selected.total + ' steps complete. Continue at your own pace.') : 'A guided route is ready when you are. Choose a first step and we’ll keep track here.') + '</p><div class="space-progress-track" role="progressbar" aria-label="' + esc(selected.title) + ' progress" aria-valuemin="0" aria-valuemax="100" aria-valuenow="' + percent + '"><i style="width:' + percent + '%"></i></div><div class="space-progress-caption"><span>' + done + ' / ' + selected.total + ' STEPS</span><span>' + percent + '%</span></div></div>' +
      '<a class="btn btn-primary space-path-button" href="' + selected.next + '">' + (complete ? 'View your trail' : done ? 'Continue the trail' : 'Choose a first step') + ' <span>↗</span></a>' +
      '<div class="space-total-progress"><strong>' + completed + '<i>/' + total + '</i></strong><span>ALL STEPS</span><div class="space-total-track"><i style="width:' + Math.round(completed / total * 100) + '%"></i></div></div>';
  }
  function emptyState(icon, title, copy, href, link) {
    return '<div class="space-empty"><span>' + icon + '</span><div><b>' + title + '</b><p>' + copy + '</p>' + (href ? '<a href="' + href + '">' + link + ' ↗</a>' : '') + '</div></div>';
  }

  function renderList(target, items, kind) {
    if (!items.length) {
      const saved = kind === 'saved';
      target.innerHTML = emptyState(saved ? '☆' : '↗', saved ? 'Your shelf is waiting.' : 'Your story starts here.', saved ? 'Save an article to keep it close for another day.' : 'Open a field guide and it will appear here when you return.', 'articles.html', saved ? 'Browse the library' : 'Explore an idea');
      return;
    }
    target.innerHTML = items.map((item, index) => {
      const label = kind === 'saved' ? 'SAVED GUIDE' : 'LAST EXPLORED';
      let stamp = '';
      if (kind === 'recent' && item.visitedAt) {
        const date = new Date(item.visitedAt);
        if (!Number.isNaN(date.getTime())) stamp = '<small>' + esc(new Intl.DateTimeFormat(undefined, { month:'short', day:'numeric' }).format(date)) + '</small>';
      }
      return '<a class="space-list-item" href="' + esc(articleLink(item)) + '"><span class="space-item-index">' + String(index + 1).padStart(2, '0') + '</span><span class="space-item-copy"><small>' + label + ' · ' + esc(item.category || 'FIELD NOTE') + '</small><b>' + esc(item.title) + '</b><i>' + esc(item.summary || '') + '</i></span>' + stamp + '<span class="space-item-arrow">↗</span></a>';
    }).join('');
  }

  function renderLibrary() {
    const savedItems = bookmarks().map(String).reverse().map(id => articleById.get(id)).filter(Boolean);
    let history = read(storage.history, []);
    if (!Array.isArray(history)) history = [];
    history = history.slice(0, 12);
    const notes = read(storage.notes, {});
    const noteEntries = notes && typeof notes === 'object' && !Array.isArray(notes)
      ? Object.entries(notes).filter(([, note]) => note && typeof note.content === 'string' && note.content.trim())
      : [];
    noteEntries.sort((a, b) => String(b[1].updatedAt || '').localeCompare(String(a[1].updatedAt || '')));
    setCount('space-saved-count', savedItems.length);
    setCount('space-read-count', history.length);
    setCount('space-note-count', noteEntries.length);
    renderList($('space-recent-list'), history, 'recent');
    renderList($('space-saved-list'), savedItems, 'saved');
    if (!noteEntries.length) {
      $('space-notes-list').innerHTML = emptyState('✎', 'A blank page can be a beginning.', 'Add a thought on any article page. Your notes stay in this browser.', 'articles.html', 'Choose a field guide');
      return;
    }
    $('space-notes-list').innerHTML = noteEntries.slice(0, 6).map(([id, note], index) => {
      const item = articleById.get(String(id));
      const href = item ? articleLink(item) + '#private-notes' : 'articles.html';
      let when = 'SAVED NOTE';
      if (note.updatedAt) {
        const date = new Date(note.updatedAt);
        if (!Number.isNaN(date.getTime())) when = new Intl.DateTimeFormat(undefined, { month:'short', day:'numeric' }).format(date);
      }
      return '<a class="space-note-card" href="' + esc(href) + '"><span class="space-note-top"><i>FIELD NOTE / ' + String(index + 1).padStart(2, '0') + '</i><small>' + esc(when) + '</small></span><b>' + esc(note.title || (item && item.title) || 'A thought to keep') + '</b><p>' + esc(note.content) + '</p><span class="space-note-open">OPEN NOTE ↗</span></a>';
    }).join('');
  }

  function utcDate(dayIndex) {
    return new Date(dayIndex * 86400000).toISOString().slice(0, 10);
  }

  function renderPractice() {
    const state = read(storage.challenges, {});
    const completed = Array.isArray(state.completed) ? [...new Set(state.completed)].sort() : [];
    const solved = new Set(completed);
    const today = new Date().toISOString().slice(0, 10);
    const todayIndex = Date.parse(today + 'T00:00:00Z') / 86400000;
    let cursor = solved.has(today) ? todayIndex : solved.has(utcDate(todayIndex - 1)) ? todayIndex - 1 : null;
    let streak = 0;
    if (cursor !== null) {
      while (solved.has(utcDate(cursor))) { streak++; cursor--; }
    }
    setCount('space-challenge-count', completed.length);
    const week = $('space-practice-week');
    week.innerHTML = '';
    for (let offset = 6; offset >= 0; offset--) {
      const date = utcDate(todayIndex - offset);
      const day = document.createElement('span');
      day.className = 'practice-day' + (solved.has(date) ? ' is-solved' : '') + (date === today ? ' is-today' : '');
      day.title = date + (solved.has(date) ? ' · challenge solved' : '');
      day.setAttribute('aria-label', date + (solved.has(date) ? ', challenge solved' : ', no challenge solved'));
      week.appendChild(day);
    }
    $('space-practice-title').textContent = streak ? 'You’re building a learning rhythm.' : 'Keep your curiosity in motion.';
    $('space-practice-copy').textContent = completed.length
      ? completed.length + ' daily ' + (completed.length === 1 ? 'challenge' : 'challenges') + ' solved' + (streak ? ' · ' + streak + '-day current streak.' : ' so far. Your next one is ready.')
      : 'Try a daily question and see what connects.';
    $('space-streak-label').textContent = streak ? streak + (streak === 1 ? ' day' : ' days') + ' in a row · small steps add up.' : 'Your next discovery is one question away.';
  }

  $('space-profile-form').addEventListener('submit', event => {
    event.preventDefault();
    const name = $('space-name').value.trim().slice(0, 36);
    try {
      if (name) localStorage.setItem(storage.name, name);
      else localStorage.removeItem(storage.name);
    } catch {}
    renderProfile();
  });

  const backupDefaults = {
    [storage.bookmarks]: [],
    [storage.history]: [],
    [storage.notes]: {},
    [storage.paths]: { progress:{}, activePath:'' },
    [storage.challenges]: { completed:[] },
    [storage.articles]: []
  };
  const backupKeys = [storage.name, storage.bookmarks, storage.history, storage.notes, storage.paths, storage.challenges, storage.articles];
  $('space-export').addEventListener('click', () => {
    const data = {};
    backupKeys.forEach(key => { data[key] = key === storage.name ? readName() : read(key, backupDefaults[key]); });
    const backup = { format:'cs-wiki-personal-space', version:1, exportedAt:new Date().toISOString(), data };
    const blob = new Blob([JSON.stringify(backup, null, 2)], { type:'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'cs-wiki-space-backup-' + new Date().toISOString().slice(0, 10) + '.json';
    document.body.appendChild(link);
    link.click();
    link.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    $('space-backup-status').textContent = 'Your personal-space backup has been prepared.';
  });
  function isPlainObject(value) {
    return value !== null && typeof value === 'object' && !Array.isArray(value);
  }
  function validImportedValue(key, value) {
    if (key === storage.name) return typeof value === 'string' && value.length <= 36;
    if (key === storage.bookmarks) return Array.isArray(value) && value.length <= 500 && value.every(id => ['string', 'number'].includes(typeof id));
    if (key === storage.history) return Array.isArray(value) && value.length <= 12 && value.every(item => isPlainObject(item) && ['string', 'number'].includes(typeof item.id) && typeof item.title === 'string' && typeof item.slug === 'string');
    if (key === storage.notes) return isPlainObject(value) && Object.keys(value).length <= 500 && Object.values(value).every(note => isPlainObject(note) && typeof note.title === 'string' && typeof note.slug === 'string' && typeof note.content === 'string' && note.content.length <= 5000);
    if (key === storage.paths) return isPlainObject(value) && isPlainObject(value.progress || {}) && (value.activePath === undefined || typeof value.activePath === 'string');
    if (key === storage.challenges) return isPlainObject(value) && Array.isArray(value.completed || []);
    if (key === storage.articles) return Array.isArray(value) && value.length <= 500 && value.every(item => isPlainObject(item) && typeof item.title === 'string' && typeof item.category === 'string' && typeof item.summary === 'string' && Array.isArray(item.content));
    return false;
  }

  $('space-import-file').addEventListener('change', async event => {
    const file = event.target.files && event.target.files[0];
    if (!file) return;
    const status = $('space-backup-status');
    try {
      const backup = JSON.parse(await file.text());
      if (!backup || backup.format !== 'cs-wiki-personal-space' || backup.version !== 1 || !isPlainObject(backup.data)) throw new Error('This file is not a CS Wiki personal-space backup.');
      if (!backupKeys.every(key => Object.prototype.hasOwnProperty.call(backup.data, key) && validImportedValue(key, backup.data[key]))) throw new Error('This backup is incomplete or damaged. Your browser data has not been changed.');
      const accepted = {};
      backupKeys.forEach(key => { accepted[key] = backup.data[key]; });
      if (!window.confirm('Import this backup and replace the personal data currently saved in this browser?')) return;
      backupKeys.forEach(key => localStorage.removeItem(key));
      Object.entries(accepted).forEach(([key, value]) => {
        if (key === storage.name) localStorage.setItem(key, value);
        else localStorage.setItem(key, JSON.stringify(value));
      });
      location.reload();
    } catch (error) {
      status.textContent = error.message || 'The backup could not be read.';
    } finally {
      event.target.value = '';
    }
  });

  renderProfile();
  renderPath();
  renderLibrary();
  renderPractice();
})();
