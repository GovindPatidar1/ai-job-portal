import { useState } from 'react'
import { aiAPI } from '../services/api'
import { useDispatch } from 'react-redux'
import { updateUser } from '../store/authSlice'
import toast from 'react-hot-toast'
import { Upload, FileText, CheckCircle, Loader, Bot } from 'lucide-react'

export default function ResumeUpload() {
  const [file, setFile] = useState(null)
  const [uploading, setUploading] = useState(false)
  const [result, setResult] = useState(null)
  const dispatch = useDispatch()

  const handleUpload = async () => {
    if (!file) return toast.error('Please select a PDF file')
    const formData = new FormData()
    formData.append('resume', file)
    setUploading(true)
    try {
      const { data } = await aiAPI.uploadResume(formData)
      setResult(data.resume)
      dispatch(updateUser({ resume: data.resume }))
      toast.success('Resume uploaded and parsed!')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Upload failed')
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Upload Resume</h1>
      <p className="text-gray-500 mb-6">Upload your PDF resume. Our AI will parse it and extract your skills, experience, and education automatically.</p>

      <div className="bg-white rounded-2xl border p-6 mb-6">
        <label
          className={`flex flex-col items-center justify-center w-full h-40 border-2 border-dashed rounded-xl cursor-pointer transition-colors ${file ? 'border-blue-400 bg-blue-50' : 'border-gray-300 hover:border-blue-400 hover:bg-gray-50'}`}
        >
          <input type="file" accept=".pdf" className="hidden" onChange={(e) => setFile(e.target.files[0])} />
          {file ? (
            <div className="text-center">
              <FileText className="mx-auto text-blue-600 mb-2" size={36}/>
              <p className="font-medium text-gray-900">{file.name}</p>
              <p className="text-xs text-gray-400">{(file.size / 1024).toFixed(1)} KB</p>
            </div>
          ) : (
            <div className="text-center">
              <Upload className="mx-auto text-gray-400 mb-2" size={36}/>
              <p className="text-gray-500 font-medium">Click to upload PDF</p>
              <p className="text-xs text-gray-400 mt-1">Max 5MB</p>
            </div>
          )}
        </label>

        <button
          onClick={handleUpload}
          disabled={!file || uploading}
          className="mt-4 w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {uploading ? <><Loader className="animate-spin" size={18}/> Parsing resume...</> : <><Upload size={18}/> Upload & Parse</>}
        </button>
      </div>

      {result && (
        <div className="bg-white rounded-2xl border p-6">
          <div className="flex items-center gap-2 text-green-600 mb-4">
            <CheckCircle size={20}/>
            <span className="font-semibold">Resume parsed successfully!</span>
          </div>

          {result.parsedData?.skills?.length > 0 && (
            <div className="mb-4">
              <h3 className="font-medium text-gray-900 mb-2 flex items-center gap-2"><Bot size={16} className="text-blue-600"/>Detected Skills</h3>
              <div className="flex flex-wrap gap-2">
                {result.parsedData.skills.map((s, i) => (
                  <span key={i} className="bg-blue-100 text-blue-700 text-sm px-3 py-1 rounded-lg">{s}</span>
                ))}
              </div>
            </div>
          )}

          {result.parsedData?.education?.length > 0 && (
            <div className="mb-4">
              <h3 className="font-medium text-gray-900 mb-2">Education</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                {result.parsedData.education.map((e, i) => <li key={i} className="flex items-start gap-2"><span className="text-gray-300 mt-1">•</span>{e}</li>)}
              </ul>
            </div>
          )}

          {result.parsedData?.experience?.length > 0 && (
            <div>
              <h3 className="font-medium text-gray-900 mb-2">Experience</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                {result.parsedData.experience.map((e, i) => <li key={i} className="flex items-start gap-2"><span className="text-gray-300 mt-1">•</span>{e}</li>)}
              </ul>
            </div>
          )}

          <div className="mt-4 pt-4 border-t">
            <a href={result.url} target="_blank" rel="noreferrer" className="text-sm text-blue-600 hover:underline">View uploaded resume →</a>
          </div>
        </div>
      )}
    </div>
  )
}
