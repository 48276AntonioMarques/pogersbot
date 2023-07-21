water = '🟦';
ship = '🚢';
blow = '💥';
miss = '🌊';
class Player {
    id;
    table;
    message;
    role;
    constructor(id){
        this.id = id;
        this.table = this.newTable();
    }

    newTable(){
        this.table = [ water, water, water, water, water ];
        for(var i = 1; i < 100; i++){
            this.table.push('🟦');
        }
    }
}
class SeaBattle {
    redTurn;
    red;
    blue;
    running;
    constructor () {
        this.running = false;
    }

    async startGame(message){
        if (!this.running){
            this.red = new Player(message.author);
            this.blue = new Player(message.content.substr(message.content.indexOf("<@") + 2, message.content.indexOf(">") - message.content.indexOf("<@") - 2));
            //TODO: Create and setup channel and role for each player from each player
            this.red.message = await message.channel.send("Loading...");

            this.redTurn = Math.random() < 0.5;

            this.red.message.edit(this.messageBuilder(this.red, this.blue));
        }
    }

    messageBuilder(player, enemy)
    {
        return player.message.channel.edit(/*" <@" + this.blue + ">\n" + this.getEnemyTable(enemy) + */"\n<@" + this.red + ">\n" + this.getMyTable(player));
    }

    getMyTable(player){
        console.log(player);
        var output = "";/*
        for(var i = 0; i < player.table.length; i++){
            output += player.table[i];
            if (i % 10 == 0) output += "\n";
        }*/
        return output;
    }

    getEnemyTable(enemy){
        var output = "";
        for(var i = 0; i < enemy.table.length; i++){
            output += enemy.table[i] == "" ;
            if (i % 10 == 0) output += "\n";
        }
        return output;
    }
}

module.exports.SeaBattle = SeaBattle;