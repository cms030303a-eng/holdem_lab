/* Holdem Lab — UI (v1.8: i18n — ko / en / de / fr / es / it) */
(function () {
  'use strict';
  var E = window.Engine;
  var I = window.I18N, t = I.t;
  var $ = function (id) { return document.getElementById(id); };
  var APP_VER = '1.9';
  var TYPES = ['pot', 'outs', 'pre', 'pos', 'mu'];
  function typeName(k) { return t('type.' + k); }

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
    s.ads = Object.assign({ runs: 0, lastRun: 0, lastAt: 0 }, s.ads || {});
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
      '<div class="stat ok"><div class="k">' + t('st.correct') + '</div><div class="v">' + s.c + '</div></div>' +
      '<div class="stat ng"><div class="k">' + t('st.wrong') + '</div><div class="v">' + s.w + '</div></div>' +
      '<div class="stat"><div class="k">' + t('st.acc') + '</div><div class="v">' + (acc === null ? '–' : acc + '<small>%</small>') + '</div></div>' +
      '<div class="stat"><div class="k">' + t('st.streak') + '</div><div class="v">' + s.streak + '<small>/' + s.best + '</small></div></div>' +
      '</div>' +
      '<div class="stats-foot"><div class="hist">' + hist + '</div><span class="reset-wrap"></span></div>';
    confirmButton(el.querySelector('.reset-wrap'), t('st.reset'), function () {
      store.stats[tab] = { c: 0, w: 0, streak: 0, best: 0, hist: [] }; save(); renderStats(tab);
    });
    var nav = document.querySelector('[data-acc="' + tab + '"]');
    if (nav) nav.textContent = acc === null ? '–' : acc + '% · ' + tot;
  }
  function renderChAcc() {
    var best = 0;
    Object.keys(store.records).forEach(function (k) { if (k.indexOf('survival:') === 0) best = Math.max(best, store.records[k]); });
    var nav = document.querySelector('[data-acc="ch"]');
    if (nav) nav.textContent = store.notes.length ? t('nav.notes', store.notes.length) : (best ? t('nav.best', best) : '–');
  }
  function confirmButton(wrap, label, onYes) {
    function idle() {
      wrap.innerHTML = '<button type="button" class="reset">' + label + '</button>';
      wrap.firstChild.addEventListener('click', function () {
        wrap.innerHTML = '<span class="reset-confirm"><button type="button" class="yes">' + t('c.confirm') + '</button><button type="button" class="no">' + t('c.cancel') + '</button></span>';
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
      var tm = setTimeout(function () { if (!done) { done = true; if (ctrl) ctrl.abort(); reject(new Error('timeout')); } }, ms);
      fetch(url, { cache: 'no-store', signal: ctrl ? ctrl.signal : undefined }).then(function (r) {
        if (done) return; done = true; clearTimeout(tm); resolve(r);
      }, function (e) { if (done) return; done = true; clearTimeout(tm); reject(e); });
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
        var im = new Image(), tm = setTimeout(function () { badImg[url] = 1; res(); }, 4000);
        im.onload = function () { clearTimeout(tm); res(); };
        im.onerror = function () { clearTimeout(tm); badImg[url] = 1; res(); };
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
    root.innerHTML = '<div class="table-panel"><div class="street">' + (msg || t('c.dealing')) + '</div>' +
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
  function fmtSec(ms) { return t('u.sec', (ms / 1000).toFixed(1)); }
  function catName(i) { return t('cat.' + i); }
  function drawName(id) { return t('dr.' + id); }
  function b(x) { return '<b>' + x + '</b>'; }

  /* choice buttons: ctx.instant → answer immediately on tap */
  function choices(opts, cls, ctx) {
    var box = el('div', cls), val = null, locked = false;
    opts.forEach(function (o) {
      var bt = el('button', null, o[1]); bt.type = 'button'; bt.setAttribute('data-v', o[0]);
      bt.addEventListener('click', function () {
        if (locked) return;
        val = o[0];
        box.querySelectorAll('button').forEach(function (x) { x.classList.toggle('sel', x === bt); });
        if (ctx.instant) ctx.onSubmit(); else ctx.onReady(true);
      });
      box.appendChild(bt);
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
      var bt = e.target.closest('button'); if (!bt || locked) return;
      var d = +bt.getAttribute('data-d');
      v = v === null ? (d > 0 ? 1 : 0) : Math.max(min, Math.min(max, v + d));
      out.textContent = v; if (onChange) onChange(v);
    });
    return { el: w, val: function () { return v; }, lock: function () { locked = true; w.classList.add('locked'); } };
  }
  function step(i, title, body) {
    return '<div class="step"><div class="step-h"><span class="i">' + i + '</span><span class="t">' + title + '</span></div>' + body + '</div>';
  }
  function note(html) { return '<div class="note">' + html + '</div>'; }
  function verdictHtml(res) {
    return '<div class="verdict ' + (res.ok ? 'ok' : 'ng') + '"><span class="res">' + (res.ok ? t('v.ok') : t('v.ng')) + '</span>' +
      '<span class="ans">' + t('v.answer', b(res.correctTxt)) + (res.mineTxt ? ' · ' + t('v.mine', res.mineTxt) : '') + '</span></div>';
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
      ? 'FLOP · ' + t('sl.left2') + (allIn ? ' · ' + t('sl.allin') : ' · ' + t('sl.toriver'))
      : 'TURN · ' + t('sl.left1');
  }
  function drawPanel(q, allIn, noteHtml) {
    return panel(streetLabel(q.street, allIn), [
      el('div', 'row-label', 'BOARD'),
      cardRow('board', q.board, q.img, q.street === 'flop' ? ['TURN', 'RIVER'] : ['RIVER']),
      el('div', 'row-label', 'HERO'),
      cardRow('hole', q.hole, q.img)
    ], noteHtml);
  }
  function drawKey(a) { return a.draws.length > 1 ? 'dk.combo' : (a.draws[0] ? 'dr.' + a.draws[0] : 'dk.other'); }
  function outsBucket(n) { return n <= 5 ? 'ob.2_5' : n <= 9 ? 'ob.6_9' : n <= 14 ? 'ob.10_14' : 'ob.15'; }
  function drawsTxt(a) { return a.draws.map(drawName).join(' · '); }
  function outsBreakdown(a) {
    var dupSet = {}; a.both.forEach(function (c) { dupSet[c] = 1; });
    var html = '<div class="formula">' + t('ob.outs_eq', '<span class="hl">' + t('u.cards', a.count) + '</span>') + '</div>';
    html += '<div style="margin-top:6px">' + a.draws.map(function (d) { return '<span class="tag">' + drawName(d) + '</span>'; }).join('') + '</div>';
    html += '<div class="outs-group">';
    var parts = [];
    E.OUT_GROUPS.forEach(function (g) {
      var cs = a.groups[g]; if (!cs || !cs.length) return;
      parts.push(cs.length);
      html += '<div class="g">' + t('og.' + g) + ' ' + cs.length + '</div><div class="mini-cards">' + sortCards(cs).map(function (c) { return mc(c, g === 'flush' && dupSet[c]); }).join('') + '</div>';
    });
    html += '</div>';
    if (parts.length > 1) html += note(t('ob.sum', parts.join(' + '), b(t('u.cards', a.count))));
    if (a.both.length) html += note(t('ob.dup', b(t('u.cards', a.both.length))));
    if (a.groups.over && a.groups.over.length) html += note(t('ob.over_note'));
    return html;
  }
  function equityStepHtml(a, allInFlop) {
    var mult = a.cardsToCome === 2 ? 4 : 2;
    var html = '<div class="formula">' + a.count + ' × ' + mult + ' = <span class="hl">' + a.rulePct + '%</span></div>';
    if (a.cardsToCome === 2) {
      html += note(t('eq.two_left') + (allInFlop ? ' ' + t('eq.allin_paren') : '') + ' → <b>×4</b>. ' +
        t('eq.exact', '1 − (' + (a.unseen - a.count) + '/' + a.unseen + ' × ' + (a.unseen - a.count - 1) + '/' + (a.unseen - 1) + ')', b(f1(a.exactPct) + '%')));
    } else {
      html += note(t('eq.one_left') + ' → <b>×2</b>. ' + t('eq.exact', a.count + ' ÷ ' + a.unseen, b(f1(a.exactPct) + '%')));
    }
    var diff = a.rulePct - a.exactPct;
    if (Math.abs(diff) >= 2) {
      html += note(t(diff > 0 ? 'eq.rule_high' : 'eq.rule_low', b(f1(Math.abs(diff)) + '%p')) +
        (diff > 0 && a.cardsToCome === 2 ? ' — ' + t('eq.over4') : ''));
    }
    return html;
  }
  function refreshOuts(type, q) {           // stored notes from older versions / other languages → recompute outs
    if ((type === 'pot' || type === 'outs' || (type === 'pos' && q.kind === 'post')) && q.hole && q.board) q.outs = E.analyzeOuts(q.hole, q.board);
    return q;
  }

  /* =========================================================
     Quiz modules
     each: deal() → Promise<q>, render(root,q,ctx) → ctrl{answer(),lock(res,a)},
           judge(q,a) → res, explain(q,a,res) → html, line, summary, keys, hint, submit(bool)
     ========================================================= */
  var M = {};
  function act(k) { return t('act.' + k); }

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
  function moneyCells(cells) {
    return el('div', 'money', cells.map(function (c) {
      return '<div><div class="k">' + c[0] + '</div><div class="v">' + c[1] + '</div><div class="s">' + (c[2] || '&nbsp;') + '</div></div>';
    }).join(''));
  }
  M.pot = {
    submit: false,
    deal: function () { return dealDrawSpot('pot').then(function (q) { q.money = potMoney(q.outs, q.street); return q; }); },
    cards: function (q) { return q.hole.concat(q.board); },
    render: function (root, q, ctx) {
      var m = q.money;
      root.appendChild(drawPanel(q, true, ctx.practice ? t('rule.outs') + '<br>' + t('pot.assume_long') : t('rule.short')));
      root.appendChild(moneyCells([
        [t('m.pot'), m.pot],
        [t('m.bet'), m.bet, t('m.of_pot', Math.round(m.bet / m.pot * 100)) + (q.street === 'flop' ? ' · ' + t('m.allin') : '')],
        [t('m.call'), m.bet, q.street === 'flop' ? t('m.to_river') : t('m.river1')]
      ]));
      var st = null;
      if (ctx.practice) {
        st = stepper(0, 25, false);
        var f = el('div', 'field optional', '<div class="field-label">' + t('pot.my_outs') + ' <span class="muted">' + t('pot.optional') + '</span></div>');
        f.appendChild(st.el); root.appendChild(f);
      }
      var ch = choices([['fold', act('fold')], ['call', act('call')]], 'choices two', ctx);
      root.appendChild(ch.el);
      return {
        answer: function () { return ch.val() ? { choice: ch.val(), myOuts: st ? st.val() : null } : null; },
        lock: function (res, a) { ch.lock([res.correct], a.choice); if (st) st.lock(); }
      };
    },
    judge: function (q, a) {
      var correct = q.outs.rulePct > q.money.need ? 'call' : 'fold';
      return { ok: a.choice === correct, correct: correct, correctTxt: act(correct), mineTxt: act(a.choice) };
    },
    explain: function (q, a, res) {
      var o = q.outs, m = q.money, total = m.pot + 2 * m.bet, eqF = o.rulePct / 100;
      var ev = eqF * (m.pot + m.bet) - (1 - eqF) * m.bet, correct = res.correct;
      var s1 = outsBreakdown(o);
      if (a.myOuts !== null && a.myOuts !== undefined) s1 += note(t('pot.my_outs_res', b(a.myOuts), a.myOuts === o.count ? t('pot.exact') : t('pot.diff', (a.myOuts > o.count ? '+' : '') + (a.myOuts - o.count))));
      var html = step('01', t('pot.s1'), s1);
      html += step('02', t('pot.s2'), equityStepHtml(o, q.street === 'flop'));
      html += step('03', t('pot.s3'),
        '<div class="formula">' + m.bet + ' ÷ (' + m.pot + ' + ' + m.bet + ' + ' + m.bet + ')<br>= ' + m.bet + ' ÷ ' + total + ' = <span class="wa">' + f1(m.need) + '%</span></div>' +
        note(t('pot.need_note', b(f1(m.need) + '%'))));
      var e = Math.min(100, o.rulePct), n = m.need;
      html += step('04', t('pot.s4'),
        '<div class="meter"><div class="fill" style="width:' + e + '%"></div><div class="need" style="left:' + n + '%"></div>' +
        '<div class="lab e" style="left:' + Math.max(6, Math.min(94, e)) + '%">' + t('pot.lab_eq', o.rulePct) + '</div>' +
        '<div class="lab n" style="left:' + Math.max(6, Math.min(94, n)) + '%;top:auto;bottom:100%;margin:0 0 3px">' + t('pot.lab_need', f1(n)) + '</div></div>' +
        '<div class="formula">' + o.rulePct + '% ' + (correct === 'call' ? '&gt;' : '&lt;') + ' ' + f1(n) + '% → <span class="' + (correct === 'call' ? 'hl' : 'bd') + '">' + act(correct) + '</span></div>' +
        note(t('pot.ev', o.rulePct + '% × ' + (m.pot + m.bet) + ' − ' + (100 - o.rulePct) + '% × ' + m.bet, b((ev >= 0 ? '+' : '') + f1(ev)))) +
        (Math.sign(o.exactPct - n) !== Math.sign(o.rulePct - n) ? note(t('pot.border', f1(o.exactPct))) : ''));
      return html;
    },
    line: function (q, a, res) { return t('pot.line', res.correctTxt, q.outs.rulePct, f1(q.money.need)); },
    summary: function (q) { return t(q.street === 'flop' ? 'w.flop' : 'w.turn') + ' · ' + cardsTxt(q.hole) + ' · ' + t('u.outs', q.outs.count) + ' · ' + t('pot.sum_bet', Math.round(q.money.bet / q.money.pot * 100)); },
    hint: function (q) { return t('pot.hint', b(drawsTxt(q.outs))); },
    keys: function (q, a, res) {
      return [['g.street', q.street === 'flop' ? 'k.flop4' : 'k.turn2'], ['g.draw', drawKey(q.outs)], ['g.nouts', outsBucket(q.outs.count)], ['g.dir', res.correct === 'call' ? 'k.call_ok' : 'k.fold_ok']];
    }
  };

  /* ---------- 02 OUTS ---------- */
  M.outs = {
    submit: true,
    deal: function () { return dealDrawSpot('outs'); },
    cards: function (q) { return q.hole.concat(q.board); },
    render: function (root, q, ctx) {
      root.appendChild(drawPanel(q, false, ctx.practice ? t('rule.outs') + '<br>' + t('outs.assume_long') : t('rule.short')));
      var inputs = el('div', 'inputs');
      var f1el = el('div', 'field', '<div class="field-label">' + t('outs.in_outs') + '</div>');
      var check = function () { ctx.onReady(st.val() !== null && inp.value !== '' && !isNaN(+inp.value)); };
      var st = stepper(0, 25, true, check);
      f1el.appendChild(st.el);
      var f2el = el('div', 'field', '<div class="field-label">' + t('outs.in_eq') + '</div><div class="pct-input"><input type="number" inputmode="decimal" min="0" max="100" step="1" placeholder="0"><span>%</span></div>');
      var inp = f2el.querySelector('input');
      inp.addEventListener('input', check);
      inp.addEventListener('keydown', function (e) { if (e.key === 'Enter') { inp.blur(); ctx.onSubmit(); } });
      inputs.appendChild(f1el); inputs.appendChild(f2el);
      root.appendChild(inputs);
      if (ctx.practice) {
        var tol = el('div', 'tol', '<span class="field-label">' + t('outs.tol') + '</span><div class="chips"></div>');
        var chips = tol.querySelector('.chips');
        [1, 2, 3, 5].forEach(function (v) {
          var bt = el('button', v === store.settings.tol ? 'on' : '', '±' + v); bt.type = 'button';
          bt.addEventListener('click', function () {
            store.settings.tol = v; save();
            chips.querySelectorAll('button').forEach(function (x) { x.classList.toggle('on', x === bt); });
          });
          chips.appendChild(bt);
        });
        root.appendChild(tol);
      } else {
        root.appendChild(el('div', 'scale-legend', t('outs.tol_short', store.settings.tol)));
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
        correctTxt: t('u.outs', o.count) + ' · ' + o.rulePct + '%', mineTxt: t('u.outs', a.n) + ' · ' + fmtPct(a.p) + '%' };
    },
    explain: function (q, a, res) {
      var o = q.outs;
      var html = step('01', t('outs.s1', res.outsOK ? '✓' : '✗', a.n, o.count), outsBreakdown(o));
      var cmp = note(t('outs.cmp', b(fmtPct(a.p) + '%'), f1(res.dRule), f1(res.dExact), res.tol, b(res.pctOK ? t('outs.pass') : t('outs.fail'))));
      if (!res.outsOK && res.pctOK) cmp += note(t('outs.pct_ok_outs_ng'));
      html += step('02', t('outs.s2', res.pctOK ? '✓' : '✗'), equityStepHtml(o, false) + cmp);
      return html;
    },
    line: function (q, a, res) {
      return t('outs.line', t('u.outs', q.outs.count), q.outs.rulePct, f1(q.outs.exactPct)) + (res.ok ? '' : res.outsOK ? ' · ' + t('outs.line_pct') : ' · ' + t('outs.line_outs'));
    },
    summary: function (q) { return t(q.street === 'flop' ? 'w.flop' : 'w.turn') + ' · ' + cardsTxt(q.hole) + ' | ' + cardsTxt(q.board) + ' · ' + t('u.outs', q.outs.count); },
    hint: function (q) { return t('outs.hint', b(drawsTxt(q.outs)), q.outs.cardsToCome, q.outs.cardsToCome === 2 ? 4 : 2); },
    keys: function (q) { return [['g.draw', drawKey(q.outs)], ['g.nouts', outsBucket(q.outs.count)], ['g.street', q.street === 'flop' ? 'k.flop4' : 'k.turn2']]; }
  };

  /* ---------- 03 PREFLOP ---------- */
  var POS = E.POSITIONS;
  function keepProb(key, pos) {
    var first = E.firstOpenPos(key);
    if (!first) return 0.2;
    var d = Math.abs(POS.indexOf(pos) - POS.indexOf(first));
    return d <= 1 ? 1 : d === 2 ? 0.6 : 0.3;
  }
  function keyKind(k) { return k.length === 2 ? 'pair' : k[2] === 's' ? 'suited' : 'offsuit'; }
  function keyDesc(k) { return t('hk.' + keyKind(k) + '_long'); }
  function famName(key) { return key.length === 2 ? t('hk.pair') : key[0] + 'x ' + t('hk.' + (key[2] === 's' ? 'suited' : 'offsuit')); }
  function familyRule(pos, key) {
    var toks = E.RANGE_TEXT[pos].split(',');
    var pair = key.length === 2;
    var sel = toks.filter(function (tk) {
      if (pair) return tk[0] === tk[1];
      return tk[0] === key[0] && tk[1] !== tk[0] && tk[2] === key[2];
    });
    return { fam: famName(key), txt: sel.length ? sel.join(', ') : t('pre.none_fold') };
  }
  function rangeGrid(pos, meKey) {
    var R = E.RANGES[pos], html = '<div class="grid13">';
    for (var a = 12; a >= 0; a--) {
      for (var bb = 12; bb >= 0; bb--) {
        var key = a === bb ? E.handKey(a, a) : a > bb ? E.handKey(a, bb, true) : E.handKey(bb, a, false);
        html += '<div class="' + (R[key] ? 'in' : '') + (a === bb ? ' pr' : '') + (key === meKey ? ' me' : '') + '">' + key + '</div>';
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
        return '<div class="seat ' + (i < idx ? 'folded' : i === idx ? 'me' : '') + '">' + p + '<small>' + (i < idx ? 'FOLD' : i === idx ? 'YOU' : t('seat.wait')) + '</small></div>';
      }).join(''));
      root.appendChild(panel('PREFLOP · ' + t('pre.street'), [
        seats, el('div', 'row-label', 'HERO'), cardRow('hole', q.hole, q.img),
        el('div', 'hand-key', q.key + ' <span class="muted">· ' + keyDesc(q.key) + '</span>')
      ]));
      if (ctx.practice) {
        var tg = el('label', 'toggle', '<input type="checkbox"><span>' + t('pre.focus') + ' <em>' + t('pre.focus_sub') + '</em></span>');
        var cb = tg.querySelector('input'); cb.checked = !!store.settings.focus;
        cb.addEventListener('change', function () { store.settings.focus = cb.checked; save(); });
        root.appendChild(tg);
      }
      var ch = choices([['fold', act('fold')], ['open', act('open')]], 'choices two', ctx);
      root.appendChild(ch.el);
      return { answer: function () { return ch.val() ? { choice: ch.val() } : null; }, lock: function (res, a) { ch.lock([res.correct], a.choice); } };
    },
    judge: function (q, a) {
      var correct = E.RANGES[q.pos][q.key] ? 'open' : 'fold';
      return { ok: a.choice === correct, correct: correct, correctTxt: act(correct), mineTxt: act(a.choice) };
    },
    explain: function (q, a, res) {
      var inRange = res.correct === 'open', first = E.firstOpenPos(q.key), fr = familyRule(q.pos, q.key);
      var html = step('01', t('c.verdict'),
        '<div class="formula">' + q.key + ' @ ' + q.pos + ' → <span class="' + (inRange ? 'hl' : 'bd') + '">' + (inRange ? t('pre.in') : t('pre.out')) + '</span></div>' +
        note(t('pre.fam_rule', q.pos, b(fr.fam), b(fr.txt))) +
        note(first ? t('pre.first', b(first)) + (first !== 'BTN' ? ' ' + t('pre.first_after') : '') : t('pre.never')));
      html += step('02', t('pre.s2'), '<div class="pos-strip">' + POS.map(function (p) {
        var y = !!E.RANGES[p][q.key];
        return '<div class="' + (y ? 'y' : 'n') + (p === q.pos ? ' cur' : '') + '">' + p + '<b>' + (y ? act('open') : act('fold')) + '</b><small>' + f1(E.rangePct(p)) + '%</small></div>';
      }).join('') + '</div>' + note(t('pre.strip_note')));
      var combos = 0; Object.keys(E.RANGES[q.pos]).forEach(function (k) { combos += E.combosOf(k); });
      html += step('03', t('pre.s3', q.pos, f1(E.rangePct(q.pos)), combos),
        rangeGrid(q.pos, q.key) + note(t('grid.legend')) + note(t('pre.chart_note')));
      return html;
    },
    line: function (q, a, res) { return t('pre.line', q.key, q.pos, res.correctTxt, familyRule(q.pos, q.key).txt); },
    summary: function (q) { return q.pos + ' · ' + q.key + ' (' + cardsTxt(q.hole) + ')'; },
    hint: function (q) { return t('pre.hint', q.pos, b(f1(E.rangePct(q.pos)) + '%'), familyRule(q.pos, q.key).fam); },
    keys: function (q, a, res) {
      return [['g.pos', q.pos], ['g.dir', res.correct === 'open' ? 'k.open_ok' : 'k.fold_ok'], ['g.handkind', 'hk.' + keyKind(q.key)]];
    }
  };

  /* ---------- 05 MATCHUP ---------- */
  var ITER = 100000;
  var T_FLIP = 0.58, T_DOM = 0.70, T_EDGE = 0.015;
  function choiceTxt(v) { return v === '0' ? t('mu.flip') : v[0] + ' ' + t(v[1] === '2' ? 'mu.dom' : 'mu.edge'); }
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
    var type, kind, notes = [];
    if (pA && pB) {
      kind = 'pp';
      type = A[0] > B[0] ? t('cl.pp_hi', 'A') : A[0] < B[0] ? t('cl.pp_hi', 'B') : t('cl.pp_same');
      if (A[0] !== B[0]) notes.push(t('cl.pp_note'));
    } else if (pA || pB) {
      var P = pA ? A : B, X = pA ? B : A, who = pA ? 'A' : 'B', oth = pA ? 'B' : 'A';
      var overs = X.filter(function (r) { return r > P[0]; }).length, same = X.filter(function (r) { return r === P[0]; }).length;
      if (same) { kind = 'p_same'; type = t('cl.p_same', who, oth); notes.push(t('cl.p_same_note', oth)); }
      else if (overs === 2) { kind = 'p_2over'; type = t('cl.p_2over'); notes.push(t('cl.p_2over_note', oth)); }
      else if (overs === 1) { kind = 'p_1over'; type = t('cl.p_1over'); notes.push(t('cl.p_1over_note', oth)); }
      else { kind = 'p_2under'; type = t('cl.p_2under'); notes.push(t('cl.p_2under_note', oth, who)); }
    } else {
      var shared = A.filter(function (r) { return B.indexOf(r) >= 0; }).length;
      if (shared) { kind = 'dom'; type = t('cl.dom'); notes.push(t('cl.dom_note')); }
      else if (A[1] > B[0] || B[1] > A[0]) { kind = 'two_over'; type = t('cl.two_over', A[1] > B[0] ? 'A' : 'B'); }
      else if ((A[0] > B[0]) === (A[1] > B[1])) { kind = 'inter'; type = t('cl.inter'); }
      else { kind = 'hilo'; type = t('cl.hilo', A[0] > B[0] ? 'A' : 'B'); }
    }
    if (sA && sB && E.suitOf(h1[0]) === E.suitOf(h2[0])) notes.push(t('cl.same_suit'));
    else {
      if (sA) notes.push(t('cl.suited', 'A'));
      if (sB) notes.push(t('cl.suited', 'B'));
    }
    [['A', A, pA], ['B', B, pB]].forEach(function (x) {
      var g = x[1][0] - x[1][1];
      if (!x[2] && g >= 1 && g <= 2) notes.push(t('cl.connected', x[0], g - 1));
    });
    return { type: type, kind: kind, notes: notes };
  }
  function topCats(arr, total) {
    var list = [];
    for (var i = 0; i < 9; i++) if (arr[i]) list.push([i, arr[i]]);
    list.sort(function (x, y) { return y[1] - x[1]; });
    return list.slice(0, 3).map(function (x) { return catName(x[0]) + ' ' + Math.round(x[1] / total * 100) + '%'; }).join(' · ');
  }
  function eqBlock(ka, kb, w, tie, l, ea) {
    return '<div class="big-eq"><div><div class="k">A · ' + ka + '</div><div class="v a">' + f1(ea) + '%</div></div>' +
      '<div style="text-align:right"><div class="k">B · ' + kb + '</div><div class="v b">' + f1(100 - ea) + '%</div></div></div>' +
      '<div class="stack"><div class="a" style="width:' + w + '%">' + (w > 12 ? 'A ' + f1(w) : '') + '</div><div class="t" style="width:' + tie + '%">' + (tie > 11 ? t('mu.tie_s') + ' ' + f1(tie) : '') + '</div><div class="b" style="width:' + l + '%">' + (l > 12 ? 'B ' + f1(l) : '') + '</div></div>' +
      '<div class="stack-legend"><span class="a">' + t('mu.win', 'A', f1(w)) + '</span><span class="muted">' + t('mu.tie', f1(tie)) + '</span><span class="b">' + t('mu.win', 'B', f1(l)) + '</span></div>';
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
      root.appendChild(panel(t('mu.street'), [vs]));
      var ch = choices([['A2', '<b>A</b>' + t('mu.dom')], ['A1', '<b>A</b>' + t('mu.edge')], ['0', '<b>≈</b>' + t('mu.flip')], ['B1', '<b>B</b>' + t('mu.edge')], ['B2', '<b>B</b>' + t('mu.dom')]], 'scale', ctx);
      root.appendChild(ch.el);
      root.appendChild(el('div', 'scale-legend', t('mu.legend')));
      return { answer: function () { return ch.val() ? { choice: ch.val() } : null; }, lock: function (res, a) { ch.lock(res.accept, a.choice); } };
    },
    judge: function (q, a) {
      var ans = muAnswer(q.sim.eqA);
      return { ok: ans.accept.indexOf(a.choice) >= 0, accept: ans.accept, fav: ans.fav, side: ans.side,
        correctTxt: ans.accept.map(choiceTxt).join(' / '), mineTxt: choiceTxt(a.choice) };
    },
    explain: function (q, a, res) {
      var r = q.sim, eqA = r.eqA * 100;
      var html = step('01', t('mu.s1'),
        eqBlock(E.handKeyOf(q.A[0], q.A[1]), E.handKeyOf(q.B[0], q.B[1]), r.win * 100, r.tie * 100, r.lose * 100, eqA) +
        note(t('mu.sim_note', b(r.n.toLocaleString()), (r.se * 100).toFixed(2))));
      var fav = res.fav * 100, pos = function (x) { return (x - 50) / 50 * 100; };
      html += step('02', t('mu.s2', res.side, f1(fav)),
        '<div class="zones"><div class="z c" style="left:0;width:' + pos(58) + '%"></div><div class="z s" style="left:' + pos(58) + '%;width:' + (pos(70) - pos(58)) + '%"></div><div class="z d" style="left:' + pos(70) + '%;right:0"></div>' +
        '<div class="mk" style="left:calc(' + Math.min(99.5, pos(fav)) + '% - 1px)"></div>' +
        '<div class="zl" style="left:0;transform:none">50</div><div class="zl" style="left:' + pos(58) + '%">58</div><div class="zl" style="left:' + pos(70) + '%">70</div><div class="zl" style="left:auto;right:0;transform:none">100%</div></div>' +
        '<div class="note" style="display:flex;justify-content:space-between"><span>' + t('mu.flip') + '</span><span>' + t('mu.edge') + '</span><span>' + t('mu.dom') + '</span></div>' +
        (res.accept.length > 1 ? note(t('mu.edge_both')) : ''));
      var c = classify(q.A, q.B);
      html += step('03', t('mu.s3'), '<div class="formula" style="font-family:var(--sans);font-size:14.5px">' + c.type + '</div>' +
        c.notes.map(function (n) { return note('· ' + n); }).join(''));
      html += step('04', t('mu.s4'),
        note('<b style="color:var(--accent)">A</b> ' + (r.win ? topCats(r.catA, Math.round(r.win * r.n)) : '—')) +
        note('<b style="color:#d8b36a">B</b> ' + (r.lose ? topCats(r.catB, Math.round(r.lose * r.n)) : '—')));
      return html;
    },
    line: function (q, a, res) { var e = q.sim.eqA * 100; return 'A ' + f1(e) + '% : B ' + f1(100 - e) + '% → ' + res.correctTxt; },
    summary: function (q) { return E.handKeyOf(q.A[0], q.A[1]) + ' vs ' + E.handKeyOf(q.B[0], q.B[1]); },
    hint: function (q) { return t('mu.hint', b(t('ck.' + classify(q.A, q.B).kind))); },
    keys: function (q, a, res) {
      var zone = res.fav < T_FLIP ? 'k.z_flip' : res.fav < T_DOM ? 'k.z_edge' : 'k.z_dom';
      return [['g.mutype', 'ck.' + classify(q.A, q.B).kind], ['g.zone', zone]];
    }
  };

  /* ---------- 04 POSITION (vs open · BB defense · postflop position · concepts) ---------- */
  var SEATS = E.SEATS;
  var POST_ORDER = ['SB', 'BB', 'UTG', 'MP', 'HJ', 'CO', 'BTN'];
  var IMPLIED = { IP: 0.30, OOP: 0.15 };
  function posKind(k) { return t('pk.' + k); }

  function pickKind(k) {
    if (k && k !== 'mix') return k;
    var x = E.rand();
    return x < 0.3 ? 'vs' : x < 0.55 ? 'bb' : x < 0.8 ? 'post' : 'concept';
  }
  function shuffle(a) { a = a.slice(); for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(E.rand() * (i + 1)); var tmp = a[i]; a[i] = a[j]; a[j] = tmp; } return a; }

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
      else sub = t('seat.wait');
      return '<div class="seat ' + cls + '">' + p + '<small>' + sub + '</small></div>';
    }).join(''));
  }
  function grid3(tb, meKey) {
    var html = '<div class="grid13">';
    for (var a = 12; a >= 0; a--) for (var bb = 12; bb >= 0; bb--) {
      var key = a === bb ? E.handKey(a, a) : a > bb ? E.handKey(a, bb, true) : E.handKey(bb, a, false);
      html += '<div class="' + (tb.r[key] ? 'r' : tb.c[key] ? 'c' : '') + (key === meKey ? ' me' : '') + '">' + key + '</div>';
    }
    return html + '</div>';
  }
  function famTokens(text, key) {
    var pair = key.length === 2;
    return text.split(',').filter(function (tk) {
      tk = tk.trim(); if (!tk) return false;
      if (pair) return tk[0] === tk[1];
      return tk[0] === key[0] && tk[1] !== tk[0] && tk[2] === key[2];
    }).join(', ');
  }
  function legend3(rp, cp) {
    return '<div class="legend3"><span class="r">' + act('3bet') + ' ' + f1(rp) + '%</span><span class="c">' + act('call') + ' ' + f1(cp) + '%</span><span class="f">' + act('fold') + ' ' + f1(100 - rp - cp) + '%</span></div>';
  }
  function explainVs(q) {
    var grp = E.vsGroup(q.hero), tk = q.opener + '>' + grp, T = E.VS_OPEN[tk], TX = E.VS_OPEN_TEXT[tk];
    var html = step('01', t('c.verdict'),
      '<div class="formula">' + q.key + ' · ' + t('vs.title', q.hero, q.opener) + ' → <span class="' + (q.act === 'fold' ? 'bd' : q.act === '3bet' ? 'wa' : 'hl') + '">' + act(q.act) + '</span></div>' +
      note(t('vs.fam', famName(q.key), b(famTokens(TX.r, q.key) || t('c.none')), b(famTokens(TX.c, q.key) || t('c.none')))));
    var rp = E.setPct(T.r), cp = E.setPct(T.c);
    html += step('02', t('vs.range_title', q.hero, q.opener), legend3(rp, cp) + grid3(T, q.key) + note(t('vs.grid_note')));
    var pts = [t('vs.p_open', q.opener, b(f1(E.rangePct(q.opener)) + '%'))];
    if (grp === 'IP') {
      var u = E.VS_OPEN['UTG>IP'], c = E.VS_OPEN['CO>IP'];
      pts.push(t('vs.p_ip', q.hero, q.opener, f1(E.setPct(u.r) + E.setPct(u.c)), f1(E.setPct(c.r) + E.setPct(c.c))));
      if (q.hero !== 'BTN') pts.push(t('vs.p_behind', SEATS.slice(SEATS.indexOf(q.hero) + 1).join('·')));
    } else if (grp === 'SB') {
      pts.push(t('vs.p_sb'));
    } else {
      pts.push(t('vs.p_bb1'));
      pts.push(t('vs.p_bb2'));
    }
    html += step('03', t('vs.s3'), pts.map(function (x) { return note('· ' + x); }).join(''));
    return html;
  }

  /* postflop position + implied odds (turn, one card to come) */
  function dealPost() {
    return dealDrawSpot('post', 'turn').then(function (q) {
      var a = q.outs, eq = a.rulePct / 100;
      var target = E.rand() < 0.5 ? 'call' : 'fold', wantDiff = E.rand() < 0.55, best = null;
      for (var k = 0; k < 120; k++) {
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
  function sgn(x) { return (x >= 0 ? '+' : '') + f1(x); }
  function explainPost(q) {
    var o = q.outs, p = q.post, eq = o.rulePct / 100;
    var html = step('01', t('post.s1'), outsBreakdown(o));
    html += step('02', t('post.s2'), equityStepHtml(o, false));
    html += step('03', t('post.s3'),
      '<div class="formula">' + p.B + ' ÷ (' + p.P + ' + ' + p.B + ' + ' + p.B + ') = <span class="wa">' + f1(p.need) + '%</span></div>' +
      note(o.rulePct + '% ' + (o.rulePct > p.need ? '&gt;' : '&lt;') + ' ' + f1(p.need) + '% → ' + t('post.direct', b(act(p.evD > 0 ? 'call' : 'fold')), sgn(p.evD))));
    var need = p.B * (1 - eq) / eq - (p.P + p.B);
    html += step('04', t('post.s4', p.pos),
      '<div class="formula">' + t('post.x', p.S + ' × ' + Math.round(IMPLIED[p.pos] * 100) + '%', '<span class="hl">' + p.X + '</span>') + '</div>' +
      '<div class="formula">EV = ' + o.rulePct + '% × (' + p.P + ' + ' + p.B + ' + ' + p.X + ') − ' + (100 - o.rulePct) + '% × ' + p.B + '<br>= <span class="' + (p.ev > 0 ? 'hl' : 'bd') + '">' + sgn(p.ev) + '</span> → ' + act(p.ev > 0 ? 'call' : 'fold') + '</div>' +
      note(t('post.need', p.B + ' × (1 − ' + eq.toFixed(2) + ') ÷ ' + eq.toFixed(2) + ' − (' + p.P + ' + ' + p.B + ')', b(need > 0 ? Math.round(need) : t('post.need_zero')))));
    var ip = postEV(q, 'IP'), oop = postEV(q, 'OOP');
    function card(pos, r) {
      return '<div class="' + (p.pos === pos ? 'cur' : '') + '"><b>' + pos + '</b><span>X ' + r.X + '</span><span>EV ' + sgn(r.ev) + '</span><em class="' + (r.ev > 0 ? 'y' : 'n') + '">' + act(r.ev > 0 ? 'call' : 'fold') + '</em></div>';
    }
    html += step('05', t('post.s5'), '<div class="pv">' + card('IP', ip) + card('OOP', oop) + '</div>' + note(t('post.pos_note')));
    return html;
  }

  /* concept quiz (question bank lives in i18n.js → I.concepts()) */
  function dealConcept() {
    var bank = I.concepts(), item;
    if (E.rand() < 0.55) {
      var idx = Math.floor(E.rand() * bank.length), c = bank[idx];
      item = { ci: idx, opts: c.o.map(function (_, i) { return String(i); }), ans: '0', gen: false };
    } else {
      var g = pick(['postFirst', 'postLast', 'preFirst', 'next']);
      if (g === 'next') {
        var s = pick(SEATS), nx = SEATS[(SEATS.indexOf(s) + 1) % SEATS.length];
        var wrong = shuffle(SEATS.filter(function (p) { return p !== nx && p !== s; })).slice(0, 3);
        item = { g: g, s: s, opts: [nx].concat(wrong), ans: nx, gen: true, order: SEATS, hl: [s, nx] };
      } else {
        var pickd = shuffle(SEATS).slice(0, 3);
        var order = g === 'preFirst' ? SEATS : POST_ORDER;
        var sorted = pickd.slice().sort(function (x, y) { return order.indexOf(x) - order.indexOf(y); });
        item = { g: g, opts: pickd, ans: g === 'postLast' ? sorted[2] : sorted[0], gen: true, order: order, hl: pickd, sorted: sorted };
      }
    }
    item.opts = shuffle(item.opts);
    item.kind = 'concept';
    item.hole = []; item.img = {}; item.source = 'local';
    return Promise.resolve(item);
  }
  function conceptText(q) {                  // → { q, opt(v), e }
    if (!q.gen) {
      var c = I.concepts()[q.ci] || I.concepts()[0];
      return { q: c.q, opt: function (v) { return c.o[+v]; }, e: c.e };
    }
    var same = function (v) { return v; };
    if (q.g === 'next') {
      return { q: t('cq.next_q', q.s), opt: same, e: t('cq.next_e', 'UTG → MP → HJ → CO → BTN → SB → BB', q.s, q.ans) };
    }
    var list = q.sorted.slice().sort(function (x, y) { return SEATS.indexOf(x) - SEATS.indexOf(y); }).join(', ');
    var qq = q.g === 'preFirst' ? t('cq.pre_first', list) : t(q.g === 'postFirst' ? 'cq.post_first' : 'cq.post_last', list);
    return { q: qq, opt: same, e: t(q.g === 'preFirst' ? 'cq.order_pre' : 'cq.order_post', q.order.join(' → '), q.sorted.join(' → ')) };
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
        var ct = conceptText(q);
        root.appendChild(panel('CONCEPT · ' + posKind('concept'), [el('div', 'concept-q', ct.q)]));
        ch = choices(q.opts.map(function (o) { return [o, ct.opt(o)]; }), 'choices list', ctx);
      } else if (q.kind === 'post') {
        var p = q.post;
        var pn = drawPanel(q, false, null);
        pn.querySelector('.street').innerHTML = 'TURN · ' + t('sl.left1') + ' · ' + t('post.you') + ' <span class="posb ' + p.pos.toLowerCase() + '">' + p.pos + '</span> ' + t(p.pos === 'IP' ? 'post.ip_sub' : 'post.oop_sub');
        root.appendChild(pn);
        root.appendChild(moneyCells([
          [t('m.pot'), p.P],
          [t('m.bet'), p.B, t('m.of_pot', Math.round(p.B / p.P * 100))],
          [t('m.stack'), p.S, t('m.after_call')]
        ]));
        root.appendChild(el('div', 'assume', t('post.assume')));
        ch = choices([['fold', act('fold')], ['call', act('call')]], 'choices two', ctx);
      } else {
        var info = el('div', 'hand-key', q.key + ' <span class="muted">· ' + keyDesc(q.key) + '</span>');
        root.appendChild(panel('PREFLOP · ' + t('vs.street', q.opener), [seatStrip(q), el('div', 'row-label', 'HERO · ' + q.hero), cardRow('hole', q.hole, q.img), info]));
        ch = choices([['fold', act('fold')], ['call', act('call')], ['3bet', act('3bet')]], 'choices three', ctx);
      }
      root.appendChild(ch.el);
      return { answer: function () { return ch.val() ? { choice: ch.val() } : null; }, lock: function (res, a) { ch.lock([res.correct], a.choice); } };
    },
    judge: function (q, a) {
      var correct = q.kind === 'concept' ? q.ans : q.kind === 'post' ? (q.post.ev > 0 ? 'call' : 'fold') : q.act;
      var lab = q.kind === 'concept' ? conceptText(q).opt : act;
      return { ok: a.choice === correct, correct: correct, correctTxt: lab(correct), mineTxt: lab(a.choice) };
    },
    explain: function (q, a, res) {
      if (q.kind === 'post') return explainPost(q);
      if (q.kind === 'concept') {
        var body = '<div class="note" style="font-size:13.5px;color:var(--text)">' + conceptText(q).e + '</div>';
        if (q.order) body += '<div class="order">' + q.order.map(function (p, i) { return '<span class="' + (q.hl.indexOf(p) >= 0 ? 'h' : '') + (p === q.ans ? ' a' : '') + '"><small>' + (i + 1) + '</small>' + p + '</span>'; }).join('') + '</div>';
        return step('01', t('c.explain'), body);
      }
      return explainVs(q);
    },
    line: function (q, a, res) {
      if (q.kind === 'concept') return t('c.answer_is', res.correctTxt);
      if (q.kind === 'post') { var p = q.post; return t('post.line', res.correctTxt, q.outs.rulePct, f1(p.need), p.pos, (p.ev >= 0 ? '+' : '') + Math.round(p.ev)); }
      return q.key + ' · ' + t('vs.title', q.hero, q.opener) + ' → ' + res.correctTxt;
    },
    hint: function (q) {
      if (q.kind === 'concept') return null;
      if (q.kind === 'post') return t('post.hint', b(f1(q.post.need) + '%'));
      var T = E.VS_OPEN[q.opener + '>' + E.vsGroup(q.hero)];
      return t('vs.hint', t('vs.title', q.hero, q.opener), b(f1(E.setPct(T.r)) + '%'), b(f1(E.setPct(T.c)) + '%'));
    },
    summary: function (q) {
      if (q.kind === 'concept') { var s = conceptText(q).q; return s.length > 40 ? s.slice(0, 40) + '…' : s; }
      if (q.kind === 'post') return t('w.turn') + ' ' + q.post.pos + ' · ' + cardsTxt(q.hole) + ' · ' + t('u.outs', q.outs.count);
      return t('vs.title', q.hero, q.opener) + ' · ' + q.key;
    },
    keys: function (q) {
      var k = [['g.situation', 'pk.' + q.kind]];
      if (q.kind === 'vs' || q.kind === 'bb') {
        k.push(['g.action', 'k.' + q.act + '_ok']);
        k.push([q.kind === 'bb' ? 'g.bb_opener' : 'g.myseat', q.kind === 'bb' ? q.opener : q.hero]);
      } else if (q.kind === 'post') {
        k.push(['g.pos', q.post.pos]);
        k.push(['g.basis', q.post.ev > 0 ? (q.post.evD > 0 ? 'k.direct_call' : 'k.implied_call') : 'k.fold']);
      } else k.push(['g.qkind', q.gen ? 'k.order' : 'k.concept']);
      return k;
    }
  };

  /* =========================================================
     Ads bridge — native side (Android Studio build) exposes window.HoldemAds.
     No bridge (personal APK / iPhone web) → no ads, rewarded features are free.
       · banner        : guide, challenge home & results only (never on question screens)
       · interstitial  : challenge results → "again / modes", after 3+ runs, every 2 runs, ≥3 min apart
       · rewarded      : survival revive (once), practice hint — always optional
     ========================================================= */
  var Ads = (function () {
    var B = window.HoldemAds, on = false;
    try { on = !!(B && B.available && B.available()); } catch (e) { on = false; }
    var cbs = {}, seq = 0, bannerOn = null;
    window.__adResult = function (id, ok) { var f = cbs[id]; delete cbs[id]; if (f) f(!!ok); };
    function call(method, done, fallback) {
      if (!on) { done(fallback); return; }
      var id = 'a' + (++seq); cbs[id] = done;
      setTimeout(function () { if (cbs[id]) { delete cbs[id]; done(fallback && method !== 'showRewarded'); } }, 45000);
      try { B[method](id); } catch (e) { delete cbs[id]; done(false); }
    }
    return {
      on: on,
      banner: function (show) { if (!on || bannerOn === show) return; bannerOn = show; try { B.setBanner(!!show); } catch (e) { /* ignore */ } },
      interstitial: function (done) { call('showInterstitial', done, false); },
      rewarded: function (done) { call('showRewarded', done, true); }
    };
  })();
  function updateBanner() { Ads.banner(activeTab === 'guide' || (activeTab === 'ch' && !run) || (activeTab === 'daily' && !!DQ && dailyDone(DQ.k) && DQ.a.length >= 5)); }
  function maybeInterstitial(then) {
    var a = store.ads, now = Date.now();
    if (!Ads.on || a.runs < 3 || a.runs - a.lastRun < 2 || now - a.lastAt < 180000) { then(); return; }
    a.lastRun = a.runs; a.lastAt = now; save();
    Ads.interstitial(function () { then(); });
  }
  function adLabel(key) { return Ads.on ? t('ad.watch', t(key)) : t(key); }

  /* =========================================================
     Practice tabs
     ========================================================= */
  function setBtn(btn, mode) {
    btn.classList.toggle('next', mode === 'next');
    btn.textContent = mode === 'next' ? t('btn.next') : mode === 'loading' ? t('c.dealing') : t('btn.check');
  }
  function showExplain(box, html) {
    box.innerHTML = html; box.hidden = false;
    setTimeout(function () { box.scrollIntoView({ behavior: 'smooth', block: 'start' }); }, 60);
  }
  function Practice(type) {
    var sec = $('tab-' + type), root = sec.querySelector('.qroot'), btn = sec.querySelector('.primary'), ex = sec.querySelector('.explain');
    var phase = 'idle', q = null, ctrl = null, t0 = 0, token = 0;
    var hintRow = el('div', 'hint-row'); hintRow.hidden = true;
    sec.insertBefore(hintRow, btn);
    setBtn(btn, 'check');
    function drawHint() {
      var h = q && M[type].hint ? M[type].hint(q) : null;
      if (!h) { hintRow.hidden = true; return; }
      hintRow.hidden = false;
      hintRow.innerHTML = '<button type="button" class="hint-btn">' + adLabel('hint.btn') + '</button>';
      hintRow.firstChild.addEventListener('click', function () {
        var bt = this; if (phase !== 'ask') return; bt.disabled = true; bt.textContent = Ads.on ? t('ad.loading') : t('hint.btn');
        Ads.rewarded(function (ok) {
          if (!ok) { bt.disabled = false; bt.textContent = t('ad.fail_retry'); return; }
          hintRow.innerHTML = '<div class="hint-box"><b>' + t('hint.btn') + '</b> ' + h + '</div>';
        });
      });
    }
    function next() {
      var my = ++token;
      phase = 'loading'; btn.disabled = true; setBtn(btn, 'loading'); ex.hidden = true; skeleton(root); hintRow.hidden = true; q = null;
      M[type].deal(true).then(function (qq) {
        if (my !== token) return;
        q = qq; root.innerHTML = '';
        ctrl = M[type].render(root, q, {
          practice: true, instant: false,
          onReady: function (r) { if (phase === 'ask') btn.disabled = !r; },
          onSubmit: function () { if (phase === 'ask' && !btn.disabled) check(); }
        });
        phase = 'ask'; setBtn(btn, 'check'); btn.disabled = true; t0 = Date.now();
        drawHint();
      });
    }
    function check() {
      var a = ctrl.answer(); if (!a) return;
      var res = M[type].judge(q, a);
      record(type, res.ok);
      logAnswer(type, q, a, res, Date.now() - t0, 'practice');
      ctrl.lock(res, a);
      var hb = hintRow.querySelector('.hint-btn'); if (hb) hintRow.hidden = true;
      showExplain(ex, verdictHtml(res) + M[type].explain(q, a, res) + seeHtml(type, q));
      phase = 'shown'; setBtn(btn, 'next'); btn.disabled = false;
    }
    btn.addEventListener('click', function () { if (phase === 'ask') check(); else if (phase === 'shown') next(); });
    return { start: function () { if (phase === 'idle') next(); }, restart: next };
  }

  /* =========================================================
     CHALLENGE
     ========================================================= */
  var MODES = {
    survival: { en: 'SURVIVAL', better: 'max', fmt: function (v) { return t('u.streak', v); } },
    attack: { en: 'TIME ATTACK', better: 'max', fmt: function (v) { return t('u.solved', v); } },
    sprint: { en: 'SPRINT 10', better: 'min', fmt: function (v) { return fmtTime(v); } },
    review: { en: 'REVIEW' }
  };
  var ATTACK_MS = 60000, ATTACK_PEN = 5000, SPRINT_N = 10, SPRINT_PEN = 10000;
  var run = null;
  var activeTab = 'pot';

  function recKey(mode, type) { return mode + ':' + type; }
  function bestOf(mode, type) { var v = store.records[recKey(mode, type)]; return v === undefined ? null : v; }
  function notesFor(type) { return store.notes.filter(function (n) { return type === 'mix' || n.t === type; }); }
  function todayStrip(n, ok, avgMs, firstKey, firstVal) {
    return '<div class="today">' +
      '<div><div class="k">' + t(firstKey) + '</div><div class="v">' + firstVal + '</div></div>' +
      '<div><div class="k">' + t(n === null ? 'ch.today_acc' : 'st.acc') + '</div><div class="v">' + (ok !== null ? ok + '<small>%</small>' : '–') + '</div></div>' +
      '<div><div class="k">' + t('ch.avg') + '</div><div class="v">' + (avgMs !== null ? (avgMs / 1000).toFixed(1) + '<small>' + t('u.s') + '</small>' : '–') + '</div></div></div>';
  }

  function renderHome() {
    var type = store.settings.chType;
    var home = $('chHome');
    var chips = ['mix'].concat(TYPES).map(function (k) {
      return '<button type="button" data-t="' + k + '" class="' + (k === type ? 'on' : '') + '">' + typeName(k) + '</button>';
    }).join('');
    var today = new Date(); today.setHours(0, 0, 0, 0);
    var tl = store.log.filter(function (e) { return e.ts >= today.getTime(); });
    var tOk = tl.filter(function (e) { return e.ok; }).length;
    var tMs = tl.length ? tl.reduce(function (s, e) { return s + e.ms; }, 0) / tl.length : null;
    var html = dailyCardHtml() + todayStrip(null, tl.length ? Math.round(tOk / tl.length * 100) : null, tMs, 'ch.today_n', tl.length) +
      '<div class="goal"><div class="gl"></div><div class="gbar"><i></i></div><div class="gs"></div></div>';
    html += '<div class="sec-h"><span>' + t('ch.types') + '</span></div><div class="type-chips">' + chips + '</div>';
    html += '<div class="modes">' + Object.keys(MODES).map(function (k) {
      var m = MODES[k], best, sub;
      if (k === 'review') { best = t('u.qs', notesFor(type).length); sub = t('ch.left_notes'); }
      else { var bv = bestOf(k, type); best = bv === null ? '—' : m.fmt(bv); sub = t('ch.best'); }
      var dis = k === 'review' && !notesFor(type).length;
      return '<button type="button" class="mode" data-mode="' + k + '"' + (dis ? ' disabled' : '') + '><span class="en">' + m.en + '</span><span class="nm">' + t('mode.' + k) + '</span><span class="ds">' + t('mode.' + k + '_d') + '</span><span class="best"><small>' + sub + '</small>' + best + '</span></button>';
    }).join('') + '</div>';

    html += '<div class="sec-h"><span>' + t('ch.best') + '</span></div><div class="rec"><div class="h"></div><div class="h">' + t('mode.survival') + '</div><div class="h">' + t('mode.attack_s') + '</div><div class="h">' + t('mode.sprint') + '</div>' +
      ['mix'].concat(TYPES).map(function (k) {
        return '<div class="r' + (k === type ? ' cur' : '') + '">' + typeName(k) + '</div>' + ['survival', 'attack', 'sprint'].map(function (m) {
          var v = bestOf(m, k); return '<div class="' + (k === type ? 'cur' : '') + '">' + (v === null ? '<span class="faint">—</span>' : MODES[m].fmt(v)) + '</div>';
        }).join('');
      }).join('') + '</div>';

    html += '<div class="sec-h"><span>' + t('an.title') + '</span><span class="faint">' + t('an.sub', store.log.length) + '</span></div>' + analysisHtml(type);
    html += '<div class="danger-row"><span class="wrap-a"></span><span class="wrap-b"></span></div>';
    home.innerHTML = html;
    renderGoal();
    wireDailyCard(home, renderHome);

    home.querySelectorAll('.type-chips button').forEach(function (bt) {
      bt.addEventListener('click', function () { store.settings.chType = bt.getAttribute('data-t'); save(); renderHome(); });
    });
    home.querySelectorAll('.mode').forEach(function (bt) {
      bt.addEventListener('click', function () { startRun(bt.getAttribute('data-mode'), store.settings.chType); });
    });
    confirmButton(home.querySelector('.wrap-a'), t('an.clear_log'), function () { store.log = []; save(); renderHome(); });
    confirmButton(home.querySelector('.wrap-b'), t('an.clear_notes'), function () { store.notes = []; save(); renderChAcc(); renderHome(); });
  }

  var DIR = { pot: ['k.call_ok', 'k.fold_ok'], pre: ['k.open_ok', 'k.fold_ok'] };
  function analysisHtml(type) {
    var types = type === 'mix' ? TYPES : [type];
    var out = '';
    types.forEach(function (tp) {
      var L = store.log.filter(function (e) { return e.t === tp; });
      if (!L.length) { out += '<div class="an-card"><div class="an-h"><b>' + typeName(tp) + '</b><span class="faint">' + t('an.empty') + '</span></div></div>'; return; }
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
      var html = '<div class="an-card"><div class="an-h"><b>' + typeName(tp) + '</b><span>' + t('an.head', L.length, Math.round(ok / L.length * 100), (avg / 1000).toFixed(1)) + '</span></div>';
      var weakest = null;
      order.forEach(function (g) {
        var rows = Object.keys(groups[g]).map(function (k) { var c = groups[g][k]; return { k: k, n: c.n, acc: c.ok / c.n }; });
        rows.sort(function (x, y) { return x.acc - y.acc || y.n - x.n; });
        html += '<div class="an-g">' + t(g) + '</div>';
        rows.forEach(function (r) {
          var p = Math.round(r.acc * 100), cls = p < 60 ? 'lo' : p < 80 ? 'mid' : '';
          html += '<div class="an-row"><span class="lb">' + t(r.k) + '</span><span class="an-bar ' + cls + '"><i style="width:' + p + '%"></i></span><span class="pc">' + p + '%<small> ' + r.n + '</small></span></div>';
          if (r.n >= 4 && g !== 'g.dir' && g !== '정답 방향' && (!weakest || r.acc < weakest.acc)) weakest = { g: g, k: r.k, acc: r.acc, n: r.n };
        });
      });
      var ins = [];
      if (weakest && weakest.acc < 0.85) ins.push(t('an.weak', b(t(weakest.k)), t(weakest.g), Math.round(weakest.acc * 100), weakest.n));
      var dir = groups['g.dir'], pairs = DIR[tp];
      if (dir && pairs && dir[pairs[0]] && dir[pairs[1]] && dir[pairs[0]].n >= 4 && dir[pairs[1]].n >= 4) {
        var a0 = dir[pairs[0]].ok / dir[pairs[0]].n, a1 = dir[pairs[1]].ok / dir[pairs[1]].n;
        if (Math.abs(a0 - a1) >= 0.15) ins.push(t('an.bias_' + tp + (a0 < a1 ? '_tight' : '_loose')));
      }
      if (L.length < 10) ins.push(t('an.more'));
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
    Ads.banner(false);
    window.scrollTo(0, 0);
    prefetch(); nextQ();
  }
  function prefetch() {
    var r = run;
    if (r.mode === 'review') {
      var n = r.queue.shift();
      if (!n) { r.nextP = null; return; }
      var q = refreshOuts(n.t, JSON.parse(JSON.stringify(n.q)));
      r.nextP = preload(M[n.t].cards(q), q.img).then(function () { return { t: n.t, q: q }; });
      return;
    }
    var tp = pickType(r.type);
    r.nextP = M[tp].deal().then(function (q) { return { t: tp, q: q }; });
  }
  function runBar() {
    var r = run, m = MODES[r.mode], big = '', sub = '';
    if (r.mode === 'attack') { var left = Math.max(0, ATTACK_MS - r.active - r.pen); big = (left / 1000).toFixed(1); sub = t('rb.cw', r.score, r.wrong); }
    else if (r.mode === 'sprint') { big = fmtTime(r.active + r.pen); sub = Math.min(r.items.length + (r.phase === 'answer' ? 1 : 0), SPRINT_N) + ' / ' + SPRINT_N + (r.wrong ? ' · ' + t('rb.w', r.wrong) : ''); }
    else if (r.mode === 'survival') { big = r.score; sub = t('rb.streak'); }
    else { big = r.items.length + ' / ' + r.total; sub = t('rb.hit', r.score); }
    return { big: big, sub: sub, name: m.en, type: typeName(r.type) };
  }
  function drawRunBar() {
    var r = run; if (!r) return;
    var bb = runBar(), box = $('chRun').querySelector('.runbar');
    if (!box) return;
    box.querySelector('.rb-big').textContent = bb.big;
    box.querySelector('.rb-sub').textContent = bb.sub;
    var dr = $('chRun').querySelector('.drain i');
    if (dr) {
      var left = Math.max(0, ATTACK_MS - r.active - r.pen) / ATTACK_MS;
      dr.style.width = (left * 100) + '%';
      dr.parentNode.classList.toggle('low', left < 0.2);
    }
  }
  function runShell() {
    var bb = runBar();
    $('chRun').innerHTML =
      '<div class="runbar"><button type="button" class="quit">✕ ' + t('rb.quit') + '</button>' +
      '<div class="rb-mid"><div class="rb-mode">' + bb.name + '</div><div class="rb-type">' + bb.type + '</div></div>' +
      '<div class="rb-right"><div class="rb-big">' + bb.big + '</div><div class="rb-sub">' + bb.sub + '</div></div></div>' +
      (run.mode === 'attack' ? '<div class="drain"><i></i></div>' : '') +
      '<div class="run-q"></div><button type="button" class="primary run-submit" hidden disabled>' + t('btn.submit') + '</button>';
    var quit = $('chRun').querySelector('.quit');
    quit.addEventListener('click', function () {
      if (!run) return;
      if (!run.quitArm) { run.quitArm = true; quit.textContent = t('rb.quit_sure'); quit.classList.add('arm'); setTimeout(function () { if (run) { run.quitArm = false; quit.textContent = '✕ ' + t('rb.quit'); quit.classList.remove('arm'); } }, 2500); return; }
      abortRun();
    });
    drawRunBar();
  }
  function nextQ() {
    var r = run;
    r.phase = 'loading';
    runShell();
    var qroot = $('chRun').querySelector('.run-q');
    skeleton(qroot, t('rb.preparing'));
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
      if (r.type === 'mix') qroot.firstChild.querySelector('.street').insertAdjacentHTML('afterbegin', '<span class="qtype">' + typeName(x.t) + '</span>');
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
    var penTxt = !res.ok && r.mode === 'attack' ? ' −' + t('u.sec', 5) : !res.ok && r.mode === 'sprint' ? ' +' + t('u.sec', 10) : '';
    var revive = r.mode === 'survival' && !res.ok && !r.revived && r.score >= 3;
    var over = (r.mode === 'survival' && !res.ok && !revive) ||
      (r.mode === 'attack' && r.active + r.pen >= ATTACK_MS) ||
      (r.mode === 'sprint' && r.items.length >= SPRINT_N) ||
      (r.mode === 'review' && !r.nextP);
    showFb(res.ok, M[x.t].line(x.q, a, res), penTxt, res.ok ? 650 : 1700, function () {
      if (run !== r) return;
      if (revive) showRevive(r);
      else if (over) finishRun(); else nextQ();
    });
  }
  function showRevive(r) {
    r.phase = 'revive';
    var box = el('div', 'revive', '<div class="rv-k">SURVIVAL · ' + t('rv.head', '<b>' + r.score + '</b>') + '</div>' +
      '<p>' + t('rv.p') + '</p>' +
      '<button type="button" class="primary next go-on">' + adLabel('rv.go') + '</button><button type="button" class="ghost-btn stop">' + t('rv.stop') + '</button><div class="rv-msg"></div>');
    var qn = $('chRun').querySelector('.run-q'); qn.parentNode.insertBefore(box, qn);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    box.querySelector('.stop').addEventListener('click', function () { if (run === r) finishRun(); });
    box.querySelector('.go-on').addEventListener('click', function () {
      var bt = this; bt.disabled = true; bt.textContent = Ads.on ? t('ad.loading') : t('rv.going');
      Ads.rewarded(function (ok) {
        if (run !== r) return;
        if (!ok) { bt.disabled = false; bt.textContent = adLabel('rv.go'); box.querySelector('.rv-msg').textContent = t('rv.fail'); return; }
        r.revived = true; nextQ();
      });
    });
  }
  var fbTimer = null, fbDone = null;
  function showFb(ok, line, pen, ms, done) {
    var fb = $('fb');
    fb.className = 'fb ' + (ok ? 'ok' : 'ng');
    fb.innerHTML = '<b>' + (ok ? '✓ ' + t('v.ok') : '✗ ' + t('v.ng')) + (pen ? '<em>' + pen + '</em>' : '') + '</b><span>' + line + '</span><i>' + t('fb.tap') + '</i>';
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

  function abortRun() { hideFb(); run = null; $('chRun').hidden = true; $('chEnd').hidden = true; $('chHome').hidden = false; renderHome(); window.scrollTo(0, 0); updateBanner(); }

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
    var avg = n ? r.items.reduce(function (s, it) { return s + it.ms; }, 0) / n : null;
    var bigTxt = r.mode === 'sprint' ? (value === null ? t('end.dnf') : fmtTime(value)) : r.mode === 'review' ? ok + ' / ' + n : String(value);
    var unit = r.mode === 'survival' ? t('end.u_survival') : r.mode === 'attack' ? t('end.u_attack') :
      r.mode === 'sprint' ? (r.pen ? t('end.u_sprint_pen', fmtTime(r.active), r.pen / 1000) : t('end.u_sprint_clean')) : t('end.u_review', notesFor(r.type).length);
    var html = '<div class="end-hero"><div class="k">' + m.en + ' · ' + typeName(r.type) + '</div><div class="v">' + bigTxt + '</div><div class="u">' + unit + '</div>' +
      (isNew ? '<span class="badge-new">' + t('end.new') + '</span>' : prev !== null && value !== null ? '<div class="end-best">' + t('end.best', m.fmt(prev)) + '</div>' : '') +
      (r.revived ? '<div class="end-best">' + t('end.revived') + '</div>' : '') + '</div>';
    html += '<div class="today"><div><div class="k">' + t('end.cw') + '</div><div class="v">' + ok + '<small> / ' + (n - ok) + '</small></div></div>' +
      '<div><div class="k">' + t('st.acc') + '</div><div class="v">' + (n ? Math.round(ok / n * 100) + '<small>%</small>' : '–') + '</div></div>' +
      '<div><div class="k">' + t('ch.avg') + '</div><div class="v">' + (avg !== null ? (avg / 1000).toFixed(1) + '<small>' + t('u.s') + '</small>' : '–') + '</div></div></div>';
    var last = r.items[n - 1];
    if (r.mode === 'survival' && last && !last.res.ok) {
      html += '<div class="sec-h"><span>' + t('end.ended_at', typeName(last.t)) + '</span></div><div class="explain">' + verdictHtml(last.res) + M[last.t].explain(last.q, last.a, last.res) + seeHtml(last.t, last.q) + '</div>';
    }
    html += '<div class="btn-row"><button type="button" class="primary again">' + t('end.again') + '</button><button type="button" class="ghost-btn home">' + t('end.modes') + '</button></div>';
    if (n) {
      html += '<div class="sec-h"><span>' + t('end.review') + '</span><span class="faint">' + t('end.tap') + '</span></div><div class="rv">' + r.items.map(function (it, i) {
        return '<div class="rv-row" data-i="' + i + '"><span class="ix">' + (i + 1) + '</span><span class="ds"><b>' + typeName(it.t) + '</b> ' + M[it.t].summary(it.q) + '</span><span class="' + (it.res.ok ? 'ok' : 'ng') + '">' + (it.res.ok ? '✓' : '✗') + ' <small>' + fmtSec(it.ms) + '</small></span></div><div class="rv-detail" hidden></div>';
      }).join('') + '</div>';
    }
    var end = $('chEnd');
    end.innerHTML = html;
    $('chRun').hidden = true; end.hidden = false; window.scrollTo(0, 0);
    end.querySelector('.again').addEventListener('click', function () {
      maybeInterstitial(function () {
        if (r.mode === 'review' && !notesFor(r.type).length) { abortRun(); return; }
        startRun(r.mode, r.type);
      });
    });
    end.querySelector('.home').addEventListener('click', function () { maybeInterstitial(abortRun); });
    end.querySelectorAll('.rv-row').forEach(function (row) {
      row.addEventListener('click', function () {
        var it = r.items[+row.getAttribute('data-i')], det = row.nextSibling;
        if (det.hidden && !det.innerHTML) det.innerHTML = '<div class="rv-pad">' + verdictHtml(it.res) + M[it.t].explain(it.q, it.a, it.res) + seeHtml(it.t, it.q) + '</div>';
        det.hidden = !det.hidden; row.classList.toggle('open', !det.hidden);
      });
    });
    run = null;
    store.ads.runs++; save();
    updateBanner();
  }

  /* =========================================================
     GUIDE (terms · formulas · calculators · tables · data)
     ========================================================= */
  var G = window.GUIDE, GT = window.GUIDE_TX[I.lang] || window.GUIDE_TX.en;
  function gtx(sec, id) { var s = GT[sec] && GT[sec][id]; if (!s && window.GUIDE_TX.en[sec]) s = window.GUIDE_TX.en[sec][id]; return s; }
  var SEE = {
    pot: ['potodds', 'rule24', 'ev', 'dirty'], outs: ['outs', 'rule24', 'dirty', 'backdoor'], pre: ['rfi', 'range', 'steal', 'ipoop'],
    vs: ['3bet', 'coldcall', 'squeeze', 'ipoop'], bb: ['potodds', 'eqr', 'ipoop'], post: ['implied', 'ipoop', 'eqr'], concept: ['ipoop', 'steal', 'squeeze'],
    mu: ['equity', 'domination', 'coinflip']
  };
  function termTitle(id) { var x = gtx('term', id); return x ? x[0] : id; }
  function seeHtml(type, q) {
    var ids = SEE[type === 'pos' ? q.kind : type] || [];
    if (!ids.length) return '';
    return '<div class="see"><span>' + t('g.see') + '</span>' + ids.map(function (id) { return '<button type="button" data-term="' + id + '">' + termTitle(id).split(' (')[0] + '</button>'; }).join('') + '</div>';
  }
  function C2(n, k) { if (k < 0 || k > n) return 0; var r = 1; for (var i = 1; i <= k; i++) r = r * (n - k + i) / i; return r; }
  function pct(x, d) { return (x * 100).toFixed(d === undefined ? 1 : d) + '%'; }
  var guideBuilt = false, guideCalc = { pot: 100, bet: 50, stack: 400, outs: 9, street: 'flop' };
  var SECS = ['lang', 'terms', 'formulas', 'calc', 'equity', 'outs', 'prob', 'seats', 'ranges', 'mu', 'rules', 'data'];

  function buildGuide() {
    var g = $('guide');
    var h = '<div class="g-top"><div class="g-search"><input id="gq" type="search" placeholder="' + t('g.search') + '"><button type="button" id="gqx" hidden>✕</button></div>' +
      '<div class="g-chips">' + SECS.map(function (s) { return '<button type="button" data-sec="' + s + '">' + t('gs.' + s) + '</button>'; }).join('') + '</div></div>';
    h += '<div id="gEmpty" class="g-empty" hidden>' + t('g.no_result') + '</div>';

    // language
    h += '<section class="g-sec" id="g-lang"><h2>' + t('gs.lang') + ' <small>Language</small></h2><div class="lang-grid">' + I.LANGS.map(function (L) {
      return '<button type="button" data-lang="' + L[0] + '" class="' + (L[0] === I.lang ? 'on' : '') + '"><b>' + L[1] + '</b><small>' + L[2] + '</small></button>';
    }).join('') + '</div><div class="note">' + t('g.lang_note') + '</div></section>';

    // terms
    h += '<section class="g-sec" id="g-terms"><h2>' + t('g.terms_h') + ' <small>' + t('g.count', G.terms.length) + '</small></h2>';
    G.cats.forEach(function (c) {
      h += '<div class="g-cat" data-cat="' + c + '">' + t('gc.' + c) + '</div>';
      G.terms.filter(function (x) { return x.c === c; }).forEach(function (x) {
        var tx = gtx('term', x.id) || [x.id, ''], sub = I.lang === 'en' ? '' : x.en;
        h += '<div class="term" id="term-' + x.id + '" data-s="' + (tx[0] + ' ' + x.en + ' ' + tx[1]).toLowerCase().replace(/"/g, '') + '"><div class="tt"><b>' + tx[0] + '</b><span>' + sub + '</span></div><p>' + tx[1] + '</p>' +
          (tx[2] ? '<div class="tex">' + t('g.ex') + ' ' + tx[2] + '</div>' : '') + (x.f ? '<button type="button" class="tlink" data-formula="' + x.f + '">' + t('g.see_formula') + '</button>' : '') + '</div>';
      });
    });
    h += '</section>';

    // formulas
    h += '<section class="g-sec" id="g-formulas"><h2>' + t('gs.formulas') + '</h2>' + G.formulas.map(function (id) {
      var f = gtx('formula', id) || [id, '', '', ''];
      return '<div class="fcard" id="f-' + id + '" data-s="' + (f[0] + ' ' + f[1] + ' ' + f[3]).toLowerCase().replace(/"/g, '') + '"><div class="ft">' + f[0] + '</div><div class="ff">' + f[1] + '</div><div class="fex">' + t('g.ex') + ' ' + f[2] + '</div><p>' + f[3] + '</p></div>';
    }).join('') + '</section>';

    // calculators
    h += '<section class="g-sec" id="g-calc"><h2>' + t('calc.h') + '</h2>' +
      '<div class="calc"><div class="cin"><label>' + t('m.pot') + '<input type="number" inputmode="decimal" id="cPot"></label><label>' + t('m.bet') + '<input type="number" inputmode="decimal" id="cBet"></label><label>' + t('calc.stack') + '<input type="number" inputmode="decimal" id="cStack"></label></div><div class="cout" id="cOut1"></div></div>' +
      '<div class="calc"><div class="cin2"><span class="field-label">' + t('calc.outs') + '</span><div class="stepper" id="cOutsSt"><button type="button" data-d="-1">−</button><output id="cOuts"></output><button type="button" data-d="1">+</button></div>' +
      '<div class="seg" id="cStreet"><button type="button" data-v="flop">' + t('calc.flop2') + '</button><button type="button" data-v="turn">' + t('calc.turn1') + '</button></div></div><div class="cout" id="cOut2"></div></div></section>';

    // equity calculator
    h += '<section class="g-sec" id="g-equity"><h2>' + t('eqc.h') + ' <small>' + t('eqc.sub') + '</small></h2><div class="calc">' +
      '<div class="eslots" id="eSlots"></div><div class="epick" id="ePick"></div>' +
      '<div class="btn-row"><button type="button" class="primary" id="eRun">' + t('eqc.run') + '</button><button type="button" class="ghost-btn" id="eClear">' + t('eqc.clear') + '</button></div><div id="eOut"></div>' +
      note(t('eqc.note')) + '</div></section>';

    // outs table
    var rows = [[2, 'ot.2'], [3, 'ot.3'], [4, 'ot.4'], [5, 'ot.5'], [6, 'ot.6'], [7, 'ot.7'], [8, 'ot.8'], [9, 'ot.9'], [10, 'ot.10'], [12, 'ot.12'], [15, 'ot.15']];
    h += '<section class="g-sec" id="g-outs"><h2>' + t('gs.outs') + '</h2><div class="otable"><div class="oh">' + t('ot.h_outs') + '</div><div class="oh">' + t('ot.h_spot') + '</div><div class="oh">' + t('ot.h_turn') + '<br><small>×2 / ' + t('ot.exact') + '</small></div><div class="oh">' + t('ot.h_flop') + '<br><small>×4 / ' + t('ot.exact') + '</small></div>' +
      rows.map(function (r) {
        var n = r[0], t1 = n / 46, t2 = 1 - (47 - n) / 47 * (46 - n) / 46;
        return '<div class="on">' + n + '</div><div class="od">' + t(r[1]) + '</div><div class="ov">' + (n * 2) + ' / ' + pct(t1) + '</div><div class="ov">' + (n * 4) + ' / ' + pct(t2) + '</div>';
      }).join('') + '</div>' + note(t('ot.note', pct(1 - 32 / 47 * 31 / 46))) + '</section>';

    // probabilities
    var maxP = 43.8;
    h += '<section class="g-sec" id="g-prob"><h2>' + t('gs.prob_h') + '</h2><div class="g-sub">' + t('pr.sub') + '</div><div class="hrank">' +
      G.hand7.map(function (p, i) {
        var hx = GT.hands ? GT.hands[i] : window.GUIDE_TX.en.hands[i];
        return '<div class="hr"><span class="hi">' + (i + 1) + '</span><div><b>' + hx[0] + '</b><span class="hx">' + G.handEx[i] + '</span><small>' + hx[1] + '</small></div><div class="hp"><span class="hb"><i style="width:' + Math.max(1.5, p / maxP * 100) + '%"></i></span>' + (p < 1 ? p.toFixed(p < 0.1 ? 3 : 2) : p.toFixed(1)) + '%</div></div>';
      }).join('') + '</div>';
    var pr = [
      ['pr.pp', '78 ÷ 1326', 78 / 1326], ['pr.aa', '6 ÷ 1326', 6 / 1326], ['pr.suited', '312 ÷ 1326', 312 / 1326], ['pr.ak', '16 ÷ 1326', 16 / 1326],
      ['pr.set', '1 − C(48,3) ÷ C(50,3)', 1 - C2(48, 3) / C2(50, 3)],
      ['pr.pairup', '1 − C(44,3) ÷ C(50,3)', 1 - C2(44, 3) / C2(50, 3)],
      ['pr.flush', 'C(11,3) ÷ C(50,3)', C2(11, 3) / C2(50, 3)],
      ['pr.fd', 'C(11,2) × 39 ÷ C(50,3)', C2(11, 2) * 39 / C2(50, 3)],
      ['pr.fd_river', '1 − 38/47 × 37/46', 1 - 38 / 47 * 37 / 46],
      ['pr.fd_turn', '9 ÷ 46', 9 / 46]
    ];
    h += '<div class="g-sub">' + t('pr.common') + '</div><div class="ptable">' + pr.map(function (r) { return '<div class="pl">' + t(r[0]) + '<small>' + r[1] + '</small></div><div class="pv2">' + pct(r[2], r[2] < 0.01 ? 2 : 1) + '</div>'; }).join('') + '</div></section>';

    // seats
    var RFIp = {}; E.POSITIONS.forEach(function (p) { RFIp[p] = E.rangePct(p); });
    h += '<section class="g-sec" id="g-seats"><h2>' + t('gs.seats') + '</h2><div class="seat-table">' + SEATS.map(function (s) {
      var sx = gtx('seat', s) || ['', ''];
      return '<div class="st-row"><b>' + s + '</b><div><span>' + sx[0] + ' <em>' + G.seatEn[s] + '</em></span><small>' + sx[1] + '</small></div><span class="st-p">' + (RFIp[s] !== undefined ? 'RFI ' + f1(RFIp[s]) + '%' : '') + '</span></div>';
    }).join('') + '</div>' +
      '<div class="g-sub">' + t('se.order') + '</div><div class="ord-row"><span class="ol">' + t('se.pre') + '</span>' + SEATS.map(function (s) { return '<span>' + s + '</span>'; }).join('<i>→</i>') + '</div>' +
      '<div class="ord-row"><span class="ol">' + t('se.post') + '</span>' + POST_ORDER.map(function (s) { return '<span>' + s + '</span>'; }).join('<i>→</i>') + '</div>' +
      note(t('se.note')) + '</section>';

    // ranges
    h += '<section class="g-sec" id="g-ranges"><h2>' + t('rg.h') + ' <small>' + t('rg.app') + '</small></h2><div class="seg" id="rMode"><button type="button" data-v="rfi">' + t('rg.rfi') + '</button><button type="button" data-v="vs">' + t('pk.vs') + '</button></div>' +
      '<div class="type-chips sub" id="rKeys"></div><div id="rGrid"></div></section>';

    // matchups
    h += '<section class="g-sec" id="g-mu"><h2>' + t('gm.h') + ' <small>' + t('gm.sub') + '</small></h2>' + G.matchups.map(function (m) {
      var A = m.a.split(' ').map(E.cardFromCode), B = m.b.split(' ').map(E.cardFromCode), ea = m.eq - m.tie / 2, eb = 100 - m.eq - m.tie / 2;
      return '<div class="mrow"><div class="mh"><b>' + m.k + '</b><span>' + t('ck.' + m.d) + '</span></div><div class="mc2">' + A.map(function (c) { return mc(c); }).join('') + '<em>vs</em>' + B.map(function (c) { return mc(c); }).join('') + '</div>' +
        '<div class="stack sm"><div class="a" style="width:' + ea + '%"></div><div class="t" style="width:' + m.tie + '%"></div><div class="b" style="width:' + eb + '%"></div></div>' +
        '<div class="stack-legend"><span class="a">' + m.eq.toFixed(1) + '%</span><span class="muted">' + t('mu.tie', m.tie.toFixed(1)) + '</span><span class="b">' + (100 - m.eq).toFixed(1) + '%</span></div></div>';
    }).join('') + note(t('gm.note')) + '</section>';

    // rules
    h += '<section class="g-sec" id="g-rules"><h2>' + t('gr.h') + '</h2>' + G.rules.map(function (id) { var r = gtx('rule', id) || [id, '']; return '<div class="rule"><b>' + r[0] + '</b><p>' + r[1] + '</p></div>'; }).join('') + '</section>';

    // data
    h += '<section class="g-sec" id="g-data"><h2>' + t('gd.h') + '</h2>' +
      '<div class="rule"><b>' + t('gd.goal') + '</b><div class="chips" id="goalChips">' + [20, 30, 50, 100].map(function (n) { return '<button type="button" data-g="' + n + '">' + n + '</button>'; }).join('') + '</div></div>' +
      '<div class="rule"><b>' + t('gd.backup') + '</b><p>' + t('gd.backup_p') + '</p><textarea id="bkOut" readonly rows="3"></textarea><div class="btn-row"><button type="button" class="ghost-btn" id="bkMake">' + t('gd.make') + '</button><button type="button" class="ghost-btn" id="bkCopy">' + t('gd.copy') + '</button></div></div>' +
      '<div class="rule"><b>' + t('gd.restore') + '</b><p>' + t('gd.restore_p') + '</p><textarea id="bkIn" rows="3" placeholder="' + t('gd.paste') + '"></textarea><div class="btn-row"><button type="button" class="ghost-btn" id="bkLoad">' + t('gd.restore') + '</button><span id="bkMsg" class="bk-msg"></span></div></div>' +
      '<div class="rule"><b>' + t('gd.ads') + '</b><p>' + t(Ads.on ? 'gd.ads_on' : 'gd.ads_off') + ' <a class="tlink" href="privacy.html">' + t('gd.privacy') + '</a></p></div>' +
      '<div class="rule"><b>' + t('gd.wipe') + '</b><p>' + t('gd.wipe_p') + '</p><span id="wipeWrap"></span></div>' +
      '<div class="ver">Holdem Lab v' + APP_VER + '</div></section>';
    g.innerHTML = h;
    wireGuide();
    guideBuilt = true;
  }

  function wireGuide() {
    var g = $('guide');
    var q = $('gq'), qx = $('gqx');
    function filter() {
      var s = q.value.trim().toLowerCase(); qx.hidden = !s;
      g.classList.toggle('searching', !!s);
      var any = false;
      g.querySelectorAll('.term, .fcard').forEach(function (x) { var hit = !s || x.getAttribute('data-s').indexOf(s) >= 0; x.hidden = !hit; if (hit && s) any = true; });
      g.querySelectorAll('.g-cat').forEach(function (c) {
        var vis = false, n = c.nextElementSibling;
        while (n && n.classList.contains('term')) { if (!n.hidden) vis = true; n = n.nextElementSibling; }
        c.hidden = !vis;
      });
      $('gEmpty').hidden = !s || any;
    }
    q.addEventListener('input', filter);
    qx.addEventListener('click', function () { q.value = ''; filter(); });
    g.querySelectorAll('.g-chips button').forEach(function (bt) {
      bt.addEventListener('click', function () { q.value = ''; filter(); scrollToEl($('g-' + bt.getAttribute('data-sec'))); });
    });
    g.addEventListener('click', function (e) {
      var f = e.target.closest('[data-formula]'); if (f) { q.value = ''; filter(); flash($('f-' + f.getAttribute('data-formula'))); return; }
      var lg = e.target.closest('[data-lang]'); if (lg && lg.getAttribute('data-lang') !== I.lang) { I.setLang(lg.getAttribute('data-lang')); store.settings.tab = 'pot'; save(); location.reload(); }
    });
    $('cPot').value = guideCalc.pot; $('cBet').value = guideCalc.bet; $('cStack').value = guideCalc.stack;
    ['cPot', 'cBet', 'cStack'].forEach(function (id) { $(id).addEventListener('input', calc); });
    $('cOutsSt').addEventListener('click', function (e) { var bt = e.target.closest('button'); if (!bt) return; guideCalc.outs = Math.max(0, Math.min(25, guideCalc.outs + +bt.getAttribute('data-d'))); calc(); });
    $('cStreet').addEventListener('click', function (e) { var bt = e.target.closest('button'); if (!bt) return; guideCalc.street = bt.getAttribute('data-v'); calc(); });
    calc();
    eqInit();
    var rMode = 'rfi', rKey = 'UTG';
    function drawRange() {
      $('rMode').querySelectorAll('button').forEach(function (bt) { bt.classList.toggle('on', bt.getAttribute('data-v') === rMode); });
      var keys = rMode === 'rfi' ? E.POSITIONS : Object.keys(E.VS_OPEN);
      if (keys.indexOf(rKey) < 0) rKey = keys[0];
      $('rKeys').innerHTML = keys.map(function (k) {
        var lab = rMode === 'rfi' ? k : t('rg.vs_key', k.split('>')[0], k.split('>')[1]);
        return '<button type="button" data-k="' + k + '" class="' + (k === rKey ? 'on' : '') + '">' + lab + '</button>';
      }).join('');
      if (rMode === 'rfi') {
        $('rGrid').innerHTML = '<div class="legend3"><span class="c">' + act('open') + ' ' + f1(E.rangePct(rKey)) + '%</span><span class="f">' + act('fold') + '</span></div>' + rangeGrid(rKey, null) + note(E.RANGE_TEXT[rKey]);
      } else {
        var T = E.VS_OPEN[rKey], TX = E.VS_OPEN_TEXT[rKey], rp = E.setPct(T.r), cp = E.setPct(T.c);
        $('rGrid').innerHTML = legend3(rp, cp) + grid3(T, null) + note(act('3bet') + ': ' + TX.r + (TX.c ? '<br>' + act('call') + ': ' + TX.c : '<br>' + t('rg.no_call')));
      }
    }
    $('rMode').addEventListener('click', function (e) { var bt = e.target.closest('button'); if (!bt) return; rMode = bt.getAttribute('data-v'); drawRange(); });
    $('rKeys').addEventListener('click', function (e) { var bt = e.target.closest('button'); if (!bt) return; rKey = bt.getAttribute('data-k'); drawRange(); });
    drawRange();
    function drawGoal() { $('goalChips').querySelectorAll('button').forEach(function (bt) { bt.classList.toggle('on', +bt.getAttribute('data-g') === store.settings.goal); }); }
    $('goalChips').addEventListener('click', function (e) { var bt = e.target.closest('button'); if (!bt) return; store.settings.goal = +bt.getAttribute('data-g'); save(); drawGoal(); renderGoal(); });
    drawGoal();
    $('bkMake').addEventListener('click', function () { $('bkOut').value = JSON.stringify(store); });
    $('bkCopy').addEventListener('click', function () {
      if (!$('bkOut').value) $('bkOut').value = JSON.stringify(store);
      $('bkOut').select();
      var ok = false; try { ok = document.execCommand('copy'); } catch (e) { ok = false; }
      $('bkCopy').textContent = ok ? t('gd.copied') : t('gd.copy_manual');
      setTimeout(function () { $('bkCopy').textContent = t('gd.copy'); }, 1600);
    });
    $('bkLoad').addEventListener('click', function () {
      var msg = $('bkMsg');
      try {
        var d = JSON.parse($('bkIn').value);
        if (!d || typeof d !== 'object' || !d.stats) throw new Error('bad');
        localStorage.setItem(KEY, JSON.stringify(d));
        msg.textContent = t('gd.restored'); setTimeout(function () { location.reload(); }, 600);
      } catch (e) { msg.textContent = t('gd.restore_err'); }
    });
    confirmButton($('wipeWrap'), t('gd.wipe_btn'), function () { try { localStorage.removeItem(KEY); } catch (e) { /* ignore */ } location.reload(); });
  }

  function calc() {
    var P = +$('cPot').value || 0, B = +$('cBet').value || 0, S = +$('cStack').value || 0;
    guideCalc.pot = P; guideCalc.bet = B; guideCalc.stack = S;
    var need = P + 2 * B > 0 ? B / (P + 2 * B) : 0;
    var cells = [
      [t('calc.need'), pct(need), B + ' ÷ (' + P + ' + ' + B + ' + ' + B + ')'],
      [t('calc.ratio'), B > 0 ? ((P + B) / B).toFixed(2) + ' : 1' : '–', t('calc.ratio_f')],
      ['MDF', P + B > 0 ? pct(P / (P + B)) : '–', t('calc.mdf_f')],
      [t('calc.bluff'), P + B > 0 ? pct(B / (P + B)) : '–', t('calc.bluff_f')],
      [t('calc.ratio_river'), pct(need), t('calc.ratio_river_f')],
      [t('calc.spr'), S > 0 && P + 2 * B > 0 ? (S / (P + 2 * B)).toFixed(1) : '–', t('calc.spr_f')]
    ];
    $('cOut1').innerHTML = cells.map(function (c) { return '<div><span>' + c[0] + '</span><b>' + c[1] + '</b><small>' + c[2] + '</small></div>'; }).join('');
    var n = guideCalc.outs, flop = guideCalc.street === 'flop';
    $('cOuts').textContent = n;
    $('cStreet').querySelectorAll('button').forEach(function (bt) { bt.classList.toggle('on', bt.getAttribute('data-v') === guideCalc.street); });
    var rule = n * (flop ? 4 : 2), exact = flop ? 1 - (47 - n) / 47 * (46 - n) / 46 : n / 46;
    var corr = flop && n > 8 ? rule - (n - 8) : null;
    var verdict = exact > need ? t('calc.call_good') : act('fold');
    var ev = exact * (P + B) - (1 - exact) * B;
    var xneed = exact > 0 ? B * (1 - exact) / exact - (P + B) : Infinity;
    $('cOut2').innerHTML =
      '<div><span>' + t('calc.rule', flop ? 4 : 2) + '</span><b>' + rule + '%</b><small>' + (corr !== null ? t('calc.corr', corr) : '&nbsp;') + '</small></div>' +
      '<div><span>' + t('calc.exact') + '</span><b>' + pct(exact) + '</b><small>' + (flop ? '1 − (' + (47 - n) + '/47 × ' + (46 - n) + '/46)' : n + ' ÷ 46') + '</small></div>' +
      '<div class="wide ' + (exact > need ? 'y' : 'n') + '"><span>' + t('calc.cmp') + '</span><b>' + pct(exact) + ' ' + (exact > need ? '&gt;' : '&lt;') + ' ' + pct(need) + ' → ' + verdict + '</b><small>' + t('calc.ev', sgn(ev)) + (exact <= need && isFinite(xneed) ? ' · ' + t('calc.implied', Math.round(xneed)) : '') + '</small></div>';
  }

  /* equity calculator with card picker */
  var eq = { slots: [null, null, null, null, null, null, null, null, null], active: 0 };
  function slotLab(i) { return i < 2 ? 'A' : i < 4 ? 'B' : i < 7 ? 'Flop' : i === 7 ? 'Turn' : 'River'; }
  function eqInit() {
    var pk = $('ePick'), html = '';
    for (var s = 0; s < 4; s++) {
      html += '<div class="prow">';
      for (var r = 12; r >= 0; r--) { var c = r * 4 + s; html += '<button type="button" data-c="' + c + '" class="' + (s === 1 || s === 2 ? 'red' : '') + '">' + (E.RANKS[r] === 'T' ? '10' : E.RANKS[r]) + '<small>' + E.SUIT_SYM[s] + '</small></button>'; }
      html += '</div>';
    }
    pk.innerHTML = html;
    pk.addEventListener('click', function (e) {
      var bt = e.target.closest('button'); if (!bt || bt.disabled) return;
      eq.slots[eq.active] = +bt.getAttribute('data-c');
      var nx = eq.slots.indexOf(null); eq.active = nx < 0 ? eq.active : nx;
      eqDraw();
    });
    $('eSlots').addEventListener('click', function (e) {
      var bt = e.target.closest('[data-i]'); if (!bt) return;
      var i = +bt.getAttribute('data-i');
      if (eq.slots[i] !== null && eq.active === i) eq.slots[i] = null;
      eq.active = i; eqDraw();
    });
    $('eClear').addEventListener('click', function () { eq.slots = [null, null, null, null, null, null, null, null, null]; eq.active = 0; $('eOut').innerHTML = ''; eqDraw(); });
    $('eRun').addEventListener('click', eqRun);
    eqDraw();
  }
  function eqDraw() {
    var used = {}; eq.slots.forEach(function (c) { if (c !== null) used[c] = 1; });
    var grp = [[0, 1, 'HAND A'], [2, 3, 'HAND B'], [4, 8, t('eqc.board')]];
    $('eSlots').innerHTML = grp.map(function (gg) {
      var h = '<div class="eg"><span class="row-label">' + gg[2] + '</span><div class="es">';
      for (var i = gg[0]; i <= gg[1]; i++) {
        var c = eq.slots[i];
        h += '<button type="button" data-i="' + i + '" class="slotb' + (i === eq.active ? ' act' : '') + (c !== null && isRed(c) ? ' red' : '') + (c !== null ? ' fill' : '') + '">' + (c !== null ? rankTxt(c) + E.SUIT_SYM[E.suitOf(c)] : '<small>' + slotLab(i) + '</small>') + '</button>';
      }
      return h + '</div></div>';
    }).join('');
    $('ePick').querySelectorAll('button').forEach(function (bt) { bt.disabled = !!used[+bt.getAttribute('data-c')]; });
    var s = eq.slots;
    $('eRun').disabled = !(s[0] !== null && s[1] !== null && s[2] !== null && s[3] !== null);
  }
  function eqRun() {
    var s = eq.slots, A = [s[0], s[1]], B = [s[2], s[3]];
    var board = s.slice(4).filter(function (c) { return c !== null; });
    var out = $('eOut');
    out.innerHTML = '<div class="loading">' + t('eqc.calculating') + '</div>';
    $('eRun').disabled = true;
    E.equityBoard(A, B, board, 100000, function (r) {
      $('eRun').disabled = false;
      var ka = board.length ? catName(E.category(E.evaluate(A.concat(board)))) : E.handKeyOf(A[0], A[1]);
      var kb = board.length ? catName(E.category(E.evaluate(B.concat(board)))) : E.handKeyOf(B[0], B[1]);
      out.innerHTML = eqBlock(ka, kb, r.win * 100, r.tie * 100, r.lose * 100, r.eqA * 100) +
        note(r.exact ? t('eqc.exact', r.n.toLocaleString()) : t('eqc.mc', r.n.toLocaleString(), (r.se * 100).toFixed(2)));
    });
  }

  function scrollToEl(x) { if (!x) return; var y = x.getBoundingClientRect().top + window.pageYOffset - 118; window.scrollTo({ top: y, behavior: 'smooth' }); }
  function flash(x) { if (!x) return; scrollToEl(x); x.classList.remove('flash'); void x.offsetWidth; x.classList.add('flash'); }
  function openTerm(id) {
    go('guide');
    var q = $('gq'); if (q && q.value) { q.value = ''; q.dispatchEvent(new Event('input')); }
    setTimeout(function () { flash($('term-' + id)); }, 80);
  }
  document.addEventListener('click', function (e) {
    var bt = e.target.closest('[data-term]'); if (!bt) return;
    e.stopPropagation(); openTerm(bt.getAttribute('data-term'));
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
    var c = store.days[dayKey()] || 0, g = store.settings.goal, x = $('goalMini');
    x.textContent = c + '/' + g; x.classList.toggle('done', c >= g);
    var box = document.querySelector('.goal');
    if (box) {
      box.querySelector('.gl').innerHTML = t('goal.today', b(c), g) + (c >= g ? ' · ' + t('goal.done') : '');
      box.querySelector('.gbar i').style.width = Math.min(100, c / g * 100) + '%';
      box.querySelector('.gs').innerHTML = t('goal.streak', b(streakDays()));
    }
  }

  /* =========================================================
     DAILY HAND + attendance streak
     one deterministic composite hand per local date (E.dailyHand) → 5 steps
     store.daily = { days:{key:{s,a}|{r:1}}, streak, best, last, cur:{k,a}, rep, total }
     ========================================================= */
  store.daily = Object.assign({ days: {}, streak: 0, best: 0, last: null, cur: null, rep: 0, total: 0 }, store.daily || {});
  var DL = store.daily;
  var FLAME = '<svg class="flame" viewBox="0 0 24 24" aria-hidden="true"><defs><linearGradient id="fg" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stop-color="#e07a3c"/><stop offset=".6" stop-color="#e8a24f"/><stop offset="1" stop-color="#f2cf7a"/></linearGradient></defs>' +
    '<path class="fo" fill="url(#fg)" d="M12 1.8c.9 3.2-1.2 4.9-2.6 6.6-1.5 1.8-3.4 3.9-3.4 7.1A6 6 0 0 0 12 21.6a6 6 0 0 0 6-6.1c0-2.6-1.2-4.6-2.6-6.2-.2 1.6-1 2.8-2.2 3.2.6-3.5-.2-7-1.2-10.7z"/>' +
    '<path class="fi" fill="#f7e2a6" d="M12.2 11.4c.3 1.6-.7 2.4-1.3 3.2-.5.6-.9 1.3-.9 2.2a2.1 2.1 0 0 0 4.2.1c0-1.4-.7-2.3-1.2-3 0 .5-.3 1-.7 1.2.2-1.3 0-2.5-.1-3.7z"/></svg>';
  var MILESTONES = [3, 7, 14, 21, 30, 50, 75, 100, 150, 200, 365];
  function dkOff(n) { var d = new Date(); d.setDate(d.getDate() + n); return dayKey(d); }
  function nDays(n) { return t(n === 1 ? 'd.day1' : 'd.days', n); }
  function bb(x) { return (Math.round(x * 10) / 10) % 1 ? (Math.round(x * 10) / 10).toFixed(1) : String(Math.round(x)); }
  function streakNow() { return DL.last === dkOff(0) || DL.last === dkOff(-1) ? DL.streak : 0; }
  function dailyDone(k) { var r = DL.days[k || dkOff(0)]; return !!(r && r.s !== undefined); }
  function canRepair() { return DL.last === dkOff(-2) && DL.streak >= 2 && Date.now() - (DL.rep || 0) > 7 * 864e5; }
  function doRepair() { var y = dkOff(-1); DL.days[y] = { r: 1 }; DL.last = y; DL.rep = Date.now(); save(); renderStreakChip(); }
  function completeDaily(score, answers) {
    var k = dkOff(0), from = streakNow(), oldBest = DL.best, fresh = DL.last !== k;
    if (fresh) { DL.streak = DL.last === dkOff(-1) ? DL.streak + 1 : 1; DL.last = k; DL.total = (DL.total || 0) + 1; }
    DL.best = Math.max(DL.best, DL.streak);
    DL.days[k] = { s: score, a: answers }; DL.cur = null;
    var ks = Object.keys(DL.days); if (ks.length > 90) ks.slice(0, ks.length - 90).forEach(function (x) { delete DL.days[x]; });
    save(); renderStreakChip();
    return { fresh: fresh, from: from, to: DL.streak, record: DL.streak > oldBest && DL.streak > 1, score: score };
  }
  function weekDots(anim) {
    var fmt = null;
    try { fmt = new Intl.DateTimeFormat(I.lang, { weekday: 'narrow' }); } catch (e) { fmt = null; }
    var h = '<div class="wk' + (anim ? ' anim' : '') + '">';
    for (var i = -6; i <= 0; i++) {
      var d = new Date(); d.setDate(d.getDate() + i);
      var k = dayKey(d), r = DL.days[k], cls = r && r.s !== undefined ? (r.s === 5 ? 'on pf' : 'on') : r && r.r ? 'rep' : i === 0 ? 'todo' : 'off';
      h += '<div class="wd ' + cls + (i === 0 ? ' now' : '') + '" style="--i:' + (i + 6) + '"><i></i><span>' + (fmt ? fmt.format(d) : d.getDate()) + '</span></div>';
    }
    return h + '</div>';
  }
  function untilMidnight() {
    var n = new Date(), m = new Date(n); m.setHours(24, 0, 0, 0);
    var s = Math.max(0, Math.floor((m - n) / 1000)), hh = Math.floor(s / 3600), mm = Math.floor(s % 3600 / 60);
    return hh + ':' + (mm < 10 ? '0' : '') + mm;
  }
  function renderStreakChip() {
    var c = $('streakChip'); if (!c) return;
    var n = streakNow(), done = dailyDone();
    c.classList.toggle('lit', done); c.classList.toggle('due', !done);
    c.querySelector('span').textContent = n;
    c.setAttribute('aria-label', t('d.chip', n));
  }
  function streakBlock() {
    var n = streakNow(), done = dailyDone(), msg;
    if (done) msg = t('d.done') + ' · <span class="d-next">' + t('d.next_in', untilMidnight()) + '</span>';
    else if (n > 0) msg = t('d.keep', b(nDays(n + 1)));
    else msg = DL.best > 0 ? t('d.broken') : t('d.sub');
    return '<div class="d-streak' + (done ? ' lit' : '') + '"><div class="d-fl">' + FLAME + '</div><div class="d-sn"><b>' + n + '</b><span>' + t('d.streak') + '</span></div>' +
      '<div class="d-sm"><span>' + t('d.best', nDays(DL.best)) + '</span><span>' + t('d.total', DL.total || 0) + '</span></div></div>' +
      weekDots(false) + '<div class="d-msg">' + msg + '</div>';
  }
  function repairHtml() {
    if (!canRepair() || dailyDone()) return '';
    return '<div class="d-repair"><b>' + t('d.repair_t') + '</b><p>' + t('d.repair_p', DL.streak) + '</p><button type="button" class="ghost-btn d-rep">' + adLabel('d.repair_btn') + '</button></div>';
  }
  function wireRepair(root, after) {
    var bt = root.querySelector('.d-rep'); if (!bt) return;
    bt.addEventListener('click', function () {
      bt.disabled = true; if (Ads.on) bt.textContent = t('ad.loading');
      Ads.rewarded(function (ok) {
        if (!ok) { bt.disabled = false; bt.textContent = t('ad.fail_retry'); return; }
        doRepair(); after();
      });
    });
  }
  function dailyCardHtml() {
    var k = dkOff(0), cur = DL.cur && DL.cur.k === k ? DL.cur.a.length : 0, done = dailyDone();
    return '<div class="d-card"><div class="d-ch"><span class="en">DAILY</span><b>' + t('d.title') + '</b><small>' + t('d.sub') + '</small></div>' + streakBlock() + repairHtml() +
      '<button type="button" class="' + (done ? 'ghost-btn' : 'primary') + ' d-go">' + (done ? t('d.view') : cur ? t('d.resume', cur) : t('d.start')) + '</button></div>';
  }
  function wireDailyCard(root, redraw) {
    var g = root.querySelector('.d-go'); if (g) g.addEventListener('click', function () { go('daily'); });
    wireRepair(root, redraw);
  }

  /* ---- the 5 steps ---- */
  var DQ = null;
  function dSteps(h) {
    var fa = E.analyzeOuts(h.hole, h.flop);
    var holeTxt = h.hole.map(function (c) { return mc(c); }).join('') + ' <span class="muted">(' + h.hk + ')</span>';
    var later = h.heroIP ? h.hero : h.villain;
    var w1 = Math.round(h.B1 / (h.P1 + h.B1) * 1000) / 10, w2 = Math.round(h.B1 / h.P1 * 1000) / 10;
    return [
      { title: t('d.s1'), input: 'choice',
        q: h.kind === 'open' ? t('d.q_open', h.hero, holeTxt) + '<br><b>' + t('d.q_open_a') + '</b>'
          : h.kind === 'bb' ? t('d.q_bb', h.villain, holeTxt) + '<br><b>' + t('d.q_bb_a') + '</b>'
          : t('d.q_vs', h.villain, h.hero, holeTxt) + '<br><b>' + t('d.q_vs_a') + '</b>',
        opts: h.kind === 'open' ? [['fold', act('fold')], ['open', act('open')]] : [['fold', act('fold')], ['call', act('call')], ['3bet', act('3bet')]],
        txt: function (v) { return act(v); },
        explain: function () {
          var s, st, pr = h.pre || h.ans[0];
          if (h.kind === 'open') {
            if (pr === 'fold') { s = t('d.e_open_fold', b(h.hk), h.hero, f1(E.rangePct(h.hero)), E.firstOpenPos(h.hk)); st = t('d.story_fold_go', h.villain, bb(h.P1)); }
            else { s = t('d.e_open', b(h.hk), h.hero, f1(E.rangePct(h.hero))) + (E.firstOpenPos(h.hk) === h.hero && h.hero !== 'UTG' ? ' ' + t('d.e_open_first', h.hero) : ''); st = t('d.story_open', h.villain, bb(h.P1)); }
          } else if (h.kind === 'bb') {
            if (pr === '3bet') { s = t('d.e_bb3', b(h.hk), h.villain); st = t('d.story_3bet', h.villain, bb(h.P1)); }
            else { s = t('d.e_bb', h.villain, b(h.hk)); st = t('d.story_bb', bb(h.P1)); }
          } else {
            if (pr === '3bet') { s = t('d.e_vs_3bet', b(h.hk), h.villain); st = t('d.story_vs_3bet', h.villain, bb(h.P1)); }
            else { s = t('d.e_vs_call', b(h.hk), h.villain); st = t('d.story_vs_call', bb(h.P1)); }
          }
          return note(s) + '<div class="d-story">' + st + '</div>';
        } },
      { title: t('d.s2'), input: 'choice', q: t('d.q_pos', b(h.hero), b(h.villain)), opts: [['IP', 'IP'], ['OOP', 'OOP']],
        txt: function (v) { return v; },
        explain: function () {
          return '<div class="ord-row"><span class="ol">' + t('se.post') + '</span>' + POST_ORDER.map(function (s) {
            return '<span class="' + (s === h.hero ? 'me' : s === h.villain ? 'vl' : 'dim') + '">' + s + '</span>';
          }).join('<i>→</i>') + '</div>' + note(t('d.e_pos', POST_ORDER.join(' → '), b(later), b(h.heroIP ? 'IP' : 'OOP')));
        } },
      { title: t('d.s3'), input: 'outs', q: t('d.q_outs'), txt: function (v) { return t('u.cards', v); },
        explain: function () { return outsBreakdown(fa); } },
      { title: t('d.s4'), input: 'choice', q: t(h.heroIP ? 'd.q_need_ip' : 'd.q_need_oop', bb(h.P1), bb(h.B1)) + '<br><b>' + t('d.q_need_a') + '</b>',
        opts: h.needOpts.map(function (x) { return [String(x), fmtPct(x) + '%']; }), cls: 'choices four',
        txt: function (v) { return fmtPct(+v) + '%'; },
        explain: function () {
          return '<div class="formula">' + bb(h.B1) + ' ÷ (' + bb(h.P1) + ' + ' + bb(h.B1) + ' + ' + bb(h.B1) + ') = <span class="hl">' + fmtPct(h.need1) + '%</span></div>' +
            note(t('d.e_need_trap', fmtPct(w1) + '%', fmtPct(w2) + '%')) + '<div class="d-story">' + t('d.story_call', bb(h.P2)) + '</div>';
        } },
      { title: t('d.s5'), input: 'choice', q: t(h.heroIP ? 'd.q_turn_ip' : 'd.q_turn_oop', mc(h.turn), h.outs, bb(h.P2), bb(h.B2)) + '<br><b>' + t('d.q_turn_a') + '</b>',
        opts: [['fold', act('fold')], ['call', act('call')]], txt: function (v) { return act(v); },
        explain: function () {
          var ans = h.ans[4];
          return '<div class="formula">' + bb(h.B2) + ' ÷ (' + bb(h.P2) + ' + ' + bb(h.B2) + ' + ' + bb(h.B2) + ') = <span class="wa">' + f1(h.need2) + '%</span></div>' +
            '<div class="formula">' + h.outs + ' × 2 = ' + h.eq2 + '% ' + (ans === 'call' ? '&gt;' : '&lt;') + ' ' + f1(h.need2) + '% → <span class="' + (ans === 'call' ? 'hl' : 'bd') + '">' + act(ans) + '</span></div>' +
            note(t('d.e_turn', h.outs, h.eq2, f1(h.need2) + '%', b(act(ans)))) +
            '<div class="d-story">' + t(h.riverHit ? 'd.river_hit' : 'd.river_miss', mc(h.river)) + '</div>' + note(t('d.river_note'));
        } }
    ];
  }
  function dJudge(h, i, v) { return String(v) === String(h.ans[i]); }
  function dTable(h, stage, done) {
    var board = stage >= 2 ? h.flop.slice() : [];
    if (stage >= 4) board.push(h.turn);
    if (done) board.push(h.river);
    var slots = []; for (var i = board.length; i < 5; i++) slots.push(i < 3 ? 'FLOP' : i === 3 ? 'TURN' : 'RIVER');
    var lab = done ? 'RIVER' : stage >= 4 ? 'TURN · POT ' + bb(h.P2) + 'BB' : stage >= 2 ? 'FLOP · POT ' + bb(h.P1) + 'BB' : 'PREFLOP · ' + h.hero + ' vs ' + h.villain;
    var p = panel(lab, [el('div', 'row-label', 'BOARD'), cardRow('board', board, {}, slots), el('div', 'row-label', 'HERO · ' + h.hero), cardRow('hole', h.hole, {})]);
    if (stage < 2) {
      var hi = SEATS.indexOf(h.hero);
      p.appendChild(el('div', 'seats s7', SEATS.map(function (s, i) {
        var cls = '', sub = '';
        if (s === h.hero) { cls = 'me'; sub = 'YOU'; }
        else if (h.kind !== 'open' && s === h.villain) { cls = 'opener'; sub = 'RAISE'; }
        else if (h.kind === 'bb' || i < hi) { cls = 'folded'; sub = 'FOLD'; }
        else sub = t('seat.wait');
        return '<div class="seat ' + cls + '">' + s + '<small>' + sub + '</small></div>';
      }).join('')));
    }
    return p;
  }
  function renderDaily() {
    var k = dkOff(0);
    if (!DQ || DQ.k !== k) {
      var rec = DL.days[k], a = rec && rec.a ? rec.a.slice() : DL.cur && DL.cur.k === k ? DL.cur.a.slice() : [];
      DQ = { k: k, h: E.dailyHand(k), a: a, stage: a.length, fx: null };
    }
    drawDaily();
  }
  function drawDaily() {
    var root = $('daily'), h = DQ.h, steps = dSteps(h), done = DQ.a.length >= 5 && dailyDone(DQ.k);
    var date = DQ.k; try { date = new Intl.DateTimeFormat(I.lang, { month: 'long', day: 'numeric', weekday: 'short' }).format(new Date()); } catch (e) { /* keep */ }
    root.innerHTML = '';
    var head = el('div', 'd-head', '<div class="d-ch"><span class="en">DAILY · ' + date + '</span><b>' + t('d.title') + '</b><small>' + t('d.same') + '</small></div>' +
      '<div class="d-prog">' + steps.map(function (s, i) {
        var cls = i < DQ.a.length ? (dJudge(h, i, DQ.a[i]) ? 'ok' : 'ng') : i === DQ.stage ? 'cur' : '';
        return '<div class="' + cls + '"><i></i><span>' + s.title + '</span></div>';
      }).join('') + '</div>');
    root.appendChild(head);
    root.appendChild(dTable(h, Math.min(DQ.stage, 4), done));
    for (var i = 0; i < steps.length && i <= DQ.stage; i++) {
      var s = steps[i], answered = i < DQ.a.length;
      var card = el('div', 'd-step' + (answered ? ' answered' : ' active'));
      card.innerHTML = '<div class="step-h"><span class="i">0' + (i + 1) + '</span><span class="t">' + s.title + '</span></div><div class="d-q">' + s.q + '</div>';
      root.appendChild(card);
      if (answered) {
        var v = DQ.a[i], ok = dJudge(h, i, v);
        if (s.input === 'choice') {
          var ch = choices(s.opts, s.cls || (s.opts.length === 2 ? 'choices two' : 'choices three'), { onReady: function () {} });
          ch.lock([String(h.ans[i])], String(v)); card.appendChild(ch.el);
        } else {
          card.appendChild(el('div', 'd-outs-ans', '<span class="' + (ok ? 'y' : 'n') + '">' + t('v.mine', s.txt(v)) + '</span>'));
        }
        card.appendChild(el('div', 'explain d-ex', verdictHtml({ ok: ok, correctTxt: s.txt(h.ans[i]), mineTxt: ok ? '' : s.txt(v) }) + '<div class="step">' + s.explain() + '</div>'));
      } else {
        activeStep(card, s, i);
      }
    }
    if (DQ.a.length > DQ.stage) {
      var nx = el('button', 'primary', t('d.next_step')); nx.type = 'button';
      nx.addEventListener('click', function () { DQ.stage = DQ.a.length; drawDaily(); var a = document.querySelector('.d-step.active'); if (a) a.scrollIntoView({ behavior: 'smooth', block: 'start' }); });
      root.appendChild(nx);
    }
    if (done) root.appendChild(resultBlock());
    updateBanner();
  }
  function activeStep(card, s, i) {
    var btn = el('button', 'primary', t('btn.check')); btn.type = 'button'; btn.disabled = true;
    var ctrl;
    if (s.input === 'choice') {
      ctrl = choices(s.opts, s.cls || (s.opts.length === 2 ? 'choices two' : 'choices three'), { onReady: function (r) { btn.disabled = !r; } });
    } else {
      ctrl = stepper(0, 25, true, function () { btn.disabled = false; });
      var f = el('div', 'field'); f.appendChild(ctrl.el); card.appendChild(f);
    }
    if (s.input === 'choice') card.appendChild(ctrl.el);
    card.appendChild(btn);
    btn.addEventListener('click', function () {
      var v = ctrl.val(); if (v === null || v === undefined) return;
      DQ.a.push(s.input === 'outs' ? +v : String(v));
      var dk = dayKey(); store.days[dk] = (store.days[dk] || 0) + 1; renderGoal();
      if (DQ.a.length >= 5) {
        var score = 0; DQ.a.forEach(function (x, j) { if (dJudge(DQ.h, j, x)) score++; });
        DQ.fx = completeDaily(score, DQ.a.slice());
        DQ.stage = 5;
      } else { DL.cur = { k: DQ.k, a: DQ.a.slice() }; save(); }
      drawDaily();
      var last = document.querySelectorAll('.d-step')[i];
      if (last) setTimeout(function () { last.querySelector('.d-ex').scrollIntoView({ behavior: 'smooth', block: 'start' }); }, 60);
      if (DQ.fx && DQ.fx.fresh) { var r = DQ.fx; DQ.fx = null; setTimeout(function () { streakFx(r); }, 650); }
    });
  }
  function resultBlock() {
    var h = DQ.h, steps = dSteps(h), rec = DL.days[DQ.k], sc = rec ? rec.s : 0;
    var box = el('div', 'd-result', '<div class="d-rh">' + t('d.res_h') + '</div><div class="d-score"><b>' + sc + '</b><span>/5</span>' + (sc === 5 ? '<em>' + t('d.perfect') + '</em>' : '') + '</div>' +
      '<div class="d-marks">' + steps.map(function (s, i) { var ok = dJudge(h, i, DQ.a[i]); return '<div class="' + (ok ? 'ok' : 'ng') + '"><b>' + (ok ? '✓' : '✗') + '</b><span>' + s.title + '</span></div>'; }).join('') + '</div>' +
      streakBlock());
    return box;
  }
  function streakFx(r) {
    closeFx();
    var ms = MILESTONES.indexOf(r.to) >= 0, sparks = '';
    for (var i = 0; i < 14; i++) sparks += '<i style="--a:' + Math.round(i * 360 / 14 + (i % 2) * 9) + 'deg;--d:' + (54 + (i % 3) * 14) + 'px"></i>';
    var o = el('div', 'sfx' + (ms ? ' ms' : '') + (r.score === 5 ? ' pf' : ''));
    o.innerHTML = '<div class="sfx-card"><div class="sfx-fl"><div class="sp">' + sparks + '</div><div class="glow"></div>' + FLAME + '</div>' +
      '<div class="sfx-num"><span class="o">' + r.from + '</span><span class="n">' + r.to + '</span></div>' +
      '<div class="sfx-t">' + (r.to === 1 ? t('d.fx_first') : t('d.fx_n', r.to)) + '</div>' +
      (ms ? '<div class="sfx-ms">' + t('d.fx_ms', r.to) + '</div>' : r.record ? '<div class="sfx-ms">' + t('d.fx_record') + '</div>' : '') +
      (r.score === 5 ? '<div class="sfx-pf">' + t('d.perfect') + ' 5/5</div>' : '') +
      weekDots(true) + '<small>' + t('d.fx_tap') + '</small></div>';
    document.body.appendChild(o);
    void o.offsetWidth; o.classList.add('in');
    o.addEventListener('click', closeFx);
  }
  function closeFx() {
    var o = document.querySelector('.sfx'); if (!o) return false;
    o.classList.remove('in'); o.classList.add('out');
    setTimeout(function () { if (o.parentNode) o.parentNode.removeChild(o); }, 260);
    return true;
  }
  setInterval(function () {
    var n = document.querySelectorAll('.d-next');
    for (var i = 0; i < n.length; i++) n[i].textContent = t('d.next_in', untilMidnight());
    if (DQ && DQ.k !== dkOff(0)) { renderStreakChip(); if (activeTab === 'daily') renderDaily(); }
  }, 30000);

  /* =========================================================
     Tabs / back button / boot
     ========================================================= */
  I.applyStatic();
  var practice = {};
  TYPES.forEach(function (k) { practice[k] = Practice(k); });
  var prevTab = 'pot';
  function go(tab) {
    if ((tab === 'guide' || tab === 'daily') && activeTab !== 'guide' && activeTab !== 'daily') prevTab = activeTab;
    activeTab = tab;
    $('guideBtn').classList.toggle('on', tab === 'guide');
    if (tab === 'guide' && !guideBuilt) buildGuide();
    document.querySelectorAll('.tab').forEach(function (s) { s.classList.toggle('active', s.getAttribute('data-tab') === tab); });
    document.querySelectorAll('#tabs button').forEach(function (bt) { bt.classList.toggle('active', bt.getAttribute('data-go') === tab); });
    if (tab !== 'guide' && tab !== 'daily') { store.settings.tab = tab; save(); }
    $('streakChip').classList.toggle('on', tab === 'daily');
    if (tab !== 'ch' || !run) window.scrollTo(0, 0);
    $('fb').style.display = tab === 'ch' ? '' : 'none';
    if (tab === 'ch') { if (!run && $('chEnd').hidden) { $('chHome').hidden = false; renderHome(); } }
    else if (tab === 'daily') renderDaily();
    else if (tab !== 'guide') practice[tab].start();
    if (run && run.phase === 'answer') run.last = performance.now();
    updateBanner();
  }
  $('tabs').addEventListener('click', function (e) {
    var bt = e.target.closest('button'); if (bt) go(bt.getAttribute('data-go'));
  });
  // Android back key (called from MainActivity): true = handled in-app, false = exit
  window.__onBack = function () {
    if (closeFx()) return true;
    if (activeTab === 'guide' || activeTab === 'daily') { go(prevTab); return true; }
    if (activeTab === 'ch' && run) { abortRun(); return true; }
    if (activeTab === 'ch' && !$('chEnd').hidden) { abortRun(); return true; }
    if (activeTab !== 'pot') { go('pot'); return true; }
    return false;
  };

  (function posChips() {
    var box = $('posKinds');
    function draw() {
      box.innerHTML = ['mix', 'vs', 'bb', 'post', 'concept'].map(function (k) {
        return '<button type="button" data-k="' + k + '" class="' + (store.settings.posKind === k ? 'on' : '') + '">' + (k === 'mix' ? t('c.all') : posKind(k)) + '</button>';
      }).join('');
    }
    box.addEventListener('click', function (e) {
      var bt = e.target.closest('button'); if (!bt) return;
      store.settings.posKind = bt.getAttribute('data-k'); save(); draw();
      practice.pos.restart();
    });
    draw();
  })();
  if ('serviceWorker' in navigator && /^https?:$/.test(location.protocol)) {
    window.addEventListener('load', function () { navigator.serviceWorker.register('sw.js').catch(function () { /* ignore */ }); });
  }
  TYPES.forEach(renderStats);
  $('guideBtn').addEventListener('click', function () { if (activeTab === 'guide') go(prevTab); else go('guide'); });
  $('streakChip').addEventListener('click', function () { if (activeTab === 'daily') go(prevTab); else go('daily'); });
  renderStreakChip();
  renderGoal();
  renderChAcc();
  go(TYPES.concat(['ch']).indexOf(store.settings.tab) >= 0 ? store.settings.tab : 'pot');
})();
