const crypto = require('crypto');
const ObjectId = require('mongodb').ObjectID;

class UserService {

    constructor(dbdao) {
        this.dbdao = dbdao;
    }

    async addUser(user) {

        const newUser = {};
        newUser.email = user.email;
        newUser.salt = crypto.randomBytes(32).toString('hex');
        newUser.passwordHash = await hashPassword(user.password,newUser.salt);
        
        const duplicateUser = await this.getUserByEmail(user.email);
        if (duplicateUser) {
            throw { error: 'duplicate user'};
        } else {
            return await this.dbdao.insert('five', 'users', newUser);
        }
    }

    async getUserById(id) {
        return await this.dbdao.findOneWithSearchCriteria('five', 'users', { _id: new ObjectId(id) });
    }

    async getUserByEmail(email) {
        return await this.dbdao.findOneWithSearchCriteria('five', 'users', { email });
    }

    async deleteUsers() {
        return await this.dbdao.deleteMany('five', 'users', {});
    }

    async updateUser(userid, updates) {
        return await this.dbdao.findUserAndUpdate('five', 'users', { _id: new ObjectId(userid) }, updates);
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