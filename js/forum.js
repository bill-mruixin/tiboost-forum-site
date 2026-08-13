/* ============================================================
   TiBOOST 論壇暨決賽頒獎典禮 — forum.js

   刻意不共用 main.js：main.js 綁定首頁專屬 DOM（統計數字、時間軸、獎項卡、
   評審 overlay…），在論壇頁會大量拋錯。主視覺與環境動畫的做法比照 main.js，
   讓兩頁的節奏一致；只有本頁才有的區塊（議程／講師／獲獎）另外寫。
   ============================================================ */

/* 標題單一來源 —— 與 main.js 的 SITE 同步，改名兩邊都要動 */
const SITE = {
  titleEn: 'TiBOOST',
  titleZh: '創新大步計畫',
};

/* ============================================================
   KV 調參：手與星芒的位置

   手不是用固定座標擺的 —— heroPlace() 以標準字上的 .oo-spark
   （兩個 O 交疊處）為錨點，反推兩隻手食指指尖該落在哪，所以標準字大小
   一改，手就自己跟著跑。這裡的數字都是「相對接觸點」的偏移。

   右側主視覺是靜態的（不做進場、呼吸、視差），動畫全集中在左側文案，
   所以這裡只剩定位參數。亮度／透明度在 forum.css 的 --kv-* 調整。
   ============================================================ */
const KV = {
  // 食指指尖在各自 PNG 內的相對座標（alpha 通道量測，與 main.js 同值）
  tipR: { x: 0.037, y: 0.935 },
  tipL: { x: 0.945, y: 0.010 },
  // 指尖離接觸點的距離（px，基準為標準字寬 585px，會依實際寬度等比縮放）
  gapX: 86,
  gapY: 70,
  gapBase: 585,
  // 接觸點相對 OO 交疊處的偏移，讓 OO 字母不被光蓋住
  contactOff: { x: -8, y: -12 },
  // 整隻手的手動微調（px，負 y = 抬高）；不影響指尖錨定計算
  offR: { x: 0, y: 0 },
  offL: { x: 0, y: 0 },
};

/* ============================================================
   講師簡介（索引對應 HTML 的 data-speaker）

   ⚠ 除了索引 3（谷立言）是主辦提供的正式內容，其餘七則都是版面用的假資料，
     上線前必須換成主辦提供的正式簡介。假資料一律以「（範例文字…）」開頭，
     搜尋「範例文字」就能找出所有還沒換掉的。

   姓名與職稱直接讀卡片上的文字，中英兩頁共用這份資料時才不會串到別的語系。
   ============================================================ */
const PLACEHOLDER_ZH = '（範例文字，正式簡介待主辦提供）長期投入產業發展與資本市場相關工作，於政策規劃、國際合作與新創輔導等領域累積豐富經驗。近年關注人工智慧與前瞻科技對產業結構的影響，並多次於國內外論壇分享觀察，推動技術商業化與跨域合作。';
const PLACEHOLDER_EN = '(Placeholder copy — official bio pending from the organizers.) Has worked extensively across industrial development and capital markets, with experience spanning policy design, international collaboration, and startup mentorship. Recent work focuses on how AI and frontier technologies reshape industry structure, with frequent speaking appearances at forums in Taiwan and abroad.';

