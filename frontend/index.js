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

    // send message to backend when button is pressed or when ENTER, F5 or CTRL+R are pressed
    refreshBtn.addEventListener("click", tryToRefresh);
    window.addEventListener("keydown", event => {
        if (event.key == "F5" || event.key == "Enter") tryToRefresh();
    });
    window.addEventListener("keypress", event => {
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
