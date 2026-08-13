/* ============================================================
   TiBOOST 創新大步計畫 — main.js
   對應 docs/design-plan.md §4（GSAP）與 §4.35（狀態規格）
   ============================================================ */

/* 標題單一來源：改名只動這裡 */
const SITE = {
  titleEn: 'TiBOOST',
  titleZh: '創新大步計畫',
};

const JUDGES = [
  { name: '周秉輝', role: '台智雲AI超算加速器計畫 執行長', bio: '周秉輝現任於台灣智慧雲端服務股份有限公司(ASUS華碩集團)-AI超算加速器計畫執行長，致力於推動AI新創培育、AI創新應用及商機發展。歷任中企署「114年度中小及新創企業創育機構發展計畫」創育顧問、中企署「112-113年中小及新創企業創育機構發展計畫-企業加速器」計畫主持人、台北市產發局「臺北市產業發展獎勵及補助審議委員會」第八屆委員、「臺北創業搖籃創業投資推展及輔導計畫」顧問、台北市進出口商業同業公會「數位創新研究小組」召集人，亦曾任歐加智能(HCG和成集團)業務副總，負責管理團隊並開發市場策略。同時也是WealthForge Capital的共同創辦人。專業領域涵蓋生成式AI、AIOT、AIGC和雲應用技術，並擅長整合商業模式、市場策略和AI加速器創新發展。' },
  { name: '邱彥錡', role: 'SparkLabs Taiwan 共同創辦人暨管理合夥人', bio: '邱彥錡是 SparkLabs Taiwan 共同創辦人暨管理合夥人，專注投資 AI 與數位創新領域，致力協助早期新創拓展國際市場。SparkLabs 透過投資、加速器計劃、導師輔導與國際網絡，連結美國、日韓、與東南亞市場策略合作企業與資本夥伴。他曾任 Gogolook 創始營運長，成功將 Whoscall 拓展至全球，並促成公司被 NAVER 收購，爾後在臺灣上市（證交所: 6902）。他擁有豐富的跨境營運與募資經驗。邱彥錡長期參與臺灣創業生態發展，擔任多家企業創新顧問，協助制定公司發展策略、產品市場驗證與國際成長規劃，推動更多臺灣團隊走向世界舞台。他畢業於清華大學計量財務金融學系，為史丹佛大學商學院校友，現於臺灣大學 E 勢泮（台大後 EMBA）授課「企業創新與早期投資」，持續以創投視角回饋創業教育與人才培育。' },
  { name: '邱德成', role: '創業公會理事長、益鼎創投創辦人', bio: '1996年31歲自行創業成立益鼎創業投資公司，為當時國內最年輕的創投業負責人，深耕國內光電產業、IC設計公司、電子關鍵零組件業及成長型傳產業近30年，已經投資超過500家公司，協助國內多家企業創業成功。目前擔任中華民國創業投資商業同業公會理事長、義隆電子、帝寶工業、笙科電子、四維創新等公司董事。' },
  { name: '陳彥諭', role: '比翼生醫創投 執行合夥人', bio: 'Arthur 是比翼生醫創投的執行合夥人，負責領導美國及大中華區的醫療科技新創投資業務，並協助所投資團隊拓展至國際市場。做為史丹福大學 Biodesign Global Faculty Program研究員及日本東北大學醫學院的特聘教授，Arthur 致力於推動醫療器材創新與教育的實踐與發展。他擁有哥倫比亞大學與倫敦商學院的高階工商管理碩士（EMBA）學位，並且是 Rookie Fund 的投資人，專注於 Impact Investments。' },
  { name: '陳英姿', role: '創業者共創平台基金會 執行長', bio: '長期投入新創公司與新創品牌設立，深度串連多媒體設計產業聚落，創造新興科技與市場應用機會。專長整合行銷，曾參與多家海外新創科技公司品牌與產品在大中華區創立發展與開拓海外市場。現為創業者共創平台基金會執行長，負責AAMA台北搖籃計畫平台經營管理，協助輔導成長期創業家透過共學、共創計畫的推進注入創新能量與串連創業資源。' },
  { name: '趙書閔', role: '雲豹能源 總經理', bio: '2016年以其專業財務知識與實務經驗，擔任雲豹能源財務長兼營運長，在公司邁向IPO組織調整下，2021年獲拔擢為總經理，領導團隊建立管理制度，統管集團組織、運營、財務，帶領企業嘗試創新、跨業整合，加強落實企業社會責任，打造全方位再生能源整合服務品牌。同時具備SDCMM永續發展碳管理管理師資格，帶領企業與國際接軌，邁向零碳永續新時代。' },
  { name: '劉晏蓉', role: 'StarFab Accelerator 董事長', bio: '2013年她創辦「台灣雲谷雲豹育成」－被譽為臺灣雲端運算應用新創育成之母；擁有超過20年科技產品開發及國際行銷經驗，成功將創新方案推廣到全球超過30個國家。目前她帶領全台最大產業加速器StarFab，專注將人工智慧、物聯網、雲端運算、大數據、資安等創新技術，導入臺灣優勢產業包括半導體、製造、醫療、零售、智慧城市等數位創新的領域，已協助近200家新創與重量級企業共創，促成募資超過新台幣54億，經由StarFab輔導的新創於過去10年累積存活率將近90%，StarFab已成為臺灣新創與成熟企業共創合作、進軍國際的最佳平台。' },
  { name: '魏如伶', role: '中華開發創新加速基金 資深協理', bio: '魏如伶女士目前擔任開發創新管理顧問(股)公司及中華開發資本管理顧問(股)公司創新基金部協理。魏如伶畢業於臺灣大學國際企業學系學士、美國馬里蘭大學史密斯商學院MBA。之前曾任凱基證券資本市場部襄理，協助輔導國內外企業申請IPO掛牌交易，以及辦理SPO籌資。2015年參與籌組中華開發創新基金並負責臺灣與海外互聯網相關早期新創投資、2024年參與台日跨境基金籌集及投資。主要工作專長為案源開發、投資案評估、投後管理等。目前擔任PressPlay、4gamers、Achieve Made、Asia Parents等公司董事。' },
];

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin, SplitText);

