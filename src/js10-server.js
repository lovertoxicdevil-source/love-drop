"use strict";
/* ================= WEB APP MODE — server glue + PWA ================= */
const SRV={mode:"file",pid:null,boot:null,token:LS.get("adminToken",null)||null};
const SRVPID=(location.pathname.match(/\/p\/([A-Za-z0-9-]+)/)||[])[1];
const FNB=location.pathname.startsWith("/functions/v1/")?"/"+location.pathname.split("/").slice(0,4).join("/"):"";
const ORIGIN=location.origin+FNB;

async function pullBoot(){
  // 1) Server-injected boot (best — zero delay, /p/:id pe server khud count karta hai)
  if(window.__SRV_BOOT__&&window.__SRV_BOOT__.mode==="server"){
    SRV.boot=window.__SRV_BOOT__;SRV.mode="server";SRV.pid=SRV.boot.pid||SRVPID||null;
    return;
  }
  // 2) Fallback: API fetch (agar static host pe deploy ho)
  try{
    const o={method:"GET"};
    const r=await fetch("api/boot"+(SRVPID?"?p="+encodeURIComponent(SRVPID):""),o);
    if(r.ok){SRV.boot=await r.json();SRV.mode="server";SRV.pid=SRVPID||null}
  }catch(e){/* file/preview mode — sab local chalega */}
}

