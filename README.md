WWJD 'What would Jesus do' Bot will send a bible verse based on emotion. Below is a setup on how to create a bit from scratch.

>>>>>>> develop
# Discord Node Chat Bot Template

A simple Discord bot made with Node.js

## Prerequisites

Install [Node.js](https://nodejs.org/en/download/)

## Getting started

Install the project dependencies: `npm install`

Create a Discord bot
 - Create a new bot using the [Developer Portal](https://discordapp.com/developers/applications/) ([Instructions](https://discordjs.guide/preparations/setting-up-a-bot-application.html))
 - Copy the bot token
 - Set the `token` property in the `CONFIG` object

Add your bot to a server
 - Create an invite link for your bot ([Instructions](https://discordjs.guide/preparations/adding-your-bot-to-servers.html))
 - Send your invite link to the server owner and have them grant access to the bot

Add your bot to the #general channel
 - Ask the server owner for the channel ID of the `#general` channel ([Instructions for getting the channel ID](https://github.com/5andr0/PogoLocationFeeder/issues/64))
 - Set the `general` property in the `CONFIG` object

*This is the CONFIG object mentioned above:*

    // Config properties
    const CONFIG = {
        token: process.env.BOT_TOKEN,
        channels: {
            general: "GENERAL CHANNEL ID GOES HERE",
        },
    };
NOTE: The token is stored inside an .env file.
## Dependencies

    "chalk": "^4.1.0",
    "discord.js": "^12.3.1",
    "node": "^14.8.0"
