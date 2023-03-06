// to communicate with backend
const { ipcRenderer } = require("electron")

// execute once html document is fully loaded
window.addEventListener("DOMContentLoaded", () => {

    const enableButton = () => {
        refreshIcon.style.animationPlayState = "";
        refreshBtn.classList.remove("disabled");
        buttonEnabled = true;
    }

    const disableButton = () => {
        refreshIcon.style.animationPlayState = "running";
        refreshBtn.classList.add("disabled");
        buttonEnabled = false;
    }

    const tryToRefresh = () => {
        // if backend is not refreshing already
        if (buttonEnabled) {
            // disable button to stop refreshing until current process is done
            disableButton();
            // send message to backend to start refreshing
            ipcRenderer.send("message", "refresh");
        }
    }

    const refreshIcon = document.getElementById("refresh-icon");
    const refreshBtn = document.getElementById("refresh-btn");
    let buttonEnabled = false;

    // disable button on startup as backend is already refreshing
    disableButton();

    // send message to backend to refresh when button is pressed
    refreshBtn.addEventListener("click", tryToRefresh);
    window.addEventListener("keydown", event => {
        // send message to backend to refresh when ENTER or F5 is pressed
        if (event.key == "F5" || event.key == "Enter") tryToRefresh();
        // send message to backend to notify user about version when V is pressed
        else if (event.key == "v") ipcRenderer.send("message", "version");
        // open github documentation when F1 is pressed
        else if (event.key == "F1") window.open("https://github.com/julius-boettger/gleitzeitkonto-desktop#gleitzeitkonto-desktop", "_blank");;
    });
    window.addEventListener("keypress", event => {
        // send message to backend to refresh when CTRL+R is pressed
        if (event.key == "\x12" /* CTRL+R */) tryToRefresh();
    });

    // receive messages from backend
    const gleitzeitkonto = document.getElementById("gleitzeitkonto");
    const lastupdated = document.getElementById("lastupdated");
    ipcRenderer.on("message", (event, message) => {
        // if message is defined
        if (message != undefined && message.type != undefined) {
            // react to different types of messages
            switch (message.type) {
                // update gleitzeitkonto und lastupdated
                case "update":
                    gleitzeitkonto.innerText = message.kontoString;
                    lastupdated.innerText = "Stand " + message.lastDate;
                    break;
                // unlock button
                case "enableButton":
                    enableButton();
                    break;
            }
        };
    });
});
