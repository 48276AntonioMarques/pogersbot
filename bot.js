/*

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
    console.log(`Loading module: (${count + 1}/${modulesCount}) ${name}...`)
    module.onLoad()
})

// Show available commands count
// CommandCount is a function because the commands can be added and removed at runtime
const commandsCount = () => { return Command.getAll().length }
console.log(`Loaded ${commandsCount()} command${commandsCount() == 1 ? '' : 's'}`)
const InputdsCount = () => { return Input.getAll().length }
console.log(`Loaded ${InputdsCount()} input listener${InputdsCount() == 1 ? '' : 's'}`)

client.on('message', async message => {
    if (!message.guild) return // Checks if the message comes from a server
    const commands = Command.getAll()
    commands.forEach(command => {
        const template = command.template.split(/ +/g)
        const args = message.content.trim().split(/ +/g)
        let params = []
        const match = args.every((arg, index) => {
            const isParameter = template[index].startsWith('[') && template[index].endsWith(']')
            if (isParameter) {
                params.push(arg)
                return true
            }
            return arg == template[index]
        })
        if (match) {
            command.callback(message, params)
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
