# 홀덤 랩 — 아이폰용 웹앱

이 폴더 전체를 인터넷 주소 하나에 올리면, 아이폰에서 앱처럼 설치해 쓸 수 있습니다.
(안드로이드 APK와 기능이 같은 웹 버전)

## 1. GitHub Pages에 올리기 (무료, 처음 1번)
1. https://github.com 가입 / 로그인
2. 오른쪽 위 **+** → **New repository**
   - Repository name: `holdem-lab`
   - **Public** 선택 → **Create repository**
3. 새 저장소 화면에서 **uploading an existing file** 클릭
4. 이 폴더 안의 **파일과 폴더 전부**(fonts, icons 폴더 포함)를 끌어다 놓기 → **Commit changes**
5. 저장소 **Settings** → 왼쪽 **Pages**
   - Source: **Deploy from a branch** / Branch: **main**, 폴더 **/(root)** → **Save**
6. 1~2분 뒤 위쪽에 주소가 뜸: `https://내아이디.github.io/holdem-lab/`

## 2. 아이폰에 설치 (친구 쪽)
1. 주소를 **Safari**로 열기 (인터넷 연결 필요, 처음 1번)
2. 공유 버튼(네모에 화살표) → **홈 화면에 추가** → **추가**
3. 홈 화면의 "홀덤 랩" 아이콘으로 실행 — 이후엔 오프라인에서도 열림

## 업데이트할 때
- 바뀐 파일을 같은 저장소에 다시 업로드(같은 이름이면 덮어씀)
- `sw.js` 맨 위 `VERSION` 값을 바꿔야 폰에 새 버전이 들어감
- 폰에서는 앱을 한두 번 껐다 켜면 반영

## 알아둘 점
- 기록은 각자 폰 안에만 저장됨 (친구 기록과 섞이지 않음)
- 아이폰은 오래 안 쓴 웹앱 데이터를 지울 수 있음 → 가이드 맨 아래 **백업 코드**를 가끔 저장
- Public 저장소라 주소를 아는 사람은 누구나 열 수 있음 (개인정보·서버 없음)
