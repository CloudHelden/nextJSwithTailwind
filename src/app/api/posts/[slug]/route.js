// app/api/posts/[slug]/route.js
import connectDB from '@/lib/mongodb'
import Post from '@/models/Post'

// GET - Single post by slug
export async function GET(request, { params }) {
    try {
        await connectDB()

        // Await params before destructuring in Next.js 15
        const { slug } = await params

        if (!slug) {
            return Response.json(
                { error: 'Slug ist erforderlich' },
                { status: 400 }
            )
        }

        // Find post by slug and populate author
        const post = await Post
            .findOne({ slug: slug, published: true })
            .populate('author', 'name email')
            .populate('comments.user', 'name')
            .lean()

        if (!post) {
            return Response.json(
                { error: 'Post nicht gefunden' },
                { status: 404 }
            )
        }

        // Add computed summary if needed
        const postWithSummary = {
            ...post,
            summary: post.content ?
                (post.content.length > 100 ?
                    post.content.substring(0, 100) + '...' :
                    post.content) :
                ''
        }

        return Response.json(postWithSummary)
    } catch (error) {
        console.error('Error fetching post:', error)
        return Response.json(
            { error: 'Fehler beim Laden des Posts' },
            { status: 500 }
        )
    }
}

// PUT - Update post by slug
export async function PUT(request, { params }) {
    try {
        await connectDB()

        // Await params before destructuring in Next.js 15
        const { slug } = await params
        const data = await request.json()

        if (!slug) {
            return Response.json(
                { error: 'Slug ist erforderlich' },
                { status: 400 }
            )
        }

        // Find and update post
        const post = await Post.findOneAndUpdate(
            { slug: slug },
            {
                title: data.title,
                content: data.content,
                tags: data.tags,
                published: data.published,
                publishedAt: data.published ? new Date() : null
            },
            { new: true, runValidators: true }
        ).populate('author', 'name email')

        if (!post) {
            return Response.json(
                { error: 'Post nicht gefunden' },
                { status: 404 }
            )
        }

        return Response.json(post)
    } catch (error) {
        console.error('Error updating post:', error)

        if (error.name === 'ValidationError') {
            return Response.json(
                { error: 'Validierungsfehler: ' + error.message },
                { status: 400 }
            )
        }

        return Response.json(
            { error: 'Fehler beim Aktualisieren des Posts' },
            { status: 500 }
        )
    }
}

// DELETE - Delete post by slug
export async function DELETE(request, { params }) {
    try {
        await connectDB()

        // Await params before destructuring in Next.js 15
        const { slug } = await params

        if (!slug) {
            return Response.json(
                { error: 'Slug ist erforderlich' },
                { status: 400 }
            )
        }

        // Find and delete post
        const post = await Post.findOneAndDelete({ slug: slug })

        if (!post) {
            return Response.json(
                { error: 'Post nicht gefunden' },
                { status: 404 }
            )
        }

        return Response.json(
            { message: 'Post erfolgreich gelöscht' },
            { status: 200 }
        )
    } catch (error) {
        console.error('Error deleting post:', error)
        return Response.json(
            { error: 'Fehler beim Löschen des Posts' },
            { status: 500 }
        )
    }
}