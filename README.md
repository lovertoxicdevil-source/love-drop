# 💖 LOVE DROP — Hinglish Proposal Web App

Poora full-stack web app — Node.js server (zero dependencies) + PWA.

**Deploy:** Render.com pe free — repo mein `render.yaml` ready hai.

## Structure
```
server.js   ← Node backend (koi npm install nahi chahiye)
public/     ← frontend (prebuilt — PWA ready)
src/        ← source code (tools/build.py se public/ build hota hai)
portable/   ← single-file offline version
```

## Run locally
```
node server.js   → http://localhost:3000
```

## Deploy (Render, free)
Repo ka `render.yaml` use hota hai — build khaali, start `node server.js`.
Deploy ke baad Admin → Security mein apna Google Client ID set karo (user sign-in + admin login ke liye).

## Features
- 🪄 5-step proposal wizard + live tracking (views + YES/NO + reply)
- 👤 v11: Google sign-in for normal users — proposals account mein save
- ✨ v12: 45 premium animations — 10 naye 3D WebGL scenes, split-text reveals, cinematic transitions, hug/kiss cinema, 3D gift box
- 🎮 5 games, 15 themes, 36 videos, 248 gifts, 500 ideas, easter eggs
- 🔒 Privacy-first: admin ko users ka data nahi dikhta
