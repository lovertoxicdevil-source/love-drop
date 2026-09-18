// gl.js — restrained WebGL background. Additive, depth-fog, DPR cap 1.5, visibility-pause, full teardown.
// Scenes: hearts | stars | embers. Theme se auto-map. koi chunkiyaa screensaver wali brightness nahi.
(function () {
  'use strict';

  const VERT = [
    'attribute vec3 aPos;',
    'attribute vec3 aMeta;', // size, shape, phase
    'uniform mat4 uMvp;',
    'uniform float uScale;',
    'varying float vShape;',
    'varying float vPhase;',
    'varying float vFog;',
    'void main(){',
    '  vec4 p = uMvp * vec4(aPos, 1.0);',
    '  gl_Position = p;',
    '  float ps = aMeta.x * (uScale / max(p.w, 0.15));',
    '  gl_PointSize = clamp(ps, 1.0, 56.0);',
    '  vShape = aMeta.y;',
    '  vPhase = aMeta.z;',
    '  vFog = clamp(1.35 - p.w * 0.55, 0.0, 1.0);',
    '}'
  ].join('\n');

  const FRAG = [
    'precision mediump float;',
    'uniform vec3 uCol1;',
    'uniform vec3 uCol2;',
    'uniform float uTime;',
    'varying float vShape;',
    'varying float vPhase;',
    'varying float vFog;',
    'float heart(vec2 p){',
    '  p = p * 2.0 - 1.0;',
    '  p.y -= 0.12;',
    '  p.x *= 1.15;',
    '  float a = atan(p.x, p.y) / 3.141593;',
    '  float r = length(p);',
    '  float h = abs(a);',
    '  float d = (13.0 * h - 22.0 * h * h + 10.0 * h * h * h) / (6.0 - h);',
    '  return clamp(d - r, 0.0, 1.0);',
    '}',
    'void main(){',
    '  vec2 uv = gl_PointCoord;',
    '  float a = 0.0;',
    '  if (vShape > 0.5) {',
    '    a = 1.0 - smoothstep(0.0, 0.10, heart(uv));', // heart shape
    '  } else {',
    '    float d = length(uv - 0.5);',
    '    a = 1.0 - smoothstep(0.08, 0.5, d);', // soft glow orb
    '  }',
    '  float tw = 0.75 + 0.25 * sin(uTime * 1.4 + vPhase * 6.2831);',
    '  vec3 col = mix(uCol1, uCol2, vShape);',
    '  float alpha = a * vFog * tw * 0.5;', // brightness cap
    '  gl_FragColor = vec4(col * alpha, alpha);',
    '}'
  ].join('\n');

  const THEME_MAP = {
    terracotta: { scene: 'embers', col1: [0.95, 0.62, 0.42], col2: [0.89, 0.34, 0.24] },
    rose: { scene: 'hearts', col1: [0.98, 0.72, 0.78], col2: [0.92, 0.40, 0.50] },
    midnight: { scene: 'stars', col1: [0.72, 0.82, 0.98], col2: [0.45, 0.62, 0.95] },
    forest: { scene: 'stars', col1: [0.68, 0.88, 0.72], col2: [0.35, 0.70, 0.48] },
    gold: { scene: 'embers', col1: [1.0, 0.85, 0.55], col2: [0.90, 0.62, 0.25] },
    mono: { scene: 'stars', col1: [0.85, 0.83, 0.80], col2: [0.60, 0.58, 0.55] }
  };

  let gl = null, canvas = null, program = null;
  let buffers = {}, data = null, raf = null, running = false;
  let lastT = 0, time = 0;
  let pointer = { x: 0, y: 0, tx: 0, ty: 0 };
  let particles = [];
  let cfg = { scene: 'hearts', col1: [1, 0.7, 0.6], col2: [0.9, 0.35, 0.25] };
  let onHiddenPause = null;
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function compile(type, src) {
    const s = gl.createShader(type);
    gl.shaderSource(s, src);
    gl.compileShader(s);
    if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
      console.warn('shader:', gl.getShaderInfoLog(s));
      return null;
    }
    return s;
  }

  function makeParticles(scene, count) {
    const arr = [];
    for (let i = 0; i < count; i++) {
      let shape = 0, size = 30 + Math.random() * 30;
      if (scene === 'hearts') {
        const isHeart = Math.random() < 0.55;
        shape = isHeart ? 1 : 0;
        size = isHeart ? 34 + Math.random() * 36 : 60 + Math.random() * 70;
      } else if (scene === 'stars') {
        shape = 0;
        size = 16 + Math.random() * 26;
      } else { // embers
        shape = Math.random() < 0.25 ? 1 : 0;
        size = 20 + Math.random() * 40;
      }
      arr.push({
        x: (Math.random() * 2 - 1) * 3.2,
        y: (Math.random() * 2 - 1) * 2.4,
        z: Math.random() * 2 + 0.4,
        vy: 0.02 + Math.random() * 0.05,
        vx: (Math.random() - 0.5) * 0.02,
        sway: 0.2 + Math.random() * 0.8,
        phase: Math.random(),
        size, shape
      });
    }
    return arr;
  }

  function mat4mul(a, b) {
    const o = new Float32Array(16);
    for (let c = 0; c < 4; c++) {
      for (let r = 0; r < 4; r++) {
        o[c * 4 + r] = a[0 * 4 + r] * b[c * 4 + 0] + a[1 * 4 + r] * b[c * 4 + 1] + a[2 * 4 + r] * b[c * 4 + 2] + a[3 * 4 + r] * b[c * 4 + 3];
      }
    }
    return o;
  }

  function perspective(fovy, aspect, near, far) {
    const f = 1 / Math.tan(fovy / 2), nf = 1 / (near - far);
    const o = new Float32Array(16);
    o[0] = f / aspect; o[5] = f; o[10] = (far + near) * nf; o[11] = -1; o[14] = 2 * far * near * nf;
    return o;
  }

  function rotateXY(rx, ry) {
    const cx = Math.cos(rx), sx = Math.sin(rx), cy = Math.cos(ry), sy = Math.sin(ry);
    // rotY then rotX
    const my = new Float32Array([cy, 0, -sy, 0, 0, 1, 0, 0, sy, 0, cy, 0, 0, 0, 0, 1]);
    const mx = new Float32Array([1, 0, 0, 0, 0, cx, sx, 0, 0, -sx, cx, 0, 0, 0, 0, 1]);
    return mat4mul(mx, my);
  }

  function stepParticles(dt) {
    const s = cfg.scene;
    for (const p of particles) {
      if (s === 'embers') {
        p.y += p.vy * dt * 0.55;
        p.x += Math.sin(time * 0.7 + p.phase * 6.28) * 0.0006 * p.sway * dt * 60;
      } else if (s === 'hearts') {
        p.y += p.vy * dt * 0.35;
        p.x += Math.sin(time * 0.5 + p.phase * 6.28) * 0.0005 * p.sway * dt * 60;
      } else { // stars: halka drift + parallax hi kaafi
        p.x += p.vx * dt * 0.3;
      }
      if (p.y > 2.6) { p.y = -2.6; p.x = (Math.random() * 2 - 1) * 3.2; }
      if (p.x > 3.6) p.x = -3.6;
      if (p.x < -3.6) p.x = 3.6;
    }
  }

  function fillBuffers() {
    const n = particles.length;
    const pos = new Float32Array(n * 3);
    const meta = new Float32Array(n * 3);
    particles.forEach((p, i) => {
      pos[i * 3] = p.x; pos[i * 3 + 1] = p.y; pos[i * 3 + 2] = -p.z;
      meta[i * 3] = p.size; meta[i * 3 + 1] = p.shape; meta[i * 3 + 2] = p.phase;
    });
    gl.bindBuffer(gl.ARRAY_BUFFER, buffers.pos);
    gl.bufferData(gl.ARRAY_BUFFER, pos, gl.DYNAMIC_DRAW);
    gl.bindBuffer(gl.ARRAY_BUFFER, buffers.meta);
    gl.bufferData(gl.ARRAY_BUFFER, meta, gl.DYNAMIC_DRAW);
  }

  function frame(now) {
    if (!running) return;
    const dt = Math.min(0.05, lastT ? (now - lastT) / 1000 : 0.016);
    lastT = now;
    time += dt;

    pointer.x += (pointer.tx - pointer.x) * 0.04;
    pointer.y += (pointer.ty - pointer.y) * 0.04;

    stepParticles(dt);
    fillBuffers();

    const aspect = canvas.width / Math.max(1, canvas.height);
    const proj = perspective(0.9, aspect, 0.1, 10);
    const rot = rotateXY(pointer.y * 0.35, pointer.x * 0.5);
    const mvp = mat4mul(proj, rot);

    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.useProgram(program);
    gl.uniformMatrix4fv(data.uMvp, false, mvp);
    gl.uniform1f(data.uScale, canvas.height * 0.9);
    gl.uniform1f(data.uTime, time);
    gl.uniform3fv(data.uCol1, cfg.col1);
    gl.uniform3fv(data.uCol2, cfg.col2);

    gl.bindBuffer(gl.ARRAY_BUFFER, buffers.pos);
    gl.vertexAttribPointer(data.aPos, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(data.aPos);
    gl.bindBuffer(gl.ARRAY_BUFFER, buffers.meta);
    gl.vertexAttribPointer(data.aMeta, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(data.aMeta);

    gl.drawArrays(gl.POINTS, 0, particles.length);
    raf = requestAnimationFrame(frame);
  }

  function resize() {
    if (!canvas) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5); // mobile DPR cap (v7 audit)
    const w = Math.floor(canvas.clientWidth * dpr);
    const h = Math.floor(canvas.clientHeight * dpr);
    if (canvas.width !== w || canvas.height !== h) {
      canvas.width = w; canvas.height = h;
      if (gl) gl.viewport(0, 0, w, h);
    }
  }

  function teardown() {
    running = false;
    if (raf) { cancelAnimationFrame(raf); raf = null; }
    if (!gl) return;
    if (buffers.pos) { gl.deleteBuffer(buffers.pos); }
    if (buffers.meta) { gl.deleteBuffer(buffers.meta); }
    if (program) { gl.deleteProgram(program); }
    const ext = gl.getExtension('WEBGL_lose_context');
    if (ext) ext.loseContext(); // memory leak zero (v7 fix)
    gl = null; program = null; buffers = {};
  }

  const GLBG = {
    available: !!window.WebGLRenderingContext && !reduced,
    themeFor(theme) { return THEME_MAP[theme] || THEME_MAP.terracotta; },
    start(theme, canvasEl) {
      if (reduced) return false; // reduced-motion: poora blanket off
      canvas = canvasEl;
      const t = THEME_MAP[theme] || THEME_MAP.terracotta;
      cfg = { scene: t.scene, col1: t.col1, col2: t.col2 };
      try {
        gl = canvas.getContext('webgl', { alpha: true, antialias: false, depth: false, premultipliedAlpha: true });
        if (!gl) return false;
        const vs = compile(gl.VERTEX_SHADER, VERT);
        const fs = compile(gl.FRAGMENT_SHADER, FRAG);
        if (!vs || !fs) { teardown(); return false; }
        program = gl.createProgram();
        gl.attachShader(program, vs);
        gl.attachShader(program, fs);
        gl.linkProgram(program);
        if (!gl.getProgramParameter(program, gl.LINK_STATUS)) { teardown(); return false; }
        gl.deleteShader(vs); gl.deleteShader(fs);

        data = {
          aPos: gl.getAttribLocation(program, 'aPos'),
          aMeta: gl.getAttribLocation(program, 'aMeta'),
          uMvp: gl.getUniformLocation(program, 'uMvp'),
          uScale: gl.getUniformLocation(program, 'uScale'),
          uTime: gl.getUniformLocation(program, 'uTime'),
          uCol1: gl.getUniformLocation(program, 'uCol1'),
          uCol2: gl.getUniformLocation(program, 'uCol2')
        };
        buffers.pos = gl.createBuffer();
        buffers.meta = gl.createBuffer();

        gl.disable(gl.DEPTH_TEST);
        gl.depthMask(false); // v7: additive + no depth writes
        gl.enable(gl.BLEND);
        gl.blendFunc(gl.ONE, gl.ONE);

        const mobile = Math.min(window.innerWidth, window.innerHeight) < 640;
        const base = mobile ? 70 : 110; // particles trimmed (v7 audit)
        const count = cfg.scene === 'stars' ? Math.floor(base * 1.25) : base;
        particles = makeParticles(cfg.scene, count);

        resize();
        window.addEventListener('resize', resize);

        if (!onHiddenPause) {
          onHiddenPause = function () {
            if (document.hidden && running) { running = false; if (raf) cancelAnimationFrame(raf); }
            else if (!running && gl) { running = true; lastT = 0; raf = requestAnimationFrame(frame); }
          };
          document.addEventListener('visibilitychange', onHiddenPause);
        }

        running = true;
        raf = requestAnimationFrame(frame);
        return true;
      } catch (e) {
        teardown();
        return false;
      }
    },
    pointer(x, y) { // -1..1
      pointer.tx = x; pointer.ty = y;
    },
    stop: teardown
  };

  window.GLBG = GLBG;
})();
