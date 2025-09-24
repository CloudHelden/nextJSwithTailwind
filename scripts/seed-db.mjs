#!/usr/bin/env node
// scripts/seed-db.mjs
// Use .mjs extension for ES modules support in Node.js

import mongoose from 'mongoose'
import '../src/lib/mongodb.js'

// Dynamic imports for models
async function seedDatabase() {
    try {
        // Get MongoDB URI from environment
        const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://admin:secretpassword@localhost:27017/mein-blog?authSource=admin'

        // Connect to MongoDB
        await mongoose.connect(MONGODB_URI)
        console.log('✅ Connected to MongoDB')

        // Import models
        const User = (await import('../src/models/User.js')).default
        const Post = (await import('../src/models/Post.js')).default

        // Clear existing data (optional)
        const clearData = process.argv.includes('--clear')
        if (clearData) {
            console.log('🗑️ Clearing existing data...')
            await User.deleteMany({})
            await Post.deleteMany({})
            console.log('✅ Existing data cleared')
        }

        // Create users
        console.log('👤 Creating users...')
        const users = await User.insertMany([
            {
                name: 'Admin User',
                email: 'admin@blog.de',
                alter: 35,
                hobbies: ['Blogging', 'Coding'],
                adresse: {
                    stadt: 'Berlin'
                }
            },
            {
                name: 'Test User',
                email: 'test@blog.de',
                alter: 25,
                hobbies: ['Reading'],
                adresse: {
                    stadt: 'Hamburg'
                }
            }
        ])
        console.log(`✅ Created ${users.length} users`)

        // Create posts
        console.log('📝 Creating posts...')
        const posts = await Post.insertMany([
            {
                title: 'Willkommen zu unserem Blog',
                slug: 'willkommen-zu-unserem-blog',
                content: 'Dies ist der erste Beitrag in unserem neuen Blog. Wir freuen uns, Sie hier begrüßen zu dürfen!',
                author: users[0]._id,
                tags: ['Welcome', 'First Post'],
                published: true,
                publishedAt: new Date(),
                likes: 10
            },
            {
                title: 'MongoDB Tutorial',
                slug: 'mongodb-tutorial',
                content: 'In diesem Tutorial lernen Sie die Grundlagen von MongoDB und wie Sie es mit Node.js verwenden können.',
                author: users[0]._id,
                tags: ['MongoDB', 'Tutorial', 'Database'],
                published: true,
                publishedAt: new Date(),
                likes: 15
            },
            {
                title: 'Draft Post',
                slug: 'draft-post',
                content: 'This is a draft post that is not yet published.',
                author: users[1]._id,
                tags: ['Draft'],
                published: false
            }
        ])
        console.log(`✅ Created ${posts.length} posts`)

        console.log('\n✨ Database seeded successfully!')

    } catch (error) {
        console.error('❌ Error seeding database:', error)
        process.exit(1)
    } finally {
        await mongoose.disconnect()
        console.log('👋 Disconnected from MongoDB')
    }
}

// Run seeding
seedDatabase()