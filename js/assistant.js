/* Harsh — CS Wiki's anime-inspired AI guide */
(() => {
  const endpoint = String(window.CSWIKI_ASSISTANT_ENDPOINT || "").trim();
  const knownPages = {
    "index.html": "Home",
    "map.html": "Map",
    "paths.html": "Paths",
    "articles.html": "Articles",
    "labs.html": "Labs",
    "challenges.html": "Challenges",
    "space.html": "My Space",
    "about.html": "About"
  };
  const knownSlugs = new Set(["algorithm","binary","internet","database","variable","loop","encryption","operating-system"]);
  const currentPage = location.pathname.split("/").pop() || "index.html";
  const pageName = knownPages[currentPage] || (currentPage === "article.html" ? "Article guide" : "CS Wiki");

  function avatar(extraClass) {
    return '<span class="harsh-avatar ' + (extraClass || "") + '" aria-hidden="true"><svg viewBox="0 0 72 72" focusable="false"><defs><linearGradient id="harsh-bg" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#9b55c9"/><stop offset="1" stop-color="#273c60"/></linearGradient><linearGradient id="harsh-hood" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#8850b9"/><stop offset="1" stop-color="#473978"/></linearGradient></defs><circle cx="36" cy="36" r="35" fill="url(#harsh-bg)"/><circle cx="15" cy="16" r="1.4" fill="#fff" opacity=".8"/><circle cx="58" cy="21" r="1" fill="#a8fff2"/><path d="M10 72c2-15 12-23 26-23s24 8 26 23" fill="url(#harsh-hood)"/><path d="M25 50l11 8 11-8 6 22H19z" fill="#34284f"/><path d="M22 28c0-13 6-21 16-21 12 0 18 9 17 22l-3 13c-2 9-9 14-17 14-9 0-15-6-17-16z" fill="#f4c9ad"/><path d="M18 31c-2-16 6-26 19-26 13 0 21 8 20 23l-6-5-2-9-9 6-11-2-5 11-3 5z" fill="#211b30"/><path d="M20 26l-8 4 8 3m34-7 8 4-8 3" fill="#211b30"/><path d="M26 33c2-2 5-2 8 0m6 0c2-2 5-2 8 0" fill="none" stroke="#43283e" stroke-width="2" stroke-linecap="round"/><ellipse cx="30" cy="36" rx="2.5" ry="3.2" fill="#573f83"/><ellipse cx="44" cy="36" rx="2.5" ry="3.2" fill="#573f83"/><circle cx="31" cy="35" r=".8" fill="#fff"/><circle cx="45" cy="35" r=".8" fill="#fff"/><path d="M32 45c3 2 6 2 9 0" fill="none" stroke="#bb6b75" stroke-width="1.7" stroke-linecap="round"/><path d="M17 30l-5 6 8 1m35-7 5 6-8 1" fill="none" stroke="#d5a9ef" stroke-width="1.6"/><path d="M27 59l9 7 9-7" fill="none" stroke="#b0efe4" stroke-width="2"/></svg></span>';
  }

  const launcher = document.createElement("button");
  launcher.className = "harsh-launcher";
  launcher.type = "button";
  launcher.setAttribute("aria-expanded", "false");
  launcher.setAttribute("aria-controls", "harsh-panel");
  launcher.setAttribute("aria-label", "Chat with Harsh, the CS Wiki AI guide");
  launcher.innerHTML = avatar("") + '<span class="harsh-launcher-label"><strong>Ask Harsh</strong><small>CS Wiki guide</small></span><span class="harsh-status-dot" aria-hidden="true"></span>';

  const panel = document.createElement("section");
  panel.id = "harsh-panel";
  panel.className = "harsh-panel";
  panel.setAttribute("role", "dialog");
  panel.setAttribute("aria-modal", "false");
  panel.setAttribute("aria-labelledby", "harsh-name");
  panel.hidden = true;
  panel.innerHTML =
    '<header class="harsh-panel-header">' + avatar("") +
    '<div class="harsh-identity"><strong id="harsh-name">Harsh</strong><span>Your anime-inspired CS Wiki guide</span><span class="harsh-header-status"><i class="harsh-status-dot"></i><span class="harsh-connection-label"></span></span></div>' +
    '<button class="harsh-icon-button harsh-minimize" type="button" aria-label="Minimize chat">−</button><button class="harsh-icon-button harsh-close" type="button" aria-label="Close chat">×</button></header>' +
    '<div class="harsh-welcome"><h2>Hey, I’m Harsh 👋</h2><p>I can show you around CS Wiki, explain why it exists, answer computer science questions, or help you troubleshoot an error.</p></div>' +
    '<div class="harsh-messages" id="harsh-messages" aria-live="polite" aria-relevant="additions"></div>' +
    '<div class="harsh-suggestions" aria-label="Suggested questions"><button class="harsh-suggestion" type="button" data-prompt="Why was CS Wiki created? What inspired it?">Why this site?</button><button class="harsh-suggestion" type="button" data-prompt="Give me a quick tour of this website and tell me where to start.">Tour the site</button><button class="harsh-suggestion" type="button" data-prompt="I need help with a website bug or error.">Help with an error</button></div>' +
    '<form class="harsh-compose"><label class="harsh-visually-hidden" for="harsh-input">Message Harsh</label><textarea id="harsh-input" maxlength="1400" rows="1" placeholder="Ask Harsh anything…" required></textarea><button class="harsh-send" type="submit" aria-label="Send message">↑</button></form>' +
    '<p class="harsh-disclaimer"></p>';

  document.body.append(launcher, panel);
  const messagesEl = panel.querySelector("#harsh-messages");
  const input = panel.querySelector("#harsh-input");
  const form = panel.querySelector(".harsh-compose");
  const sendButton = panel.querySelector(".harsh-send");
  const closeButton = panel.querySelector(".harsh-close");
  const disclaimer = panel.querySelector(".harsh-disclaimer");
  const connectionLabel = panel.querySelector(".harsh-connection-label");
  connectionLabel.textContent = endpoint ? "AI replies connected" : "Site guide mode";
  disclaimer.textContent = endpoint
    ? "Messages go to OpenAI for replies. Don’t share private information; AI answers can be wrong."
    : "AI replies aren’t connected yet. Harsh can still explain the site and help you describe an error. Don’t share private information.";
  const conversation = [];

  function safeLinkTarget(url) {
    if (knownPages[url]) return true;
    const match = url.match(/^article\.html\?slug=([a-z0-9-]+)$/);
    return Boolean(match && knownSlugs.has(match[1]));
  }

  function appendLinkedText(container, text) {
    const pattern = /\[([^\]]{1,90})\]\(([^)\s]{1,150})\)/g;
    let last = 0;
    let match;
    while ((match = pattern.exec(text))) {
      container.append(document.createTextNode(text.slice(last, match.index)));
      if (safeLinkTarget(match[2])) {
        const link = document.createElement("a");
        link.href = match[2];
        link.textContent = match[1];
        container.append(link);
      } else {
        container.append(document.createTextNode(match[0]));
      }
      last = pattern.lastIndex;
    }
    container.append(document.createTextNode(text.slice(last)));
  }

  function addMessage(role, text) {
    const row = document.createElement("div");
    row.className = "harsh-message";
    row.dataset.role = role;
    if (role === "assistant") row.innerHTML = avatar("harsh-message-avatar");
    const bubble = document.createElement("div");
    bubble.className = "harsh-bubble";
    if (role === "assistant") appendLinkedText(bubble, text);
    else bubble.textContent = text;
    row.append(bubble);
    messagesEl.append(row);
    messagesEl.scrollTop = messagesEl.scrollHeight;
  }

  function fallbackAnswer(text) {
    const q = text.toLowerCase();
    if (/why|inspir|purpose|made|created|school project/.test(q)) {
      return "CS Wiki was created to make the ideas behind everyday technology feel less mysterious. It began as a small school project and is meant to grow into a friendly field guide for curious people everywhere: plain-language articles, visual guides, hands-on labs, and paths that make it easier to keep exploring. You can read the full story on [About](about.html).";
    }
    if (/tour|where|guide|start|navigate|website|site/.test(q)) {
      return "Here’s a quick tour:\n• [Home](index.html) is the launchpad.\n• [Map](map.html) shows how ideas connect.\n• [Paths](paths.html) gives you guided learning routes.\n• [Articles](articles.html) is the searchable library.\n• [Labs](labs.html) lets you experiment with nine interactive activities.\n• [Challenges](challenges.html) has a daily question.\n• [My Space](space.html) keeps saved ideas and notes in this browser.\nTry the site-wide search with / or Ctrl+K. Which section should we explore first?";
    }
    if (/bug|error|broken|404|not found|issue|problem|doesn't work|does not work/.test(q)) {
      return "I can help you troubleshoot. Tell me: 1) the page URL, 2) what you clicked or typed, 3) the exact error text (or share a screenshot), and 4) your browser/device. If a page says 404, I’ll help check the link and filename. I can guide you, but I can’t directly inspect your device or change the site code.";
    }
    return "I’m ready to answer general computer-science questions once the site owner connects my OpenAI endpoint. For now, ask me why CS Wiki was made, request a site tour, or tell me what page is showing an error.";
  }

  async function send(text) {
    const value = String(text || "").trim();
    if (!value || sendButton.disabled) return;
    addMessage("user", value);
    conversation.push({ role: "user", content: value });
    input.value = "";
    sendButton.disabled = true;
    const typing = document.createElement("div");
    typing.className = "harsh-typing";
    typing.setAttribute("role", "status");
    typing.textContent = "Harsh is thinking…";
    messagesEl.append(typing);
    messagesEl.scrollTop = messagesEl.scrollHeight;

    try {
      let reply;
      if (!endpoint) {
        await new Promise(resolve => setTimeout(resolve, 350));
        reply = fallbackAnswer(value);
      } else {
        const response = await fetch(endpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            page: currentPage,
            messages: conversation.slice(-10).map(item => ({ role: item.role, content: item.content }))
          })
        });
        const data = await response.json().catch(() => ({}));
        if (!response.ok) throw new Error(data.error || "The assistant request failed.");
        reply = String(data.reply || "").trim();
        if (!reply) throw new Error("Harsh returned an empty reply.");
      }
      typing.remove();
      addMessage("assistant", reply);
      conversation.push({ role: "assistant", content: reply });
    } catch (error) {
      typing.remove();
      const msg = error && error.message === "Failed to fetch"
        ? "I can’t reach the assistant right now. Please check your connection and try again."
        : "I’m having trouble answering right now. Please try again in a moment.";
      addMessage("assistant", msg + " If you’re reporting an error, include the page, steps, and exact message.");
    } finally {
      sendButton.disabled = false;
      input.focus();
    }
  }

  function openChat() {
    panel.hidden = false;
    launcher.setAttribute("aria-expanded", "true");
    input.focus();
    if (!messagesEl.childElementCount) {
      addMessage("assistant", endpoint
        ? "Welcome! I’m Harsh, your CS Wiki guide. Ask why the site was made, explore a section, get a computer-science explanation, or tell me what went wrong."
        : "Welcome! I’m Harsh, your CS Wiki guide. Ask why the site was made, request a tour, or tell me what went wrong. My ChatGPT connection still needs to be set up.");
    }
  }
  function closeChat() {
    panel.hidden = true;
    launcher.setAttribute("aria-expanded", "false");
    launcher.focus();
  }

  launcher.addEventListener("click", () => panel.hidden ? openChat() : closeChat());
  closeButton.addEventListener("click", closeChat);
  panel.querySelector(".harsh-minimize").addEventListener("click", closeChat);
  panel.querySelectorAll(".harsh-suggestion").forEach(button => {
    button.addEventListener("click", () => send(button.dataset.prompt));
  });
  form.addEventListener("submit", event => {
    event.preventDefault();
    send(input.value);
  });
  input.addEventListener("keydown", event => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      form.requestSubmit();
    }
  });
  document.addEventListener("keydown", event => {
    if (event.key === "Escape" && !panel.hidden) closeChat();
  });
})();