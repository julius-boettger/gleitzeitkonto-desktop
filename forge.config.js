// electron forge configuration

const fs = require("fs");
// get access to package.json
const packageJSON = require("./package.json");

module.exports = {
    packagerConfig: {
        asar: true,
        icon: "./frontend/icons/icon",
        win32metadata: {FileDescription: packageJSON.description},
        ignore: path => { // "IgnoreFunction": returns true if file should be ignored
            // ignore file if path contains one of these strings
            const ignoreStrings = [
                // every path starts with a / and is relative to root directory
                "/out",
                "/.gitignore",
                "/forge.config.js",
                "/setup.ps1",
                "/package-lock.json",
                "/README.md"
            ];
            for (let string of ignoreStrings) {
                if (path.includes(string))
                    return true;
            }
            return false;
        }
    },
    hooks: {
        /** runs before electron-forge make, console.log() doesn't work...? */
        preMake: () => {
            // delete outputs of old make-commands
            fs.rmSync("./out/make/", { recursive: true, force: true });
        },
        /** runs after electron-forge make, console.log() doesn't work...? */
        postMake: () => {
            const admZip = require("adm-zip");

            const makeDir = "./out/make/zip/win32/x64/";
            const installScriptPath = "./setup.ps1";
            const outputDir = "./out/";
            const deleteDir = "./out/make/";

            // create new zip
            let zip = new admZip();
            // add installation script
            zip.addLocalFile(installScriptPath);
            // get zip file name and add it to zip
            const zipFileName = fs.readdirSync(makeDir).filter(file => file.includes(".zip"))[0];
            zip.addLocalFile(makeDir + zipFileName);
            // save zip
            zip.writeZip(outputDir + zipFileName.substring(0, zipFileName.length - 4) + "-setup.zip");
            // delete directory
            fs.rmSync(deleteDir, { recursive: true, force: true });
        }
    },
    makers: [{name: "@electron-forge/maker-zip"}]
}
