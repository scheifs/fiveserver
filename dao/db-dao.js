class DBDao {

    constructor(_client) {
        this.client = _client;
        this.connect();
    }

    async connect() {
        console.log('Attempting to connect to mongo db');
        this.client.connect((err) => {
            if (err) {
                console.log(`Connecting to mongo error ${err}`);
                throw err;
            } else {
                console.log("Connected successfully to mongo");
            }
        });
    }

    async disconnect() {
        
        try {
            await this.client.logout();
            console.log('disconnected');
        } catch (err) {
            console.log(err);
        }
    }

    async insert(database, collection, document) {
        try {
            const db = this.client.db(database);
            const dbres = await db.collection(collection).insertOne(document);
            return dbres.ops[0];
        } catch (err) {
            console.log(err);
            throw err;
        }
    }

    async findOneWithSearchCriteria(database, collection, searchCriteria) {

        const db = this.client.db(database);
        const dbCollection = db.collection(collection);
        return await dbCollection.findOne(searchCriteria);

    }

    async deleteMany(database, collection, criteria) {
        const db = this.client.db(database);
        const dbCollection = db.collection(collection);
        return await dbCollection.deleteMany(criteria);
    }

    async findUserAndUpdate(database, collection, findQuery, updates) {
        const db = this.client.db(database);
        const dbCollection = db.collection(collection);
        const updateQuery = {
            "$set": {}
        };
        updateQuery.$set = updates;
        const updatedUser = await dbCollection.findOneAndUpdate(findQuery, updateQuery, { returnNewDocument: true });
        return updatedUser;
    }

}

module.exports = DBDao;