// scripts/check-db.js
// Quick script to check database connection and show collections

import mongoose from 'mongoose'

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://admin:secretpassword@localhost:27017/mein-blog?authSource=admin'

async function checkDatabase() {
    try {
        // Connect
        await mongoose.connect(MONGODB_URI)
        console.log('✅ Connected to MongoDB')

        // Get database info
        const db = mongoose.connection.db
        const admin = db.admin()

        // List databases
        const dbList = await admin.listDatabases()
        console.log('\n📚 Available Databases:')
        dbList.databases.forEach(db => {
            console.log(`   - ${db.name} (${(db.sizeOnDisk / 1024 / 1024).toFixed(2)} MB)`)
        })

        // List collections in current database
        const collections = await db.listCollections().toArray()
        console.log(`\n📁 Collections in '${db.databaseName}':`)

        for (const coll of collections) {
            const stats = await db.collection(coll.name).countDocuments()
            console.log(`   - ${coll.name}: ${stats} documents`)
        }

        // Check indexes
        if (collections.length > 0) {
            console.log('\n🔍 Indexes:')
            for (const coll of collections) {
                const indexes = await db.collection(coll.name).indexes()
                console.log(`   ${coll.name}:`)
                indexes.forEach(idx => {
                    console.log(`     - ${idx.name}: ${JSON.stringify(idx.key)}`)
                })
            }
        }

    } catch (error) {
        console.error('❌ Error:', error.message)
        process.exit(1)
    } finally {
        await mongoose.disconnect()
        console.log('\n👋 Disconnected')
    }
}

checkDatabase()