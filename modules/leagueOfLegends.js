import { MessageEmbed } from 'discord.js'
import fetch from 'node-fetch'
import Module from '../module.js'
import Command from '../Command.js'

export default class LeagueOfLegends extends Module {
    
    static async onLoad() {
        // TODO: Get game version from https://ddragon.leagueoflegends.com/api/versions.json
        const version = (await (await fetch('https://ddragon.leagueoflegends.com/api/versions.json')).json())[0]
        console.log(`Loaded LeagueOfLegends module for version ${version}`)
        Command.register(new Command('lol [ChampionName]', 'Search for a champion', async (origin, args) => {
            const message = await origin.channel.send(`Searching for ${args[0]}...`)
            const champions = Object.values((await LeagueOfLegends.getChamps(version)).data)
            const matches = champions.filter(champion => { return champion.name.toLowerCase().includes(args[0].toLowerCase()) })
            const roleColor = origin.guild.me.displayHexColor
            switch (matches.length) {
                case 0:
                    message.edit(
                        new MessageEmbed()
                            .setColor(roleColor)
                            .setTitle('No champion found')
                            .setDescription(`No match found for a champion starting with ${args[0]}`)
                    )
                break
                case 1:
                    message.edit(
                        new MessageEmbed()
                            .setColor(roleColor)
                            .setTitle(matches[0].name)
                            .setDescription(`https://u.gg/lol/champions/${args[0]}/build`)
                    )
                    break
                default:
                    const firstMatches = matches.slice(0, 10)
                    message.edit(
                        new MessageEmbed()
                            .setColor(roleColor)
                            .setTitle(`Found ${matches.length} champions`)
                            .setDescription(
                                firstMatches.map(match => {
                                    return `${match.name} - https://u.gg/lol/champions/${match.name.replace(" ", "_")}/build`
                                }).join('\n')
                            )
                    )
                    break
            }
        }))
    }

    static async getChamps (version) {
        const response = await fetch(`https://ddragon.leagueoflegends.com/cdn/${version}/data/en_US/champion.json`)
        const json = await response.json()
        return json
    }
}
