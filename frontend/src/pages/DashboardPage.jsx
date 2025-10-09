import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, LineChart, Line } from 'recharts'
import { MessageSquare, Clock, Award, TrendingUp, Lightbulb } from 'lucide-react'
import { getProgressSummary, getUserTopicMastery } from '../lib/api'
import TopicDetailModal from '../components/TopicDetailModal'

function formatRelativeTime(date) {
  const d = new Date(date)
  const diff = Date.now() - d.getTime()
  const minutes = Math.floor(diff / 60000)
  if (minutes < 60) return `${minutes}m ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  return `${days}d ago`
}

function StatCard({ icon, label, value }) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-5 shadow border border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between">
        <div className="text-gray-500 dark:text-gray-400 text-sm">{label}</div>
        <div className="text-gray-400 dark:text-gray-500">{icon}</div>
      </div>
      <div className="mt-3 text-2xl font-semibold">{value}</div>
    </div>
  )
}

function MasteryBar({ label, count, color }) {
  const colorMap = {
    green: 'bg-green-500',
    blue: 'bg-blue-500',
    yellow: 'bg-yellow-500',
    orange: 'bg-orange-500',
    gray: 'bg-gray-400'
  }
  const bar = colorMap[color] || 'bg-blue-500'
  const pct = Math.min(100, Math.round((count / 100) * 100))
  return (
    <div>
      <div className="flex items-center justify-between text-sm mb-1">
        <span>{label}</span>
        <span className="text-gray-500 dark:text-gray-400">{count}</span>
      </div>
      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
        <div className={`${bar} h-2 rounded-full`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  )
}

function ChartCard({ title, children }) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow border border-gray-200 dark:border-gray-700">
      <h2 className="text-lg font-semibold mb-4">{title}</h2>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          {children}
        </ResponsiveContainer>
      </div>
    </div>
  )
}

function StatusBadge({ status }) {
  const map = {
    MASTERED: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300',
    PROFICIENT: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
    LEARNING: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300',
    BEGINNER: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300',
    NOT_STARTED: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300'
  }
  const cls = map[status] || map.NOT_STARTED
  return <span className={`px-2 py-1 rounded text-xs font-medium ${cls}`}>{status}</span>
}

function DashboardPage() {
  const navigate = useNavigate()
  const [progressSummary, setProgressSummary] = useState(null)
  const [topicMastery, setTopicMastery] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedTopicId, setSelectedTopicId] = useState(null)

  async function loadData() {
    // Check authentication first
    const token = localStorage.getItem('auth_token')
    if (!token) {
      navigate('/auth')
      return
    }

    setLoading(true)
    setError(null)
    try {
      const [summary, mastery] = await Promise.all([
        getProgressSummary(),
        getUserTopicMastery(null, 10)
      ])
      setProgressSummary(summary)
      setTopicMastery(mastery)
    } catch (e) {
      console.error('Dashboard load error:', e)
      
      // Handle auth errors
      if (e.status === 401) {
        localStorage.removeItem('auth_token')
        navigate('/auth')
        return
      }
      
      setError(e?.message || 'Failed to load progress')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  const refreshData = () => loadData()

  const overallProgress = Math.round(progressSummary?.overallProgress || 0)
  const totalQuestions = progressSummary?.totalQuestions || 0
  const totalTimeSpent = progressSummary?.totalTimeSpent || 0
  const topicsMastered = progressSummary?.topicsMastered || 0
  const topicsByStatus = progressSummary?.topicsByStatus || { mastered: 0, proficient: 0, learning: 0, beginner: 0, notStarted: 0 }
  const weeklyActivity = progressSummary?.weeklyActivity || []
  const topActiveTopics = progressSummary?.topActiveTopics || []
  const topicsExplored = progressSummary?.topicsExplored || 0

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6 flex items-center justify-center text-gray-600 dark:text-gray-300">
        Loading dashboard...
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6 flex items-center justify-center">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow text-red-600 dark:text-red-400">{error}</div>
      </div>
    )
  }

  const recommendations = (topicMastery || [])
    .filter(t => t.status === 'LEARNING')
    .slice(0, 5)
    .map(t => `Continue exploring "${t.topic?.name}" or its sibling topics.`)

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Learning Progress</h1>
          <button onClick={refreshData} className="inline-flex items-center gap-2 px-4 py-2 rounded bg-blue-600 hover:bg-blue-700 text-white shadow">
            <TrendingUp size={18} /> Refresh
          </button>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-3">Overall Progress: {overallProgress}%</h2>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4">
            <div className="bg-blue-600 h-4 rounded-full" style={{ width: `${overallProgress}%` }} />
          </div>
          <p className="text-sm mt-2 text-gray-600 dark:text-gray-300">{topicsExplored}/100 topics explored</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <StatCard icon={<MessageSquare />} label="Questions Asked" value={totalQuestions} />
          <StatCard icon={<Clock />} label="Time Spent" value={`${Math.floor(totalTimeSpent/60)}h ${totalTimeSpent%60}m`} />
          <StatCard icon={<Award />} label="Topics Mastered" value={`${topicsMastered}/100`} />
          <StatCard icon={<TrendingUp />} label="In Progress" value={topicsByStatus.learning} />
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow">
          <h2 className="text-xl font-semibold mb-4">Topics by Mastery Level</h2>
          <div className="space-y-3">
            <MasteryBar label="Mastered" count={topicsByStatus.mastered} color="green" />
            <MasteryBar label="Proficient" count={topicsByStatus.proficient} color="blue" />
            <MasteryBar label="Learning" count={topicsByStatus.learning} color="yellow" />
            <MasteryBar label="Beginner" count={topicsByStatus.beginner} color="orange" />
            <MasteryBar label="Not Started" count={topicsByStatus.notStarted} color="gray" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <ChartCard title="Questions This Week">
            <BarChart data={weeklyActivity}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="questions" fill="#3b82f6" />
            </BarChart>
          </ChartCard>
          
          <ChartCard title="Time Spent This Week">
            <LineChart data={weeklyActivity}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="minutes" stroke="#10b981" />
            </LineChart>
          </ChartCard>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow">
          <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <th className="text-left p-2">Topic</th>
                  <th className="text-left p-2">Chapter</th>
                  <th className="text-left p-2">Mastery</th>
                  <th className="text-left p-2">Status</th>
                  <th className="text-left p-2">Questions</th>
                  <th className="text-left p-2">Last Active</th>
                </tr>
              </thead>
              <tbody>
                {topActiveTopics.map((topic) => (
                  <tr key={topic.topicId} className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/60">
                    <td className="p-2 font-medium">
                      <button onClick={() => setSelectedTopicId(topic.topicId)} className="text-blue-600 hover:underline">
                        {topic.topicName}
                      </button>
                    </td>
                    <td className="p-2 text-sm text-gray-600 dark:text-gray-300">{topic.chapterName}</td>
                    <td className="p-2">
                      <div className="flex items-center gap-2">
                        <div className="w-16 bg-gray-200 dark:bg-gray-700 rounded h-2">
                          <div className="bg-blue-600 h-2 rounded" style={{ width: `${topic.masteryLevel}%` }} />
                        </div>
                        <span className="text-sm">{Math.round(topic.masteryLevel)}%</span>
                      </div>
                    </td>
                    <td className="p-2"><StatusBadge status={topic.status} /></td>
                    <td className="p-2 text-center">{topic.questionsAsked}</td>
                    <td className="p-2 text-sm text-gray-600 dark:text-gray-300">{formatRelativeTime(topic.lastActive)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow">
          <h2 className="text-xl font-semibold mb-4">Recommended Next Steps</h2>
          <div className="space-y-2">
            {recommendations.map((rec, i) => (
              <div key={i} className="flex items-start gap-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded">
                <Lightbulb className="text-blue-600 mt-1" size={20} />
                <p className="text-gray-800 dark:text-gray-200">{rec}</p>
              </div>
            ))}
          </div>
        </div>

        {selectedTopicId && (
          <TopicDetailModal topicId={selectedTopicId} onClose={() => setSelectedTopicId(null)} />
        )}
      </div>
    </div>
  )
}

export default DashboardPage


