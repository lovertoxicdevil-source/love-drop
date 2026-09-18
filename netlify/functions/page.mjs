/* ============================================================
   💖 LOVE DROP — page.mjs (Netlify Function v2)
   /p/:id → proposal page (OG meta + view count + injected boot)
   Static index.html ko origin se fetch karke inject karta hai
   ============================================================ */
import { cfgGet, propGet, propPut } from "./ldb.mjs";
import crypto from "node:crypto";

const ADMIN_EMAIL = "lovertoxicdevil@gmail.com";
const STRIP = ["pw"];
function pubCfg(c) { const o = Object.assign({}, c || {}); STRIP.forEach(k => delete o[k]); return o }
function merge(a, b) { const o = Object.assign({}, a); for (const k in (b || {})) if (b[k] !== undefined && b[k] !== null) o[k] = b[k]; return o }
function sStr(v, max) { return typeof v === "string" ? v.replace(/[<>]/g, "").slice(0, max) : undefined }
function sanitizeCfg(c) {
  /* minimal port — page sirf names/finalQ chahiye */
  const out = {};
  if (!c || typeof c !== "object") return out;
  const strMap = { herName: 60, hisName: 60, herNick: 40, hisNick: 40, coupleHash: 60, firstMeet: 20, anniversary: 20, song: 80,
    zHer: 20, zHis: 20, introTitle: 120, introSub: 200, finalQ: 300, finalSub: 200, yesLabel: 30, noLabel: 30, noReplies: 600,
    afterYes: 60, afterYesMsg: 600, letter: 2000, reasons: 1500, signature: 80, customGiftTitle: 80, customGiftMsg: 600, eggRewardMsg: 120,
    changelog: 300, credits: 120, audioUrl: 400, shareMsg: 200, favVideo: 60 };
  for (const k in strMap) { const v = sStr(c[k], strMap[k]); if (v !== undefined && v !== "") out[k] = v }
  ["photo1", "photo2", "bgImage", "audioData", "voiceData"].forEach(k => {
    const v = c[k]; if (typeof v === "string" && v.startsWith("data:") && v.length < 1600000) out[k] = v;
  });
  ["theme", "font"].forEach(k => { if (typeof c[k] === "string" && /^[a-z0-9]{3,12}$/.test(c[k])) out[k] = c[k] });
  return out;
}
function ogMeta(host, title, desc) {
  const AMP = String.fromCharCode(38);
  const e = x => String(x == null ? "" : x).split(AMP).join(AMP + "amp;").split("<").join(AMP + "lt;").split(">").join(AMP + "gt;").split(String.fromCharCode(34)).join(AMP + "quot;");
  const proto = /localhost|127\.0\.0\.1/.test(host) ? "http:" : "https:";
  return '<meta property="og:title" content="' + e(title) + '"/>' +
    '<meta property="og:description" content="' + e(desc) + '"/>' +
    '<meta property="og:image" content="' + proto + '//' + host + '/icons/og-card.png"/>' +
    '<meta property="og:image:width" content="1200"/><meta property="og:image:height" content="630"/>' +
    '<meta property="og:type" content="website"/>' +
    '<meta name="twitter:card" content="summary_large_image"/>' +
    '<meta name="twitter:title" content="' + e(title) + '"/>' +
    '<meta name="twitter:description" content="' + e(desc) + '"/>' +
    '<meta name="twitter:image" content="' + proto + '//' + host + '/icons/og-card.png"/>';
}
function expiredPage(kind, herName) {
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
    "</p><a class='b' href='/'>💜 Love Drop kholo</a></div></body></html>";
}
const H = (code, html) => new Response(html, {
  status: code, headers: { "Content-Type": "text/html; charset=utf-8", "Cache-Control": "no-cache" }
});

/* ============================================================ */
export default async (req) => {
  try {
    const url = new URL(req.url);
    const seg = url.pathname.replace(/\/+$/, "").split("/").filter(Boolean).pop() || "";
    const pid = decodeURIComponent(/^[A-Za-z0-9-]+$/.test(seg) ? seg : "");
    const host = req.headers.get("host") || url.host || "";
    if (!pid) return H(404, "Ye proposal link exist nahi karta 🤔");
    const pr = await propGet(pid);
    if (!pr) return H(404, "Ye proposal link exist nahi karta 🤔");
    const her = pr.config && pr.config.herName || "";
    /* v8: expiry + view-limit enforcement */
    if (pr.exp && Date.now() > pr.exp) return H(410, expiredPage("expire", her));
    if (pr.vl > 0 && (pr.views || 0) >= pr.vl) return H(410, expiredPage("limit", her));
    pr.views = (pr.views || 0) + 1; pr.lastOpened = Date.now();
    await propPut(pid, pr);
    const DB = await cfgGet();
    const ownCfg = pr.config ? merge(pubCfg(DB.config), sanitizeCfg(pr.config)) : pubCfg(DB.config);
    /* v9: blind preview */
    const og = DB.config.ogBlind
      ? { title: "Kisi ne tumhe kuch bheja hai", desc: "Khol ke dekho na" }
      : { title: her ? her + " ke liye kuch hai" : "Tumhare liye kuch hai",
          desc: (pr.config && pr.config.finalQ) ? pr.config.finalQ : "Ek chhota sa surprise. Kholo?" };
    const boot = { mode: "server", pid, adminEmail: ADMIN_EMAIL, gClientId: DB.config.gClientId || "",
      config: pubCfg(DB.config), proposal: { id: pid, own: !!pr.config, config: ownCfg, views: pr.views } };
    /* static index.html fetch + inject */
    const r = await fetch(url.origin + "/index.html", { headers: { "x-no-transform": "1" } });
    if (!r.ok) return H(500, "index.html fetch fail");
    let html = await r.text();
    const inject = "<script>window.__SRV_BOOT__=" + JSON.stringify(boot).replace(/</g, "\\u003c") + ";</script>";
    html = html.replace('<script src="js/app.js"></script>', inject + '<script src="js/app.js"></script>');
    if (og && og.title) {
      html = html.replace("<head>", "<head>" + ogMeta(host, og.title, og.desc || ""));
      html = html.replace(/<title>[^<]*<\/title>/, "<title>" + og.title + "</title>");
    }
    return H(200, html);
  } catch (e) {
    return H(500, "Server error: " + String(e && e.message || e));
  }
};
