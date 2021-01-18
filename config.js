require("dotenv").config();
const config = {
    // Latest or specified version
    "version": "latest",
    // In minutes
    "interval": "15",
    // Webhook id and token
    "id": process.env.webhook_id,
    "token": process.env.webhook_token,
    // Webhook username and avatar
    "username": "PaperMC Updates",
    "avatar": "https://paper.readthedocs.io/en/latest/_images/papermc_logomark_500.png"
};

module.exports = config;