/** opens chromium dev tools for frontend browser window and enables further logging */
const DEBUG = false;

const fs = require("fs");
const path = require("path");
const packageJSON = require("./package.json");
const { app, shell, BrowserWindow, Menu, ipcMain, Notification } = require("electron");

// disable hardware acceleration to prevent weird electron warnings on windows 10
app.disableHardwareAcceleration();

// close app properly
app.on("window-all-closed", () => {
    if (process.platform !== "darwin") app.quit();
});

// path to roaming directory of this app
const roamingDir = path.join(process.env.APPDATA, "gleitzeitkonto-desktop");
// create roaming directory if it doesn't exist
if (!fs.existsSync(roamingDir)) fs.mkdirSync(roamingDir);

// import and setup gleitzeitkonto api
const GleitzeitkontoAPI = require("./gleitzeitkonto-api").default;
const configPath = path.join(roamingDir, "gleitzeitconfig.json");
const downloadDir = roamingDir;
const gzk = new GleitzeitkontoAPI(
    downloadDir,
    "working_times.csv",
    configPath,
    require("./url.json"),
    DEBUG
);

/**
 * calculates overtime from local csv file and sends the result to frontend
 * @param window electron browser window
 */
const updateFrontend = window => {
    const data = gzk.calculateFromWorkingTimes();
    console.log("processed table.csv:", data);
    // dont send anything when calculation failed
    if (data != undefined) {
        console.log("sending data to frontend...");
        window.webContents.send("message", {
            type: "update",
            kontoString: data.kontoString,
            lastDate: data.lastDate
        });
    } else console.log("overtime calculation returned undefined, not sending to frontend");
}

/**
 * downloads new csv file, updates frontend (or sends error notification) and enables button
 * @param window electron browser window
 */
const refreshData = async window => {
    console.log("starting webscraper...");

    const status = await gzk.downloadWorkingTimes();
    console.log("webscraped csv file: statuscode " + status);

    switch (status) {
        // everything went fine, the renamed csv file is in the download directory
        case 0:
            updateFrontend(window);
            break;
        // browser could not be launched (probably due to an incorrect path to its executable or unsupported browser)
        case 1:
            new Notification({ title: "Ungültiger Browser (-Pfad?)", body: `Config Datei bearbeiten und "browserPfad" auf einen Pfad zur ausführbaren Datei eines unterstützten Browsers ändern, dann Programm neustarten (${configPath})` }).show();
            break;
        // fiori couldnt be opened (either no connection at all or not in correct network)
        case 2:
            new Notification({ title: "Fiori nicht erreicht", body: "Du hast entweder keine Internetverbindung oder bist nicht im richtigen Netz (LAN oder Office)" }).show();
            break;
        // more than two csv files in download directory (user must have put more in there)
        case 3:
            new Notification({ title: "Zu viele CSV-Dateien", body: `Im Download-Ordner sind mehr als zwei CSV-Dateien, lösche alle und versuche es erneut (${downloadDir})` }).show();
            break;
        // the download failed for an unknown reason (happens when config.startDatum is later than config.endDatum)
        case 4:
            new Notification({ title: "Arbeitszeiten-Download fehlgeschlagen", body: `Vielleicht ist startDatum später als endDatum in der Config Datei? (${configPath})` }).show();
            break;
    }

    // enable button
    window.webContents.send("message", {type: "enableButton"});
}

/** creates electron browser window */
const createWindow = () => {
    
    // initialize browser window
    const win = new BrowserWindow({
        // initialize window hidden
        show: false,
        // preload javascript to give it access to electron
        // has to use path.join with __dirname for some reason, path.resolve doesn't work
        webPreferences: { preload: path.join(__dirname, "frontend", "index.js") },

        title: "Gleitzeitkonto-Desktop",
        maximizable: false,
        resizable: false,
        height: 250,
        width: 450
    });

    // show window once fully loaded
    win.once("ready-to-show", () => win.show());

    // show index.html in frontend
    // has to use path.join with __dirname for some reason, path.resolve doesn't work
    win.loadURL(path.join(__dirname, "frontend", "index.html"));

    // create invisible menu bar to make standard shortcuts like ctrl+c work
    win.setMenuBarVisibility(false);
    win.setMenu(Menu.buildFromTemplate([
        { role: "copy" }, // ctrl+c
        { role: "selectAll" } // ctrl+a
    ]));

    // open links in frontend in default browser (instead of electron browser)
    win.webContents.setWindowOpenHandler(({ url }) => {
        shell.openExternal(url);
        // deny attempt to open electron browser
        return { action: "deny" };
    });

    // open dev tools
    if (DEBUG) win.webContents.on("dom-ready", event => win.webContents.openDevTools({mode:"detach"}));

    // react to messages from frontend
    ipcMain.on("message", (event, message) => {
        console.log("message from frontend:", message);
        switch (message) {
            // download and display new data
            case "refresh":
                refreshData(win);
                break;
            // send notification with current version
            case "version":
                new Notification({ title: "Version: v" + packageJSON.version, body: "Deine aktuelle Version von Gleitzeitkonto-Desktop ist v" + packageJSON.version }).show();
                break;
        }  
    });

    // download new csv file and update frontend again (asynchronous)
    refreshData(win);
    // update frontend with local csv file (synchronous)
    updateFrontend(win);
}

// create browser window when app starts or activates with no windows
app.whenReady().then(createWindow);
app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
});
