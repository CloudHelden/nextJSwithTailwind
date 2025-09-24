// scripts/init-db.js
import mongoose from 'mongoose'
import User from '../src/models/User.js'
import Post from '../src/models/Post.js'

// Connection string from environment or default
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://admin:secretpassword@localhost:27017/mein-blog?authSource=admin'

async function initDatabase() {
    try {
        // Connect to MongoDB
        await mongoose.connect(MONGODB_URI)
        console.log('✅ Connected to MongoDB')

        // Create collections with indexes
        console.log('📝 Creating collections and indexes...')

        // This will create the collections if they don't exist
        await User.createCollection()
        await Post.createCollection()

        // Ensure indexes are created
        await User.syncIndexes()
        await Post.syncIndexes()

        console.log('✅ Collections and indexes created')

        // Optional: Create sample data
        const createSampleData = process.argv.includes('--sample-data')

        if (createSampleData) {
            console.log('📝 Creating sample data...')

            // Create sample users
            const users = await User.create([
                {
                    name: 'Max Mustermann',
                    email: 'max@example.com',
                    alter: 30,
                    hobbies: ['Lesen', 'Programmieren', 'Wandern'],
                    adresse: {
                        straße: 'Hauptstraße 1',
                        plz: '12345',
                        stadt: 'Berlin',
                        land: 'Deutschland'
                    }
                },
                {
                    name: 'Anna Schmidt',
                    email: 'anna@example.com',
                    alter: 28,
                    hobbies: ['Kochen', 'Reisen'],
                    adresse: {
                        straße: 'Nebenstraße 5',
                        plz: '54321',
                        stadt: 'München',
                        land: 'Deutschland'
                    }
                }
            ])

            console.log(`✅ Created ${users.length} users`)

            // Create sample posts
            const posts = await Post.create([
                {
                    title: 'Einführung in MongoDB',
                    slug: 'einfuehrung-in-mongodb',
                    content: 'MongoDB ist eine NoSQL-Datenbank, die Dokumente in JSON-ähnlichem Format speichert. Sie ist besonders gut geeignet für flexible Datenstrukturen und skalierbare Anwendungen. In diesem Artikel lernen Sie die Grundlagen von MongoDB kennen.',
                    author: users[0]._id,
                    tags: ['MongoDB', 'NoSQL', 'Database'],
                    published: true,
                    publishedAt: new Date(),
                    likes: 5
                },
                {
                    title: 'Next.js Best Practices',
                    slug: 'nextjs-best-practices',
                    content: 'Next.js ist ein leistungsstarkes React-Framework für produktionsreife Anwendungen. Es bietet Features wie Server-Side Rendering, Static Site Generation und API Routes out of the box. Hier sind die wichtigsten Best Practices für Next.js Entwicklung.',
                    author: users[0]._id,
                    tags: ['Next.js', 'React', 'JavaScript'],
                    published: true,
                    publishedAt: new Date(Date.now() - 86400000), // Yesterday
                    likes: 12
                },
                {
                    title: 'Mongoose Schema Design',
                    slug: 'mongoose-schema-design',
                    content: 'Mongoose bietet eine elegante MongoDB-Objektmodellierung für Node.js. Ein gut durchdachtes Schema ist die Grundlage für eine performante und wartbare Anwendung. Lernen Sie, wie Sie effektive Mongoose-Schemas entwerfen.',
                    author: users[1]._id,
                    tags: ['Mongoose', 'MongoDB', 'Schema'],
                    published: true,
                    publishedAt: new Date(Date.now() - 172800000), // 2 days ago
                    likes: 8,
                    comments: [
                        {
                            user: users[0]._id,
                            text: 'Sehr hilfreicher Artikel!',
                            createdAt: new Date()
                        }
                    ]
                },
                {
                    title: 'Docker für Entwickler',
                    slug: 'docker-fuer-entwickler',
                    content: 'Docker revolutioniert die Art und Weise, wie wir Anwendungen entwickeln und bereitstellen. Mit Containern können Sie Ihre Entwicklungsumgebung standardisieren und Deployment-Prozesse vereinfachen.',
                    author: users[1]._id,
                    tags: ['Docker', 'DevOps', 'Container'],
                    published: false,
                    likes: 0
                }
            ])

            console.log(`✅ Created ${posts.length} posts`)

            // Update user's favorite posts
            await User.findByIdAndUpdate(users[0]._id, {
                lieblingsPosts: [posts[1]._id, posts[2]._id]
            })
        }

        // Show collection stats
        console.log('\n📊 Database Statistics:')
        const userCount = await User.countDocuments()
        const postCount = await Post.countDocuments()
        const publishedCount = await Post.countDocuments({ published: true })

        console.log(`   Users: ${userCount}`)
        console.log(`   Posts: ${postCount} (${publishedCount} published)`)

        console.log('\n✅ Database initialization complete!')

    } catch (error) {
        console.error('❌ Error initializing database:', error)
        process.exit(1)
    } finally {
        await mongoose.disconnect()
        console.log('👋 Disconnected from MongoDB')
    }
}

// Run the initialization
initDatabase()