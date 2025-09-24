// app/api/posts/route.js
import connectDB from '@/lib/mongodb'
import Post from '@/models/Post'
import User from '@/models/User'

// GET - Alle Posts holen
export async function GET(request) {
    try {
        await connectDB()

        // Mit Autor-Informationen laden (populate)
        const posts = await Post
            .find({ published: true })
            .populate('author', 'name email')  // Nur name und email vom Author
            .sort({ publishedAt: -1 })  // Neueste zuerst
            .limit(10)
            .lean()  // Convert to plain JS objects for serialization

        // Add computed summary field for client
        const postsWithSummary = posts.map(post => ({
            ...post,
            summary: post.content ?
                (post.content.length > 100 ?
                    post.content.substring(0, 100) + '...' :
                    post.content) :
                ''
        }))

        return Response.json(postsWithSummary)
    } catch (error) {
        console.error('Error fetching posts:', error)
        return Response.json(
            { error: 'Fehler beim Laden der Posts' },
            { status: 500 }
        )
    }
}

// POST - Neuen Post erstellen
export async function POST(request) {
    try {
        await connectDB()

        const data = await request.json()

        // Validate required fields
        if (!data.title || !data.content) {
            return Response.json(
                { error: 'Titel und Inhalt sind erforderlich' },
                { status: 400 }
            )
        }

        // Generate slug from title
        const slug = data.title
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '')

        // Find or create a default author for demo purposes
        let author = await User.findOne()
        if (!author) {
            // Create a demo user if none exists
            author = await User.create({
                name: 'Demo User',
                email: 'demo@example.com',
                alter: 25
            })
        }

        // Create post with validated data
        const post = await Post.create({
            title: data.title,
            content: data.content,
            slug,
            author: author._id,
            tags: data.tags || [],
            published: data.published !== false,  // Default to true
            publishedAt: data.published !== false ? new Date() : null
        })

        // Populate author info before returning
        await post.populate('author', 'name email')

        return Response.json(post, { status: 201 })
    } catch (error) {
        console.error('Error creating post:', error)

        if (error.code === 11000) {  // Duplicate key error
            return Response.json(
                { error: 'Ein Post mit diesem Titel existiert bereits' },
                { status: 400 }
            )
        }

        if (error.name === 'ValidationError') {
            return Response.json(
                { error: 'Validierungsfehler: ' + error.message },
                { status: 400 }
            )
        }

        return Response.json(
            { error: 'Fehler beim Erstellen des Posts' },
            { status: 500 }
        )
    }
}