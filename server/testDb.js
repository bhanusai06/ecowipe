const mongoose = require('mongoose');

const uri = 'mongodb://cherrytwo09_db_user:Charan242726@ac-mzansc2-shard-00-00.tzkzpaq.mongodb.net:27017,ac-mzansc2-shard-00-01.tzkzpaq.mongodb.net:27017,ac-mzansc2-shard-00-02.tzkzpaq.mongodb.net:27017/?ssl=true&replicaSet=atlas-ki8p0u-shard-0&authSource=admin&retryWrites=true&w=majority&appName=Cluster0';

const connectDB = async () => {
    try {
        console.log('Connecting with direct Replica Set URI...');
        await mongoose.connect(uri, {
            serverSelectionTimeoutMS: 5000,
            family: 4
        });
        console.log('MongoDB Connected Successfully!');
        process.exit(0);
    } catch (error) {
        console.error('Connection Error:', error);
        process.exit(1);
    }
};

connectDB();