const ServerAPI={
  _pt:null,
  hdr(){return{"Content-Type":"application/json",Authorization:"Bearer "+(SRV.token||"")}},
  pushCfg(){ /* admin config edits → server par sync (debounced) */
    if(SRV.mode!=="server"||!SRV.token)return;
    clearTimeout(this._pt);
    this._pt=setTimeout(async()=>{
      try{await fetch("api/admin/config",{method:"POST",headers:this.hdr(),body:JSON.stringify({config:CFG})})}catch(e){}
    },900);
  },
  async answer(ans,dodges){
    if(SRV.mode!=="server"||!SRV.pid)return;
    try{await fetch("api/answer",{method:"POST",headers:{"Content-Type":"application/json"},
      body:JSON.stringify({pid:SRV.pid,answer:ans,dodges:dodges||0})})}catch(e){}
  },
  async sendReply(txt){
    txt=(txt||"").trim().slice(0,500);
    if(!txt)return Toast.show("Pehle kuch likho 💕");
    if(SRV.mode==="server"&&SRV.pid){
      try{await fetch("api/answer",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({pid:SRV.pid,reply:txt})})}catch(e){}
    }
    LS.set("myReply",txt);
    $("#replyBox").innerHTML='<p style="font-weight:800;font-size:16px;color:var(--accent2)">💕 Bhej diya! Wo padh lega... tum bhi wait karo 😉</p>';
    AudioSys.sfx("good");Fx.confetti(40);
  },
  async login(pw,email){
    const r=await fetch("api/login",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({pw,email})});
    return r.json();
  },
  async glogin(credential){
    const r=await fetch("api/login",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({credential})});
    return r.json();
  },
  async state(){const r=await fetch("api/admin/state",{headers:this.hdr()});return r.json()},
  async createLink(){
    try{
      const r=await fetch("api/admin/link",{method:"POST",headers:this.hdr()});
      const j=await r.json();
      if(j.ok){this.mirrorSave(j.id);this.renderLinks();return ORIGIN+j.url}
    }catch(e){}
    return null;
  },
  async removeLink(id){try{await fetch("api/admin/unlink",{method:"POST",headers:this.hdr(),body:JSON.stringify({id})})}catch(e){}this.renderLinks()},
  async backupDl(){
    try{
      let data;
      if(SRV.mode==="server"&&SRV.token){
        const r=await fetch("api/admin/export",{headers:this.hdr()});data=await r.json();
      }else data={exportedAt:Date.now(),config:CFG,proposals:{},note:"local-mode backup"};
      const a=document.createElement("a");
      a.href=URL.createObjectURL(new Blob([JSON.stringify(data,null,2)],{type:"application/json"}));
      a.download="lovedrop-backup-"+new Date().toISOString().slice(0,10)+".json";a.click();
      Toast.show("💾 Backup downloaded! Ise sambhal ke rakhо 🙏");
    }catch(e){Toast.show("❌ Backup fail: "+esc(e.message))}
  },
  backupRestore(){
    const inp=document.createElement("input");inp.type="file";inp.accept="application/json";
    inp.onchange=async()=>{const f=inp.files[0];if(!f)return;
      const rd=new FileReader();
      rd.onload=async()=>{
        try{
          const j=JSON.parse(rd.result);
          if(SRV.mode==="server"&&SRV.token){
            const r=await fetch("api/admin/import",{method:"POST",headers:this.hdr(),body:JSON.stringify({config:j.config,proposals:j.proposals})});
            const out=await r.json();
            if(out.ok){Toast.show("♻️ Restored! "+out.links+" links server par");this.renderLinks();return}
          }
          if(j.config){CFG=Object.assign(CFG,j.config);delete CFG.pw;saveCfg();Toast.show("♻️ Config restored (local mode)")}
        }catch(e){Toast.show("❌ Invalid backup file")}
      };rd.readAsText(f)};
    inp.click();
  },
  async renderLinks(){
    const box=$("#srvLinks");if(!box)return;
    if(SRV.mode!=="server"){box.innerHTML='<p class="muted">⚠️ Server mode off — ye feature deployed app / preview link pe chalega. Niche wala offline link abhi ke liye hai.</p>';return}
    box.innerHTML='<p class="muted">⏳ links load ho rahe...</p>';
    try{
      const st=await this.state();
      try{ServerAPI.lastTotals=st.totals||null}catch(e){}
      const base=ORIGIN;
      let html=`<div class="a-row" style="flex-direction:column;align-items:flex-start;gap:7px">
        <b style="font-size:13.5px">🌟 Main link (live config — edits turant dikhte hain):</b>
        <span class="muted" style="word-break:break-all">${esc(base)}/</span>
        <div style="display:flex;gap:8px;flex-wrap:wrap">
          <button class="btn sm" onclick="ServerAPI.copy('${esc(base)}/')">📋 Copy</button>
          <button class="btn ghost sm" onclick="window.open('${esc(base)}/','_blank')">👀 Kholke dekho</button>
        </div></div>
        <div class="btn-row" style="justify-content:flex-start;margin-top:6px">
          <button class="btn" onclick="ServerAPI.newLink()">💌 Naya Tracking Link Banao</button>
        </div>`;
      if(!st.ownProposals||!st.ownProposals.length){
        html+='<p class="muted">Abhi koi tracking link nahi. Banao aur bhejo — pata chalega usne khola bhi ya nahi 👀+jawab bhi live milega!</p>';
      }else{
        html+=st.ownProposals.map(pr=>{
          const url=base+"/p/"+pr.id;
          const opened=pr.lastOpened?new Date(pr.lastOpened).toLocaleString():"abhi tak nahi 😢";
          const ans=pr.answer==="yes"?'💖 <b style="color:#5ad107">YES bol diya!</b>':(pr.answer==="no"?'💔 NO :(':"⌛ wait...");
          return `<div class="a-row" style="flex-direction:column;align-items:flex-start;gap:7px">
            <b style="font-size:13.5px">🔗 /p/${esc(pr.id)}</b>
            <span class="muted" style="word-break:break-all">${esc(url)}</span>
            <span style="font-size:13px;line-height:1.7">👀 Views: <b>${pr.views||0}</b> · ⏰ Khola: <b>${esc(opened)}</b> · Jawab: ${ans}${pr.dodges?` · 😈 No-dodges: <b>${pr.dodges}</b>`:""}</span>
            ${pr.reply?`<div style="background:rgba(255,77,109,.12);border:1px solid var(--accent);border-radius:12px;padding:10px 14px;font-size:13.5px;line-height:1.6;width:100%">💬 <b>Uska reply:</b> "${esc(pr.reply)}"${pr.repliedAt?` <span class="muted">· ${new Date(pr.repliedAt).toLocaleString()}</span>`:""}</div>`:""}
            <div style="display:flex;gap:8px;flex-wrap:wrap">
              <button class="btn sm" onclick="ServerAPI.copy('${esc(url)}')">📋 Copy</button>
              <button class="btn ghost sm" onclick="ServerAPI.wa('${esc(url)}')">💬 WhatsApp</button>
              <button class="btn ghost sm" onclick="ServerAPI.removeLink('${esc(pr.id)}')">🗑️ Hatao</button>
            </div></div>`;
        }).join("");
      }
      // link mirror (backup safety): LS wale links jo server pe nahi hain
      try{
        const have=new Set((st.ownProposals||[]).map(p2=>p2.id));
        const mirror=LS.get("linkMirror",[]).filter(m2=>!have.has(m2.id));
        if(mirror.length){
          html+='<div class="a-row" style="flex-direction:column;align-items:flex-start;gap:7px;border-color:#ffd60a"><b style="font-size:13.5px">⚠️ Purane links (server restart mein gaye — 1-click wapas):</b>'+
            mirror.map(m2=>`<div style="display:flex;gap:8px;align-items:center;flex-wrap:wrap"><span class="muted">/p/${esc(m2.id)}</span><button class="btn sm" onclick="ServerAPI.recreate('${esc(m2.id)}')">♻️ Wapas lao</button></div>`).join("")+"</div>";
        }
      }catch(e){}
      box.innerHTML=html;
      // fresh activity toast
      try{
        const last=LS.get("lastSeenOpen",0);
        const fresh=(st.proposals||[]).filter(p2=>p2.lastOpened&&p2.lastOpened>last);
        if(fresh.length&&last){Toast.show("👀 <b>Update:</b> kisi ne link khola! ("+fresh.length+" view"+(fresh.length>1?"s":"")+") — Share tab mein dekho")}
        if(st.ownProposals&&st.ownProposals.length)LS.set("lastSeenOpen",Math.max(...st.ownProposals.map(p2=>p2.lastOpened||0)));
      }catch(e){}
    }catch(e){box.innerHTML='<p class="muted">❌ Server state nahi mila: '+esc(e.message)+'</p>'}
  },
  async newLink(){
    const url=await this.createLink();
    if(url){
      AudioSys.sfx("ding");Fx.confetti(30);
      Toast.show("💌 Tracking link ready!<br><b>"+esc(url)+"</b><br>Ye bhejo — views aur jawab LIVE dikhenge 👀",6000);
      try{navigator.clipboard&&navigator.clipboard.writeText(url)}catch(e){}
    }else Toast.show("❌ Link nahi bana — server se connect ho?");
  },
  mirrorSave(id){
    try{const m=LS.get("linkMirror",[]);if(!m.find(x=>x.id===id)){m.push({id,at:Date.now()});LS.set("linkMirror",m)}}catch(e){}
  },
  async recreate(id){
    try{
      const r=await fetch("api/admin/link",{method:"POST",headers:this.hdr(),body:JSON.stringify({id})});
      const j=await r.json();
      if(j.ok){Toast.show("♻️ /p/"+esc(id)+" wapas aa gaya!");this.renderLinks()}
      else Toast.show("❌ "+esc(j.msg||"fail"));
    }catch(e){Toast.show("❌ Server se connect nahi hua")}
  },
  copy(t){try{navigator.clipboard.writeText(t).then(()=>Toast.show("📋 Copied!"))}catch(e){Toast.show("Manually copy kar lo 🙏")}},
  wa(t){try{window.open("https://wa.me/?text="+encodeURIComponent(t)," _blank")}catch(e){}}
};

