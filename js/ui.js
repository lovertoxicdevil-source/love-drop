// ui.js — shared helpers: api, toast, haptics, Tilt3D, copy, greeting
(function () {
  'use strict';

  const $ = (sel, root) => (root || document).querySelector(sel);
  const $$ = (sel, root) => Array.from((root || document).querySelectorAll(sel));

  function toast(msg) {
    let t = $('#toast');
    if (!t) {
      t = document.createElement('div');
      t.id = 'toast';
      document.body.appendChild(t);
    }
    t.textContent = msg;
    t.classList.add('show');
    clearTimeout(t._h);
    t._h = setTimeout(() => t.classList.remove('show'), 2600);
  }

  // light haptic — safe, ignoring devices that don't support it
  let vibrateOk = true;
  function haptic(ms) {
    if (!vibrateOk) return;
    try {
      if (navigator.vibrate) navigator.vibrate(ms || 12);
    } catch (e) { vibrateOk = false; }
  }

  // API base: local dev mein same-origin, warna Supabase edge function
  const API_BASE = (location.hostname === 'localhost' || location.hostname === '127.0.0.1')
    ? ''
    : 'https://ktzyncoafautqanxxeou.supabase.co/functions/v1/api';

  async function api(path, opts) {
    const headers = { 'Content-Type': 'application/json' };
    let token = null;
    try { token = localStorage.getItem('ld_token'); } catch (e) { /* private mode */ }
    if (token) headers['Authorization'] = 'Bearer ' + token;
    const res = await fetch(API_BASE + path, Object.assign({ headers, credentials: 'omit' }, opts));
    let data = null;
    try { data = await res.json(); } catch (e) { /* empty body */ }
    if (!res.ok) {
      const err = new Error((data && data.error) || 'kuch gadbad ho gayi');
      err.status = res.status;
      throw err;
    }
    return data;
  }

  function saveToken(t) {
    try { localStorage.setItem('ld_token', t); } catch (e) { /* private mode */ }
  }
  function clearToken() {
    try { localStorage.removeItem('ld_token'); } catch (e) { /* private mode */ }
  }

  async function copyText(text) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch (e) {
      try {
        const ta = document.createElement('textarea');
        ta.value = text;
        ta.style.position = 'fixed';
        ta.style.opacity = '0';
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        document.body.removeChild(ta);
        return true;
      } catch (e2) { return false; }
    }
  }

  // Tilt3D — max 6deg, release pe 400ms smooth return (v7 audit)
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  function attachTilt(el, maxDeg) {
    if (reduced || !el) return;
    const MAX = (maxDeg || 6) * Math.PI / 180;
    el.style.transformStyle = 'preserve-3d';
    let raf = null;
    function move(ev) {
      const r = el.getBoundingClientRect();
      const x = (ev.clientX - r.left) / r.width - 0.5;
      const y = (ev.clientY - r.top) / r.height - 0.5;
      if (raf) cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        el.style.transition = 'none';
        el.style.transform = 'perspective(800px) rotateX(' + (-y * MAX * 2).toFixed(3) + 'rad) rotateY(' + (x * MAX * 2).toFixed(3) + 'rad)';
      });
    }
    function release() {
      if (raf) cancelAnimationFrame(raf);
      el.style.transition = 'transform 400ms cubic-bezier(.22,1,.36,1)';
      el.style.transform = 'perspective(800px) rotateX(0) rotateY(0)';
    }
    el.addEventListener('pointermove', move);
    el.addEventListener('pointerleave', release);
    el.addEventListener('pointercancel', release);
  }

  function timeGreeting() {
    const h = new Date().getHours();
    if (h < 5) return 'Itni raat tak jaag rahe ho?';
    if (h < 12) return 'Subah ka good morning';
    if (h < 17) return 'Namaste';
    if (h < 21) return 'Shaam ki namaste';
    return 'Raat ki namaste';
  }

  function escapeHtml(s) {
    // entities split rakhe hain taaki source mein literal entity na bane
    const amp = '&' + 'amp;', lt = '&' + 'lt;', gt = '&' + 'gt;', q = '&' + 'quot;', ap = '&' + '#39;';
    const map = { '&': amp, '<': lt, '>': gt, '"': q, "'": ap };
    return String(s).replace(/[&<>"']/g, (c) => map[c]);
  }

  // simple typewriter — reduced motion pe instant
  function typewriter(el, text, speed, done) {
    if (reduced) { el.textContent = text; if (done) done(); return; }
    el.textContent = '';
    let i = 0;
    const t = setInterval(() => {
      el.textContent = text.slice(0, ++i);
      if (i >= text.length) { clearInterval(t); if (done) done(); }
    }, speed || 34);
    return t;
  }

  window.UI = { $, $$, toast, haptic, api, copyText, attachTilt, timeGreeting, escapeHtml, typewriter, reduced, API_BASE, saveToken, clearToken };
})();
