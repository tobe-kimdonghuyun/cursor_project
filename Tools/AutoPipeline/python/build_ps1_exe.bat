@echo off
rem ============================================================
rem  build_ps1_exe.bat - compile auto_pipeline.ps1 -> auto_pipeline.exe with ps2exe
rem
rem  Requires: ps2exe module (auto-installed if missing)
rem    Install-Module -Name ps2exe -Scope CurrentUser
rem
rem  Output: ..\auto_pipeline.exe
rem ============================================================
setlocal
set "AP_SELF=%~f0"
set "AP_IN=%~dp0..\auto_pipeline.ps1"
set "AP_OUT=%~dp0..\auto_pipeline.exe"

powershell -NoProfile -ExecutionPolicy Bypass -Command "$s=[IO.File]::ReadAllText($env:AP_SELF); $m=':__PS_'+'BEGIN__'; $i=$s.IndexOf($m); if ($i -lt 0) { Write-Host '[ERROR] PS section not found'; exit 2 }; & ([scriptblock]::Create($s.Substring($i + $m.Length)))"
set "_RC=%ERRORLEVEL%"
endlocal & exit /b %_RC%

rem ---- PowerShell section ---- cmd never reaches here (exit /b above) ----
:__PS_BEGIN__
$in  = $env:AP_IN
$out = $env:AP_OUT

# ps2exe 모듈 확인 및 자동 설치
if (-not (Get-Module -ListAvailable ps2exe)) {
    Write-Host '[INFO] ps2exe 모듈을 설치합니다...'
    try {
        Install-Module ps2exe -Scope CurrentUser -Force -ErrorAction Stop
    } catch {
        Write-Host "[ERROR] ps2exe 설치 실패: $_"
        exit 1
    }
}

try { Import-Module ps2exe -ErrorAction Stop }
catch { Write-Host "[ERROR] ps2exe 로드 실패: $_"; exit 1 }

if (-not (Test-Path $in)) { Write-Host "[ERROR] 입력 파일 없음: $in"; exit 1 }

Write-Host "[INFO] 컴파일 중: $in"
Write-Host "[INFO] 출력 경로: $out"

try {
    Invoke-ps2exe -inputFile $in -outputFile $out -ErrorAction Stop
    Write-Host "[DONE] $out"
} catch {
    Write-Host "[ERROR] ps2exe 컴파일 실패: $_"
    exit 1
}
