// Cloudflare Worker: Anonymous Q&A board (KV + polling)
// Endpoints:
//  - POST   /api/messages        { text } -> { id, ts, text }
//  - GET    /api/messages?limit&cursor -> { items, cursor }
//  - DELETE /api/messages/:id    (Authorization: Bearer <ADMIN_TOKEN>)

const MAX_LENGTH = 300; // max chars per post
const RATE_LIMIT_PER_MIN = 5; // per IP per minute
const KEY_PREFIX = 'msg/';
const RATE_PREFIX = 'rate/';
const LIKE_COUNT_PREFIX = 'like/c/'; // like count per message id
const LIKE_USER_PREFIX = 'like/u/';  // per (message id + uid) marker
const MAX_TS = 9999999999999; // for reverse timestamp ordering

// Allow only specific origins (CORS)
const ALLOWED_ORIGINS = [
  // GitHub Pages origin (path部分はCORSには含まれません)
  'https://jonahegashira.github.io',
  // Local development origins
  'http://localhost:5500',
  'http://127.0.0.1:5500',
  // IPv6 loopback/unspecified shown by some local servers
  'http://[::]:5500',
  'http://[::1]:5500',
];

export default {
  async fetch(request, env, ctx) {
    try {
      const url = new URL(request.url);
      // CORS preflight
      if (request.method === 'OPTIONS') return handleOptions(request);

      if (url.pathname === '/api/messages' && request.method === 'POST') {
        const res = await handlePost(request, env);
        return withCORS(request, res);
      }
      if (url.pathname === '/api/messages' && request.method === 'GET') {
        const res = await handleList(request, env);
        return withCORS(request, res);
      }
      // Like endpoints (exact: /api/messages/:id/like)
      if (/^\/api\/messages\/[^/]+\/like$/.test(url.pathname)) {
        const id = url.pathname.split('/')[3];
        if (request.method === 'POST') {
          const res = await handleLike(id, request, env);
          return withCORS(request, res);
        }
        if (request.method === 'DELETE') {
          const res = await handleUnlike(id, request, env);
          return withCORS(request, res);
        }
      }

      // Admin delete (exact: /api/messages/:id)
      if (request.method === 'DELETE' && /^\/api\/messages\/[^/]+$/.test(url.pathname)) {
        const id = url.pathname.split('/')[3];
        const res = await handleDelete(id, request, env);
        return withCORS(request, res);
      }

      return new Response('Not found', { status: 404 });
    } catch (err) {
      return withCORS(request, json({ error: 'internal_error', detail: String(err) }, 500));
    }
  }
}

async function handlePost(request, env) {
  const ip = getIP(request);
  // Basic rate limit per IP using KV with TTL.
  const rateKey = `${RATE_PREFIX}${ip}`;
  let count = 0;
  const rateVal = await env.AIC_LECTURE.get(rateKey);
  if (rateVal) count = parseInt(rateVal, 10) || 0;
  if (count >= RATE_LIMIT_PER_MIN) {
    return json({ error: 'rate_limited', message: 'Too many requests. Please wait a minute.' }, 429);
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return json({ error: 'bad_request', message: 'Expected application/json' }, 400);
  }
  const text = (body?.text ?? '').toString().trim();
  if (!text) return json({ error: 'validation', message: 'text is required' }, 400);
  if (text.length > MAX_LENGTH) return json({ error: 'validation', message: `text must be <= ${MAX_LENGTH} chars` }, 400);

  const ts = Date.now();
  const rev = MAX_TS - ts; // ascending list -> latest first
  const id = `${rev}-${crypto.randomUUID().slice(0, 8)}`;
  const key = `${KEY_PREFIX}${id}`;

  // Store as JSON string. You can add metadata if needed.
  const item = { id, ts, text };
  await env.AIC_LECTURE.put(key, JSON.stringify(item));

  // bump rate key (approx; not atomic, acceptable here)
  await env.AIC_LECTURE.put(rateKey, String(count + 1), { expirationTtl: 60 });

  return json(item, 201, { 'Cache-Control': 'no-store' });
}

async function handleList(request, env) {
  const url = new URL(request.url);
  const limit = clamp(parseInt(url.searchParams.get('limit') || '50', 10), 1, 200);
  const cursor = url.searchParams.get('cursor') || undefined;

  // List keys newest-first thanks to reversed timestamp in key
  const list = await env.AIC_LECTURE.list({ prefix: KEY_PREFIX, limit, cursor });

  // Fetch values in parallel
  const items = await Promise.all(
    list.keys.map(async (k) => {
      const v = await env.AIC_LECTURE.get(k.name);
      if (!v) return null;
      try {
        const obj = JSON.parse(v);
        // Attach like count (best-effort)
        const c = await env.AIC_LECTURE.get(`${LIKE_COUNT_PREFIX}${obj.id}`);
        obj.likes = clamp(parseInt(c || '0', 10), 0, 2_147_483_647);
        return obj;
      } catch {
        return null;
      }
    })
  );

  const filtered = items.filter(Boolean);
  return json({ items: filtered, cursor: list.list_complete ? null : list.cursor }, 200, { 'Cache-Control': 'no-store' });
}

async function handleDelete(id, request, env) {
  const auth = request.headers.get('authorization') || '';
  const token = auth.startsWith('Bearer ') ? auth.slice(7) : '';
  if (!token || token !== (env.ADMIN_TOKEN || '')) return json({ error: 'unauthorized' }, 401);

  if (!id) return json({ error: 'bad_request' }, 400);
  const key = `${KEY_PREFIX}${id}`;
  await env.AIC_LECTURE.delete(key);
  return json({ ok: true });
}