const SPEAKERS = [
  { bio: PLACEHOLDER_ZH, bioEn: PLACEHOLDER_EN },
  { bio: PLACEHOLDER_ZH, bioEn: PLACEHOLDER_EN },
  { bio: PLACEHOLDER_ZH, bioEn: PLACEHOLDER_EN },
  {
    bio: '美國在台協會處長谷立言（Raymond F. Greene）於 2024 年 7 月 8 日抵台履新。接任此職務前，他任職美國駐日本東京大使館擔任公使一職。谷立言先生是國務院資深職業外交官，現為公使銜參贊，自 1996 年加入外交體系以來，其職業生涯始終不遺餘力，致力推動美國與印太區域在外交、經濟及安全議題上的交流。在華府期間，他曾擔任白宮國安會日本與東亞經濟事務處主任，也曾任國務院東亞暨太平洋事務局經濟政策辦公室主任，並在此期間被遴選為亞太經濟合作會議論壇的經濟委員會主席。',
    bioEn: PLACEHOLDER_EN,
  },
  { bio: PLACEHOLDER_ZH, bioEn: PLACEHOLDER_EN },
  { bio: PLACEHOLDER_ZH, bioEn: PLACEHOLDER_EN },
  { bio: PLACEHOLDER_ZH, bioEn: PLACEHOLDER_EN },
  { bio: PLACEHOLDER_ZH, bioEn: PLACEHOLDER_EN },
];
/* 依頁面語系挑簡介欄位 */
const BIO_KEY = document.documentElement.lang.startsWith('en') ? 'bioEn' : 'bio';

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin, SplitText);

/* ---------- 標題注入（單一來源） ---------- */
document.querySelectorAll('[data-title-en]').forEach(el => { el.textContent = SITE.titleEn; });
document.querySelectorAll('[data-title-zh]').forEach(el => { el.textContent = SITE.titleZh; });

/* 字型就緒後才跑入場動畫，避免 FOUT 期間量到錯的高度；3 秒硬上限。
   再等 window load，主視覺的手與標準字圖沒載完就開演會抓到 0 寬。 */
const fontsReady = Promise.race([
  document.fonts ? document.fonts.ready : Promise.resolve(),
  new Promise(resolve => setTimeout(resolve, 3000)),
]);
const windowLoaded = document.readyState === 'complete'
  ? Promise.resolve()
  : Promise.race([
      new Promise(resolve => window.addEventListener('load', resolve, { once: true })),
      new Promise(resolve => setTimeout(resolve, 5000)),
    ]);

Promise.all([fontsReady, windowLoaded]).then(() => {
  requestAnimationFrame(() => requestAnimationFrame(() => {
    init();
    ScrollTrigger.refresh();
  }));
});

function init() {
  const mm = gsap.matchMedia();

  mm.add(
    {
      isDesktop: '(min-width: 769px)',
      isMobile: '(max-width: 768px)',
      reduceMotion: '(prefers-reduced-motion: reduce)',
    },
    (ctx) => {
      const { isDesktop, reduceMotion } = ctx.conditions;

      // 降低動態偏好：只留最低限度的淡入，主視覺直接定位到最終狀態
      if (reduceMotion) {
        heroPlace();
        // 不打字，直接把文案顯示出來（html.js 預設先藏起來，見 forum.css）
        document.querySelector('.fhero-copy')?.classList.add('is-ready');
        gsap.utils.toArray('[data-fade], [data-reveal], [data-split-lines], .speaker, .winner, .contact-card, .venn-c, .agenda tbody tr')
          .forEach(el => {
            gsap.from(el, {
              autoAlpha: 0, duration: 0.6,
              scrollTrigger: { trigger: el, start: 'top 88%', once: true },
            });
          });
        return;
      }

      heroPlace();
      heroCopyIntro(isDesktop);
      heroParallax(isDesktop);
      aboutReveal(isDesktop);
      vennDraw();
      agendaRows();
      speakersBatch();
      winnersReveal();
      venueReveal();
      contactCards();
      genericReveal();
      dividers();
      if (isDesktop) bgParallax();
      footerWatermark(isDesktop);
      ambientFx(isDesktop);
      dividerDots();
      breathePulses();
    }
  );

  headerState();
  navToggleInit();
  anchorScroll();
  speakersInit();
}

/* ============================================================
   主視覺
   ============================================================ */
/* ============================================================
   右側主視覺：只定位，不做動畫

   客戶要求 Banner 的視覺重心在左側文案，右邊維持靜止，
   所以這裡沒有進場、呼吸或視差 —— 兩隻手一載入就停在最終位置。
   手不是寫死座標：以標準字上的 .oo-spark（兩個 O 交疊處）為錨點反推
   指尖該落在哪，標準字一改大小手就自己跟著跑。
   ============================================================ */
