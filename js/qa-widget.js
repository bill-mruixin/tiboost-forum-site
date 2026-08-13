/* ═══════════════════════════════════════════════════════════
   QA 客服彈窗 — API 版
   接後端 /api/session + /api/chat，LLM 無法回應時降級關鍵字
   ═══════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  var API_BASE = window.QA_API_BASE || '';
  var CONTACT = '這個問題超出我能回答的範圍，請來信 yi-ching.pan@tvca.org.tw 或 sophia.hsiao@tvca.org.tw。';

  var state = { busy: false, token: null, qaCache: null, greeted: false };

  /* ---------- DOM ---------- */
  function el(tag, cls, text) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text != null) n.textContent = text;
    return n;
  }

  var fab = el('button', 'qa-fab');
  fab.appendChild(el('i', null, '✦'));
  fab.appendChild(el('span', null, 'QA 小幫手'));
  fab.setAttribute('aria-label', '開啟常見問題小幫手');
  fab.setAttribute('title', 'QA 小幫手');

  var overlay = el('div', 'qa-overlay');
  overlay.hidden = true;
  overlay.setAttribute('role', 'dialog');
  overlay.setAttribute('aria-modal', 'true');
  overlay.setAttribute('aria-label', '常見問題小幫手');

  var backdrop = el('div', 'qa-backdrop');
  var panel = el('div', 'qa-panel');

  var head = el('div', 'qa-head');
  head.appendChild(el('span', 'qa-head-star', '✦'));
  head.appendChild(el('span', 'qa-head-title', 'QA 小幫手'));
  var closeBtn = el('button', 'qa-close', '×');
  closeBtn.setAttribute('aria-label', '關閉');
  head.appendChild(closeBtn);

  var msgs = el('div', 'qa-msgs');
  msgs.setAttribute('aria-live', 'polite');
  var chips = el('div', 'qa-chips');

  var form = el('form', 'qa-form');
  var input = el('input', 'qa-input');
  input.type = 'text';
  input.maxLength = 300;
  input.placeholder = '輸入問題…';
  input.setAttribute('aria-label', '輸入問題');
  var sendBtn = el('button', 'qa-send', '送出');
  sendBtn.type = 'submit';
  form.appendChild(input);
  form.appendChild(sendBtn);

  panel.appendChild(head);
  panel.appendChild(msgs);
  panel.appendChild(chips);
  panel.appendChild(form);
  overlay.appendChild(backdrop);
  overlay.appendChild(panel);

  /* ---------- 訊息與打字機 ---------- */
  function scrollBottom() { msgs.scrollTop = msgs.scrollHeight; }
  function addMsg(cls, text) {
    var m = el('div', 'qa-msg ' + cls, text);
    msgs.appendChild(m); scrollBottom();
    return m;
  }
  function addThinking() {
    var m = el('div', 'qa-msg qa-msg-bot qa-msg-thinking');
    for (var i = 0; i < 3; i++) m.appendChild(el('i', null, '·'));
    msgs.appendChild(m); scrollBottom();
    return m;
  }
  function typeMsg(text, done) {
    var m = el('div', 'qa-msg qa-msg-bot');
    var span = el('span', null, '');
    var caret = el('i', 'qa-caret', '▎');
    m.appendChild(span); m.appendChild(caret);
    msgs.appendChild(m);
    var i = 0;
    var timer = setInterval(function () {
      span.textContent = text.slice(0, ++i);
      scrollBottom();
      if (i >= text.length) {
        clearInterval(timer);
        caret.remove();
        if (done) done();
      }
    }, 18);
  }

  /* ---------- API 呼叫 ---------- */
  function apiPost(path, body) {
    return fetch(API_BASE + path, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-QA-Widget': '1' },
      body: JSON.stringify(body),
    }).then(function (r) {
      if (!r.ok) throw new Error(r.status);
      return r.json();
    });
  }
  function apiGet(path) {
    return fetch(API_BASE + path, {
      headers: { 'X-QA-Widget': '1' },
    }).then(function (r) {
      if (!r.ok) throw new Error(r.status);
      return r.json();
    });
  }

  function getToken() {
    if (state.token) return Promise.resolve(state.token);
    return apiPost('/api/session', {}).then(function (d) {
      state.token = d.token;
      return d.token;
    });
  }

  /* ---------- 本地關鍵字降級 ---------- */
  function loadQaCache() {
    if (state.qaCache) return Promise.resolve(state.qaCache);
    return apiGet('/api/qa').then(function (items) {
      state.qaCache = items;
      return items;
    }).catch(function () {
      state.qaCache = [];
      return [];
    });
  }

  function bigrams(s) {
    var set = {};
    s = s.toLowerCase().replace(/[\s\p{P}]+/gu, '');
    for (var i = 0; i < s.length - 1; i++) set[s.slice(i, i + 2)] = 1;
    return set;
  }
  function localAnswer(q, items) {
    var qb = bigrams(q);
    var scored = items.map(function (item) {
      var score = 0;
      (item.keywords || []).forEach(function (k) {
        if (q.toLowerCase().indexOf(k.toLowerCase()) !== -1) score += 3;
      });
      var tb = bigrams(item.q + (item.keywords || []).join(''));
      for (var g in qb) if (tb[g]) score += 1;
      return { item: item, score: score };
    }).sort(function (a, b) { return b.score - a.score; });
    if (!scored.length || scored[0].score < 2) return CONTACT;
    return scored[0].item.a;
  }

  /* ---------- 問答（API 優先，失敗降級本地） ---------- */
  function ask(question) {
    question = (question || '').trim();
    if (!question || state.busy) return;
    state.busy = true; sendBtn.disabled = true;

    addMsg('qa-msg-user', question);
    var thinking = addThinking();

    getToken().then(function (token) {
      return apiPost('/api/chat', { token: token, question: question });
    }).then(function (res) {
      thinking.remove();
      if (res.mode === 'fallback') {
        return loadQaCache().then(function (items) {
          var ans = localAnswer(question, items);
          typeMsg(ans, finish);
        });
      }
      typeMsg(res.answer, finish);
    }).catch(function () {
      thinking.remove();
      loadQaCache().then(function (items) {
        var ans = localAnswer(question, items);
        typeMsg(ans, finish);
      }).catch(function () {
        typeMsg(CONTACT, finish);
      });
    });

    function finish() {
      state.busy = false;
      sendBtn.disabled = false;
    }
  }

  /* ---------- 開關與焦點 ---------- */
  var lastFocus = null;
  function open() {
    lastFocus = document.activeElement;
    overlay.hidden = false;
    if (!state.greeted) {
      state.greeted = true;
      addMsg('qa-msg-bot', '您好！我是 TiBOOST 創新大步計畫活動小幫手，關於報名、資格、時程、獎項的問題都可以問我 😊');
    }
    input.focus();
  }
  function close() {
    overlay.hidden = true;
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }

  fab.addEventListener('click', open);
  closeBtn.addEventListener('click', close);
  backdrop.addEventListener('click', close);
  document.addEventListener('keydown', function (e) {
    if (overlay.hidden) return;
    if (e.key === 'Escape') { close(); return; }
    if (e.key === 'Tab') {
      var f = panel.querySelectorAll('button, input');
      var first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  });
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var q = input.value;
    input.value = '';
    ask(q);
  });

  /* ---------- 掛載 ---------- */
  function mount() {
    document.body.appendChild(fab);
    document.body.appendChild(overlay);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', mount);
  else mount();
})();
