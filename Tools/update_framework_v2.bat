@echo off
chcp 65001 > nul
setlocal

rem ============================================================
rem  update_framework_v2.bat
rem  Interactively select a git branch from SourceDir,
rem  then checkout / pull and copy framework files.
rem
rem  Branch selector key bindings (select_branch.ps1):
rem    Up/Down     : move cursor
rem    Numbers     : jump to item number (Enter to confirm)
rem    Letters     : search / filter mode
rem    Enter       : select branch or enter folder
rem    Backspace   : delete search char / go to parent folder
rem    ESC         : clear search / exit
rem ============================================================

rem -- Read SourceDir from deploy_config.txt --
set "CONFIG_FILE=%~dp0deploy_config.txt"
if not exist "%CONFIG_FILE%" (
    echo [ERROR] Config file not found: %CONFIG_FILE%
    pause
    exit /b 1
)

set "SOURCE_DIR="
for /f "tokens=1,* delims==" %%A in ('findstr /i "^SourceDir=" "%CONFIG_FILE%"') do set "SOURCE_DIR=%%B"
if "%SOURCE_DIR%"=="" (
    echo [ERROR] SourceDir entry missing in deploy_config.txt
    pause
    exit /b 1
)

rem -- Validate SOURCE_DIR --
if not exist "%SOURCE_DIR%\" (
    echo [ERROR] SourceDir path not found: %SOURCE_DIR%
    echo         Please check SourceDir value in deploy_config.txt
    pause
    exit /b 1
)

rem -- Set file copy paths --
set "PROJECT_ROOT=%~dp0.."
set "FRAMEWORK_SRC=%SOURCE_DIR%\Lib\FrameworkJS"
set "GENERATERULE_SRC1=%SOURCE_DIR%\Tools\Lib\TiMetainfoLib\res"
set "GENERATERULE_DEST=%PROJECT_ROOT%\nexacrolib\generate"

rem -- Version-specific paths (set after branch/version are known) --

rem -- Launch interactive branch selector --
echo.
echo Repository: %SOURCE_DIR%
echo Loading branch list...
echo.

set "BRANCH="
set "VERSION="
set "BRANCH_TEMP=%TEMP%\_update_fw_branch.tmp"
set "VERSION_TEMP=%TEMP%\_update_fw_version.tmp"

rem -- delete any leftover result files --
if exist "%BRANCH_TEMP%"  del "%BRANCH_TEMP%"
if exist "%VERSION_TEMP%" del "%VERSION_TEMP%"

rem -- pass values via env vars (avoids PowerShell -File quoting bugs) --
set "PSBRANCH_REPO=%SOURCE_DIR%"
set "PSBRANCH_RESULT=%BRANCH_TEMP%"
set "PSVERSION_RESULT=%VERSION_TEMP%"
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0select_branch.ps1"
set "PS_EXIT=%ERRORLEVEL%"

if %PS_EXIT% neq 0 (
    echo.
    echo [Cancelled] No branch/version selected.
    pause
    exit /b 0
)

if not exist "%BRANCH_TEMP%" (
    echo [ERROR] Branch result file not created.
    pause
    exit /b 1
)
if not exist "%VERSION_TEMP%" (
    echo [ERROR] Version result file not created.
    pause
    exit /b 1
)

set /p BRANCH=<"%BRANCH_TEMP%"
set /p VERSION=<"%VERSION_TEMP%"
del "%BRANCH_TEMP%"  2>nul
del "%VERSION_TEMP%" 2>nul

if "%BRANCH%"=="" (
    echo [ERROR] No branch returned from selector.
    pause
    exit /b 1
)

echo.
echo Selected branch : %BRANCH%
echo Selected version: %VERSION%
echo.

rem -- Apply version to paths --
set "DEST_DIR=%PROJECT_ROOT%\nexacrolib\nexacrolib"
set "GENERATERULE_SRC2=%SOURCE_DIR%\Tools\Lib\TiGenerateLib\Template\24"
echo   Version  : %VERSION%
echo.

