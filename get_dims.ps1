Add-Type -AssemblyName System.Drawing
$img = [System.Drawing.Image]::FromFile('d:\vhost\aaaa\src\assets\against-retro-camera.png')
Write-Output "Width: $($img.Width)"
Write-Output "Height: $($img.Height)"
$img.Dispose()
