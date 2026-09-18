// presets.js — default sawaal sets, final question, aur "Help me write" ka offline draft generator
(function () {
  'use strict';

  const SETS = {
    sharmana: {
      label: 'Sharmana (dheere dheere kholta hai)',
      questions: [
        { q: 'Aur suna? Aaj din kaisa jata hai tumhara?', options: ['Bas aise hi', 'Ekdum mast', 'Bore ho raha tha'] },
        { q: 'Ek batao... chai ya coffee?', options: ['Chai, obviously', 'Coffee hi coffee', 'Dono, mood ke hisaab se'] },
        { q: 'Raat ko sone se pehle sabse aakhri kaun sa app kholte ho?', options: ['WhatsApp', 'Instagram', 'YouTube'] },
        { q: 'Aisa koi gaana jo abhi months se loop mein hai?', options: ['Haan, ek hai', 'Nahi, playlist badalti rehti hai', 'Kuch bhi chal jaata hai'] },
        { q: 'Sach bolo... late replies kaun zyada karta hai?', options: ['Main', 'Tum', 'Dono barabar'] },
        { q: 'Ek cheez jo tumhe mere baare mein achhi lagti hai?', options: ['Tumhara tareeka', 'Tumhari hasi', 'Sab kuch, thoda thoda'] },
        { q: 'Agar hum kahin ghumne chalein, kahan jaoge?', options: ['Pahad', 'Beach', 'Koi bhi purana sheher'] },
        { q: 'Last one... kya tumhe lagta hai hum acchi jodi hain?', options: ['Hmm, sochne do', 'Bilkul', 'Abhi toh shuru hua hai'] }
      ],
      final_question: 'Toh ab seedha sawaal... kya tum mujhse pyaar karti ho?'
    },
    dostana: {
      label: 'Dostana (yaar waali vibe)',
      questions: [
        { q: 'Oye... aaj kya kar rahi thi poore din?', options: ['Kuch khaas nahi', 'Kaam mein busy', 'Tumhari yaad'] },
        { q: 'Ek secret batao jo kisi ko nahi pata?', options: ['Hmm, nahi bataungi', 'Baad mein', 'Theek hai, ye lo'] },
        { q: 'Hum pehli baar mile the... yaad hai kahan?', options: ['Haan bilkul', 'Thoda vague hai', 'Tum hi bata do'] },
        { q: 'Mera sabse annoying habit kaunsa hai?', options: ['Wahi na, pata hai tumhe', 'Kuch nahi, sab theek hai', 'List lambi hai'] },
        { q: 'Ek emoji jo mujhe define kare?', options: ['Bhediya', 'Chintu', 'Bilkul nahi batayegi'] },
        { q: 'Ek saath raat ke 2 baje street food... kaunsa?', options: ['Maggi point', 'Chai + bun', 'Biryani'] },
        { q: 'Agar main ek din gayab ho jaun, sabse pehle miss kya karogi?', options: ['Baatein', 'Chedkhani', 'Kuch nahi, peace milega'] },
        { q: 'Dosti ka ek word mein matlab batao?', options: ['Tum', 'Waqt', 'Sab kuch'] }
      ],
      final_question: 'Dosti se kuch zyada hai na?... Kya tum bhi mujhe pasand karti ho?'
    },
    seedha: {
      label: 'Seedha (no natak, dil se)',
      questions: [
        { q: 'Pehla sawaal simple... mujhe pasand karne lagi ho?', options: ['Shayad', 'Haan', 'Pehle tum batao'] },
        { q: 'Mere messages dekh ke smile hoti hai?', options: ['Kabhi kabhi', 'Hamesha', 'Nahi, mera poker face strong hai'] },
        { q: 'Agar main haath pakad loon... kya karogi?', options: ['Ruk jaungi', 'Chhodne nahi dungi', 'Dekha jaayega'] },
        { q: 'Ik baar honest answer... tum mera naam dekh ke kya feel hoti hai?', options: ['Gudgudi', 'Khamoshi', 'Khushi'] },
        { q: 'Long drive, baarish, aur ek gaana... kaunsa?', options: ['Tum hi chuno', 'Kuch old Bollywood', 'Kuch bhi romantic'] },
        { q: 'Aisa moment jo dobara jeena chahogi?', options: ['Haan, wahi purani shaam', 'Abhi jo chal raha hai', 'Aage ke liye save karo'] },
        { q: 'Ek line mein bata do... main tumhare liye kya hoon?', options: ['Sawal', 'Jawaab', 'Dono'] },
        { q: 'Agar kal se tumhari shakal badal jaaye, main pehchanunga?', options: ['Haan', 'Try karna', 'Nahi'] }
      ],
      final_question: 'Ab rukna nahi chahta... kya tum mujhse shaadi karogi?'
    }
  };

  const DEFAULT_REASON_HINTS = [
    'Tumhari hasi se din banta hai',
    'Gussa bhi cute lagta hai',
    'Khana saath khaya toh zyada mazaa aata hai',
    'Bina baat ki call kar deti ho'
  ];

  // offline "help me write" — keywords se Hinglish draft, koi API nahi
  function draftNote(keywords, names) {
    const kw = String(keywords || '').split(/[,.\n]/).map((s) => s.trim()).filter(Boolean).slice(0, 4);
    const to = (names && names.partner_name) || 'Tum';
    const from = (names && names.creator_name) || 'Main';
    const lines = [
      to + ',',
      ''
    ];
    if (kw.length) {
      lines.push('Ye likhte waqt bas ' + kw[0] + ' ka khayal aa raha tha.');
      if (kw[1]) lines.push('Aur haan, ' + kw[1] + ', ye tumhari favourite cheez hai, bhool kaise jaata main.');
      if (kw[2]) lines.push(kw[2] + ' ki baat toh alag hi hai.');
    } else {
      lines.push('Kuch log likhte hue sochte hain, main likhte hue tumhari yaad mein khota hoon.');
    }
    lines.push('');
    lines.push('Pata hai, log kehte hain dil ki baat chehre pe dikh jaati hai. Meri toh shayad is page pe hi dikh rahi hai.');
    lines.push('');
    lines.push('Bas itna hi. Baaki sab jab milenge, aankhon se.');
    lines.push('');
    lines.push(from);
    return lines.join('\n');
  }

  window.PRESETS = { SETS, DEFAULT_REASON_HINTS, draftNote };
})();
