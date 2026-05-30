import { useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { setCredentials } from '../store/authSlice'
import { authAPI } from '../services/api'
import { Loader } from 'lucide-react'

export default function OAuthSuccess() {
  const [searchParams] = useSearchParams()
  const dispatch = useDispatch()
  const navigate = useNavigate()

  useEffect(() => {
    const token = searchParams.get('token')
    if (token) {
      localStorage.setItem('token', token)
      authAPI.getMe()
        .then(({ data }) => {
          dispatch(setCredentials({ token, user: data }))
          navigate('/dashboard')
        })
        .catch(() => navigate('/login'))
    } else {
      navigate('/login')
    }
  }, [])

  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-3 text-gray-500">
      <Loader className="animate-spin text-blue-600" size={32} />
      <p>Signing you in with Google...</p>
    </div>
  )
}
