import { Link } from 'react-router-dom'
import { Home } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-gray-400">
      <p className="text-8xl font-bold text-gray-200 mb-4">404</p>
      <h1 className="text-2xl font-semibold text-gray-700 mb-2">Page not found</h1>
      <p className="text-gray-400 mb-6">The page you're looking for doesn't exist.</p>
      <Link to="/" className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-xl font-medium hover:bg-blue-700">
        <Home size={16}/> Back to Home
      </Link>
    </div>
  )
}
