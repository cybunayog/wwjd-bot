/**
 *  app.js
 *
 *  Discord bot template.
 */

/*******************
 * Library Imports *
 *******************/
require('dotenv').config();
const colors = require("chalk");
const Discord = require("discord.js");

/*******************
 * API Handling *
 *******************/
const request = require('request');

function callAPI(query) {
    const options = {
        'method': 'GET',
        'url': `https://api.scripture.api.bible/v1/bibles/de4e12af7f28f599-01/search?query=${query}`,
        'headers': {
            'api-key': process.env.BIBLE_API_TOKEN,
        }
    };
    return new Promise((resolve, reject) => {
        request(options, function (error, response) {
            if (error) return reject(error);
            try {
                const apiResponse = resolve(JSON.parse(response.body));
                return apiResponse;
            } catch (e) {
                reject("callAPI() error: " + e);
            }
        });
    });

}

function fetchVerses(query) {
    let verseData = callAPI(query)
        .then(res => {
            var data = res.data;
            return data;
        })
        .catch(err => {
            console.log("fetchVerses err: " + err);
        });
    
    return verseData;
}

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
        message: "Songs of Solomon",
    },
};

/*************
 * Functions *
 *************/

/**
 *  Handle a command from a Discord user.
 *
 *  @param  {Object}    msg         The message object. https://discord.js.org/#/docs/main/stable/class/Message
 *  @param  {String}    command     The `commandName` part of the message.
 *  @param  {Array}     args        The optional list of arguments from the message.
 *
 *  @note - Discord messages which are treated as commands are expected to look like: "!commandName arg1 arg2 arg3".
 */
function handleCommand(msg, cmd, args) {
    const channel = msg.channel;

    switch (cmd) {
        case "sad":
            fetchVerses("sad")
                .then(result => {
                    console.log("handleCommand(): " + result);
                    var limit = result.data.limit;
                    var randomNumber = Math.floor(Math.random() * limit);
                    var scripture = result.data.verses[randomNumber].text;
                    var chapter = result.data.verses[randomNumber].reference;
                    var verse = `"${scripture}" - ${chapter}`;
                    channel.send(verse);
                })
                .catch(err => {
                    console.log("handleCommand(): " + err);
                    channel.send("Something went wrong with this command :(");
                })
            // channel.send(fetchVerses("sad"));
            break;
        case "love":
            // channel.send(verses.love[randomNumber].verse);
            break;
        case "worry":
            // channel.send(verses.worry[randomNumber].verse);
            break;
        case "joy":
            // channel.send(verses.joy[randomNumber].verse);
            break;
        case "verse me":
            
            break;
        case "help":
            msg.reply(`\nHere are the list of available commands to use:\n
            +help\n
            +suffering\n
            +love\n
            +worry\n
            +joy`);
            break;
        default:
            msg.reply(
                `I'm sorry, the command '+${cmd}' does not exist :(`
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
