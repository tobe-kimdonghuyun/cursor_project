@echo off
rem ============================================================
rem  build_exe.bat - compile auto_pipeline.py to a single native exe with Nuitka
rem
rem  Nuitka translates the Python code to C and compiles it, so the exe has no .py / .pyc
rem  (unpacking the exe does not reveal the source). Docstrings and asserts are stripped.
rem  First build downloads MinGW64 automatically (about 300MB, once).
rem
rem  Output: build\auto_pipeline.exe, then copied to ..\auto_pipeline.exe (next to pipeline_*.txt)
rem ============================================================
setlocal
set "_HERE=%~dp0"
set "_PY=%LOCALAPPDATA%\Programs\Python\Python312\python.exe"
if not exist "%_PY%" set "_PY=python"

"%_PY%" -m nuitka --version >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Nuitka not found. Run: "%_PY%" -m pip install nuitka ordered-set zstandard
    exit /b 1
)

pushd "%_HERE%"
"%_PY%" -m nuitka ^
    --onefile ^
    --mingw64 ^
    --assume-yes-for-downloads ^
    --python-flag=no_docstrings,no_asserts ^
    --windows-console-mode=force ^
    --output-dir=build ^
    --output-filename=auto_pipeline.exe ^
    --remove-output ^
    --company-name=TOBESOFT ^
    --product-name=AutoPipeline ^
    --file-description="Nexacro AutoPipeline" ^
    --file-version=1.0.0.0 ^
    --product-version=1.0.0.0 ^
    auto_pipeline.py
set "_RC=%ERRORLEVEL%"
popd
if not "%_RC%"=="0" (
    echo [ERROR] Nuitka build failed ^(%_RC%^)
    exit /b %_RC%
)

copy /Y "%_HERE%build\auto_pipeline.exe" "%_HERE%..\auto_pipeline.exe" >nul
echo [DONE] %_HERE%..\auto_pipeline.exe
endlocal