function heroPlace() {
  const hero = document.querySelector('.fhero');
  const spark = document.querySelector('.oo-spark');
  const burst = document.querySelector('.hero-burst');
  const hr = document.querySelector('.hero-hand--tr');
  const hl = document.querySelector('.hero-hand--bl');
  if (!hero || !spark || !hr || !hl) return;

  function place() {
    const hb = hero.getBoundingClientRect();
    const sb = spark.getBoundingClientRect();
    const cx = sb.left + sb.width / 2 - hb.left + KV.contactOff.x;
    const cy = sb.top + sb.height / 2 - hb.top + KV.contactOff.y;
    if (burst) { burst.style.left = cx + 'px'; burst.style.top = cy + 'px'; }
    const lock = document.querySelector('.hero-lockup');
    const k = lock ? Math.max(0.5, lock.getBoundingClientRect().width / KV.gapBase) : 1;
    const gx = KV.gapX * k, gy = KV.gapY * k;
    const rtx = cx + gx, rty = cy - gy;   // 右手指尖：接點右上側
    const ltx = cx - gx, lty = cy + gy;   // 左手指尖：接點左下側
    hr.style.left = (rtx - KV.tipR.x * hr.offsetWidth + KV.offR.x) + 'px';
    hr.style.top = (rty - KV.tipR.y * hr.offsetHeight + KV.offR.y) + 'px';
    hr.style.right = 'auto'; hr.style.bottom = 'auto';
    hl.style.left = (ltx - KV.tipL.x * hl.offsetWidth + KV.offL.x) + 'px';
    hl.style.top = (lty - KV.tipL.y * hl.offsetHeight + KV.offL.y) + 'px';
    hl.style.right = 'auto'; hl.style.bottom = 'auto';
  }
  place();
  let rT; window.addEventListener('resize', () => { clearTimeout(rT); rT = setTimeout(place, 150); });
  // 字型／圖片晚到會讓 OO 位移 → 就緒後與前幾秒內定期重新錨定
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(place);
  let settleN = 0;
  const settleIv = setInterval(() => { place(); if (++settleN >= 8) clearInterval(settleIv); }, 700);

  const oo = document.querySelector('.hero-lockup');
  if (oo) oo.classList.add('is-glow');
}

/* ============================================================
   逐字輸出：像終端機打字

   SplitText 切好字後全部設 .kv-typing（visibility:hidden，版位先佔住，
   所以打字過程不會重排），再用一個計數補間推進「已輸出到第幾字」，
   游標插在字頭前面。ease 一律 'none'，速度才是等速的打字感。
   打完 revert() 還原原始標記，RWD 斷行才不會卡在切字當下的寬度。

   cap 是這段打字的秒數上限：英文句子字數是中文的兩三倍，不封頂的話
   英文版光是打完標語就要一秒多。回傳實際花的秒數，方便外層排下一拍。
   ============================================================ */
function typeIn(tl, el, at, speed, cap) {
  const split = new SplitText(el, { type: 'chars' });
  const chars = split.chars;
  if (!chars.length) { split.revert(); return 0; }
  chars.forEach(c => c.classList.add('kv-typing'));

  const caret = document.createElement('i');
  caret.className = 'kv-caret';
  caret.setAttribute('aria-hidden', 'true');

  const state = { n: 0 };
  let shown = -1;
  const total = Math.min(chars.length * speed, cap);

  tl.to(state, {
    n: chars.length, duration: total, ease: 'none',
    onStart() { chars[0].parentNode.insertBefore(caret, chars[0]); },
    onUpdate() {
      const n = Math.floor(state.n);
      if (n === shown) return;                 // 同一格內不動 DOM
      for (let i = shown + 1; i < n; i++) chars[i].classList.remove('kv-typing');
      shown = n - 1;
      const head = chars[n];
      if (head) head.parentNode.insertBefore(caret, head);
      else caret.remove();
    },
    onComplete() {
      chars.forEach(c => c.classList.remove('kv-typing'));
      caret.remove();
      split.revert();
    },
  }, at);

  return total;
}