/* ---------- 標題注入（單一來源） ---------- */
document.querySelectorAll('[data-title-en]').forEach(el => { el.textContent = SITE.titleEn; });
document.querySelectorAll('[data-title-zh]').forEach(el => { el.textContent = SITE.titleZh; });

/* ============================================================
   §4.35 狀態閘門：fonts.ready（3s 逾時 fallback）→ 動畫初始化
   ============================================================ */
const fontsReady = Promise.race([
  document.fonts.ready,
  new Promise(resolve => setTimeout(resolve, 3000)),
]);

/* preloader：首訪 1.2s、session 內跳過、3s 硬上限 */
const preloader = document.getElementById('preloader');
const visited = sessionStorage.getItem('tiboost-visited');
const preloaderDone = new Promise(resolve => {
  if (visited) { preloader.classList.add('is-done'); resolve(false); return; }
  sessionStorage.setItem('tiboost-visited', '1');
  const finish = (played) => {
    if (preloader.classList.contains('is-done')) return;
    preloader.classList.add('is-done');
    resolve(played);
  };
  setTimeout(() => {
    gsap.to(preloader, { autoAlpha: 0, duration: 0.5, onComplete: () => finish(true) });
  }, 1200);
  setTimeout(() => finish(false), 3000); // 硬上限：絕不永久黑幕
});

/* 版面定型後才建 ScrollTrigger（避免觸發點以未定型版面計算而過早開播）；
   window load 逾時 5s fallback，確保動畫初始化不會被慢資源卡死 */
const windowLoaded = document.readyState === 'complete'
  ? Promise.resolve()
  : Promise.race([
      new Promise(r => window.addEventListener('load', r, { once: true })),
      new Promise(r => setTimeout(r, 5000)),
    ]);

