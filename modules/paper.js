const bent = require("bent");
const fs = require("fs");

if(!fs.existsSync("paperBuildNum.txt")) fs.writeFileSync("paperBuildNum.txt", "0", "utf-8");

module.exports = async () => {
    try {
        let { versions } = await bent("https://papermc.io/api/v2/projects/paper/", "GET", "json", 200)();
        latestVer = versions[versions.length - 1]

        let { builds } = await bent(`https://papermc.io/api/v2/projects/paper/versions/${latestVer}/`, "GET", "json", 200)();
        let latest = Math.max(...builds)
        let current = parseInt(fs.readFileSync("paperBuildNum.txt", "utf-8"));

        if (latest > current) {
            let { version, build, changes } = await bent(`https://papermc.io/api/v2/projects/paper/versions/${latestVer}/builds/437/`, "GET", "json", 200)();
            let summary = changes.length ? changes.map((v,i) => `${i+1}. ${v.summary} `).join("\n") : "No changes";
            fs.writeFileSync("paperBuildNum.txt", latest.toString(), "utf-8");
            return {
                version, build, summary,
                link: `https://papermc.io/api/v2/projects/paper/versions/${latestVer}/builds/${latest}/downloads/paper-${latestVer}-${latest}.jar`
            };
        } else {
            return null;
        };
    } catch (err) {
        console.error("Error occured:\n" + err);
        return null;
    };
};