/* ---------- PWA service worker ---------- */
if("serviceWorker" in navigator&&/^https?:$/.test(location.protocol)){
  addEventListener("load",()=>{navigator.serviceWorker.register("/sw.js").catch(()=>{})});
}

/* ================= USER API (public creators — privacy-first) ================= */
const UserAPI={
  mine(){try{return LS.get("myProposals",[])}catch(e){return[]}},
  remember(id,code){try{const m=this.mine().filter(x=>x.id!==id);m.push({id,code,at:Date.now()});LS.set("myProposals",m)}catch(e){}},
  forget(id){try{LS.set("myProposals",this.mine().filter(x=>x.id!==id))}catch(e){}},
  _a(){const t=(typeof UserAuth!=="undefined"&&UserAuth.token)||null;return t?{Authorization:"Bearer "+t}:null}, // account token (agar signed in)
  _h(extra){return Object.assign({"Content-Type":"application/json"},extra||{},this._a()||{})},
  async create(cfg,opts){
    const r=await fetch("api/user/create",{method:"POST",headers:this._h(),
      body:JSON.stringify({config:cfg,expiresIn:opts&&opts.expiresIn||"0",viewLimit:opts&&opts.viewLimit||"0"})});
    return r.json();
  },
  async limits(id,code,expIn,viewLimit){
    const r=await fetch("api/user/limits",{method:"POST",headers:this._h(),
      body:JSON.stringify({id,code:code||"",expIn,viewLimit})});
    return r.json();
  },
  async manage(id,code){
    const r=await fetch("api/user/manage",{method:"POST",headers:this._h(),body:JSON.stringify({id,code})});
    return r.json();
  },
  async update(id,code,cfg){
    const r=await fetch("api/user/update",{method:"POST",headers:this._h(),
      body:JSON.stringify({id,code:code||"",config:cfg})});
    return r.json();
  },
  async del(id,code){
    const r=await fetch("api/user/delete",{method:"POST",headers:this._h(),body:JSON.stringify({id,code:code||""})});
    return r.json();
  }
};

