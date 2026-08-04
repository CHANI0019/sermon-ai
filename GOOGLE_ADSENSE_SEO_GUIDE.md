# 🔍 Google AdSense & SEO 검색엔진 등록 완벽 가이드

본 문서는 **LOGOS (GracePastoral AI)** 서비스에 **Google AdSense 광고 탑재** 및 **Google Search Console (구글 서치 콘솔) 검색엔진 노출 및 SEO 최적화** 작업을 다음에 재사용할 수 있도록 정리한 표준 가이드입니다.

---

## 1. 💰 Google AdSense (구글 애드센스) 연동 가이드

### 1) AdSense 기본 스크립트 삽입 위치
* **대상 파일**: [index.html](file:///d:/sermon/index.html) 의 `<head>` 태그 내부
* **코드 형태**:
  ```html
  <!-- Google AdSense -->
  <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1702553079689690" crossorigin="anonymous"></script>
  ```

### 2) 디바이스 지원 범위
* **데스크톱 & 모바일 공통 지원**: `<head>`에 포함된 애드센스 스크립트는 PC, 태블릿, 모바일 스마트폰 등 접속하는 모든 기기에서 자동 작동합니다.
* **자동 광고 (Auto Ads)**: Google AdSense 콘솔에서 '자동 광고' 활성화 시 구글 AI가 디바이스 크기에 맞춰 데스크톱/모바일 최적 위치에 자동으로 반응형 광고를 배치합니다.

---

## 2. 🚀 Google Search Console & SEO 최적화 가이드

### 1) SEO 필수 파일 구조
구글 검색 봇(Googlebot)이 웹사이트를 수집하고 색인을 생성할 수 있도록 `public/` 폴더에 아래 2개 파일이 포함되어야 합니다.

#### ① `public/robots.txt` (검색 로봇 수집 허용)
```text
User-agent: *
Allow: /

Sitemap: https://sermon-eta.vercel.app/sitemap.xml
```

#### ② `public/sitemap.xml` (사이트 구조 정보)
```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://sermon-eta.vercel.app/</loc>
    <lastmod>2026-08-04</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://sermon-ai-lc8z.vercel.app/</loc>
    <lastmod>2026-08-04</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>
</urlset>
```

#### ③ `index.html` SEO 메타태그 및 구조화 데이터
```html
<head>
  <!-- SEO 기본 태그 -->
  <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
  <meta name="keywords" content="LOGOS AI, 설교 AI, 목회 AI, 개혁주의 신학, 복음주의 신학, 성경 주해, 구속사적 설교, 목회 상담, 찬양 음성 합성, SVS, PWA 목회 앱" />
  <meta name="description" content="정통 개혁주의 및 복음주의 신학 바탕의 신학 & 목회 AI 어시스턴트 (LOGOS AI) - 구속사적 성경 주해, 목회 상담, 찬양 SVS 음성 합성, PWA 모바일 퍼스트 플랫폼" />
  
  <!-- 구글 서치 콘솔 소유권 인증 메타태그 -->
  <meta name="google-site-verification" content="seFaNNfH4Xf0W7qObFVqNY_Kbut-l4FrPKQLe1lzABo" />

  <!-- 대표 URL (Canonical) -->
  <link rel="canonical" href="https://sermon-eta.vercel.app/" />

  <!-- Open Graph (SNS 공유 프리뷰) -->
  <meta property="og:type" content="website" />
  <meta property="og:site_name" content="LOGOS AI" />
  <meta property="og:url" content="https://sermon-eta.vercel.app/" />
  <meta property="og:title" content="LOGOS AI - 정통 개혁주의 신학 & 목회 어시스턴트" />
  <meta property="og:description" content="정통 개혁주의 신학 바탕의 AI 어시스턴트. 구속사적 성경 주해, 목회 상담, 설교 작성 지원 및 AI 찬양 가창 솔루션." />
  <meta property="og:image" content="https://sermon-eta.vercel.app/icon-512.png" />

  <!-- JSON-LD 구조화 데이터 (Google Rich Search Results) -->
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "LOGOS AI",
    "url": "https://sermon-eta.vercel.app/",
    "description": "정통 개혁주의 및 복음주의 신학 바탕의 신학 & 목회 AI 어시스턴트",
    "applicationCategory": "EducationalApplication",
    "operatingSystem": "All",
    "inLanguage": "ko-KR"
  }
  </script>
</head>
```

---

## 3. 🛠️ Google Search Console 등록 및 트러블슈팅

### 1) 서치 콘솔 등록 절차
1. [Google Search Console](https://search.google.com/search-console) 접속 및 로그인
2. **속성 추가 ➔ [URL 접두사]** 에 대표 서비스 URL (`https://sermon-eta.vercel.app/`) 입력
3. **확인 방법 중 [HTML 태그] 선택**:
   * 발급되는 `<meta name="google-site-verification" content="..." />` 태그를 `index.html`의 `<head>`에 추가 후 배포
   * 하단 **[확인]** 버튼 클릭 ➔ **소유권 인증 성공**

### 2) 자주 발생하는 이슈 및 대처 방법

| 현상 / 오휴 메시지 | 원인 분석 | 해결 방법 |
| :--- | :--- | :--- |
| **사이트맵 "가져올 수 없음" (Could not fetch)** | 구글 서치 콘솔의 새 사이트맵 수집 대기열(Queue)에 등록되어 수집 전 표시되는 정상 일시적 현상 | 별도 재제출 없이 수 분~수 시간 뒤 새로고침 시 자동으로 **"성공"** (초록색)으로 전환됨 |
| **"속성에 URL이 없음" 팝업** | 서치 콘솔 좌측 상단에 선택된 속성 URL과 상단 검색창에 입력한 URL이 상이할 때 발생 | 상단 검색창에 현재 선택된 속성의 대표 URL(예: `https://sermon-eta.vercel.app/`)을 그대로 입력 후 Enter |
| **"확인 파일에 잘못된 콘텐츠가 있습니다"** | HTML 파일 확인 시 서치콘솔이 제공한 파일 내용과 다를 때 발생 | HTML 파일 방식 대신 **[HTML 태그] 메타태그 인증 방식**을 사용 |

---

## 4. 💻 Windows PowerShell 자동 배포 스크립트 (`deploy.ps1`) 인코딩 팁

* **한글 깨짐 현상 (`?먰겢由...`) 원인**: Windows PowerShell 5.1은 BOM이 없는 일반 UTF-8 스크립트 파일을 한국어 기본 코드페이지(CP949)로 오인하여 해석함.
* **해결책**: `deploy.ps1` 파일 저장 시 **UTF-8 BOM (`\uFEFF`)** 형식으로 저장해야 PowerShell에서 한글 스크립트 메시지가 깨지지 않고 정상 출력됨.

```powershell
# TypeScript 타입 검증 및 종료 코드($LASTEXITCODE) 점검 예시
npx tsc --noEmit
if ($LASTEXITCODE -ne 0) {
    Write-Host '[오류] TypeScript 컴파일 에러가 발생했습니다.' -ForegroundColor Red
    exit $LASTEXITCODE
}
```

---

**마지막 업데이트**: 2026-08-04  
**관련 문서**: [DEPLOYMENT.md](file:///d:/sermon/DEPLOYMENT.md)