/* ============================================================
   讀值校正：文字先跑亂碼，再由左往右一格一格定住

   GSAP 官方的 ScrambleTextPlugin 要 Club 會員，CDN 拿不到，
   所以自己做一個最小版：只換還沒定住的字，空白保留不動。
   ============================================================ */
const SCRAMBLE_SET = '01234567890ABCDEF#%$&*/\\<>+-=';
function scrambleIn(tl, el, at) {
  const text = el.textContent;
  const state = { n: 0 };
  tl.to(state, {
    n: text.length, duration: Math.min(0.9, text.length * 0.045), ease: 'none',
    onStart() { el.classList.add('is-scrambling'); },
    onUpdate() {
      const n = Math.floor(state.n);
      let out = text.slice(0, n);
      for (let i = n; i < text.length; i++) {
        out += text[i] === ' ' ? ' ' : SCRAMBLE_SET[(Math.random() * SCRAMBLE_SET.length) | 0];
      }
      el.textContent = out;
    },
    onComplete() { el.textContent = text; el.classList.remove('is-scrambling'); },
  }, at);
}

/* ============================================================
   左側文案進場：Banner 的主角

   終端機式的逐行輸出 —— 標語打完換標題、再換副標，游標一路帶著走，
   最後資訊框開機、時間地點的讀值先亂碼再校正。
   裝飾線條是 ::before/::after，GSAP 動不到，改由 .fhero-copy 上的
   .is-in 觸發 forum.css 的 keyframes，兩邊時間軸對齊
   （見 forum.css「文案進場動畫」段落的 delay）。
   ============================================================ */
function heroCopyIntro(isDesktop) {
  const copy = document.querySelector('.fhero-copy');
  if (!copy) return;
  copy.classList.add('is-in');

  const tl = gsap.timeline({ defaults: { ease: 'power3.out' }, delay: 0.25 });
  const eyebrow = copy.querySelector('.fhero-eyebrow');
  const title = copy.querySelector('.fhero-title');
  const sub = copy.querySelector('.fhero-sub');
  const meta = copy.querySelector('.fhero-meta');

  const line = (el, at) => { if (el) tl.call(() => el.classList.add('is-line'), null, at); };

  let t = 0;
  if (eyebrow) {
    // ✦ 當作提示符：先亮起來，游標才開始吐字
    const mark = eyebrow.querySelector('i');
    if (mark) tl.from(mark, { scale: 0, autoAlpha: 0, duration: 0.35, ease: 'back.out(3)' }, 0);
    line(eyebrow, 0.05);
    // 只打 <span> 裡的文字，✦ 留在外面當提示符
    t = 0.3 + typeIn(tl, eyebrow.querySelector('span') || eyebrow, 0.3, 0.035, 0.75);
  }

  if (title) t = t + 0.18 + typeIn(tl, title, t + 0.18, 0.055, 1.1);
  if (sub) {
    t = t + 0.12 + typeIn(tl, sub, t + 0.12, 0.045, 0.7);
    line(sub, t - 0.15);            // 底線在字打完前一點就開始掃，接得比較順
  }

  if (meta) {
    // 資訊框像儀表開機：本體先進來，折角展開，兩列讀值再從亂碼校正回正確值
    tl.from(meta, { y: 24, autoAlpha: 0, duration: 0.5 }, t + 0.1);
    line(meta, t + 0.3);
    meta.querySelectorAll('dd').forEach((dd, i) => scrambleIn(tl, dd, t + 0.35 + i * 0.18));
    t += 1.2;
  }

  // 進場結束後，TiBOOST 字樣持續微亮呼吸，讓左側保有一點動態。
  // <b> 要在 revert() 之後才抓：SplitText 還原時會重建節點，先抓會拿到孤兒節點。
  if (isDesktop) {
    tl.call(() => {
      const brand = title ? title.querySelector('b') : null;
      if (!brand) return;
      gsap.to(brand, {
        textShadow: '0 0 42px rgba(198,242,20,.72)',
        duration: 2.8, yoyo: true, repeat: -1, ease: 'sine.inOut',
      });
    });
  }
}

