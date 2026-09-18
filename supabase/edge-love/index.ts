/* ============================================================
   💖 LOVE DROP — Supabase Edge Function "love"
   Poora site + API + proposal pages ek hi function se:
   - GET  /functions/v1/love/            → index.html (boot inject)
   - GET  /functions/v1/love/p/<id>     → proposal page (OG + views)
   - ANY  /functions/v1/love/api/...   → full REST API (18 routes)
   - GET  /functions/v1/love/<asset>   → static files (ld_files/ld_chunks)
   ============================================================ */

const SURL = (Deno.env.get("SUPABASE_URL") || "").replace(/\/$/, "");
const SKEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";

/* ---------- tiny helpers ---------- */
const enc = new TextEncoder();
const dec = new TextDecoder();
const hex = buf => Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, "0")).join("");
const sha256 = async s => hex(await crypto.subtle.digest("SHA-256", enc.encode(String(s))));
const randHex = n => { const a = crypto.getRandomValues(new Uint8Array(n)); return Array.from(a).map(b => b.toString(16).padStart(2, "0")).join(""); };
const b64d = s => Uint8Array.from(atob(s), c => c.charCodeAt(0));
const J = (code, obj) => new Response(JSON.stringify(obj), {
  status: code, headers: { "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-cache" }
});

async function rest(path, opts) {
  const o = opts || {};
  const headers = Object.assign({
    apikey: SKEY, Authorization: "Bearer " + SKEY, "Content-Type": "application/json", Prefer: "return=representation"
  }, o.headers || {});
  const r = await fetch(SURL + "/rest/v1/" + path, Object.assign({}, o, { headers }));
  if (!r.ok) throw new Error("db " + r.status + " " + (await r.text()).slice(0, 200));
  const t = await r.text();
  return t ? JSON.parse(t) : null;
}
async function gunzip(bytes) {
  const st = new Blob([bytes]).stream().pipeThrough(new DecompressionStream("gzip"));
  return new Uint8Array(await new Response(st).arrayBuffer());
}

/* ---------- DB: config / proposals / users / sessions ---------- */
const DEFAULT_PW_HASH = "e4ad93ca07acb8d908a3aa41e920ea4f4ef4f26e7f86cf8291c5db289780a5ae"; // "iloveyou"
async function cfgGet() {
  const rows = await rest("ld_config?id=eq.true&select=val");
  const val = rows && rows[0] && rows[0].val ? rows[0].val : {};
  return { pw: val.pw && val.pw.hash ? val.pw : { salt: "edge", hash: DEFAULT_PW_HASH }, config: val.config || {} };
}
async function cfgSet(cfg) {
  const cur = await cfgGet();
  await rest("ld_config?id=eq.true", { method: "PATCH", body: JSON.stringify({ val: { pw: cur.pw, config: cfg } }) });
}
async function pwSet(pw) {
  const cur = await cfgGet();
  await rest("ld_config?id=eq.true", { method: "PATCH", body: JSON.stringify({ val: { pw, config: cur.config } }) });
}
const q = s => encodeURIComponent(String(s));
async function propGet(id) {
  const rows = await rest("ld_proposals?id=eq." + q(id) + "&select=data");
  return rows && rows[0] ? rows[0].data : null;
}
async function propPut(id, data) {
  await rest("ld_proposals", { method: "POST", headers: { Prefer: "resolution=merge-duplicates,return=representation" }, body: JSON.stringify({ id, data }) });
}
async function propDel(id) { await rest("ld_proposals?id=eq." + q(id), { method: "DELETE" }); }
async function propList() { return await rest("ld_proposals?select=id,data&order=data->>createdAt.desc"); }
async function userGet(sub) {
  const rows = await rest("ld_users?sub=eq." + q(sub) + "&select=data");
  return rows && rows[0] ? rows[0].data : null;
}
async function userPut(sub, data) {
  await rest("ld_users", { method: "POST", headers: { Prefer: "resolution=merge-duplicates,return=representation" }, body: JSON.stringify({ sub, data }) });
}
async function aTokIns(tok, at) {
  await rest("ld_admin_sessions", { method: "POST", body: JSON.stringify({ tok, at }) });
  const rows = await rest("ld_admin_sessions?select=tok,at&order=at.asc");
  if (rows && rows.length > 60) {
    const cut = rows.slice(0, rows.length - 60).map(r => '"' + r.tok + '"').join(",");
    await rest("ld_admin_sessions?tok=in.(" + cut + ")", { method: "DELETE" });
  }
}
async function aTokHas(tok) {
  const rows = await rest("ld_admin_sessions?tok=eq." + q(tok) + "&select=tok");
  return !!(rows && rows.length);
}
async function uTokIns(tok, sub, at) {
  await rest("ld_user_sessions", { method: "POST", body: JSON.stringify({ tok, sub, at }) });
  const rows = await rest("ld_user_sessions?select=tok,at&order=at.asc");
  if (rows && rows.length > 500) {
    const cut = rows.slice(0, rows.length - 500).map(r => '"' + r.tok + '"').join(",");
    await rest("ld_user_sessions?tok=in.(" + cut + ")", { method: "DELETE" });
  }
}
async function uTokGet(tok) {
  const rows = await rest("ld_user_sessions?tok=eq." + q(tok) + "&select=tok,sub");
  return rows && rows[0] ? rows[0].sub : null;
}
async function uTokDel(tok) { await rest("ld_user_sessions?tok=eq." + q(tok), { method: "DELETE" }); }

