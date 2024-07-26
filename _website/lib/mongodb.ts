import { MongoClient } from 'mongodb';

if (!process.env.MONGO_KEY) {
    throw new Error('Invalid/Missing environment variable: "MONGO_KEY"');
}

const uri = process.env.MONGO_KEY;
const options = {};

let client: MongoClient;

if (process.env.NODE_ENV === 'development') {
    let globalWithMongo = global as typeof globalThis & {
        _mongoClient?: MongoClient;
    };

    if (!globalWithMongo._mongoClient) {
        globalWithMongo._mongoClient = new MongoClient(uri, options);
    }
    client = globalWithMongo._mongoClient;
} else {
    client = new MongoClient(uri, options);
}

export default client;