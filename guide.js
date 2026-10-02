/* Holdem Lab — guide data. Structure in GUIDE, localized text in GUIDE_TX[lang]. */
window.GUIDE = {"cats":["basic","action","math","hand","strategy"],"terms":[{"id":"hole","c":"basic","en":"Hole cards"},{"id":"board","c":"basic","en":"Board"},{"id":"streets","c":"basic","en":"Streets"},{"id":"blinds","c":"basic","en":"Blinds"},{"id":"button","c":"basic","en":"Button / Dealer"},{"id":"eff","c":"basic","en":"Effective stack"},{"id":"showdown","c":"basic","en":"Showdown"},{"id":"kicker","c":"basic","en":"Kicker"},{"id":"nuts","c":"basic","en":"Nuts"},{"id":"rake","c":"basic","en":"Rake"},{"id":"limp","c":"action","en":"Limp"},{"id":"rfi","c":"action","en":"Raise First In"},{"id":"3bet","c":"action","en":"3-bet / 4-bet"},{"id":"coldcall","c":"action","en":"Cold call"},{"id":"steal","c":"action","en":"Steal"},{"id":"squeeze","c":"action","en":"Squeeze"},{"id":"iso","c":"action","en":"Isolate"},{"id":"cbet","c":"action","en":"Continuation bet"},{"id":"donk","c":"action","en":"Donk bet"},{"id":"xr","c":"action","en":"Check-raise"},{"id":"value","c":"action","en":"Value bet"},{"id":"bluff","c":"action","en":"Bluff"},{"id":"semibluff","c":"action","en":"Semi-bluff"},{"id":"float","c":"action","en":"Float"},{"id":"equity","c":"math","en":"Equity"},{"id":"potodds","c":"math","en":"Pot odds","f":"potodds"},{"id":"outs","c":"math","en":"Outs","f":"rule24"},{"id":"dirty","c":"math","en":"Clean / dirty outs"},{"id":"rule24","c":"math","en":"Rule of 2 and 4","f":"rule24"},{"id":"ev","c":"math","en":"Expected value","f":"ev"},{"id":"implied","c":"math","en":"Implied odds","f":"implied"},{"id":"rimplied","c":"math","en":"Reverse implied odds"},{"id":"foldeq","c":"math","en":"Fold equity","f":"bluffbe"},{"id":"mdf","c":"math","en":"Minimum defense frequency","f":"mdf"},{"id":"spr","c":"math","en":"Stack-to-pot ratio","f":"spr"},{"id":"combo","c":"math","en":"Combinations","f":"combo"},{"id":"blocker","c":"math","en":"Blocker","f":"combo"},{"id":"set","c":"hand","en":"Set / Trips"},{"id":"overpair","c":"hand","en":"Overpair / Top pair"},{"id":"fd","c":"hand","en":"Flush draw"},{"id":"oesd","c":"hand","en":"Open-ended straight draw"},{"id":"gutshot","c":"hand","en":"Gutshot"},{"id":"backdoor","c":"hand","en":"Backdoor draw"},{"id":"domination","c":"hand","en":"Domination"},{"id":"coinflip","c":"hand","en":"Coin flip"},{"id":"suitedcon","c":"hand","en":"Suited connector"},{"id":"texture","c":"hand","en":"Dry / wet board"},{"id":"rainbow","c":"hand","en":"Rainbow / Two-tone / Monotone"},{"id":"range","c":"strategy","en":"Range"},{"id":"ipoop","c":"strategy","en":"In / Out of position"},{"id":"eqr","c":"strategy","en":"Equity realization"},{"id":"polar","c":"strategy","en":"Polarized range"},{"id":"capped","c":"strategy","en":"Capped range"},{"id":"gto","c":"strategy","en":"GTO / Exploit"},{"id":"tilt","c":"strategy","en":"Tilt"}],"formulas":["potodds","rule24","ev","implied","bluffbe","mdf","bluffratio","spr","combo","equity"],"hand7":[0.0311,0.168,2.6,3.03,4.62,4.83,23.5,43.8,17.4],"handEx":["J♠ T♠ 9♠ 8♠ 7♠","Q Q Q Q 4","K K K 7 7","A♦ J♦ 8♦ 6♦ 2♦","9 8 7 6 5","7 7 7 K 2","A A 9 9 4","T T A 8 3","A Q 9 6 3"],"seatEn":{"UTG":"Under the Gun","MP":"Middle Position","HJ":"Hijack","CO":"Cutoff","BTN":"Button","SB":"Small Blind","BB":"Big Blind"},"matchups":[{"a":"AS AH","b":"KD KC","k":"AA vs KK","eq":81.3,"tie":0.4,"d":"pp"},{"a":"AS KD","b":"QH QC","k":"AKo vs QQ","eq":42.8,"tie":0.3,"d":"p_2over"},{"a":"AS KS","b":"QH QD","k":"AKs vs QQ","eq":46.2,"tie":0.4,"d":"p_2over"},{"a":"AS KD","b":"2H 2C","k":"AKo vs 22","eq":47,"tie":0.6,"d":"p_2over"},{"a":"JS JH","b":"AD KC","k":"JJ vs AKo","eq":57.3,"tie":0.3,"d":"p_2over"},{"a":"KH KD","b":"AS KC","k":"KK vs AKo","eq":70,"tie":0.8,"d":"p_same"},{"a":"AS KD","b":"AH QC","k":"AKo vs AQo","eq":74,"tie":4.6,"d":"dom"},{"a":"KS QD","b":"KH 2C","k":"KQo vs K2o","eq":74.7,"tie":6.1,"d":"dom"},{"a":"AS KD","b":"7H 6H","k":"AKo vs 76s","eq":57.7,"tie":0.4,"d":"two_over"},{"a":"AS 5S","b":"KD QC","k":"A5s vs KQo","eq":60.6,"tie":0.5,"d":"hilo"},{"a":"8S 8H","b":"7D 7C","k":"88 vs 77","eq":81.1,"tie":0.9,"d":"pp"},{"a":"TS TH","b":"AD 9C","k":"TT vs A9o","eq":72,"tie":0.3,"d":"p_1over"},{"a":"AS QS","b":"JH TH","k":"AQs vs JTs","eq":61.4,"tie":0.5,"d":"two_over"}],"rules":["outs","pot","outs_tab","ranges","post","mu"]};
window.GUIDE_TX = {};
window.GUIDE_TX.ko = {
 "term": {
  "hole": [
   "홀카드",
   "각자 받는 비공개 카드 2장."
  ],
  "board": [
   "보드 (커뮤니티 카드)",
   "모두가 함께 쓰는 공용 카드 5장. 플랍 3장 → 턴 1장 → 리버 1장 순서로 공개."
  ],
  "streets": [
   "프리플랍 · 플랍 · 턴 · 리버",
   "베팅 라운드 4개. 보드가 0·3·4·5장일 때 각각 진행."
  ],
  "blinds": [
   "블라인드 (SB / BB)",
   "카드를 받기 전에 내는 강제 베팅. SB는 보통 BB의 절반. 금액 단위로 \"BB\"를 많이 씀 (100BB = 빅블라인드 100개)."
  ],
  "button": [
   "버튼 (BTN)",
   "딜러 표시가 놓인 자리. 플랍부터 항상 마지막에 액션해서 가장 유리한 자리."
  ],
  "eff": [
   "유효 스택",
   "두 사람 중 더 작은 스택. 둘 사이에서 실제로 오갈 수 있는 최대 금액.",
   "나 300, 상대 120 → 유효 스택 120"
  ],
  "showdown": [
   "쇼다운",
   "마지막 베팅이 끝난 뒤 카드를 공개해 승자를 가리는 것."
  ],
  "kicker": [
   "킥커",
   "같은 족보끼리 붙었을 때 승부를 가르는 나머지 카드.",
   "A-7-2 보드에서 AK vs AQ → 둘 다 A 원페어, K 킥커가 이김"
  ],
  "nuts": [
   "넛",
   "그 보드에서 만들 수 있는 가장 강한 핸드."
  ],
  "rake": [
   "레이크",
   "하우스(포커룸)가 팟에서 떼어 가는 수수료. 레이크가 클수록 작은 팟 싸움의 수익이 줄어 프리플랍을 조금 더 타이트하게 가져감."
  ],
  "limp": [
   "림프",
   "프리플랍에서 레이즈 없이 BB 금액만 콜하고 들어가는 것."
  ],
  "rfi": [
   "오픈 레이즈 (RFI)",
   "앞사람이 모두 폴드했을 때 처음으로 하는 레이즈. 이 앱의 프리플랍 탭이 바로 RFI 판단."
  ],
  "3bet": [
   "3벳 / 4벳",
   "프리플랍에서 블라인드를 1벳, 오픈을 2벳으로 보고 그 다음 리레이즈가 3벳, 그에 대한 리레이즈가 4벳."
  ],
  "coldcall": [
   "콜드 콜",
   "아직 팟에 돈을 넣지 않은 상태에서 레이즈 금액을 통째로 콜하는 것. 블라인드의 콜은 콜드 콜이 아님."
  ],
  "steal": [
   "스틸",
   "CO·BTN·SB 같은 레이트 포지션에서 블라인드를 가져오려고 넓게 하는 오픈."
  ],
  "squeeze": [
   "스퀴즈",
   "누군가 오픈하고 다른 사람이 콜했을 때 하는 3벳. 콜러는 레인지가 캡되어 있어 압박이 잘 통함."
  ],
  "iso": [
   "아이솔레이트",
   "림퍼를 상대로 레이즈해서 1:1 팟을 만들려는 플레이."
  ],
  "cbet": [
   "C벳 (컨티뉴에이션 벳)",
   "프리플랍 마지막 레이저가 플랍에서 이어서 하는 베팅."
  ],
  "donk": [
   "돈크 벳",
   "이전 스트리트의 공격자(레이저)를 상대로 OOP 플레이어가 먼저 베팅하는 것."
  ],
  "xr": [
   "체크레이즈",
   "체크한 뒤 상대가 베팅하면 레이즈하는 것. OOP 플레이어의 주요 공격 수단."
  ],
  "value": [
   "밸류 베팅",
   "나보다 약한 핸드의 콜을 받으려는 베팅."
  ],
  "bluff": [
   "블러프",
   "나보다 강한 핸드를 폴드시키려는 베팅."
  ],
  "semibluff": [
   "세미 블러프",
   "지금은 약하지만 드로우가 있어서, 콜을 받아도 맞으면 이길 수 있는 블러프. 폴드 에퀴티 + 드로우 에퀴티를 둘 다 가짐."
  ],
  "float": [
   "플로트",
   "IP에서 약한 핸드로 콜한 뒤 다음 스트리트에 팟을 가져가려는 플레이."
  ],
  "equity": [
   "에퀴티",
   "지금 상태로 쇼다운까지 갔을 때 팟에서 내 몫의 기대 비율. 승률 + 무승부 확률 ÷ 2."
  ],
  "potodds": [
   "팟 오즈",
   "콜 금액에 비해 팟이 얼마나 큰지. 손익분기 승률 = 콜 ÷ (팟 + 상대 베팅 + 내 콜). 내 에퀴티가 이보다 크면 콜이 이득."
  ],
  "outs": [
   "아웃츠",
   "떨어지면 내가 이길 핸드를 만들어 주는 남은 카드."
  ],
  "dirty": [
   "클린 아웃 / 더티 아웃",
   "맞으면 거의 확실히 이기는 아웃이 클린 아웃. 맞아도 상대가 더 좋아질 수 있는 아웃이 더티 아웃 (예: 내 플러시 카드가 보드를 페어로 만들어 상대 풀하우스를 허용)."
  ],
  "rule24": [
   "2·4 규칙",
   "남은 카드가 1장이면 아웃츠 × 2, 2장(올인)이면 × 4로 승률(%)을 근사. 아웃츠가 8장을 넘으면 × 4가 과대평가되므로 \"× 4 − (아웃츠 − 8)\"로 보정."
  ],
  "ev": [
   "EV (기대값)",
   "각 결과의 (확률 × 손익)을 모두 더한 값. 같은 상황을 무한히 반복할 때의 평균 수익."
  ],
  "implied": [
   "임플라이드 오즈",
   "드로우가 완성됐을 때 이후 스트리트에서 추가로 받아낼 돈까지 계산에 넣은 오즈. 지금 팟 오즈가 모자라도 콜이 이득일 수 있음. IP일수록, 상대 스택이 깊을수록, 내 드로우가 숨어 있을수록 큼."
  ],
  "rimplied": [
   "리버스 임플라이드 오즈",
   "내 핸드가 완성돼도 더 강한 핸드에 져서 오히려 더 잃게 되는 것. 낮은 플러시·도미네이트된 킥커 등."
  ],
  "foldeq": [
   "폴드 에퀴티",
   "내 베팅에 상대가 폴드해서 얻는 가치. 블러프와 세미 블러프 수익의 원천."
  ],
  "mdf": [
   "MDF (최소 방어 빈도)",
   "상대의 어떤 블러프도 자동으로 이득이 되지 않게 하려면 콜·레이즈로 지켜야 하는 최소 비율 = 팟 ÷ (팟 + 베팅)."
  ],
  "spr": [
   "SPR",
   "플랍 시점의 유효 스택 ÷ 팟. 낮을수록(대략 3 이하) 탑페어로도 올인하기 쉽고, 높을수록 셋·드로우처럼 크게 이기는 핸드의 가치가 커짐."
  ],
  "combo": [
   "콤보",
   "특정 핸드가 나올 수 있는 카드 조합 수. 포켓페어 6, 수딧 4, 오프수트 12, 전체 1326."
  ],
  "blocker": [
   "블로커",
   "내가 가진 카드 때문에 상대가 특정 핸드를 가질 콤보가 줄어드는 효과. A를 들고 있으면 상대 AA 콤보가 6개 → 3개."
  ],
  "set": [
   "셋 / 트립스",
   "포켓페어 + 보드 1장 = 셋 (숨어 있어서 강함). 보드 페어 + 내 카드 1장 = 트립스(트리플). 족보는 같은 쓰리 오브 어 카인드."
  ],
  "overpair": [
   "오버페어 / 탑페어",
   "오버페어: 보드 최고 카드보다 높은 포켓페어. 탑페어: 보드 최고 카드와 내 카드가 페어. 그 아래로 미들페어·바텀페어."
  ],
  "fd": [
   "플러시 드로우",
   "같은 무늬 4장 — 1장만 더 오면 플러시. 아웃 9장."
  ],
  "oesd": [
   "양방 스트레이트 드로우 (OESD)",
   "연속된 4장, 양쪽 끝 어느 카드든 오면 스트레이트. 아웃 8장. (예: 8-9-T-J → 7 또는 Q)"
  ],
  "gutshot": [
   "거트샷",
   "가운데 한 장이 빠진 스트레이트 드로우. 아웃 4장. 거트샷이 두 개 겹치면 더블 거트샷(8장)."
  ],
  "backdoor": [
   "백도어 드로우",
   "턴과 리버가 모두 맞아야 완성되는 드로우 (예: 플랍에서 같은 무늬 3장). 대략 아웃 1~1.5장 가치로 봄."
  ],
  "domination": [
   "도미네이션",
   "같은 카드를 공유하면서 킥커가 낮아 크게 불리한 상황. AK vs AQ에서 AQ는 Q를 맞춰야만 앞섬."
  ],
  "coinflip": [
   "코인플립",
   "대략 50:50 매치업. 대표적으로 작은~중간 페어 vs 오버카드 두 장."
  ],
  "suitedcon": [
   "수딧 커넥터",
   "같은 무늬의 연속 카드 (76s 등). 스트레이트·플러시를 둘 다 노려 플레이어빌리티가 좋음."
  ],
  "texture": [
   "드라이 보드 / 웻 보드",
   "드라이: 연결성·같은 무늬가 적어 드로우가 거의 없는 보드 (K-7-2 레인보우). 웻: 드로우가 많은 보드 (9-8-7 투톤)."
  ],
  "rainbow": [
   "레인보우 / 투톤 / 모노톤",
   "플랍 3장의 무늬가 모두 다름 / 2장 같음 / 3장 같음."
  ],
  "range": [
   "레인지",
   "그 상황에서 상대(또는 내)가 가질 수 있는 핸드 전체. 상대 핸드 하나를 맞히려 하지 말고 레인지 전체를 상대로 생각하는 것이 기본."
  ],
  "ipoop": [
   "IP / OOP",
   "IP: 상대보다 나중에 액션하는 쪽 (정보·팟 컨트롤에서 유리). OOP: 먼저 액션하는 쪽."
  ],
  "eqr": [
   "에퀴티 실현 (EQR)",
   "이론상 에퀴티 중 실제로 가져가는 몫. IP·수딧·커넥티드 핸드는 잘 실현하고, OOP·약한 오프수트는 중간에 폴드하는 일이 많아 덜 실현함."
  ],
  "polar": [
   "폴라라이즈 레인지",
   "아주 강한 핸드와 블러프로 양극화된 레인지. 큰 베팅에 잘 어울림."
  ],
  "capped": [
   "캡드 레인지",
   "가장 강한 핸드가 빠져 있는 레인지. 예: 프리플랍에서 콜만 한 플레이어는 AA·KK가 적음."
  ],
  "gto": [
   "GTO / 익스플로잇",
   "GTO: 상대가 어떻게 대응해도 손해 보지 않는 균형 전략. 익스플로잇: 상대의 약점(너무 많이 폴드 등)에 맞춰 일부러 균형을 깨는 전략."
  ],
  "tilt": [
   "틸트",
   "감정(배드빗·연패 등) 때문에 판단이 흐트러진 상태. 챌린지에서 연속 오답이 나면 잠깐 쉬는 것도 방법."
  ]
 },
 "formula": {
  "potodds": [
   "팟 오즈 (손익분기 승률)",
   "필요 승률 = 콜 ÷ (팟 + 상대 베팅 + 내 콜)",
   "팟 100에 상대 50 베팅 → 50 ÷ (100 + 50 + 50) = 25%",
   "비율로 말하면 \"팟 150 : 콜 50 = 3 : 1\" → 1 ÷ (3 + 1) = 25%. a : 1 오즈는 1 ÷ (a + 1)."
  ],
  "rule24": [
   "아웃츠 → 승률",
   "1장 남음: 아웃츠 × 2  ·  2장 남음(올인): 아웃츠 × 4",
   "플러시 드로우 9아웃, 플랍 올인 → 9 × 4 = 36% (정확 35.0%)",
   "정확한 값 — 턴: n ÷ 46, 플랍: 1 − (47 − n)/47 × (46 − n)/46. 아웃츠가 8을 넘으면 ×4 − (n − 8)로 보정. 플랍에서 상대가 올인이 아니면 턴 1장만 보장되므로 ×2로 보는 게 안전."
  ],
  "ev": [
   "콜 EV",
   "EV = 승률 × (팟 + 상대 베팅) − (1 − 승률) × 콜",
   "승률 36%, 팟 100, 베팅 50 → 0.36 × 150 − 0.64 × 50 = +22",
   "EV가 0보다 크면 장기적으로 이득. 팟 오즈 비교와 같은 결론이 나옴."
  ],
  "implied": [
   "임플라이드 오즈 — 필요 추가 수익",
   "필요 추가 수익 = 콜 × (1 − 승률) ÷ 승률 − (팟 + 상대 베팅)",
   "턴 OESD(16%), 팟 100, 베팅 50 → 50 × 0.84 ÷ 0.16 − 150 = 112.5",
   "맞았을 때 리버에서 평균 112.5 이상 더 받아낼 수 있으면 콜이 이득."
  ],
  "bluffbe": [
   "블러프 손익분기 폴드율",
   "필요 폴드율 = 베팅 ÷ (팟 + 베팅)",
   "팟 100에 75 블러프 → 75 ÷ 175 = 43%",
   "상대가 이보다 자주 폴드하면 순수 블러프도 이득."
  ],
  "mdf": [
   "MDF (최소 방어 빈도)",
   "MDF = 팟 ÷ (팟 + 베팅)",
   "팟 100에 상대 100 베팅 → 100 ÷ 200 = 50%",
   "블러프 손익분기 폴드율의 반대편. 이론 기준값일 뿐, 상대가 블러프를 거의 안 하면 더 폴드해도 됨."
  ],
  "bluffratio": [
   "리버 베팅 레인지의 블러프 비중",
   "블러프 비중 = 베팅 ÷ (팟 + 2 × 베팅)",
   "팟 사이즈 베팅 → 1 ÷ 3 = 33% (밸류 2 : 블러프 1)",
   "상대가 받는 팟 오즈와 같은 값. 이만큼 섞으면 상대의 콜·폴드가 무차별해짐."
  ],
  "spr": [
   "SPR",
   "SPR = 유효 스택 ÷ 팟 (플랍 시점)",
   "유효 스택 400, 플랍 팟 100 → SPR 4",
   "낮은 SPR에서는 탑페어로도 쉽게 올인, 높은 SPR에서는 셋·넛 드로우의 가치가 커짐."
  ],
  "combo": [
   "콤보 수 · 블로커",
   "포켓페어 C(4,2) = 6 · 수딧 4 · 오프수트 4 × 3 = 12 · 전체 C(52,2) = 1326",
   "내가 A를 1장 들고 있으면 상대 AA = C(3,2) = 3콤보, AK = 3 × 4 = 12콤보",
   "보드에 깔린 카드도 같은 방식으로 콤보를 줄임."
  ],
  "equity": [
   "에퀴티",
   "에퀴티 = 승 + 무승부 ÷ 2",
   "승 71.7%, 무 4.5% → 74.0%",
   "매치업 탭과 에퀴티 계산기가 이 정의를 씀."
  ]
 },
 "hands": [
  [
   "스트레이트 플러시",
   "같은 무늬 연속 5장 (A-K-Q-J-T는 로열 플러시)"
  ],
  [
   "포카드",
   "같은 숫자 4장"
  ],
  [
   "풀하우스",
   "트리플 + 페어"
  ],
  [
   "플러시",
   "같은 무늬 5장"
  ],
  [
   "스트레이트",
   "연속 5장 (A-2-3-4-5도 인정)"
  ],
  [
   "트리플",
   "같은 숫자 3장"
  ],
  [
   "투페어",
   "페어 두 개"
  ],
  [
   "원페어",
   "페어 하나"
  ],
  [
   "하이카드",
   "아무것도 없음 — 높은 카드 순"
  ]
 ],
 "seat": {
  "UTG": [
   "언더 더 건",
   "프리플랍 첫 액션. 뒤에 6명이 남아 가장 타이트"
  ],
  "MP": [
   "미들 포지션",
   "UTG 다음"
  ],
  "HJ": [
   "하이잭",
   "CO 바로 앞"
  ],
  "CO": [
   "컷오프",
   "BTN 바로 앞, 레이트 포지션"
  ],
  "BTN": [
   "버튼",
   "플랍부터 항상 마지막 액션 — 최고의 자리"
  ],
  "SB": [
   "스몰 블라인드",
   "0.5BB 강제 베팅, 플랍부터 첫 액션"
  ],
  "BB": [
   "빅 블라인드",
   "1BB 강제 베팅, 프리플랍 마지막 액션"
  ]
 },
 "rule": {
  "outs": [
   "아웃츠 (실전식)",
   "홀카드로 플러시·스트레이트·풀하우스·포카드, 셋·트리플·투페어(새 카드가 홀카드 랭크), 오버카드→탑페어를 만드는 카드. 보드만 좋아지는 카드는 제외, 더티 아웃 할인 없음. 한 카드는 가장 좋은 족보 한 곳에만 셈."
  ],
  "pot": [
   "팟 오즈 탭",
   "상대는 탑페어라고 가정. 플랍 문제는 상대 올인(×4), 턴 문제는 ×2. 승률과 필요 승률 차이가 2%p 미만인 애매한 문제는 출제하지 않음."
  ],
  "outs_tab": [
   "아웃츠 탭",
   "팟 오즈 탭과 같이 상대 탑페어를 가정하고 내가 지고 있는 상황만 출제 (투페어·셋처럼 이미 앞서는 핸드는 아웃 확률이 곧 승률이 아니라서 제외). 아웃츠 수는 정확히 맞혀야 하고, 승률은 규칙값·정확값 중 가까운 쪽과의 차이가 허용 오차(기본 ±2%p) 이내면 통과."
  ],
  "ranges": [
   "프리플랍 / 포지션 레인지",
   "100BB 캐시게임, 2.5BB 오픈 기준으로 일반적인 차트를 단순화한 앱 기준표. 실제 솔버 전략은 혼합 빈도가 있어 경계 핸드가 조금씩 다름."
  ],
  "post": [
   "포스트플랍 포지션",
   "맞았을 때 추가로 받아낼 금액을 남은 스택의 IP 30% / OOP 15%로 가정한 학습용 모델."
  ],
  "mu": [
   "매치업",
   "몬테카를로 100,000회. 우세한 쪽 승률 58% 미만 코인플립, 70% 미만 약간 우세, 70% 이상 압도적. 경계 ±1.5%p는 양쪽 정답."
  ]
 }
};
window.__I18N_CQ('ko', [
 [
  "포스트플랍(플랍 이후)에서 항상 마지막에 액션하는 자리는?",
  [
   "BTN",
   "BB",
   "CO",
   "SB"
  ],
  "플랍부터는 SB부터 시계방향으로 액션하고 BTN이 마지막입니다. 그래서 BTN이 가장 좋은 자리예요."
 ],
 [
  "프리플랍에서 아무도 레이즈하지 않았을 때 마지막에 액션하는 자리는?",
  [
   "BB",
   "BTN",
   "SB",
   "UTG"
  ],
  "프리플랍은 UTG부터 시작해 블라인드가 마지막입니다. 모두 림프·폴드해도 BB는 체크나 레이즈할 선택권(옵션)이 있어요."
 ],
 [
  "IP(인 포지션)의 이점이 아닌 것은?",
  [
   "카드가 더 좋게 들어온다",
   "상대 액션을 보고 결정할 수 있다",
   "팟 크기를 조절하기 쉽다",
   "체크로 무료 카드를 받을 수 있다"
  ],
  "카드 분포는 자리와 무관합니다. IP의 이점은 정보(상대 액션을 먼저 봄)와 컨트롤(팟 크기·무료 카드)에서 나와요."
 ],
 [
  "UTG에서 오픈 레인지를 가장 타이트하게 잡는 주된 이유는?",
  [
   "뒤에 남은 플레이어가 많고, 콜을 받으면 대부분 OOP라서",
   "UTG는 블라인드를 내지 않아서",
   "UTG는 오픈 금액이 더 커서",
   "UTG가 카드를 먼저 받아서"
  ],
  "뒤에 6명이 남아 있으면 누군가 강한 핸드를 들고 있을 가능성이 커지고, 콜을 받으면 포스트플랍에서도 대부분 불리한 자리입니다."
 ],
 [
  "BB가 오픈에 대해 넓게 디펜스할 수 있는 이유로 가장 알맞은 것은?",
  [
   "이미 1BB를 냈고 프리플랍 마지막 액션이라 팟 오즈가 좋다",
   "포스트플랍에서 IP라서",
   "BB 핸드가 평균적으로 더 강해서",
   "BB는 레이크를 내지 않아서"
  ],
  "2.5BB 오픈이면 1.5BB만 더 내고 5.5BB 팟을 다투므로 필요 승률이 약 27%입니다. 단 포스트플랍은 OOP예요."
 ],
 [
  "SB가 오픈에 대해 콜보다 \"3벳 or 폴드\"를 선호하는 이유는?",
  [
   "뒤에 BB가 남아 스퀴즈를 맞을 수 있고, 포스트플랍 내내 OOP라서",
   "SB는 콜 금액이 더 비싸서",
   "규칙상 SB는 콜할 수 없어서",
   "SB 3벳은 금액이 더 싸서"
  ],
  "SB 콜은 BB의 스퀴즈에 노출되고, 팟이 진행되면 항상 먼저 액션해야 합니다. 3벳으로 주도권을 잡거나 접는 쪽이 낫다는 게 일반적인 기준이에요."
 ],
 [
  "스틸(steal)이란?",
  [
   "레이트 포지션(CO·BTN·SB)에서 블라인드를 가져오려는 오픈 레이즈",
   "블라인드가 림프하는 것",
   "리버에서 하는 블러프",
   "프리플랍 올인"
  ],
  "뒤에 블라인드만 남은 자리에서 넓게 오픈해 블라인드를 가져오는 플레이입니다."
 ],
 [
  "스퀴즈(squeeze)란?",
  [
   "누군가 오픈하고 다른 사람이 콜했을 때 하는 3벳",
   "블라인드끼리의 대결",
   "포스트플랍 체크레이즈",
   "리버 오버벳"
  ],
  "콜러는 강한 핸드를 3벳했을 가능성이 낮아(레인지 캡) 압박이 잘 통하고, 오프너는 뒤의 콜러까지 신경 써야 합니다."
 ],
 [
  "\"콜드 콜(cold call)\"의 뜻은?",
  [
   "아직 팟에 돈을 넣지 않은 상태에서 레이즈를 콜하는 것",
   "블라인드에서 체크하는 것",
   "림프한 뒤 레이즈를 콜하는 것",
   "리버에서 마지막으로 콜하는 것"
  ],
  "블라인드처럼 이미 돈을 넣은 상태가 아니라, 처음부터 레이즈 금액을 통째로 콜하는 것을 말합니다."
 ],
 [
  "OOP에서 드로우를 들고 있을 때 불리한 점은?",
  [
   "무료 카드를 보기 어렵고, 맞아도 추가 수익을 덜 받아낸다",
   "아웃츠 수가 줄어든다",
   "드로우가 완성될 확률이 낮아진다",
   "팟 오즈 공식이 달라진다"
  ],
  "확률 자체는 같지만, 에퀴티를 실현하기 어렵고 임플라이드 오즈가 줄어듭니다."
 ],
 [
  "블라인드 배틀(SB 오픈, BB 콜)에서 포스트플랍 IP는?",
  [
   "BB",
   "SB",
   "매 스트리트 번갈아 바뀐다",
   "둘 다 아니다"
  ],
  "플랍부터는 SB가 먼저 액션하므로 BB가 IP입니다."
 ],
 [
  "KTo를 UTG에서는 폴드하고 BTN에서는 오픈하는 이유는?",
  [
   "BTN은 뒤에 블라인드 2명만 남고 포스트플랍 IP가 보장되어서",
   "BTN에서 받은 KTo가 더 강해서",
   "UTG는 오픈 금액이 정해져 있어서",
   "BTN은 레이크가 없어서"
  ],
  "같은 핸드라도 남은 상대 수와 포지션에 따라 수익성이 달라집니다. 앱 기준표에서 KTo는 CO부터 오픈이에요."
 ],
 [
  "3벳 블러프로 A5s 같은 핸드를 자주 쓰는 이유는?",
  [
   "A를 들고 있어 상대 AA·AK 콤보가 줄고, 콜 받아도 휠 스트레이트·넛 플러시 가능성이 있어서",
   "A5s가 AK보다 강해서",
   "상대가 무조건 폴드해서",
   "포스트플랍에서 항상 IP가 되어서"
  ],
  "블로커 효과와 플레이어빌리티를 함께 가진 핸드라 3벳 블러프 후보로 많이 쓰입니다."
 ],
 [
  "IP 플레이어가 상대의 체크에 체크로 따라가면 얻는 것은?",
  [
   "돈을 더 넣지 않고 다음 카드를 본다",
   "팟이 두 배가 된다",
   "상대가 폴드한다",
   "아웃츠가 늘어난다"
  ],
  "마지막에 액션하는 쪽은 체크-체크로 스트리트를 넘겨 무료 카드를 볼 수 있습니다."
 ],
 [
  "프리플랍 액션 순서로 맞는 것은?",
  [
   "UTG → MP → HJ → CO → BTN → SB → BB",
   "SB → BB → UTG → MP → HJ → CO → BTN",
   "BTN → CO → HJ → MP → UTG → SB → BB",
   "UTG → HJ → MP → CO → BTN → SB → BB"
  ],
  "프리플랍은 BB 왼쪽(UTG)부터 시작해 블라인드가 마지막입니다. 플랍부터는 SB부터 시작해요."
 ],
 [
  "보통 \"레이트 포지션\"으로 부르지 않는 자리는?",
  [
   "MP",
   "CO",
   "BTN"
  ],
  "레이트 포지션은 보통 CO와 BTN을 말합니다. MP는 미들 포지션이에요."
 ],
 [
  "앞자리(UTG) 오픈에 대한 3벳·콜 레인지를 좁혀야 하는 이유는?",
  [
   "앞자리 오픈 레인지가 더 강하기 때문",
   "앞자리 오픈 금액이 더 커서",
   "앞자리는 블러프를 절대 안 해서",
   "팟이 작아져서"
  ],
  "UTG는 가장 타이트하게 오픈하므로, 같은 핸드라도 UTG 상대로는 상대적으로 약해집니다."
 ]
]);
window.GUIDE_TX.en = {
 term: {
  hole: ['Hole cards', 'The two private cards each player is dealt.'],
  board: ['Board (community cards)', 'The five shared cards everyone can use, revealed as the flop (3), turn (1) and river (1).'],
  streets: ['Preflop · Flop · Turn · River', 'The four betting rounds, played with 0, 3, 4 and 5 board cards.'],
  blinds: ['Blinds (SB / BB)', 'Forced bets posted before the cards are dealt. The SB is usually half the BB. Amounts are often counted in BB (100BB = 100 big blinds).'],
  button: ['Button (BTN)', 'The seat with the dealer button. It always acts last from the flop on, which makes it the best seat.'],
  eff: ['Effective stack', 'The smaller of the two stacks — the most money that can actually change hands between two players.', 'You 300, opponent 120 → effective stack 120'],
  showdown: ['Showdown', 'Revealing the cards after the last bet to decide the winner.'],
  kicker: ['Kicker', 'The side card that breaks a tie between hands of the same rank.', 'On A-7-2, AK vs AQ → both have a pair of aces, the K kicker wins'],
  nuts: ['Nuts', 'The strongest possible hand on a given board.'],
  rake: ['Rake', 'The fee the house takes from the pot. Higher rake makes small pots less profitable, so preflop ranges tighten slightly.'],
  limp: ['Limp', 'Entering the pot preflop by just calling the big blind instead of raising.'],
  rfi: ['Open raise (RFI)', 'The first raise after everyone before you folded. The Preflop tab trains exactly this decision.'],
  '3bet': ['3-bet / 4-bet', 'Counting the blinds as the 1st bet and the open as the 2nd, the next re-raise is a 3-bet and a raise over that is a 4-bet.'],
  coldcall: ['Cold call', 'Calling a whole raise without having put money in the pot yet. A call from the blinds is not a cold call.'],
  steal: ['Steal', 'A wide open from a late seat (CO, BTN, SB) aimed at winning the blinds.'],
  squeeze: ['Squeeze', 'A 3-bet after one player opened and another called. The caller’s range is capped, so pressure works well.'],
  iso: ['Isolate', 'Raising over a limper to play the pot heads-up.'],
  cbet: ['C-bet (continuation bet)', 'A flop bet by the last preflop raiser.'],
  donk: ['Donk bet', 'An out-of-position bet into the previous street’s aggressor.'],
  xr: ['Check-raise', 'Checking, then raising after the opponent bets. A key weapon for the out-of-position player.'],
  value: ['Value bet', 'A bet that wants to be called by worse hands.'],
  bluff: ['Bluff', 'A bet that wants better hands to fold.'],
  semibluff: ['Semi-bluff', 'A bluff with a draw: weak now, but it can still win when called and it hits. It has both fold equity and draw equity.'],
  float: ['Float', 'Calling in position with a weak hand, planning to take the pot on a later street.'],
  equity: ['Equity', 'Your expected share of the pot if the hand went to showdown right now: win % + tie % ÷ 2.'],
  potodds: ['Pot odds', 'How big the pot is compared with the call. Break-even equity = call ÷ (pot + bet + your call). Calling is profitable when your equity is higher.'],
  outs: ['Outs', 'Unseen cards that would give you the winning hand.'],
  dirty: ['Clean / dirty outs', 'A clean out almost surely wins when it hits. A dirty out can also improve the opponent (e.g. your flush card pairs the board and gives them a full house).'],
  rule24: ['Rule of 2 and 4', 'Approximate your chance (%) as outs × 2 with one card to come and outs × 4 with two (all-in). Above 8 outs, × 4 overestimates — use ×4 − (outs − 8).'],
  ev: ['EV (expected value)', 'The sum of (probability × profit or loss) over every outcome.'],
  implied: ['Implied odds', 'Money you expect to win on later streets when you hit. Lets you call draws that are short on direct pot odds.'],
  rimplied: ['Reverse implied odds', 'Money you can lose later when you hit but are still beaten (e.g. a weaker flush) or when you’re dominated.'],
  foldeq: ['Fold equity', 'Extra value a bet gains from the chance the opponent folds.'],
  mdf: ['MDF (minimum defense frequency)', 'The minimum share of your range you must continue with so any bluff doesn’t auto-profit = pot ÷ (pot + bet).'],
  spr: ['SPR', 'Effective stack ÷ pot on the flop. Low SPR (about 3 or less) makes it easy to get all-in with top pair; high SPR rewards hands that win big, like sets and draws.'],
  combo: ['Combos', 'The number of card combinations for a hand: pocket pair 6, suited 4, offsuit 12, all hands 1326.'],
  blocker: ['Blocker', 'A card in your hand that reduces the opponent’s combos of certain hands. Holding an ace cuts their AA combos from 6 to 3.'],
  set: ['Set / Trips', 'Pocket pair + one board card = set (well hidden, strong). Paired board + one of your cards = trips. Both are three of a kind.'],
  overpair: ['Overpair / Top pair', 'Overpair: a pocket pair above every board card. Top pair: one of your cards pairs the highest board card. Below that come middle and bottom pair.'],
  fd: ['Flush draw', 'Four cards of the same suit — one more makes a flush. 9 outs.'],
  oesd: ['Open-ended straight draw (OESD)', 'Four connected cards that complete a straight with a card at either end. 8 outs. (e.g. 8-9-T-J → 7 or Q)'],
  gutshot: ['Gutshot', 'A straight draw missing one inside card. 4 outs. Two gutshots together make a double gutshot (8 outs).'],
  backdoor: ['Backdoor draw', 'A draw that needs both the turn and the river (e.g. three suited cards on the flop). Worth roughly 1–1.5 outs.'],
  domination: ['Domination', 'Sharing a card with the opponent but having a weaker kicker. In AK vs AQ, AQ is ahead only if a Q comes.'],
  coinflip: ['Coin flip', 'A roughly 50:50 matchup — typically a small or medium pair vs two overcards.'],
  suitedcon: ['Suited connector', 'Consecutive cards of the same suit (76s etc.). They can make both straights and flushes, so they play well.'],
  texture: ['Dry / wet board', 'Dry: few connections or suits, hardly any draws (K-7-2 rainbow). Wet: lots of draws (9-8-7 two-tone).'],
  rainbow: ['Rainbow / Two-tone / Monotone', 'The three flop cards are all different suits / two share a suit / all one suit.'],
  range: ['Range', 'Every hand a player can hold in a spot. Think against the whole range instead of trying to guess one hand.'],
  ipoop: ['IP / OOP', 'IP (in position): acts after the opponent — better information and pot control. OOP (out of position): acts first.'],
  eqr: ['Equity realization (EQR)', 'The share of theoretical equity you actually collect. IP, suited and connected hands realize well; OOP and weak offsuit hands often fold midway and realize less.'],
  polar: ['Polarized range', 'A range made of very strong hands and bluffs. Fits large bets.'],
  capped: ['Capped range', 'A range missing its strongest hands. A player who only called preflop rarely has AA or KK.'],
  gto: ['GTO / Exploit', 'GTO: a balanced strategy that can’t be beaten whatever the opponent does. Exploit: deliberately unbalancing to attack a leak (e.g. folding too much).'],
  tilt: ['Tilt', 'Decisions clouded by emotion (bad beats, losing streaks). If you miss several in a row in Challenge, take a short break.']
 },
 formula: {
  potodds: ['Pot odds (break-even equity)', 'Required equity = call ÷ (pot + bet + your call)', 'Pot 100, opponent bets 50 → 50 ÷ (100 + 50 + 50) = 25%', 'As a ratio, “150 in the pot : 50 to call = 3 : 1” → 1 ÷ (3 + 1) = 25%. Odds of a : 1 mean 1 ÷ (a + 1).'],
  rule24: ['Outs → equity', 'One card to come: outs × 2  ·  two cards (all-in): outs × 4', 'Flush draw, 9 outs, all-in on the flop → 9 × 4 = 36% (exact 35.0%)', 'Exact — turn: n ÷ 46; flop: 1 − (47 − n)/47 × (46 − n)/46. Above 8 outs use ×4 − (n − 8). If there’s no all-in on the flop, only the turn is guaranteed, so ×2 is the safer estimate.'],
  ev: ['EV of a call', 'EV = equity × (pot + bet) − (1 − equity) × call', 'Equity 36%, pot 100, bet 50 → 0.36 × 150 − 0.64 × 50 = +22', 'Positive EV is profitable in the long run — the same conclusion as comparing pot odds.'],
  implied: ['Implied odds — extra winnings needed', 'Extra needed = call × (1 − equity) ÷ equity − (pot + bet)', 'Turn OESD (16%), pot 100, bet 50 → 50 × 0.84 ÷ 0.16 − 150 = 112.5', 'If you can win at least 112.5 more on average on the river when you hit, the call is profitable.'],
  bluffbe: ['Bluff break-even fold rate', 'Required folds = bet ÷ (pot + bet)', 'Bluff 75 into 100 → 75 ÷ 175 = 43%', 'If the opponent folds more often than this, even a pure bluff profits.'],
  mdf: ['MDF (minimum defense frequency)', 'MDF = pot ÷ (pot + bet)', 'Opponent bets 100 into 100 → 100 ÷ 200 = 50%', 'The other side of the bluff break-even. It’s only a theoretical baseline — against players who rarely bluff you can fold more.'],
  bluffratio: ['Bluff share of a river betting range', 'Bluff share = bet ÷ (pot + 2 × bet)', 'Pot-sized bet → 1 ÷ 3 = 33% (2 value : 1 bluff)', 'Equal to the pot odds the caller gets. With this mix, calling and folding become indifferent.'],
  spr: ['SPR', 'SPR = effective stack ÷ pot (on the flop)', 'Effective stack 400, flop pot 100 → SPR 4', 'At low SPR top pair gets all-in easily; at high SPR sets and nut draws gain value.'],
  combo: ['Combos · blockers', 'Pocket pair C(4,2) = 6 · suited 4 · offsuit 4 × 3 = 12 · total C(52,2) = 1326', 'Holding one ace → opponent AA = C(3,2) = 3 combos, AK = 3 × 4 = 12 combos', 'Board cards remove combos the same way.'],
  equity: ['Equity', 'Equity = win + tie ÷ 2', 'Win 71.7%, tie 4.5% → 74.0%', 'The Matchup tab and the equity calculator use this definition.']
 },
 hands: [
  ['Straight flush', 'Five in a row, same suit (A-K-Q-J-T is a royal flush)'],
  ['Four of a kind', 'Four cards of the same rank'],
  ['Full house', 'Three of a kind + a pair'],
  ['Flush', 'Five cards of the same suit'],
  ['Straight', 'Five in a row (A-2-3-4-5 counts)'],
  ['Three of a kind', 'Three cards of the same rank'],
  ['Two pair', 'Two different pairs'],
  ['One pair', 'A single pair'],
  ['High card', 'Nothing — highest cards decide']
 ],
 seat: {
  UTG: ['Under the Gun', 'First to act preflop. Six players behind, so it’s the tightest seat.'],
  MP: ['Middle Position', 'Right after UTG.'],
  HJ: ['Hijack', 'Just before the CO.'],
  CO: ['Cutoff', 'Just before the button; a late position.'],
  BTN: ['Button', 'Always acts last from the flop on — the best seat.'],
  SB: ['Small Blind', 'Posts 0.5BB; first to act from the flop on.'],
  BB: ['Big Blind', 'Posts 1BB; last to act preflop.']
 },
 rule: {
  outs: ['Outs (practical)', 'Cards that use your hole cards to make a flush, straight, full house or quads; a set, trips or two pair (the new card matches a hole card); or top pair with an overcard. Cards that only improve the board don’t count, and dirty outs aren’t discounted. Each card counts once, for its best hand.'],
  pot: ['Pot Odds tab', 'The opponent is assumed to hold top pair. Flop spots assume they are all-in (×4); turn spots use ×2. Close spots where equity and required equity differ by less than 2 points are not dealt.'],
  outs_tab: ['Outs tab', 'Like the Pot Odds tab it assumes the opponent has top pair, and it only deals spots where you’re behind (made hands like two pair or a set are excluded, because their out probability isn’t their equity). The outs count must be exact; equity passes if it’s within the tolerance (default ±2 points) of the rule value or the exact value, whichever is closer.'],
  ranges: ['Preflop / position ranges', 'A simplified version of common charts for 100BB cash games with 2.5BB opens. Real solver strategies mix frequencies, so borderline hands vary a little.'],
  post: ['Postflop position', 'A learning model that assumes you win an extra 30% (IP) / 15% (OOP) of the remaining stack when you hit.'],
  mu: ['Matchups', '100,000 Monte Carlo runs. Favourite under 58% = coin flip, under 70% = slight favourite, 70% or more = dominant. Within ±1.5 points of a boundary, both answers count.']
 }
};
window.__I18N_CQ('en', [
 ['Which seat always acts last after the flop?', ['BTN', 'BB', 'CO', 'SB'], 'From the flop on, action starts at the SB and goes clockwise, so the BTN is last. That’s why it’s the best seat.'],
 ['Preflop, with no raise, which seat acts last?', ['BB', 'BTN', 'SB', 'UTG'], 'Preflop starts at UTG and the blinds act last. Even if everyone limps or folds, the BB still has the option to check or raise.'],
 ['Which is NOT an advantage of being in position (IP)?', ['You get dealt better cards', 'You see the opponent’s action before deciding', 'It’s easier to control the pot size', 'You can check behind for a free card'], 'Card distribution has nothing to do with your seat. The IP edge comes from information (seeing their action first) and control (pot size, free cards).'],
 ['Main reason to open the tightest range from UTG?', ['Many players are left behind and you’ll usually be OOP when called', 'UTG doesn’t post a blind', 'UTG opens to a bigger size', 'UTG gets its cards first'], 'With six players behind, someone is more likely to have a strong hand, and when called you’re usually out of position postflop.'],
 ['Best reason the BB can defend wide against an open?', ['It already posted 1BB and acts last preflop, so the pot odds are good', 'It is in position postflop', 'BB hands are stronger on average', 'The BB pays no rake'], 'Against a 2.5BB open the BB adds only 1.5BB to play for a 5.5BB pot, so it needs about 27% equity. Postflop, though, it is out of position.'],
 ['Why does the SB prefer “3-bet or fold” to calling an open?', ['The BB behind can squeeze, and the SB is OOP for the whole hand', 'Calling costs more from the SB', 'The rules don’t let the SB call', 'A 3-bet is cheaper from the SB'], 'An SB call is exposed to a BB squeeze and must act first on every street. Taking the initiative with a 3-bet or folding is the usual guideline.'],
 ['What is a steal?', ['An open raise from a late seat (CO, BTN, SB) to win the blinds', 'A limp from the blinds', 'A bluff on the river', 'A preflop all-in'], 'With only the blinds left behind, you open wide to pick up the blinds.'],
 ['What is a squeeze?', ['A 3-bet after one player opens and another calls', 'A battle between the blinds', 'A postflop check-raise', 'A river overbet'], 'The caller rarely has a premium hand (capped range) so pressure works, and the opener also has to worry about the caller behind.'],
 ['What does “cold call” mean?', ['Calling a raise without having put any money in the pot yet', 'Checking from the blinds', 'Calling a raise after limping', 'Making the last call on the river'], 'Unlike the blinds, who already have money in, you call the full raise from scratch.'],
 ['What’s the downside of holding a draw out of position?', ['It’s harder to see free cards and you win less when you hit', 'You have fewer outs', 'The draw is less likely to complete', 'The pot odds formula changes'], 'The probabilities are the same, but your equity is harder to realize and your implied odds shrink.'],
 ['In a blind battle (SB opens, BB calls), who is in position postflop?', ['BB', 'SB', 'It alternates each street', 'Neither'], 'From the flop on the SB acts first, so the BB is in position.'],
 ['Why fold KTo from UTG but open it from the BTN?', ['From the BTN only the two blinds are left and you’re guaranteed position postflop', 'KTo is stronger when dealt on the BTN', 'UTG has a fixed open size', 'There’s no rake on the BTN'], 'The same hand is more or less profitable depending on how many opponents are left and on position. In the app’s chart KTo is an open from the CO onward.'],
 ['Why is a hand like A5s a popular 3-bet bluff?', ['The ace reduces the opponent’s AA and AK combos, and when called it can make a wheel or the nut flush', 'A5s is stronger than AK', 'The opponent always folds', 'You’re always in position postflop'], 'It combines a blocker effect with good playability, so it’s a common 3-bet bluff candidate.'],
 ['What does the IP player gain by checking back after a check?', ['Sees the next card without putting in more money', 'The pot doubles', 'The opponent folds', 'Gains more outs'], 'The player who acts last can go check-check to the next street and see a free card.'],
 ['Which is the correct preflop order of action?', ['UTG → MP → HJ → CO → BTN → SB → BB', 'SB → BB → UTG → MP → HJ → CO → BTN', 'BTN → CO → HJ → MP → UTG → SB → BB', 'UTG → HJ → MP → CO → BTN → SB → BB'], 'Preflop starts left of the BB (UTG) and the blinds act last. From the flop on, it starts at the SB.'],
 ['Which seat is usually NOT called a late position?', ['MP', 'CO', 'BTN'], 'Late position usually means the CO and BTN. MP is middle position.'],
 ['Why tighten your 3-bet and calling ranges against an early (UTG) open?', ['Early-position opening ranges are stronger', 'Early opens are bigger', 'Early seats never bluff', 'The pot gets smaller'], 'UTG opens the tightest, so the same hand is relatively weaker against a UTG open.']
]);
window.GUIDE_TX.de = {
 term: {
  hole: ['Hole Cards', 'Die zwei verdeckten Karten, die jeder Spieler erhält.'],
  board: ['Board (Gemeinschaftskarten)', 'Die fünf offenen Karten, die alle nutzen dürfen – aufgedeckt als Flop (3), Turn (1) und River (1).'],
  streets: ['Preflop · Flop · Turn · River', 'Die vier Setzrunden, gespielt mit 0, 3, 4 und 5 Boardkarten.'],
  blinds: ['Blinds (SB / BB)', 'Pflichteinsätze, die vor dem Austeilen gesetzt werden. Der SB ist meist halb so groß wie der BB. Beträge werden oft in BB gezählt (100BB = 100 Big Blinds).'],
  button: ['Button (BTN)', 'Der Platz mit dem Dealer-Button. Ab dem Flop handelt er immer zuletzt – deshalb der beste Platz.'],
  eff: ['Effektiver Stack', 'Der kleinere der beiden Stacks – das meiste Geld, das zwischen zwei Spielern tatsächlich den Besitzer wechseln kann.', 'Du 300, Gegner 120 → effektiver Stack 120'],
  showdown: ['Showdown', 'Das Aufdecken der Karten nach der letzten Bet, um den Gewinner zu ermitteln.'],
  kicker: ['Kicker', 'Die Beikarte, die zwischen Händen gleichen Rangs entscheidet.', 'Auf A-7-2, AK gegen AQ → beide haben ein Paar Asse, der K-Kicker gewinnt'],
  nuts: ['Nuts', 'Die bestmögliche Hand auf einem bestimmten Board.'],
  rake: ['Rake', 'Die Gebühr, die das Haus aus dem Pot nimmt. Höherer Rake macht kleine Pots weniger profitabel, daher werden Preflop-Ranges etwas enger.'],
  limp: ['Limp', 'Preflop in den Pot einsteigen, indem man nur den Big Blind callt, statt zu raisen.'],
  rfi: ['Open Raise (RFI)', 'Der erste Raise, nachdem alle vor dir gefoldet haben. Der Preflop-Tab trainiert genau diese Entscheidung.'],
  '3bet': ['3-Bet / 4-Bet', 'Zählt man die Blinds als 1. Bet und das Open als 2., ist der nächste Re-Raise eine 3-Bet und ein Raise darüber eine 4-Bet.'],
  coldcall: ['Cold Call', 'Einen kompletten Raise callen, ohne bereits Geld im Pot zu haben. Ein Call aus den Blinds ist kein Cold Call.'],
  steal: ['Steal', 'Ein weites Open von einer späten Position (CO, BTN, SB), um die Blinds zu gewinnen.'],
  squeeze: ['Squeeze', 'Eine 3-Bet, nachdem ein Spieler geöffnet und ein anderer gecallt hat. Die Range des Callers ist gecappt, daher wirkt Druck gut.'],
  iso: ['Isolieren (Iso-Raise)', 'Über einen Limper raisen, um den Pot heads-up zu spielen.'],
  cbet: ['C-Bet (Continuation Bet)', 'Eine Bet am Flop durch den letzten Preflop-Raiser.'],
  donk: ['Donk Bet', 'Eine Bet out of position in den Aggressor der vorherigen Street hinein.'],
  xr: ['Check-Raise', 'Checken und dann raisen, nachdem der Gegner gesetzt hat. Eine zentrale Waffe des Spielers out of position.'],
  value: ['Value Bet', 'Eine Bet, die von schlechteren Händen gecallt werden will.'],
  bluff: ['Bluff', 'Eine Bet, die bessere Hände zum Folden bringen will.'],
  semibluff: ['Semi-Bluff', 'Ein Bluff mit einem Draw: jetzt schwach, kann aber nach einem Call noch gewinnen, wenn er ankommt. Er hat sowohl Fold Equity als auch Draw Equity.'],
  float: ['Float', 'In Position mit einer schwachen Hand callen, mit dem Plan, den Pot auf einer späteren Street zu holen.'],
  equity: ['Equity', 'Dein erwarteter Anteil am Pot, wenn die Hand jetzt zum Showdown ginge: Gewinn-% + Split-% ÷ 2.'],
  potodds: ['Pot Odds', 'Wie groß der Pot im Verhältnis zum Call ist. Break-even-Equity = Call ÷ (Pot + Bet + dein Call). Callen ist profitabel, wenn deine Equity höher ist.'],
  outs: ['Outs', 'Ungesehene Karten, die dir die Gewinnerhand geben würden.'],
  dirty: ['Clean / Dirty Outs', 'Ein Clean Out gewinnt fast sicher, wenn es kommt. Ein Dirty Out kann auch den Gegner verbessern (z. B. paart deine Flush-Karte das Board und gibt ihm ein Full House).'],
  rule24: ['2-und-4-Regel', 'Schätze deine Chance (%) als Outs × 2 bei einer kommenden Karte und Outs × 4 bei zwei (All-in). Über 8 Outs überschätzt × 4 – nutze ×4 − (Outs − 8).'],
  ev: ['EV (Erwartungswert)', 'Die Summe aus (Wahrscheinlichkeit × Gewinn oder Verlust) über alle möglichen Ausgänge.'],
  implied: ['Implied Odds', 'Geld, das du auf späteren Streets zu gewinnen erwartest, wenn du triffst. Erlaubt Calls mit Draws, für die die direkten Pot Odds nicht reichen.'],
  rimplied: ['Reverse Implied Odds', 'Geld, das du später verlieren kannst, wenn du triffst, aber trotzdem hinten liegst (z. B. ein kleinerer Flush), oder wenn du dominiert bist.'],
  foldeq: ['Fold Equity', 'Zusätzlicher Wert einer Bet durch die Chance, dass der Gegner foldet.'],
  mdf: ['MDF (Minimum Defense Frequency)', 'Der Mindestanteil deiner Range, mit dem du weiterspielen musst, damit kein Bluff automatisch profitabel ist = Pot ÷ (Pot + Bet).'],
  spr: ['SPR', 'Effektiver Stack ÷ Pot am Flop. Bei niedrigem SPR (etwa 3 oder weniger) kommt man mit Top Pair leicht all-in; hoher SPR belohnt Hände, die groß gewinnen, wie Sets und Draws.'],
  combo: ['Kombos', 'Die Anzahl der Kartenkombinationen einer Hand: Pocket Pair 6, suited 4, offsuit 12, alle Hände 1326.'],
  blocker: ['Blocker', 'Eine Karte auf deiner Hand, die die Kombos des Gegners für bestimmte Hände reduziert. Hältst du ein Ass, sinken seine AA-Kombos von 6 auf 3.'],
  set: ['Set / Trips', 'Pocket Pair + eine Boardkarte = Set (gut versteckt, stark). Gepaartes Board + eine deiner Karten = Trips. Beides ist ein Drilling.'],
  overpair: ['Overpair / Top Pair', 'Overpair: ein Pocket Pair über allen Boardkarten. Top Pair: eine deiner Karten paart die höchste Boardkarte. Darunter folgen Middle Pair und Bottom Pair.'],
  fd: ['Flush Draw', 'Vier Karten derselben Farbe – eine weitere ergibt einen Flush. 9 Outs.'],
  oesd: ['Open-Ended Straight Draw (OESD)', 'Vier verbundene Karten, die mit einer Karte an einem der beiden Enden eine Straße ergeben. 8 Outs. (z. B. 8-9-T-J → 7 oder Q)'],
  gutshot: ['Gutshot', 'Ein Straight Draw, dem eine innere Karte fehlt. 4 Outs. Zwei Gutshots zusammen ergeben einen Double Gutshot (8 Outs).'],
  backdoor: ['Backdoor Draw', 'Ein Draw, der sowohl Turn als auch River braucht (z. B. drei Karten einer Farbe am Flop). Wert etwa 1–1.5 Outs.'],
  domination: ['Domination', 'Eine Karte mit dem Gegner teilen, aber einen schwächeren Kicker haben. Bei AK gegen AQ liegt AQ nur vorne, wenn eine Q kommt.'],
  coinflip: ['Coinflip', 'Ein Duell von etwa 50:50 – typischerweise ein kleines oder mittleres Paar gegen zwei Overcards.'],
  suitedcon: ['Suited Connector', 'Aufeinanderfolgende Karten derselben Farbe (76s usw.). Sie können Straßen und Flushes bilden und spielen sich daher gut.'],
  texture: ['Trockenes / nasses Board', 'Trocken: wenig Verbindungen oder Farben, kaum Draws (K-7-2 Rainbow). Nass: viele Draws (9-8-7 Two-Tone).'],
  rainbow: ['Rainbow / Two-Tone / Monotone', 'Die drei Flopkarten haben alle verschiedene Farben / zwei teilen eine Farbe / alle haben dieselbe Farbe.'],
  range: ['Range', 'Alle Hände, die ein Spieler in einer Situation halten kann. Denke gegen die ganze Range, statt eine einzelne Hand erraten zu wollen.'],
  ipoop: ['IP / OOP', 'IP (in Position): handelt nach dem Gegner – bessere Information und Kontrolle über den Pot. OOP (out of position): handelt zuerst.'],
  eqr: ['Equity-Realisierung (EQR)', 'Der Anteil der theoretischen Equity, den du tatsächlich einsammelst. Suited und verbundene Hände in Position realisieren gut; OOP und mit schwachen Offsuit-Händen foldet man oft unterwegs und realisiert weniger.'],
  polar: ['Polarisierte Range', 'Eine Range aus sehr starken Händen und Bluffs. Passt zu großen Bets.'],
  capped: ['Gecappte Range', 'Eine Range, der die stärksten Hände fehlen. Ein Spieler, der preflop nur gecallt hat, hält selten AA oder KK.'],
  gto: ['GTO / Exploit', 'GTO: eine ausbalancierte Strategie, die nicht zu schlagen ist, egal was der Gegner tut. Exploit: bewusst vom Gleichgewicht abweichen, um ein Leak anzugreifen (z. B. zu häufiges Folden).'],
  tilt: ['Tilt', 'Von Emotionen getrübte Entscheidungen (Bad Beats, Pechsträhnen). Wenn du in der Challenge mehrere Fragen hintereinander falsch beantwortest, mach eine kurze Pause.']
 },
 formula: {
  potodds: ['Pot Odds (Break-even-Equity)', 'Benötigte Equity = Call ÷ (Pot + Bet + dein Call)', 'Pot 100, Gegner setzt 50 → 50 ÷ (100 + 50 + 50) = 25%', 'Als Verhältnis: „150 im Pot : 50 zu callen = 3 : 1“ → 1 ÷ (3 + 1) = 25%. Odds von a : 1 bedeuten 1 ÷ (a + 1).'],
  rule24: ['Outs → Equity', 'Eine Karte kommt noch: Outs × 2  ·  zwei Karten (All-in): Outs × 4', 'Flush Draw, 9 Outs, All-in am Flop → 9 × 4 = 36% (exakt 35.0%)', 'Exakt – Turn: n ÷ 46; Flop: 1 − (47 − n)/47 × (46 − n)/46. Über 8 Outs ×4 − (n − 8) verwenden. Ohne All-in am Flop ist nur der Turn sicher, daher ist ×2 die vorsichtigere Schätzung.'],
  ev: ['EV eines Calls', 'EV = Equity × (Pot + Bet) − (1 − Equity) × Call', 'Equity 36%, Pot 100, Bet 50 → 0.36 × 150 − 0.64 × 50 = +22', 'Positiver EV ist langfristig profitabel – dasselbe Ergebnis wie der Vergleich der Pot Odds.'],
  implied: ['Implied Odds – nötiger Zusatzgewinn', 'Nötiger Zusatzgewinn = Call × (1 − Equity) ÷ Equity − (Pot + Bet)', 'OESD am Turn (16%), Pot 100, Bet 50 → 50 × 0.84 ÷ 0.16 − 150 = 112.5', 'Wenn du bei einem Treffer am River im Schnitt mindestens 112.5 zusätzlich gewinnen kannst, ist der Call profitabel.'],
  bluffbe: ['Break-even-Foldrate eines Bluffs', 'Nötige Folds = Bet ÷ (Pot + Bet)', 'Bluff von 75 in 100 → 75 ÷ 175 = 43%', 'Foldet der Gegner häufiger, ist sogar ein reiner Bluff profitabel.'],
  mdf: ['MDF (Minimum Defense Frequency)', 'MDF = Pot ÷ (Pot + Bet)', 'Gegner setzt 100 in 100 → 100 ÷ 200 = 50%', 'Die Kehrseite der Bluff-Break-even-Rate. Nur ein theoretischer Richtwert – gegen Spieler, die selten bluffen, kannst du öfter folden.'],
  bluffratio: ['Bluff-Anteil einer River-Betting-Range', 'Bluff-Anteil = Bet ÷ (Pot + 2 × Bet)', 'Pot-Size-Bet → 1 ÷ 3 = 33% (2 Value : 1 Bluff)', 'Entspricht den Pot Odds, die der Caller bekommt. Mit diesem Mix sind Call und Fold für ihn gleichwertig (indifferent).'],
  spr: ['SPR', 'SPR = effektiver Stack ÷ Pot (am Flop)', 'Effektiver Stack 400, Pot am Flop 100 → SPR 4', 'Bei niedrigem SPR geht Top Pair leicht all-in; bei hohem SPR gewinnen Sets und Nut Draws an Wert.'],
  combo: ['Kombos · Blocker', 'Pocket Pair C(4,2) = 6 · suited 4 · offsuit 4 × 3 = 12 · gesamt C(52,2) = 1326', 'Du hältst ein Ass → Gegner AA = C(3,2) = 3 Kombos, AK = 3 × 4 = 12 Kombos', 'Boardkarten entfernen Kombos auf dieselbe Weise.'],
  equity: ['Equity', 'Equity = Gewinn + Split ÷ 2', 'Gewinn 71.7%, Split 4.5% → 74.0%', 'Der Duell-Tab und der Equity-Rechner verwenden diese Definition.']
 },
 hands: [
  ['Straight Flush', 'Fünf in Folge, gleiche Farbe (A-K-Q-J-T ist ein Royal Flush)'],
  ['Vierling', 'Vier Karten desselben Rangs'],
  ['Full House', 'Drilling + ein Paar'],
  ['Flush', 'Fünf Karten derselben Farbe'],
  ['Straße', 'Fünf in Folge (A-2-3-4-5 zählt)'],
  ['Drilling', 'Drei Karten desselben Rangs'],
  ['Zwei Paare', 'Zwei verschiedene Paare'],
  ['Ein Paar', 'Ein einzelnes Paar'],
  ['High Card', 'Nichts – die höchsten Karten entscheiden']
 ],
 seat: {
  UTG: ['Under the Gun', 'Handelt preflop zuerst. Sechs Spieler dahinter, daher der engste Platz.'],
  MP: ['Middle Position', 'Direkt nach UTG.'],
  HJ: ['Hijack', 'Direkt vor dem CO.'],
  CO: ['Cutoff', 'Direkt vor dem Button; eine späte Position.'],
  BTN: ['Button', 'Handelt ab dem Flop immer zuletzt – der beste Platz.'],
  SB: ['Small Blind', 'Setzt 0.5BB; handelt ab dem Flop zuerst.'],
  BB: ['Big Blind', 'Setzt 1BB; handelt preflop zuletzt.']
 },
 rule: {
  outs: ['Outs (praktisch)', 'Karten, die mit deinen Hole Cards einen Flush, eine Straße, ein Full House oder einen Vierling bilden; ein Set, Trips oder Zwei Paare (die neue Karte passt zu einer Hole Card); oder Top Pair mit einer Overcard. Karten, die nur das Board verbessern, zählen nicht, und Dirty Outs werden nicht abgezogen. Jede Karte zählt einmal, für ihre beste Hand.'],
  pot: ['Pot-Odds-Tab', 'Der Gegner hält angenommen Top Pair. Flop-Spots gehen von einem All-in aus (×4); Turn-Spots nutzen ×2. Knappe Spots, in denen Equity und benötigte Equity weniger als 2 Punkte auseinanderliegen, werden nicht ausgeteilt.'],
  outs_tab: ['Outs-Tab', 'Wie der Pot-Odds-Tab geht er davon aus, dass der Gegner Top Pair hat, und teilt nur Spots aus, in denen du hinten liegst (fertige Hände wie Zwei Paare oder ein Set sind ausgeschlossen, weil ihre Out-Wahrscheinlichkeit nicht ihre Equity ist). Die Anzahl der Outs muss exakt stimmen; die Equity zählt als richtig, wenn sie innerhalb der Toleranz (Standard ±2 Punkte) um den Regelwert oder den exakten Wert liegt, je nachdem, welcher näher ist.'],
  ranges: ['Preflop- / Positions-Ranges', 'Eine vereinfachte Version gängiger Charts für 100BB-Cash-Games mit 2.5BB-Opens. Echte Solver-Strategien mischen Frequenzen, daher variieren Grenzhände etwas.'],
  post: ['Postflop-Position', 'Ein Lernmodell, das annimmt, dass du bei einem Treffer zusätzlich 30% (IP) / 15% (OOP) des restlichen Stacks gewinnst.'],
  mu: ['Duelle', '100 000 Monte-Carlo-Durchläufe. Favorit unter 58% = Coinflip, unter 70% = leichter Favorit, 70% oder mehr = dominant. Innerhalb von ±1.5 Punkten um eine Grenze zählen beide Antworten.']
 }
};
window.__I18N_CQ('de', [
 ['Welcher Platz handelt nach dem Flop immer zuletzt?', ['BTN', 'BB', 'CO', 'SB'], 'Ab dem Flop beginnt die Action beim SB und läuft im Uhrzeigersinn, daher ist der BTN zuletzt dran. Deshalb ist er der beste Platz.'],
 ['Welcher Platz handelt preflop ohne Raise zuletzt?', ['BB', 'BTN', 'SB', 'UTG'], 'Preflop beginnt bei UTG, und die Blinds handeln zuletzt. Selbst wenn alle limpen oder folden, hat der BB noch die Option zu checken oder zu raisen.'],
 ['Was ist KEIN Vorteil, in Position (IP) zu sein?', ['Du bekommst bessere Karten', 'Du siehst die Action des Gegners vor deiner Entscheidung', 'Du kannst die Potgröße leichter kontrollieren', 'Du kannst hinterher checken und eine Freikarte sehen'], 'Die Kartenverteilung hat nichts mit deinem Platz zu tun. Der IP-Vorteil kommt von Information (seine Action zuerst sehen) und Kontrolle (Potgröße, Freikarten).'],
 ['Hauptgrund, von UTG die engste Range zu öffnen?', ['Viele Spieler sitzen noch dahinter, und nach einem Call bist du meist OOP', 'UTG zahlt keinen Blind', 'UTG öffnet größer', 'UTG bekommt seine Karten zuerst'], 'Mit sechs Spielern dahinter hat eher jemand eine starke Hand, und nach einem Call bist du postflop meist out of position.'],
 ['Bester Grund, warum der BB gegen ein Open weit verteidigen kann?', ['Er hat schon 1BB gesetzt und handelt preflop zuletzt, daher sind die Pot Odds gut', 'Er ist postflop in Position', 'BB-Hände sind im Schnitt stärker', 'Der BB zahlt keinen Rake'], 'Gegen ein 2.5BB-Open zahlt der BB nur 1.5BB zusätzlich für einen Pot von 5.5BB, braucht also etwa 27% Equity. Postflop ist er allerdings out of position.'],
 ['Warum bevorzugt der SB „3-Bet oder Fold“ gegenüber einem Call gegen ein Open?', ['Der BB dahinter kann squeezen, und der SB ist die ganze Hand OOP', 'Callen kostet aus dem SB mehr', 'Die Regeln verbieten dem SB zu callen', 'Eine 3-Bet ist aus dem SB billiger'], 'Ein Call aus dem SB ist einem Squeeze des BB ausgesetzt und muss auf jeder Street zuerst handeln. Mit einer 3-Bet die Initiative ergreifen oder folden ist die übliche Richtlinie.'],
 ['Was ist ein Steal?', ['Ein Open Raise von einer späten Position (CO, BTN, SB), um die Blinds zu gewinnen', 'Ein Limp aus den Blinds', 'Ein Bluff am River', 'Ein All-in preflop'], 'Wenn nur noch die Blinds dahinter sitzen, öffnest du weit, um die Blinds einzusammeln.'],
 ['Was ist ein Squeeze?', ['Eine 3-Bet, nachdem ein Spieler öffnet und ein anderer callt', 'Ein Kampf zwischen den Blinds', 'Ein Check-Raise postflop', 'Ein Overbet am River'], 'Der Caller hat selten eine Premium-Hand (gecappte Range), daher wirkt Druck, und der Opener muss sich zusätzlich um den Caller hinter ihm sorgen.'],
 ['Was bedeutet „Cold Call“?', ['Einen Raise callen, ohne bereits Geld im Pot zu haben', 'Aus den Blinds checken', 'Einen Raise nach einem Limp callen', 'Den letzten Call am River machen'], 'Anders als die Blinds, die schon Geld im Pot haben, callst du den vollen Raise von null an.'],
 ['Was ist der Nachteil eines Draws out of position?', ['Freikarten sind schwerer zu bekommen, und du gewinnst weniger, wenn du triffst', 'Du hast weniger Outs', 'Der Draw kommt seltener an', 'Die Pot-Odds-Formel ändert sich'], 'Die Wahrscheinlichkeiten sind dieselben, aber deine Equity ist schwerer zu realisieren und deine Implied Odds schrumpfen.'],
 ['Im Blind Battle (SB öffnet, BB callt): Wer ist postflop in Position?', ['BB', 'SB', 'Wechselt jede Street', 'Keiner'], 'Ab dem Flop handelt der SB zuerst, daher ist der BB in Position.'],
 ['Warum KTo von UTG folden, aber vom BTN öffnen?', ['Vom BTN sind nur noch die zwei Blinds übrig, und du hast postflop garantiert Position', 'KTo ist auf dem BTN stärker', 'UTG hat eine feste Open-Size', 'Auf dem BTN gibt es keinen Rake'], 'Dieselbe Hand ist mehr oder weniger profitabel, je nachdem, wie viele Gegner noch übrig sind und wie die Position ist. In der Chart der App ist KTo ab dem CO ein Open.'],
 ['Warum ist eine Hand wie A5s ein beliebter 3-Bet-Bluff?', ['Das Ass reduziert die AA- und AK-Kombos des Gegners, und nach einem Call kann sie ein Wheel oder den Nut Flush machen', 'A5s ist stärker als AK', 'Der Gegner foldet immer', 'Du bist postflop immer in Position'], 'Sie verbindet Blocker-Effekt mit guter Spielbarkeit und ist daher ein häufiger Kandidat für einen 3-Bet-Bluff.'],
 ['Was gewinnt der IP-Spieler, wenn er nach einem Check hinterher checkt?', ['Er sieht die nächste Karte, ohne mehr Geld zu investieren', 'Der Pot verdoppelt sich', 'Der Gegner foldet', 'Er bekommt mehr Outs'], 'Wer zuletzt handelt, kann mit Check-Check zur nächsten Street gehen und eine Freikarte sehen.'],
 ['Welche Reihenfolge der Action preflop ist richtig?', ['UTG → MP → HJ → CO → BTN → SB → BB', 'SB → BB → UTG → MP → HJ → CO → BTN', 'BTN → CO → HJ → MP → UTG → SB → BB', 'UTG → HJ → MP → CO → BTN → SB → BB'], 'Preflop beginnt links vom BB (UTG), und die Blinds handeln zuletzt. Ab dem Flop beginnt der SB.'],
 ['Welcher Platz gilt normalerweise NICHT als späte Position?', ['MP', 'CO', 'BTN'], 'Späte Position meint meist CO und BTN. MP ist die mittlere Position.'],
 ['Warum solltest du gegen ein frühes Open (UTG) enger 3-betten und callen?', ['Opening-Ranges aus früher Position sind stärker', 'Frühe Opens sind größer', 'Frühe Positionen bluffen nie', 'Der Pot wird kleiner'], 'UTG öffnet am engsten, daher ist dieselbe Hand gegen ein UTG-Open relativ schwächer.']
]);
window.GUIDE_TX.fr = {
 term: {
  hole: ['Cartes fermées', 'Les deux cartes privées distribuées à chaque joueur.'],
  board: ['Board (cartes communes)', 'Les cinq cartes partagées que tout le monde peut utiliser, révélées au flop (3), au turn (1) et à la river (1).'],
  streets: ['Preflop · Flop · Turn · River', 'Les quatre tours d’enchères, joués avec 0, 3, 4 et 5 cartes au board.'],
  blinds: ['Blindes (SB / BB)', 'Mises forcées posées avant la distribution des cartes. La SB vaut généralement la moitié de la BB. Les montants se comptent souvent en BB (100BB = 100 grosses blindes).'],
  button: ['Bouton (BTN)', 'La place qui a le bouton du donneur. Elle parle toujours en dernier à partir du flop, ce qui en fait la meilleure place.'],
  eff: ['Tapis effectif', 'Le plus petit des deux tapis — le maximum d’argent qui peut réellement changer de mains entre deux joueurs.', 'Vous 300, adversaire 120 → tapis effectif 120'],
  showdown: ['Abattage (showdown)', 'Révéler les cartes après la dernière mise pour désigner le gagnant.'],
  kicker: ['Kicker', 'La carte d’accompagnement qui départage deux mains de même rang.', 'Sur A-7-2, AK contre AQ → les deux ont une paire d’as, le kicker K l’emporte'],
  nuts: ['Nuts', 'La meilleure main possible sur un board donné.'],
  rake: ['Rake', 'La commission prélevée par la maison sur le pot. Un rake élevé rend les petits pots moins rentables, donc les ranges preflop se resserrent légèrement.'],
  limp: ['Limp', 'Entrer dans le pot preflop en suivant simplement la grosse blinde au lieu de relancer.'],
  rfi: ['Open raise (RFI)', 'La première relance après que tous les joueurs avant vous se sont couchés. L’onglet Preflop entraîne exactement cette décision.'],
  '3bet': ['3-bet / 4-bet', 'En comptant les blindes comme 1re mise et l’ouverture comme 2e, la relance suivante est un 3-bet et une relance par-dessus est un 4-bet.'],
  coldcall: ['Cold call', 'Suivre une relance entière sans avoir encore mis d’argent dans le pot. Suivre depuis les blindes n’est pas un cold call.'],
  steal: ['Steal (vol de blindes)', 'Une ouverture large depuis une position de fin de parole (CO, BTN, SB) pour remporter les blindes.'],
  squeeze: ['Squeeze', 'Un 3-bet après qu’un joueur a ouvert et qu’un autre a suivi. La range du joueur qui a suivi est plafonnée, donc la pression fonctionne bien.'],
  iso: ['Isoler', 'Relancer derrière un limper pour jouer le coup en heads-up.'],
  cbet: ['C-bet (mise de continuation)', 'Une mise au flop par le dernier relanceur preflop.'],
  donk: ['Donk bet', 'Une mise hors de position, faite avant que l’agresseur du tour précédent ait pu agir.'],
  xr: ['Check-raise', 'Checker, puis relancer après la mise de l’adversaire. Une arme clé pour le joueur hors de position.'],
  value: ['Value bet', 'Une mise qui veut être payée par des mains moins fortes.'],
  bluff: ['Bluff', 'Une mise qui veut faire coucher de meilleures mains.'],
  semibluff: ['Semi-bluff', 'Un bluff avec un tirage : faible maintenant, mais il peut encore gagner s’il est payé et qu’il rentre. Il a à la fois de la fold equity et de l’équité de tirage.'],
  float: ['Float', 'Suivre en position avec une main faible, avec l’idée de prendre le pot sur un tour suivant.'],
  equity: ['Équité', 'Votre part attendue du pot si la main allait à l’abattage maintenant : % de victoire + % d’égalité ÷ 2.'],
  potodds: ['Cotes du pot', 'La taille du pot comparée au montant à suivre. Équité d’équilibre = call ÷ (pot + mise + votre call). Suivre est rentable quand votre équité est supérieure.'],
  outs: ['Outs', 'Les cartes non vues qui vous donneraient la main gagnante.'],
  dirty: ['Outs propres / sales', 'Un out propre gagne presque à coup sûr quand il tombe. Un out sale peut aussi améliorer l’adversaire (ex. votre carte de couleur appaire le board et lui donne un full).'],
  rule24: ['Règle des 2 et 4', 'Estimez votre chance (%) par outs × 2 avec une carte à venir et outs × 4 avec deux (tapis). Au-delà de 8 outs, × 4 surestime — utilisez ×4 − (outs − 8).'],
  ev: ['EV (espérance de gain)', 'La somme de (probabilité × gain ou perte) sur toutes les issues possibles.'],
  implied: ['Cotes implicites', 'L’argent que vous comptez gagner sur les tours suivants quand vous touchez. Elles permettent de suivre des tirages auxquels la cote directe ne suffit pas.'],
  rimplied: ['Cotes implicites inversées', 'L’argent que vous pouvez perdre plus tard quand vous touchez mais restez battu (ex. une couleur inférieure) ou quand vous êtes dominé.'],
  foldeq: ['Fold equity', 'La valeur supplémentaire qu’une mise tire de la chance que l’adversaire se couche.'],
  mdf: ['MDF (fréquence minimale de défense)', 'La part minimale de votre range avec laquelle vous devez continuer pour qu’aucun bluff ne soit automatiquement rentable = pot ÷ (pot + mise).'],
  spr: ['SPR', 'Tapis effectif ÷ pot au flop. Un SPR bas (environ 3 ou moins) permet de partir facilement à tapis avec top paire ; un SPR élevé récompense les mains qui gagnent gros, comme les sets et les tirages.'],
  combo: ['Combos', 'Le nombre de combinaisons de cartes pour une main : paire servie 6, suited 4, offsuit 12, toutes les mains 1326.'],
  blocker: ['Blocker', 'Une carte de votre main qui réduit les combos adverses de certaines mains. Avoir un as fait passer ses combos d’AA de 6 à 3.'],
  set: ['Set / Trips', 'Paire servie + une carte du board = set (bien caché, fort). Board apparié + une de vos cartes = trips. Dans les deux cas, c’est un brelan.'],
  overpair: ['Overpair / Top paire', 'Overpair : une paire servie supérieure à toutes les cartes du board. Top paire : une de vos cartes s’apparie avec la plus haute carte du board. En dessous viennent la paire du milieu et la petite paire.'],
  fd: ['Tirage couleur', 'Quatre cartes de la même couleur — une de plus fait la couleur. 9 outs.'],
  oesd: ['Tirage quinte par les deux bouts (OESD)', 'Quatre cartes consécutives qui complètent une quinte avec une carte à l’une ou l’autre extrémité. 8 outs. (ex. 8-9-T-J → 7 ou Q)'],
  gutshot: ['Gutshot (tirage ventral)', 'Un tirage quinte auquel il manque une carte intérieure. 4 outs. Deux gutshots ensemble font un double gutshot (8 outs).'],
  backdoor: ['Tirage backdoor', 'Un tirage qui a besoin du turn et de la river (ex. trois cartes de la même couleur au flop). Vaut environ 1–1.5 out.'],
  domination: ['Domination', 'Partager une carte avec l’adversaire mais avoir un kicker plus faible. Dans AK contre AQ, AQ n’est devant que si une Q tombe.'],
  coinflip: ['Coinflip', 'Un affrontement à peu près 50:50 — typiquement une petite ou moyenne paire contre deux overcards.'],
  suitedcon: ['Connecteurs assortis', 'Des cartes consécutives de la même couleur (76s etc.). Elles peuvent faire des quintes comme des couleurs, donc elles se jouent bien.'],
  texture: ['Board sec / humide', 'Sec : peu de connexions ou de couleurs, presque aucun tirage (K-7-2 rainbow). Humide : beaucoup de tirages (9-8-7 bicolore).'],
  rainbow: ['Rainbow / Bicolore / Monocolore', 'Les trois cartes du flop sont toutes de couleurs différentes / deux partagent une couleur / toutes de la même couleur.'],
  range: ['Range', 'Toutes les mains qu’un joueur peut avoir dans une situation. Raisonnez contre la range entière plutôt que d’essayer de deviner une main précise.'],
  ipoop: ['IP / OOP', 'IP (en position) : parle après l’adversaire — meilleure information et contrôle du pot. OOP (hors de position) : parle en premier.'],
  eqr: ['Réalisation d’équité (EQR)', 'La part de l’équité théorique que vous encaissez réellement. Les mains suited et connectées jouées en position la réalisent bien ; hors de position, les mains offsuit faibles se couchent souvent en cours de route et la réalisent moins.'],
  polar: ['Range polarisée', 'Une range composée de mains très fortes et de bluffs. Adaptée aux grosses mises.'],
  capped: ['Range plafonnée (capped)', 'Une range privée de ses mains les plus fortes. Un joueur qui s’est contenté de suivre preflop a rarement AA ou KK.'],
  gto: ['GTO / Exploit', 'GTO : une stratégie équilibrée qu’on ne peut pas battre, quoi que fasse l’adversaire. Exploit : se déséquilibrer volontairement pour attaquer une faille (ex. un adversaire qui se couche trop).'],
  tilt: ['Tilt', 'Des décisions brouillées par les émotions (bad beats, séries de défaites). Si vous ratez plusieurs questions d’affilée dans Défi, faites une courte pause.']
 },
 formula: {
  potodds: ['Cotes du pot (équité d’équilibre)', 'Équité requise = call ÷ (pot + mise + votre call)', 'Pot 100, l’adversaire mise 50 → 50 ÷ (100 + 50 + 50) = 25%', 'En ratio, « 150 dans le pot : 50 à suivre = 3 : 1 » → 1 ÷ (3 + 1) = 25%. Une cote de a : 1 signifie 1 ÷ (a + 1).'],
  rule24: ['Outs → équité', 'Une carte à venir : outs × 2  ·  deux cartes (tapis) : outs × 4', 'Tirage couleur, 9 outs, tapis au flop → 9 × 4 = 36% (exact : 35.0%)', 'Valeur exacte — turn : n ÷ 46 ; flop : 1 − (47 − n)/47 × (46 − n)/46. Au-delà de 8 outs, utilisez ×4 − (n − 8). Sans tapis au flop, seul le turn est garanti, donc ×2 est l’estimation la plus prudente.'],
  ev: ['EV d’un call', 'EV = équité × (pot + mise) − (1 − équité) × call', 'Équité 36%, pot 100, mise 50 → 0.36 × 150 − 0.64 × 50 = +22', 'Une EV positive est rentable sur le long terme — même conclusion qu’en comparant les cotes du pot.'],
  implied: ['Cotes implicites — gains supplémentaires nécessaires', 'Supplément requis = call × (1 − équité) ÷ équité − (pot + mise)', 'OESD au turn (16%), pot 100, mise 50 → 50 × 0.84 ÷ 0.16 − 150 = 112.5', 'Si vous pouvez gagner en moyenne au moins 112.5 de plus à la river quand vous touchez, le call est rentable.'],
  bluffbe: ['Taux de fold d’équilibre d’un bluff', 'Folds requis = mise ÷ (pot + mise)', 'Bluff de 75 dans 100 → 75 ÷ 175 = 43%', 'Si l’adversaire se couche plus souvent que cela, même un bluff pur est rentable.'],
  mdf: ['MDF (fréquence minimale de défense)', 'MDF = pot ÷ (pot + mise)', 'L’adversaire mise 100 dans 100 → 100 ÷ 200 = 50%', 'Le revers du seuil de rentabilité du bluff. Ce n’est qu’une référence théorique — contre des joueurs qui bluffent rarement, vous pouvez vous coucher davantage.'],
  bluffratio: ['Part de bluffs d’une range de mise à la river', 'Part de bluffs = mise ÷ (pot + 2 × mise)', 'Mise pot → 1 ÷ 3 = 33% (2 value : 1 bluff)', 'Égale à la cote du pot qu’obtient le joueur qui suit. Avec ce mélange, suivre et se coucher lui deviennent indifférents.'],
  spr: ['SPR', 'SPR = tapis effectif ÷ pot (au flop)', 'Tapis effectif 400, pot au flop 100 → SPR 4', 'Avec un SPR bas, la top paire part facilement à tapis ; avec un SPR élevé, les sets et les tirages max prennent de la valeur.'],
  combo: ['Combos · blockers', 'Paire servie C(4,2) = 6 · suited 4 · offsuit 4 × 3 = 12 · total C(52,2) = 1326', 'Vous tenez un as → AA adverse = C(3,2) = 3 combos, AK = 3 × 4 = 12 combos', 'Les cartes du board retirent des combos de la même manière.'],
  equity: ['Équité', 'Équité = victoire + égalité ÷ 2', 'Victoire 71.7%, égalité 4.5% → 74.0%', 'L’onglet Duel et le calculateur d’équité utilisent cette définition.']
 },
 hands: [
  ['Quinte flush', 'Cinq cartes qui se suivent, de même couleur (A-K-Q-J-T est une quinte flush royale)'],
  ['Carré', 'Quatre cartes de même rang'],
  ['Full', 'Un brelan + une paire'],
  ['Couleur', 'Cinq cartes de même couleur'],
  ['Quinte', 'Cinq cartes qui se suivent (A-2-3-4-5 compte)'],
  ['Brelan', 'Trois cartes de même rang'],
  ['Double paire', 'Deux paires différentes'],
  ['Paire', 'Une seule paire'],
  ['Carte haute', 'Rien — les cartes les plus hautes décident']
 ],
 seat: {
  UTG: ['Under the Gun', 'Parle en premier preflop. Six joueurs derrière, c’est donc la place la plus serrée.'],
  MP: ['Milieu de parole', 'Juste après UTG.'],
  HJ: ['Hijack', 'Juste avant le CO.'],
  CO: ['Cutoff', 'Juste avant le bouton ; une position de fin de parole.'],
  BTN: ['Bouton', 'Parle toujours en dernier à partir du flop — la meilleure place.'],
  SB: ['Petite blinde', 'Pose 0.5BB ; parle en premier à partir du flop.'],
  BB: ['Grosse blinde', 'Pose 1BB ; parle en dernier preflop.']
 },
 rule: {
  outs: ['Outs (en pratique)', 'Les cartes qui, avec vos cartes fermées, font une couleur, une quinte, un full ou un carré ; un set, des trips ou une double paire (la nouvelle carte correspond à une de vos cartes) ; ou une top paire avec une overcard. Les cartes qui n’améliorent que le board ne comptent pas, et les outs sales ne sont pas décomptés. Chaque carte compte une fois, pour sa meilleure main.'],
  pot: ['Onglet Cotes', 'On suppose que l’adversaire a une top paire. Les situations au flop supposent un tapis (×4) ; celles au turn utilisent ×2. Les situations serrées où l’équité et l’équité requise diffèrent de moins de 2 points ne sont pas proposées.'],
  outs_tab: ['Onglet Outs', 'Comme l’onglet Cotes, il suppose que l’adversaire a une top paire, et ne propose que des situations où vous êtes derrière (les mains faites comme une double paire ou un set sont exclues, car leur probabilité d’out n’est pas leur équité). Le nombre d’outs doit être exact ; l’équité est validée si elle reste dans la tolérance (±2 points par défaut) autour de la valeur de la règle ou de la valeur exacte, selon la plus proche.'],
  ranges: ['Ranges preflop / par position', 'Une version simplifiée des charts courants pour le cash game à 100BB avec des ouvertures à 2.5BB. Les vraies stratégies de solver mélangent les fréquences, donc les mains limites varient un peu.'],
  post: ['Position postflop', 'Un modèle d’apprentissage qui suppose que vous gagnez en plus 30% (IP) / 15% (OOP) du tapis restant quand vous touchez.'],
  mu: ['Duels', '100 000 simulations Monte-Carlo. Favori sous 58% = coinflip, sous 70% = léger favori, 70% ou plus = dominant. À ±1.5 point d’une limite, les deux réponses sont acceptées.']
 }
};
window.__I18N_CQ('fr', [
 ['Quelle place parle toujours en dernier après le flop ?', ['BTN', 'BB', 'CO', 'SB'], 'À partir du flop, la parole commence à la SB et tourne dans le sens horaire, donc le BTN parle en dernier. C’est pourquoi c’est la meilleure place.'],
 ['Preflop, sans relance, quelle place parle en dernier ?', ['BB', 'BTN', 'SB', 'UTG'], 'Le preflop commence à UTG et les blindes parlent en dernier. Même si tout le monde limpe ou se couche, la BB a encore l’option de checker ou de relancer.'],
 ['Lequel n’est PAS un avantage d’être en position (IP) ?', ['Vous recevez de meilleures cartes', 'Vous voyez l’action adverse avant de décider', 'Il est plus facile de contrôler la taille du pot', 'Vous pouvez checker derrière pour une carte gratuite'], 'La distribution des cartes n’a rien à voir avec votre place. L’avantage IP vient de l’information (voir l’action adverse d’abord) et du contrôle (taille du pot, cartes gratuites).'],
 ['Principale raison d’ouvrir la range la plus serrée depuis UTG ?', ['Beaucoup de joueurs restent derrière et vous serez souvent OOP si l’on vous suit', 'UTG ne pose pas de blinde', 'UTG ouvre plus gros', 'UTG reçoit ses cartes en premier'], 'Avec six joueurs derrière, il est plus probable que quelqu’un ait une main forte, et si l’on vous suit, vous êtes généralement hors de position postflop.'],
 ['Meilleure raison pour laquelle la BB peut défendre large contre une ouverture ?', ['Elle a déjà posé 1BB et parle en dernier preflop, donc la cote du pot est bonne', 'Elle est en position postflop', 'Les mains de la BB sont plus fortes en moyenne', 'La BB ne paie pas de rake'], 'Contre une ouverture à 2.5BB, la BB n’ajoute que 1.5BB pour jouer un pot de 5.5BB, il lui faut donc environ 27% d’équité. En revanche, elle est hors de position postflop.'],
 ['Pourquoi la SB préfère-t-elle « 3-bet ou se coucher » plutôt que suivre une ouverture ?', ['La BB derrière peut squeezer, et la SB est OOP pendant tout le coup', 'Suivre coûte plus cher depuis la SB', 'Les règles interdisent à la SB de suivre', 'Un 3-bet coûte moins cher depuis la SB'], 'Un call de la SB est exposé à un squeeze de la BB et doit parler en premier à chaque tour. Prendre l’initiative avec un 3-bet ou se coucher est la ligne directrice habituelle.'],
 ['Qu’est-ce qu’un steal ?', ['Une relance d’ouverture depuis une position de fin de parole (CO, BTN, SB) pour remporter les blindes', 'Un limp depuis les blindes', 'Un bluff à la river', 'Un tapis preflop'], 'Quand il ne reste que les blindes derrière, vous ouvrez large pour ramasser les blindes.'],
 ['Qu’est-ce qu’un squeeze ?', ['Un 3-bet après qu’un joueur a ouvert et qu’un autre a suivi', 'Un affrontement entre les blindes', 'Un check-raise postflop', 'Un overbet à la river'], 'Le joueur qui a suivi a rarement une main premium (range plafonnée), donc la pression fonctionne, et l’ouvreur doit aussi se méfier du joueur qui reste derrière lui.'],
 ['Que signifie « cold call » ?', ['Suivre une relance sans avoir encore mis d’argent dans le pot', 'Checker depuis les blindes', 'Suivre une relance après avoir limpé', 'Faire le dernier call à la river'], 'Contrairement aux blindes, qui ont déjà de l’argent dans le pot, vous payez la relance entière à partir de zéro.'],
 ['Quel est l’inconvénient d’un tirage hors de position ?', ['Il est plus difficile de voir des cartes gratuites et vous gagnez moins quand vous touchez', 'Vous avez moins d’outs', 'Le tirage rentre moins souvent', 'La formule des cotes du pot change'], 'Les probabilités sont les mêmes, mais votre équité est plus difficile à réaliser et vos cotes implicites diminuent.'],
 ['Dans une bataille de blindes (la SB ouvre, la BB suit), qui est en position postflop ?', ['BB', 'SB', 'Ça alterne à chaque tour', 'Aucun des deux'], 'À partir du flop, la SB parle en premier, donc la BB est en position.'],
 ['Pourquoi se coucher avec KTo depuis UTG mais l’ouvrir depuis le BTN ?', ['Depuis le BTN, il ne reste que les deux blindes et vous êtes assuré d’avoir la position postflop', 'KTo est plus forte quand elle est distribuée au BTN', 'UTG a une taille d’ouverture fixe', 'Il n’y a pas de rake au BTN'], 'La même main est plus ou moins rentable selon le nombre d’adversaires restants et la position. Dans le chart de l’app, KTo s’ouvre à partir du CO.'],
 ['Pourquoi une main comme A5s est-elle un 3-bet bluff populaire ?', ['L’as réduit les combos d’AA et d’AK adverses, et si elle est payée elle peut faire une wheel ou la couleur max', 'A5s est plus forte que AK', 'L’adversaire se couche toujours', 'Vous êtes toujours en position postflop'], 'Elle combine un effet blocker et une bonne jouabilité, c’est donc une candidate courante au 3-bet bluff.'],
 ['Que gagne le joueur IP en checkant derrière après un check ?', ['Il voit la carte suivante sans mettre plus d’argent', 'Le pot double', 'L’adversaire se couche', 'Il gagne des outs'], 'Le joueur qui parle en dernier peut passer au tour suivant sur check-check et voir une carte gratuite.'],
 ['Quel est le bon ordre de parole preflop ?', ['UTG → MP → HJ → CO → BTN → SB → BB', 'SB → BB → UTG → MP → HJ → CO → BTN', 'BTN → CO → HJ → MP → UTG → SB → BB', 'UTG → HJ → MP → CO → BTN → SB → BB'], 'Le preflop commence à gauche de la BB (UTG) et les blindes parlent en dernier. À partir du flop, la parole commence à la SB.'],
 ['Quelle place n’est généralement PAS considérée comme une position de fin de parole ?', ['MP', 'CO', 'BTN'], 'La fin de parole désigne généralement le CO et le BTN. MP est en milieu de parole.'],
 ['Pourquoi resserrer vos ranges de 3-bet et de call contre une ouverture précoce (UTG) ?', ['Les ranges d’ouverture en début de parole sont plus fortes', 'Les ouvertures précoces sont plus grosses', 'Les premières positions ne bluffent jamais', 'Le pot devient plus petit'], 'UTG ouvre le plus serré, donc la même main est relativement plus faible face à une ouverture UTG.']
]);
window.GUIDE_TX.es = {
 term: {
  hole: ['Cartas propias (hole cards)', 'Las dos cartas privadas que recibe cada jugador.'],
  board: ['Board (cartas comunitarias)', 'Las cinco cartas compartidas que todos pueden usar; se revelan en el flop (3), el turn (1) y el river (1).'],
  streets: ['Preflop · Flop · Turn · River', 'Las cuatro rondas de apuestas, jugadas con 0, 3, 4 y 5 cartas en el board.'],
  blinds: ['Ciegas (SB / BB)', 'Apuestas obligatorias que se ponen antes de repartir. La SB suele ser la mitad de la BB. Las cantidades se suelen contar en BB (100BB = 100 ciegas grandes).'],
  button: ['Botón (BTN)', 'El asiento con el botón del dealer. Desde el flop siempre actúa el último, por eso es el mejor asiento.'],
  eff: ['Stack efectivo', 'El menor de los dos stacks: lo máximo que realmente puede cambiar de manos entre dos jugadores.', 'Tú 300, rival 120 → stack efectivo 120'],
  showdown: ['Showdown', 'Mostrar las cartas tras la última apuesta para decidir el ganador.'],
  kicker: ['Kicker', 'La carta lateral que desempata entre manos de la misma categoría.', 'En A-7-2, AK vs AQ → ambos tienen pareja de ases, gana el kicker K'],
  nuts: ['Nuts', 'La mejor mano posible en un board dado.'],
  rake: ['Rake', 'La comisión que la casa se lleva del bote. Con más rake los botes pequeños rinden menos, así que los rangos preflop se cierran un poco.'],
  limp: ['Limp', 'Entrar al bote preflop solo pagando la ciega grande en lugar de subir.'],
  rfi: ['Open raise (RFI)', 'La primera subida cuando todos los anteriores se han retirado. La pestaña Preflop entrena exactamente esta decisión.'],
  '3bet': ['3-bet / 4-bet', 'Si las ciegas cuentan como 1.ª apuesta y el open como 2.ª, la siguiente resubida es un 3-bet y una subida sobre ella es un 4-bet.'],
  coldcall: ['Cold call', 'Pagar una subida completa sin haber puesto aún dinero en el bote. Pagar desde las ciegas no es un cold call.'],
  steal: ['Robo (steal)', 'Un open amplio desde una posición tardía (CO, BTN, SB) para llevarse las ciegas.'],
  squeeze: ['Squeeze', 'Un 3-bet después de que un jugador abra y otro pague. El rango del que paga está capado, así que la presión funciona bien.'],
  iso: ['Aislar (iso-raise)', 'Subir sobre un limper para jugar el bote mano a mano.'],
  cbet: ['C-bet (apuesta de continuación)', 'Una apuesta en el flop del último agresor preflop.'],
  donk: ['Donk bet', 'Una apuesta fuera de posición contra el agresor de la calle anterior.'],
  xr: ['Check-raise', 'Pasar y luego subir cuando el rival apuesta. Un arma clave para el jugador fuera de posición.'],
  value: ['Apuesta de valor', 'Una apuesta que busca que la paguen manos peores.'],
  bluff: ['Farol (bluff)', 'Una apuesta que busca que se retiren manos mejores.'],
  semibluff: ['Semifarol', 'Un farol con proyecto: débil ahora, pero puede ganar si lo pagan y liga. Tiene fold equity y equity de proyecto.'],
  float: ['Float', 'Pagar en posición con una mano débil con la idea de llevarse el bote en una calle posterior.'],
  equity: ['Equity', 'Tu parte esperada del bote si la mano llegara al showdown ahora mismo: % de victoria + % de empate ÷ 2.'],
  potodds: ['Pot odds', 'Lo grande que es el bote comparado con lo que hay que pagar. Equity de break-even = pago ÷ (bote + apuesta + tu pago). Pagar es rentable si tu equity es mayor.'],
  outs: ['Outs', 'Cartas no vistas que te darían la mano ganadora.'],
  dirty: ['Outs limpios / sucios', 'Un out limpio casi seguro gana cuando sale. Un out sucio también puede mejorar al rival (p. ej., tu carta de color empareja el board y le da un full).'],
  rule24: ['Regla del 2 y el 4', 'Aproxima tu probabilidad (%) como outs × 2 con una carta por salir y outs × 4 con dos (all-in). Por encima de 8 outs, × 4 sobrestima: usa ×4 − (outs − 8).'],
  ev: ['EV (valor esperado)', 'La suma de (probabilidad × ganancia o pérdida) sobre todos los resultados.'],
  implied: ['Implied odds', 'El dinero que esperas ganar en calles posteriores cuando ligas. Permite pagar proyectos a los que no les llegan las pot odds directas.'],
  rimplied: ['Implied odds inversas', 'El dinero que puedes perder después cuando ligas pero sigues perdiendo (p. ej., un color más bajo) o cuando estás dominado.'],
  foldeq: ['Fold equity', 'El valor extra que gana una apuesta por la probabilidad de que el rival se retire.'],
  mdf: ['MDF (frecuencia mínima de defensa)', 'La parte mínima de tu rango con la que debes continuar para que ningún farol sea rentable automáticamente = bote ÷ (bote + apuesta).'],
  spr: ['SPR', 'Stack efectivo ÷ bote en el flop. Con SPR bajo (unos 3 o menos) es fácil ir all-in con top pair; con SPR alto se premian las manos que ganan botes grandes, como sets y proyectos.'],
  combo: ['Combos', 'El número de combinaciones de cartas de una mano: pareja de mano 6, suited 4, offsuit 12, todas las manos 1326.'],
  blocker: ['Blocker', 'Una carta de tu mano que reduce los combos del rival de ciertas manos. Tener un as baja sus combos de AA de 6 a 3.'],
  set: ['Set / Trío', 'Pareja de mano + una carta del board = set (bien escondido, fuerte). Board emparejado + una de tus cartas = trío (trips). Ambos son trío.'],
  overpair: ['Overpair / Top pair', 'Overpair: una pareja de mano por encima de todas las cartas del board. Top pair: una de tus cartas empareja la carta más alta del board. Por debajo están middle pair y bottom pair.'],
  fd: ['Proyecto de color', 'Cuatro cartas del mismo palo: una más hace color. 9 outs.'],
  oesd: ['Proyecto de escalera abierto (OESD)', 'Cuatro cartas seguidas que completan escalera con una carta por cualquiera de los dos extremos. 8 outs. (p. ej., 8-9-T-J → 7 o Q)'],
  gutshot: ['Gutshot', 'Un proyecto de escalera al que le falta una carta interior. 4 outs. Dos gutshots juntos forman un doble gutshot (8 outs).'],
  backdoor: ['Proyecto backdoor', 'Un proyecto que necesita el turn y el river (p. ej., tres cartas del mismo palo en el flop). Vale aproximadamente 1–1.5 outs.'],
  domination: ['Dominación', 'Compartir una carta con el rival pero con peor kicker. En AK vs AQ, AQ solo va por delante si sale una Q.'],
  coinflip: ['Coinflip', 'Un enfrentamiento de aproximadamente 50:50; típicamente una pareja pequeña o media contra dos overcards.'],
  suitedcon: ['Conectores suited', 'Cartas consecutivas del mismo palo (76s, etc.). Pueden hacer tanto escaleras como colores, así que se juegan bien.'],
  texture: ['Board seco / mojado', 'Seco: pocas conexiones o palos, casi sin proyectos (K-7-2 rainbow). Mojado: muchos proyectos (9-8-7 two-tone).'],
  rainbow: ['Rainbow / Two-tone / Monotone', 'Las tres cartas del flop son de palos distintos / dos comparten palo / todas del mismo palo.'],
  range: ['Rango', 'Todas las manos que un jugador puede tener en una situación. Piensa contra el rango completo en vez de intentar adivinar una mano.'],
  ipoop: ['IP / OOP', 'IP (en posición): actúa después del rival; mejor información y control del bote. OOP (fuera de posición): actúa primero.'],
  eqr: ['Realización de equity (EQR)', 'La parte de la equity teórica que realmente cobras. Las manos IP, suited y conectadas la realizan bien; las manos OOP y offsuit débiles suelen retirarse a mitad de mano y realizan menos.'],
  polar: ['Rango polarizado', 'Un rango formado por manos muy fuertes y faroles. Encaja con apuestas grandes.'],
  capped: ['Rango capado', 'Un rango al que le faltan sus manos más fuertes. Un jugador que solo pagó preflop rara vez tiene AA o KK.'],
  gto: ['GTO / Explotación', 'GTO: una estrategia equilibrada que no puede ser batida haga lo que haga el rival. Explotación: desequilibrarse a propósito para atacar un leak (p. ej., retirarse demasiado).'],
  tilt: ['Tilt', 'Decisiones nubladas por la emoción (bad beats, rachas perdedoras). Si fallas varias seguidas en Reto, tómate un pequeño descanso.']
 },
 formula: {
  potodds: ['Pot odds (equity de break-even)', 'Equity necesaria = pago ÷ (bote + apuesta + tu pago)', 'Bote 100, el rival apuesta 50 → 50 ÷ (100 + 50 + 50) = 25%', 'Como ratio, «150 en el bote : 50 para pagar = 3 : 1» → 1 ÷ (3 + 1) = 25%. Unas odds de a : 1 significan 1 ÷ (a + 1).'],
  rule24: ['Outs → equity', 'Una carta por salir: outs × 2  ·  dos cartas (all-in): outs × 4', 'Proyecto de color, 9 outs, all-in en el flop → 9 × 4 = 36% (exacto 35.0%)', 'Exacto — turn: n ÷ 46; flop: 1 − (47 − n)/47 × (46 − n)/46. Por encima de 8 outs usa ×4 − (n − 8). Si no hay all-in en el flop, solo el turn está garantizado, así que ×2 es la estimación más segura.'],
  ev: ['EV de un pago', 'EV = equity × (bote + apuesta) − (1 − equity) × pago', 'Equity 36%, bote 100, apuesta 50 → 0.36 × 150 − 0.64 × 50 = +22', 'Un EV positivo es rentable a largo plazo: la misma conclusión que comparar las pot odds.'],
  implied: ['Implied odds: ganancias extra necesarias', 'Extra necesario = pago × (1 − equity) ÷ equity − (bote + apuesta)', 'OESD en el turn (16%), bote 100, apuesta 50 → 50 × 0.84 ÷ 0.16 − 150 = 112.5', 'Si en promedio puedes ganar al menos 112.5 más en el river cuando ligas, el pago es rentable.'],
  bluffbe: ['Frecuencia de fold de break-even de un farol', 'Folds necesarios = apuesta ÷ (bote + apuesta)', 'Farol de 75 en un bote de 100 → 75 ÷ 175 = 43%', 'Si el rival se retira más a menudo que esto, incluso un farol puro es rentable.'],
  mdf: ['MDF (frecuencia mínima de defensa)', 'MDF = bote ÷ (bote + apuesta)', 'El rival apuesta 100 en un bote de 100 → 100 ÷ 200 = 50%', 'Es la otra cara del break-even del farol. Solo es una referencia teórica: contra jugadores que casi nunca farolean puedes retirarte más.'],
  bluffratio: ['Proporción de faroles en un rango de apuesta en el river', 'Proporción de faroles = apuesta ÷ (bote + 2 × apuesta)', 'Apuesta del tamaño del bote → 1 ÷ 3 = 33% (2 de valor : 1 farol)', 'Igual a las pot odds que recibe quien paga. Con esta mezcla, pagar y retirarse quedan indiferentes.'],
  spr: ['SPR', 'SPR = stack efectivo ÷ bote (en el flop)', 'Stack efectivo 400, bote en el flop 100 → SPR 4', 'Con SPR bajo el top pair va all-in con facilidad; con SPR alto los sets y los proyectos a las nuts ganan valor.'],
  combo: ['Combos · blockers', 'Pareja de mano C(4,2) = 6 · suited 4 · offsuit 4 × 3 = 12 · total C(52,2) = 1326', 'Con un as en la mano → AA del rival = C(3,2) = 3 combos, AK = 3 × 4 = 12 combos', 'Las cartas del board eliminan combos de la misma forma.'],
  equity: ['Equity', 'Equity = victoria + empate ÷ 2', 'Victoria 71.7%, empate 4.5% → 74.0%', 'La pestaña Duelo y la calculadora de equity usan esta definición.']
 },
 hands: [
  ['Escalera de color', 'Cinco seguidas del mismo palo (A-K-Q-J-T es escalera real)'],
  ['Póker', 'Cuatro cartas del mismo valor'],
  ['Full', 'Trío + pareja'],
  ['Color', 'Cinco cartas del mismo palo'],
  ['Escalera', 'Cinco seguidas (A-2-3-4-5 cuenta)'],
  ['Trío', 'Tres cartas del mismo valor'],
  ['Doble pareja', 'Dos parejas distintas'],
  ['Pareja', 'Una sola pareja'],
  ['Carta alta', 'Nada: deciden las cartas más altas']
 ],
 seat: {
  UTG: ['Under the Gun', 'Primero en actuar preflop. Quedan seis jugadores detrás, así que es el asiento más tight.'],
  MP: ['Posición media', 'Justo después de UTG.'],
  HJ: ['Hijack', 'Justo antes del CO.'],
  CO: ['Cutoff', 'Justo antes del botón; una posición tardía.'],
  BTN: ['Botón', 'Desde el flop siempre actúa el último: el mejor asiento.'],
  SB: ['Ciega pequeña', 'Pone 0.5BB; primero en actuar desde el flop.'],
  BB: ['Ciega grande', 'Pone 1BB; último en actuar preflop.']
 },
 rule: {
  outs: ['Outs (criterio práctico)', 'Cartas que usan tus cartas propias para hacer color, escalera, full o póker; set, trío o doble pareja (la carta nueva coincide con una de tus cartas); o top pair con una overcard. No cuentan las cartas que solo mejoran el board, y los outs sucios no se descuentan. Cada carta cuenta una vez, para su mejor mano.'],
  pot: ['Pestaña Pot odds', 'Se asume que el rival tiene top pair. En el flop se asume all-in (×4); en el turn se usa ×2. No se reparten situaciones ajustadas en las que la equity y la equity necesaria difieran menos de 2 puntos.'],
  outs_tab: ['Pestaña Outs', 'Igual que la pestaña Pot odds, asume que el rival tiene top pair, y solo reparte situaciones en las que vas por detrás (se excluyen manos hechas como doble pareja o set, porque su probabilidad de out no es su equity). El número de outs debe ser exacto; la equity se acepta si está dentro de la tolerancia (por defecto ±2 puntos) del valor de la regla o del valor exacto, el que esté más cerca.'],
  ranges: ['Rangos preflop / por posición', 'Una versión simplificada de las tablas habituales para cash de 100BB con opens de 2.5BB. Las estrategias reales de solver mezclan frecuencias, así que las manos límite varían un poco.'],
  post: ['Posición postflop', 'Un modelo de aprendizaje que asume que ganas un 30% extra (IP) / 15% (OOP) del stack restante cuando ligas.'],
  mu: ['Duelos', '100,000 simulaciones Monte Carlo. Favorito por debajo del 58% = coinflip, por debajo del 70% = ligero favorito, 70% o más = dominante. A ±1.5 puntos de un límite, valen ambas respuestas.']
 }
};
window.__I18N_CQ('es', [
 ['¿Qué asiento actúa siempre el último después del flop?', ['BTN', 'BB', 'CO', 'SB'], 'Desde el flop la acción empieza en la SB y sigue en sentido horario, así que el BTN es el último. Por eso es el mejor asiento.'],
 ['Preflop, sin subidas, ¿qué asiento actúa el último?', ['BB', 'BTN', 'SB', 'UTG'], 'El preflop empieza en UTG y las ciegas actúan al final. Aunque todos hagan limp o se retiren, la BB aún tiene la opción de pasar o subir.'],
 ['¿Cuál NO es una ventaja de estar en posición (IP)?', ['Te reparten mejores cartas', 'Ves la acción del rival antes de decidir', 'Es más fácil controlar el tamaño del bote', 'Puedes pasar detrás y ver una carta gratis'], 'El reparto de cartas no tiene nada que ver con tu asiento. La ventaja IP viene de la información (ver primero su acción) y del control (tamaño del bote, cartas gratis).'],
 ['¿Principal motivo para abrir el rango más tight desde UTG?', ['Quedan muchos jugadores detrás y, si te pagan, normalmente estarás OOP', 'UTG no pone ciega', 'UTG abre a un tamaño mayor', 'UTG recibe sus cartas primero'], 'Con seis jugadores detrás, es más probable que alguien tenga una mano fuerte, y si te pagan normalmente estarás fuera de posición postflop.'],
 ['¿Mejor motivo por el que la BB puede defender amplio contra un open?', ['Ya puso 1BB y actúa la última preflop, así que las pot odds son buenas', 'Está en posición postflop', 'Las manos de la BB son más fuertes de media', 'La BB no paga rake'], 'Contra un open de 2.5BB la BB solo añade 1.5BB para jugar un bote de 5.5BB, así que necesita alrededor de un 27% de equity. Eso sí, postflop está fuera de posición.'],
 ['¿Por qué la SB prefiere «3-bet o retirarse» a pagar un open?', ['La BB que queda detrás puede hacer squeeze, y la SB está OOP toda la mano', 'Pagar cuesta más desde la SB', 'Las reglas no permiten pagar a la SB', 'Un 3-bet es más barato desde la SB'], 'Un pago de la SB queda expuesto a un squeeze de la BB y debe actuar primero en todas las calles. Tomar la iniciativa con 3-bet o retirarse es la pauta habitual.'],
 ['¿Qué es un robo (steal)?', ['Un open raise desde una posición tardía (CO, BTN, SB) para llevarse las ciegas', 'Un limp desde las ciegas', 'Un farol en el river', 'Un all-in preflop'], 'Con solo las ciegas por detrás, abres amplio para llevarte las ciegas.'],
 ['¿Qué es un squeeze?', ['Un 3-bet después de que un jugador abra y otro pague', 'Una batalla entre las ciegas', 'Un check-raise postflop', 'Una overbet en el river'], 'Quien paga rara vez tiene una mano premium (rango capado), así que la presión funciona, y además el que abrió tiene que preocuparse por el que pagó detrás.'],
 ['¿Qué significa «cold call»?', ['Pagar una subida sin haber puesto aún dinero en el bote', 'Pasar desde las ciegas', 'Pagar una subida después de hacer limp', 'Hacer el último pago en el river'], 'A diferencia de las ciegas, que ya tienen dinero puesto, pagas la subida completa desde cero.'],
 ['¿Cuál es la desventaja de llevar un proyecto fuera de posición?', ['Es más difícil ver cartas gratis y ganas menos cuando ligas', 'Tienes menos outs', 'El proyecto tiene menos probabilidad de completarse', 'Cambia la fórmula de las pot odds'], 'Las probabilidades son las mismas, pero tu equity es más difícil de realizar y tus implied odds se reducen.'],
 ['En una batalla de ciegas (la SB abre, la BB paga), ¿quién está en posición postflop?', ['BB', 'SB', 'Se alterna en cada calle', 'Ninguno'], 'Desde el flop la SB actúa primero, así que la BB está en posición.'],
 ['¿Por qué retirar KTo desde UTG pero abrirla desde el BTN?', ['Desde el BTN solo quedan las dos ciegas y tienes posición garantizada postflop', 'KTo es más fuerte cuando te la reparten en el BTN', 'UTG tiene un tamaño de open fijo', 'En el BTN no hay rake'], 'La misma mano es más o menos rentable según cuántos rivales queden y la posición. En la tabla de la app, KTo es open desde el CO en adelante.'],
 ['¿Por qué una mano como A5s es un 3-bet de farol popular?', ['El as reduce los combos de AA y AK del rival, y si te pagan puede hacer una wheel o el color a las nuts', 'A5s es más fuerte que AK', 'El rival siempre se retira', 'Siempre estás en posición postflop'], 'Combina efecto blocker con buena jugabilidad, por eso es un candidato habitual para 3-bet de farol.'],
 ['¿Qué gana el jugador IP pasando detrás tras un check?', ['Ve la siguiente carta sin poner más dinero', 'El bote se duplica', 'El rival se retira', 'Gana más outs'], 'El jugador que actúa el último puede ir check-check a la siguiente calle y ver una carta gratis.'],
 ['¿Cuál es el orden de acción correcto preflop?', ['UTG → MP → HJ → CO → BTN → SB → BB', 'SB → BB → UTG → MP → HJ → CO → BTN', 'BTN → CO → HJ → MP → UTG → SB → BB', 'UTG → HJ → MP → CO → BTN → SB → BB'], 'El preflop empieza a la izquierda de la BB (UTG) y las ciegas actúan al final. Desde el flop, empieza en la SB.'],
 ['¿Qué asiento normalmente NO se considera posición tardía?', ['MP', 'CO', 'BTN'], 'Posición tardía suele significar CO y BTN. MP es posición media.'],
 ['¿Por qué cerrar tus rangos de 3-bet y de pago contra un open temprano (UTG)?', ['Los rangos de open de posiciones tempranas son más fuertes', 'Los opens tempranos son más grandes', 'Los asientos tempranos nunca farolean', 'El bote se hace más pequeño'], 'UTG abre lo más tight, así que la misma mano es relativamente más débil contra un open de UTG.']
]);
window.GUIDE_TX.it = {
 term: {
  hole: ['Carte coperte (hole cards)', 'Le due carte private che riceve ogni giocatore.'],
  board: ['Board (carte comuni)', 'Le cinque carte condivise che tutti possono usare, scoperte al flop (3), al turn (1) e al river (1).'],
  streets: ['Preflop · Flop · Turn · River', 'I quattro giri di puntate, giocati con 0, 3, 4 e 5 carte sul board.'],
  blinds: ['Bui (SB / BB)', 'Puntate obbligatorie messe prima della distribuzione delle carte. Lo SB di solito è la metà del BB. Gli importi si contano spesso in BB (100BB = 100 big blind).'],
  button: ['Bottone (BTN)', 'Il posto con il bottone del dealer. Dal flop in poi agisce sempre per ultimo, per questo è il posto migliore.'],
  eff: ['Stack effettivo', 'Il più piccolo dei due stack: il massimo che può davvero passare di mano tra due giocatori.', 'Tu 300, avversario 120 → stack effettivo 120'],
  showdown: ['Showdown', 'Mostrare le carte dopo l’ultima puntata per decidere il vincitore.'],
  kicker: ['Kicker', 'La carta laterale che decide tra due mani dello stesso punto.', 'Su A-7-2, AK vs AQ → entrambi hanno coppia d’assi, vince il kicker K'],
  nuts: ['Nuts', 'La mano più forte possibile su un dato board.'],
  rake: ['Rake', 'La commissione che la casa trattiene dal piatto. Un rake più alto rende meno redditizi i piatti piccoli, quindi i range preflop si stringono un po’.'],
  limp: ['Limp', 'Entrare nel piatto preflop chiamando solo il big blind invece di rilanciare.'],
  rfi: ['Open raise (RFI)', 'Il primo rilancio dopo che tutti quelli prima di te hanno passato. La scheda Preflop allena proprio questa decisione.'],
  '3bet': ['3-bet / 4-bet', 'Contando i bui come 1ª puntata e l’open come 2ª, il rilancio successivo è un 3-bet e un rilancio sopra quello è un 4-bet.'],
  coldcall: ['Cold call', 'Chiamare un intero rilancio senza aver ancora messo soldi nel piatto. Una chiamata dai bui non è una cold call.'],
  steal: ['Steal', 'Un open largo da una posizione tardiva (CO, BTN, SB) per rubare i bui.'],
  squeeze: ['Squeeze', 'Un 3-bet dopo che un giocatore ha aperto e un altro ha chiamato. Il range di chi chiama è cappato, quindi la pressione funziona bene.'],
  iso: ['Isolare (iso-raise)', 'Rilanciare sopra un limper per giocare il piatto heads-up.'],
  cbet: ['C-bet (continuation bet)', 'Una puntata al flop dell’ultimo rilanciatore preflop.'],
  donk: ['Donk bet', 'Una puntata fuori posizione verso l’aggressore della street precedente.'],
  xr: ['Check-raise', 'Fare check e poi rilanciare quando l’avversario punta. Un’arma chiave per chi è fuori posizione.'],
  value: ['Value bet', 'Una puntata che vuole essere chiamata da mani peggiori.'],
  bluff: ['Bluff', 'Una puntata che vuole far passare mani migliori.'],
  semibluff: ['Semi-bluff', 'Un bluff con un progetto: debole ora, ma può ancora vincere se chiamato e chiude. Ha sia fold equity sia equity del progetto.'],
  float: ['Float', 'Chiamare in posizione con una mano debole, con l’idea di prendersi il piatto in una street successiva.'],
  equity: ['Equity', 'La tua quota attesa del piatto se la mano andasse allo showdown adesso: % di vittoria + % di pareggio ÷ 2.'],
  potodds: ['Pot odds', 'Quanto è grande il piatto rispetto alla chiamata. Equity di break-even = chiamata ÷ (piatto + puntata + la tua chiamata). Chiamare è profittevole se la tua equity è più alta.'],
  outs: ['Outs', 'Carte non ancora viste che ti darebbero la mano vincente.'],
  dirty: ['Outs puliti / sporchi', 'Un out pulito vince quasi sicuramente quando esce. Un out sporco può migliorare anche l’avversario (es. la tua carta di colore accoppia il board e gli dà un full).'],
  rule24: ['Regola del 2 e del 4', 'Stima la tua probabilità (%) come outs × 2 con una carta da scoprire e outs × 4 con due (all-in). Oltre gli 8 outs, × 4 sovrastima: usa ×4 − (outs − 8).'],
  ev: ['EV (valore atteso)', 'La somma di (probabilità × vincita o perdita) su tutti gli esiti.'],
  implied: ['Implied odds', 'I soldi che ti aspetti di vincere nelle street successive quando chiudi. Ti permettono di chiamare progetti a cui non bastano le pot odds dirette.'],
  rimplied: ['Implied odds inverse', 'I soldi che puoi perdere più avanti quando chiudi ma sei ancora battuto (es. un colore più basso) o quando sei dominato.'],
  foldeq: ['Fold equity', 'Il valore extra che una puntata guadagna dalla probabilità che l’avversario passi.'],
  mdf: ['MDF (frequenza minima di difesa)', 'La quota minima del tuo range con cui devi continuare perché nessun bluff sia automaticamente profittevole = piatto ÷ (piatto + puntata).'],
  spr: ['SPR', 'Stack effettivo ÷ piatto al flop. Con SPR basso (circa 3 o meno) è facile andare all-in con top pair; con SPR alto vengono premiate le mani che vincono piatti grossi, come set e progetti.'],
  combo: ['Combo', 'Il numero di combinazioni di carte di una mano: coppia servita 6, suited 4, offsuit 12, tutte le mani 1326.'],
  blocker: ['Blocker', 'Una carta nella tua mano che riduce le combo avversarie di certe mani. Avere un asso porta le sue combo di AA da 6 a 3.'],
  set: ['Set / Trips', 'Coppia servita + una carta del board = set (ben nascosto, forte). Board accoppiato + una tua carta = trips. Entrambi sono un tris.'],
  overpair: ['Overpair / Top pair', 'Overpair: una coppia servita più alta di tutte le carte del board. Top pair: una tua carta accoppia la carta più alta del board. Sotto ci sono middle pair e bottom pair.'],
  fd: ['Progetto di colore', 'Quattro carte dello stesso seme: un’altra fa colore. 9 outs.'],
  oesd: ['Progetto di scala bilaterale (OESD)', 'Quattro carte consecutive che completano la scala con una carta a uno dei due estremi. 8 outs. (es. 8-9-T-J → 7 o Q)'],
  gutshot: ['Gutshot', 'Un progetto di scala a cui manca una carta interna. 4 outs. Due gutshot insieme fanno un double gutshot (8 outs).'],
  backdoor: ['Progetto backdoor', 'Un progetto che ha bisogno sia del turn sia del river (es. tre carte dello stesso seme al flop). Vale circa 1–1.5 outs.'],
  domination: ['Dominazione', 'Condividere una carta con l’avversario ma avere un kicker peggiore. In AK vs AQ, AQ è avanti solo se esce una Q.'],
  coinflip: ['Coinflip', 'Uno scontro circa 50:50, tipicamente una coppia piccola o media contro due overcard.'],
  suitedcon: ['Suited connector', 'Carte consecutive dello stesso seme (76s ecc.). Possono fare sia scale sia colori, quindi si giocano bene.'],
  texture: ['Board asciutto / bagnato', 'Asciutto: poche connessioni o semi, quasi nessun progetto (K-7-2 rainbow). Bagnato: tanti progetti (9-8-7 two-tone).'],
  rainbow: ['Rainbow / Two-tone / Monotone', 'Le tre carte del flop sono tutte di semi diversi / due condividono il seme / tutte dello stesso seme.'],
  range: ['Range', 'Tutte le mani che un giocatore può avere in una situazione. Ragiona contro l’intero range invece di cercare di indovinare una mano.'],
  ipoop: ['IP / OOP', 'IP (in posizione): agisce dopo l’avversario, con più informazioni e controllo del piatto. OOP (fuori posizione): agisce per primo.'],
  eqr: ['Realizzazione dell’equity (EQR)', 'La quota di equity teorica che incassi davvero. Le mani IP, suited e connesse la realizzano bene; le mani OOP e offsuit deboli spesso passano a metà mano e realizzano meno.'],
  polar: ['Range polarizzato', 'Un range fatto di mani molto forti e bluff. Adatto a puntate grandi.'],
  capped: ['Range cappato', 'Un range a cui mancano le mani più forti. Un giocatore che ha solo chiamato preflop raramente ha AA o KK.'],
  gto: ['GTO / Exploit', 'GTO: una strategia bilanciata che non può essere battuta qualunque cosa faccia l’avversario. Exploit: sbilanciarsi di proposito per attaccare un leak (es. passare troppo).'],
  tilt: ['Tilt', 'Decisioni offuscate dalle emozioni (bad beat, serie negative). Se ne sbagli diverse di fila in Sfida, fai una breve pausa.']
 },
 formula: {
  potodds: ['Pot odds (equity di break-even)', 'Equity richiesta = chiamata ÷ (piatto + puntata + la tua chiamata)', 'Piatto 100, l’avversario punta 50 → 50 ÷ (100 + 50 + 50) = 25%', 'Come rapporto, «150 nel piatto : 50 da chiamare = 3 : 1» → 1 ÷ (3 + 1) = 25%. Odds di a : 1 significano 1 ÷ (a + 1).'],
  rule24: ['Outs → equity', 'Una carta da scoprire: outs × 2  ·  due carte (all-in): outs × 4', 'Progetto di colore, 9 outs, all-in al flop → 9 × 4 = 36% (esatto 35.0%)', 'Esatto — turn: n ÷ 46; flop: 1 − (47 − n)/47 × (46 − n)/46. Oltre gli 8 outs usa ×4 − (n − 8). Se al flop non c’è all-in, è garantito solo il turn, quindi ×2 è la stima più prudente.'],
  ev: ['EV di una chiamata', 'EV = equity × (piatto + puntata) − (1 − equity) × chiamata', 'Equity 36%, piatto 100, puntata 50 → 0.36 × 150 − 0.64 × 50 = +22', 'Un EV positivo è profittevole nel lungo periodo: la stessa conclusione del confronto con le pot odds.'],
  implied: ['Implied odds: vincita extra necessaria', 'Extra necessario = chiamata × (1 − equity) ÷ equity − (piatto + puntata)', 'OESD al turn (16%), piatto 100, puntata 50 → 50 × 0.84 ÷ 0.16 − 150 = 112.5', 'Se in media puoi vincere almeno 112.5 in più al river quando chiudi, la chiamata è profittevole.'],
  bluffbe: ['Frequenza di fold di break-even del bluff', 'Fold richiesti = puntata ÷ (piatto + puntata)', 'Bluff da 75 su un piatto di 100 → 75 ÷ 175 = 43%', 'Se l’avversario passa più spesso di così, anche un bluff puro è profittevole.'],
  mdf: ['MDF (frequenza minima di difesa)', 'MDF = piatto ÷ (piatto + puntata)', 'L’avversario punta 100 su un piatto di 100 → 100 ÷ 200 = 50%', 'È l’altra faccia del break-even del bluff. È solo un riferimento teorico: contro giocatori che bluffano raramente puoi passare di più.'],
  bluffratio: ['Quota di bluff in un range di puntata al river', 'Quota di bluff = puntata ÷ (piatto + 2 × puntata)', 'Puntata pari al piatto → 1 ÷ 3 = 33% (2 value : 1 bluff)', 'È uguale alle pot odds che riceve chi chiama. Con questo mix, chiamare e passare diventano indifferenti.'],
  spr: ['SPR', 'SPR = stack effettivo ÷ piatto (al flop)', 'Stack effettivo 400, piatto al flop 100 → SPR 4', 'Con SPR basso la top pair va all-in facilmente; con SPR alto set e progetti nuts guadagnano valore.'],
  combo: ['Combo · blocker', 'Coppia servita C(4,2) = 6 · suited 4 · offsuit 4 × 3 = 12 · totale C(52,2) = 1326', 'Con un asso in mano → AA avversario = C(3,2) = 3 combo, AK = 3 × 4 = 12 combo', 'Le carte del board eliminano le combo allo stesso modo.'],
  equity: ['Equity', 'Equity = vittoria + pareggio ÷ 2', 'Vittoria 71.7%, pareggio 4.5% → 74.0%', 'La scheda Scontro e il calcolatore di equity usano questa definizione.']
 },
 hands: [
  ['Scala colore', 'Cinque consecutive dello stesso seme (A-K-Q-J-T è scala reale)'],
  ['Poker', 'Quattro carte dello stesso valore'],
  ['Full', 'Tris + coppia'],
  ['Colore', 'Cinque carte dello stesso seme'],
  ['Scala', 'Cinque consecutive (A-2-3-4-5 vale)'],
  ['Tris', 'Tre carte dello stesso valore'],
  ['Doppia coppia', 'Due coppie diverse'],
  ['Coppia', 'Una sola coppia'],
  ['Carta alta', 'Niente: decidono le carte più alte']
 ],
 seat: {
  UTG: ['Under the Gun', 'Primo a parlare preflop. Ha sei giocatori dietro, quindi è il posto più tight.'],
  MP: ['Middle Position', 'Subito dopo UTG.'],
  HJ: ['Hijack', 'Subito prima del CO.'],
  CO: ['Cutoff', 'Subito prima del bottone; una posizione tardiva.'],
  BTN: ['Bottone', 'Dal flop in poi agisce sempre per ultimo: il posto migliore.'],
  SB: ['Small Blind', 'Mette 0.5BB; primo a parlare dal flop in poi.'],
  BB: ['Big Blind', 'Mette 1BB; ultimo a parlare preflop.']
 },
 rule: {
  outs: ['Outs (criterio pratico)', 'Carte che usano le tue carte coperte per fare colore, scala, full o poker; set, trips o doppia coppia (la nuova carta corrisponde a una tua carta); oppure top pair con un’overcard. Le carte che migliorano solo il board non contano, e gli outs sporchi non vengono scontati. Ogni carta conta una sola volta, per la sua mano migliore.'],
  pot: ['Scheda Pot odds', 'Si assume che l’avversario abbia top pair. Al flop si assume l’all-in (×4); al turn si usa ×2. Non vengono proposte situazioni al limite in cui equity ed equity richiesta differiscono di meno di 2 punti.'],
  outs_tab: ['Scheda Outs', 'Come la scheda Pot odds assume che l’avversario abbia top pair, e propone solo situazioni in cui sei dietro (sono escluse mani fatte come doppia coppia o set, perché la loro probabilità di out non è la loro equity). Il numero di outs deve essere esatto; l’equity è accettata se rientra nella tolleranza (predefinita ±2 punti) dal valore della regola o dal valore esatto, quello più vicino.'],
  ranges: ['Range preflop / per posizione', 'Una versione semplificata delle tabelle comuni per cash game a 100BB con open da 2.5BB. Le strategie reali dei solver mescolano le frequenze, quindi le mani al limite variano un po’.'],
  post: ['Posizione postflop', 'Un modello didattico che assume che tu vinca un extra del 30% (IP) / 15% (OOP) dello stack rimanente quando chiudi.'],
  mu: ['Scontri', '100,000 simulazioni Monte Carlo. Favorito sotto il 58% = coinflip, sotto il 70% = leggermente favorito, 70% o più = dominante. Entro ±1.5 punti da una soglia, valgono entrambe le risposte.']
 }
};
window.__I18N_CQ('it', [
 ['Quale posto agisce sempre per ultimo dopo il flop?', ['BTN', 'BB', 'CO', 'SB'], 'Dal flop in poi l’azione parte dallo SB e prosegue in senso orario, quindi il BTN è l’ultimo. Per questo è il posto migliore.'],
 ['Preflop, senza rilanci, quale posto agisce per ultimo?', ['BB', 'BTN', 'SB', 'UTG'], 'Il preflop parte da UTG e i bui parlano per ultimi. Anche se tutti fanno limp o passano, il BB ha ancora l’opzione di fare check o rilanciare.'],
 ['Quale NON è un vantaggio dell’essere in posizione (IP)?', ['Ricevi carte migliori', 'Vedi l’azione dell’avversario prima di decidere', 'È più facile controllare la dimensione del piatto', 'Puoi fare check dietro per una carta gratis'], 'La distribuzione delle carte non ha nulla a che fare con il tuo posto. Il vantaggio IP viene dall’informazione (vedere prima la sua azione) e dal controllo (dimensione del piatto, carte gratis).'],
 ['Motivo principale per aprire il range più tight da UTG?', ['Restano molti giocatori dietro e, se chiamato, di solito sarai OOP', 'UTG non mette un buio', 'UTG apre con un size più grande', 'UTG riceve le carte per primo'], 'Con sei giocatori dietro è più probabile che qualcuno abbia una mano forte, e se vieni chiamato di solito sei fuori posizione postflop.'],
 ['Il motivo migliore per cui il BB può difendere largo contro un open?', ['Ha già messo 1BB e parla per ultimo preflop, quindi le pot odds sono buone', 'È in posizione postflop', 'Le mani del BB sono in media più forti', 'Il BB non paga rake'], 'Contro un open da 2.5BB il BB aggiunge solo 1.5BB per giocarsi un piatto di 5.5BB, quindi gli serve circa il 27% di equity. Postflop però è fuori posizione.'],
 ['Perché lo SB preferisce «3-bet o fold» al chiamare un open?', ['Il BB dietro può fare squeeze, e lo SB è OOP per tutta la mano', 'Chiamare costa di più dallo SB', 'Le regole non permettono allo SB di chiamare', 'Un 3-bet costa meno dallo SB'], 'Una chiamata dello SB è esposta allo squeeze del BB e deve parlare per primo in ogni street. Prendere l’iniziativa con un 3-bet o passare è la linea guida abituale.'],
 ['Cos’è uno steal?', ['Un open raise da una posizione tardiva (CO, BTN, SB) per vincere i bui', 'Un limp dai bui', 'Un bluff al river', 'Un all-in preflop'], 'Con solo i bui rimasti dietro, apri largo per prenderti i bui.'],
 ['Cos’è uno squeeze?', ['Un 3-bet dopo che un giocatore apre e un altro chiama', 'Una battaglia tra i bui', 'Un check-raise postflop', 'Un overbet al river'], 'Chi chiama raramente ha una mano premium (range cappato), quindi la pressione funziona, e chi ha aperto deve anche preoccuparsi di chi ha chiamato dietro.'],
 ['Cosa significa «cold call»?', ['Chiamare un rilancio senza aver ancora messo soldi nel piatto', 'Fare check dai bui', 'Chiamare un rilancio dopo aver fatto limp', 'Fare l’ultima chiamata al river'], 'A differenza dei bui, che hanno già soldi nel piatto, chiami l’intero rilancio da zero.'],
 ['Qual è lo svantaggio di avere un progetto fuori posizione?', ['È più difficile vedere carte gratis e vinci meno quando chiudi', 'Hai meno outs', 'Il progetto ha meno probabilità di chiudersi', 'La formula delle pot odds cambia'], 'Le probabilità sono le stesse, ma la tua equity è più difficile da realizzare e le implied odds si riducono.'],
 ['In una blind battle (lo SB apre, il BB chiama), chi è in posizione postflop?', ['BB', 'SB', 'Si alterna a ogni street', 'Nessuno dei due'], 'Dal flop in poi lo SB parla per primo, quindi il BB è in posizione.'],
 ['Perché passare KTo da UTG ma aprirla dal BTN?', ['Dal BTN restano solo i due bui e hai la posizione garantita postflop', 'KTo è più forte quando la ricevi al BTN', 'UTG ha un size di open fisso', 'Al BTN non c’è rake'], 'La stessa mano è più o meno profittevole a seconda di quanti avversari restano e della posizione. Nella tabella dell’app KTo è un open dal CO in poi.'],
 ['Perché una mano come A5s è un 3-bet bluff popolare?', ['L’asso riduce le combo di AA e AK dell’avversario, e se chiamato può fare una wheel o il colore nuts', 'A5s è più forte di AK', 'L’avversario passa sempre', 'Sei sempre in posizione postflop'], 'Unisce l’effetto blocker a una buona giocabilità, per questo è un candidato comune per il 3-bet bluff.'],
 ['Cosa guadagna il giocatore IP facendo check dietro dopo un check?', ['Vede la carta successiva senza mettere altri soldi', 'Il piatto raddoppia', 'L’avversario passa', 'Guadagna più outs'], 'Chi parla per ultimo può andare check-check alla street successiva e vedere una carta gratis.'],
 ['Qual è il corretto ordine d’azione preflop?', ['UTG → MP → HJ → CO → BTN → SB → BB', 'SB → BB → UTG → MP → HJ → CO → BTN', 'BTN → CO → HJ → MP → UTG → SB → BB', 'UTG → HJ → MP → CO → BTN → SB → BB'], 'Il preflop parte alla sinistra del BB (UTG) e i bui parlano per ultimi. Dal flop in poi si parte dallo SB.'],
 ['Quale posto di solito NON è considerato una posizione tardiva?', ['MP', 'CO', 'BTN'], 'Per posizione tardiva si intendono di solito CO e BTN. MP è la posizione centrale.'],
 ['Perché stringere i range di 3-bet e di chiamata contro un open in prima posizione (UTG)?', ['I range di open delle prime posizioni sono più forti', 'Gli open dalle prime posizioni sono più grandi', 'Le prime posizioni non bluffano mai', 'Il piatto diventa più piccolo'], 'UTG apre il range più tight, quindi la stessa mano è relativamente più debole contro un open da UTG.']
]);
