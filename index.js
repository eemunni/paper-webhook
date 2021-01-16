const Discord = require("discord.js");
const bent = require("bent");
const fs = require("fs");

// Webhook config
let config = {
    // latest or specified version
    "version": "latest",
    // In minutes
    "interval": "15",
    "id": "",
    "token": "",
    "username": "PaperMC Updates",
    "avatar": "https://paper.readthedocs.io/en/latest/_images/papermc_logomark_500.png"
};

const webhook = new Discord.WebhookClient(config.id, config.token);

const init = async () => {
    async function getLatestBuild() {
        try {
            // Not the best way but it works haha
            if (config.version == "latest") {
                let latest = await bent("https://papermc.io/api/v2/projects/paper/", "GET", "json", 200)();
                config.version = latest.versions[latest.versions.length-1]
            };

            // Get latest build number from PaperMC API
            let builds = await bent(`https://papermc.io/api/v2/projects/paper/versions/${config.version}/`, "GET", "json", 200)();
            let data = await bent(`https://papermc.io/api/v2/projects/paper/versions/${config.version}/builds/${Math.max(...builds.builds)}/`, "GET", "json", 200)();
            
            // This is NOT the best way to do it but it works so ¯\_(ツ)_/¯
            if (data.changes.length === 0) {
                summary = "No changes"
            } else {
                summary = data.changes[0].summary
            };

            // Construct embed for new updates
            const embed = new Discord.MessageEmbed()
                .setTitle("New Paper build!")
                .setColor("#444444")
                .setThumbnail(config.avatar)
                .addFields(
                    { name: "Version:", value: `${data.version}` },
                    { name: "Build:", value: `${data.build}` },
                    { name: "Changes:", value: summary }
                )
                .setTimestamp()
                .setFooter("Powered by papermc.io API")

            // Store current build number so we don't send same build twice.
            let current = parseInt(fs.readFileSync("buildNum.txt", "utf-8"));
            let num = Math.max(...builds.builds)

            if (num > current) {
                // Write latest build number to file
                fs.writeFileSync("buildNum.txt", num.toString(), "utf-8");
                // Send webhook
                webhook.send("", {
                    username: config.username,
                    avatarURL: config.avatar,
                    embeds: [embed],
                });
            };
        // This shouldn't error but if paper API happens to be down we don't want that the webhook goes down :D
        } catch(err) {
            console.error("Error occured:\n" + err);
        };
    };
    // Fetch latest build as soon as webhook is initialized and after that every x minutes.
    getLatestBuild();
    setInterval(getLatestBuild, 1000*60*config.interval);
};
// Init the whole loop da loop
init();