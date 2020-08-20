/**
 *  app.js
 *
 *  Discord bot template.
 */

/*******************
 * Library Imports *
 *******************/
var verses = require('./verses.js');
require('dotenv').config();
const colors = require("chalk");
const Discord = require("discord.js");

/*********************
 * Global Properties *
 *********************/

// Config properties
const CONFIG = {
    // Bot token
    token: process.env.BOT_TOKEN,
    // Channel IDs
    channels: {
        general: "",
    },
    // Activity shown when the bot appears 'online'
    defaultActivity: {
        type: "LISTENING", // Activity types: 'PLAYING', 'STREAMING', 'LISTENING', 'WATCHING'
        message: "Psalms",
    },
};

/*************
 * Functions *
 *************/

/**
 *  Handle a command from a Discord user.
 *
 *  @param  {Object}    msg         The message object.
 *  @param  {String}    command     The `commandName` part of the message.
 *  @param  {Array}     args        The optional list of arguments from the message.
 *
 *  @note - Discord messages which are treated as commands are expected to look like: "!commandName arg1 arg2 arg3".
 */
function handleCommand(msg, cmd, args) {
    const channel = msg.channel;
    console.log('msg');
    switch (cmd) {
        case "test":
            channel.send("1...");
            channel.send("2...");
            channel.send("3!");
            break;
        default:
            msg.reply(
                `You used the command '!${cmd}' with these arguments: [${args.join(
                    ", "
                )}]`
            );
            break;
    }
}

/**
 *  Print a Discord message to the console with colors for readability.
 *
 *  @param  {Object}     msg     The message object.
 */
function logMessageWithColors(msg) {
    const d = new Date(msg.createdTimestamp),
        h = d.getHours(),
        m = d.getMinutes(),
        s = d.getSeconds(),
        time = colors.grey(`[${h}:${m}:${s}]`),
        author = colors.cyan(`@${msg.author.username}`);

    console.log(`${time} ${author}: ${msg.content}`);
}

/**************************
 * Discord Initialization *
 **************************/

const client = new Discord.Client();

// Handle bot connected to the server
client.on("ready", () => {
    console.log(colors.green(`Logged in as: ${client.user.tag}`));

    // Set the bot's activity
    client.user
        .setActivity(CONFIG.defaultActivity.message, {
            type: CONFIG.defaultActivity.type,
        })
        .then();

    // Join the 'general' channel
    client.channels.fetch(CONFIG.channels.general).then((channel) => {
        channel.send("Discord bot has joined the channel");
        console.log(
            colors.yellow(`Joined a channel: ${colors.yellow(channel.name)}`)
        );
    });
});

// Handle message from user
client.on("message", (msg) => {
    logMessageWithColors(msg);

    // Message is a command (preceded by an plus mark)
    if (msg.content[0] === "+") {
        let words = msg.content.split(" "),
            cmd = words.shift().split("+")[1], // First word, sans plus mark
            args = words; // Everything after first word as an array

        handleCommand(msg, cmd, args);
        return;
    }

    // Handle messages that aren't commands
    if (msg.content === "ping") {
        msg.reply("pong");
    }
});

// Login with the bot's token
client.login(CONFIG.token).then();
