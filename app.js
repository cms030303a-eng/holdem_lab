/* Holdem Lab — UI (v1.2: modular quizzes + challenge modes) */
(function () {
  'use strict';
  var E = window.Engine;
  var $ = function (id) { return document.getElementById(id); };
  var APP_VER = '1.5';
  var TYPES = ['pot', 'outs', 'pre', 'pos', 'mu'];
  var TYPE_NAME = { pot: '팟 오즈', outs: '아웃츠', pre: '프리플랍', pos: '포지션', mu: '매치업', mix: '전체 섞기' };

  /* =========================================================
     Storage
     ========================================================= */
  var KEY = 'holdemlab.v1';
  var store = (function () {
    var s = null;
    try { s = JSON.parse(localStorage.getItem(KEY)); } catch (e) { s = null; }
    s = s && typeof s === 'object' ? s : {};
    s.stats = s.stats || {};
    TYPES.forEach(function (k) { s.stats[k] = Object.assign({ c: 0, w: 0, streak: 0, best: 0, hist: [] }, s.stats[k] || {}); });
    s.settings = Object.assign({ tol: 2, focus: true, tab: 'pot', chType: 'mix', posKind: 'mix', goal: 30 }, s.settings || {});
    s.days = s.days && typeof s.days === 'object' ? s.days : {};
    s.log = Array.isArray(s.log) ? s.log : [];
    s.notes = Array.isArray(s.notes) ? s.notes : [];
    s.records = s.records && typeof s.records === 'object' ? s.records : {};
    return s;
  })();
  function save() {
    try { localStorage.setItem(KEY, JSON.stringify(store)); }
    catch (e) {
      store.log = store.log.slice(-200); store.notes = store.notes.slice(-20);
      try { localStorage.setItem(KEY, JSON.stringify(store)); } catch (e2) { /* ignore */ }
    }
  }

  function record(tab, ok) {
    var s = store.stats[tab];
    if (ok) s.c++; else s.w++;
    s.streak = ok ? s.streak + 1 : 0;
    s.best = Math.max(s.best, s.streak);
    s.hist.push(ok ? 1 : 0);
    if (s.hist.length > 20) s.hist.shift();
    save(); renderStats(tab);
  }
  function noteId(type, q) {
    var str = JSON.stringify(q, function (k, v) { return k === 'img' || k === 'sim' || k === 'outs' || k === 'source' ? undefined : v; });
    var h = 0; for (var i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) | 0;
    return type + ':' + h;
  }
  function logAnswer(type, q, a, res, ms, mode) {
    store.log.push({ t: type, ok: res.ok ? 1 : 0, ms: Math.round(ms), k: M[type].keys(q, a, res), ts: Date.now(), m: mode });
    if (store.log.length > 600) store.log.splice(0, store.log.length - 600);
    var dk = dayKey(); store.days[dk] = (store.days[dk] || 0) + 1;
    var dks = Object.keys(store.days); if (dks.length > 150) delete store.days[dks[0]];
    var id = noteId(type, q), idx = -1;
    store.notes.forEach(function (n, i) { if (n.id === id) idx = i; });
    if (!res.ok && idx < 0) {
      store.notes.push({ id: id, t: type, q: JSON.parse(JSON.stringify(q)), ts: Date.now() });
      if (store.notes.length > 60) store.notes.shift();
    } else if (res.ok && mode === 'review' && idx >= 0) {
      store.notes.splice(idx, 1);
    }
    save(); renderChAcc(); renderGoal();
  }

  function renderStats(tab) {
    var s = store.stats[tab], tot = s.c + s.w;
    var acc = tot ? Math.round(s.c / tot * 100) : null;
    var el = document.querySelector('[data-stats="' + tab + '"]');
    var hist = '';
    for (var i = 0; i < 20; i++) {
      var h = s.hist[i - (20 - s.hist.length)];
      hist += '<i class="' + (h === 1 ? 'o' : h === 0 ? 'x' : '') + '"></i>';
    }
    el.innerHTML =
      '<div class="stats-grid">' +
      '<div class="stat ok"><div class="k">정답</div><div class="v">' + s.c + '</div></div>' +
      '<div class="stat ng"><div class="k">오답</div><div class="v">' + s.w + '</div></div>' +
      '<div class="stat"><div class="k">정확도</div><div class="v">' + (acc === null ? '–' : acc + '<small>%</small>') + '</div></div>' +
      '<div class="stat"><div class="k">연속·최고</div><div class="v">' + s.streak + '<small>/' + s.best + '</small></div></div>' +
      '</div>' +
      '<div class="stats-foot"><div class="hist">' + hist + '</div><span class="reset-wrap"></span></div>';
    confirmButton(el.querySelector('.reset-wrap'), '기록 초기화', function () {
      store.stats[tab] = { c: 0, w: 0, streak: 0, best: 0, hist: [] }; save(); renderStats(tab);
    });
    var nav = document.querySelector('[data-acc="' + tab + '"]');
    if (nav) nav.textContent = acc === null ? '–' : acc + '% · ' + tot;
  }
  function renderChAcc() {
    var best = 0;
    Object.keys(store.records).forEach(function (k) { if (k.indexOf('survival:') === 0) best = Math.max(best, store.records[k]); });
    var nav = document.querySelector('[data-acc="ch"]');
    if (nav) nav.textContent = store.notes.length ? '오답 ' + store.notes.length : (best ? '최고 ' + best : '–');
  }
  function confirmButton(wrap, label, onYes) {
    function idle() {
      wrap.innerHTML = '<button type="button" class="reset">' + label + '</button>';
      wrap.firstChild.addEventListener('click', function () {
        wrap.innerHTML = '<span class="reset-confirm"><button type="button" class="yes">확인</button><button type="button" class="no">취소</button></span>';
        wrap.querySelector('.yes').addEventListener('click', onYes);
        wrap.querySelector('.no').addEventListener('click', idle);
      });
    }
    idle();
  }

  /* =========================================================
     Deck (Deck of Cards API with local fallback)
     ========================================================= */
  var API_URL = 'https://deckofcardsapi.com/api/deck/new/draw/?count=52';
  var badImg = {};
  var apiCooldownUntil = 0;

  function setSource(src) {
    var el = $('deckSrc');
    el.className = 'deck-src ' + src;
    el.querySelector('span').textContent = src === 'api' ? 'API' : 'LOCAL';
  }
  function fetchWithTimeout(url, ms) {
    return new Promise(function (resolve, reject) {
      var done = false, ctrl = typeof AbortController !== 'undefined' ? new AbortController() : null;
      var t = setTimeout(function () { if (!done) { done = true; if (ctrl) ctrl.abort(); reject(new Error('timeout')); } }, ms);
      fetch(url, { cache: 'no-store', signal: ctrl ? ctrl.signal : undefined }).then(function (r) {
        if (done) return; done = true; clearTimeout(t); resolve(r);
      }, function (e) { if (done) return; done = true; clearTimeout(t); reject(e); });
    });
  }
  function localDeck() { setSource('local'); return { cards: E.shuffledDeck(), source: 'local', img: {} }; }
  function getDeck() {
    if (Date.now() < apiCooldownUntil || navigator.onLine === false) return Promise.resolve(localDeck());
    return fetchWithTimeout(API_URL, 5000).then(function (r) {
      if (!r.ok) throw new Error('http ' + r.status);
      return r.json();
    }).then(function (j) {
      if (!j || !j.success || !j.cards || j.cards.length < 52) throw new Error('bad payload');
      var img = {};
      var cards = j.cards.map(function (c) {
        var n = E.cardFromCode(c.code);
        img[n] = (c.image || (c.images && c.images.png) || '').replace(/^http:/, 'https:');
        return n;
      });
      setSource('api');
      return { cards: cards, source: 'api', img: img };
    }).catch(function () {
      apiCooldownUntil = Date.now() + 60000;
      return localDeck();
    });
  }
  function pickImg(map, cards) { var o = {}; cards.forEach(function (c) { if (map && map[c]) o[c] = map[c]; }); return o; }
  function preload(cards, img) {
    return Promise.all(cards.map(function (c) {
      var url = img && img[c];
      if (!url || badImg[url]) return null;
      return new Promise(function (res) {
        var im = new Image(), t = setTimeout(function () { badImg[url] = 1; res(); }, 4000);
        im.onload = function () { clearTimeout(t); res(); };
        im.onerror = function () { clearTimeout(t); badImg[url] = 1; res(); };
        im.src = url;
      });
    }));
  }

  /* =========================================================
     Small DOM helpers
     ========================================================= */
  function el(tag, cls, html) { var d = document.createElement(tag); if (cls) d.className = cls; if (html != null) d.innerHTML = html; return d; }
  function isRed(c) { var s = E.suitOf(c); return s === 1 || s === 2; }
  function rankTxt(c) { var r = E.RANKS[E.rankOf(c)]; return r === 'T' ? '10' : r; }
  function cssCard(c) {
    var d = el('div', 'card css' + (isRed(c) ? ' red' : ''));
    var sym = E.SUIT_SYM[E.suitOf(c)];
    d.innerHTML = '<span class="cr">' + rankTxt(c) + '</span><span class="cs">' + sym + '</span><span class="cc">' + sym + '</span>';
    return d;
  }
  function cardEl(c, img) {
    var url = img && img[c];
    if (!url || badImg[url]) return cssCard(c);
    var d = el('div', 'card');
    var im = document.createElement('img');
    im.alt = E.labelOf(c);
    im.onerror = function () { badImg[url] = 1; if (d.parentNode) d.parentNode.replaceChild(cssCard(c), d); };
    im.src = url;
    d.appendChild(im);
    return d;
  }
  function cardRow(cls, cards, img, slots) {
    var r = el('div', cls);
    cards.forEach(function (c) { r.appendChild(cardEl(c, img)); });
    (slots || []).forEach(function (s) { r.appendChild(el('div', 'slot', s)); });
    return r;
  }
  function panel(street, parts, note) {
    var p = el('div', 'table-panel');
    p.appendChild(el('div', 'street', street));
    parts.forEach(function (x) { if (x) p.appendChild(x); });
    if (note) p.appendChild(el('div', 'rule-note', note));
    return p;
  }
  function skeleton(root, msg) {
    var g = '<div class="card ghost"></div>';
    root.innerHTML = '<div class="table-panel"><div class="street">' + (msg || '카드 받는 중…') + '</div>' +
      '<div class="row-label">&nbsp;</div><div class="board">' + g + g + g + '<div class="slot"></div><div class="slot"></div></div>' +
      '<div class="row-label">&nbsp;</div><div class="hole">' + g + g + '</div></div>';
  }
  function mc(c, dup) {
    return '<span class="mc' + (isRed(c) ? ' red' : '') + (dup ? ' dup' : '') + '">' + rankTxt(c) + E.SUIT_SYM[E.suitOf(c)] + '</span>';
  }
  function cardsTxt(cards) { return cards.map(function (c) { return rankTxt(c) + E.SUIT_SYM[E.suitOf(c)]; }).join(' '); }
  function sortCards(arr) { return arr.slice().sort(function (a, b) { return (E.suitOf(a) - E.suitOf(b)) || (E.rankOf(b) - E.rankOf(a)); }); }
  function f1(x) { return (Math.round(x * 10) / 10).toFixed(1); }
  function fmtPct(x) { var r = Math.round(x * 10) / 10; return r % 1 === 0 ? r.toFixed(0) : r.toFixed(1); }
  function pick(arr) { return arr[Math.floor(E.rand() * arr.length)]; }
  function fmtTime(ms) {
    var s = ms / 1000, m = Math.floor(s / 60), r = s - m * 60;
    return m + ':' + (r < 10 ? '0' : '') + r.toFixed(1);
  }
  function fmtSec(ms) { return (ms / 1000).toFixed(1) + '초'; }

  /* choice buttons: ctx.instant → answer immediately on tap */
  function choices(opts, cls, ctx) {
    var box = el('div', cls), val = null, locked = false;
    opts.forEach(function (o) {
      var b = el('button', null, o[1]); b.type = 'button'; b.setAttribute('data-v', o[0]);
      b.addEventListener('click', function () {
        if (locked) return;
        val = o[0];
        box.querySelectorAll('button').forEach(function (x) { x.classList.toggle('sel', x === b); });
        if (ctx.instant) ctx.onSubmit(); else ctx.onReady(true);
      });
      box.appendChild(b);
    });
    return {
      el: box,
      val: function () { return val; },
      lock: function (rightVals, chosen) {
        locked = true; box.classList.add('locked');
        box.querySelectorAll('button').forEach(function (x) {
          var v = x.getAttribute('data-v'); x.classList.remove('sel');
          if (rightVals.indexOf(v) >= 0) x.classList.add('right'); else if (v === chosen) x.classList.add('wrong');
        });
      }
    };
  }
  function stepper(min, max, big, onChange) {
    var w = el('div', 'stepper' + (big ? ' big' : ''), '<button type="button" data-d="-1">−</button><output>–</output><button type="button" data-d="1">+</button>');
    var out = w.querySelector('output'), v = null, locked = false;
    w.addEventListener('click', function (e) {
      var b = e.target.closest('button'); if (!b || locked) return;
      var d = +b.getAttribute('data-d');
      v = v === null ? (d > 0 ? 1 : 0) : Math.max(min, Math.min(max, v + d));
      out.textContent = v; if (onChange) onChange(v);
    });
    return { el: w, val: function () { return v; }, lock: function () { locked = true; w.classList.add('locked'); } };
  }
  function step(i, title, body) {
    return '<div class="step"><div class="step-h"><span class="i">' + i + '</span><span class="t">' + title + '</span></div>' + body + '</div>';
  }
  function verdictHtml(res) {
    return '<div class="verdict ' + (res.ok ? 'ok' : 'ng') + '"><span class="res">' + (res.ok ? '정답' : '오답') + '</span>' +
      '<span class="ans">정답 <b>' + res.correctTxt + '</b>' + (res.mineTxt ? ' · 내 답 ' + res.mineTxt : '') + '</span></div>';
  }

  /* =========================================================
     Draw-spot dealer (pot odds + outs)
     ========================================================= */
  function dealDrawSpot(mode, forceStreet) {
    var street = forceStreet || (E.rand() < 0.5 ? 'flop' : 'turn');
    var nb = street === 'flop' ? 3 : 4;
    function scan(d) {
      for (var i = 0; i + 2 + nb <= d.length; i++) {
        var hole = d.slice(i, i + 2), board = d.slice(i + 2, i + 2 + nb);
        var a = E.validDrawSpot(hole, board, mode);
        if (a && a.count <= 4 && E.rand() > (mode === 'pot' ? 0.35 : 0.6)) continue;      // fewer tiny-out spots
        if (a) return { hole: hole, board: board, outs: a };
      }
      return null;
    }
    var attempt = 0;
    function tryOnce() {
      return getDeck().then(function (deck) {
        var r = scan(deck.cards);
        if (r) { r.source = deck.source; r.street = street; r.img = pickImg(deck.img, r.hole.concat(r.board)); return r; }
        if (++attempt < 3 && deck.source === 'api') return tryOnce();
        for (;;) { var d = E.shuffledDeck(); r = scan(d); if (r) { r.source = 'local'; r.street = street; r.img = {}; return r; } }
      });
    }
    return tryOnce().then(function (r) { return preload(r.hole.concat(r.board), r.img).then(function () { return r; }); });
  }
  function streetLabel(street, allIn) {
    return street === 'flop'
      ? 'FLOP · 남은 카드 <b>2장</b>' + (allIn ? ' · 상대 <b>올인</b>' : ' · 리버까지 본다고 가정')
      : 'TURN · 남은 카드 <b>1장</b>';
  }
  function drawPanel(q, allIn, note) {
    return panel(streetLabel(q.street, allIn), [
      el('div', 'row-label', 'BOARD'),
      cardRow('board', q.board, q.img, q.street === 'flop' ? ['TURN', 'RIVER'] : ['RIVER']),
      el('div', 'row-label', 'HERO'),
      cardRow('hole', q.hole, q.img)
    ], note);
  }
  function drawKind(a) { return a.draws.length > 1 ? '복합 드로우' : (a.draws[0] || '기타'); }
  function outsBucket(n) { return n <= 5 ? '아웃 2~5장' : n <= 9 ? '아웃 6~9장' : n <= 14 ? '아웃 10~14장' : '아웃 15장+'; }
  var OUT_RULE = '아웃츠(실전식): 내 홀카드로 <b>플러시·스트레이트·풀하우스, 셋·트리플·투페어, 오버카드→탑페어</b>를 만드는 카드 · 승률 = 아웃츠 <b>×4</b>(2장 남음) / <b>×2</b>(1장 남음)';
  function outsBreakdown(a) {
    var dupSet = {}; a.both.forEach(function (c) { dupSet[c] = 1; });
    var html = '<div class="formula">아웃츠 = <span class="hl">' + a.count + '장</span></div>';
    html += '<div style="margin-top:6px">' + a.draws.map(function (d) { return '<span class="tag">' + d + '</span>'; }).join('') + '</div>';
    html += '<div class="outs-group">';
    var parts = [];
    E.OUT_GROUPS.forEach(function (g) {
      var cs = a.groups[g]; if (!cs.length) return;
      parts.push(cs.length);
      html += '<div class="g">' + g + ' ' + cs.length + '</div><div class="mini-cards">' + sortCards(cs).map(function (c) { return mc(c, g === '플러시' && dupSet[c]); }).join('') + '</div>';
    });
    html += '</div>';
    if (parts.length > 1) html += '<div class="note">합계: ' + parts.join(' + ') + ' = <b>' + a.count + '장</b> (한 카드는 가장 좋은 족보 한 곳에만 셈)</div>';
    if (a.both.length) html += '<div class="note">노란 테두리 <b>' + a.both.length + '장</b>은 스트레이트도 완성하지만 플러시로 한 번만 셉니다.</div>';
    if (a.groups['오버카드→탑페어'].length) html += '<div class="note">오버카드 아웃은 상대가 투페어 이상이면 무의미해서, 실전에선 절반 정도로 할인해 세기도 합니다 (여기선 그대로 셈).</div>';
    return html;
  }
  function equityStepHtml(a, allInFlop) {
    var mult = a.cardsToCome === 2 ? 4 : 2;
    var html = '<div class="formula">' + a.count + ' × ' + mult + ' = <span class="hl">' + a.rulePct + '%</span></div>';
    if (a.cardsToCome === 2) {
      html += '<div class="note">남은 카드 2장' + (allInFlop ? '(상대 올인 → 리버까지 모두 봄)' : '') + ' → <b>×4</b>. ' +
        '정확한 확률: 1 − (' + (a.unseen - a.count) + '/' + a.unseen + ' × ' + (a.unseen - a.count - 1) + '/' + (a.unseen - 1) + ') = <b>' + f1(a.exactPct) + '%</b></div>';
    } else {
      html += '<div class="note">남은 카드 1장 → <b>×2</b>. 정확한 확률: ' + a.count + ' ÷ ' + a.unseen + ' = <b>' + f1(a.exactPct) + '%</b></div>';
    }
    var diff = a.rulePct - a.exactPct;
    if (Math.abs(diff) >= 2) {
      html += '<div class="note">규칙값이 정확한 값보다 <b>' + f1(Math.abs(diff)) + '%p ' + (diff > 0 ? '높음' : '낮음') + '</b>' +
        (diff > 0 && a.cardsToCome === 2 ? ' — 아웃츠가 많을수록 ×4 규칙은 과대평가됩니다. 8아웃 이상이면 “×4 − (아웃츠 − 8)” 보정이 더 가깝습니다.' : '') + '</div>';
    }
    return html;
  }

  /* =========================================================
     Quiz modules
     each: deal() → Promise<q>, render(root,q,ctx) → ctrl{answer(),lock(res,a)},
           judge(q,a) → res, explain(q,a,res) → html, line(q,a,res), summary(q), keys(q,a,res), submit(bool)
     ========================================================= */
  var M = {};

  /* ---------- 01 POT ODDS ---------- */
  function potMoney(a, street) {
    var eq = a.rulePct;
    var target = E.rand() < 0.5 ? 'call' : 'fold';
    var potSize = 10 * Math.round(6 + E.rand() * 44);
    var fracs = street === 'flop' ? [0.2, 0.25, 0.33, 0.5, 0.66, 0.75, 1, 1.25, 1.5, 2, 2.5] : [0.1, 0.15, 0.2, 0.25, 0.33, 0.5, 0.66, 0.75, 1, 1.25, 1.5];
    var cands = fracs.map(function (f) {
      var bet = Math.max(5, 5 * Math.round(potSize * f / 5));
      return { bet: bet, need: bet / (potSize + 2 * bet) * 100 };
    }).filter(function (x) { return Math.abs(eq - x.need) >= 2; });
    var pref = cands.filter(function (x) { return (eq > x.need) === (target === 'call'); });
    var m = pick(pref.length ? pref : cands.length ? cands : [{ bet: Math.round(potSize / 2), need: 25 }]);
    return { pot: potSize, bet: m.bet, need: m.bet / (potSize + 2 * m.bet) * 100 };
  }
  var LAB = { call: '콜', fold: '폴드', open: '오픈' };
  M.pot = {
    submit: false,
    deal: function () { return dealDrawSpot('pot').then(function (q) { q.money = potMoney(q.outs, q.street); return q; }); },
    cards: function (q) { return q.hole.concat(q.board); },
    render: function (root, q, ctx) {
      var m = q.money;
      root.appendChild(drawPanel(q, true, ctx.practice ? OUT_RULE + '<br>가정: 상대는 <b>탑페어</b> — 아웃이 떨어지면 내가 이긴다고 봄' : '가정: 상대 탑페어 · 실전식 아웃츠'));
      root.appendChild(el('div', 'money',
        '<div><div class="k">팟 (베팅 전)</div><div class="v">' + m.pot + '</div><div class="s">&nbsp;</div></div>' +
        '<div><div class="k">상대 베팅</div><div class="v">' + m.bet + '</div><div class="s">팟의 ' + Math.round(m.bet / m.pot * 100) + '%' + (q.street === 'flop' ? ' · 올인' : '') + '</div></div>' +
        '<div><div class="k">내 콜</div><div class="v">' + m.bet + '</div><div class="s">' + (q.street === 'flop' ? '콜하면 리버까지' : '리버 1장') + '</div></div>'));
      var st = null;
      if (ctx.practice) {
        st = stepper(0, 25, false);
        var f = el('div', 'field optional', '<div class="field-label">내가 센 아웃츠 <span class="muted">(선택 · 채점 안 함)</span></div>');
        f.appendChild(st.el); root.appendChild(f);
      }
      var ch = choices([['fold', '폴드'], ['call', '콜']], 'choices two', ctx);
      root.appendChild(ch.el);
      return {
        answer: function () { return ch.val() ? { choice: ch.val(), myOuts: st ? st.val() : null } : null; },
        lock: function (res, a) { ch.lock([res.correct], a.choice); if (st) st.lock(); }
      };
    },
    judge: function (q, a) {
      var correct = q.outs.rulePct > q.money.need ? 'call' : 'fold';
      return { ok: a.choice === correct, correct: correct, correctTxt: LAB[correct], mineTxt: LAB[a.choice] };
    },
    explain: function (q, a, res) {
      var o = q.outs, m = q.money, total = m.pot + 2 * m.bet, eqF = o.rulePct / 100;
      var ev = eqF * (m.pot + m.bet) - (1 - eqF) * m.bet, correct = res.correct;
      var s1 = outsBreakdown(o);
      if (a.myOuts !== null && a.myOuts !== undefined) s1 += '<div class="note">내가 센 아웃츠 <b>' + a.myOuts + '</b> → ' + (a.myOuts === o.count ? '정확' : (a.myOuts > o.count ? '+' : '') + (a.myOuts - o.count) + '장 차이') + '</div>';
      var html = step('01', '아웃츠 세기', s1);
      html += step('02', '승률 근사 (아웃츠 규칙)', equityStepHtml(o, q.street === 'flop'));
      html += step('03', '팟 오즈 = 콜 금액 ÷ 콜한 뒤 전체 팟',
        '<div class="formula">' + m.bet + ' ÷ (' + m.pot + ' + ' + m.bet + ' + ' + m.bet + ')<br>= ' + m.bet + ' ÷ ' + total + ' = <span class="wa">' + f1(m.need) + '%</span></div>' +
        '<div class="note">이 콜이 손익분기가 되려면 최소 <b>' + f1(m.need) + '%</b>는 이겨야 합니다.</div>');
      var e = Math.min(100, o.rulePct), n = m.need;
      html += step('04', '비교 → 결정',
        '<div class="meter"><div class="fill" style="width:' + e + '%"></div><div class="need" style="left:' + n + '%"></div>' +
        '<div class="lab e" style="left:' + Math.max(6, Math.min(94, e)) + '%">승률 ' + o.rulePct + '%</div>' +
        '<div class="lab n" style="left:' + Math.max(6, Math.min(94, n)) + '%;top:auto;bottom:100%;margin:0 0 3px">필요 ' + f1(n) + '%</div></div>' +
        '<div class="formula">' + o.rulePct + '% ' + (correct === 'call' ? '&gt;' : '&lt;') + ' ' + f1(n) + '% → <span class="' + (correct === 'call' ? 'hl' : 'bd') + '">' + LAB[correct] + '</span></div>' +
        '<div class="note">콜 EV ≈ ' + o.rulePct + '% × ' + (m.pot + m.bet) + ' − ' + (100 - o.rulePct) + '% × ' + m.bet + ' = <b>' + (ev >= 0 ? '+' : '') + f1(ev) + '</b> (근사 승률 기준, 칩 단위)</div>' +
        (Math.sign(o.exactPct - n) !== Math.sign(o.rulePct - n) ? '<div class="note">※ 정확한 확률(' + f1(o.exactPct) + '%)로 보면 결론이 달라지는 경계 상황입니다. 채점은 규칙값 기준.</div>' : ''));
      return html;
    },
    line: function (q, a, res) { return '정답 ' + res.correctTxt + ' · 승률 ' + q.outs.rulePct + '% vs 필요 ' + f1(q.money.need) + '%'; },
    summary: function (q) { return (q.street === 'flop' ? '플랍' : '턴') + ' · ' + cardsTxt(q.hole) + ' · ' + q.outs.count + '아웃 · 베팅 ' + Math.round(q.money.bet / q.money.pot * 100) + '%'; },
    keys: function (q, a, res) {
      return [['스트리트', q.street === 'flop' ? '플랍 (×4)' : '턴 (×2)'], ['드로우', drawKind(q.outs)], ['아웃 수', outsBucket(q.outs.count)], ['정답 방향', res.correct === 'call' ? '콜이 정답' : '폴드가 정답']];
    }
  };

  /* ---------- 02 OUTS ---------- */
  M.outs = {
    submit: true,
    deal: function () { return dealDrawSpot('outs'); },
    cards: function (q) { return q.hole.concat(q.board); },
    render: function (root, q, ctx) {
      root.appendChild(drawPanel(q, false, ctx.practice ? OUT_RULE + ' · 입력한 승률은 규칙값과 정확한 확률 중 가까운 쪽과 비교' : null));
      var inputs = el('div', 'inputs');
      var f1el = el('div', 'field', '<div class="field-label">아웃츠 (장)</div>');
      var check = function () { ctx.onReady(st.val() !== null && inp.value !== '' && !isNaN(+inp.value)); };
      var st = stepper(0, 25, true, check);
      f1el.appendChild(st.el);
      var f2el = el('div', 'field', '<div class="field-label">승률 (%)</div><div class="pct-input"><input type="number" inputmode="decimal" min="0" max="100" step="1" placeholder="0"><span>%</span></div>');
      var inp = f2el.querySelector('input');
      inp.addEventListener('input', check);
      inp.addEventListener('keydown', function (e) { if (e.key === 'Enter') { inp.blur(); ctx.onSubmit(); } });
      inputs.appendChild(f1el); inputs.appendChild(f2el);
      root.appendChild(inputs);
      if (ctx.practice) {
        var tol = el('div', 'tol', '<span class="field-label">승률 오차 허용 (%p)</span><div class="chips"></div>');
        var chips = tol.querySelector('.chips');
        [1, 2, 3, 5].forEach(function (t) {
          var b = el('button', t === store.settings.tol ? 'on' : '', '±' + t); b.type = 'button';
          b.addEventListener('click', function () {
            store.settings.tol = t; save();
            chips.querySelectorAll('button').forEach(function (x) { x.classList.toggle('on', x === b); });
          });
          chips.appendChild(b);
        });
        root.appendChild(tol);
      } else {
        root.appendChild(el('div', 'scale-legend', '승률 허용 오차 ±' + store.settings.tol + '%p · 아웃츠는 정확히'));
      }
      return {
        answer: function () { return st.val() !== null && inp.value !== '' ? { n: st.val(), p: +inp.value } : null; },
        lock: function () { st.lock(); inp.disabled = true; }
      };
    },
    judge: function (q, a) {
      var o = q.outs, tol = store.settings.tol;
      var dRule = Math.abs(a.p - o.rulePct), dExact = Math.abs(a.p - o.exactPct);
      var outsOK = a.n === o.count, pctOK = Math.min(dRule, dExact) <= tol + 1e-9;
      return { ok: outsOK && pctOK, outsOK: outsOK, pctOK: pctOK, dRule: dRule, dExact: dExact, tol: tol,
        correctTxt: o.count + '장 · ' + o.rulePct + '%', mineTxt: a.n + '장 · ' + fmtPct(a.p) + '%' };
    },
    explain: function (q, a, res) {
      var o = q.outs;
      var html = step('01', '아웃츠 ' + (res.outsOK ? '✓' : '✗') + ' (입력 ' + a.n + ' / 정답 ' + o.count + ')', outsBreakdown(o));
      var cmp = '<div class="note">입력 <b>' + fmtPct(a.p) + '%</b> → 규칙값과 ' + f1(res.dRule) + '%p, 정확값과 ' + f1(res.dExact) + '%p 차이 · 허용 ±' + res.tol + '%p → <b>' + (res.pctOK ? '통과' : '벗어남') + '</b></div>';
      if (!res.outsOK && res.pctOK) cmp += '<div class="note">승률은 범위 안이지만 아웃츠 수가 달라 오답 처리됩니다.</div>';
      html += step('02', '승률 ' + (res.pctOK ? '✓' : '✗'), equityStepHtml(o, false) + cmp);
      return html;
    },
    line: function (q, a, res) {
      return '정답 ' + q.outs.count + '장 · ' + q.outs.rulePct + '% (정확 ' + f1(q.outs.exactPct) + '%)' + (res.ok ? '' : res.outsOK ? ' · 승률 범위 밖' : ' · 아웃츠 틀림');
    },
    summary: function (q) { return (q.street === 'flop' ? '플랍' : '턴') + ' · ' + cardsTxt(q.hole) + ' | ' + cardsTxt(q.board) + ' · ' + q.outs.count + '아웃'; },
    keys: function (q) { return [['드로우', drawKind(q.outs)], ['아웃 수', outsBucket(q.outs.count)], ['스트리트', q.street === 'flop' ? '플랍 (×4)' : '턴 (×2)']]; }
  };

  /* ---------- 03 PREFLOP ---------- */
  var POS = E.POSITIONS;
  function keepProb(key, pos) {
    var first = E.firstOpenPos(key);
    if (!first) return 0.2;
    var d = Math.abs(POS.indexOf(pos) - POS.indexOf(first));
    return d <= 1 ? 1 : d === 2 ? 0.6 : 0.3;
  }
  function keyDesc(k) { return k.length === 2 ? '포켓 페어' : k[2] === 's' ? '수딧 (같은 무늬)' : '오프수트'; }
  function familyRule(pos, key) {
    var toks = E.RANGE_TEXT[pos].split(',');
    var pair = key.length === 2;
    var sel = toks.filter(function (t) {
      if (pair) return t[0] === t[1];
      return t[0] === key[0] && t[1] !== t[0] && t[2] === key[2];
    });
    var fam = pair ? '포켓 페어' : key[0] + 'x ' + (key[2] === 's' ? '수딧' : '오프수트');
    return { fam: fam, txt: sel.length ? sel.join(', ') : '없음 (모두 폴드)' };
  }
  function rangeGrid(pos, meKey) {
    var R = E.RANGES[pos], html = '<div class="grid13">';
    for (var a = 12; a >= 0; a--) {
      for (var b = 12; b >= 0; b--) {
        var key = a === b ? E.handKey(a, a) : a > b ? E.handKey(a, b, true) : E.handKey(b, a, false);
        html += '<div class="' + (R[key] ? 'in' : '') + (a === b ? ' pr' : '') + (key === meKey ? ' me' : '') + '">' + key + '</div>';
      }
    }
    return html + '</div>';
  }
  M.pre = {
    submit: false,
    cards: function (q) { return q.hole; },
    deal: function () {
      var pos = pick(POS);
      return getDeck().then(function (deck) {
        var d = deck.cards, hole = null;
        for (var i = 0; i + 1 < d.length; i += 2) {
          var h = [d[i], d[i + 1]], key = E.handKeyOf(h[0], h[1]);
          if (!store.settings.focus || E.rand() < keepProb(key, pos)) { hole = h; break; }
        }
        if (!hole) hole = [d[0], d[1]];
        var q = { pos: pos, hole: hole, key: E.handKeyOf(hole[0], hole[1]), source: deck.source, img: pickImg(deck.img, hole) };
        return preload(hole, q.img).then(function () { return q; });
      });
    },
    render: function (root, q, ctx) {
      var idx = POS.indexOf(q.pos);
      var seats = el('div', 'seats', POS.map(function (p, i) {
        return '<div class="seat ' + (i < idx ? 'folded' : i === idx ? 'me' : '') + '">' + p + '<small>' + (i < idx ? 'FOLD' : i === idx ? 'YOU' : '대기') + '</small></div>';
      }).join(''));
      root.appendChild(panel('PREFLOP · 앞에서 모두 폴드 · 100BB', [
        seats, el('div', 'row-label', 'HERO'), cardRow('hole', q.hole, q.img),
        el('div', 'hand-key', q.key + ' <span class="muted">· ' + keyDesc(q.key) + '</span>')
      ]));
      if (ctx.practice) {
        var tg = el('label', 'toggle', '<input type="checkbox"><span>경계 핸드 위주로 출제 <em>(어디서도 안 여는 핸드 출제 빈도 ↓)</em></span>');
        var cb = tg.querySelector('input'); cb.checked = !!store.settings.focus;
        cb.addEventListener('change', function () { store.settings.focus = cb.checked; save(); });
        root.appendChild(tg);
      }
      var ch = choices([['fold', '폴드'], ['open', '오픈']], 'choices two', ctx);
      root.appendChild(ch.el);
      return { answer: function () { return ch.val() ? { choice: ch.val() } : null; }, lock: function (res, a) { ch.lock([res.correct], a.choice); } };
    },
    judge: function (q, a) {
      var correct = E.RANGES[q.pos][q.key] ? 'open' : 'fold';
      return { ok: a.choice === correct, correct: correct, correctTxt: LAB[correct], mineTxt: LAB[a.choice] };
    },
    explain: function (q, a, res) {
      var inRange = res.correct === 'open', first = E.firstOpenPos(q.key), fr = familyRule(q.pos, q.key);
      var html = step('01', '판정',
        '<div class="formula">' + q.key + ' @ ' + q.pos + ' → <span class="' + (inRange ? 'hl' : 'bd') + '">' + (inRange ? '레인지 안 · 오픈' : '레인지 밖 · 폴드') + '</span></div>' +
        '<div class="note">' + q.pos + '에서 <b>' + fr.fam + '</b> 오픈 기준: <b>' + fr.txt + '</b></div>' +
        '<div class="note">' + (first ? '이 핸드를 처음 오픈하는 자리: <b>' + first + '</b>' + (first !== 'BTN' ? ' (그 뒤 자리에서도 모두 오픈)' : '') : '<b>어느 포지션에서도 오픈하지 않는</b> 핸드입니다.') + '</div>');
      html += step('02', '포지션별 같은 핸드', '<div class="pos-strip">' + POS.map(function (p) {
        var y = !!E.RANGES[p][q.key];
        return '<div class="' + (y ? 'y' : 'n') + (p === q.pos ? ' cur' : '') + '">' + p + '<b>' + (y ? '오픈' : '폴드') + '</b><small>' + f1(E.rangePct(p)) + '%</small></div>';
      }).join('') + '</div><div class="note">아래 숫자 = 해당 자리 오픈 비율(전체 1326콤보 중). 뒤로 갈수록 남은 상대가 적어 레인지가 넓어집니다.</div>');
      var combos = 0; Object.keys(E.RANGES[q.pos]).forEach(function (k) { combos += E.combosOf(k); });
      html += step('03', q.pos + ' 오픈 레인지 · ' + f1(E.rangePct(q.pos)) + '% (' + combos + '콤보)',
        rangeGrid(q.pos, q.key) +
        '<div class="note">우상단 = 수딧, 좌하단 = 오프수트, 대각선 = 페어. 노란 테두리가 이번 핸드.</div>' +
        '<div class="note">기준표: 100BB 캐시게임 RFI(앞에서 모두 폴드) 레인지를 단순화한 앱 기준입니다. 솔버·스테이크·레이크에 따라 경계 핸드는 조금씩 달라질 수 있어요.</div>');
      return html;
    },
    line: function (q, a, res) {
      var fr = familyRule(q.pos, q.key);
      return q.key + ' @ ' + q.pos + ' → ' + res.correctTxt + ' · 기준 ' + fr.txt;
    },
    summary: function (q) { return q.pos + ' · ' + q.key + ' (' + cardsTxt(q.hole) + ')'; },
    keys: function (q, a, res) {
      return [['포지션', q.pos], ['정답 방향', res.correct === 'open' ? '오픈이 정답' : '폴드가 정답'], ['핸드 종류', keyDesc(q.key).split(' ')[0]]];
    }
  };

  /* ---------- 04 MATCHUP ---------- */
  var ITER = 100000;
  var T_FLIP = 0.58, T_DOM = 0.70, T_EDGE = 0.015;
  var CHOICE_TXT = { A2: 'A 압도적', A1: 'A 약간 우세', '0': '코인플립', B1: 'B 약간 우세', B2: 'B 압도적' };
  function muAnswer(eqA) {
    var side = eqA >= 0.5 ? 'A' : 'B', fav = Math.max(eqA, 1 - eqA);
    var main = fav < T_FLIP ? '0' : fav < T_DOM ? side + '1' : side + '2';
    var ok = [main];
    if (Math.abs(fav - T_FLIP) < T_EDGE) ok = ['0', side + '1'];
    else if (Math.abs(fav - T_DOM) < T_EDGE) ok = [side + '1', side + '2'];
    return { main: main, accept: ok, fav: fav, side: side };
  }
  function classify(h1, h2) {
    function rs(h) { return [E.rankOf(h[0]), E.rankOf(h[1])].sort(function (x, y) { return y - x; }); }
    var A = rs(h1), B = rs(h2);
    var pA = A[0] === A[1], pB = B[0] === B[1];
    var sA = E.suitOf(h1[0]) === E.suitOf(h1[1]), sB = E.suitOf(h2[0]) === E.suitOf(h2[1]);
    var t, kind, notes = [];
    if (pA && pB) {
      kind = '페어 vs 페어';
      t = A[0] > B[0] ? '오버페어 vs 언더페어 (A가 높은 페어)' : A[0] < B[0] ? '오버페어 vs 언더페어 (B가 높은 페어)' : '같은 페어 — 무승부가 대부분';
      if (A[0] !== B[0]) notes.push('낮은 페어는 사실상 셋(트리플)을 맞추거나 스트레이트·플러시가 나와야 역전합니다.');
    } else if (pA || pB) {
      var P = pA ? A : B, X = pA ? B : A, who = pA ? 'A' : 'B', oth = pA ? 'B' : 'A';
      var overs = X.filter(function (r) { return r > P[0]; }).length, same = X.filter(function (r) { return r === P[0]; }).length;
      if (same) { kind = '페어 vs 같은 랭크'; t = '페어 vs 같은 랭크를 가진 핸드 (' + who + ' 페어가 ' + oth + '의 아웃을 막음)'; notes.push(oth + '는 페어와 같은 랭크 카드가 1장만 남아 그쪽으로는 거의 이기지 못합니다.'); }
      else if (overs === 2) { kind = '페어 vs 오버카드 2장'; t = '페어 vs 두 오버카드 — 대표적인 코인플립 구도'; notes.push(oth + '는 두 카드 중 하나만 페어가 되어도 역전합니다 (아웃 6장 × 보드 5장).'); }
      else if (overs === 1) { kind = '페어 vs 오버1·언더1'; t = '페어 vs 오버카드 1장 + 언더카드 1장'; notes.push(oth + '는 주로 오버카드 3장에 의존합니다.'); }
      else { kind = '페어 vs 언더카드 2장'; t = '페어 vs 언더카드 두 장'; notes.push(oth + '는 한 장이 페어가 되어도 ' + who + '의 페어보다 낮아 크게 불리합니다.'); }
    } else {
      var shared = A.filter(function (r) { return B.indexOf(r) >= 0; }).length;
      if (shared) {
        kind = '도미네이션'; t = '도미네이션 — 같은 랭크를 공유';
        notes.push('공유 카드가 맞으면 둘 다 페어 → 킥커 싸움. 킥커가 낮은 쪽은 자기 킥커를 맞춰야만 앞섭니다.');
      } else if (A[1] > B[0] || B[1] > A[0]) {
        kind = '오버 2장 vs 언더 2장'; t = (A[1] > B[0] ? 'A' : 'B') + '의 두 카드가 모두 높음 (두 오버카드 vs 두 언더카드)';
      } else if ((A[0] > B[0]) === (A[1] > B[1])) {
        kind = '사이에 끼는 구도'; t = '두 카드가 각각 한 단계씩 높음 (사이에 끼는 구도)';
      } else {
        kind = '하이-로 vs 미들 2장'; t = '높은 카드 1장(' + (A[0] > B[0] ? 'A' : 'B') + ') vs 중간 카드 2장';
      }
    }
    if (sA && sB && E.suitOf(h1[0]) === E.suitOf(h2[0])) notes.push('두 핸드가 같은 무늬 수딧 → 플러시가 나와도 높은 쪽이 가져가 서로 상쇄됩니다.');
    else {
      if (sA) notes.push('A는 수딧 → 플러시 가능성만큼 에퀴티가 더해집니다.');
      if (sB) notes.push('B는 수딧 → 플러시 가능성만큼 에퀴티가 더해집니다.');
    }
    [['A', A, pA], ['B', B, pB]].forEach(function (x) {
      var g = x[1][0] - x[1][1];
      if (!x[2] && g >= 1 && g <= 2) notes.push(x[0] + '는 커넥티드(간격 ' + (g - 1) + ') → 스트레이트 가능성이 있습니다.');
    });
    return { type: t, kind: kind, notes: notes };
  }
  function topCats(arr, total) {
    var list = [];
    for (var i = 0; i < 9; i++) if (arr[i]) list.push([i, arr[i]]);
    list.sort(function (x, y) { return y[1] - x[1]; });
    return list.slice(0, 3).map(function (x) { return E.CAT_KO[x[0]] + ' ' + Math.round(x[1] / total * 100) + '%'; }).join(' · ');
  }
  M.mu = {
    submit: false,
    cards: function (q) { return q.A.concat(q.B); },
    deal: function () {
      return getDeck().then(function (deck) {
        var d = deck.cards;
        var q = { A: [d[0], d[1]], B: [d[2], d[3]], source: deck.source, img: pickImg(deck.img, d.slice(0, 4)) };
        var simP = new Promise(function (res) { E.equitySim(q.A, q.B, ITER, null, res); });
        return Promise.all([simP, preload(d.slice(0, 4), q.img)]).then(function (r) {
          var s = r[0];
          q.sim = { win: s.win, tie: s.tie, lose: s.lose, eqA: s.eqA, se: s.se, n: s.n, catA: Array.prototype.slice.call(s.catA), catB: Array.prototype.slice.call(s.catB) };
          return q;
        });
      });
    },
    render: function (root, q, ctx) {
      var vs = el('div', 'vs');
      [['HAND A', q.A], null, ['HAND B', q.B]].forEach(function (x) {
        if (!x) { vs.appendChild(el('div', 'vs-mid', 'VS')); return; }
        var side = el('div', 'vs-side');
        side.appendChild(el('div', 'row-label', x[0]));
        side.appendChild(cardRow('hole', x[1], q.img));
        side.appendChild(el('div', 'hand-key', E.handKeyOf(x[1][0], x[1][1])));
        vs.appendChild(side);
      });
      root.appendChild(panel('PREFLOP 올인 · 보드 5장을 끝까지 볼 때', [vs]));
      var ch = choices([['A2', '<b>A</b>압도적'], ['A1', '<b>A</b>약간 우세'], ['0', '<b>≈</b>코인플립'], ['B1', '<b>B</b>약간 우세'], ['B2', '<b>B</b>압도적']], 'scale', ctx);
      root.appendChild(ch.el);
      root.appendChild(el('div', 'scale-legend', '우세한 쪽 승률: 플립 &lt; 58% ≤ 우세 &lt; 70% ≤ 압도'));
      return { answer: function () { return ch.val() ? { choice: ch.val() } : null; }, lock: function (res, a) { ch.lock(res.accept, a.choice); } };
    },
    judge: function (q, a) {
      var ans = muAnswer(q.sim.eqA);
      return { ok: ans.accept.indexOf(a.choice) >= 0, accept: ans.accept, fav: ans.fav, side: ans.side,
        correctTxt: ans.accept.map(function (v) { return CHOICE_TXT[v]; }).join(' / '), mineTxt: CHOICE_TXT[a.choice] };
    },
    explain: function (q, a, res) {
      var r = q.sim, eqA = r.eqA * 100, eqB = 100 - eqA;
      var w = r.win * 100, t = r.tie * 100, l = r.lose * 100;
      var html = step('01', '실제 승률 (몬테카를로)',
        '<div class="big-eq"><div><div class="k">A · ' + E.handKeyOf(q.A[0], q.A[1]) + '</div><div class="v a">' + f1(eqA) + '%</div></div>' +
        '<div style="text-align:right"><div class="k">B · ' + E.handKeyOf(q.B[0], q.B[1]) + '</div><div class="v b">' + f1(eqB) + '%</div></div></div>' +
        '<div class="stack"><div class="a" style="width:' + w + '%">' + (w > 12 ? 'A ' + f1(w) : '') + '</div><div class="t" style="width:' + t + '%">' + (t > 11 ? '무 ' + f1(t) : '') + '</div><div class="b" style="width:' + l + '%">' + (l > 12 ? 'B ' + f1(l) : '') + '</div></div>' +
        '<div class="stack-legend"><span class="a">A 승 ' + f1(w) + '%</span><span class="muted">무승부 ' + f1(t) + '%</span><span class="b">B 승 ' + f1(l) + '%</span></div>' +
        '<div class="note">승률(에퀴티) = 승 + 무승부 ÷ 2 · 무작위 보드 <b>' + r.n.toLocaleString() + '회</b> 시뮬레이션 · 표준오차 ±' + (r.se * 100).toFixed(2) + '%p</div>');
      var fav = res.fav * 100, pos = function (x) { return (x - 50) / 50 * 100; };
      html += step('02', '구간 판정 — 우세한 쪽(' + res.side + ') ' + f1(fav) + '%',
        '<div class="zones"><div class="z c" style="left:0;width:' + pos(58) + '%"></div><div class="z s" style="left:' + pos(58) + '%;width:' + (pos(70) - pos(58)) + '%"></div><div class="z d" style="left:' + pos(70) + '%;right:0"></div>' +
        '<div class="mk" style="left:calc(' + Math.min(99.5, pos(fav)) + '% - 1px)"></div>' +
        '<div class="zl" style="left:0;transform:none">50</div><div class="zl" style="left:' + pos(58) + '%">58</div><div class="zl" style="left:' + pos(70) + '%">70</div><div class="zl" style="left:auto;right:0;transform:none">100%</div></div>' +
        '<div class="note" style="display:flex;justify-content:space-between"><span>코인플립</span><span>약간 우세</span><span>압도적</span></div>' +
        (res.accept.length > 1 ? '<div class="note">경계(±1.5%p) 근처라 두 답 모두 정답 처리했습니다.</div>' : ''));
      var c = classify(q.A, q.B);
      html += step('03', '매치업 유형', '<div class="formula" style="font-family:var(--sans);font-size:14.5px">' + c.type + '</div>' +
        c.notes.map(function (n) { return '<div class="note">· ' + n + '</div>'; }).join(''));
      html += step('04', '이길 때 완성 족보 (상위 3)',
        '<div class="note"><b style="color:var(--accent)">A</b> ' + (r.win ? topCats(r.catA, Math.round(r.win * r.n)) : '—') + '</div>' +
        '<div class="note"><b style="color:#d8b36a">B</b> ' + (r.lose ? topCats(r.catB, Math.round(r.lose * r.n)) : '—') + '</div>');
      return html;
    },
    line: function (q, a, res) { var e = q.sim.eqA * 100; return 'A ' + f1(e) + '% : B ' + f1(100 - e) + '% → ' + res.correctTxt; },
    summary: function (q) { return E.handKeyOf(q.A[0], q.A[1]) + ' vs ' + E.handKeyOf(q.B[0], q.B[1]); },
    keys: function (q, a, res) {
      var zone = res.fav < T_FLIP ? '코인플립 구간' : res.fav < T_DOM ? '약간 우세 구간' : '압도적 구간';
      return [['매치업 유형', classify(q.A, q.B).kind], ['정답 구간', zone]];
    }
  };

  /* ---------- 04 POSITION (레이즈 대응 · BB 디펜스 · 포스트플랍 포지션 · 개념) ---------- */
  var SEATS = E.SEATS;
  var POS_KINDS = { vs: '레이즈 대응', bb: 'BB 디펜스', post: '포스트플랍 포지션', concept: '포지션 개념' };
  var ACT_TXT = { '3bet': '3벳', call: '콜', fold: '폴드' };
  var POST_ORDER = ['SB', 'BB', 'UTG', 'MP', 'HJ', 'CO', 'BTN'];
  var IMPLIED = { IP: 0.30, OOP: 0.15 };

  function pickKind(k) {
    if (k && k !== 'mix') return k;
    var x = E.rand();
    return x < 0.3 ? 'vs' : x < 0.55 ? 'bb' : x < 0.8 ? 'post' : 'concept';
  }
  function shuffle(a) { a = a.slice(); for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(E.rand() * (i + 1)); var t = a[i]; a[i] = a[j]; a[j] = t; } return a; }

  /* vs open / BB defense */
  function dealVs(kind) {
    var opener = pick(['UTG', 'MP', 'HJ', 'CO', 'BTN']), hero;
    if (kind === 'bb') hero = 'BB';
    else hero = pick(SEATS.slice(SEATS.indexOf(opener) + 1).filter(function (p) { return p !== 'BB'; }));
    return getDeck().then(function (deck) {
      var d = deck.cards, hole = null;
      for (var i = 0; i + 1 < d.length; i += 2) {
        var h = [d[i], d[i + 1]], key = E.handKeyOf(h[0], h[1]);
        if (E.vsOpenAction(opener, hero, key) !== 'fold' || E.rand() < 0.3) { hole = h; break; }
      }
      if (!hole) hole = [d[0], d[1]];
      var key2 = E.handKeyOf(hole[0], hole[1]);
      var q = { kind: kind, opener: opener, hero: hero, hole: hole, key: key2, act: E.vsOpenAction(opener, hero, key2), source: deck.source, img: pickImg(deck.img, hole) };
      return preload(hole, q.img).then(function () { return q; });
    });
  }
  function seatStrip(q) {
    var hi = SEATS.indexOf(q.hero);
    return el('div', 'seats s7', SEATS.map(function (p, i) {
      var cls = '', sub = '';
      if (p === q.opener) { cls = 'opener'; sub = 'RAISE'; }
      else if (p === q.hero) { cls = 'me'; sub = 'YOU'; }
      else if (i < hi) { cls = 'folded'; sub = 'FOLD'; }
      else sub = '대기';
      return '<div class="seat ' + cls + '">' + p + '<small>' + sub + '</small></div>';
    }).join(''));
  }
  function grid3(t, meKey) {
    var html = '<div class="grid13">';
    for (var a = 12; a >= 0; a--) for (var b = 12; b >= 0; b--) {
      var key = a === b ? E.handKey(a, a) : a > b ? E.handKey(a, b, true) : E.handKey(b, a, false);
      html += '<div class="' + (t.r[key] ? 'r' : t.c[key] ? 'c' : '') + (key === meKey ? ' me' : '') + '">' + key + '</div>';
    }
    return html + '</div>';
  }
  function famTokens(text, key) {
    var pair = key.length === 2;
    return text.split(',').filter(function (t) {
      t = t.trim(); if (!t) return false;
      if (pair) return t[0] === t[1];
      return t[0] === key[0] && t[1] !== t[0] && t[2] === key[2];
    }).join(', ');
  }
  function explainVs(q, a, res) {
    var grp = E.vsGroup(q.hero), tk = q.opener + '>' + grp, T = E.VS_OPEN[tk], TX = E.VS_OPEN_TEXT[tk];
    var fam = q.key.length === 2 ? '포켓 페어' : q.key[0] + 'x ' + (q.key[2] === 's' ? '수딧' : '오프수트');
    var html = step('01', '판정',
      '<div class="formula">' + q.key + ' · ' + q.hero + ' vs ' + q.opener + ' 오픈 → <span class="' + (q.act === 'fold' ? 'bd' : q.act === '3bet' ? 'wa' : 'hl') + '">' + ACT_TXT[q.act] + '</span></div>' +
      '<div class="note">' + fam + ' 기준 — 3벳: <b>' + (famTokens(TX.r, q.key) || '없음') + '</b> · 콜: <b>' + (famTokens(TX.c, q.key) || '없음') + '</b></div>');
    var rp = E.setPct(T.r), cp = E.setPct(T.c);
    html += step('02', q.hero + ' vs ' + q.opener + ' 레인지',
      '<div class="legend3"><span class="r">3벳 ' + f1(rp) + '%</span><span class="c">콜 ' + f1(cp) + '%</span><span class="f">폴드 ' + f1(100 - rp - cp) + '%</span></div>' +
      grid3(T, q.key) + '<div class="note">노란 테두리가 이번 핸드. 앱 기준표(100BB, 2.5BB 오픈)이며 실제 솔버 전략은 혼합 빈도가 섞여 경계 핸드가 조금씩 다릅니다.</div>');
    var openPct = E.rangePct(q.opener), pts = [];
    pts.push(q.opener + '의 오픈 레인지는 앱 기준 <b>' + f1(openPct) + '%</b>. 앞자리 오프너일수록 레인지가 강해서 대응 레인지도 좁아집니다.');
    if (grp === 'IP') {
      var u = E.VS_OPEN['UTG>IP'], c = E.VS_OPEN['CO>IP'];
      pts.push(q.hero + '는 ' + q.opener + '보다 뒤라 포스트플랍 내내 <b>IP</b>(나중에 액션). 그래서 3벳뿐 아니라 <b>콜 레인지</b>도 가질 수 있어요. (UTG 오픈 대응 3벳+콜 ' + f1(E.setPct(u.r) + E.setPct(u.c)) + '% → CO 오픈 대응 ' + f1(E.setPct(c.r) + E.setPct(c.c)) + '%)');
      var behind = SEATS.slice(SEATS.indexOf(q.hero) + 1);
      if (q.hero !== 'BTN') pts.push('뒤에 아직 ' + behind.join('·') + '가 남아 있어 스퀴즈를 맞을 수 있어요. BTN보다는 조금 더 타이트하게 가는 게 보통입니다.');
    } else if (grp === 'SB') {
      pts.push('SB는 뒤에 BB가 남아 있고, 플랍부터는 가장 먼저 액션(<b>OOP</b>)합니다. 콜하면 BB의 스퀴즈와 OOP 불리함을 동시에 떠안기 때문에 앱 기준은 <b>3벳 or 폴드</b>(콜 없음).');
    } else {
      pts.push('BB는 이미 1BB를 냈고 프리플랍 마지막 액션. 2.5BB 오픈이면 <b>1.5BB</b>만 더 내고 2.5 + 0.5 + 2.5 = <b>5.5BB</b> 팟을 다툼 → 필요 승률 1.5 ÷ 5.5 = <b>27.3%</b>. 그래서 넓게 디펜스합니다.');
      pts.push('다만 포스트플랍은 OOP라 에퀴티를 다 실현하기 어려워, 연결성·수딧이 없는 약한 오프수트는 버립니다.');
    }
    html += step('03', '포지션 포인트', pts.map(function (t) { return '<div class="note">· ' + t + '</div>'; }).join(''));
    return html;
  }

  /* postflop position + implied odds (turn, one card to come) */
  function dealPost() {
    return dealDrawSpot('post', 'turn').then(function (q) {
      var a = q.outs, eq = a.rulePct / 100;
      var target = E.rand() < 0.5 ? 'call' : 'fold', wantDiff = E.rand() < 0.55, best = null;
      for (var t = 0; t < 120; t++) {
        var P = 10 * Math.round(8 + E.rand() * 27), f = pick([0.5, 0.66, 0.75, 1]), B = Math.max(10, 10 * Math.round(P * f / 10));
        var S = 10 * Math.round(P * (0.6 + E.rand() * 7.4) / 10), pos = E.rand() < 0.5 ? 'IP' : 'OOP';
        var X = Math.round(S * IMPLIED[pos]);
        var ev = eq * (P + B + X) - (1 - eq) * B, evD = eq * (P + B) - (1 - eq) * B;
        var evIP = eq * (P + B + Math.round(S * IMPLIED.IP)) - (1 - eq) * B, evOOP = eq * (P + B + Math.round(S * IMPLIED.OOP)) - (1 - eq) * B;
        var cand = { P: P, B: B, S: S, pos: pos, X: X, ev: ev, evD: evD, need: B / (P + 2 * B) * 100 };
        if (Math.abs(ev) < 0.05 * B) continue;
        if (!best) best = cand;
        var diff = (evIP > 0) !== (evOOP > 0);
        if (wantDiff && !diff) continue;
        if (!wantDiff && (ev > 0) !== (target === 'call')) continue;
        if (evD > 0 && E.rand() < 0.75) continue;
        best = cand; break;
      }
      if (!best) return dealPost();
      q.kind = 'post'; q.post = best;
      return q;
    });
  }
  function postEV(q, pos) {
    var p = q.post, eq = q.outs.rulePct / 100, X = Math.round(p.S * IMPLIED[pos]);
    return { X: X, ev: eq * (p.P + p.B + X) - (1 - eq) * p.B };
  }
  function explainPost(q, a, res) {
    var o = q.outs, p = q.post, eq = o.rulePct / 100;
    var html = step('01', '아웃츠', outsBreakdown(o));
    html += step('02', '승률 (1장 남음 → ×2)', equityStepHtml(o, false));
    html += step('03', '직접 팟 오즈',
      '<div class="formula">' + p.B + ' ÷ (' + p.P + ' + ' + p.B + ' + ' + p.B + ') = <span class="wa">' + f1(p.need) + '%</span></div>' +
      '<div class="note">' + o.rulePct + '% ' + (o.rulePct > p.need ? '&gt;' : '&lt;') + ' ' + f1(p.need) + '% → 직접 오즈만 보면 <b>' + (p.evD > 0 ? '콜' : '폴드') + '</b> (EV ' + (p.evD >= 0 ? '+' : '') + f1(p.evD) + ')</div>');
    var need = p.B * (1 - eq) / eq - (p.P + p.B);
    html += step('04', '임플라이드 오즈 (' + p.pos + ')',
      '<div class="formula">추가 수익 X = ' + p.S + ' × ' + Math.round(IMPLIED[p.pos] * 100) + '% = <span class="hl">' + p.X + '</span></div>' +
      '<div class="formula">EV = ' + o.rulePct + '% × (' + p.P + ' + ' + p.B + ' + ' + p.X + ') − ' + (100 - o.rulePct) + '% × ' + p.B + '<br>= <span class="' + (p.ev > 0 ? 'hl' : 'bd') + '">' + (p.ev >= 0 ? '+' : '') + f1(p.ev) + '</span> → ' + (p.ev > 0 ? '콜' : '폴드') + '</div>' +
      '<div class="note">손익분기에 필요한 추가 수익 = ' + p.B + ' × (1 − ' + eq.toFixed(2) + ') ÷ ' + eq.toFixed(2) + ' − (' + p.P + ' + ' + p.B + ') = <b>' + (need > 0 ? Math.round(need) : '0 (직접 오즈로 충분)') + '</b></div>');
    var ip = postEV(q, 'IP'), oop = postEV(q, 'OOP');
    html += step('05', '포지션이 바뀌면?',
      '<div class="pv"><div class="' + (p.pos === 'IP' ? 'cur' : '') + '"><b>IP</b><span>X ' + ip.X + '</span><span>EV ' + (ip.ev >= 0 ? '+' : '') + f1(ip.ev) + '</span><em class="' + (ip.ev > 0 ? 'y' : 'n') + '">' + (ip.ev > 0 ? '콜' : '폴드') + '</em></div>' +
      '<div class="' + (p.pos === 'OOP' ? 'cur' : '') + '"><b>OOP</b><span>X ' + oop.X + '</span><span>EV ' + (oop.ev >= 0 ? '+' : '') + f1(oop.ev) + '</span><em class="' + (oop.ev > 0 ? 'y' : 'n') + '">' + (oop.ev > 0 ? '콜' : '폴드') + '</em></div></div>' +
      '<div class="note">같은 카드·같은 베팅이라도 IP는 리버에서 상대 액션을 보고 베팅 크기를 정할 수 있어 맞았을 때 더 받아낼 수 있고, OOP는 먼저 액션해야 해서 덜 받아냅니다. 앱은 이를 남은 스택의 <b>30% / 15%</b>로 단순화해 가정했어요.</div>');
    return html;
  }

  /* concept quiz */
  var CONCEPTS = [
    { q: '포스트플랍(플랍 이후)에서 항상 마지막에 액션하는 자리는?', o: ['BTN', 'BB', 'CO', 'SB'], e: '플랍부터는 SB부터 시계방향으로 액션하고 BTN이 마지막입니다. 그래서 BTN이 가장 좋은 자리예요.' },
    { q: '프리플랍에서 아무도 레이즈하지 않았을 때 마지막에 액션하는 자리는?', o: ['BB', 'BTN', 'SB', 'UTG'], e: '프리플랍은 UTG부터 시작해 블라인드가 마지막입니다. 모두 림프·폴드해도 BB는 체크나 레이즈할 선택권(옵션)이 있어요.' },
    { q: 'IP(인 포지션)의 이점이 아닌 것은?', o: ['카드가 더 좋게 들어온다', '상대 액션을 보고 결정할 수 있다', '팟 크기를 조절하기 쉽다', '체크로 무료 카드를 받을 수 있다'], e: '카드 분포는 자리와 무관합니다. IP의 이점은 정보(상대 액션을 먼저 봄)와 컨트롤(팟 크기·무료 카드)에서 나와요.' },
    { q: 'UTG에서 오픈 레인지를 가장 타이트하게 잡는 주된 이유는?', o: ['뒤에 남은 플레이어가 많고, 콜을 받으면 대부분 OOP라서', 'UTG는 블라인드를 내지 않아서', 'UTG는 오픈 금액이 더 커서', 'UTG가 카드를 먼저 받아서'], e: '뒤에 6명이 남아 있으면 누군가 강한 핸드를 들고 있을 가능성이 커지고, 콜을 받으면 포스트플랍에서도 대부분 불리한 자리입니다.' },
    { q: 'BB가 오픈에 대해 넓게 디펜스할 수 있는 이유로 가장 알맞은 것은?', o: ['이미 1BB를 냈고 프리플랍 마지막 액션이라 팟 오즈가 좋다', '포스트플랍에서 IP라서', 'BB 핸드가 평균적으로 더 강해서', 'BB는 레이크를 내지 않아서'], e: '2.5BB 오픈이면 1.5BB만 더 내고 5.5BB 팟을 다투므로 필요 승률이 약 27%입니다. 단 포스트플랍은 OOP예요.' },
    { q: 'SB가 오픈에 대해 콜보다 "3벳 or 폴드"를 선호하는 이유는?', o: ['뒤에 BB가 남아 스퀴즈를 맞을 수 있고, 포스트플랍 내내 OOP라서', 'SB는 콜 금액이 더 비싸서', '규칙상 SB는 콜할 수 없어서', 'SB 3벳은 금액이 더 싸서'], e: 'SB 콜은 BB의 스퀴즈에 노출되고, 팟이 진행되면 항상 먼저 액션해야 합니다. 3벳으로 주도권을 잡거나 접는 쪽이 낫다는 게 일반적인 기준이에요.' },
    { q: '스틸(steal)이란?', o: ['레이트 포지션(CO·BTN·SB)에서 블라인드를 가져오려는 오픈 레이즈', '블라인드가 림프하는 것', '리버에서 하는 블러프', '프리플랍 올인'], e: '뒤에 블라인드만 남은 자리에서 넓게 오픈해 블라인드를 가져오는 플레이입니다.' },
    { q: '스퀴즈(squeeze)란?', o: ['누군가 오픈하고 다른 사람이 콜했을 때 하는 3벳', '블라인드끼리의 대결', '포스트플랍 체크레이즈', '리버 오버벳'], e: '콜러는 강한 핸드를 3벳했을 가능성이 낮아(레인지 캡) 압박이 잘 통하고, 오프너는 뒤의 콜러까지 신경 써야 합니다.' },
    { q: '"콜드 콜(cold call)"의 뜻은?', o: ['아직 팟에 돈을 넣지 않은 상태에서 레이즈를 콜하는 것', '블라인드에서 체크하는 것', '림프한 뒤 레이즈를 콜하는 것', '리버에서 마지막으로 콜하는 것'], e: '블라인드처럼 이미 돈을 넣은 상태가 아니라, 처음부터 레이즈 금액을 통째로 콜하는 것을 말합니다.' },
    { q: 'OOP에서 드로우를 들고 있을 때 불리한 점은?', o: ['무료 카드를 보기 어렵고, 맞아도 추가 수익을 덜 받아낸다', '아웃츠 수가 줄어든다', '드로우가 완성될 확률이 낮아진다', '팟 오즈 공식이 달라진다'], e: '확률 자체는 같지만, 에퀴티를 실현하기 어렵고 임플라이드 오즈가 줄어듭니다.' },
    { q: '블라인드 배틀(SB 오픈, BB 콜)에서 포스트플랍 IP는?', o: ['BB', 'SB', '매 스트리트 번갈아 바뀐다', '둘 다 아니다'], e: '플랍부터는 SB가 먼저 액션하므로 BB가 IP입니다.' },
    { q: 'KTo를 UTG에서는 폴드하고 BTN에서는 오픈하는 이유는?', o: ['BTN은 뒤에 블라인드 2명만 남고 포스트플랍 IP가 보장되어서', 'BTN에서 받은 KTo가 더 강해서', 'UTG는 오픈 금액이 정해져 있어서', 'BTN은 레이크가 없어서'], e: '같은 핸드라도 남은 상대 수와 포지션에 따라 수익성이 달라집니다. 앱 기준표에서 KTo는 CO부터 오픈이에요.' },
    { q: '3벳 블러프로 A5s 같은 핸드를 자주 쓰는 이유는?', o: ['A를 들고 있어 상대 AA·AK 콤보가 줄고, 콜 받아도 휠 스트레이트·넛 플러시 가능성이 있어서', 'A5s가 AK보다 강해서', '상대가 무조건 폴드해서', '포스트플랍에서 항상 IP가 되어서'], e: '블로커 효과와 플레이어빌리티를 함께 가진 핸드라 3벳 블러프 후보로 많이 쓰입니다.' },
    { q: 'IP 플레이어가 상대의 체크에 체크로 따라가면 얻는 것은?', o: ['돈을 더 넣지 않고 다음 카드를 본다', '팟이 두 배가 된다', '상대가 폴드한다', '아웃츠가 늘어난다'], e: '마지막에 액션하는 쪽은 체크-체크로 스트리트를 넘겨 무료 카드를 볼 수 있습니다.' },
    { q: '프리플랍 액션 순서로 맞는 것은?', o: ['UTG → MP → HJ → CO → BTN → SB → BB', 'SB → BB → UTG → MP → HJ → CO → BTN', 'BTN → CO → HJ → MP → UTG → SB → BB', 'UTG → HJ → MP → CO → BTN → SB → BB'], e: '프리플랍은 BB 왼쪽(UTG)부터 시작해 블라인드가 마지막입니다. 플랍부터는 SB부터 시작해요.' },
    { q: '보통 "레이트 포지션"으로 부르지 않는 자리는?', o: ['MP', 'CO', 'BTN'], e: '레이트 포지션은 보통 CO와 BTN을 말합니다. MP는 미들 포지션이에요.' },
    { q: '앞자리(UTG) 오픈에 대한 3벳·콜 레인지를 좁혀야 하는 이유는?', o: ['앞자리 오픈 레인지가 더 강하기 때문', '앞자리 오픈 금액이 더 커서', '앞자리는 블러프를 절대 안 해서', '팟이 작아져서'], e: 'UTG는 가장 타이트하게 오픈하므로, 같은 핸드라도 UTG 상대로는 상대적으로 약해집니다.' }
  ];
  function dealConcept() {
    var r = E.rand(), item;
    if (r < 0.55) {
      var c = CONCEPTS[Math.floor(E.rand() * CONCEPTS.length)];
      item = { q: c.q, opts: c.o.slice(), ans: c.o[0], e: c.e, gen: false };
    } else {
      var g = pick(['postFirst', 'postLast', 'preFirst', 'next']);
      if (g === 'next') {
        var s = pick(SEATS), nx = SEATS[(SEATS.indexOf(s) + 1) % SEATS.length];
        var wrong = shuffle(SEATS.filter(function (p) { return p !== nx && p !== s; })).slice(0, 3);
        item = { q: s + ' 바로 다음(왼쪽) 자리는?', opts: [nx].concat(wrong), ans: nx, e: '테이블 순서: UTG → MP → HJ → CO → BTN → SB → BB → (다시 UTG). ' + s + '의 왼쪽은 ' + nx + '입니다.', gen: true, order: SEATS, hl: [s, nx] };
      } else {
        var pickd = shuffle(SEATS).slice(0, 3);
        var order = g === 'preFirst' ? SEATS : POST_ORDER;
        var sorted = pickd.slice().sort(function (x, y) { return order.indexOf(x) - order.indexOf(y); });
        var ans = g === 'postLast' ? sorted[2] : sorted[0];
        var list = sorted.slice().sort(function (x, y) { return SEATS.indexOf(x) - SEATS.indexOf(y); }).join(', ');
        var qtxt = g === 'preFirst' ? '프리플랍에서 ' + list + ' 중 가장 먼저 액션하는 사람은?'
          : list + ' 셋이 플랍을 봤다. ' + (g === 'postFirst' ? '플랍에서 가장 먼저 액션하는 사람은?' : '가장 마지막에 액션하는(IP) 사람은?');
        item = { q: qtxt, opts: pickd, ans: ans, gen: true, order: order, hl: pickd,
          e: (g === 'preFirst' ? '프리플랍 순서: ' : '플랍 이후 순서: ') + order.join(' → ') + '. 이 셋의 순서는 ' + sorted.join(' → ') + '.' };
      }
    }
    item.opts = shuffle(item.opts);
    item.kind = 'concept';
    item.hole = []; item.img = {}; item.source = 'local';
    return Promise.resolve(item);
  }

  M.pos = {
    submit: false,
    cards: function (q) { return (q.hole || []).concat(q.board || []); },
    deal: function (practice) {
      var k = pickKind(practice ? store.settings.posKind : 'mix');
      return k === 'post' ? dealPost() : k === 'concept' ? dealConcept() : dealVs(k);
    },
    render: function (root, q, ctx) {
      var ch;
      if (q.kind === 'concept') {
        root.appendChild(panel('CONCEPT · 포지션 개념', [el('div', 'concept-q', q.q)]));
        ch = choices(q.opts.map(function (o) { return [o, o]; }), 'choices list', ctx);
      } else if (q.kind === 'post') {
        var p = q.post;
        var pn = drawPanel(q, false, null);
        pn.querySelector('.street').innerHTML = 'TURN · 남은 카드 <b>1장</b> · 당신 <span class="posb ' + p.pos.toLowerCase() + '">' + p.pos + '</span> ' + (p.pos === 'IP' ? '(상대보다 나중에 액션)' : '(상대보다 먼저 액션)');
        root.appendChild(pn);
        root.appendChild(el('div', 'money',
          '<div><div class="k">팟 (베팅 전)</div><div class="v">' + p.P + '</div></div>' +
          '<div><div class="k">상대 베팅</div><div class="v">' + p.B + '</div><div class="s">팟의 ' + Math.round(p.B / p.P * 100) + '%</div></div>' +
          '<div><div class="k">남은 스택</div><div class="v">' + p.S + '</div><div class="s">콜한 뒤</div></div>'));
        root.appendChild(el('div', 'assume', '가정: 상대 탑페어 · 맞으면 리버에서 추가로 받아낼 금액 = 남은 스택 × <b>IP 30%</b> / <b>OOP 15%</b> · 실전식 아웃츠 ×2'));
        ch = choices([['fold', '폴드'], ['call', '콜']], 'choices two', ctx);
      } else {
        var info = el('div', 'hand-key', q.key + ' <span class="muted">· ' + keyDesc(q.key) + '</span>');
        root.appendChild(panel('PREFLOP · ' + q.opener + ' <b>2.5BB 오픈</b> · 100BB', [seatStrip(q), el('div', 'row-label', 'HERO · ' + q.hero), cardRow('hole', q.hole, q.img), info]));
        ch = choices([['fold', '폴드'], ['call', '콜'], ['3bet', '3벳']], 'choices three', ctx);
      }
      root.appendChild(ch.el);
      return { answer: function () { return ch.val() ? { choice: ch.val() } : null; }, lock: function (res, a) { ch.lock([res.correct], a.choice); } };
    },
    judge: function (q, a) {
      var correct = q.kind === 'concept' ? q.ans : q.kind === 'post' ? (q.post.ev > 0 ? 'call' : 'fold') : q.act;
      var lab = function (v) { return q.kind === 'concept' ? v : (ACT_TXT[v] || v); };
      return { ok: a.choice === correct, correct: correct, correctTxt: lab(correct), mineTxt: lab(a.choice) };
    },
    explain: function (q, a, res) {
      if (q.kind === 'post') return explainPost(q, a, res);
      if (q.kind === 'concept') {
        var body = '<div class="note" style="font-size:13.5px;color:var(--text)">' + q.e + '</div>';
        if (q.order) body += '<div class="order">' + q.order.map(function (p, i) { return '<span class="' + (q.hl.indexOf(p) >= 0 ? 'h' : '') + (p === q.ans ? ' a' : '') + '"><small>' + (i + 1) + '</small>' + p + '</span>'; }).join('') + '</div>';
        return step('01', '해설', body);
      }
      return explainVs(q, a, res);
    },
    line: function (q, a, res) {
      if (q.kind === 'concept') return '정답: ' + res.correctTxt;
      if (q.kind === 'post') { var p = q.post; return '정답 ' + res.correctTxt + ' · 직접 ' + q.outs.rulePct + '% vs ' + f1(p.need) + '% · ' + p.pos + ' EV ' + (p.ev >= 0 ? '+' : '') + Math.round(p.ev); }
      return q.key + ' · ' + q.hero + ' vs ' + q.opener + ' → ' + res.correctTxt;
    },
    summary: function (q) {
      if (q.kind === 'concept') return q.q.length > 34 ? q.q.slice(0, 34) + '…' : q.q;
      if (q.kind === 'post') return '턴 ' + q.post.pos + ' · ' + cardsTxt(q.hole) + ' · ' + q.outs.count + '아웃';
      return q.hero + ' vs ' + q.opener + ' · ' + q.key;
    },
    keys: function (q, a, res) {
      var k = [['상황', POS_KINDS[q.kind]]];
      if (q.kind === 'vs' || q.kind === 'bb') {
        k.push(['정답 액션', { '3bet': '3벳이 정답', call: '콜이 정답', fold: '폴드가 정답' }[q.act]]);
        k.push([q.kind === 'bb' ? 'BB가 상대한 오프너' : '내 자리', q.kind === 'bb' ? q.opener : q.hero]);
      } else if (q.kind === 'post') {
        k.push(['포지션', q.post.pos]);
        k.push(['판단 근거', q.post.ev > 0 ? (q.post.evD > 0 ? '직접 오즈로 콜' : '임플라이드로 콜') : '폴드']);
      } else k.push(['문제 종류', q.gen ? '액션 순서' : '개념']);
      return k;
    }
  };

  /* =========================================================
     Practice tabs (01–04)
     ========================================================= */
  function setBtn(btn, mode) {
    btn.classList.toggle('next', mode === 'next');
    btn.textContent = mode === 'next' ? '다음 문제 →' : mode === 'loading' ? '카드 받는 중…' : '정답 확인';
  }
  function showExplain(box, html) {
    box.innerHTML = html; box.hidden = false;
    setTimeout(function () { box.scrollIntoView({ behavior: 'smooth', block: 'start' }); }, 60);
  }
  function Practice(type) {
    var sec = $('tab-' + type), root = sec.querySelector('.qroot'), btn = sec.querySelector('.primary'), ex = sec.querySelector('.explain');
    var phase = 'idle', q = null, ctrl = null, t0 = 0, token = 0;
    function next() {
      var my = ++token;
      phase = 'loading'; btn.disabled = true; setBtn(btn, 'loading'); ex.hidden = true; skeleton(root);
      M[type].deal(true).then(function (qq) {
        if (my !== token) return;
        q = qq; root.innerHTML = '';
        ctrl = M[type].render(root, q, {
          practice: true, instant: false,
          onReady: function (r) { if (phase === 'ask') btn.disabled = !r; },
          onSubmit: function () { if (phase === 'ask' && !btn.disabled) check(); }
        });
        phase = 'ask'; setBtn(btn, 'check'); btn.disabled = true; t0 = Date.now();
      });
    }
    function check() {
      var a = ctrl.answer(); if (!a) return;
      var res = M[type].judge(q, a);
      record(type, res.ok);
      logAnswer(type, q, a, res, Date.now() - t0, 'practice');
      ctrl.lock(res, a);
      showExplain(ex, verdictHtml(res) + M[type].explain(q, a, res) + seeHtml(type, q));
      phase = 'shown'; setBtn(btn, 'next'); btn.disabled = false;
    }
    btn.addEventListener('click', function () { if (phase === 'ask') check(); else if (phase === 'shown') next(); });
    return { start: function () { if (phase === 'idle') next(); }, restart: next };
  }

  /* =========================================================
     05 CHALLENGE
     ========================================================= */
  var MODES = {
    survival: { en: 'SURVIVAL', name: '서바이벌', desc: '틀리면 바로 끝. 몇 문제 연속으로 맞히나', better: 'max', fmt: function (v) { return v + '연속'; } },
    attack: { en: 'TIME ATTACK', name: '타임 어택 60초', desc: '60초 안에 최대한 많이. 오답은 −5초', better: 'max', fmt: function (v) { return v + '문제'; } },
    sprint: { en: 'SPRINT 10', name: '스프린트', desc: '10문제 완주 시간. 오답 1개당 +10초', better: 'min', fmt: function (v) { return fmtTime(v); } },
    review: { en: 'REVIEW', name: '오답 복습', desc: '틀렸던 문제 다시 풀기. 맞히면 노트에서 지워짐' }
  };
  var ATTACK_MS = 60000, ATTACK_PEN = 5000, SPRINT_N = 10, SPRINT_PEN = 10000;
  var run = null;
  var activeTab = 'pot';

  function recKey(mode, type) { return mode + ':' + type; }
  function bestOf(mode, type) { var v = store.records[recKey(mode, type)]; return v === undefined ? null : v; }
  function notesFor(type) { return store.notes.filter(function (n) { return type === 'mix' || n.t === type; }); }

  function renderHome() {
    var type = store.settings.chType;
    var home = $('chHome');
    var chips = ['mix'].concat(TYPES).map(function (t) {
      return '<button type="button" data-t="' + t + '" class="' + (t === type ? 'on' : '') + '">' + TYPE_NAME[t] + '</button>';
    }).join('');
    var today = new Date(); today.setHours(0, 0, 0, 0);
    var tl = store.log.filter(function (e) { return e.ts >= today.getTime(); });
    var tOk = tl.filter(function (e) { return e.ok; }).length;
    var tMs = tl.length ? tl.reduce(function (s, e) { return s + e.ms; }, 0) / tl.length : 0;
    var html = '<div class="today">' +
      '<div><div class="k">오늘 푼 문제</div><div class="v">' + tl.length + '</div></div>' +
      '<div><div class="k">오늘 정확도</div><div class="v">' + (tl.length ? Math.round(tOk / tl.length * 100) + '<small>%</small>' : '–') + '</div></div>' +
      '<div><div class="k">평균 응답</div><div class="v">' + (tl.length ? (tMs / 1000).toFixed(1) + '<small>초</small>' : '–') + '</div></div></div>' +
      '<div class="goal"><div class="gl"></div><div class="gbar"><i></i></div><div class="gs"></div></div>';
    html += '<div class="sec-h"><span>문제 유형</span></div><div class="type-chips">' + chips + '</div>';
    html += '<div class="modes">' + Object.keys(MODES).map(function (k) {
      var m = MODES[k], best, sub;
      if (k === 'review') { var n = notesFor(type).length; best = n + '문제'; sub = '남은 오답'; }
      else { var b = bestOf(k, type); best = b === null ? '—' : m.fmt(b); sub = '최고 기록'; }
      var dis = k === 'review' && !notesFor(type).length;
      return '<button type="button" class="mode" data-mode="' + k + '"' + (dis ? ' disabled' : '') + '><span class="en">' + m.en + '</span><span class="nm">' + m.name + '</span><span class="ds">' + m.desc + '</span><span class="best"><small>' + sub + '</small>' + best + '</span></button>';
    }).join('') + '</div>';

    // records table
    html += '<div class="sec-h"><span>최고 기록</span></div><div class="rec"><div class="h"></div><div class="h">서바이벌</div><div class="h">타임어택</div><div class="h">스프린트</div>' +
      ['mix'].concat(TYPES).map(function (t) {
        return '<div class="r' + (t === type ? ' cur' : '') + '">' + TYPE_NAME[t] + '</div>' + ['survival', 'attack', 'sprint'].map(function (m) {
          var v = bestOf(m, t); return '<div class="' + (t === type ? 'cur' : '') + '">' + (v === null ? '<span class="faint">—</span>' : MODES[m].fmt(v)) + '</div>';
        }).join('');
      }).join('') + '</div>';

    html += '<div class="sec-h"><span>약점 분석</span><span class="faint">최근 ' + store.log.length + '문제 · 연습+챌린지</span></div>' + analysisHtml(type);
    html += '<div class="danger-row"><span class="wrap-a"></span><span class="wrap-b"></span></div>';
    home.innerHTML = html;
    renderGoal();

    home.querySelectorAll('.type-chips button').forEach(function (b) {
      b.addEventListener('click', function () { store.settings.chType = b.getAttribute('data-t'); save(); renderHome(); });
    });
    home.querySelectorAll('.mode').forEach(function (b) {
      b.addEventListener('click', function () { startRun(b.getAttribute('data-mode'), store.settings.chType); });
    });
    confirmButton(home.querySelector('.wrap-a'), '분석 기록 지우기', function () { store.log = []; save(); renderHome(); });
    confirmButton(home.querySelector('.wrap-b'), '오답 노트 비우기', function () { store.notes = []; save(); renderChAcc(); renderHome(); });
  }

  function analysisHtml(type) {
    var types = type === 'mix' ? TYPES : [type];
    var out = '';
    types.forEach(function (t) {
      var L = store.log.filter(function (e) { return e.t === t; });
      if (!L.length) { out += '<div class="an-card"><div class="an-h"><b>' + TYPE_NAME[t] + '</b><span class="faint">아직 기록 없음</span></div></div>'; return; }
      var ok = L.filter(function (e) { return e.ok; }).length;
      var avg = L.reduce(function (s, e) { return s + e.ms; }, 0) / L.length;
      var groups = {}, order = [];
      L.forEach(function (e) {
        (e.k || []).forEach(function (gk) {
          var g = gk[0], k = gk[1];
          if (!groups[g]) { groups[g] = {}; order.push(g); }
          var c = groups[g][k] || (groups[g][k] = { n: 0, ok: 0, ms: 0 });
          c.n++; c.ok += e.ok; c.ms += e.ms;
        });
      });
      var html = '<div class="an-card"><div class="an-h"><b>' + TYPE_NAME[t] + '</b><span>' + L.length + '문제 · ' + Math.round(ok / L.length * 100) + '% · 평균 ' + (avg / 1000).toFixed(1) + '초</span></div>';
      var weakest = null;
      order.forEach(function (g) {
        var rows = Object.keys(groups[g]).map(function (k) { var c = groups[g][k]; return { k: k, n: c.n, acc: c.ok / c.n, ms: c.ms / c.n }; });
        rows.sort(function (x, y) { return x.acc - y.acc || y.n - x.n; });
        html += '<div class="an-g">' + g + '</div>';
        rows.forEach(function (r) {
          var p = Math.round(r.acc * 100), cls = p < 60 ? 'lo' : p < 80 ? 'mid' : '';
          html += '<div class="an-row"><span class="lb">' + r.k + '</span><span class="an-bar ' + cls + '"><i style="width:' + p + '%"></i></span><span class="pc">' + p + '%<small> ' + r.n + '</small></span></div>';
          if (r.n >= 4 && g !== '정답 방향' && (!weakest || r.acc < weakest.acc)) weakest = { g: g, k: r.k, acc: r.acc, n: r.n };
        });
      });
      var ins = [];
      if (weakest && weakest.acc < 0.85) ins.push('가장 약한 상황: <b>' + weakest.k + '</b> (' + weakest.g + ') — 정확도 ' + Math.round(weakest.acc * 100) + '%, ' + weakest.n + '문제');
      var dir = groups['정답 방향'];
      if (dir) {
        var pairs = t === 'pot' ? ['콜이 정답', '폴드가 정답'] : t === 'pre' ? ['오픈이 정답', '폴드가 정답'] : null;
        if (pairs && dir[pairs[0]] && dir[pairs[1]] && dir[pairs[0]].n >= 4 && dir[pairs[1]].n >= 4) {
          var a0 = dir[pairs[0]].ok / dir[pairs[0]].n, a1 = dir[pairs[1]].ok / dir[pairs[1]].n;
          if (Math.abs(a0 - a1) >= 0.15) {
            if (t === 'pot') ins.push(a0 < a1 ? '콜해야 할 때 폴드하는 경향 — 드로우 승률을 낮게 보거나 필요 승률을 높게 계산하고 있을 수 있어요.' : '폴드해야 할 때 콜하는 경향 — 팟 오즈 분모에 내 콜 금액까지 넣었는지 확인해 보세요.');
            else ins.push(a0 < a1 ? '오픈해야 할 핸드를 버리는 경향 — 레인지를 실제보다 타이트하게 잡고 있어요.' : '폴드해야 할 핸드를 여는 경향 — 레인지를 실제보다 루즈하게 잡고 있어요.');
          }
        }
      }
      if (L.length < 10) ins.push('10문제 이상 쌓이면 분석이 더 믿을 만해집니다.');
      html += ins.map(function (s) { return '<div class="insight">' + s + '</div>'; }).join('');
      out += html + '</div>';
    });
    return out;
  }

  /* ---------- run ---------- */
  function pickType(type) { return type === 'mix' ? pick(TYPES) : type; }
  function startRun(mode, type) {
    var queue = null;
    if (mode === 'review') {
      queue = notesFor(type).slice();
      for (var i = queue.length - 1; i > 0; i--) { var j = Math.floor(E.rand() * (i + 1)); var tmp = queue[i]; queue[i] = queue[j]; queue[j] = tmp; }
      if (!queue.length) return;
    }
    run = { mode: mode, type: type, items: [], score: 0, wrong: 0, active: 0, pen: 0, phase: 'loading', queue: queue, total: queue ? queue.length : 0, nextP: null, last: performance.now(), quitArm: false };
    $('chHome').hidden = true; $('chEnd').hidden = true; $('chRun').hidden = false;
    window.scrollTo(0, 0);
    prefetch(); nextQ();
  }
  function prefetch() {
    var r = run;
    if (r.mode === 'review') {
      var n = r.queue.shift();
      if (!n) { r.nextP = null; return; }
      var q = JSON.parse(JSON.stringify(n.q));
      r.nextP = preload(M[n.t].cards(q), q.img).then(function () { return { t: n.t, q: q }; });
      return;
    }
    var t = pickType(r.type);
    r.nextP = M[t].deal().then(function (q) { return { t: t, q: q }; });
  }
  function runBar() {
    var r = run, m = MODES[r.mode], big = '', sub = '';
    if (r.mode === 'attack') { var left = Math.max(0, ATTACK_MS - r.active - r.pen); big = (left / 1000).toFixed(1); sub = '정답 ' + r.score + ' · 오답 ' + r.wrong; }
    else if (r.mode === 'sprint') { big = fmtTime(r.active + r.pen); sub = Math.min(r.items.length + (r.phase === 'answer' ? 1 : 0), SPRINT_N) + ' / ' + SPRINT_N + (r.wrong ? ' · 오답 ' + r.wrong : ''); }
    else if (r.mode === 'survival') { big = r.score; sub = '연속 정답'; }
    else { big = r.items.length + ' / ' + r.total; sub = '맞힘 ' + r.score; }
    return { big: big, sub: sub, name: m.en, type: TYPE_NAME[r.type] };
  }
  function drawRunBar() {
    var r = run; if (!r) return;
    var b = runBar(), box = $('chRun').querySelector('.runbar');
    if (!box) return;
    box.querySelector('.rb-big').textContent = b.big;
    box.querySelector('.rb-sub').textContent = b.sub;
    var dr = $('chRun').querySelector('.drain i');
    if (dr) {
      var left = Math.max(0, ATTACK_MS - r.active - r.pen) / ATTACK_MS;
      dr.style.width = (left * 100) + '%';
      dr.parentNode.classList.toggle('low', left < 0.2);
    }
  }
  function runShell() {
    var b = runBar();
    $('chRun').innerHTML =
      '<div class="runbar"><button type="button" class="quit">✕ 그만</button>' +
      '<div class="rb-mid"><div class="rb-mode">' + b.name + '</div><div class="rb-type">' + b.type + '</div></div>' +
      '<div class="rb-right"><div class="rb-big">' + b.big + '</div><div class="rb-sub">' + b.sub + '</div></div></div>' +
      (run.mode === 'attack' ? '<div class="drain"><i></i></div>' : '') +
      '<div class="run-q"></div><button type="button" class="primary run-submit" hidden disabled>제출</button>';
    var quit = $('chRun').querySelector('.quit');
    quit.addEventListener('click', function () {
      if (!run) return;
      if (!run.quitArm) { run.quitArm = true; quit.textContent = '정말 그만?'; quit.classList.add('arm'); setTimeout(function () { if (run) { run.quitArm = false; quit.textContent = '✕ 그만'; quit.classList.remove('arm'); } }, 2500); return; }
      abortRun();
    });
    drawRunBar();
  }
  function nextQ() {
    var r = run;
    r.phase = 'loading';
    runShell();
    var qroot = $('chRun').querySelector('.run-q');
    skeleton(qroot, '다음 문제 준비 중…');
    var p = r.nextP;
    if (!p) { finishRun(); return; }
    prefetch();
    p.then(function (x) {
      if (run !== r || r.phase === 'over') return;
      r.cur = x; qroot.innerHTML = '';
      var sub = $('chRun').querySelector('.run-submit');
      r.ctrl = M[x.t].render(qroot, x.q, {
        practice: false, instant: !M[x.t].submit,
        onReady: function (ok) { sub.disabled = !ok; },
        onSubmit: function () { answerRun(); }
      });
      if (M[x.t].submit) { sub.hidden = false; sub.disabled = true; sub.addEventListener('click', answerRun); }
      if (r.type === 'mix') qroot.firstChild.querySelector('.street').insertAdjacentHTML('afterbegin', '<span class="qtype">' + TYPE_NAME[x.t] + '</span>');
      r.phase = 'answer'; r.t0 = performance.now(); r.last = performance.now();
      drawRunBar();
    });
  }
  function answerRun() {
    var r = run;
    if (!r || r.phase !== 'answer') return;
    var x = r.cur, a = r.ctrl.answer(); if (!a) return;
    var res = M[x.t].judge(x.q, a);
    var ms = performance.now() - r.t0;
    r.phase = 'feedback';
    logAnswer(x.t, x.q, a, res, ms, r.mode);
    r.ctrl.lock(res, a);
    r.items.push({ t: x.t, q: x.q, a: a, res: res, ms: ms });
    if (res.ok) r.score++;
    else {
      r.wrong++;
      if (r.mode === 'attack') r.pen += ATTACK_PEN;
      if (r.mode === 'sprint') r.pen += SPRINT_PEN;
    }
    var sub = $('chRun').querySelector('.run-submit'); if (sub) sub.disabled = true;
    drawRunBar();
    var penTxt = !res.ok && r.mode === 'attack' ? ' −5초' : !res.ok && r.mode === 'sprint' ? ' +10초' : '';
    var over = (r.mode === 'survival' && !res.ok) ||
      (r.mode === 'attack' && r.active + r.pen >= ATTACK_MS) ||
      (r.mode === 'sprint' && r.items.length >= SPRINT_N) ||
      (r.mode === 'review' && !r.nextP);
    showFb(res.ok, M[x.t].line(x.q, a, res), penTxt, res.ok ? 650 : 1700, function () {
      if (run !== r) return;
      if (over) finishRun(); else nextQ();
    });
  }
  var fbTimer = null, fbDone = null;
  function showFb(ok, line, pen, ms, done) {
    var fb = $('fb');
    fb.className = 'fb ' + (ok ? 'ok' : 'ng');
    fb.innerHTML = '<b>' + (ok ? '✓ 정답' : '✗ 오답') + (pen ? '<em>' + pen + '</em>' : '') + '</b><span>' + line + '</span><i>탭하여 계속</i>';
    fb.hidden = false;
    clearTimeout(fbTimer);
    fbDone = function () { fb.hidden = true; clearTimeout(fbTimer); var d = done; fbDone = null; d(); };
    fbTimer = setTimeout(function () { if (fbDone) fbDone(); }, ms);
  }
  $('fb').addEventListener('click', function () { if (fbDone) fbDone(); });
  function hideFb() { $('fb').hidden = true; clearTimeout(fbTimer); fbDone = null; }

  setInterval(function () {
    var r = run, now = performance.now();
    if (!r) return;
    var d = Math.min(now - r.last, 250); r.last = now;
    if (r.phase !== 'answer' || activeTab !== 'ch' || document.hidden) return;
    r.active += d;
    drawRunBar();
    if (r.mode === 'attack' && r.active + r.pen >= ATTACK_MS) { r.phase = 'over'; finishRun(); }
  }, 100);

  function abortRun() { hideFb(); run = null; $('chRun').hidden = true; $('chEnd').hidden = true; $('chHome').hidden = false; renderHome(); window.scrollTo(0, 0); }

  function finishRun() {
    var r = run; if (!r) return;
    hideFb();
    r.phase = 'over';
    var m = MODES[r.mode], value = null, isNew = false, prev = null;
    if (r.mode === 'survival' || r.mode === 'attack') value = r.score;
    if (r.mode === 'sprint') value = r.items.length >= SPRINT_N ? Math.round(r.active + r.pen) : null;
    if (value !== null && r.mode !== 'review') {
      var k = recKey(r.mode, r.type); prev = bestOf(r.mode, r.type);
      if (prev === null || (m.better === 'max' ? value > prev : value < prev)) {
        if (!(m.better === 'max' && value === 0)) { store.records[k] = value; isNew = true; save(); }
      }
    }
    renderChAcc();
    var n = r.items.length, ok = r.score;
    var avg = n ? r.items.reduce(function (s, it) { return s + it.ms; }, 0) / n : 0;
    var bigTxt = r.mode === 'sprint' ? (value === null ? '미완주' : fmtTime(value)) : r.mode === 'review' ? ok + ' / ' + n : String(value);
    var unit = r.mode === 'survival' ? '연속 정답' : r.mode === 'attack' ? '문제 정답 (60초)' : r.mode === 'sprint' ? (r.pen ? '순수 ' + fmtTime(r.active) + ' + 페널티 ' + (r.pen / 1000) + '초' : '페널티 없음') : '복습 정답 · 남은 오답 ' + notesFor(r.type).length;
    var html = '<div class="end-hero"><div class="k">' + m.en + ' · ' + TYPE_NAME[r.type] + '</div><div class="v">' + bigTxt + '</div><div class="u">' + unit + '</div>' +
      (isNew ? '<span class="badge-new">신기록</span>' : prev !== null && value !== null ? '<div class="end-best">최고 기록 ' + m.fmt(prev) + '</div>' : '') + '</div>';
    html += '<div class="today"><div><div class="k">정답 / 오답</div><div class="v">' + ok + '<small> / ' + (n - ok) + '</small></div></div>' +
      '<div><div class="k">정확도</div><div class="v">' + (n ? Math.round(ok / n * 100) + '<small>%</small>' : '–') + '</div></div>' +
      '<div><div class="k">평균 응답</div><div class="v">' + (n ? (avg / 1000).toFixed(1) + '<small>초</small>' : '–') + '</div></div></div>';
    var last = r.items[n - 1];
    if (r.mode === 'survival' && last && !last.res.ok) {
      html += '<div class="sec-h"><span>여기서 끝난 문제 — ' + TYPE_NAME[last.t] + '</span></div><div class="explain">' + verdictHtml(last.res) + M[last.t].explain(last.q, last.a, last.res) + seeHtml(last.t, last.q) + '</div>';
    }
    html += '<div class="btn-row"><button type="button" class="primary again">다시 하기</button><button type="button" class="ghost-btn home">모드 선택</button></div>';
    if (n) {
      html += '<div class="sec-h"><span>문제별 리뷰</span><span class="faint">탭하면 해설</span></div><div class="rv">' + r.items.map(function (it, i) {
        return '<div class="rv-row" data-i="' + i + '"><span class="ix">' + (i + 1) + '</span><span class="ds"><b>' + TYPE_NAME[it.t] + '</b> ' + M[it.t].summary(it.q) + '</span><span class="' + (it.res.ok ? 'ok' : 'ng') + '">' + (it.res.ok ? '✓' : '✗') + ' <small>' + fmtSec(it.ms) + '</small></span></div><div class="rv-detail" hidden></div>';
      }).join('') + '</div>';
    }
    var end = $('chEnd');
    end.innerHTML = html;
    $('chRun').hidden = true; end.hidden = false; window.scrollTo(0, 0);
    end.querySelector('.again').addEventListener('click', function () {
      if (r.mode === 'review' && !notesFor(r.type).length) { abortRun(); return; }
      startRun(r.mode, r.type);
    });
    end.querySelector('.home').addEventListener('click', abortRun);
    end.querySelectorAll('.rv-row').forEach(function (row) {
      row.addEventListener('click', function () {
        var it = r.items[+row.getAttribute('data-i')], det = row.nextSibling;
        if (det.hidden && !det.innerHTML) det.innerHTML = '<div class="rv-pad">' + verdictHtml(it.res) + M[it.t].explain(it.q, it.a, it.res) + seeHtml(it.t, it.q) + '</div>';
        det.hidden = !det.hidden; row.classList.toggle('open', !det.hidden);
      });
    });
    run = null;
    lastEndType = r.type;
  }
  var lastEndType = null;

  /* =========================================================
     GUIDE (용어 · 공식 · 계산기 · 참고표 · 데이터)
     ========================================================= */
  var G = window.GUIDE;
  var TERM = {}; G.terms.forEach(function (t) { TERM[t.id] = t; });
  var SEE = {
    pot: ['potodds', 'rule24', 'ev', 'dirty'], outs: ['outs', 'rule24', 'dirty', 'backdoor'], pre: ['rfi', 'range', 'steal', 'ipoop'],
    vs: ['3bet', 'coldcall', 'squeeze', 'ipoop'], bb: ['potodds', 'eqr', 'ipoop'], post: ['implied', 'ipoop', 'eqr'], concept: ['ipoop', 'steal', 'squeeze'],
    mu: ['equity', 'domination', 'coinflip']
  };
  function seeHtml(type, q) {
    var ids = SEE[type === 'pos' ? q.kind : type] || [];
    if (!ids.length) return '';
    return '<div class="see"><span>관련 개념</span>' + ids.map(function (id) { return '<button type="button" data-term="' + id + '">' + TERM[id].t.split(' (')[0] + '</button>'; }).join('') + '</div>';
  }
  function C2(n, k) { if (k < 0 || k > n) return 0; var r = 1; for (var i = 1; i <= k; i++) r = r * (n - k + i) / i; return r; }
  function pct(x, d) { return (x * 100).toFixed(d === undefined ? 1 : d) + '%'; }
  var guideBuilt = false, guideCalc = { pot: 100, bet: 50, stack: 400, outs: 9, street: 'flop' };
  var SECS = [['terms', '용어'], ['formulas', '공식'], ['calc', '계산기'], ['equity', '에퀴티 계산'], ['outs', '아웃츠 표'], ['prob', '확률'], ['seats', '포지션'], ['ranges', '레인지 표'], ['mu', '매치업'], ['rules', '앱 기준'], ['data', '데이터']];

  function buildGuide() {
    var g = $('guide');
    var h = '<div class="g-top"><div class="g-search"><input id="gq" type="search" placeholder="용어·공식 검색 (예: 팟 오즈, MDF, 셋)"><button type="button" id="gqx" hidden>✕</button></div>' +
      '<div class="g-chips">' + SECS.map(function (s) { return '<button type="button" data-sec="' + s[0] + '">' + s[1] + '</button>'; }).join('') + '</div></div>';
    h += '<div id="gEmpty" class="g-empty" hidden>검색 결과가 없어요.</div>';

    // terms
    h += '<section class="g-sec" id="g-terms"><h2>용어 사전 <small>' + G.terms.length + '개</small></h2>';
    G.cats.forEach(function (c) {
      h += '<div class="g-cat" data-cat="' + c + '">' + c + '</div>';
      G.terms.filter(function (t) { return t.c === c; }).forEach(function (t) {
        h += '<div class="term" id="term-' + t.id + '" data-s="' + (t.t + ' ' + t.en + ' ' + t.d).toLowerCase() + '"><div class="tt"><b>' + t.t + '</b><span>' + t.en + '</span></div><p>' + t.d + '</p>' +
          (t.ex ? '<div class="tex">예) ' + t.ex + '</div>' : '') + (t.f ? '<button type="button" class="tlink" data-formula="' + t.f + '">공식 보기 →</button>' : '') + '</div>';
      });
    });
    h += '</section>';

    // formulas
    h += '<section class="g-sec" id="g-formulas"><h2>공식</h2>' + G.formulas.map(function (f) {
      return '<div class="fcard" id="f-' + f.id + '" data-s="' + (f.t + ' ' + f.f + ' ' + f.n).toLowerCase() + '"><div class="ft">' + f.t + '</div><div class="ff">' + f.f + '</div><div class="fex">예) ' + f.ex + '</div><p>' + f.n + '</p></div>';
    }).join('') + '</section>';

    // calculators
    h += '<section class="g-sec" id="g-calc"><h2>팟 오즈 · 아웃츠 계산기</h2>' +
      '<div class="calc"><div class="cin"><label>팟 (베팅 전)<input type="number" inputmode="decimal" id="cPot"></label><label>상대 베팅<input type="number" inputmode="decimal" id="cBet"></label><label>유효 스택 (콜 후)<input type="number" inputmode="decimal" id="cStack"></label></div><div class="cout" id="cOut1"></div></div>' +
      '<div class="calc"><div class="cin2"><span class="field-label">아웃츠</span><div class="stepper" id="cOutsSt"><button type="button" data-d="-1">−</button><output id="cOuts"></output><button type="button" data-d="1">+</button></div>' +
      '<div class="seg" id="cStreet"><button type="button" data-v="flop">플랍 (2장)</button><button type="button" data-v="turn">턴 (1장)</button></div></div><div class="cout" id="cOut2"></div></div></section>';

    // equity calculator
    h += '<section class="g-sec" id="g-equity"><h2>에퀴티 계산기 <small>핸드 vs 핸드</small></h2><div class="calc">' +
      '<div class="eslots" id="eSlots"></div><div class="epick" id="ePick"></div>' +
      '<div class="btn-row"><button type="button" class="primary" id="eRun">계산</button><button type="button" class="ghost-btn" id="eClear">초기화</button></div><div id="eOut"></div>' +
      '<div class="note">보드 0장: 몬테카를로 100,000회 · 1~2장: 몬테카를로 · 3장 이상: 남은 카드를 전부 계산(정확값)</div></div></section>';

    // outs table
    var rows = [[2, '포켓페어 → 셋'], [3, '오버카드 1장'], [4, '거트샷 · 투페어 → 풀하우스'], [5, '원페어 → 투페어·트리플'], [6, '오버카드 2장'], [7, '셋 → 풀하우스·포카드 (플랍)'], [8, '양방 스트레이트 · 더블 거트샷'], [9, '플러시 드로우'], [10, '거트샷 + 오버카드 2장'], [12, '플러시 + 거트샷'], [15, '플러시 + 양방 · 플러시 + 오버카드 2장']];
    h += '<section class="g-sec" id="g-outs"><h2>아웃츠 표</h2><div class="otable"><div class="oh">아웃</div><div class="oh">대표 상황</div><div class="oh">턴→리버<br><small>×2 / 정확</small></div><div class="oh">플랍 올인<br><small>×4 / 정확</small></div>' +
      rows.map(function (r) {
        var n = r[0], t1 = n / 46, t2 = 1 - (47 - n) / 47 * (46 - n) / 46;
        return '<div class="on">' + n + '</div><div class="od">' + r[1] + '</div><div class="ov">' + (n * 2) + ' / ' + pct(t1) + '</div><div class="ov">' + (n * 4) + ' / ' + pct(t2) + '</div>';
      }).join('') + '</div><div class="note">×4 규칙은 아웃츠가 많을수록 실제보다 높게 나옵니다 (15아웃: 60% vs ' + pct(1 - 32 / 47 * 31 / 46) + ').</div></section>';

    // probabilities
    var maxP = 43.8;
    h += '<section class="g-sec" id="g-prob"><h2>족보 · 확률</h2><div class="g-sub">족보 순위와 7장(홀카드 2 + 보드 5)으로 최종 완성될 확률</div><div class="hrank">' +
      G.hands.map(function (x, i) {
        var p = G.hand7[i];
        return '<div class="hr"><span class="hi">' + (i + 1) + '</span><div><b>' + x[0] + '</b><span class="hx">' + x[1] + '</span><small>' + x[2] + '</small></div><div class="hp"><span class="hb"><i style="width:' + Math.max(1.5, p / maxP * 100) + '%"></i></span>' + (p < 1 ? p.toFixed(p < 0.1 ? 3 : 2) : p.toFixed(1)) + '%</div></div>';
      }).join('') + '</div>';
    var pr = [
      ['포켓페어를 받을 확률', '78 ÷ 1326', 78 / 1326], ['특정 페어 (예: AA)', '6 ÷ 1326', 6 / 1326], ['수딧 핸드를 받을 확률', '312 ÷ 1326', 312 / 1326], ['AK (수딧+오프)', '16 ÷ 1326', 16 / 1326],
      ['포켓페어 → 플랍에서 셋 이상', '1 − C(48,3) ÷ C(50,3)', 1 - C2(48, 3) / C2(50, 3)],
      ['페어 아닌 핸드 → 플랍에서 홀카드가 페어 이상', '1 − C(44,3) ÷ C(50,3)', 1 - C2(44, 3) / C2(50, 3)],
      ['수딧 → 플랍에서 플러시 완성', 'C(11,3) ÷ C(50,3)', C2(11, 3) / C2(50, 3)],
      ['수딧 → 플랍에서 플러시 드로우', 'C(11,2) × 39 ÷ C(50,3)', C2(11, 2) * 39 / C2(50, 3)],
      ['플랍 플러시 드로우 → 리버까지 완성', '1 − 38/47 × 37/46', 1 - 38 / 47 * 37 / 46],
      ['턴 플러시 드로우 → 리버 완성', '9 ÷ 46', 9 / 46]
    ];
    h += '<div class="g-sub">자주 쓰는 확률 (앱이 직접 계산)</div><div class="ptable">' + pr.map(function (r) { return '<div class="pl">' + r[0] + '<small>' + r[1] + '</small></div><div class="pv2">' + pct(r[2], r[2] < 0.01 ? 2 : 1) + '</div>'; }).join('') + '</div></section>';

    // seats
    var RFIp = {}; E.POSITIONS.forEach(function (p) { RFIp[p] = E.rangePct(p); });
    h += '<section class="g-sec" id="g-seats"><h2>포지션</h2><div class="seat-table">' + G.seats.map(function (s) {
      return '<div class="st-row"><b>' + s[0] + '</b><div><span>' + s[1] + ' <em>' + s[2] + '</em></span><small>' + s[3] + '</small></div><span class="st-p">' + (RFIp[s[0]] !== undefined ? 'RFI ' + f1(RFIp[s[0]]) + '%' : '') + '</span></div>';
    }).join('') + '</div>' +
      '<div class="g-sub">액션 순서</div><div class="ord-row"><span class="ol">프리플랍</span>' + SEATS.map(function (s) { return '<span>' + s + '</span>'; }).join('<i>→</i>') + '</div>' +
      '<div class="ord-row"><span class="ol">플랍 이후</span>' + POST_ORDER.map(function (s) { return '<span>' + s + '</span>'; }).join('<i>→</i>') + '</div>' +
      '<div class="note">프리플랍은 블라인드가 마지막, 플랍부터는 블라인드가 먼저. 그래서 BTN은 포스트플랍에서 항상 IP, 블라인드는 대부분 OOP입니다. RFI % = 앱 기준 오픈 비율.</div></section>';

    // ranges
    h += '<section class="g-sec" id="g-ranges"><h2>레인지 표 <small>앱 기준</small></h2><div class="seg" id="rMode"><button type="button" data-v="rfi">오픈 (RFI)</button><button type="button" data-v="vs">레이즈 대응</button></div>' +
      '<div class="type-chips sub" id="rKeys"></div><div id="rGrid"></div></section>';

    // matchups
    h += '<section class="g-sec" id="g-mu"><h2>대표 매치업 <small>정확값 (전체 보드 계산)</small></h2>' + G.matchups.map(function (m) {
      var A = m.a.split(' ').map(E.cardFromCode), B = m.b.split(' ').map(E.cardFromCode), ea = m.eq - m.tie / 2, eb = 100 - m.eq - m.tie / 2;
      return '<div class="mrow"><div class="mh"><b>' + m.k + '</b><span>' + m.d + '</span></div><div class="mc2">' + A.map(function (c) { return mc(c); }).join('') + '<em>vs</em>' + B.map(function (c) { return mc(c); }).join('') + '</div>' +
        '<div class="stack sm"><div class="a" style="width:' + ea + '%"></div><div class="t" style="width:' + m.tie + '%"></div><div class="b" style="width:' + eb + '%"></div></div>' +
        '<div class="stack-legend"><span class="a">' + m.eq.toFixed(1) + '%</span><span class="muted">무 ' + m.tie.toFixed(1) + '%</span><span class="b">' + (100 - m.eq).toFixed(1) + '%</span></div></div>';
    }).join('') + '<div class="note">무늬에 따라 ±1%p 정도 달라집니다. 에퀴티 = 승 + 무승부 ÷ 2.</div></section>';

    // rules
    h += '<section class="g-sec" id="g-rules"><h2>이 앱의 채점 기준</h2>' + G.rules.map(function (r) { return '<div class="rule"><b>' + r[0] + '</b><p>' + r[1] + '</p></div>'; }).join('') + '</section>';

    // data
    h += '<section class="g-sec" id="g-data"><h2>설정 · 데이터</h2>' +
      '<div class="rule"><b>하루 목표 문제 수</b><div class="chips" id="goalChips">' + [20, 30, 50, 100].map(function (n) { return '<button type="button" data-g="' + n + '">' + n + '</button>'; }).join('') + '</div></div>' +
      '<div class="rule"><b>백업</b><p>앱을 지우면 기록도 사라져요. 아래 코드를 복사해 메모장 등에 보관하면 나중에 복원할 수 있어요.</p><textarea id="bkOut" readonly rows="3"></textarea><div class="btn-row"><button type="button" class="ghost-btn" id="bkMake">백업 코드 만들기</button><button type="button" class="ghost-btn" id="bkCopy">복사</button></div></div>' +
      '<div class="rule"><b>복원</b><p>백업 코드를 붙여넣고 복원을 누르세요. 지금 기록은 덮어써집니다.</p><textarea id="bkIn" rows="3" placeholder="백업 코드 붙여넣기"></textarea><div class="btn-row"><button type="button" class="ghost-btn" id="bkLoad">복원</button><span id="bkMsg" class="bk-msg"></span></div></div>' +
      '<div class="rule"><b>전체 초기화</b><p>모든 탭 기록, 챌린지 기록, 오답 노트, 분석 로그를 지웁니다.</p><span id="wipeWrap"></span></div>' +
      '<div class="ver">Holdem Lab v' + APP_VER + '</div></section>';
    g.innerHTML = h;
    wireGuide();
    guideBuilt = true;
  }

  function wireGuide() {
    var g = $('guide');
    // search
    var q = $('gq'), qx = $('gqx');
    function filter() {
      var s = q.value.trim().toLowerCase(); qx.hidden = !s;
      g.classList.toggle('searching', !!s);
      var any = false;
      g.querySelectorAll('.term, .fcard').forEach(function (el) { var hit = !s || el.getAttribute('data-s').indexOf(s) >= 0; el.hidden = !hit; if (hit && s) any = true; });
      g.querySelectorAll('.g-cat').forEach(function (c) {
        var vis = false, n = c.nextElementSibling;
        while (n && n.classList.contains('term')) { if (!n.hidden) vis = true; n = n.nextElementSibling; }
        c.hidden = !vis;
      });
      $('gEmpty').hidden = !s || any;
    }
    q.addEventListener('input', filter);
    qx.addEventListener('click', function () { q.value = ''; filter(); });
    g.querySelectorAll('.g-chips button').forEach(function (b) {
      b.addEventListener('click', function () { q.value = ''; filter(); scrollToEl($('g-' + b.getAttribute('data-sec'))); });
    });
    g.addEventListener('click', function (e) {
      var f = e.target.closest('[data-formula]'); if (f) { q.value = ''; filter(); flash($('f-' + f.getAttribute('data-formula'))); }
    });
    // pot odds calc
    $('cPot').value = guideCalc.pot; $('cBet').value = guideCalc.bet; $('cStack').value = guideCalc.stack;
    ['cPot', 'cBet', 'cStack'].forEach(function (id) { $(id).addEventListener('input', calc); });
    $('cOutsSt').addEventListener('click', function (e) { var b = e.target.closest('button'); if (!b) return; guideCalc.outs = Math.max(0, Math.min(25, guideCalc.outs + +b.getAttribute('data-d'))); calc(); });
    $('cStreet').addEventListener('click', function (e) { var b = e.target.closest('button'); if (!b) return; guideCalc.street = b.getAttribute('data-v'); calc(); });
    calc();
    // equity calc
    eqInit();
    // ranges
    var rMode = 'rfi', rKey = 'UTG';
    function drawRange() {
      $('rMode').querySelectorAll('button').forEach(function (b) { b.classList.toggle('on', b.getAttribute('data-v') === rMode); });
      var keys = rMode === 'rfi' ? E.POSITIONS : Object.keys(E.VS_OPEN);
      if (keys.indexOf(rKey) < 0) rKey = keys[0];
      $('rKeys').innerHTML = keys.map(function (k) {
        var lab = rMode === 'rfi' ? k : k.split('>')[0] + ' 오픈 · ' + (k.split('>')[1] === 'IP' ? 'IP' : k.split('>')[1]);
        return '<button type="button" data-k="' + k + '" class="' + (k === rKey ? 'on' : '') + '">' + lab + '</button>';
      }).join('');
      if (rMode === 'rfi') {
        $('rGrid').innerHTML = '<div class="legend3"><span class="c">오픈 ' + f1(E.rangePct(rKey)) + '%</span><span class="f">폴드</span></div>' + rangeGrid(rKey, null) + '<div class="note">' + E.RANGE_TEXT[rKey] + '</div>';
      } else {
        var T = E.VS_OPEN[rKey], TX = E.VS_OPEN_TEXT[rKey], rp = E.setPct(T.r), cp = E.setPct(T.c);
        $('rGrid').innerHTML = '<div class="legend3"><span class="r">3벳 ' + f1(rp) + '%</span><span class="c">콜 ' + f1(cp) + '%</span><span class="f">폴드 ' + f1(100 - rp - cp) + '%</span></div>' + grid3(T, null) +
          '<div class="note">3벳: ' + TX.r + (TX.c ? '<br>콜: ' + TX.c : '<br>콜 없음 (3벳 or 폴드)') + '</div>';
      }
    }
    $('rMode').addEventListener('click', function (e) { var b = e.target.closest('button'); if (!b) return; rMode = b.getAttribute('data-v'); drawRange(); });
    $('rKeys').addEventListener('click', function (e) { var b = e.target.closest('button'); if (!b) return; rKey = b.getAttribute('data-k'); drawRange(); });
    drawRange();
    // data
    function drawGoal() { $('goalChips').querySelectorAll('button').forEach(function (b) { b.classList.toggle('on', +b.getAttribute('data-g') === store.settings.goal); }); }
    $('goalChips').addEventListener('click', function (e) { var b = e.target.closest('button'); if (!b) return; store.settings.goal = +b.getAttribute('data-g'); save(); drawGoal(); renderGoal(); });
    drawGoal();
    $('bkMake').addEventListener('click', function () { $('bkOut').value = JSON.stringify(store); });
    $('bkCopy').addEventListener('click', function () {
      if (!$('bkOut').value) $('bkOut').value = JSON.stringify(store);
      $('bkOut').select();
      var ok = false; try { ok = document.execCommand('copy'); } catch (e) { ok = false; }
      $('bkCopy').textContent = ok ? '복사됨' : '길게 눌러 복사';
      setTimeout(function () { $('bkCopy').textContent = '복사'; }, 1600);
    });
    $('bkLoad').addEventListener('click', function () {
      var msg = $('bkMsg');
      try {
        var d = JSON.parse($('bkIn').value);
        if (!d || typeof d !== 'object' || !d.stats) throw new Error('bad');
        localStorage.setItem(KEY, JSON.stringify(d));
        msg.textContent = '복원 완료 — 다시 불러오는 중…'; setTimeout(function () { location.reload(); }, 600);
      } catch (e) { msg.textContent = '코드를 읽을 수 없어요. 전체를 붙여넣었는지 확인해 주세요.'; }
    });
    confirmButton($('wipeWrap'), '전체 기록 지우기', function () { try { localStorage.removeItem(KEY); } catch (e) { /* ignore */ } location.reload(); });
  }

  function calc() {
    var P = +$('cPot').value || 0, B = +$('cBet').value || 0, S = +$('cStack').value || 0;
    guideCalc.pot = P; guideCalc.bet = B; guideCalc.stack = S;
    var need = P + 2 * B > 0 ? B / (P + 2 * B) : 0;
    var cells = [
      ['필요 승률 (팟 오즈)', pct(need), B + ' ÷ (' + P + ' + ' + B + ' + ' + B + ')'],
      ['오즈 비율', B > 0 ? ((P + B) / B).toFixed(2) + ' : 1' : '–', '(팟 + 베팅) : 콜'],
      ['MDF', P + B > 0 ? pct(P / (P + B)) : '–', '팟 ÷ (팟 + 베팅)'],
      ['블러프 손익분기 폴드율', P + B > 0 ? pct(B / (P + B)) : '–', '베팅 ÷ (팟 + 베팅)'],
      ['리버 블러프 비중', pct(need), '베팅 ÷ (팟 + 2 × 베팅)'],
      ['콜 후 SPR', S > 0 && P + 2 * B > 0 ? (S / (P + 2 * B)).toFixed(1) : '–', '스택 ÷ (팟 + 2 × 베팅)']
    ];
    $('cOut1').innerHTML = cells.map(function (c) { return '<div><span>' + c[0] + '</span><b>' + c[1] + '</b><small>' + c[2] + '</small></div>'; }).join('');
    var n = guideCalc.outs, flop = guideCalc.street === 'flop';
    $('cOuts').textContent = n;
    $('cStreet').querySelectorAll('button').forEach(function (b) { b.classList.toggle('on', b.getAttribute('data-v') === guideCalc.street); });
    var rule = n * (flop ? 4 : 2), exact = flop ? 1 - (47 - n) / 47 * (46 - n) / 46 : n / 46;
    var corr = flop && n > 8 ? rule - (n - 8) : null;
    var verdict = exact > need ? '콜 이득' : '폴드';
    var ev = exact * (P + B) - (1 - exact) * B;
    var xneed = exact > 0 ? B * (1 - exact) / exact - (P + B) : Infinity;
    $('cOut2').innerHTML =
      '<div><span>규칙값 (×' + (flop ? 4 : 2) + ')</span><b>' + rule + '%</b><small>' + (corr !== null ? '보정 ' + corr + '%' : '&nbsp;') + '</small></div>' +
      '<div><span>정확한 확률</span><b>' + pct(exact) + '</b><small>' + (flop ? '1 − (' + (47 - n) + '/47 × ' + (46 - n) + '/46)' : n + ' ÷ 46') + '</small></div>' +
      '<div class="wide ' + (exact > need ? 'y' : 'n') + '"><span>위 팟 오즈와 비교 (정확값 기준)</span><b>' + pct(exact) + ' ' + (exact > need ? '&gt;' : '&lt;') + ' ' + pct(need) + ' → ' + verdict + '</b><small>콜 EV ' + (ev >= 0 ? '+' : '') + f1(ev) + (exact <= need && isFinite(xneed) ? ' · 임플라이드로 ' + Math.round(xneed) + ' 이상 더 받아내야 본전' : '') + '</small></div>';
  }

  /* equity calculator with card picker */
  var eq = { slots: [null, null, null, null, null, null, null, null, null], active: 0 };
  var SLOT_LAB = ['A', 'A', 'B', 'B', '플랍', '플랍', '플랍', '턴', '리버'];
  function eqInit() {
    var pick = $('ePick'), html = '';
    for (var s = 0; s < 4; s++) {
      html += '<div class="prow">';
      for (var r = 12; r >= 0; r--) { var c = r * 4 + s; html += '<button type="button" data-c="' + c + '" class="' + (s === 1 || s === 2 ? 'red' : '') + '">' + (E.RANKS[r] === 'T' ? '10' : E.RANKS[r]) + '<small>' + E.SUIT_SYM[s] + '</small></button>'; }
      html += '</div>';
    }
    pick.innerHTML = html;
    pick.addEventListener('click', function (e) {
      var b = e.target.closest('button'); if (!b || b.disabled) return;
      eq.slots[eq.active] = +b.getAttribute('data-c');
      var nx = eq.slots.indexOf(null); eq.active = nx < 0 ? eq.active : nx;
      eqDraw();
    });
    $('eSlots').addEventListener('click', function (e) {
      var b = e.target.closest('[data-i]'); if (!b) return;
      var i = +b.getAttribute('data-i');
      if (eq.slots[i] !== null && eq.active === i) eq.slots[i] = null;
      eq.active = i; eqDraw();
    });
    $('eClear').addEventListener('click', function () { eq.slots = [null, null, null, null, null, null, null, null, null]; eq.active = 0; $('eOut').innerHTML = ''; eqDraw(); });
    $('eRun').addEventListener('click', eqRun);
    eqDraw();
  }
  function eqDraw() {
    var used = {}; eq.slots.forEach(function (c) { if (c !== null) used[c] = 1; });
    var grp = [[0, 1, 'HAND A'], [2, 3, 'HAND B'], [4, 8, 'BOARD (선택)']];
    $('eSlots').innerHTML = grp.map(function (g) {
      var h = '<div class="eg"><span class="row-label">' + g[2] + '</span><div class="es">';
      for (var i = g[0]; i <= g[1]; i++) {
        var c = eq.slots[i];
        h += '<button type="button" data-i="' + i + '" class="slotb' + (i === eq.active ? ' act' : '') + (c !== null && isRed(c) ? ' red' : '') + (c !== null ? ' fill' : '') + '">' + (c !== null ? rankTxt(c) + E.SUIT_SYM[E.suitOf(c)] : '<small>' + SLOT_LAB[i] + '</small>') + '</button>';
      }
      return h + '</div></div>';
    }).join('');
    $('ePick').querySelectorAll('button').forEach(function (b) { b.disabled = !!used[+b.getAttribute('data-c')]; });
    var s = eq.slots, okHands = s[0] !== null && s[1] !== null && s[2] !== null && s[3] !== null;
    $('eRun').disabled = !okHands;
  }
  function eqRun() {
    var s = eq.slots, A = [s[0], s[1]], B = [s[2], s[3]];
    var board = s.slice(4).filter(function (c) { return c !== null; });
    var out = $('eOut');
    out.innerHTML = '<div class="loading">계산 중…</div>';
    $('eRun').disabled = true;
    E.equityBoard(A, B, board, 100000, function (r) {
      $('eRun').disabled = false;
      var w = r.win * 100, t = r.tie * 100, l = r.lose * 100, ea = r.eqA * 100;
      var ka = board.length ? E.CAT_KO[E.category(E.evaluate(A.concat(board)))] : E.handKeyOf(A[0], A[1]);
      var kb = board.length ? E.CAT_KO[E.category(E.evaluate(B.concat(board)))] : E.handKeyOf(B[0], B[1]);
      out.innerHTML = '<div class="big-eq"><div><div class="k">A · ' + ka + '</div><div class="v a">' + f1(ea) + '%</div></div><div style="text-align:right"><div class="k">B · ' + kb + '</div><div class="v b">' + f1(100 - ea) + '%</div></div></div>' +
        '<div class="stack"><div class="a" style="width:' + w + '%">' + (w > 12 ? 'A ' + f1(w) : '') + '</div><div class="t" style="width:' + t + '%">' + (t > 11 ? '무 ' + f1(t) : '') + '</div><div class="b" style="width:' + l + '%">' + (l > 12 ? 'B ' + f1(l) : '') + '</div></div>' +
        '<div class="stack-legend"><span class="a">A 승 ' + f1(w) + '%</span><span class="muted">무 ' + f1(t) + '%</span><span class="b">B 승 ' + f1(l) + '%</span></div>' +
        '<div class="note">' + (r.exact ? '남은 보드 ' + r.n.toLocaleString() + '가지를 전부 계산한 정확값' : '몬테카를로 ' + r.n.toLocaleString() + '회 · 표준오차 ±' + (r.se * 100).toFixed(2) + '%p') + '</div>';
    });
  }

  function scrollToEl(el) { if (!el) return; var y = el.getBoundingClientRect().top + window.pageYOffset - 118; window.scrollTo({ top: y, behavior: 'smooth' }); }
  function flash(el) { if (!el) return; scrollToEl(el); el.classList.remove('flash'); void el.offsetWidth; el.classList.add('flash'); }
  function openTerm(id) {
    go('guide');
    var q = $('gq'); if (q && q.value) { q.value = ''; q.dispatchEvent(new Event('input')); }
    setTimeout(function () { flash($('term-' + id)); }, 80);
  }
  document.addEventListener('click', function (e) {
    var b = e.target.closest('[data-term]'); if (!b) return;
    e.stopPropagation(); openTerm(b.getAttribute('data-term'));
  });

  /* daily goal + streak */
  function dayKey(d) { d = d || new Date(); return d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate(); }
  function streakDays() {
    var n = 0, d = new Date();
    if (!store.days[dayKey(d)]) d.setDate(d.getDate() - 1);
    while (store.days[dayKey(d)]) { n++; d.setDate(d.getDate() - 1); }
    return n;
  }
  function renderGoal() {
    var c = store.days[dayKey()] || 0, g = store.settings.goal, el = $('goalMini');
    el.textContent = c + '/' + g; el.classList.toggle('done', c >= g);
    var box = document.querySelector('.goal');
    if (box) {
      box.querySelector('.gl').innerHTML = '오늘 목표 <b>' + c + '</b> / ' + g + (c >= g ? ' · 달성' : '');
      box.querySelector('.gbar i').style.width = Math.min(100, c / g * 100) + '%';
      box.querySelector('.gs').innerHTML = '연속 학습 <b>' + streakDays() + '</b>일';
    }
  }

  /* =========================================================
     Tabs / back button / boot
     ========================================================= */
  var practice = {};
  TYPES.forEach(function (t) { practice[t] = Practice(t); });
  var prevTab = 'pot';
  function go(tab) {
    if (tab === 'guide' && activeTab !== 'guide') prevTab = activeTab;
    activeTab = tab;
    $('guideBtn').classList.toggle('on', tab === 'guide');
    if (tab === 'guide' && !guideBuilt) buildGuide();
    document.querySelectorAll('.tab').forEach(function (s) { s.classList.toggle('active', s.getAttribute('data-tab') === tab); });
    document.querySelectorAll('#tabs button').forEach(function (b) { b.classList.toggle('active', b.getAttribute('data-go') === tab); });
    if (tab !== 'guide') { store.settings.tab = tab; save(); }
    if (tab !== 'ch' || !run) window.scrollTo(0, 0);
    $('fb').style.display = tab === 'ch' ? '' : 'none';
    if (tab === 'ch') { if (!run && $('chEnd').hidden) { $('chHome').hidden = false; renderHome(); } }
    else if (tab !== 'guide') practice[tab].start();
    if (run && run.phase === 'answer') run.last = performance.now();
  }
  $('tabs').addEventListener('click', function (e) {
    var b = e.target.closest('button'); if (b) go(b.getAttribute('data-go'));
  });
  // Android back key (called from MainActivity): true = handled in-app, false = exit
  window.__onBack = function () {
    if (activeTab === 'guide') { go(prevTab); return true; }
    if (activeTab === 'ch' && run) { abortRun(); return true; }
    if (activeTab === 'ch' && !$('chEnd').hidden) { abortRun(); return true; }
    if (activeTab !== 'pot') { go('pot'); return true; }
    return false;
  };

  (function posChips() {
    var box = $('posKinds');
    function draw() {
      box.innerHTML = ['mix', 'vs', 'bb', 'post', 'concept'].map(function (k) {
        return '<button type="button" data-k="' + k + '" class="' + (store.settings.posKind === k ? 'on' : '') + '">' + (k === 'mix' ? '전체' : POS_KINDS[k]) + '</button>';
      }).join('');
    }
    box.addEventListener('click', function (e) {
      var b = e.target.closest('button'); if (!b) return;
      store.settings.posKind = b.getAttribute('data-k'); save(); draw();
      practice.pos.restart();
    });
    draw();
  })();
  if ('serviceWorker' in navigator && /^https?:$/.test(location.protocol)) {
    window.addEventListener('load', function () { navigator.serviceWorker.register('sw.js').catch(function () { /* ignore */ }); });
  }
  TYPES.forEach(renderStats);
  $('guideBtn').addEventListener('click', function () { if (activeTab === 'guide') go(prevTab); else go('guide'); });
  renderGoal();
  renderChAcc();
  go(TYPES.concat(['ch']).indexOf(store.settings.tab) >= 0 ? store.settings.tab : 'pot');
})();
