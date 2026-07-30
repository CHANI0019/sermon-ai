# 🎨 UI/UX Pro Max 디자인 지능 스킬 사용 가이드

이 프로젝트에는 AI 코드 생성 및 디자인 구현 시 프로페셔널한 UI/UX 퀄리티를 유지할 수 있도록 돕는 **UI/UX Pro Max** 디자인 지능 스킬이 탑재되어 있습니다.

본 가이드는 CLI 검색 스크립트 사용법, 디자인 다이얼(Dials) 설정, 마스터/오버라이드 패턴 활용, 그리고 AI 어시스턴트(Antigravity 등)와의 협업 방법을 상세히 안내합니다.

---

## 📌 1. 개요 및 구조

UI/UX Pro Max는 일반적인 "개발자스러운 디자인(Programmer Vibe)"을 탈피하여, 22개 이상의 개발 스택에서 적용 가능한 **67개 이상의 UI 스타일, 161개 컬러 팔레트, 57개 폰트 페어링, 99개 UX 가이드라인**을 제공하는 디자인 지식 베이스입니다.

### 프로젝트 내 설치 경로
* **NPM CLI 패키지**: `ui-ux-pro-max-cli` (프로젝트 `devDependencies`에 등록 완료)
* **AI 스킬 디렉토리**: [.agents/skills/ui-ux-pro-max/](file:///d:/sole%20proprietor/.agents/skills/ui-ux-pro-max)
  * `SKILL.md`: AI 어시스턴트가 읽고 실행하는 규칙 정의 파일
  * `data/`: 스타일, 제품군, 컬러, 차트, GSAP 모션 등의 로우 데이터 CSV 파일들
  * `scripts/search.py`: 로컬 데이터 검색 및 조합을 위한 Python 유틸리티 스크립트

---

## 💻 2. 로컬 CLI 검색 사용법

개발 중 디자인 영감이 필요하거나 적합한 색상/폰트/레이아웃 세부 명세가 필요할 때 터미널에서 아래 명령어로 직접 검색할 수 있습니다.
*(※ Windows 환경이므로 `python3` 대신 `python` 명령어를 사용합니다.)*

### A. 핵심 명령어: 디자인 시스템 자동 생성 (`--design-system`)
원하는 제품군, 산업 분야, 디자인 키워드를 검색하면 이에 맞는 레이아웃 패턴, 스타일, 색상, 타이포그래피, 모션을 종합한 **디자인 시스템 명세**를 출력합니다.

```bash
python .agents/skills/ui-ux-pro-max/scripts/search.py "<키워드 조합>" --design-system
```

* **예시 (세무/금융 대시보드인 경우)**:
  ```bash
  python .agents/skills/ui-ux-pro-max/scripts/search.py "fintech accounting clean dashboard" --design-system
  ```

### B. 디자인 시스템 산출물 영구 저장 및 페이지 구분 (`--persist`)
검색 결과를 프로젝트 내 파일로 저장하고 세션 간 공유하려면 `--persist` 플래그를 추가합니다.

```bash
# 글로벌 디자인 시스템 마스터 파일 생성
python .agents/skills/ui-ux-pro-max/scripts/search.py "fintech dashboard" --design-system --persist -p "CEO-AutoPilot"
```
* **결과 생성 파일**:
  * `design-system/MASTER.md`: 전체 프로젝트의 글로벌 디자인 단일 진실 공급원(Single Source of Truth)

```bash
# 특정 페이지 전용 오버라이드 파일 생성
python .agents/skills/ui-ux-pro-max/scripts/search.py "fintech transactions ledger list" --design-system --persist -p "CEO-AutoPilot" --page "transactions"
```
* **결과 생성 파일**:
  * `design-system/pages/transactions.md`: 대시보드와 대비되어 리스트/테이블 형태에 맞춘 오버라이드 디자인 가이드

### C. 디자인 다이얼 튜닝 (Dials)
`--design-system` 명령어 뒤에 3가지 다이얼(1~10 수치)을 추가하여 디자인 분위기 및 디테일을 미세조정할 수 있습니다.

```bash
python .agents/skills/ui-ux-pro-max/scripts/search.py "<키워드>" --design-system --variance <1-10> --motion <1-10> --density <1-10>
```

| 다이얼 | 낮음 (1-3) | 중간 (4-7) | 높음 (8-10) |
| :--- | :--- | :--- | :--- |
| **`--variance`** | 미니멀, 대칭형 레이아웃 | 표준 모던 디자인 | 비대칭, 과감한 스타일 (Bento Grid 등) |
| **`--motion`** | 미세한 마우스 호버 정도 | 표준 스크롤/스태거 인터랙션 | 복잡한 모션 애니메이션 (GSAP 결합) |
| **`--density`** | 여백이 넓은 레이아웃 (마케팅용) | 표준 화면 레이아웃 | 오밀조밀하고 꽉 찬 화면 (대시보드용) |

* **대시보드 화면용 추천 조합 (화면 밀도 높임, 모션 표준)**:
  ```bash
  python .agents/skills/ui-ux-pro-max/scripts/search.py "fintech dashboard" --design-system --motion 4 --density 8
  ```

---

## 🔍 3. 세부 영역(Domain) 개별 검색 방법

디자인 시스템 전체가 아닌 특정 영역의 정보만 빠르게 찾을 수도 있습니다.

```bash
python .agents/skills/ui-ux-pro-max/scripts/search.py "<검색어>" --domain <영역명>
```

| 대상 영역 (`--domain`) | 활용 목적 | 검색 예시 |
| :--- | :--- | :--- |
| **`style`** | 다양한 UI 스타일 컨셉 및 프롬프트 검색 | `style "glassmorphism"` |
| **`color`** | 브랜드/산업군별 컬러 팔레트 추천 | `color "fintech"` |
| **`typography`** | 가독성 높은 구글 폰트 조합 검색 | `typography "modern professional"` |
| **`chart`** | 데이터 시각화 차트 라이브러리 및 패턴 추천 | `chart "real-time dashboard"` |
| **`ux`** | 애니메이션, 접근성, 폼 레이아웃 가이드라인 | `ux "form input"` |
| **`gsap`** | 웹 인터랙션을 위한 GSAP 코드 스켈레톤 | `gsap "scroll reveal"` |
| **`react`** | React/Next.js 성능 최적화 패턴 | `react "rerender memo"` |
| **`web`** | 모바일 웹/앱 인터페이스 가이드 | `web "touch targets"` |

---

## 🤝 4. AI 어시스턴트(Antigravity) 활용 가이드

AI 어시스턴트에게 새로운 페이지나 컴포넌트를 구현하도록 요청할 때, UI/UX Pro Max의 기준을 지켜 달라고 명시하면 더 고품질의 결과물을 얻을 수 있습니다.

### 추천 프롬프트 템플릿 (Prompt Template)
> "현재 프로젝트에 설치되어 있는 `ui-ux-pro-max` 스킬을 활성화해줘. `design-system/MASTER.md` 파일(또는 특정 페이지 오버라이드 파일)을 읽고, 그곳에 명시된 디자인 토큰(CSS 변수), 폰트 페어링, Spacing Rhythm(8dp 배수), 그리고 마이크로 인터랙션을 반영하여 `[컴포넌트/페이지 이름]`을 구현해줘. Pre-Delivery Checklist 항목을 충족하는지 꼭 검증해줘."

---

## 🚨 5. 꼭 지켜야 할 프로페셔널 UI/UX 체크리스트

코드를 빌드 및 배포하기 전 다음 사항을 필히 점검하세요.

### 🎨 디자인 및 아이콘
* **아이콘 사용 규칙**: 구조적 아이콘(메뉴, 세부 설정 등)에 **이모지(🎨, 🚀, ⚙️)를 사용하지 마십시오**. 대신 **Phosphor Icons** (`@phosphor-icons/react`) 또는 **Heroicons** (`@heroicons/react`) 등 검증된 벡터 라이브러리를 일관성 있게 사용해야 합니다.
* **디자인 토큰 활용**: 하드코딩된 HEX 값 대신 미리 정의된 CSS 변수(Tailwind 설정 등)를 사용해 라이트/다크 모드에 유연하게 대응해야 합니다.

### 📱 레이아웃 및 간격 (Spacing)
* **8dp Rhythm**: 컴포넌트 간격, 패딩, 마진은 가급적 **4px, 8px, 16px, 24px, 32px 등 8의 배수 단위**로 통일합니다.
* **Safe Area 지원**: 헤더, 하단 네비게이션 바 등이 화면 노치(Notch)나 제스처 가이드라인 바에 겹치지 않도록 안전 영역 패딩을 보장해야 합니다.

### ♿ 접근성 (Accessibility) 및 사용성
* **터치 타겟 영역**: 모든 클릭/터치 가능 영역은 최소 **44×44px** 이상 확보해야 합니다. 아이콘 크기가 작을 경우 패딩을 늘리거나 `hitSlop` 영역을 확장합니다.
* **명암비 충족**: 텍스트 가독성을 보장하기 위해 본문 텍스트는 배경과의 대비 명암비가 최소 **4.5:1 이상**이어야 합니다.