Promise.all([fontsReady, preloaderDone, windowLoaded]).then(() => {
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

      if (reduceMotion) {
        document.querySelectorAll('[data-count]').forEach(el => { el.textContent = el.dataset.count; });
        gsap.utils.toArray('[data-fade], [data-reveal], .adv-item, .award-card, .score-cell, .judge, .step, .tl-node, .stat').forEach(el => {
          gsap.from(el, {
            autoAlpha: 0, duration: 0.6,
            scrollTrigger: { trigger: el, start: 'top 88%', once: true },
          });
        });
        document.querySelectorAll('.tl-node').forEach((node, i) => {
          const num = document.createElement('span');
          num.className = 'tl-num';
          num.textContent = String(i + 1).padStart(2, '0');
          num.style.opacity = '0.12';
          node.appendChild(num);
          node.classList.add('is-revealed');
        });
        heroBadgeSpin();
        heroContact(false);
        document.querySelectorAll('.step-num').forEach(n => n.classList.add('is-lit'));
        return;
      }

      heroIntro(isDesktop);
      heroContact(true);
      heroParallax(isDesktop);
      heroBadgeSpin();
      purposeReveal(isDesktop);
      statsCount();
      advList();
      awardCards();
      scoreGrid();
      judgesBatch();
      timelineDraw(isDesktop);
      stepsReveal();
      dividers();
      if (isDesktop) bgParallax();
      footerWatermark(isDesktop);
      ambientFx(isDesktop);
      dividerDots();
      breathePulses();
    }
  );

  headerState();
  fabInit();
  tabsInit();
  faqInit();
  judgeOverlayInit();
  anchorScroll();
  navToggleInit();
}

/* ============================================================
   §4.1 Hero 入場 timeline
   ============================================================ */
function heroIntro(isDesktop) {
  // 入場一律作用於 img 內層；容器層保留給 scrub 視差（避免快速滾動時 tween 衝突）
  const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

  // 手與星芒的入場改由 heroContact 的「接觸」時間軸控制，這裡只做標題入場
  // 20260807：標題換成主視覺標準字（圖），逐字翻轉改為沿 23.5° 字軸描線掃出
  const mark = document.querySelector('.lockup-mark');
  if (mark) {
    const draw = { v: 0 };
    mark.style.setProperty('--draw', '0%');
    tl.to(draw, {
      v: 112, duration: 1.9, ease: 'power2.inOut',
      onUpdate() { mark.style.setProperty('--draw', draw.v + '%'); }
    }, 0.2);
  }

  // 創新大步計畫與標語改由 heroContact 在指尖相觸後才顯示
  tl.from('.hero .hero-cta', { y: 24, autoAlpha: 0, duration: 0.7 }, 0.9)
    .from('.hero-badge', { autoAlpha: 0, scale: 0.8, duration: 0.6 }, 1.1);
}

/* ============================================================
   20260727 客戶回饋：比照主視覺 — 指尖交會於 OO 交疊處＋電流由右手傳到左手
   ============================================================ */
