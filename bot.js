const Discord = require('discord.js');
var bot = new Discord.Client();
const auth = require('./auth.json');
const leagueOfLegends = require('./leagueOfLegends.js'); 
var lol = new leagueOfLegends.LeagueOfLegends(leagueOfLegends.champs);
const FourInRow = require('./fourInRow.js');

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

//Login
bot.login(auth.token);

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
}