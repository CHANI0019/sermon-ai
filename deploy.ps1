# LOGOS 원클릭 자동 배포 스크립트 (PowerShell)
$OutputEncoding = [System.Text.Encoding]::UTF8

Write-Host "===================================================" -ForegroundColor Cyan
Write-Host "🚀 LOGOS 프로젝트 원클릭 Git 커밋 & Vercel 자동 배포" -ForegroundColor Cyan
Write-Host "===================================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "[1/4] 🔍 TypeScript 컴파일 및 타입 검증 중..." -ForegroundColor Yellow
npx tsc --noEmit
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ [오류] TypeScript 컴파일 에러가 발생했습니다. 배포를 중단합니다." -ForegroundColor Red
    Exit $LASTEXITCODE
}
Write-Host "✅ TypeScript 검증 통과!" -ForegroundColor Green
Write-Host ""

Write-Host "[2/4] 🐙 Git 변경 사항 스테이징 및 커밋 중..." -ForegroundColor Yellow
git add .
$msg = Read-Host "커밋 메시지를 입력하세요 (엔터 시 기본 메시지 적용)"
if ([string]::IsNullOrWhiteSpace($msg)) {
    $msg = "feat: LOGOS 서비스 기능 업데이트 및 실시간 배포"
}
git commit -m $msg
Write-Host ""

Write-Host "[3/4] ⬆️ GitHub main 브랜치 푸시 중..." -ForegroundColor Yellow
git push origin main
Write-Host ""

Write-Host "[4/4] ⚡ Vercel 실시간 프로덕션 라이브 배포 중..." -ForegroundColor Yellow
npx vercel --prod --yes
Write-Host ""

Write-Host "===================================================" -ForegroundColor Green
Write-Host "🎉 모든 배포가 성공적으로 완료되었습니다!" -ForegroundColor Green
Write-Host "🔗 프로덕션 라이브 URL: https://sermon-eta.vercel.app" -ForegroundColor Cyan
Write-Host "===================================================" -ForegroundColor Green