function heroContact(animate) {
  const hero = document.querySelector('.hero');
  const spark = document.querySelector('.oo-spark');
  const burst = document.querySelector('.hero-burst');
  const hr = document.querySelector('.hero-hand--tr');
  const hl = document.querySelector('.hero-hand--bl');
  if (!hero || !spark || !hr || !hl) return;
  // 食指指尖在圖內座標（PNG alpha 通道量測）：右手 0%/67.3%、左手 94.5%/1%
  const TIP_R = { x: 0.037, y: 0.935 };  // 右手「垂下那根食指」的指尖（圖內座標）
  const TIP_L = { x: 0.945, y: 0.01 };
  // 20260808 客戶回饋：星芒不要黏著手、兩手之間要讓出字的空間
  // → 沿手臂軸（約 -39°）把兩手各往外收，指尖與光核之間留白，OO 到 ST 一段也跟著露出來
  // 基準值對應桌機 lockup 寬 585px，實際依 lockup 寬等比縮放，小螢幕才不會被撐開
  const GAPX = 86, GAPY = 70;
  const GAP_BASE = 585;
  const CONTACT_OFF = { x: -8, y: -12 };  // 接觸點從 OO 交疊處往右下偏移，讓 OO 字母露出來
  // 整支手的手動位移（px，負 y = 抬高）：微調構圖用，不影響指尖錨定計算
  const OFF_R = { x: 0, y: 0 };
  const OFF_L = { x: 0, y: 0 };

  function place() {
    const hb = hero.getBoundingClientRect();
    const sb = spark.getBoundingClientRect();
    const cx = sb.left + sb.width / 2 - hb.left + CONTACT_OFF.x;
    const cy = sb.top + sb.height / 2 - hb.top + CONTACT_OFF.y;
    if (burst) { burst.style.left = cx + 'px'; burst.style.top = cy + 'px' }
    const lock = document.querySelector('.hero-lockup');
    const k = lock ? Math.max(0.5, lock.getBoundingClientRect().width / GAP_BASE) : 1;
    const gx = GAPX * k, gy = GAPY * k;
    const rtx = cx + gx, rty = cy - gy;   // 右手指尖：接點右上側
    const ltx = cx - gx, lty = cy + gy;   // 左手指尖：接點左下側
    hr.style.left = (rtx - TIP_R.x * hr.offsetWidth + OFF_R.x) + 'px';
    hr.style.top = (rty - TIP_R.y * hr.offsetHeight + OFF_R.y) + 'px';
    hr.style.right = 'auto'; hr.style.bottom = 'auto';
    hl.style.left = (ltx - TIP_L.x * hl.offsetWidth + OFF_L.x) + 'px';
    hl.style.top = (lty - TIP_L.y * hl.offsetHeight + OFF_L.y) + 'px';
    hl.style.right = 'auto'; hl.style.bottom = 'auto';
  }
  place();
  let rT; window.addEventListener('resize', () => { clearTimeout(rT); rT = setTimeout(place, 150); });
  // 字型晚到會讓 OO 位移（h1 度量改變）→ 字型就緒後與前幾秒內定期重新錨定
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => place());
  let settleN = 0;
  const settleIv = setInterval(() => { place(); if (++settleN >= 8) clearInterval(settleIv); }, 700);

  const oo = document.querySelector('.hero-lockup');
  const rImg = hr.querySelector('img');
  const lImg = hl.querySelector('img');
  const bImg = burst ? burst.querySelector('img') : null;

  if (!animate) { if (oo) oo.classList.add('is-glow'); return; }

  // 20260808 客戶回饋：交棒怎麼調都還是怪 → 乾脆不交棒。全程只有一顆星（.hero-burst），
  // 跟著右手同軌跡進場，相觸時原地放大變亮。沒有第二個元素、沒有位移、沒有交叉淡出。
  // 接觸時間軸：單一連續補間絲滑靠近（無停頓）→ 相觸瞬間原地綻放＋OO 發光 → 同步呼吸
  gsap.set(burst, { autoAlpha: 0 });
  gsap.set('.hero .lockup-sub', { autoAlpha: 0, y: 18 });
  const ctl = gsap.timeline({ delay: 0.35 });
  ctl.fromTo([rImg, lImg], { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.9, ease: 'power1.out' }, 0)
    .fromTo(rImg, { x: 285, y: -120 }, { x: 0, y: 0, duration: 2.7, ease: 'sine.inOut' }, 0)
    .fromTo(lImg, { x: -285, y: 120 }, { x: 0, y: 0, duration: 2.7, ease: 'sine.inOut' }, 0)
    // 唯一的那顆星跟著右手同軌跡進場（落點是接觸點，比指尖再前一點 → 光走在指尖前方不黏手），
    // 進場期間維持小而半亮，全程不換元素
    .fromTo(burst, { x: 285, y: -120, autoAlpha: 0 },
      { autoAlpha: 0.72, duration: 0.9, ease: 'power1.out' }, 0)
    .to(burst, { x: 0, y: 0, duration: 2.7, ease: 'sine.inOut' }, 0)
    .fromTo(bImg, { scale: 0.42, rotation: -12 },
      { scale: 0.56, rotation: -4, duration: 2.7, ease: 'sine.inOut' }, 0)
    // 相觸（補間自然收尾的瞬間）：星就停在原地放大變亮，沒有位移、沒有交棒
    .add('touch', 2.7)
    .to(burst, { autoAlpha: 1, duration: 0.3, ease: 'power2.out' }, 'touch')
    .to(bImg, { scale: 1.16, rotation: 0, duration: 0.42, ease: 'power2.out' }, 'touch')
    .to(bImg, { scale: 1, duration: 0.6, ease: 'power2.inOut' }, 'touch+=0.42')
    .call(() => { if (oo) oo.classList.add('is-glow'); }, null, 'touch')
    // 相觸瞬間背景星星齊閃，並灑一波新星點綴
    .call(() => {
      const layer = hero.querySelector('.ambient');
      if (!layer) return;
      gsap.fromTo('.hero .bg-star', { opacity: 0.15 },
        { opacity: 1, scale: 1.9, duration: 0.35, stagger: 0.035, yoyo: true, repeat: 1, ease: 'power2.out' });
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
    }, null, 'touch')
    // 指尖相觸後，標語才依序浮現
    .to('.hero .lockup-sub', { autoAlpha: 1, y: 0, duration: 0.8, stagger: 0.14, ease: 'power2.out' }, 'touch+=0.35')
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

