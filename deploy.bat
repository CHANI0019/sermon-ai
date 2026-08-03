@echo off
chcp 65001 > nul
echo ===================================================
echo 🚀 LOGOS 프로젝트 원클릭 Git 커밋 ^& Vercel 자동 배포
echo ===================================================
echo.

echo [1/4] 🔍 TypeScript 컴파일 및 타입 검증 중...
call npx tsc --noEmit
if %errorlevel% neq 0 (
    echo.
    echo ❌ [오류] TypeScript 컴파일 에러가 발생했습니다. 배포를 중단합니다.
    pause
    exit /b %errorlevel%
)
echo ✅ TypeScript 검증 통과!
echo.

echo [2/4] 🐙 Git 변경 사항 스테이징 및 커밋 중...
call git add .
set /p commit_msg="커밋 메시지를 입력하세요 (엔터 시 기본 메시지 적용): "
if "%commit_msg%"=="" set commit_msg=feat: LOGOS 서비스 기능 업데이트 및 실시간 배포

call git commit -m "%commit_msg%"
echo.

echo [3/4] ⬆️ GitHub main 브랜치 푸시 중...
call git push origin main
if %errorlevel% neq 0 (
    echo ⚠️ GitHub 푸시 중 경고가 발생했으나 Vercel 배포를 계속 진행합니다.
)
echo.

echo [4/4] ⚡ Vercel 실시간 프로덕션 라이브 배포 중...
call npx vercel --prod --yes
if %errorlevel% neq 0 (
    echo ❌ Vercel 배포 중 오류가 발생했습니다.
    pause
    exit /b %errorlevel%
)

echo.
echo ===================================================
echo 🎉 모든 배포가 성공적으로 완료되었습니다!
echo 🔗 프로덕션 라이브 URL: https://sermon-eta.vercel.app
echo ===================================================
echo.
pause