/* ================= v11: USER AUTH (Google sign-in — normal users) =================
   Sign in karke proposals apne Google account mein save — kisi bhi device se access. */
const UserAuth={
  user:null,token:null,proposals:null,_gsiLoading:false,
  init(){ // saved session restore (root/creator pages par)
    const s=LS.get("userSession",null);
    if(s&&s.token){this.token=s.token;this.user=s.user;this.refresh()}
    else this.render();
  },
  signed(){return !!this.token},
  hdr(){return{"Content-Type":"application/json",Authorization:"Bearer "+(this.token||"")}},
  async refresh(){
    if(!this.token){this.render();return}
    try{
      const r=await fetch("api/user/me",{headers:this.hdr()});
      if(r.status===401){this.logout(true);return}
      const j=await r.json();
      if(j.ok){this.user=j.user;this.proposals=j.proposals;LS.set("userSession",{token:this.token,user:j.user})}
    }catch(e){}
    this.render();
    if(typeof Manage!=="undefined"&&Nav.current==="s-manage")Manage.renderList();
  },
  async onCred(resp){ // GS.onCred yahan route karta hai (admin screen ke alawa)
    try{
      const r=await fetch("api/user/login",{method:"POST",headers:{"Content-Type":"application/json"},
        body:JSON.stringify({credential:resp.credential,claim:UserAPI.mine()})});
      const j=await r.json();
      if(!j.ok){Toast.show("❌ "+(j.msg||"Sign-in fail — dobara try karo"));AudioSys.sfx("nope");return}
      this.token=j.token;this.user=j.user;
      LS.set("userSession",{token:j.token,user:j.user});
      AudioSys.sfx("good");Fx.confetti(40);
      Toast.show("✅ Sign in ho gaya! <b>"+esc(j.user.name||j.user.email)+"</b><br>Ab tumhare proposals account mein safe hain 💾",5000);
      if(j.claimed)setTimeout(()=>Toast.show("♻️ "+j.claimed+" purana proposal bhi account mein aa gaya"),1800);
      this.refresh();
    }catch(e){Toast.show("❌ Server se connect nahi hua")}
  },
  logout(silent){
    if(this.token){try{fetch("api/user/logout",{method:"POST",headers:this.hdr()})}catch(e){}}
    this.token=null;this.user=null;this.proposals=null;LS.del("userSession");
    this.render();
    if(typeof Manage!=="undefined"&&Nav.current==="s-manage")Manage.renderList();
    if(!silent)Toast.show("👋 Logged out — data server par safe hai, dobara sign in karke wapas milega");
  },
  mountBtn(wrap){
    if(!wrap)return;
    if(!CFG.gClientId){
      wrap.innerHTML='<p class="muted" style="font-size:12.5px">⚠️ Google sign-in off hai — Admin → Security mein Client ID set karo (2 min, one-time)</p>';
      return;
    }
    const paint=()=>{
      try{
        if(!window.google||!window.google.accounts||!window.google.accounts.id){wrap.innerHTML='<p class="muted" style="font-size:12.5px">⚠️ Google yahan load nahi hua — deployed link par chalega</p>';return}
        google.accounts.id.initialize({client_id:CFG.gClientId,callback:r=>GS.onCred(r)});
        wrap.innerHTML="";
        google.accounts.id.renderButton(wrap,{theme:"filled_black",size:"large",shape:"pill",text:"signin_with",locale:"en",width:280});
      }catch(e){wrap.innerHTML='<p class="muted" style="font-size:12.5px">⚠️ Google button error: '+esc(e.message)+'</p>'}
    };
    if(window.google&&window.google.accounts&&window.google.accounts.id)return paint();
    if(this._gsiLoading)return;
    this._gsiLoading=true;
    const s=document.createElement("script");s.src="https://accounts.google.com/gsi/client";s.async=true;s.defer=true;
    s.onload=()=>{UserAuth._gsiLoading=false;paint()};
    s.onerror=()=>{UserAuth._gsiLoading=false;wrap.innerHTML='<p class="muted" style="font-size:12.5px">⚠️ Google yahan load nahi hua — deployed link par chalega</p>'};
    document.head.appendChild(s);
  },
  render(){
    const lb=$("#userAuthBox");
    if(lb){
      if(this.user){
        lb.innerHTML=`<div class="u-chip">${this.user.picture?`<img src="${esc(this.user.picture)}" alt="">`:"👤"}
          <span><b>${esc(this.user.name||this.user.email)}</b> ke proposals 💾</span>
          <button class="btn sm" onclick="Manage.open()">💌 Meri Proposals${Array.isArray(this.proposals)?" ("+this.proposals.length+")":""}</button>
          <button class="btn ghost sm" onclick="UserAuth.logout()">Logout</button></div>`;
      }else{
        lb.innerHTML=`<div class="u-signin"><p style="font-weight:700;font-size:13.5px;margin:0 0 4px">💾 Account mein save karna chahte ho?</p>
          <p class="muted" style="font-size:12.5px;margin:0 0 10px">Google se sign in karo — phone kho jaye tab bhi proposals safe. Optional hai 💛</p>
          <div id="userGbtnWrap"></div></div>`;
        this.mountBtn($("#userGbtnWrap"));
      }
    }
    const mb=$("#mgAuthBox");
    if(mb){
      if(this.user){
        mb.innerHTML=`<div class="u-chip">${this.user.picture?`<img src="${esc(this.user.picture)}" alt="">`:"👤"}
          <span>✅ <b>${esc(this.user.name||this.user.email)}</b></span>
          <button class="btn ghost sm" onclick="UserAuth.logout()">Logout</button></div>`;
      }else{
        mb.innerHTML=`<div class="u-signin"><p style="font-weight:700;font-size:13.5px;margin:0 0 4px">💾 Account mein save karo (optional)</p>
          <p class="muted" style="font-size:12.5px;margin:0 0 10px">Google sign-in karke apne saare proposals har device se kholo — manage code ki zaroorat nahi rahegi 📱</p>
          <div id="mgGbtnWrap"></div></div>`;
        this.mountBtn($("#mgGbtnWrap"));
      }
    }
  }
};

