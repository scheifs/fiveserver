const MongoClient = require('mongodb').MongoClient;

class DBDao {

    constructor(_client) {
        this.client = _client;
    }

    connect() {

        return new Promise((resolve, reject) => {

            this.client.connect((err) => {
                if (err) {
                    console.log(`Connecting to mongo error ${err}`);
                    reject(err);
                } else {
                    console.log("Connected successfully to mongo");
                    resolve();
                }
                
              });
        });
    }

}

module.exports = DBDao;