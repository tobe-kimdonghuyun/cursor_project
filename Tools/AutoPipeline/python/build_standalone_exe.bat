@echo off
rem ============================================================
rem  build_standalone_exe.bat - compile auto_pipeline_standalone.bat -> auto_pipeline_standalone.exe
rem
rem  1) auto_pipeline_standalone.bat 에서 __PS_BEGIN__ 라벨 이후 PS 섹션을 추출
rem     (주의: 이 파일의 rem 주석에 콜론+라벨명을 붙여 쓰면 아래 추출이 주석을 라벨로 오인함)
rem  2) exe 실행 시 동작하도록 세 군데 패치:
rem       $env:AP_ARGS   -> $args
rem       $env:AP_BATDIR -> $_dir  (exe 위치 폴더)
rem       $env:AP_SELF   -> $_self (exe 전체 경로)
rem  3) ps2exe 로 컴파일
rem
rem  Requires: ps2exe module (auto-installed if missing)
rem  Output:   ..\auto_pipeline_standalone.exe
rem ============================================================
setlocal
set "AP_SELF=%~f0"
set "AP_SRC=%~dp0..\auto_pipeline_standalone.bat"
set "AP_TMP=%~dp0build\_standalone_tmp.ps1"
set "AP_OUT=%~dp0..\auto_pipeline_standalone.exe"
if not exist "%~dp0build" mkdir "%~dp0build"

powershell -NoProfile -ExecutionPolicy Bypass -Command "$s=[IO.File]::ReadAllText($env:AP_SELF); $m=':__PS_'+'BEGIN__'; $i=$s.IndexOf($m); if ($i -lt 0) { Write-Host '[ERROR] PS section not found'; exit 2 }; & ([scriptblock]::Create($s.Substring($i + $m.Length)))"
set "_RC=%ERRORLEVEL%"
endlocal & exit /b %_RC%

rem ---- PowerShell section ---- cmd never reaches here (exit /b above) ----
:__PS_BEGIN__
$src = $env:AP_SRC
$tmp = $env:AP_TMP
$out = $env:AP_OUT

if (-not (Test-Path $src)) { Write-Host "[ERROR] 소스 파일 없음: $src"; exit 1 }

# ----------------------------------------------------------------
# 1) standalone.bat 에서 PS 섹션 추출
# ----------------------------------------------------------------
$raw     = [IO.File]::ReadAllText($src)
$marker  = ':__PS_' + 'BEGIN__'   # 자기 자신의 라벨과 구분하기 위해 분리
$idx     = $raw.IndexOf($marker)
if ($idx -lt 0) { Write-Host '[ERROR] :__PS_BEGIN__ 라벨을 standalone.bat 에서 찾을 수 없음'; exit 2 }
$ps = $raw.Substring($idx + $marker.Length).TrimStart("`r", "`n")

# ----------------------------------------------------------------
# 2) exe 실행 환경 패치
#    standalone.bat 는 bat runner 가 AP_ARGS/AP_SELF/AP_BATDIR 를 env 에 주입하지만
#    ps2exe exe 에서는 인수가 $args 로, 경로 정보는 MyInvocation 으로 가져와야 함
# ----------------------------------------------------------------

# Patch A: 파일 상단에 exe 자신의 경로/디렉터리 변수를 주입
$header = @'
# ---- Patched for exe: self-path (injected by build_standalone_exe.bat) ----
$_self = $MyInvocation.MyCommand.Path
$_dir  = Split-Path $_self -Parent
# --------------------------------------------------------------------------
'@
$ps = $header + "`r`n" + $ps

# Patch B: 인수 파싱 — $env:AP_ARGS -> $args
$ps = $ps -replace '(?m)^\$argList\s*=\s*@\(.*AP_ARGS.*\)$', '$$argList = @($$args)'

# Patch C: 런타임 경로 env 변수 대체
$ps = $ps -replace [regex]::Escape('$env:AP_BATDIR'), '$$_dir'
$ps = $ps -replace [regex]::Escape('$env:AP_SELF'),   '$$_self'

[IO.File]::WriteAllText($tmp, $ps, [Text.Encoding]::UTF8)
Write-Host "[INFO] PS 섹션 추출+패치 완료: $tmp"

# ----------------------------------------------------------------
# 3) ps2exe 로 컴파일
# ----------------------------------------------------------------
if (-not (Get-Module -ListAvailable ps2exe)) {
    Write-Host '[INFO] ps2exe 모듈을 설치합니다...'
    try {
        Install-Module ps2exe -Scope CurrentUser -Force -ErrorAction Stop
    } catch {
        Write-Host "[ERROR] ps2exe 설치 실패: $_"
        Remove-Item $tmp -ErrorAction SilentlyContinue
        exit 1
    }
}

try { Import-Module ps2exe -ErrorAction Stop }
catch {
    Write-Host "[ERROR] ps2exe 로드 실패: $_"
    Remove-Item $tmp -ErrorAction SilentlyContinue
    exit 1
}

if (Test-Path $out) { Remove-Item $out -Force; Write-Host "[INFO] 기존 exe 삭제: $out" }

Write-Host "[INFO] 컴파일 중 -> $out"
try {
    Invoke-ps2exe -inputFile $tmp -outputFile $out -ErrorAction Stop
    Write-Host "[DONE] $out"
} catch {
    Write-Host "[ERROR] ps2exe 컴파일 실패: $_"
    exit 1
} finally {
    Remove-Item $tmp -ErrorAction SilentlyContinue
}