/* ---------- static files (ld_files + ld_chunks) ---------- */
const CTYPES = {
  "html": "text/html; charset=utf-8", "css": "text/css", "js": "application/javascript",
  "json": "application/json", "webmanifest": "application/manifest+json", "svg": "image/svg+xml",
  "png": "image/png", "woff2": "font/woff2", "txt": "text/plain", "ico": "image/x-icon"
};
const ctypeOf = p => CTYPES[(p.split(".").pop() || "").toLowerCase()] || "application/octet-stream";
async function fileBytes(path) {
  const rows = await rest("ld_files?path=eq." + q(path) + "&select=content,b64,gz");
  if (rows && rows[0]) {
    const r = rows[0];
    if (!r.b64) return enc.encode(r.content);
    let bytes = b64d(r.content);
    if (r.gz) bytes = await gunzip(bytes);
    return bytes;
  }
  const ch = await rest("ld_chunks?path=eq." + q(path) + "&order=seq.asc&select=content");
  if (ch && ch.length) return b64d(ch.map(c => c.content).join(""));
  return null;
}

/* ---------- config sanitize (server.js se port) ---------- */
const STRIP = ["pw"];
const UA = {};
function sStr(v, max) { return typeof v === "string" ? v.replace(/[<>]/g, "").slice(0, max) : undefined }
function sanitizeCfg(c) {
  if (!c || typeof c !== "object") return {};
  const out = {};
  const cl = (v, a, b) => { const n = Number(v); return isNaN(n) ? undefined : Math.max(a, Math.min(b, n)) };
  const strMap = { herName: 60, hisName: 60, herNick: 40, hisNick: 40, coupleHash: 60, firstMeet: 20, anniversary: 20, song: 80,
    zHer: 20, zHis: 20, introTitle: 120, introSub: 200, finalQ: 300, finalSub: 200, yesLabel: 30, noLabel: 30, noReplies: 600,
    afterYes: 60, afterYesMsg: 600, letter: 2000, reasons: 1500, signature: 80, customGiftTitle: 80, customGiftMsg: 600, eggRewardMsg: 120,
    changelog: 300, credits: 120, audioUrl: 400, shareMsg: 200, favVideo: 60 };
  for (const k in strMap) { const v = sStr(c[k], strMap[k]); if (v !== undefined && v !== "") out[k] = v }
  ["photo1", "photo2", "bgImage", "audioData", "voiceData"].forEach(k => {
    const v = c[k]; if (typeof v === "string" && v.startsWith("data:") && v.length < 1600000) out[k] = v;
  });
  const numMap = { density: [10, 150], speed: [.2, 2.5], radius: [0, 40], blur: [0, 30], confetti: [0, 300], fireworks: [0, 20],
    typeSpeed: [10, 150], fxScale: [.5, 2], volume: [0, 1], catchTarget: [5, 50], memPairs: [3, 6], popTime: [10, 90],
    popTarget: [5, 60], wheelSpeed: [.5, 2], idleSecs: [15, 120], demoSpeed: [.5, 3], animSpeed: [.5, 2] };
  for (const k in numMap) { const v = cl(c[k], numMap[k][0], numMap[k][1]); if (v !== undefined) out[k] = v }
  ["trail", "clickHearts", "emojiRain", "shake", "flash", "heartRain", "glow", "music", "sfx", "showScores", "reopenGifts",
   "showRarity", "eggHints", "konamiOn", "idleOn", "showEggCounter", "lockAfterDemo", "autoplayDemo", "videoAfterYes",
   "nameFireworks", "typingDots", "loadScreen", "autoQuality", "spoilerLock", "timeGreet", "ogBlind", "haptics"].forEach(k => { if (typeof c[k] === "boolean") out[k] = c[k] });
  if (typeof c.theme === "string" && /^[a-z]{3,12}$/.test(c.theme)) out.theme = c.theme;
  if (typeof c.font === "string" && /^(seg|georgia|nunito|mono)$/.test(c.font)) out.font = c.font;
  if (c.tune === 0 || c.tune === 1 || c.tune === 2) out.tune = c.tune;
  if (c.musicSource === "synth" || c.musicSource === "custom") out.musicSource = c.musicSource;
  if (Array.isArray(c.quiz)) {
    out.quiz = c.quiz.slice(0, 8).map(x => ({
      q: sStr(x && x.q, 300) || "",
      o: Array.isArray(x && x.o) ? x.o.slice(0, 4).map(y => sStr(y, 120) || "") : [],
      r: Array.isArray(x && x.r) ? x.r.slice(0, 3).map(y => sStr(y, 120) || "") : []
    })).filter(x => x.q);
  }
  return out;
}
const pubCfg = c => { const o = Object.assign({}, c || {}); STRIP.forEach(k => delete o[k]); return o };
const merge = (a, b) => { const o = Object.assign({}, a); for (const k in (b || {})) if (b[k] !== undefined && b[k] !== null) o[k] = b[k]; return o };
async function verifyGoogle(cred) {
  try { const r = await fetch("https://oauth2.googleapis.com/tokeninfo?id_token=" + encodeURIComponent(cred)); return await r.json(); }
  catch (e) { return null }
}
const ADMIN_EMAIL = "lovertoxicdevil@gmail.com";
const bearer = req => { const h = req.headers.get("authorization") || ""; return h.startsWith("Bearer ") ? h.slice(7).trim() : ""; };
const body = async req => { try { return JSON.parse(await req.text() || "{}") } catch (e) { return {} } };
function ipOf(req) { return (req.headers.get("x-forwarded-for") || "?").split(",")[0].trim(); }
function allowCreate(ip) {
  const now = Date.now(), a = UA[ip] || (UA[ip] = { n: 0, t0: now });
  if (now - a.t0 > 3600000) { a.n = 0; a.t0 = now }
  if (a.n >= 8) return false; a.n++; return true;
}
async function auth(req) { const t = bearer(req); return !!(t && await aTokHas(await sha256(t))); }
async function newToken() { const t = randHex(24); await aTokIns(await sha256(t), Date.now()); return t; }
async function newUserToken(sub) { const t = randHex(24); await uTokIns(await sha256(t), sub, Date.now()); return t; }
async function authUser(req) {
  const t = bearer(req); if (!t) return null;
  const sub = await uTokGet(await sha256(t)); if (!sub) return null;
  const user = await userGet(sub); if (!user) return null;
  return { sub, user, token: t };
}
async function ownProposal(req, pr) { if (!pr || !pr.uid) return false; const u = await authUser(req); return !!(u && u.sub === pr.uid); }

