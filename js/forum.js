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

   手不是用固定座標擺的 —— heroContact() 以標準字上的 .oo-spark
   （兩個 O 交疊處）為錨點，反推兩隻手食指指尖該落在哪，所以標準字大小
   一改，手就自己跟著跑。這裡的數字都是「相對接觸點」的偏移。

   進場（兩手滑近交會＋星芒綻放）比照競賽官網 main.js 的 heroContact，
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

/* 左側文案的設計稿 SVG 先內嵌進來再開演：內嵌後 SVG 裡的文字才吃得到
   頁面的網頁字型，進場動畫也才抓得到裡面的 [data-kv] 掛點。 */
const heroSvgReady = heroCopySvg();

Promise.all([fontsReady, windowLoaded, heroSvgReady]).then(() => {
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
        heroContact(false);
        // 不跑進場，直接把文案顯示出來（html.js 預設先藏起來，見 forum.css）
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

      heroContact(true);
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
   右側主視覺：定位＋指尖交會（比照競賽官網 main.js 的 heroContact）

   手不是寫死座標：以標準字上的 .oo-spark（兩個 O 交疊處）為錨點反推
   指尖該落在哪，標準字一改大小手就自己跟著跑。
   animate=false（降低動態偏好）時只定位，直接停在最終狀態。
   ============================================================ */
function heroContact(animate) {
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
  const rImg = hr.querySelector('img');
  const lImg = hl.querySelector('img');
  const bImg = burst ? burst.querySelector('img') : null;

  if (!animate) { if (oo) oo.classList.add('is-glow'); return; }

  /* 接觸時間軸與競賽官網同一份：兩手沿手臂軸滑近，唯一那顆星跟著右手同軌跡，
     相觸瞬間原地綻放＋OO 發光＋灑一波星點，最後兩手與光點同相位呼吸。 */
  // 星芒的置中靠 CSS 的 translate(-50%,-50%)，GSAP 只讀得到換算後的 px，
  // 一旦補間 x/y 就會把置中吃掉 → 先改用 xPercent/yPercent 記這一半，x/y 歸零重算。
  gsap.set(burst, { autoAlpha: 0, xPercent: -50, yPercent: -50, x: 0, y: 0 });
  const ctl = gsap.timeline({ delay: 0.35 });
  ctl.fromTo([rImg, lImg], { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.9, ease: 'power1.out' }, 0)
    .fromTo(rImg, { x: 285, y: -120 }, { x: 0, y: 0, duration: 2.7, ease: 'sine.inOut' }, 0)
    .fromTo(lImg, { x: -285, y: 120 }, { x: 0, y: 0, duration: 2.7, ease: 'sine.inOut' }, 0)
    .fromTo(burst, { x: 285, y: -120, autoAlpha: 0 },
      { autoAlpha: 0.72, duration: 0.9, ease: 'power1.out' }, 0)
    .to(burst, { x: 0, y: 0, duration: 2.7, ease: 'sine.inOut' }, 0)
    .fromTo(bImg, { scale: 0.42, rotation: -12 },
      { scale: 0.56, rotation: -4, duration: 2.7, ease: 'sine.inOut' }, 0)
    .add('touch', 2.7)
    .to(burst, { autoAlpha: 1, duration: 0.3, ease: 'power2.out' }, 'touch')
    .to(bImg, { scale: 1.16, rotation: 0, duration: 0.42, ease: 'power2.out' }, 'touch')
    .to(bImg, { scale: 1, duration: 0.6, ease: 'power2.inOut' }, 'touch+=0.42')
    .call(() => { if (oo) oo.classList.add('is-glow'); }, null, 'touch')
    // 相觸瞬間灑一波星點（同競賽官網）
    .call(() => sparkleBurst(hero), null, 'touch')
    // 接觸瞬間的輕微反彈
    .to(rImg, { x: 5, y: -3, duration: 0.15, ease: 'power2.out' }, 'touch')
    .to(lImg, { x: -5, y: 3, duration: 0.15, ease: 'power2.out' }, 'touch')
    .to(rImg, { x: 0, y: 0, duration: 0.5, ease: 'power2.inOut' }, 'touch+=0.17')
    .to(lImg, { x: 0, y: 0, duration: 0.5, ease: 'power2.inOut' }, 'touch+=0.17')
    // 接觸後：兩手與光點同步呼吸（同相位，接點不散）＋星芒脈動
    .call(() => {
      gsap.to([rImg, lImg, burst], { y: '+=9', duration: 4.4, yoyo: true, repeat: -1, ease: 'sine.inOut' });
      if (bImg) gsap.to(bImg, { scale: 1.18, duration: 2.6, yoyo: true, repeat: -1, ease: 'sine.inOut' });
    });
}

/* 相觸瞬間灑出的星點（同競賽官網 main.js 的接觸回呼）。
   Banner 平常沒有星野 —— ambientFx() 刻意不含 .fhero（客戶要求右側不要有
   流星掃過），所以這裡自己補一層 .ambient 專門放這些星，不含流星與漂移光點。 */
function sparkleBurst(hero) {
  let layer = hero.querySelector('.ambient');
  if (!layer) {
    layer = document.createElement('div');
    layer.className = 'ambient';
    layer.setAttribute('aria-hidden', 'true');
    hero.prepend(layer);
  }
  for (let i = 0; i < 14; i++) {
    const st = document.createElement('span');
    st.className = 'bg-star' + (Math.random() < 0.35 ? ' is-white' : '');
    st.textContent = Math.random() < 0.6 ? '✦' : '·';
    st.style.left = (Math.random() * 90 + 5) + '%';
    st.style.top = (Math.random() * 80 + 8) + '%';
    st.style.fontSize = (Math.random() * 9 + 7) + 'px';
    layer.appendChild(st);
    gsap.fromTo(st, { opacity: 0, scale: 0 },
      { opacity: Math.random() * 0.5 + 0.5, scale: 1, duration: 0.5, delay: Math.random() * 0.5, ease: 'back.out(2)' });
    gsap.to(st, { opacity: 0.15, duration: Math.random() * 1.6 + 1.2, yoyo: true, repeat: -1, ease: 'sine.inOut', delay: 0.9 + Math.random() });
  }
}

/* ============================================================
   內嵌設計稿 SVG

   用 <img> 載 SVG 的話裡面吃不到頁面的網頁字型（會退回系統字），
   所以改成 fetch 回來直接塞進 DOM。取不到檔時（例如用 file:// 直接開）
   仍退回 <img>，字型不對至少畫面不會空著。
   ============================================================ */
function heroCopySvg() {
  const slot = document.querySelector('.fhero-svg-slot[data-hero-svg]');
  if (!slot) return Promise.resolve();
  const url = slot.dataset.heroSvg;

  return fetch(url)
    .then(res => { if (!res.ok) throw new Error(res.status); return res.text(); })
    .then(txt => {
      const doc = new DOMParser().parseFromString(txt, 'image/svg+xml');
      const svg = doc.querySelector('svg');
      if (!svg || doc.querySelector('parsererror')) throw new Error('parse failed');
      slot.appendChild(document.importNode(svg, true));
    })
    .catch(() => {
      const img = document.createElement('img');
      img.className = 'fhero-svg';
      img.src = url;
      img.alt = '';
      slot.appendChild(img);
    });
}

/* ============================================================
   左側文案進場：Banner 的主角

   文案整塊是主辦設計稿的 SVG，逐行進場靠裡面的 [data-kv] 掛點推。
   每一行動之前先套一層 <g>：設計稿自己的 <text> 上帶著 transform
   matrix（排版就靠它），直接讓 GSAP 動會把那個 matrix 蓋掉，字就跑位。
   裝飾線條是 ::before，GSAP 選不到，改由 .fhero-copy 上的 .is-in
   觸發 forum.css 的 keyframes，兩邊時間軸對齊。
   ============================================================ */
/* 進場順序＝設計稿由上而下：光暈先鋪底，再標語→標準字→標題→副標→資訊框 */
const KV_LINES = ['glow', 'eyebrow', 'mark', 'title', 'sub', 'bracket', 'time', 'place'];

function heroCopyIntro(isDesktop) {
  const copy = document.querySelector('.fhero-copy');
  if (!copy) return;
  copy.classList.add('is-in');

  const svg = copy.querySelector('svg.fhero-svg');
  // 退回 <img> 的情況（見 heroCopySvg）：抓不到掛點，整塊淡入就好
  if (!svg) {
    copy.classList.add('is-ready');
    gsap.from(copy.querySelector('.fhero-svg-slot'), { autoAlpha: 0, duration: 0.8, delay: 0.25 });
    return;
  }

  const tl = gsap.timeline({ defaults: { ease: 'power3.out' }, delay: 0.25 });

  KV_LINES.forEach((name, i) => {
    const nodes = svg.querySelectorAll('[data-kv="' + name + '"]');
    if (!nodes.length) return;
    // 同名節點（光暈是三張圖）一起包，包在第一個節點原本的位置以維持疊圖順序
    const wrap = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    nodes[0].parentNode.insertBefore(wrap, nodes[0]);
    nodes.forEach(node => wrap.appendChild(node));

    const isGlow = name === 'glow';
    tl.from(wrap, {
      autoAlpha: 0,
      y: isGlow ? 0 : 14,
      duration: isGlow ? 0.9 : 0.55,
    }, isGlow ? 0 : 0.2 + i * 0.13);
  });

  // 進場結束後，TiBOOST 標準字持續微亮呼吸，讓左側保有一點動態
  if (isDesktop) {
    const mark = svg.querySelector('[data-kv="mark"]');
    if (mark) {
      tl.to(mark, {
        filter: 'drop-shadow(0 0 22px rgba(198,242,20,.6))',
        duration: 2.8, yoyo: true, repeat: -1, ease: 'sine.inOut',
      }, '>0.2');
    }
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
