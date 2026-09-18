// auth.js — login/signup form
(function () {
  'use strict';
  const { $, api, toast, haptic } = UI;

  // pehle se login? seedha dashboard
  api('/api/auth/me').then((me) => {
    if (me.loggedIn) location.href = '/love-drop/dashboard';
  }).catch(() => {});

  let mode = 'login';
  const form = $('#auth-form');
  const email = $('#email');
  const password = $('#password');

  function setMode(m) {
    mode = m;
    const isLogin = m === 'login';
    $('#tab-login').classList.toggle('active', isLogin);
    $('#tab-signup').classList.toggle('active', !isLogin);
    $('#tab-login').setAttribute('aria-selected', isLogin);
    $('#tab-signup').setAttribute('aria-selected', !isLogin);
    $('#auth-title').textContent = isLogin ? 'Wapas aaye ho?' : 'Pehli baar aa rahe ho?';
    $('#auth-sub').textContent = isLogin
      ? 'Login karo, tumhare saare proposals yahin hain.'
      : 'Account banao, tumhare proposals sab save rahenge.';
    $('#auth-btn').textContent = isLogin ? 'Login karo' : 'Account banao';
    $('#pw-hint').textContent = isLogin ? '' : 'Kam se kam 8 kaante';
    password.setAttribute('autocomplete', isLogin ? 'current-password' : 'new-password');
    $('#auth-err').textContent = '';
  }

  $('#tab-login').addEventListener('click', () => setMode('login'));
  $('#tab-signup').addEventListener('click', () => setMode('signup'));

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    haptic(10);
    const err = $('#auth-err');
    err.textContent = '';
    const btn = $('#auth-btn');
    btn.disabled = true;
    try {
      const data = await api('/api/auth/' + mode, {
        method: 'POST',
        body: JSON.stringify({ email: email.value.trim(), password: password.value })
      });
      if (data.token) UI.saveToken(data.token);
      toast(mode === 'login' ? 'Wapas aane ke liye shukriya' : 'Account ban gaya. Chalo shuru karein');
      location.href = '/love-drop/create';
    } catch (ex) {
      err.textContent = ex.message;
      btn.disabled = false;
    }
  });
})();
