import { useState } from 'react'
import { aiAPI } from '../services/api'
import toast from 'react-hot-toast'
import { Bot, FileText, BarChart2, Lightbulb, Send, Loader, Copy, Check } from 'lucide-react'

export default function AITools() {
  const [tab, setTab] = useState('chatbot')

  // Chatbot state
  const [chatInput, setChatInput] = useState('')
  const [chatHistory, setChatHistory] = useState([])
  const [chatLoading, setChatLoading] = useState(false)

  // Cover letter state
  const [clJobId, setClJobId] = useState('')
  const [coverLetter, setCoverLetter] = useState('')
  const [clLoading, setClLoading] = useState(false)
  const [copied, setCopied] = useState(false)

  // Skill gap state
  const [sgJobId, setSgJobId] = useState('')
  const [skillGap, setSkillGap] = useState(null)
  const [sgLoading, setSgLoading] = useState(false)

  // Recommendations state
  const [recs, setRecs] = useState([])
  const [recLoading, setRecLoading] = useState(false)

  const sendChat = async () => {
    if (!chatInput.trim()) return
    const userMsg = { role: 'user', parts: [{ text: chatInput }] }
    const updatedHistory = [...chatHistory, userMsg]
    setChatHistory(updatedHistory)
    const input = chatInput
    setChatInput('')
    setChatLoading(true)
    try {
      const { data } = await aiAPI.chatbot({ message: input, history: chatHistory })
      setChatHistory([...updatedHistory, { role: 'model', parts: [{ text: data.reply }] }])
    } catch {
      toast.error('Chatbot error')
    } finally {
      setChatLoading(false)
    }
  }

  const generateCL = async () => {
    if (!clJobId.trim()) return toast.error('Enter a Job ID')
    setClLoading(true)
    try {
      const { data } = await aiAPI.generateCoverLetter({ jobId: clJobId })
      setCoverLetter(data.coverLetter)
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed')
    } finally {
      setClLoading(false)
    }
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(coverLetter)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
    toast.success('Copied!')
  }

  const analyzeGap = async () => {
    if (!sgJobId.trim()) return toast.error('Enter a Job ID')
    setSgLoading(true)
    try {
      const { data } = await aiAPI.skillGap({ jobId: sgJobId })
      setSkillGap(data)
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed')
    } finally {
      setSgLoading(false)
    }
  }

  const getRecommendations = async () => {
    setRecLoading(true)
    try {
      const { data } = await aiAPI.getRecommendations()
      setRecs(data)
    } catch (err) {
      toast.error(err.response?.data?.message || 'Upload resume first')
    } finally {
      setRecLoading(false)
    }
  }

  const tabs = [
    { id: 'chatbot', label: 'Chatbot', icon: <Bot size={16}/> },
    { id: 'cover-letter', label: 'Cover Letter', icon: <FileText size={16}/> },
    { id: 'skill-gap', label: 'Skill Gap', icon: <BarChart2 size={16}/> },
    { id: 'recommendations', label: 'Job Matches', icon: <Lightbulb size={16}/> },
  ]

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">🤖 AI Tools</h1>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 overflow-x-auto">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-colors ${
              tab === t.id ? 'bg-blue-600 text-white' : 'bg-white border text-gray-600 hover:bg-gray-50'
            }`}
          >
            {t.icon} {t.label}
          </button>
        ))}
      </div>

      {/* Chatbot */}
      {tab === 'chatbot' && (
        <div className="bg-white rounded-2xl border p-6">
          <h2 className="font-semibold text-gray-900 mb-4">Job Assistant Chatbot</h2>
          <div className="h-80 overflow-y-auto border rounded-xl p-4 mb-4 space-y-3 bg-gray-50">
            {chatHistory.length === 0 && (
              <div className="text-center text-gray-400 mt-10">
                <Bot size={40} className="mx-auto mb-2 opacity-30"/>
                <p className="text-sm">Ask me anything! Resume tips, interview prep, salary advice...</p>
              </div>
            )}
            {chatHistory.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                  msg.role === 'user' ? 'bg-blue-600 text-white' : 'bg-white border text-gray-700'
                }`}>
                  {msg.parts[0].text}
                </div>
              </div>
            ))}
            {chatLoading && (
              <div className="flex justify-start">
                <div className="bg-white border px-4 py-2.5 rounded-2xl text-sm text-gray-400 flex items-center gap-2">
                  <Loader size={14} className="animate-spin"/> Thinking...
                </div>
              </div>
            )}
          </div>
          <div className="flex gap-2">
            <input
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && sendChat()}
              placeholder="Type your question..."
              className="flex-1 border px-4 py-2.5 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button onClick={sendChat} disabled={chatLoading || !chatInput.trim()}
              className="bg-blue-600 text-white px-4 py-2.5 rounded-xl hover:bg-blue-700 disabled:opacity-50">
              <Send size={18}/>
            </button>
          </div>
        </div>
      )}

      {/* Cover Letter */}
      {tab === 'cover-letter' && (
        <div className="bg-white rounded-2xl border p-6">
          <h2 className="font-semibold text-gray-900 mb-1">AI Cover Letter Generator</h2>
          <p className="text-gray-500 text-sm mb-4">Get a job's ID from the URL (e.g. /jobs/abc123) and paste it below.</p>
          <div className="flex gap-2 mb-4">
            <input
              value={clJobId}
              onChange={(e) => setClJobId(e.target.value)}
              placeholder="Paste Job ID here..."
              className="flex-1 border px-4 py-2.5 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button onClick={generateCL} disabled={clLoading}
              className="bg-green-600 text-white px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-green-700 disabled:opacity-50 flex items-center gap-2">
              {clLoading ? <Loader size={16} className="animate-spin"/> : <Bot size={16}/>}
              {clLoading ? 'Generating...' : 'Generate'}
            </button>
          </div>
          {coverLetter && (
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-700">Generated Cover Letter</span>
                <button onClick={copyToClipboard} className="flex items-center gap-1 text-sm text-gray-500 hover:text-blue-600">
                  {copied ? <Check size={14}/> : <Copy size={14}/>}
                  {copied ? 'Copied!' : 'Copy'}
                </button>
              </div>
              <textarea
                value={coverLetter}
                onChange={(e) => setCoverLetter(e.target.value)}
                rows={10}
                className="w-full border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none bg-gray-50"
              />
            </div>
          )}
        </div>
      )}

      {/* Skill Gap */}
      {tab === 'skill-gap' && (
        <div className="bg-white rounded-2xl border p-6">
          <h2 className="font-semibold text-gray-900 mb-1">Skill Gap Analysis</h2>
          <p className="text-gray-500 text-sm mb-4">Compare your resume skills with job requirements and get learning resources.</p>
          <div className="flex gap-2 mb-4">
            <input
              value={sgJobId}
              onChange={(e) => setSgJobId(e.target.value)}
              placeholder="Paste Job ID here..."
              className="flex-1 border px-4 py-2.5 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button onClick={analyzeGap} disabled={sgLoading}
              className="bg-purple-600 text-white px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-purple-700 disabled:opacity-50 flex items-center gap-2">
              {sgLoading ? <Loader size={16} className="animate-spin"/> : <BarChart2 size={16}/>}
              {sgLoading ? 'Analyzing...' : 'Analyze'}
            </button>
          </div>
          {skillGap && (
            <div>
              {skillGap.missingSkills?.length === 0 ? (
                <div className="text-center py-8 text-green-600">
                  <Check size={40} className="mx-auto mb-2"/>
                  <p className="font-medium">Great! You have all the required skills for this job.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  <p className="text-sm text-gray-500">{skillGap.missingSkills?.length} skills to learn:</p>
                  {skillGap.missingSkills?.map((item, i) => (
                    <div key={i} className="border rounded-xl p-4">
                      <p className="font-medium text-red-600 mb-2">📚 {item.skill}</p>
                      <div className="space-y-1">
                        {item.resources?.map((r, j) => (
                          <a key={j} href={r.url} target="_blank" rel="noreferrer"
                            className="block text-sm text-blue-600 hover:underline">→ {r.name}</a>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Recommendations */}
      {tab === 'recommendations' && (
        <div className="bg-white rounded-2xl border p-6">
          <h2 className="font-semibold text-gray-900 mb-1">AI Job Recommendations</h2>
          <p className="text-gray-500 text-sm mb-4">Based on your resume skills, AI will find the best matching jobs.</p>
          <button onClick={getRecommendations} disabled={recLoading}
            className="bg-yellow-500 text-white px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-yellow-600 disabled:opacity-50 flex items-center gap-2 mb-4">
            {recLoading ? <Loader size={16} className="animate-spin"/> : <Lightbulb size={16}/>}
            {recLoading ? 'Finding matches...' : 'Get My Job Matches'}
          </button>
          {recs.length > 0 && (
            <div className="space-y-3">
              {recs.map((rec, i) => rec.job && (
                <div key={i} className="border rounded-xl p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium text-gray-900">{rec.job.title}</p>
                      <p className="text-sm text-gray-500">{rec.job.company} · {rec.job.location}</p>
                    </div>
                    <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full">#{i+1} Match</span>
                  </div>
                  <p className="text-sm text-gray-600 mt-2 italic">🤖 {rec.reason}</p>
                  <a href={`/jobs/${rec.jobId}`} className="text-sm text-blue-600 hover:underline mt-2 inline-block">View Job →</a>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
