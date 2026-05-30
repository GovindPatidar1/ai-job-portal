import { useState, useEffect } from 'react'
import { jobsAPI } from '../services/api'
import JobCard from '../components/JobCard'
import { Search, Filter, Loader } from 'lucide-react'
import { useSearchParams } from 'react-router-dom'

export default function Jobs() {
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(true)
  const [total, setTotal] = useState(0)
  const [pages, setPages] = useState(1)
  const [page, setPage] = useState(1)
  const [searchParams] = useSearchParams()

  const [filters, setFilters] = useState({
    search: searchParams.get('search') || '',
    location: '',
    type: '',
    experience: '',
  })

  const fetchJobs = async () => {
    setLoading(true)
    try {
      const { data } = await jobsAPI.getAll({ ...filters, page, limit: 9 })
      setJobs(data.jobs)
      setTotal(data.total)
      setPages(data.pages)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchJobs() }, [page])

  const handleSearch = (e) => {
    e.preventDefault()
    setPage(1)
    fetchJobs()
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Browse Jobs</h1>
        <p className="text-gray-500">{total} jobs available</p>
      </div>

      {/* Search & Filters */}
      <form onSubmit={handleSearch} className="bg-white rounded-xl border p-4 mb-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          <div className="lg:col-span-2 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input
              placeholder="Job title or skills..."
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
              className="w-full pl-9 pr-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <input
            placeholder="Location"
            value={filters.location}
            onChange={(e) => setFilters({ ...filters, location: e.target.value })}
            className="border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <select
            value={filters.type}
            onChange={(e) => setFilters({ ...filters, type: e.target.value })}
            className="border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Types</option>
            <option value="full-time">Full-time</option>
            <option value="part-time">Part-time</option>
            <option value="remote">Remote</option>
            <option value="internship">Internship</option>
            <option value="contract">Contract</option>
          </select>
          <select
            value={filters.experience}
            onChange={(e) => setFilters({ ...filters, experience: e.target.value })}
            className="border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Experience</option>
            <option value="fresher">Fresher</option>
            <option value="1-2 years">1-2 years</option>
            <option value="2-5 years">2-5 years</option>
            <option value="5+ years">5+ years</option>
          </select>
        </div>
        <div className="flex gap-2 mt-3">
          <button type="submit" className="bg-blue-600 text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 flex items-center gap-2">
            <Search size={15} /> Search
          </button>
          <button type="button" onClick={() => { setFilters({ search:'',location:'',type:'',experience:'' }); setPage(1); fetchJobs() }}
            className="border text-gray-600 px-4 py-2 rounded-lg text-sm hover:bg-gray-50">
            Clear
          </button>
        </div>
      </form>

      {/* Job List */}
      {loading ? (
        <div className="flex justify-center py-20"><Loader className="animate-spin text-blue-600" size={32} /></div>
      ) : jobs.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <Search size={48} className="mx-auto mb-3 opacity-30" />
          <p className="text-lg font-medium">No jobs found</p>
          <p className="text-sm">Try different search terms or filters</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
            {jobs.map((job) => <JobCard key={job._id} job={job} />)}
          </div>

          {/* Pagination */}
          {pages > 1 && (
            <div className="flex justify-center gap-2">
              {Array.from({ length: pages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={`w-9 h-9 rounded-lg text-sm font-medium ${p === page ? 'bg-blue-600 text-white' : 'border text-gray-600 hover:bg-gray-50'}`}
                >
                  {p}
                </button>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  )
}
