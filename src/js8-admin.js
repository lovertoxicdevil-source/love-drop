"use strict";
/* ================= ADMIN — 100+ controls ================= */
const ZOD=["Aries ♈","Taurus ♉","Gemini ♊","Cancer ♈","Leo ♌","Virgo ♍","Libra ♎","Scorpio ♏","Sagittarius ♐","Capricorn ♑","Aquarius ♒","Pisces ♓"];
const R={tab:0,rows:[
  /* ❤️ PROFILE — 10 */
  {t:"❤️ Profile",ty:"text",l:"Uska naam",k:"herName",s:"Pura site is naam se bhar jayega 💕"},
  {t:"❤️ Profile",ty:"text",l:"Tumhara naam",k:"hisName",s:"Celebration movie mein aayega"},
  {t:"❤️ Profile",ty:"date",l:"First meet date",k:"firstMeet"},
  {t:"❤️ Profile",ty:"date",l:"Anniversary date",k:"anniversary"},
  {t:"❤️ Profile",ty:"select",l:"Uski zodiac",k:"zHer",o:ZOD},
  {t:"❤️ Profile",ty:"select",l:"Tumhari zodiac",k:"zHis",o:ZOD},
  /* 📷 PHOTOS — 5 */
  {t:"📷 Photos",ty:"btn",l:"Photo 1 upload (intro) 🖼️",act:"ph1Up",s:"Intro pe round frame mein dikhegi (720px auto-compress)"},
  {t:"📷 Photos",ty:"btn",l:"Photo 1 hatao",act:"ph1Clear"},
  {t:"📷 Photos",ty:"btn",l:"Photo 2 upload (celebration) 💑",act:"ph2Up",s:"YES ke baad end screen pe dikhegi"},
  {t:"📷 Photos",ty:"btn",l:"Photo 2 hatao",act:"ph2Clear"},
  {t:"📷 Photos",ty:"info",l:"Status",info:()=>"Photo1: "+(CFG.photo1?"✅ set":"❌ khaali")+" · Photo2: "+(CFG.photo2?"✅ set":"❌ khaali")},
  {t:"📷 Photos",ty:"btn",l:"🎤 Voice note upload",act:"voiceUp",s:"Apni awaaz ka message — intro pe play button milega (<2MB save hota hai)"},
  {t:"📷 Photos",ty:"btn",l:"Voice note test ▶",act:"voiceTest"},
  {t:"📷 Photos",ty:"btn",l:"Voice note hatao",act:"voiceClear"},
  {t:"📷 Photos",ty:"toggle",l:"Time greeting (Good morning/night 🌅)",k:"timeGreet"},
  /* 💬 MESSAGES — 11 */
  {t:"💬 Messages",ty:"text",l:"Intro title (typed text)",k:"introTitle"},
  {t:"💬 Messages",ty:"text",l:"Intro subtitle",k:"introSub"},
  {t:"💬 Messages",ty:"text",l:"THE Final question 💍",k:"finalQ"},
  {t:"💬 Messages",ty:"text",l:"Final question subtitle",k:"finalSub"},
  {t:"💬 Messages",ty:"text",l:"Yes button label",k:"yesLabel"},
  {t:"💬 Messages",ty:"text",l:"No button label",k:"noLabel"},
  {t:"💬 Messages",ty:"textarea",l:"No-button ke bhagne wale dialogues",k:"noReplies",s:"Har line = ek dialogue"},
  {t:"💬 Messages",ty:"text",l:"Yes ke baad wala text",k:"afterYes"},
  {t:"💬 Messages",ty:"textarea",l:"Yes ke baad message",k:"afterYesMsg"},
  {t:"💬 Messages",ty:"textarea",l:"Love letter (custom gift + Phone mode note)",k:"letter"},
  {t:"💬 Messages",ty:"textarea",l:"🃏 Reasons deck — ek line = ek reason",k:"reasons",s:"Lines ko | se alag karo (max 12) — Phone mode ke saath 💘"},
  /* 🎮 GAMES — 11 */
  {t:"🎮 Games",ty:"num",l:"Heart Catcher target score",k:"catchTarget",min:5,max:50},
  {t:"🎮 Games",ty:"num",l:"Memory pairs (3-6)",k:"memPairs",min:3,max:6},
  {t:"🎮 Games",ty:"num",l:"Pyaar Pop time (seconds)",k:"popTime",min:10,max:90},
  {t:"🎮 Games",ty:"num",l:"Pyaar Pop target",k:"popTarget",min:5,max:60},
  {t:"🎮 Games",ty:"range",l:"Wheel speed",k:"wheelSpeed",min:.5,max:2,step:.05},
  {t:"🎮 Games",ty:"textarea",l:"Quiz Q1 — format: sawaal | option1 | option2 | option3",k:"quiz1",s:"Optional — khali chhodo toh default"},
  {t:"🎮 Games",ty:"textarea",l:"Quiz Q2",k:"quiz2"},
  {t:"🎮 Games",ty:"textarea",l:"Quiz Q3",k:"quiz3"},
  {t:"🎮 Games",ty:"textarea",l:"Quiz Q4",k:"quiz4"},
  {t:"🎮 Games",ty:"textarea",l:"Quiz Q5",k:"quiz5"},
  /* 🎨 DESIGN — 10 */
  {t:"🎨 Design",ty:"select",l:"Default theme",k:"theme",o:THEMES.map(t=>t.name),ovals:THEMES.map(t=>t.id)},
  {t:"🎨 Design",ty:"range",l:"Particle density",k:"density",min:10,max:150,step:5,fx:"bg"},
  {t:"🎨 Design",ty:"range",l:"Animation speed",k:"speed",min:.2,max:2.5,step:.1,fx:"bg"},
  {t:"🎨 Design",ty:"color",l:"Custom accent color",k:"accent",fx:"css"},
  {t:"🎨 Design",ty:"range",l:"Corner radius",k:"radius",min:0,max:40,fx:"css"},
  {t:"🎨 Design",ty:"range",l:"Glass blur",k:"blur",min:0,max:30,fx:"css"},
  {t:"🎨 Design",ty:"select",l:"Font style",k:"font",o:["Classic","Elegant","Rounded","Mono"],ovals:["seg","georgia","nunito","mono"],fx:"css"},
  {t:"🎨 Design",ty:"toggle",l:"Title glow",k:"glow",fx:"css"},
  {t:"🎨 Design",ty:"btn",l:"Custom background image upload",act:"bgUp",s:"Photo ka dataURL local save hota hai"},
  {t:"🎨 Design",ty:"btn",l:"Clear background image",act:"bgClear"},
  /* ✨ EFFECTS — 10 */
  {t:"✨ Effects",ty:"toggle",l:"Cursor heart trail",k:"trail"},
  {t:"✨ Effects",ty:"toggle",l:"Click hearts burst",k:"clickHearts"},
  {t:"✨ Effects",ty:"toggle",l:"Screen shake on 💔",k:"shake"},
  {t:"✨ Effects",ty:"toggle",l:"Flash on YES",k:"flash"},
  {t:"✨ Effects",ty:"range",l:"Confetti amount",k:"confetti",min:0,max:300,step:10},
  {t:"✨ Effects",ty:"range",l:"Fireworks count",k:"fireworks",min:0,max:20},
  {t:"✨ Effects",ty:"range",l:"Typewriter speed (ms)",k:"typeSpeed",min:10,max:150,step:5},
  {t:"✨ Effects",ty:"range",l:"FX size",k:"fxScale",min:.5,max:2,step:.1},
  {t:"✨ Effects",ty:"toggle",l:"Naam fireworks (YES pe) 🎆",k:"nameFireworks"},
  {t:"✨ Effects",ty:"btn",l:"Naam firework test 🎆",act:"nameTest"},
  {t:"✨ Effects",ty:"toggle",l:"Typing dots before questions 💬",k:"typingDots"},
  {t:"✨ Effects",ty:"toggle",l:"Heart loading screen 💗",k:"loadScreen"},
  {t:"✨ Effects",ty:"toggle",l:"Auto-quality (slow phone pe turbo ⚡)",k:"autoQuality"},
  {t:"✨ Effects",ty:"toggle",l:"3D mode (tilt + depth + 3D entrances 🎮)",k:"d3",fx:"d3"},
  {t:"✨ Effects",ty:"select",l:"3D background (WebGL 🌌)",k:"bg3d",o:["Auto (theme-wise)","Starfield 3D","3D Hearts","Tunnel 3D","Bubbles 3D","Fireworks 3D","Galaxy 3D","DNA Helix 3D 🧬","Wave Terrain 🌊","Fireflies ✨","Heart Tunnel 💗","Aurora Veil 🌌","Meteor Storm 🌠","Snowfall 3D ❄️","Vortex 🌀","Infinity Loop ♾️","Butterflies 🦋","Off"],ovals:["auto","starfield","hearts3d","tunnel","bubbles3d","fireworks3d","galaxy","helix3d","waves3d","fireflies","hearttunnel","aurora3d","meteors","snow3d","vortex","infinity","butterflies","off"]},
  /* 💫 PREMIUM v12 — 19 */
  {t:"💫 Premium",ty:"toggle",l:"3D text reveal (split-char blur-in)",k:"txtFx",s:"Headings har screen par char-by-char blur se sharp hote hain"},
  {t:"💫 Premium",ty:"toggle",l:"Gold shimmer sweep (titles)",k:"shimmer"},
  {t:"💫 Premium",ty:"select",l:"Scene transition effect 🎬",k:"sceneFx",o:["Random 🎲","Curtain (parda)","Circle portal ⭕","Blinds","Diamond 💎","Pixel grid","Heart burst 💖","Off"],ovals:["random","curtain","iris","blinds","diamond","pixels","hearts","off"]},
  {t:"💫 Premium",ty:"toggle",l:"Film grain + vignette (cinematic)",k:"grain"},
  {t:"💫 Premium",ty:"toggle",l:"Magnetic buttons 🧲",k:"magnet",s:"Desktop — buttons cursor ki taraf khinchte hain"},
  {t:"💫 Premium",ty:"toggle",l:"Touch ripple (buttons)",k:"ripple"},
  {t:"💫 Premium",ty:"toggle",l:"Cursor spotlight glow",k:"spotlight"},
  {t:"💫 Premium",ty:"toggle",l:"Sparkle cursor trail ✨",k:"trailFx"},
  {t:"💫 Premium",ty:"toggle",l:"Sound-reactive background 🎵",k:"sndFx",s:"Music ke beat pe 3D bg pulse karta hai"},
  {t:"💫 Premium",ty:"toggle",l:"3D spinning ring (celebration 💍)",k:"ring3d"},
  {t:"💫 Premium",ty:"toggle",l:"ECG heartbeat line (intro)",k:"ecg"},
  {t:"💫 Premium",ty:"toggle",l:"Auto cinema (idle pe slideshow)",k:"cinemaAuto",s:"90 sec idle ke baad Ken Burns photo+quote slideshow"},
  {t:"💫 Premium",ty:"btn",l:"🫂 Jhappi cinema — TEST",act:"premHug"},
  {t:"💫 Premium",ty:"btn",l:"😘 Flying kiss — TEST",act:"premKiss"},
  {t:"💫 Premium",ty:"btn",l:"🌹 Petal shower — TEST",act:"premPetals"},
  {t:"💫 Premium",ty:"btn",l:"🌠 Shooting star wish — TEST",act:"premWish"},
  {t:"💫 Premium",ty:"btn",l:"🎆 Grand finale — TEST",act:"premFinale"},
  {t:"💫 Premium",ty:"btn",l:"🎬 Cinema mode — TEST",act:"premCinema"},
  /* 🔊 SOUND — 6 */
  {t:"🔊 Sound",ty:"toggle",l:"Background music",k:"music"},
  {t:"🔊 Sound",ty:"toggle",l:"Sound effects",k:"sfx"},
  {t:"🔊 Sound",ty:"range",l:"Volume",k:"volume",min:0,max:1,step:.05,fx:"vol"},
  {t:"🔊 Sound",ty:"select",l:"Music tune",k:"tune",o:["Soft Arpeggio","Dreamy Waltz","Starlight"],ovals:[0,1,2]},
  {t:"🔊 Sound",ty:"select",l:"Music source",k:"musicSource",o:["Synth tune","Custom gaana 🎵"],ovals:["synth","custom"]},
  {t:"🔊 Sound",ty:"text",l:"Custom audio URL (mp3 link)",k:"audioUrl",s:"Kahin host kiya hai toh direct link paste karo"},
  {t:"🔊 Sound",ty:"btn",l:"Apna gaana upload 🎧",act:"audioUp",s:"<1.5MB → permanent save · badi file → sirf is session"},
  {t:"🔊 Sound",ty:"btn",l:"Test gaana chalao ▶",act:"audioTest"},
  {t:"🔊 Sound",ty:"btn",l:"Test sound effect 🎵",act:"testSfx"},
  {t:"🔊 Sound",ty:"btn",l:"Restart music",act:"testMusic"},
  /* 🎁 GIFTS — 8 */
  {t:"🎁 Gifts",ty:"info",l:"Gifts collected",info:()=>`${Gifts.got.size} / ${Gifts.count()}`},
  {t:"🎁 Gifts",ty:"toggle",l:"Show rarity labels",k:"showRarity",fx:"gifts"},
  {t:"🎁 Gifts",ty:"text",l:"Custom legendary gift title",k:"customGiftTitle",s:"Legendary gift click karne pe ye dikhega"},
  {t:"🎁 Gifts",ty:"textarea",l:"Custom legendary gift message",k:"customGiftMsg"},
  {t:"🎁 Gifts",ty:"btn",l:"Unlock ALL gifts ❤️",act:"unlockGifts"},
  {t:"🎁 Gifts",ty:"btn",l:"Reset gift collection",act:"resetGifts"},
  {t:"🎁 Gifts",ty:"btn",l:"Open Gift Vault",act:"openGifts"},
  /* 🥚 EASTER — 8 */
  {t:"🥚 Easter",ty:"info",l:"Eggs found",info:()=>`${Eggs.got.size} / ${EGGS.length}`},
  {t:"🥚 Easter",ty:"toggle",l:"Show egg hints",k:"eggHints"},
  {t:"🥚 Easter",ty:"toggle",l:"Konami code enabled",k:"konamiOn"},
  {t:"🥚 Easter",ty:"text",l:"Egg reward extra message",k:"eggRewardMsg"},
  {t:"🥚 Easter",ty:"btn",l:"Unlock all eggs (debug)",act:"unlockEggs"},
  /* 📊 STATS — 8 */
  {t:"📊 Stats",ty:"info",l:"👀 Page views",info:()=>S.views},
  {t:"📊 Stats",ty:"info",l:"🎮 Games played",info:()=>S.games},
  {t:"📊 Stats",ty:"info",l:"💖 YES clicks",info:()=>S.yes},
  {t:"📊 Stats",ty:"info",l:"😈 No-button dodges",info:()=>S.noDodge},
  {t:"📊 Stats",ty:"info",l:"🎁 Gifts collected",info:()=>S.gifts},
  {t:"📊 Stats",ty:"info",l:"🥚 Eggs found",info:()=>S.eggs},
  {t:"📊 Stats",ty:"info",l:"🎨 Themes tried",info:()=>S.themes+" / 15"},
  {t:"📊 Stats",ty:"btn",l:"Reset all stats",act:"resetStats"},
  /* 🔗 SHARE — 9 */
  {t:"🔗 Share",ty:"html",html:'<div id="srvLinks" style="width:100%"><p class="muted">⏳ server links...</p></div>'},
  {t:"🔗 Share",ty:"info",l:"Server status",info:()=>SRV.mode==="server"?"🟢 Web app mode — tracking ON":"🟡 Portable mode — offline links only"},
  {t:"🔗 Share",ty:"textarea",l:"Offline shareable link (backup, file-mode ke liye)",id:"shareOut",ro:true,info:()=>Share.last},
  {t:"🔗 Share",ty:"toggle",l:"Include theme in link",id:"incTheme"},
  {t:"🔗 Share",ty:"toggle",l:"🙈 Blind preview (WhatsApp pe naam na dikhe)",k:"ogBlind",s:"Link preview neutral rahega — surprise safe"},
  {t:"🔗 Share",ty:"btn",l:"Generate + Copy link 📋",act:"genLink"},
  {t:"🔗 Share",ty:"btn",l:"Preview link (naye tab)",act:"prevLink"},
  {t:"🔗 Share",ty:"btn",l:"WhatsApp pe bhejo 💬",act:"waLink"},
  {t:"🔗 Share",ty:"info",l:"Note",info:()=>"Link khud mein pura message leke jaata hai — uske phone pe bhi naam dikhega ✨"},
  /* 🔐 SECURITY — 6 */
  {t:"🔐 Security",ty:"info",l:"Owner email",info:()=>ADMIN_EMAIL},
  {t:"🔐 Security",ty:"pw",l:"Purana password",id:"oldPwIn"},
  {t:"🔐 Security",ty:"pw",l:"Naya password",id:"newPwIn"},
  {t:"🔐 Security",ty:"btn",l:"Save password",act:"savePw"},
  {t:"🔐 Security",ty:"toggle",l:"Admin lock after demo",k:"lockAfterDemo"},
  {t:"🔐 Security",ty:"btn",l:"Logout",act:"logout"},
  {t:"🔐 Security",ty:"info",l:"Default password",info:()=>"iloveyou (isko badal lo!)"}
  ,
  {t:"🔐 Security",ty:"text",l:"Google Client ID (OAuth)",k:"gClientId",s:"Google Cloud se — niche guide hai 📖"},
  {t:"🔐 Security",ty:"btn",l:"Google setup guide 📖",act:"gSetup"},
  {t:"🔐 Security",ty:"info",l:"Google sign-in status",info:()=>CFG.gClientId?"✅ Client ID set — Sign in with Google ACTIVE":"⚠️ Set nahi — abhi password login only"},
  /* ⚙️ SYSTEM — 10 */
  {t:"⚙️ System",ty:"btn",l:"💾 FULL backup download (config+links)",act:"backupDl",s:"Regular le lo — hosting restart se bachne ke liye"},
  {t:"⚙️ System",ty:"btn",l:"♻️ Full backup restore",act:"backupRestore"},
  {t:"⚙️ System",ty:"btn",l:"Export config only (backup)",act:"exportCfg"},
  {t:"⚙️ System",ty:"btn",l:"Import config",act:"importCfg"},
  {t:"⚙️ System",ty:"range",l:"Demo speed",k:"demoSpeed",min:.5,max:3,step:.1},
  {t:"⚙️ System",ty:"toggle",l:"Auto-play demo on open",k:"autoplayDemo"},
  {t:"⚙️ System",ty:"btn",l:"Run self-test 🧪",act:"selfTest"},
  {t:"⚙️ System",ty:"info",l:"Version",info:()=>"v"+CFG.version},
  {t:"⚙️ System",ty:"info",l:"Storage used",info:()=>{let n=0;try{for(const k in localStorage)if(k.startsWith("ld_"))n+=(localStorage[k]||"").length}catch(e){}return(n/1024).toFixed(1)+" KB"}},
  {t:"⚙️ System",ty:"btn",l:"⚠️ Factory reset (sab delete)",act:"factory"},
  /* 🎬 VIDEOS — 5 */
  {t:"🎬 Videos",ty:"toggle",l:"YES ke baad cutu video auto-play",k:"videoAfterYes"},
  {t:"🎬 Videos",ty:"range",l:"Video speed",k:"animSpeed",min:.5,max:2,step:.1},
  {t:"🎬 Videos",ty:"select",l:"Favourite video",k:"favVideo",o:VIDS.map(v=>v.t),ovals:VIDS.map(v=>v.t)},
  {t:"🎬 Videos",ty:"btn",l:"Favourite video chalao ▶",act:"playFav"},
  {t:"🎬 Videos",ty:"btn",l:"Video gallery kholo 🎬",act:"openAnim"},
  /* 📊 PLATFORM — 6 (aggregates only — privacy) */
  {t:"📊 Platform",ty:"info",l:"Total proposals baney",info:()=>ServerAPI.lastTotals?ServerAPI.lastTotals.proposals+" 💘":"⏳ Share tab kholo"},
  {t:"📊 Platform",ty:"info",l:"Total YES 💖",info:()=>ServerAPI.lastTotals?ServerAPI.lastTotals.yes:"…"},
  {t:"📊 Platform",ty:"info",l:"Total link opens",info:()=>ServerAPI.lastTotals?ServerAPI.lastTotals.views:"…"},
  {t:"📊 Platform",ty:"info",l:"Replies aaye",info:()=>ServerAPI.lastTotals?ServerAPI.lastTotals.replies:"…"},
  {t:"📊 Platform",ty:"info",l:"🔒 Privacy promise",info:()=>"Users ke private replies sirf unke creator dekh sakte hain — admin ke paas sirf counts"},
  {t:"📊 Platform",ty:"btn",l:"Landing page dekho 🏠",act:"goLanding"}
]};

