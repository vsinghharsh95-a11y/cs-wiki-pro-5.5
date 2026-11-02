// ===== 1. ELEMENTS =====
const grid = document.getElementById("grid");
const searchBox = document.getElementById("search");
const difficultyFilter = document.getElementById("difficulty-filter");
const filtersDiv = document.getElementById("filters");
const countEl = document.getElementById("count");
const modal = document.getElementById("modal");
const modalContent = document.getElementById("modal-content");
const closeBtn = document.getElementById("close");
const randomBtn = document.getElementById("random-btn");
const themeBtn = document.getElementById("theme-btn");
const addBtn = document.getElementById("add-btn");
const toast = document.getElementById("toast");
const progress = document.getElementById("progress");

// ===== 2. SAVING DATA IN THE BROWSER (localStorage) =====
function load(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch (e) {
    return fallback;
  }
}

function save(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {}
}

// The built-in articles come from data.js. If that file is missing,
// empty or broken, we use an empty list and show a helpful message
// instead of crashing the whole page.
const builtInArticles = (typeof articles !== "undefined" && Array.isArray(articles)) ? articles : [];
const dataProblem = builtInArticles.length === 0;

let userArticles = load("csw-articles", []);   // articles you add
let bookmarks = load("csw-bookmarks", []);     // ids of saved articles
let activeCategory = "All";
let activeDifficulty = "All";

// built-in articles + your own
function allArticles() {
  return [...builtInArticles, ...userArticles];
}

// ===== 3. HELPERS =====
function articleSlug(article) {
  const base = article.title.toLowerCase().normalize("NFKD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  return article.custom ? base + "-custom-" + article.id : base;
}

function readingTime(article) {
  const words = article.content.join(" ").split(" ").length;
  return Math.max(1, Math.round(words / 200));
}

// makes user text safe, so typed HTML can't break or hack the page
function escapeHtml(text) {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}

// wraps search matches in <mark>
function highlight(text, word) {
  if (!word) return escapeHtml(text);
  const safe = word.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const parts = text.split(new RegExp("(" + safe + ")", "gi"));
  return parts.map(function (part, i) {
    return i % 2 === 1 ? "<mark>" + escapeHtml(part) + "</mark>" : escapeHtml(part);
  }).join("");
}

// small pop-up message at the bottom
let toastTimer;
function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(function () {
    toast.classList.remove("show");
  }, 2200);
}

// ===== 4. THEME (dark / light) =====
function applyTheme(theme) {
  document.documentElement.setAttribute("data-theme", theme);
  themeBtn.textContent = theme === "light" ? "☀️" : "🌙";
  save("csw-theme", theme);
}

themeBtn.addEventListener("click", function () {
  const current = document.documentElement.getAttribute("data-theme");
  applyTheme(current === "light" ? "dark" : "light");
});

applyTheme(load("csw-theme", "dark"));

// ===== 5. ANIMATED COUNTERS =====
const statEls = {
  articles: document.getElementById("stat-articles"),
  categories: document.getElementById("stat-categories"),
  saved: document.getElementById("stat-saved")
};

let statsSeen = false;

