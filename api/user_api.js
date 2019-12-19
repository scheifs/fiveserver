exports.getUser = async (req, res, next, userService) => {
    try {
        const user = await userService.getUserById(req.params.userid);
        res.send(200, user);
    } catch (err) {
        res.send(500,err);
    } finally {
        next();
    }
    
}

exports.addUser = async (req, res, next, userService) => {
    try {
        const user = await userService.addUser(req.body);
        console.log('user_api user: ' + user);
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
        res.send(500,err);
    } finally {
        next();
    }
}

exports.updateUser = async (req, res, next, userService) => {
    try {
        await userService.updateUser(req.params.userid, req.body);
        res.send(200);
    } catch (err) {
        console.log(err);
        res.send(500,err);
    } finally {
        next();
    }
}