/**
 * Global 404 Not Found Page
 * 
 * Displays when:
 * - User visits a route that doesn't exist
 * - CMS content is not found (via notFound() from next/navigation)
 * 
 * This is a server component, so it can fetch data if needed.
 */

import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 px-4">
      <div className="max-w-md w-full text-center">
        <div className="mb-8">
          <h1 className="text-6xl font-bold text-white mb-4">404</h1>
          <h2 className="text-2xl font-semibold text-white mb-4">
            Page not found
          </h2>
          <p className="text-slate-300 mb-8">
            The page you're looking for doesn't exist or has been moved.
          </p>
        </div>

        <div className="space-y-4">
          <Link
            href="/"
            className="block w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
          >
            Go to homepage
          </Link>
          
          <div className="flex gap-4 justify-center">
            <Link
              href="/services"
              className="text-slate-400 hover:text-white transition-colors text-sm"
            >
              Services
            </Link>
            <Link
              href="/projects"
              className="text-slate-400 hover:text-white transition-colors text-sm"
            >
              Projects
            </Link>
            <Link
              href="/blogs"
              className="text-slate-400 hover:text-white transition-colors text-sm"
            >
              Blog
            </Link>
            <Link
              href="/contact"
              className="text-slate-400 hover:text-white transition-colors text-sm"
            >
              Contact
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}