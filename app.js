/**
 *  app.js
 *
 *  Discord bot template.
 */

/*******************
 * Library Imports *
 *******************/
import dotenv from 'dotenv';
dotenv.config();
import { fetchVerses } from './controllers/BibleAPIController.js';
import colors from 'chalk';
import Discord from 'discord.js';
import { motivationVerses, randomQueries } from './utils/verses.js';

/*********************
 * Global Properties *
 *********************/
const activities = ["Song of Solomon", "Psalms", "Proverbs", "Lamentations", "Isaiah's Prophecies"];
// Config properties
const CONFIG = {
    // Bot token
    token: process.env.BOT_TOKEN,
    // Activity shown when the bot appears 'online'
    defaultActivity: {
        type: "LISTENING", // Activity types: 'PLAYING', 'STREAMING', 'LISTENING', 'WATCHING'
        message: activities[Math.floor(Math.random()* activities.length)],
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
 *  @note - Discord messages which are treated as commands are expected to look like: "+commandName arg1 arg2 arg3".
 */
function handleCommand(msg, cmd, args) {
    const channel = msg.channel;
    var limit, randomNumber, verse = null;
    let query = args[0];
    const embed = new Discord.MessageEmbed();

    switch (cmd) {
        case "verse":
            console.log(`Selected query ${query}`);

            // If user wants a random query
            if (query === 'random') {

                console.log('RANDOM QUERY: ' + randomQueries[Math.floor(Math.random()* randomQueries.length)]);
                fetchVerses(randomQueries[Math.floor(Math.random()* randomQueries.length)])
                    .then(result => {
                        limit = result.limit;
                        randomNumber = Math.floor(Math.random() * limit);
                        verse = `"${result.verses[randomNumber].text}" - ${result.verses[randomNumber].reference}`;
                    
                        // Displays verse as an embed
                        embed
                            .setTitle(`Here's a random verse!`)
                            .setDescription(verse);
                        channel.send(embed);
                    })
                    .catch(err => {
                        console.log("rejected handleCommand(): " + err);
                    
                        // Displays message and verse as an embed
                        embed
                            .setTitle("Oops,")
                            .setDescription(
                                `Looks like it does not exist :frowning2:\nBut here's something to motivate you!\n\n
                            ${motivationVerses[Math.floor(Math.random() * motivationVerses.length)]}`
                            )
                        channel.send(embed);
                    });
            } else {
                // Get user's query
                fetchVerses(query)
                    .then(result => {
                        limit = result.limit;
                        randomNumber = Math.floor(Math.random() * limit);
                        verse = `"${result.verses[randomNumber].text}" - ${result.verses[randomNumber].reference}`;
                    
                        // Displays verse as an embed
                        embed
                            .setTitle(`${query.charAt(0).toUpperCase() + query.slice(1)}?`)
                            .setDescription(verse);
                        channel.send(embed);
                    })
                    .catch(err => {
                        console.log("rejected handleCommand(): " + err);
                    
                        // Displays message and verse as an embed
                        embed
                            .setTitle("Oops,")
                            .setDescription(
                                `Looks like it does not exist :frowning2:\nBut here's something to motivate you!\n\n
                            ${motivationVerses[Math.floor(Math.random() * motivationVerses.length)]}`
                            )
                        channel.send(embed);
                    });
            }
            break;
        case "prayer":
        case "prayers":
        case "prayer request":
            embed
                .setTitle("Prayer Requests?")
                .setURL('https://formstack.apu.edu/forms/spring_2020_prayer_request_copy')
                .setDescription("All prayer requests are confidential and will be sent to APU's Chapel Services.");
            channel.send(embed);
            break;
        case "help":
            embed
                .setTitle('Need a hand?')
                .setDescription('Here are the available commands to use for this bot.')
                .addFields(
                    {
                        name: '+verse',
                        value: 'Responds a verse based on what you\'re feeling.\n--------------------\nExamples:\n+verse sad\n+verse happy\n+verse blessed\n+verse love\n--------------------'
                    },
                    {
                        name: '+prayer\n+prayers\n+prayer request',
                        value: 'Sends a link to APU\'s prayer request form.'
                    },
                    {
                        name: '+random',
                        value: 'Sends a random verse!'
                    },
                    {
                        name: '+help',
                        value: 'Lists commands that are available for this bot.'
                    }
                )
                .setFooter('Use +verse random to get a random verse!');
            channel.send(embed);
            break;
        default:
            if (channel.type === 'dm') {
                    msg.reply(
                `I'm sorry, the command '+${cmd}' does not exist :frowning2: Go ahead and try again!`
            );
            } else {
                embed
                    .setTitle("Oops,")
                    .setDescription(
                        `I'm sorry, the command '+${cmd}' does not exist :frowning2: Go ahead and try again!`
                    )
                    channel.send(embed);
            }
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

});

// Login with the bot's token
client.login(CONFIG.token).then();
