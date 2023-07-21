class TikTokToe {
    istiktoktoeing;
    isXturn;
    x;
    o;
    table;
    leftRounds;
    tiktoktoeMessage;
    expireTime;
    constructor() {
        this.istiktoktoeing = false;
        this.table = ["1", "2", "3", "4", "5", "6", "7", "8", "9"];
        this.leftRounds = this.table.length;
        this.expireTime = new Date().getTime() + 60000;
    }

    async startTikTokToe(message){
        if (new Date().getTime() > this.expireTime) {
            this.tiktoktoeMessage.edit("This game expired!");
            this.endTiktoktoe();
        }
        if (!this.istiktoktoeing){
            this.x = message.author;
            if (message.content.length > 0 && message.content.includes("<@") && message.content.includes(">")){
                this.o = message.content.substr(message.content.indexOf("<@") + 2, message.content.indexOf(">") - message.content.indexOf("<@") - 2);
                this.tiktoktoeMessage = await message.channel.send(" <@" + this.x + "> and <@" + this.o + "> are now playing tiktoktoe!");
                this.isXturn = true;
                this.istiktoktoeing = true;
                this.showTiktoktoe(this.tiktoktoeMessage);
                this.setReactions(this.tiktoktoeMessage);
                this.expireTime = new Date().getTime() + 60000;
            }
        }
        else{
            message.channel.send("A game is already running!");
        }
    }

    readReaction(reaction, user){
        if (this.istiktoktoeing && reaction.message == this.tiktoktoeMessage){
            if ((user == this.x || user == this.o)){
                this.expireTime = new Date().getTime() + 60000;

                if (reaction._emoji.name == '💨'){
                    this.isXturn = user == this.x ? false : true;
                    this.showTiktoktoe(this.tiktoktoeMessage, "lefted the game");
                    this.endTiktoktoe();
                    return;
                }
            }
            var next = this.isXturn ? this.x : this.o;
            if (user == next){
                var n = -1;
                switch(reaction._emoji.name){
                    case '1️⃣':
                        n = 1;
                    break;
                    case '2️⃣':
                        n = 2;
                    break;
                    case '3️⃣':
                        n = 3;
                    break;
                    case '4️⃣':
                        n = 4;
                    break;
                    case '5️⃣':
                        n = 5;
                    break;
                    case '6️⃣':
                        n = 6;
                    break;
                    case '7️⃣':
                        n = 7;
                    break;
                    case '8️⃣':
                        n = 8;
                    break;
                    case '9️⃣':
                        n = 9;
                    break;
                }
                if (n > -1 && this.table[n - 1] == n){
                    var text = this.isXturn ? "X" : "O";
                    this.leftRounds--;
                    this.table[n - 1] = text;
                    this.isXturn = !this.isXturn;
                    this.showTiktoktoe(this.tiktoktoeMessage, n);
                }
            }
        }
    }

    showTiktoktoe(message, play) {
        var next = this.isXturn ? "This <@" + this.x + "> turn!" : "This <@" + this.o + "> turn!";
        var win = this.checkWin();
        if (win != ""){
            next = win;
        }
        var last = this.isXturn ? this.o : this.x;
        var lastMove = play != null ? "    Last move <@" + last + "> to " + play : "";
        message.edit(this.getSymbol(this.table[0]) + this.getSymbol(this.table[1]) + this.getSymbol(this.table[2]) + "    " + next + "\n"
          + this.getSymbol(this.table[3]) + this.getSymbol(this.table[4]) + this.getSymbol(this.table[5]) + lastMove + "\n"
          + this.getSymbol(this.table[6]) + this.getSymbol(this.table[7]) + this.getSymbol(this.table[8]));
        if (win != ""){
            this.endTiktoktoe();
        }
    }

    setReactions(tiktoktoeMessage){
        tiktoktoeMessage.react("1️⃣");
        tiktoktoeMessage.react("2️⃣");
        tiktoktoeMessage.react("3️⃣");
        tiktoktoeMessage.react("4️⃣");
        tiktoktoeMessage.react("5️⃣");
        tiktoktoeMessage.react("6️⃣");
        tiktoktoeMessage.react("7️⃣");
        tiktoktoeMessage.react("8️⃣");
        tiktoktoeMessage.react("9️⃣");
        tiktoktoeMessage.react("💨");
    }
    
    getSymbol (tableValue){
        switch(tableValue){
            case "X":
                return "❎";
            case "O":
                return "🅾";
            case "1":
                return "1️⃣";
            case "2":
                return "2️⃣";
            case "3":
                return "3️⃣";
            case "4":
                return "4️⃣";
            case "5":
                return "5️⃣";
            case "6":
                return "6️⃣";
            case "7":
                return "7️⃣";
            case "8":
                return "8️⃣";
            case "9":
                return "9️⃣";
        }
    }
    
    checkWin(){
        var rows = [0,1,2, 3,4,5, 6,7,8, 0,3,6, 1,4,7, 2,5,8, 0,4,8, 2,4,6];
        var winText = "";
        for (var i = 0; i + 3 <= rows.length; i+=3){
            winText = this.checkRow(rows[i], rows[i + 1], rows[i + 2]);
            if (winText != ""){
                switch (winText){
                    case 'X':
                        winText = this.x;
                        break;
                    case 'O':
                        winText = this.o;
                        break;
                    default:
                        console.log("Critical error found! No one won tiktoktoe!")
                        winText = "Error found! Please report!";
                }
                return "<@" + winText + "> Won!";
            }
        }
        if (this.leftRounds <= 0){
            return "The game ended in tie!";
        }
        return "";
    }
    
    checkRow(firstPos, secondPos, thirdPos){
        var result = (this.table[firstPos] == this.table[secondPos] && this.table[secondPos] == this.table[thirdPos]);
        if (result){
            return this.table[thirdPos];
        }
        return "";
    }
    
    endTiktoktoe(){
        this.istiktoktoeing = false;
        this.isXturn = false;
        this.leftRounds = this.table.length;
        this.table = ["1", "2", "3", "4", "5", "6", "7", "8", "9"];
        this.x = null;
        this.o = null;
        this.expireTime = 0;
    }
}
module.exports.TikTokToe = TikTokToe;