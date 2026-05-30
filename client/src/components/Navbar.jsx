import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { logout } from '../store/authSlice'
import { Briefcase, LogOut, User, Bot, Menu, X, PlusCircle, LayoutDashboard, FileText } from 'lucide-react'
import { useState } from 'react'

export default function Navbar() {
  const { isAuthenticated, user } = useSelector((s) => s.auth)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const location = useLocation()
  const [menuOpen, setMenuOpen] = useState(false)

  const handleLogout = () => {
    dispatch(logout())
    navigate('/')
    setMenuOpen(false)
  }

  const isActive = (path) => location.pathname === path

  const linkClass = (path) =>
    `text-sm font-medium transition-colors ${isActive(path) ? 'text-blue-600' : 'text-gray-600 hover:text-blue-600'}`

  return (
    <nav className="bg-white shadow-sm border-b sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 font-bold text-xl text-blue-600">
            <Briefcase size={22} />
            <span>AI Job Portal</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-6">
            <Link to="/jobs" className={linkClass('/jobs')}>Browse Jobs</Link>

            {isAuthenticated ? (
              <>
                <Link to="/ai-tools" className={`${linkClass('/ai-tools')} flex items-center gap-1`}>
                  <Bot size={15} /> AI Tools
                </Link>
                <Link to="/dashboard" className={`${linkClass('/dashboard')} flex items-center gap-1`}>
                  <LayoutDashboard size={15} /> Dashboard
                </Link>

                {user?.role === 'jobseeker' && (
                  <Link to="/my-applications" className={linkClass('/my-applications')}>My Applications</Link>
                )}

                {(user?.role === 'employer' || user?.role === 'admin') && (
                  <Link to="/post-job" className="flex items-center gap-1 bg-blue-600 text-white px-4 py-1.5 rounded-lg text-sm hover:bg-blue-700">
                    <PlusCircle size={15} /> Post Job
                  </Link>
                )}

                {user?.role === 'admin' && (
                  <Link to="/admin" className="text-sm font-medium text-purple-600 hover:text-purple-800">Admin</Link>
                )}

                <div className="flex items-center gap-2 border-l pl-4">
                  {user?.avatar
                    ? <img src={user.avatar} alt="" className="w-7 h-7 rounded-full object-cover" />
                    : <div className="w-7 h-7 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-xs font-bold">{user?.name?.[0]?.toUpperCase()}</div>
                  }
                  <span className="text-sm text-gray-700 font-medium">{user?.name?.split(' ')[0]}</span>
                  <button onClick={handleLogout} className="text-red-400 hover:text-red-600 ml-1">
                    <LogOut size={16} />
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link to="/login" className={linkClass('/login')}>Login</Link>
                <Link to="/register" className="bg-blue-600 text-white px-4 py-1.5 rounded-lg text-sm hover:bg-blue-700">
                  Sign Up
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <button className="md:hidden" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="md:hidden pb-4 space-y-3 border-t pt-3">
            <Link to="/jobs" onClick={() => setMenuOpen(false)} className="block text-gray-700 py-1">Browse Jobs</Link>
            {isAuthenticated ? (
              <>
                <Link to="/ai-tools" onClick={() => setMenuOpen(false)} className="block text-gray-700 py-1">AI Tools</Link>
                <Link to="/dashboard" onClick={() => setMenuOpen(false)} className="block text-gray-700 py-1">Dashboard</Link>
                {user?.role === 'jobseeker' && (
                  <Link to="/my-applications" onClick={() => setMenuOpen(false)} className="block text-gray-700 py-1">My Applications</Link>
                )}
                {(user?.role === 'employer' || user?.role === 'admin') && (
                  <Link to="/post-job" onClick={() => setMenuOpen(false)} className="block text-blue-600 py-1">Post a Job</Link>
                )}
                {user?.role === 'admin' && (
                  <Link to="/admin" onClick={() => setMenuOpen(false)} className="block text-purple-600 py-1">Admin Panel</Link>
                )}
                <button onClick={handleLogout} className="block text-red-500 py-1">Logout</button>
              </>
            ) : (
              <>
                <Link to="/login" onClick={() => setMenuOpen(false)} className="block text-gray-700 py-1">Login</Link>
                <Link to="/register" onClick={() => setMenuOpen(false)} className="block text-blue-600 py-1">Sign Up</Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  )
}
