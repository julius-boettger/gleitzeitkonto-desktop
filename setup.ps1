### Installs gleitzeitkonto-desktop-...X.X.X.zip when it is in the same directory as this script ###

Write-Host "Starte Installation..." -ForegroundColor Green
""

# big try-catch because i don't know what will go wrong :)
try {

$ShortcutPath = "$env:APPDATA\Microsoft\Windows\Start Menu\Programs\Gleitzeitkonto Desktop.lnk"
# must end on "\"
$InstallationFolder = "$env:LOCALAPPDATA\Programs\gleitzeitkonto-desktop\"

# get names of zip files in current folder as array list
$ZipFileNames = [System.Collections.ArrayList]@(Get-ChildItem "*.zip" | Select-Object -ExpandProperty Name)

# loop through all names of zip files
for ($i = 0; $i -lt $ZipFileNames.count; $i++) {
    # if file name does not match regex
    if (!($ZipFileNames[$i] -match "gleitzeitkonto-desktop-.*\d[.]\d[.]\d[.]zip")) {
        # remove it
        $ZipFileNames.removeAt($i)
        $i--
    }
}

# get last element of zip file names (biggest version number)
$ZipFileName = ""
if ($ZipFileNames.count -ne 0) {
    $ZipFileName = $ZipFileNames[-1]
}

# true if there is no matching zip file
if ("$ZipFileName" -eq "") {
    Write-Host "Installation fehlgeschlagen." -ForegroundColor Red
    'Dieses Skript (setup.ps1) muss sich im selben Ordner befinden wie eine ZIP-Datei die etwa "gleitzeitkonto-desktop-win32-x64-1.0.0" heißt.'
    "Sie wurde zusammen mit diesem Skript heruntergeladen."
    "Bitte bewege dieses Skript und die genannte ZIP-Datei in einen gemeinsamen Ordner und versuche es erneut."
    # stop process
    Exit
}

# create installation folder if it doesnt exist
if (Test-Path $InstallationFolder) {
    "Installations-Ordner existiert bereits."
} else {
    "Erstelle Installations-Ordner..."
    # make new directory and suppress output
    [void](New-Item $InstallationFolder -ItemType Directory)
    Write-Host "Installations-Ordner erstellt." -ForegroundColor Green
}

# empty installation folder if its not empty
if (Test-Path "$InstallationFolder*") {
    ""
    "Es befinden sich bereits Dateien im Installations-Ordner."

    ""

    "Deinstalliere alte Version..."
    Remove-Item "$InstallationFolder*" -Recurse -Force
    Write-Host "Alte Version deinstalliert." -ForegroundColor Green
}

""

# extract zip file into installation folder
"Entpacke Programm in Installations-Ordner..."
Expand-Archive $ZipFileName -DestinationPath $InstallationFolder
Write-Host "Programm entpackt." -ForegroundColor Green

""

"Erstelle Shortcuts..."

# create shortcut for use in start menu and stuff
$WshShell = New-Object -comObject WScript.Shell
$Shortcut = $WshShell.CreateShortcut($ShortcutPath)
$Shortcut.TargetPath = -join($InstallationFolder, "gleitzeitkonto-desktop.exe")
$Shortcut.WorkingDirectory = $InstallationFolder
$Shortcut.Save()

# copy shortcut to desktop
Copy-Item $ShortcutPath -Destination ([Environment]::GetFolderPath("Desktop"))
Write-Host "Shortcuts erstellt." -ForegroundColor Green

""

Write-Host "Installation abgeschlossen." -ForegroundColor Green

} catch {

Write-Host "Ein unerwarteter Fehler ist aufgetreten:" -ForegroundColor Red
# print error message
$_

} finally {

# give user time to read
""
Pause

}
