/* animated-themes.js — ธีมพื้นหลังเคลื่อนไหว 5 ธีม (ธีมที่ 6–10)
   ใช้: AnimatedThemes.apply('dogs')  /  AnimatedThemes.clear()
   รูปอยู่ที่ themes/bg06.webp ... bg10.webp (แก้ BASE ได้ถ้าย้ายโฟลเดอร์) */
(function () {
  const BASE = 'themes/';

  // sprite = ส่วนของรูปที่ตัดมาขยับ (x,y,w,h เป็น % ของรูป)
  // anim: wiggle | breathe | giggle | swing | sway | flicker | hop | paw | crab
  const THEMES = {
    dogs: {
      name: '🐶 น้องหมาสวนสาธารณะ', img: 'bg06.webp', ratio: 1024 / 1536,
      sprites: [
        { x: 6.8, y: 47, w: 20, h: 10.3, a: 'wiggle', d: 2.2, dl: 0 },
        { x: 43, y: 51, w: 18.6, h: 12.7, a: 'hop', d: 1.6, dl: .3 },
        { x: 72, y: 57.6, w: 23, h: 10, a: 'wiggle', d: 1.9, dl: .8 },
        { x: 6.3, y: 62.5, w: 30, h: 16, a: 'hop', d: 1.8, dl: .5 },
        { x: 52, y: 71.6, w: 34, h: 17, a: 'breathe', d: 3.2, dl: 0 },
        { x: 72.7, y: 33.8, w: 13, h: 10, a: 'breathe', d: 2.8, dl: 1 }
      ],
      fx: s => { petals(s, 6, '#fff', 14); butterflies(s, 1, '#ffe27a'); }
    },
    sakura: {
      name: '🌸 แมวหลับใต้ซากุระ', img: 'bg07.webp', ratio: 1024 / 1536,
      sprites: [
        { x: 9, y: 56, w: 48, h: 19, a: 'breathe', d: 4.2, dl: 0 },
        { x: 15, y: 0, w: 14, h: 24, a: 'swing', d: 3.4, dl: 0, o: '50% 0' },
        { x: 90, y: 42, w: 8, h: 16, a: 'swing', d: 4, dl: .6, o: '50% 0' }
      ],
      fx: s => petals(s, 12, '#ffc4d6', 16)
    },
    chiangdao: {
      name: '🦋 แมวเล่นผีเสื้อ', img: 'bg08.webp', ratio: 1024 / 1536,
      sprites: [
        { x: 26.5, y: 67, w: 49, h: 20.5, a: 'wiggle', d: 2.4, dl: 0 },
        { x: 66, y: 61, w: 10, h: 10, a: 'paw', d: 1.3, dl: 0, o: '20% 100%' },
        { x: 4.4, y: 16, w: 18.6, h: 12.7, a: 'swing', d: 4.5, dl: 0, o: '50% 0' }
      ],
      fx: s => { butterflies(s, 2, '#fff1a8'); petals(s, 5, '#ffb3c7', 18); }
    },
    sea: {
      name: '🐬 โลมายิ้มริมทะเล', img: 'bg09.webp', ratio: 941 / 1672,
      sprites: [
        { x: 19.6, y: 51.4, w: 29.8, h: 15.3, a: 'hop', d: 2.6, dl: 0, o: '50% 90%' },
        { x: 59, y: 59.8, w: 25, h: 8.1, a: 'hop', d: 2.2, dl: .7, o: '50% 90%' },
        { x: 84, y: 89.4, w: 13, h: 5.7, a: 'crab', d: .9, dl: 0 }
      ],
      fx: s => { gulls(s, 2); sparkles(s, [[44, 57], [68, 56], [30, 50], [78, 63]]); }
    },
    halloween: {
      name: '🎃 ฮาโลวีนสุขสันต์', img: 'bg10.webp', ratio: 941 / 1672,
      sprites: [
        { x: 9, y: 51.4, w: 26, h: 18, a: 'giggle', d: 3.0, dl: 0 },
        { x: 35.6, y: 49.3, w: 26.6, h: 18.2, a: 'giggle', d: 2.7, dl: .5 },
        { x: 63.8, y: 50.5, w: 30.8, h: 20, a: 'giggle', d: 3.2, dl: 1.1 },
        { x: 3.2, y: 69, w: 27.6, h: 16, a: 'giggle', d: 2.9, dl: .8 },
        { x: 36, y: 67.9, w: 28, h: 16.4, a: 'giggle', d: 3.1, dl: 1.5 },
        { x: 66.4, y: 68.8, w: 31, h: 17, a: 'giggle', d: 2.8, dl: .2 },
        { x: 26.6, y: 34.7, w: 11.2, h: 6.6, a: 'sway', d: 4.2, dl: 0 },
        { x: 6.9, y: 40, w: 8.5, h: 6.7, a: 'sway', d: 5, dl: 1 },
        { x: 88, y: 46.6, w: 9, h: 6, a: 'sway', d: 4.6, dl: .5 },
        { x: 79.7, y: 85.2, w: 16, h: 9, a: 'sway', d: 4.8, dl: 1.6 },
        { x: 0, y: 84, w: 25.5, h: 16, a: 'flicker', d: 2.4, dl: 0 }
      ],
      fx: s => fireflies(s, 6)
    }
  };

  const CSS = `
#at-root{position:fixed;inset:0;z-index:-1;overflow:hidden;pointer-events:none;background:#000}
#at-stage{position:absolute;left:50%;top:50%;width:max(100vw,calc(100dvh * var(--r)));aspect-ratio:var(--r);transform:translate(-50%,-50%);background-size:100% 100%}
.at-s{position:absolute;background-repeat:no-repeat;will-change:transform;
 -webkit-mask-image:radial-gradient(ellipse closest-side,#000 82%,transparent 100%);mask-image:radial-gradient(ellipse closest-side,#000 82%,transparent 100%);
 animation:var(--a) var(--d) ease-in-out var(--dl) infinite;transform-origin:var(--o,50% 100%)}
@keyframes wiggle{0%,100%{transform:rotate(-2.2deg) scale(1.04)}50%{transform:rotate(2.2deg) scale(1.05,1.03)}}
@keyframes breathe{0%,100%{transform:scale(1.02)}50%{transform:scale(1.04,1.06)}}
@keyframes hop{0%,100%{transform:rotate(-3deg) scale(1.04,1.02)}50%{transform:rotate(3deg) scale(1.03,1.08)}}
@keyframes giggle{0%,55%,100%{transform:scale(1.02)}8%{transform:scale(1.03,1.07) rotate(-2deg)}16%{transform:scale(1.03,1.02) rotate(2deg)}24%{transform:scale(1.03,1.07) rotate(-2deg)}32%{transform:scale(1.03,1.02) rotate(2deg)}40%{transform:scale(1.03,1.06) rotate(-1deg)}}
@keyframes swing{0%,100%{transform:rotate(-4deg) scale(1.02)}50%{transform:rotate(4deg) scale(1.02)}}
@keyframes sway{0%,100%{transform:translate(-14%,-6%) scale(1.03);opacity:.8}50%{transform:translate(14%,6%) scale(1.03);opacity:1}}
@keyframes flicker{0%,100%{filter:brightness(1)}30%{filter:brightness(1.3) saturate(1.2)}60%{filter:brightness(1.05)}}
@keyframes paw{0%,100%{transform:rotate(-9deg) scale(1.04)}50%{transform:rotate(11deg) scale(1.04)}}
@keyframes crab{0%,100%{transform:rotate(-5deg) scale(1.05)}50%{transform:rotate(5deg) scale(1.05)}}
.at-p{position:absolute;top:-4%;opacity:.85;animation:at-fall var(--d) linear var(--dl) infinite}
.at-petal{width:1.8%;aspect-ratio:1;background:var(--c);border-radius:150% 0 150% 0}
@keyframes at-fall{0%{transform:translate(0,0) rotate(0)}100%{transform:translate(var(--dx),112vh) rotate(540deg)}}
.at-fly{position:absolute;width:6%;animation:at-flyp var(--d) ease-in-out var(--dl) infinite}
.at-fly svg{width:100%;overflow:visible}
.at-wl,.at-wr{transform-box:fill-box;animation:at-flap .22s ease-in-out infinite alternate}
.at-wl{transform-origin:100% 50%}.at-wr{transform-origin:0 50%}
@keyframes at-flap{from{transform:scaleX(1)}to{transform:scaleX(.25)}}
@keyframes at-flyp{0%,100%{transform:translate(0,0)}25%{transform:translate(28vw,-9vh)}50%{transform:translate(52vw,3vh)}75%{transform:translate(24vw,-4vh)}}
.at-gull{position:absolute;width:9%;left:-12%;animation:at-glide var(--d) linear var(--dl) infinite}
.at-gull svg{width:100%;animation:at-gf .9s ease-in-out infinite alternate;transform-origin:50% 100%}
@keyframes at-gf{from{transform:scaleY(1)}to{transform:scaleY(.45)}}
@keyframes at-glide{0%{transform:translate(0,0)}50%{transform:translate(70vw,-3vh)}100%{transform:translate(140vw,2vh)}}
.at-sp{position:absolute;width:3%;aspect-ratio:1;background:radial-gradient(circle,#fff 0 22%,rgba(255,255,255,0) 62%);animation:at-tw 2.4s ease-in-out var(--dl) infinite}
@keyframes at-tw{0%,100%{opacity:0;transform:scale(.4)}50%{opacity:1;transform:scale(1.2)}}
.at-ff{position:absolute;width:1.6%;aspect-ratio:1;border-radius:50%;background:radial-gradient(circle,#ffd27a 0 30%,rgba(255,170,60,0) 70%);animation:at-ffm var(--d) ease-in-out var(--dl) infinite}
@keyframes at-ffm{0%,100%{transform:translate(0,0);opacity:.2}50%{transform:translate(var(--dx),-900%);opacity:1}}
@media (prefers-reduced-motion:reduce){.at-s,.at-p,.at-fly,.at-gull,.at-sp,.at-ff{animation:none}}
`;

  const rnd = (a, b) => a + Math.random() * (b - a);
  function el(s, cls, style, html) {
    const d = document.createElement('div');
    d.className = cls; d.style.cssText = style || ''; if (html) d.innerHTML = html;
    s.appendChild(d); return d;
  }
  function petals(s, n, c, base) {
    for (let i = 0; i < n; i++)
      el(s, 'at-p at-petal', `left:${rnd(0, 100)}%;--c:${c};--dx:${rnd(-15, 15)}vw;--d:${rnd(base - 4, base + 6)}s;--dl:${-rnd(0, base)}s`);
  }
  function butterflies(s, n, c) {
    const svg = `<svg viewBox="0 0 40 30"><g fill="${c}" stroke="#e0b94a" stroke-width=".6"><path class="at-wl" d="M20 15C14 2 2 2 4 12c1 7 10 8 16 3z"/><path class="at-wr" d="M20 15C26 2 38 2 36 12c-1 7-10 8-16 3z"/></g><rect x="19.2" y="9" width="1.6" height="13" rx=".8" fill="#7a5a2a"/></svg>`;
    for (let i = 0; i < n; i++)
      el(s, 'at-fly', `left:${rnd(4, 18)}%;top:${rnd(40, 62)}%;--d:${rnd(14, 20)}s;--dl:${-rnd(0, 12)}s`, svg);
  }
  function gulls(s, n) {
    const svg = '<svg viewBox="0 0 50 20"><path d="M2 14Q13 0 25 12Q37 0 48 14" fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round"/></svg>';
    for (let i = 0; i < n; i++)
      el(s, 'at-gull', `top:${rnd(8, 24)}%;--d:${rnd(22, 30)}s;--dl:${-rnd(0, 20)}s`, svg);
  }
  function sparkles(s, pts) {
    pts.forEach(([x, y], i) => el(s, 'at-sp', `left:${x}%;top:${y}%;--dl:${-i * .7}s`));
  }
  function fireflies(s, n) {
    for (let i = 0; i < n; i++)
      el(s, 'at-ff', `left:${rnd(5, 95)}%;top:${rnd(55, 90)}%;--dx:${rnd(-6, 6)}vw;--d:${rnd(5, 9)}s;--dl:${-rnd(0, 8)}s`);
  }

  let root = null;
  function ensureCss() {
    if (document.getElementById('at-css')) return;
    const st = document.createElement('style'); st.id = 'at-css'; st.textContent = CSS;
    document.head.appendChild(st);
  }

  function apply(id) {
    const t = THEMES[id]; if (!t) return;
    ensureCss(); clear();
    const url = BASE + t.img;
    root = document.createElement('div'); root.id = 'at-root';
    const s = document.createElement('div'); s.id = 'at-stage';
    s.style.setProperty('--r', t.ratio);
    s.style.backgroundImage = `url(${url})`;
    t.sprites.forEach(p => {
      const bx = p.w >= 100 ? 0 : (p.x / (100 - p.w)) * 100;
      const by = p.h >= 100 ? 0 : (p.y / (100 - p.h)) * 100;
      const d = el(s, 'at-s',
        `left:${p.x}%;top:${p.y}%;width:${p.w}%;height:${p.h}%;` +
        `background-image:url(${url});background-size:${10000 / p.w}% ${10000 / p.h}%;background-position:${bx}% ${by}%;` +
        `--a:${p.a};--d:${p.d}s;--dl:${p.dl}s;` + (p.o ? `--o:${p.o};` : ''));
    });
    t.fx(s);
    root.appendChild(s); document.body.appendChild(root);
    try { localStorage.setItem('at-theme', id); } catch (e) {}
  }
  function clear() {
    if (root) { root.remove(); root = null; }
    const r = document.getElementById('at-root'); if (r) r.remove();
    try { localStorage.removeItem('at-theme'); } catch (e) {}
  }
  function restore() {
    let id = null; try { id = localStorage.getItem('at-theme'); } catch (e) {}
    if (id && THEMES[id]) apply(id);
  }

  window.AnimatedThemes = { themes: THEMES, apply, clear, restore };
})();
