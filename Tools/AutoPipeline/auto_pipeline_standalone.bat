@echo off
rem ============================================================
rem  auto_pipeline_standalone.bat
rem  Single-file AutoPipeline: this bat contains the whole PowerShell pipeline.
rem  The bat can be copied/moved anywhere; it finds the config folder below.
rem
rem  Usage:
rem    auto_pipeline_standalone.bat [v21^|v24^|all] [-UpdateJar] [-SkipGit] [-OnlyIfChanged]
rem                                 [-OpenBrowser^|-NoBrowser] [-DevTools] [-Help]
rem
rem  PIPELINE_HOME : folder that holds pipeline_v21.txt / pipeline_v24.txt.
rem                  logs\ and work\ are created there.
rem                  If it has no pipeline_*.txt, this bat's own folder is used instead.
rem ============================================================
setlocal
set "PIPELINE_HOME=D:\git\cursor_project\Tools\AutoPipeline"

set "AP_SELF=%~f0"
set "AP_BATDIR=%~dp0"
set "AP_ARGS=%*"
powershell -NoProfile -ExecutionPolicy Bypass -Command "$s=[IO.File]::ReadAllText($env:AP_SELF); $m=':__PS_'+'BEGIN__'; $i=$s.IndexOf($m); if ($i -lt 0) { Write-Host '[ERROR] PowerShell section not found'; exit 2 }; & ([scriptblock]::Create($s.Substring($i + $m.Length)))"
set "_RC=%ERRORLEVEL%"
endlocal & exit /b %_RC%

rem ---- Everything below is PowerShell. cmd never reaches here (exit /b above). ----
:__PS_BEGIN__
# ============================================================
#  PowerShell section of auto_pipeline_standalone.bat
#  Same pipeline as auto_pipeline.ps1:
#  [jar] engine update -> Git pull -> nexacrolib build-up -> Nexacro deploy -> Tomcat publish -> Chrome
# ============================================================

# ---- Arguments (parsed from %*, since a scriptblock run this way has no param() binding) ----
$Target = 'all'
$UpdateJar = $false; $SkipGit = $false; $OnlyIfChanged = $false
$OpenBrowser = $false; $NoBrowser = $false; $DevTools = $false
$argList = @("$env:AP_ARGS".Trim() -split '\s+' | Where-Object { $_ })
for ($k = 0; $k -lt $argList.Count; $k++) {
    $a = $argList[$k].Trim('"')
    switch -Regex ($a.ToLower()) {
        '^(v21|v24|all)$'   { $Target = $Matches[1]; break }
        '^-target$'         { $k++; $Target = "$($argList[$k])".Trim('"').ToLower(); break }
        '^-updatejar$'      { $UpdateJar = $true; break }
        '^-skipgit$'        { $SkipGit = $true; break }
        '^-onlyifchanged$'  { $OnlyIfChanged = $true; break }
        '^-openbrowser$'    { $OpenBrowser = $true; break }
        '^-nobrowser$'      { $NoBrowser = $true; break }
        '^-devtools$'       { $DevTools = $true; break }
        '^(-help|-h|/\?)$'  {
            Write-Host 'Usage: auto_pipeline_standalone.bat [v21|v24|all] [-UpdateJar] [-SkipGit] [-OnlyIfChanged]'
            Write-Host '                                    [-OpenBrowser|-NoBrowser] [-DevTools]'
            Write-Host "Config folder (PIPELINE_HOME): $env:PIPELINE_HOME"
            exit 0
        }
        default { Write-Host "[ERROR] Unknown argument: $a  (use -Help)"; exit 2 }
    }
}
if (@('v21', 'v24', 'all') -notcontains $Target) { Write-Host "[ERROR] Invalid target: $Target"; exit 2 }

