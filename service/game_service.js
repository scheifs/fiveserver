const { ObjectId } = require('mongodb');
const debug = require('debug')('fiveserver')
const boardService = require('./board_service');

class GameService {

    constructor(dbdao, database = 'five', collection = 'games') {
        this.dbdao = dbdao;
        this.database = database;
        this.collection = collection;
    }

    async getGameById(id) {
        return await this.dbdao.findOneWithSearchCriteria(this.database, this.collection, { _id: ObjectId(id) });
    }

    async addGame(postbody) {
        const game = {
            lastUpdated: new Date(),
            deck: this.getNewShuffledDeck(),
            players: postbody.players,
            playersTurnId: postbody.players[0].userid,
            moves: [],
            turnNumber: 1,
            board: boardService.emptyBoard
        };
        this.dealToPlayers(game);
        return await this.dbdao.insert(this.database, this.collection, game);
    }

    async move(game, playerId, movePayload) {
      
        if (movePayload.move === "Draw") {
            return await this.drawCard(game, playerId, movePayload);
        } else if (movePayload.move === "Play") {
            return await this.playCard(game, playerId, movePayload);
        } else {
            throw { error: `move not supported ${JSON.stringify(movePayload)}`};
        }
    }

    

    // ******************************* PRIVATE METHODS *********************************************************

    async saveGame(game) {
        console.log(game._id);
        const saveGameResult = await this.dbdao.replaceOne(this.database, this.collection, { _id: game._id }, game);
        if (saveGameResult?.matchedCount === 1) {
            return game;
        } else {
            throw { error: 'mongo db save game error'}
        }
    }

    getNextTurnPlayersId(players, nextTurnNumber) {

        const mod = (nextTurnNumber-1) % players.length;
        return players[mod].userid;

    }

    async drawCard(game, playerId) {
        debug(game,playerId);
        const player = GameService.findPlayerWithPlayerId(game, playerId);
        if (player.cards.length >= 4) {
            throw { error: `full hand`}
        }
        player.cards.push(game.deck.pop());
        game.turnNumber++;
        game.playersTurnId = this.getNextTurnPlayersId(game.players, game.turnNumber);
        game.moves.push({
            player: playerId,
            move: "Draw"
        })
        return await this.saveGame(game);
    }

    async playCard(game, playerId, movePayload) {
        if (movePayload.card > movePayload.boardNumber) {
            throw { error: `invalid play`};
        }
        const player = GameService.findPlayerWithPlayerId(game, playerId);
        if (!player.cards.find(card => card === movePayload.card)) {
            throw { error: `invalid play`};
        }
        player.cards = player.cards.filter(item => item !== movePayload.card);
        const boardElement = this.findBoardElementAtBoardNumber(game.board, movePayload.boardNumber);
        boardElement.color = player.color;
        game.turnNumber++;
        game.playersTurnId = this.getNextTurnPlayersId(game.players, game.turnNumber);
        game.moves.push({
            player: playerId,
            move: "Play",
            card: movePayload.card,
            boardNumber: movePayload.boardNumber
        });
        return await this.saveGame(game);
    }

    static findPlayerWithPlayerId(game, playerid) {
        return game.players.find(player => {
            if (player.userid.toString() === playerid.toString()) {
                return true;
            }
        });
    }

    findBoardElementAtBoardNumber(board, boardNumber) {
        for (let x = 0; x < 10; x++) {
            for (let y = 0; y < 10; y++) {
                if (board[x][y].num === boardNumber) {
                    return board[x][y];
                }
            }
        }
    }

    shuffle(array) {
        var m = array.length, t, i;
        while (m) {
            i = Math.floor(Math.random() * m--);
            t = array[m];
            array[m] = array[i];
            array[i] = t;
        }
        return array;
    }

    getNewShuffledDeck() {

        let deck = new Array(100);
        for (let x = 0; x < 100; x++) {
            deck[x] = x;
        }
        return this.shuffle(deck);
    }

    dealToPlayers(game) {
        game.players.forEach(player => {
            player.cards = [];
            player.cards.push(game.deck.pop());
            player.cards.push(game.deck.pop());
            player.cards.push(game.deck.pop());
            player.cards.push(game.deck.pop());
        });
    }

}

module.exports = GameService;