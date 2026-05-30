import axios from 'axios'

const API = axios.create({ baseURL: import.meta.env.VITE_API_URL })

API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

API.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      window.location.href = '/login'
    }
    return Promise.reject(err)
  }
)

export const authAPI = {
  register: (data) => API.post('/auth/register', data),
  login: (data) => API.post('/auth/login', data),
  getMe: () => API.get('/auth/me'),
  updateProfile: (data) => API.put('/auth/profile', data),
}

export const jobsAPI = {
  getAll: (params) => API.get('/jobs', { params }),
  getById: (id) => API.get(`/jobs/${id}`),
  create: (data) => API.post('/jobs', data),
  update: (id, data) => API.put(`/jobs/${id}`, data),
  delete: (id) => API.delete(`/jobs/${id}`),
  apply: (id, data) => API.post(`/jobs/${id}/apply`, data),
  getMyJobs: () => API.get('/jobs/my-jobs'),
}

export const aiAPI = {
  uploadResume: (formData) =>
    API.post('/ai/resume/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  getRecommendations: () => API.get('/ai/recommendations'),
  generateCoverLetter: (data) => API.post('/ai/cover-letter', data),
  skillGap: (data) => API.post('/ai/skill-gap', data),
  chatbot: (data) => API.post('/ai/chatbot', data),
}

export const applicationAPI = {
  getMyApplications: () => API.get('/applications/my'),
  getJobApplications: (jobId) => API.get(`/applications/job/${jobId}`),
  updateStatus: (id, data) => API.put(`/applications/${id}/status`, data),
}

export const adminAPI = {
  getStats: () => API.get('/admin/stats'),
  getUsers: (params) => API.get('/admin/users', { params }),
  toggleUser: (id) => API.put(`/admin/users/${id}/toggle`),
  deleteJob: (id) => API.delete(`/admin/jobs/${id}`),
  getApplications: () => API.get('/admin/applications'),
}

export default API
