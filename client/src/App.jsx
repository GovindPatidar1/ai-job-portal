import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import Jobs from './pages/Jobs'
import JobDetail from './pages/JobDetail'
import Dashboard from './pages/Dashboard'
import ResumeUpload from './pages/ResumeUpload'
import AITools from './pages/AITools'
import PostJob from './pages/PostJob'
import AdminPanel from './pages/AdminPanel'
import OAuthSuccess from './pages/OAuthSuccess'
import MyApplications from './pages/MyApplications'

const PrivateRoute = ({ children, roles }) => {
  const { isAuthenticated, user } = useSelector((s) => s.auth)
  if (!isAuthenticated) return <Navigate to="/login" replace />
  if (roles && !roles.includes(user?.role)) return <Navigate to="/" replace />
  return children
}

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <main className="min-h-screen bg-gray-50">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/jobs" element={<Jobs />} />
          <Route path="/jobs/:id" element={<JobDetail />} />
          <Route path="/oauth-success" element={<OAuthSuccess />} />
          <Route
            path="/dashboard"
            element={<PrivateRoute><Dashboard /></PrivateRoute>}
          />
          <Route
            path="/my-applications"
            element={<PrivateRoute roles={['jobseeker']}><MyApplications /></PrivateRoute>}
          />
          <Route
            path="/resume"
            element={<PrivateRoute roles={['jobseeker']}><ResumeUpload /></PrivateRoute>}
          />
          <Route
            path="/ai-tools"
            element={<PrivateRoute><AITools /></PrivateRoute>}
          />
          <Route
            path="/post-job"
            element={<PrivateRoute roles={['employer', 'admin']}><PostJob /></PrivateRoute>}
          />
          <Route
            path="/admin"
            element={<PrivateRoute roles={['admin']}><AdminPanel /></PrivateRoute>}
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </BrowserRouter>
  )
}
