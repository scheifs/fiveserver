const crypto = require('crypto');
const ObjectId = require('mongodb').ObjectID;

class UserService {

    constructor(dbdao, database = 'five', collection = 'users') {
        this.dbdao = dbdao;
        this.database = database;
        this.collection = collection;
    }

    async addUser(user) {

        const newUser = {};
        newUser.email = user.email;
        newUser.salt = crypto.randomBytes(32).toString('hex');
        newUser.passwordHash = await hashPassword(user.password, newUser.salt);
        newUser.nickname = user.email.substring(0, user.email.indexOf('@'));
        newUser.games = [];

        const duplicateUser = await this.getUserByEmail(user.email);
        if (duplicateUser) {
            throw { error: 'duplicate user' };
        } else {
            return await this.dbdao.insert(this.database, this.collection, newUser);
        }
    }

    async getUserById(id) {
        return await this.dbdao.findOneWithSearchCriteria(this.database, 'users', { _id: new ObjectId(id) });
    }

    async getUserByEmail(email) {
        return await this.dbdao.findOneWithSearchCriteria(this.database, this.collection, { email });
    }

    async deleteUsers(criteria = {}) {
        return await this.dbdao.deleteMany(this.database, this.collection, criteria);
    }

    async updateUser(userid, updates) {
        const updateResponse = await this.dbdao.findOneAndUpdate(this.database, this.collection, { _id: new ObjectId(userid) }, updates);
        if (updateResponse.ok === 1) {
            return updateResponse.value;
        } else {
            throw { error: 'update failed' };
        }
    }

    async addGame(userid, gameid) {
        const validGame = await this.dbdao.findOneWithSearchCriteria(this.database, 'games', { _id: new ObjectId(gameid) });
        console.log(validGame);
        if (validGame) {
            return await this.dbdao.addToSet(this.database, this.collection, { _id: new ObjectId(userid) }, { games: gameid });
        } else {
            throw { error: `gameid: ${gameid} not valid` }
        }
    }

    async isPasswordCorrect(rawPassword, salt, passwordHash) {
        const hash = await hashPassword(rawPassword, salt);
        return hash === passwordHash;
    }

}

function hashPassword(pwd, salt) {

    return new Promise(function (resolve, reject) {
        crypto.pbkdf2(pwd, salt, 100000, 512, 'sha512', (err, key) => {
            if (err) {
                reject(err);
            }
            const hash = key.toString('hex');
            resolve(hash);
        });
    });
    // https://nodejs.org/api/crypto.html#crypto_crypto_pbkdf2_password_salt_iterations_keylen_digest_callback
}

module.exports = UserService;