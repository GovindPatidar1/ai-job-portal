import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { jobsAPI, aiAPI } from '../services/api'
import toast from 'react-hot-toast'
import { MapPin, Briefcase, Clock, IndianRupee, Building2, Bot, Send, Loader } from 'lucide-react'

export default function JobDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { isAuthenticated, user } = useSelector((s) => s.auth)
  const [job, setJob] = useState(null)
  const [loading, setLoading] = useState(true)
  const [applying, setApplying] = useState(false)
  const [coverLetter, setCoverLetter] = useState('')
  const [generatingCL, setGeneratingCL] = useState(false)
  const [showApplyForm, setShowApplyForm] = useState(false)

  useEffect(() => {
    jobsAPI.getById(id).then(({ data }) => { setJob(data); setLoading(false) }).catch(() => setLoading(false))
  }, [id])

  const handleApply = async () => {
    if (!isAuthenticated) return navigate('/login')
    setApplying(true)
    try {
      await jobsAPI.apply(id, { coverLetter })
      toast.success('Applied successfully! 🎉')
      setShowApplyForm(false)
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to apply')
    } finally {
      setApplying(false)
    }
  }

  const generateCoverLetter = async () => {
    setGeneratingCL(true)
    try {
      const { data } = await aiAPI.generateCoverLetter({ jobId: id })
      setCoverLetter(data.coverLetter)
      toast.success('Cover letter generated!')
    } catch (err) {
      toast.error('Failed to generate cover letter')
    } finally {
      setGeneratingCL(false)
    }
  }

  if (loading) return <div className="flex justify-center py-20"><Loader className="animate-spin text-blue-600" size={32} /></div>
  if (!job) return <div className="text-center py-20 text-gray-400">Job not found</div>

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="bg-white rounded-2xl border p-8 mb-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-1">{job.title}</h1>
            <p className="text-gray-500 flex items-center gap-1"><Building2 size={16}/>{job.company || job.postedBy?.company}</p>
          </div>
          <span className="bg-blue-100 text-blue-700 text-sm px-3 py-1 rounded-full font-medium capitalize">{job.type}</span>
        </div>

        <div className="flex flex-wrap gap-4 text-sm text-gray-500 mb-6 pb-6 border-b">
          <span className="flex items-center gap-1.5"><MapPin size={15}/>{job.location}</span>
          <span className="flex items-center gap-1.5"><Briefcase size={15}/>{job.experience}</span>
          {job.salary?.min > 0 && (
            <span className="flex items-center gap-1.5">
              <IndianRupee size={15}/>
              {(job.salary.min/100000).toFixed(1)}L – {(job.salary.max/100000).toFixed(1)}L/yr
            </span>
          )}
          <span className="flex items-center gap-1.5">
            <Clock size={15}/>{new Date(job.createdAt).toLocaleDateString('en-IN', { day:'numeric', month:'short', year:'numeric' })}
          </span>
        </div>

        <div className="mb-6">
          <h2 className="font-semibold text-gray-900 mb-2">Job Description</h2>
          <p className="text-gray-600 leading-relaxed whitespace-pre-line">{job.description}</p>
        </div>

        {job.requirements?.length > 0 && (
          <div className="mb-6">
            <h2 className="font-semibold text-gray-900 mb-2">Requirements</h2>
            <ul className="list-disc list-inside space-y-1 text-gray-600 text-sm">
              {job.requirements.map((r, i) => <li key={i}>{r}</li>)}
            </ul>
          </div>
        )}

        {job.skills?.length > 0 && (
          <div className="mb-6">
            <h2 className="font-semibold text-gray-900 mb-2">Skills Required</h2>
            <div className="flex flex-wrap gap-2">
              {job.skills.map((s, i) => (
                <span key={i} className="bg-gray-100 text-gray-700 px-3 py-1 rounded-lg text-sm">{s}</span>
              ))}
            </div>
          </div>
        )}

        {/* Apply Section */}
        {isAuthenticated && user?.role === 'jobseeker' && (
          <div className="border-t pt-6">
            {!showApplyForm ? (
              <button onClick={() => setShowApplyForm(true)} className="bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 flex items-center gap-2">
                <Send size={18}/> Apply Now
              </button>
            ) : (
              <div>
                <div className="flex justify-between items-center mb-3">
                  <h3 className="font-semibold">Write a Cover Letter</h3>
                  <button
                    onClick={generateCoverLetter}
                    disabled={generatingCL}
                    className="flex items-center gap-1.5 text-sm bg-purple-100 text-purple-700 px-3 py-1.5 rounded-lg hover:bg-purple-200"
                  >
                    <Bot size={15}/>
                    {generatingCL ? 'Generating...' : 'Generate with AI'}
                  </button>
                </div>
                <textarea
                  value={coverLetter}
                  onChange={(e) => setCoverLetter(e.target.value)}
                  rows={6}
                  placeholder="Write your cover letter or use AI to generate one..."
                  className="w-full border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 mb-3 resize-none"
                />
                <div className="flex gap-3">
                  <button onClick={handleApply} disabled={applying} className="bg-blue-600 text-white px-6 py-2.5 rounded-xl font-semibold hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2">
                    <Send size={16}/>{applying ? 'Submitting...' : 'Submit Application'}
                  </button>
                  <button onClick={() => setShowApplyForm(false)} className="border text-gray-600 px-5 py-2.5 rounded-xl hover:bg-gray-50">
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {!isAuthenticated && (
          <div className="border-t pt-6">
            <p className="text-gray-500 mb-3 text-sm">Sign in to apply for this job</p>
            <button onClick={() => navigate('/login')} className="bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700">
              Sign In to Apply
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
