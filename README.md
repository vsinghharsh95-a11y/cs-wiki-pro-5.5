# CS Wiki — guided learning edition

A multi-page computer science learning site with a cinematic visual direction, an interactive concept map, guided learning paths, article guides, nine hands-on labs, daily challenges, and a personal learning space.

## Keep this folder structure when uploading

```text
index.html
map.html
paths.html
articles.html
labs.html
challenges.html
space.html
about.html
article.html
css/style.css
css/space.css
js/app.js
js/data.js
js/demos.js
js/advanced-labs.js
js/challenges.js
js/space.js
js/map.js
js/paths.js
js/article.js
js/site.js
```

Keep the `css` and `js` folders beside the HTML files. Do not flatten their contents into the repository root; the pages request assets from those folders.

## Pages

- Home: featured concepts and a shortcut into guided learning
- Map: searchable concept graph with related ideas and article links
- Paths: two curated, step-by-step routes through computer science
- Articles: searchable library plus shareable concept guides with diagrams, examples, a quick check, key terms, and further reading
- Labs: binary, sorting, Caesar cipher, logic gates, stacks and queues, network routing, SQL, regex, and CPU scheduling
- Challenges: one rotating daily question with hints, explanations, optional streaks, and badges
- My Space: reading history, saved guides, private notes, path progress, challenge activity, and data backup
- About: project information

The site is static and can be hosted on GitHub Pages. Bookmarks, reading history, private notes, custom articles, learning-path progress, and challenge activity stay in each visitor's browser. My Space can export and import a personal backup; it does not sync between devices automatically.


## Global access

Point 7 adds a mobile navigation menu, keyboard skip links, visible focus styling, and a site-wide reduced-motion fallback. A navigation-language selector offers English and Hindi labels for the shared navigation and accessibility controls; article and lesson text remains in English. Visual article diagrams with accessible descriptions also show those descriptions as captions.


## Better discovery

Point 8 adds a keyboard-first site search (press `/` or `Ctrl+K` / `⌘K`), topic and difficulty filters in the article library, difficulty labels, and a suggested next lesson based on each visitor's reading history. Search and recommendations run in the browser using the site articles and locally saved custom articles.


## Harsh — virtual site assistant
Harsh is an anime-inspired AI guide that can explain the project, point visitors to pages, answer computer-science questions, and help troubleshoot errors by asking for useful details. He cannot inspect a visitor's device or change the website code. The assistant opens in a docked chat panel on every page. If the API endpoint is not configured yet, the site still answers the built-in questions about the project, site tour, and bug-report details.

### Connect OpenAI replies
GitHub Pages only hosts the static site, so the assistant uses a separate Cloudflare Worker as a private server endpoint. The OpenAI API key belongs in the Worker secret and must never be pasted into a page, JavaScript file, or GitHub repository. The Worker calls the OpenAI Responses API with `store: false`, validates message size and roles, checks the website origin, and applies a per-IP rate limit.

1. Create an OpenAI API key in your OpenAI developer account and make sure API billing/credits are available. Do not share the key in chat or commit it.
2. In a terminal opened in the `assistant-api` folder, run:
   ```text
   npx wrangler login
   npx wrangler deploy
   npx wrangler secret put OPENAI_API_KEY
   ```
   Paste the key only into Wrangler's secret prompt. The secret is stored by Cloudflare, not in this repository.
3. Copy the Worker URL shown by Wrangler and add `/api/chat` to it.
4. In `js/assistant-config.js`, replace the empty value with that public Worker endpoint, for example:
   ```js
   window.CSWIKI_ASSISTANT_ENDPOINT = "https://your-worker.your-account.workers.dev/api/chat";
   ```
5. Commit the config change to GitHub. GitHub Pages will publish it. Harsh will then use the OpenAI API; until that is configured he stays in site-guide mode.

The Worker settings and approximate rate limit are in `assistant-api/wrangler.toml`. If Cloudflare reports that the rate-limit namespace ID is already in use, change it to another unique number before deploying. The endpoint uses the `gpt-6-luna` model by default; change `OPENAI_MODEL` in the Worker config if you choose another available model. Messages are sent to OpenAI for answers, so visitors are told not to include private information.

  
Official setup references: [OpenAI Responses API](https://developers.openai.com/api/reference/responses), [OpenAI model catalog](https://developers.openai.com/api/docs/models/all), [Cloudflare Worker secrets](https://developers.cloudflare.com/workers/configuration/secrets/), and [Cloudflare rate limiting](https://developers.cloudflare.com/workers/runtime-apis/bindings/rate-limit/). The chat history is held only in the open page and sent to the Worker when the visitor asks Harsh something; it is not saved to local storage.
