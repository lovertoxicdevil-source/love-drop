// admin.js — aggregates only, canvas se mini chart
(function () {
  'use strict';
  const { $, api } = UI;

  const LABELS = {
    users: 'Total log',
    users_7d: 'Naye log (7 din)',
    proposals: 'Total proposals',
    proposals_7d: 'Naye proposals (7 din)',
    distinct_viewers: 'Alag viewers',
    answered_yes: 'YES mile',
    no_dodges: 'No bhaage',
    replies: 'Replies aaye'
  };

  api('/api/auth/me').then(async (me) => {
    if (!me.loggedIn) { location.href = '/love-drop/login'; return; }
    if (!me.isOwner) {
      document.querySelector('.admin-wrap').innerHTML =
        '<h1>Ye jagah nahi hai tumhare liye</h1><p class="admin-sub">Admin panel sirf site-owner ka hai.</p>';
      return;
    }
    const data = await api('/api/admin/stats');
    const grid = $('#stat-grid');
    Object.keys(LABELS).forEach((k) => {
      const d = document.createElement('div');
      d.className = 'stat-card';
      const b = document.createElement('b');
      b.textContent = (data.totals[k] || 0).toLocaleString('en-IN');
      const s = document.createElement('span');
      s.textContent = LABELS[k];
      d.append(b, s);
      grid.appendChild(d);
    });
    drawChart(data.days);
  }).catch(() => { location.href = '/love-drop/login'; });

  function drawChart(days) {
    const cv = $('#chart');
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const W = cv.clientWidth || 600;
    const H = 180;
    cv.width = W * dpr;
    cv.height = H * dpr;
    const ctx = cv.getContext('2d');
    ctx.scale(dpr, dpr);

    const max = Math.max(1, ...days.map((d) => Math.max(d.signups, d.proposals)));
    const bw = W / days.length;
    const pad = 4;

    ctx.strokeStyle = 'rgba(255,255,255,0.06)';
    for (let i = 0; i <= 3; i++) {
      const y = 10 + (H - 30) * (i / 3);
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(W, y);
      ctx.stroke();
    }

    days.forEach((d, i) => {
      const x = i * bw;
      if (d.signups) {
        const h = (d.signups / max) * (H - 30);
        ctx.fillStyle = 'rgba(228, 87, 61, 0.75)';
        ctx.fillRect(x + bw * 0.18, H - 16 - h, bw * 0.26, h);
      }
      if (d.proposals) {
        const h = (d.proposals / max) * (H - 30);
        ctx.fillStyle = 'rgba(243, 234, 217, 0.55)';
        ctx.fillRect(x + bw * 0.5, H - 16 - h, bw * 0.26, h);
      }
      if (i % 2 === 0) {
        ctx.fillStyle = 'rgba(243, 234, 217, 0.35)';
        ctx.font = '10px Inter, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(d.day.slice(5), x + bw / 2, H - 2 + pad);
      }
    });

    // legend
    ctx.textAlign = 'left';
    ctx.fillStyle = 'rgba(228, 87, 61, 0.9)';
    ctx.fillRect(8, 6, 10, 10);
    ctx.fillStyle = 'rgba(243, 234, 217, 0.6)';
    ctx.fillText('log', 24, 15);
    ctx.fillStyle = 'rgba(243, 234, 217, 0.55)';
    ctx.fillRect(56, 6, 10, 10);
    ctx.fillStyle = 'rgba(243, 234, 217, 0.6)';
    ctx.fillText('proposals', 72, 15);
  }
})();
