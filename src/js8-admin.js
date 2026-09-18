"use strict";
/* ================= ADMIN â€” 100+ controls ================= */
const ZOD=["Aries â™ˆ","Taurus â™‰","Gemini â™Š","Cancer â™ˆ","Leo â™Œ","Virgo â™","Libra â™","Scorpio â™","Sagittarius â™","Capricorn â™‘","Aquarius â™’","Pisces â™“"];
const R={tab:0,rows:[
  /* â¤ï¸ PROFILE â€” 10 */
  {t:"â¤ï¸ Profile",ty:"text",l:"Uska naam",k:"herName",s:"Pura site is naam se bhar jayega ğŸ’•"},
  {t:"â¤ï¸ Profile",ty:"text",l:"Tumhara naam",k:"hisName",s:"Celebration movie mein aayega"},
  {t:"â¤ï¸ Profile",ty:"date",l:"First meet date",k:"firstMeet"},
  {t:"â¤ï¸ Profile",ty:"date",l:"Anniversary date",k:"anniversary"},
  {t:"â¤ï¸ Profile",ty:"select",l:"Uski zodiac",k:"zHer",o:ZOD},
  {t:"â¤ï¸ Profile",ty:"select",l:"Tumhari zodiac",k:"zHis",o:ZOD},
  /* ğŸ“· PHOTOS â€” 5 */
  {t:"ğŸ“· Photos",ty:"btn",l:"Photo 1 upload (intro) ğŸ–¼ï¸",act:"ph1Up",s:"Intro pe round frame mein dikhegi (720px auto-compress)"},
  {t:"ğŸ“· Photos",ty:"btn",l:"Photo 1 hatao",act:"ph1Clear"},
  {t:"ğŸ“· Photos",ty:"btn",l:"Photo 2 upload (celebration) ğŸ’‘",act:"ph2Up",s:"YES ke baad end screen pe dikhegi"},
  {t:"ğŸ“· Photos",ty:"btn",l:"Photo 2 hatao",act:"ph2Clear"},
  {t:"ğŸ“· Photos",ty:"info",l:"Status",info:()=>"Photo1: "+(CFG.photo1?"âœ… set":"âŒ khaali")+" Â· Photo2: "+(CFG.photo2?"âœ… set":"âŒ khaali")},
  {t:"ğŸ“· Photos",ty:"btn",l:"ğŸ¤ Voice note upload",act:"voiceUp",s:"Apni awaaz ka message â€” intro pe play button milega (<2MB save hota hai)"},
  {t:"ğŸ“· Photos",ty:"btn",l:"Voice note test â–¶",act:"voiceTest"},
  {t:"ğŸ“· Photos",ty:"btn",l:"Voice note hatao",act:"voiceClear"},
  {t:"ğŸ“· Photos",ty:"toggle",l:"Time greeting (Good morning/night ğŸŒ…)",k:"timeGreet"},
  /* ğŸ’¬ MESSAGES â€” 11 */
  {t:"ğŸ’¬ Messages",ty:"text",l:"Intro title (typed text)",k:"introTitle"},
  {t:"ğŸ’¬ Messages",ty:"text",l:"Intro subtitle",k:"introSub"},
  {t:"ğŸ’¬ Messages",ty:"text",l:"THE Final question ğŸ’",k:"finalQ"},
  {t:"ğŸ’¬ Messages",ty:"text",l:"Final question subtitle",k:"finalSub"},
  {t:"ğŸ’¬ Messages",ty:"text",l:"Yes button label",k:"yesLabel"},
  {t:"ğŸ’¬ Messages",ty:"text",l:"No button label",k:"noLabel"},
  {t:"ğŸ’¬ Messages",ty:"textarea",l:"No-button ke bhagne wale dialogues",k:"noReplies",s:"Har line = ek dialogue"},
  {t:"ğŸ’¬ Messages",ty:"text",l:"Yes ke baad wala text",k:"afterYes"},
  {t:"ğŸ’¬ Messages",ty:"textarea",l:"Yes ke baad message",k:"afterYesMsg"},
  {t:"ğŸ’¬ Messages",ty:"textarea",l:"Love letter (custom gift + Phone mode note)",k:"letter"},
  {t:"ğŸ’¬ Messages",ty:"textarea",l:"ğŸƒ Reasons deck â€” ek line = ek reason",k:"reasons",s:"Lines ko | se alag karo (max 12) â€” Phone mode ke saath ğŸ’˜"},
  /* ğŸ® GAMES â€” 11 */
  {t:"ğŸ® Games",ty:"num",l:"Heart Catcher target score",k:"catchTarget",min:5,max:50},
  {t:"ğŸ® Games",ty:"num",l:"Memory pairs (3-6)",k:"memPairs",min:3,max:6},
  {t:"ğŸ® Games",ty:"num",l:"Pyaar Pop time (seconds)",k:"popTime",min:10,max:90},
  {t:"ğŸ® Games",ty:"num",l:"Pyaar Pop target",k:"popTarget",min:5,max:60},
  {t:"ğŸ® Games",ty:"range",l:"Wheel speed",k:"wheelSpeed",min:.5,max:2,step:.05},
  {t:"ğŸ® Games",ty:"textarea",l:"Quiz Q1 â€” format: sawaal | option1 | option2 | option3",k:"quiz1",s:"Optional â€” khali chhodo toh default"},
  {t:"ğŸ® Games",ty:"textarea",l:"Quiz Q2",k:"quiz2"},
  {t:"ğŸ® Games",ty:"textarea",l:"Quiz Q3",k:"quiz3"},
  {t:"ğŸ® Games",ty:"textarea",l:"Quiz Q4",k:"quiz4"},
  {t:"ğŸ® Games",ty:"textarea",l:"Quiz Q5",k:"quiz5"},
  /* ğŸ¨ DESIGN â€” 10 */
  {t:"ğŸ¨ Design",ty:"select",l:"Default theme",k:"theme",o:THEMES.map(t=>t.name),ovals:THEMES.map(t=>t.id)},
  {t:"ğŸ¨ Design",ty:"range",l:"Particle density",k:"density",min:10,max:150,step:5,fx:"bg"},
  {t:"ğŸ¨ Design",ty:"range",l:"Animation speed",k:"speed",min:.2,max:2.5,step:.1,fx:"bg"},
  {t:"ğŸ¨ Design",ty:"color",l:"Custom accent color",k:"accent",fx:"css"},
  {t:"ğŸ¨ Design",ty:"range",l:"Corner radius",k:"radius",min:0,max:40,fx:"css"},
  {t:"ğŸ¨ Design",ty:"range",l:"Glass blur",k:"blur",min:0,max:30,fx:"css"},
  {t:"ğŸ¨ Design",ty:"select",l:"Font style",k:"font",o:["Classic","Elegant","Rounded","Mono"],ovals:["seg","georgia","nunito","mono"],fx:"css"},
  {t:"ğŸ¨ Design",ty:"toggle",l:"Title glow",k:"glow",fx:"css"},
  {t:"ğŸ¨ Design",ty:"btn",l:"Custom background image upload",act:"bgUp",s:"Photo ka dataURL local save hota hai"},
  {t:"ğŸ¨ Design",ty:"btn",l:"Clear background image",act:"bgClear"},
  /* âœ¨ EFFECTS â€” 10 */
  {t:"âœ¨ Effects",ty:"toggle",l:"Cursor heart trail",k:"trail"},
  {t:"âœ¨ Effects",ty:"toggle",l:"Click hearts burst",k:"clickHearts"},
  {t:"âœ¨ Effects",ty:"toggle",l:"Screen shake on ğŸ’”",k:"shake"},
  {t:"âœ¨ Effects",ty:"toggle",l:"Flash on YES",k:"flash"},
  {t:"âœ¨ Effects",ty:"range",l:"Confetti amount",k:"confetti",min:0,max:300,step:10},
  {t:"âœ¨ Effects",ty:"range",l:"Fireworks count",k:"fireworks",min:0,max:20},
  {t:"âœ¨ Effects",ty:"range",l:"Typewriter speed (ms)",k:"typeSpeed",min:10,max:150,step:5},
  {t:"âœ¨ Effects",ty:"range",l:"FX size",k:"fxScale",min:.5,max:2,step:.1},
  {t:"âœ¨ Effects",ty:"toggle",l:"Naam fireworks (YES pe) ğŸ†",k:"nameFireworks"},
  {t:"âœ¨ Effects",ty:"btn",l:"Naam firework test ğŸ†",act:"nameTest"},
  {t:"âœ¨ Effects",ty:"toggle",l:"Typing dots before questions ğŸ’¬",k:"typingDots"},
  {t:"âœ¨ Effects",ty:"toggle",l:"Heart loading screen ğŸ’—",k:"loadScreen"},
  {t:"âœ¨ Effects",ty:"toggle",l:"Auto-quality (slow phone pe turbo âš¡)",k:"autoQuality"},
  {t:"âœ¨ Effects",ty:"toggle",l:"3D mode (tilt + depth + 3D entrances ğŸ®)",k:"d3",fx:"d3"},
  {t:"âœ¨ Effects",ty:"select",l:"3D background (WebGL ğŸŒŒ)",k:"bg3d",o:["Auto (theme-wise)","Starfield 3D","3D Hearts","Tunnel 3D","Bubbles 3D","Fireworks 3D","Galaxy 3D","DNA Helix 3D ğŸ§¬","Wave Terrain ğŸŒŠ","Fireflies âœ¨","Heart Tunnel ğŸ’—","Aurora Veil ğŸŒŒ","Meteor Storm ğŸŒ ","Snowfall 3D â„ï¸","Vortex ğŸŒ€","Infinity Loop â™¾ï¸","Butterflies ğŸ¦‹","Off"],ovals:["auto","starfield","hearts3d","tunnel","bubbles3d","fireworks3d","galaxy","helix3d","waves3d","fireflies","hearttunnel","aurora3d","meteors","snow3d","vortex","infinity","butterflies","off"]},
  /* ğŸ’« PREMIUM v12 â€” 19 */
  {t:"ğŸ’« Premium",ty:"toggle",l:"3D text reveal (split-char blur-in)",k:"txtFx",s:"Headings har screen par char-by-char blur se sharp hote hain"},
  {t:"ğŸ’« Premium",ty:"toggle",l:"Gold shimmer sweep (titles)",k:"shimmer"},
  {t:"ğŸ’« Premium",ty:"select",l:"Scene transition effect ğŸ¬",k:"sceneFx",o:["Random ğŸ²","Curtain (parda)","Circle portal â­•","Blinds","Diamond ğŸ’","Pixel grid","Heart burst ğŸ’–","Off"],ovals:["random","curtain","iris","blinds","diamond","pixels","hearts","off"]},
  {t:"ğŸ’« Premium",ty:"toggle",l:"Film grain + vignette (cinematic)",k:"grain"},
  {t:"ğŸ’« Premium",ty:"toggle",l:"Magnetic buttons ğŸ§²",k:"magnet",s:"Desktop â€” buttons cursor ki taraf khinchte hain"},
  {t:"ğŸ’« Premium",ty:"toggle",l:"Touch ripple (buttons)",k:"ripple"},
  {t:"ğŸ’« Premium",ty:"toggle",l:"Cursor spotlight glow",k:"spotlight"},
  {t:"ğŸ’« Premium",ty:"toggle",l:"Sparkle cursor trail âœ¨",k:"trailFx"},
  {t:"ğŸ’« Premium",ty:"toggle",l:"Sound-reactive background ğŸµ",k:"sndFx",s:"Music ke beat pe 3D bg pulse karta hai"},
  {t:"ğŸ’« Premium",ty:"toggle",l:"3D spinning ring (celebration ğŸ’)",k:"ring3d"},
  {t:"ğŸ’« Premium",ty:"toggle",l:"ECG heartbeat line (intro)",k:"ecg"},
  {t:"ğŸ’« Premium",ty:"toggle",l:"Auto cinema (idle pe slideshow)",k:"cinemaAuto",s:"90 sec idle ke baad Ken Burns photo+quote slideshow"},
  {t:"ğŸ’« Premium",ty:"btn",l:"ğŸ«‚ Jhappi cinema â€” TEST",act:"premHug"},
  {t:"ğŸ’« Premium",ty:"btn",l:"ğŸ˜˜ Flying kiss â€” TEST",act:"premKiss"},
  {t:"ğŸ’« Premium",ty:"btn",l:"ğŸŒ¹ Petal shower â€” TEST",act:"premPetals"},
  {t:"ğŸ’« Premium",ty:"btn",l:"ğŸŒ  Shooting star wish â€” TEST",act:"premWish"},
  {t:"ğŸ’« Premium",ty:"btn",l:"ğŸ† Grand finale â€” TEST",act:"premFinale"},
  {t:"ğŸ’« Premium",ty:"btn",l:"ğŸ¬ Cinema mode â€” TEST",act:"premCinema"},
  /* ğŸ”Š SOUND â€” 6 */
  {t:"ğŸ”Š Sound",ty:"toggle",l:"Background music",k:"music"},
  {t:"ğŸ”Š Sound",ty:"toggle",l:"Sound effects",k:"sfx"},
  {t:"ğŸ”Š Sound",ty:"range",l:"Volume",k:"volume",min:0,max:1,step:.05,fx:"vol"},
  {t:"ğŸ”Š Sound",ty:"select",l:"Music tune",k:"tune",o:["Soft Arpeggio","Dreamy Waltz","Starlight"],ovals:[0,1,2]},
  {t:"ğŸ”Š Sound",ty:"select",l:"Music source",k:"musicSource",o:["Synth tune","Custom gaana ğŸµ"],ovals:["synth","custom"]},
  {t:"ğŸ”Š Sound",ty:"text",l:"Custom audio URL (mp3 link)",k:"audioUrl",s:"Kahin host kiya hai thh direct link paste karo"},
  {t:"ğŸ”Š Sound",ty:"btn",l:"Apna gaana upload ğŸ§",act:"audioUp",s:"<1.5MB â†’ permanent save Â· badi file â†’ sirf is session"},
  {t:"ğŸ”Š Sound",ty:"btn",l:"Test gaana chalao â–¶",act:"audioTest"},
  {t:"ğŸ”Š Sound",ty:"btn",l:"Test sound effect ğŸµ",act:"testSfx"},
  {t:"ğŸ”Š Sound",ty:"btn",l:"Restart music",act:"testMusic"},
  /* ğŸ GIFTS â€” 8 */
  {t:"ğŸ Gifts",ty:"info",l:"Gifts collected",info:()=>`${Gifts.got.size} / ${Gifts.count()}`},
  {t:"ğŸ Gifts",ty:"toggle",l:"Show rarity labels",k:"showRarity",fx:"gifts"},
  {t:"ğŸ Gifts",ty:"text",l:"Custom legendary gift title",k:"customGiftTitle",s:"Legendary gift click karne pe ye dikhega"},
  {t:"ğŸ Gifts",ty:"textarea",l:"Custom legendary gift message",k:"customGiftMsg"},
  {t:"ğŸ Gifts",ty:"btn",l:"Unlock ALL gifts â¤ï¸",act:"unlockGifts"},
  {t:"ğŸ Gifts",ty:"btn",l:"Reset gift collection",act:"resetGifts"},
  {t:"ğŸ Gifts",ty:"btn",l:"Open Gift Vault",act:"openGifts"},
  /* ğŸ¥š EASTER â€” 8 */
  {t:"ğŸ¥š Easter",ty:"info",l:"Eggs found",info:()=>`${Eggs.got.size} / ${EGGS.length}`},
  {t:"ğŸ¥š Easter",ty:"toggle",l:"Show egg hints",k:"eggHints"},
  {t:"ğŸ¥š Easter",ty:"toggle",l:"Konami code enabled",k:"konamiOn"},
  {t:"ğŸ¥š Easter",ty:"text",l:"Egg reward extra message",k:"eggRewardMsg"},
  {t:"ğŸ¥š Easter",ty:"btn",l:"Unlock all eggs (debug)",act:"unlockEggs"},
  /* ğŸ“Š STATS â€” 8 */
  {t:"ğŸ“Š Stats",ty:"info",l:"ğŸ‘€ Page views",info:()=>S.views},
  {t:"ğŸ“Š Stats",ty:"info",l:"ğŸ® Games played",info:()=>S.games},
  {t:"ğŸ“Š Stats",ty:"info",l:"ğŸ’– YES clicks",info:()=>S.yes},
  {t:"ğŸ“Š Stats",ty:"info",l:"ğŸ˜ˆ No-button dodges",info:()=>S.noDodge},
  {t:"ğŸ“Š Stats",ty:"info",l:"ğŸ Gifts collected",info:()=>S.gifts},
  {t:"ğŸ“Š Stats",ty:"info",l:"ğŸ¥š Eggs found",info:()=>S.eggs},
  {t:"ğŸ“Š Stats",ty:"info",l:"ğŸ¨ Themes tried",info:()=>S.themes+" / 15"},
  {t:"ğŸ“Š Stats",ty:"btn",l:"Reset all stats",act:"resetStats"},
  /* ğŸ”— SHARE â€” 9 */
  {t:"ğŸ”— Share",ty:"html",html:'<div id="srvLinks" style="width:100%"><p class="muted">â³ server links...</p></div>'},
  {t:"ğŸ”— Share",ty:"info",l:"Server status",info:()=>SRV.mode==="server"?"ğŸŸ¢ Web app mode â€” tracking ON":"ğŸŸ¡ Portable mode â€” offline links only"},
  {t:"ğŸ”— Share",ty:"textarea",l:"Offline shareable link (backup, file-mode ke liye)",id:"shareOut",ro:true,info:()=>Share.last},
  {t:"ğŸ”— Share",ty:"toggle",l:"Include theme in link",id:"incTheme"},
  {t:"ğŸ”— Share",ty:"toggle",l:"ğŸ™ˆ Blind preview (WhatsApp pe naam na dikhe)",k:"ogBlind",s:"Link preview neutral rahega â€” surprise safe"},
  {t:"ğŸ”— Share",ty:"btn",l:"Generate + Copy link ğŸ“‹",act:"genLink"},
  {t:"ğŸ”— Share",ty:"btn",l:"Preview link (naye tab)",act:"prevLink"},
  {t:"ğŸ”— Share",ty:"btn",l:"WhatsApp pe bhejo ğŸ’¬",act:"waLink"},
  {t:"ğŸ”— Share",ty:"info",l:"Note",info:()=>"Link khud mein pura message leke jaata hai â€” uske phone pe bhi naam dikhega âœ¨"},
  /* ğŸ” SECURITY â€” 6 */
  {t:"ğŸ” Security",ty:"info",l:"Owner email",info:()=>ADMIN_EMAIL},
  {t:"ğŸ” Security",ty:"pw",l:"Purana password",id:"oldPwIn"},
  {t:"ğŸ” Security",ty:"pw",l:"Naya password",id:"newPwIn"},
  {t:"ğŸ” Security",ty:"btn",l:"Save password",act:"savePw"},
  {t:"ğŸ” Security",ty:"toggle",l:"Admin lock after demo",k:"lockAfterDemo"},
  {t:"ğŸ” Security",ty:"btn",l:"Logout",act:"logout"},
  {t:"ğŸ” Security",ty:"info",l:"Default password",info:()=>"iloveyou (isko badal lo!)"}
  ,
  {t:"ğŸ” Security",ty:"text",l:"Google Client ID (OAuth)",k:"gClientId",s:"Google Cloud se â€” niche guide hai ğŸ“–"},
  {t:"ğŸ” Security",ty:"btn",l:"Google setup guide ğŸ“–",act:"gSetup"},
  {t:"ğŸ” Security",ty:"info",l:"Google sign-in status",info:()=>CFG.gClientId?"âœ… Client ID set â€” Sign in with Google ACTIVE":"âš ï¸ Set nahi â€” abhi password login only"},
  /* âš™ï¸ SYSTEM â€” 10 */
  {t:"âš™ï¸ System",ty:"btn",l:"ğŸ’¾ FULL backup download (config+links)",act:"backupDl",s:"Regular le lo â€” hosting restart se bachne ke liye"},
  {t:"âš™ï¸ System",ty:"btn",l:"â™»ï¸ Full backup restore",act:"backupRestore"},
  {t:"âš™ï¸ System",ty:"btn",l:"Export config only (backup)",act:"exportCfg"},
  {t:"âš™ï¸ System",ty:"btn",l:"Import config",act:"importCfg"},
  {t:"âš™ï¸ System",ty:"range",l:"Demo speed",k:"demoSpeed",min:.5,max:3,step:.1},
  {t:"âš™ï¸ System",ty:"toggle",l:"Auto-play demo on open",k:"autoplayDemo"},
  {t:"âš™ï¸ System",ty:"btn",l:"Run self-test ğŸ§ª",act:"selfTest"},
  {t:"âš™ï¸ System",ty:"info",l:"Version",info:()=>"v"+CFG.version},
  {t:"âš™ï¸ System",ty:"info",l:"Storage used",info:()=>{let n=0;try{for(const k in localStorage)if(k.startsWith("ld_"))n+=(localStorage[k]||"").length}catch(e){}return(n/1024).toFixed(1)+" KB"}},
  {t:"âš™ï¸ System",ty:"btn",l:"âš ï¸ Factory reset (sab delete)",act:"factory"},
  /* ğŸ¬ VIDEOS â€” 5 */
  {t:"ğŸ¬ Videos",ty:"toggle",l:"YES ke baad cutu video auto-play",k:"videoAfterYes"},
  {t:"ğŸ¬ Videos",ty:"range",l:"Video speed",k:"animSpeed",min:.5,max:2,step:.1},
  {t:"ğŸ¬ Videos",ty:"select",l:"Favourite video",k:"favVideo",o:VIDS.map(v=>v.t),ovals:VIDS.map(v=>v.t)},
  {t:"ğŸ¬ Videos",ty:"btn",l:"Favourite video chalao â–¶",act:"playFav"},
  {t:"ğŸ¬ Videos",ty:"btn",l:"Video gallery kholo ğŸ¬",act:"openAnim"},
  /* ğŸ“Š PLATFORM â€” 6 (aggregates only â€” privacy) */
  {t:"ğŸ“Š Platform",ty:"info",l:"Total proposals baney",info:()=>ServerAPI.lastTotals?ServerAPI.lastTotals.proposals+" ğŸ’˜":"â³ Share tab kholo"},
  {t:"ğŸ“Š Platform",ty:"info",l:"Total YES ğŸ’–",info:()=>ServerAPI.lastTotals?ServerAPI.lastTotals.yes:"â€¦"},
  {t:"ğŸ“Š Platform",ty:"info",l:"Total link opens",info:()=>ServerAPI.lastTotals?ServerAPI.lastTotals.views:"â€¦"},
  {t:"ğŸ“Š Platform",ty:"info",l:"Replies aaye",info:()=>ServerAPI.lastTotals?ServerAPI.lastTotals.replies:"â€¦"},
  {t:"ğŸ“Š Platform",ty:"info",l:"ğŸ”’ Privacy promise",info:()=>"Users ke private replies sirf unke creator dekh sakte hain â€” admin ke paas sirf counts"},
  {t:"ğŸ“Š Platform",ty:"btn",l:"Landing page dekho ğŸ ",act:"goLanding"}
]};