function json(data, status = 200, headers = {}) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'content-type': 'application/json; charset=utf-8',
      ...headers,
    }
  });
}

function handleOptions(request) {
  const origin = request.headers.get('Origin') || '';
  const acrm = request.headers.get('Access-Control-Request-Method');
  // Not a CORS preflight
  if (!origin || !acrm) return new Response(null, { status: 204 });

  if (!isAllowedOrigin(origin)) {
    return new Response(null, { status: 403 });
  }

  const h = new Headers();
  h.set('Access-Control-Allow-Origin', origin);
  h.set('Vary', 'Origin');
  h.set('Access-Control-Allow-Methods', 'GET,POST,DELETE,OPTIONS');
  h.set('Access-Control-Allow-Headers', request.headers.get('Access-Control-Request-Headers') || 'Content-Type, Authorization');
  h.set('Access-Control-Allow-Credentials', 'true');
  h.set('Access-Control-Max-Age', '86400');
  return new Response(null, { status: 204, headers: h });
}

function withCORS(request, res) {
  const origin = request.headers.get('Origin');
  // If no Origin header (e.g. curl), return as-is
  if (!origin) return res;
  if (!isAllowedOrigin(origin)) {
    // Explicitly forbid cross-origin callers not in allowlist
    return new Response('CORS forbidden', { status: 403 });
  }
  const h = new Headers(res.headers);
  h.set('Access-Control-Allow-Origin', origin);
  h.set('Vary', 'Origin');
  h.set('Access-Control-Allow-Methods', 'GET,POST,DELETE,OPTIONS');
  h.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  h.set('Access-Control-Allow-Credentials', 'true');
  return new Response(res.body, { status: res.status, headers: h });
}

function isAllowedOrigin(origin) {
  try {
    const u = new URL(origin);
    const normalized = `${u.protocol}//${u.host}`; // Origin without path
    return ALLOWED_ORIGINS.includes(normalized);
  } catch {
    return false;
  }
}

function getIP(request) {
  return request.headers.get('CF-Connecting-IP')
    || request.headers.get('X-Forwarded-For')
    || '0.0.0.0';
}

function clamp(n, min, max) { return Math.max(min, Math.min(max, isNaN(n) ? min : n)); }

// --- Likes ---
async function handleLike(id, request, env) {
  const { uid, setCookie } = ensureUID(request);
  const countKey = `${LIKE_COUNT_PREFIX}${id}`;
  const userKey = `${LIKE_USER_PREFIX}${id}/${uid}`;

  // Already liked?
  const already = await env.AIC_LECTURE.get(userKey);
  let count = clamp(parseInt(await env.AIC_LECTURE.get(countKey) || '0', 10), 0, 2_147_483_647);
  if (already) {
    const headers = { 'Cache-Control': 'no-store' };
    if (setCookie) headers['Set-Cookie'] = setCookie;
    return json({ id, likes: count, liked: true }, 200, headers);
  }

  await env.AIC_LECTURE.put(userKey, '1');
  count = clamp(count + 1, 0, 2_147_483_647);
  await env.AIC_LECTURE.put(countKey, String(count));
  const headers = { 'Cache-Control': 'no-store' };
  if (setCookie) headers['Set-Cookie'] = setCookie;
  return json({ id, likes: count, liked: true }, 200, headers);
}

async function handleUnlike(id, request, env) {
  const { uid, setCookie } = ensureUID(request);
  const countKey = `${LIKE_COUNT_PREFIX}${id}`;
  const userKey = `${LIKE_USER_PREFIX}${id}/${uid}`;

  const has = await env.AIC_LECTURE.get(userKey);
  let count = clamp(parseInt(await env.AIC_LECTURE.get(countKey) || '0', 10), 0, 2_147_483_647);
  if (!has) {
    const headers = { 'Cache-Control': 'no-store' };
    if (setCookie) headers['Set-Cookie'] = setCookie;
    return json({ id, likes: count, liked: false }, 200, headers);
  }

  await env.AIC_LECTURE.delete(userKey);
  count = Math.max(0, count - 1);
  await env.AIC_LECTURE.put(countKey, String(count));
  const headers = { 'Cache-Control': 'no-store' };
  if (setCookie) headers['Set-Cookie'] = setCookie;
  return json({ id, likes: count, liked: false }, 200, headers);
}

function ensureUID(request) {
  const cookies = parseCookies(request.headers.get('Cookie') || '');
  let uid = cookies['uid'] || '';
  let setCookie = '';
  if (!uid) {
    uid = crypto.randomUUID();
    setCookie = buildUIDCookie(uid, request);
  }
  return { uid, setCookie: setCookie || null };
}

function parseCookies(header) {
  const out = {};
  header.split(';').forEach(part => {
    const i = part.indexOf('=');
    if (i > -1) {
      const k = part.slice(0, i).trim();
      const v = part.slice(i + 1).trim();
      if (k) out[k] = v;
    }
  });
  return out;
}

function buildUIDCookie(uid, request) {
  const origin = request.headers.get('Origin') || '';
  let attrs = ['Path=/', 'Max-Age=31536000'];
  // Cross-site calls from GitHub Pages need SameSite=None; Secure
  if (/^https:\/\//.test(origin)) {
    attrs.push('SameSite=None', 'Secure');
  } else {
    // local dev (same-site) works with Lax
    attrs.push('SameSite=Lax');
  }
  return `uid=${uid}; ${attrs.join('; ')}`;
}
