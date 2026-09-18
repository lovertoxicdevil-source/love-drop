// dash.js — creator dashboard: list, stats, replies, edit/delete, backup/restore
(function () {
  'use strict';
  const { $, $$, toast, haptic, api, copyText } = UI;

  let editingId = null;

  api('/api/auth/me').then((me) => {
    if (!me.loggedIn) { location.href = '/love-drop/login'; return; }
    $('#dash-email').textContent = me.email + ' ke proposals. Sab tumhare, koi aur nahi dekh sakta.';
    if (me.isOwner) $('#admin-link').style.display = '';
  }).catch(() => { location.href = '/love-drop/login'; });

  $('#logout').addEventListener('click', async () => {
    UI.clearToken();
    await api('/api/auth/logout', { method: 'POST' });
    location.href = '/love-drop/';
  });

  function fmtDate(s) {
    if (!s) return 'abhi nahi khula';
    const d = new Date(String(s).replace(' ', 'T') + 'Z');
    return d.toLocaleString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });
  }

  function statusLine(p) {
    const bits = [];
    if (p.expires_at) bits.push('Expiry: ' + fmtDate(p.expires_at));
    if (p.view_limit) bits.push('View limit: ' + p.view_limit);
    if (p.answered) bits.push('Jawab mil gaya');
    return bits;
  }

  function renderList(props) {
    const list = $('#prop-list');
    list.textContent = '';
    $('#dash-loading').classList.add('hidden');
    $('#empty').classList.toggle('hidden', props.length > 0);
    props.forEach((p) => {
      const card = document.createElement('div');
      card.className = 'prop-card';

      const head = document.createElement('div'); head.className = 'prop-head';
      const h3 = document.createElement('h3'); h3.textContent = p.partner_name + ' ke liye';
      const date = document.createElement('span'); date.className = 'prop-date'; date.textContent = fmtDate(p.created_at);
      head.append(h3, date);

      const stats = document.createElement('div'); stats.className = 'stats-row';
      const items = [
        [p.views, 'VIEWS'],
        [p.answered ? 'Haan' : 'Nahi', 'JAWAB'],
        [p.no_dodges, 'NO BHAGA'],
        [p.reply ? 1 : 0, 'REPLY']
      ];
      items.forEach(([v, l], i) => {
        const s = document.createElement('div');
        s.className = 'stat' + (i === 1 && p.answered ? ' yes' : '');
        const b = document.createElement('b'); b.textContent = v;
        const sp = document.createElement('span'); sp.textContent = l;
        s.append(b, sp);
        stats.appendChild(s);
      });

      const mid = document.createElement('div');
      const st = statusLine(p);
      if (st.length) {
        const p2 = document.createElement('p'); p2.className = 'prop-date'; p2.textContent = st.join(' · ');
        mid.appendChild(p2);
      }

      let reply = null;
      if (p.reply) {
        reply = document.createElement('div'); reply.className = 'reply-box';
        const who = document.createElement('div'); who.className = 'who';
        who.textContent = 'Uska reply (' + fmtDate(p.reply_at) + ')';
        const rp = document.createElement('p'); rp.textContent = p.reply;
        reply.append(who, rp);
      }

      const actions = document.createElement('div'); actions.className = 'prop-actions';
      const linkCode = document.createElement('span'); linkCode.className = 'prop-link-code';
      const codeEl = document.createElement('code'); codeEl.textContent = location.origin + '/love-drop/p/' + p.code;
      linkCode.appendChild(codeEl);
      actions.appendChild(linkCode);

      const copyBtn = document.createElement('button'); copyBtn.className = 'btn btn-ghost btn-sm'; copyBtn.textContent = 'Copy link';
      copyBtn.addEventListener('click', async () => {
        if (await copyText(location.origin + '/love-drop/p/' + p.code)) toast('Link copy ho gaya');
      });
      const editBtn = document.createElement('button'); editBtn.className = 'btn btn-ghost btn-sm'; editBtn.textContent = 'Edit';
      editBtn.addEventListener('click', () => openEdit(p));
      const delBtn = document.createElement('button'); delBtn.className = 'btn btn-danger btn-sm'; delBtn.textContent = 'Delete';
      delBtn.addEventListener('click', async () => {
        if (!confirm('Pakka delete? Wapas nahi aayega.')) return;
        try {
          await api('/api/proposals/' + p.id, { method: 'DELETE' });
          toast('Delete ho gaya');
          load();
        } catch (ex) { toast(ex.message); }
      });
      actions.append(copyBtn, editBtn, delBtn);

      card.append(head, stats, mid);
      if (reply) card.append(reply);
      card.append(actions);
      list.appendChild(card);
    });
  }

  async function load() {
    try {
      const data = await api('/api/proposals');
      renderList(data.proposals);
    } catch (ex) {
      $('#dash-loading').textContent = ex.message;
    }
  }
  load();

  // ---------- edit modal ----------
  function openEdit(p) {
    editingId = p.id;
    $('#edit-note').value = p.note || '';
    $('#edit-tune').value = p.tune;
    $('#edit-theme').value = p.theme;
    $('#edit-expires').value = ''; // expiry current value se update hota hai jab select karo
    $('#edit-vlimit').value = p.view_limit ? String(p.view_limit) : '';
    $('#edit-back').classList.add('open');
  }
  $('#edit-cancel').addEventListener('click', () => $('#edit-back').classList.remove('open'));
  $('#edit-back').addEventListener('click', (e) => {
    if (e.target === $('#edit-back')) $('#edit-back').classList.remove('open');
  });
  $('#edit-save').addEventListener('click', async () => {
    try {
      await api('/api/proposals/' + editingId, {
        method: 'PATCH',
        body: JSON.stringify({
          note: $('#edit-note').value,
          tune: $('#edit-tune').value,
          theme: $('#edit-theme').value,
          expires_in: $('#edit-expires').value,
          view_limit: $('#edit-vlimit').value
        })
      });
      $('#edit-back').classList.remove('open');
      toast('Save ho gaya');
      load();
    } catch (ex) { toast(ex.message); }
  });

  // ---------- backup ----------
  $('#backup-btn').addEventListener('click', async () => {
    try {
      const res = await fetch(UI.API_BASE + '/api/proposals/backup', {
        headers: { Authorization: 'Bearer ' + (localStorage.getItem('ld_token') || '') }
      });
      if (!res.ok) throw new Error('backup nahi mila');
      const blob = await res.blob();
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = 'love-drop-backup.json';
      document.body.appendChild(a);
      a.click();
      a.remove();
      toast('Backup download ho gaya');
    } catch (ex) {
      toast('Backup nahi ban paya, dobara try karo');
    }
  });
  $('#restore-file').addEventListener('change', async (e) => {
    const f = e.target.files && e.target.files[0];
    if (!f) return;
    try {
      const text = await f.text();
      const json = JSON.parse(text);
      const res = await api('/api/proposals/restore', { method: 'POST', body: JSON.stringify(json) });
      toast('Restore: ' + res.added + ' naye, ' + res.updated + ' update');
      load();
    } catch (ex) {
      toast('File padh nahi paye. Backup file sahi hai?');
    }
    e.target.value = '';
  });
})();