function countUp(el, target) {
  const start = Number(el.textContent) || 0;
  const startTime = performance.now();
  const duration = 900;

  function frame(now) {
    const p = Math.min((now - startTime) / duration, 1);
    el.textContent = Math.round(start + (target - start) * p);
    if (p < 1) requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
}

function updateStats() {
  if (!statsSeen) return;   // wait until the user scrolls to the stats
  const list = allArticles();
  countUp(statEls.articles, list.length);
  countUp(statEls.categories, new Set(list.map(a => a.category)).size);
  countUp(statEls.saved, bookmarks.length);
}

// ===== 6. BOOKMARKS =====
function toggleBookmark(id) {
  if (bookmarks.includes(id)) {
    bookmarks = bookmarks.filter(b => b !== id);
    showToast("Removed from saved");
  } else {
    bookmarks.push(id);
    showToast("Saved ★");
  }
  save("csw-bookmarks", bookmarks);
  renderFilters();
  renderCards(false);
  updateStats();
}

// ===== 7. CATEGORY BUTTONS =====
function renderFilters() {
  const categories = ["All", "Saved", ...new Set(allArticles().map(a => a.category))];
  if (!categories.includes(activeCategory)) activeCategory = "All";
  filtersDiv.innerHTML = "";

  for (const cat of categories) {
    const btn = document.createElement("button");
    btn.className = "chip" + (cat === activeCategory ? " active" : "");
    btn.textContent = cat === "Saved" ? "★ Saved (" + bookmarks.length + ")" : cat;
    btn.setAttribute("aria-pressed", String(cat === activeCategory));
    btn.onclick = function () {
      activeCategory = cat;
      renderFilters();
      renderCards(true);
    };
    filtersDiv.appendChild(btn);
  }
}

// ===== 8. ARTICLE CARDS =====
// animate = true plays the fade-in cascade, false just updates quietly
function renderCards(animate) {
  const word = searchBox.value.trim();
  const lower = word.toLowerCase();

  const filtered = allArticles().filter(function (a) {
    const matchesCategory =
      activeCategory === "All" ||
      (activeCategory === "Saved" ? bookmarks.includes(a.id) : a.category === activeCategory);
    const searchableContent = [a.title, a.summary, a.category, ...(Array.isArray(a.content) ? a.content : [])].join(" ").toLowerCase();
    const matchesSearch = searchableContent.includes(lower);
    const matchesDifficulty = activeDifficulty === "All" || (a.difficulty || "Beginner") === activeDifficulty;
    return matchesCategory && matchesSearch && matchesDifficulty;
  });

  countEl.textContent = filtered.length + " of " + allArticles().length + " articles";
  grid.innerHTML = "";

  if (dataProblem && userArticles.length === 0) {
    grid.innerHTML =
      '<p class="empty">The built-in articles did not load.<br>' +
      "Check that <b>js/data.js</b> exists, is saved, and starts with <b>const articles = [</b>.<br>" +
      "Press F12 and open the Console tab to see the exact error.</p>";
    return;
  }

  if (filtered.length === 0) {
    const message = activeCategory === "Saved" && !word
      ? "You haven't saved anything yet. Tap the ☆ on a card."
      : "No articles found. Try a different search.";
    grid.innerHTML = '<p class="empty">' + message + "</p>";
    return;
  }

  filtered.forEach(function (a, index) {
    const saved = bookmarks.includes(a.id);
    const card = document.createElement("div");
    card.className = "card";
    const coverGlyph = ({ Basics: "⌘", Networks: "⌁", Data: "▦", Programming: "</>", Security: "◈", Systems: "◒" })[a.category] || "✳";
    card.dataset.category = String(a.category).toLowerCase().replace(/\s+/g, "-");
    const difficulty = a.difficulty || "Beginner";
    card.dataset.difficulty = difficulty.toLowerCase();

    if (animate) {
      card.style.animationDelay = index * 0.07 + "s";
    } else {
      card.style.animation = "none";
    }

    card.innerHTML =
      '<div class="card-cover" aria-hidden="true"><span>CSW / FIELD NOTES</span><b>' + coverGlyph + '</b><i>№ ' + String(index + 1).padStart(2, "0") + '</i></div>' +
      '<button class="bookmark' + (saved ? " saved" : "") + '" title="Save article" aria-label="' + (saved ? "Remove saved article" : "Save article") + '">' + (saved ? "★" : "☆") + "</button>" +
      '<a class="card-open" href="' + encodeURIComponent(articleSlug(a)) + '">' +
      '<span class="tag">' + escapeHtml(a.category) + "</span>" +
      '<span class="level-tag">' + escapeHtml(difficulty) + "</span>" +
      "<h3>" + highlight(a.title, word) + "</h3>" +
      "<p>" + highlight(a.summary, word) + "</p>" +
      '<span class="time">' + readingTime(a) + " min read</span></a>";

    card.querySelector(".bookmark").onclick = function (e) {
      e.stopPropagation();          // don't also open the article
      toggleBookmark(a.id);
    };

    grid.appendChild(card);
  });
}

// ===== 9. POP-UP (open / close) =====
function openModal() {
  modal.classList.add("open");
  document.body.style.overflow = "hidden";
}

function closeModal() {
  modal.classList.remove("open");
  document.body.style.overflow = "";
}

// ===== 10. ARTICLE READER =====
function openArticle(a) {
  const saved = bookmarks.includes(a.id);

  let html = '<span class="tag">' + escapeHtml(a.category) + "</span>";
  html += "<h2>" + escapeHtml(a.title) + "</h2>";
  html += '<div class="meta">' + readingTime(a) + " min read" + (a.custom ? " · added by you" : "") + "</div>";
  for (const paragraph of a.content) {
    html += "<p>" + escapeHtml(paragraph) + "</p>";
  }
  html += '<div class="actions">';
  html += '<button class="btn-small" id="reader-save">' + (saved ? "★ Saved" : "☆ Save") + "</button>";
  if (a.custom) {
    html += '<button class="btn-small danger" id="reader-delete">Delete</button>';
  }
  html += "</div>";

  modalContent.innerHTML = html;
  openModal();

  document.getElementById("reader-save").onclick = function () {
    toggleBookmark(a.id);
    openArticle(a);   // redraw so the button text updates
  };

  if (a.custom) {
    document.getElementById("reader-delete").onclick = function () {
      if (!confirm("Delete this article?")) return;
      userArticles = userArticles.filter(u => u.id !== a.id);
      bookmarks = bookmarks.filter(b => b !== a.id);
      save("csw-articles", userArticles);
      save("csw-bookmarks", bookmarks);
      closeModal();
      renderFilters();
      renderCards(true);
      updateStats();
      showToast("Article deleted");
    };
  }
}

// ===== 11. "NEW ARTICLE" FORM =====
function openForm() {
  const categories = [...new Set(allArticles().map(a => a.category))];
  const options = categories.map(c => '<option value="' + escapeHtml(c) + '">').join("");

  modalContent.innerHTML =
    "<h2>New article</h2>" +
    '<div class="meta">Add your own page to the wiki</div>' +
    '<form id="article-form">' +
      '<label>Title<input name="title" maxlength="60" required></label>' +
      '<label>Category<input name="category" list="cat-list" maxlength="24" placeholder="e.g. Programming" required></label>' +
      '<datalist id="cat-list">' + options + "</datalist>" +
      '<label>Short summary<input name="summary" maxlength="120" required></label>' +
      '<label>Content <small>(leave a blank line between paragraphs)</small><textarea name="content" rows="7" required></textarea></label>' +
      '<button type="submit" class="btn btn-primary btn-block">Publish article</button>' +
    "</form>";
  openModal();

  document.getElementById("article-form").addEventListener("submit", function (e) {
    e.preventDefault();                       // stop the page from reloading
    const data = new FormData(e.target);

    const title = data.get("title").trim();
    const summary = data.get("summary").trim();
    let category = data.get("category").trim();
    const paragraphs = data.get("content")
      .split(/\n\s*\n/)
      .map(p => p.trim())
      .filter(p => p !== "");

    if (!title || !summary || !category || paragraphs.length === 0) {
      showToast("Please fill in every field");
      return;
    }

    // reuse an existing category if the spelling matches ("programming" -> "Programming")
    const existing = categories.find(c => c.toLowerCase() === category.toLowerCase());
    if (existing) category = existing;

    userArticles.push({
      id: Date.now(),          // a unique number based on the current time
      title: title,
      category: category,
      summary: summary,
      content: paragraphs,
      custom: true
    });
    save("csw-articles", userArticles);

    activeCategory = "All";
    searchBox.value = "";
    closeModal();
    renderFilters();
    renderCards(true);
    updateStats();
    showToast("Article published ✓");
  });
}

// ===== 12. SCROLL EFFECTS =====
// fade elements in when they scroll into view
const observer = new IntersectionObserver(function (entries) {
  entries.forEach(function (entry) {
    if (entry.isIntersecting) {
      entry.target.classList.add("show");
      observer.unobserve(entry.target);
      if (entry.target.classList.contains("stats")) {
        statsSeen = true;
        updateStats();
      }
    }
  });
}, { threshold: 0.2 });

document.querySelectorAll(".reveal").forEach(el => observer.observe(el));

// progress bar at the top
window.addEventListener("scroll", function () {
  const max = document.documentElement.scrollHeight - window.innerHeight;
  progress.style.width = (max > 0 ? (window.scrollY / max) * 100 : 0) + "%";
});

// ===== 13. CONNECT EVERYTHING =====
searchBox.addEventListener("input", function () { renderCards(false); });
if (difficultyFilter) difficultyFilter.addEventListener("change", function () { activeDifficulty = difficultyFilter.value; renderCards(true); });
closeBtn.addEventListener("click", closeModal);
addBtn.addEventListener("click", openForm);

modal.addEventListener("click", function (e) {
  if (e.target === modal) closeModal();
});

document.addEventListener("keydown", function (e) {
  if (e.key === "Escape") closeModal();

  const typing = ["INPUT", "TEXTAREA"].includes(document.activeElement.tagName);
  if (e.key === "/" && !typing) {
    e.preventDefault();
    searchBox.focus();
  }
});

randomBtn.addEventListener("click", function (e) {
  e.preventDefault();
  const list = allArticles();
  if (list.length === 0) { showToast("No articles to show yet"); return; }
  const choice = list[Math.floor(Math.random() * list.length)];
  window.location.href = "" + encodeURIComponent(articleSlug(choice));
});

// ===== 14. START =====
const pageParams = new URLSearchParams(window.location.search);
const sharedSearch = pageParams.get("q");
if (sharedSearch) searchBox.value = sharedSearch;
renderFilters();
renderCards(true);
const sharedArticle = pageParams.get("article");
if (sharedArticle) {
  const articleToOpen = allArticles().find(a => String(a.id) === sharedArticle);
  if (articleToOpen) openArticle(articleToOpen);
}