/* ================= PRIVACY modal ================= */
const Privacy={
  show(){
    Modal.open("genModal");
    $("#genModalBody").innerHTML=`
      <div style="font-size:48px">🔐</div><h3>Tumhari Privacy</h3>
      <div style="text-align:left;font-size:13.5px;line-height:2;color:#ffd9e2">
      ✅ <b>Tumhara data sirf tumhara hai</b> — views, replies sirf manage code se dikhte hain<br>
      ✅ <b>Account optional hai</b> — Google sign-in sirf apne proposals backup/access ke liye (nahi karo toh manage code se sab chalega)<br>
      ✅ <b>Admin ko bhi nahi dikhta</b> — site owner sirf total counts dekh sakta hai (kitne proposals bane), tumhara naam/message/reply KABHI nahi<br>
      ✅ <b>Delete = sach mein delete</b> — manage page se delete karo, server se permanently jata hai<br>
      ✅ Naam, sawaal, photo — bas itna store hota hai jo proposal ke liye zaroori hai 🔒</div>
      <div class="btn-row"><button class="btn" onclick="Modal.close('genModal')">Theek hai 💕</button></div>`;
  }
};

/* ================= MANAGE (creator dashboard) ================= */
const Manage={
  data:null,
  open(){Nav.go("s-manage");if(UserAuth.signed())UserAuth.refresh();this.renderList();$("#mgStats").innerHTML=""},
  renderList(){
    const box=$("#mgList");
    // v11: account mode — Google sign-in ke saath banaye/saved proposals (server se live)
    if(UserAuth.signed()&&Array.isArray(UserAuth.proposals)){
      if(!UserAuth.proposals.length){box.innerHTML='<p class="muted">Is account mein abhi koi proposal nahi. 🪄 Pehle banao — sign in ho toh auto-save ho jayega!</p>';return}
      box.innerHTML=UserAuth.proposals.map(m=>{
        const nm=(m.config&&m.config.herName&&m.config.herName!=="Meri Jaan")?m.config.herName:((m.config&&m.config.finalQ||"").slice(0,44));
        return `<div class="mg-item"><span>💌 <b>${esc(nm||m.id)}</b> <span class="muted" style="font-size:11.5px">· ${new Date(m.createdAt).toLocaleDateString()}</span></span>
        <div style="display:flex;gap:6px">
          <button class="btn sm" onclick="Manage.loadOwned('${esc(m.id)}')">📊 Stats</button>
          <button class="btn ghost sm" onclick="Manage.openEditorOwned('${esc(m.id)}')">✏️ Edit</button>
          <button class="btn ghost sm" onclick="Manage.removeOwned('${esc(m.id)}')">🗑️</button>
        </div></div>`}).join("");
      return;
    }
    const mine=UserAPI.mine();
    if(!mine.length){box.innerHTML='<p class="muted">Abhi koi proposal nahi banaya. 🪄 Banao pehle!</p>';return}
    box.innerHTML=mine.map(m=>`<div class="mg-item"><span><code>${esc(m.id)}</code></span>
      <div style="display:flex;gap:6px">
        <button class="btn sm" onclick="Manage.load('${esc(m.id)}','${esc(m.code)}')">📊 Stats</button>
        <button class="btn ghost sm" onclick="Manage.openEditor('${esc(m.id)}','${esc(m.code)}')">✏️ Edit</button>
        <button class="btn ghost sm" onclick="Manage.remove('${esc(m.id)}','${esc(m.code)}')">🗑️</button>
      </div></div>`).join("");
  },
  manual(){this.load($("#mgId").value.trim(),$("#mgCode").value.trim())},
  async load(id,code){
    if(!id||!code)return Toast.show("ID aur code dono daalo 🔐");
    const j=await UserAPI.manage(id,code);
    if(!j.ok)return Toast.show("❌ "+esc(j.msg||"nahi mila"));
    this.data=j.proposal;UserAPI.remember(id,code);
    this.renderStats(j.proposal,id,code);
    AudioSys.sfx("flip");
  },
  loadOwned(id){ // v11: account proposal (bina manage code — Google session se)
    const p=(UserAuth.proposals||[]).find(x=>x.id===id);
    if(!p)return Toast.show("❌ Proposal nahi mila — list refresh ho rahi hai");
    this.data=p;this.renderStats(p,id,null);AudioSys.sfx("flip");
  },
  renderStats(p,id,code){
    const opened=p.lastOpened?new Date(p.lastOpened).toLocaleString():"abhi tak nahi 😢";
    const ans=p.answer==="yes"?'💖 <b style="color:#5ad107">YES bol diya!</b>':(p.answer==="no"?"💔 NO":"⌛ wait...");
    $("#mgStats").innerHTML=`
      <div class="mg-stat"><span>👀 Views: <b>${p.views}</b></span><span>⏰ Khola: <b>${esc(opened)}</b></span><span>Jawab: ${ans}</span>${p.dodges?`<span>😈 No-dodges: <b>${p.dodges}</b></span>`:""}</div>
      ${p.reply?`<div class="mg-reply">💬 <b>Uska reply:</b> "${esc(p.reply)}"${p.repliedAt?` <span class="muted">· ${new Date(p.repliedAt).toLocaleString()}</span>`:""}</div>`:'<p class="muted" style="margin-top:8px">Jawab aate hi reply yahan dikhega 💬</p>'}
      <div style="margin-top:14px;padding:14px;border:1px solid var(--stroke);border-radius:14px;background:var(--surface)">
        <b style="font-size:13.5px">⚙️ Privacy & Limits</b>
        <p class="muted" style="font-size:12.5px;margin:6px 0 10px">
          Status: ${p.exp&&Date.now()>p.exp?'<b style="color:#ff8fa3">EXPIRED ⏰</b>':(p.vl>0&&p.views>=p.vl?'<b style="color:#ff8fa3">VIEW LIMIT POORI 🔒</b>':'<b style="color:#7ce38b">Active ✅</b>')}
          ${p.exp?` · ⏰ Expire: <b>${new Date(p.exp).toLocaleString()}</b>`:" · ⏰ Kabhi expire nahi hoga"}${p.vl?` · 👀 Limit: <b>${p.vl} views</b> (ab tak ${p.views})`:""}</p>
        <div style="display:flex;gap:8px;flex-wrap:wrap;align-items:center">
          <select class="inp" id="mgExp" style="max-width:150px">
            <option value="0" ${!p.exp?"selected":""}>Hamesha chale</option>
            <option value="24h" ${p.exp&&p.exp-Date.now()<=864e5?"selected":""}>24 ghante</option>
            <option value="3d" ${p.exp&&p.exp-Date.now()>864e5&&p.exp-Date.now()<=2592e5?"selected":""}>3 din</option>
            <option value="7d" ${p.exp&&p.exp-Date.now()>2592e5?"selected":""}>7 din</option>
          </select>
          <select class="inp" id="mgVl" style="max-width:150px">
            <option value="0" ${!p.vl?"selected":""}>No view limit</option>
            <option value="3" ${p.vl==3?"selected":""}>3 views</option>
            <option value="5" ${p.vl==5?"selected":""}>5 views</option>
            <option value="10" ${p.vl==10?"selected":""}>10 views</option>
          </select>
          <button class="btn sm" onclick="Manage.saveLimits('${esc(p.id)}','${esc(code||"")}')">💾 Save</button>
        </div>
      </div>
      <div class="btn-row" style="margin-top:10px">
        <button class="btn sm" onclick="ServerAPI.copy('${esc(ORIGIN+"/p/"+p.id)}')">📋 Link copy</button>
        <button class="btn ghost sm" onclick="ServerAPI.wa('${esc(ORIGIN+"/p/"+p.id)}')">💬 WhatsApp</button>
        <button class="btn ghost sm" onclick="${code?`Manage.openEditor('${esc(p.id)}','${esc(code)}')`:`Manage.openEditorOwned('${esc(p.id)}')`}">✏️ Edit</button>
        <button class="btn ghost sm" onclick="${code?`Manage.remove('${esc(p.id)}','${esc(code)}')`:`Manage.removeOwned('${esc(p.id)}')`}">🗑️ Delete</button>
      </div>`;
  },
  async saveLimits(id,code){
    const j=await UserAPI.limits(id,code,$("#mgExp").value,$("#mgVl").value);
    if(j.ok){Toast.show("⚙️ Limits save ho gaye!");if(code)this.load(id,code);else this.loadOwned(id)}
    else Toast.show("❌ "+esc(j.msg||"fail"));
  },
  openEditor(id,code){
    Wizard.startUser({id,code},this.data&&this.data.id===id?this.data.config:null);
  },
  openEditorOwned(id){ // v11: account proposal edit (token se auth)
    const p=(UserAuth.proposals||[]).find(x=>x.id===id);
    if(!p)return Toast.show("❌ Proposal nahi mila");
    Wizard.startUser({id},this.data&&this.data.id===id?this.data.config:p.config);
  },
  async remove(id,code){
    if(!confirm("SACH MEIN delete? Ye hamesha ke liye jayega 😢"))return;
    const j=await UserAPI.del(id,code);
    if(j.ok){UserAPI.forget(id);Toast.show("🗑️ Deleted — data server se permanently gaya");this.renderList();$("#mgStats").innerHTML=""}
    else Toast.show("❌ "+esc(j.msg||"fail"));
  },
  async removeOwned(id){ // v11: account proposal delete (token se auth)
    if(!confirm("SACH MEIN delete? Ye hamesha ke liye jayega 😢"))return;
    const j=await UserAPI.del(id,"");
    if(j.ok){Toast.show("🗑️ Deleted — data server se permanently gaya");UserAuth.refresh();this.renderList();$("#mgStats").innerHTML=""}
    else Toast.show("❌ "+esc(j.msg||"fail"));
  }
};
