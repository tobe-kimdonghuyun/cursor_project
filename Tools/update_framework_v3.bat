@echo off
chcp 65001 > nul
setlocal enabledelayedexpansion

rem ============================================================
rem  update_framework_v3.bat
rem  Usage: update_framework_v3.bat <branch> [-version <val>] [-ignore] [-help]
rem
rem  Options:
rem    <branch>          Branch to checkout. Prompted if omitted.
rem    -version <val>    Replace "version" in all JSON files under nexacrolib.
rem    -ignore           Skip [5/5] zip step.
rem    -help             Show help and exit.
rem ============================================================

rem -- Parse arguments --
set "BRANCH="
set "VERSION_VAL="
set "SKIP_ZIP=0"
set "SHOW_HELP=0"

:parse_args
if "%~1"=="" goto end_parse
set "_ARG=%~1"
if /i "%_ARG%"=="-help"    ( set "SHOW_HELP=1"          & shift & goto parse_args )
if /i "%_ARG%"=="-version" ( set "VERSION_VAL=%~2"      & shift & shift & goto parse_args )
if /i "%_ARG%"=="-ignore"  ( set "SKIP_ZIP=1"           & shift & goto parse_args )
if "%BRANCH%"==""          ( set "BRANCH=%~1" )
shift
goto parse_args
:end_parse

rem -- Help --
if %SHOW_HELP%==1 (
    echo.
    echo  Usage: update_framework_v3.bat ^<branch^> [-version ^<val^>] [-ignore] [-help]
    echo.
    echo  Options:
    echo    ^<branch^>          Branch to checkout. Prompted if omitted.
    echo    -version ^<val^>    Replace "version" in all JSON files under nexacrolib.
    echo    -ignore           Skip [5/5] zip step.
    echo    -help             Show this help and exit.
    echo.
    echo  Examples:
    echo    update_framework_v3.bat main
    echo    update_framework_v3.bat main -version "24.0.0.1031"
    echo    update_framework_v3.bat main -ignore
    echo    update_framework_v3.bat main -version "24.0.0.1031" -ignore
    echo.
    pause
    exit /b 0
)

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
    echo         Please check SourceDir in deploy_config.txt
    pause
    exit /b 1
)

rem -- Prompt branch if not provided --
if "%BRANCH%"=="" set /p BRANCH="Enter branch name: "
if "%BRANCH%"=="" (
    echo [ERROR] No branch name provided.
    pause
    exit /b 1
)

rem -- Set paths --
set "PROJECT_ROOT=%~dp0.."
set "FRAMEWORK_SRC=%SOURCE_DIR%\Lib\FrameworkJS"
set "DEST_DIR=%PROJECT_ROOT%\nexacrolib\nexacrolib"
set "GENERATERULE_SRC1=%SOURCE_DIR%\Tools\Lib\TiMetainfoLib\res"
set "GENERATERULE_SRC2=%SOURCE_DIR%\Tools\Lib\TiGenerateLib\Template\24"
set "GENERATERULE_DEST=%PROJECT_ROOT%\nexacrolib\generate"

echo.
echo ==========================================
echo  update_framework_v3.bat
echo ==========================================
echo  Repository : %SOURCE_DIR%
echo  Branch     : %BRANCH%
if not "%VERSION_VAL%"=="" echo  Version    : %VERSION_VAL%
if %SKIP_ZIP%==1            echo  Zip        : skipped (-ignore)
echo ==========================================
echo.

rem ============================================================
rem [1/5] Update source repository
rem ============================================================
echo [1/5] Updating source repository...
echo   Repo  : %SOURCE_DIR%
echo   Branch: %BRANCH%
pushd "%SOURCE_DIR%"

git checkout "%BRANCH%"
if %ERRORLEVEL% neq 0 (
    echo [ERROR] git checkout failed: %BRANCH%
    popd & pause & exit /b %ERRORLEVEL%
)

git pull origin "%BRANCH%"
if %ERRORLEVEL% neq 0 (
    echo [ERROR] git pull failed: %BRANCH%
    popd & pause & exit /b %ERRORLEVEL%
)

for /f %%H in ('git rev-parse HEAD') do set "COMMIT_HASH=%%H"
popd

