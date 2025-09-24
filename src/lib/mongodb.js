// lib/mongodb.js
import mongoose from 'mongoose'

// Die Verbindungs-URL (lokal oder cloud)
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/mein-blog'

// Cache the connection to reuse across invocations in serverless environment
let cached = global.mongoose

if (!cached) {
    cached = global.mongoose = { conn: null, promise: null }
}

async function connectDB() {
    // If connection already exists, reuse it
    if (cached.conn) {
        return cached.conn
    }

    // If connection promise is in progress, wait for it
    if (!cached.promise) {
        const opts = {
            bufferCommands: false,
            maxPoolSize: 10,
            serverSelectionTimeoutMS: 5000,
        }

        cached.promise = mongoose.connect(MONGODB_URI, opts)
            .then((mongoose) => {
                console.log('✅ Mit MongoDB verbunden!')
                return mongoose
            })
            .catch((error) => {
                cached.promise = null
                console.error('❌ MongoDB Verbindung fehlgeschlagen:', error)
                throw error
            })
    }

    try {
        cached.conn = await cached.promise
    } catch (error) {
        cached.promise = null
        throw error
    }

    return cached.conn
}

export default connectDB