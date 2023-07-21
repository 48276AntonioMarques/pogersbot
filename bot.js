/*
//Games
const XO = require('./tiktoktoe.js');
var XoGame = new XO.TikTokToe();
const SeaBattle = require('./seaBattle.js');
var SeaGame = new SeaBattle.SeaBattle();
var games = [];

//Start Bot
bot.on('ready', () => {
    console.log(`Logged in as ${bot.user.tag}!`);
});

//Read messages
bot.on('message', async message => {
    //console.log(message.author.username + " said: " + message.content);
    const prefix = "+";
    if (!message.guild) return;
    if (message.content.startsWith(prefix)){
        const args = message.content.slice(prefix.length).trim().split(/ +/g);
        const cmd = args.shift().toLowerCase();
        switch(cmd){
            case "ping":
                const msg = await message.channel.send("🏓 Pinging....");
                const delTime = 5000;
                msg.edit("🏓 Pong!\nLatency is " + Math.floor(msg.createdAt - message.createdAt) + "ms\nAPI Latency is " + Math.round(bot.ping) + "ms");
                if (message.deletable) {
                    console.log("t-" + delTime);
                    message.delete(delTime, "Timeout");
                    msg.delete(delTime, "Timeout");
                }
                break;
            case "help":
                Help(message);
                break;
            case "lol":
                lol.loadChamps(message, args);
                break;
            case 'xo':
                XoGame.startTikTokToe(message);
                break;
            case '4':
                games.push(new FourInRow(message));
                break;
            case 'say':
                message.channel.send(args.join(" "));
                break;
        }
    }
    else{
        if (message.content.replace(" ", "").toLowerCase() == "pog?"){
            // IF BIG BOY WITH PERMISSIONS POG! ELSE NOT POG!
            console.log("Pog!");
        }
    }
});

//Read Reactions
bot.on("messageReactionAdd", async (reaction, user) => {
    if (reaction.partial){
		try {
            await reaction.fetch();
		} catch (error) {
			console.log('Something went wrong when fetching the message: ', error);
			return;
		}
    }
    //Destroy every finished game
    for(var i = 0; i < games.length; i++) {
        if (games[i].state > 1) {
            games.splice(i);
            i--;
        }
    }
    games.forEach(game => {
        if (game.gameMessage.id == reaction.message.id)
        game.React(reaction, user);
    });
    XoGame.readReaction(reaction, user);
});


//Show all commands
function Help(message) {
    const roleColor = message.guild.me.displayHexColor;
    const embed = new Discord.MessageEmbed()
        .setColor(roleColor)
        .setTitle("All available Commands:") //TODO: Make this fancy!!!
        .setDescription("+ping\n+help\n+lol ChampionName\n+xo tagyourpal\n+4 tagyourpal");
    message.channel.send(embed);
}*/

import { Client } from 'discord.js'
import Command from './Command.js'
import Input from './Input.js'
import dotenv from 'dotenv'

// Load environment variables from .env files
dotenv.config()

// Load token from environment variables
const token = process.env.DISCORD_TOKEN

// Create a new client instance
const client = new Client()

// Import all available modules
import * as modules from './modules.js'

// Load all modules
const modulesCount = Object.keys(modules).length
Object.keys(modules).forEach((name, count) => {
    const module = modules[name]
    console.log(`Loading module: ${name} (${count}/${modulesCount})...`)
    module.onLoad()
})

// Show available commands count
// CommandCount is a function because the commands can be added and removed at runtime
const commandsCount = () => { return Command.getAll().length }
console.log(`Loaded ${commandsCount()} ${commandsCount() > 1 ? 'commands' : 'command'}`)
const InputdsCount = () => { return Input.getAll().length }
console.log(`Loaded ${InputdsCount()} ${InputdsCount() > 1 ? 'inputs' : 'input'}`)

client.on('message', async message => {
    console.log(`${message.author.username} said '${message.content}'`)
    if (!message.guild) return // Checks if the message comes from a server
    const commands = Command.getAll()
    commands.forEach(command => {
        console.log(command)
        if (message.content.startsWith(command.template)) {
            console.log(`Executing command '${command.template}'...`)
            command.callback(message)
        }
    })
})

client.on("messageReactionAdd", async (reaction, user) => {
    if (reaction.partial){
		try {
            await reaction.fetch()
		} catch (error) {
			console.log('[Error] Fetching message failed caused by: ', error)
			return
		}
    }
    // Gets input everytime since inputs can be added and removed at runtime
    Input.getAll().forEach(input => {
        if (
            input.message.id == reaction.message.id &&
            input.message.channel.id == reaction.message.channel.id &&
            input.emoji == reaction.emoji.name
        ) {
            input.callback(reaction, user)
        }
    })
})

client.on('ready', () => {
    console.log(`Connected with API as ${client.user.tag}`)
})

// Login to Discord with your client's token
client.login(token)
