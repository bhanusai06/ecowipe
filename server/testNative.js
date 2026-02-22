const { MongoClient } = require('mongodb');

const uri = "mongodb+srv://cherrytwo09_db_user:Charan242726@cluster0.tzkzpaq.mongodb.net/?appName=Cluster0";

const client = new MongoClient(uri, {
    serverSelectionTimeoutMS: 5000,
});

async function run() {
    try {
        await client.connect();
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        await client.close();
    }
}
run().catch(console.dir);
