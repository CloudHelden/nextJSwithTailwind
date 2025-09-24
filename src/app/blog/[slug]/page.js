// app/blog/[slug]/page.js
'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'

export default function BlogPostPage() {
    const params = useParams()
    const router = useRouter()
    const [post, setPost] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        if (params.slug) {
            fetchPost(params.slug)
        }
    }, [params.slug])

    const fetchPost = async (slug) => {
        try {
            const response = await fetch(`/api/posts/${slug}`)

            if (!response.ok) {
                if (response.status === 404) {
                    throw new Error('Post nicht gefunden')
                }
                throw new Error('Fehler beim Laden des Posts')
            }

            const data = await response.json()
            setPost(data)
        } catch (error) {
            console.error('Error fetching post:', error)
            setError(error.message)
        } finally {
            setLoading(false)
        }
    }

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Lade Post...</p>
                </div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center max-w-md">
                    <h2 className="text-2xl font-bold text-red-600 mb-4">
                        {error === 'Post nicht gefunden' ? '404 - Post nicht gefunden' : 'Fehler'}
                    </h2>
                    <p className="text-gray-600 mb-6">{error}</p>
                    <button
                        onClick={() => router.push('/blog')}
                        className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
                    >
                        Zurück zum Blog
                    </button>
                </div>
            </div>
        )
    }

    if (!post) {
        return null
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <article className="max-w-4xl mx-auto px-4">
                {/* Back button */}
                <button
                    onClick={() => router.push('/blog')}
                    className="mb-6 text-blue-600 hover:text-blue-700 flex items-center gap-2"
                >
                    ← Zurück zum Blog
                </button>

                {/* Post content */}
                <div className="bg-white rounded-lg shadow-md p-8">
                    {/* Header */}
                    <header className="mb-8">
                        <h1 className="text-4xl font-bold mb-4">{post.title}</h1>

                        <div className="flex items-center gap-4 text-gray-600 text-sm mb-4">
                            <span>Von {post.author?.name || 'Unbekannt'}</span>
                            <span>•</span>
                            <span>
                                {post.publishedAt
                                    ? new Date(post.publishedAt).toLocaleDateString('de-DE', {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric'
                                    })
                                    : 'Nicht veröffentlicht'}
                            </span>
                            <span>•</span>
                            <span>{post.likes || 0} Likes</span>
                        </div>

                        {/* Tags */}
                        {post.tags && post.tags.length > 0 && (
                            <div className="flex gap-2 flex-wrap">
                                {post.tags.map((tag, index) => (
                                    <span
                                        key={index}
                                        className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm"
                                    >
                                        #{tag}
                                    </span>
                                ))}
                            </div>
                        )}
                    </header>

                    {/* Content */}
                    <div className="prose prose-lg max-w-none">
                        <div className="whitespace-pre-wrap text-gray-800 leading-relaxed">
                            {post.content}
                        </div>
                    </div>

                    {/* Footer */}
                    <footer className="mt-8 pt-8 border-t border-gray-200">
                        <div className="flex justify-between items-center">
                            <button className="flex items-center gap-2 text-gray-600 hover:text-red-600">
                                <span className="text-2xl">❤️</span>
                                <span>{post.likes || 0} Likes</span>
                            </button>

                            <div className="flex gap-4">
                                <button className="text-gray-600 hover:text-blue-600">
                                    Teilen
                                </button>
                                <button className="text-gray-600 hover:text-blue-600">
                                    Kommentieren
                                </button>
                            </div>
                        </div>
                    </footer>

                    {/* Comments section */}
                    {post.comments && post.comments.length > 0 && (
                        <div className="mt-8 pt-8 border-t border-gray-200">
                            <h3 className="text-xl font-semibold mb-4">
                                Kommentare ({post.comments.length})
                            </h3>
                            <div className="space-y-4">
                                {post.comments.map((comment, index) => (
                                    <div key={index} className="bg-gray-50 rounded p-4">
                                        <div className="flex justify-between items-start mb-2">
                                            <span className="font-medium">
                                                {comment.user?.name || 'Anonym'}
                                            </span>
                                            <span className="text-sm text-gray-500">
                                                {new Date(comment.createdAt).toLocaleDateString('de-DE')}
                                            </span>
                                        </div>
                                        <p className="text-gray-700">{comment.text}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Author info */}
                {post.author && (
                    <div className="mt-6 bg-white rounded-lg shadow-md p-6">
                        <h3 className="font-semibold mb-2">Über den Autor</h3>
                        <div className="flex items-center gap-4">
                            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                                <span className="text-2xl font-bold text-blue-600">
                                    {post.author.name?.[0] || 'A'}
                                </span>
                            </div>
                            <div>
                                <p className="font-medium">{post.author.name}</p>
                                <p className="text-sm text-gray-600">{post.author.email}</p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Related posts suggestion */}
                <div className="mt-6 bg-blue-50 rounded-lg p-6">
                    <h3 className="font-semibold mb-2">Weitere Posts</h3>
                    <p className="text-sm text-gray-700 mb-4">
                        Entdecken Sie weitere interessante Artikel in unserem Blog.
                    </p>
                    <button
                        onClick={() => router.push('/blog')}
                        className="text-blue-600 hover:text-blue-700 font-medium"
                    >
                        Alle Posts anzeigen →
                    </button>
                </div>
            </article>
        </div>
    )
}