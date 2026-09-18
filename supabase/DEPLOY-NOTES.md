# Love Drop — Supabase Hosting (LIVE)

Site live hai ye edge function se:
  https://ktzyncoafautqanxxeou.supabase.co/functions/v1/love/

## Setup jo is project mein already done hai
- Edge function "love" deployed (verify_jwt = false) — poora site + API + static assets
- Files DB mein: ld_files (gzb64 rows) + ld_chunks (25KB chunks for big files)
- Tables: ld_config, ld_proposals, ld_users, ld_admin_sessions, ld_user_sessions

## Naya version deploy karna ho toh
1. Frontend change: src/ edit karo, `python3 tools/build.py` chalao
2. public/index.html ko gzip+base64 karke ld_files mein 'index.html' row update karo
   (js/app.js, css/style.css, fonts, icons — same tarika)
3. Edge function change: supabase/edge-love/index.ts edit karo, deploy:
   supabase functions deploy love --no-verify-jwt

## URLs
- Home:      /functions/v1/love/
- Proposal:  /functions/v1/love/p/<id>
- API:       /functions/v1/love/api/...
- Assets:    /functions/v1/love/js/app.js, /css/style.css, /fonts/..., /icons/...

## Admin
- lovertoxicdevil@gmail.com / password (default: iloveyou — Admin Panel se change karo)
- Google sign-in ke liye: Google Cloud Console mein authorized origin add karo
  https://ktzyncoafautqanxxeou.supabase.co — phir Admin → Security mein Client ID daalo