/* §4.2 Hero → 宗旨 scrub 視差 */
function heroParallax(isDesktop) {
  if (!isDesktop) return;
  const st = { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: 1 };
  // 兩手與光點「同向同量」位移：捲動時整組一起浮起，指尖接觸永遠不散
  gsap.to('.hero-hand--tr, .hero-hand--bl, .hero-burst', { y: -90, ease: 'none', scrollTrigger: st });
  gsap.to('.hero-axis', { y: -90, ease: 'none', scrollTrigger: st });
}

/* 圓形章旋轉（無限線性，reduced-motion 也保留 — 屬裝飾但不致眩暈） */
function heroBadgeSpin() {
  gsap.to('.hero-badge-ring', { rotation: 360, duration: 20, ease: 'none', repeat: -1, transformOrigin: '50% 50%' });
}

/* ============================================================
   §4.2 各區 ScrollTrigger
   ============================================================ */
function purposeReveal(isDesktop) {
  // 引言逐行掃亮（scrub）
  const lead = document.querySelector('[data-split-lines]');
  if (lead) {
    const split = new SplitText(lead, { type: 'words' });
    gsap.fromTo(split.words, { opacity: 0.15 }, {
      opacity: 1, stagger: 0.06, ease: 'none',
      scrollTrigger: { trigger: lead, start: 'top 80%', end: 'bottom 45%', scrub: isDesktop ? true : false },
    });
  }
  gsap.utils.toArray('[data-reveal]').forEach(el => {
    gsap.from(el, {
      y: 32, autoAlpha: 0, duration: 0.8, ease: 'power3.out',
      scrollTrigger: { trigger: el, start: 'top 85%', once: true },
    });
  });
}

function statsCount() {
  gsap.set('.stat', { y: 24, autoAlpha: 0 });
  ScrollTrigger.batch('.stat', {
    start: 'top 88%', once: true,
    onEnter: batch => gsap.to(batch, { y: 0, autoAlpha: 1, stagger: 0.1, duration: 0.7, ease: 'power3.out', overwrite: true }),
  });
  document.querySelectorAll('[data-count]').forEach(el => {
    const target = Number(el.dataset.count);
    gsap.fromTo(el, { textContent: 0 }, {
      textContent: target, duration: 1.4, ease: 'power2.out',
      snap: { textContent: 1 },
      scrollTrigger: { trigger: el, start: 'top 90%', once: true },
    });
  });
}

function advList() {
  gsap.set('.adv-item', { y: 32, autoAlpha: 0 });
  ScrollTrigger.batch('.adv-item', {
    start: 'top 85%', once: true,
    onEnter: batch => gsap.to(batch, { y: 0, autoAlpha: 1, stagger: 0.12, duration: 0.7, ease: 'power3.out', overwrite: true }),
  });
}

function awardCards() {
  gsap.set('.award-card', { y: 48, autoAlpha: 0 });
  ScrollTrigger.batch('.award-card', {
    start: 'top 85%', once: true,
    onEnter: batch => gsap.to(batch, { y: 0, autoAlpha: 1, stagger: 0.12, duration: 0.8, ease: 'power3.out', overwrite: true }),
  });
  gsap.set('.prize-strip > div', { y: 24, autoAlpha: 0 });
  ScrollTrigger.batch('.prize-strip > div', {
    start: 'top 88%', once: true,
    onEnter: batch => gsap.to(batch, { y: 0, autoAlpha: 1, stagger: 0.1, duration: 0.7, overwrite: true }),
  });
}

function scoreGrid() {
  gsap.set('.score-cell', { y: 24, autoAlpha: 0 });
  ScrollTrigger.batch('.score-cell', {
    start: 'top 85%', once: true,
    onEnter: batch => gsap.to(batch, { y: 0, autoAlpha: 1, stagger: 0.08, duration: 0.6, overwrite: true }),
  });
}

