@echo off
rem ============================================================
rem  build_all_exe.bat - AutoPipeline 전체 exe 빌드
rem
rem  출력:
rem    auto_pipeline_py.exe         <- auto_pipeline.py   (Nuitka)
rem    auto_pipeline.exe            <- auto_pipeline.ps1  (ps2exe)
rem    auto_pipeline_standalone.exe <- auto_pipeline_standalone.bat (ps2exe)
rem
rem  사용법: build_all_exe.bat [py] [ps1] [standalone]
rem           인수 없으면 전체 빌드
rem ============================================================
setlocal
set "_HERE=%~dp0"
set "_BUILD_PY=1"
set "_BUILD_PS1=1"
set "_BUILD_SA=1"

if "%~1"=="" goto run
set "_BUILD_PY=0"
set "_BUILD_PS1=0"
set "_BUILD_SA=0"

:parse
if "%~1"=="" goto run
if /i "%~1"=="py"         set "_BUILD_PY=1"
if /i "%~1"=="ps1"        set "_BUILD_PS1=1"
if /i "%~1"=="standalone" set "_BUILD_SA=1"
shift & goto parse

:run
echo ============================================================
echo  AutoPipeline EXE 빌드
echo ============================================================

if "%_BUILD_PY%"=="1" (
    echo.
    echo [1/3] Python ^(Nuitka^) 빌드: auto_pipeline_py.exe
    call "%_HERE%build_exe.bat"
    if errorlevel 1 ( echo [FAIL] Python 빌드 실패 & exit /b 1 )
)

if "%_BUILD_PS1%"=="1" (
    echo.
    echo [2/3] PS1 ^(ps2exe^) 빌드: auto_pipeline.exe
    call "%_HERE%build_ps1_exe.bat"
    if errorlevel 1 ( echo [FAIL] PS1 빌드 실패 & exit /b 1 )
)

if "%_BUILD_SA%"=="1" (
    echo.
    echo [3/3] Standalone ^(ps2exe^) 빌드: auto_pipeline_standalone.exe
    call "%_HERE%build_standalone_exe.bat"
    if errorlevel 1 ( echo [FAIL] Standalone 빌드 실패 & exit /b 1 )
)

echo.
echo ============================================================
echo  빌드 완료
echo ============================================================
if exist "%_HERE%..\auto_pipeline_py.exe"         echo   auto_pipeline_py.exe
if exist "%_HERE%..\auto_pipeline.exe"            echo   auto_pipeline.exe
if exist "%_HERE%..\auto_pipeline_standalone.exe" echo   auto_pipeline_standalone.exe
endlocal