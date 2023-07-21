import { MessageEmbed } from 'discord.js'
import Module from '../module.js'
import Command from '../Command.js'

export default class Help extends Module {
    inputs = []

    static onLoad() {
        Command.register(new Command('help', 'show help menu', (origin) => {
            const commands = Command.getAll().map(command => {
                return `${command.template} - ${command.description}\n`
            })
            const roleColor = origin.guild.me.displayHexColor
            const embed = new MessageEmbed()
                .setColor(roleColor)
                .setTitle("All available Commands:")
                .setDescription(commands)
                origin.channel.send(embed)
        }))
    }

    onStart() { }

    onUpdate() { }
}