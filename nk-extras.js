ต/* nk-extras.js — เสียงคลิกน่ารัก + เพลเยอร์เพลง (ต่อด้วยเพลงผ่อนคลาย) + วิดีโอ/GIF/3D ในโปสเตอร์หน้าหลัก */
(function(){
  const YT='https://youtu.be/A0at5cAlbZQ';
  const m=String(YT).match(/(?:youtu\.be\/|[?&]v=|shorts\/|embed\/)([\w-]{11})/);
  const pan=document.getElementById('nkp');
  if(!m||!pan)return;
  const add=()=>{
    if(!pan.classList.contains('open')||pan.querySelector('#nkyt'))return;
    const d=document.createElement('div');d.id='nkyt';
    d.innerHTML='<button style="width:100%;margin-top:10px">🎼 เพลงแนะนำของร้าน</button><div></div>';
    const b=d.querySelector('button'),w=d.querySelector('div');
    b.onclick=()=>{w.innerHTML=w.innerHTML?'':'<iframe src="https://www.youtube.com/embed/'+m[1]+'?rel=0&playsinline=1" allow="autoplay;encrypted-media;fullscreen" allowfullscreen style="width:100%;aspect-ratio:16/9;border:0;border-radius:12px;margin-top:8px"></iframe><a href="https://youtu.be/'+m[1]+'" target="_blank" rel="noopener" style="font-size:12px">เล่นไม่ได้? เปิดใน YouTube</a>'};
    pan.appendChild(d);
  };
  new MutationObserver(add).observe(pan,{childList:true,attributes:true});
})();
    /* ---------- 1) เสียงคลิก ---------- */
    function click() {
      if (!clickOn) return;
      try {
        const a = ac(), t = a.currentTime, f = PEN[Math.floor(Math.random() * PEN.length)];
        const o = a.createOscillator(), g = a.createGain();
        o.type = 'sine'; o.frequency.setValueAtTime(f, t); o.frequency.exponentialRampToValueAtTime(f * 1.5, t + .07);
        g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(.18, t + .008); g.gain.exponentialRampToValueAtTime(.0001, t + .16);
        o.connect(g); g.connect(master); o.start(t); o.stop(t + .18);
      } catch (e) { }
    }
    let started = false;
    window.addEventListener('pointerdown', e => {
      const t = e.target && e.target.closest ? e.target : null;
      if (t && t.closest('button,a,label,select,.item,.nav *,[data-s],[data-i]')) click();
      if (!started) { started = true; if (wantOn) { try { ac() } catch (x) { } playNext() } }
    }, true);

    /* ---------- 2) เพลงผ่อนคลาย (สร้างสดด้วย Web Audio ไม่ต้องมีไฟล์) ---------- */
    let rg = null, rTimer = null, rNext = 0, rNb = 0, rIdx = 0;
    const PROG = [[130.81, 164.81, 196, 246.94], [110, 130.81, 164.81, 196], [87.31, 110, 130.81, 164.81], [98, 123.47, 146.83, 164.81]];
    function pad(f, t, d, dst) {
      [-4, 4].forEach(dt => {
        const o = AC.createOscillator(), g = AC.createGain(), lp = AC.createBiquadFilter();
        o.type = 'triangle'; o.frequency.value = f; o.detune.value = dt; lp.type = 'lowpass'; lp.frequency.value = 900;
        g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(.05, t + 2.5); g.gain.setValueAtTime(.05, t + d - 2.5); g.gain.linearRampToValueAtTime(0, t + d + 1);
        o.connect(lp); lp.connect(g); g.connect(dst); o.start(t); o.stop(t + d + 1.2);
      });
    }
    function bell(f, t, dst) {
      const o = AC.createOscillator(), o2 = AC.createOscillator(), g = AC.createGain(), g2 = AC.createGain();
      o.frequency.value = f; o2.frequency.value = f * 2; g2.gain.value = .25;
      g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(.11, t + .01); g.gain.exponentialRampToValueAtTime(.0001, t + 2.6);
      o.connect(g); o2.connect(g2); g2.connect(g); g.connect(dst); o.start(t); o2.start(t); o.stop(t + 2.7); o2.stop(t + 2.7);
    }
    function startRelax() {
      if (rg) return;
      const a = ac(); rg = a.createGain(); rg.gain.value = 0; rg.gain.setTargetAtTime(1, a.currentTime, 1.5);
      const dly = a.createDelay(1), fb = a.createGain(), lp = a.createBiquadFilter();
      dly.delayTime.value = .37; fb.gain.value = .4; lp.type = 'lowpass'; lp.frequency.value = 1800;
      rg.connect(master); rg.connect(dly); dly.connect(lp); lp.connect(fb); fb.connect(dly); lp.connect(master);
      rg._w = [dly, lp, fb];
      rNext = a.currentTime + .2; rNb = a.currentTime + 1;
      const g = rg, tick = () => {
        const now = a.currentTime;
        while (rNext < now + 3) { PROG[rIdx % PROG.length].forEach(f => pad(f, rNext, 8, g)); rIdx++; rNext += 8 }
        while (rNb < now + 3) { if (Math.random() < .7) bell(PEN[Math.floor(Math.random() * PEN.length)] * (Math.random() < .3 ? .5 : 1), rNb, g); rNb += 1.4 + Math.random() * 1.8 }
      };
      tick(); rTimer = setInterval(tick, 500);
    }
    function stopRelax() {
      if (!rg) return;
      clearInterval(rTimer); const g = rg; rg = null;
      g.gain.setTargetAtTime(0, AC.currentTime, .5);
      setTimeout(() => { try { g.disconnect(); g._w.forEach(n => n.disconnect()) } catch (e) { } }, 3500);
    }

    /* ---------- 3) เพลงที่เพิ่มเอง (เก็บใน IndexedDB ของเครื่องนี้) ---------- */
    const DB = () => new Promise((res, rej) => { const r = indexedDB.open('nk-music', 1); r.onupgradeneeded = () => r.result.createObjectStore('s', { keyPath: 'id', autoIncrement: true }); r.onsuccess = () => res(r.result); r.onerror = () => rej(r.error) });
    const tx = async (m, f) => { const d = await DB(); return new Promise((res, rej) => { const t = d.transaction('s', m), q = f(t.objectStore('s')); t.oncomplete = () => res(q && q.result); t.onerror = () => rej(t.error) }) };
    let songs = [], queue = [], cur = null, mode = 'idle', paused = false;
    tx('readonly', s => s.getAll()).then(r => { songs = r || []; ui() }).catch(() => { });

    const au = new Audio(); au.preload = 'auto'; au.volume = vol; let objUrl = null;
    au.addEventListener('ended', playNext);
    au.addEventListener('error', () => { if (mode === 'song') playNext() });
    function playSong(s) {
      cur = s; mode = 'song'; paused = false;
      if (objUrl) URL.revokeObjectURL(objUrl);
      objUrl = URL.createObjectURL(s.blob); au.src = objUrl; au.volume = vol; au.play().catch(() => { }); ui();
    }
    function playNext() {
      if (queue.length) { stopRelax(); playSong(queue.shift()); return }
      au.pause(); cur = null; mode = 'relax'; paused = false; startRelax(); ui();
    }
    function toggle() {
      if (mode === 'idle') { playNext(); return }
      if (!paused) { paused = true; if (mode === 'song') au.pause(); else stopRelax() }
      else { paused = false; if (mode === 'song') au.play().catch(() => { }); else startRelax() }
      wantOn = !paused; LS('nk_on', paused ? '0' : '1'); ui();
    }
    async function addFiles(files) {
      for (const f of files) {
        const rec = { name: f.name.replace(/\.[^.]+$/, ''), blob: f };
        rec.id = await tx('readwrite', s => s.add(rec));
        songs.push(rec); queue.push(rec);
      }
      if (mode !== 'song' || paused) { paused = false; LS('nk_on', '1'); playNext() } else ui();
    }
    async function delSong(id) {
      await tx('readwrite', s => s.delete(id));
      songs = songs.filter(s => s.id !== id); queue = queue.filter(s => s.id !== id);
      if (cur && cur.id === id) playNext(); else ui();
    }

    /* ---------- 4) ปุ่มและแผงเพลง ---------- */
    const st = document.createElement('style');
    st.textContent = `
#nkm{position:fixed;left:12px;bottom:12px;z-index:60;width:48px;height:48px;border-radius:50%;border:2px solid #fff;background:var(--wine,#ec5b9c);color:#fff;font-size:22px;box-shadow:0 3px 10px #0003;cursor:pointer;padding:0}
#nkm.on{animation:nkb .9s steps(1,end) infinite}
@keyframes nkb{0%{transform:translateY(0) rotate(-6deg)}50%{transform:translateY(-4px) rotate(6deg)}}
#nkp{position:fixed;left:12px;bottom:70px;z-index:60;width:min(92vw,330px);max-height:65vh;overflow:auto;background:#fff;color:#4a2a3a;border-radius:18px;padding:14px;box-shadow:0 6px 24px #0004;display:none;font-size:15px}
#nkp.open{display:block}
#nkp .np{margin:6px 0 10px;font-size:14px;color:#8a5a70}
#nkp .row{display:flex;gap:8px;margin-bottom:10px}
#nkp button{border:0;border-radius:12px;background:var(--wine,#ec5b9c);color:#fff;padding:8px 12px;font:inherit;cursor:pointer}
#nkp .row button{flex:1}
#nkp label{display:block;margin:8px 0}
#nkp input[type=range]{width:100%}
#nkp .add{background:#fde4ef;border-radius:12px;padding:10px;text-align:center;cursor:pointer}
#nkp .sg{display:flex;align-items:center;gap:6px;margin:6px 0}
#nkp .sg span{flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
#nkp .sg button{padding:4px 9px}
#nkp small{display:block;margin-top:10px;color:#9a7a8a;font-size:12px}`;
    document.head.appendChild(st);
    const fab = document.createElement('button'); fab.id = 'nkm'; fab.textContent = '🎵'; fab.setAttribute('aria-label', 'เพลง');
    const pan = document.createElement('div'); pan.id = 'nkp';
    document.body.appendChild(fab); document.body.appendChild(pan);
    fab.onclick = () => { pan.classList.toggle('open'); ui() };

    function ui() {
      fab.classList.toggle('on', mode !== 'idle' && !paused);
      if (!pan.classList.contains('open')) return;
      const own = isOwn();
      pan.innerHTML = `<b>🎵 เพลง</b>
<div class="np">${mode === 'song' ? '▶ ' + esc(cur.name) : mode === 'relax' ? '🌿 เพลงผ่อนคลาย (เล่นต่อเรื่อยๆ)' : 'ยังไม่ได้เล่น'}${paused ? ' (หยุดอยู่)' : ''}${queue.length ? ' · คิวอีก ' + queue.length + ' เพลง' : ''}</div>
<div class="row"><button data-k="t">${paused || mode === 'idle' ? '▶ เล่น' : '⏸ หยุด'}</button><button data-k="n">⏭ ถัดไป</button></div>
<label>🔊 ระดับเสียง<input type="range" min="0" max="1" step=".05" value="${vol}" data-k="v"></label>
<label><input type="checkbox" data-k="c" ${clickOn ? 'checked' : ''}> เสียงคลิกปุ่ม</label>
${own ? '<label class="add">＋ เพิ่มเพลงของฉัน<input type="file" accept="audio/*" multiple style="display:none" data-k="a"></label>' : ''}
${songs.map(s => `<div class="sg"><span>${esc(s.name)}</span>${own ? `<button data-k="p" data-id="${s.id}">▶</button><button data-k="d" data-id="${s.id}">🗑</button>` : ''}</div>`).join('')}
<small>เพลงที่เพิ่มเก็บไว้ในเครื่องนี้ · เล่นจบแล้วจะต่อด้วยเพลงผ่อนคลายอัตโนมัติ</small>`;
    }
    pan.addEventListener('click', e => {
      const b = e.target.closest('button[data-k]'); if (!b) return;
      const k = b.dataset.k, id = +b.dataset.id;
      if (k === 't') toggle();
      else if (k === 'n') { if (mode === 'song') { au.pause() } stopRelax(); paused = false; playNext() }
      else if (k === 'p') { const s = songs.find(x => x.id === id); if (s) { queue.unshift(s); stopRelax(); playNext() } }
      else if (k === 'd') { if (confirm('ลบเพลงนี้?')) delSong(id) }
    });
    pan.addEventListener('change', e => {
      const k = e.target.dataset.k;
      if (k === 'c') { clickOn = e.target.checked; LS('nk_click', clickOn ? '1' : '0') }
      else if (k === 'a' && e.target.files.length) addFiles([...e.target.files]);
    });
    pan.addEventListener('input', e => {
      if (e.target.dataset.k === 'v') { vol = +e.target.value; LS('nk_vol', vol); au.volume = vol; if (master) master.gain.value = vol }
    });

    /* ---------- 5) โปสเตอร์หน้าหลัก: วิดีโอ / GIF / 3D ---------- */
    const isLink = s => { s = String(s || ''); return /^https?:\/\//i.test(s) || /\.[a-z0-9]{2,5}(\?.*)?$/i.test(s) };
    function media(u) {
      u = String(u).trim(); let m;
      const fr = (src, ar) => `<iframe src="${src}" allow="autoplay;encrypted-media;picture-in-picture;fullscreen" allowfullscreen loading="lazy" style="width:100%;aspect-ratio:${ar};border:0;display:block;border-radius:12px"></iframe>`;
      if ((m = u.match(/(?:youtu\.be\/|[?&]v=|shorts\/|embed\/)([\w-]{11})/))) return fr(`https://www.youtube.com/embed/${m[1]}?rel=0&playsinline=1`, '16/9');
      if ((m = u.match(/drive\.google\.com\/file\/d\/([\w-]+)/))) return fr(`https://drive.google.com/file/d/${m[1]}/preview`, '16/9');
      if (/sketchfab\.com/.test(u) && (m = u.match(/([0-9a-f]{32})/))) return fr(`https://sketchfab.com/models/${m[1]}/embed?autostart=1`, '4/3');
      if (/\.(glb|gltf)(\?|$)/i.test(u)) {
        if (!window.customElements.get('model-viewer') && !document.getElementById('mvjs')) {
          const s = document.createElement('script'); s.id = 'mvjs'; s.type = 'module';
          s.src = 'https://ajax.googleapis.com/ajax/libs/model-viewer/3.5.0/model-viewer.min.js'; document.head.appendChild(s);
        }
        return `<model-viewer src="${esc(u)}" auto-rotate camera-controls autoplay shadow-intensity="1" style="width:100%;height:380px;display:block;background:transparent"></model-viewer>`;
      }
      if (/\.(mp4|webm|mov|m4v)(\?|$)/i.test(u)) return `<video src="${esc(u)}" autoplay muted loop playsinline controls style="width:100%;display:block;border-radius:12px"></video>`;
      return `<img src="${esc(u)}" alt="" style="width:100%;display:block;border-radius:12px">`;
    }
    let t0;
    function fix() {
      try {
        const L = [...document.querySelectorAll('.po:not([data-m])')];
        if (L.length) {
          const all = [...document.querySelectorAll('.po')];
          L.forEach(el => {
            el.dataset.m = 1;
            const p = (typeof posters !== 'undefined') && posters[all.indexOf(el)];
            if (p && isLink(p.photo)) { const im = el.querySelector('img'); if (im) im.outerHTML = media(p.photo) }
          });
        }
        const pf = document.getElementById('pF');
        if (pf && !document.getElementById('pU'))
          pf.insertAdjacentHTML('afterend', '<label>หรือใส่ลิงก์วิดีโอ / GIF / 3D (ไม่ต้องเลือกรูป)</label><input id="pU" placeholder="https://… .mp4 | YouTube | Google Drive | .glb | Sketchfab | ชื่อไฟล์ใน GitHub"><div class="sub">ไฟล์ .mp4 หรือ .glb ที่อัปโหลดไว้ใน GitHub ให้พิมพ์แค่ชื่อไฟล์ เช่น intro.mp4</div>');
      } catch (e) { }
    }
    new MutationObserver(() => { clearTimeout(t0); t0 = setTimeout(fix, 80) }).observe(document.body, { childList: true, subtree: true });
    window.addEventListener('click', async e => {
      const b = e.target.closest && e.target.closest('#pS'); if (!b) return;
      const u = (document.getElementById('pU') || {}).value; if (!u || !u.trim()) return;
      e.stopImmediatePropagation(); e.preventDefault();
      const m = document.getElementById('msg'); b.disabled = true;
      try {
        const r = await post('poster', { photo: u.trim(), title: document.getElementById('pT').value.trim(), orient: document.getElementById('pO').value });
        if (r && r.err) throw r.err;
        document.getElementById('ov').classList.remove('on'); await load();
      } catch (x) { if (m) { m.className = 'msg bad'; m.textContent = typeof x === 'string' ? x : 'บันทึกไม่สำเร็จ' } b.disabled = false }
    }, true);
    fix();
  } catch (e) { console.warn('nk-extras:', e); }
})();
