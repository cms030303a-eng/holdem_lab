/* Holdem Lab — i18n (ko, en, de, fr, es, it)
   k(key, ko, en, de, fr, es, it) — {0}, {1}… are placeholders. Missing → English → Korean → key. */
(function (root) {
  'use strict';
  var LANGS = [['ko', '한국어', 'Korean'], ['en', 'English', 'English'], ['de', 'Deutsch', 'German'], ['fr', 'Français', 'French'], ['es', 'Español', 'Spanish'], ['it', 'Italiano', 'Italian']];
  var IDX = { ko: 0, en: 1, de: 2, fr: 3, es: 4, it: 5 };
  var LKEY = 'holdemlab.lang';
  var S = {};
  function k(key) { S[key] = Array.prototype.slice.call(arguments, 1); }

  function detect() {
    var saved = null;
    try { saved = localStorage.getItem(LKEY); } catch (e) { saved = null; }
    if (saved && IDX[saved] !== undefined) return saved;
    var list = (navigator.languages && navigator.languages.length ? navigator.languages : [navigator.language || 'en']);
    for (var i = 0; i < list.length; i++) {
      var p = String(list[i] || '').slice(0, 2).toLowerCase();
      if (IDX[p] !== undefined) return p;
    }
    return 'en';
  }
  var lang = detect(), li = IDX[lang];

  function t(key) {
    var row = S[key], s;
    if (row) s = row[li] || row[1] || row[0];
    else s = key;
    for (var i = 1; i < arguments.length; i++) s = s.split('{' + (i - 1) + '}').join(arguments[i]);
    return s;
  }

  /* ───────────── common / navigation ───────────── */
  k('app.title', '홀덤 랩', 'Holdem Lab', 'Holdem Lab', 'Holdem Lab', 'Holdem Lab', 'Holdem Lab');
  k('hdr.guide', '가이드', 'Guide', 'Guide', 'Guide', 'Guía', 'Guida');
  k('tab.pot', '팟 오즈', 'Pot Odds', 'Pot Odds', 'Cotes', 'Pot odds', 'Pot odds');
  k('tab.outs', '아웃츠', 'Outs', 'Outs', 'Outs', 'Outs', 'Outs');
  k('tab.pre', '프리플랍', 'Preflop', 'Preflop', 'Préflop', 'Preflop', 'Preflop');
  k('tab.pos', '포지션', 'Position', 'Position', 'Position', 'Posición', 'Posizione');
  k('tab.mu', '매치업', 'Matchup', 'Duell', 'Duel', 'Duelo', 'Scontro');
  k('tab.ch', '챌린지', 'Challenge', 'Challenge', 'Défi', 'Reto', 'Sfida');
  k('type.pot', '팟 오즈', 'Pot odds', 'Pot Odds', 'Cote du pot', 'Pot odds', 'Pot odds');
  k('type.outs', '아웃츠', 'Outs', 'Outs', 'Outs', 'Outs', 'Outs');
  k('type.pre', '프리플랍', 'Preflop', 'Preflop', 'Préflop', 'Preflop', 'Preflop');
  k('type.pos', '포지션', 'Position', 'Position', 'Position', 'Posición', 'Posizione');
  k('type.mu', '매치업', 'Matchup', 'Duell', 'Duel', 'Duelo', 'Scontro');
  k('type.mix', '전체 섞기', 'Mixed', 'Gemischt', 'Mélangé', 'Mezcla', 'Misto');
  k('c.confirm', '확인', 'Confirm', 'Bestätigen', 'Confirmer', 'Confirmar', 'Conferma');
  k('c.cancel', '취소', 'Cancel', 'Abbrechen', 'Annuler', 'Cancelar', 'Annulla');
  k('c.dealing', '카드 받는 중…', 'Dealing cards…', 'Karten werden gegeben…', 'Distribution…', 'Repartiendo…', 'Distribuzione…');
  k('c.verdict', '판정', 'Verdict', 'Ergebnis', 'Verdict', 'Veredicto', 'Verdetto');
  k('c.explain', '해설', 'Explanation', 'Erklärung', 'Explication', 'Explicación', 'Spiegazione');
  k('c.none', '없음', 'none', 'keine', 'aucune', 'ninguna', 'nessuna');
  k('c.all', '전체', 'All', 'Alle', 'Tout', 'Todo', 'Tutto');
  k('c.answer_is', '정답: {0}', 'Answer: {0}', 'Lösung: {0}', 'Réponse : {0}', 'Respuesta: {0}', 'Risposta: {0}');
  k('btn.check', '정답 확인', 'Check answer', 'Antwort prüfen', 'Vérifier', 'Comprobar', 'Verifica');
  k('btn.next', '다음 문제 →', 'Next question →', 'Nächste Frage →', 'Question suivante →', 'Siguiente →', 'Prossima domanda →');
  k('btn.submit', '제출', 'Submit', 'Abgeben', 'Valider', 'Enviar', 'Invia');
  k('v.ok', '정답', 'Correct', 'Richtig', 'Correct', 'Correcto', 'Corretto');
  k('v.ng', '오답', 'Wrong', 'Falsch', 'Faux', 'Incorrecto', 'Sbagliato');
  k('v.answer', '정답 {0}', 'Answer {0}', 'Lösung {0}', 'Réponse {0}', 'Respuesta {0}', 'Risposta {0}');
  k('v.mine', '내 답 {0}', 'yours {0}', 'deine {0}', 'la vôtre {0}', 'la tuya {0}', 'la tua {0}');
  k('st.correct', '정답', 'Correct', 'Richtig', 'Justes', 'Aciertos', 'Giuste');
  k('st.wrong', '오답', 'Wrong', 'Falsch', 'Fausses', 'Fallos', 'Sbagliate');
  k('st.acc', '정확도', 'Accuracy', 'Quote', 'Précision', 'Precisión', 'Precisione');
  k('st.streak', '연속·최고', 'Streak·Best', 'Serie·Best', 'Série·Max', 'Racha·Mejor', 'Serie·Max');
  k('st.reset', '기록 초기화', 'Reset stats', 'Statistik zurücksetzen', 'Réinitialiser', 'Reiniciar', 'Azzera');
  k('nav.notes', '오답 {0}', 'Review {0}', 'Fehler {0}', 'Erreurs {0}', 'Fallos {0}', 'Errori {0}');
  k('nav.best', '최고 {0}', 'Best {0}', 'Best {0}', 'Max {0}', 'Mejor {0}', 'Max {0}');
  k('seat.wait', '대기', 'wait', 'wartet', 'attend', 'espera', 'attesa');
  k('u.sec', '{0}초', '{0}s', '{0} s', '{0} s', '{0} s', '{0} s');
  k('u.s', '초', 's', 's', 's', 's', 's');
  k('u.cards', '{0}장', '{0} cards', '{0} Karten', '{0} cartes', '{0} cartas', '{0} carte');
  k('u.outs', '{0}아웃', '{0} outs', '{0} Outs', '{0} outs', '{0} outs', '{0} out');
  k('u.qs', '{0}문제', '{0} q.', '{0} Fragen', '{0} q.', '{0} preg.', '{0} dom.');
  k('u.streak', '{0}연속', '{0} in a row', '{0} in Folge', '{0} d’affilée', '{0} seguidas', '{0} di fila');
  k('u.solved', '{0}문제', '{0} solved', '{0} gelöst', '{0} justes', '{0} aciertos', '{0} giuste');
  k('w.flop', '플랍', 'Flop', 'Flop', 'Flop', 'Flop', 'Flop');
  k('w.turn', '턴', 'Turn', 'Turn', 'Turn', 'Turn', 'Turn');

  /* actions */
  k('act.call', '콜', 'Call', 'Call', 'Suivre', 'Pagar', 'Chiama');
  k('act.fold', '폴드', 'Fold', 'Fold', 'Se coucher', 'Retirarse', 'Passa');
  k('act.open', '오픈', 'Open', 'Open', 'Ouvrir', 'Abrir', 'Apri');
  k('act.3bet', '3벳', '3-bet', '3-Bet', '3-bet', '3-bet', '3-bet');

  /* hand categories */
  k('cat.0', '하이카드', 'High card', 'High Card', 'Hauteur', 'Carta alta', 'Carta alta');
  k('cat.1', '원페어', 'One pair', 'Ein Paar', 'Paire', 'Pareja', 'Coppia');
  k('cat.2', '투페어', 'Two pair', 'Zwei Paare', 'Double paire', 'Doble pareja', 'Doppia coppia');
  k('cat.3', '트리플', 'Trips', 'Drilling', 'Brelan', 'Trío', 'Tris');
  k('cat.4', '스트레이트', 'Straight', 'Straße', 'Quinte', 'Escalera', 'Scala');
  k('cat.5', '플러시', 'Flush', 'Flush', 'Couleur', 'Color', 'Colore');
  k('cat.6', '풀하우스', 'Full house', 'Full House', 'Full', 'Full', 'Full');
  k('cat.7', '포카드', 'Quads', 'Vierling', 'Carré', 'Póker', 'Poker');
  k('cat.8', '스트레이트 플러시', 'Straight flush', 'Straight Flush', 'Quinte flush', 'Escalera de color', 'Scala colore');

  /* out groups / draws */
  k('og.flush', '플러시', 'Flush', 'Flush', 'Couleur', 'Color', 'Colore');
  k('og.straight', '스트레이트', 'Straight', 'Straße', 'Quinte', 'Escalera', 'Scala');
  k('og.fh', '풀하우스·포카드', 'Full house·Quads', 'Full House·Vierling', 'Full·Carré', 'Full·Póker', 'Full·Poker');
  k('og.set', '셋', 'Set', 'Set', 'Brelan servi', 'Set', 'Set');
  k('og.trips', '트리플', 'Trips', 'Drilling', 'Brelan', 'Trío', 'Tris');
  k('og.twopair', '투페어', 'Two pair', 'Zwei Paare', 'Double paire', 'Doble pareja', 'Doppia coppia');
  k('og.over', '오버카드→탑페어', 'Overcard→Top pair', 'Overcard→Top Pair', 'Overcard→Top paire', 'Overcard→Top pair', 'Overcard→Top pair');
  k('dr.fd', '플러시 드로우', 'Flush draw', 'Flush Draw', 'Tirage couleur', 'Proyecto de color', 'Progetto colore');
  k('dr.oesd', '양방 스트레이트 드로우', 'Open-ended straight draw', 'Open-Ended Straight Draw', 'Tirage quinte bilatéral', 'Escalera abierta', 'Scala bilaterale');
  k('dr.dgs', '더블 거트샷', 'Double gutshot', 'Double Gutshot', 'Double ventrale', 'Doble gutshot', 'Doppio incastro');
  k('dr.gs', '거트샷', 'Gutshot', 'Gutshot', 'Quinte ventrale', 'Gutshot', 'Scala a incastro');
  k('dr.over1', '오버카드 1장', '1 overcard', '1 Overcard', '1 overcard', '1 overcard', '1 overcard');
  k('dr.over2', '오버카드 2장', '2 overcards', '2 Overcards', '2 overcards', '2 overcards', '2 overcard');
  k('dr.pp2set', '포켓페어 → 셋', 'Pocket pair → set', 'Pocket Pair → Set', 'Paire servie → brelan', 'Pareja de mano → set', 'Coppia servita → set');
  k('dr.pair_up', '원페어 → 투페어·트리플', 'Pair → two pair/trips', 'Paar → Zwei Paare/Drilling', 'Paire → double paire/brelan', 'Pareja → doble pareja/trío', 'Coppia → doppia coppia/tris');
  k('dr.tp_up', '투페어 개선', 'Improve two pair', 'Zwei Paare verbessern', 'Améliorer la double paire', 'Mejorar doble pareja', 'Migliorare doppia coppia');
  k('dr.tp2fh', '투페어 → 풀하우스', 'Two pair → full house', 'Zwei Paare → Full House', 'Double paire → full', 'Doble pareja → full', 'Doppia coppia → full');
  k('dr.set2fh', '셋·트리플 → 풀하우스·포카드', 'Set/trips → full house/quads', 'Set/Drilling → Full House/Vierling', 'Brelan → full/carré', 'Trío → full/póker', 'Tris → full/poker');
  k('dk.combo', '복합 드로우', 'Combo draw', 'Kombi-Draw', 'Tirage combiné', 'Proyecto combinado', 'Progetto combinato');
  k('dk.other', '기타', 'Other', 'Sonstige', 'Autre', 'Otro', 'Altro');
  k('ob.2_5', '아웃 2~5장', '2–5 outs', '2–5 Outs', '2–5 outs', '2–5 outs', '2–5 out');
  k('ob.6_9', '아웃 6~9장', '6–9 outs', '6–9 Outs', '6–9 outs', '6–9 outs', '6–9 out');
  k('ob.10_14', '아웃 10~14장', '10–14 outs', '10–14 Outs', '10–14 outs', '10–14 outs', '10–14 out');
  k('ob.15', '아웃 15장+', '15+ outs', '15+ Outs', '15+ outs', '15+ outs', '15+ out');

  /* street labels / rule notes */
  k('sl.left2', '남은 카드 <b>2장</b>', '<b>2 cards</b> to come', 'noch <b>2 Karten</b>', '<b>2 cartes</b> à venir', 'faltan <b>2 cartas</b>', 'mancano <b>2 carte</b>');
  k('sl.left1', '남은 카드 <b>1장</b>', '<b>1 card</b> to come', 'noch <b>1 Karte</b>', '<b>1 carte</b> à venir', 'falta <b>1 carta</b>', 'manca <b>1 carta</b>');
  k('sl.allin', '상대 <b>올인</b>', 'villain <b>all-in</b>', 'Gegner <b>all-in</b>', 'adversaire <b>all-in</b>', 'rival <b>all-in</b>', 'avversario <b>all-in</b>');
  k('sl.toriver', '리버까지 본다고 가정', 'assume we see the river', 'wir sehen den River', 'on voit la river', 'vemos hasta el river', 'si vede il river');
  k('rule.outs', '아웃츠(실전식): 내 홀카드로 <b>플러시·스트레이트·풀하우스, 셋·트리플·투페어, 오버카드→탑페어</b>를 만드는 카드 · 승률 = 아웃츠 <b>×4</b>(2장 남음) / <b>×2</b>(1장 남음)',
    'Outs (practical): cards that give you <b>a flush, straight, full house, set, trips, two pair or overcard→top pair</b> using your hole cards · equity = outs <b>×4</b> (2 to come) / <b>×2</b> (1 to come)',
    'Outs (praxisnah): Karten, die mit deinen Hole Cards <b>Flush, Straße, Full House, Set, Drilling, Zwei Paare oder Overcard→Top Pair</b> machen · Equity = Outs <b>×4</b> (2 Karten) / <b>×2</b> (1 Karte)',
    'Outs (pratique) : cartes qui vous donnent, avec vos cartes privées, <b>couleur, quinte, full, brelan, double paire ou overcard→top paire</b> · équité = outs <b>×4</b> (2 cartes) / <b>×2</b> (1 carte)',
    'Outs (práctico): cartas que, con tus cartas propias, te dan <b>color, escalera, full, set, trío, doble pareja u overcard→top pair</b> · equity = outs <b>×4</b> (2 cartas) / <b>×2</b> (1 carta)',
    'Out (pratico): carte che con le tue carte personali ti danno <b>colore, scala, full, set, tris, doppia coppia o overcard→top pair</b> · equity = out <b>×4</b> (2 carte) / <b>×2</b> (1 carta)');
  k('rule.short', '가정: 상대 탑페어 · 실전식 아웃츠', 'Assumption: villain has top pair · practical outs', 'Annahme: Gegner hat Top Pair · praxisnahe Outs', 'Hypothèse : top paire adverse · outs pratiques', 'Supuesto: rival con top pair · outs prácticos', 'Ipotesi: avversario con top pair · out pratici');
  k('pot.assume_long', '가정: 상대는 <b>탑페어</b> — 아웃이 떨어지면 내가 이긴다고 봄', 'Assumption: villain has <b>top pair</b> — if an out hits, you win', 'Annahme: Gegner hat <b>Top Pair</b> — trifft ein Out, gewinnst du', 'Hypothèse : l’adversaire a <b>top paire</b> — si un out tombe, vous gagnez', 'Supuesto: el rival tiene <b>top pair</b> — si sale un out, ganas', 'Ipotesi: l’avversario ha <b>top pair</b> — se esce un out, vinci');
  k('outs.assume_long', '가정: 상대는 <b>탑페어</b> — 내가 지고 있는 상황만 출제, 승률 = 아웃이 떨어질 확률 · 입력한 승률은 규칙값과 정확한 확률 중 가까운 쪽과 비교',
    'Assumption: villain has <b>top pair</b> — you are always behind, equity = chance an out hits · your % is compared with the closer of rule value and exact value',
    'Annahme: Gegner hat <b>Top Pair</b> — du liegst immer hinten, Equity = Chance auf ein Out · dein Wert wird mit dem näheren von Faustregel und exaktem Wert verglichen',
    'Hypothèse : l’adversaire a <b>top paire</b> — vous êtes toujours derrière, équité = chance de toucher un out · votre % est comparé à la plus proche entre règle et valeur exacte',
    'Supuesto: el rival tiene <b>top pair</b> — siempre vas por detrás, equity = probabilidad de ligar un out · tu % se compara con el más cercano entre regla y valor exacto',
    'Ipotesi: l’avversario ha <b>top pair</b> — sei sempre dietro, equity = probabilità che esca un out · il tuo % è confrontato con il più vicino tra regola e valore esatto');

  /* money cells */
  k('m.pot', '팟 (베팅 전)', 'Pot (before bet)', 'Pot (vor Bet)', 'Pot (avant mise)', 'Bote (antes)', 'Piatto (prima)');
  k('m.bet', '상대 베팅', 'Villain bet', 'Gegner-Bet', 'Mise adverse', 'Apuesta rival', 'Puntata avv.');
  k('m.call', '내 콜', 'To call', 'Zu callen', 'À suivre', 'A pagar', 'Da chiamare');
  k('m.of_pot', '팟의 {0}%', '{0}% pot', '{0}% Pot', '{0}% du pot', '{0}% del bote', '{0}% piatto');
  k('m.allin', '올인', 'all-in', 'all-in', 'all-in', 'all-in', 'all-in');
  k('m.to_river', '콜하면 리버까지', 'see to the river', 'bis zum River', 'jusqu’à la river', 'hasta el river', 'fino al river');
  k('m.river1', '리버 1장', 'river only', 'nur River', 'river seule', 'solo river', 'solo river');
  k('m.stack', '남은 스택', 'Stack behind', 'Reststack', 'Tapis restant', 'Stack restante', 'Stack residuo');
  k('m.after_call', '콜한 뒤', 'after calling', 'nach dem Call', 'après avoir suivi', 'tras pagar', 'dopo il call');

  /* outs breakdown / equity */
  k('ob.outs_eq', '아웃츠 = {0}', 'Outs = {0}', 'Outs = {0}', 'Outs = {0}', 'Outs = {0}', 'Out = {0}');
  k('ob.sum', '합계: {0} = {1} (한 카드는 가장 좋은 족보 한 곳에만 셈)', 'Total: {0} = {1} (each card counted once, under its best hand)', 'Summe: {0} = {1} (jede Karte nur einmal, bei der besten Hand)', 'Total : {0} = {1} (chaque carte comptée une fois, pour sa meilleure main)', 'Total: {0} = {1} (cada carta cuenta una vez, en su mejor mano)', 'Totale: {0} = {1} (ogni carta contata una volta, per la mano migliore)');
  k('ob.dup', '노란 테두리 {0}은 스트레이트도 완성하지만 플러시로 한 번만 셉니다.', 'The {0} with a yellow border also make a straight but are counted once, as flush outs.', 'Die {0} mit gelbem Rand machen auch eine Straße, zählen aber nur einmal (als Flush).', 'Les {0} encadrées en jaune font aussi la quinte mais ne comptent qu’une fois (couleur).', 'Las {0} con borde amarillo también hacen escalera, pero cuentan una sola vez (color).', 'Le {0} con bordo giallo fanno anche scala ma contano una sola volta (colore).');
  k('ob.over_note', '오버카드 아웃은 상대가 투페어 이상이면 무의미해서, 실전에선 절반 정도로 할인해 세기도 합니다 (여기선 그대로 셈).', 'Overcard outs are worthless if villain has two pair or better, so players often count them at about half value (here they count in full).', 'Overcard-Outs sind wertlos, wenn der Gegner Zwei Paare oder besser hat — oft zählt man sie nur halb (hier voll).', 'Les outs d’overcard ne valent rien si l’adversaire a double paire ou mieux ; on les compte souvent à moitié (ici en entier).', 'Los outs de overcard no valen si el rival tiene doble pareja o más; a menudo se cuentan a la mitad (aquí completos).', 'Gli out di overcard non valgono se l’avversario ha doppia coppia o meglio; spesso si contano a metà (qui interi).');
  k('eq.two_left', '남은 카드 2장', '2 cards to come', 'Noch 2 Karten', '2 cartes à venir', 'Faltan 2 cartas', 'Mancano 2 carte');
  k('eq.one_left', '남은 카드 1장', '1 card to come', 'Noch 1 Karte', '1 carte à venir', 'Falta 1 carta', 'Manca 1 carta');
  k('eq.allin_paren', '(상대 올인 → 리버까지 모두 봄)', '(villain all-in → we see both cards)', '(Gegner all-in → wir sehen beide Karten)', '(adversaire all-in → on voit les deux cartes)', '(rival all-in → vemos las dos cartas)', '(avversario all-in → vediamo entrambe le carte)');
  k('eq.exact', '정확한 확률: {0} = {1}', 'Exact: {0} = {1}', 'Exakt: {0} = {1}', 'Exact : {0} = {1}', 'Exacto: {0} = {1}', 'Esatto: {0} = {1}');
  k('eq.rule_high', '규칙값이 정확한 값보다 {0} 높음', 'Rule value is {0} higher than exact', 'Faustregel liegt {0} über dem exakten Wert', 'La règle surestime de {0}', 'La regla da {0} más que el valor exacto', 'La regola dà {0} in più del valore esatto');
  k('eq.rule_low', '규칙값이 정확한 값보다 {0} 낮음', 'Rule value is {0} lower than exact', 'Faustregel liegt {0} unter dem exakten Wert', 'La règle sous-estime de {0}', 'La regla da {0} menos que el valor exacto', 'La regola dà {0} in meno del valore esatto');
  k('eq.over4', '아웃츠가 많을수록 ×4 규칙은 과대평가됩니다. 8아웃 이상이면 “×4 − (아웃츠 − 8)” 보정이 더 가깝습니다.', 'the ×4 rule overestimates with many outs. Above 8 outs, “×4 − (outs − 8)” is closer.', 'mit vielen Outs überschätzt ×4. Ab 8 Outs ist „×4 − (Outs − 8)“ genauer.', 'avec beaucoup d’outs, ×4 surestime. Au-delà de 8 outs, « ×4 − (outs − 8) » est plus juste.', 'con muchos outs, ×4 sobrestima. Con más de 8 outs, «×4 − (outs − 8)» se acerca más.', 'con molti out, ×4 sovrastima. Oltre 8 out, «×4 − (out − 8)» è più preciso.');

  /* pot odds tab */
  k('pot.my_outs', '내가 센 아웃츠', 'My outs count', 'Meine Outs', 'Mes outs', 'Mis outs', 'I miei out');
  k('pot.optional', '(선택 · 채점 안 함)', '(optional · not graded)', '(optional · ohne Wertung)', '(facultatif · non noté)', '(opcional · no puntúa)', '(facoltativo · non valutato)');
  k('pot.my_outs_res', '내가 센 아웃츠 {0} → {1}', 'Your outs count {0} → {1}', 'Deine Outs {0} → {1}', 'Vos outs {0} → {1}', 'Tus outs {0} → {1}', 'I tuoi out {0} → {1}');
  k('pot.exact', '정확', 'exact', 'genau', 'exact', 'exacto', 'esatto');
  k('pot.diff', '{0}장 차이', 'off by {0}', '{0} daneben', 'écart {0}', 'diferencia {0}', 'differenza {0}');
  k('pot.s1', '아웃츠 세기', 'Count the outs', 'Outs zählen', 'Compter les outs', 'Contar los outs', 'Contare gli out');
  k('pot.s2', '승률 근사 (아웃츠 규칙)', 'Estimate equity (rule of 2 & 4)', 'Equity schätzen (2-und-4-Regel)', 'Estimer l’équité (règle du 2 et 4)', 'Estimar equity (regla del 2 y 4)', 'Stimare l’equity (regola del 2 e 4)');
  k('pot.s3', '팟 오즈 = 콜 금액 ÷ 콜한 뒤 전체 팟', 'Pot odds = call ÷ final pot after calling', 'Pot Odds = Call ÷ Pot nach dem Call', 'Cote = mise à suivre ÷ pot total après avoir suivi', 'Pot odds = pago ÷ bote total tras pagar', 'Pot odds = call ÷ piatto totale dopo il call');
  k('pot.s4', '비교 → 결정', 'Compare → decide', 'Vergleichen → entscheiden', 'Comparer → décider', 'Comparar → decidir', 'Confrontare → decidere');
  k('pot.need_note', '이 콜이 손익분기가 되려면 최소 {0}는 이겨야 합니다.', 'To break even on this call you must win at least {0}.', 'Um mit dem Call break-even zu sein, musst du mindestens {0} gewinnen.', 'Pour être rentable, ce call doit gagner au moins {0} du temps.', 'Para no perder con este pago debes ganar al menos el {0}.', 'Per andare in pari con questo call devi vincere almeno il {0}.');
  k('pot.lab_eq', '승률 {0}%', 'equity {0}%', 'Equity {0}%', 'équité {0}%', 'equity {0}%', 'equity {0}%');
  k('pot.lab_need', '필요 {0}%', 'need {0}%', 'nötig {0}%', 'requis {0}%', 'necesario {0}%', 'serve {0}%');
  k('pot.ev', '콜 EV ≈ {0} = {1} (근사 승률 기준, 칩 단위)', 'Call EV ≈ {0} = {1} (rule equity, in chips)', 'Call-EV ≈ {0} = {1} (Regel-Equity, in Chips)', 'EV du call ≈ {0} = {1} (équité de la règle, en jetons)', 'EV del pago ≈ {0} = {1} (equity por regla, en fichas)', 'EV del call ≈ {0} = {1} (equity da regola, in chip)');
  k('pot.border', '※ 정확한 확률({0}%)로 보면 결론이 달라지는 경계 상황입니다. 채점은 규칙값 기준.', '※ Borderline: with the exact value ({0}%) the decision flips. Grading uses the rule value.', '※ Grenzfall: mit dem exakten Wert ({0}%) dreht sich die Entscheidung. Gewertet wird nach Faustregel.', '※ Cas limite : avec la valeur exacte ({0}%), la décision s’inverse. La correction suit la règle.', '※ Caso límite: con el valor exacto ({0}%) la decisión cambia. Se puntúa por la regla.', '※ Caso limite: con il valore esatto ({0}%) la decisione cambia. Si valuta con la regola.');
  k('pot.line', '정답 {0} · 승률 {1}% vs 필요 {2}%', 'Answer {0} · equity {1}% vs need {2}%', 'Lösung {0} · Equity {1}% vs nötig {2}%', 'Réponse {0} · équité {1}% vs requis {2}%', 'Respuesta {0} · equity {1}% vs necesario {2}%', 'Risposta {0} · equity {1}% vs serve {2}%');
  k('pot.sum_bet', '베팅 {0}%', 'bet {0}%', 'Bet {0}%', 'mise {0}%', 'apuesta {0}%', 'puntata {0}%');
  k('pot.hint', '드로우: {0} · 필요 승률 = 콜 ÷ (팟 + 상대 베팅 + 내 콜)', 'Draws: {0} · needed equity = call ÷ (pot + bet + call)', 'Draws: {0} · nötige Equity = Call ÷ (Pot + Bet + Call)', 'Tirages : {0} · équité requise = call ÷ (pot + mise + call)', 'Proyectos: {0} · equity necesaria = pago ÷ (bote + apuesta + pago)', 'Progetti: {0} · equity necessaria = call ÷ (piatto + puntata + call)');

  /* outs tab */
  k('outs.in_outs', '아웃츠 (장)', 'Outs (cards)', 'Outs (Karten)', 'Outs (cartes)', 'Outs (cartas)', 'Out (carte)');
  k('outs.in_eq', '승률 (%)', 'Equity (%)', 'Equity (%)', 'Équité (%)', 'Equity (%)', 'Equity (%)');
  k('outs.tol', '승률 오차 허용 (%p)', 'Equity tolerance (pts)', 'Toleranz (Pkt.)', 'Tolérance (pts)', 'Tolerancia (pts)', 'Tolleranza (pt)');
  k('outs.tol_short', '승률 허용 오차 ±{0}%p · 아웃츠는 정확히', 'Equity tolerance ±{0} pts · outs must be exact', 'Toleranz ±{0} Pkt. · Outs exakt', 'Tolérance ±{0} pts · outs exacts', 'Tolerancia ±{0} pts · outs exactos', 'Tolleranza ±{0} pt · out esatti');
  k('outs.s1', '아웃츠 {0} (입력 {1} / 정답 {2})', 'Outs {0} (yours {1} / answer {2})', 'Outs {0} (deine {1} / Lösung {2})', 'Outs {0} (vous {1} / réponse {2})', 'Outs {0} (tú {1} / respuesta {2})', 'Out {0} (tu {1} / risposta {2})');
  k('outs.s2', '승률 {0}', 'Equity {0}', 'Equity {0}', 'Équité {0}', 'Equity {0}', 'Equity {0}');
  k('outs.cmp', '입력 {0} → 규칙값과 {1}%p, 정확값과 {2}%p 차이 · 허용 ±{3}%p → {4}', 'Your {0} → {1} pts from rule, {2} pts from exact · tolerance ±{3} → {4}', 'Dein {0} → {1} Pkt. von Regel, {2} Pkt. von exakt · Toleranz ±{3} → {4}', 'Votre {0} → {1} pts de la règle, {2} pts de l’exact · tolérance ±{3} → {4}', 'Tu {0} → {1} pts de la regla, {2} pts del exacto · tolerancia ±{3} → {4}', 'Il tuo {0} → {1} pt dalla regola, {2} pt dall’esatto · tolleranza ±{3} → {4}');
  k('outs.pass', '통과', 'pass', 'bestanden', 'validé', 'válido', 'ok');
  k('outs.fail', '벗어남', 'out of range', 'außerhalb', 'hors tolérance', 'fuera de rango', 'fuori tolleranza');
  k('outs.pct_ok_outs_ng', '승률은 범위 안이지만 아웃츠 수가 달라 오답 처리됩니다.', 'Equity is within range but the outs count is wrong, so it’s marked wrong.', 'Equity passt, aber die Outs-Zahl stimmt nicht — daher falsch.', 'L’équité est bonne mais le nombre d’outs est faux : réponse fausse.', 'La equity está en rango pero el número de outs no: incorrecto.', 'L’equity è nel range ma il numero di out è sbagliato: risposta errata.');
  k('outs.line', '정답 {0} · {1}% (정확 {2}%)', 'Answer {0} · {1}% (exact {2}%)', 'Lösung {0} · {1}% (exakt {2}%)', 'Réponse {0} · {1}% (exact {2}%)', 'Respuesta {0} · {1}% (exacto {2}%)', 'Risposta {0} · {1}% (esatto {2}%)');
  k('outs.line_pct', '승률 범위 밖', 'equity out of range', 'Equity daneben', 'équité hors tolérance', 'equity fuera de rango', 'equity fuori tolleranza');
  k('outs.line_outs', '아웃츠 틀림', 'outs wrong', 'Outs falsch', 'outs faux', 'outs incorrectos', 'out sbagliati');
  k('outs.hint', '드로우: {0} · 남은 카드 {1}장 → ×{2}', 'Draws: {0} · {1} card(s) to come → ×{2}', 'Draws: {0} · noch {1} Karte(n) → ×{2}', 'Tirages : {0} · {1} carte(s) à venir → ×{2}', 'Proyectos: {0} · faltan {1} carta(s) → ×{2}', 'Progetti: {0} · mancano {1} carta/e → ×{2}');

  /* preflop tab */
  k('hk.pair', '포켓 페어', 'Pocket pair', 'Pocket Pair', 'Paire servie', 'Pareja de mano', 'Coppia servita');
  k('hk.suited', '수딧', 'suited', 'suited', 'assortie', 'suited', 'suited');
  k('hk.offsuit', '오프수트', 'offsuit', 'offsuit', 'dépareillée', 'offsuit', 'offsuit');
  k('hk.pair_long', '포켓 페어', 'pocket pair', 'Pocket Pair', 'paire servie', 'pareja de mano', 'coppia servita');
  k('hk.suited_long', '수딧 (같은 무늬)', 'suited (same suit)', 'suited (gleiche Farbe)', 'assortie (même couleur)', 'suited (mismo palo)', 'suited (stesso seme)');
  k('hk.offsuit_long', '오프수트', 'offsuit', 'offsuit', 'dépareillée', 'offsuit', 'offsuit');
  k('pre.street', '앞에서 모두 폴드 · 100BB', 'folded to you · 100BB', 'zu dir gefoldet · 100BB', 'tout le monde s’est couché · 100BB', 'todos se retiran · 100BB', 'tutti passano · 100BB');
  k('pre.focus', '경계 핸드 위주로 출제', 'Focus on borderline hands', 'Grenzhände bevorzugen', 'Privilégier les mains limites', 'Priorizar manos límite', 'Privilegia le mani limite');
  k('pre.focus_sub', '(어디서도 안 여는 핸드 출제 빈도 ↓)', '(fewer hands that never open)', '(weniger Hände, die nie geöffnet werden)', '(moins de mains jamais ouvertes)', '(menos manos que nunca se abren)', '(meno mani che non si aprono mai)');
  k('pre.in', '레인지 안 · 오픈', 'in range · open', 'in der Range · open', 'dans la range · ouvrir', 'dentro del rango · abrir', 'nel range · apri');
  k('pre.out', '레인지 밖 · 폴드', 'out of range · fold', 'außerhalb · fold', 'hors range · se coucher', 'fuera del rango · retirarse', 'fuori range · passa');
  k('pre.none_fold', '없음 (모두 폴드)', 'none (all fold)', 'keine (alles fold)', 'aucune (tout couché)', 'ninguna (todo fuera)', 'nessuna (tutto passa)');
  k('pre.fam_rule', '{0}에서 {1} 오픈 기준: {2}', '{0} opens {1}: {2}', '{0} öffnet {1}: {2}', '{0} ouvre {1} : {2}', '{0} abre {1}: {2}', '{0} apre {1}: {2}');
  k('pre.first', '이 핸드를 처음 오픈하는 자리: {0}', 'First seat that opens this hand: {0}', 'Erste Position, die diese Hand öffnet: {0}', 'Première position qui ouvre cette main : {0}', 'Primera posición que abre esta mano: {0}', 'Prima posizione che apre questa mano: {0}');
  k('pre.first_after', '(그 뒤 자리에서도 모두 오픈)', '(and every later seat)', '(und jede spätere Position)', '(et toutes les positions suivantes)', '(y todas las posteriores)', '(e tutte le successive)');
  k('pre.never', '<b>어느 포지션에서도 오픈하지 않는</b> 핸드입니다.', 'This hand is <b>never opened</b> from any seat.', 'Diese Hand wird <b>nie geöffnet</b>.', 'Cette main ne s’ouvre <b>d’aucune position</b>.', 'Esta mano <b>no se abre desde ninguna posición</b>.', 'Questa mano <b>non si apre da nessuna posizione</b>.');
  k('pre.s2', '포지션별 같은 핸드', 'Same hand by position', 'Gleiche Hand je Position', 'Même main par position', 'Misma mano por posición', 'Stessa mano per posizione');
  k('pre.strip_note', '아래 숫자 = 해당 자리 오픈 비율(전체 1326콤보 중). 뒤로 갈수록 남은 상대가 적어 레인지가 넓어집니다.', 'Small numbers = share of hands opened from that seat (of 1326 combos). Later seats face fewer players, so ranges widen.', 'Kleine Zahlen = Open-Anteil der Position (von 1326 Kombos). Spätere Positionen haben weniger Gegner, die Range wird weiter.', 'Petits chiffres = part des mains ouvertes à ce siège (sur 1326 combos). Plus on est tard, moins il reste d’adversaires : la range s’élargit.', 'Números pequeños = % de manos que abre esa posición (de 1326 combos). Cuanto más tarde, menos rivales y más amplio el rango.', 'Numeri piccoli = quota di mani aperte da quella posizione (su 1326 combo). Più tardi si è, meno avversari restano e il range si allarga.');
  k('pre.s3', '{0} 오픈 레인지 · {1}% ({2}콤보)', '{0} opening range · {1}% ({2} combos)', '{0} Open-Range · {1}% ({2} Kombos)', 'Range d’ouverture {0} · {1}% ({2} combos)', 'Rango de apertura {0} · {1}% ({2} combos)', 'Range di apertura {0} · {1}% ({2} combo)');
  k('grid.legend', '우상단 = 수딧, 좌하단 = 오프수트, 대각선 = 페어. 노란 테두리가 이번 핸드.', 'Upper right = suited, lower left = offsuit, diagonal = pairs. Yellow border = this hand.', 'Oben rechts = suited, unten links = offsuit, Diagonale = Paare. Gelber Rand = diese Hand.', 'En haut à droite = assorties, en bas à gauche = dépareillées, diagonale = paires. Bord jaune = cette main.', 'Arriba derecha = suited, abajo izquierda = offsuit, diagonal = parejas. Borde amarillo = esta mano.', 'In alto a destra = suited, in basso a sinistra = offsuit, diagonale = coppie. Bordo giallo = questa mano.');
  k('pre.chart_note', '기준표: 100BB 캐시게임 RFI(앞에서 모두 폴드) 레인지를 단순화한 앱 기준입니다. 솔버·스테이크·레이크에 따라 경계 핸드는 조금씩 달라질 수 있어요.', 'Chart: a simplified 100BB cash-game RFI (raise-first-in) range used by this app. Borderline hands vary with solver, stakes and rake.', 'Tabelle: vereinfachte 100BB-Cashgame-RFI-Range dieser App. Grenzhände variieren je nach Solver, Limit und Rake.', 'Tableau : range RFI (premier à relancer) simplifiée pour cash game 100BB, propre à l’app. Les mains limites varient selon solveur, limites et rake.', 'Tabla: rango RFI (primero en subir) simplificado para cash 100BB, propio de la app. Las manos límite varían según solver, límites y rake.', 'Tabella: range RFI (primo a rilanciare) semplificato per cash 100BB, proprio dell’app. Le mani limite variano con solver, limiti e rake.');
  k('pre.line', '{0} @ {1} → {2} · 기준 {3}', '{0} @ {1} → {2} · chart {3}', '{0} @ {1} → {2} · Range {3}', '{0} @ {1} → {2} · range {3}', '{0} @ {1} → {2} · rango {3}', '{0} @ {1} → {2} · range {3}');
  k('pre.hint', '{0} 오픈 레인지는 앱 기준 상위 {1} 핸드 · 같은 계열({2}) 경계를 떠올려 보세요', '{0} opens the top {1} of hands in this app · think of where the {2} cut-off is', '{0} öffnet hier die besten {1} · wo liegt die Grenze bei {2}?', '{0} ouvre ici les {1} meilleures mains · où est la limite pour {2} ?', '{0} abre aquí el {1} mejor de manos · ¿dónde está el corte de {2}?', '{0} apre qui il miglior {1} delle mani · dov’è il limite per {2}?');

  /* matchup tab */
  k('mu.street', 'PREFLOP 올인 · 보드 5장을 끝까지 볼 때', 'PREFLOP all-in · all 5 board cards dealt', 'PREFLOP all-in · alle 5 Boardkarten', 'PRÉFLOP all-in · les 5 cartes du board', 'PREFLOP all-in · las 5 cartas del board', 'PREFLOP all-in · tutte e 5 le carte del board');
  k('mu.dom', '압도적', 'Dominant', 'Klar vorne', 'Dominant', 'Dominante', 'Dominante');
  k('mu.edge', '약간 우세', 'Slight edge', 'Leicht vorne', 'Léger avantage', 'Ligera ventaja', 'Leggero vantaggio');
  k('mu.flip', '코인플립', 'Coin flip', 'Coinflip', 'Pile ou face', 'Moneda al aire', 'Testa o croce');
  k('mu.legend', '우세한 쪽 승률: 플립 &lt; 58% ≤ 우세 &lt; 70% ≤ 압도', 'Favourite’s equity: flip &lt; 58% ≤ edge &lt; 70% ≤ dominant', 'Equity des Favoriten: Flip &lt; 58% ≤ leicht &lt; 70% ≤ klar', 'Équité du favori : pile ou face &lt; 58% ≤ léger &lt; 70% ≤ dominant', 'Equity del favorito: moneda &lt; 58% ≤ ligera &lt; 70% ≤ dominante', 'Equity del favorito: testa o croce &lt; 58% ≤ leggero &lt; 70% ≤ dominante');
  k('mu.s1', '실제 승률 (몬테카를로)', 'Actual equity (Monte Carlo)', 'Tatsächliche Equity (Monte Carlo)', 'Équité réelle (Monte-Carlo)', 'Equity real (Montecarlo)', 'Equity reale (Monte Carlo)');
  k('mu.win', '{0} 승 {1}%', '{0} wins {1}%', '{0} gewinnt {1}%', '{0} gagne {1}%', '{0} gana {1}%', '{0} vince {1}%');
  k('mu.tie', '무 {0}%', 'tie {0}%', 'Split {0}%', 'partage {0}%', 'empate {0}%', 'pareggio {0}%');
  k('mu.tie_s', '무', 'tie', 'Split', 'part.', 'emp.', 'par.');
  k('mu.sim_note', '승률(에퀴티) = 승 + 무승부 ÷ 2 · 무작위 보드 {0}회 시뮬레이션 · 표준오차 ±{1}%p', 'Equity = wins + ties ÷ 2 · {0} random boards simulated · standard error ±{1} pts', 'Equity = Siege + Splits ÷ 2 · {0} zufällige Boards · Standardfehler ±{1} Pkt.', 'Équité = victoires + partages ÷ 2 · {0} boards aléatoires simulés · erreur type ±{1} pts', 'Equity = victorias + empates ÷ 2 · {0} boards aleatorios simulados · error estándar ±{1} pts', 'Equity = vittorie + pareggi ÷ 2 · {0} board casuali simulati · errore standard ±{1} pt');
  k('mu.s2', '구간 판정 — 우세한 쪽({0}) {1}%', 'Band — favourite ({0}) {1}%', 'Bereich — Favorit ({0}) {1}%', 'Zone — favori ({0}) {1}%', 'Franja — favorito ({0}) {1}%', 'Fascia — favorito ({0}) {1}%');
  k('mu.edge_both', '경계(±1.5%p) 근처라 두 답 모두 정답 처리했습니다.', 'Within ±1.5 pts of a border, so both answers count.', 'Innerhalb ±1,5 Pkt. einer Grenze — beide Antworten zählen.', 'À ±1,5 pt d’une limite : les deux réponses sont acceptées.', 'A ±1,5 pts de un límite: ambas respuestas valen.', 'Entro ±1,5 pt da un limite: valgono entrambe le risposte.');
  k('mu.s3', '매치업 유형', 'Matchup type', 'Duell-Typ', 'Type de duel', 'Tipo de duelo', 'Tipo di scontro');
  k('mu.s4', '이길 때 완성 족보 (상위 3)', 'Winning hands (top 3)', 'Gewinnhände (Top 3)', 'Mains gagnantes (top 3)', 'Manos ganadoras (top 3)', 'Mani vincenti (top 3)');
  k('mu.hint', '매치업 유형: {0}', 'Matchup type: {0}', 'Duell-Typ: {0}', 'Type de duel : {0}', 'Tipo de duelo: {0}', 'Tipo di scontro: {0}');
  k('ck.pp', '페어 vs 페어', 'Pair vs pair', 'Paar vs Paar', 'Paire contre paire', 'Pareja vs pareja', 'Coppia vs coppia');
  k('ck.p_same', '페어 vs 같은 랭크', 'Pair vs shared rank', 'Paar vs gleicher Rang', 'Paire contre même rang', 'Pareja vs mismo rango', 'Coppia vs stesso rango');
  k('ck.p_2over', '페어 vs 오버카드 2장', 'Pair vs two overcards', 'Paar vs zwei Overcards', 'Paire contre deux overcards', 'Pareja vs dos overcards', 'Coppia vs due overcard');
  k('ck.p_1over', '페어 vs 오버1·언더1', 'Pair vs one over, one under', 'Paar vs eine Over-, eine Undercard', 'Paire contre une sur-carte et une sous-carte', 'Pareja vs una sobre y una bajo', 'Coppia vs una sopra e una sotto');
  k('ck.p_2under', '페어 vs 언더카드 2장', 'Pair vs two undercards', 'Paar vs zwei Undercards', 'Paire contre deux sous-cartes', 'Pareja vs dos undercards', 'Coppia vs due undercard');
  k('ck.dom', '도미네이션', 'Domination', 'Dominiert', 'Domination', 'Dominación', 'Dominazione');
  k('ck.two_over', '오버 2장 vs 언더 2장', 'Two overs vs two unders', 'Zwei hohe vs zwei niedrige', 'Deux hautes contre deux basses', 'Dos altas vs dos bajas', 'Due alte vs due basse');
  k('ck.inter', '사이에 끼는 구도', 'Interleaved', 'Verschachtelt', 'Entrelacées', 'Intercaladas', 'Intercalate');
  k('ck.hilo', '하이-로 vs 미들 2장', 'High-low vs two middles', 'Hoch-tief vs zwei mittlere', 'Haute-basse contre deux moyennes', 'Alta-baja vs dos medias', 'Alta-bassa vs due medie');
  k('cl.pp_hi', '오버페어 vs 언더페어 ({0}가 높은 페어)', 'Overpair vs underpair ({0} has the higher pair)', 'Höheres vs niedrigeres Paar ({0} hat das höhere)', 'Paire haute contre paire basse ({0} a la plus haute)', 'Pareja alta vs baja ({0} tiene la mayor)', 'Coppia alta vs bassa ({0} ha la più alta)');
  k('cl.pp_same', '같은 페어 — 무승부가 대부분', 'Same pair — mostly a split', 'Gleiches Paar — meist Split', 'Même paire — presque toujours partage', 'Misma pareja — casi siempre empate', 'Stessa coppia — quasi sempre pareggio');
  k('cl.pp_note', '낮은 페어는 사실상 셋(트리플)을 맞추거나 스트레이트·플러시가 나와야 역전합니다.', 'The lower pair basically needs to hit a set (or a straight/flush) to win.', 'Das niedrigere Paar braucht praktisch ein Set (oder Straße/Flush).', 'La paire basse doit en pratique toucher un brelan (ou quinte/couleur).', 'La pareja baja prácticamente necesita ligar set (o escalera/color).', 'La coppia bassa in pratica deve fare set (o scala/colore).');
  k('cl.p_same', '페어 vs 같은 랭크를 가진 핸드 ({0} 페어가 {1}의 아웃을 막음)', 'Pair vs hand sharing its rank ({0}’s pair blocks {1}’s outs)', 'Paar vs Hand mit gleichem Rang ({0}s Paar blockt {1}s Outs)', 'Paire contre main du même rang (la paire de {0} bloque les outs de {1})', 'Pareja vs mano con su rango ({0} bloquea los outs de {1})', 'Coppia vs mano con lo stesso rango ({0} blocca gli out di {1})');
  k('cl.p_same_note', '{0}는 페어와 같은 랭크 카드가 1장만 남아 그쪽으로는 거의 이기지 못합니다.', 'Only one card of that rank is left for {0}, so that route rarely wins.', 'Für {0} ist nur noch eine Karte dieses Rangs übrig — kaum Gewinnchance darüber.', 'Il ne reste qu’une carte de ce rang pour {0} : cette voie gagne rarement.', 'A {0} solo le queda una carta de ese rango: por ahí casi nunca gana.', 'A {0} resta una sola carta di quel rango: da lì vince raramente.');
  k('cl.p_2over', '페어 vs 두 오버카드 — 대표적인 코인플립 구도', 'Pair vs two overcards — the classic coin flip', 'Paar vs zwei Overcards — der klassische Coinflip', 'Paire contre deux overcards — le pile ou face classique', 'Pareja vs dos overcards — la moneda al aire clásica', 'Coppia vs due overcard — il classico testa o croce');
  k('cl.p_2over_note', '{0}는 두 카드 중 하나만 페어가 되어도 역전합니다 (아웃 6장 × 보드 5장).', '{0} wins by pairing either card (6 outs over 5 board cards).', '{0} gewinnt, wenn eine der Karten paart (6 Outs über 5 Boardkarten).', '{0} gagne en appariant l’une de ses cartes (6 outs sur 5 cartes).', '{0} gana si empareja cualquiera de sus cartas (6 outs en 5 cartas).', '{0} vince accoppiando una delle due carte (6 out su 5 carte).');
  k('cl.p_1over', '페어 vs 오버카드 1장 + 언더카드 1장', 'Pair vs one overcard + one undercard', 'Paar vs eine Over- + eine Undercard', 'Paire contre une overcard + une sous-carte', 'Pareja vs una overcard + una baja', 'Coppia vs una overcard + una bassa');
  k('cl.p_1over_note', '{0}는 주로 오버카드 3장에 의존합니다.', '{0} mostly relies on the 3 overcard outs.', '{0} hofft vor allem auf die 3 Overcard-Outs.', '{0} compte surtout sur les 3 outs de l’overcard.', '{0} depende sobre todo de los 3 outs de la overcard.', '{0} conta soprattutto sui 3 out dell’overcard.');
  k('cl.p_2under', '페어 vs 언더카드 두 장', 'Pair vs two undercards', 'Paar vs zwei Undercards', 'Paire contre deux sous-cartes', 'Pareja vs dos cartas bajas', 'Coppia vs due carte basse');
  k('cl.p_2under_note', '{0}는 한 장이 페어가 되어도 {1}의 페어보다 낮아 크게 불리합니다.', 'Even when {0} pairs a card, it’s still below {1}’s pair — a big underdog.', 'Selbst wenn {0} paart, liegt es unter {1}s Paar — klarer Außenseiter.', 'Même appariée, la main de {0} reste sous la paire de {1} : gros outsider.', 'Aunque {0} empareje, sigue por debajo de la pareja de {1}: muy desfavorecido.', 'Anche accoppiando, {0} resta sotto la coppia di {1}: forte sfavorito.');
  k('cl.dom', '도미네이션 — 같은 랭크를 공유', 'Domination — a shared rank', 'Dominiert — gemeinsamer Rang', 'Domination — un rang en commun', 'Dominación — un rango compartido', 'Dominazione — un rango in comune');
  k('cl.dom_note', '공유 카드가 맞으면 둘 다 페어 → 킥커 싸움. 킥커가 낮은 쪽은 자기 킥커를 맞춰야만 앞섭니다.', 'If the shared card pairs, both have the pair and the kicker decides. The weaker kicker must pair its kicker to get ahead.', 'Paart die gemeinsame Karte, entscheidet der Kicker. Der schwächere Kicker muss seinen Kicker treffen.', 'Si la carte commune s’apparie, le kicker décide. Le plus faible doit apparier son kicker.', 'Si la carta compartida empareja, decide el kicker. El kicker débil debe emparejar su kicker.', 'Se la carta comune si accoppia, decide il kicker. Il kicker più debole deve accoppiare il proprio.');
  k('cl.two_over', '{0}의 두 카드가 모두 높음 (두 오버카드 vs 두 언더카드)', 'Both of {0}’s cards are higher (two overs vs two unders)', 'Beide Karten von {0} sind höher (zwei hohe vs zwei niedrige)', 'Les deux cartes de {0} sont plus hautes', 'Las dos cartas de {0} son más altas', 'Entrambe le carte di {0} sono più alte');
  k('cl.inter', '두 카드가 각각 한 단계씩 높음 (사이에 끼는 구도)', 'Each card is one step higher (interleaved, e.g. AQ vs KJ)', 'Jede Karte eine Stufe höher (verschachtelt, z. B. AQ vs KJ)', 'Chaque carte est un cran au-dessus (ex. AQ contre KJ)', 'Cada carta un escalón más alta (p. ej. AQ vs KJ)', 'Ogni carta un gradino più alta (es. AQ vs KJ)');
  k('cl.hilo', '높은 카드 1장({0}) vs 중간 카드 2장', 'One high card ({0}) vs two middle cards', 'Eine hohe Karte ({0}) vs zwei mittlere', 'Une haute carte ({0}) contre deux moyennes', 'Una carta alta ({0}) vs dos medias', 'Una carta alta ({0}) vs due medie');
  k('cl.same_suit', '두 핸드가 같은 무늬 수딧 → 플러시가 나와도 높은 쪽이 가져가 서로 상쇄됩니다.', 'Both hands suited in the same suit → flushes mostly cancel out (higher flush wins).', 'Beide suited in derselben Farbe → Flushes heben sich weitgehend auf.', 'Deux mains assorties de la même couleur → les couleurs s’annulent en grande partie.', 'Ambas suited del mismo palo → los colores se anulan en gran parte.', 'Entrambe suited dello stesso seme → i colori si annullano in gran parte.');
  k('cl.suited', '{0}는 수딧 → 플러시 가능성만큼 에퀴티가 더해집니다.', '{0} is suited → extra equity from flushes.', '{0} ist suited → zusätzliche Equity durch Flushes.', '{0} est assortie → équité en plus grâce aux couleurs.', '{0} es suited → equity extra por el color.', '{0} è suited → equity extra dal colore.');
  k('cl.connected', '{0}는 커넥티드(간격 {1}) → 스트레이트 가능성이 있습니다.', '{0} is connected (gap {1}) → straight potential.', '{0} ist connected (Lücke {1}) → Straßenchancen.', '{0} est connectée (écart {1}) → potentiel de quinte.', '{0} es conectada (hueco {1}) → posibilidades de escalera.', '{0} è connessa (gap {1}) → possibilità di scala.');

  /* position tab */
  k('pk.vs', '레이즈 대응', 'Facing a raise', 'Gegen Raise', 'Face à une relance', 'Ante una subida', 'Contro un rilancio');
  k('pk.bb', 'BB 디펜스', 'BB defense', 'BB-Verteidigung', 'Défense BB', 'Defensa BB', 'Difesa BB');
  k('pk.post', '포스트플랍 포지션', 'Postflop position', 'Postflop-Position', 'Position postflop', 'Posición postflop', 'Posizione postflop');
  k('pk.concept', '포지션 개념', 'Position concepts', 'Positionswissen', 'Concepts de position', 'Conceptos de posición', 'Concetti di posizione');
  k('vs.title', '{0} vs {1}', '{0} vs {1}', '{0} vs {1}', '{0} vs {1}', '{0} vs {1}', '{0} vs {1}');
  k('vs.street', '{0} <b>2.5BB 오픈</b> · 100BB', '{0} <b>opens 2.5BB</b> · 100BB', '{0} <b>öffnet 2,5BB</b> · 100BB', '{0} <b>ouvre à 2,5BB</b> · 100BB', '{0} <b>abre a 2,5BB</b> · 100BB', '{0} <b>apre a 2,5BB</b> · 100BB');
  k('vs.fam', '{0} 기준 — 3벳: {1} · 콜: {2}', '{0} — 3-bet: {1} · call: {2}', '{0} — 3-Bet: {1} · Call: {2}', '{0} — 3-bet : {1} · suivre : {2}', '{0} — 3-bet: {1} · pagar: {2}', '{0} — 3-bet: {1} · call: {2}');
  k('vs.range_title', '{0} vs {1} 레인지', '{0} vs {1} range', 'Range {0} vs {1}', 'Range {0} contre {1}', 'Rango {0} vs {1}', 'Range {0} vs {1}');
  k('vs.grid_note', '노란 테두리가 이번 핸드. 앱 기준표(100BB, 2.5BB 오픈)이며 실제 솔버 전략은 혼합 빈도가 섞여 경계 핸드가 조금씩 다릅니다.', 'Yellow border = this hand. App chart (100BB, 2.5BB open); real solver strategies mix frequencies, so borderline hands differ a little.', 'Gelber Rand = diese Hand. App-Tabelle (100BB, 2,5BB Open); Solver mischen Frequenzen, Grenzhände weichen leicht ab.', 'Bord jaune = cette main. Tableau de l’app (100BB, open 2,5BB) ; les solveurs mixent les fréquences, les mains limites diffèrent un peu.', 'Borde amarillo = esta mano. Tabla de la app (100BB, apertura 2,5BB); los solvers mezclan frecuencias y las manos límite varían un poco.', 'Bordo giallo = questa mano. Tabella dell’app (100BB, open 2,5BB); i solver mescolano le frequenze, le mani limite variano un po’.');
  k('vs.s3', '포지션 포인트', 'Position points', 'Positions-Tipps', 'Points de position', 'Claves de posición', 'Punti chiave');
  k('vs.p_open', '{0}의 오픈 레인지는 앱 기준 {1}. 앞자리 오프너일수록 레인지가 강해서 대응 레인지도 좁아집니다.', '{0} opens {1} in this app. Earlier openers have stronger ranges, so your continuing range is tighter.', '{0} öffnet hier {1}. Frühe Opener haben stärkere Ranges, also spielst du enger weiter.', '{0} ouvre {1} dans l’app. Plus l’ouvreur est tôt, plus sa range est forte et plus vous continuez serré.', '{0} abre {1} en la app. Cuanto antes abre el rival, más fuerte su rango y más estrecho el tuyo.', '{0} apre {1} nell’app. Prima apre l’avversario, più forte è il suo range e più stretto il tuo.');
  k('vs.p_ip', '{0}는 {1}보다 뒤라 포스트플랍 내내 <b>IP</b>(나중에 액션). 그래서 3벳뿐 아니라 <b>콜 레인지</b>도 가질 수 있어요. (UTG 오픈 대응 3벳+콜 {2}% → CO 오픈 대응 {3}%)', '{0} sits behind {1}, so you are <b>in position</b> postflop. That’s why you can have a <b>calling range</b> as well as 3-bets. (vs UTG: 3-bet+call {2}% → vs CO: {3}%)', '{0} sitzt hinter {1} und ist postflop <b>in Position</b>. Daher ist neben 3-Bets auch eine <b>Call-Range</b> möglich. (vs UTG: 3-Bet+Call {2}% → vs CO: {3}%)', '{0} est après {1} : vous serez <b>en position</b> après le flop. D’où une <b>range de call</b> en plus des 3-bets. (vs UTG : 3-bet+call {2}% → vs CO : {3}%)', '{0} actúa después de {1}: estarás <b>en posición</b> postflop. Por eso puedes tener <b>rango de pago</b> además de 3-bets. (vs UTG: 3-bet+pago {2}% → vs CO: {3}%)', '{0} agisce dopo {1}: sarai <b>in posizione</b> postflop. Per questo puoi avere un <b>range di call</b> oltre ai 3-bet. (vs UTG: 3-bet+call {2}% → vs CO: {3}%)');
  k('vs.p_behind', '뒤에 아직 {0}가 남아 있어 스퀴즈를 맞을 수 있어요. BTN보다는 조금 더 타이트하게 가는 게 보통입니다.', '{0} still act behind you and can squeeze, so play a little tighter than from the button.', '{0} sitzen noch hinter dir und können squeezen — etwas enger als vom Button.', '{0} parlent encore après vous et peuvent squeezer : jouez un peu plus serré qu’au bouton.', 'Aún quedan {0} detrás y pueden hacer squeeze: juega algo más tight que desde el botón.', 'Dietro restano {0} che possono fare squeeze: gioca un po’ più stretto che dal bottone.');
  k('vs.p_sb', 'SB는 뒤에 BB가 남아 있고, 플랍부터는 가장 먼저 액션(<b>OOP</b>)합니다. 콜하면 BB의 스퀴즈와 OOP 불리함을 동시에 떠안기 때문에 앱 기준은 <b>3벳 or 폴드</b>(콜 없음).', 'From the SB the BB still acts behind you, and postflop you act first (<b>OOP</b>). Calling exposes you to a BB squeeze and a positional disadvantage, so this app uses <b>3-bet or fold</b> (no calls).', 'Aus dem SB sitzt der BB noch hinter dir, postflop agierst du zuerst (<b>OOP</b>). Ein Call riskiert einen Squeeze und Positionsnachteil — daher hier <b>3-Bet oder Fold</b>.', 'En SB, la BB parle encore après vous et vous parlez en premier après le flop (<b>hors position</b>). Suivre expose au squeeze et au désavantage positionnel : ici <b>3-bet ou se coucher</b>.', 'Desde la SB, la BB aún habla detrás y postflop hablas primero (<b>fuera de posición</b>). Pagar te expone a un squeeze y a la mala posición: aquí <b>3-bet o retirarse</b>.', 'Dallo SB il BB parla ancora dopo di te e postflop agisci per primo (<b>fuori posizione</b>). Chiamare espone a squeeze e svantaggio di posizione: qui <b>3-bet o passa</b>.');
  k('vs.p_bb1', 'BB는 이미 1BB를 냈고 프리플랍 마지막 액션. 2.5BB 오픈이면 <b>1.5BB</b>만 더 내고 2.5 + 0.5 + 2.5 = <b>5.5BB</b> 팟을 다툼 → 필요 승률 1.5 ÷ 5.5 = <b>27.3%</b>. 그래서 넓게 디펜스합니다.', 'The BB has already posted 1BB and acts last preflop. Against a 2.5BB open you add only <b>1.5BB</b> to play for a <b>5.5BB</b> pot (2.5 + 0.5 + 2.5) → needed equity 1.5 ÷ 5.5 = <b>27.3%</b>. Hence a wide defense.', 'Der BB hat schon 1BB gesetzt und agiert preflop zuletzt. Gegen 2,5BB zahlst du nur <b>1,5BB</b> für einen <b>5,5BB</b>-Pot → nötige Equity 1,5 ÷ 5,5 = <b>27,3%</b>. Daher breite Verteidigung.', 'La BB a déjà misé 1BB et parle en dernier préflop. Contre un open à 2,5BB, il suffit d’ajouter <b>1,5BB</b> pour un pot de <b>5,5BB</b> → équité requise 1,5 ÷ 5,5 = <b>27,3%</b>. D’où une défense large.', 'La BB ya puso 1BB y habla última preflop. Contra 2,5BB solo añades <b>1,5BB</b> por un bote de <b>5,5BB</b> → equity necesaria 1,5 ÷ 5,5 = <b>27,3%</b>. Por eso defiende amplio.', 'Il BB ha già messo 1BB e agisce per ultimo preflop. Contro un open a 2,5BB aggiungi solo <b>1,5BB</b> per un piatto di <b>5,5BB</b> → equity necessaria 1,5 ÷ 5,5 = <b>27,3%</b>. Da qui una difesa ampia.');
  k('vs.p_bb2', '다만 포스트플랍은 OOP라 에퀴티를 다 실현하기 어려워, 연결성·수딧이 없는 약한 오프수트는 버립니다.', 'But you’ll be out of position postflop and won’t realize all your equity, so weak unconnected offsuit hands are folded.', 'Postflop bist du aber OOP und realisierst nicht alle Equity — schwache, unverbundene Offsuit-Hände werden gefoldet.', 'Mais hors position après le flop, vous ne réalisez pas toute votre équité : les mains dépareillées faibles et non connectées se couchent.', 'Pero postflop estarás fuera de posición y no realizarás toda tu equity: las manos offsuit débiles y sin conexión se tiran.', 'Ma postflop sarai fuori posizione e non realizzerai tutta l’equity: le offsuit deboli e scollegate si passano.');
  k('vs.hint', '{0} 앱 기준: 3벳 {1} · 콜 {2} · 나머지 폴드', '{0} in this app: 3-bet {1} · call {2} · fold the rest', '{0} hier: 3-Bet {1} · Call {2} · Rest Fold', '{0} dans l’app : 3-bet {1} · suivre {2} · le reste se couche', '{0} en la app: 3-bet {1} · pagar {2} · el resto fuera', '{0} nell’app: 3-bet {1} · call {2} · il resto passa');
  k('post.you', '당신', 'you are', 'du bist', 'vous êtes', 'estás', 'sei');
  k('post.ip_sub', '(상대보다 나중에 액션)', '(you act after villain)', '(du agierst nach dem Gegner)', '(vous parlez après l’adversaire)', '(actúas después del rival)', '(agisci dopo l’avversario)');
  k('post.oop_sub', '(상대보다 먼저 액션)', '(you act before villain)', '(du agierst vor dem Gegner)', '(vous parlez avant l’adversaire)', '(actúas antes que el rival)', '(agisci prima dell’avversario)');
  k('post.assume', '가정: 상대 탑페어 · 맞으면 리버에서 추가로 받아낼 금액 = 남은 스택 × <b>IP 30%</b> / <b>OOP 15%</b> · 실전식 아웃츠 ×2', 'Assumption: villain has top pair · if you hit, you win an extra <b>30% (IP)</b> / <b>15% (OOP)</b> of the remaining stack on the river · practical outs ×2', 'Annahme: Gegner hat Top Pair · triffst du, gewinnst du am River zusätzlich <b>30% (IP)</b> / <b>15% (OOP)</b> des Reststacks · praxisnahe Outs ×2', 'Hypothèse : top paire adverse · si vous touchez, vous gagnez en plus à la river <b>30% (IP)</b> / <b>15% (OOP)</b> du tapis restant · outs pratiques ×2', 'Supuesto: rival con top pair · si ligas, ganas extra en el river el <b>30% (IP)</b> / <b>15% (OOP)</b> de la stack restante · outs prácticos ×2', 'Ipotesi: avversario con top pair · se chiudi, vinci in più al river il <b>30% (IP)</b> / <b>15% (OOP)</b> dello stack residuo · out pratici ×2');
  k('post.s1', '아웃츠', 'Outs', 'Outs', 'Outs', 'Outs', 'Out');
  k('post.s2', '승률 (1장 남음 → ×2)', 'Equity (1 card to come → ×2)', 'Equity (1 Karte → ×2)', 'Équité (1 carte → ×2)', 'Equity (1 carta → ×2)', 'Equity (1 carta → ×2)');
  k('post.s3', '직접 팟 오즈', 'Direct pot odds', 'Direkte Pot Odds', 'Cote directe', 'Pot odds directas', 'Pot odds dirette');
  k('post.direct', '직접 오즈만 보면 {0} (EV {1})', 'on direct odds alone: {0} (EV {1})', 'nur mit direkten Odds: {0} (EV {1})', 'avec la seule cote directe : {0} (EV {1})', 'solo con odds directas: {0} (EV {1})', 'solo con odds dirette: {0} (EV {1})');
  k('post.s4', '임플라이드 오즈 ({0})', 'Implied odds ({0})', 'Implied Odds ({0})', 'Cotes implicites ({0})', 'Odds implícitas ({0})', 'Implied odds ({0})');
  k('post.x', '추가 수익 X = {0} = {1}', 'Extra winnings X = {0} = {1}', 'Zusatzgewinn X = {0} = {1}', 'Gain supplémentaire X = {0} = {1}', 'Ganancia extra X = {0} = {1}', 'Vincita extra X = {0} = {1}');
  k('post.need', '손익분기에 필요한 추가 수익 = {0} = {1}', 'Extra needed to break even = {0} = {1}', 'Nötiger Zusatzgewinn für Break-even = {0} = {1}', 'Gain supplémentaire requis = {0} = {1}', 'Ganancia extra necesaria = {0} = {1}', 'Vincita extra necessaria = {0} = {1}');
  k('post.need_zero', '0 (직접 오즈로 충분)', '0 (direct odds are enough)', '0 (direkte Odds reichen)', '0 (la cote directe suffit)', '0 (bastan las odds directas)', '0 (bastano le odds dirette)');
  k('post.s5', '포지션이 바뀌면?', 'What if the position changes?', 'Und mit anderer Position?', 'Et si la position change ?', '¿Y si cambia la posición?', 'E se cambia la posizione?');
  k('post.pos_note', '같은 카드·같은 베팅이라도 IP는 리버에서 상대 액션을 보고 베팅 크기를 정할 수 있어 맞았을 때 더 받아낼 수 있고, OOP는 먼저 액션해야 해서 덜 받아냅니다. 앱은 이를 남은 스택의 <b>30% / 15%</b>로 단순화해 가정했어요.', 'Same cards, same bet — but in position you see villain’s river action before sizing, so you extract more when you hit; out of position you act first and get paid less. The app simplifies this to <b>30% / 15%</b> of the remaining stack.', 'Gleiche Karten, gleicher Bet — in Position siehst du die River-Aktion des Gegners und holst mehr heraus; OOP agierst du zuerst und bekommst weniger. Die App vereinfacht das auf <b>30% / 15%</b> des Reststacks.', 'Mêmes cartes, même mise — en position, vous voyez l’action adverse à la river et extrayez plus ; hors position, vous parlez en premier et êtes moins payé. L’app simplifie à <b>30% / 15%</b> du tapis restant.', 'Mismas cartas, misma apuesta — en posición ves la acción del rival en el river y sacas más; fuera de posición hablas primero y cobras menos. La app lo simplifica a <b>30% / 15%</b> de la stack restante.', 'Stesse carte, stessa puntata — in posizione vedi l’azione dell’avversario al river ed estrai di più; fuori posizione agisci per primo e incassi meno. L’app semplifica a <b>30% / 15%</b> dello stack residuo.');
  k('post.line', '정답 {0} · 직접 {1}% vs {2}% · {3} EV {4}', 'Answer {0} · direct {1}% vs {2}% · {3} EV {4}', 'Lösung {0} · direkt {1}% vs {2}% · {3} EV {4}', 'Réponse {0} · directe {1}% vs {2}% · {3} EV {4}', 'Respuesta {0} · directa {1}% vs {2}% · {3} EV {4}', 'Risposta {0} · diretta {1}% vs {2}% · {3} EV {4}');
  k('post.hint', '직접 팟 오즈 필요 승률 {0} · 맞았을 때 추가 수익은 남은 스택의 IP 30% / OOP 15%로 가정', 'Direct odds need {0} · extra winnings assumed 30% (IP) / 15% (OOP) of the remaining stack', 'Direkte Odds brauchen {0} · Zusatzgewinn: 30% (IP) / 15% (OOP) des Reststacks', 'La cote directe exige {0} · gain supplémentaire supposé 30% (IP) / 15% (OOP) du tapis', 'Odds directas: {0} · ganancia extra supuesta 30% (IP) / 15% (OOP) de la stack', 'Odds dirette: {0} · vincita extra ipotizzata 30% (IP) / 15% (OOP) dello stack');
  k('cq.next_q', '{0} 바로 다음(왼쪽) 자리는?', 'Which seat is directly to the left of {0}?', 'Welche Position sitzt direkt links von {0}?', 'Quel siège est juste à gauche de {0} ?', '¿Qué posición está justo a la izquierda de {0}?', 'Quale posizione è subito a sinistra di {0}?');
  k('cq.next_e', '테이블 순서: {0} → (다시 UTG). {1}의 왼쪽은 {2}입니다.', 'Table order: {0} → (back to UTG). Left of {1} is {2}.', 'Reihenfolge: {0} → (wieder UTG). Links von {1} sitzt {2}.', 'Ordre : {0} → (retour à UTG). À gauche de {1} : {2}.', 'Orden: {0} → (vuelta a UTG). A la izquierda de {1} está {2}.', 'Ordine: {0} → (di nuovo UTG). A sinistra di {1} c’è {2}.');
  k('cq.pre_first', '프리플랍에서 {0} 중 가장 먼저 액션하는 사람은?', 'Preflop, who acts first among {0}?', 'Wer agiert preflop als Erster unter {0}?', 'Préflop, qui parle en premier parmi {0} ?', 'Preflop, ¿quién habla primero entre {0}?', 'Preflop, chi agisce per primo tra {0}?');
  k('cq.post_first', '{0} 셋이 플랍을 봤다. 플랍에서 가장 먼저 액션하는 사람은?', '{0} see the flop. Who acts first on the flop?', '{0} sehen den Flop. Wer agiert am Flop zuerst?', '{0} voient le flop. Qui parle en premier ?', '{0} ven el flop. ¿Quién habla primero?', '{0} vedono il flop. Chi agisce per primo?');
  k('cq.post_last', '{0} 셋이 플랍을 봤다. 가장 마지막에 액션하는(IP) 사람은?', '{0} see the flop. Who acts last (in position)?', '{0} sehen den Flop. Wer agiert zuletzt (in Position)?', '{0} voient le flop. Qui parle en dernier (en position) ?', '{0} ven el flop. ¿Quién habla último (en posición)?', '{0} vedono il flop. Chi agisce per ultimo (in posizione)?');
  k('cq.order_pre', '프리플랍 순서: {0}. 이 셋의 순서는 {1}.', 'Preflop order: {0}. These three act {1}.', 'Preflop-Reihenfolge: {0}. Diese drei: {1}.', 'Ordre préflop : {0}. Ces trois : {1}.', 'Orden preflop: {0}. Estos tres: {1}.', 'Ordine preflop: {0}. Questi tre: {1}.');
  k('cq.order_post', '플랍 이후 순서: {0}. 이 셋의 순서는 {1}.', 'Postflop order: {0}. These three act {1}.', 'Postflop-Reihenfolge: {0}. Diese drei: {1}.', 'Ordre postflop : {0}. Ces trois : {1}.', 'Orden postflop: {0}. Estos tres: {1}.', 'Ordine postflop: {0}. Questi tre: {1}.');

  /* analysis keys (stored in logs as ids) */
  k('g.street', '스트리트', 'Street', 'Street', 'Tour', 'Calle', 'Strada');
  k('g.draw', '드로우', 'Draw', 'Draw', 'Tirage', 'Proyecto', 'Progetto');
  k('g.nouts', '아웃 수', 'Number of outs', 'Anzahl Outs', 'Nombre d’outs', 'Número de outs', 'Numero di out');
  k('g.dir', '정답 방향', 'Correct action', 'Richtige Aktion', 'Bonne action', 'Acción correcta', 'Azione corretta');
  k('g.pos', '포지션', 'Position', 'Position', 'Position', 'Posición', 'Posizione');
  k('g.handkind', '핸드 종류', 'Hand type', 'Handtyp', 'Type de main', 'Tipo de mano', 'Tipo di mano');
  k('g.mutype', '매치업 유형', 'Matchup type', 'Duell-Typ', 'Type de duel', 'Tipo de duelo', 'Tipo di scontro');
  k('g.zone', '정답 구간', 'Answer band', 'Bereich', 'Zone', 'Franja', 'Fascia');
  k('g.situation', '상황', 'Situation', 'Situation', 'Situation', 'Situación', 'Situazione');
  k('g.action', '정답 액션', 'Correct action', 'Richtige Aktion', 'Bonne action', 'Acción correcta', 'Azione corretta');
  k('g.bb_opener', 'BB가 상대한 오프너', 'Opener faced by BB', 'Opener gegen BB', 'Ouvreur face à la BB', 'Abridor contra la BB', 'Apertura contro il BB');
  k('g.myseat', '내 자리', 'My seat', 'Meine Position', 'Ma position', 'Mi posición', 'La mia posizione');
  k('g.basis', '판단 근거', 'Reason', 'Grund', 'Raison', 'Motivo', 'Motivo');
  k('g.qkind', '문제 종류', 'Question type', 'Fragetyp', 'Type de question', 'Tipo de pregunta', 'Tipo di domanda');
  k('k.flop4', '플랍 (×4)', 'Flop (×4)', 'Flop (×4)', 'Flop (×4)', 'Flop (×4)', 'Flop (×4)');
  k('k.turn2', '턴 (×2)', 'Turn (×2)', 'Turn (×2)', 'Turn (×2)', 'Turn (×2)', 'Turn (×2)');
  k('k.call_ok', '콜이 정답', 'Call is right', 'Call ist richtig', 'Suivre est juste', 'Pagar es lo correcto', 'Chiamare è giusto');
  k('k.fold_ok', '폴드가 정답', 'Fold is right', 'Fold ist richtig', 'Se coucher est juste', 'Retirarse es lo correcto', 'Passare è giusto');
  k('k.open_ok', '오픈이 정답', 'Open is right', 'Open ist richtig', 'Ouvrir est juste', 'Abrir es lo correcto', 'Aprire è giusto');
  k('k.3bet_ok', '3벳이 정답', '3-bet is right', '3-Bet ist richtig', '3-bet est juste', '3-bet es lo correcto', '3-bet è giusto');
  k('k.z_flip', '코인플립 구간', 'Coin-flip band', 'Coinflip-Bereich', 'Zone pile ou face', 'Franja moneda', 'Fascia testa o croce');
  k('k.z_edge', '약간 우세 구간', 'Slight-edge band', 'Leicht-vorne-Bereich', 'Zone léger avantage', 'Franja ligera ventaja', 'Fascia leggero vantaggio');
  k('k.z_dom', '압도적 구간', 'Dominant band', 'Klar-vorne-Bereich', 'Zone dominante', 'Franja dominante', 'Fascia dominante');
  k('k.direct_call', '직접 오즈로 콜', 'Call on direct odds', 'Call per direkten Odds', 'Suivre à la cote directe', 'Pagar por odds directas', 'Call per odds dirette');
  k('k.implied_call', '임플라이드로 콜', 'Call on implied odds', 'Call per Implied Odds', 'Suivre aux cotes implicites', 'Pagar por odds implícitas', 'Call per implied odds');
  k('k.fold', '폴드', 'Fold', 'Fold', 'Se coucher', 'Retirarse', 'Passa');
  k('k.order', '액션 순서', 'Action order', 'Aktionsreihenfolge', 'Ordre d’action', 'Orden de acción', 'Ordine d’azione');
  k('k.concept', '개념', 'Concept', 'Konzept', 'Concept', 'Concepto', 'Concetto');
  k('hk.pair_k', '포켓', 'Pocket', 'Pocket', 'Paire', 'Pareja', 'Coppia');

  /* ads / hint / revive */
  k('ad.watch', '광고 보고 {0}', 'Watch ad: {0}', 'Werbung ansehen: {0}', 'Voir une pub : {0}', 'Ver anuncio: {0}', 'Guarda pubblicità: {0}');
  k('ad.loading', '광고 불러오는 중…', 'Loading ad…', 'Werbung lädt…', 'Chargement de la pub…', 'Cargando anuncio…', 'Caricamento pubblicità…');
  k('ad.fail_retry', '광고를 불러오지 못했어요 · 다시 시도', 'Couldn’t load the ad · try again', 'Werbung nicht geladen · erneut versuchen', 'Pub indisponible · réessayer', 'No se pudo cargar · reintentar', 'Pubblicità non caricata · riprova');
  k('hint.btn', '힌트', 'Hint', 'Tipp', 'Indice', 'Pista', 'Suggerimento');
  k('rv.head', '연속 {0}에서 틀렸어요', 'Missed after {0} in a row', 'Fehler nach {0} in Folge', 'Erreur après {0} d’affilée', 'Fallo tras {0} seguidas', 'Errore dopo {0} di fila');
  k('rv.p', '한 번만 이어서 할 수 있어요. 방금 틀린 문제는 오답 노트에 남습니다.', 'You can continue once. The missed question stays in your review list.', 'Du kannst einmal weitermachen. Die falsche Frage bleibt in deiner Fehlerliste.', 'Vous pouvez continuer une fois. La question ratée reste dans vos erreurs.', 'Puedes continuar una vez. La pregunta fallada queda en tus errores.', 'Puoi continuare una volta. La domanda sbagliata resta tra gli errori.');
  k('rv.go', '이어하기 (1회)', 'Continue (once)', 'Weiterspielen (1×)', 'Continuer (1 fois)', 'Continuar (1 vez)', 'Continua (1 volta)');
  k('rv.going', '이어하는 중…', 'Continuing…', 'Weiter…', 'On continue…', 'Continuando…', 'Si continua…');
  k('rv.stop', '결과 보기', 'See results', 'Ergebnis ansehen', 'Voir le résultat', 'Ver resultados', 'Vedi risultati');
  k('rv.fail', '광고를 불러오지 못했어요. 잠시 후 다시 시도하거나 결과를 보세요.', 'Couldn’t load the ad. Try again in a moment or see your results.', 'Werbung nicht geladen. Gleich erneut versuchen oder Ergebnis ansehen.', 'Pub indisponible. Réessayez ou voyez le résultat.', 'No se pudo cargar el anuncio. Reinténtalo o mira los resultados.', 'Pubblicità non disponibile. Riprova o vedi i risultati.');

  /* challenge */
  k('mode.survival', '서바이벌', 'Survival', 'Survival', 'Survie', 'Supervivencia', 'Sopravvivenza');
  k('mode.survival_d', '틀리면 바로 끝. 몇 문제 연속으로 맞히나', 'One mistake and it’s over. How long can you go?', 'Ein Fehler und vorbei. Wie weit kommst du?', 'Une erreur et c’est fini. Jusqu’où irez-vous ?', 'Un fallo y se acabó. ¿Hasta dónde llegas?', 'Un errore ed è finita. Fin dove arrivi?');
  k('mode.attack', '타임 어택 60초', 'Time attack 60s', 'Zeitangriff 60 s', 'Contre-la-montre 60 s', 'Contrarreloj 60 s', 'A tempo 60 s');
  k('mode.attack_s', '타임어택', 'Time attack', 'Zeitangriff', 'Chrono', 'Contrarreloj', 'A tempo');
  k('mode.attack_d', '60초 안에 최대한 많이. 오답은 −5초', 'As many as you can in 60 s. Wrong answer −5 s', 'So viele wie möglich in 60 s. Fehler −5 s', 'Un maximum en 60 s. Erreur −5 s', 'Todas las que puedas en 60 s. Fallo −5 s', 'Più che puoi in 60 s. Errore −5 s');
  k('mode.sprint', '스프린트', 'Sprint', 'Sprint', 'Sprint', 'Sprint', 'Sprint');
  k('mode.sprint_d', '10문제 완주 시간. 오답 1개당 +10초', 'Time for 10 questions. +10 s per mistake', 'Zeit für 10 Fragen. +10 s pro Fehler', 'Temps pour 10 questions. +10 s par erreur', 'Tiempo para 10 preguntas. +10 s por fallo', 'Tempo per 10 domande. +10 s per errore');
  k('mode.review', '오답 복습', 'Review mistakes', 'Fehler wiederholen', 'Revoir les erreurs', 'Repasar fallos', 'Ripassa errori');
  k('mode.review_d', '틀렸던 문제 다시 풀기. 맞히면 노트에서 지워짐', 'Replay questions you missed. Correct ones leave the list', 'Falsche Fragen erneut lösen. Richtige verschwinden', 'Rejouez vos erreurs. Les bonnes réponses sortent de la liste', 'Repite las que fallaste. Las acertadas salen de la lista', 'Rifai le domande sbagliate. Quelle giuste escono dalla lista');
  k('ch.today_n', '오늘 푼 문제', 'Today', 'Heute', 'Aujourd’hui', 'Hoy', 'Oggi');
  k('ch.today_acc', '오늘 정확도', 'Today’s accuracy', 'Quote heute', 'Précision du jour', 'Precisión hoy', 'Precisione oggi');
  k('ch.avg', '평균 응답', 'Avg. time', 'Ø Zeit', 'Temps moyen', 'Tiempo medio', 'Tempo medio');
  k('ch.types', '문제 유형', 'Question type', 'Fragetyp', 'Type de question', 'Tipo de pregunta', 'Tipo di domanda');
  k('ch.left_notes', '남은 오답', 'To review', 'Offen', 'À revoir', 'Por repasar', 'Da ripassare');
  k('ch.best', '최고 기록', 'Best', 'Bestwert', 'Record', 'Mejor marca', 'Record');
  k('an.title', '약점 분석', 'Weak spots', 'Schwachstellen', 'Points faibles', 'Puntos débiles', 'Punti deboli');
  k('an.sub', '최근 {0}문제 · 연습+챌린지', 'last {0} questions · practice + challenge', 'letzte {0} Fragen · Training + Challenge', '{0} dernières questions · entraînement + défi', 'últimas {0} preguntas · práctica + reto', 'ultime {0} domande · allenamento + sfida');
  k('an.empty', '아직 기록 없음', 'No data yet', 'Noch keine Daten', 'Pas encore de données', 'Aún sin datos', 'Nessun dato');
  k('an.head', '{0}문제 · {1}% · 평균 {2}초', '{0} q. · {1}% · avg {2}s', '{0} Fragen · {1}% · Ø {2} s', '{0} q. · {1}% · moy. {2} s', '{0} preg. · {1}% · media {2} s', '{0} dom. · {1}% · media {2} s');
  k('an.weak', '가장 약한 상황: {0} ({1}) — 정확도 {2}%, {3}문제', 'Weakest spot: {0} ({1}) — {2}% over {3} questions', 'Größte Schwäche: {0} ({1}) — {2}% bei {3} Fragen', 'Point le plus faible : {0} ({1}) — {2}% sur {3} questions', 'Punto más débil: {0} ({1}) — {2}% en {3} preguntas', 'Punto più debole: {0} ({1}) — {2}% su {3} domande');
  k('an.bias_pot_tight', '콜해야 할 때 폴드하는 경향 — 드로우 승률을 낮게 보거나 필요 승률을 높게 계산하고 있을 수 있어요.', 'You tend to fold when you should call — you may be underestimating draw equity or overestimating the price.', 'Du foldest oft, wo ein Call richtig wäre — evtl. unterschätzt du die Draw-Equity oder überschätzt den Preis.', 'Vous vous couchez quand il faut suivre — vous sous-estimez peut-être l’équité du tirage ou surestimez le prix.', 'Tiendes a retirarte cuando toca pagar — quizá infravaloras la equity del proyecto o sobrevaloras el precio.', 'Tendi a passare quando dovresti chiamare — forse sottovaluti l’equity del progetto o sopravvaluti il prezzo.');
  k('an.bias_pot_loose', '폴드해야 할 때 콜하는 경향 — 팟 오즈 분모에 내 콜 금액까지 넣었는지 확인해 보세요.', 'You tend to call when you should fold — check that the pot-odds denominator includes your own call.', 'Du callst oft, wo Fold richtig wäre — gehört dein Call in den Nenner der Pot Odds?', 'Vous suivez quand il faut se coucher — vérifiez que votre call est bien dans le dénominateur.', 'Tiendes a pagar cuando toca retirarse — revisa que tu pago esté en el denominador.', 'Tendi a chiamare quando dovresti passare — controlla che il tuo call sia nel denominatore.');
  k('an.bias_pre_tight', '오픈해야 할 핸드를 버리는 경향 — 레인지를 실제보다 타이트하게 잡고 있어요.', 'You fold hands that should be opened — your ranges are tighter than the chart.', 'Du foldest Hände, die geöffnet werden sollten — deine Ranges sind zu eng.', 'Vous jetez des mains à ouvrir — vos ranges sont trop serrées.', 'Tiras manos que deberías abrir — tus rangos son demasiado tight.', 'Passi mani da aprire — i tuoi range sono troppo stretti.');
  k('an.bias_pre_loose', '폴드해야 할 핸드를 여는 경향 — 레인지를 실제보다 루즈하게 잡고 있어요.', 'You open hands that should be folded — your ranges are looser than the chart.', 'Du öffnest Hände, die gefoldet werden sollten — deine Ranges sind zu weit.', 'Vous ouvrez des mains à jeter — vos ranges sont trop larges.', 'Abres manos que deberías tirar — tus rangos son demasiado amplios.', 'Apri mani da passare — i tuoi range sono troppo larghi.');
  k('an.more', '10문제 이상 쌓이면 분석이 더 믿을 만해집니다.', 'Analysis gets more reliable after 10+ questions.', 'Ab 10 Fragen wird die Analyse aussagekräftiger.', 'L’analyse devient fiable après 10 questions.', 'El análisis es más fiable a partir de 10 preguntas.', 'L’analisi diventa affidabile dopo 10 domande.');
  k('an.clear_log', '분석 기록 지우기', 'Clear analysis log', 'Analyse löschen', 'Effacer l’analyse', 'Borrar análisis', 'Cancella analisi');
  k('an.clear_notes', '오답 노트 비우기', 'Clear review list', 'Fehlerliste leeren', 'Vider les erreurs', 'Vaciar fallos', 'Svuota errori');
  k('rb.cw', '정답 {0} · 오답 {1}', 'right {0} · wrong {1}', 'richtig {0} · falsch {1}', 'justes {0} · fausses {1}', 'bien {0} · mal {1}', 'giuste {0} · sbagliate {1}');
  k('rb.w', '오답 {0}', 'wrong {0}', 'falsch {0}', 'fausses {0}', 'fallos {0}', 'errori {0}');
  k('rb.streak', '연속 정답', 'in a row', 'in Folge', 'd’affilée', 'seguidas', 'di fila');
  k('rb.hit', '맞힘 {0}', 'correct {0}', 'richtig {0}', 'justes {0}', 'aciertos {0}', 'giuste {0}');
  k('rb.quit', '그만', 'Quit', 'Ende', 'Quitter', 'Salir', 'Esci');
  k('rb.quit_sure', '정말 그만?', 'Really quit?', 'Wirklich beenden?', 'Vraiment ?', '¿Seguro?', 'Sicuro?');
  k('rb.preparing', '다음 문제 준비 중…', 'Preparing next question…', 'Nächste Frage…', 'Question suivante…', 'Preparando la siguiente…', 'Prossima domanda…');
  k('fb.tap', '탭하여 계속', 'tap to continue', 'tippen zum Weiter', 'toucher pour continuer', 'toca para seguir', 'tocca per continuare');
  k('end.dnf', '미완주', 'DNF', 'Abbruch', 'Abandon', 'Sin terminar', 'Non finito');
  k('end.u_survival', '연속 정답', 'correct in a row', 'richtige in Folge', 'bonnes réponses d’affilée', 'aciertos seguidos', 'risposte giuste di fila');
  k('end.u_attack', '문제 정답 (60초)', 'correct in 60 s', 'richtig in 60 s', 'justes en 60 s', 'aciertos en 60 s', 'giuste in 60 s');
  k('end.u_sprint_pen', '순수 {0} + 페널티 {1}초', 'raw {0} + {1}s penalty', 'netto {0} + {1} s Strafe', 'brut {0} + {1} s de pénalité', 'neto {0} + {1} s de penalización', 'netto {0} + {1} s di penalità');
  k('end.u_sprint_clean', '페널티 없음', 'no penalties', 'ohne Strafzeit', 'sans pénalité', 'sin penalizaciones', 'nessuna penalità');
  k('end.u_review', '복습 정답 · 남은 오답 {0}', 'reviewed correctly · {0} left', 'richtig wiederholt · {0} offen', 'revues justes · {0} restantes', 'repasadas bien · quedan {0}', 'ripassate giuste · ne restano {0}');
  k('end.new', '신기록', 'New record', 'Neuer Rekord', 'Nouveau record', 'Nuevo récord', 'Nuovo record');
  k('end.best', '최고 기록 {0}', 'Best {0}', 'Bestwert {0}', 'Record {0}', 'Mejor {0}', 'Record {0}');
  k('end.revived', '부활 1회 사용', 'Used 1 revive', '1× weitergespielt', '1 relance utilisée', '1 continuación usada', '1 continuazione usata');
  k('end.cw', '정답 / 오답', 'Right / wrong', 'Richtig / falsch', 'Justes / fausses', 'Bien / mal', 'Giuste / sbagliate');
  k('end.ended_at', '여기서 끝난 문제 — {0}', 'The question that ended it — {0}', 'Hier war Schluss — {0}', 'La question fatale — {0}', 'La pregunta que lo terminó — {0}', 'La domanda finale — {0}');
  k('end.again', '다시 하기', 'Play again', 'Nochmal', 'Rejouer', 'Otra vez', 'Ancora');
  k('end.modes', '모드 선택', 'Modes', 'Modi', 'Modes', 'Modos', 'Modalità');
  k('end.review', '문제별 리뷰', 'Question review', 'Fragen-Rückblick', 'Revue des questions', 'Repaso de preguntas', 'Revisione domande');
  k('end.tap', '탭하면 해설', 'tap for explanation', 'tippen für Erklärung', 'toucher pour l’explication', 'toca para ver la explicación', 'tocca per la spiegazione');
  k('goal.today', '오늘 목표 {0} / {1}', 'Today {0} / {1}', 'Heute {0} / {1}', 'Aujourd’hui {0} / {1}', 'Hoy {0} / {1}', 'Oggi {0} / {1}');
  k('goal.done', '달성', 'done', 'geschafft', 'atteint', 'logrado', 'fatto');
  k('goal.streak', '연속 학습 {0}일', '{0}-day streak', '{0} Tage in Folge', '{0} jours d’affilée', 'racha de {0} días', '{0} giorni di fila');

  /* guide UI */
  k('g.search', '용어·공식 검색 (예: 팟 오즈, MDF, 셋)', 'Search terms & formulas (e.g. pot odds, MDF, set)', 'Begriffe & Formeln suchen (z. B. Pot Odds, MDF, Set)', 'Chercher termes et formules (ex. cote, MDF, brelan)', 'Buscar términos y fórmulas (p. ej. pot odds, MDF, set)', 'Cerca termini e formule (es. pot odds, MDF, set)');
  k('g.no_result', '검색 결과가 없어요.', 'No results.', 'Keine Treffer.', 'Aucun résultat.', 'Sin resultados.', 'Nessun risultato.');
  k('g.lang_note', '언어를 바꾸면 화면을 다시 불러옵니다. 기록은 그대로 유지돼요.', 'Changing the language reloads the app. Your stats are kept.', 'Ein Sprachwechsel lädt die App neu. Deine Statistik bleibt erhalten.', 'Changer de langue recharge l’app. Vos statistiques sont conservées.', 'Cambiar de idioma recarga la app. Tus datos se conservan.', 'Cambiare lingua ricarica l’app. Le statistiche restano.');
  k('g.terms_h', '용어 사전', 'Glossary', 'Glossar', 'Lexique', 'Glosario', 'Glossario');
  k('g.count', '{0}개', '{0} terms', '{0} Begriffe', '{0} termes', '{0} términos', '{0} termini');
  k('g.ex', '예)', 'e.g.', 'z. B.', 'ex.', 'p. ej.', 'es.');
  k('g.see_formula', '공식 보기 →', 'See formula →', 'Zur Formel →', 'Voir la formule →', 'Ver fórmula →', 'Vedi formula →');
  k('g.see', '관련 개념', 'Related', 'Verwandt', 'Voir aussi', 'Relacionado', 'Correlati');
  k('gs.lang', '언어', 'Language', 'Sprache', 'Langue', 'Idioma', 'Lingua');
  k('gs.terms', '용어', 'Terms', 'Begriffe', 'Termes', 'Términos', 'Termini');
  k('gs.formulas', '공식', 'Formulas', 'Formeln', 'Formules', 'Fórmulas', 'Formule');
  k('gs.calc', '계산기', 'Calculator', 'Rechner', 'Calculateur', 'Calculadora', 'Calcolatrice');
  k('gs.equity', '에퀴티 계산', 'Equity', 'Equity', 'Équité', 'Equity', 'Equity');
  k('gs.outs', '아웃츠 표', 'Outs table', 'Outs-Tabelle', 'Table des outs', 'Tabla de outs', 'Tabella out');
  k('gs.prob', '확률', 'Odds', 'Wahrsch.', 'Probabilités', 'Probabilidades', 'Probabilità');
  k('gs.prob_h', '족보 · 확률', 'Hand ranks & probabilities', 'Handränge & Wahrscheinlichkeiten', 'Mains & probabilités', 'Manos y probabilidades', 'Mani e probabilità');
  k('gs.seats', '포지션', 'Positions', 'Positionen', 'Positions', 'Posiciones', 'Posizioni');
  k('gs.ranges', '레인지 표', 'Ranges', 'Ranges', 'Ranges', 'Rangos', 'Range');
  k('gs.mu', '매치업', 'Matchups', 'Duelle', 'Duels', 'Duelos', 'Scontri');
  k('gs.rules', '앱 기준', 'App rules', 'App-Regeln', 'Règles de l’app', 'Reglas de la app', 'Regole dell’app');
  k('gs.data', '데이터', 'Data', 'Daten', 'Données', 'Datos', 'Dati');
  k('gc.basic', '기본', 'Basics', 'Grundlagen', 'Bases', 'Básicos', 'Base');
  k('gc.action', '베팅·액션', 'Betting & actions', 'Setzen & Aktionen', 'Mises & actions', 'Apuestas y acciones', 'Puntate e azioni');
  k('gc.math', '수학', 'Math', 'Mathematik', 'Maths', 'Matemáticas', 'Matematica');
  k('gc.hand', '핸드·보드', 'Hands & boards', 'Hände & Boards', 'Mains & boards', 'Manos y boards', 'Mani e board');
  k('gc.strategy', '전략', 'Strategy', 'Strategie', 'Stratégie', 'Estrategia', 'Strategia');
  k('calc.h', '팟 오즈 · 아웃츠 계산기', 'Pot odds & outs calculator', 'Pot-Odds- & Outs-Rechner', 'Calculateur cote & outs', 'Calculadora de pot odds y outs', 'Calcolatrice pot odds e out');
  k('calc.stack', '유효 스택 (콜 후)', 'Effective stack (after call)', 'Effektiver Stack (nach Call)', 'Tapis effectif (après call)', 'Stack efectiva (tras pagar)', 'Stack effettivo (dopo call)');
  k('calc.outs', '아웃츠', 'Outs', 'Outs', 'Outs', 'Outs', 'Out');
  k('calc.flop2', '플랍 (2장)', 'Flop (2 cards)', 'Flop (2 Karten)', 'Flop (2 cartes)', 'Flop (2 cartas)', 'Flop (2 carte)');
  k('calc.turn1', '턴 (1장)', 'Turn (1 card)', 'Turn (1 Karte)', 'Turn (1 carte)', 'Turn (1 carta)', 'Turn (1 carta)');
  k('calc.need', '필요 승률 (팟 오즈)', 'Needed equity (pot odds)', 'Nötige Equity (Pot Odds)', 'Équité requise (cote)', 'Equity necesaria (pot odds)', 'Equity necessaria (pot odds)');
  k('calc.ratio', '오즈 비율', 'Odds ratio', 'Odds-Verhältnis', 'Cote', 'Ratio de odds', 'Rapporto odds');
  k('calc.ratio_f', '(팟 + 베팅) : 콜', '(pot + bet) : call', '(Pot + Bet) : Call', '(pot + mise) : call', '(bote + apuesta) : pago', '(piatto + puntata) : call');
  k('calc.mdf_f', '팟 ÷ (팟 + 베팅)', 'pot ÷ (pot + bet)', 'Pot ÷ (Pot + Bet)', 'pot ÷ (pot + mise)', 'bote ÷ (bote + apuesta)', 'piatto ÷ (piatto + puntata)');
  k('calc.bluff', '블러프 손익분기 폴드율', 'Bluff break-even fold %', 'Bluff: nötige Fold-Quote', 'Fold requis pour un bluff', 'Fold necesario para farol', 'Fold necessario al bluff');
  k('calc.bluff_f', '베팅 ÷ (팟 + 베팅)', 'bet ÷ (pot + bet)', 'Bet ÷ (Pot + Bet)', 'mise ÷ (pot + mise)', 'apuesta ÷ (bote + apuesta)', 'puntata ÷ (piatto + puntata)');
  k('calc.ratio_river', '리버 블러프 비중', 'River bluff share', 'River-Bluffanteil', 'Part de bluffs river', 'Proporción de faroles river', 'Quota di bluff al river');
  k('calc.ratio_river_f', '베팅 ÷ (팟 + 2 × 베팅)', 'bet ÷ (pot + 2 × bet)', 'Bet ÷ (Pot + 2 × Bet)', 'mise ÷ (pot + 2 × mise)', 'apuesta ÷ (bote + 2 × apuesta)', 'puntata ÷ (piatto + 2 × puntata)');
  k('calc.spr', '콜 후 SPR', 'SPR after call', 'SPR nach Call', 'SPR après call', 'SPR tras pagar', 'SPR dopo il call');
  k('calc.spr_f', '스택 ÷ (팟 + 2 × 베팅)', 'stack ÷ (pot + 2 × bet)', 'Stack ÷ (Pot + 2 × Bet)', 'tapis ÷ (pot + 2 × mise)', 'stack ÷ (bote + 2 × apuesta)', 'stack ÷ (piatto + 2 × puntata)');
  k('calc.rule', '규칙값 (×{0})', 'Rule (×{0})', 'Faustregel (×{0})', 'Règle (×{0})', 'Regla (×{0})', 'Regola (×{0})');
  k('calc.corr', '보정 {0}%', 'adjusted {0}%', 'korrigiert {0}%', 'corrigé {0}%', 'corregido {0}%', 'corretto {0}%');
  k('calc.exact', '정확한 확률', 'Exact', 'Exakt', 'Exact', 'Exacto', 'Esatto');
  k('calc.cmp', '위 팟 오즈와 비교 (정확값 기준)', 'Versus the pot odds above (exact)', 'Gegen die Pot Odds oben (exakt)', 'Face à la cote ci-dessus (exact)', 'Frente a las pot odds de arriba (exacto)', 'Contro le pot odds sopra (esatto)');
  k('calc.call_good', '콜 이득', 'call is +EV', 'Call ist +EV', 'suivre est +EV', 'pagar es +EV', 'chiamare è +EV');
  k('calc.ev', '콜 EV {0}', 'call EV {0}', 'Call-EV {0}', 'EV du call {0}', 'EV del pago {0}', 'EV del call {0}');
  k('calc.implied', '임플라이드로 {0} 이상 더 받아내야 본전', 'need {0}+ in implied winnings to break even', 'brauchst {0}+ Implied Winnings für Break-even', 'il faut {0}+ de gains implicites', 'necesitas {0}+ de ganancias implícitas', 'servono {0}+ di vincite implicite');
  k('eqc.h', '에퀴티 계산기', 'Equity calculator', 'Equity-Rechner', 'Calculateur d’équité', 'Calculadora de equity', 'Calcolatrice equity');
  k('eqc.sub', '핸드 vs 핸드', 'hand vs hand', 'Hand vs Hand', 'main contre main', 'mano vs mano', 'mano vs mano');
  k('eqc.board', 'BOARD (선택)', 'BOARD (optional)', 'BOARD (optional)', 'BOARD (facultatif)', 'BOARD (opcional)', 'BOARD (facoltativo)');
  k('eqc.run', '계산', 'Calculate', 'Berechnen', 'Calculer', 'Calcular', 'Calcola');
  k('eqc.clear', '초기화', 'Clear', 'Leeren', 'Effacer', 'Borrar', 'Pulisci');
  k('eqc.calculating', '계산 중…', 'Calculating…', 'Berechne…', 'Calcul…', 'Calculando…', 'Calcolo…');
  k('eqc.note', '보드 0장: 몬테카를로 100,000회 · 1~2장: 몬테카를로 · 3장 이상: 남은 카드를 전부 계산(정확값)', 'Empty board: Monte Carlo 100,000 runs · 1–2 cards: Monte Carlo · 3+ cards: every remaining card enumerated (exact)', 'Leeres Board: Monte Carlo 100.000 · 1–2 Karten: Monte Carlo · ab 3 Karten: alle Restkarten (exakt)', 'Board vide : Monte-Carlo 100 000 · 1–2 cartes : Monte-Carlo · 3+ cartes : toutes les cartes restantes (exact)', 'Board vacío: Montecarlo 100.000 · 1–2 cartas: Montecarlo · 3+ cartas: todas las restantes (exacto)', 'Board vuoto: Monte Carlo 100.000 · 1–2 carte: Monte Carlo · 3+ carte: tutte le restanti (esatto)');
  k('eqc.exact', '남은 보드 {0}가지를 전부 계산한 정확값', 'Exact: all {0} remaining boards enumerated', 'Exakt: alle {0} restlichen Boards berechnet', 'Exact : les {0} boards restants calculés', 'Exacto: los {0} boards restantes calculados', 'Esatto: tutti i {0} board restanti calcolati');
  k('eqc.mc', '몬테카를로 {0}회 · 표준오차 ±{1}%p', 'Monte Carlo {0} runs · standard error ±{1} pts', 'Monte Carlo {0} Läufe · Standardfehler ±{1} Pkt.', 'Monte-Carlo {0} tirages · erreur type ±{1} pts', 'Montecarlo {0} simulaciones · error estándar ±{1} pts', 'Monte Carlo {0} simulazioni · errore standard ±{1} pt');
  k('ot.h_outs', '아웃', 'Outs', 'Outs', 'Outs', 'Outs', 'Out');
  k('ot.h_spot', '대표 상황', 'Typical spot', 'Typische Situation', 'Situation type', 'Situación típica', 'Situazione tipica');
  k('ot.h_turn', '턴→리버', 'Turn→river', 'Turn→River', 'Turn→river', 'Turn→river', 'Turn→river');
  k('ot.h_flop', '플랍 올인', 'Flop all-in', 'Flop all-in', 'Flop all-in', 'Flop all-in', 'Flop all-in');
  k('ot.exact', '정확', 'exact', 'exakt', 'exact', 'exacto', 'esatto');
  k('ot.2', '포켓페어 → 셋', 'Pocket pair → set', 'Pocket Pair → Set', 'Paire servie → brelan', 'Pareja de mano → set', 'Coppia servita → set');
  k('ot.3', '오버카드 1장', 'One overcard', 'Eine Overcard', 'Une overcard', 'Una overcard', 'Una overcard');
  k('ot.4', '거트샷 · 투페어 → 풀하우스', 'Gutshot · two pair → full house', 'Gutshot · Zwei Paare → Full House', 'Ventrale · double paire → full', 'Gutshot · doble pareja → full', 'Incastro · doppia coppia → full');
  k('ot.5', '원페어 → 투페어·트리플', 'Pair → two pair/trips', 'Paar → Zwei Paare/Drilling', 'Paire → double paire/brelan', 'Pareja → doble pareja/trío', 'Coppia → doppia coppia/tris');
  k('ot.6', '오버카드 2장', 'Two overcards', 'Zwei Overcards', 'Deux overcards', 'Dos overcards', 'Due overcard');
  k('ot.7', '셋 → 풀하우스·포카드 (플랍)', 'Set → full house/quads (flop)', 'Set → Full House/Vierling (Flop)', 'Brelan → full/carré (flop)', 'Set → full/póker (flop)', 'Set → full/poker (flop)');
  k('ot.8', '양방 스트레이트 · 더블 거트샷', 'Open-ended · double gutshot', 'Open-Ended · Double Gutshot', 'Bilatéral · double ventrale', 'Escalera abierta · doble gutshot', 'Bilaterale · doppio incastro');
  k('ot.9', '플러시 드로우', 'Flush draw', 'Flush Draw', 'Tirage couleur', 'Proyecto de color', 'Progetto colore');
  k('ot.10', '거트샷 + 오버카드 2장', 'Gutshot + two overcards', 'Gutshot + zwei Overcards', 'Ventrale + deux overcards', 'Gutshot + dos overcards', 'Incastro + due overcard');
  k('ot.12', '플러시 + 거트샷', 'Flush draw + gutshot', 'Flush Draw + Gutshot', 'Couleur + ventrale', 'Color + gutshot', 'Colore + incastro');
  k('ot.15', '플러시 + 양방 · 플러시 + 오버카드 2장', 'Flush + open-ended · flush + two overs', 'Flush + Open-Ended · Flush + zwei Overcards', 'Couleur + bilatéral · couleur + deux overcards', 'Color + abierta · color + dos overcards', 'Colore + bilaterale · colore + due overcard');
  k('ot.note', '×4 규칙은 아웃츠가 많을수록 실제보다 높게 나옵니다 (15아웃: 60% vs {0}).', 'The ×4 rule overshoots with many outs (15 outs: 60% vs {0}).', 'Mit vielen Outs liegt ×4 zu hoch (15 Outs: 60% vs {0}).', 'Avec beaucoup d’outs, ×4 surestime (15 outs : 60% vs {0}).', 'Con muchos outs, ×4 se pasa (15 outs: 60% vs {0}).', 'Con molti out, ×4 sovrastima (15 out: 60% vs {0}).');
  k('pr.sub', '족보 순위와 7장(홀카드 2 + 보드 5)으로 최종 완성될 확률', 'Hand ranking and the chance of finishing with each hand using 7 cards (2 hole + 5 board)', 'Rangfolge und Wahrscheinlichkeit für jede Hand mit 7 Karten (2 + 5)', 'Classement des mains et probabilité de finir avec chacune sur 7 cartes (2 + 5)', 'Ranking de manos y probabilidad de terminar con cada una con 7 cartas (2 + 5)', 'Classifica delle mani e probabilità di chiudere con ciascuna su 7 carte (2 + 5)');
  k('pr.common', '자주 쓰는 확률 (앱이 직접 계산)', 'Handy probabilities (computed by the app)', 'Nützliche Wahrscheinlichkeiten (von der App berechnet)', 'Probabilités utiles (calculées par l’app)', 'Probabilidades útiles (calculadas por la app)', 'Probabilità utili (calcolate dall’app)');
  k('pr.pp', '포켓페어를 받을 확률', 'Being dealt a pocket pair', 'Ein Pocket Pair bekommen', 'Recevoir une paire servie', 'Recibir pareja de mano', 'Ricevere una coppia servita');
  k('pr.aa', '특정 페어 (예: AA)', 'A specific pair (e.g. AA)', 'Ein bestimmtes Paar (z. B. AA)', 'Une paire précise (ex. AA)', 'Una pareja concreta (p. ej. AA)', 'Una coppia precisa (es. AA)');
  k('pr.suited', '수딧 핸드를 받을 확률', 'Being dealt a suited hand', 'Eine suited Hand bekommen', 'Recevoir une main assortie', 'Recibir una mano suited', 'Ricevere una mano suited');
  k('pr.ak', 'AK (수딧+오프)', 'AK (suited + offsuit)', 'AK (suited + offsuit)', 'AK (assortie + dépareillée)', 'AK (suited + offsuit)', 'AK (suited + offsuit)');
  k('pr.set', '포켓페어 → 플랍에서 셋 이상', 'Pocket pair → set or better on the flop', 'Pocket Pair → Set oder besser am Flop', 'Paire servie → brelan ou mieux au flop', 'Pareja de mano → set o más en el flop', 'Coppia servita → set o meglio al flop');
  k('pr.pairup', '페어 아닌 핸드 → 플랍에서 홀카드가 페어 이상', 'Unpaired hand → pairs a hole card on the flop', 'Ungepaarte Hand → paart eine Karte am Flop', 'Main non appariée → apparie une carte au flop', 'Mano sin pareja → empareja una carta en el flop', 'Mano non accoppiata → accoppia una carta al flop');
  k('pr.flush', '수딧 → 플랍에서 플러시 완성', 'Suited → flush on the flop', 'Suited → Flush am Flop', 'Assortie → couleur au flop', 'Suited → color en el flop', 'Suited → colore al flop');
  k('pr.fd', '수딧 → 플랍에서 플러시 드로우', 'Suited → flush draw on the flop', 'Suited → Flush Draw am Flop', 'Assortie → tirage couleur au flop', 'Suited → proyecto de color en el flop', 'Suited → progetto colore al flop');
  k('pr.fd_river', '플랍 플러시 드로우 → 리버까지 완성', 'Flop flush draw → made by the river', 'Flush Draw am Flop → bis zum River', 'Tirage couleur au flop → touché à la river', 'Proyecto de color en flop → ligado al river', 'Progetto colore al flop → chiuso al river');
  k('pr.fd_turn', '턴 플러시 드로우 → 리버 완성', 'Turn flush draw → made on the river', 'Flush Draw am Turn → am River', 'Tirage couleur au turn → touché à la river', 'Proyecto de color en turn → ligado en river', 'Progetto colore al turn → chiuso al river');
  k('se.order', '액션 순서', 'Action order', 'Aktionsreihenfolge', 'Ordre d’action', 'Orden de acción', 'Ordine d’azione');
  k('se.pre', '프리플랍', 'Preflop', 'Preflop', 'Préflop', 'Preflop', 'Preflop');
  k('se.post', '플랍 이후', 'Postflop', 'Postflop', 'Postflop', 'Postflop', 'Postflop');
  k('se.note', '프리플랍은 블라인드가 마지막, 플랍부터는 블라인드가 먼저. 그래서 BTN은 포스트플랍에서 항상 IP, 블라인드는 대부분 OOP입니다. RFI % = 앱 기준 오픈 비율.', 'Preflop the blinds act last; from the flop on they act first. So the button is always in position postflop and the blinds are mostly out of position. RFI % = this app’s opening share.', 'Preflop agieren die Blinds zuletzt, ab dem Flop zuerst. Daher ist der Button postflop immer in Position, die Blinds meist OOP. RFI % = Open-Anteil dieser App.', 'Préflop, les blinds parlent en dernier ; dès le flop, en premier. Le bouton est donc toujours en position postflop, les blinds souvent hors position. RFI % = part d’ouverture de l’app.', 'Preflop las ciegas hablan últimas; desde el flop, primeras. Por eso el botón siempre está en posición postflop y las ciegas casi siempre fuera. RFI % = % de apertura de la app.', 'Preflop i bui parlano per ultimi; dal flop per primi. Per questo il bottone è sempre in posizione postflop e i bui quasi sempre fuori. RFI % = quota di apertura dell’app.');
  k('rg.h', '레인지 표', 'Range charts', 'Range-Tabellen', 'Tableaux de ranges', 'Tablas de rangos', 'Tabelle dei range');
  k('rg.app', '앱 기준', 'app chart', 'App-Tabelle', 'tableau de l’app', 'tabla de la app', 'tabella dell’app');
  k('rg.rfi', '오픈 (RFI)', 'Open (RFI)', 'Open (RFI)', 'Ouverture (RFI)', 'Apertura (RFI)', 'Apertura (RFI)');
  k('rg.vs_key', '{0} 오픈 · {1}', '{0} opens · {1}', '{0} öffnet · {1}', '{0} ouvre · {1}', '{0} abre · {1}', '{0} apre · {1}');
  k('rg.no_call', '콜 없음 (3벳 or 폴드)', 'no calls (3-bet or fold)', 'kein Call (3-Bet oder Fold)', 'pas de call (3-bet ou se coucher)', 'sin pago (3-bet o retirarse)', 'nessun call (3-bet o passa)');
  k('gm.h', '대표 매치업', 'Classic matchups', 'Klassische Duelle', 'Duels classiques', 'Duelos clásicos', 'Scontri classici');
  k('gm.sub', '정확값 (전체 보드 계산)', 'exact (all boards enumerated)', 'exakt (alle Boards berechnet)', 'exact (tous les boards)', 'exacto (todos los boards)', 'esatto (tutti i board)');
  k('gm.note', '무늬에 따라 ±1%p 정도 달라집니다. 에퀴티 = 승 + 무승부 ÷ 2.', 'Suits shift these by about ±1 pt. Equity = wins + ties ÷ 2.', 'Je nach Farben ca. ±1 Pkt. Unterschied. Equity = Siege + Splits ÷ 2.', 'Les couleurs font varier d’environ ±1 pt. Équité = victoires + partages ÷ 2.', 'Los palos cambian ±1 pt aprox. Equity = victorias + empates ÷ 2.', 'I semi spostano di circa ±1 pt. Equity = vittorie + pareggi ÷ 2.');
  k('gr.h', '이 앱의 채점 기준', 'How this app grades', 'So bewertet die App', 'Comment l’app corrige', 'Cómo puntúa la app', 'Come valuta l’app');
  k('gd.h', '설정 · 데이터', 'Settings & data', 'Einstellungen & Daten', 'Réglages & données', 'Ajustes y datos', 'Impostazioni e dati');
  k('gd.goal', '하루 목표 문제 수', 'Daily goal (questions)', 'Tagesziel (Fragen)', 'Objectif quotidien (questions)', 'Objetivo diario (preguntas)', 'Obiettivo giornaliero (domande)');
  k('gd.backup', '백업', 'Backup', 'Sicherung', 'Sauvegarde', 'Copia de seguridad', 'Backup');
  k('gd.backup_p', '앱을 지우면 기록도 사라져요. 아래 코드를 복사해 메모장 등에 보관하면 나중에 복원할 수 있어요.', 'Uninstalling deletes your stats. Copy the code below somewhere safe to restore later.', 'Beim Deinstallieren gehen Daten verloren. Kopiere den Code und bewahre ihn auf, um später wiederherzustellen.', 'Désinstaller efface vos données. Copiez ce code en lieu sûr pour restaurer plus tard.', 'Desinstalar borra tus datos. Copia este código en un lugar seguro para restaurarlo.', 'Disinstallare cancella i dati. Copia questo codice in un posto sicuro per ripristinarlo.');
  k('gd.make', '백업 코드 만들기', 'Create backup code', 'Code erstellen', 'Créer le code', 'Crear código', 'Crea codice');
  k('gd.copy', '복사', 'Copy', 'Kopieren', 'Copier', 'Copiar', 'Copia');
  k('gd.copied', '복사됨', 'Copied', 'Kopiert', 'Copié', 'Copiado', 'Copiato');
  k('gd.copy_manual', '길게 눌러 복사', 'Long-press to copy', 'Lange drücken zum Kopieren', 'Appui long pour copier', 'Mantén pulsado para copiar', 'Tieni premuto per copiare');
  k('gd.restore', '복원', 'Restore', 'Wiederherstellen', 'Restaurer', 'Restaurar', 'Ripristina');
  k('gd.restore_p', '백업 코드를 붙여넣고 복원을 누르세요. 지금 기록은 덮어써집니다.', 'Paste a backup code and tap Restore. Current data will be overwritten.', 'Code einfügen und Wiederherstellen tippen. Aktuelle Daten werden überschrieben.', 'Collez un code et touchez Restaurer. Les données actuelles seront écrasées.', 'Pega un código y pulsa Restaurar. Se sobrescribirán los datos actuales.', 'Incolla un codice e tocca Ripristina. I dati attuali verranno sovrascritti.');
  k('gd.paste', '백업 코드 붙여넣기', 'Paste backup code', 'Code einfügen', 'Coller le code', 'Pegar código', 'Incolla codice');
  k('gd.restored', '복원 완료 — 다시 불러오는 중…', 'Restored — reloading…', 'Wiederhergestellt — lädt neu…', 'Restauré — rechargement…', 'Restaurado — recargando…', 'Ripristinato — ricarico…');
  k('gd.restore_err', '코드를 읽을 수 없어요. 전체를 붙여넣었는지 확인해 주세요.', 'Can’t read the code. Make sure you pasted all of it.', 'Code nicht lesbar. Wurde alles eingefügt?', 'Code illisible. L’avez-vous collé en entier ?', 'No se puede leer el código. ¿Lo pegaste completo?', 'Codice illeggibile. L’hai incollato tutto?');
  k('gd.ads', '광고', 'Ads', 'Werbung', 'Publicité', 'Anuncios', 'Pubblicità');
  k('gd.ads_on', '이 버전은 광고로 운영돼요. 배너는 가이드·챌린지 홈/결과 화면에만, 전면 광고는 챌린지를 3판 이상 한 뒤 2판마다(3분 간격) 결과 화면에서 넘어갈 때만 나와요. 힌트·서바이벌 이어하기는 원할 때만 광고를 봅니다. 문제 푸는 화면에는 광고가 없어요.', 'This version is ad-supported. Banners appear only on the guide and challenge home/results; full-screen ads only when leaving challenge results, after 3+ runs, every 2 runs, at least 3 min apart. Hints and survival continues show an ad only if you choose. No ads on question screens.', 'Diese Version ist werbefinanziert. Banner nur in Guide und Challenge-Start/Ergebnis; Vollbild nur beim Verlassen der Ergebnisse, ab 3 Runden, alle 2 Runden, mind. 3 Min. Abstand. Tipps und Weiterspielen nur auf Wunsch. Keine Werbung bei Fragen.', 'Cette version est financée par la pub. Bannières uniquement dans le guide et l’accueil/résultat des défis ; pub plein écran en quittant les résultats, après 3 parties, toutes les 2, à 3 min d’intervalle. Indices et relances : pub seulement si vous le voulez. Aucune pub pendant les questions.', 'Esta versión tiene anuncios. Banners solo en la guía y en inicio/resultados del reto; anuncios a pantalla completa solo al salir de resultados, tras 3+ partidas, cada 2, con 3 min de intervalo. Pistas y continuaciones: anuncio solo si quieres. Sin anuncios en las preguntas.', 'Questa versione ha pubblicità. Banner solo nella guida e in home/risultati delle sfide; schermo intero solo uscendo dai risultati, dopo 3+ partite, ogni 2, ad almeno 3 min. Suggerimenti e continuazioni: pubblicità solo se vuoi. Nessuna pubblicità nelle domande.');
  k('gd.ads_off', '이 버전은 광고가 없어요. 힌트와 서바이벌 이어하기도 바로 쓸 수 있어요.', 'This version has no ads. Hints and survival continues are free.', 'Diese Version ist werbefrei. Tipps und Weiterspielen sind gratis.', 'Cette version est sans pub. Indices et relances sont gratuits.', 'Esta versión no tiene anuncios. Pistas y continuaciones son gratis.', 'Questa versione è senza pubblicità. Suggerimenti e continuazioni sono gratis.');
  k('gd.privacy', '개인정보처리방침', 'Privacy policy', 'Datenschutz', 'Confidentialité', 'Privacidad', 'Privacy');
  k('gd.wipe', '전체 초기화', 'Reset everything', 'Alles zurücksetzen', 'Tout réinitialiser', 'Reiniciar todo', 'Azzera tutto');
  k('gd.wipe_p', '모든 탭 기록, 챌린지 기록, 오답 노트, 분석 로그를 지웁니다.', 'Deletes all stats, challenge records, review list and analysis log.', 'Löscht alle Statistiken, Rekorde, Fehlerliste und Analyse.', 'Efface statistiques, records, erreurs et analyse.', 'Borra estadísticas, récords, fallos y análisis.', 'Cancella statistiche, record, errori e analisi.');
  k('gd.wipe_btn', '전체 기록 지우기', 'Delete all data', 'Alle Daten löschen', 'Tout effacer', 'Borrar todo', 'Cancella tutto');

  /* ───────────── daily hand / attendance streak ───────────── */
  k('d.title', '오늘의 핸드', 'Daily Hand', 'Hand des Tages', 'Main du jour', 'Mano del día', 'Mano del giorno');
  k('d.sub', '하루 한 핸드 · 프리플랍부터 턴까지 5단계', 'One hand a day · 5 steps from preflop to the turn', 'Eine Hand pro Tag · 5 Schritte von Preflop bis Turn', 'Une main par jour · 5 étapes du préflop au turn', 'Una mano al día · 5 pasos del preflop al turn', 'Una mano al giorno · 5 passi dal preflop al turn');
  k('d.same', '오늘은 모두에게 같은 핸드가 나와요 — 친구와 점수를 비교해 보세요.', 'Everyone gets the same hand today — compare scores with friends.', 'Heute bekommen alle dieselbe Hand – vergleiche dich mit Freunden.', 'Tout le monde a la même main aujourd’hui — comparez vos scores entre amis.', 'Hoy todos reciben la misma mano: compara tu puntuación con amigos.', 'Oggi tutti ricevono la stessa mano: confronta il punteggio con gli amici.');
  k('d.start', '오늘의 핸드 시작', 'Start today’s hand', 'Hand des Tages starten', 'Commencer la main du jour', 'Empezar la mano del día', 'Inizia la mano del giorno');
  k('d.resume', '이어서 풀기 ({0}/5)', 'Continue ({0}/5)', 'Weiter ({0}/5)', 'Continuer ({0}/5)', 'Continuar ({0}/5)', 'Continua ({0}/5)');
  k('d.view', '오늘 결과 다시 보기', 'Review today’s hand', 'Heutige Hand ansehen', 'Revoir la main du jour', 'Revisar la mano de hoy', 'Rivedi la mano di oggi');
  k('d.done', '오늘 출석 완료', 'Done for today', 'Heute erledigt', 'Fait pour aujourd’hui', 'Hecho por hoy', 'Fatto per oggi');
  k('d.next_in', '다음 핸드까지 {0}', 'Next hand in {0}', 'Nächste Hand in {0}', 'Prochaine main dans {0}', 'Próxima mano en {0}', 'Prossima mano tra {0}');
  k('d.streak', '연속 출석', 'Day streak', 'Serie', 'Série', 'Racha', 'Serie');
  k('d.day1', '{0}일', '{0} day', '{0} Tag', '{0} jour', '{0} día', '{0} giorno');
  k('d.days', '{0}일', '{0} days', '{0} Tage', '{0} jours', '{0} días', '{0} giorni');
  k('d.best', '최고 {0}', 'Best {0}', 'Rekord {0}', 'Record {0}', 'Récord {0}', 'Record {0}');
  k('d.total', '누적 {0}', 'Total {0}', 'Gesamt {0}', 'Total {0}', 'Total {0}', 'Totale {0}');
  k('d.perfect', '퍼펙트', 'Perfect', 'Perfekt', 'Parfait', 'Perfecto', 'Perfetto');
  k('d.broken', '연속 출석이 끊겼어요. 오늘부터 다시 시작해요!', 'Your streak ended. Start a new one today!', 'Deine Serie ist gerissen. Starte heute eine neue!', 'Votre série s’est arrêtée. Recommencez aujourd’hui !', 'Se rompió tu racha. ¡Empieza otra hoy!', 'La serie si è interrotta. Ricomincia oggi!');
  k('d.keep', '오늘 풀면 {0}로 늘어나요', 'Solve today to reach {0}', 'Heute lösen für {0}', 'Résolvez aujourd’hui pour atteindre {0}', 'Resuelve hoy para llegar a {0}', 'Risolvi oggi per arrivare a {0}');
  k('d.repair_t', '어제 출석을 놓쳤어요', 'You missed yesterday', 'Gestern verpasst', 'Vous avez manqué hier', 'Te saltaste ayer', 'Hai saltato ieri');
  k('d.repair_p', '연속 {0}일 기록을 한 번 복구할 수 있어요 (7일에 1회).', 'You can restore your {0}-day streak once (once every 7 days).', 'Du kannst deine Serie von {0} Tagen einmal retten (1× pro 7 Tage).', 'Vous pouvez sauver votre série de {0} jours une fois (1 fois par 7 jours).', 'Puedes recuperar tu racha de {0} días una vez (1 vez cada 7 días).', 'Puoi recuperare la serie di {0} giorni una volta (1 volta ogni 7 giorni).');
  k('d.repair_btn', '연속 복구', 'Restore streak', 'Serie retten', 'Sauver la série', 'Recuperar racha', 'Recupera serie');
  k('d.repaired', '복구됨', 'Restored', 'Gerettet', 'Sauvée', 'Recuperada', 'Recuperata');
  k('d.step', '{0}/5', '{0}/5', '{0}/5', '{0}/5', '{0}/5', '{0}/5');
  k('d.s1', '프리플랍', 'Preflop', 'Preflop', 'Préflop', 'Preflop', 'Preflop');
  k('d.s2', '포지션', 'Position', 'Position', 'Position', 'Posición', 'Posizione');
  k('d.s3', '아웃츠', 'Outs', 'Outs', 'Outs', 'Outs', 'Out');
  k('d.s4', '필요 승률', 'Required equity', 'Nötige Equity', 'Équité requise', 'Equity necesaria', 'Equity richiesta');
  k('d.s5', '턴 결정', 'Turn decision', 'Turn-Entscheidung', 'Décision au turn', 'Decisión en el turn', 'Decisione al turn');
  k('d.q_open', '앞에서 모두 폴드했고 당신은 {0}입니다. 핸드는 {1}.', 'Everyone folds to you in the {0}. You hold {1}.', 'Alle folden zu dir auf {0}. Du hältst {1}.', 'Tout le monde se couche jusqu’à vous en {0}. Vous avez {1}.', 'Todos se retiran hasta ti en {0}. Tienes {1}.', 'Tutti passano fino a te in {0}. Hai {1}.');
  k('d.q_open_a', '오픈할까요, 폴드할까요?', 'Open or fold?', 'Open oder Fold?', 'Ouvrir ou se coucher ?', '¿Abrir o retirarse?', 'Apri o passa?');
  k('d.q_bb', '{0}가 2.5BB로 오픈했고 나머지는 폴드. 당신은 BB, 핸드는 {1}.', '{0} opens to 2.5BB and the rest fold. You’re in the BB with {1}.', '{0} öffnet auf 2,5BB, der Rest foldet. Du sitzt im BB mit {1}.', '{0} ouvre à 2,5BB, les autres se couchent. Vous êtes en BB avec {1}.', '{0} abre a 2,5BB y el resto se retira. Estás en la BB con {1}.', '{0} apre a 2,5BB, gli altri passano. Sei in BB con {1}.');
  k('d.q_bb_a', 'BB에서 어떻게 대응할까요?', 'What do you do from the BB?', 'Was machst du im BB?', 'Que faites-vous en BB ?', '¿Qué haces desde la BB?', 'Cosa fai dalla BB?');
  k('d.e_open', '{0}는 {1} 오픈 레인지(상위 {2}%)에 들어갑니다.', '{0} is in the {1} opening range (top {2}%).', '{0} gehört zur Open-Range von {1} (Top {2}%).', '{0} fait partie de la range d’ouverture {1} (top {2} %).', '{0} está en el rango de apertura de {1} (top {2}%).', '{0} è nel range di apertura di {1} (top {2}%).');
  k('d.e_open_first', '앱 차트에서 {0}부터 오픈하는 핸드라, 더 앞자리였다면 폴드였어요.', 'The app chart opens it from {0} on — from an earlier seat it would be a fold.', 'Laut App-Chart ab {0} ein Open – von früher wäre es ein Fold.', 'Le tableau de l’app l’ouvre à partir de {0} — plus tôt, ce serait un fold.', 'La tabla de la app la abre desde {0}; desde antes sería retirarse.', 'La tabella dell’app la apre da {0} in poi: prima sarebbe un fold.');
  k('d.e_bb', '{0} 오픈에 BB는 1.5BB만 더 내고 5.5BB 팟을 다퉈 필요 승률이 약 27%예요. {1}는 앱 차트에서 BB 콜 디펜스 범위입니다.', 'Against a {0} open the BB adds just 1.5BB to play a 5.5BB pot, so it needs only about 27%. {1} is a BB call in the app chart.', 'Gegen ein Open von {0} zahlt der BB nur 1,5BB für einen 5,5BB-Pot – nötig sind etwa 27%. {1} ist laut App-Chart ein BB-Call.', 'Face à une ouverture {0}, la BB ajoute 1,5BB pour un pot de 5,5BB : environ 27 % suffisent. {1} est un call en BB dans le tableau.', 'Contra una apertura de {0} la BB pone solo 1,5BB por un bote de 5,5BB: necesita ~27%. {1} es un call desde la BB en la tabla.', 'Contro un’apertura da {0} la BB aggiunge solo 1,5BB per un piatto di 5,5BB: serve circa il 27%. {1} è un call in BB nella tabella.');
  k('d.story_open', '2.5BB 오픈 → {0} 콜. 팟 {1}BB로 플랍을 봅니다.', 'You open 2.5BB → {0} calls. The flop comes with {1}BB in the pot.', 'Du öffnest 2,5BB → {0} callt. Flop bei {1}BB im Pot.', 'Vous ouvrez à 2,5BB → {0} suit. Flop avec {1}BB au pot.', 'Abres 2,5BB → {0} paga. Flop con {1}BB en el bote.', 'Apri 2,5BB → {0} chiama. Flop con {1}BB nel piatto.');
  k('d.story_bb', 'BB에서 콜. 팟 {0}BB로 플랍을 봅니다.', 'You call from the BB. The flop comes with {0}BB in the pot.', 'Du callst im BB. Flop bei {0}BB im Pot.', 'Vous suivez en BB. Flop avec {0}BB au pot.', 'Pagas desde la BB. Flop con {0}BB en el bote.', 'Chiami dalla BB. Flop con {0}BB nel piatto.');
  k('d.q_pos', '당신은 {0}, 상대는 {1}. 플랍부터 당신의 포지션은?', 'You’re in the {0}, the opponent in the {1}. What’s your position after the flop?', 'Du bist {0}, der Gegner {1}. Deine Position ab dem Flop?', 'Vous êtes {0}, l’adversaire {1}. Votre position après le flop ?', 'Tú estás en {0}, el rival en {1}. ¿Tu posición tras el flop?', 'Tu sei {0}, l’avversario {1}. La tua posizione dopo il flop?');
  k('d.e_pos', '플랍부터 액션 순서는 {0}. {1}가 더 나중에 액션하므로 당신은 {2}입니다.', 'Postflop order: {0}. {1} acts later, so you are {2}.', 'Reihenfolge ab dem Flop: {0}. {1} handelt später, also bist du {2}.', 'Ordre après le flop : {0}. {1} parle après, donc vous êtes {2}.', 'Orden tras el flop: {0}. {1} actúa después, así que estás {2}.', 'Ordine dopo il flop: {0}. {1} agisce dopo, quindi sei {2}.');
  k('d.q_outs', '플랍이 열렸어요. 상대가 탑페어라고 가정하면 당신의 아웃은 몇 장?', 'Here’s the flop. Assuming the opponent has top pair, how many outs do you have?', 'Der Flop liegt. Angenommen, der Gegner hat Top Pair: Wie viele Outs hast du?', 'Voici le flop. Si l’adversaire a top pair, combien d’outs avez-vous ?', 'Sale el flop. Si el rival tiene top pair, ¿cuántos outs tienes?', 'Ecco il flop. Se l’avversario ha top pair, quanti out hai?');
  k('d.q_need_ip', '상대가 팟 {0}BB에 {1}BB를 베팅했어요.', 'The opponent bets {1}BB into {0}BB.', 'Der Gegner setzt {1}BB in {0}BB.', 'L’adversaire mise {1}BB dans {0}BB.', 'El rival apuesta {1}BB en un bote de {0}BB.', 'L’avversario punta {1}BB su {0}BB.');
  k('d.q_need_oop', '당신은 체크, 상대가 팟 {0}BB에 {1}BB를 베팅했어요.', 'You check and the opponent bets {1}BB into {0}BB.', 'Du checkst, der Gegner setzt {1}BB in {0}BB.', 'Vous checkez, l’adversaire mise {1}BB dans {0}BB.', 'Pasas y el rival apuesta {1}BB en un bote de {0}BB.', 'Fai check, l’avversario punta {1}BB su {0}BB.');
  k('d.q_need_a', '콜하려면 최소 몇 %의 승률이 필요할까요?', 'What equity do you need to call?', 'Wie viel Equity brauchst du für einen Call?', 'Quelle équité faut-il pour suivre ?', '¿Qué equity necesitas para pagar?', 'Quanta equity serve per chiamare?');
  k('d.e_need_trap', '{0}는 내 콜을 팟에 넣지 않은 값(베팅 ÷ (팟 + 베팅)), {1}는 베팅 ÷ 팟 — 둘 다 흔한 실수예요.', '{0} leaves your call out of the pot (bet ÷ (pot + bet)) and {1} is bet ÷ pot — both common mistakes.', '{0} lässt deinen Call weg (Bet ÷ (Pot + Bet)), {1} ist Bet ÷ Pot – beides häufige Fehler.', '{0} oublie votre call (mise ÷ (pot + mise)) et {1} vaut mise ÷ pot : deux erreurs fréquentes.', '{0} deja fuera tu call (apuesta ÷ (bote + apuesta)) y {1} es apuesta ÷ bote: dos errores comunes.', '{0} esclude la tua chiamata (puntata ÷ (piatto + puntata)) e {1} è puntata ÷ piatto: due errori comuni.');
  k('d.story_call', '콜하고 턴을 봅니다. 팟 {0}BB.', 'You call and see the turn. Pot {0}BB.', 'Du callst und siehst den Turn. Pot {0}BB.', 'Vous suivez et voyez le turn. Pot {0}BB.', 'Pagas y ves el turn. Bote {0}BB.', 'Chiami e vedi il turn. Piatto {0}BB.');
  k('d.q_turn_ip', '턴 {0} — 아웃은 그대로 {1}장. 상대가 팟 {2}BB에 {3}BB를 베팅했어요.', 'Turn {0} — still {1} outs. The opponent bets {3}BB into {2}BB.', 'Turn {0} – weiterhin {1} Outs. Der Gegner setzt {3}BB in {2}BB.', 'Turn {0} — toujours {1} outs. L’adversaire mise {3}BB dans {2}BB.', 'Turn {0}: sigues con {1} outs. El rival apuesta {3}BB en {2}BB.', 'Turn {0}: sempre {1} out. L’avversario punta {3}BB su {2}BB.');
  k('d.q_turn_oop', '턴 {0} — 아웃은 그대로 {1}장. 당신은 체크, 상대가 팟 {2}BB에 {3}BB를 베팅했어요.', 'Turn {0} — still {1} outs. You check and the opponent bets {3}BB into {2}BB.', 'Turn {0} – weiterhin {1} Outs. Du checkst, der Gegner setzt {3}BB in {2}BB.', 'Turn {0} — toujours {1} outs. Vous checkez, l’adversaire mise {3}BB dans {2}BB.', 'Turn {0}: sigues con {1} outs. Pasas y el rival apuesta {3}BB en {2}BB.', 'Turn {0}: sempre {1} out. Fai check, l’avversario punta {3}BB su {2}BB.');
  k('d.q_turn_a', '콜할까요, 폴드할까요?', 'Call or fold?', 'Call oder Fold?', 'Suivre ou se coucher ?', '¿Pagar o retirarse?', 'Chiami o passi?');
  k('d.e_turn', '리버 1장 남음 → {0} × 2 = {1}%. 필요 승률 {2} → {3}', 'One card to come → {0} × 2 = {1}%. Required {2} → {3}', 'Noch 1 Karte → {0} × 2 = {1}%. Nötig {2} → {3}', 'Une carte à venir → {0} × 2 = {1} %. Requis {2} → {3}', 'Queda 1 carta → {0} × 2 = {1}%. Necesario {2} → {3}', 'Manca 1 carta → {0} × 2 = {1}%. Richiesto {2} → {3}');
  k('d.river_hit', '리버 {0} — 아웃이 떨어졌어요.', 'River {0} — you hit an out.', 'River {0} – ein Out ist gekommen.', 'River {0} — un out est tombé.', 'River {0}: ha caído un out.', 'River {0}: è uscito un out.');
  k('d.river_miss', '리버 {0} — 빗나갔어요.', 'River {0} — a miss.', 'River {0} – daneben.', 'River {0} — raté.', 'River {0}: fallaste.', 'River {0}: niente.');
  k('d.river_note', '결과는 덤이에요. 장기적으로 이득인 결정이 정답입니다.', 'The result is just a bonus — the right answer is the decision that wins in the long run.', 'Das Ergebnis ist Nebensache – richtig ist, was langfristig gewinnt.', 'Le résultat n’est qu’un bonus : la bonne réponse est la décision gagnante à long terme.', 'El resultado es lo de menos: lo correcto es la decisión que gana a largo plazo.', 'Il risultato è un dettaglio: la risposta giusta è la decisione che vince nel lungo periodo.');
  k('d.res_h', '오늘의 결과', 'Today’s result', 'Heutiges Ergebnis', 'Résultat du jour', 'Resultado de hoy', 'Risultato di oggi');
  k('d.next_step', '다음 단계 →', 'Next step →', 'Nächster Schritt →', 'Étape suivante →', 'Siguiente paso →', 'Passo successivo →');
  k('d.finish', '결과 보기', 'See result', 'Ergebnis ansehen', 'Voir le résultat', 'Ver resultado', 'Vedi risultato');
  k('d.back', '돌아가기', 'Back', 'Zurück', 'Retour', 'Volver', 'Indietro');
  k('d.q_vs', '{0}가 2.5BB로 오픈했고, 사이 자리는 모두 폴드. 당신은 {1}, 핸드는 {2}.', '{0} opens to 2.5BB and it folds to you in the {1}. You hold {2}.', '{0} öffnet auf 2,5BB, bis zu dir auf {1} wird gefoldet. Du hältst {2}.', '{0} ouvre à 2,5BB, tout le monde se couche jusqu’à vous en {1}. Vous avez {2}.', '{0} abre a 2,5BB y se retiran hasta ti en {1}. Tienes {2}.', '{0} apre a 2,5BB e passano tutti fino a te in {1}. Hai {2}.');
  k('d.q_vs_a', '어떻게 대응할까요?', 'How do you respond?', 'Wie reagierst du?', 'Que faites-vous ?', '¿Cómo respondes?', 'Come rispondi?');
  k('d.e_open_fold', '{0}는 {1} 오픈 레인지(상위 {2}%) 밖이에요. 앱 차트에서 {3}부터 오픈하는 핸드입니다.', '{0} is outside the {1} opening range (top {2}%). The app chart opens it from {3} on.', '{0} liegt außerhalb der Open-Range von {1} (Top {2}%). Laut App-Chart erst ab {3} ein Open.', '{0} est hors de la range d’ouverture {1} (top {2} %). Le tableau de l’app l’ouvre à partir de {3}.', '{0} está fuera del rango de apertura de {1} (top {2}%). La tabla de la app la abre desde {3}.', '{0} è fuori dal range di apertura di {1} (top {2}%). La tabella dell’app la apre da {3} in poi.');
  k('d.story_fold_go', '정답은 폴드지만, 연습을 위해 오픈했다고 치고 이어가요. 2.5BB 오픈 → {0} 콜, 팟 {1}BB.', 'Fold is correct — but for practice, say you opened anyway. 2.5BB → {0} calls, pot {1}BB.', 'Richtig wäre Fold – zum Üben tun wir so, als hättest du geöffnet. 2,5BB → {0} callt, Pot {1}BB.', 'Il fallait se coucher — pour l’exercice, disons que vous avez ouvert. 2,5BB → {0} suit, pot {1}BB.', 'Lo correcto es retirarse, pero para practicar supongamos que abriste. 2,5BB → {0} paga, bote {1}BB.', 'La risposta giusta è passare, ma per esercizio facciamo finta che tu abbia aperto. 2,5BB → {0} chiama, piatto {1}BB.');
  k('d.e_bb3', '{0}는 앱 차트에서 {1} 오픈에 대한 BB 3벳 범위예요 (강한 밸류 또는 블로커를 가진 블러프).', '{0} is a BB 3-bet against a {1} open in the app chart (strong value, or a bluff with blockers).', '{0} ist laut App-Chart ein BB-3-Bet gegen ein Open von {1} (starke Value oder Bluff mit Blockern).', '{0} est un 3-bet en BB face à une ouverture {1} (valeur forte, ou bluff avec bloqueurs).', '{0} es un 3-bet desde la BB contra una apertura de {1} (valor fuerte o farol con bloqueadores).', '{0} è un 3-bet dalla BB contro un’apertura da {1} (valore forte o bluff con blocker).');
  k('d.story_3bet', '11BB로 3벳 → {0} 콜. 팟 {1}BB로 플랍을 봅니다.', 'You 3-bet to 11BB → {0} calls. The flop comes with {1}BB in the pot.', 'Du 3-bettest auf 11BB → {0} callt. Flop bei {1}BB im Pot.', 'Vous 3-bettez à 11BB → {0} suit. Flop avec {1}BB au pot.', 'Haces 3-bet a 11BB → {0} paga. Flop con {1}BB en el bote.', 'Fai 3-bet a 11BB → {0} chiama. Flop con {1}BB nel piatto.');
  k('d.e_vs_call', '{0}는 {1} 오픈에 IP에서 콜하는 범위예요 — 3벳하기엔 약하고, 포지션이 있어 버리기엔 아까운 핸드.', '{0} is an in-position call against a {1} open — too weak to 3-bet, too good to fold with position.', '{0} ist ein Call in Position gegen ein Open von {1} – zu schwach für ein 3-Bet, mit Position zu gut zum Folden.', '{0} est un call en position face à une ouverture {1} : trop faible pour 3-bet, trop bon pour se coucher avec la position.', '{0} es un call en posición contra una apertura de {1}: muy débil para 3-bet, demasiado buena para retirarse con posición.', '{0} è un call in posizione contro un’apertura da {1}: troppo debole per il 3-bet, troppo buona per passare con la posizione.');
  k('d.story_vs_call', '콜. 블라인드는 폴드하고 팟 {0}BB로 플랍을 봅니다.', 'You call, the blinds fold. The flop comes with {0}BB in the pot.', 'Du callst, die Blinds folden. Flop bei {0}BB im Pot.', 'Vous suivez, les blindes se couchent. Flop avec {0}BB au pot.', 'Pagas y las ciegas se retiran. Flop con {0}BB en el bote.', 'Chiami, i bui passano. Flop con {0}BB nel piatto.');
  k('d.e_vs_3bet', '{0}는 앱 차트에서 {1} 오픈에 대한 IP 3벳 범위예요.', '{0} is an in-position 3-bet against a {1} open in the app chart.', '{0} ist laut App-Chart ein 3-Bet in Position gegen ein Open von {1}.', '{0} est un 3-bet en position face à une ouverture {1} dans le tableau.', '{0} es un 3-bet en posición contra una apertura de {1} en la tabla.', '{0} è un 3-bet in posizione contro un’apertura da {1} nella tabella.');
  k('d.story_vs_3bet', '8BB로 3벳 → {0} 콜, 블라인드는 폴드. 팟 {1}BB로 플랍을 봅니다.', 'You 3-bet to 8BB → {0} calls, the blinds fold. The flop comes with {1}BB in the pot.', 'Du 3-bettest auf 8BB → {0} callt, die Blinds folden. Flop bei {1}BB im Pot.', 'Vous 3-bettez à 8BB → {0} suit, les blindes se couchent. Flop avec {1}BB au pot.', 'Haces 3-bet a 8BB → {0} paga y las ciegas se retiran. Flop con {1}BB en el bote.', 'Fai 3-bet a 8BB → {0} chiama, i bui passano. Flop con {1}BB nel piatto.');
  k('d.fx_n', '{0}일 연속 출석!', '{0}-day streak!', '{0} Tage in Folge!', '{0} jours d’affilée !', '¡{0} días seguidos!', '{0} giorni di fila!');
  k('d.fx_first', '출석 시작!', 'Streak started!', 'Serie gestartet!', 'Série lancée !', '¡Racha iniciada!', 'Serie iniziata!');
  k('d.fx_ms', '{0}일 달성', '{0}-day milestone', '{0}-Tage-Meilenstein', 'Cap des {0} jours', '¡Hito de {0} días!', 'Traguardo dei {0} giorni');
  k('d.fx_record', '최고 기록 경신', 'New best', 'Neuer Rekord', 'Nouveau record', 'Nuevo récord', 'Nuovo record');
  k('d.fx_tap', '탭해서 닫기', 'Tap to close', 'Tippen zum Schließen', 'Touchez pour fermer', 'Toca para cerrar', 'Tocca per chiudere');
  k('d.chip', '연속 출석 {0}', 'Day streak {0}', 'Serie {0}', 'Série {0}', 'Racha {0}', 'Serie {0}');

  /* ───────────── concept quiz bank ───────────── */
  var CONCEPTS = {};
  function cq(lang, list) { CONCEPTS[lang] = list.map(function (x) { return { q: x[0], o: x[1], e: x[2] }; }); }
  root.__I18N_CQ = cq;

  function applyStatic() {
    document.documentElement.lang = lang;
    document.title = t('app.title');
    var nodes = document.querySelectorAll('[data-i18n]');
    for (var i = 0; i < nodes.length; i++) nodes[i].textContent = t(nodes[i].getAttribute('data-i18n'));
  }

  root.I18N = {
    LANGS: LANGS, lang: lang, t: t, applyStatic: applyStatic,
    concepts: function () { return CONCEPTS[lang] || CONCEPTS.en || CONCEPTS.ko; },
    setLang: function (l) { try { localStorage.setItem(LKEY, l); } catch (e) { /* ignore */ } }
  };
})(window);
