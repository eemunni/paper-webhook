require("dotenv").config();

const config = {
    // Which server software updates you want to receive
    "paper": true,
    "purpur": true,
    // Time between checks if new build is available.
    // In minutes
    "interval": "15",
    // Webhook id and token
    "id": process.env.webhook_id,
    "token": process.env.webhook_token,
    // Webhook's username and avatar
    "username": "Server Software Updates",
    "avatar": ""
};

module.exports = config;