rem -- Step 1: git checkout and pull --
echo [1/3] Updating source repository...
echo   Repo  : %SOURCE_DIR%
echo   Branch: %BRANCH%
pushd "%SOURCE_DIR%"

git checkout "%BRANCH%"
if %ERRORLEVEL% neq 0 (
    echo [ERROR] git checkout failed for branch: %BRANCH%
    popd
    pause
    exit /b %ERRORLEVEL%
)

git pull origin "%BRANCH%"
if %ERRORLEVEL% neq 0 (
    echo [ERROR] git pull failed for branch: %BRANCH%
    popd
    pause
    exit /b %ERRORLEVEL%
)

for /f %%H in ('git rev-parse HEAD') do set "COMMIT_HASH=%%H"
popd
echo [DONE] Branch: %BRANCH% / Commit: %COMMIT_HASH%

rem -- Pre-Step: Clean nexacrolib folder --
echo.
echo [Pre] Cleaning: %PROJECT_ROOT%\nexacrolib
if exist "%PROJECT_ROOT%\nexacrolib\" (
    rd /S /Q "%PROJECT_ROOT%\nexacrolib"
    if %ERRORLEVEL% neq 0 (
        echo [ERROR] Failed to delete nexacrolib folder.
        pause
        exit /b %ERRORLEVEL%
    )
    echo [DONE] nexacrolib folder deleted.
) else (
    echo [INFO] nexacrolib folder not found, skipping.
)

rem -- Step 2: Copy framework files --
echo.
echo [2/3] Copying framework files...
echo   FROM: %FRAMEWORK_SRC%
echo   TO  : %DEST_DIR%

if not exist "%FRAMEWORK_SRC%\" (
    echo [ERROR] FRAMEWORK_SRC not found: %FRAMEWORK_SRC%
    pause
    exit /b 1
)
if not exist "%DEST_DIR%" mkdir "%DEST_DIR%"

for %%F in (component framework resources) do (
    if exist "%FRAMEWORK_SRC%\%%F\" (
        echo   Copying %%F ...
        xcopy /E /Y /I /Q "%FRAMEWORK_SRC%\%%F" "%DEST_DIR%\%%F\"
        if %ERRORLEVEL% neq 0 (
            echo [ERROR] Framework copy failed: %%F
            pause
            exit /b %ERRORLEVEL%
        )
    ) else (
        echo [WARN] Folder not found, skipping: %FRAMEWORK_SRC%\%%F
    )
)
echo [DONE] Framework files copied.

rem -- Step 3: Copy GenerateRule files --
echo.
echo [3/3] Copying GenerateRule files...
echo   SRC1: %GENERATERULE_SRC1%
echo   SRC2: %GENERATERULE_SRC2%
echo   TO  : %GENERATERULE_DEST%

if not exist "%GENERATERULE_DEST%" mkdir "%GENERATERULE_DEST%"

if exist "%GENERATERULE_SRC1%\" (
    xcopy /E /Y /I /Q "%GENERATERULE_SRC1%" "%GENERATERULE_DEST%"
    if %ERRORLEVEL% neq 0 (
        echo [ERROR] GenerateRule SRC1 copy failed.
        pause
        exit /b %ERRORLEVEL%
    )
) else (
    echo [WARN] GENERATERULE_SRC1 not found, skipping.
)

if "%VERSION%"=="v24" (
    if exist "%GENERATERULE_SRC2%\" (
        xcopy /E /Y /I /Q "%GENERATERULE_SRC2%" "%GENERATERULE_DEST%"
        if %ERRORLEVEL% neq 0 (
            echo [ERROR] GenerateRule SRC2 copy failed.
            pause
            exit /b %ERRORLEVEL%
        )
    ) else (
        echo [WARN] GENERATERULE_SRC2 not found, skipping.
    )
) else (
    echo [INFO] v21 selected - GENERATERULE_SRC2 skipped.
)
echo [DONE] GenerateRule files copied.

echo.
echo ==========================================
echo  All steps completed successfully.
echo  Branch : %BRANCH%
echo  Commit : %COMMIT_HASH%
echo ==========================================
endlocal
pause
