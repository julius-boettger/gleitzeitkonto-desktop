# Gleitzeitkonto-Desktop

## Automatische Berechnung deiner Überstunden <br> als [Electron](https://www.electronjs.org/de/)-App für [Gleitzeitkonto-API](https://github.com/julius-boettger/gleitzeitkonto-api)

Entwickelt zur Verwendung in einem spezifischen Unternehmen, dessen Name aus Datenschutzgründen nicht erwähnt wird.

Da die zugrunde liegenden Berechnungen der Überstunden durch [Gleitzeitkonto-API](https://github.com/julius-boettger/gleitzeitkonto-api) erfolgen, **empfehle ich *wärmstens*, die [dortige Dokumentation](https://github.com/julius-boettger/gleitzeitkonto-api#gleitzeitkonto-api---automatische-berechnung-deiner-%C3%BCberstunden-mit-nodejs) zu lesen**.

# Inhaltsverzeichnis

- [Installation / Deinstallation (Windows)](#installation--deinstallation-windows)
    - [Automatisch (empfohlen)](#automatisch-empfohlen)
      - [Installation](#installation)
      - [Deinstallation](#deinstallation)
    - [Manuell](#manuell)
  - [Antivirus-Überprüfung überspringen](#antivirus-überprüfung-überspringen)
- [Updates](#updates)
- [Benutzung](#benutzung)

# Installation / Deinstallation (Windows)

- Neuste Version unter [Releases](https://github.com/julius-boettger/gleitzeitkonto-desktop/releases) herunterladen
- Heruntergeladene ZIP-Datei (in neuen, leeren Ordner) entpacken

### Automatisch (empfohlen)

#### Installation
- `setup.ps1` ausführen (Rechtklick => "Mit PowerShell ausführen")
    - Falls eine rote Fehler-Nachricht kommt:
        - Ausführen von Skripts erlauben:
            - Win+R drücken
            - `powershell` eingeben und Enter drücken
            - `Set-ExecutionPolicy RemoteSigned CurrentUser` eingeben und Enter drücken
                - Das Fenster danach offen lassen!
        - Nochmal `setup.ps1` ausführen (Rechtklick => "Mit PowerShell ausführen")
        - Ausführen von Skripts wieder verbieten:
            - Offenes PowerShell-Fenster von vorhin wieder aufrufen
            - `Set-ExecutionPolicy Undefined CurrentUser` eingeben und Enter drücken
            - Das Fenster schließen
- Fertig! Eine Verknüpfung sollte jetzt auf deinem Desktop sein.
    - Falls du das Programm nicht starten kannst: Lese [hier](#antivirus-überprüfung-überspringen) weiter

#### Deinstallation

- Win+R drücken
- `%AppData%\..\Local\Programs\gleitzeitkonto-desktop\` eingeben und Enter drücken
    - Es öffnet sich ein neues Explorer-Fenster mit dem Programm-Ordner, der eine Datei namens `uninstall.ps1` enthält
- Den gleichen Schritten wie bei der [Installation](#installation) folgen, nur mit `uninstall.ps1` anstatt `setup.ps1`

### Manuell

Ich gehe davon aus, dass du weißt, was du tust, also hier die Kurzfassung: Wahlweise...
- `setup.ps1` bearbeiten und nach deinen Ansprüchen konfigurieren
- Die "innere" ZIP-Datei entpacken und manuell EXE-Datei starten / Verknüpfungen erstellen

## Antivirus-Überprüfung überspringen

Beim Start des Programms nach der erfolgreichen Installation ist es *möglich*, dass eine Fehlermeldung auftritt. Diese entsteht dadurch, dass das Programm noch nicht vom Antivirus überprüft und zugelassen wurde. Eine solche Überprüfung passiert automatisch und kann leider einige Zeit dauern.

**Mit Admin-Rechten** kann allerdings diese langwierige Überprüfung des Programms durch den Antivirus übersprungen werden. Dafür sind folgende Schritte nötig:

- "Windows-Sicherheit" öffnen
- "Viren- & Bedrohungsschutz"
- Unter "Einstellungen für Viren- und Bedrohungsschutz": "Einstellungen verwalten"
- Unter "Ausschlüsse" (weit unten): "Ausschlüsse hinzufügen oder entfernen"
- "Ausschluss hinzufügen"
- "Ordner"
- Zu %AppData%\\..\\Local\\Programs\\ navigieren
- Ordner "gleitzeitkonto-desktop" auswählen
- "Ordner auswählen"
- Fertig! Der Antivirus ignoriert nun den Installations-Ordner und das Programm kann ausgeführt werden.

# Updates

Momentan sind noch keine automatischen Updates möglich.

Um von einer älteren Version auf eine neuere Version zu updaten musst du einfach nur die gewählte Version installieren (siehe [Installation](#installation--deinstallation-windows)), sie überschreibt dann die vorhandene Version.

# Benutzung

- Das Programm zeigt den aktuellen Stand deines Gleitzeitkontos an
- Der Stand lässt sich mit einem Klick auf den Aktualisierungsknopf oder mit den Shortcuts Enter, F5 oder Strg+R aktualisieren
    - Die Aktualisierung kann nur erfolgreich ausgeführt werden, wenn Zugriff auf das interne Fiori möglich ist, du also per Office (W)LAN oder VPN verbunden bist
- Beim Start wird der zuletzt-geladene Stand angezeigt, der dann einmalig automatisch aktualisiert wird
- Mit der Config-Datei (unter `%AppData%\gleitzeitkonto-desktop\gleitzeitconfig.json`) lassen sich Werte wie deine Arbeitsstunden in der Woche oder das zu betrachtene Intervall verändern, mehr dazu [hier](https://github.com/julius-boettger/gleitzeitkonto-api#config-datei)