const ACTIONS={
  bgUp(){const inp=document.createElement("input");inp.type="file";inp.accept="image/*";
    inp.onchange=()=>{const f=inp.files[0];if(!f)return;const rd=new FileReader();
      rd.onload=()=>{CFG.bgImage=rd.result;saveCfg();BG.build();Toast.show("🖼️ Background image set!")};rd.readAsDataURL(f)};
    inp.click();},
  bgClear(){CFG.bgImage="";saveCfg();BG.build();Toast.show("Background cleared")},
  testSfx(){AudioSys.sfx("tada")},
  testMusic(){CFG.music=true;AudioSys.stopMusic();AudioSys.startMusic();saveCfg()},
  unlockGifts(){Gifts.build();Gifts.all.forEach(g=>Gifts.got.add(g.n));Gifts.saveGot();Gifts.render(true);Toast.show("🎁 Poora vault unlocked! "+Gifts.got.size+" gifts ❤️")},
  resetGifts(){Gifts.got.clear();Gifts.saveGot();Gifts.render(true);Toast.show("Gift collection reset")},
  openGifts(){Vaults.open("gifts")},
  _photoUp(key,label){
    const inp=document.createElement("input");inp.type="file";inp.accept="image/*";
    inp.onchange=()=>{const f=inp.files[0];if(!f)return;
      const rd=new FileReader();
      rd.onload=()=>{const img=new Image();
        img.onload=()=>{
          const mx=720,sc=Math.min(1,mx/Math.max(img.width,img.height));
          const cv=document.createElement("canvas");cv.width=Math.round(img.width*sc);cv.height=Math.round(img.height*sc);
          cv.getContext("2d").drawImage(img,0,0,cv.width,cv.height);
          CFG[key]=cv.toDataURL("image/jpeg",.82);saveCfg();Intro.applyNames();
          Toast.show("🖼️ "+label+" set! (auto-compressed "+cv.width+"×"+cv.height+")");Fx.confetti(20);
        };
        img.onerror=()=>Toast.show("❌ Ye image load nahi hui");
        img.src=rd.result};
      rd.readAsDataURL(f)};
    inp.click();
  },
  ph1Up(){ACTIONS._photoUp("photo1","Photo 1")},
  ph2Up(){ACTIONS._photoUp("photo2","Photo 2")},
  ph1Clear(){CFG.photo1="";saveCfg();Intro.applyNames();Toast.show("Photo 1 hatai")},
  ph2Clear(){CFG.photo2="";saveCfg();Intro.applyNames();Toast.show("Photo 2 hatai")},
  audioUp(){
    const inp=document.createElement("input");inp.type="file";inp.accept="audio/*";
    inp.onchange=()=>{const f=inp.files[0];if(!f)return;
      if(f.size<1500000){
        const rd=new FileReader();
        rd.onload=()=>{CFG.audioData=rd.result;CFG.musicSource="custom";saveCfg();
          AudioSys.stopMusic();if(CFG.music)AudioSys.startMusic();
          Toast.show("🎵 Gaana saved: <b>"+esc(f.name)+"</b> — ab ye loop chalega!")};
        rd.readAsDataURL(f);
      }else{
        CFG.audioUrl=URL.createObjectURL(f);CFG.musicSource="custom";saveCfg();
        AudioSys.stopMusic();if(CFG.music)AudioSys.startMusic();
        Toast.show("🎵 Gaana chal raha hai — <b>session-only</b> (file badi hai). Chhoti file (<1.5MB) save hoti hai.");
      }};
    inp.click();
  },
  audioTest(){CFG.music=true;AudioSys.stopMusic();AudioSys.startMusic();saveCfg();Toast.show("▶ Test chal raha hai — "+(CFG.musicSource==="custom"?"custom gaana":"synth tune"))},
  nameTest(){Fx.nameShow(CFG.herName||"JAAN");AudioSys.sfx("good")},
  voiceUp(){
    const inp=document.createElement("input");inp.type="file";inp.accept="audio/*";
    inp.onchange=()=>{const f=inp.files[0];if(!f)return;
      if(f.size<2000000){
        const rd=new FileReader();
        rd.onload=()=>{CFG.voiceData=rd.result;saveCfg();Intro.applyNames();Toast.show("🎤 Voice note saved! Intro pe play button aa gaya")};
        rd.readAsDataURL(f);
      }else{
        CFG.voiceUrl=URL.createObjectURL(f);saveCfg();Intro.applyNames();
        Toast.show("🎤 Voice chal raha — <b>session-only</b> (file badi). Chhoti file (<2MB) permanent save hoti hai");
      }};
    inp.click();
  },
  voiceClear(){CFG.voiceData="";CFG.voiceUrl="";saveCfg();Intro.applyNames();Toast.show("Voice note hatai")},
  voiceTest(){AudioSys.voiceToggle(true)},
  backupDl(){ServerAPI.backupDl()},
  backupRestore(){ServerAPI.backupRestore()},
  wizard(){Wizard.start()},
  playFav(){const i=Math.max(0,VIDS.findIndex(v=>v.t===CFG.favVideo));ANIM.play(i)},
  goLanding(){Nav.go("s-landing")},
  openAnim(){ANIM.gallery()},
  gSetup(){
    Modal.open("genModal");
    $("#genModalBody").innerHTML=`
      <div style="font-size:48px">🔐</div><h3>Google Sign-In Setup (2 min)</h3>
      <div style="text-align:left;font-size:13.5px;line-height:1.9;color:#ffd9e2">
      1️⃣ <b>console.cloud.google.com</b> kholo → project banao<br>
      2️⃣ <b>APIs & Services → Credentials → Create Credentials → OAuth client ID</b><br>
      3️⃣ Application type: <b>Web application</b><br>
      4️⃣ <b>Authorized JavaScript origins</b> mein apni site ka URL daalo<br>
      &nbsp;&nbsp;&nbsp;(jaise <code>https://your-site.netlify.app</code>)<br>
      5️⃣ Client ID copy karke niche paste karo ✅</div>
      <p class="muted" style="margin-top:10px">⚠️ Jis link pe site live hogi, wahi origin add karna. Preview sandbox mein Google script block hota hai — deployed site pe perfect chalega. Client ID set hone tak password login bhi kaam karta rahega.</p>
      <input class="inp" id="gcidIn" placeholder="XXXX.apps.googleusercontent.com" style="width:100%;margin-top:8px" value="${esc(CFG.gClientId)}">
      <div class="btn-row">
        <button class="btn" onclick="GS.saveId()">Save Client ID ✅</button>
        <button class="btn ghost" onclick="GS.simulate()">🧪 Preview test login</button>
      </div>`;
  },
  unlockEggs(){EGGS.forEach(e=>Eggs.got.add(e.id));LS.set("eggs",[...Eggs.got]);S.eggs=Eggs.got.size;saveStats();Eggs.updateBadge();Admin.render();Toast.show("🥚 Saare eggs unlocked — ab asli maza hints ke bina aayega 😄")},
  resetStats(){Object.assign(S,{views:0,games:0,yes:0,noDodge:0,gifts:0,eggs:0,secs:0});saveStats();Admin.render();Toast.show("📊 Stats reset")},
  genLink(){Share.generate(true)},
  prevLink(){Share.generate(false);window.open(Share.last,"_blank")},
  waLink(){Share.generate(false);window.open("https://wa.me/?text="+encodeURIComponent(Share.last+(CFG.shareMsg?"\n\n"+CFG.shareMsg:"")),"_blank")},
  async savePw(){
    const np=($("#newPwIn")?.value||"").trim(),op=($("#oldPwIn")?.value||"").trim();
    if(np.length<4)return Toast.show("Naya password kam se kam 4 characters");
    if(SRV.mode==="server"&&SRV.token){
      try{
        const r=await fetch("api/admin/pw",{method:"POST",headers:ServerAPI.hdr(),body:JSON.stringify({old:op,new:np})});
        const j=await r.json();
        if(j.ok){$("#oldPwIn")&&($("#oldPwIn").value="");$("#newPwIn")&&($("#newPwIn").value="");Toast.show("🔐 Server password changed! Naya password yaad rakhna");return}
        return Toast.show("❌ "+(j.msg||"Password change fail"));
      }catch(e){}
    }
    CFG.pw=np;saveCfg();Toast.show("🔐 Password saved (local mode)");
  },
  logout(){LS.del("adminOk");LS.del("gUser");GS.user=null;$("#adminPanel").style.display="none";$("#adminLogin").style.display="block";GS.mount();Toast.show("Bye Admin 👋")},
  exportCfg(){const data=JSON.stringify(CFG,null,2);const a=document.createElement("a");
    a.href=URL.createObjectURL(new Blob([data],{type:"application/json"}));a.download="love-config.json";a.click();Toast.show("💾 Config exported")},
  importCfg(){const inp=document.createElement("input");inp.type="file";inp.accept="application/json";
    inp.onchange=()=>{const f=inp.files[0];if(!f)return;const rd=new FileReader();
      rd.onload=()=>{try{const j=JSON.parse(rd.result);CFG=Object.assign(CFG,j);delete CFG.pw;saveCfg();location.reload()}catch(e){Toast.show("❌ Invalid file")}};rd.readAsText(f)};
    inp.click();},
  selfTest(){
    const res=[];
    res.push(["Canvas",!!BG.ctx&&!!Fx.ctx]);
    res.push(["Audio API",!!(window.AudioContext||window.webkitAudioContext)]);
    let okLS=false;try{localStorage.setItem("ld_t","1");localStorage.removeItem("ld_t");okLS=true}catch(e){}
    res.push(["LocalStorage",okLS]);
    res.push(["Gifts 200+ ("+Gifts.count()+")",Gifts.count()>=200]);
    res.push(["Ideas 500+ ("+Ideas.count()+")",Ideas.count()>=500]);
    res.push(["Features 1000+ ("+Feats.count()+")",Feats.count()>=1000]);
    res.push(["Themes 50 ("+THEMES.length+")",THEMES.length===50]);
    res.push(["Admin controls 100+ ("+Admin.count()+")",Admin.count()>=100]);
    res.push(["Easter eggs ("+EGGS.length+")",EGGS.length>=12]);
    res.push(["Cutu videos 30+ ("+VIDS.length+")",VIDS.length>=30]);
    const pass=res.every(r=>r[1]);
    Modal.open("genModal");
    $("#genModalBody").innerHTML=`<div style="font-size:52px">${pass?"✅":"⚠️"}</div><h3>Self Test</h3>
      <div style="text-align:left;font-size:14px;line-height:2">${res.map(r=>`${r[1]?"✅":"❌"} ${r[0]}`).join("<br>")}</div>
      <div class="btn-row"><button class="btn" onclick="Modal.close('genModal')">Perfect 👌</button></div>`;
    AudioSys.sfx(pass?"good":"nope");
  },
  factory(){if(confirm("SACH MEIN? Sab data delete ho jayega (config, stats, eggs, gifts)... 😨")){try{Object.keys(localStorage).filter(k=>k.startsWith("ld_")).forEach(k=>localStorage.removeItem(k))}catch(e){}location.reload()}}
};

