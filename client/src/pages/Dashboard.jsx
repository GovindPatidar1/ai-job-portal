import { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { authAPI, jobsAPI } from '../services/api'
import { updateUser } from '../store/authSlice'
import { Link } from 'react-router-dom'
import toast from 'react-hot-toast'
import { User, Briefcase, FileText, Bot, Upload, Edit3, Save } from 'lucide-react'

export default function Dashboard() {
  const { user } = useSelector((s) => s.auth)
  const dispatch = useDispatch()
  const [profile, setProfile] = useState({ name: user?.name || '', bio: '', location: '' })
  const [editing, setEditing] = useState(false)
  const [myJobs, setMyJobs] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    authAPI.getMe().then(({ data }) => {
      setProfile({ name: data.name || '', bio: data.bio || '', location: data.location || '' })
    })
    if (user?.role === 'employer' || user?.role === 'admin') {
      jobsAPI.getMyJobs().then(({ data }) => setMyJobs(data)).catch(() => {})
    }
  }, [])

  const saveProfile = async () => {
    setLoading(true)
    try {
      const { data } = await authAPI.updateProfile(profile)
      dispatch(updateUser(data))
      toast.success('Profile updated!')
      setEditing(false)
    } catch {
      toast.error('Failed to update profile')
    } finally {
      setLoading(false)
    }
  }

  const quickLinks = user?.role === 'jobseeker'
    ? [
        { to: '/resume', icon: <Upload size={20}/>, label: 'Upload Resume', desc: 'Parse & store your resume', color: 'text-blue-600 bg-blue-50' },
        { to: '/ai-tools', icon: <Bot size={20}/>, label: 'AI Tools', desc: 'Cover letter, skill gap & chatbot', color: 'text-purple-600 bg-purple-50' },
        { to: '/jobs', icon: <Briefcase size={20}/>, label: 'Browse Jobs', desc: 'Find your next opportunity', color: 'text-green-600 bg-green-50' },
        { to: '/my-applications', icon: <FileText size={20}/>, label: 'My Applications', desc: 'Track all your applications', color: 'text-orange-600 bg-orange-50' },
      ]
    : [
        { to: '/post-job', icon: <Briefcase size={20}/>, label: 'Post a Job', desc: 'Add a new job listing', color: 'text-blue-600 bg-blue-50' },
        { to: '/jobs', icon: <FileText size={20}/>, label: 'All Jobs', desc: 'Browse all job listings', color: 'text-green-600 bg-green-50' },
      ]

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Dashboard</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <div className="bg-white rounded-2xl border p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-gray-900">Profile</h2>
            <button onClick={() => setEditing(!editing)} className="text-gray-400 hover:text-blue-600">
              <Edit3 size={16}/>
            </button>
          </div>

          <div className="text-center mb-4">
            <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-2xl font-bold mx-auto mb-2">
              {user?.name?.[0]?.toUpperCase()}
            </div>
            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
              user?.role === 'admin' ? 'bg-purple-100 text-purple-600' :
              user?.role === 'employer' ? 'bg-green-100 text-green-600' :
              'bg-blue-100 text-blue-600'
            } capitalize`}>{user?.role}</span>
          </div>

          {editing ? (
            <div className="space-y-3">
              <input value={profile.name} onChange={(e) => setProfile({...profile, name: e.target.value})}
                placeholder="Full name" className="w-full border px-3 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"/>
              <input value={profile.location} onChange={(e) => setProfile({...profile, location: e.target.value})}
                placeholder="Location (e.g. Bangalore)" className="w-full border px-3 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"/>
              <textarea value={profile.bio} onChange={(e) => setProfile({...profile, bio: e.target.value})}
                placeholder="Short bio..." rows={3} className="w-full border px-3 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"/>
              <button onClick={saveProfile} disabled={loading} className="w-full bg-blue-600 text-white py-2 rounded-lg text-sm font-medium flex items-center justify-center gap-2">
                <Save size={14}/> {loading ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          ) : (
            <div className="space-y-2 text-sm text-gray-600">
              <p className="font-medium text-gray-900">{profile.name}</p>
              <p className="text-gray-400">{user?.email}</p>
              {profile.location && <p>📍 {profile.location}</p>}
              {profile.bio && <p className="text-gray-500">{profile.bio}</p>}
            </div>
          )}

          {user?.role === 'jobseeker' && (
            <div className="mt-4 pt-4 border-t">
              {user?.resume?.url ? (
                <div>
                  <p className="text-xs text-green-600 font-medium mb-1">✅ Resume uploaded</p>
                  <p className="text-xs text-gray-400">Skills: {user.resume?.parsedData?.skills?.slice(0,4).join(', ') || 'None detected'}</p>
                </div>
              ) : (
                <Link to="/resume" className="text-sm text-blue-600 hover:underline">+ Upload Resume</Link>
              )}
            </div>
          )}
        </div>

        {/* Quick Links */}
        <div className="lg:col-span-2">
          <h2 className="font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {quickLinks.map((link, i) => (
              <Link key={i} to={link.to} className="bg-white rounded-xl border hover:shadow-md transition-shadow p-5 flex items-start gap-4">
                <div className={`p-2.5 rounded-xl ${link.color}`}>{link.icon}</div>
                <div>
                  <p className="font-medium text-gray-900">{link.label}</p>
                  <p className="text-sm text-gray-500 mt-0.5">{link.desc}</p>
                </div>
              </Link>
            ))}
          </div>

          {/* Employer job listings */}
          {myJobs.length > 0 && (
            <div className="mt-6">
              <h2 className="font-semibold text-gray-900 mb-3">Your Job Listings</h2>
              <div className="space-y-3">
                {myJobs.slice(0, 4).map((job) => (
                  <div key={job._id} className="bg-white rounded-xl border p-4 flex justify-between items-center">
                    <div>
                      <p className="font-medium text-gray-900 text-sm">{job.title}</p>
                      <p className="text-xs text-gray-400">{job.applicants?.length || 0} applicants · {job.type}</p>
                    </div>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${job.isActive ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'}`}>
                      {job.isActive ? 'Active' : 'Closed'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
