import { Link } from 'react-router-dom'
import { MapPin, Clock, Briefcase, IndianRupee } from 'lucide-react'

const typeColors = {
  'full-time': 'bg-green-100 text-green-700',
  'part-time': 'bg-yellow-100 text-yellow-700',
  remote: 'bg-blue-100 text-blue-700',
  internship: 'bg-purple-100 text-purple-700',
  contract: 'bg-orange-100 text-orange-700',
}

export default function JobCard({ job }) {
  const timeAgo = (date) => {
    const days = Math.floor((Date.now() - new Date(date)) / (1000 * 60 * 60 * 24))
    if (days === 0) return 'Today'
    if (days === 1) return '1 day ago'
    return `${days} days ago`
  }

  return (
    <Link to={`/jobs/${job._id}`} className="block bg-white rounded-xl border hover:shadow-md hover:border-blue-200 transition-all p-5">
      <div className="flex justify-between items-start mb-3">
        <div>
          <h3 className="font-semibold text-gray-900 text-lg hover:text-blue-600 transition-colors">{job.title}</h3>
          <p className="text-gray-500 text-sm mt-0.5">{job.company || job.postedBy?.company || job.postedBy?.name}</p>
        </div>
        <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${typeColors[job.type] || 'bg-gray-100 text-gray-600'}`}>
          {job.type}
        </span>
      </div>

      <div className="flex flex-wrap gap-3 text-sm text-gray-500 mb-3">
        <span className="flex items-center gap-1"><MapPin size={14} />{job.location}</span>
        <span className="flex items-center gap-1"><Briefcase size={14} />{job.experience}</span>
        {job.salary?.min > 0 && (
          <span className="flex items-center gap-1">
            <IndianRupee size={14} />
            {(job.salary.min / 100000).toFixed(1)}L - {(job.salary.max / 100000).toFixed(1)}L/yr
          </span>
        )}
        <span className="flex items-center gap-1 ml-auto"><Clock size={14} />{timeAgo(job.createdAt)}</span>
      </div>

      <div className="flex flex-wrap gap-1.5">
        {job.skills?.slice(0, 5).map((skill, i) => (
          <span key={i} className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-md">{skill}</span>
        ))}
        {job.skills?.length > 5 && (
          <span className="text-xs text-gray-400">+{job.skills.length - 5} more</span>
        )}
      </div>
    </Link>
  )
}
