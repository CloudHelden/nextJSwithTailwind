// app/api/posts/route.js
import connectDB from '@/lib/mongodb'
import Post from '@/models/Post'
import User from '@/models/User'

// GET - Alle Posts holen
export async function GET(request) {
    await connectDB()

    try {
        // Mit Autor-Informationen laden (populate)
        const posts = await Post
            .find({ published: true })
            .populate('author', 'name email')  // Nur name und email vom Author
            .sort({ publishedAt: -1 })  // Neueste zuerst
            .limit(10)

        return Response.json(posts)
    } catch (error) {
        return Response.json(
            { error: 'Fehler beim Laden der Posts' },
            { status: 500 }
        )
    }
}

// POST - Neuen Post erstellen
export async function POST(request) {
    await connectDB()

    try {
        const data = await request.json()

        // Slug aus Titel generieren
        const slug = data.title
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '')

        const post = await Post.create({
            ...data,
            slug,
            author: '507f1f77bcf86cd799439011'  // Normalerweise aus Session
        })

        return Response.json(post, { status: 201 })
    } catch (error) {
        if (error.code === 11000) {  // Duplicate key error
            return Response.json(
                { error: 'Ein Post mit diesem Titel existiert bereits' },
                { status: 400 }
            )
        }

        return Response.json(
            { error: 'Fehler beim Erstellen des Posts' },
            { status: 500 }
        )
    }
}