const Share={
  last:"",
  generate(copy){
    const base=location.href.split("#")[0];
    let payload;
    if(CFG.shareScope==="full"){const{pw,...rest}=CFG;payload=Object.assign({},rest,{__scope:"full"})}
    else{payload={__scope:"mini",herName:CFG.herName,hisName:CFG.hisName,introTitle:CFG.introTitle,introSub:CFG.introSub,finalQ:CFG.finalQ,letter:CFG.letter,afterYesMsg:CFG.afterYesMsg,theme:$("#incTheme")?.checked!==false?CFG.theme:undefined,msg:CFG.shareMsg||undefined}}
    this.last=base+"#c="+encodeURIComponent(btoa(unescape(encodeURIComponent(JSON.stringify(payload)))));
    const ta=$("#shareOut");if(ta){ta.value=this.last}
    if(copy){
      const done=()=>Toast.show("📋 Link copy ho gaya! Ab usko bhej do — wo kholte hi naam saamne 💌");
      if(navigator.clipboard&&navigator.clipboard.writeText)navigator.clipboard.writeText(this.last).then(done).catch(()=>this.fallbackCopy(done));
      else this.fallbackCopy(done);
    }
  },
  fallbackCopy(done){const ta=$("#shareOut");if(ta){ta.removeAttribute("readonly");ta.select();try{document.execCommand("copy");done()}catch(e){Toast.show("Link select ho gaya — manually copy kar lo 🙏")}ta.setAttribute("readonly","")}}
};

