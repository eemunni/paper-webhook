const bent = require("bent");
const fs = require("fs");

if(!fs.existsSync("purpurBuildNum.txt")) fs.writeFileSync("purpurBuildNum.txt", "0", "utf-8");

module.exports = async () => {
    try {
        let data = await bent("https://ci.pl3x.net/job/Purpur/api/json/", "GET", "json", 200)();
        let latestBuild = data.lastBuild.number
    
        let current = parseInt(fs.readFileSync("purpurBuildNum.txt", "utf-8"));
        if (latestBuild > current) {
            let { building, changeSet, result } = await bent(`https://ci.pl3x.net/job/Purpur/${latestBuild}/api/json/`, "GET", "json", 200)();
            if (building === true) {
                return null;
        } else {
            let summary = changeSet.items[0].msg
            fs.writeFileSync("purpurBuildNum.txt", latestBuild.toString(), "utf-8");
            return {
                latestBuild, summary, result,
                link: `https://ci.pl3x.net/job/Purpur/${latestBuild}/artifact/final/purpurclip-${latestBuild}.jar`
            };
        };
      
        } else {
            return null;
        };
    } catch(err) {
        console.error("Error occured:\n" + err);
        return null;
    };
};