rem -- Get commit message via PowerShell (avoids %s expansion issue in BAT) --
set "MSG_TEMP=%TEMP%\_update_fw_msg.tmp"
if exist "%MSG_TEMP%" del "%MSG_TEMP%"
powershell -NoProfile -Command "git -C '%SOURCE_DIR%' log -1 '--format=%%s' | Out-File '%MSG_TEMP%' -Encoding UTF8 -NoNewline" 2>nul
set "COMMIT_MSG=(unknown)"
if exist "%MSG_TEMP%" (
    set /p COMMIT_MSG=<"%MSG_TEMP%"
    del "%MSG_TEMP%" 2>nul
)

echo [DONE] Hash: %COMMIT_HASH%
echo        Msg : %COMMIT_MSG%
echo.

rem ============================================================
rem [Pre] Clean nexacrolib folder
rem ============================================================
echo [Pre] Cleaning %PROJECT_ROOT%\nexacrolib ...
if exist "%PROJECT_ROOT%\nexacrolib\" (
    rd /S /Q "%PROJECT_ROOT%\nexacrolib"
    if %ERRORLEVEL% neq 0 (
        echo [ERROR] Failed to delete nexacrolib folder.
        pause & exit /b %ERRORLEVEL%
    )
    echo [DONE] nexacrolib folder deleted.
) else (
    echo [INFO] nexacrolib folder not found, skipping.
)
echo.

rem ============================================================
rem [2/5] Copy framework files
rem ============================================================
echo [2/5] Copying framework files...
echo   FROM: %FRAMEWORK_SRC%
echo   TO  : %DEST_DIR%

if not exist "%FRAMEWORK_SRC%\" (
    echo [ERROR] FRAMEWORK_SRC not found: %FRAMEWORK_SRC%
    pause & exit /b 1
)
if not exist "%DEST_DIR%" mkdir "%DEST_DIR%"

for %%F in (component framework resources) do (
    if exist "%FRAMEWORK_SRC%\%%F\" (
        echo   Copying %%F ...
        xcopy /E /Y /I /Q "%FRAMEWORK_SRC%\%%F" "%DEST_DIR%\%%F\"
        if %ERRORLEVEL% neq 0 (
            echo [ERROR] Framework copy failed: %%F
            pause & exit /b %ERRORLEVEL%
        )
    ) else (
        echo [WARN] Folder not found, skipping: %%F
    )
)

if exist "%FRAMEWORK_SRC%\nexacrolib.json" (
    echo   Copying nexacrolib.json ...
    copy /Y "%FRAMEWORK_SRC%\nexacrolib.json" "%DEST_DIR%\nexacrolib.json" > nul
    if %ERRORLEVEL% neq 0 (
        echo [ERROR] nexacrolib.json copy failed.
        pause & exit /b %ERRORLEVEL%
    )
) else (
    echo [WARN] nexacrolib.json not found, skipping.
)
echo [DONE] Framework files copied.
echo.

rem ============================================================
rem [Version] Update JSON version values (optional)
rem ============================================================
if not "%VERSION_VAL%"=="" (
    echo [Ver] Updating version to: %VERSION_VAL%
    set "PSVER_DEST=%DEST_DIR%"
    set "PSVER_VALUE=%VERSION_VAL%"
    powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0update_version.ps1"
    if %ERRORLEVEL% neq 0 (
        echo [ERROR] update_version.ps1 failed.
        pause & exit /b %ERRORLEVEL%
    )
    echo [DONE] Version updated.
    echo.
)

rem ============================================================
rem [3/5] Convert JS files to UTF-8 BOM
rem ============================================================
echo [3/5] Converting JS files to UTF-8 BOM...
set "PSBOM_DEST=%DEST_DIR%"
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0convert_utf8bom.ps1"
if %ERRORLEVEL% neq 0 (
    echo [ERROR] convert_utf8bom.ps1 failed.
    pause & exit /b %ERRORLEVEL%
)
echo [DONE] UTF-8 BOM conversion done.
echo.

rem ============================================================
rem [4/5] Copy Generate Rule files
rem ============================================================
echo [4/5] Copying Generate Rule files...

