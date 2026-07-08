param()

$PROJECT_ROOT  = Split-Path -Parent $PSScriptRoot
$TOMCAT_HOME   = Join-Path $PROJECT_ROOT "apache-tomcat-10.1.55"
$CATALINA_BAT  = Join-Path $TOMCAT_HOME  "bin\catalina.bat"
$JAVA_HOME_VAL = "C:\microsoft-jdk-21.0.9-windows-x64\jdk-21.0.9+10"
$PORT          = 7070
$LOG_FILE      = Join-Path $TOMCAT_HOME "logs\catalina.$(Get-Date -Format 'yyyy-MM-dd').log"

$SEP = "=============================================="

$isRunning = netstat -ano 2>$null | Select-String ":$PORT .*LISTENING"

if ($isRunning) {
    Write-Host "[Tomcat] Running  ->  http://localhost:$PORT"
    exit 0
}

Write-Host ""
Write-Host $SEP
Write-Host "  [START] Tomcat auto-start (port $PORT)"
Write-Host $SEP
Write-Host "  CATALINA_HOME : $TOMCAT_HOME"
Write-Host "  JAVA_HOME     : $JAVA_HOME_VAL"
Write-Host "  CMD           : catalina.bat run"
Write-Host "  LOG           : $LOG_FILE"
Write-Host ""
Write-Host "  Waiting for startup (max 6 sec)..."

# 현재 셸 환경변수 설정 후 새 창 없이 백그라운드 기동
$env:JAVA_HOME     = $JAVA_HOME_VAL
$env:JRE_HOME      = $JAVA_HOME_VAL
$env:CATALINA_HOME = $TOMCAT_HOME
$env:Path          = "$JAVA_HOME_VAL\bin;$env:Path"
& "$CATALINA_BAT" start

$started = $false
for ($i = 1; $i -le 6; $i++) {
    Start-Sleep -Seconds 1
    if (netstat -ano 2>$null | Select-String ":$PORT .*LISTENING") {
        $started = $true
        break
    }
    Write-Host "  [$i/6] waiting..."
}

if (Test-Path $LOG_FILE) {
    Write-Host ""
    Write-Host "+-- catalina log (last 20 lines) ----------------"
    Get-Content $LOG_FILE -Tail 20 -Encoding UTF8 | ForEach-Object { Write-Host "|  $_" }
    Write-Host "+-------------------------------------------------"
}

Write-Host ""
if ($started) {
    Write-Host "  [OK] Tomcat started  ->  http://localhost:$PORT"
} else {
    Write-Host "  [FAIL] Tomcat did not start. Check log above."
}
Write-Host $SEP
Write-Host ""