/* ---------- pages (index + /p/:id) ---------- */
const H = (code, html, extra) => new Response(html, {
  status: code, headers: Object.assign({ "Content-Type": "text/html; charset=utf-8", "Cache-Control": "no-cache" }, extra || {})
});
const AMP = String.fromCharCode(38), QUOT = String.fromCharCode(34);
const esc = x => String(x == null ? "" : x).split(AMP).join(AMP + "amp;").split("<").join(AMP + "lt;").split(">").join(AMP + "gt;").split(QUOT).join(AMP + "quot;");
function ogMeta(origin, fnPath, title, desc) {
  return '<meta property="og:title" content="' + esc(title) + '"/>' +
    '<meta property="og:description" content="' + esc(desc) + '"/>' +
    '<meta property="og:image" content="' + origin + fnPath + '/icons/og-card.png"/>' +
    '<meta property="og:image:width" content="1200"/><meta property="og:image:height" content="630"/>' +
    '<meta property="og:type" content="website"/>' +
    '<meta name="twitter:card" content="summary_large_image"/>' +
    '<meta name="twitter:title" content="' + esc(title) + '"/>' +
    '<meta name="twitter:description" content="' + esc(desc) + '"/>' +
    '<meta name="twitter:image" content="' + origin + fnPath + '/icons/og-card.png"/>';
}
function expiredPage(kind, herName, fnPath) {
  const t = kind === "limit"
    ? ["🔒 Ye link apni view limit poori kar chuka hai", "Privacy ke liye link ab band ho gaya hai — agar tumhe access chahiye toh creator se naya link maango 💬"]
    : ["⏰ Ye link expire ho gaya", "Is proposal ka time limit khatam ho gaya — creator se fresh link maango 💬"];
  return "<!doctype html><html><head><meta charset='utf-8'><meta name='viewport' content='width=device-width,initial-scale=1'>" +
    "<title>" + (herName ? herName + " ke liye — " : "") + "Link expire</title>" +
    "<style>body{margin:0;min-height:100vh;display:flex;align-items:center;justify-content:center;font-family:system-ui,-apple-system,sans-serif;" +
    "background:linear-gradient(160deg,#12030f,#3f0d24);color:#fff;text-align:center;padding:24px;box-sizing:border-box}" +
    ".c{max-width:420px}.e{font-size:64px;margin-bottom:8px}h1{font-size:22px;line-height:1.4;margin:8px 0}" +
    "p{color:rgba(255,255,255,.65);font-size:15px;line-height:1.6}" +
    ".b{display:inline-block;margin-top:22px;padding:12px 26px;border-radius:14px;background:#ff4d6d;color:#fff;text-decoration:none;font-weight:700}</style></head>" +
    "<body><div class='c'><div class='e'>" + (kind === "limit" ? "🔒" : "⏰") + "</div><h1>" + t[0] + (herName ? " — " + herName + " ke liye" : "") + "</h1><p>" + t[1] +
    "</p><a class='b' href='" + fnPath + "/'>💜 Love Drop kholo</a></div></body></html>";
}
async function servePage(req, fnPath, pid) {
  const proto = (req.headers.get("x-forwarded-proto") || new URL(req.url).protocol.replace(":", "") || "https");
  const origin = proto + "://" + (new URL(req.url).host || req.headers.get("x-forwarded-host") || "");
  const DB = await cfgGet();
  let boot = { mode: "server", pid: pid || null, adminEmail: ADMIN_EMAIL, gClientId: DB.config.gClientId || "", config: pubCfg(DB.config) };
  let og = null;
  if (pid) {
    const pr = await propGet(pid);
    if (!pr) return H(404, "Ye proposal link exist nahi karta 🤔");
    const her = pr.config && pr.config.herName || "";
    if (pr.exp && Date.now() > pr.exp) return H(410, expiredPage("expire", her, fnPath));
    if (pr.vl > 0 && (pr.views || 0) >= pr.vl) return H(410, expiredPage("limit", her, fnPath));
    pr.views = (pr.views || 0) + 1; pr.lastOpened = Date.now();
    await propPut(pid, pr);
    const ownCfg = pr.config ? merge(pubCfg(DB.config), sanitizeCfg(pr.config)) : pubCfg(DB.config);
    og = DB.config.ogBlind
      ? { title: "Kisi ne tumhe kuch bheja hai", desc: "Khol ke dekho na" }
      : { title: her ? her + " ke liye kuch hai" : "Tumhare liye kuch hai",
          desc: (pr.config && pr.config.finalQ) ? pr.config.finalQ : "Ek chhota sa surprise. Kholo?" };
    boot = { mode: "server", pid, adminEmail: ADMIN_EMAIL, gClientId: DB.config.gClientId || "",
      config: pubCfg(DB.config), proposal: { id: pid, own: !!pr.config, config: ownCfg, views: pr.views } };
  }
  const bytes = await fileBytes("index.html");
  if (!bytes) return H(500, "index.html missing in DB");
  let html = dec.decode(bytes);
  const baseTag = '<base href="' + origin + fnPath + '/">';
  html = html.replace("<head>", "<head>" + baseTag);
  if (og && og.title) html = html.replace("<head>", "<head>" + ogMeta(origin, fnPath, og.title, og.desc || "")).replace(/<title>[^<]*<\/title>/, "<title>" + esc(og.title) + "</title>");
  const inject = "<script>window.__SRV_BOOT__=" + JSON.stringify(boot).replace(/</g, "\\u003c") + ";</script>";
  html = html.replace('<script src="js/app.js"></script>', inject + '<script src="js/app.js"></script>');
  return H(200, html);
}

