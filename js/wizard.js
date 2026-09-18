// wizard.js — 5-step setup: Naam → Photo → Gaana/Note → Sawaal/Theme → Link
(function () {
  'use strict';
  const { $, $$, toast, haptic, api, attachTilt } = UI;

  const state = {
    partner_name: '', creator_name: '',
    photoData: null,
    tune: 'soft', note: '', reasons: [],
    qset: 'sharmana',
    theme: 'terracotta',
    expires_in: '', view_limit: '',
    blind: true
  };

  // ---------- auth gate ----------
  api('/api/auth/me').then((me) => {
    if (!me.loggedIn) { location.href = '/love-drop/login'; return; }
    $('#wiz-loading').classList.add('hidden');
    $('#step-1').classList.remove('hidden');
    setProgress(1);
  }).catch(() => { location.href = '/love-drop/login'; });

  function setProgress(step) {
    $('#wiz-progress').style.width = Math.round((step / 5) * 100) + '%';
  }

  function showStep(n) {
    $$('.wiz-step').forEach((s) => s.classList.add('hidden'));
    $('#step-' + n).classList.remove('hidden');
    setProgress(n);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  document.addEventListener('click', (e) => {
    const next = e.target.closest('[data-next]');
    const prev = e.target.closest('[data-prev]');
    if (next) {
      haptic(10);
      const n = parseInt(next.dataset.next, 10);
      if (n === 2) {
        const p = $('#partner_name').value.trim();
        if (!p) { toast('Naam toh bata do, iske bina page adhoora hai'); $('#partner_name').focus(); return; }
        state.partner_name = p;
        state.creator_name = $('#creator_name').value.trim();
      }
      showStep(n);
    }
    if (prev) { haptic(8); showStep(parseInt(prev.dataset.prev, 10)); }
  });

  // ---------- step 2: photo ----------
  // edge function payload limit safe rakhne ke liye photo ko browser mein hi chhota karte hain
  function downscale(file) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      const url = URL.createObjectURL(file);
      img.onload = () => {
        URL.revokeObjectURL(url);
        const MAX = 1600;
        let { width: w, height: h } = img;
        if (Math.max(w, h) > MAX) {
          const k = MAX / Math.max(w, h);
          w = Math.round(w * k); h = Math.round(h * k);
        }
        const cv = document.createElement('canvas');
        cv.width = w; cv.height = h;
        cv.getContext('2d').drawImage(img, 0, 0, w, h);
        resolve(cv.toDataURL('image/jpeg', 0.85));
      };
      img.onerror = reject;
      img.src = url;
    });
  }

  $('#photo').addEventListener('change', async (e) => {
    const f = e.target.files && e.target.files[0];
    if (!f) return;
    if (f.size > 8 * 1024 * 1024) { toast('Photo thodi chhoti honi chahiye (8MB se kam)'); e.target.value = ''; return; }
    try {
      state.photoData = await downscale(f);
      const img = $('#photo-preview');
      img.src = state.photoData;
      img.classList.remove('hidden');
      $('#photo-hint').textContent = f.name;
      haptic(8);
    } catch (ex) {
      toast('Photo padh nahi paye, dobara chuno');
    }
  });

  // ---------- step 3: tunes, note, reasons ----------
  const TUNE_LABELS = { soft: 'Soft (dheema)', playful: 'Playful (mast)', waltz: 'Waltz (saaf)' };
  Object.keys(TUNE_LABELS).forEach((t) => {
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'chip' + (t === 'soft' ? ' active' : '');
    b.textContent = TUNE_LABELS[t];
    b.addEventListener('click', () => {
      state.tune = t;
      $$('#tune-row .chip').forEach((c) => c.classList.remove('active'));
      b.classList.add('active');
      haptic(8);
      if (Music.isPlaying()) Music.start(t); else Music.preview(t);
    });
    $('#tune-row').appendChild(b);
  });

  $('#draft-btn').addEventListener('click', () => {
    const kw = $('#keywords').value.trim();
    if (!kw && !$('#note').value.trim()) {
      $('#note').value = PRESETS.draftNote(' ', { partner_name: state.partner_name, creator_name: state.creator_name });
      toast('Kachcha draft bana diya, ab tum apna kar lo');
      return;
    }
    if (!kw) { toast('Pehle 2-4 lafz likho neeche'); return; }
    $('#note').value = PRESETS.draftNote(kw, { partner_name: state.partner_name, creator_name: state.creator_name });
    toast('Draft ready. Padho, theek karo, apna banao.');
  });

  function renderReasons() {
    const list = $('#reason-list');
    list.textContent = '';
    state.reasons.forEach((r, i) => {
      const div = document.createElement('div');
      div.className = 'reason-item';
      const rn = document.createElement('span'); rn.className = 'rn'; rn.textContent = '#' + (i + 1);
      const txt = document.createElement('span'); txt.className = 'txt'; txt.textContent = r;
      const del = document.createElement('button'); del.type = 'button'; del.textContent = 'x'; del.setAttribute('aria-label', 'delete reason');
      del.addEventListener('click', () => { state.reasons.splice(i, 1); renderReasons(); });
      div.append(rn, txt, del);
      list.appendChild(div);
    });
    if (!state.reasons.length) {
      const p = document.createElement('p');
      p.className = 'photo-hint';
      p.textContent = 'Shuruat ke liye: "' + PRESETS.DEFAULT_REASON_HINTS[0] + '" jaisi koi wajah add karo.';
      list.appendChild(p);
    }
  }
  renderReasons();

  $('#reason-add').addEventListener('click', () => {
    const v = $('#reason-input').value.trim();
    if (!v) return;
    if (state.reasons.length >= 12) { toast('Bas ab, 12 se zyada wajah laalach lagta hai'); return; }
    state.reasons.push(v);
    $('#reason-input').value = '';
    haptic(8);
    renderReasons();
  });
  $('#reason-input').addEventListener('keydown', (e) => {
    if (e.key === 'Enter') { e.preventDefault(); $('#reason-add').click(); }
  });

  // ---------- step 4: questions, theme ----------
  const setSel = $('#qset');
  Object.keys(PRESETS.SETS).forEach((k) => {
    const o = document.createElement('option');
    o.value = k;
    o.textContent = PRESETS.SETS[k].label;
    setSel.appendChild(o);
  });
  function renderQPreview() {
    const set = PRESETS.SETS[state.qset];
    $('#q-preview').textContent = '';
    set.questions.forEach((q, i) => {
      const d = document.createElement('div');
      d.className = 'q-item';
      const n = document.createElement('span'); n.className = 'qn'; n.textContent = i + 1;
      const qel = document.createElement('span'); qel.className = 'qq'; qel.textContent = q.q;
      const o = document.createElement('span'); o.className = 'qo'; o.textContent = q.options.length + ' options';
      d.append(n, qel, o);
      $('#q-preview').appendChild(d);
    });
    $('#final_question').value = set.final_question;
  }
  setSel.addEventListener('change', () => { state.qset = setSel.value; renderQPreview(); });
  renderQPreview();

  const THEMES = [
    { id: 'terracotta', label: 'Terracotta', color: '#e4573d' },
    { id: 'rose', label: 'Rose', color: '#e5708a' },
    { id: 'midnight', label: 'Midnight', color: '#5f7fc9' },
    { id: 'forest', label: 'Forest', color: '#5a9d70' },
    { id: 'gold', label: 'Gold', color: '#d9a441' },
    { id: 'mono', label: 'Mono', color: '#a8a29b' }
  ];
  THEMES.forEach((t) => {
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'chip' + (t.id === 'terracotta' ? ' active' : '');
    const dot = document.createElement('span'); dot.className = 'dot'; dot.style.background = t.color;
    b.appendChild(dot);
    b.appendChild(document.createTextNode(t.label));
    b.addEventListener('click', () => {
      state.theme = t.id;
      $$('#theme-row .chip').forEach((c) => c.classList.remove('active'));
      b.classList.add('active');
      haptic(8);
    });
    $('#theme-row').appendChild(b);
  });

  // ---------- submit ----------
  $('#submit-btn').addEventListener('click', async () => {
    state.note = $('#note').value.trim();
    state.final_question = $('#final_question').value.trim();
    state.blind = $('#blind').checked;
    state.expires_in = $('#expires_in').value;
    state.view_limit = $('#view_limit').value;

    const set = PRESETS.SETS[state.qset];
    const payload = {
      partner_name: state.partner_name,
      creator_name: state.creator_name,
      theme: state.theme,
      tune: state.tune,
      note: state.note,
      questions: set.questions,
      reasons: state.reasons,
      final_question: state.final_question,
      blind: state.blind,
      expires_in: state.expires_in,
      view_limit: state.view_limit
    };
    if (state.photoData) payload.photo_dataurl = state.photoData;

    $('#submit-btn').disabled = true;
    $('#wiz-submitting').classList.remove('hidden');
    try {
      const data = await api('/api/proposals', {
        method: 'POST',
        body: JSON.stringify(payload)
      });
      if (!data || data.error) throw new Error((data && data.error) || 'kuch gadbad ho gayi');
      $('#wiz-submitting').classList.add('hidden');
      const link = location.origin + '/love-drop/p/' + data.code;
      $('#prop-link').textContent = link;
      $('#manage-code').textContent = data.manage_code;
      $('#open-link').href = link;
      showStep(5);
      haptic(30);
      toast('Ban gaya. Ab himmat wali baari.');
    } catch (ex) {
      toast(ex.message);
      $('#submit-btn').disabled = false;
      $('#wiz-submitting').classList.add('hidden');
    }
  });

  $('#copy-link').addEventListener('click', async () => {
    if (await UI.copyText($('#prop-link').textContent)) toast('Link copy ho gaya');
  });
  $('#copy-manage').addEventListener('click', async () => {
    if (await UI.copyText($('#manage-code').textContent)) toast('Manage code copy ho gaya');
  });

  // tune preview jab tak user kuch na dabaye
  document.addEventListener('click', function once() {
    document.removeEventListener('click', once);
    try { Music.preview(state.tune); } catch (e) { /* koi baat nahi */ }
  });
})();