const Admin={
  count(){return R.rows.length},
  open(){
    Nav.go("s-admin");
    if(LS.get("adminOk",false)&&S.adminOkOnce)this.render();else{$("#adminLogin").style.display="block";$("#adminPanel").style.display="none"}

  },
  _grant(msg){
    LS.set("adminOk",true);S.adminOkOnce=true;saveStats();
    $("#adminErr").textContent="";$("#adminLogin").style.display="none";
    this.render();AudioSys.sfx("good");Fx.confetti(50);
    Toast.show(msg);
  },
  async login(){
    const em=$("#adminEmail").value.trim().toLowerCase(),pw=$("#adminPass").value;
    if(em!==ADMIN_EMAIL){$("#adminErr").textContent="❌ Galat email — sirf owner allowed hai";AudioSys.sfx("nope");return}
    // WEB APP MODE: server-side auth (hashed pw + session token)
    if(SRV.mode==="server"){
      try{
        const j=await ServerAPI.login(pw,em);
        if(j.ok){
          SRV.token=j.token;LS.set("adminToken",j.token);
          if(j.user){GS.user=j.user;LS.set("gUser",j.user)}
          this._grant("👑 Welcome back, Admin! Poora control tumhare haath mein"+(j.user?" (Google verified ✅)":""));
          if(!LS.get("wizardDone",false))setTimeout(()=>Wizard.start(),900);
          return;
        }
        $("#adminErr").textContent="❌ "+(j.msg||"Login fail");AudioSys.sfx("nope");return;
      }catch(e){Toast.show("⚠️ Server tak nahi pahuncha — local check chala raha hoon")}
    }
    // fallback: local (portable file mode)
    const p=LS.get("pw","iloveyou");
    if(pw===p)this._grant("👑 Welcome back, Admin! (local mode)");
    else{$("#adminErr").textContent="❌ Galat password 😅";AudioSys.sfx("nope")}
  },
  sideFx(k){
    if(k==="theme"||k==="density"||k==="speed"){if(k==="theme")BG.apply(CFG.theme,false);else BG.build()}
    if(k==="accent")document.documentElement.style.setProperty("--accent",CFG.accent);
    if(k==="radius")document.documentElement.style.setProperty("--radius",CFG.radius+"px");
    if(k==="blur")document.documentElement.style.setProperty("--blur",CFG.blur+"px");
    if(k==="font"){const F={seg:"'Segoe UI',system-ui,sans-serif",georgia:"Georgia,'Times New Roman',serif",nunito:"'Trebuchet MS',Verdana,sans-serif",mono:"'Courier New',monospace"};document.body.style.fontFamily=F[CFG.font]||F.seg}
    if(k==="glow")document.body.classList.toggle("noglow",!CFG.glow);
    if(k=="vol")AudioSys.setVol();
    if(k==="introTitle"){$("#typed").textContent=CFG.introTitle}
    if(k=="introSub")$("#introSub").textContent=CFG.introSub;
    if(k=="herName"){$("#tbHer").textContent=CFG.herName==="Meri Jaan"?"You":CFG.herName}
    if(k=="music"){CFG.music?AudioSys.startMusic():AudioSys.stopMusic()}
    if(k=="musicSource"){AudioSys.stopMusic();if(CFG.music)AudioSys.startMusic()}
    if(k=="d3"&&!CFG.d3){$$(".tilt3d").forEach(el=>{el.style.setProperty("--rx","0deg");el.style.setProperty("--ry","0deg")});const a=$("#app");if(a)a.style.transform=""}
    if(k=="d3"||k=="bg3d"){try{if(typeof BG3D!=="undefined"){if(BG3D.enabled()&&CFG.d3){BG3D.resume();if(BG.theme)BG3D.sync(BG.theme)}else BG3D.halt()}}catch(e){}}
    if(k=="showEggCounter"){$("#konamiHint").style.display=CFG.showEggCounter?"block":"none"}
    if(k&&k.startsWith("quiz"))this.parseQuiz();
    Eggs.updateBadge();
  },
  parseQuiz(){
    for(let i=1;i<=5;i++){
      const raw=(CFG["quiz"+i]||"").trim();
      if(!raw)continue;
      const parts=raw.split("|").map(x=>x.trim()).filter(Boolean);
      if(parts.length>=2){
        CFG.quiz[i-1]={q:parts[0],o:parts.slice(1,4),r:CFG.quiz[i-1]&&CFG.quiz[i-1].r&&CFG.quiz[i-1].r.length===3?CFG.quiz[i-1].r:["Aww 💕","Haha 😂","Sahi hai 😌"]};
      }
    }
  },
  render(){
    $("#adminPanel").style.display="block";
    $("#adminHi").textContent=`${ADMIN_EMAIL} — ${CFG.herName} ke liye sab kuch customize karo 💕`;
    const gu=GS.user;
    $("#adminUserChip").innerHTML=gu
      ?`<span class="a-user">${gu.picture?`<img src="${esc(gu.picture)}" alt="">`:"✅"} Signed in as <b>&nbsp;${esc(gu.name||gu.email)}</b>&nbsp;· ${esc(gu.email)}${gu.sim?" · 🧪 test":""}</span>`
      :`<span class="a-user">🔑 Password login · ${esc(ADMIN_EMAIL)}</span>`;
    const tabs=[...new Set(R.rows.map(r=>r.t))];
    $("#adminTabs").innerHTML=tabs.map((t,i)=>`<button class="a-tab ${i===R.tab?"on":""}" data-i="${i}">${t}</button>`).join("");
    $$("#adminTabs .a-tab").forEach(b=>b.onclick=()=>{R.tab=+b.dataset.i;this.render()});
    $("#ctrlCount").textContent=this.count();
    const body=$("#adminBody");body.innerHTML="";
    R.rows.filter(r=>r.t===tabs[R.tab]).forEach(r=>{
      const row=document.createElement("div");row.className="a-row";
      let ctl="";
      if(r.ty==="text"||r.ty==="date"||r.ty==="pw")ctl=`<input class=\"inp\" type=\"${r.ty==="date"?"date":r.ty==="pw"?"password":"text"}\" value=\"${esc(r.k?String(CFG[r.k]??""):"")}\" data-k=\"${r.k||""}\" data-id=\"${r.id||""}\">`;
      else if(r.ty==="textarea")ctl=`<textarea class=\"inp\" data-k=\"${r.k||""}\">${esc(r.k?String(CFG[r.k]??""):"")}</textarea>`;
      else if(r.ty==="num")ctl=`<input class="inp" type="number" style="max-width:110px" value="${CFG[r.k]}" min="${r.min}" max="${r.max}" data-k="${r.k}">`;
      else if(r.ty==="range")ctl=`<input type="range" min="${r.min}" max="${r.max}" step="${r.step}" value="${CFG[r.k]}" data-k="${r.k}"><span class="muted" style="min-width:40px">${CFG[r.k]}</span>`;
      else if(r.ty==="color")ctl=`<input type="color" value="${CFG[r.k]}" data-k="${r.k}">`;
      else if(r.ty==="select"){const vals=r.ovals||r.o;const cur=r.k==="tune"?String(CFG[r.k]):CFG[r.k];
        ctl=`<select class=\"inp\" data-k=\"${r.k}\">${r.o.map((o,i)=>`<option value="${esc(String(vals[i]))}" ${String(cur)===String(vals[i])?"selected":""}>${esc(o)}</option>`).join("")}</select>`;}
      else if(r.ty==="toggle")ctl=`<label class="switch"><input type="checkbox" ${CFG[r.k]?"checked":""} data-k="${r.k}"><span class="sl"></span></label>`;
      else if(r.ty==="btn")ctl=`<button class="btn sm" data-act="${r.act}">${esc(r.l.split(" ").slice(-1))} ▶</button>`;
      else if(r.ty==="html")ctl=r.html;
      else if(r.ty==="info")ctl=`<b style="color:var(--accent2);font-size:13.5px;max-width:340px;text-align:right">${esc(String(r.info()))}</b>`;
      row.innerHTML=`<label>${esc(r.l)}${r.s?`<small>${esc(r.s)}</small>`:""}</label>${ctl}`;
      body.appendChild(row);
    });
    // bindings
    $$("#adminBody [data-k]").forEach(el=>{
      const k=el.dataset.k;if(!k)return;
      const ev=el.type==="range"||el.type=="color"||el.tagName==="SELECT"?"input":(el.type==="checkbox"?"change":"change");
      el.addEventListener(ev,()=>{
        let v;
        if(el.type==="checkbox")v=el.checked;
        else if(el.type=="range"){v=parseFloat(el.value);const sp=el.nextElementSibling;if(sp&&sp.classList.contains("muted"))sp.textContent=v}
        else if(el.type=="number")v=clamp(parseFloat(el.value)||0,parseFloat(el.min)||0,parseFloat(el.max)||9999);
        else if(k==="tune")v=parseInt(el.value);
        else v=el.value;
        CFG[k]=v;saveCfg();this.sideFx(k);
      });
      if(el.type=="range")el.addEventListener("change",()=>{if(k==="density"||k==="speed")BG.build()});
    });
    $$("#adminBody [data-act]").forEach(b=>b.onclick=()=>{ACTIONS[b.dataset.act]&&ACTIONS[b.dataset.act]()});
    $("#incTheme")&&($("#incTheme").checked=true);
    const so=$("#shareOut");if(so){so.value=Share.last||"Generate + Copy dabao — link yahan aayega 💌";so.setAttribute("readonly","")}
    if(tabs[R.tab]==="🔗 Share")ServerAPI.renderLinks();
    Eggs.updateBadge();
  }
};

