// app/blog/write/page.js
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function WritePostPage() {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [success, setSuccess] = useState(false)

    const [formData, setFormData] = useState({
        title: '',
        content: '',
        tags: '',
        published: true
    })

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        setError('')
        setSuccess(false)

        try {
            // Prepare data
            const postData = {
                title: formData.title.trim(),
                content: formData.content.trim(),
                tags: formData.tags
                    .split(',')
                    .map(tag => tag.trim())
                    .filter(tag => tag.length > 0),
                published: formData.published
            }

            // Validate
            if (!postData.title) {
                throw new Error('Titel ist erforderlich')
            }
            if (!postData.content) {
                throw new Error('Inhalt ist erforderlich')
            }
            if (postData.title.length > 100) {
                throw new Error('Titel darf maximal 100 Zeichen lang sein')
            }

            // Send to API
            const response = await fetch('/api/posts', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(postData),
            })

            const result = await response.json()

            if (!response.ok) {
                throw new Error(result.error || 'Fehler beim Erstellen des Posts')
            }

            setSuccess(true)

            // Reset form
            setFormData({
                title: '',
                content: '',
                tags: '',
                published: true
            })

            // Redirect to blog after 2 seconds
            setTimeout(() => {
                router.push('/blog')
            }, 2000)

        } catch (err) {
            console.error('Error creating post:', err)
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-4xl mx-auto px-4">
                <div className="bg-white rounded-lg shadow-md p-8">
                    <h1 className="text-3xl font-bold mb-6">Neuen Blog-Post schreiben</h1>

                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
                            {error}
                        </div>
                    )}

                    {success && (
                        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded mb-4">
                            Post erfolgreich erstellt! Weiterleitung zum Blog...
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Title */}
                        <div>
                            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                                Titel *
                            </label>
                            <input
                                type="text"
                                id="title"
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                maxLength={100}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                placeholder="Geben Sie einen aussagekräftigen Titel ein..."
                                disabled={loading}
                            />
                            <p className="mt-1 text-sm text-gray-500">
                                {formData.title.length}/100 Zeichen
                            </p>
                        </div>

                        {/* Content */}
                        <div>
                            <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">
                                Inhalt *
                            </label>
                            <textarea
                                id="content"
                                name="content"
                                value={formData.content}
                                onChange={handleChange}
                                rows={12}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                placeholder="Schreiben Sie Ihren Blog-Post hier..."
                                disabled={loading}
                            />
                            {formData.content.length > 0 && (
                                <p className="mt-1 text-sm text-gray-500">
                                    {formData.content.length} Zeichen
                                </p>
                            )}
                        </div>

                        {/* Tags */}
                        <div>
                            <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-2">
                                Tags
                            </label>
                            <input
                                type="text"
                                id="tags"
                                name="tags"
                                value={formData.tags}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                placeholder="Tag1, Tag2, Tag3 (mit Komma getrennt)"
                                disabled={loading}
                            />
                            <p className="mt-1 text-sm text-gray-500">
                                Trennen Sie Tags mit Kommas
                            </p>
                        </div>

                        {/* Published Checkbox */}
                        <div className="flex items-center">
                            <input
                                type="checkbox"
                                id="published"
                                name="published"
                                checked={formData.published}
                                onChange={handleChange}
                                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                disabled={loading}
                            />
                            <label htmlFor="published" className="ml-2 block text-sm text-gray-700">
                                Sofort veröffentlichen
                            </label>
                        </div>

                        {/* Preview Section */}
                        {(formData.title || formData.content) && (
                            <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                                <h2 className="text-lg font-semibold mb-3">Vorschau</h2>
                                <div className="space-y-2">
                                    {formData.title && (
                                        <h3 className="text-xl font-bold">{formData.title}</h3>
                                    )}
                                    {formData.content && (
                                        <p className="text-gray-700 whitespace-pre-wrap">
                                            {formData.content.length > 200
                                                ? formData.content.substring(0, 200) + '...'
                                                : formData.content}
                                        </p>
                                    )}
                                    {formData.tags && (
                                        <div className="flex gap-2 flex-wrap pt-2">
                                            {formData.tags.split(',')
                                                .map(tag => tag.trim())
                                                .filter(tag => tag.length > 0)
                                                .map((tag, index) => (
                                                    <span key={index} className="bg-blue-100 px-2 py-1 rounded text-sm">
                                                        #{tag}
                                                    </span>
                                                ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Buttons */}
                        <div className="flex gap-4">
                            <button
                                type="submit"
                                disabled={loading || !formData.title || !formData.content}
                                className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                            >
                                {loading ? 'Wird gespeichert...' : 'Post erstellen'}
                            </button>
                            <button
                                type="button"
                                onClick={() => router.push('/blog')}
                                disabled={loading}
                                className="px-6 py-2 border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 transition-colors"
                            >
                                Abbrechen
                            </button>
                        </div>
                    </form>
                </div>

                {/* Tips Section */}
                <div className="mt-6 bg-blue-50 rounded-lg p-6">
                    <h3 className="font-semibold mb-2">Tipps für gute Blog-Posts:</h3>
                    <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
                        <li>Verwenden Sie einen aussagekräftigen Titel</li>
                        <li>Strukturieren Sie Ihren Inhalt mit Absätzen</li>
                        <li>Fügen Sie relevante Tags hinzu für bessere Auffindbarkeit</li>
                        <li>Überprüfen Sie Rechtschreibung und Grammatik</li>
                        <li>Halten Sie den Inhalt informativ und interessant</li>
                    </ul>
                </div>
            </div>
        </div>
    )
}