@echo off
rem ============================================================
rem  auto_pipeline_standalone.bat
rem  Single-file AutoPipeline: this bat contains the whole PowerShell pipeline.
rem  The bat can be copied/moved anywhere; it finds the config folder below.
rem
rem  Usage:
rem    auto_pipeline_standalone.bat [v21^|v24^|all] [-Branch name] [-SourceType git^|package] [-Build folder]
rem                                 [-UpdateJar] [-SkipGit] [-OnlyIfChanged]
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
#  [jar] engine update -> Git pull -> nexacrolib build-up -> Nexacro deploy -> Tomcat publish -> Chrome -> TestPro
# ============================================================

# ---- Arguments (parsed from %*, since a scriptblock run this way has no param() binding) ----
$Target = 'all'
$Branch = ''; $SourceType = ''; $Build = ''
$UpdateJar = $false; $SkipGit = $false; $OnlyIfChanged = $false
$OpenBrowser = $false; $NoBrowser = $false; $DevTools = $false
$argList = @("$env:AP_ARGS".Trim() -split '\s+' | Where-Object { $_ })
for ($k = 0; $k -lt $argList.Count; $k++) {
    $a = $argList[$k].Trim('"')
    switch -Regex ($a.ToLower()) {
        '^(v21|v24|all)$'   { $Target = $Matches[1]; break }
        '^-target$'         { $k++; $Target = "$($argList[$k])".Trim('"').ToLower(); break }
        '^-branch$'         {
            $k++; $Branch = "$($argList[$k])".Trim('"')
            if (-not $Branch -or $Branch.StartsWith('-')) { Write-Host '[ERROR] -Branch needs a branch name'; exit 2 }
            break
        }
        '^-sourcetype$'     {
            $k++; $SourceType = "$($argList[$k])".Trim('"').ToLower()
            if (@('git', 'package') -notcontains $SourceType) { Write-Host "[ERROR] -SourceType must be git or package (got '$SourceType')"; exit 2 }
            break
        }
        '^-build$'          {
            $k++; $Build = "$($argList[$k])".Trim('"')
            if (-not $Build -or $Build.StartsWith('-')) { Write-Host '[ERROR] -Build needs a build folder name'; exit 2 }
            break
        }
        '^-updatejar$'      { $UpdateJar = $true; break }
        '^-skipgit$'        { $SkipGit = $true; break }
        '^-onlyifchanged$'  { $OnlyIfChanged = $true; break }
        '^-openbrowser$'    { $OpenBrowser = $true; break }
        '^-nobrowser$'      { $NoBrowser = $true; break }
        '^-devtools$'       { $DevTools = $true; break }
        '^(-help|-h|/\?)$'  {
            Write-Host 'Usage: auto_pipeline_standalone.bat [v21|v24|all] [-Branch <name>] [-UpdateJar] [-SkipGit] [-OnlyIfChanged]'
            Write-Host '                                    [-OpenBrowser|-NoBrowser] [-DevTools]'
            Write-Host '                                    [-SourceType git|package] [-Build <folder>]'
            Write-Host '  -Branch     : this run only, overrides Branch= in pipeline_<target>.txt (v21 or v24 only)'
            Write-Host '  -SourceType : this run only, overrides SourceType= (default git; package = prebuilt nexacrolib.zip)'
            Write-Host '  -Build      : this run only, package build folder (default PackageBuild=latest)'
            Write-Host "Config folder (PIPELINE_HOME): $env:PIPELINE_HOME"
            exit 0
        }
        default { Write-Host "[ERROR] Unknown argument: $a  (use -Help)"; exit 2 }
    }
}
if (@('v21', 'v24', 'all') -notcontains $Target) { Write-Host "[ERROR] Invalid target: $Target"; exit 2 }
if ($Branch -and $Target -eq 'all') { Write-Host '[ERROR] -Branch needs a single target (v21 or v24)'; exit 2 }
if ($Build -and $Target -eq 'all')  { Write-Host '[ERROR] -Build needs a single target (v21 or v24)'; exit 2 }

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
    foreach ($key in 'SourceDir', 'ProjectPath', 'WorkDir', 'JarDir', 'TomcatHome', 'JavaHome', 'ChromePath', 'PackageRoot', 'PackagePath',
                     'JebiExePath', 'TestScenarioFile', 'TestParallelManifest', 'TestOutputDir', 'TestVarsFile', 'TestSourceFile') {
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

# Run a native exe and return its exit code and output lines (not echoed).
function Invoke-NativeCapture([string]$Exe, [string[]]$Arguments) {
    $prev = $ErrorActionPreference
    $ErrorActionPreference = 'Continue'
    try {
        $out  = @(& $Exe @Arguments 2>&1 | ForEach-Object { "$_" })
        $code = $LASTEXITCODE
    } finally {
        $ErrorActionPreference = $prev
    }
    return [pscustomobject]@{ Code = $code; Lines = $out }
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
    Remove-Tree $Path
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

# Delete a folder tree. robocopy /MIR from an empty folder handles paths longer than 260 chars,
# which Remove-Item in PowerShell 5.1 cannot (deep git sources / deploy output).
function Remove-Tree([string]$Path) {
    if (-not (Test-Path -LiteralPath $Path)) { return }
    $empty = Join-Path ([IO.Path]::GetTempPath()) ('ap_empty_' + [guid]::NewGuid().ToString('N'))
    New-Item -ItemType Directory -Force -Path $empty | Out-Null
    try { Copy-Tree $empty $Path -Mirror } finally { Remove-Item -LiteralPath $empty -Force }
    Remove-Item -LiteralPath $Path -Recurse -Force
    if (Test-Path -LiteralPath $Path) { throw "Could not delete: $Path" }
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
    Remove-Tree $staging
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

# Newest build folder. Names look like 2026.9.21.1(24.0.0.1130): compare date + sequence as numbers
# (a string sort would put 2026.9.3 after 2026.9.21). Other names fall back to LastWriteTime.
function Get-LatestBuild([string]$Dir) {
    $dirs = @(Get-ChildItem -LiteralPath $Dir -Directory)
    if (-not $dirs) { throw "No build folders in $Dir" }
    $key = {
        $m = [regex]::Match($_.Name, '^(\d{4})\.(\d+)\.(\d+)\.(\d+)')
        if ($m.Success) { [long]('{0:D4}{1:D2}{2:D2}{3:D4}' -f [int]$m.Groups[1].Value, [int]$m.Groups[2].Value, [int]$m.Groups[3].Value, [int]$m.Groups[4].Value) } else { 0 }
    }
    return ($dirs | Sort-Object -Descending -Property @{ Expression = $key }, LastWriteTime | Select-Object -First 1).Name
}

# -When $false skips the step entirely (no header, no timing).
function Invoke-Step($Ctx, [string]$Name, [scriptblock]$Body, [bool]$When = $true) {
    if (-not $When) { return }
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

    # Branch: -Branch (this run only) wins over Branch= in config.
    # SourceDir may contain {Branch}; '/' in a branch becomes a sub folder (RELEASE/x -> RELEASE\x).
    if ($Branch) { $cfg.Branch = $Branch }
    $Ctx.Branch    = $cfg.Branch
    $cfg.SourceDir = $cfg.SourceDir.Replace('{Branch}', $cfg.Branch.Replace('/', '\'))

    # Source type: -SourceType (this run only) wins over SourceType= in config. Default git.
    $srcType = "$(if ($SourceType) { $SourceType } elseif ($cfg.SourceType) { $cfg.SourceType } else { 'git' })".ToLower()
    if (@('git', 'package') -notcontains $srcType) { throw "SourceType must be git or package (got '$srcType')" }
    $Ctx.SourceType = $srcType

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
    # Last success marker per source type + branch (-OnlyIfChanged): git = commit hash, package = zip path|size|time
    $hashKey   = $cfg.Branch -replace '[\\/:*?"<>|]', '_'
    $hashFile  = Join-Path $work $(if ($srcType -eq 'package') { "last_success_package_$hashKey.txt" } else { "last_success_hash_$hashKey.txt" })

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
        # SourceDir is checked in [1]: it may not exist yet (cloned from RepoUrl)
        foreach ($p in $cfg.ProjectPath, $cfg.TomcatHome) {
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

        Write-Host "  Type    : $srcType$(if ($SourceType) { ' (-SourceType)' })"
        if ($srcType -eq 'git') {
            Write-Host "  Source  : $($cfg.SourceDir) ($($cfg.Branch)$(if ($Branch) { ', -Branch' }))"
            Write-Host "  Repo    : $(if ($cfg.RepoUrl) { $cfg.RepoUrl } else { '(RepoUrl not set: existing SourceDir only)' })"
        } elseif ($cfg.PackagePath) {
            Write-Host "  Package : $($cfg.PackagePath) (PackagePath)"
        } else {
            Write-Host "  Package : $($cfg.PackageRoot)\$($cfg.Branch.Split('/')[-1])\$(if ($Build) { "$Build (-Build)" } elseif ($cfg.PackageBuild) { $cfg.PackageBuild } else { 'latest' })"
        }
        Write-Host "  Project : $($cfg.ProjectPath) ($project)"
        Write-Host "  Output  : $outDir"
        Write-Host "  JAVA    : $($Ctx.Java)"
        Write-Host "  Jar     : $($Ctx.JarRoot)"
        Write-Host "  Publish : $pubDir"
        Write-Host "  Host    : $($Ctx.Host)"
        Write-Host "  Browser : $(if ($Ctx.OpenBrowser) { 'open Chrome' } else { 'off' })"
    }

    # ---- [1] Package (SourceType=package): prebuilt nexacrolib.zip = nexacrolib\ + generate\ ----
    #      Replaces [1] Source and [2] Framework copy. No UTF-8 BOM conversion (already built).
    Invoke-Step $Ctx '1 Package' -When ($srcType -eq 'package') {
        $zipName = if ($cfg.PackageZip) { $cfg.PackageZip } else { 'nexacrolib.zip' }

        # 1-a Locate the zip: PackagePath (zip or build folder) > PackageRoot\<branch folder>\<build>\<zip>
        if ($cfg.PackagePath) {
            if ($Build) { Write-Host '  [WARN] -Build ignored: PackagePath is set' }
            $zipSrc = if ($cfg.PackagePath -match '\.zip$') { $cfg.PackagePath } else { Join-Path $cfg.PackagePath $zipName }
        } else {
            if (-not $cfg.PackageRoot) { throw 'SourceType=package needs PackageRoot or PackagePath in the config' }
            # Package folders use the last part of the branch (RELEASE/REL_x -> REL_x)
            $brDir = Join-Path $cfg.PackageRoot $cfg.Branch.Split('/')[-1]
            if (-not (Test-Path -LiteralPath $brDir)) { throw "Package branch folder not found: $brDir" }
            $buildName = if ($Build) { $Build }
                         elseif ($cfg.PackageBuild -and $cfg.PackageBuild -ne 'latest') { $cfg.PackageBuild }
                         else { Get-LatestBuild $brDir }
            $zipSrc = Join-Path (Join-Path $brDir $buildName) $zipName
        }
        if (-not (Test-Path -LiteralPath $zipSrc)) { throw "Package zip not found: $zipSrc" }
        $zipItem = Get-Item -LiteralPath $zipSrc
        $pkgId   = "$zipSrc|$($zipItem.Length)|$($zipItem.LastWriteTimeUtc.ToString('o'))"
        Write-Host "  Zip     : $zipSrc"
        Write-Host ("  Size    : {0:N1} MB, {1}" -f ($zipItem.Length / 1MB), $zipItem.LastWriteTime)

        # 1-b -OnlyIfChanged: same zip (path + size + time) as the last success
        if ($OnlyIfChanged -and (Test-Path -LiteralPath $hashFile) -and (Get-Content -LiteralPath $hashFile -Raw).Trim() -eq $pkgId) {
            Write-Host '  [SKIP] Same package as last success'
            $Ctx.Status = 'UNCHANGED'
            return
        }

        # 1-c Copy to a local cache first (do not extract over the share); skip when already cached
        $cacheDir = Join-Path $work 'package'
        $cacheZip = Join-Path $cacheDir $zipItem.Name
        $cached   = Get-Item -LiteralPath $cacheZip -ErrorAction SilentlyContinue
        if ($cached -and $cached.Length -eq $zipItem.Length -and $cached.LastWriteTimeUtc -eq $zipItem.LastWriteTimeUtc) {
            Write-Host "  [SKIP] Already cached: $cacheZip"
        } else {
            New-Item -ItemType Directory -Force -Path $cacheDir | Out-Null
            Copy-Item -LiteralPath $zipSrc -Destination $cacheZip -Force
            Write-Host "  Copied  -> $cacheZip"
        }

        # 1-d Extract into work\<target>\nexacrolib (the zip root holds nexacrolib\ and generate\)
        Reset-Dir $libRoot $work
        Add-Type -AssemblyName System.IO.Compression.FileSystem
        [IO.Compression.ZipFile]::ExtractToDirectory($cacheZip, $libRoot)

        # 1-e Layout + version check
        foreach ($need in 'nexacrolib\nexacrolib.json', 'generate') {
            if (-not (Test-Path -LiteralPath (Join-Path $libRoot $need))) { throw "Unexpected package layout, missing '$need' in $zipSrc" }
        }
        $ver = Get-NexacroVersion (Join-Path $libDir 'nexacrolib.json')
        if (-not $ver) { throw 'Could not read version from nexacrolib.json in the package' }
        if ($ver.Substring(0, 2) -ne $cfg.ExpectedVersion) {
            throw "Version mismatch: package=$ver, ExpectedVersion=$($cfg.ExpectedVersion). Wrong PackageRoot/branch?"
        }
        $Ctx.Version   = $ver
        $Ctx.Package   = $zipSrc
        $Ctx.PackageId = $pkgId
        Write-Host "  Version : $ver"
        Write-Host "  Extracted -> $libRoot (nexacrolib + generate)"
    }

    # ---- [1] Source: clone when SourceDir is missing, otherwise update ----
    Invoke-Step $Ctx '1 Source' -When ($srcType -eq 'git') {
        $src    = $cfg.SourceDir
        $br     = $cfg.Branch
        $isRepo = Test-Path -LiteralPath (Join-Path $src '.git')

        if ($SkipGit) {
            Write-Host '  [SKIP] -SkipGit'
            if (-not $isRepo) { throw "-SkipGit needs an existing git repository: $src" }
        } else {
            # 1-a A branch like RELEASE/REL_26.05.19.00_21.0.0.2100 must match ExpectedVersion (fail before a long clone).
            #     Only NN.0.0.N counts as a version (dates such as 26.05.19.00 / 22.11.01.01 do not).
            $mv = [regex]::Matches($br, '_(\d{2})\.0\.0\.\d+(?=_|$)') | Select-Object -Last 1
            if ($mv -and $mv.Groups[1].Value -ne $cfg.ExpectedVersion) {
                throw "Branch '$br' is v$($mv.Groups[1].Value) but ExpectedVersion=$($cfg.ExpectedVersion)"
            }

            # 1-b Remote branch check (~1s); also gives the remote hash for -OnlyIfChanged
            $url = $cfg.RepoUrl
            if (-not $url) {
                if (-not $isRepo) { throw "SourceDir not found and RepoUrl is not set: $src" }
                $url = (& git -C $src remote get-url origin).Trim()
            }
            $ls = Invoke-NativeCapture git @('ls-remote', '--heads', $url, "refs/heads/$br")
            if ($ls.Code -ne 0) { throw "git ls-remote failed: $($ls.Lines -join ' ')" }
            $line = $ls.Lines | Where-Object { $_ -match "`trefs/heads/$([regex]::Escape($br))$" } | Select-Object -First 1
            if (-not $line) { throw "Branch not found on remote: $br ($url)" }
            $remoteHash = ($line -split "`t")[0].Trim()
            Write-Host "  Remote : $br @ $remoteHash"

            if ($OnlyIfChanged -and (Test-Path -LiteralPath $hashFile)) {
                $last = (Get-Content -LiteralPath $hashFile -Raw).Trim()
                if ($remoteHash -eq $last) {
                    Write-Host "  [SKIP] No new commits since last success ($last)"
                    $Ctx.Status = 'UNCHANGED'
                    return
                }
            }

            # 1-c SourceDir state
            $exists  = Test-Path -LiteralPath $src
            $isEmpty = $exists -and -not (Get-ChildItem -LiteralPath $src -Force | Select-Object -First 1)

            if (-not $exists -or $isEmpty) {
                # Full single-branch clone (same as git_sourcecode.md) + Windows long path support
                $drive  = [IO.Path]::GetPathRoot([IO.Path]::GetFullPath($src))
                $freeGB = [math]::Floor((New-Object IO.DriveInfo($drive)).AvailableFreeSpace / 1GB)
                $needGB = if ($cfg.CloneMinFreeGB) { [int]$cfg.CloneMinFreeGB } else { 40 }
                if ($freeGB -lt $needGB) { throw "Not enough disk space to clone: ${freeGB}GB free on $drive (need ${needGB}GB)" }

                Write-Host "  SourceDir not found -> full clone ($freeGB GB free on $drive). The first clone can take tens of minutes."
                New-Item -ItemType Directory -Force -Path (Split-Path -Parent $src) | Out-Null
                $code = Invoke-Native git @('clone', '-c', 'core.longpaths=true', '-b', $br, '--single-branch', $url, $src)
                if ($code -ne 0) {
                    # Remove only what this run created (keep a folder that existed empty)
                    Remove-Tree $src
                    if ($isEmpty) { New-Item -ItemType Directory -Force -Path $src | Out-Null }
                    throw "git clone failed (exit $code): $br -> $src"
                }
            } elseif (-not $isRepo) {
                throw "SourceDir exists but is not a git repository (not touched): $src"
            } else {
                # Existing clone: must be the same repo and branch, then fast-forward only
                if ($cfg.RepoUrl) {
                    $origin = (& git -C $src remote get-url origin).Trim()
                    $a = $origin.TrimEnd('/') -replace '\.git$', ''
                    $b = $cfg.RepoUrl.TrimEnd('/') -replace '\.git$', ''
                    if ($a -ne $b) { throw "SourceDir origin '$origin' differs from RepoUrl '$($cfg.RepoUrl)'" }
                }
                if (Test-Path -LiteralPath (Join-Path $src '.git\index.lock')) {
                    throw "index.lock exists (another or aborted git process): $(Join-Path $src '.git\index.lock')"
                }
                $cur = (& git -C $src rev-parse --abbrev-ref HEAD).Trim()
                if ($cur -ne $br) {
                    throw "SourceDir is on branch '$cur', expected '$br'. Use SourceDir=...\{Branch} so each branch has its own folder."
                }
                $dirty = & git -C $src status --porcelain
                if ($dirty) { throw "Source repo has local changes, aborting: $src" }

                if ((Invoke-Native git @('-C', $src, 'fetch', 'origin', $br)) -ne 0) { throw 'git fetch failed' }
                if ((Invoke-Native git @('-C', $src, 'pull', '--ff-only', 'origin', $br)) -ne 0) { throw 'git pull failed' }
            }
        }

        # 1-d Folders the pipeline reads
        foreach ($need in 'Lib\FrameworkJS\nexacrolib.json', 'Tools\Lib\TiMetainfoLib\res') {
            if (-not (Test-Path -LiteralPath (Join-Path $src $need))) { throw "Required path missing in source: $(Join-Path $src $need)" }
        }
        $Ctx.Hash = (& git -C $src rev-parse HEAD).Trim()
        $Ctx.Msg  = (& git -C $src log -1 '--format=%s') -join ' '
        Write-Host "  Hash : $($Ctx.Hash)"
        Write-Host "  Msg  : $($Ctx.Msg)"
    }
    if ($Ctx.Status -eq 'UNCHANGED') { return }

    # ---- [2] Build nexacrolib + generate rule ----
    Invoke-Step $Ctx '2 Framework copy' -When ($srcType -eq 'git') {
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
            Remove-Tree $pubDir
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

    # ---- [6] TestPro ----
    Invoke-Step $Ctx '6 TestPro' -When (@('Y','YES','TRUE','1') -contains "$($cfg.TestProEnabled)".ToUpper()) {
        # [6-0] Preflight
        if (-not $cfg.JebiExePath) { throw "JebiExePath is not set in pipeline_$($Ctx.Target).txt" }
        if (-not (Test-Path -LiteralPath $cfg.JebiExePath)) { throw "JEBI_Main.exe not found: $($cfg.JebiExePath)" }
        $mode = "$($cfg.TestMode)".ToLower()
        if (@('scenario','file','parallel') -notcontains $mode) { throw "TestMode must be scenario|file|parallel (got '$mode')" }
        $tcFiles = @()
        if ($mode -eq 'scenario') {
            if (-not $cfg.TestScenarioFile) { throw 'TestScenarioFile is required when TestMode=scenario' }
            if (-not (Test-Path -LiteralPath $cfg.TestScenarioFile)) { throw "TestScenarioFile not found: $($cfg.TestScenarioFile)" }
        } elseif ($mode -eq 'file') {
            $cfgBase = Split-Path -Parent ([IO.Path]::GetFullPath($cfgPath))
            $tcFiles = ($cfg.TestTCFiles.Split('|') | ForEach-Object {
                $tc = $_.Trim()
                if (-not $tc) { return }
                if (-not [IO.Path]::IsPathRooted($tc)) { $tc = [IO.Path]::GetFullPath((Join-Path $cfgBase $tc)) }
                $tc
            }) | Where-Object { $_ }
            if (-not $tcFiles) { throw 'TestTCFiles must list at least one TC file when TestMode=file' }
            foreach ($tc in $tcFiles) {
                if (-not (Test-Path -LiteralPath $tc)) { throw "TC file not found: $tc" }
            }
        } else {
            if (-not $cfg.TestParallelManifest) { throw 'TestParallelManifest is required when TestMode=parallel' }
            if (-not (Test-Path -LiteralPath $cfg.TestParallelManifest)) { throw "TestParallelManifest not found: $($cfg.TestParallelManifest)" }
        }
        # dummy.json: -s/--source is required by JEBI CLI in all run modes
        $srcFile = if ($cfg.TestSourceFile -and (Test-Path -LiteralPath $cfg.TestSourceFile)) {
            $cfg.TestSourceFile
        } else {
            $d = Join-Path $work 'dummy.json'
            Set-Content -LiteralPath $d -Value '{}'
            Write-Host "  Source  : dummy.json auto-created at $d"
            $d
        }
        $testOutDir = if ($cfg.TestOutputDir) { $cfg.TestOutputDir } else { Join-Path $work 'test-result' }
        if (Test-Path -LiteralPath $testOutDir) { Remove-Item -LiteralPath $testOutDir -Recurse -Force }
        New-Item -ItemType Directory -Force -Path $testOutDir | Out-Null
        $timeoutSec = if ($cfg.TestTimeoutSec) { [int]$cfg.TestTimeoutSec } else { 600 }
        Write-Host "  Exe     : $($cfg.JebiExePath)"
        Write-Host "  Mode    : $mode"
        Write-Host "  Output  : $testOutDir"
        Write-Host "  Timeout : $(if ($timeoutSec -gt 0) { "${timeoutSec}s" } else { 'unlimited' })"
        # [6-1] Build CLI args
        $jebiArgs = New-Object System.Collections.ArrayList
        if ($mode -eq 'parallel') {
            [void]$jebiArgs.AddRange(@('--run-parallel', $cfg.TestParallelManifest))
        } else {
            [void]$jebiArgs.AddRange(@('-s', $srcFile))
            if ($mode -eq 'scenario') {
                [void]$jebiArgs.AddRange(@('--run-scenario', $cfg.TestScenarioFile))
            } else {
                [void]$jebiArgs.Add('--run-file')
                foreach ($tc in $tcFiles) { [void]$jebiArgs.Add($tc) }
            }
            [void]$jebiArgs.AddRange(@('--output', $testOutDir))
            if ($cfg.TestVarsFile)   { [void]$jebiArgs.AddRange(@('--vars', $cfg.TestVarsFile)) }
            if ($cfg.TestScenarioId) { [void]$jebiArgs.AddRange(@('--scenario-id', $cfg.TestScenarioId)) }
            if (@('Y','YES','TRUE','1') -contains "$($cfg.TestHeadless)".ToUpper())                   { [void]$jebiArgs.Add('--headless') }
            if (@('Y','YES','TRUE','1') -contains "$($cfg.TestSkipDuplicatePreconditions)".ToUpper()) { [void]$jebiArgs.Add('--skip-duplicate-preconditions') }
            if (@('Y','YES','TRUE','1') -contains "$($cfg.TestFailOnPageError)".ToUpper())            { [void]$jebiArgs.Add('--fail-on-page-error') }
        }
        # quote args that contain spaces
        $argStr = ($jebiArgs | ForEach-Object { $a = "$_"; if ($a -match '\s') { "`"$a`"" } else { $a } }) -join ' '
        Write-Host "  [CMD] $($cfg.JebiExePath) $argStr"
        # [6-1] Execute
        $stdoutLog = Join-Path $testOutDir '_jebi_stdout.log'
        $stderrLog = Join-Path $testOutDir '_jebi_stderr.log'
        $sw6 = [Diagnostics.Stopwatch]::StartNew()
        $proc = Start-Process -FilePath $cfg.JebiExePath -ArgumentList $argStr -PassThru -NoNewWindow `
            -RedirectStandardOutput $stdoutLog -RedirectStandardError $stderrLog
        $finished = if ($timeoutSec -gt 0) { $proc.WaitForExit($timeoutSec * 1000) } else { $proc.WaitForExit(); $true }
        $sw6.Stop()
        $Ctx.TestSec = [math]::Round($sw6.Elapsed.TotalSeconds, 1)
        if (Test-Path -LiteralPath $stdoutLog) { Get-Content -LiteralPath $stdoutLog | ForEach-Object { Write-Host "    $_" } }
        if (Test-Path -LiteralPath $stderrLog) {
            $errText = (Get-Content -LiteralPath $stderrLog -Raw -ErrorAction SilentlyContinue).Trim()
            if ($errText) { Write-Host "    [STDERR] $errText" }
        }
        if (-not $finished) {
            try { $proc.Kill() } catch { }
            $Ctx.TestStatus = 'TIMEOUT'; $Ctx.TestCode = -1
            throw "TestPro timed out after ${timeoutSec}s"
        }
        $Ctx.TestCode = $proc.ExitCode
        # [6-2] Classify exit code
        if     ($Ctx.TestCode -eq 0)                     { $Ctx.TestStatus = 'PASS' }
        elseif (@(15, 27, 33) -contains $Ctx.TestCode)   { $Ctx.TestStatus = 'FAIL' }
        else                                              { $Ctx.TestStatus = 'ENGINE_ERROR' }
        # [6-3] Parse result JSONs for pass/fail counts
        $resultFiles = @(Get-ChildItem -LiteralPath $testOutDir -Filter '*.json' -Recurse -File -ErrorAction SilentlyContinue |
                         Where-Object { $_.Name -notmatch '^_' })
        $totalPass = 0; $totalFail = 0
        foreach ($rf in $resultFiles) {
            try {
                $rj = Get-Content -LiteralPath $rf.FullName -Raw -Encoding UTF8 | ConvertFrom-Json
                if ($null -ne $rj.pass)   { $totalPass += [int]$rj.pass }   elseif ($null -ne $rj.passed)  { $totalPass += [int]$rj.passed }
                if ($null -ne $rj.fail)   { $totalFail += [int]$rj.fail }   elseif ($null -ne $rj.failed)  { $totalFail += [int]$rj.failed }
            } catch { }
        }
        $Ctx.TestPass = $totalPass; $Ctx.TestFail = $totalFail
        Write-Host "  Result  : $($Ctx.TestStatus) Pass $totalPass, Fail $totalFail ($($Ctx.TestSec)s)"
        if ($Ctx.TestStatus -ne 'PASS') {
            throw "TestPro $($Ctx.TestStatus) (exit $($Ctx.TestCode)) Pass $totalPass, Fail $totalFail"
        }
    }

    Set-Content -LiteralPath $hashFile -Value $(if ($srcType -eq 'package') { $Ctx.PackageId } else { $Ctx.Hash })
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
    $ctx = @{ Target = $t; Status = 'FAIL'; Branch = ''; Version = ''; Hash = ''; Msg = ''; Url = ''; Error = '';
              TestStatus = ''; TestPass = 0; TestFail = 0; TestSec = 0.0; TestCode = 0;
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
    if ($r.Branch)  { Write-Host "   Branch  : $($r.Branch)$(if ($r.SourceType) { " ($($r.SourceType))" })" }
    if ($r.Package) { Write-Host "   Package : $($r.Package)" }
    if ($r.Version) { Write-Host "   Version : $($r.Version)" }
    if ($r.Hash)    { Write-Host "   Commit  : $($r.Hash) $($r.Msg)" }
    if ($r.Url)     { Write-Host "   URL     : $($r.Url)" }
    if ($r.Steps.Count) { Write-Host "   Steps   : $($r.Steps -join ' | ')" }
    if ($r.Error)   { Write-Host "   Error   : $($r.Error)" }
    if ($r.TestStatus) {
        $tLine = "   TestPro : $($r.TestStatus)"
        if ($r.TestPass -gt 0 -or $r.TestFail -gt 0) { $tLine += " Pass $($r.TestPass), Fail $($r.TestFail)" }
        if ($r.TestCode -ne 0) { $tLine += " (exit $($r.TestCode))" }
        if ($r.TestSec  -gt 0) { $tLine += " $($r.TestSec)s" }
        Write-Host $tLine
    }
}
Write-Host " Log: $LOG_FILE"
Write-Host '=============================================='

Stop-Transcript | Out-Null
if ($jarFailed -or ($results | Where-Object { $_.Status -eq 'FAIL' })) { exit 1 }
exit 0
