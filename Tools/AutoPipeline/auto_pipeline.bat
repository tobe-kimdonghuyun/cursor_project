@echo off
rem ============================================================
rem  auto_pipeline.bat - wrapper for auto_pipeline.ps1
rem  Usage: auto_pipeline.bat [v21^|v24^|all] [-UpdateJar] [-SkipGit] [-OnlyIfChanged] [-OpenBrowser^|-NoBrowser] [-DevTools]
rem ============================================================
setlocal
rem capture before shift: shift also moves %0
set "_PS1=%~dp0auto_pipeline.ps1"
set "_TARGET=%~1"
if "%_TARGET%"=="" set "_TARGET=all"
if /i not "%_TARGET:~0,1%"=="-" shift
if /i "%_TARGET:~0,1%"=="-" set "_TARGET=all"

set "_OPTS="
:parse_args
if "%~1"=="" goto run
set "_OPTS=%_OPTS% %~1"
shift
goto parse_args

:run
powershell -NoProfile -ExecutionPolicy Bypass -File "%_PS1%" -Target %_TARGET%%_OPTS%
set "_RC=%ERRORLEVEL%"
endlocal & exit /b %_RC%