/* Banner → 活動介紹的 scrub 視差：只推左側文案，右側主視覺保持靜止 */
function heroParallax(isDesktop) {
  if (!isDesktop) return;
  const st = { trigger: '.fhero', start: 'top top', end: 'bottom top', scrub: 1 };
  gsap.to('.fhero-copy', { y: -70, autoAlpha: 0.1, ease: 'none', scrollTrigger: st });
}

/* ============================================================
   各區 ScrollTrigger
   ============================================================ */
/* 引言逐字掃亮（桌機 scrub、手機一次到位） */
function aboutReveal(isDesktop) {
  const lead = document.querySelector('[data-split-lines]');
  if (!lead) return;
  const split = new SplitText(lead, { type: 'words' });
  gsap.fromTo(split.words, { opacity: 0.15 }, {
    opacity: 1, stagger: 0.06, ease: 'none',
    scrollTrigger: { trigger: lead, start: 'top 80%', end: 'bottom 45%', scrub: isDesktop ? true : false },
  });
}

/* 三圓依序浮現後緩慢呼吸，呼應「交疊」的概念 */
function vennDraw() {
  const circles = gsap.utils.toArray('.venn-c');
  if (!circles.length) return;
  gsap.set(circles, { scale: 0.7, autoAlpha: 0 });
  ScrollTrigger.create({
    trigger: '.venn', start: 'top 82%', once: true,
    onEnter: () => {
      gsap.to(circles, {
        scale: 1, autoAlpha: 1, duration: 0.9, stagger: 0.14, ease: 'back.out(1.5)',
        onComplete: () => {
          circles.forEach((c, i) => {
            gsap.to(c, {
              scale: 1.035, duration: 3.6 + i * 0.6,
              yoyo: true, repeat: -1, ease: 'sine.inOut', delay: i * 0.4,
            });
          });
        },
      });
    },
  });
}

/* 議程列：分批滑入，長表格不會一次全跳出來 */
function agendaRows() {
  const rows = gsap.utils.toArray('.agenda tbody tr');
  if (!rows.length) return;
  gsap.set(rows, { x: -18, autoAlpha: 0 });
  ScrollTrigger.batch(rows, {
    start: 'top 92%', once: true,
    onEnter: batch => gsap.to(batch, { x: 0, autoAlpha: 1, stagger: 0.05, duration: 0.55, ease: 'power2.out', overwrite: true }),
  });
}

function speakersBatch() {
  const cards = gsap.utils.toArray('.speaker');
  if (!cards.length) return;
  gsap.set(cards, { y: 40, autoAlpha: 0 });
  ScrollTrigger.batch(cards, {
    start: 'top 88%', once: true,
    onEnter: batch => gsap.to(batch, { y: 0, autoAlpha: 1, stagger: 0.08, duration: 0.7, ease: 'power3.out', overwrite: true }),
  });
}

/* 獲獎卡：冠軍略慢進場，讓名次有輕重 */
function winnersReveal() {
  const winners = gsap.utils.toArray('.winner');
  if (!winners.length) return;
  gsap.set(winners, { y: 48, autoAlpha: 0 });
  ScrollTrigger.batch(winners, {
    start: 'top 86%', once: true,
    onEnter: batch => gsap.to(batch, { y: 0, autoAlpha: 1, stagger: 0.14, duration: 0.8, ease: 'power3.out', overwrite: true }),
  });
}

