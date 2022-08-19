require('dotenv').config()
const { createLogger } = require('./utils/logger')
const logger = createLogger()

const admin = require('firebase-admin')
const serviceAccount = require(process.env.FIREBASE_SERVICE_ACCOUNT)

const MONGO_URI = process.env.MONGO_URI
const mongoose = require('mongoose')

const mongoConnection = async () => {
    try {
        await mongoose.connect(MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        logger.info('MongoDB Atlas conectado')
    } catch (e) {
        let message=`Error en DB ${e.message}`
        logger.error(message)
        throw new Error(message);
    }
}


// Initialize Firebase
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: process.env.FIREBASE_URL
});
logger.info('Firebase conectado')
const firebaseConnection = admin.firestore()

module.exports = {
    mongoConnection,
    firebaseConnection
}