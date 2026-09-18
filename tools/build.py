#!/usr/bin/env python3
"""Build LOVE DROP web app:
   public/          → served by server.js (split css/js, PWA-ready)
   portable/        → single-file fallback version (sab kuch inline)
"""
import pathlib, re

ROOT = pathlib.Path(__file__).resolve().parent.parent  # repo root (build.py tools/ ke andar hai)
SRC = ROOT / "src"
PUB = ROOT / "public"
PORT = ROOT / "portable"
(PUB / "css").mkdir(parents=True, exist_ok=True)
(PUB / "js").mkdir(parents=True, exist_ok=True)
PORT.mkdir(parents=True, exist_ok=True)

head = (SRC / "head.html").read_text()
body = (SRC / "body.html").read_text()
js_parts = sorted(SRC.glob("js*.js"))
js = "\n\n".join(f.read_text() for f in js_parts)
js = re.sub(r"/\* =+.*?=+ \*/", "", js)  # banner comments hatao (hand-built source)

# --- extract css ---
m = re.search(r"<style>(.*)</style>", head, re.S)
css = m.group(1)
(PUB / "css" / "style.css").write_text(css)

# --- app.js ---
(PUB / "js" / "app.js").write_text(js)

# --- public/index.html (linked files + PWA) ---
head_pub = head.replace(
    '<link rel="icon"',
    '<link rel="manifest" href="manifest.webmanifest">\n'
    '<meta name="theme-color" content="#e4573d">\n'
    '<meta name="apple-mobile-web-app-capable" content="yes">\n'
    '<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">\n'
    '<link rel="apple-touch-icon" href="icons/icon-512.png">\n'
    '<link rel="icon"',
    1,
)
head_pub = re.sub(r"<style>.*?</style>", '<link rel="stylesheet" href="css/style.css">', head_pub, flags=re.S)
idx = head_pub + body + '\n<script src="js/app.js"></script>\n</body>\n</html>\n'
(PUB / "index.html").write_text(idx)

# --- portable single-file version ---
port = head + body + "\n<script>\n" + js + "\n</script>\n</body>\n</html>\n"
(PORT / "love-drop-portable.html").write_text(port)

print(f"public/index.html : {len(idx)//1024} KB")
print(f"public/js/app.js  : {len(js)//1024} KB  ({len(js_parts)} modules)")
print(f"public/css/style.css : {len(css)//1024} KB")
print(f"portable/love-drop-portable.html : {len(port)//1024} KB")