/* ================= GOOGLE SIGN-IN ================= */
const GS={
  user:null,_loading:false,
  mount(){
    const wrap=$("#gbtnWrap");if(!wrap)return;
    if(this.user){wrap.innerHTML=`<span class="a-user">✅ ${esc(this.user.name||this.user.email)} (Google)</span>`;return}
    if(!CFG.gClientId){
      wrap.innerHTML=`<p class="muted" style="font-size:12.5px;max-width:300px">🔑 Google Client ID set nahi hai — <span class="linkish" onclick="ACTIONS.gSetup()">setup guide kholo (2 min)</span> ya password se login karo</p>`;
      return;
    }
    if(window.google&&window.google.accounts&&window.google.accounts.id){this.renderBtn();return}
    wrap.innerHTML=`<p class="muted" style="font-size:12.5px">⏳ Google load ho raha...</p>`;
    if(this._loading)return;this._loading=true;
    const s=document.createElement("script");
    s.src="https://accounts.google.com/gsi/client";s.async=true;s.defer=true;
    s.onload=()=>{this._loading=false;this.renderBtn()};
    s.onerror=()=>{this._loading=false;
      wrap.innerHTML=`<p class="muted" style="font-size:12.5px;max-width:320px">⚠️ Google script yahan load nahi hua (preview sandbox/offline). <b>Deployed link pe ye button turant kaam karega.</b> Filhal password ya test login use karo.</p><span class="linkish" onclick="GS.simulate()">🧪 Preview test login</span>`;
    };
    document.head.appendChild(s);
  },
  renderBtn(){
    const wrap=$("#gbtnWrap");if(!wrap||!window.google||!window.google.accounts)return;
    try{
      google.accounts.id.initialize({client_id:CFG.gClientId,callback:r=>GS.onCred(r)});
      wrap.innerHTML="";
      google.accounts.id.renderButton(wrap,{theme:"filled_black",size:"large",shape:"pill",text:"continue_with",locale:"en",width:280});
    }catch(e){wrap.innerHTML='<p class="muted" style="font-size:12.5px">⚠️ Google button error: '+esc(e.message)+'</p>'}
  },
  saveId(){
    const v=($("#gcidIn")?.value||"").trim();
    if(!v){Toast.show("❌ Client ID khaali hai");return}
    CFG.gClientId=v;saveCfg();Modal.close("genModal");
    Toast.show("✅ Google Client ID saved! Ab <b>Sign in with Google</b> button active hai");
    this._loading=false;this.mount();
  },
  simulate(){this.grant({email:ADMIN_EMAIL,name:"Owner",picture:null,sim:true})},
  b64d(p){p=p.replace(/-/g,"+").replace(/_/g,"/");while(p.length%4)p+="=";
    return decodeURIComponent(atob(p).split("").map(ch=>"%"+("00"+ch.charCodeAt(0).toString(16)).slice(-2)).join(""))},
  async onCred(resp){
    // v11: admin login screen par nahi hain? toh ye credential NORMAL USER sign-in hai — route karo
    const adminBox=$("#adminLogin");
    const onAdminScreen=!!(document.querySelector("#s-admin.active")&&adminBox&&adminBox.style.display!=="none");
    if(!onAdminScreen&&typeof UserAuth!=="undefined")return UserAuth.onCred(resp);
    // WEB APP MODE: server verifies the Google token properly
    if(SRV.mode==="server"){
      try{
        const j=await ServerAPI.glogin(resp.credential);
        if(j.ok){
          SRV.token=j.token;LS.set("adminToken",j.token);
          this.user=j.user;LS.set("gUser",j.user);
          $("#adminLogin").style.display="none";
          Admin.render();AudioSys.sfx("good");Fx.confetti(60);
          Toast.show("✅ Google sign-in success!<br>Welcome <b>"+esc(j.user.name||j.user.email)+"</b> 👑");return;
        }
        Toast.show("❌ "+(j.msg||"Google login fail"));AudioSys.sfx("nope");return;
      }catch(e){/* offline — fallback below */}
    }
    try{
      const u=JSON.parse(this.b64d(resp.credential.split(".")[1]));
      this.grant({email:(u.email||"").toLowerCase(),name:u.name||u.email,picture:u.picture||null});
    }catch(e){Toast.show("❌ Google response parse nahi hua — dobara try karo")}
  },
  grant(u){
    if((u.email||"").toLowerCase()!==ADMIN_EMAIL){
      Toast.show("❌ Ye Google account owner ka nahi hai<br>Sirf <b>"+ADMIN_EMAIL+"</b> allowed hai 😎");
      AudioSys.sfx("nope");return;
    }
    this.user=u;LS.set("gUser",u);LS.set("adminOk",true);S.adminOkOnce=true;saveStats();
    const lb=$("#adminLogin");if(lb)lb.style.display="none";
    Admin.render();AudioSys.sfx("good");Fx.confetti(60);
    Toast.show("✅ Google sign-in success!<br>Welcome <b>"+esc(u.name||u.email)+"</b> 👑");
  }
};
