param([string]$JsonFile)
if (-not (Test-Path $JsonFile)) { exit 0 }
$c = Get-Content $JsonFile -Raw -Encoding UTF8
if (-not $c) { exit 0 }
$m = [regex]::Match($c, '"version"\s*:\s*"([^"]+)"')
if ($m.Success) { $m.Groups[1].Value }
