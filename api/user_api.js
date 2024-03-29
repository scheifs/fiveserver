const debug = require('debug')('fiveserver');

exports.getUser = async (req, res, next, userService) => {
    try {
        const user = await userService.getUserById(req.five.id);
        res.send(200, user);
    } catch (err) {
        console.log(err);
        res.send(500, err);
    } finally {
        next();
    }

}

exports.addUser = async (req, res, next, userService) => {
    try {
        debug(`addUser: ${JSON.stringify(req.body)}`)
        const user = await userService.addUser(req.body);
        res.header('Location', user._id);
        res.send(201, user);
    } catch (err) {
        if (err.error === 'duplicate user') {
            res.send(409, err);
        } else {
            console.log(err);
            res.send(500, err);
        }
    } finally {
        next();
    }
}

exports.deleteUsers = async (req, res, next, userService) => {
    try {
        await userService.deleteUsers();
        res.send(200);
    } catch (err) {
        console.log(err);
        res.send(500, err);
    } finally {
        next();
    }
}

exports.updateUser = async (req, res, next, userService) => {
    // TODO: check to make sure password is not being updated.. special case...
    // console.log(req.body);
    if (req.body && (req.body.passwordHash !== undefined || req.body.salt !== undefined)) {
        res.send(400);
        next();
    } else {
        try {
            const updatedUser = await userService.updateUser(req.five.id, req.body);
            res.send(200, updatedUser);
        } catch (err) {
            console.log(err);
            res.send(500, err);
        } finally {
            next();
        }
    }
}

exports.addGame = async (req, res, next, userService) => {
    try {
        const updated = await userService.addGame(req.params.userid, req.body.gameid);
        res.send(200, updated);
    } catch (err) {
        console.log(err);
        res.send(500, err);
    } finally {
        next();
    }
}