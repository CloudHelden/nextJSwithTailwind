// app/blog/page.js
'use client'

import { useState, useEffect } from 'react'

export default function BlogPage() {
    const [posts, setPosts] = useState([])  // Immer mit [] initialisieren
    const [loading, setLoading] = useState(true)
    const [filter, setFilter] = useState('')

    useEffect(() => {
        fetchPosts()
    }, [])

    const fetchPosts = async () => {
        try {
            const response = await fetch('/api/posts')
            if (!response.ok) {
                throw new Error('Failed to fetch posts')
            }
            const data = await response.json()
            // Ensure data is an array even if API returns error
            setPosts(Array.isArray(data) ? data : [])
        } catch (error) {
            console.error('Fehler:', error)
            setPosts([])  // Set empty array on error
        } finally {
            setLoading(false)
        }
    }

    // Client-seitige Suche with null checks
    const filteredPosts = posts.filter(post => {
        if (!post || !post.title || !post.content) return false
        const searchTerm = filter.toLowerCase()
        return post.title.toLowerCase().includes(searchTerm) ||
               post.content.toLowerCase().includes(searchTerm)
    })

    if (loading) return <div>Lade Blog-Posts...12345 Halloo</div>

    return (
        <div className="p-8">
            <h1 className="text-3xl font-bold mb-6">Blog</h1>

            {/* Suchfeld */}
            <input
                type="text"
                placeholder="Suche Posts..."
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="w-full p-2 border rounded mb-6"
            />

            {/* Posts anzeigen */}
            <div className="grid gap-6">
                {filteredPosts.map(post => (
                    <article key={post._id} className="border rounded p-6">
                        <h2 className="text-2xl font-semibold mb-2">
                            {post.title}
                        </h2>

                        <div className="text-gray-600 text-sm mb-4">
                            von {post.author?.name || 'Unbekannt'} •
                            {post.publishedAt ? new Date(post.publishedAt).toLocaleDateString('de-DE') : 'Nicht veröffentlicht'}
                        </div>

                        <p className="mb-4">{post.summary}</p>

                        <div className="flex gap-2 mb-4">
                            {post.tags?.map(tag => (
                                <span key={tag} className="bg-blue-100 px-2 py-1 rounded text-sm">
                  #{tag}
                </span>
                            ))}
                        </div>

                        <div className="flex justify-between items-center">
                            <span>❤️ {post.likes} Likes</span>
                            <a href={`/blog/${post.slug}`} className="text-blue-500">
                                Weiterlesen →
                            </a>
                        </div>
                    </article>
                ))}
            </div>
        </div>
    )
}