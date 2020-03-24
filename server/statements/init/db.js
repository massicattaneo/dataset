const { MongoClient, ObjectID } = require('mongodb');

const Init = {
    NAME: `inspector`,
    URL: `mongodb://localhost:27017/${this.NAME}`
};
module.exports = async function () {
    const client = new MongoClient(Init.URL, { useNewUrlParser: true, useUnifiedTopology: true });
    const clientDb = await (new Promise(resolve => client.connect((err) => {
        this.thread.exit(err);
        resolve(client.db(Init.NAME));
    })));
    const db = {
        client,
        rest: {
            get: (collection, filter = {}) => {
                if (filter._id && !(filter._id instanceof ObjectID)) {
                    filter._id = new ObjectID(filter._id);
                }
                return client
                    .db(Init.NAME)
                    .collection(collection)
                    .find(Object.assign(filter, { deleted: { $exists: false } }))
                    .sort({ _id: -1 })
                    // .skip(0)
                    // .limit(10)
                    .toArray();
            },
            post: (collection, document) => {
                return client.db(Init.NAME).collection(collection).insertOne(document)
                    .then(result => {
                        return result;
                    });
            },
            put: (collection, id, document) => {
                return client.db(Init.NAME).collection(collection)
                    .updateOne(
                        { _id: new ObjectID(id) },
                        { $set: document }).then(result => {
                    });
            },
            delete: (collection, id) => {
                return client.db(Init.NAME).collection(collection).deleteOne({ _id: new ObjectID(id) })
                    .then(result => {
                    });
            }
        }
    };
    return { db };
};
