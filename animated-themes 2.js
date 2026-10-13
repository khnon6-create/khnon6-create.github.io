/* animated-themes.js — เพิ่มธีมภาพเคลื่อนไหว 5 อัน (รวมของเดิม 11 = 16)
   วางไฟล์นี้ไว้โฟลเดอร์เดียวกับ index.html (index.html เรียกไว้แล้วท้ายไฟล์)
   จังหวะเคลื่อนไหวแบบอนิเมะ "ดุ๊กดิ๊ก" ใช้ steps() ความเร็วปกติ ไม่เร็วเกินไป */
(function () {
  try {
    if (typeof PRE === 'undefined' || typeof applyTheme !== 'function') return;

    /* ---------- 1) เพิ่มธีมเข้า PRE (ปุ่มเลือกธีมสร้างจาก PRE อัตโนมัติ) ---------- */
    Object.assign(PRE, {
      hw2: { n: '🎃 แมวฮาโลวีน (อนิเมะ)', a: '#e8761e', b: '#1b1430', c: '#2a2144', i: '#fbeedd', m: '#cbb8ee', e: '' },
      cd:  { n: '🏔️ แมวบนดอยเชียงดาว',    a: '#d98a00', b: '#13203d', c: '#1f2e52', i: '#eaf2ff', m: '#a9bddf', e: '' },
      jp:  { n: '⛩️ แมวญี่ปุ่น ซากุระ',   a: '#d8352a', b: '#fff3f2', c: '#ffffff', i: '#3b1f1f', m: '#9a6b6b', e: '' },
      dg:  { n: '🐶 หมาวิ่งเล่นไล่จับ',    a: '#f08a24', b: '#eaf8e4', c: '#ffffff', i: '#2e4a2a', m: '#6f8f68', e: '' },
      an:  { n: '🧶 แมวอนิเมะเล่นไหมพรม', a: '#ff6fa5', b: '#fff0f7', c: '#ffffff', i: '#5a2a46', m: '#9a6a88', e: '' }
    });

    /* ---------- 2) CSS สำหรับภาพเคลื่อนไหว (แอนิเมชันดุ๊กดิ๊กสมูท เป็นธรรมชาติ) ---------- */
    const css = `
#afx{position:fixed;inset:0;pointer-events:none;z-index:50;overflow:hidden}
#afx .p{position:absolute}
#afx svg{display:block;overflow:visible;width:100%;height:auto;filter:drop-shadow(0 1px 1px rgba(0,0,0,.25))}
body.ath main{padding-bottom:120px}
#afx .bob{animation:a-bob .9s steps(1,end) infinite}
#afx .bob2{animation:a-bob2 1.2s steps(1,end) infinite}
#afx .hop{animation:a-hop .5s steps(1,end) infinite}
#afx .flap{animation:a-flap .5s steps(1,end) infinite}
#afx .tl{transform-origin:72px 84px;animation:a-tail 1.2s steps(1,end) infinite}
#afx .hd{transform-origin:50px 72px;animation:a-tilt 2.8s steps(1,end) infinite}
#afx .ey{transform-box:fill-box;transform-origin:center;animation:a-blink 4s steps(1,end) infinite}
#afx .pw{transform-origin:66px 66px;animation:a-wave .8s steps(1,end) infinite}
#afx .dl{animation:a-leg .5s steps(1,end) infinite}
#afx .dl.b{animation-delay:-.25s}
#afx .dt{transform-origin:26px 40px;animation:a-wag .3s steps(1,end) infinite}
#afx .spin{animation:a-spin .8s steps(4,end) infinite}
#afx .sw{transform-origin:50% 0;animation:a-swing 2s steps(1,end) infinite}
@keyframes a-bob{0%{transform:translateY(0)}50%{transform:translateY(-4px)}}
@keyframes a-bob2{0%{transform:translateY(0) rotate(-3deg)}50%{transform:translateY(-7px) rotate(3deg)}}
@keyframes a-hop{0%{transform:translateY(0)}50%{transform:translateY(-9px)}}
@keyframes a-flap{0%{transform:scaleX(1)}50%{transform:scaleX(.55)}}
@keyframes a-tail{0%{transform:rotate(0)}34%{transform:rotate(14deg)}67%{transform:rotate(-6deg)}}
@keyframes a-tilt{0%{transform:rotate(0)}25%{transform:rotate(-4deg)}50%{transform:rotate(0)}75%{transform:rotate(4deg)}}
@keyframes a-blink{0%,90%{transform:scaleY(1)}93%,100%{transform:scaleY(.1)}}
@keyframes a-wave{0%{transform:rotate(-16deg)}50%{transform:rotate(10deg)}}
@keyframes a-leg{0%{transform:rotate(28deg)}50%{transform:rotate(-28deg)}}
@keyframes a-wag{0%{transform:rotate(-14deg)}50%{transform:rotate(14deg)}}
@keyframes a-spin{to{transform:rotate(360deg)}}
@keyframes a-swing{0%{transform:rotate(-7deg)}50%{transform:rotate(7deg)}}
@keyframes a-tw{0%{opacity:.2}50%{opacity:1}}
@keyframes a-go{from{transform:translateX(-170px)}to{transform:translateX(calc(100vw + 170px))}}
@keyframes a-fall{from{transform:translate(0,-40px) rotate(0)}to{transform:translate(40px,105vh) rotate(360deg)}}
@keyframes a-rise{0%{transform:translateY(0);opacity:0}15%{opacity:1}100%{transform:translateY(-60vh);opacity:0}}
@keyframes a-drift{from{transform:translateX(-14px)}to{transform:translateX(14px)}}
@keyframes a-mist{from{transform:translateX(-8%)}to{transform:translateX(8%)}}
@keyframes a-shoot{0%,86%{transform:translate(0,0) rotate(-28deg);opacity:0}88%{opacity:1}100%{transform:translate(-260px,140px) rotate(-28deg);opacity:0}}
@media (prefers-reduced-motion:reduce){#afx *{animation:none!important}}`;
    const st = document.createElement('style');
    st.id = 'afxCss';
    st.textContent = css;
    document.head.appendChild(st);

    /* ---------- 3) ตัวช่วยวาดองค์ประกอบกราฟิก ---------- */
    const R = (a, b) => a + Math.random() * (b - a);
    const P = (st, h, c) => `<div class="p ${c || ''}" style="${st}">${h || ''}</div>`;

    // แมวสไตล์อนิเมะ (ตากลมโต วิบวับ แก้มชมพู)
    const cat = (f, o = {}) => {
      const belly = o.belly || '#fff', eye = o.eye || '#3b2a8c', ear = o.ear || '#f6a6b8';
      return `<svg viewBox="0 0 100 100">
<g class="tl"><path d="M72 84c20 2 26-16 14-30" fill="none" stroke="${f}" stroke-width="9" stroke-linecap="round"/></g>
<ellipse cx="50" cy="82" rx="23" ry="16" fill="${f}"/><ellipse cx="50" cy="86" rx="12" ry="10" fill="${belly}"/>
<rect x="33" y="90" width="12" height="8" rx="4" fill="${f}"/><rect x="55" y="90" width="12" height="8" rx="4" fill="${f}"/>
${o.paw ? `<g class="pw"><rect x="62" y="60" width="10" height="24" rx="5" fill="${f}"/></g>` : ''}
${o.acc || ''}
<g class="hd">
<path d="M20 42 22 10 46 28Z" fill="${f}"/><path d="M80 42 78 10 54 28Z" fill="${f}"/>
<path d="M26 34 27 18 38 28Z" fill="${ear}"/><path d="M74 34 73 18 62 28Z" fill="${ear}"/>
<ellipse cx="50" cy="47" rx="32" ry="27" fill="${f}"/>${o.mark || ''}
<g class="ey"><ellipse cx="37" cy="48" rx="7.5" ry="9" fill="#fff"/><ellipse cx="63" cy="48" rx="7.5" ry="9" fill="#fff"/>
<ellipse cx="38" cy="50" rx="5.2" ry="6.8" fill="${eye}"/><ellipse cx="62" cy="50" rx="5.2" ry="6.8" fill="${eye}"/>
<ellipse cx="38" cy="51" rx="2.4" ry="3.6" fill="#111"/><ellipse cx="62" cy="51" rx="2.4" ry="3.6" fill="#111"/>
<circle cx="36" cy="46" r="2.4" fill="#fff"/><circle cx="60" cy="46" r="2.4" fill="#fff"/>
<circle cx="40" cy="54" r="1.2" fill="#fff"/><circle cx="64" cy="54" r="1.2" fill="#fff"/></g>
<ellipse cx="26" cy="58" rx="5" ry="3" fill="#ff8fa3" opacity=".65"/><ellipse cx="74" cy="58" rx="5" ry="3" fill="#ff8fa3" opacity=".65"/>
<path d="M44 59q3 4 6 0q3 4 6 0" fill="none" stroke="#5a3a3a" stroke-width="1.6" stroke-linecap="round"/>
<path d="M18 52 5 49M18 57 6 59M82 52 95 49M82 57 94 59" stroke="#0004" stroke-width="1" stroke-linecap="round"/>
${o.hat || ''}</g></svg>`;
    };

    // หมาวิ่งเล่นไล่จับ
    const dog = (f, belly, ear) => {
      const leg = (x, cls, c) => `<g class="dl ${cls}" style="transform-origin:${x + 4.5}px 56px"><rect x="${x}" y="54" width="9" height="26" rx="4.5" fill="${c}"/></g>`;
      return `<svg viewBox="0 0 130 90">
<g class="dt"><path d="M28 40C14 38 8 26 12 16" fill="none" stroke="${f}" stroke-width="8" stroke-linecap="round"/></g>
${leg(30, '', ear)}${leg(70, 'b', ear)}
<ellipse cx="58" cy="48" rx="36" ry="19" fill="${f}"/><ellipse cx="62" cy="58" rx="22" ry="8" fill="${belly}"/>
${leg(42, 'b', f)}${leg(82, '', f)}
<circle cx="98" cy="36" r="18" fill="${f}"/><ellipse cx="112" cy="42" rx="12" ry="9" fill="${belly}"/>
<ellipse cx="121" cy="39" rx="4" ry="3.2" fill="#2b2b2b"/><ellipse cx="113" cy="52" rx="3" ry="5" fill="#ff7d96"/>
<path d="M92 22Q76 28 80 48Q92 46 96 32Z" fill="${ear}"/>
<circle cx="103" cy="32" r="3.6" fill="#2b2b2b"/><circle cx="104.3" cy="30.8" r="1.3" fill="#fff"/>
</svg>`;
    };

    const witchHat = '<path d="M26 26 50 -16 74 26Z" fill="#3b2563"/><ellipse cx="50" cy="26" rx="34" ry="7" fill="#2b1a4a"/><rect x="35" y="15" width="30" height="6" fill="#f08a1c"/>';
    const bow = '<path d="M44 20 30 12 30 28Z M56 20 70 12 70 28Z" fill="#ff6fa5"/><circle cx="50" cy="20" r="4.5" fill="#ff3d86"/>';
    const bell = '<rect x="36" y="68" width="28" height="5" rx="2.5" fill="#d8352a"/><circle cx="50" cy="76" r="3.6" fill="#ffd23f"/>';
    const tabbyMark = '<path d="M44 22v8M50 20v9M56 22v8" stroke="#c9741f" stroke-width="3" stroke-linecap="round" fill="none"/>';
    const mikeMark = '<ellipse cx="33" cy="34" rx="12" ry="9" fill="#f2a04a"/><ellipse cx="68" cy="38" rx="10" ry="8" fill="#3a3a3a"/>';

    const fall = (ch, n, d0, d1, s0, s1) => Array.from({ length: n }, () =>
      P(`left:${R(0, 100)}%;top:0;font-size:${R(s0, s1)}px;opacity:.9;animation:a-fall ${R(d0, d1)}s linear infinite;animation-delay:${-R(0, d1)}s`, ch[Math.floor(Math.random() * ch.length)])).join('');
    const rise = (ch, n) => Array.from({ length: n }, () =>
      P(`left:${R(3, 95)}%;bottom:30px;font-size:${R(14, 26)}px;animation:a-rise ${R(7, 12)}s linear infinite;animation-delay:${-R(0, 10)}s`, ch[Math.floor(Math.random() * ch.length)])).join('');
    const floaty = (ch, l, t, sz, d) => P(`left:${l}%;top:${t}%;font-size:${sz}px;animation:a-drift ${d}s ease-in-out infinite alternate`, `<div class="bob2">${ch}</div>`);
    const walker = (inner, w, dur, delay, bottom) => P(`left:0;bottom:${bottom}px;width:${w}px;animation:a-go ${dur}s linear infinite;animation-delay:${delay}s`, `<div class="hop">${inner}</div>`);
    const stars = n => Array.from({ length: n }, () =>
      P(`left:${R(0, 100)}%;top:${R(0, 48)}%;width:${R(2, 4)}px;height:${R(2, 4)}px;border-radius:50%;background:#fff;box-shadow:0 0 6px #fff;animation:a-tw ${R(1.4, 2.8)}s steps(1,end) infinite;animation-delay:${-R(0, 3)}s`)).join('');

    /* ---------- 4) กำหนดแอนิเมชันสำหรับ 5 ธีมใหม่ ---------- */
    const SC = {
      hw2: () => // 1. แมวฮาโลวีน (อนิเมะ)
        P('top:64px;right:18px;width:44px;height:44px;border-radius:50%;background:#ffe9a8;box-shadow:0 0 24px #ffe9a8aa') +
        [18, 34, 52].map((t, i) => P(`left:0;top:${t}%;font-size:26px;animation:a-go ${26 + i * 7}s linear infinite;animation-delay:${-i * 9}s`, '<div class="flap">🦇</div>')).join('') +
        floaty('👻', 8, 30, 34, 7) + floaty('👻', 78, 44, 28, 9) + floaty('🎃', 88, 22, 24, 8) +
        P('left:8px;bottom:4px;width:88px', `<div class="bob">${cat('#2a2438', { eye: '#ffd23f', hat: witchHat, acc: bell })}</div>`) +
        P('left:104px;bottom:2px;font-size:30px', '<div class="bob2">🎃</div>') +
        walker(cat('#f2a04a', { eye: '#2a8c5a', mark: tabbyMark, belly: '#fff3e0', hat: bow }), 70, 42, -10, 6),

      cd: () => // 2. แมวบนดอยเชียงดาว
        stars(26) +
        P('top:58px;left:16px;width:38px;height:38px;border-radius:50%;box-shadow:inset -11px 0 0 0 #ffe9a8') +
        P('right:26%;top:12%;width:90px;height:2px;background:linear-gradient(90deg,#fff0,#fff);animation:a-shoot 14s linear infinite') +
        P('right:0;bottom:0;width:min(100%,560px)',
          `<svg viewBox="0 0 560 150" style="filter:none"><path d="M0 150V84L40 52 70 80 110 32 150 72 190 56 230 96 280 64 330 92 380 42 420 76 470 58 520 86 560 72V150Z" fill="#26365e"/>
<path d="M0 150V112L60 92 100 106 150 72 190 102 250 86 300 42 330 64 360 54 400 102 450 84 500 106 560 96V150Z" fill="#0f1a35"/></svg>` +
          `<div class="p" style="left:calc(53.6% - 28px);top:calc(28% - 54px);width:56px"><div class="bob">${cat('#e9e2d0', { eye: '#2f9bd6', mark: '<ellipse cx="50" cy="30" rx="14" ry="7" fill="#b9a98a"/>', belly: '#fff' })}</div></div>` +
          `<div class="p" style="left:0;bottom:-6px;width:70%;height:46px;background:radial-gradient(ellipse,#fffc,#fff0 70%);animation:a-mist 14s ease-in-out infinite alternate"></div>` +
          `<div class="p" style="right:0;bottom:6px;width:60%;height:38px;background:radial-gradient(ellipse,#fff9,#fff0 70%);animation:a-mist 19s ease-in-out infinite alternate-reverse"></div>`),

      jp: () => // 3. แมวญี่ปุ่น ซากุระ
        fall(['🌸', '🌸', '🌺'], 22, 9, 16, 12, 24) +
        [4, 90].map((l, i) => P(`${i ? 'right' : 'left'}:${i ? 12 : 10}px;top:0;width:30px;text-align:center`, '<div class="sw"><div style="width:1px;height:18px;background:#a33;margin:0 auto"></div><div style="font-size:28px;line-height:1">🏮</div></div>')).join('') +
        P('right:6px;bottom:0;width:104px',
          '<svg viewBox="0 0 100 90"><path d="M2 20Q50 28 98 20L94 11Q50 19 6 11Z" fill="#d8352a"/><rect x="14" y="30" width="72" height="6" fill="#d8352a"/><rect x="22" y="20" width="9" height="70" fill="#d8352a"/><rect x="69" y="20" width="9" height="70" fill="#d8352a"/></svg>') +
        P('right:100px;bottom:2px;width:80px', `<div class="bob">${cat('#ffffff', { eye: '#c0392b', paw: 1, acc: bell, belly: '#fff6ee' })}</div>`) +
        walker(cat('#ffffff', { eye: '#2f6b4a', mark: mikeMark, acc: bell }), 68, 44, -14, 6),

      dg: () => // 4. หมาวิ่งเล่นไล่จับ
        P('left:0;top:70px;font-size:44px;opacity:.85;animation:a-go 80s linear infinite;animation-delay:-20s', '☁️') +
        P('left:0;top:130px;font-size:34px;opacity:.7;animation:a-go 110s linear infinite;animation-delay:-70s', '☁️') +
        floaty('🦋', 20, 42, 22, 6) + floaty('🦋', 70, 55, 20, 8) +
        P('left:0;right:0;bottom:0;height:16px;background:linear-gradient(#86d46f,#4fa84a)') +
        [6, 28, 51, 74, 92].map(l => P(`left:${l}%;bottom:8px;font-size:18px`, `<div class="bob2">${['🌼', '🌷', '🌸'][Math.floor(R(0, 3))]}</div>`)).join('') +
        walker(dog('#e9a940', '#fff0d0', '#b5701f'), 100, 20, -4.2, 8) +
        walker(dog('#f4ede2', '#fff', '#8a5a36'), 100, 20, 0, 8),

      an: () => // 5. แมวอนิเมะเล่นไหมพรม
        rise(['💗', '✨', '💖', '⭐'], 10) +
        Array.from({ length: 8 }, () => P(`left:${R(0, 96)}%;top:${R(5, 55)}%;font-size:${R(12, 20)}px;animation:a-tw ${R(1.2, 2.4)}s steps(1,end) infinite;animation-delay:${-R(0, 2)}s`, '✨')).join('') +
        P('left:8px;bottom:4px;width:86px', `<div class="bob">${cat('#ffffff', { eye: '#d6479b', hat: bow, ear: '#ffb6c8' })}</div>`) +
        P(`left:0;bottom:8px;width:26px;animation:a-go 24s linear infinite;animation-delay:-4.2s`,
          '<div class="spin"><svg viewBox="0 0 40 40"><circle cx="20" cy="20" r="18" fill="#ff8fb8"/><path d="M6 14Q20 22 34 12M4 24Q20 32 36 22M10 32Q22 26 32 32" fill="none" stroke="#fff" stroke-width="2.2"/></svg></div>') +
        walker(cat('#f2a04a', { eye: '#7a3fc4', mark: tabbyMark, belly: '#fff3e0' }), 72, 24, 0, 6)
    };

    /* ---------- 5) ผูกเข้ากับระบบธีมเดิมของหน้าเว็บ ---------- */
    const oldFx = window.fx;
    window.fx = function () {
      const old = document.getElementById('afx');
      if (old) old.remove();
      const key = theme.p === 'au' ? '' : theme.p;
      if (SC[key]) {
        const o = document.getElementById('fx');
        if (o) o.remove();
        const L = document.createElement('div');
        L.id = 'afx';
        L.innerHTML = SC[key]();
        document.body.appendChild(L);
        document.body.classList.add('ath');
        return;
      }
      document.body.classList.remove('ath');
      if (typeof oldFx === 'function') oldFx();
    };

    applyTheme();
  } catch (e) { console.warn('animated-themes:', e); }
})();
