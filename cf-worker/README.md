# Anonymous Question Board (Cloudflare Workers + KV)

Minimal, anonymous message board to collect questions during a class. 
Backed by Cloudflare Workers + KV. Frontend polls every few seconds.

Endpoints
- `POST /api/messages` JSON `{ text }` → returns `{ id, ts, text }`
- `GET /api/messages?limit=50&cursor=` → returns `{ items, cursor }`
- `DELETE /api/messages/:id` (admin only, header `Authorization: Bearer <ADMIN_TOKEN>`)

### Likes (KV-based)

- `POST /api/messages/:id/like` → increments like count, returns `{ id, likes, liked: true }`
- `DELETE /api/messages/:id/like` → decrements like count, returns `{ id, likes, liked: false }`
- `GET /api/messages` now includes `likes` per item.

Notes:
- Per-user duplication is limited via a cookie `uid` scoped to the Worker origin. The browser must send credentials to the Worker; see the example front-end in `board.html` using `credentials: 'include'` for like/unlike.
- This simple KV approach is eventually consistent and may drop increments under rare concurrent updates. For strict atomicity, migrate the like counter to Durable Objects or D1.

Quick start
1) Install Wrangler (optional global):
   - `npm i -D wrangler`
2) Create KV namespaces:
   - `npx wrangler kv:namespace create KV`
   - `npx wrangler kv:namespace create KV --preview`
   - Put the returned IDs into `wrangler.toml`.
3) Set admin token (Dashboard → Settings → Variables) or edit `wrangler.toml` dev var.
4) Dev:
   - `npx wrangler dev`
5) Publish:
   - `npx wrangler publish`

Notes
- KV is eventually consistent. A few seconds delay in lists can happen.
- For tighter consistency, consider Durable Objects (not needed for this class). Likes are a good candidate if you expect high concurrency.
- Basic per-IP rate limit via KV with TTL; adjust `RATE_LIMIT_PER_MIN` in code.

Security / CORS
- CORS is restricted to the GitHub Pages origin by default.
- Allowed origins are defined in `src/worker.js` (`ALLOWED_ORIGINS`).
- Note: CORS compares only the "origin" (scheme + host [+ port]). Paths like `/gemini-github-pages/` are not part of the origin.
