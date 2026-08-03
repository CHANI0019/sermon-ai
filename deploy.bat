@echo off
echo ===================================================
echo LOGOS One-Click Auto Deploy
echo ===================================================
echo.

echo [1/4] Checking TypeScript compilation...
call npx tsc --noEmit
if %errorlevel% neq 0 (
    echo [ERROR] TypeScript compilation failed!
    pause
    exit /b %errorlevel%
)
echo [OK] TypeScript check passed!
echo.

echo [2/4] Staging and committing Git changes...
call git add .
call git commit -m "feat: LOGOS service auto deploy"
echo.

echo [3/4] Pushing to GitHub main branch...
call git push origin main
echo.

echo [4/4] Deploying to Vercel Live Production...
call npx vercel --prod --yes
if %errorlevel% neq 0 (
    echo [ERROR] Vercel deployment failed!
    pause
    exit /b %errorlevel%
)

echo.
echo ===================================================
echo [SUCCESS] Deployment completed successfully!
echo Live URL: https://sermon-eta.vercel.app
echo ===================================================
echo.
pause
