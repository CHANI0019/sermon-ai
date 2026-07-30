# AI 개발 프롬프트 : 접속 기기(Android/iPhone/PC) 자동 감지 및 설치 화면 제공

너는 세계 최고 수준의 Full Stack 개발자이자 Flutter, React, Next.js, Node.js, Nginx, PWA 전문가이다.

사용자가 웹사이트에 접속하면 서버에서 접속 기기를 자동으로 분석하고, Android, iPhone, iPad, Tablet, Windows PC, Mac을 구분하여 가장 적합한 화면을 제공하는 시스템을 개발한다.

## 목표

웹사이트에 접속하는 순간
* **안드로이드 (Chrome 자동 실행)**:
  안드로이드 기기에서 카카오톡 인앱 브라우저로 들어온 경우, 자바스크립트를 이용해 사용자의 액션 없이도 즉시 기기 기본 브라우저(Chrome)로 해당 주소를 다시 띄우는 크롬 인텐트(Intent) 스크립트를 삽입합니다.
  ```javascript
  // 안드로이드 카카오톡 인앱 브라우저 자동 탈출 스크립트 예시
  if (/kakaotalk/i.test(navigator.userAgent) && /android/i.test(navigator.userAgent)) {
      location.href = "intent://" + location.host + location.pathname + location.search + "#Intent;scheme=https;package=com.android.chrome;end";
  }
  ```
* **iOS (사파리 이동 안내 스크린)**:
  아이폰 카카오톡 환경에서는 인텐트 주소가 막혀 있기 때문에, 첫 화면에 다른 복잡한 메뉴를 모두 가리고 **[사파리에서 열기 🧭]** 또는 **[링크 복사하기]** 기능만 크게 강조한 심플 랜딩 페이지를 노출하여 이탈을 최소화합니다.


* Android
* iPhone
* iPad
* Windows
* macOS
* Linux
* Tablet

을 자동으로 구분한다.

또한 PWA 설치 가능 여부도 함께 판단한다.

---

# 서버에서 수행할 작업

HTTP Request Header의 User-Agent와 Client Hints를 이용하여 기기를 판별한다.

우선순위는

1. Client Hints
2. User-Agent

이다.

반드시 다음 정보를 추출한다.

```
deviceType
os
browser
browserVersion
isMobile
isTablet
isDesktop
isPWA
```

예시

```
{
 deviceType:"Android",
 os:"Android 16",
 browser:"Chrome",
 browserVersion:"140",
 isMobile:true,
 isTablet:false,
 isDesktop:false,
 isPWA:false
}
```

---

# Android인 경우

자동으로

"앱 설치"

버튼을 보여준다.
설치 버튼 위치와 문구를 자동 최적화하는 기능까지 포함

만약

beforeinstallprompt

이벤트가 지원된다면

"PWA 설치"

버튼을 보여준다.

설치 완료 후

```
앱이 설치되었습니다.
```

메시지를 출력한다.

---

# iPhone인 경우

PWA 설치 버튼을 숨긴다.

대신

Safari

에서 

"홈 화면에 추가"

가이드를 카드 형식으로 보여준다.설치 버튼 위치와 문구를 자동 최적화하는 기능까지 포함

아이콘과 함께

1. 공유 버튼 클릭

2. 홈 화면에 추가

3. 완료

를 그림과 함께 표시한다.

---

# iPad인 경우

Safari인지 확인한다.

Safari면

홈 화면 추가 안내

Chrome이면

웹앱 안내

를 제공한다.

---

# Windows/macOS/Linux

웹 버전을 보여준다.

우측 상단에는

"모바일에서 이용하기"

QR코드를 표시한다.

QR코드는 현재 사이트 URL을 자동 생성한다.

예

```
https://fortuneai.kr
```

---

# React

Custom Hook

```
useDevice()
```

를 만들어라.

반환값

```
{
 deviceType,
 os,
 browser,
 browserVersion,
 isMobile,
 isTablet,
 isDesktop,
 canInstallPWA,
 isIOS,
 isAndroid
}
```

---

# Node.js

Middleware

```
detectDevice()
```

를 만들어라.

Express에서

```
req.device
```

로 사용할 수 있도록 한다.

예

```
req.device.isAndroid

req.device.browser

req.device.os
```

---

# Flutter Web

Flutter에서도 동일한 결과를 받을 수 있도록

```
DeviceService

DeviceModel
```

을 작성한다.

---

# Nginx

Reverse Proxy 환경에서도

Client Hints가 전달되도록 설정한다.

예

```
Accept-CH

Sec-CH-UA

Sec-CH-UA-Mobile

Sec-CH-UA-Platform
```

헤더를 설정한다.

---

# 보안

User-Agent는 위조 가능하므로

Client Hints를 우선 사용한다.

Unknown Device가 들어오면

Desktop으로 처리한다.

---

# UI

Modern Glassmorphism

Material 3

반응형

Dark Mode

Light Mode

애니메이션 포함

Tailwind CSS 사용

---

# 구현 파일 구조

```
server/
    middleware/
        detectDevice.js

client/
    hooks/
        useDevice.ts

components/
    InstallButton.tsx
    IOSGuide.tsx
    QRInstall.tsx
    DeviceLayout.tsx

flutter/
    device_service.dart
    device_model.dart

nginx/
    nginx.conf
```

---

# 추가 기능

사용자가 Android에서 접속하면

Google Play가 설치되어 있는지도 확인한다.

앱이 이미 설치되어 있으면

"앱 실행"

버튼을 보여준다.

설치되지 않았다면

"앱 설치"

버튼을 보여준다.

---

# iPhone

App Store 앱이 설치되어 있으면

App Store 열기

버튼을 보여준다.

---

# PC

QR코드와 함께

Android

iPhone

각각의 설치 버튼을 보여준다.

---

# 로그 저장

모든 접속을 저장한다.

```
시간

국가

브라우저

OS

기기

PWA 여부

설치 성공 여부

앱 실행 여부
```

이를 DB(SQLite 또는 PostgreSQL)에 저장한다.

---

# 관리자 페이지

실시간 통계를 제공한다.

* Android 접속 수
* iPhone 접속 수
* Windows 접속 수
* Mac 접속 수
* PWA 설치율
* 앱 설치율
* 앱 실행률
* 브라우저 점유율
* OS 점유율
* 일별/월별 통계
* 국가별 접속 비율

차트는 Chart.js 또는 ECharts를 사용한다.

---

# 코드 품질

* TypeScript 기반
* ESLint 적용
* Prettier 적용
* 테스트 코드(Jest/Vitest) 포함
* 모바일·태블릿·데스크톱에서 모두 검증
* 유지보수성을 고려한 모듈 구조
* 각 함수에 상세 주석(JSDoc) 작성

최종 결과물은 실행 가능한 완전한 프로젝트 형태로 제공하며, 필요한 모든 소스코드, 설정 파일, 설치 방법, 실행 방법, 테스트 방법까지 포함한다.
