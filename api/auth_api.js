const jwt = require('jsonwebtoken');
const secretkey = process.env.secretkey;

exports.authorizeApiRequest = async (req, res, next) => {

    const uri = req.getRoute().path;
    if ((req.method === 'POST' && uri === '/api/users') || uri === '/api/token') {
        return next();
    } else {
        const token = req.headers['x-auth-token'];
        try {
            await jwt.verify(token, secretkey);
            return next();
        } catch (err) {
            res.send(401, err);
            res.end();
        }
    }
}

exports.getToken = async (req, res, next, userService) => {

    const foundUser = await userService.getUserByEmail(req.body.email);
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