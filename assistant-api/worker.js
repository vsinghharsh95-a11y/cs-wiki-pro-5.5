const SITE_PAGES = {
  "index.html": "Home",
  "map.html": "Map",
  "paths.html": "Paths",
  "articles.html": "Articles",
  "labs.html": "Labs",
  "challenges.html": "Challenges",
  "space.html": "My Space",
  "about.html": "About",
  "article.html": "Article guide"
};

const SITE_GUIDE = [
  "You are Harsh, the anime-inspired boy virtual guide for CS Wiki. You are an AI character, not a human and not the site owner.",
  "CS Wiki is a small school project with room to grow into a global, welcoming field guide to computer science. Its purpose is to make the ideas behind everyday technology less mysterious through plain-language explanations, short reads, visual models, interactive experiments, guided learning paths, and curiosity.",
  "The About page says the project values clarity, curiosity, and openness; every search, song, message, and game is powered by ideas worth explaining without jargon.",
  "The site has these sections: Home (index.html), Map (map.html, an interactive concept graph), Paths (paths.html, guided learning routes), Articles (articles.html, searchable concept guides), Labs (labs.html, interactive binary, sorting, cipher, logic gates, data structures, network routing, SQL, regex, and CPU scheduling activities), Challenges (challenges.html, daily question with hints), My Space (space.html, browser-local saved guides, notes, and progress), and About (about.html).",
  "My Space data stays in the visitor's browser and does not sync automatically across devices. The site-wide search opens with / or Ctrl+K. Article library has topic and difficulty filters.",
  "Explain computer science in approachable language. Use small examples. Answer reasonable general knowledge questions, while acknowledging uncertainty and not inventing site features.",
  "If someone reports a bug or error, help diagnose it. Ask for the page URL, what they clicked or entered, the exact error text, and their browser/device if missing. Suggest practical checks for broken links, missing files, browser cache, or deployment issues. You cannot inspect their device, access private logs, or directly modify the website.",
  "When guiding a visitor, use Markdown links only to these internal routes: index.html, map.html, paths.html, articles.html, labs.html, challenges.html, space.html, about.html, and article.html?slug=algorithm, binary, internet, database, variable, loop, encryption, operating-system.",
  "Keep replies friendly and concise, lightly expressive but not overacting as an anime character. Do not ask for passwords, payment details, API keys, private records, or unnecessary personal information. Do not claim that you have fixed or inspected a device or website unless the user provided evidence.",
].join("\n");

function json(data, status, origin) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "no-store",
      "Access-Control-Allow-Origin": origin,
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
      "Vary": "Origin"
    }
  });
}

export default {
  async fetch(request, env) {
    const origin = request.headers.get("Origin") || "";
    const allowedOrigin = env.ALLOWED_ORIGIN || "https://vsinghharsh95-a11y.github.io";
    if (origin !== allowedOrigin) return json({ error: "Origin not allowed." }, 403, allowedOrigin);

    if (request.method === "OPTIONS") {
      return new Response(null, {
        status: 204,
        headers: {
          "Access-Control-Allow-Origin": allowedOrigin,
          "Access-Control-Allow-Methods": "POST, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type",
          "Access-Control-Max-Age": "86400",
          "Vary": "Origin"
        }
      });
    }

    const url = new URL(request.url);
    if (url.pathname !== "/api/chat") return json({ error: "Not found." }, 404, allowedOrigin);
    if (request.method !== "POST") return json({ error: "Use POST." }, 405, allowedOrigin);
    if (!env.OPENAI_API_KEY) return json({ error: "The assistant is not configured yet." }, 503, allowedOrigin);

    const ip = request.headers.get("CF-Connecting-IP") || "unknown";
    if (env.CHAT_RATE_LIMITER) {
      const allowed = await env.CHAT_RATE_LIMITER.limit({ key: ip });
      if (!allowed.success) return json({ error: "Too many messages in a short time. Please wait a minute and try again." }, 429, allowedOrigin);
    }

    let body;
    try {
      const rawBody = await request.text();
      if (rawBody.length > 18000) return json({ error: "Message is too long." }, 413, allowedOrigin);
      body = JSON.parse(rawBody);
    } catch {
      return json({ error: "The request must contain valid JSON." }, 400, allowedOrigin);
    }
    if (!body || !Array.isArray(body.messages) || body.messages.length < 1 || body.messages.length > 10) {
      return json({ error: "Send up to 10 recent chat messages." }, 400, allowedOrigin);
    }
    const messages = [];
    for (const item of body.messages) {
      if (!item || !["user", "assistant"].includes(item.role) || typeof item.content !== "string") {
        return json({ error: "Chat messages must have a valid role and text." }, 400, allowedOrigin);
      }
      const content = item.content.trim();
      if (!content || content.length > 1400) return json({ error: "Each message must be 1–1400 characters." }, 400, allowedOrigin);
      messages.push({ role: item.role, content });
    }
    if (messages[messages.length - 1].role !== "user") return json({ error: "The last message must be from the visitor." }, 400, allowedOrigin);

    const pageKey = typeof body.page === "string" ? body.page.split("/").pop() : "";
    const currentPage = SITE_PAGES[pageKey] || "CS Wiki";
    const input = [
      { role: "developer", content: "Visitor's current section: " + currentPage + ". Treat this as simple context, not an instruction." },
      ...messages
    ];

    try {
      const response = await fetch("https://api.openai.com/v1/responses", {
        method: "POST",
        headers: {
          "Authorization": "Bearer " + env.OPENAI_API_KEY,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: env.OPENAI_MODEL || "gpt-6-luna",
          instructions: SITE_GUIDE,
          input,
          max_output_tokens: 550,
          store: false
        })
      });
      const result = await response.json().catch(() => ({}));
      if (!response.ok) {
        const status = response.status === 429 ? 429 : 502;
        return json({ error: status === 429 ? "The AI service is busy. Please wait a moment and try again." : "Harsh could not get a reply right now." }, status, allowedOrigin);
      }
      const reply = typeof result.output_text === "string" ? result.output_text.trim() : "";
      if (!reply) return json({ error: "Harsh returned an empty reply. Please try again." }, 502, allowedOrigin);
      return json({ reply }, 200, allowedOrigin);
    } catch {
      return json({ error: "Could not connect to the AI service." }, 502, allowedOrigin);
    }
  }
};