function venueReveal() {
  const map = document.querySelector('.venue-map');
  if (map) {
    gsap.from(map, {
      clipPath: 'inset(0 0 100% 0)', duration: 1, ease: 'power2.inOut',
      scrollTrigger: { trigger: map, start: 'top 85%', once: true },
    });
  }
}

function contactCards() {
  const cards = gsap.utils.toArray('.contact-card');
  if (!cards.length) return;
  gsap.set(cards, { y: 32, autoAlpha: 0 });
  ScrollTrigger.batch(cards, {
    start: 'top 88%', once: true,
    onEnter: batch => gsap.to(batch, { y: 0, autoAlpha: 1, stagger: 0.12, duration: 0.7, ease: 'power3.out', overwrite: true }),
  });
}

/* 沒有專屬處理的區塊統一走這條（排除主視覺，那邊有自己的時間軸） */
function genericReveal() {
  gsap.utils.toArray('.sec [data-fade], .sec [data-reveal]').forEach(el => {
    gsap.from(el, {
      y: 30, autoAlpha: 0, duration: 0.8, ease: 'power3.out',
      scrollTrigger: { trigger: el, start: 'top 88%', once: true },
    });
  });
}

/* 斜切分隔線：由左往右畫開 */
function dividers() {
  gsap.utils.toArray('.divider').forEach(d => {
    gsap.from(d, {
      clipPath: 'polygon(0 0, 0 0, 0 100%, 0% 100%)', duration: 0.8, ease: 'power2.inOut',
      scrollTrigger: { trigger: d, start: 'top 90%', once: true },
    });
  });
}

/* 背景光暈視差：各自對所屬 section 做輕量 scrub 位移 */
function bgParallax() {
  gsap.utils.toArray('[data-bgfx]').forEach((el, i) => {
    gsap.fromTo(el, { y: i % 2 ? -50 : 50 }, {
      y: i % 2 ? 50 : -50, ease: 'none',
      scrollTrigger: { trigger: el.closest('.sec'), start: 'top bottom', end: 'bottom top', scrub: 1.2 },
    });
  });
}

function footerWatermark(isDesktop) {
  if (!isDesktop) return;
  gsap.fromTo('.footer-watermark', { x: '4%' }, {
    x: '-4%', ease: 'none',
    scrollTrigger: { trigger: '.footer', start: 'top bottom', end: 'bottom bottom', scrub: 1 },
  });
}

/* ============================================================
   環境動畫：星野 / 流星 / 漂移光點（逐區生成，樣式在 style.css）
   ============================================================ */
