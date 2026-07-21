$destZip = $env:PSCOMPRESS_DST
if (-not $destZip) { throw "PSCOMPRESS_DST not set" }

$sourcePaths    = @()
$includeRootName = $false

if ($env:PSCOMPRESS_SRCS) {
    $sourcePaths    = ($env:PSCOMPRESS_SRCS -split '\|') | ForEach-Object { $_.Trim() }
    $includeRootName = $true
} elseif ($env:PSCOMPRESS_SRC) {
    $sourcePaths    = @($env:PSCOMPRESS_SRC.Trim())
    $includeRootName = $false
} else {
    throw "Neither PSCOMPRESS_SRCS nor PSCOMPRESS_SRC is set"
}

Add-Type -AssemblyName 'System.IO.Compression'
Add-Type -AssemblyName 'System.IO.Compression.FileSystem'

if (Test-Path $destZip) { Remove-Item $destZip -Force }

$zip = [System.IO.Compression.ZipFile]::Open($destZip, [System.IO.Compression.ZipArchiveMode]::Create)

try {
    foreach ($src in $sourcePaths) {
        $src = $src.TrimEnd('\')
        if (-not (Test-Path $src)) { Write-Host "[WARN] Source not found: $src"; continue }

        $destZipFull = [System.IO.Path]::GetFullPath($destZip)
        $files = Get-ChildItem $src -Recurse -File
        foreach ($file in $files) {
            if ($file.FullName -ieq $destZipFull) { continue }
            $rel = $file.FullName.Substring($src.Length + 1).Replace('\', '/')
            if ($includeRootName) {
                $folderName = Split-Path $src -Leaf
                $rel = "$folderName/$rel"
            }
            $entry = $zip.CreateEntry($rel, [System.IO.Compression.CompressionLevel]::Optimal)
            $fs = [System.IO.File]::Open(
                $file.FullName,
                [System.IO.FileMode]::Open,
                [System.IO.FileAccess]::Read,
                [System.IO.FileShare]::ReadWrite
            )
            try {
                $es = $entry.Open()
                $fs.CopyTo($es)
                $es.Dispose()
            } finally {
                $fs.Dispose()
            }
        }
    }
} finally {
    $zip.Dispose()
}

Write-Host "[INFO] zip created: $destZip"
