const jwt = require('jsonwebtoken');
const process = require('process');
const secretkey = process.env.secretkey;

exports.authorizeApiRequest = async (req, res, next) => {

    const uri = req.getRoute().path;
    if ((req.method === 'POST' && uri === '/api/users') || uri === '/api/token' || uri === '/api/health') {
        return next();
    } else {
        const token = req.headers['x-auth-token'];
        jwt.verify(token, secretkey, (err, decoded) => {
            if (err) {
                res.send(401, err);
                res.end();
            } else {
                req.five = {
                    email: decoded.email,
                    id: decoded._id
                }
                return next();
            }
        });
    }

}

exports.getToken = async (req, res, next, userService) => {

    const foundUser = await userService.getUserById(req.body.id);
    if (!foundUser) {
        res.send(401);
        res.end();
    } else {
        const isPasswordCorrect = await userService.isPasswordCorrect(req.body.password, foundUser.salt, foundUser.passwordHash);
        if (isPasswordCorrect) {
            const token = jwt.sign({
                _id: foundUser._id,
                email: foundUser.email
            }, secretkey, { expiresIn: '24h' });
            res.send(200, { token });
            next();
        } else {
            res.send(401);
            res.end();
        }
    }

}