$ErrorActionPreference = "Stop"

$serverBase = "http://59.10.169.82:9900"
$baseUrl    = "$serverBase/NexacroN/serverN/Deploy_JAVA/%EB%B6%84%EB%A6%AC_Jar/"
$jarDir  = $env:PSJAR_DIR

if (-not $jarDir) { throw "[Error] PSJAR_DIR environment variable is not set." }

# [0] Initialize Jar folder
Write-Host "[0] Initializing Jar folder: $jarDir"
if (Test-Path $jarDir) {
    Get-ChildItem $jarDir -Recurse -Force | Remove-Item -Recurse -Force
} else {
    New-Item -ItemType Directory -Path $jarDir | Out-Null
}

# [1] Find latest year folder (href is full path: /NexacroN/.../2026/)
Write-Host "[1] Finding latest year folder..."
$page = (Invoke-WebRequest -Uri $baseUrl -UseBasicParsing).Content
$yearMatches = [regex]::Matches($page, 'href="[^"]+/(\d{4})/"', [System.Text.RegularExpressions.RegexOptions]::IgnoreCase)
if ($yearMatches.Count -eq 0) { throw "No year folders found at $baseUrl" }
$latestYear = $yearMatches |
    ForEach-Object { $_.Groups[1].Value } |
    Sort-Object -Descending |
    Select-Object -First 1
$yearUrl = "$serverBase/NexacroN/serverN/Deploy_JAVA/%EB%B6%84%EB%A6%AC_Jar/$latestYear/"
Write-Host "   Latest year: $latestYear"

# [2] Find latest file (.zip or .jar) — href is full path, prepend serverBase
Write-Host "[2] Finding latest file..."
$yearPage = (Invoke-WebRequest -Uri $yearUrl -UseBasicParsing).Content
$fileMatches = [regex]::Matches($yearPage, 'href="([^"]+\.(zip|jar))"', [System.Text.RegularExpressions.RegexOptions]::IgnoreCase)
if ($fileMatches.Count -eq 0) { throw "No zip/jar files found at $yearUrl" }
$latestFileHref = $fileMatches |
    ForEach-Object { $_.Groups[1].Value } |
    Sort-Object -Descending |
    Select-Object -First 1
$fileUrl = "$serverBase$latestFileHref"
Write-Host "   Latest file: $($latestFileHref.Split('/')[-1])"

# [3] Download
$downloadPath = Join-Path $jarDir "download.zip"
Write-Host "[3] Downloading: $fileUrl"
Invoke-WebRequest -Uri $fileUrl -OutFile $downloadPath -UseBasicParsing

# [4] First extraction -> level1
$level1 = Join-Path $jarDir "level1"
Write-Host "[4] Extracting to level1..."
New-Item -ItemType Directory -Path $level1 -Force | Out-Null
Expand-Archive -Path $downloadPath -DestinationPath $level1 -Force
Remove-Item $downloadPath -Force

# [5] Second extraction (handle double-zipped packages)
Write-Host "[5] Processing nested archives..."
$nestedZips = Get-ChildItem $level1 -Filter "*.zip"
if ($nestedZips) {
    foreach ($z in $nestedZips) {
        Write-Host "   Extracting nested: $($z.Name)"
        Expand-Archive -Path $z.FullName -DestinationPath $jarDir -Force
    }
    # Move non-zip files (.json etc.) to Jar root
    Get-ChildItem $level1 -Exclude "*.zip" | ForEach-Object {
        Move-Item -Path $_.FullName -Destination $jarDir -Force
    }
} else {
    Get-ChildItem $level1 | ForEach-Object {
        Move-Item -Path $_.FullName -Destination $jarDir -Force
    }
}

# [6] Cleanup temp folder
Write-Host "[6] Cleaning up temporary files..."
Remove-Item $level1 -Recurse -Force

# [7] Flatten single NexacroN_Deploy_JAVA_ subfolder
$subFolders = Get-ChildItem $jarDir -Directory | Where-Object { $_.Name -like "NexacroN_Deploy_JAVA_*" }
$rootFiles  = Get-ChildItem $jarDir -File
if ($subFolders.Count -eq 1 -and $rootFiles.Count -eq 0) {
    Write-Host "[7] Flattening subfolder: $($subFolders[0].Name)"
    Get-ChildItem $subFolders[0].FullName | ForEach-Object {
        Move-Item -Path $_.FullName -Destination $jarDir -Force
    }
    Remove-Item $subFolders[0].FullName -Recurse -Force
} else {
    Write-Host "[7] Subfolder flatten skipped."
}
