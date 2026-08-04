# 🚀 LOGOS 프로젝트 Git & Vercel 배포 가이드 (Deployment Guide)

본 문서는 **LOGOS (GracePastoral AI / sermon-ai)** 프로젝트의 최신 소스 코드를 **GitHub 저장소에 저장**하고 **Vercel 클라우드에 실시간으로 프로덕션 배포**하는 단계별 가이드입니다.

---

## 🌐 프로덕션 서비스 라이브 주소

* **대표 프로덕션 URL**: [https://sermon-eta.vercel.app](https://sermon-eta.vercel.app)
* **서브 배포 URL**: [https://sermon-f2dss3w6t-danaris-projects-1a5840f6.vercel.app](https://sermon-f2dss3w6t-danaris-projects-1a5840f6.vercel.app)
* **GitHub 소스코드 저장소**: [https://github.com/CHANI0019/sermon-ai.git](https://github.com/CHANI0019/sermon-ai.git) (`main` 브랜치)
* **Google AdSense & SEO 등록 가이드**: [GOOGLE_ADSENSE_SEO_GUIDE.md](file:///d:/sermon/GOOGLE_ADSENSE_SEO_GUIDE.md)

## ⚡ 1-Click 원클릭 자동 배포 (One-Click Auto-Deploy)

프로젝트 루트 폴더에 포함된 자동 배포 스크립트를 사용하면 **TypeScript 타입 검증 ➔ Git 커밋 ➔ GitHub 푸시 ➔ Vercel 프로덕션 라이브 배포**를 **단 1번의 클릭/명령어**로 자동 처리합니다.

### 🎯 실행 방법 (아래 3가지 중 택 1)

1. **배널 파일 더블 클릭 (가장 쉬운 방법)**:
   * 프로젝트 폴더의 [deploy.bat](file:///d:/sermon/deploy.bat) 파일을 **더블 클릭**합니다.
2. **npm 명령어 실행**:
   ```bash
   npm run deploy
   ```
3. **PowerShell 스크립트 실행**:
   ```powershell
   .\deploy.ps1
   ```

---

## 1. 🐙 Git 저장소 코드 커밋 & 푸시 (수동 수순)

코드 수정 작업이 완료되면 아래 커맨드를 통해 GitHub 원격 저장소에 최신 변경 사항을 업로드합니다.

### 1단계: 변경된 코드 상태 확인
```bash
git status
```

### 2단계: 변경된 모든 파일 스테이징
```bash
git add .
```

### 3단계: 커밋 메시지 작성 및 커밋
```bash
git commit -m "feat: 영문 약어(UN, WHO, FOMC, KS 등) 음성 정규화 및 말줄임표 호흡 쉬기 반영"
```

### 4단계: GitHub main 브랜치에 푸시
```bash
git push origin main
```

---

## 2. ⚡ Vercel 라이브 웹 서비스 실시간 배포 (Vercel Deployment)

Vercel 배포는 **CLI 터미널 직접 배포** 방식과 **GitHub 자동 연동 배포** 2가지 방식을 모두 지원합니다.

### 방법 A: Vercel CLI 터미널 배포 (추천 - 즉시 적용)

터미널에서 1줄 명령어로 즉시 Vercel 프로덕션 라이브 서버에 소스 코드를 작성/빌드하여 배포합니다.

#### 1단계: 빌드 에러 사전 타입 검증 (권장)
```bash
npx tsc --noEmit
```

#### 2단계: Vercel 프로덕션 실시간 라이브 배포 실행
```bash
npx vercel --prod --yes
```

#### 3단계: 최근 배포 상태 및 URL 목록 확인
```bash
npx vercel ls
```

---

### 방법 B: GitHub 연동 자동 배포 (CI/CD Automated Deployment)

1. Vercel 프로젝트가 GitHub 저장소(`CHANI0019/sermon-ai`)와 연동되어 있으므로, **`git push origin main`** 명령어를 실행하면 Vercel이 자동으로 감지하여 백그라운드 빌드 및 라이브 배포를 진행합니다.
2. 배포 상태는 Vercel 대시보드([https://vercel.com](https://vercel.com))에서 실시간 확인 가능합니다.

---

## 3. 🛠️ 배포 관련 유용한 명령 모음 (Cheat Sheet)

| 구분 | 실행 명령어 | 설명 |
| :--- | :--- | :--- |
| **타입 검증** | `npx tsc --noEmit` | 배포 전 TypeScript 컴파일 에러 사전 점검 |
| **로컬 빌드** | `npm run build` | Vite 프로덕션 번들 빌드 (`dist/` 생성 테스트) |
| **Git 푸시** | `git add . && git commit -m "..." && git push origin main` | GitHub 저장소 코드 변경 사항 업로드 |
| **Vercel 배포** | `npx vercel --prod --yes` | Vercel 클라우드 프로덕션 즉시 라이브 배포 |
| **Vercel 로그** | `npx vercel logs` | 라이브 웹 서버 최근 런타임 로그 확인 |

---

## 💡 배포 시 주의사항 (Troubleshooting Tips)

1. **빌드 에러 발생 시**:
   * `npx tsc --noEmit` 명령어로 TypeScript 타입 오타 및 구문 오류를 확인 후 수정합니다.
2. **Vercel 패키지 설치 확인**:
   * `npx vercel` 실행 시 필요에 따라 최신 Vercel CLI 모듈이 자동 로드됩니다.
