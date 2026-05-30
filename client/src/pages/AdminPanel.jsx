import { useState, useEffect } from 'react'
import { adminAPI } from '../services/api'
import toast from 'react-hot-toast'
import { Users, Briefcase, FileText, TrendingUp, Loader, ShieldAlert, Trash2 } from 'lucide-react'

export default function AdminPanel() {
  const [stats, setStats] = useState(null)
  const [users, setUsers] = useState([])
  const [tab, setTab] = useState('overview')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([adminAPI.getStats(), adminAPI.getUsers()])
      .then(([statsRes, usersRes]) => {
        setStats(statsRes.data)
        setUsers(usersRes.data.users)
      })
      .catch(() => toast.error('Failed to load admin data'))
      .finally(() => setLoading(false))
  }, [])

  const toggleUser = async (id) => {
    try {
      const { data } = await adminAPI.toggleUser(id)
      setUsers(users.map(u => u._id === id ? { ...u, isActive: data.isActive } : u))
      toast.success(data.message)
    } catch {
      toast.error('Failed to update user')
    }
  }

  if (loading) return <div className="flex justify-center py-20"><Loader className="animate-spin text-blue-600" size={32} /></div>

  const statCards = [
    { icon: <Users size={22} className="text-blue-600"/>, label: 'Total Users', value: stats?.stats.totalUsers, bg: 'bg-blue-50' },
    { icon: <Briefcase size={22} className="text-green-600"/>, label: 'Active Jobs', value: stats?.stats.activeJobs, bg: 'bg-green-50' },
    { icon: <FileText size={22} className="text-purple-600"/>, label: 'Applications', value: stats?.stats.totalApplications, bg: 'bg-purple-50' },
    { icon: <TrendingUp size={22} className="text-orange-600"/>, label: 'Employers', value: stats?.stats.employers, bg: 'bg-orange-50' },
  ]

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex items-center gap-2 mb-6">
        <ShieldAlert className="text-purple-600" size={24}/>
        <h1 className="text-2xl font-bold text-gray-900">Admin Panel</h1>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {statCards.map((s, i) => (
          <div key={i} className="bg-white rounded-2xl border p-5">
            <div className={`w-10 h-10 rounded-xl ${s.bg} flex items-center justify-center mb-3`}>{s.icon}</div>
            <div className="text-2xl font-bold text-gray-900">{s.value ?? 0}</div>
            <div className="text-sm text-gray-500">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="flex gap-2 mb-6">
        {['overview', 'users', 'jobs'].map((t) => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-4 py-2 rounded-xl text-sm font-medium capitalize transition-colors ${tab === t ? 'bg-blue-600 text-white' : 'bg-white border text-gray-600 hover:bg-gray-50'}`}>
            {t}
          </button>
        ))}
      </div>

      {tab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl border p-5">
            <h2 className="font-semibold text-gray-900 mb-4">Recent Users</h2>
            <div className="space-y-3">
              {stats?.recentUsers.map((u) => (
                <div key={u._id} className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{u.name}</p>
                    <p className="text-xs text-gray-400">{u.email}</p>
                  </div>
                  <span className={`text-xs px-2 py-0.5 rounded-full capitalize ${
                    u.role === 'employer' ? 'bg-green-100 text-green-600' :
                    u.role === 'admin' ? 'bg-purple-100 text-purple-600' :
                    'bg-blue-100 text-blue-600'
                  }`}>{u.role}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-white rounded-2xl border p-5">
            <h2 className="font-semibold text-gray-900 mb-4">Recent Jobs</h2>
            <div className="space-y-3">
              {stats?.recentJobs.map((j) => (
                <div key={j._id} className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{j.title}</p>
                    <p className="text-xs text-gray-400">{j.company} · {j.type}</p>
                  </div>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${j.isActive ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'}`}>
                    {j.isActive ? 'Active' : 'Closed'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {tab === 'users' && (
        <div className="bg-white rounded-2xl border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b">
                <tr>
                  {['Name', 'Email', 'Role', 'Status', 'Action'].map((h) => (
                    <th key={h} className="text-left px-4 py-3 text-gray-600 font-medium">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y">
                {users.map((u) => (
                  <tr key={u._id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium text-gray-900">{u.name}</td>
                    <td className="px-4 py-3 text-gray-500">{u.email}</td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2 py-0.5 rounded-full capitalize ${
                        u.role === 'employer' ? 'bg-green-100 text-green-600' :
                        u.role === 'admin' ? 'bg-purple-100 text-purple-600' :
                        'bg-blue-100 text-blue-600'
                      }`}>{u.role}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2 py-0.5 rounded-full ${u.isActive ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-500'}`}>
                        {u.isActive ? 'Active' : 'Banned'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {u.role !== 'admin' && (
                        <button onClick={() => toggleUser(u._id)}
                          className={`text-xs px-3 py-1.5 rounded-lg font-medium ${u.isActive ? 'bg-red-50 text-red-600 hover:bg-red-100' : 'bg-green-50 text-green-600 hover:bg-green-100'}`}>
                          {u.isActive ? 'Ban' : 'Unban'}
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {tab === 'jobs' && (
        <div className="bg-white rounded-2xl border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b">
                <tr>
                  {['Title', 'Company', 'Type', 'Posted By', 'Status', 'Action'].map((h) => (
                    <th key={h} className="text-left px-4 py-3 text-gray-600 font-medium">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y">
                {stats?.recentJobs.map((j) => (
                  <tr key={j._id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium text-gray-900">{j.title}</td>
                    <td className="px-4 py-3 text-gray-500">{j.company}</td>
                    <td className="px-4 py-3 capitalize text-gray-500">{j.type}</td>
                    <td className="px-4 py-3 text-gray-500">{j.postedBy?.name || 'N/A'}</td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2 py-0.5 rounded-full ${j.isActive ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'}`}>
                        {j.isActive ? 'Active' : 'Closed'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <button onClick={async () => {
                        try { await adminAPI.deleteJob(j._id); toast.success('Job deleted') }
                        catch { toast.error('Failed') }
                      }} className="text-red-400 hover:text-red-600">
                        <Trash2 size={15}/>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
