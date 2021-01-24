const { WebhookClient, MessageEmbed } = require("discord.js");
const getPurpur = require("./modules/purpur.js");
const getPaper = require("./modules/paper.js");
const config = require("./config.js");

// Initialize new webhook
const webhook = new WebhookClient(config.id, config.token);

const init = async () => {
    // Paper new build checker
    async function getLatestPaperBuild() {
        if (config.paper === true) {
            let paper = await getPaper();
            if (paper != null) {
                let paperEmbed = new MessageEmbed()
                    .setTitle("New Paper build!")
                    .setColor("#444444")
                    .setThumbnail("https://paper.readthedocs.io/en/latest/_images/papermc_logomark_500.png")
                    .addFields(
                        { name: "Version:", value: paper.version },
                        { name: "Build:", value: paper.build },
                        { name: "Changes:", value: paper.summary },
                        { name: "Download:", value: `[Link](${paper.link})` }
                    )
                    .setTimestamp()
                    .setFooter("Powered by papermc.io API")
                webhook.send("", {
                    username: config.username,
                    avatarURL: config.avatar,
                    embeds: [paperEmbed]
                });
            } 
        }
    } getLatestPaperBuild();
    setInterval(getLatestPaperBuild, 1000*60*config.interval);

    // Purpur new build checker
    async function getLatestPurpurBuild() {
        if (config.purpur === true) {
            let purpur = await getPurpur();
            if (purpur != null) {
                let purpurEmbed = new MessageEmbed()
                    .setTitle("New Purpur build!")
                    .setColor("#444444")
                    .setThumbnail("https://purpur.pl3x.net/images/purpur-small.png")
                    .addFields(
                        { name: "Build result:", value: purpur.result.toLowerCase() },
                        { name: "Build:", value: purpur.latestBuild },
                        { name: "Changes:", value: purpur.summary },
                        { name: "Download:", value: `[Link](${purpur.link})` }
                    )
                    .setTimestamp()
                    .setFooter("Powered by Purpur CI API")
                webhook.send("", {
                    username: config.username,
                    avatarURL: config.avatar,
                    embeds: [purpurEmbed]
                });
            }
        }    
    } getLatestPurpurBuild();
    setInterval(getLatestPurpurBuild, 1000*60*config.interval);
};
// Init the whole loop da loop
init();