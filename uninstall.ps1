### Uninstalls Gleitzeitkonto-Desktop ###

Write-Host "Starte Deinstallation..." -ForegroundColor Green
""

# big try-catch because i don't know what will go wrong :)
try {

$ShortcutPath = "$env:APPDATA\Microsoft\Windows\Start Menu\Programs\Gleitzeitkonto Desktop.lnk"
# must end on "\"
$ProgramFolder = "$env:LOCALAPPDATA\Programs\gleitzeitkonto-desktop\"
$RoamingFolder = "$env:APPDATA\gleitzeitkonto-desktop\"

# delete program folder if it exists
if (Test-Path $ProgramFolder) {
    "Lösche Programm-Ordner..."
    # empty folder (for some reason this is possible although this (currently running) script is in it)
    # the actual folder will stay, it cannot be deleted as it is in use
    Remove-Item "$ProgramFolder*" -Recurse -Force
    Write-Host "Programm-Ordner gelöscht." -ForegroundColor Green
} else {
    "Programm-Ordner konnte nicht gelöscht werden, da er nicht existiert:"
    $ProgramFolder
}

""

# delete roaming folder if it exists
if (Test-Path $RoamingFolder) {
    "Lösche Roaming-Ordner..."
    Remove-Item $RoamingFolder -Recurse -Force
    Write-Host "Roaming-Ordner gelöscht." -ForegroundColor Green
} else {
    "Roaming-Ordner konnte nicht gelöscht werden, da er nicht existiert:"
    $RoamingFolder
}

""

# delete shortcut if it exists
if (Test-Path $ShortcutPath) {
    "Lösche Shortcut..."
    Remove-Item $ShortcutPath -Force
    Write-Host "Shortcut gelöscht." -ForegroundColor Green
} else {
    "Shortcut konnte nicht gelöscht werden, da er nicht existiert:"
    $ShortcutPath
}

""
Write-Host "Deinstallation abgeschlossen." -ForegroundColor Green
    
} catch {

Write-Host "Ein unerwarteter Fehler ist aufgetreten:" -ForegroundColor Red
# print error message
$_

} finally {

# give user time to read
""
Pause

}
