import { useState, useEffect } from 'react'
import { applicationAPI } from '../services/api'
import { Loader, Briefcase, MapPin, Clock, ExternalLink } from 'lucide-react'
import { Link } from 'react-router-dom'

const statusColors = {
  pending: 'bg-yellow-100 text-yellow-700',
  reviewing: 'bg-blue-100 text-blue-700',
  interview: 'bg-purple-100 text-purple-700',
  hired: 'bg-green-100 text-green-700',
  rejected: 'bg-red-100 text-red-700',
}

export default function MyApplications() {
  const [applications, setApplications] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    applicationAPI.getMyApplications()
      .then(({ data }) => setApplications(data))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <div className="flex justify-center py-20"><Loader className="animate-spin text-blue-600" size={32} /></div>

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-2">My Applications</h1>
      <p className="text-gray-500 mb-6">{applications.length} application{applications.length !== 1 ? 's' : ''} submitted</p>

      {applications.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <Briefcase size={48} className="mx-auto mb-3 opacity-30" />
          <p className="text-lg font-medium">No applications yet</p>
          <p className="text-sm mb-4">Start applying to jobs to track them here</p>
          <Link to="/jobs" className="bg-blue-600 text-white px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-blue-700 inline-block">
            Browse Jobs
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {applications.map((app) => (
            <div key={app._id} className="bg-white rounded-2xl border p-5 hover:shadow-sm transition-shadow">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="font-semibold text-gray-900 text-lg">{app.job?.title || 'Job Deleted'}</h3>
                  <p className="text-gray-500 text-sm">{app.job?.company}</p>
                </div>
                <span className={`text-xs px-3 py-1 rounded-full font-medium capitalize ${statusColors[app.status]}`}>
                  {app.status}
                </span>
              </div>

              <div className="flex flex-wrap gap-3 text-sm text-gray-400 mb-3">
                {app.job?.location && <span className="flex items-center gap-1"><MapPin size={13}/>{app.job.location}</span>}
                {app.job?.type && <span className="flex items-center gap-1"><Briefcase size={13}/>{app.job.type}</span>}
                <span className="flex items-center gap-1">
                  <Clock size={13}/>Applied {new Date(app.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                </span>
              </div>

              {app.coverLetter && (
                <details className="mb-3">
                  <summary className="text-sm text-blue-600 cursor-pointer hover:underline">View cover letter</summary>
                  <p className="mt-2 text-sm text-gray-600 bg-gray-50 p-3 rounded-lg leading-relaxed">{app.coverLetter}</p>
                </details>
              )}

              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-400">Status updates come from employer</span>
                {app.job?._id && (
                  <Link to={`/jobs/${app.job._id}`} className="flex items-center gap-1 text-sm text-gray-400 hover:text-blue-600">
                    <ExternalLink size={13}/> View Job
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
