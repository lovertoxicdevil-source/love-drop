// audio.js — teen synth tunes, koi file download nahi, sab WebAudio se live ban'ta hai
(function () {
  'use strict';

  const NOTE = { C3: 130.81, D3: 146.83, E3: 164.81, F3: 174.61, G3: 196, A3: 220, B3: 246.94, C4: 261.63, D4: 293.66, E4: 329.63, F4: 349.23, G4: 392, A4: 440, B4: 493.88, C5: 523.25, D5: 587.33, E5: 659.25, G5: 783.99, A5: 880 };

  const TUNES = {
    // soft: dheeme arpeggio, gentle pads — "letter padhne wala" mood
    soft: {
      bpm: 56,
      pattern: [
        { t: 0, n: ['C4', 'E4', 'G4'], len: 3.4, gain: 0.05, type: 'sine' },
        { t: 2.1, n: ['A3', 'D4', 'F4'], len: 3.2, gain: 0.045, type: 'sine' },
        { t: 4.2, n: ['F3', 'A3', 'C4', 'E4'], len: 3.6, gain: 0.04, type: 'sine' },
        { t: 6.3, n: ['G3', 'B3', 'D4'], len: 3.4, gain: 0.05, type: 'sine' }
      ],
      bar: 8.4
    },
    // playful: chhote plucky notes, thoda shararati
    playful: {
      bpm: 96,
      pattern: [
        { t: 0, n: ['E4'], len: 0.5, gain: 0.09, type: 'triangle' },
        { t: 0.5, n: ['G4'], len: 0.5, gain: 0.09, type: 'triangle' },
        { t: 1.0, n: ['A4'], len: 0.9, gain: 0.09, type: 'triangle' },
        { t: 1.8, n: ['D4'], len: 0.5, gain: 0.08, type: 'triangle' },
        { t: 2.4, n: ['C4', 'E4', 'G4'], len: 1.6, gain: 0.05, type: 'sine' },
        { t: 4.2, n: ['A4'], len: 0.5, gain: 0.09, type: 'triangle' },
        { t: 4.7, n: ['G4'], len: 0.5, gain: 0.09, type: 'triangle' },
        { t: 5.2, n: ['E5'], len: 0.9, gain: 0.08, type: 'triangle' },
        { t: 6.0, n: ['C5', 'A4', 'F4'], len: 1.6, gain: 0.05, type: 'sine' }
      ],
      bar: 8.4
    },
    // waltz: 3/4, saaf aur seedha
    waltz: {
      bpm: 84,
      pattern: [
        { t: 0, n: ['C4', 'E4', 'G4'], len: 0.7, gain: 0.06, type: 'sine' },
        { t: 0.9, n: ['B3'], len: 0.4, gain: 0.05, type: 'triangle' },
        { t: 1.5, n: ['D4'], len: 0.4, gain: 0.05, type: 'triangle' },
        { t: 2.7, n: ['F3', 'A3', 'C4'], len: 0.7, gain: 0.06, type: 'sine' },
        { t: 3.6, n: ['E4'], len: 0.4, gain: 0.05, type: 'triangle' },
        { t: 4.2, n: ['G4'], len: 0.4, gain: 0.05, type: 'triangle' },
        { t: 5.4, n: ['A3', 'C4', 'E4'], len: 0.7, gain: 0.06, type: 'sine' },
        { t: 6.3, n: ['G4'], len: 0.4, gain: 0.05, type: 'triangle' },
        { t: 6.9, n: ['E5'], len: 0.4, gain: 0.05, type: 'triangle' }
      ],
      bar: 8.4
    }
  };

  let ctx = null;
  let master = null;
  let timer = null;
  let current = null;
  let playing = false;

  function ensureCtx() {
    if (!ctx) {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return null;
      ctx = new AC();
      master = ctx.createGain();
      master.gain.value = 0.9;
      master.connect(ctx.destination);
    }
    if (ctx.state === 'suspended') ctx.resume();
    return ctx;
  }

  function playChord(step) {
    const now = ctx.currentTime + 0.03;
    step.n.forEach((name, idx) => {
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.type = step.type;
      o.frequency.value = NOTE[name] || 440;
      const start = now + idx * 0.012;
      g.gain.setValueAtTime(0.0001, start);
      g.gain.exponentialRampToValueAtTime(step.gain, start + 0.06);
      g.gain.exponentialRampToValueAtTime(0.0001, start + step.len);
      o.connect(g); g.connect(master);
      o.start(start); o.stop(start + step.len + 0.1);
    });
  }

  function scheduleLoop() {
    if (!playing || !current) return;
    const barMs = current.bar * 1000;
    current.pattern.forEach((step) => {
      const delay = step.t * 1000;
      setTimeout(() => { if (playing && current) playChord(step); }, delay);
    });
    timer = setTimeout(scheduleLoop, barMs);
  }

  const Music = {
    start(name) {
      const tune = TUNES[name] || TUNES.soft;
      if (!ensureCtx()) return false;
      this.stop();
      current = tune;
      playing = true;
      scheduleLoop();
      return true;
    },
    stop() {
      playing = false;
      if (timer) { clearTimeout(timer); timer = null; }
      current = null;
    },
    isPlaying() { return playing; },
    preview(name) { this.start(name); },
    names: Object.keys(TUNES)
  };

  window.Music = Music;
})();
