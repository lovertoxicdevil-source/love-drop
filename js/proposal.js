// proposal.js — viewer ka poora safar: splash → sawaal → game → final → celebration
(function () {
  'use strict';
  const { $, $$, toast, haptic, api, typewriter } = UI;

  // code teen jagah se mil sakta hai: seedha /p/<code>, ?c=<code>, ya 404-page redirect se sessionStorage
  let code = (location.pathname.match(/\/p\/([a-z0-9-]+)$/i) || [])[1]
    || new URLSearchParams(location.search).get('c')
    || '';
  try {
    code = code || sessionStorage.getItem('ld_code') || '';
    sessionStorage.removeItem('ld_code');
  } catch (e) { /* private mode */ }
  code = code.replace(/[^a-z0-9-]/gi, '');
  const isDemo = code === 'demo';
  if (code && !/\/p\/[a-z0-9-]+$/i.test(location.pathname)) {
    try { history.replaceState(null, '', '/p/' + code); } catch (e) { /* koi baat nahi */ }
  }

  const DEMO = {
    state: 'ok', code: 'demo', partner_name: 'Demo', creator_name: 'Tumhara Creator',
    theme: 'terracotta', tune: 'soft', photo: null, answered: false, already: false,
    questions: PRESETS_SET(),
    final_question: 'Toh ab seedha sawaal... kya tum mujhse pyaar karti ho?'
  };
  function PRESETS_SET() {
    return [
      { q: 'Aur suna? Aaj din kaisa jata hai tumhara?', options: ['Bas aise hi', 'Ekdum mast', 'Bore ho raha tha'] },
      { q: 'Ek batao... chai ya coffee?', options: ['Chai, obviously', 'Coffee hi coffee', 'Dono, mood ke hisaab se'] },
      { q: 'Sach bolo... late replies kaun zyada karta hai?', options: ['Main', 'Tum', 'Dono barabar'] },
      { q: 'Ek cheez jo tumhe mere baare mein achhi lagti hai?', options: ['Tumhara tareeka', 'Tumhari hasi', 'Sab kuch, thoda thoda'] },
      { q: 'Agar hum kahin ghumne chalein, kahan jaoge?', options: ['Pahad', 'Beach', 'Koi bhi purana sheher'] },
      { q: 'Last one... kya tumhe lagta hai hum acchi jodi hain?', options: ['Hmm, sochne do', 'Bilkul', 'Abhi toh shuru hua hai'] }
    ];
  }

  let P = null; // proposal data
  let qIndex = -1;
  const totalStages = 9; // 8 sawaal + game + final (approximate progress)
  let musicOn = true;
  let bgOn = true;

  const screens = ['scr-load', 'scr-gone', 'scr-splash', 'scr-q', 'scr-game', 'scr-final', 'scr-yes'];
  function show(id) {
    screens.forEach((s) => $('#' + s).classList.add('hidden'));
    $('#' + id).classList.remove('hidden');
    const el = $('#' + id);
    el.style.animation = 'none';
    void el.offsetWidth;
    el.style.animation = '';
  }

  function setProg(pct) { $('#prog').style.width = Math.min(100, pct) + '%'; }

  // ---------- boot ----------
  FX.attach($('#fx'));

  (async function boot() {
    try {
      if (isDemo) {
        P = DEMO;
      } else {
        if (!code) { gone('Link mila nahi', 'Ya toh galat link hai, ya delete ho chuka hai.'); return; }
        P = await api('/api/p/' + encodeURIComponent(code));
      }
      document.body.dataset.theme = P.theme || 'terracotta';
      startBg();
      $('#greeting').textContent = UI.timeGreeting();
      if (P.already) {
        // wapas aane wala — seedha celebration
        show('scr-splash');
        $('#start-btn').textContent = 'Wapas jao';
        $('#start-btn').dataset.resume = '1';
      }
      show('scr-splash');
      setProg(4);
    } catch (e) {
      if (e && e.status === 404) return gone('Link mila nahi', 'Ya toh galat link hai, ya delete ho chuka hai.');
      if (e && e.status === 410) return gone('Link khatam ho gaya', 'Is link ka waqt ya view limit poora ho gaya. Bhejne wale se naya link maang lo.');
      gone('Kuch choot gaya', 'Page load nahi ho paya. Ek baar refresh kar ke dekho.');
    }
  })();

  function gone(title, text) {
    $('#gone-title').textContent = title;
    $('#gone-text').textContent = text;
    show('scr-gone');
    setProg(0);
  }

  // ---------- background + quick controls ----------
  function startBg() {
    try { bgOn = localStorage.getItem('ld-bg') !== 'off'; } catch (e) {}
    if (bgOn && GLBG.available) {
      if (!GLBG.start(P.theme || 'terracotta', $('#bg'))) bgOn = false;
      window.addEventListener('pointermove', (e) => {
        GLBG.pointer((e.clientX / window.innerWidth) * 2 - 1, (e.clientY / window.innerHeight) * 2 - 1);
      }, { passive: true });
    }
    updateQc();
  }
  function updateQc() {
    $('#qc-music').classList.toggle('off', !musicOn);
    $('#qc-bg').classList.toggle('off', !bgOn);
  }
  $('#qc-music').addEventListener('click', () => {
    musicOn = !musicOn;
    if (musicOn) Music.start(P ? P.tune : 'soft'); else Music.stop();
    updateQc();
    haptic(8);
  });
  $('#qc-bg').addEventListener('click', () => {
    bgOn = !bgOn;
    try { localStorage.setItem('ld-bg', bgOn ? 'on' : 'off'); } catch (e) {}
    if (bgOn && GLBG.available) GLBG.start(P ? P.theme : 'terracotta', $('#bg'));
    else GLBG.stop();
    updateQc();
    haptic(8);
  });

  // ---------- splash → flow ----------
  $('#start-btn').addEventListener('click', () => {
    haptic(14);
    try { Music.start(P.tune || 'soft'); } catch (e) { /* autoplay block ho toh chalo */ }
    if ($('#start-btn').dataset.resume === '1' || P.already) return celebration(true);
    nextQuestion();
  });

  function nextQuestion() {
    qIndex++;
    if (qIndex >= P.questions.length) return startGame();
    const q = P.questions[qIndex];
    show('scr-q');
    setProg(6 + Math.round((qIndex / P.questions.length) * 55));
    $('#q-count').textContent = 'Sawaal ' + (qIndex + 1) + ' / ' + P.questions.length;
    typewriter($('#q-title'), q.q, 22, () => renderOptions(q));
  }

  function renderOptions(q) {
    const box = $('#q-options');
    box.textContent = '';
    q.options.forEach((opt) => {
      const b = document.createElement('button');
      b.className = 'q-opt';
      b.type = 'button';
      b.textContent = opt;
      b.addEventListener('click', () => {
        haptic(10);
        b.style.borderColor = 'var(--accent)';
        setTimeout(nextQuestion, 220);
      });
      box.appendChild(b);
    });
  }

  // ---------- heart catcher game ----------
  function startGame() {
    show('scr-game');
    setProg(68);
    const cv = $('#game-canvas');
    const wrap = cv.parentElement;
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    let W = 0, H = 0;
    function size() {
      W = cv.width = Math.floor(wrap.clientWidth * dpr);
      H = cv.height = Math.floor(wrap.clientHeight * dpr);
    }
    size();
    window.addEventListener('resize', size);

    const ctx = cv.getContext('2d');
    const NEED = 10;
    let caught = 0, missed = 0, running = true, raf = null, spawnT = 0;
    let hearts = [];

    function spawn() {
      hearts.push({
        x: (0.12 + Math.random() * 0.76) * W,
        y: -30,
        v: (0.9 + Math.random() * 1.3) * dpr,
        r: (16 + Math.random() * 14) * dpr,
        sway: Math.random() * 2,
        alive: true
      });
    }

    function drawHeart(x, y, s) {
      ctx.save();
      ctx.translate(x, y);
      ctx.fillStyle = '#e4573d';
      ctx.beginPath();
      ctx.moveTo(0, s * 0.35);
      ctx.bezierCurveTo(0, 0, -s * 0.5, 0, -s * 0.5, s * 0.3);
      ctx.bezierCurveTo(-s * 0.5, s * 0.6, 0, s * 0.8, 0, s);
      ctx.bezierCurveTo(0, s * 0.8, s * 0.5, s * 0.6, s * 0.5, s * 0.3);
      ctx.bezierCurveTo(s * 0.5, 0, 0, 0, 0, s * 0.35);
      ctx.fill();
      ctx.restore();
    }

    let last = 0;
    function loop(t) {
      if (!running) return;
      const dt = Math.min(40, t - last || 16);
      last = t;
      ctx.clearRect(0, 0, W, H);
      spawnT -= dt;
      if (spawnT <= 0 && hearts.length < 6) { spawn(); spawnT = 500 + Math.random() * 500; }
      hearts.forEach((h) => {
        if (!h.alive) return;
        h.y += h.v * (dt / 16);
        h.x += Math.sin(t / 600 + h.sway) * 0.6;
        drawHeart(h.x, h.y, h.r);
        if (h.y > H + 40) {
          h.alive = false;
          missed++;
          $('#game-miss').textContent = missed > 2 ? 'Koi baat nahi, jo chhoota wo gaya. ' + caught + ' pakde hue.' : '';
        }
      });
      hearts = hearts.filter((h) => h.alive);
      $('#game-status').textContent = 'Girte hue dil pakdo. ' + caught + ' / ' + NEED;
      raf = requestAnimationFrame(loop);
    }
    raf = requestAnimationFrame(loop);

    cv.addEventListener('pointerdown', (e) => {
      const r = cv.getBoundingClientRect();
      const x = (e.clientX - r.left) * dpr;
      const y = (e.clientY - r.top) * dpr;
      let hit = false;
      hearts.forEach((h) => {
        if (!h.alive) return;
        const dx = x - h.x, dy = y - h.y - h.r * 0.5;
        if (dx * dx + dy * dy < (h.r * 1.5) * (h.r * 1.5)) {
          h.alive = false;
          hit = true;
        }
      });
      if (hit) {
        caught++;
        haptic(12);
        if (caught >= NEED) {
          running = false;
          cancelAnimationFrame(raf);
          setTimeout(() => { showFinal(); }, 400);
        }
      } else {
        haptic(5);
      }
    });
  }

  // ---------- final: runaway NO ----------
  function showFinal() {
    show('scr-final');
    setProg(88);
    typewriter($('#final-q'), P.final_question || 'Ek hi sawaal hai... kya tum bhi wahi feel karti ho?', 26);
    setupRunawayNo();
  }

  const DODGE_LINES = [
    'Arre, button sharma raha hai',
    'Pakka? Ek baar aur try karo',
    'Ye button thoda daadha hai aaj',
    'Sochna achhi baat hai. Par phir bhi...',
    'Hint: YES wala zyada seedha hai',
    'Ghar walon ne mana kiya hai No dabaane se',
    'Ab toh button bhi haan bol raha hai'
  ];
  let dodgeCount = 0, dodgeBatch = 0, noSetup = false;

  function dodge() {
    const btn = $('#no-btn');
    if (!noSetup) {
      // pehli baar: normal flow se nikal ke fixed karo
      const r = btn.getBoundingClientRect();
      btn.style.position = 'fixed';
      btn.style.left = r.left + 'px';
      btn.style.top = r.top + 'px';
      btn.style.margin = '0';
      btn.style.zIndex = '10';
      noSetup = true;
    }
    const pad = 24;
    const bw = btn.offsetWidth, bh = btn.offsetHeight;
    const nx = pad + Math.random() * Math.max(10, window.innerWidth - bw - pad * 2);
    const ny = pad + Math.random() * Math.max(10, window.innerHeight - bh - pad * 2);
    btn.style.left = nx + 'px';
    btn.style.top = ny + 'px';
    dodgeCount++;
    dodgeBatch++;
    haptic(6);
    $('#dodge-note').textContent = DODGE_LINES[Math.min(dodgeCount - 1, DODGE_LINES.length - 1) % DODGE_LINES.length];
    if (dodgeCount >= 8 && dodgeCount % 4 === 0) {
      btn.style.transform = 'scale(' + Math.max(0.55, 1 - (dodgeCount - 8) * 0.05) + ')';
    }
    if (dodgeBatch >= 5 && !isDemo) {
      dodgeBatch = 0;
      api('/api/p/' + encodeURIComponent(code) + '/dodge', {
        method: 'POST',
        body: JSON.stringify({ count: 5 })
      }).catch(() => {});
    }
  }

  function setupRunawayNo() {
    const btn = $('#no-btn');
    btn.addEventListener('pointerenter', dodge);
    btn.addEventListener('pointerdown', (e) => { e.preventDefault(); dodge(); });
    btn.addEventListener('click', (e) => { e.preventDefault(); dodge(); });
  }

  // ---------- YES ----------
  $('#yes-btn').addEventListener('click', async () => {
    haptic([30, 40, 60]);
    setProg(100);
    if (!isDemo) {
      try { await api('/api/p/' + encodeURIComponent(code) + '/answer', { method: 'POST', body: JSON.stringify({ answer: 'yes' }) }); } catch (e) { /* offline chalega */ }
    }
    celebration(false);
  });

  async function celebration(returning) {
    show('scr-yes');
    FX.celebrate();
    setProg(100);
    document.title = P.partner_name + ' ne haan kaha';

    let secret = { note: '', reasons: [], photo: P.photo };
    if (!isDemo) {
      try {
        const s = await api('/api/p/' + encodeURIComponent(code) + '/secret');
        secret = s;
      } catch (e) { /* pehle se answered case bhi yahin aata hai */ }
    } else {
      secret = {
        note: 'Ye demo note hai. Asli page pe tumhara likha hua note aata hai, akshar dar akshar.\n\nBas itna hi. Baaki mil ke.',
        reasons: ['Tumhari hasi se din banta hai', 'Gussa bhi cute lagta hai', 'Bina baat ki call kar deti ho', 'Khana saath khaya toh zyada mazaa aata hai'],
        photo: null
      };
    }

    const nameEl = $('#reveal-name');
    typewriter(nameEl, P.partner_name, 90, () => {
      $('#yes-sub').textContent = returning
        ? 'Tumne pehle hi haan keh diya tha. Ye page tumhare liye hi hai.'
        : 'Haan keh diya. Ab aage sab tum dono ke haath mein hai.';
      afterName(secret, returning);
    });
  }

  function afterName(secret, returning) {
    // photo
    if (secret.photo) {
      $('#photo').src = secret.photo;
      $('#photo-frame').classList.remove('hidden');
    }

    // reasons flip cards
    const reasons = (secret.reasons || []).slice(0, 12);
    if (reasons.length) {
      $('#reasons').classList.remove('hidden');
      const stack = $('#reason-stack');
      stack.textContent = '';
      reasons.forEach((r, i) => {
        const card = document.createElement('div');
        card.className = 'flip-card';
        const inner = document.createElement('div');
        inner.className = 'flip-inner';
        const front = document.createElement('div');
        front.className = 'flip-face flip-front';
        front.textContent = 'Wajah #' + (i + 1);
        const back = document.createElement('div');
        back.className = 'flip-face flip-back';
        back.textContent = r;
        inner.append(front, back);
        card.appendChild(inner);
        card.addEventListener('click', () => {
          card.classList.toggle('flipped');
          haptic(8);
          if (!card.classList.contains('flipped') && UI.reduced === false) {
            const rct = card.getBoundingClientRect();
            FX.miniBurst(rct.left + rct.width / 2, rct.top + rct.height / 2);
          }
        });
        stack.appendChild(card);
      });
    }

    // note typewriter — dheere, letter wali feel
    if (secret.note) {
      setTimeout(() => {
        $('#note-card').classList.remove('hidden');
        const noteEl = $('#note-text');
        noteEl.classList.remove('done');
        UI.typewriter(noteEl, secret.note, 42, () => noteEl.classList.add('done'));
        $('#note-card').scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }, 600);
    }

    // reply box
    $('#reply-area').classList.remove('hidden');
    $('#reply-send').addEventListener('click', sendReply, { once: false });
  }

  async function sendReply() {
    const text = $('#reply-text').value.trim();
    if (!text) { toast('Kuch likho toh sahi'); return; }
    const btn = $('#reply-send');
    btn.disabled = true;
    try {
      if (isDemo) {
        $('#reply-done').classList.remove('hidden');
        $('#reply-text').value = '';
        toast('Demo mein bhej nahi sakte, par asli page pe chala jata');
        btn.disabled = false;
        return;
      }
      await api('/api/p/' + encodeURIComponent(code) + '/reply', {
        method: 'POST',
        body: JSON.stringify({ text })
      });
      $('#reply-done').classList.remove('hidden');
      $('#reply-text').value = '';
      haptic(20);
    } catch (ex) {
      toast(ex.message);
      btn.disabled = false;
    }
  }

  // konami-style easter egg: L O V E type karo
  const KEY = [76, 79, 86, 69];
  let ki = 0;
  document.addEventListener('keydown', (e) => {
    ki = (e.keyCode === KEY[ki]) ? ki + 1 : (e.keyCode === KEY[0] ? 1 : 0);
    if (ki === KEY.length) {
      ki = 0;
      FX.miniBurst(window.innerWidth / 2, window.innerHeight / 3);
      FX.miniBurst(window.innerWidth / 3, window.innerHeight / 2);
      FX.miniBurst(window.innerWidth * 2 / 3, window.innerHeight / 2);
      toast('Pyaar wale keys daba rahe ho.');
    }
  });
})();
