const debug = require('debug')('fiveserver');

exports.getGameById = async (req, res, next, gameService) => {
   
    try {
        const games = await gameService.getGameById(req.params.gameid);
        res.send(200,games);
    } catch (err) {
        res.send(500,err);
        res.end();
    } finally {
        next();
    }

}

exports.addGame = async (req, res, next, gameService) => {
   
    try {
        // TODO: add game to users active games
        const userIds = req.body.players.map(player => {
            return player.userid;
        });
        for (let userid of userIds) {
            console.log(`Userid ${userid}`);
        }

        const addedGame = await gameService.addGame(req.body);
        res.set('Location',`/api/games/${addedGame._id}`)
        res.send(201, addedGame);
    } catch (err) {
        res.send(500,err);
        res.end();
    } finally {
        next();
    }

}

exports.move = async (req, res, next, gameService) => {

    try {  
        const game = await gameService.getGameById(req.params.gameid);
        await gameService.move(game,req.five.id,req.body);
        res.send(200, game);
    } catch (err) {
        console.log(`move error: ${JSON.stringify(err)}`);
        switch (err.error) {
            case `invalid play`:
            case `full hand`: {
                res.send(403, err.error);
                res.end();
                break;
            }
            default: {
                res.send(500,err);
                res.end();
            }
        }
    } finally {
        next();
    }


}