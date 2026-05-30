import { Link } from 'react-router-dom'
import { Search, Bot, FileText, BarChart2, Briefcase, ArrowRight, Users, Building2 } from 'lucide-react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function Home() {
  const [search, setSearch] = useState('')
  const navigate = useNavigate()

  const handleSearch = (e) => {
    e.preventDefault()
    navigate(`/jobs?search=${search}`)
  }

  const features = [
    { icon: <Bot className="text-blue-600" size={28} />, title: 'AI Job Recommendations', desc: 'Upload your resume and get personalized job matches based on your skills.' },
    { icon: <FileText className="text-green-600" size={28} />, title: 'Cover Letter Generator', desc: 'Generate tailored professional cover letters for any job in seconds.' },
    { icon: <BarChart2 className="text-purple-600" size={28} />, title: 'Skill Gap Analysis', desc: 'Know exactly which skills you need to land your dream job.' },
    { icon: <Search className="text-orange-600" size={28} />, title: 'Smart Job Search', desc: 'Filter jobs by skills, location, salary, and experience level.' },
  ]

  const stats = [
    { icon: <Briefcase size={20} />, value: '10,000+', label: 'Active Jobs' },
    { icon: <Users size={20} />, value: '50,000+', label: 'Job Seekers' },
    { icon: <Building2 size={20} />, value: '2,000+', label: 'Companies' },
  ]

  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 text-white py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-blue-500/30 text-blue-100 px-4 py-1.5 rounded-full text-sm mb-6">
            <Bot size={16} /> Powered by Gemini AI
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold mb-4 leading-tight">
            Find Your Dream Job with <span className="text-yellow-300">AI</span>
          </h1>
          <p className="text-blue-100 text-lg mb-10 max-w-2xl mx-auto">
            Upload your resume, get AI-powered job recommendations, generate cover letters, and analyze skill gaps — all in one place.
          </p>

          <form onSubmit={handleSearch} className="flex gap-2 max-w-xl mx-auto">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search jobs, skills, companies..."
                className="w-full pl-10 pr-4 py-3 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-yellow-300"
              />
            </div>
            <button type="submit" className="bg-yellow-400 text-gray-900 px-6 py-3 rounded-xl font-semibold hover:bg-yellow-300 transition-colors">
              Search
            </button>
          </form>

          <div className="flex justify-center gap-8 mt-10">
            {stats.map((s, i) => (
              <div key={i} className="text-center">
                <div className="flex items-center justify-center gap-1 text-yellow-300 mb-1">{s.icon}</div>
                <div className="font-bold text-xl">{s.value}</div>
                <div className="text-blue-200 text-sm">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 px-4 max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-2">Why AI Job Portal?</h2>
        <p className="text-center text-gray-500 mb-10">Everything you need to land your next job, powered by AI</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((f, i) => (
            <div key={i} className="bg-white p-6 rounded-xl border hover:shadow-md transition-shadow">
              <div className="mb-3">{f.icon}</div>
              <h3 className="font-semibold text-gray-900 mb-2">{f.title}</h3>
              <p className="text-gray-500 text-sm">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-blue-50 border-t border-blue-100 py-14 px-4 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-3">Ready to get started?</h2>
        <p className="text-gray-500 mb-6">Create your free account and let AI find the perfect job for you.</p>
        <div className="flex justify-center gap-4 flex-wrap">
          <Link to="/register" className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700">
            Get Started Free <ArrowRight size={18} />
          </Link>
          <Link to="/jobs" className="flex items-center gap-2 border border-gray-300 text-gray-700 px-6 py-3 rounded-xl font-semibold hover:bg-white">
            Browse Jobs
          </Link>
        </div>
      </section>
    </div>
  )
}
