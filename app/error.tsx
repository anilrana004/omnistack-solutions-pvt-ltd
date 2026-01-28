'use client'

/**
 * Global Error Boundary
 * 
 * Catches unhandled errors in the app and displays a user-friendly error page.
 * Logs full error details server-side for debugging.
 * 
 * This component only renders on the client, so it can use React hooks.
 */

import { useEffect } from 'react'
import Link from 'next/link'

interface ErrorProps {
  error: Error & { digest?: string }
  reset: () => void
}

export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    // Log error details to console (server-side logs in Vercel Functions)
    // In production, these logs appear in Vercel dashboard
    console.error('Global error boundary caught:', {
      message: error.message,
      stack: error.stack,
      digest: error.digest,
      timestamp: new Date().toISOString(),
    })
  }, [error])

  return (
    <html lang="en">
      <body>
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 px-4">
          <div className="max-w-md w-full text-center">
            <div className="mb-8">
              <h1 className="text-6xl font-bold text-white mb-4">500</h1>
              <h2 className="text-2xl font-semibold text-white mb-4">
                Something went wrong
              </h2>
              <p className="text-slate-300 mb-8">
                We're sorry, but something unexpected happened. Our team has been notified.
              </p>
            </div>

            <div className="space-y-4">
              <button
                onClick={reset}
                className="w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
              >
                Try again
              </button>
              
              <Link
                href="/"
                className="block w-full px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white font-medium rounded-lg transition-colors"
              >
                Go to homepage
              </Link>
            </div>

            {process.env.NODE_ENV === 'development' && (
              <details className="mt-8 text-left">
                <summary className="text-slate-400 cursor-pointer text-sm mb-2">
                  Error details (development only)
                </summary>
                <pre className="text-xs text-slate-500 bg-slate-900 p-4 rounded overflow-auto max-h-64">
                  {error.message}
                  {error.stack && `\n\n${error.stack}`}
                </pre>
              </details>
            )}
          </div>
        </div>
      </body>
    </html>
  )
}