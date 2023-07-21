Discord = require('discord.js');
https = require('https');
url = require("url");

class LeagueOfLegends {
    constructor(){
        this.getChamps();
    }

    async loadChamps(message, args) {
        if (args.length < 1) {
            message.channel.send("No champion provided!");
            return;
        }
        const msg2 = await message.channel.send("Searching by " + args[0] + "...");
        var directSearch = "https://u.gg/lol/champions/" + args[0] + "/build";
        if (this.checkUrl(directSearch)){
            msg2.edit("https://u.gg/lol/champions/" + args[0] + "/build");
        }
        else{
            var results = "";
            for (var y = 0; y < this.champs.length; y++) {
                if (this.champs[y].toLowerCase().includes(args[0].toLowerCase())){
                    results += this.champs[y] + ",";
                }
            }
            var array = results.split(",");
            array.pop();
            console.log(array);
            switch (array.length){
                case 1:
                    msg2.edit("https://u.gg/lol/champions/" + array[0] + "/build");
                    break;
                case 0:
                    msg2.edit("No result's found!");
                    break;
                default:
                    var n = 20;
                    var description = "";
                    var i;
                    for (i = 0; i < array.length && i < n; i++){
                        description += array[i] + ">  https://u.gg/lol/champions/" + array[i] + "/build\n";
                    }
                    if (n > i) n = i;
                    const roleColor = message.guild.me.displayHexColor;
                    const embed = new Discord.MessageEmbed()
                        .setColor(roleColor)
                        .setDescription(description);
                        msg2.edit("First " + n + " champions:");
                    msg2.edit(embed);
                    break;
            }
        }
    }

    checkUrl(link) {
        https.get(link, (resp) => {
        let data = '';
        resp.on('data', (chunk) => {
            data += chunk;
        });
        resp.on('end', () => {
            return true;
        });
        }).on("error", (err) => {
            return false;
        });
    }
    async getChamps () {
        https.get('https://ddragon.leagueoflegends.com/cdn/10.10.3216176/data/en_US/champion.json', (resp) => {
        let data = '';
        resp.on('data', (chunk) => {
            data += chunk;
        });
        resp.on('end', () => {
            this.champs = Object.keys(JSON.parse(data).data);
        });
        }).on("error", (err) => {
            console.log("Error: " + err.message);
        });
    }
}

exports.LeagueOfLegends = LeagueOfLegends;