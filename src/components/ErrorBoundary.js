'use client'

import React from 'react'

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props)
        this.state = { hasError: false, error: null }
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error }
    }

    componentDidCatch(error, errorInfo) {
        console.error('Error caught by boundary:', error, errorInfo)
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen flex items-center justify-center bg-gray-50">
                    <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-6">
                        <h2 className="text-2xl font-bold text-red-600 mb-4">
                            Etwas ist schief gelaufen
                        </h2>
                        <p className="text-gray-600 mb-4">
                            Ein unerwarteter Fehler ist aufgetreten. Bitte versuchen Sie es später erneut.
                        </p>
                        <details className="mb-4">
                            <summary className="cursor-pointer text-sm text-gray-500">
                                Technische Details
                            </summary>
                            <pre className="mt-2 text-xs bg-gray-100 p-2 rounded overflow-auto">
                                {this.state.error?.toString()}
                            </pre>
                        </details>
                        <button
                            onClick={() => window.location.reload()}
                            className="w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                        >
                            Seite neu laden
                        </button>
                    </div>
                </div>
            )
        }

        return this.props.children
    }
}

export default ErrorBoundary