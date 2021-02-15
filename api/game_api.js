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
        // TODO: get user id from req object
        const game = await gameService.getGameById(req.params.gameid);
        await gameService.move(game,req.params.userid,req.body);
        res.send(200);
    } catch (err) {
        console.log(err);
        res.send(500,err);
        res.end();
    } finally {
        next();
    }


}