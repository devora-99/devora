@echo off
chcp 65001 >nul
setlocal

cd /d "%~dp0"

set "REMOTE_URL=https://github.com/devora-99/devora.git"
set "DEFAULT_BRANCH=main"
set "COMMIT_MSG=%~1"

if "%COMMIT_MSG%"=="" set "COMMIT_MSG=Update website files"

where git >nul 2>nul
if errorlevel 1 (
    echo Git is not installed or not in PATH.
    pause
    exit /b 1
)

git rev-parse --is-inside-work-tree >nul 2>nul
if errorlevel 1 (
    echo Initializing git repository...
    git init
    if errorlevel 1 goto :error
)

git remote get-url origin >nul 2>nul
if errorlevel 1 (
    echo Adding origin remote...
    git remote add origin "%REMOTE_URL%"
    if errorlevel 1 goto :error
) else (
    for /f "delims=" %%i in ('git remote get-url origin') do set "CURRENT_REMOTE=%%i"
    if /I not "%CURRENT_REMOTE%"=="%REMOTE_URL%" (
        echo Updating origin remote...
        git remote set-url origin "%REMOTE_URL%"
        if errorlevel 1 goto :error
    )
)

echo Fetching remote...
git fetch origin
if errorlevel 1 goto :error

git checkout %DEFAULT_BRANCH% >nul 2>nul
if errorlevel 1 (
    git checkout -b %DEFAULT_BRANCH%
    if errorlevel 1 goto :error
)

echo Staging files...
git add .
if errorlevel 1 goto :error

git diff --cached --quiet
if errorlevel 1 (
    echo Creating commit...
    git commit -m "%COMMIT_MSG%"
    if errorlevel 1 goto :error
) else (
    echo No staged changes to commit.
)

git rev-parse --verify origin/%DEFAULT_BRANCH% >nul 2>nul
if not errorlevel 1 (
    echo Merging remote history...
    git merge origin/%DEFAULT_BRANCH% --allow-unrelated-histories -X ours --no-edit
    if errorlevel 1 goto :error
)

echo Pushing to GitHub...
git push -u origin %DEFAULT_BRANCH%
if errorlevel 1 goto :error

echo GitHub upload complete!
echo   %REMOTE_URL%
pause
exit /b 0

:error
echo GitHub upload failed.
pause
exit /b 1