/* ---------- API router (api.mjs ka port) ---------- */
async function api(req, tail, url) {
  const M = req.method;
  const p = "/" + tail.slice(4);
  try {
    if (M === "GET" && p === "/boot") {
      const pid = url.searchParams.get("p");
      const DB = await cfgGet();
      if (pid) {
        const pr = await propGet(pid);
        if (!pr) return J(404, { err: "proposal not found" });
        return J(200, { mode: "server", adminEmail: ADMIN_EMAIL, gClientId: DB.config.gClientId || "",
          config: pubCfg(DB.config), proposal: { id: pid, config: pubCfg(DB.config), views: pr.views } });
      }
      return J(200, { mode: "server", adminEmail: ADMIN_EMAIL, gClientId: DB.config.gClientId || "", config: pubCfg(DB.config) });
    }
    if (M === "POST" && p === "/login") {
      const b = await body(req);
      if (b.credential) {
        const info = await verifyGoogle(b.credential);
        if (!info || !info.email) return J(401, { ok: false, msg: "Google verification fail — dobara try karo" });
        if ((info.email || "").toLowerCase() !== ADMIN_EMAIL) return J(403, { ok: false, msg: "Ye Google account owner ka nahi hai 😎" });
        return J(200, { ok: true, token: await newToken(), user: { email: info.email.toLowerCase(), name: info.name || info.email, picture: info.picture || null } });
      }
      const DB = await cfgGet();
      const em = (b.email || "").toLowerCase().trim(), pw = String(b.pw || "");
      if (em !== ADMIN_EMAIL) return J(403, { ok: false, msg: "Galat email — sirf owner allowed hai" });
      if (await sha256(pw) !== DB.pw.hash) return J(401, { ok: false, msg: "Galat password 😅" });
      return J(200, { ok: true, token: await newToken() });
    }
    if (M === "POST" && p === "/answer") {
      const b = await body(req);
      const pr = await propGet(b.pid || "");
      if (!pr) return J(404, { ok: false });
      if (typeof b.answer !== "undefined") { pr.answer = b.answer === "yes" ? "yes" : "no"; pr.answeredAt = Date.now(); pr.dodges = Math.max(0, b.dodges | 0); }
      if (typeof b.reply === "string" && b.reply.trim()) { pr.reply = b.reply.trim().replace(/[<>]/g, "").slice(0, 500); pr.repliedAt = Date.now(); }
      await propPut(b.pid, pr);
      return J(200, { ok: true });
    }
    if (M === "POST" && p === "/user/login") {
      const b = await body(req);
      const info = await verifyGoogle(b.credential || "");
      if (!info || !info.email || !info.sub || info.email_verified === "false")
        return J(401, { ok: false, msg: "Google verification fail — dobara try karo" });
      const email = String(info.email).toLowerCase();
      if (email === ADMIN_EMAIL) return J(403, { ok: false, msg: "Ye admin account hai — Admin panel se login karo 👑" });
      const DB = await cfgGet();
      const gcid = DB.config.gClientId || "";
      if (gcid && info.aud !== gcid) return J(401, { ok: false, msg: "Ye app ke liye valid Google token nahi hai" });
      const sub = String(info.sub);
      const pic = (typeof info.picture === "string" && info.picture.startsWith("https://")) ? info.picture.slice(0, 300) : null;
      const prev = await userGet(sub) || {};
      const user = Object.assign({}, prev, { sub, email, name: sStr(info.name, 80) || email, picture: pic || prev.picture || null, lastLogin: Date.now() });
      await userPut(sub, user);
      let claimed = 0;
      if (Array.isArray(b.claim)) for (const c of b.claim) {
        const pr = c && await propGet(c.id);
        if (pr && pr.code && pr.code === String(c.code || "").trim()) { pr.uid = sub; await propPut(c.id, pr); claimed++ }
      }
      const t = await newUserToken(sub);
      return J(200, { ok: true, token: t, user: { email, name: user.name, picture: user.picture }, claimed });
    }
    if (M === "POST" && p === "/user/logout") {
      const t = bearer(req);
      if (t) await uTokDel(await sha256(t));
      return J(200, { ok: true });
    }
    if (M === "GET" && p === "/user/me") {
      const u = await authUser(req);
      if (!u) return J(401, { ok: false, msg: "sign in required" });
      const all = await propList();
      const mine = all.filter(r => r.data && r.data.uid === u.sub)
        .map(r => ({ id: r.id, views: r.data.views || 0, lastOpened: r.data.lastOpened || null, answer: r.data.answer || null,
          answeredAt: r.data.answeredAt || null, dodges: r.data.dodges || 0, reply: r.data.reply || null, repliedAt: r.data.repliedAt || null,
          createdAt: r.data.createdAt, exp: r.data.exp || 0, vl: r.data.vl || 0, config: r.data.config || {} }))
        .sort((a, b) => b.createdAt - a.createdAt);
      return J(200, { ok: true, user: { email: u.user.email, name: u.user.name, picture: u.user.picture }, proposals: mine });
    }
    if (M === "POST" && p === "/user/create") {
      const ip = ipOf(req);
      if (!allowCreate(ip)) return J(429, { ok: false, msg: "Bahut zyada proposals! Thodi der baad try karo 🙏" });
      const b = await body(req);
      const cfg = sanitizeCfg(b.config || {});
      if (!cfg.herName || !cfg.finalQ) return J(400, { ok: false, msg: "Naam aur sawaal zaroori hai 💕" });
      const id = "prop-" + randHex(4);
      const code = randHex(4);
      const EXP = { "24h": 864e5, "3d": 2592e5, "7d": 6048e5 };
      const expIn = EXP[b.expiresIn] || 0;
      let vl = parseInt(b.viewLimit, 10); if (!Number.isFinite(vl) || vl < 0) vl = 0; if (vl > 50) vl = 50;
      const u = await authUser(req);
      await propPut(id, { owner: "user", uid: u ? u.sub : null, code, config: cfg, createdAt: Date.now(), views: 0, lastOpened: null, answer: null, answeredAt: null, dodges: 0, reply: null, repliedAt: null, exp: expIn ? Date.now() + expIn : 0, vl });
      return J(200, { ok: true, id, code, savedToAccount: !!u, url: "/p/" + id });
    }
    if (M === "POST" && p === "/user/limits") {
      const b = await body(req);
      const pr = await propGet(b.id || "");
      if (!pr) return J(404, { ok: false, msg: "Proposal nahi mila 😕" });
      if (!(await ownProposal(req, pr) || (pr.code && pr.code === String(b.code || "").trim()))) return J(403, { ok: false, msg: "Not allowed" });
      const EXP = { "24h": 864e5, "3d": 2592e5, "7d": 6048e5 };
      const expIn = EXP[b.expIn] || 0;
      let vl = parseInt(b.viewLimit, 10); if (!Number.isFinite(vl) || vl < 0) vl = 0; if (vl > 50) vl = 50;
      pr.exp = expIn ? Date.now() + expIn : 0; pr.vl = vl;
      await propPut(b.id, pr);
      return J(200, { ok: true, exp: pr.exp, vl: pr.vl });
    }
    if (M === "POST" && p === "/user/manage") {
      const b = await body(req);
      const pr = await propGet(b.id || "");
      if (!pr || !pr.code) return J(404, { ok: false, msg: "Proposal nahi mila 😕" });
      if (!(await ownProposal(req, pr) || pr.code === String(b.code || "").trim())) return J(403, { ok: false, msg: "Galat manage code 🔐" });
      return J(200, { ok: true, proposal: { id: b.id, views: pr.views || 0, lastOpened: pr.lastOpened, answer: pr.answer,
        dodges: pr.dodges || 0, reply: pr.reply || null, repliedAt: pr.repliedAt || null, createdAt: pr.createdAt, exp: pr.exp || 0, vl: pr.vl || 0, config: pr.config || {} } });
    }
    if (M === "POST" && p === "/user/update") {
      const b = await body(req);
      const pr = await propGet(b.id || "");
      if (!pr) return J(404, { ok: false, msg: "Proposal nahi mila 😕" });
      if (!(await ownProposal(req, pr) || (pr.code && pr.code === String(b.code || "").trim()))) return J(403, { ok: false, msg: "Not allowed" });
      const cfg = sanitizeCfg(b.config || {});
      if (!cfg.herName || !cfg.finalQ) return J(400, { ok: false, msg: "Naam aur sawaal zaroori hai" });
      pr.config = cfg; await propPut(b.id, pr);
      return J(200, { ok: true });
    }
    if (M === "POST" && p === "/user/delete") {
      const b = await body(req);
      const pr = await propGet(b.id || "");
      if (!pr) return J(404, { ok: false, msg: "Proposal nahi mila 😕" });
      if (!(await ownProposal(req, pr) || (pr.code && pr.code === String(b.code || "").trim()))) return J(403, { ok: false, msg: "Not allowed" });
      await propDel(b.id);
      return J(200, { ok: true });
    }
    /* ---- ADMIN ---- */
    if (!(await auth(req))) return J(401, { ok: false, msg: "auth required" });
    if (M === "GET" && p === "/admin/state") {
      const all = await propList();
      const DB = await cfgGet();
      const own = all.filter(r => !(r.data || {}).owner || r.data.owner !== "user")
        .map(r => Object.assign({ id: r.id }, r.data))
        .sort((a, b) => b.createdAt - a.createdAt);
      const totals = { proposals: all.length, yes: all.filter(r => (r.data || {}).answer === "yes").length,
        views: all.reduce((s, r) => s + ((r.data || {}).views || 0), 0), replies: all.filter(r => (r.data || {}).reply).length };
      return J(200, { ok: true, adminEmail: ADMIN_EMAIL, config: DB.config, ownProposals: own, totals, serverTime: Date.now() });
    }
    if (M === "POST" && p === "/admin/config") {
      const b = await body(req);
      const c = b.config || {}; STRIP.forEach(k => delete c[k]);
      const DB = await cfgGet();
      await cfgSet(merge(DB.config, c));
      return J(200, { ok: true });
    }
    if (M === "POST" && p === "/admin/pw") {
      const b = await body(req);
      const DB = await cfgGet();
      if (await sha256(String(b.old || "")) !== DB.pw.hash) return J(401, { ok: false, msg: "Purana password galat" });
      if (String(b.new || "").length < 4) return J(400, { ok: false, msg: "Naya password kam se kam 4 characters" });
      await pwSet({ salt: randHex(8), hash: await sha256(String(b.new)) });
      return J(200, { ok: true });
    }
    if (M === "POST" && p === "/admin/link") {
      const b = await body(req);
      let want = String(b.id || "");
      if (want && !/^[A-Za-z0-9-]{3,40}$/.test(want)) return J(400, { ok: false, msg: "bad id" });
      if (want && await propGet(want)) return J(200, { ok: true, id: want, url: "/p/" + want, existing: true });
      const id = want || ("jaan-" + randHex(3));
      await propPut(id, { createdAt: Date.now(), views: 0, lastOpened: null, answer: null, answeredAt: null, dodges: 0, reply: null });
      return J(200, { ok: true, id, url: "/p/" + id });
    }
    if (M === "GET" && p === "/admin/export") {
      const all = await propList();
      const own = {};
      all.forEach(r => { if (!(r.data || {}).owner || r.data.owner !== "user") own[r.id] = r.data });
      const userCount = all.length - Object.keys(own).length;
      const DB = await cfgGet();
      return J(200, { ok: true, exportedAt: Date.now(), config: DB.config || {}, proposals: own, userProposalCount: userCount, note: "user proposals privacy ke liye excluded hain" });
    }
    if (M === "POST" && p === "/admin/import") {
      const b = await body(req);
      const DB = await cfgGet();
      if (b.config) { const c = b.config; STRIP.forEach(k => delete c[k]); await cfgSet(merge(DB.config, c)) }
      if (b.proposals && typeof b.proposals === "object") {
        for (const [id, pr] of Object.entries(b.proposals)) {
          if (!/^[A-Za-z0-9-]{3,40}$/.test(id)) continue;
          const cur = await propGet(id) || {};
          await propPut(id, Object.assign({ createdAt: Date.now(), views: 0, lastOpened: null, answer: null, answeredAt: null, dodges: 0, reply: null }, cur, pr));
        }
      }
      const all = await propList();
      return J(200, { ok: true, links: all.length });
    }
    if (M === "POST" && p === "/admin/unlink") {
      const b = await body(req);
      await propDel(b.id || "");
      return J(200, { ok: true });
    }
    return J(404, { err: "no api route" });
  } catch (e) {
    return J(500, { err: String(e && e.message || e) });
  }
}

/* ---------- main handler ---------- */
const handler = async req => {
  const url = new URL(req.url);
  const m = url.pathname.match(/^\/(?:functions\/v1\/)?love\/?(.*)$/) || [];
  const tail = m[1] || "";
  try {
    if (tail.startsWith("api/")) return await api(req, tail, url);
    const pm = tail.match(/^p\/([A-Za-z0-9-]+)\/?$/);
    if (pm) return await servePage(req, "/functions/v1/love", pm[1]);
    if (tail === "" || tail === "index.html") return await servePage(req, "/functions/v1/love", null);
    /* static asset */
    if (/^[A-Za-z0-9\-_/.]+$/.test(tail) && !tail.includes("..")) {
      const bytes = await fileBytes(tail);
      if (bytes) {
        const nocache = tail === "sw.js" || tail === "manifest.webmanifest";
        return new Response(bytes, {
          headers: {
            "Content-Type": ctypeOf(tail),
            "Cache-Control": nocache ? "no-cache" : "public, max-age=86400",
            "Access-Control-Allow-Origin": "*"
          }
        });
      }
    }
    return H(404, "404 — Not found");
  } catch (e) {
    return J(500, { err: String(e && e.message || e) });
  }
};
Deno.serve(handler);
export const __handler = handler;
