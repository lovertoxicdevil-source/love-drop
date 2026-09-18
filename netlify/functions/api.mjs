/* ============================================================
   💖 LOVE DROP — api.mjs (Netlify Function v2)
   server.js ka poora port — Supabase Postgres backend ke saath
   Env: SUPABASE_URL (default set) + SUPABASE_SERVICE_KEY
   ============================================================ */
import { cfgGet, cfgSet, pwSet, propGet, propPut, propDel, propList,
        userGet, userPut, aTokIns, aTokHas, uTokIns, uTokGet, uTokDel } from "./ldb.mjs";
import crypto from "node:crypto";

const ADMIN_EMAIL = "lovertoxicdevil@gmail.com";
const sha256 = s => crypto.createHash("sha256").update(String(s)).digest("hex");

/* ---------- helpers ---------- */
const J = (code, obj) => new Response(JSON.stringify(obj), {
  status: code, headers: { "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-cache" }
});
async function body(req) { try { return JSON.parse(await req.text() || "{}") } catch (e) { return {} } }
const STRIP = ["pw"];
const UA = {};
function ipOf(req) {
  return (req.headers.get("x-forwarded-for") || "?").toString().split(",")[0].trim();
}
function allowCreate(ip) {
  const now = Date.now(), a = UA[ip] || (UA[ip] = { n: 0, t0: now });
  if (now - a.t0 > 3600000) { a.n = 0; a.t0 = now }
  if (a.n >= 8) return false; a.n++; return true;
}
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
    out.quiz = c.quiz.slice(0, 8).map(q => ({
      q: sStr(q && q.q, 300) || "",
      o: Array.isArray(q && q.o) ? q.o.slice(0, 4).map(x => sStr(x, 120) || "") : [],
      r: Array.isArray(q && q.r) ? q.r.slice(0, 3).map(x => sStr(x, 120) || "") : []
    })).filter(x => x.q);
  }
  return out;
}
function pubCfg(c) { const o = Object.assign({}, c || {}); STRIP.forEach(k => delete o[k]); return o }
function merge(a, b) { const o = Object.assign({}, a); for (const k in (b || {})) if (b[k] !== undefined && b[k] !== null) o[k] = b[k]; return o }
async function verifyGoogle(cred) {
  try {
    const r = await fetch("https://oauth2.googleapis.com/tokeninfo?id_token=" + encodeURIComponent(cred));
    return await r.json();
  } catch (e) { return null }
}
function bearer(req) {
  const h = req.headers.get("authorization") || "";
  return h.startsWith("Bearer ") ? h.slice(7).trim() : "";
}
async function auth(req) {
  const t = bearer(req);
  return !!(t && await aTokHas(sha256(t)));
}
async function newToken() {
  const t = crypto.randomBytes(24).toString("hex");
  await aTokIns(sha256(t), Date.now());
  return t;
}
async function newUserToken(sub) {
  const t = crypto.randomBytes(24).toString("hex");
  await uTokIns(sha256(t), sub, Date.now());
  return t;
}
async function authUser(req) {
  const t = bearer(req);
  if (!t) return null;
  const sub = await uTokGet(sha256(t));
  if (!sub) return null;
  const user = await userGet(sub);
  if (!user) return null;
  return { sub, user, token: t };
}
async function ownProposal(req, pr) {
  if (!pr || !pr.uid) return false;
  const u = await authUser(req);
  return !!(u && u.sub === pr.uid);
}

/* ============================================================ */
export default async (req) => {
  const url = new URL(req.url);
  const M = req.method;
  /* path normalise: /api/boot | /.netlify/functions/api/boot → /boot */
  const m = url.pathname.match(/\/api\/(.*)$/);
  const p = "/" + (m ? m[1] : "");
  try {
    /* ---- PUBLIC ---- */
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
      if (sha256(pw) !== DB.pw.hash) return J(401, { ok: false, msg: "Galat password 😅" });
      return J(200, { ok: true, token: await newToken() });
    }
    if (M === "POST" && p === "/answer") {
      const b = await body(req);
      const pr = await propGet(b.pid || "");
      if (!pr) return J(404, { ok: false });
      if (typeof b.answer !== "undefined") {
        pr.answer = b.answer === "yes" ? "yes" : "no"; pr.answeredAt = Date.now(); pr.dodges = Math.max(0, b.dodges | 0);
      }
      if (typeof b.reply === "string" && b.reply.trim()) {
        pr.reply = b.reply.trim().replace(/[<>]/g, "").slice(0, 500); pr.repliedAt = Date.now();
      }
      await propPut(b.pid, pr);
      return J(200, { ok: true });
    }
    /* ---- v11: USER ACCOUNTS ---- */
    if (M === "POST" && p === "/user/login") {
      const b = await body(req);
      const info = await verifyGoogle(b.credential || "");
      if (!info || !info.email || !info.sub || info.email_verified === "false")
        return J(401, { ok: false, msg: "Google verification fail — dobara try karo" });
      const email = String(info.email).toLowerCase();
      if (email === ADMIN_EMAIL)
        return J(403, { ok: false, msg: "Ye admin account hai — Admin panel se login karo 👑" });
      const DB = await cfgGet();
      const gcid = DB.config.gClientId || "";
      if (gcid && info.aud !== gcid)
        return J(401, { ok: false, msg: "Ye app ke liye valid Google token nahi hai" });
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
      if (t) await uTokDel(sha256(t));
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
    /* ---- PUBLIC USER (proposal creators) ---- */
    if (M === "POST" && p === "/user/create") {
      const ip = ipOf(req);
      if (!allowCreate(ip)) return J(429, { ok: false, msg: "Bahut zyada proposals! Thodi der baad try karo 🙏" });
      const b = await body(req);
      const cfg = sanitizeCfg(b.config || {});
      if (!cfg.herName || !cfg.finalQ) return J(400, { ok: false, msg: "Naam aur sawaal zaroori hai 💕" });
      const id = "prop-" + crypto.randomBytes(4).toString("hex");
      const code = crypto.randomBytes(4).toString("hex");
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
    /* ---- ADMIN (auth required) ---- */
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
      if (sha256(String(b.old || "")) !== DB.pw.hash) return J(401, { ok: false, msg: "Purana password galat" });
      if (String(b.new || "").length < 4) return J(400, { ok: false, msg: "Naya password kam se kam 4 characters" });
      await pwSet({ salt: crypto.randomBytes(8).toString("hex"), hash: sha256(String(b.new)) });
      return J(200, { ok: true });
    }
    if (M === "POST" && p === "/admin/link") {
      const b = await body(req);
      let want = String(b.id || "");
      if (want && !/^[A-Za-z0-9-]{3,40}$/.test(want)) return J(400, { ok: false, msg: "bad id" });
      if (want && await propGet(want)) return J(200, { ok: true, id: want, url: "/p/" + want, existing: true });
      const id = want || ("jaan-" + crypto.randomBytes(3).toString("hex"));
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
};