# ---- Config folder: PIPELINE_HOME, else this bat's folder (first one that has pipeline_*.txt) ----
$ROOT = $null
foreach ($cand in @($env:PIPELINE_HOME, $env:AP_BATDIR)) {
    if (-not $cand) { continue }
    $c = $cand.Trim().TrimEnd('\')
    if ((Test-Path -LiteralPath (Join-Path $c 'pipeline_v21.txt')) -or (Test-Path -LiteralPath (Join-Path $c 'pipeline_v24.txt'))) {
        $ROOT = [IO.Path]::GetFullPath($c); break
    }
}
if (-not $ROOT) {
    Write-Host "[ERROR] pipeline_v21.txt / pipeline_v24.txt not found."
    Write-Host "        Checked PIPELINE_HOME='$env:PIPELINE_HOME' and bat folder='$env:AP_BATDIR'."
    Write-Host "        Edit the 'set PIPELINE_HOME=' line at the top of this bat."
    exit 2
}

$ErrorActionPreference = 'Stop'
$ProgressPreference    = 'SilentlyContinue'   # PS 5.1 progress bar makes downloads/unzip very slow
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
$env:GIT_TERMINAL_PROMPT = '0'   # never block on a credential prompt

$WORK_ROOT = Join-Path $ROOT 'work'
$LOG_DIR   = Join-Path $ROOT 'logs'
New-Item -ItemType Directory -Force -Path $LOG_DIR | Out-Null
$STAMP    = Get-Date -Format 'yyyyMMdd_HHmmss'
$LOG_FILE = Join-Path $LOG_DIR "${STAMP}_$Target.log"
Start-Transcript -Path $LOG_FILE | Out-Null
Write-Host "[INFO] Config folder: $ROOT"
Write-Host "[INFO] Runner      : $env:AP_SELF"

# Deploy JAVA package server (same source as Tools\update_jar.ps1)
$JAR_SERVER = 'http://59.10.169.82:9900'
$JAR_BASE   = "$JAR_SERVER/NexacroN/serverN/Deploy_JAVA/%EB%B6%84%EB%A6%AC_Jar/"

# ============================================================
# Helpers
# ============================================================

# Enabled=N|NO|FALSE|0 turns a target off. Missing / empty / anything else = on.
function Test-Enabled($Cfg) {
    return -not (@('N', 'NO', 'FALSE', '0') -contains "$($Cfg.Enabled)".Trim().ToUpper())
}

function Read-PipelineConfig([string]$Path) {
    if (-not (Test-Path -LiteralPath $Path)) { throw "Config not found: $Path" }
    $cfg = @{ Flags = @() }
    foreach ($line in Get-Content -LiteralPath $Path -Encoding UTF8) {
        $t = $line.Trim()
        if ($t -eq '' -or $t.StartsWith('#')) { continue }
        if ($t.StartsWith('-')) { $cfg.Flags += $t.ToUpper(); continue }
        $i = $t.IndexOf('=')
        if ($i -lt 1) { continue }
        $cfg[$t.Substring(0, $i).Trim()] = $t.Substring($i + 1).Trim().TrimEnd('\')
    }
    # Relative paths are resolved against the folder that holds the config file
    $base = Split-Path -Parent ([IO.Path]::GetFullPath($Path))
    foreach ($key in 'SourceDir', 'ProjectPath', 'WorkDir', 'JarDir', 'TomcatHome', 'JavaHome', 'ChromePath') {
        $v = $cfg[$key]
        if ($v -and -not [IO.Path]::IsPathRooted($v)) { $cfg[$key] = [IO.Path]::GetFullPath((Join-Path $base $v)) }
    }
    $required = 'ExpectedVersion', 'SourceDir', 'Branch', 'ProjectPath', 'WorkDir',
                'JarDir', 'TomcatHome', 'TomcatPort', 'WebContext'
    $missing = $required | Where-Object { -not $cfg[$_] }
    if ($missing) { throw "Missing keys in ${Path}: $($missing -join ', ')" }
    return $cfg
}

# Run a native exe, stream its output into the transcript, return the exit code.
function Invoke-Native([string]$Exe, [string[]]$Arguments) {
    Write-Host "  [CMD] $Exe $($Arguments -join ' ')"
    $prev = $ErrorActionPreference
    $ErrorActionPreference = 'Continue'   # stderr lines must not become terminating errors
    try {
        & $Exe @Arguments 2>&1 | ForEach-Object { Write-Host "    $_" }
        $code = $LASTEXITCODE
    } finally {
        $ErrorActionPreference = $prev
    }
    return $code
}

# Refuse to delete anything outside an allowed root.
function Assert-Under([string]$Path, [string]$Root) {
    $p = [IO.Path]::GetFullPath($Path).TrimEnd('\')
    $r = [IO.Path]::GetFullPath($Root).TrimEnd('\')
    if (-not $p.StartsWith($r + '\', [StringComparison]::OrdinalIgnoreCase)) {
        throw "Refusing to modify '$p' (outside '$r')"
    }
}

function Reset-Dir([string]$Path, [string]$Root) {
    Assert-Under $Path $Root
    if (Test-Path -LiteralPath $Path) { Remove-Item -LiteralPath $Path -Recurse -Force }
    New-Item -ItemType Directory -Force -Path $Path | Out-Null
}

# robocopy wrapper: /E merge copy, or /MIR mirror. Exit codes 0-7 are success.
function Copy-Tree([string]$Src, [string]$Dst, [switch]$Mirror) {
    if (-not (Test-Path -LiteralPath $Src)) { throw "Copy source not found: $Src" }
    $mode = if ($Mirror) { '/MIR' } else { '/E' }
    $prev = $ErrorActionPreference
    $ErrorActionPreference = 'Continue'
    try {
        robocopy $Src $Dst $mode /R:2 /W:1 /NFL /NDL /NJH /NJS /NP | Out-Null
        $code = $LASTEXITCODE
    } finally {
        $ErrorActionPreference = $prev
    }
    if ($code -ge 8) { throw "robocopy failed ($code): $Src -> $Dst" }
}

function Get-NexacroVersion([string]$JsonFile) {
    if (-not (Test-Path -LiteralPath $JsonFile)) { return '' }
    $m = [regex]::Match((Get-Content -LiteralPath $JsonFile -Raw -Encoding UTF8), '"version"\s*:\s*"([^"]+)"')
    if ($m.Success) { return $m.Groups[1].Value }
    return ''
}

function Convert-JsToUtf8Bom([string]$Dir) {
    $count = 0
    $utf8Bom = New-Object System.Text.UTF8Encoding($true)
    foreach ($f in Get-ChildItem -LiteralPath $Dir -Filter '*.js' -Recurse -File) {
        $bytes = [IO.File]::ReadAllBytes($f.FullName)
        if ($bytes.Length -ge 3 -and $bytes[0] -eq 0xEF -and $bytes[1] -eq 0xBB -and $bytes[2] -eq 0xBF) { continue }
        $text = [IO.File]::ReadAllText($f.FullName, [Text.Encoding]::UTF8)
        [IO.File]::WriteAllText($f.FullName, $text, $utf8Bom)
        $count++
    }
    return $count
}

function Find-StartBat([string]$JarDir) {
    if (-not (Test-Path -LiteralPath $JarDir)) { return $null }
    return Get-ChildItem -LiteralPath $JarDir -Filter 'start.bat' -Recurse -File | Select-Object -First 1
}

# Latest package on the server: newest year folder, then the name-descending first zip/jar.
function Get-LatestJarPackage {
    $page  = (Invoke-WebRequest -Uri $JAR_BASE -UseBasicParsing -TimeoutSec 30).Content
    $years = [regex]::Matches($page, 'href="[^"]+/(\d{4})/"', 'IgnoreCase') | ForEach-Object { $_.Groups[1].Value }
    if (-not $years) { throw "No year folders found at $JAR_BASE" }
    $year = $years | Sort-Object -Descending | Select-Object -First 1

    $yearPage = (Invoke-WebRequest -Uri "$JAR_BASE$year/" -UseBasicParsing -TimeoutSec 30).Content
    $hrefs = [regex]::Matches($yearPage, 'href="([^"]+\.(zip|jar))"', 'IgnoreCase') | ForEach-Object { $_.Groups[1].Value }
    if (-not $hrefs) { throw "No zip/jar files found at $JAR_BASE$year/" }
    $href = $hrefs | Sort-Object -Descending | Select-Object -First 1

    return [pscustomobject]@{ Name = [Uri]::UnescapeDataString($href.Split('/')[-1]); Url = "$JAR_SERVER$href" }
}

# Download into a staging folder, verify, then swap into JarDir. The old engine survives any failure.
function Update-DeployJar([string]$JarDir) {
    $marker    = Join-Path $JarDir 'installed_package.txt'
    $installed = if (Test-Path -LiteralPath $marker) { (Get-Content -LiteralPath $marker -Raw).Trim() } else { '' }

    $pkg = Get-LatestJarPackage
    Write-Host "  Server latest : $($pkg.Name)"
    Write-Host "  Installed     : $(if ($installed) { $installed } else { '(none)' })"
    if ((Find-StartBat $JarDir) -and $installed -eq $pkg.Name) {
        Write-Host '  [SKIP] Already up to date'
        return "$($pkg.Name) (up to date)"
    }

    $staging = Join-Path (Split-Path -Parent $JarDir) 'jar_staging'
    Reset-Dir $staging $WORK_ROOT
    $zip    = Join-Path $staging 'download.zip'
    $level1 = Join-Path $staging 'level1'
    $pkgDir = Join-Path $staging 'pkg'

    Write-Host "  Downloading   : $($pkg.Url)"
    Invoke-WebRequest -Uri $pkg.Url -OutFile $zip -UseBasicParsing
    Expand-Archive -LiteralPath $zip -DestinationPath $level1 -Force
    Remove-Item -LiteralPath $zip -Force

    # Packages are often double-zipped: extract nested zips, keep the other files (.json etc.)
    New-Item -ItemType Directory -Force -Path $pkgDir | Out-Null
    foreach ($z in Get-ChildItem -LiteralPath $level1 -Filter '*.zip' -File) {
        Write-Host "  Extracting    : $($z.Name)"
        Expand-Archive -LiteralPath $z.FullName -DestinationPath $pkgDir -Force
    }
    Get-ChildItem -LiteralPath $level1 | Where-Object { $_.Extension -ne '.zip' } | Move-Item -Destination $pkgDir -Force

    if (-not (Find-StartBat $pkgDir)) { throw "Downloaded package has no start.bat: $($pkg.Name)" }

    Reset-Dir $JarDir $WORK_ROOT
    Get-ChildItem -LiteralPath $pkgDir | Move-Item -Destination $JarDir -Force
    Set-Content -LiteralPath $marker -Value $pkg.Name
    Remove-Item -LiteralPath $staging -Recurse -Force
    Write-Host "  Installed -> $JarDir"
    return "$($pkg.Name) (updated)"
}

# IPv4 of the active adapter that has a default gateway (skips loopback / 169.254.x).
function Get-LocalIPv4 {
    $ip = Get-NetIPConfiguration |
          Where-Object { $_.IPv4DefaultGateway -and $_.NetAdapter.Status -eq 'Up' } |
          ForEach-Object { $_.IPv4Address.IPAddress } | Select-Object -First 1
    if (-not $ip) {
        $ip = Get-NetIPAddress -AddressFamily IPv4 |
              Where-Object { $_.IPAddress -notlike '127.*' -and $_.IPAddress -notlike '169.254.*' } |
              Select-Object -First 1 -ExpandProperty IPAddress
    }
    if (-not $ip) { $ip = 'localhost' }
    return $ip
}

function Test-Port([int]$Port) {
    return [bool](Get-NetTCPConnection -LocalPort $Port -State Listen -ErrorAction SilentlyContinue)
}

function Wait-Url([string]$Url, [int]$TimeoutSec) {
    $deadline = (Get-Date).AddSeconds($TimeoutSec)
    while ((Get-Date) -lt $deadline) {
        try {
            $r = Invoke-WebRequest -Uri $Url -UseBasicParsing -TimeoutSec 5
            if ($r.StatusCode -eq 200) { return $true }
        } catch { }
        Start-Sleep -Seconds 2
    }
    return $false
}

function Invoke-Step($Ctx, [string]$Name, [scriptblock]$Body) {
    Write-Host ''
    Write-Host "---- [$($Ctx.Target)] $Name ----"
    $sw = [Diagnostics.Stopwatch]::StartNew()
    & $Body
    $sw.Stop()
    $sec = [math]::Round($sw.Elapsed.TotalSeconds, 1)
    [void]$Ctx.Steps.Add("$Name ${sec}s")
    Write-Host "  [DONE] $Name (${sec}s)"
}

# ============================================================
# Pipeline for one target
# ============================================================

function Invoke-Target($Ctx) {
    $cfgPath = Join-Path $ROOT "pipeline_$($Ctx.Target).txt"
    $cfg = Read-PipelineConfig $cfgPath
    $Ctx.Cfg = $cfg

    if (-not (Test-Enabled $cfg)) {
        Write-Host ''
        Write-Host "---- [$($Ctx.Target)] [SKIP] Enabled=N in $cfgPath ----"
        $Ctx.Status = 'DISABLED'
        return
    }

    # Project name = .xprj file name (e.g. TC_NexaV21). Usable as {Project} in WebContext / PublishSubDir.
    $project = [IO.Path]::GetFileNameWithoutExtension($cfg.ProjectPath)
    $Ctx.Project = $project

    # Chrome: command line switch wins, otherwise OpenBrowser=Y|N in config (default N)
    $Ctx.OpenBrowser = if ($NoBrowser) { $false }
                       elseif ($OpenBrowser) { $true }
                       else { @('Y', 'YES', 'TRUE', '1') -contains "$($cfg.OpenBrowser)".ToUpper() }

    $work      = $cfg.WorkDir
    $libRoot   = Join-Path $work 'nexacrolib'
    $libDir    = Join-Path $libRoot 'nexacrolib'
    $genDir    = Join-Path $libRoot 'generate'
    $outDir    = Join-Path (Join-Path $work 'output') $project
    $deployDir = Join-Path $work 'deploy'
    $hashFile  = Join-Path $work 'last_success_hash.txt'

    # Publish target: webapps\<WebContext>[\<PublishSubDir>]
    $webapps    = Join-Path $cfg.TomcatHome 'webapps'
    $webContext = $cfg.WebContext.Replace('{Project}', $project).Trim('\', '/')
    $subDir     = "$($cfg.PublishSubDir)".Replace('{Project}', $project).Trim('\', '/')
    $pubDir     = Join-Path $webapps $webContext
    if ($subDir) { $pubDir = Join-Path $pubDir $subDir }
    $urlPath    = (@($(if ($webContext -ne 'ROOT') { $webContext }), $subDir) | Where-Object { $_ }) -join '/'
    $urlPath    = $urlPath.Replace('\', '/')
    New-Item -ItemType Directory -Force -Path $work | Out-Null

    # ---- [0] Preflight ----
    Invoke-Step $Ctx '0 Preflight' {
        foreach ($p in $cfg.SourceDir, $cfg.ProjectPath, $cfg.TomcatHome) {
            if (-not (Test-Path -LiteralPath $p)) { throw "Path not found: $p" }
        }
        # The publish folder is deleted before copying, so it must be inside webapps
        # and must not be a whole Tomcat built-in app (a sub folder inside one is fine).
        Assert-Under $pubDir $webapps
        $protected = 'ROOT', 'manager', 'host-manager', 'docs', 'examples'
        if (-not $subDir -and $protected -contains $webContext) {
            throw "Refusing to replace Tomcat built-in app '$webContext'. Set PublishSubDir or another WebContext."
        }

        $javaHome = if ($cfg.JavaHome) { $cfg.JavaHome } else { $env:JAVA_HOME }
        $Ctx.Java = Join-Path $javaHome 'bin\java.exe'
        if (-not (Test-Path -LiteralPath $Ctx.Java)) { throw "java.exe not found: $($Ctx.Java)" }
        $Ctx.JavaHome = $javaHome

        $startBat = Find-StartBat $cfg.JarDir
        if (-not $startBat) { throw "start.bat not found under $($cfg.JarDir). Run with -UpdateJar." }
        $Ctx.JarRoot = Split-Path -Parent $startBat.DirectoryName

        $Ctx.Chrome = if ($cfg.ChromePath) { $cfg.ChromePath } else { 'C:\Program Files\Google\Chrome\Application\chrome.exe' }
        if ($Ctx.OpenBrowser -and -not (Test-Path -LiteralPath $Ctx.Chrome)) { throw "Chrome not found: $($Ctx.Chrome)" }

        # URL host: ServerHost in config, or auto-detected local IPv4 when empty / 'auto'
        $Ctx.Host = if ($cfg.ServerHost -and $cfg.ServerHost -ne 'auto') { $cfg.ServerHost } else { Get-LocalIPv4 }

        Write-Host "  Source  : $($cfg.SourceDir) ($($cfg.Branch))"
        Write-Host "  Project : $($cfg.ProjectPath) ($project)"
        Write-Host "  Output  : $outDir"
        Write-Host "  JAVA    : $($Ctx.Java)"
        Write-Host "  Jar     : $($Ctx.JarRoot)"
        Write-Host "  Publish : $pubDir"
        Write-Host "  Host    : $($Ctx.Host)"
        Write-Host "  Browser : $(if ($Ctx.OpenBrowser) { 'open Chrome' } else { 'off' })"
    }

    # ---- [1] Git update ----
    Invoke-Step $Ctx '1 Git update' {
        $src = $cfg.SourceDir
        if ($SkipGit) {
            Write-Host '  [SKIP] -SkipGit'
        } else {
            $dirty = & git -C $src status --porcelain
            if ($dirty) { throw "Source repo has local changes, aborting: $src" }

            if ((Invoke-Native git @('-C', $src, 'fetch', 'origin', $cfg.Branch)) -ne 0) { throw 'git fetch failed' }

            if ($OnlyIfChanged -and (Test-Path -LiteralPath $hashFile)) {
                $remote = (& git -C $src rev-parse "origin/$($cfg.Branch)").Trim()
                $last   = (Get-Content -LiteralPath $hashFile -Raw).Trim()
                if ($remote -eq $last) {
                    Write-Host "  [SKIP] No new commits since last success ($last)"
                    $Ctx.Status = 'UNCHANGED'
                    return
                }
            }

            if ((Invoke-Native git @('-C', $src, 'checkout', $cfg.Branch)) -ne 0) { throw 'git checkout failed' }
            if ((Invoke-Native git @('-C', $src, 'pull', '--ff-only', 'origin', $cfg.Branch)) -ne 0) { throw 'git pull failed' }
        }
        $Ctx.Hash = (& git -C $src rev-parse HEAD).Trim()
        $Ctx.Msg  = (& git -C $src log -1 '--format=%s') -join ' '
        Write-Host "  Hash : $($Ctx.Hash)"
        Write-Host "  Msg  : $($Ctx.Msg)"
    }
    if ($Ctx.Status -eq 'UNCHANGED') { return }

    # ---- [2] Build nexacrolib + generate rule ----
    Invoke-Step $Ctx '2 Framework copy' {
        $fwSrc = Join-Path $cfg.SourceDir 'Lib\FrameworkJS'
        Reset-Dir $libRoot $work
        New-Item -ItemType Directory -Force -Path $libDir | Out-Null

        foreach ($sub in 'component', 'framework', 'resources') {
            $s = Join-Path $fwSrc $sub
            if (Test-Path -LiteralPath $s) { Copy-Tree $s (Join-Path $libDir $sub) }
            else { Write-Host "  [WARN] Not found, skipped: $s" }
        }
        Copy-Item -LiteralPath (Join-Path $fwSrc 'nexacrolib.json') -Destination $libDir -Force

        $ver = Get-NexacroVersion (Join-Path $libDir 'nexacrolib.json')
        if (-not $ver) { throw 'Could not read version from nexacrolib.json' }
        if ($ver.Substring(0, 2) -ne $cfg.ExpectedVersion) {
            throw "Version mismatch: nexacrolib.json=$ver, ExpectedVersion=$($cfg.ExpectedVersion). Wrong branch/SourceDir?"
        }
        $Ctx.Version = $ver
        Write-Host "  Version : $ver"

        $n = Convert-JsToUtf8Bom $libDir
        Write-Host "  UTF-8 BOM converted: $n file(s)"

        New-Item -ItemType Directory -Force -Path $genDir | Out-Null
        Copy-Tree (Join-Path $cfg.SourceDir 'Tools\Lib\TiMetainfoLib\res') $genDir
        if ($cfg.ExpectedVersion -eq '24') {
            Copy-Tree (Join-Path $cfg.SourceDir 'Tools\Lib\TiGenerateLib\Template\24') $genDir
        }
        Write-Host "  Generate rule ready: $genDir"
    }

    # ---- [3] Nexacro deploy (Java CLI) ----
    Invoke-Step $Ctx '3 Deploy' {
        Reset-Dir $outDir $work
        Reset-Dir $deployDir $work
        $rule = if ($cfg.ExpectedVersion -eq '21') { '-CSSRULE' } else { '-GENERATERULE' }

        $javaArgs = @(
            "-Dlog4j.configurationFile=$(Join-Path $Ctx.JarRoot 'log4j2.xml')",
            '-classpath', (Join-Path $Ctx.JarRoot 'libs\*'),
            'com.nexacro.build.cli.Main',
            '-P', $cfg.ProjectPath,
            '-B', $libDir,
            '-O', $outDir,
            $rule, $genDir,
            '-D', $deployDir
        ) + $cfg.Flags

        Push-Location $Ctx.JarRoot
        try { $code = Invoke-Native $Ctx.Java $javaArgs } finally { Pop-Location }
        if ($code -ne 0) { throw "Deploy failed (exit $code)" }

        $files = @(Get-ChildItem -LiteralPath $deployDir -Recurse -File).Count
        if ($files -eq 0) { throw "Deploy produced no files in $deployDir" }
        Write-Host "  Deployed files: $files"
    }

    # ---- [4] Publish to Tomcat ----
    Invoke-Step $Ctx '4 Publish' {
        $port = [int]$cfg.TomcatPort
        if (-not (Test-Port $port)) {
            Write-Host "  Tomcat not listening on $port. Starting..."
            $env:CATALINA_HOME = $cfg.TomcatHome
            $env:JAVA_HOME     = $Ctx.JavaHome
            Start-Process -FilePath (Join-Path $cfg.TomcatHome 'bin\catalina.bat') -ArgumentList 'start' `
                -WorkingDirectory (Join-Path $cfg.TomcatHome 'bin') -WindowStyle Hidden
            $deadline = (Get-Date).AddSeconds(60)
            while (-not (Test-Port $port) -and (Get-Date) -lt $deadline) { Start-Sleep -Seconds 2 }
            if (-not (Test-Port $port)) { throw "Tomcat did not start on port $port" }
        }
        Write-Host "  Tomcat listening on $port"

        # Same-name folder already on the server: delete it, then copy fresh
        if (Test-Path -LiteralPath $pubDir) {
            $old = @(Get-ChildItem -LiteralPath $pubDir -Recurse -File -Force).Count
            Write-Host "  Existing folder found, deleting ($old file(s)): $pubDir"
            Remove-Item -LiteralPath $pubDir -Recurse -Force
        }
        Copy-Tree $deployDir $pubDir
        Write-Host "  Copied -> $pubDir"

        $page = $cfg.StartPage
        if (-not $page) {
            if (Test-Path -LiteralPath (Join-Path $deployDir 'index.html')) { $page = 'index.html' }
            else {
                $html = Get-ChildItem -LiteralPath $deployDir -Filter '*.html' -File | Select-Object -First 1
                if ($html) { $page = $html.Name }
            }
        }
        if (-not $page) { Write-Host '  [WARN] No start html found in deploy root. Opening context root.'; $page = '' }

        $Ctx.Url = "http://$($Ctx.Host):$port/" + ((@($urlPath, $page) | Where-Object { $_ }) -join '/')
        if (-not $page -and $urlPath) { $Ctx.Url += '/' }
        if (-not (Wait-Url $Ctx.Url 60)) { throw "URL not ready within 60s: $($Ctx.Url)" }
        Write-Host "  Ready: $($Ctx.Url)"
    }

    # ---- [5] Open Chrome ----
    Invoke-Step $Ctx '5 Chrome' {
        if (-not $Ctx.OpenBrowser) { Write-Host '  [SKIP] Browser off (OpenBrowser=N or -NoBrowser)'; return }
        $profileDir = Join-Path $work 'chrome_profile'
        $chromeArgs = @("--user-data-dir=`"$profileDir`"", '--no-first-run', '--no-default-browser-check',
                        '--disk-cache-size=1', '--new-window')
        if ($DevTools) { $chromeArgs += '--auto-open-devtools-for-tabs' }
        $chromeArgs += $Ctx.Url
        Start-Process -FilePath $Ctx.Chrome -ArgumentList $chromeArgs
        Write-Host "  Opened: $($Ctx.Url)"
    }

    Set-Content -LiteralPath $hashFile -Value $Ctx.Hash
    $Ctx.Status = 'SUCCESS'
}

# ============================================================
# Main
# ============================================================

$targets = if ($Target -eq 'all') { @('v21', 'v24') } else { @($Target) }
$results = @()

# ---- [jar] Deploy JAVA engine: once per run, before any target ----
# Runs with -UpdateJar, or automatically when the configured JarDir has no engine yet.
$jarResults = @()
$jarFailed  = $false
$jarDirs = foreach ($t in $targets) {
    try {
        $c = Read-PipelineConfig (Join-Path $ROOT "pipeline_$t.txt")
        if (Test-Enabled $c) { $c.JarDir }
    } catch { }
}
foreach ($jd in ($jarDirs | Select-Object -Unique)) {
    if (-not $UpdateJar -and (Find-StartBat $jd)) { continue }
    Write-Host ''
    Write-Host "---- [jar] Deploy JAVA engine: $jd ----"
    $sw = [Diagnostics.Stopwatch]::StartNew()
    try {
        try { Assert-Under $jd $WORK_ROOT }
        catch { throw "JarDir must be under $WORK_ROOT to be updated (got '$jd')" }
        $jarResults += Update-DeployJar $jd
    } catch {
        $jarFailed = $true
        $jarResults += "FAIL - $($_.Exception.Message)"
        Write-Host "[ERROR] [jar] $($_.Exception.Message)"
        if (Find-StartBat $jd) { Write-Host '  [WARN] Keeping the currently installed engine.' }
    }
    Write-Host "  [DONE] jar ($([math]::Round($sw.Elapsed.TotalSeconds, 1))s)"
}

foreach ($t in $targets) {
    $ctx = @{ Target = $t; Status = 'FAIL'; Version = ''; Hash = ''; Msg = ''; Url = ''; Error = '';
              Steps = New-Object System.Collections.ArrayList }
    try {
        Invoke-Target $ctx
    } catch {
        $ctx.Error = $_.Exception.Message
        Write-Host "[ERROR] [$t] $($ctx.Error)"
    }
    $results += $ctx
}

Write-Host ''
Write-Host '=============================================='
Write-Host ' AutoPipeline summary'
Write-Host '=============================================='
foreach ($j in $jarResults) { Write-Host " [jar] $j" }
foreach ($r in $results) {
    Write-Host " [$($r.Target)] $($r.Status)"
    if ($r.Version) { Write-Host "   Version : $($r.Version)" }
    if ($r.Hash)    { Write-Host "   Commit  : $($r.Hash) $($r.Msg)" }
    if ($r.Url)     { Write-Host "   URL     : $($r.Url)" }
    if ($r.Steps.Count) { Write-Host "   Steps   : $($r.Steps -join ' | ')" }
    if ($r.Error)   { Write-Host "   Error   : $($r.Error)" }
}
Write-Host " Log: $LOG_FILE"
Write-Host '=============================================='

Stop-Transcript | Out-Null
if ($jarFailed -or ($results | Where-Object { $_.Status -eq 'FAIL' })) { exit 1 }
exit 0
