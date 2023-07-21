const Game = require('./game.js');
module.exports = class FourInRow extends Game {
    board = [];
    Start() {
        for (var y = 0; y < 6; y++) {
            var line = "";
            for (var x = 0; x < 7; x++) {
                line += "⚪ ";
            }
            this.board.push(line);
        }
        this.LoadReactions("1️⃣ 2️⃣ 3️⃣ 4️⃣ 5️⃣ 6️⃣ 7️⃣");
        this.gameMessage.edit(this.board);
    }

    Update(reaction, user) {
        //Renew message lifetime
        this.expireTime = new Date().getTime() + 60000;
        while(this.board.length < 6);
        var player = this.playerTurn ? this.player1 : this.player2;
        if (user == player) {
            var play = this.GetReactionText(reaction._emoji.name);
            if (play > 0 && play < 8) {
                //TODO: Make summon a object on the correct place
                for (var y = this.board.length - 1; y > 0; y--) {
                    var index = (play - 1) * 2
                    console.log(y + "," + play + ",\"" + this.board[y][index] + "\"");
                    if (this.board[y].split(" ")[play] == "⚪") {
                        var row = this.board[y];
                        var token = this.playerTurn ? "🔵" : "🔴";
                        this.board[y] = row.substr(0, play) + token + row.substr(play + token.length);
                        break;
                    }
                }
            }
            this.gameMessage.edit(this.board);
        }
    }
}