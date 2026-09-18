// fx.js — YES dabane pe fireworks + dil ki baarish (2D canvas, one-shot)
(function () {
  'use strict';

  let canvas, ctx, W, H, raf = null, parts = [];
  const COLORS = ['#e4573d', '#f3ead9', '#e5708a', '#d9a441', '#ffffff'];

  function size() {
    W = canvas.width = canvas.clientWidth * Math.min(window.devicePixelRatio || 1, 1.5);
    H = canvas.height = canvas.clientHeight * Math.min(window.devicePixelRatio || 1, 1.5);
  }

  function burst(x, y, n) {
    for (let i = 0; i < n; i++) {
      const a = Math.random() * Math.PI * 2;
      const sp = (2 + Math.random() * 5) * (H / 800 + 0.6);
      parts.push({
        x, y,
        vx: Math.cos(a) * sp,
        vy: Math.sin(a) * sp - 1.5,
        g: 0.06,
        life: 70 + Math.random() * 50,
        t: 0,
        c: COLORS[(Math.random() * COLORS.length) | 0],
        r: 1.5 + Math.random() * 2.5,
        heart: Math.random() < 0.35
      });
    }
  }

  function drawHeart(p) {
    const s = p.r * 2.4;
    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.fillStyle = p.c;
    ctx.beginPath();
    ctx.moveTo(0, s * 0.35);
    ctx.bezierCurveTo(0, 0, -s * 0.5, 0, -s * 0.5, s * 0.3);
    ctx.bezierCurveTo(-s * 0.5, s * 0.6, 0, s * 0.8, 0, s);
    ctx.bezierCurveTo(0, s * 0.8, s * 0.5, s * 0.6, s * 0.5, s * 0.3);
    ctx.bezierCurveTo(s * 0.5, 0, 0, 0, 0, s * 0.35);
    ctx.fill();
    ctx.restore();
  }

  function frame() {
    ctx.clearRect(0, 0, W, H);
    for (let i = parts.length - 1; i >= 0; i--) {
      const p = parts[i];
      p.t++;
      p.x += p.vx;
      p.y += p.vy;
      p.vy += p.g;
      p.vx *= 0.985;
      if (p.t > p.life) { parts.splice(i, 1); continue; }
      ctx.globalAlpha = Math.max(0, 1 - p.t / p.life);
      if (p.heart) drawHeart(p);
      else {
        ctx.fillStyle = p.c;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, 6.283);
        ctx.fill();
      }
    }
    ctx.globalAlpha = 1;
    if (parts.length) { raf = requestAnimationFrame(frame); }
    else { raf = null; ctx.clearRect(0, 0, W, H); }
  }

  window.FX = {
    attach(canvasEl) {
      canvas = canvasEl;
      ctx = canvas.getContext('2d');
      size();
      window.addEventListener('resize', size);
    },
    celebrate() {
      if (!canvas || UI.reduced) return;
      size();
      // pehla burst center, phir timed bursts
      burst(W / 2, H * 0.38, 90);
      setTimeout(() => burst(W * 0.22, H * 0.3, 60), 450);
      setTimeout(() => burst(W * 0.78, H * 0.32, 60), 850);
      setTimeout(() => burst(W * 0.5, H * 0.22, 80), 1300);
      setTimeout(() => burst(W * 0.35, H * 0.45, 50), 1900);
      setTimeout(() => burst(W * 0.65, H * 0.42, 50), 2300);
      if (!raf) raf = requestAnimationFrame(frame);
    },
    miniBurst(x, y) {
      if (!canvas) return;
      size();
      burst(x, y, 24);
      if (!raf) raf = requestAnimationFrame(frame);
    }
  };
})();
