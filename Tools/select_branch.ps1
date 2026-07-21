<#
.SYNOPSIS
    Interactive git branch selector (ASCII-only, CP949 safe)
    Letter  : search / filter mode
    Number  : jump to item number  (Enter to confirm)
    Up/Down : move cursor
    Enter   : select branch or enter folder
    BackSp  : delete search char / go to parent folder
    ESC     : clear search / exit

    Values are read from environment variables set by update_framework_v2.bat:
      PSBRANCH_REPO   - git repository path
      PSBRANCH_RESULT - file path to write the selected branch name
#>

# Read from env vars (avoids PowerShell -File argument quoting issues)
$RepoPath    = $env:PSBRANCH_REPO
$ResultFile  = if ($env:PSBRANCH_RESULT) { $env:PSBRANCH_RESULT } `
               else { Join-Path $env:TEMP "_update_fw_branch.tmp" }
$VersionFile    = if ($env:PSVERSION_RESULT) { $env:PSVERSION_RESULT } `
                  else { Join-Path $env:TEMP "_update_fw_version.tmp" }
$VersionNumFile = if ($env:PSVERNUM_RESULT)  { $env:PSVERNUM_RESULT  } `
                  else { Join-Path $env:TEMP "_update_fw_vernum.tmp"  }

if (-not $RepoPath) {
    Write-Host "[ERROR] PSBRANCH_REPO environment variable is not set." -ForegroundColor Red
    exit 1
}

Set-StrictMode -Off
$ErrorActionPreference = "SilentlyContinue"

# ---- collect branches -------------------------------------------------------
function Get-AllBranches([string]$Path) {
    Push-Location $Path
    $local  = git branch --format="%(refname:short)" 2>$null
    $remote = git branch -r --format="%(refname:short)" 2>$null |
              Where-Object { $_ -notmatch "->|HEAD" } |
              ForEach-Object { ($_ -replace "^[^/]+/", "") }
    Pop-Location
    return (@($local) + @($remote)) |
           Where-Object { $_ -and $_.Trim() } |
           Sort-Object -Unique
}

# ---- build folder tree ------------------------------------------------------
function Get-Items([string[]]$All, [string]$CurPath, [string]$Filter) {
    $prefix  = if ($CurPath) { "$CurPath/" } else { "" }
    $folders = [System.Collections.Generic.SortedSet[string]]::new()
    $leaves  = [System.Collections.ArrayList]@()

    foreach ($b in $All) {
        if (-not $b.StartsWith($prefix)) { continue }
        $rest  = $b.Substring($prefix.Length)
        $slash = $rest.IndexOf('/')
        if ($slash -ge 0) {
            $null = $folders.Add($rest.Substring(0, $slash))
        } else {
            if (-not $Filter -or $b -imatch [regex]::Escape($Filter)) {
                $null = $leaves.Add([PSCustomObject]@{
                    Kind = "branch"
                    Name = $rest
                    Full = if ($CurPath) { "$CurPath/$rest" } else { $rest }
                })
            }
        }
    }

    $result = [System.Collections.ArrayList]@()
    if ($CurPath) {
        $null = $result.Add([PSCustomObject]@{ Kind="up"; Name=".. (parent)"; Full="" })
    }
    foreach ($f in $folders) {
        $full = if ($CurPath) { "$CurPath/$f" } else { $f }
        $hasMatch = (-not $Filter) -or
                    ($All | Where-Object {
                        $_.StartsWith("$full/") -and ($_ -imatch [regex]::Escape($Filter))
                    } | Select-Object -First 1)
        if ($hasMatch) {
            $null = $result.Add([PSCustomObject]@{ Kind="dir"; Name="$f/"; Full=$full })
        }
    }
    foreach ($l in $leaves) { $null = $result.Add($l) }
    return @($result)
}

# ---- version selector -------------------------------------------------------
function Select-Version {
    $W    = [Math]::Min([Console]::WindowWidth - 1, 90)
    $vers = @("v21", "v24")
    $vSel = 1   # default: v24

    while ($true) {
        [Console]::SetCursorPosition(0, 0)
        [Console]::Clear()

        Write-Host " Step 2/2 - Select nexacroN Version".PadRight($W) -ForegroundColor Black -BackgroundColor Cyan
        Write-Host ("-" * $W) -ForegroundColor DarkCyan
        Write-Host " [Up/Down]=Move  [1-2]=Jump  [Enter]=Confirm  [ESC]=Back to branch".PadRight($W) -ForegroundColor DarkGray
        Write-Host ("-" * $W) -ForegroundColor DarkCyan

        for ($i = 0; $i -lt $vers.Count; $i++) {
            $arrow = if ($i -eq $vSel) { ">" } else { " " }
            $row   = " $arrow [{0,3}]  $($vers[$i])" -f ($i + 1)
            if ($i -eq $vSel) {
                Write-Host $row.PadRight($W) -ForegroundColor Black -BackgroundColor Yellow
            } else {
                Write-Host $row.PadRight($W) -ForegroundColor White
            }
        }

        # fill blank lines
        for ($i = $vers.Count; $i -lt 5; $i++) { Write-Host (" " * $W) }

        Write-Host ("-" * $W) -ForegroundColor DarkCyan
        Write-Host " $($vSel+1)/$($vers.Count) items".PadRight($W) -ForegroundColor DarkGray

        $k = [Console]::ReadKey($true)
        switch ($k.Key) {
            "UpArrow"   { $vSel = [Math]::Max(0, $vSel - 1) }
            "DownArrow" { $vSel = [Math]::Min($vers.Count - 1, $vSel + 1) }
            "Enter"     { return $vers[$vSel] }
            "Escape"    { return $null }
            default {
                $ch = $k.KeyChar
                if ($ch -eq "1") { $vSel = 0 }
                elseif ($ch -eq "2") { $vSel = 1 }
            }
        }
    }
}

# ---- render -----------------------------------------------------------------
function Render {
    param(
        [object[]]$Items,
        [int]$Sel, [int]$Scroll, [int]$PageH,
        [string]$Repo, [string]$CurPath,
        [string]$Search, [string]$NumBuf, [bool]$SearchMode
    )

    $W = [Math]::Min([Console]::WindowWidth - 1, 90)

    [Console]::SetCursorPosition(0, 0)

    # header
    $header = " Git Branch Selector  |  Repo: $Repo"
    if ($header.Length -gt $W) { $header = $header.Substring(0, $W - 1) + "..." }
    Write-Host $header.PadRight($W) -ForegroundColor Black -BackgroundColor Cyan
    Write-Host ("-" * $W) -ForegroundColor DarkCyan

    # search / number input line
    if ($SearchMode) {
        Write-Host (" Search: " + $Search + "_").PadRight($W) -ForegroundColor Green
    } elseif ($NumBuf) {
        Write-Host (" Jump: #$NumBuf  (Enter to confirm)").PadRight($W) -ForegroundColor Yellow
    } else {
        Write-Host " [Letter]=Search  [0-9]=Jump  [Up/Down]=Move  [Enter]=Select  [ESC]=Exit".PadRight($W) -ForegroundColor DarkGray
    }

    # current path
    $pathLine = if ($CurPath) { " [DIR] $CurPath/" } else { " [ROOT]" }
    Write-Host $pathLine.PadRight($W) -ForegroundColor DarkYellow
    Write-Host ("-" * $W) -ForegroundColor DarkCyan

    # items
    $end = [Math]::Min($Scroll + $PageH, $Items.Count)
    for ($i = $Scroll; $i -lt $end; $i++) {
        $item  = $Items[$i]
        $numS  = "[{0,3}]" -f ($i + 1)
        $arrow = if ($i -eq $Sel) { ">" } else { " " }
        $label = $item.Name
        $maxL  = $W - 11
        if ($label.Length -gt $maxL) { $label = $label.Substring(0, $maxL - 1) + "..." }
        $row   = " $arrow $numS  $label"

        if ($i -eq $Sel) {
            Write-Host $row.PadRight($W) -ForegroundColor Black -BackgroundColor Yellow
        } else {
            $fg = switch ($item.Kind) {
                "up"    { "DarkGray" }
                "dir"   { "Cyan"     }
                default { "White"    }
            }
            Write-Host $row.PadRight($W) -ForegroundColor $fg
        }
    }
    for ($i = $end; $i -lt $Scroll + $PageH; $i++) {
        Write-Host (" " * $W)
    }

    Write-Host ("-" * $W) -ForegroundColor DarkCyan

    $total = $Items.Count
    $si    = if ($total -gt $PageH) { " | $($Scroll+1)-$end / $total" } else { "" }
    Write-Host " $($Sel+1)/$total$si   BackSpace=up/delete   PageUp/Down=page".PadRight($W) -ForegroundColor DarkGray
}

# ---- entry point ------------------------------------------------------------
if (-not (Test-Path $RepoPath)) {
    Write-Host ""
    Write-Host "[ERROR] Path not found: $RepoPath" -ForegroundColor Red
    Write-Host "        Check SourceDir in deploy_config.txt" -ForegroundColor DarkGray
    Start-Sleep -Seconds 2
    exit 1
}

$gitCheck = git -C "$RepoPath" rev-parse --is-inside-work-tree 2>$null
if ($LASTEXITCODE -ne 0) {
    Write-Host ""
    Write-Host "[ERROR] Not a git repository: $RepoPath" -ForegroundColor Red
    Write-Host "        Make sure a .git folder exists at this path." -ForegroundColor DarkGray
    Start-Sleep -Seconds 2
    exit 1
}

$all = @(Get-AllBranches $RepoPath)
if ($all.Count -eq 0) {
    Write-Host ""
    Write-Host "[ERROR] No branches found in: $RepoPath" -ForegroundColor Red
    Write-Host "        Run: git branch  or  git branch -r" -ForegroundColor DarkGray
    Start-Sleep -Seconds 2
    exit 1
}

$curPath    = ""
$search     = ""
$searchMode = $false
$numBuf     = ""
$sel        = 0
$scroll     = 0
$pageH      = [Math]::Max(8, [Console]::WindowHeight - 12)

[Console]::Clear()
[Console]::CursorVisible = $false
$script:backToBranch = $false

try {
    while ($true) {
        $filterStr = if ($searchMode) { $search } else { "" }
        $items = @(Get-Items -All $all -CurPath $curPath -Filter $filterStr)

        if ($items.Count -eq 0) { $sel = 0 }
        elseif ($sel -ge $items.Count) { $sel = $items.Count - 1 }
        if ($sel -lt $scroll)                  { $scroll = $sel }
        if ($sel -ge $scroll + $pageH)         { $scroll = $sel - $pageH + 1 }
        if ($scroll -lt 0) { $scroll = 0 }

        Render -Items $items -Sel $sel -Scroll $scroll -PageH $pageH `
               -Repo $RepoPath -CurPath $curPath `
               -Search $search -NumBuf $numBuf -SearchMode $searchMode

        $k = [Console]::ReadKey($true)

        switch ($k.Key) {
            "UpArrow"   { $numBuf = ""; $sel = [Math]::Max(0, $sel - 1) }
            "DownArrow" { $numBuf = ""; $sel = [Math]::Min([Math]::Max(0,$items.Count-1), $sel + 1) }
            "PageUp"    { $numBuf = ""; $sel = [Math]::Max(0, $sel - $pageH) }
            "PageDown"  { $numBuf = ""; $sel = [Math]::Min([Math]::Max(0,$items.Count-1), $sel + $pageH) }
            "Home"      { $numBuf = ""; $sel = 0 }
            "End"       { $numBuf = ""; $sel = [Math]::Max(0, $items.Count - 1) }

            "Enter" {
                $numBuf = ""
                if ($items.Count -eq 0) { break }
                $chosen = $items[$sel]
                switch ($chosen.Kind) {
                    "dir" {
                        $curPath    = $chosen.Full
                        $search     = ""
                        $searchMode = $false
                        $sel = 0; $scroll = 0
                    }
                    "up" {
                        $li      = $curPath.LastIndexOf('/')
                        $curPath = if ($li -ge 0) { $curPath.Substring(0, $li) } else { "" }
                        $search     = ""
                        $searchMode = $false
                        $sel = 0; $scroll = 0
                    }
                    "branch" {
                        $autoVersion    = $null
                        $autoVersionNum = $null

                        # --- Rule 1: well-known branch names → fixed version ---
                        if ($chosen.Full -ieq "master_21" -or $chosen.Full -ieq "main_21") {
                            $autoVersion = "v21"
                        } elseif ($chosen.Full -ieq "master" -or $chosen.Full -ieq "main") {
                            $autoVersion = "v24"
                        }

                        # --- Rule 2: RELEASE folder → extract version from branch name ---
                        # Branch format: REL_<YY.MM.DD.00>_<nexacro-version>[_AS]
                        # Date always ends with .00, so match structure precisely to avoid date/version confusion
                        if ($null -eq $autoVersion -and ($chosen.Full -imatch '(^|/)RELE?ASE?/')) {
                            $leaf = $chosen.Name

                            $m = [regex]::Match($leaf,
                                '^REL_\d+\.\d+\.\d+\.00_((?:21|24)\.\d+\.\d+\.\d+)(_AS)?$',
                                [System.Text.RegularExpressions.RegexOptions]::IgnoreCase)

                            if ($m.Success) {
                                $extractedVer = $m.Groups[1].Value
                                $hasAS        = $m.Groups[2].Success

                                if ($hasAS) {
                                    # _AS suffix: increment last component by 1
                                    $parts    = $extractedVer -split '\.'
                                    $parts[3] = [string]([int]$parts[3] + 1)
                                    $autoVersionNum = $parts -join '.'
                                } else {
                                    $autoVersionNum = $extractedVer
                                }

                                $autoVersion = if ($extractedVer.StartsWith("21.")) { "v21" } else { "v24" }
                            }
                        }

                        # --- Rule 3: SITE folder → version is at the END of the branch name ---
                        # Branch format: SITE_<name>_<version>[trailing _ or spaces]
                        if ($null -eq $autoVersion -and ($chosen.Full -imatch '(^|/)SITE/')) {
                            $leaf = $chosen.Name

                            # Extract last N.N.N.N starting with 21 or 24, ignore trailing _ or whitespace
                            $m = [regex]::Match($leaf,
                                '((?:21|24)\.\d+\.\d+\.\d+)[_\s]*$',
                                [System.Text.RegularExpressions.RegexOptions]::IgnoreCase)

                            if ($m.Success) {
                                $extractedVer   = $m.Groups[1].Value
                                $autoVersionNum = $extractedVer
                                $autoVersion    = if ($extractedVer.StartsWith("21.")) { "v21" } else { "v24" }
                            }
                        }

                        # --- Apply result ---
                        if ($autoVersion) {
                            [Console]::CursorVisible = $true
                            [Console]::Clear()
                            if ($autoVersionNum) {
                                Write-Host " Auto-selected: $autoVersion  version: $autoVersionNum  (branch: $($chosen.Full))" -ForegroundColor Green
                            } else {
                                Write-Host " Auto-selected: $autoVersion  (branch: $($chosen.Full))" -ForegroundColor Green
                            }
                            $version = $autoVersion
                        } else {
                            # Step 2: version selection UI
                            $version = Select-Version
                            if ($null -eq $version) {
                                # ESC in version screen -> back to branch selection
                                [Console]::CursorVisible = $false
                                $script:backToBranch = $true
                                break
                            }
                            [Console]::CursorVisible = $true
                            [Console]::Clear()
                        }

                        [System.IO.File]::WriteAllText($ResultFile,  $chosen.Full, [System.Text.Encoding]::UTF8)
                        [System.IO.File]::WriteAllText($VersionFile, $version,     [System.Text.Encoding]::UTF8)
                        if ($autoVersionNum) {
                            [System.IO.File]::WriteAllText($VersionNumFile, $autoVersionNum, [System.Text.Encoding]::UTF8)
                        }
                        exit 0
                    }
                }
                if ($script:backToBranch) { $script:backToBranch = $false; break }
            }

            "Backspace" {
                $numBuf = ""
                if ($searchMode -and $search.Length -gt 0) {
                    $search = $search.Substring(0, $search.Length - 1)
                    if ($search.Length -eq 0) { $searchMode = $false }
                    $sel = 0; $scroll = 0
                } elseif ($curPath) {
                    $li      = $curPath.LastIndexOf('/')
                    $curPath = if ($li -ge 0) { $curPath.Substring(0, $li) } else { "" }
                    $search     = ""
                    $searchMode = $false
                    $sel = 0; $scroll = 0
                }
            }

            "Escape" {
                $numBuf = ""
                if ($searchMode -or $search) {
                    $search     = ""
                    $searchMode = $false
                    $sel = 0; $scroll = 0
                } else {
                    [Console]::CursorVisible = $true
                    [Console]::Clear()
                    exit 1
                }
            }

            default {
                $ch = $k.KeyChar
                if ($ch -eq "`0" -or [char]::IsControl($ch)) { break }

                if ([char]::IsDigit($ch) -and -not $searchMode) {
                    $numBuf += $ch
                    $target  = [int]$numBuf - 1
                    if ($target -ge 0 -and $target -lt $items.Count) {
                        $sel = $target
                    } else {
                        $numBuf = [string]$ch
                        $t2     = [int]$numBuf - 1
                        $sel    = if ($t2 -ge 0 -and $t2 -lt $items.Count) { $t2 } else { $sel }
                    }
                } else {
                    $numBuf     = ""
                    $searchMode = $true
                    $search    += $ch
                    $sel = 0; $scroll = 0
                }
            }
        }
    }
} finally {
    [Console]::CursorVisible = $true
}