function ambientFx(isDesktop) {
  // 不含 .fhero：流星與閃爍星點會掃過右側主視覺，客戶要求 Banner 右邊靜止
  const hosts = [...document.querySelectorAll('.sec'), document.querySelector('.footer')].filter(Boolean);
  hosts.forEach((host, hi) => {
    const layer = document.createElement('div');
    layer.className = 'ambient';
    layer.setAttribute('aria-hidden', 'true');
    host.prepend(layer);
    // 星野
    const starN = isDesktop ? 8 : 4;
    for (let i = 0; i < starN; i++) {
      const s = document.createElement('span');
      s.className = 'bg-star' + (Math.random() < 0.4 ? ' is-white' : '');
      s.textContent = Math.random() < 0.55 ? '✦' : '·';
      s.style.left = (Math.random() * 94 + 2) + '%';
      s.style.top = (Math.random() * 88 + 4) + '%';
      s.style.fontSize = (Math.random() * 10 + 8) + 'px';
      layer.appendChild(s);
      gsap.to(s, {
        opacity: Math.random() * 0.55 + 0.4, scale: 1.5,
        duration: Math.random() * 1.8 + 1, yoyo: true, repeat: -1,
        ease: 'sine.inOut', delay: Math.random() * 3,
      });
    }

    // 漂移光點：緩慢游移
    const driftN = isDesktop ? 6 : 4;
    for (let i = 0; i < driftN; i++) {
      const d = document.createElement('span');
      d.className = 'drift-dot' + (Math.random() < 0.35 ? ' is-cyan' : '');
      const size = Math.random() * 4 + 4;
      d.style.width = d.style.height = size + 'px';
      d.style.left = (Math.random() * 92 + 4) + '%';
      d.style.top = (Math.random() * 84 + 8) + '%';
      layer.appendChild(d);
      gsap.to(d, {
        x: (Math.random() - 0.5) * 90,
        y: (Math.random() - 0.5) * 70,
        duration: Math.random() * 4 + 5, yoyo: true, repeat: -1,
        ease: 'sine.inOut', delay: Math.random() * 2,
      });
      gsap.to(d, {
        opacity: 0.15, duration: Math.random() * 2 + 2,
        yoyo: true, repeat: -1, ease: 'sine.inOut', delay: Math.random() * 3,
      });
    }

    // 流星：每隔三區一顆，沿 -12° 軸滑落
    const meteorN = hi % 3 === 0 ? 1 : 0;
    for (let i = 0; i < meteorN; i++) {
      const m = document.createElement('span');
      m.className = 'meteor';
      layer.appendChild(m);
      const fly = () => {
        const startX = Math.random() * 65 + 30;
        const startY = Math.random() * 40;
        const tl = gsap.timeline({
          onComplete: () => gsap.delayedCall(Math.random() * 8 + 3, fly),
        });
        tl.set(m, { left: startX + '%', top: startY + '%', x: 0, y: 0, opacity: 0 })
          .to(m, { opacity: 1, duration: 0.15 })
          .to(m, { x: -420, y: 90, duration: 1.15, ease: 'power1.in' }, 0)
          .to(m, { opacity: 0, duration: 0.35 }, 0.9);
      };
      gsap.delayedCall(1.5 + hi * 1.1 + i * 3.4, fly);
    }
  });
}

/* 斜切分隔線：光點沿線行進 */
function dividerDots() {
  document.querySelectorAll('.divider').forEach((div, i) => {
    const track = document.createElement('span');
    track.className = 'divider-track';
    const dot = document.createElement('i');
    dot.className = 'divider-dot';
    track.appendChild(dot);
    div.appendChild(track);
    const run = () => {
      gsap.fromTo(dot,
        { left: i % 2 ? '100%' : '0%', opacity: 0 },
        { left: i % 2 ? '0%' : '100%', opacity: 1, duration: 3.2, ease: 'sine.inOut',
          onUpdate: function () { if (this.progress() > 0.85) gsap.set(dot, { opacity: (1 - this.progress()) * 6.6 }); },
          onComplete: () => gsap.delayedCall(Math.random() * 4 + 2, run) });
    };
    gsap.delayedCall(2 + i * 1.8, run);
  });
}

/* 呼吸：報名鈕／圓章光暈脈動＋背景光暈明滅（texture 有 scaleX(-1)，排除以免被覆寫） */
function breathePulses() {
  gsap.to('.forum-apply', {
    boxShadow: '0 0 36px rgba(198,242,20,.6)', duration: 2.8,
    yoyo: true, repeat: -1, ease: 'sine.inOut', delay: 0.6,
  });
  gsap.utils.toArray('.bgfx > span:not(.bgfx-texture)').forEach((el, i) => {
    gsap.to(el, {
      opacity: '+=0.1', scale: 1.16, transformOrigin: 'center',
      duration: 4 + (i % 3) * 1.4, yoyo: true, repeat: -1,
      ease: 'sine.inOut', delay: i * 0.5,
    });
  });
}

/* ============================================================
   Header / Nav
   ============================================================ */
function headerState() {
  const header = document.getElementById('header');
  if (!header) return;
  ScrollTrigger.create({
    start: 80, end: 'max',
    onUpdate: self => header.classList.toggle('is-scrolled', self.scroll() > 80),
    onToggle: self => header.classList.toggle('is-scrolled', self.isActive),
  });
}