function judgesBatch() {
  gsap.set('.judge', { y: 40, autoAlpha: 0 });
  ScrollTrigger.batch('.judge', {
    start: 'top 88%', once: true,
    onEnter: batch => gsap.to(batch, { y: 0, autoAlpha: 1, stagger: 0.06, duration: 0.7, ease: 'power3.out', overwrite: true }),
  });
}

function timelineDraw(isDesktop) {
  const nodes = gsap.utils.toArray('.tl-node');
  nodes.forEach((node, i) => {
    const num = document.createElement('span');
    num.className = 'tl-num';
    num.textContent = '00';
    num.dataset.target = String(i + 1).padStart(2, '0');
    node.appendChild(num);
  });

  nodes.forEach((node, i) => {
    const num = node.querySelector('.tl-num');
    const fromX = i % 2 === 0 ? -30 : 30;
    gsap.set(node, { autoAlpha: 0, x: fromX, y: 20 });

    ScrollTrigger.create({
      trigger: node, start: 'top 88%', once: true,
      onEnter: () => {
        gsap.to(node, {
          autoAlpha: 1, x: 0, y: 0,
          duration: 0.8, delay: i * 0.15,
          ease: 'power3.out',
          onStart: () => {
            setTimeout(() => node.classList.add('is-revealed'), 200);
          },
        });
        gsap.to(num, {
          opacity: 0.12, duration: 0.6, delay: i * 0.15 + 0.3, ease: 'power2.out',
        });
        gsap.fromTo(num, { scale: 1.6 }, {
          scale: 1, duration: 0.7, delay: i * 0.15 + 0.3, ease: 'back.out(1.6)',
        });
        const target = parseInt(num.dataset.target, 10);
        gsap.fromTo(num, { textContent: 0 }, {
          textContent: target, duration: 0.5, delay: i * 0.15 + 0.25,
          ease: 'power2.out', snap: { textContent: 1 },
          onUpdate() { num.textContent = String(Math.round(parseFloat(num.textContent))).padStart(2, '0'); },
        });
      },
    });
  });
}

