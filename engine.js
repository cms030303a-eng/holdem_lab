/* Holdem Lab — engine: cards, hand evaluator, outs, ranges, equity simulation.
   Card = int 0..51, rank = c>>2 (0='2' … 12='A'), suit = c&3 (S,H,D,C). */
(function (root) {
  'use strict';
  var RANKS = '23456789TJQKA';
  var SUITS = 'SHDC';
  var SUIT_SYM = ['♠', '♥', '♦', '♣'];
  var CAT_KO = ['하이카드', '원페어', '투페어', '트리플', '스트레이트', '플러시', '풀하우스', '포카드', '스트레이트 플러시'];

  function rankOf(c) { return c >> 2; }
  function suitOf(c) { return c & 3; }
  function cardFromCode(code) {           // 'AS', 'TD', API uses '0' for ten
    var r = code.charAt(0) === '0' ? 'T' : code.charAt(0);
    return RANKS.indexOf(r) * 4 + SUITS.indexOf(code.charAt(1));
  }
  function codeOf(c) { return RANKS.charAt(rankOf(c)) + SUITS.charAt(suitOf(c)); }
  function apiCodeOf(c) { var s = codeOf(c); return s.charAt(0) === 'T' ? '0' + s.charAt(1) : s; }
  function labelOf(c) {
    var r = RANKS.charAt(rankOf(c));
    return (r === 'T' ? '10' : r) + SUIT_SYM[suitOf(c)];
  }

  /* ---------- straight helper ---------- */
  function straightHigh(mask) {           // highest straight top rank, -1 if none
    for (var h = 12; h >= 4; h--) {
      var m = 31 << (h - 4);
      if ((mask & m) === m) return h;
    }
    if ((mask & 0x100F) === 0x100F) return 3; // A-2-3-4-5
    return -1;
  }

  /* ---------- hand evaluator (any 1..7 cards) ----------
     score = category << 20 | k1<<16 | k2<<12 | k3<<8 | k4<<4 | k5 */
  var rc = new Int8Array(13), sc = new Int8Array(4), sm = new Int32Array(4);
  function topBits(mask, n, out) {
    for (var r = 12; r >= 0 && out.length < n; r--) if (mask & (1 << r)) out.push(r);
    return out;
  }
  function pack(cat, ks) {
    var v = cat << 20;
    for (var i = 0; i < 5; i++) v |= (ks[i] === undefined ? 0 : ks[i]) << (16 - 4 * i);
    return v;
  }
  function evaluate(cards) {
    var i, r, s, mask = 0;
    for (i = 0; i < 13; i++) rc[i] = 0;
    for (i = 0; i < 4; i++) { sc[i] = 0; sm[i] = 0; }
    for (i = 0; i < cards.length; i++) {
      r = cards[i] >> 2; s = cards[i] & 3;
      rc[r]++; sc[s]++; sm[s] |= 1 << r; mask |= 1 << r;
    }
    var flushSuit = -1;
    for (s = 0; s < 4; s++) if (sc[s] >= 5) flushSuit = s;
    if (flushSuit >= 0) {
      var sf = straightHigh(sm[flushSuit]);
      if (sf >= 0) return pack(8, [sf]);
    }
    var quad = -1, trips = [], pairs = [];
    for (r = 12; r >= 0; r--) {
      if (rc[r] === 4) quad = r;
      else if (rc[r] === 3) trips.push(r);
      else if (rc[r] === 2) pairs.push(r);
    }
    if (quad >= 0) return pack(7, [quad, topBits(mask & ~(1 << quad), 1, [])[0]]);
    if (trips.length && (trips.length > 1 || pairs.length)) {
      var t = trips[0];
      var p = trips.length > 1 ? Math.max(trips[1], pairs.length ? pairs[0] : -1) : pairs[0];
      return pack(6, [t, p]);
    }
    if (flushSuit >= 0) return pack(5, topBits(sm[flushSuit], 5, []));
    var st = straightHigh(mask);
    if (st >= 0) return pack(4, [st]);
    if (trips.length) {
      var t3 = trips[0];
      return pack(3, [t3].concat(topBits(mask & ~(1 << t3), 2, [])));
    }
    if (pairs.length >= 2) {
      var a = pairs[0], b = pairs[1];
      return pack(2, [a, b].concat(topBits(mask & ~(1 << a) & ~(1 << b), 1, [])));
    }
    if (pairs.length === 1) {
      var pp = pairs[0];
      return pack(1, [pp].concat(topBits(mask & ~(1 << pp), 3, [])));
    }
    return pack(0, topBits(mask, 5, []));
  }
  function category(score) { return score >> 20; }

  /* ---------- fast 7-card evaluator for Monte Carlo (no allocations) ---------- */
  var frc = new Int8Array(13), fsc = new Int8Array(4), fsm = new Int32Array(4);
  function top5(mask, n, skip1, skip2) {  // returns packed kickers (n of them) into low bits
    var v = 0, k = 0;
    for (var r = 12; r >= 0 && k < n; r--) {
      if ((mask & (1 << r)) && r !== skip1 && r !== skip2) { v = (v << 4) | r; k++; }
    }
    return v;
  }
  function eval7(c0, c1, c2, c3, c4, c5, c6) {
    var r, s, mask = 0, i;
    for (i = 0; i < 13; i++) frc[i] = 0;
    fsc[0] = fsc[1] = fsc[2] = fsc[3] = 0; fsm[0] = fsm[1] = fsm[2] = fsm[3] = 0;
    var arr = [c0, c1, c2, c3, c4, c5, c6];
    for (i = 0; i < 7; i++) {
      r = arr[i] >> 2; s = arr[i] & 3;
      frc[r]++; fsc[s]++; fsm[s] |= 1 << r; mask |= 1 << r;
    }
    var fs = -1;
    for (s = 0; s < 4; s++) if (fsc[s] >= 5) { fs = s; break; }
    if (fs >= 0) {
      var sf = straightHigh(fsm[fs]);
      if (sf >= 0) return (8 << 20) | (sf << 16);
    }
    var quad = -1, t1 = -1, t2 = -1, p1 = -1, p2 = -1, p3 = -1;
    for (r = 12; r >= 0; r--) {
      var n = frc[r];
      if (n === 4) quad = r;
      else if (n === 3) { if (t1 < 0) t1 = r; else if (t2 < 0) t2 = r; }
      else if (n === 2) { if (p1 < 0) p1 = r; else if (p2 < 0) p2 = r; else if (p3 < 0) p3 = r; }
    }
    if (quad >= 0) return (7 << 20) | (quad << 16) | (top5(mask, 1, quad, -1) << 12);
    if (t1 >= 0 && (t2 >= 0 || p1 >= 0)) {
      var pr = t2 > p1 ? t2 : p1;
      return (6 << 20) | (t1 << 16) | (pr << 12);
    }
    if (fs >= 0) {
      var m = fsm[fs], v = 0, k = 0;
      for (r = 12; r >= 0 && k < 5; r--) if (m & (1 << r)) { v = (v << 4) | r; k++; }
      return (5 << 20) | v;
    }
    var st = straightHigh(mask);
    if (st >= 0) return (4 << 20) | (st << 16);
    if (t1 >= 0) return (3 << 20) | (t1 << 16) | (top5(mask, 2, t1, -1) << 8);
    if (p2 >= 0) {
      var km = mask & ~(1 << p1) & ~(1 << p2);
      return (2 << 20) | (p1 << 16) | (p2 << 12) | (top5(km, 1, -1, -1) << 8);
    }
    if (p1 >= 0) return (1 << 20) | (p1 << 16) | (top5(mask, 3, p1, -1) << 4);
    return top5(mask, 5, -1, -1);
  }

  /* ---------- RNG ---------- */
  function rand() {
    if (root.crypto && root.crypto.getRandomValues) {
      var a = new Uint32Array(1); root.crypto.getRandomValues(a); return a[0] / 4294967296;
    }
    return Math.random();
  }
  function shuffledDeck() {
    var d = []; for (var i = 0; i < 52; i++) d.push(i);
    for (i = 51; i > 0; i--) { var j = Math.floor(rand() * (i + 1)); var t = d[i]; d[i] = d[j]; d[j] = t; }
    return d;
  }

  /* ---------- outs analysis (실전식) ----------
     Out = unseen card that improves hero's hand category using a hole card and is likely to make the best hand:
       · 플러시 / 스트레이트 (홀카드 사용)            · 풀하우스 / 포카드
       · 셋 (포켓페어) / 트리플 / 투페어 — 새 카드가 홀카드 랭크와 맞을 때
       · 오버카드 → 탑페어 (보드 최고 랭크보다 높은 홀카드가 페어가 될 때)
     보드만으로 생기는 개선(보드 페어 등)은 제외. 더티 아웃 할인은 하지 않음 (교재식 단순 계산). */
  function rankMask(cards) { var m = 0; for (var i = 0; i < cards.length; i++) m |= 1 << (cards[i] >> 2); return m; }
  function suitCount(cards, s) { var n = 0; for (var i = 0; i < cards.length; i++) if ((cards[i] & 3) === s) n++; return n; }

  function makesFlush(hole, board, u) {
    var all = hole.concat(board, [u]);
    for (var s = 0; s < 4; s++) {
      if (suitCount(all, s) >= 5 && suitCount(hole, s) >= 1 && suitCount(board.concat([u]), s) < 5) return true;
    }
    return false;
  }
  function makesStraight(hole, board, u) {
    var hero = straightHigh(rankMask(hole.concat(board, [u])));
    var brd = straightHigh(rankMask(board.concat([u])));
    return hero >= 0 && hero > brd;
  }
  var OUT_GROUPS = ['flush', 'straight', 'fh', 'set', 'trips', 'twopair', 'over'];   // labels: i18n 'og.<id>'
  function analyzeOuts(hole, board) {
    var known = hole.concat(board), seen = {}, i;
    known.forEach(function (c) { seen[c] = 1; });
    var cur = evaluate(known), curCat = category(cur);
    var boardMax = -1; board.forEach(function (c) { boardMax = Math.max(boardMax, rankOf(c)); });
    var h0 = rankOf(hole[0]), h1 = rankOf(hole[1]), pocket = h0 === h1;
    var groups = {}; OUT_GROUPS.forEach(function (g) { groups[g] = []; });
    var all = [], flush = [], straight = [], both = [];
    for (i = 0; i < 52; i++) {
      if (seen[i]) continue;
      var f = makesFlush(hole, board, i), st = makesStraight(hole, board, i);
      if (f) flush.push(i);
      if (st) straight.push(i);
      if (f && st) both.push(i);
      var nw = evaluate(known.concat([i])), nc = category(nw);
      if (nc <= curCat) continue;
      if (nw <= evaluate(board.concat([i]))) continue;           // board plays
      var r = rankOf(i), holeRank = r === h0 || r === h1, g = null;
      if (nc === 6 || nc === 7) g = 'fh';
      else if (nc === 5 || nc === 8) g = f ? 'flush' : null;
      else if (nc === 4) g = st ? 'straight' : null;
      else if (holeRank) {
        if (nc === 3) g = pocket ? 'set' : 'trips';
        else if (nc === 2) g = 'twopair';
        else if (nc === 1 && r > boardMax) g = 'over';
      }
      if (nc === 8 && !g) g = 'flush';
      if (g) { groups[g].push(i); all.push(i); }
    }
    var unseen = 52 - known.length;
    var cardsToCome = board.length === 3 ? 2 : 1;
    var n = all.length;
    var rule = n * (cardsToCome === 2 ? 4 : 2);
    var exact = cardsToCome === 2 ? 1 - ((unseen - n) * (unseen - n - 1)) / (unseen * (unseen - 1)) : n / unseen;
    // draw labels (ids → i18n 'dr.<id>')
    var draws = [];
    if (groups.flush.length) draws.push('fd');
    var strRanks = {};
    straight.forEach(function (c) { strRanks[c >> 2] = 1; });
    var nRanks = Object.keys(strRanks).length;
    if (nRanks >= 2) draws.push(isOESD(hole, board) ? 'oesd' : 'dgs');
    else if (nRanks === 1) draws.push('gs');
    var overRanks = {}; groups.over.forEach(function (c) { overRanks[rankOf(c)] = 1; });
    var nOver = Object.keys(overRanks).length;
    if (nOver) draws.push('over' + nOver);
    if (groups.set.length) draws.push('pp2set');
    if (groups.trips.length || groups.twopair.length) draws.push(curCat === 2 ? 'tp_up' : 'pair_up');
    if (groups.fh.length) draws.push(curCat === 2 ? 'tp2fh' : 'set2fh');
    return {
      groups: groups, flush: flush, straight: straight, both: both, outs: all, count: n,
      cardsToCome: cardsToCome, unseen: unseen, curCat: curCat, nOver: nOver,
      rulePct: rule, exactPct: exact * 100, draws: draws, straightRanks: nRanks
    };
  }
  function isOESD(hole, board) {               // four consecutive ranks open on both ends
    var m = rankMask(hole.concat(board));
    for (var lo = 0; lo <= 8; lo++) {
      var run = 15 << lo;
      if ((m & run) === run && lo + 4 <= 12) return true;
    }
    return false;
  }

  /* scenario validity
     mode 'pot'  : hero is behind-ish — high card, or a pair below the top board card (middle/bottom pair, underpair)
     mode 'outs' : same 'behind' rule, but 2+ outs allowed (e.g. underpair → set)
     mode 'any'  : anything up to trips/set (unused) */
  function validDrawSpot(hole, board, mode) {
    var bm = rankMask(board);
    if (countBits(bm) !== board.length) return false;                // board unpaired
    for (var s = 0; s < 4; s++) {                                    // no flush threat hero can't share
      if (suitCount(board, s) >= 3 && suitCount(hole, s) === 0) return false;
      if (suitCount(board, s) >= 4) return false;
    }
    var cat = category(evaluate(hole.concat(board)));
    var boardMax = -1; board.forEach(function (c) { boardMax = Math.max(boardMax, rankOf(c)); });
    if (mode !== 'any') {                                           // hero must be behind a top-pair hand
      if (cat > 1) return false;
      if (cat === 1) {
        var pr = rankOf(hole[0]) === rankOf(hole[1]) ? rankOf(hole[0]) : ((bm & (1 << rankOf(hole[0]))) ? rankOf(hole[0]) : rankOf(hole[1]));
        if (pr >= boardMax) return false;                             // top pair / overpair → not a drawing spot
      }
    } else if (cat > 3) return false;
    var a = analyzeOuts(hole, board);
    return a.count >= (mode === 'post' ? 8 : mode === 'pot' ? 4 : 2) ? a : false;
  }
  function countBits(m) { var n = 0; while (m) { n += m & 1; m >>>= 1; } return n; }

  /* ---------- preflop ranges ---------- */
  var POSITIONS = ['UTG', 'MP', 'HJ', 'CO', 'BTN'];
  var RANGE_TEXT = {
    UTG: '55+,ATs+,A5s-A4s,KTs+,QTs+,JTs,T9s,AJo+,KQo',
    MP: '44+,A8s+,A5s-A3s,K9s+,Q9s+,J9s+,T9s,98s,ATo+,KJo+',
    HJ: '33+,A2s+,K8s+,Q9s+,J9s+,T8s+,98s,87s,ATo+,KJo+,QJo',
    CO: '22+,A2s+,K6s+,Q8s+,J8s+,T8s+,97s+,86s+,76s,65s,54s,A8o+,KTo+,QTo+,JTo',
    BTN: '22+,A2s+,K2s+,Q4s+,J6s+,T6s+,96s+,85s+,74s+,64s+,53s+,43s,A2o+,K7o+,Q8o+,J8o+,T8o+,98o,87o'
  };
  function ri(ch) { return RANKS.indexOf(ch); }
  function handKey(hi, lo, suited) {            // hi >= lo rank indices
    if (hi === lo) return RANKS[hi] + RANKS[lo];
    return RANKS[hi] + RANKS[lo] + (suited ? 's' : 'o');
  }
  function handKeyOf(c1, c2) {
    var a = rankOf(c1), b = rankOf(c2);
    return handKey(Math.max(a, b), Math.min(a, b), suitOf(c1) === suitOf(c2));
  }
  function parseRange(text) {
    var set = {};
    text.split(',').forEach(function (tok) {
      tok = tok.trim(); if (!tok) return;
      var plus = tok.charAt(tok.length - 1) === '+';
      if (plus) tok = tok.slice(0, -1);
      var parts = tok.split('-');
      var a = parts[0], hi = ri(a[0]), lo = ri(a[1]), kind = a[2] || '';
      if (hi === lo) {                                       // pairs
        var end = plus ? 12 : (parts[1] ? ri(parts[1][0]) : hi);
        var from = Math.min(hi, end), to = Math.max(hi, end);
        for (var r = from; r <= to; r++) set[handKey(r, r)] = 1;
        return;
      }
      var loEnd = plus ? hi - 1 : (parts[1] ? ri(parts[1][1]) : lo);
      var l1 = Math.min(lo, loEnd), l2 = Math.max(lo, loEnd);
      for (var k = l1; k <= l2; k++) set[handKey(hi, k, kind === 's')] = 1;
    });
    return set;
  }
  var RANGES = {};
  POSITIONS.forEach(function (p) { RANGES[p] = parseRange(RANGE_TEXT[p]); });
  function combosOf(key) { return key.length === 2 ? 6 : (key[2] === 's' ? 4 : 12); }
  function rangePct(pos) {
    var n = 0; Object.keys(RANGES[pos]).forEach(function (k) { n += combosOf(k); });
    return n / 1326 * 100;
  }
  function firstOpenPos(key) {
    for (var i = 0; i < POSITIONS.length; i++) if (RANGES[POSITIONS[i]][key]) return POSITIONS[i];
    return null;
  }

  /* ---------- facing an open (3bet / call / fold) ----------
     key: opener + '>' + group, group = IP (hero acts later, not blinds) | SB | BB.  r = 3bet, c = flat call. */
  var SEATS = ['UTG', 'MP', 'HJ', 'CO', 'BTN', 'SB', 'BB'];
  var VS_OPEN_TEXT = {
    'UTG>IP': { r: 'QQ+,AKs,AKo,A5s', c: 'JJ-66,AQs-ATs,KQs-KJs,QJs,JTs,T9s,98s,AQo' },
    'MP>IP':  { r: 'QQ+,AQs+,AKo,A5s-A4s', c: 'JJ-55,AJs-ATs,KQs-KTs,QJs-QTs,JTs,T9s,98s,87s,AQo,AJo,KQo' },
    'HJ>IP':  { r: 'JJ+,AQs+,AQo+,A5s-A4s,KQs', c: 'TT-44,AJs-A9s,KJs-KTs,QJs-QTs,JTs-J9s,T9s,98s,87s,76s,AJo,KQo' },
    'CO>IP':  { r: 'TT+,AJs+,KJs+,AQo+,A5s-A3s,K9s,Q9s,T8s', c: '99-22,ATs-A6s,KTs,QJs-QTs,JTs-J9s,T9s,98s,87s,76s,65s,AJo,KQo,KJo,QJo' },
    'UTG>SB': { r: 'JJ+,AQs+,AKo,A5s', c: '' },
    'MP>SB':  { r: 'JJ+,AQs+,AKo,A5s-A4s,KQs', c: '' },
    'HJ>SB':  { r: 'TT+,AJs+,KQs,AQo+,A5s-A4s', c: '' },
    'CO>SB':  { r: '99+,ATs+,KTs+,QJs,JTs,AJo+,KQo,A5s-A2s', c: '' },
    'BTN>SB': { r: '77+,A8s+,A5s-A2s,K9s+,Q9s+,J9s+,T9s,98s,ATo+,KJo+,QJo', c: '' },
    'UTG>BB': { r: 'QQ+,AKs,AKo,A5s', c: 'JJ-22,AQs-A6s,A4s-A2s,KQs-K9s,QJs-Q9s,JTs-J9s,T9s-T8s,98s-97s,87s,76s,65s,54s,AQo-ATo,KQo-KJo,QJo' },
    'MP>BB':  { r: 'QQ+,AQs+,AKo,A5s-A4s', c: 'JJ-22,AJs-A6s,A3s-A2s,KQs-K8s,QJs-Q9s,JTs-J8s,T9s-T8s,98s-97s,87s-86s,76s-75s,65s,54s,AQo-A9o,KQo-KTo,QJo-QTo,JTo' },
    'HJ>BB':  { r: 'JJ+,AQs+,AQo+,A5s-A4s,KQs', c: 'TT-22,AJs-A6s,A3s-A2s,KJs-K6s,QJs-Q8s,JTs-J8s,T9s-T7s,98s-96s,87s-85s,76s-74s,65s-64s,54s,43s,AJo-A8o,KQo-KTo,QJo-QTo,JTo,T9o' },
    'CO>BB':  { r: 'TT+,AJs+,KJs+,AQo+,A5s-A2s', c: '99-22,ATs-A6s,KTs-K2s,QJs-Q5s,JTs-J7s,T9s-T6s,98s-96s,87s-85s,76s-74s,65s-63s,54s-53s,43s,AJo-A5o,KQo-K9o,QJo-Q9o,JTo-J9o,T9o,98o,87o' },
    'BTN>BB': { r: '99+,ATs+,KTs+,QJs,AJo+,KQo,A5s-A2s', c: '88-22,A9s-A6s,K9s-K2s,QTs-Q2s,JTs-J4s,T9s-T5s,98s-95s,87s-84s,76s-74s,65s-63s,54s-52s,43s-42s,32s,ATo-A2o,KJo-K7o,QJo-Q8o,JTo-J8o,T9o-T7o,98o-97o,87o-86o,76o,65o' }
  };
  var VS_OPEN = {};
  Object.keys(VS_OPEN_TEXT).forEach(function (k) {
    var r = parseRange(VS_OPEN_TEXT[k].r), c = parseRange(VS_OPEN_TEXT[k].c);
    Object.keys(r).forEach(function (h) { delete c[h]; });
    VS_OPEN[k] = { r: r, c: c };
  });
  function vsGroup(hero) { return hero === 'SB' || hero === 'BB' ? hero : 'IP'; }
  function vsOpenAction(opener, hero, key) {
    var t = VS_OPEN[opener + '>' + vsGroup(hero)];
    return t.r[key] ? '3bet' : t.c[key] ? 'call' : 'fold';
  }
  function setPct(set) { var n = 0; Object.keys(set).forEach(function (k) { n += combosOf(k); }); return n / 1326 * 100; }

  /* ---------- equity (Monte Carlo, chunked) ---------- */
  function equitySim(h1, h2, iterations, onProgress, onDone) {
    var dead = {}; h1.concat(h2).forEach(function (c) { dead[c] = 1; });
    var rest = []; for (var i = 0; i < 52; i++) if (!dead[i]) rest.push(i);
    var a0 = h1[0], a1 = h1[1], b0 = h2[0], b1 = h2[1];
    var w = 0, t = 0, l = 0, done = 0, n = rest.length;
    var deck = rest.slice();
    var catA = new Int32Array(9), catB = new Int32Array(9);
    function chunk() {
      var stop = Math.min(iterations, done + 4000);
      for (; done < stop; done++) {
        // partial Fisher-Yates for 5 cards
        for (var k = 0; k < 5; k++) {
          var j = k + Math.floor(Math.random() * (n - k));
          var tmp = deck[k]; deck[k] = deck[j]; deck[j] = tmp;
        }
        var x = eval7(a0, a1, deck[0], deck[1], deck[2], deck[3], deck[4]);
        var y = eval7(b0, b1, deck[0], deck[1], deck[2], deck[3], deck[4]);
        if (x > y) { w++; catA[x >> 20]++; }
        else if (x < y) { l++; catB[y >> 20]++; }
        else t++;
      }
      if (onProgress) onProgress(done / iterations);
      if (done < iterations) setTimeout(chunk, 0);
      else {
        var eq = (w + t / 2) / iterations;
        var se = Math.sqrt(eq * (1 - eq) / iterations);
        onDone({ win: w / iterations, tie: t / iterations, lose: l / iterations, eqA: eq, se: se, n: iterations, catA: catA, catB: catB });
      }
    }
    chunk();
  }
  /* general equity: fixed board (0–5 cards). board ≥ 3 → exact enumeration, otherwise Monte Carlo */
  function equityBoard(h1, h2, board, iterations, onDone) {
    var dead = {}; h1.concat(h2, board).forEach(function (c) { dead[c] = 1; });
    var rest = []; for (var i = 0; i < 52; i++) if (!dead[i]) rest.push(i);
    var need = 5 - board.length, b = board.slice();
    var w = 0, t = 0, n = 0;
    function score(full) {
      var x = eval7(h1[0], h1[1], full[0], full[1], full[2], full[3], full[4]);
      var y = eval7(h2[0], h2[1], full[0], full[1], full[2], full[3], full[4]);
      n++; if (x > y) w++; else if (x === y) t++;
    }
    function finish(exact) {
      var eq = (w + t / 2) / n;
      onDone({ win: w / n, tie: t / n, lose: (n - w - t) / n, eqA: eq, n: n, exact: exact, se: exact ? 0 : Math.sqrt(eq * (1 - eq) / n) });
    }
    if (need <= 2) {
      if (need === 0) score(b);
      else if (need === 1) rest.forEach(function (c) { score(b.concat([c])); });
      else for (var p = 0; p < rest.length; p++) for (var q = p + 1; q < rest.length; q++) score(b.concat([rest[p], rest[q]]));
      setTimeout(function () { finish(true); }, 0);
      return;
    }
    var deck = rest.slice(), m = deck.length, done = 0;
    (function chunk() {
      var stop = Math.min(iterations, done + 4000);
      for (; done < stop; done++) {
        for (var k = 0; k < need; k++) { var j = k + Math.floor(Math.random() * (m - k)); var tmp = deck[k]; deck[k] = deck[j]; deck[j] = tmp; }
        score(b.concat(deck.slice(0, need)));
      }
      if (done < iterations) setTimeout(chunk, 0); else finish(false);
    })();
  }
  function equitySync(h1, h2, iterations) {           // for tests
    var out; equitySim(h1, h2, iterations, null, function (r) { out = r; });
    return out;
  }

  /* ---------- daily hand (deterministic per date: same hand for everyone that day) ----------
     5 steps: preflop decision → postflop position → flop outs → required equity → turn call/fold */
  function hashStr(str) { var h = 2166136261; for (var i = 0; i < str.length; i++) { h ^= str.charCodeAt(i); h = Math.imul(h, 16777619); } return h >>> 0; }
  function mulberry32(a) {
    return function () { a |= 0; a = a + 0x6D2B79F5 | 0; var x = Math.imul(a ^ a >>> 15, 1 | a); x = x + Math.imul(x ^ x >>> 7, 61 | x) ^ x; return ((x ^ x >>> 14) >>> 0) / 4294967296; };
  }
  function half(x) { return Math.max(1, Math.round(x * 2) / 2); }
  function dailyHand(key) {
    var R = mulberry32(hashStr('holdemlab-daily:' + key));
    function P(arr) { return arr[Math.floor(R() * arr.length)]; }
    function shuffleR(a) { for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(R() * (i + 1)); var t = a[i]; a[i] = a[j]; a[j] = t; } return a; }
    for (var tries = 0; tries < 500; tries++) {
      var x = R(), kind = x < 0.5 ? 'open' : x < 0.8 ? 'bb' : 'vs', hero, villain, keys, pre;
      var np = function (k) { return k.length === 3; };
      if (kind === 'open') {
        hero = P(POSITIONS);
        villain = P(SEATS.slice(SEATS.indexOf(hero) + 1));
        pre = 'open';
        keys = Object.keys(RANGES[hero]).filter(np);
        if (hero !== 'BTN' && R() < 0.25) {
          var outside = {};
          POSITIONS.slice(POSITIONS.indexOf(hero) + 1).forEach(function (q) { Object.keys(RANGES[q]).forEach(function (k) { if (!RANGES[hero][k] && np(k)) outside[k] = 1; }); });
          keys = Object.keys(outside); pre = 'fold';
        } else {
          var fresh = keys.filter(function (k) { return firstOpenPos(k) === hero; });
          if (fresh.length && R() < 0.7) keys = fresh;
        }
      } else {
        if (kind === 'bb') { villain = P(POSITIONS); hero = 'BB'; }
        else { villain = P(['UTG', 'MP', 'HJ', 'CO']); hero = P(SEATS.slice(SEATS.indexOf(villain) + 1, 5)); }
        var tb = VS_OPEN[villain + '>' + vsGroup(hero)], ipT = VS_OPEN[villain + '>IP'] || { c: {}, r: {} };
        var rk = Object.keys(tb.r).filter(np);
        if (rk.length && R() < 0.25) { keys = rk; pre = '3bet'; }
        else {
          pre = 'call'; keys = Object.keys(tb.c).filter(np);
          if (kind === 'bb') { var wide = keys.filter(function (k) { return !ipT.c[k] && !ipT.r[k]; }); if (wide.length && R() < 0.6) keys = wide; }
        }
      }
      if (!keys.length) continue;
      var hk = P(keys), hi = ri(hk[0]), lo = ri(hk[1]), s1 = Math.floor(R() * 4);
      var s2 = hk[2] === 's' ? s1 : (s1 + 1 + Math.floor(R() * 3)) % 4;
      var hole = [hi * 4 + s1, lo * 4 + s2];
      var rest = []; for (var c = 0; c < 52; c++) if (c !== hole[0] && c !== hole[1]) rest.push(c);
      var flop = null, fa = null;
      for (var f = 0; f < 80 && !flop; f++) {
        shuffleR(rest);
        var fl = rest.slice(0, 3), a = validDrawSpot(hole, fl, 'pot');
        if (a && a.count >= 6 && a.count <= 15 && (a.count >= 8 || R() < 0.35)) { flop = fl; fa = a; }
      }
      if (!flop) continue;
      var left = rest.filter(function (x) { return flop.indexOf(x) < 0 && fa.outs.indexOf(x) < 0; });
      var turns = left.filter(function (x) { var a4 = validDrawSpot(hole, flop.concat([x]), 'pot'); return a4 && a4.count === fa.count; });
      if (!turns.length) continue;
      var turn = P(turns), board4 = flop.concat([turn]), ta = analyzeOuts(hole, board4);
      var river = P(rest.filter(function (x) { return board4.indexOf(x) < 0; }));
      var heroIP = kind === 'vs' || (kind === 'open' && (villain === 'SB' || villain === 'BB'));
      var P1 = kind === 'bb' ? (pre === '3bet' ? 22.5 : 5.5) : kind === 'vs' ? (pre === '3bet' ? 17.5 : 6.5) : villain === 'BB' ? 5.5 : villain === 'SB' ? 6 : 6.5;
      var B1 = half(P1 * P([0.33, 0.5, 0.66, 0.75]));
      var need1 = B1 / (P1 + 2 * B1) * 100;
      var wrong = [B1 / (P1 + B1) * 100, B1 / P1 * 100, 2 * B1 / (P1 + 2 * B1) * 100];
      var opts = [need1].concat(wrong).map(function (x) { return Math.round(x * 10) / 10; });
      var distinct = opts.every(function (x, i) { return opts.every(function (y, j) { return i === j || Math.abs(x - y) >= 2; }); });
      if (!distinct) continue;
      var P2 = P1 + 2 * B1, eq2 = ta.rulePct, target = R() < 0.5 ? 'call' : 'fold';
      var cands = [0.2, 0.25, 0.33, 0.5, 0.66, 0.75, 1].map(function (fr) { var bb = half(P2 * fr); return { b: bb, need: bb / (P2 + 2 * bb) * 100 }; })
        .filter(function (x) { return Math.abs(eq2 - x.need) >= 3; });
      var pref = cands.filter(function (x) { return (eq2 > x.need) === (target === 'call'); });
      if (!cands.length) continue;
      var m = P(pref.length ? pref : cands);
      var order = shuffleR([0, 1, 2, 3]);
      return {
        key: key, kind: kind, hero: hero, villain: villain, hk: hk, hole: hole, flop: flop, turn: turn, river: river,
        heroIP: heroIP, P1: P1, B1: B1, need1: opts[0], needOpts: order.map(function (i) { return opts[i]; }),
        P2: P2, B2: m.b, need2: m.b / (P2 + 2 * m.b) * 100, outs: fa.count, eq2: eq2, riverHit: ta.outs.indexOf(river) >= 0,
        pre: pre,
        ans: [pre, heroIP ? 'IP' : 'OOP', fa.count, String(opts[0]), eq2 > m.b / (P2 + 2 * m.b) * 100 ? 'call' : 'fold']
      };
    }
    return null;
  }

  var api = {
    RANKS: RANKS, SUITS: SUITS, SUIT_SYM: SUIT_SYM, CAT_KO: CAT_KO,
    rankOf: rankOf, suitOf: suitOf, cardFromCode: cardFromCode, codeOf: codeOf, apiCodeOf: apiCodeOf, labelOf: labelOf,
    evaluate: evaluate, eval7: eval7, category: category, straightHigh: straightHigh,
    rand: rand, shuffledDeck: shuffledDeck,
    analyzeOuts: analyzeOuts, validDrawSpot: validDrawSpot, OUT_GROUPS: OUT_GROUPS,
    POSITIONS: POSITIONS, RANGE_TEXT: RANGE_TEXT, RANGES: RANGES, handKey: handKey, handKeyOf: handKeyOf,
    parseRange: parseRange, rangePct: rangePct, firstOpenPos: firstOpenPos, combosOf: combosOf,
    equitySim: equitySim, equitySync: equitySync, equityBoard: equityBoard,
    SEATS: SEATS, VS_OPEN_TEXT: VS_OPEN_TEXT, VS_OPEN: VS_OPEN, vsGroup: vsGroup, vsOpenAction: vsOpenAction, setPct: setPct, dailyHand: dailyHand
  };
  root.Engine = api;
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
})(typeof window !== 'undefined' ? window : globalThis);