const ACTIONS={
  bgUp(){const inp=document.createElement("input");inp.type="file";inp.accept="image/*";
    inp.onchange=()=>{const f=inp.files[0];if(!f)return;const rd=new FileReader();
      rd.onload=()=>{CFG.bgImage=rd.result;saveCfg();BG.build();Toast.show("ğŸ–¼ï¸ Background image set!")};rd.readAsDataURL(f)};
    inp.click();},
  bgClear(){CFG.bgImage="";saveCfg();BG.build();Toast.show("Background cleared")},
  testSfx(){AudioSys.sfx("tada")},
  testMusic(){CFG.music=true;AudioSys.stopMusic();AudioSys.startMusic();saveCfg()},
  unlockGifts(){Gifts.build();Gifts.all.forEach(g=>Gifts.got.add(g.n));Gifts.saveGot();Gifts.render(true);Toast.show("ğŸ Poora vault unlocked! "+Gifts.got.size+" gifts â¤ï¸")},
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
          cvgetContext("image/jpeg",.82);saveCfg();Intro.applyNames();
          Toast.show("ğŸ–¼ï¸ "+label+" set! (auto-compressed "+cv.width+"Ã—"+cv.height+")");Fx.confetti(20);
        };
        img.onerror=()=>Toast.show("âŒ Ye image load nahi hui");
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
          Toast.show("ğŸµ Gaana saved: <b>"+esc(f.name)+"</b> â€” ab ye loop chalega!")};
        rd.readAsDataURL(f);
    }else{
        CFG.audioUrl=URL.createObjectURL(f);CFG.musicSource="custom";saveCfg();
        AudioSys.stopMusic();if(CFG.music)AudioSys.startMusic();
        Toast.show("ğŸµGaana chal raha hai â€” <b>session-only</b> (file badi hai). Chhoti file (<1.5MB) save hoti hai.");
      }};
    inp.click();
  },
  audioTest(){CFG.music=true;AudioSys.stopMusic();AudioSys.startMusic();saveCfg();Toast.show("â–¶ Test chal raha hai â€” "+(CFG.musicSource==="custom"?"custom gaana":"synth tune"))},
  nameTest(){Fx.nameShow(CFG.herName||"JAAN");AudioSys.sfx("good")},
  voiceUp(){
    const inp=document.createElement("input");inp.type="file";inp.accept="audio/*";
    inp.onchange=()=>{const f=inp.files[0];if(!f)return;
      if(f.size<2000000){
        const rd=new FileReader();
        rd.onload=()=>{CFG.voiceData=rd.result;saveCfg();Intro.applyNames();Toast.show("ğŸ¤ Voice note saved! Intro pe play button aa gaya")};
        rd.readAsDataURL(f);
      }else{
        CFG.voiceUrl=URL.createObjectURL(f);saveCfg();Intro.applyNames();
        Toast.show("ğŸ¤ Voice chal raha â€” <b>session-only</b> (file badi). Chhoti file (<2MB) permanent save hoti hai");
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
      <div style="font-size:48px">ğŸ”</div><h3>Google Sign-In Setup (2 min)</h3>
      <div style="text-align:left;font-size:13.5px;line-height:1.9;color:#ffd9e2h¾
      1ï¸âƒ£ <b>console.cloud.google.com</b> kholo â†’ project banao</br>
      2ï¸âƒ£ <b>APIS &amp; Services â†’ Credentials â†’ Create Credentials â†’ OAuth client ID</b><br>
      3ï¸âƒ£ <b>Application type: <b>Web application</b><br>
      4ï¸âƒ£ <b>Authorized JavaScript origins</b> mein apni site ka URL daalo<br>
      &nbsp;&nbsp;&nbsp;(jaise <code>https://your-site.netlify.app</code>)<br>
      5ï¸âƒ£ Client ID copy karke niche paste karo âœ…</div>
      <p class="muted" style="margin-top:10px">âš ï¸ Jus link pe site live hogi, wahi origin add karna. Preview sandbox mein Google script bl[ØÚÈİHZH8 %\ŞYYÚ]HH\™™XİÚ[YØKˆÛY[QÙ]Û™HZÈ\ÜİÛÜ™ÙÚ[ˆšHØX[HØ\H˜ZYØKÜ‚ˆ[œ]Û\ÜÏHš[œˆYH™ØÚY[ˆˆXÙZÛ\H–˜\Ë™ÛÛÙÛ]\Ù\˜ÛÛ[˜ÛÛHˆİ[OHÚYŒL	NÛX\™Ú[‹]Üˆ˜[YOH‰Ù\ØÊÑ‘Ë™ĞÛY[Y
_H‚ˆ]ˆÛ\ÜÏH˜‹\›İÈ‚ˆ]ÛˆÛ\ÜÏH˜ˆˆÛ˜ÛXÚÏH‘ÔËœØ]™RY

H”Ø]™HÛY[Q8§!OØ]Û‚ˆ]ÛˆÛ\ÜÏH˜ˆÚÜİˆÛ˜ÛXÚÏH‘ÔËœÚ[][]J
H¼'éêˆ™]šY]È\İÙÚ[Ø]Û‚ˆÙ]˜ÂˆKˆ[›ØÚÑYÙÜÊ
^ÑQÑÔË™›Ü‘XXÚ
OO‘YÙÜË™Ûİ˜Y
KšY
JNÓËœÙ]
™YÙÜÈ‹Ë‹‹‘YÙÜË™ÛİJNÔË™YÙÜÏQYÙÜË™ÛİœÚ^™NÜØ]™Tİ]Ê
NÑYÙÜË\]P˜YÙJ
NĞYZ[‹œ™[™\Š
NÕØ\İœÚİÊ¼'éfˆØX\™HYÙÜÈ[›ØÚÙY8 %Xˆ\ÛHX^˜H[ÈÙHš[˜HX^YYØH<'æ!Š_Kˆ™\Ù]İ]Ê
^ÓØš™Xİ˜\ÜÚYÛŠËİšY]ÜÎŒØ[Y\ÎŒY\ÎŒ›ÑÙÙNŒÚYÎŒYÙÜÎŒÙXÜÎŒJNÜØ]™Tİ]Ê
NĞYZ[‹œ™[™\Š
NÕØ\İœÚİÊ¼'äâˆİ]È™\Ù]Š_KˆÙ[“[šÊ
^ÔÚ\™K™Ù[™\˜]JYJ_Kˆ™]“[šÊ
^ÔÚ\™K™Ù[™\˜]J˜[ÙJNİÚ[™İË›Ü[ŠÚ\™K›\İ—Ø›[šÈŠ_KˆØS[šÊ
^ÔÚ\™K™Ù[™\˜]J˜[ÙJNİÚ[™İË›Ü[ŠšÎ‹ËİØK›YKÏİ^HŠÙ[˜ÛÙUT’PÛÛ\Û™[
Ú\™K›\İ
ÊÑ‘ËœÚ\™S\ÙÏÈ——ˆŠĞÑ‘ËœÚ\™S\ÙÎˆˆŠJK—Ø›[šÈŠ_Kˆ\Ş[˜ÈØ]™TÊ
^ÂˆÛÛœİœJ	
ˆÛ™]ÔÒ[ˆŠOË˜[Y_ˆŠKš[J
KÜJ	
ˆÛÛÒ[ˆŠOË˜[Y_ˆŠKš[J
NÂˆYŠœ›[™İ
\™]\›ˆØ\İœÚİÊ“˜^XH\ÜİÛÜ™Ø[HÙHØ[HÚ\˜Xİ\œÈŠNÂˆYŠÔ•‹›[ÙOOOHœÙ\™\ˆ‰‰”Ô•‹ÚÙ[Š^Âˆ^ÂˆÛÛœİX]ØZ]™]Ú
˜\KØYZ[‹ÜÈ‹ÛY]Ùˆ”ÔÕ‹XY\œÎ”Ù\™\TKšŠ
K›ÙN’”ÓÓ‹œİš[™ÚYJÛÛ›Ü™XÎ›œJ_JNÂˆÛÛœİX]ØZ]‹šœÛÛŠ
NÂˆYŠ‹›ÚÊ^É
ˆÛÛÒ[ˆŠI‰Š	
ˆÛÛÒ[ˆŠK˜[YOHˆŠNÉ
ˆÛ™]ÔÒ[ˆŠI‰Š	
ˆÛ™]ÔÒ[ˆŠK˜[YOHˆŠNÕØ\İœÚİÊ¼'å$Ù\™\ˆ\ÜİÛÜ™Ú[™ÙYH˜^XH\ÜİÛÜ™XXY˜ZÚ˜HŠNÜ™]\›ŸBˆ™]\›ˆØ\İœÚİÊ¸§cŠÊ‹›\Ùß”\ÜİÛÜ™Ú[™ÙH˜Z[ŠJNÂˆXØ]Ú
J^ßBˆBˆÑ‘ËœÏ[œÜØ]™PÙ™Ê
NÕØ\İœÚİÊ¼'å$\ÜİÛÜ™Ø]™Y
ØØ[[ÙJHŠNÂˆKˆÙÛİ]

^ÓË™[
˜YZ[“ÚÈŠNÓË™[
™Õ\Ù\ˆŠNÑÔË\Ù\[[É
ˆØYZ[”[™[ŠKœİ[K™\Ü^OH››Û™HÉ
ˆØYZ[“ÙÚ[ˆŠKœİ[K™\Ü^OH˜›ØÚÈÑÔË›[İ[

NÕØ\İœÚİÊYHYZ[ˆ<'äbÈŠ_Kˆ^ÜÙ™Ê
^ØÛÛœİ]OR”ÓÓ‹œİš[™ÚYJÑ‘Ë[ŠNØÛÛœİOYØİ[Y[˜Ü™X]Q[[Y[
˜HŠNÂˆKš™YUT“˜Ü™X]SØš™XİT“
™]È›ØŠÙ]WKİ\Nˆ˜\XØ][Û‹ÚœÛÛˆŸJJNØK™İÛ›ØYH›İ™KXÛÛ™šYËšœÛÛˆØK˜ÛXÚÊ
NÕØ\İœÚİÊ¼'ä¯ˆÛÛ™šYÈ^ÜYŠ_Kˆ[\ÜÙ™Ê
^ØÛÛœİ[œYØİ[Y[˜Ü™X]Q[[Y[
š[œ]ŠNÚ[œ\OH™š[HÚ[œ˜XØÙ\H˜\XØ][Û‹ÚœÛÛˆÂˆ[œ›Û˜Ú[™ÙOJ
OOØÛÛœİZ[œ™š[\ÖÌNÚYŠYŠ\™]\›ØÛÛœİ™[™]Èš[T™XY\Š
NÂˆ™›Û›ØYJ
OOİ^ØÛÛœİR”ÓÓ‹œ\œÙJ™œ™\İ[
NĞÑ‘ÏSØš™Xİ˜\ÜÚYÛŠÑ‘ËŠNÙ[]HÑ‘ËœÎÜØ]™PÙ™Ê
NÛØØ][Û‹œ™[ØY

_XØ]Ú
J^ÕØ\İœÚİÊ¸§c[˜[Yš[HŠ__NÜ™œ™XY\Õ^
Š_NÂˆ[œ˜ÛXÚÊ
NßKˆÙ[•\İ

^ÂˆÛÛœİ™\ÏV×NÂˆ™\Ëœ\Ú
ÈØ[˜\È‹HP‘Ë˜İ	‰ˆHQ˜İJNÂˆ™\Ëœ\Ú
È]Y[ÈTH‹HJÚ[™İË]Y[ĞÛÛ^Ú[™İËÙXšÚ]]Y[ĞÛÛ^
WJNÂˆ]ÚÓÏY˜[ÙNİ^ÛØØ[İÜ˜YÙKœÙ]][J›İ‹ŒHŠNÛØØ[İÜ˜YÙKœ™[[İ™R][J›İŠNÛÚÓÏ]Y_XØ]Ú
J^ßBˆ™\Ëœ\Ú
È“ØØ[İÜ˜YÙH‹ÚÓ×JNÂˆ™\Ëœ\Ú
È‘ÚYÈŒ
È
ŠÑÚYË˜Ûİ[

JÈŠH‹ÚYË˜Ûİ[

OLŒJNÂˆ™\Ëœ\Ú
È’YX\ÈL
È
ŠÒYX\Ë˜Ûİ[

JÈŠH‹YX\Ë˜Ûİ[

OMLJNÂˆ™\Ëœ\Ú
È‘™X]\™\ÈL
È
ŠÑ™X]Ë˜Ûİ[

JÈŠH‹™X]Ë˜Ûİ[

OLLJNÂˆ™\Ëœ\Ú
È•[Y\ÈL
ŠÕSQTË›[™İ
ÈŠH‹SQTË›[™İOOMLJNÂˆ™\Ëœ\Ú
ÈYZ[ˆÛÛ›ÛÈL
È
ŠĞYZ[‹˜Ûİ[

JÈŠH‹YZ[‹˜Ûİ[

OLLJNÂˆ™\Ëœ\Ú
È‘X\İ\ˆYÙÜÈ
ŠÑQÑÔË›[™İ
ÈŠH‹QÑÔË›[™İLL—JNÂˆ™\Ëœ\Ú
Èİ]HšY[ÜÈÌ
È
ŠÕ’QË›[™İ
ÈŠH‹’QË›[™İLÌJNÂˆÛÛœİ\ÜÏ\™\Ë™]™\JOœ–ÌWJNÂˆ[Ù[›Ü[Š™Ù[“[Ù[ŠNÂˆ	
ˆÙÙ[“[Ù[›ÙHŠKš[›™\’SX]ˆİ[OH™›Û\Ú^™NLœ‰Ü\ÜÏÈ¸§!Hˆ¸¦¨;î#ÈŸOÙ]Ï”Ù[ˆ\İÚÏ‚ˆ]ˆİ[OH^X[YÛ›YÙ›Û\Ú^™NŒMÛ[™KZZYÚŒˆ‰Ü™\Ë›X\
O˜	Ü–ÌWOÈ¸§!Hˆ¸§cŸH	Ü–Ì_X
Kš›Ú[ŠœˆŠ_OÙ]‚ˆ]ˆÛ\ÜÏH˜‹\›İÈ]ÛˆÛ\ÜÏH˜ˆˆÛ˜ÛXÚÏH“[Ù[˜ÛÜÙJ	ÙÙ[“[Ù[	ÊH”\™™Xİ<'äcØ]ÛÙ]˜Âˆ]Y[ÔŞ\ËœÙ
\ÜÏÈ™ÛÛÙˆ››ÜHŠNÂˆKˆ˜XİÜJ
^ÚYŠÛÛ™š\›J”ĞPÒQRSÈØXˆ]H[]HÈ˜^YYØH
ÛÛ™šYËİ]ËYÙÜËÚYÊK‹‹ˆ<'æ*ŠJ^İ^ÓØš™XİšÙ^\ÊØØ[İÜ˜YÙJK™š[\ŠÏOšËœİ\ÕÚ]
›ÈŠJK™›Ü‘XXÚ
ÏO›ØØ[İÜ˜YÙKœ™[[İ™R][JÊJ_XØ]Ú
J^ß[ØØ][Û‹œ™[ØY

__BŸNÂ‚˜ÛÛœİÚ\™O^Âˆ\İˆˆ‹ˆÙ[™\˜]JÛÜJ^ÂˆÛÛœİ˜\ÙO[ØØ][Û‹š™Y‹œÜ]
ˆÈŠVÌNÂˆ]^[ØYÂˆYŠÑ‘ËœÚ\™TØÛÜOOOH™[Š^ØÛÛœİÜË‹‹œ™\İOPÑ‘ÎÜ^[ØYSØš™Xİ˜\ÜÚYÛŠßK™\İ××ÜØÛÜNˆ™[ŸJ_Bˆ[Ù^Ü^[ØY^××ÜØÛÜNˆ›Z[šH‹\“˜[YNÑ‘Ëš\“˜[YK\Ó˜[YNÑ‘Ëš\Ó˜[YK[›Õ]NÑ‘Ëš[›Õ]K[›ÔİXÑ‘Ëš[›ÔİX‹š[˜[NÑ‘Ë™š[˜[K]\Ñ‘Ë›]\‹Y\–Y\Ó\ÙÎÑ‘Ë˜Y\–Y\Ó\ÙË[YN‰
ˆÚ[˜Õ[YHŠOË˜ÚXÚÙYOOY˜[ÙOĞÑ‘Ë[YN[™Yš[™Y\ÙÎÑ‘ËœÚ\™S\Ùß[™Yš[™Y_Bˆ\Ë›\İX˜\ÙJÈˆØÏHŠÙ[˜ÛÙUT’PÛÛ\Û™[
ØJ[™\ØØ\J[˜ÛÙUT’PÛÛ\Û™[
”ÓÓ‹œİš[™ÚYJ^[ØY
JJJJNÂˆÛÛœİOI
ˆÜÚ\™Sİ]ŠNÚYŠJ^İK˜[YO]\Ë›\İBˆYŠÛÜJ^ÂˆÛÛœİÛ™OJ
OO•Ø\İœÚİÊ¼'äâÈ[šÈÛÜHÈØ^XHHXˆ\ÚÛÈšZˆÈ8 %ÛÈÚÛHH˜X[HØX[[™H<'ä£ŠNÂˆYŠ˜]šYØ]Ü‹˜Û\›Ø\™	‰›˜]šYØ]Ü‹˜Û\›Ø\™Üš]U^
[˜]šYØ]Ü‹˜Û\›Ø\™Üš]U^
\Ë›\İ
K[ŠÛ™JK˜Ø]Ú


OO\Ë™˜[˜XÚĞÛÜJÛ™JJNÂˆ[ÙH\Ë™˜[˜XÚĞÛÜJÛ™JNÂˆBˆKˆ˜[˜XÚĞÛÜJÛ™J^ØÛÛœİOI
ˆÜÚ\™Sİ]ŠNÚYŠJ^İKœ™[[İ™P]šX]Jœ™XYÛ›HŠNİKœÙ[Xİ

Nİ^ÙØİ[Y[™^XĞÛÛ[X[™
˜ÛÜHŠNÙÛ™J
_XØ]Ú
J^ÕØ\İœÚİÊ“[šÈÙ[XİÈØ^XH8 %X[X[HÛÜHØ\ˆÈ<'æcÈŠ_]KœÙ]]šX]Jœ™XYÛ›H‹ˆŠ__BŸNÂ‚˜ÛÛœİYZ[^ÂˆÛİ[

^Ü™]\›ˆ‹œ›İÜË›[™İKˆÜ[Š
^Âˆ˜]‹™ÛÊœËXYZ[ˆŠNÂˆYŠË™Ù]
˜YZ[“ÚÈ‹˜[ÙJI‰”Ë˜YZ[“ÚÓÛ˜ÙJ]\Ëœ™[™\Š
NÙ[Ù^É
ˆØYZ[“ÙÚ[ˆŠKœİ[K™\Ü^OH˜›ØÚÈÉ
ˆØYZ[”[™[ŠKœİ[K™\Ü^OH››Û™HŸB‚ˆKˆÙÜ˜[
\ÙÊ^ÂˆËœÙ]
˜YZ[“ÚÈ‹YJNÔË˜YZ[“ÚÓÛ˜ÙO]YNÜØ]™Tİ]Ê
NÂˆ	
ˆØYZ[‘\œˆŠK^ÛÛ[HˆÉ
ˆØYZ[“ÙÚ[ˆŠKœİ[K™\Ü^OH››Û™HÂˆ\Ëœ™[™\Š
NĞ]Y[ÔŞ\ËœÙ
™ÛÛÙŠNÑ˜ÛÛ™™]JL
NÂˆØ\İœÚİÊ\ÙÊNÂˆKˆ\Ş[˜ÈÙÚ[Š
^ÂˆÛÛœİ[OI
ˆØYZ[‘[XZ[ŠK˜[YKš[J
KÓİÙ\Ø\ÙJ
KÏI
ˆØYZ[”\ÜÈŠK˜[YNÂˆYŠ[HOOPQRS—ÑSPRS
^É
ˆØYZ[‘\œˆŠK^ÛÛ[H¸§cØ[][XZ[8 %Ú\™ˆİÛ™\ˆ[İÙYZHĞ]Y[ÔŞ\ËœÙ
››ÜHŠNÜ™]\›ŸBˆËÈÑPˆTSÑNˆÙ\™\‹\ÚYH]]
\ÚYÈ
ÈÙ\ÜÚ[ÛˆÚÙ[ŠBˆYŠÔ•‹›[ÙOOOHœÙ\™\ˆŠ^Âˆ^ÂˆÛÛœİX]ØZ]Ù\™\TK›ÙÚ[ŠË[JNÂˆYŠ‹›ÚÊ^ÂˆÔ•‹ÚÙ[Z‹ÚÙ[ÓËœÙ]
˜YZ[•ÚÙ[ˆ‹‹ÚÙ[ŠNÂˆYŠ‹\Ù\Š^ÑÔË\Ù\Z‹\Ù\ÓËœÙ]
™Õ\Ù\ˆ‹‹\Ù\Š_Bˆ\Ë—ÙÜ˜[
¼'ädHÙ[ÛÛYH˜XÚËYZ[ˆHÛÜ˜HÛÛ›Û[Z\™HX]YZ[ˆŠÊ‹\Ù\Èˆ
ÛÛÙÛH™\šYšYY8§!JHˆˆŠJNÂˆYŠSË™Ù]
Ú^˜\™Û™H‹˜[ÙJJ\Ù][Y[İ]


OO•Ú^˜\™œİ\

KL
NÂˆ™]\›ÂˆBˆ	
ˆØYZ[‘\œˆŠK^ÛÛ[H¸§cŠÊ‹›\Ùß“ÙÚ[ˆ˜Z[ŠNĞ]Y[ÔŞ\ËœÙ
››ÜHŠNÜ™]\›ÂˆXØ]Ú
J^ÕØ\İœÚİÊ¸¦¨;î#ÈÙ\™\ˆZÈ˜ZHZ[˜ÚH8 %ØØ[ÚXÚÈÚ[H˜ZHÛÛˆŠ_BˆBˆËÈ˜[˜XÚÎˆØØ[
ÜX›Hš[H[ÙJBˆÛÛœİSË™Ù]
œÈ‹š[İ™^[İHŠNÂˆYŠÏOO\
]\Ë—ÙÜ˜[
¼'ädHÙ[ÛÛYH˜XÚËYZ[ˆH
ØØ[[ÙJHŠNÂˆ[Ù^É
ˆØYZ[‘\œˆŠK^ÛÛ[H¸§cØ[]\ÜİÛÜ™<'æ!HĞ]Y[ÔŞ\ËœÙ
››ÜHŠ_BˆKˆÚYQ
Ê^ÂˆYŠÏOOH[YHŸÏOOH™[œÚ]HŸÏOOHœÜYYŠ^ÚYŠÏOOH[YHŠP‘Ë˜\JÑ‘Ë[YK˜[ÙJNÙ[ÙH‘Ë˜Z[

_BˆYŠÏOOH˜XØÙ[ŠYØİ[Y[™Øİ[Y[[[Y[œİ[KœÙ]›Ü\J‹KXXØÙ[‹Ñ‘Ë˜XØÙ[
NÂˆYŠÏOOHœ˜Y]\ÈŠYØİ[Y[™Øİ[Y[[[Y[œİ[KœÙ]›Ü\J‹K\˜Y]\È‹Ñ‘Ëœ˜Y]\ÊÈœŠNÂˆYŠÏOOH˜›\ˆŠYØİ[Y[™Øİ[Y[[[Y[œİ[KœÙ]›Ü\J‹KX›\ˆ‹Ñ‘Ë˜›\ŠÈœŠNÂˆYŠÏOOH™›ÛŠ^ØÛÛœİ^ÜÙYÎˆ‰ÔÙYÛÙHRIËŞ\İ[K]ZKØ[œË\Ù\šYˆ‹Ù[Ü™ÚXNˆ‘Ù[Ü™ÚXK	Õ[Y\È™]È›ÛX[‰ËÙ\šYˆ‹[š]Îˆ‰Õ™XXÚ]TÉË™\™[˜KØ[œË\Ù\šYˆ‹[Û›Îˆ‰ĞÛİ\šY\ˆ™]ÉË[Û›ÜÜXÙHŸNÙØİ[Y[˜›ÙKœİ[K™›Û˜[Z[OQ–ĞÑ‘Ë™›Û_‹œÙYßBˆYŠÏOOH™ÛİÈŠYØİ[Y[˜›ÙK˜Û\ÜÓ\İÙÙÛJ››ÙÛİÈ‹PÑ”‹™ÛİÊNÂˆYŠÏOOH›ÛŠP]Y[ÔŞ\ËœÙ]›Û

NÂˆYŠÏOOHš[›Õ]HŠ^É
ˆİ\YŠK^ÛÛ[PÑ‘Ëš[›Õ]_BˆYŠÏOOHš[›ÔİXˆŠI
ˆÚ[›ÔİXˆŠK^ÛÛ[PÑ‘Ëš[›ÔİXÂˆYŠÏOOHš\“˜[YHŠ^É
ˆİ’\ˆŠK^ÛÛ[PÑ‘Ëš\“˜[YOOOH“Y\šH˜X[ˆÈ–[İHÑ‘Ëš\“˜[Y_BˆYŠÏOOH›]\ÚXÈŠ^ĞÑ‘Ë›]\ÚXÏĞ]Y[ÔŞ\Ëœİ\]\ÚXÊ
N]Y[ÔŞ\ËœİÜ]\ÚXÊ
_BˆYŠÏOOH›]\ÚXÔÛİ\˜ÙHŠ^Ğ]Y[ÔŞ\ËœİÜ]\ÚXÊ
NÚYŠÑ‘Ë›]\ÚXÊP]Y[ÔŞ\Ëœİ\]\ÚXÊ
_BˆYŠÏOOH™È‰‰ˆPÑ‘Ë™Ê^É	
‹[ÙŠK™›Ü‘XXÚ
[OÙ[œİ[KœÙ]›Ü\J‹K\‹ŒYÈŠNÙ[œİ[KœÙ]›Ü\J‹K\H‹ŒYÈŠ_JNØÛÛœİOI
ˆØ\ŠNÚYŠJXKœİ[K˜[œÙ›Ü›OHˆŸBˆYŠÏOOH™ÈŸÏOOH˜™ÌÙŠ^İ^ÚYŠ\[Ùˆ‘ÌÑOOH[™Yš[™YŠ^ÚYŠ‘ÌÑ™[˜X›Y

I‰Ñ‘Ë™Ê^Ğ‘ÌÑœ™\İ[YJ
NÚYŠ‘Ë[YJP‘ÌÑœŞ[˜Ê‘Ë[YJ_Y[ÙH‘ÌÑš[

__XØ]Ú
J^ß_BˆYŠÏOOHœÚİÑYÙĞÛİ[\ˆŠ^É
ˆÚÛÛ˜[ZR[ŠKœİ[K™\Ü^OPÑ‘ËœÚİÑYÙĞÛİ[\È˜›ØÚÈˆ››Û™HŸBˆYŠÉ‰šËœİ\ÕÚ]
œ]Z^ˆŠJ]\Ëœ\œÙT]Z^Š
NÂˆYÙÜË\]P˜YÙJ
NÂˆKˆ\œÙT]Z^Š
^Âˆ›ÜŠ]OLNÚOMNÚJÊÊ^ÂˆÛÛœİ˜]ÏJÑ‘ÖÈœ]Z^ˆŠÚW_ˆŠKš[J
NÂˆYŠ\˜]ÊXÛÛ[YNÂˆÛÛœİ\Ï\˜]ËœÜ]
ŸŠK›X\
Oš[J
JK™š[\Š›ÛÛX[ŠNÂˆYŠ\Ë›[™İLŠ^ÂˆÑ‘Ëœ]Z^–ÚKLWO^ÜNœ\ÖÌKÎœ\ËœÛXÙJK
KÑ‘Ëœ]Z^–ÚKLWI‰Ñ‘Ëœ]Z^–ÚKLWKœ‰‰Ñ‘Ëœ]Z^–ÚKLWKœ‹›[™İOOLÏĞÑ‘Ëœ]Z^–ÚKLWKœ–È]İÈ<'ä¥H‹’ZH<'æ ˆ‹”ØZHZH<'æ#—_NÂˆBˆBˆKˆ™[™\Š
^Âˆ	
ˆØYZ[”[™[ŠKœİ[K™\Ü^OH˜›ØÚÈÂˆ	
ˆØYZ[’HŠK^ÛÛ[X	ĞQRS—ÑSPRSH8 %	ĞÑ‘Ëš\“˜[Y_HÙH^YHØXˆİXÚİ\İÛZ^™HØ\›È<'ä¥XÂˆÛÛœİİOQÔË\Ù\Âˆ	
ˆØYZ[•\Ù\Ú\ŠKš[›™\’SYİBˆØÜ[ˆÛ\ÜÏH˜K]\Ù\ˆ‰ÙİKœXİ\™OØ[YÈÜ˜ÏH‰Ù\ØÊİKœXİ\™J_Hˆ[Hˆ˜ˆ¸§!HŸHÚYÛ™Y[ˆ\È‰›˜œÜÉÙ\ØÊİK›˜[Y_İK™[XZ[
_OØ‰›˜œÜğ­È	Ù\ØÊİK™[XZ[
_IÙİKœÚ[OÈˆ0­È<'éêˆ\İˆˆŸOÜÜ[˜ˆ˜Ü[ˆÛ\ÜÏH˜K]\Ù\ˆ¼'å$H\ÜİÛÜ™ÙÚ[ˆ0­È	Ù\ØÊQRS—ÑSPRS
_OÜÜ[˜ÂˆÛÛœİXœÏVË‹‹›™]ÈÙ]
‹œ›İÜË›X\
Oœ‹
JWNÂˆ	
ˆØYZ[•XœÈŠKš[›™\’S]XœË›X\

JOO˜]ÛˆÛ\ÜÏH˜K]Xˆ	ÚOOOT‹XÈ›ÛˆˆˆŸHˆ]KZOH‰Ú_H‰İOØ]Û˜
Kš›Ú[ŠˆŠNÂˆ		
ˆØYZ[•XœÈ˜K]XˆŠK™›Ü‘XXÚ
O˜‹›Û˜ÛXÚÏJ
OOÔ‹XJØ‹™]\Ù]šNİ\Ëœ™[™\Š
_JNÂˆ	
ˆØİ›Ûİ[ŠK^ÛÛ[]\Ë˜Ûİ[

NÂˆÛÛœİ›ÙOI
ˆØYZ[›ÙHŠNØ›ÙKš[›™\’SHˆÂˆ‹œ›İÜË™š[\ŠOœ‹OO]XœÖÔ‹X—JK™›Ü‘XXÚ
OÂˆÛÛœİ›İÏYØİ[Y[˜Ü™X]Q[[Y[
™]ˆŠNÜ›İË˜Û\ÜÓ˜[YOH˜K\›İÈÂˆ]İHˆÂˆYŠ‹OOOH^Ÿ‹OOOH™]HŸ‹OOOHœÈŠXİX[œ]Û\ÜÏHš[œˆ\OH‰Ü‹OOOH™]HÈ™]Hœ‹OOOHœÈÈœ\ÜİÛÜ™ˆ^ŸHˆ˜[YOH‰Ù\ØÊ‹šÏÔİš[™ÊÑ‘ÖÜ‹š×OÏÈˆŠNˆˆŠ_Hˆ]KZÏH‰Ü‹šßˆŸHˆ]KZYH‰Ü‹šYˆŸH˜Âˆ[ÙHYŠ‹OOOH^\™XHŠXİX^\™XHÛ\ÜÏHš[œˆ]KZÏH‰Ü‹šßˆŸH‰Ù\ØÊ‹šÏÔİš[™ÊÑ‘ÖÜ‹š×OÏÈˆŠNˆˆŠ_Oİ^\™XO˜Âˆ[ÙHYŠ‹OOOH›[HŠXİX[œ]Û\ÜÏHš[œˆ\OH›[X™\ˆˆİ[OH›X^]ÚYŒLLˆ˜[YOH‰ĞÑ‘ÖÜ‹š×_HˆZ[H‰Ü‹›Z[ŸHˆX^H‰Ü‹›X^Hˆ]KZÏH‰Ü‹šßH˜Âˆ[ÙHYŠ‹OOOHœ˜[™ÙHŠXİX[œ]\OHœ˜[™ÙHˆZ[H‰Ü‹›Z[ŸHˆX^H‰Ü‹›X^Hˆİ\H‰Ü‹œİ\Hˆ˜[YOH‰ĞÑ‘ÖÜ‹š×_Hˆ]KZÏH‰Ü‹šßHÜ[ˆÛ\ÜÏH›]]Yˆİ[OH›Z[‹]ÚY‰ĞÑ‘ÖÜ‹š×_OÜÜ[˜Âˆ[ÙHYŠ‹OOOH˜ÛÛÜˆŠXİX[œ]\OH˜ÛÛÜˆˆ˜[YOH‰ĞÑ‘ÖÜ‹š×_Hˆ]KZÏH‰Ü‹šßH˜Âˆ[ÙHYŠ‹OOOHœÙ[XİŠ^ØÛÛœİ˜[Ï\‹›İ˜[ß‹›ÎØÛÛœİİ\\‹šÏOOH[™HÔİš[™ÊÑ‘ÖÜ‹š×JNÑ‘ÖÜ‹š×NÂˆİXÙ[XİÛ\ÜÏHš[œˆ]KZÏH‰Ü‹šßH‰Ü‹›Ë›X\

ËJOO˜Ü[Ûˆ˜[YOH‰Ù\ØÊİš[™Ê˜[ÖÚWJJ_Hˆ	Ôİš[™Êİ\ŠOOOTİš[™Ê˜[ÖÚWJOÈœÙ[XİYˆˆŸO‰Ù\ØÊÊ_OÛÜ[Û˜
Kš›Ú[ŠˆŠ_OÜÙ[Xİ˜ßBˆ[ÙHYŠ‹OOOHÙÙÛHŠXİXX™[Û\ÜÏHœİÚ]Ú[œ]\OH˜ÚXÚØ›Şˆ	ĞÑ‘ÖÜ‹š×OÈ˜ÚXÚÙYˆˆŸH]KZÏH‰Ü‹šßHÜ[ˆÛ\ÜÏHœÛÜÜ[ÛX™[˜Âˆ[ÙHYŠ‹OOOH˜ˆŠXİX]ÛˆÛ\ÜÏH˜ˆÛHˆ]KXXİH‰Ü‹˜XİH‰Ù\ØÊ‹›œÜ]
ˆŠKœÛXÙJLJJ_H8¥­Ø]Û˜Âˆ[ÙHYŠ‹OOOHš[ŠXİ\‹š[Âˆ[ÙHYŠ‹OOOHš[™›ÈŠXİXˆİ[OH˜ÛÛÜ˜\ŠKXXØÙ[ŠNÙ›Û\Ú^™NŒLË\ÛX^]ÚYŒÍİ^X[YÛœšYÚ‰Ù\ØÊİš[™Ê‹š[™›Ê
JJ_OØ˜Âˆ›İËš[›™\’SXX™[‰Ù\ØÊ‹›
_IÜ‹œÏØÛX[‰Ù\ØÊ‹œÊ_OÜÛX[˜ˆˆŸOÛX™[‰ØİXÂˆ›ÙK˜\[™Ú[
›İÊNÂˆJNÂˆËÈš[™[™ÜÂˆ		
ˆØYZ[›ÙHÙ]KZ×HŠK™›Ü‘XXÚ
[OÂˆÛÛœİÏY[™]\Ù]šÎÚYŠZÊ\™]\›ÂˆÛÛœİ]Y[\OOOHœ˜[™ÙHŸ[\OOOH˜ÛÛÜˆŸ[YÓ˜[YOOOH”ÑSPÕÈš[œ]Š[\OOOH˜ÚXÚØ›ŞÈ˜Ú[™ÙHˆ˜Ú[™ÙHŠNÂˆ[˜Y]™[\İ[™\Š]‹

OOÂˆ]ÂˆYŠ[\OOOH˜ÚXÚØ›ŞŠ]Y[˜ÚXÚÙYÂˆ[ÙHYŠ[\OOOHœ˜[™ÙHŠ^İ\\œÙQ›Ø]
[˜[YJNØÛÛœİÜY[›™^[[Y[ÚX›[™ÎÚYŠÜ	‰œÜ˜Û\ÜÓ\İ˜ÛÛZ[œÊ›]]YŠJ\Ü^ÛÛ[]ŸBˆ[ÙHYŠ[\OOOH›[X™\ˆŠ]XÛ[\
\œÙQ›Ø]
[˜[YJ_\œÙQ›Ø]
[›Z[Š_\œÙQ›Ø]
[›X^
_NNNJNÂˆ[ÙHYŠÏOOH[™HŠ]\\œÙR[
[˜[YJNÂˆ[ÙHY[˜[YNÂˆÑ‘ÖÚ×O]ÜØ]™PÙ™Ê
Nİ\ËœÚYQ
ÊNÂˆJNÂˆYŠ[\OOOHœ˜[™ÙHŠY[˜Y]™[\İ[™\Š˜Ú[™ÙH‹

OOÚYŠÏOOH™[œÚ]HŸÏOOHœÜYYŠP‘Ë˜Z[

_JNÂˆJNÂˆ		
ˆØYZ[›ÙHÙ]KXXİHŠK™›Ü‘XXÚ
O˜‹›Û˜ÛXÚÏJ
OOĞPÕSÓ”ÖØ‹™]\Ù]˜XİI‰PÕSÓ”ÖØ‹™]\Ù]˜XİJ
_JNÂˆ	
ˆÚ[˜Õ[YHŠI‰Š	
ˆÚ[˜Õ[YHŠK˜ÚXÚÙY]YJNÂˆÛÛœİÛÏI
ˆÜÚ\™Sİ]ŠNÚYŠÛÊ^ÜÛË˜[YOTÚ\™K›\İ‘Ù[™\˜]H
ÈÛÜHX˜[È8 %[šÈXZ[ˆX^YYØH<'ä£ÜÛËœÙ]]šX]Jœ™XYÛ›H‹ˆŠ_BˆYŠXœÖÔ‹X—OOOH¼'å%ÈÚ\™HŠTÙ\™\TKœ™[™\“[šÜÊ
NÂˆYÙÜË\]P˜YÙJ
NÂˆBŸNÂ‚‹ÊˆOOOOOOOOOOOOOOOOHÓÓÑÓHÒQÓ‹RSˆOOOOOOOOOOOOOOOOH
‹Â˜ÛÛœİÔÏ^Âˆ\Ù\›[ÛØY[™Î™˜[ÙKˆ[İ[

^ÂˆÛÛœİÜ˜\I
ˆÙØ•Ü˜\ŠNÚYŠ]Ü˜\
\™]\›ÂˆYŠ\Ë\Ù\Š^İÜ˜\š[›™\’SXÜ[ˆÛ\ÜÏH˜K]\Ù\ˆ¸§!H	Ù\ØÊ\Ë\Ù\‹›˜[Y_\Ë\Ù\‹™[XZ[
_H
ÛÛÙÛJOÜÜ[˜Ü™]\›ŸBˆYŠPÑ‘Ë™ĞÛY[Y
^ÂˆÜ˜\š[›™\’SXÛ\ÜÏH›]]Yˆİ[OH™›Û\Ú^™NŒL‹\ÛX^]ÚYŒÌ¼'å$HÛÛÙÛHÛY[QÙ]˜ZHZH8 %Ü[ˆÛ\ÜÏH›[šÚ\ÚˆÛ˜ÛXÚÏHPÕSÓ”Ë™ÔÙ]\

HœÙ]\İZYHÚÛÈ
ˆZ[ŠOÜÜ[ˆXH\ÜİÛÜ™ÙHÙÚ[ˆØ\›ÏÜ˜Âˆ™]\›ÂˆBˆYŠÚ[™İË™ÛÛÙÛI‰Ú[™İË™ÛÛÙÛK˜XØÛİ[É‰Ú[™İË™ÛÛÙÛK˜XØÛİ[ËšY
^İ\Ëœ™[™\Š
NÜ™]\›ŸBˆÜ˜\š[›™\’SXÛ\ÜÏH›]]Yˆİ[OH™›Û\Ú^™NŒL‹\¸£ìÈÛÛÙÛHØYÈ˜ZK‹‹Ü˜ÂˆYŠ\Ë—ÛØY[™Ê\™]\›İ\Ë—ÛØY[™Ï]YNÂˆÛÛœİÏYØİ[Y[˜Ü™X]Q[[Y[
œØÜš\ŠNÂˆËœÜ˜ÏHšÎ‹ËØXØÛİ[Ë™ÛÛÙÛK˜ÛÛKÙÜÚKØÛY[ÜË˜\Ş[˜Ï]YNÜË™Y™\]YNÂˆË›Û›ØYJ
OOİ\Ë—ÛØY[™ÏY˜[ÙNİ\Ëœ™[™\Š
_NÂˆË›Û™\œ›ÜJ
OOİ\Ë—ÛØY[™ÏY˜[ÙNÂˆÜ˜\š[›™\’SXÛ\ÜÏH›]]Yˆİ[OH™›Û\Ú^™NŒL‹\ÛX^]ÚYŒÌŒ¸¦¨;î#ÈÛÛÙÛHØÜš\XZ[ˆØY˜ZHXH
™]šY]ÈØ[™›ŞÛÙ™›[™JKˆ‘\ŞYY[šÈHYH]Ûˆ\˜[ØX[HØ\™YØKØˆš[[\ÜİÛÜ™XH\İÙÚ[ˆ\ÙHØ\›ËÜÜ[ˆÛ\ÜÏH›[šÚ\ÚˆÛ˜ÛXÚÏH‘ÔËœÚ[][]J
H¼'éêˆ™]šY]È\İÙÚ[ÜÜ[˜ÂˆNÂˆØİ[Y[šXY˜\[™Ú[
ÊNÂˆKˆ™[™\Š
^ÂˆÛÛœİÜ˜\I
ˆÙØ•Ü˜\ŠNÚYŠ]Ü˜\]Ú[™İË™ÛÛÙÛ_]Ú[™İË™ÛÛÙÛK˜XØÛİ[Ê\™]\›Âˆ^ÂˆÛÛÙÛK˜XØÛİ[ËšYš[š]X[^™JØÛY[ÚYÑ‘Ë™ĞÛY[YØ[˜XÚÎœO‘ÔË›ÛÜ™Y
Š_JNÂˆÜ˜\š[›™\’SHˆÂˆÛÛÙÛK˜XØÛİ[ËšYœ™[™\]ÛŠÜ˜\İ[YNˆ™š[YØ›XÚÈ‹Ú^™Nˆ›\™ÙH‹Ú\Nˆœ[‹^ˆ˜ÛÛ[YWİÚ]‹ØØ[Nˆ™[ˆ‹ÚYŒJNÂˆXØ]Ú
J^İÜ˜\š[›™\’SIÏÛ\ÜÏH›]]Yˆİ[OH™›Û\Ú^™NŒL‹\¸¦¨;î#ÈÛÛÙÛH]Ûˆ\œ›Üˆ	ÊÙ\ØÊK›Y\ÜØYÙJJÉÏÜ‰ßBˆKˆØ]™RY

^ÂˆÛÛœİJ	
ˆÙØÚY[ˆŠOË˜[Y_ˆŠKš[J
NÂˆYŠ]Š^ÕØ\İœÚİÊ¸§cÛY[QÚX[HZHŠNÜ™]\›ŸBˆÑ‘Ë™ĞÛY[Y]ÜØ]™PÙ™Ê
NÓ[Ù[˜ÛÜÙJ™Ù[“[Ù[ŠNÂˆØ\İœÚİÊ¸§!HÛÛÙÛHÛY[QØ]™YHXˆ”ÚYÛˆ[ˆÚ]ÛÛÙÛOØˆ]ÛˆXİ]™HZHŠNÂˆ\Ë—ÛØY[™ÏY˜[ÙNİ\Ë›[İ[

NÂˆKˆÚ[][]J
^İ\Ë™Ü˜[
Ù[XZ[QRS—ÑSPRS˜[YNˆ“İÛ™\ˆ‹Xİ\™N›[Ú[NY_J_Kˆ

^Ü\œ™\XÙJËKÙËŠÈŠKœ™\XÙJ×ËÙË‹ÈŠNİÚ[J›[™İ	M
\
ÏHHÂˆ™]\›ˆXÛÙUT’PÛÛ\Û™[
]ØŠ
KœÜ]
ˆŠK›X\
ÚOˆ‰HŠÊŒŠØÚ˜Ú\ÛÙP]

KÔİš[™ÊMŠJKœÛXÙJLŠJKš›Ú[ŠˆŠJ_Kˆ\Ş[˜ÈÛÜ™Y
™\Ü
^ÂˆËÈŒLNˆYZ[ˆÙÚ[ˆØÜ™Y[ˆ\ˆ˜ZHZ[ÈÚYHÜ™Y[X[“Ô“PSTÑTˆÚYÛ‹Z[ˆZH8 %›İ]HØ\›ÂˆÛÛœİYZ[›ŞI
ˆØYZ[“ÙÚ[ˆŠNÂˆÛÛœİÛYZ[”ØÜ™Y[HHJØİ[Y[œ]Y\TÙ[XİÜŠˆÜËXYZ[‹˜Xİ]™HŠI‰˜YZ[›Ş	‰˜YZ[›Şœİ[K™\Ü^HOOH››Û™HŠNÂˆYŠ[ÛYZ[”ØÜ™Y[‰‰\[Ùˆ\Ù\]]OOH[™Yš[™YŠ\™]\›ˆ\Ù\]]›ÛÜ™Y
™\Ü
NÂˆËÈÑPˆTSÑNˆÙ\™\ˆ™\šYšY\ÈHÛÛÙÛHÚÙ[ˆ›Ü\›BˆYŠÔ•‹›[ÙOOOHœÙ\™\ˆŠ^Âˆ^ÂˆÛÛœİX]ØZ]Ù\™\TK™ÛÙÚ[Š™\Ü˜Ü™Y[X[
NÂˆYŠ‹›ÚÊ^ÂˆÔ•‹ÚÙ[Z‹ÚÙ[ÓËœÙ]
˜YZ[•ÚÙ[ˆ‹‹ÚÙ[ŠNÂˆ\Ë\Ù\Z‹\Ù\ÓËœÙ]
™Õ\Ù\ˆ‹‹\Ù\ŠNÂˆ	
ˆØYZ[“ÙÚ[ˆŠKœİ[K™\Ü^OH››Û™HÂˆYZ[‹œ™[™\Š
NĞ]Y[ÔŞ\ËœÙ
™ÛÛÙŠNÑ˜ÛÛ™™]JŒ
NÂˆØ\İœÚİÊ¸§!HÛÛÙÛHÚYÛ‹Z[ˆİXØÙ\ÜÈOœ•Ù[ÛÛYHˆŠÙ\ØÊ‹\Ù\‹›˜[Y_‹\Ù\‹™[XZ[
JÈØˆ<'ädHŠNÜ™]\›ÂˆBˆØ\İœÚİÊ¸§cŠÊ‹›\Ùß‘ÛÛÙÛHÙÚ[ˆ˜Z[ŠJNĞ]Y[ÔŞ\ËœÙ
››ÜHŠNÜ™]\›ÂˆXØ]Ú
J^ËÊˆÙ™›[™H8 %˜[˜XÚÈ™[İÈ
‹ßBˆBˆ^ÂˆÛÛœİOR”ÓÓ‹œ\œÙJ\Ë˜
™\Ü˜Ü™Y[X[œÜ]
‹ˆŠVÌWJJNÂˆ\Ë™Ü˜[
Ù[XZ[ŠK™[XZ[ˆŠKÓİÙ\Ø\ÙJ
K˜[YNK›˜[Y_K™[XZ[Xİ\™NKœXİ\™_[JNÂˆXØ]Ú
J^ÕØ\İœÚİÊ¸§cÛÛÙÛH™\ÜÛœÙH\œÙH˜ZHXH8 %Ø˜\˜HHØ\›ÈŠ_BˆKˆÜ˜[
J^ÂˆYŠ
K™[XZ[ˆŠKÓİÙ\Ø\ÙJ
HOOPQRS—ÑSPRS
^ÂˆØ\İœÚİÊ¸§cYHÛÛÙÛHXØÛİ[İÛ™\ˆØH˜ZHZOœ”Ú\™ˆˆŠĞQRS—ÑSPRS
ÈØˆ[İÙYZH<'æ#ˆŠNÂˆ]Y[ÔŞ\ËœÙ
››ÜHŠNÜ™]\›ÂˆBˆ\Ë\Ù\]NÓËœÙ]
™Õ\Ù\ˆ‹JNÓËœÙ]
˜YZ[“ÚÈ‹YJNÔË˜YZ[“ÚÓÛ˜ÙO]YNÜØ]™Tİ]Ê
NÂˆÛÛœİI
ˆØYZ[“ÙÚ[ˆŠNÚYŠŠ[‹œİ[K™\Ü^OH››Û™HÂˆYZ[‹œ™[™\Š
NĞ]Y[ÔŞ\ËœÙ
™ÛÛÙŠNÑ˜ÛÛ™™]JŒ
NÂˆØ\İœÚİÊ¸§!HYZ[ˆÚYÛ‹Z[ˆİXØÙ\ÜÈOœ•Ù[ÛÛYHˆŠÙ\ØÊK›˜[Y_K™[XZ[
JJÈØˆ<'ädHŠNÂˆBŸNÂ