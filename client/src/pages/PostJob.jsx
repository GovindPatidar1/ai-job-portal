import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { jobsAPI } from '../services/api'
import toast from 'react-hot-toast'
import { PlusCircle, X } from 'lucide-react'

export default function PostJob() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    title: '', company: '', description: '', location: '',
    type: 'full-time', experience: 'fresher',
    salary: { min: '', max: '', currency: 'INR' },
    skills: [], requirements: [],
  })
  const [skillInput, setSkillInput] = useState('')
  const [reqInput, setReqInput] = useState('')

  const addSkill = () => {
    if (!skillInput.trim()) return
    setForm({ ...form, skills: [...form.skills, skillInput.trim().toLowerCase()] })
    setSkillInput('')
  }

  const addReq = () => {
    if (!reqInput.trim()) return
    setForm({ ...form, requirements: [...form.requirements, reqInput.trim()] })
    setReqInput('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.title || !form.company || !form.description || !form.location)
      return toast.error('Please fill all required fields')
    setLoading(true)
    try {
      const payload = {
        ...form,
        salary: { min: Number(form.salary.min) || 0, max: Number(form.salary.max) || 0, currency: 'INR' }
      }
      const { data } = await jobsAPI.create(payload)
      toast.success('Job posted successfully!')
      navigate(`/jobs/${data._id}`)
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to post job')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Post a New Job</h1>

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl border p-6 space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Job Title *</label>
            <input value={form.title} onChange={(e) => setForm({...form, title: e.target.value})}
              placeholder="e.g. React Developer" className="w-full border px-3 py-2.5 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" required/>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Company Name *</label>
            <input value={form.company} onChange={(e) => setForm({...form, company: e.target.value})}
              placeholder="Company name" className="w-full border px-3 py-2.5 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" required/>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Location *</label>
          <input value={form.location} onChange={(e) => setForm({...form, location: e.target.value})}
            placeholder="e.g. Bangalore or Remote" className="w-full border px-3 py-2.5 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" required/>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Job Type</label>
            <select value={form.type} onChange={(e) => setForm({...form, type: e.target.value})}
              className="w-full border px-3 py-2.5 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="full-time">Full-time</option>
              <option value="part-time">Part-time</option>
              <option value="remote">Remote</option>
              <option value="internship">Internship</option>
              <option value="contract">Contract</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Experience</label>
            <select value={form.experience} onChange={(e) => setForm({...form, experience: e.target.value})}
              className="w-full border px-3 py-2.5 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="fresher">Fresher</option>
              <option value="1-2 years">1-2 years</option>
              <option value="2-5 years">2-5 years</option>
              <option value="5+ years">5+ years</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Min Salary (₹/year)</label>
            <input type="number" value={form.salary.min} onChange={(e) => setForm({...form, salary: {...form.salary, min: e.target.value}})}
              placeholder="e.g. 300000" className="w-full border px-3 py-2.5 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"/>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Max Salary (₹/year)</label>
            <input type="number" value={form.salary.max} onChange={(e) => setForm({...form, salary: {...form.salary, max: e.target.value}})}
              placeholder="e.g. 600000" className="w-full border px-3 py-2.5 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"/>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Job Description *</label>
          <textarea value={form.description} onChange={(e) => setForm({...form, description: e.target.value})}
            rows={5} placeholder="Describe the role, responsibilities, team..." required
            className="w-full border px-3 py-2.5 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"/>
        </div>

        {/* Skills */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Required Skills</label>
          <div className="flex gap-2 mb-2">
            <input value={skillInput} onChange={(e) => setSkillInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
              placeholder="e.g. react" className="flex-1 border px-3 py-2 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"/>
            <button type="button" onClick={addSkill} className="bg-gray-100 px-4 py-2 rounded-xl text-sm hover:bg-gray-200">Add</button>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {form.skills.map((s, i) => (
              <span key={i} className="bg-blue-100 text-blue-700 text-sm px-3 py-1 rounded-lg flex items-center gap-1">
                {s} <button type="button" onClick={() => setForm({...form, skills: form.skills.filter((_,j) => j!==i)})}><X size={12}/></button>
              </span>
            ))}
          </div>
        </div>

        {/* Requirements */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Requirements</label>
          <div className="flex gap-2 mb-2">
            <input value={reqInput} onChange={(e) => setReqInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addReq())}
              placeholder="e.g. B.Tech in CS or related field" className="flex-1 border px-3 py-2 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"/>
            <button type="button" onClick={addReq} className="bg-gray-100 px-4 py-2 rounded-xl text-sm hover:bg-gray-200">Add</button>
          </div>
          <div className="space-y-1">
            {form.requirements.map((r, i) => (
              <div key={i} className="flex items-center justify-between bg-gray-50 px-3 py-1.5 rounded-lg text-sm">
                {r} <button type="button" onClick={() => setForm({...form, requirements: form.requirements.filter((_,j) => j!==i)})} className="text-gray-400 hover:text-red-500"><X size={14}/></button>
              </div>
            ))}
          </div>
        </div>

        <button type="submit" disabled={loading}
          className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center gap-2">
          <PlusCircle size={18}/>
          {loading ? 'Posting...' : 'Post Job'}
        </button>
      </form>
    </div>
  )
}
