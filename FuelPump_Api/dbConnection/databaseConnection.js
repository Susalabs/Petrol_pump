require('dotenv').config();
const mongoose = require('mongoose');

const dbUri = process.env.MONGODB_URI;

if (!dbUri) {
    console.error("MONGODB_URI is not defined in the environment.");
    process.exit(1);
}

mongoose.connect(dbUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 5000 
}).then(() => {
    console.log('Successfully connected to MongoDB.');
}).catch(error => {
    console.error('Error connecting to MongoDB:', error);
    process.exit(1);
});

module.exports = mongoose;
