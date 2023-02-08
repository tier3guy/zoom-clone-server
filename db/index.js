const mongoose = require('mongoose');

const connectToDatabase = async () => {
    try {
        const res = await mongoose.connect(process.env.MONGO_URI, {});
        if(res) console.log('>> Database connected successfully ...');
    } catch (error) {
        console.log('>> Error connecting to MongoDB');
    }
};

mongoose.set('strictQuery', true);

module.exports = connectToDatabase;