function navToggleInit() {
  const btn = document.getElementById('navToggle');
  const nav = document.querySelector('.nav');
  if (!btn || !nav) return;
  btn.addEventListener('click', () => {
    const open = nav.classList.toggle('is-open');
    btn.setAttribute('aria-expanded', String(open));
    btn.setAttribute('aria-label', open ? '關閉選單' : '開啟選單');
  });
  nav.querySelectorAll('a[href^="#"]').forEach(a => a.addEventListener('click', () => {
    nav.classList.remove('is-open');
    btn.setAttribute('aria-expanded', 'false');
  }));
}

function anchorScroll() {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const href = a.getAttribute('href');
      if (href === '#') return;
      const target = document.querySelector(href);
      if (!target) return;
      e.preventDefault();
      if (reduce) { target.scrollIntoView(); return; }
      const dist = Math.abs(target.getBoundingClientRect().top);
      const dur = Math.min(0.6, Math.max(0.3, dist / 4000));
      gsap.to(window, { scrollTo: { y: target, offsetY: 0 }, duration: dur, ease: 'power2.out' });
    });
  });
}

/* ============================================================
   講師簡介 overlay
   ============================================================ */
function speakersInit() {
  const overlay = document.getElementById('speakerOverlay');
  const cards = document.querySelectorAll('.speaker');
  if (!overlay || !cards.length) return;

  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const panel = overlay.querySelector('.overlay-panel');
  const nameEl = document.getElementById('overlayName');
  const roleEl = document.getElementById('overlayRole');
  const bioEl = document.getElementById('overlayBio');
  const photoEl = document.getElementById('overlayPhoto');
  let lastTrigger = null;

  function open(idx, trigger) {
    const s = SPEAKERS[idx];
    if (!s || !s[BIO_KEY]) return;
    lastTrigger = trigger;
    // 姓名／職稱以卡片上的文字為準（中英兩頁共用這支 JS）
    const name = trigger.querySelector('h3').textContent.trim();
    nameEl.textContent = name;
    // 卡片的職稱用 <br> 斷成兩行，攤平成一行時要補回空白，否則會黏成「金管會主委」
    const roleNode = trigger.querySelector('p').cloneNode(true);
    roleNode.querySelectorAll('br').forEach(br => br.replaceWith(' '));
    roleEl.textContent = roleNode.textContent.replace(/\s+/g, ' ').trim();
    bioEl.textContent = s[BIO_KEY];
    photoEl.textContent = name.charAt(0);
    overlay.hidden = false;
    if (!reduce) {
      gsap.fromTo(overlay, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.3 });
      gsap.fromTo(panel, { y: 24, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.45, ease: 'power3.out' });
    }
    overlay.querySelector('.overlay-close').focus();
    document.addEventListener('keydown', onKeydown);
  }

  function close() {
    const done = () => {
      overlay.hidden = true;
      document.removeEventListener('keydown', onKeydown);
      if (lastTrigger) lastTrigger.focus(); // 焦點返還原觸發鈕
    };
    if (reduce) { done(); return; }
    gsap.to(overlay, { autoAlpha: 0, duration: 0.25, onComplete: () => { gsap.set(overlay, { clearProps: 'all' }); done(); } });
  }

  function onKeydown(e) {
    if (e.key === 'Escape') { close(); return; }
    if (e.key !== 'Tab') return;
    const focusables = panel.querySelectorAll('button, a[href]');
    const first = focusables[0];
    const last = focusables[focusables.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  }

  cards.forEach(btn => {
    const idx = Number(btn.dataset.speaker);
    if (!SPEAKERS[idx] || !SPEAKERS[idx][BIO_KEY]) {
      btn.setAttribute('data-nobio', '');
      btn.disabled = true;
      return;
    }
    btn.addEventListener('click', () => open(idx, btn));
  });
  overlay.querySelectorAll('[data-overlay-close]').forEach(el => el.addEventListener('click', close));
}
