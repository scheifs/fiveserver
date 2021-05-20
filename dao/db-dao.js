const process = require('process');

class DBDao {

    constructor(_client) {
        this.client = _client;
        if (process.env.NODE_ENV !== 'test') {
            this.connect();
        }
    }

    async connect() {
        console.log('Attempting to connect to mongo db');
        await this.client.connect();
    }

    async disconnect() {
        console.log('Attempting to close to mongo db');
        await this.client.close();
    }

    async insert(database, collection, document) {
        try {
            const dbCollection = this.getDBCollection(database, collection);
            const dbres = await dbCollection.insertOne(document);
            return dbres.ops[0];
        } catch (err) {
            console.log(err);
            throw err;
        }
    }

    async findOneWithSearchCriteria(database, collection, searchCriteria) {

        const dbCollection = this.getDBCollection(database, collection);
        return await dbCollection.findOne(searchCriteria);

    }

    async findWithSearchCriteria(database, collection, searchCriteria) {

        const dbCollection = this.getDBCollection(database, collection);
        const resp = await dbCollection.find(searchCriteria);
        return await resp.toArray();

    }

    async deleteMany(database, collection, criteria) {
        const dbCollection = this.getDBCollection(database, collection);
        return await dbCollection.deleteMany(criteria);
    }

    async replaceOne(database, collection, filter, replacement) {
        const dbCollection = this.getDBCollection(database, collection);
        return await dbCollection.replaceOne(filter, replacement);
    }

    async findOneAndUpdate(database, collection, findQuery, updates) {
        const dbCollection = this.getDBCollection(database, collection);
        const updateQuery = {
            "$set": {}
        };
        updateQuery.$set = updates;
        const updated = await dbCollection.findOneAndUpdate(findQuery, updateQuery, { returnOriginal: false });
        return updated;
    }

    async addToSet(database, collection, findQuery, setToAdd) {
        const dbCollection = this.getDBCollection(database, collection);
        const updateQuery = {
            "$addToSet": {}
        };
        updateQuery.$addToSet = setToAdd;
        const updated = await dbCollection.updateOne(findQuery, updateQuery, { returnOriginal: false });
        return updated;
    }

    getDBCollection(database, collection) {
        const db = this.client.db(database);
        const dbCollection = db.collection(collection);
        return dbCollection;
    }
}

module.exports = DBDao;