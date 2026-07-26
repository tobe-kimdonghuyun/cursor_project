@echo off
setlocal
set "PSJAR_DIR=%~dp0..\deploy_jar\nexacroN"
pushd %~dp0
powershell -NoProfile -ExecutionPolicy Bypass -File update_jar.ps1
if %ERRORLEVEL% NEQ 0 ( echo. & echo [Error] Task failed. ) else ( echo. & echo [Done] All tasks completed successfully. )
popd