rem -- Determine version prefix (24 or 21) --
set "VER_PREFIX="
set "NEXACRO_VER="
if not "%VERSION_VAL%"=="" (
    set "VER_PREFIX=%VERSION_VAL:~0,2%"
    set "NEXACRO_VER=%VERSION_VAL%"
) else (
    rem Read version from nexacrolib.json via get_version.ps1
    set "VER_TEMP=%TEMP%\_update_fw_ver.tmp"
    if exist "%VER_TEMP%" del "%VER_TEMP%"
    set "PSVERGET_JSON=%DEST_DIR%\nexacrolib.json"
    set "PSVERGET_OUT=%VER_TEMP%"
    powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0get_version.ps1"
    if exist "%VER_TEMP%" (
        set /p NEXACRO_VER=<"%VER_TEMP%"
        del "%VER_TEMP%" 2>nul
        set "VER_PREFIX=!NEXACRO_VER:~0,2!"
    ) else (
        set "VER_PREFIX=24"
        set "NEXACRO_VER="
        echo [WARN] Could not read version from nexacrolib.json. Defaulting to 24.
    )
)

echo   Version prefix: %VER_PREFIX%
echo   TO: %GENERATERULE_DEST%

if exist "%GENERATERULE_DEST%" rd /S /Q "%GENERATERULE_DEST%"
mkdir "%GENERATERULE_DEST%"

rem -- SRC1: always copied --
if exist "%GENERATERULE_SRC1%\" (
    echo   Copying TiMetainfoLib\res ...
    xcopy /E /Y /I /Q "%GENERATERULE_SRC1%" "%GENERATERULE_DEST%\"
    if %ERRORLEVEL% neq 0 (
        echo [ERROR] GENERATERULE_SRC1 copy failed.
        pause & exit /b %ERRORLEVEL%
    )
) else (
    echo [WARN] GENERATERULE_SRC1 not found, skipping.
)

rem -- SRC2: only if version prefix is 24 --
if "%VER_PREFIX%"=="24" (
    if exist "%GENERATERULE_SRC2%\" (
        echo   Copying TiGenerateLib\Template\24 ...
        xcopy /E /Y /I /Q "%GENERATERULE_SRC2%" "%GENERATERULE_DEST%\"
        if %ERRORLEVEL% neq 0 (
            echo [ERROR] GENERATERULE_SRC2 copy failed.
            pause & exit /b %ERRORLEVEL%
        )
    ) else (
        echo [WARN] GENERATERULE_SRC2 not found, skipping.
    )
) else (
    echo [INFO] v21 selected - TiGenerateLib\Template\24 skipped.
)
echo [DONE] Generate Rule files copied.
echo.

rem ============================================================
rem [5/5] Zip archive (optional)
rem ============================================================
if %SKIP_ZIP%==1 (
    echo [5/5] Zip skipped ^(-ignore^).
    echo.
    goto done
)

echo [5/5] Creating zip archive...

rem -- Resolve zip version string --
set "ZIP_VER=%NEXACRO_VER%"
if "%ZIP_VER%"=="" (
    rem Try reading once more
    set "VER_TEMP2=%TEMP%\_update_fw_ver2.tmp"
    if exist "%VER_TEMP2%" del "%VER_TEMP2%"
    set "PSVERGET_JSON=%DEST_DIR%\nexacrolib.json"
    set "PSVERGET_OUT=%VER_TEMP2%"
    powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0get_version.ps1" 2>nul
    if exist "%VER_TEMP2%" (
        set /p ZIP_VER=<"%VER_TEMP2%"
        del "%VER_TEMP2%" 2>nul
    )
)

set "ZIP_BASE=%PROJECT_ROOT%\nexacrolib\nexacrolib_noMerge_noCompress_noShrink"
if not "%ZIP_VER%"=="" (
    set "ZIP_FILE=%ZIP_BASE%(%ZIP_VER%).zip"
) else (
    set "ZIP_FILE=%ZIP_BASE%.zip"
)

echo   Output: %ZIP_FILE%
if exist "%ZIP_FILE%" del "%ZIP_FILE%"

powershell -NoProfile -ExecutionPolicy Bypass -Command ^
    "$src = @('%DEST_DIR%', '%GENERATERULE_DEST%'); Compress-Archive -Path $src -DestinationPath '%ZIP_FILE%' -Force"

if %ERRORLEVEL% neq 0 (
    echo [ERROR] Zip failed.
    pause & exit /b %ERRORLEVEL%
)
echo [DONE] Zip created: %ZIP_FILE%
echo.

:done
echo ==========================================
echo  [SUCCESS] All steps completed.
echo   Branch  : %BRANCH%
echo   Hash    : %COMMIT_HASH%
echo   Message : %COMMIT_MSG%
if not "%VERSION_VAL%"=="" echo   Version : %VERSION_VAL%
echo ==========================================
endlocal
pause
