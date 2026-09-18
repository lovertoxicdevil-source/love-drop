/* ============================================================
   💖 LOVE DROP — ldb.mjs (Supabase PostgREST helper, zero-dep)
   Tables: ld_config / ld_proposals / ld_users / ld_*_sessions
   RLS on (anon blocked) — service key se sab allowed
   ============================================================ */
const SURL = (process.env.SUPABASE_URL || "https://ktzyncoafautqanxxeou.supabase.co").replace(/\/$/, "");
const SKEY = process.env.SUPABASE_SERVICE_KEY || "";

if (!SKEY) console.warn("LD: SUPABASE_SERVICE_KEY env missing");

async function rest(path, opts) {
  const r = await fetch(SURL + "/rest/v1/" + path, Object.assign({
    headers: {
      apikey: SKEY,
      Authorization: "Bearer " + SKEY,
      "Content-Type": "application/json",
      Prefer: "return=representation"
    }
  }, opts || {}));
  if (!r.ok) throw new Error("db " + r.status + " " + (await r.text()).slice(0, 300));
  const t = await r.text();
  return t ? JSON.parse(t) : null;
}

/* ---------- CONFIG (singleton row) ---------- */
const DEFAULT_PW_HASH = "e4ad93ca07acb8d908a3aa41e920ea4f4ef4f26e7f86cf8291c5db289780a5ae"; // "iloveyou"
export async function cfgGet() {
  const rows = await rest("ld_config?id=eq.true&select=val");
  const val = rows && rows[0] && rows[0].val ? rows[0].val : {};
  return {
    pw: val.pw && val.pw.hash ? val.pw : { salt: "netlify", hash: DEFAULT_PW_HASH },
    config: val.config || {}
  };
}
export async function cfgSet(cfg) {
  const cur = await cfgGet();
  const val = { pw: cur.pw, config: cfg };
  await rest("ld_config?id=eq.true", { method: "PATCH", body: JSON.stringify({ val }) });
}
export async function pwSet(pw) { // {salt,hash}
  const cur = await cfgGet();
  await rest("ld_config?id=eq.true", { method: "PATCH", body: JSON.stringify({ val: { pw, config: cur.config } }) });
}

/* ---------- PROPOSALS ---------- */
export async function propGet(id) {
  const rows = await rest("ld_proposals?id=eq." + encodeURIComponent(id) + "&select=data");
  return rows && rows[0] ? rows[0].data : null;
}
export async function propPut(id, data) { // upsert (full row)
  await rest("ld_proposals", {
    method: "POST",
    headers: { Prefer: "resolution=merge-duplicates,return=representation" },
    body: JSON.stringify({ id, data })
  });
}
export async function propDel(id) {
  await rest("ld_proposals?id=eq." + encodeURIComponent(id), { method: "DELETE" });
}
export async function propList() { // [{id, data}]
  return await rest("ld_proposals?select=id,data&order=data->>createdAt.desc");
}

/* ---------- USERS (Google accounts) ---------- */
export async function userGet(sub) {
  const rows = await rest("ld_users?sub=eq." + encodeURIComponent(sub) + "&select=data");
  return rows && rows[0] ? rows[0].data : null;
}
export async function userPut(sub, data) {
  await rest("ld_users", {
    method: "POST",
    headers: { Prefer: "resolution=merge-duplicates,return=representation" },
    body: JSON.stringify({ sub, data })
  });
}

/* ---------- SESSIONS ---------- */
export async function aTokIns(tok, at) { // admin
  await rest("ld_admin_sessions", { method: "POST", body: JSON.stringify({ tok, at }) });
  // cap 60 — oldest pehle hatao
  const rows = await rest("ld_admin_sessions?select=tok,at&order=at.asc");
  if (rows && rows.length > 60) {
    const cut = rows.slice(0, rows.length - 60).map(r => r.tok).map(t => '"' + t.replace(/"/g, "") + '"').join(",");
    await rest("ld_admin_sessions?tok=in.(" + cut + ")", { method: "DELETE" });
  }
}
export async function aTokHas(tok) {
  const rows = await rest("ld_admin_sessions?tok=eq." + encodeURIComponent(tok) + "&select=tok");
  return !!(rows && rows.length);
}
export async function uTokIns(tok, sub, at) { // user
  await rest("ld_user_sessions", { method: "POST", body: JSON.stringify({ tok, sub, at }) });
  const rows = await rest("ld_user_sessions?select=tok,at&order=at.asc");
  if (rows && rows.length > 500) {
    const cut = rows.slice(0, rows.length - 500).map(r => r.tok).map(t => '"' + t.replace(/"/g, "") + '"').join(",");
    await rest("ld_user_sessions?tok=in.(" + cut + ")", { method: "DELETE" });
  }
}
export async function uTokGet(tok) {
  const rows = await rest("ld_user_sessions?tok=eq." + encodeURIComponent(tok) + "&select=tok,sub");
  return rows && rows[0] ? rows[0].sub : null;
}
export async function uTokDel(tok) {
  await rest("ld_user_sessions?tok=eq." + encodeURIComponent(tok), { method: "DELETE" });
}
