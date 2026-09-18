# Love Drop

Dil ki baat, link ke saath. Hinglish proposal platform: koi bhi account bana ke apna
personal proposal page bana sakta hai, link bhej sakta hai, aur dashboard pe
sab track kar sakta hai.

## Kya kya hai isme

**Creator ke liye**
- Login/signup (email + password). Proposal banane ke liye account zaroori hai.
- 5-step wizard: Naam, Photo (4MB tak), Gaana + Note + Wajah, Sawaal + Theme, Link.
- Teen synth tunes (WebAudio se live bajti hain, koi file download nahi).
- "Help me write": 2-4 lafz do, kachcha Hinglish draft milega. Offline hai, koi API nahi.
- 6 themes: Terracotta, Rose, Midnight, Forest, Gold, Mono.
- Link expiry (24h / 3d / 7d) aur view limit (3 / 5 / 10 alag viewers).
- Blind preview: default mein WhatsApp/Insta pe sirf "Tumhare liye kuch hai" dikhta hai,
  naam nahi. Chaaho toh naam wala preview on kar do.
- Dashboard: views, jawab, No-kitni-baar-bhaga, uska reply, edit aur delete.
- Backup download + wapas import (apne account ke proposals).

**Viewer ke liye**
- Loading progress bar ke saath splash, phir sawaal (typewriter), phir "Dil Pakdo" game,
  phir aakhri sawaal.
- NO button bhaagta rehta hai: hover ya tap karo, kahin aur nikal jaata hai. Funny
  captions bhi aate hain. YES dabaana asaan hai, NO kareeb bhi nahi jaata.
- YES pe: fireworks + dil ki baarish, naam reveal, wajah flip cards, dheere-dheere
  typewriter note, aur reply box.
- Haptic feedback, quick controls (gaana on/off, background on/off) hamesha visible.
- Wapas aane par celebration screen seedha khulta hai.

**Site-owner ke liye**
- Admin panel (`/admin`): sirf aggregate ginntiyan (log, proposals, viewers, YES, No-dodge,
  replies) aur 14-din ka chart.
- PRIVACY (hard rule): admin ko kisi user ka content, naam, ya reply nahi dikhta.
  Sirf counts. Backup mein bhi admin ka data hi hota hai, users ka nahi.

**Technical**
- Rate limiting: reply 8/hour/IP, login/signup 20/15min, view 60/min.
- Input sanitization: sab rendering textContent se, koi raw HTML inject nahi hota.
- Photo uploads random naam se store hote hain, sirf jpg/png/webp.
- PWA: manifest + service worker (offline shell, API kabhi cache nahi).
- WebGL background: additive blending, depth-fog, DPR cap 1.5 mobile pe,
  tab hidden hone pe render pause, off karne pe poora context release
  (koi memory leak nahi), `prefers-reduced-motion` pe poora off.
- Tilt3D cards: max 6deg, 400ms smooth return.

## Chalao locally

```
npm install
npm start
```

Phir http://localhost:3000 kholo.

Environment variables:

| Variable | Kaam | Default |
|---|---|---|
| `PORT` | Server port | 3000 |
| `SESSION_SECRET` | Session secret (production mein zaroor daalo) | random (restart pe gir jaayega) |
| `OWNER_EMAIL` | Admin panel wala email | lovertoxicdevil@gmail.com |
| `DATA_DIR` | SQLite file ka folder | ./data |

## Stack (aur kyun)

- **Node.js + Express**: chhota, seedha, Render jaisi jagah pe free mein chalta hai.
- **better-sqlite3 (WAL mode)**: zero-config database, ek file mein sab. Multi-user
  platform ke liye kaafi hai, aur backup/restore JSON se simple rehta hai.
- **express-session**: login sessions. Ek server chal raha hai toh kaafi hai.
- **Vanilla JS frontend (koi framework nahi)**: pages halki rehti hain, aur jo cheez
  page pe hoti hai wahi JS load hoti hai. WebGL, WebAudio, canvas sab raw use kiya hai.
- **Fonts self-hosted**: koi CDN JS nahi, koi tracking nahi. Heading font Bricolage
  Grotesque hai (Cabinet Grotesk ka paas-paas free alternative, kyunki Cabinet
  Grotesk ka self-host package available nahi tha).

## Roadmap (aage ja sakta hai)

- Google sign-in (OAuth setup chahiye hoga)
- Apna gaana upload (abhi 3 synth tunes hain)
- Phone-mirror mode, din-ginti counter, custom OG image
- Zyada games aur themes

## Files

```
server.js            server + routes mount + OG injection
db.js                SQLite schema
lib/auth.js          session/owner middleware
routes/auth.js       signup/login/logout
routes/proposals.js  creator CRUD + backup/restore
routes/view.js       public view/answer/dodge/reply (spoiler-safe)
routes/admin.js      aggregates only
public/              saara frontend (html/css/js, fonts, sw, manifest)
```
