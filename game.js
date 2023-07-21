module.exports = class Game {
    state = 0; //State: 0 = waitng for p2 to accept game, 1 = playing, 2 = done, 3 = remove
    player1;
    player2;
    playerTurn; // Player1 turn if true, Player2 turn if false
    expireTime;
    gameMessage;
    constructor(message) {
        this.expireTime = new Date().getTime() + 60000;
        this.Prompt(message);
    }

    async Prompt(message) {
        this.player1 = message.author;
        if (message.content.length > 0 && message.content.includes("<@") && message.content.includes(">")){
            this.player2 = message.content.substr(message.content.indexOf("<@") + 2, message.content.indexOf(">") - message.content.indexOf("<@") - 2);
            this.gameMessage = await message.channel.send(" <@" + this.player1 + "> envited <@" + this.player2 + "> to play!");
            this.gameMessage.react("✔");
            this.gameMessage.react("❌");
        }
        else{
            this.gameMessage = await message.channel.send("Couldn't find <@" + this.player1 + "> in here!")
        }
    }

    React(reaction, user) { // Change player1 to player2
        if (this.state == 0 && this.player1 == user.id) {
            switch(reaction._emoji.name) {
                case '✔':
                    this.Accept();
                break;
                case '❌':
                    this.Refuse();
                break;
                default:
                    console.log(reaction._emoji.name);
                break;
            }
        }
        if (reaction._emoji.name == '💨' && (user == this.player1 || user == this.player2)){
            //Define wich player have surrender
            this.playerTurn = user == this.player1 ? true : false;
            this.state = 2;
            return;
        }
        if (this.state == 1) {
            this.Update(reaction, user);
        }
    }

    Refuse() {
        this.gameMessage.edit("<@" + this.player2 + "> refused play with you!");
        this.RemoveReactions();
        //TODO: Delete the message after a while
        //this.gameMessage.delete(3000);
        this.state = 3;
    }

    Accept() {
        this.gameMessage.edit("Loading...")
            .then(() => this.RemoveReactions())
            .then(() => this.Start())
            .then(() => this.state = 1);
    }

    RemoveReactions() {
        this.gameMessage.reactions.removeAll().catch(error => console.error('Failed to clear reactions: ', error));
    }

    Start() {}
    Update() {}

    LoadReactions(reactions) {
        reactions.split(" ").forEach(reaction => {
            this.gameMessage.react(reaction);
        });
        this.gameMessage.react("💨");
    }

    GetReactionText(reaction) {
        if (reaction[0] >= 0) {
            return reaction[0];
        }
        return "";
    }
}