function stepsReveal() {
  // 20260722 視覺建議：數字隨閱讀順序亮起 — 點亮用 GSAP 補間 opacity（class 只管顏色與光暈），
  // 並清掉入場 tween 留下的 inline opacity，避免蓋掉點亮狀態
  gsap.utils.toArray('.step').forEach((step, i) => {
    const num = step.querySelector('.step-num');
    const body = step.querySelector('.step-body');
    const st = { trigger: step, start: 'top 82%', once: true };
    gsap.fromTo(num, { x: -40, opacity: 0.04 }, {
      x: 0, opacity: 0.1, duration: 0.9, ease: 'power3.out', scrollTrigger: st,
    });
    gsap.from(body, { y: 28, autoAlpha: 0, duration: 0.8, ease: 'power3.out', scrollTrigger: st });
    ScrollTrigger.create({
      trigger: step, start: 'top 62%', once: true,
      onEnter: () => gsap.to(num, {
        opacity: 1, duration: 0.8, delay: i * 0.15, ease: 'power2.out', overwrite: 'auto',
        onStart: () => num.classList.add('is-lit'),
      }),
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

function dividers() {
  gsap.utils.toArray('.divider').forEach(d => {
    gsap.from(d, {
      clipPath: 'polygon(0 0, 0 0, 0 100%, 0% 100%)', duration: 0.8, ease: 'power2.inOut',
      scrollTrigger: { trigger: d, start: 'top 90%', once: true },
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
   環境動畫：星野 / 流星 / 呼吸光暈
   ============================================================ */
function ambientFx(isDesktop) {
  const hosts = [document.querySelector('.hero'), ...document.querySelectorAll('.sec'), document.querySelector('.footer')].filter(Boolean);
  hosts.forEach((host, hi) => {
    const layer = document.createElement('div');
    layer.className = 'ambient';
    layer.setAttribute('aria-hidden', 'true');
    host.prepend(layer);
    const isHero = host.classList.contains('hero');

    // 星野：閃爍 ✦ 與光點（hero 較少較小，避免搶主視覺）
    const starN = isHero ? (isDesktop ? 10 : 5) : (isDesktop ? 8 : 4);
    for (let i = 0; i < starN; i++) {
      const s = document.createElement('span');
      s.className = 'bg-star' + (Math.random() < 0.4 ? ' is-white' : '');
      s.textContent = Math.random() < 0.55 ? '✦' : '·';
      s.style.left = (Math.random() * 94 + 2) + '%';
      s.style.top = (Math.random() * 88 + 4) + '%';
      s.style.fontSize = (isHero ? Math.random() * 7 + 6 : Math.random() * 10 + 8) + 'px';
      layer.appendChild(s);
      gsap.to(s, {
        opacity: Math.random() * 0.55 + 0.4, scale: 1.5,
        duration: Math.random() * 1.8 + 1, yoyo: true, repeat: -1,
        ease: 'sine.inOut', delay: Math.random() * 3,
      });
    }

    // 漂移光點：緩慢游移
    const driftN = isHero ? (isDesktop ? 4 : 3) : (isDesktop ? 6 : 4);
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

    // 流星：僅 hero 與少數區塊（每隔三區一顆），沿 -12° 軸滑落
    const meteorN = isHero ? 2 : (hi % 3 === 0 ? 1 : 0);
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

/* 呼吸：CTA／圓章光暈脈動＋背景光暈明滅（texture 有 scaleX(-1)，排除以免被覆寫） */
function breathePulses() {
  gsap.to('.hero-badge-core', {
    boxShadow: '0 0 34px rgba(198,242,20,.5)', duration: 2.4,
    yoyo: true, repeat: -1, ease: 'sine.inOut',
  });
  gsap.to('.hero-cta, .fab-main', {
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
/* 右下 FAB：捲過 Hero 才顯示；點主鈕展開／收合，項目滑入、文字向左延伸 */
function fabInit() {
  const root = document.getElementById('fabRoot');
  const main = document.getElementById('fabMain');
  const items = document.getElementById('fabItems');
  const hero = document.querySelector('.hero');
  if (!root || !main || !items || !hero) return;
  const update = () => {
    root.classList.toggle('is-visible', window.scrollY > hero.offsetHeight * 0.85);
    if (!root.classList.contains('is-visible') && root.classList.contains('is-open')) setOpen(false);
  };
  window.addEventListener('scroll', update, { passive: true });
  update();

  function setOpen(open) {
    root.classList.toggle('is-open', open);
    main.setAttribute('aria-expanded', String(open));
    main.querySelector('i').textContent = open ? '✕' : '✦';
    const kids = Array.from(items.children);
    if (open) {
      items.hidden = false;
      if (window.gsap) gsap.fromTo(kids, { x: 20, autoAlpha: 0 },
        { x: 0, autoAlpha: 1, duration: 0.3, stagger: 0.06, ease: 'power2.out', overwrite: true });
    } else if (window.gsap) {
      gsap.to(kids.slice().reverse(), { x: 20, autoAlpha: 0, duration: 0.2, stagger: 0.04, ease: 'power2.in', overwrite: true,
        onComplete: () => { items.hidden = true; } });
    } else {
      items.hidden = true;
    }
  }
  main.addEventListener('click', () => setOpen(!root.classList.contains('is-open')));
  document.addEventListener('click', e => {
    if (root.classList.contains('is-open') && !root.contains(e.target)) setOpen(false);
  });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') setOpen(false); });

  const topBtn = root.querySelector('[data-fab-top]');
  if (topBtn) topBtn.addEventListener('click', () => {
    setOpen(false);
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) window.scrollTo(0, 0);
    else gsap.to(window, { scrollTo: 0, duration: 0.9, ease: 'power3.inOut' });
  });
  const qaBtn = root.querySelector('[data-fab-qa]');
  if (qaBtn) qaBtn.addEventListener('click', () => {
    setOpen(false);
    const f = document.querySelector('.qa-fab');
    if (f) f.click();
  });
}

function headerState() {
  const header = document.getElementById('header');
  ScrollTrigger.create({
    start: 80, end: 'max',
    onUpdate: self => header.classList.toggle('is-scrolled', self.scroll() > 80),
    onToggle: self => header.classList.toggle('is-scrolled', self.isActive),
  });
}

function navToggleInit() {
  const btn = document.getElementById('navToggle');
  const nav = document.querySelector('.nav');
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
   Tabs（§4.35：role=tablist、方向鍵、aria-selected）
   ============================================================ */
function tabsInit() {
  const tabs = Array.from(document.querySelectorAll('.tab'));
  const panels = tabs.map(t => document.getElementById(t.getAttribute('aria-controls')));

  function activate(idx, focus = true) {
    tabs.forEach((t, i) => {
      const active = i === idx;
      t.classList.toggle('is-active', active);
      t.setAttribute('aria-selected', String(active));
      t.tabIndex = active ? 0 : -1;
      panels[i].hidden = !active;
      panels[i].classList.toggle('is-active', active);
    });
    if (focus) tabs[idx].focus();
    gsap.from(panels[idx].children, { y: 20, autoAlpha: 0, stagger: 0.06, duration: 0.5, ease: 'power2.out', clearProps: 'all' });
    ScrollTrigger.refresh();
  }

  tabs.forEach((tab, i) => {
    tab.addEventListener('click', () => activate(i, false));
    tab.addEventListener('keydown', e => {
      let next = null;
      if (e.key === 'ArrowRight') next = (i + 1) % tabs.length;
      if (e.key === 'ArrowLeft') next = (i - 1 + tabs.length) % tabs.length;
      if (e.key === 'Home') next = 0;
      if (e.key === 'End') next = tabs.length - 1;
      if (next !== null) { e.preventDefault(); activate(next); }
    });
  });
}

/* ============================================================
   FAQ（§4.35：aria-expanded / height 補間）
   ============================================================ */
function faqInit() {
  document.querySelectorAll('.faq-q').forEach(btn => {
    const answer = document.getElementById(btn.getAttribute('aria-controls'));
    btn.addEventListener('click', () => {
      const open = btn.getAttribute('aria-expanded') === 'true';
      btn.setAttribute('aria-expanded', String(!open));
      if (open) {
        gsap.to(answer, {
          height: 0, autoAlpha: 0, duration: 0.4, ease: 'power2.inOut',
          onComplete: () => { answer.hidden = true; gsap.set(answer, { clearProps: 'all' }); },
        });
      } else {
        answer.hidden = false;
        gsap.fromTo(answer, { height: 0, autoAlpha: 0 }, {
          height: 'auto', autoAlpha: 1, duration: 0.45, ease: 'power2.out',
          onComplete: () => gsap.set(answer, { clearProps: 'height' }),
        });
        gsap.from(answer.querySelector('p'), { y: 12, duration: 0.4, ease: 'power2.out' });
      }
    });
  });
}

/* ============================================================
   評審 Overlay（§4.35：ESC / focus trap / 焦點返還）
   ============================================================ */
function judgeOverlayInit() {
  const overlay = document.getElementById('judgeOverlay');
  const panel = overlay.querySelector('.overlay-panel');
  const nameEl = document.getElementById('overlayName');
  const roleEl = document.getElementById('overlayRole');
  const bioEl = document.getElementById('overlayBio');
  const photoEl = document.getElementById('overlayPhoto');
  let lastTrigger = null;

  function open(idx, trigger) {
    const j = JUDGES[idx];
    if (!j) return;
    lastTrigger = trigger;
    nameEl.textContent = j.name;
    roleEl.textContent = j.role;
    bioEl.textContent = j.bio;
    photoEl.textContent = j.name.charAt(0);
    overlay.hidden = false;

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!reduce) {
      gsap.fromTo(overlay, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.3 });
      gsap.fromTo(panel, { y: 24, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.45, ease: 'power3.out' });
    }
    overlay.querySelector('.overlay-close').focus();
    document.addEventListener('keydown', onKeydown);
  }

  function close() {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
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
    // focus trap
    const focusables = panel.querySelectorAll('button, a[href]');
    const first = focusables[0];
    const last = focusables[focusables.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  }

  document.querySelectorAll('.judge').forEach(btn => {
    btn.addEventListener('click', () => open(Number(btn.dataset.judge), btn));
  });
  overlay.querySelectorAll('[data-overlay-close]').forEach(el => el.addEventListener('click', close));
}
