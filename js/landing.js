// landing.js — background, tilt, nav state, easter egg
(function () {
  'use strict';
  const { $, $$, attachTilt, api } = UI;

  // nav: login ya dashboard
  api('/api/auth/me').then((me) => {
    if (me.loggedIn) {
      $('#nav-login').textContent = 'Dashboard';
      $('#nav-login').href = '/dashboard';
    }
  }).catch(() => {});

  // background — terracotta default, user ne off kiya ho toh nahi
  let bgOn = true;
  try { bgOn = localStorage.getItem('ld-bg') !== 'off'; } catch (e) {}
  if (bgOn && GLBG.available) {
    GLBG.start('terracotta', $('#bg'));
    window.addEventListener('pointermove', (e) => {
      GLBG.pointer((e.clientX / window.innerWidth) * 2 - 1, (e.clientY / window.innerHeight) * 2 - 1);
    }, { passive: true });
  }

  $$('[data-tilt]').forEach((el) => attachTilt(el));

  // easter egg: title pe 5 baar tap karo
  let taps = 0, tapT = null;
  const h1 = document.querySelector('.hero h1');
  if (h1) {
    h1.style.cursor = 'default';
    h1.addEventListener('click', () => {
      taps++;
      clearTimeout(tapT);
      tapT = setTimeout(() => { taps = 0; }, 1600);
      if (taps >= 5) {
        taps = 0;
        UI.toast('Dhyan se dekh rahe ho... achhi baat hai.');
        UI.haptic(30);
      }
    });
  }

  // PWA
  if ('serviceWorker' in navigator && location.protocol === 'https:') {
    navigator.serviceWorker.register('/love-drop/sw.js').catch(() => {});
  }
})();
