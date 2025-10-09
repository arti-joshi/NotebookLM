import { useEffect, useState, useRef } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, LineChart, Line } from 'recharts'
import { MessageSquare, Clock, Award, TrendingUp, Lightbulb, Download } from 'lucide-react'
import { getProgressSummary, getUserTopicMastery } from '../lib/api'
import TopicDetailModal from '../components/TopicDetailModal'
import ProgressOnboarding from '../components/ProgressOnboarding'
import { progressEvents, PROGRESS_EVENTS } from '../lib/progressEvents'

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
  const location = useLocation()
  const loadingRef = useRef(false)
  const [progressSummary, setProgressSummary] = useState(null)
  const [topicMastery, setTopicMastery] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedTopicId, setSelectedTopicId] = useState(null)
  const [showRefreshNotification, setShowRefreshNotification] = useState(false)

  async function loadData() {
    if (loadingRef.current) {
      console.log('[Dashboard] Skipping loadData - already loading')
      return
    }
    
    // Show refresh notification for auto-refreshes (not initial load)
    const isAutoRefresh = progressSummary !== null
    if (isAutoRefresh) {
      setShowRefreshNotification(true)
    }
    
    console.log('[Dashboard] Starting data load...')
    loadingRef.current = true
    setLoading(true)
    setError(null)
    
    // Check authentication first
    const token = localStorage.getItem('auth_token')
    if (!token) {
      console.log('[Dashboard] No auth token, redirecting to auth')
      navigate('/auth')
      return
    }

    try {
      console.log('[Dashboard] Fetching progress summary and topic mastery...')
      const startTime = Date.now()
      
      const [summary, mastery] = await Promise.all([
        getProgressSummary(),
        getUserTopicMastery(null, 10)
      ])
      
      const fetchTime = Date.now() - startTime
      console.log(`[Dashboard] Data fetched in ${fetchTime}ms`)
      console.log('[Dashboard] Summary:', summary)
      console.log('[Dashboard] Mastery records:', mastery?.length || 0)
      
      setProgressSummary(summary)
      setTopicMastery(mastery || [])
      
      // Hide notification after successful refresh
      if (isAutoRefresh) {
        setTimeout(() => setShowRefreshNotification(false), 2000)
      }
      
      console.log('[Dashboard] State updated successfully')
    } catch (e) {
      console.error('[Dashboard] Error loading data:', e)
      
      // Handle auth errors
      if (e.status === 401) {
        console.log('[Dashboard] Auth error, clearing token and redirecting')
        localStorage.removeItem('auth_token')
        navigate('/auth')
        return
      }
      
      setError(e?.message || 'Failed to load progress')
      setShowRefreshNotification(false)
    } finally {
      setLoading(false)
      loadingRef.current = false
      console.log('[Dashboard] Load complete')
    }
  }

  useEffect(() => {
    loadData()
    
    // Auto-refresh when user returns to tab
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        console.log('Dashboard tab visible - refreshing data...')
        loadData()
      }
    }
    
    // Auto-refresh when window regains focus
    const handleFocus = () => {
      console.log('Dashboard focused - refreshing data...')
      loadData()
    }
    
    document.addEventListener('visibilitychange', handleVisibilityChange)
    window.addEventListener('focus', handleFocus)
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange)
      window.removeEventListener('focus', handleFocus)
    }
  }, [])

  useEffect(() => {
    // Force refresh when navigating TO dashboard
    console.log('Dashboard route mounted - loading fresh data...')
    loadData()
  }, [location.pathname])

  useEffect(() => {
    // Listen for progress updates from chatbot
    const unsubscribe = progressEvents.on(PROGRESS_EVENTS.PROGRESS_CHANGED, (data) => {
      console.log('[Dashboard] ✓ Progress update event received:', data)
      
      // Debounce multiple rapid updates
      if (loadingRef.current) {
        console.log('[Dashboard] ⏩ Skipping refresh - already loading')
        return
      }
      
      // Wait 1 second before refreshing to allow backend to finish processing
      console.log('[Dashboard] ⏰ Scheduling refresh in 1 second...')
      setTimeout(() => {
        console.log('[Dashboard] 🔄 Executing auto-refresh...')
        loadData()
      }, 1000)
    })
    
    return () => {
      unsubscribe()
    }
  }, [])

  const refreshData = () => loadData()

  async function exportProgress() {
    try {
      const summary = await getProgressSummary()
      const topics = await getUserTopicMastery()

      const exportData = {
        exportDate: new Date().toISOString(),
        overallProgress: summary?.overallProgress ?? 0,
        stats: {
          totalQuestions: summary?.totalQuestions ?? 0,
          totalTimeSpent: summary?.totalTimeSpent ?? 0,
          topicsMastered: summary?.topicsMastered ?? 0
        },
        topics: (topics || []).map(t => ({
          name: t?.topic?.name,
          chapter: t?.topic?.parent?.name || 'N/A',
          mastery: t?.masteryLevel ?? 0,
          status: t?.status,
          questionsAsked: t?.questionsAsked ?? 0,
          lastActive: t?.lastInteraction || null
        }))
      }

      const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `progress-${new Date().toISOString().split('T')[0]}.json`
      a.click()
      URL.revokeObjectURL(url)

      try { alert('Progress exported successfully!') } catch {}
    } catch (err) {
      try { alert('Export failed: ' + (err?.message || 'Unknown error')) } catch {}
    }
  }

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
        <ProgressOnboarding />
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Learning Progress</h1>
          <div className="flex items-center gap-2">
            <button onClick={exportProgress} className="flex items-center gap-2 px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-900 dark:text-gray-100">
              <Download size={18} /> Export Progress
            </button>
            <button onClick={refreshData} className="inline-flex items-center gap-2 px-4 py-2 rounded bg-blue-600 hover:bg-blue-700 text-white shadow">
              <TrendingUp size={18} /> Refresh
            </button>
          </div>
        </div>

        {showRefreshNotification && (
          <div className="fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg flex items-center gap-2 z-50 animate-fade-in">
            <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
            </svg>
            <span className="text-sm font-medium">Progress Updated</span>
          </div>
        )}

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


