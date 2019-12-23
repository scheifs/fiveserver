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

    async findWithSearchCriteria(database, collection, searchCriteria) {

        const db = this.client.db(database);
        const dbCollection = db.collection(collection);
        const resp = await dbCollection.find(searchCriteria);
        return await resp.toArray();
 
    }

    async deleteMany(database, collection, criteria) {
        const db = this.client.db(database);
        const dbCollection = db.collection(collection);
        return await dbCollection.deleteMany(criteria);
    }

    async replaceOne(database, collection, filter, replacement) {
        const db = this.client.db(database);
        const dbCollection = db.collection(collection);
        return await dbCollection.replaceOne(filter,replacement);
    }

    async findOneAndUpdate(database, collection, findQuery, updates) {
        const db = this.client.db(database);
        const dbCollection = db.collection(collection);
        const updateQuery = {
            "$set": {}
        };
        updateQuery.$set = updates;
        const updated = await dbCollection.findOneAndUpdate(findQuery, updateQuery, { returnOriginal: false });
        return updated;
    }

    async addToSet(database, collection, findQuery, setToAdd) {
        const db = this.client.db(database);
        const dbCollection = db.collection(collection);
        const updateQuery = {
            "$addToSet": {}
        };
        updateQuery.$addToSet = setToAdd;
        const updated = await dbCollection.updateOne(findQuery, updateQuery, { returnOriginal: false});
        return updated;
    }

}

module.exports = DBDao;