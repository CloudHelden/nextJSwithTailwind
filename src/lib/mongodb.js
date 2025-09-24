// lib/mongodb.js
import mongoose from 'mongoose'

// Die Verbindungs-URL (lokal oder cloud)
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/mein-blog'

async function connectDB() {
    try {
        await mongoose.connect(MONGODB_URI)
        console.log('✅ Mit MongoDB verbunden!')
    } catch (error) {
        console.error('❌ MongoDB Verbindung fehlgeschlagen:', error)
    }
}

export default connectDB