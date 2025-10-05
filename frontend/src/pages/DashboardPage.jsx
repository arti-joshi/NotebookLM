import { useEffect, useState } from 'react'
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import { TrendingUp, Clock, BookOpen, Target, Award, Calendar, MessageSquare } from 'lucide-react'

function DashboardPage() {
  const [analytics, setAnalytics] = useState({
    weekly: [],
    questionsAsked: 0,
    chaptersExplored: 0,
    totalChapters: 15,
    totalTime: 0,
    topicsMastered: 0,
    avgSession: 0,
    chapterCoverage: []
  })
  const [timeframe, setTimeframe] = useState('week')

  useEffect(() => {
    async function load() {
      try {
        const api = import.meta.env.VITE_API_URL || 'http://localhost:4000'
        const res = await fetch(api + '/progress/summary')
        const data = await res.json()
        setAnalytics({
          weekly: data.weekly || generateMockData(),
          questionsAsked: data.questionsAsked || 47,
          chaptersExplored: data.chaptersExplored || 8,
          totalChapters: data.totalChapters || 15,
          totalTime: data.totalTime || 1247,
          topicsMastered: data.topicsMastered || 5,
          avgSession: data.avgSession || 28,
          chapterCoverage: data.chapterCoverage || generateMockCoverage()
        })
      } catch {
        setAnalytics({
          weekly: generateMockData(),
          questionsAsked: 47,
          chaptersExplored: 8,
          totalChapters: 15,
          totalTime: 1247,
          topicsMastered: 5,
          avgSession: 28,
          chapterCoverage: generateMockCoverage()
        })
      }
    }
    load()
  }, [timeframe])

  function generateMockData() {
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
    return days.map(day => ({
      day,
      questions: Math.floor(Math.random() * 15) + 5,
      minutes: Math.floor(Math.random() * 120) + 30
    }))
  }

  function generateMockCoverage() {
    return [
      { chapter: 'Chapter 5: Indexes', status: 'well', questions: 8, words: 450 },
      { chapter: 'Chapter 7: SELECT Queries', status: 'well', questions: 6, words: 320 },
      { chapter: 'Chapter 9: Performance', status: 'partial', questions: 2, words: 85 },
      { chapter: 'Chapter 11: Transactions', status: 'partial', questions: 1, words: 60 },
      { chapter: 'Chapter 12: Replication', status: 'not', questions: 0, words: 0 },
      { chapter: 'Chapter 15: Security', status: 'not', questions: 0, words: 0 }
    ]
  }

  const formatTime = (minutes) => {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`
  }

  const stats = [
    {
      label: 'Questions Asked',
      value: analytics.questionsAsked,
      icon: MessageSquare,
      color: 'text-orange-600 dark:text-orange-400',
      bg: 'bg-orange-100 dark:bg-orange-900/20',
      change: '+12 this week'
    },
    {
      label: 'Chapters Explored',
      value: `${analytics.chaptersExplored}/${analytics.totalChapters}`,
      icon: BookOpen,
      color: 'text-blue-600 dark:text-blue-400',
      bg: 'bg-blue-100 dark:bg-blue-900/20',
      change: '+2 this week'
    },
    {
      label: 'Total Time',
      value: formatTime(analytics.totalTime),
      icon: Clock,
      color: 'text-green-600 dark:text-green-400',
      bg: 'bg-green-100 dark:bg-green-900/20',
      change: '+3.2h this week'
    },
    {
      label: 'Topics Mastered',
      value: analytics.topicsMastered,
      icon: Target,
      color: 'text-purple-600 dark:text-purple-400',
      bg: 'bg-purple-100 dark:bg-purple-900/20',
      change: '+1 this month'
    }
  ]

  const chapterDistribution = [
    { name: 'Queries', value: 35, color: '#4f46e5' },
    { name: 'Indexes', value: 25, color: '#10b981' },
    { name: 'Performance', value: 20, color: '#f59e0b' },
    { name: 'Other', value: 20, color: '#8b5cf6' }
  ]

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Learning Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mt-1">
            Track your PostgreSQL documentation progress
          </p>
        </div>
        
        <div className="flex items-center space-x-2">
          <Calendar className="w-4 h-4 text-gray-400" />
          <select 
            value={timeframe}
            onChange={(e) => setTimeframe(e.target.value)}
            className="px-3 py-2 text-sm border rounded-lg dark:bg-gray-800 dark:border-gray-600 focus:ring-2 focus:ring-indigo-500"
          >
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="year">This Year</option>
          </select>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon
          return (
            <div key={index} className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-xl ${stat.bg}`}>
                  <Icon className={`w-6 h-6 ${stat.color}`} />
                </div>
                <TrendingUp className="w-4 h-4 text-green-500" />
              </div>
              <div className="space-y-1">
                <div className="text-2xl font-bold">{stat.value}</div>
                <div className="text-sm text-gray-600 dark:text-gray-300">{stat.label}</div>
                <div className="text-xs text-green-600 dark:text-green-400">{stat.change}</div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Chapter Coverage Overview - NEW */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6">
        <h3 className="text-lg font-semibold mb-4">📚 Chapter Coverage Overview</h3>
        <div className="space-y-4">
          {/* Well Covered */}
          <div>
            <div className="text-sm font-medium text-green-600 dark:text-green-400 mb-2">
              🎯 Well Covered (3+ questions)
            </div>
            <div className="space-y-2 ml-4">
              {analytics.chapterCoverage.filter(c => c.status === 'well').map((chapter, idx) => (
                <div key={idx} className="flex items-center justify-between p-2 bg-green-50 dark:bg-green-900/10 rounded">
                  <span className="text-sm">✓ {chapter.chapter}</span>
                  <span className="text-xs text-gray-600 dark:text-gray-400">
                    {chapter.questions} questions, {chapter.words} words
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Partially Covered */}
          <div>
            <div className="text-sm font-medium text-yellow-600 dark:text-yellow-400 mb-2">
              📖 Partially Covered (1-2 questions)
            </div>
            <div className="space-y-2 ml-4">
              {analytics.chapterCoverage.filter(c => c.status === 'partial').map((chapter, idx) => (
                <div key={idx} className="flex items-center justify-between p-2 bg-yellow-50 dark:bg-yellow-900/10 rounded">
                  <span className="text-sm">~ {chapter.chapter}</span>
                  <span className="text-xs text-gray-600 dark:text-gray-400">
                    {chapter.questions} question{chapter.questions > 1 ? 's' : ''}, {chapter.words} words
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Not Explored */}
          <div>
            <div className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
              ❓ Not Yet Explored
            </div>
            <div className="grid grid-cols-2 gap-2 ml-4">
              {analytics.chapterCoverage.filter(c => c.status === 'not').map((chapter, idx) => (
                <div key={idx} className="text-sm text-gray-500 dark:text-gray-400 p-2 bg-gray-50 dark:bg-gray-700/30 rounded">
                  ○ {chapter.chapter}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Questions/Day Chart */}
        <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 hover:shadow-lg transition-shadow duration-300">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold">Questions Asked (Daily)</h3>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={analytics.weekly} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
              <XAxis 
                dataKey="day" 
                stroke="#6b7280"
                fontSize={12}
              />
              <YAxis 
                stroke="#6b7280"
                fontSize={12}
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: '#1f2937',
                  border: '1px solid #374151',
                  borderRadius: '8px',
                  color: '#f9fafb'
                }}
              />
              <Bar dataKey="questions" fill="#4f46e5" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Chapter Distribution */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 hover:shadow-lg transition-shadow duration-300">
          <h3 className="text-lg font-semibold mb-6">Chapter Distribution</h3>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={chapterDistribution}
                cx="50%"
                cy="50%"
                innerRadius={40}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {chapterDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-4 space-y-2">
            {chapterDistribution.map((item, index) => (
              <div key={index} className="flex items-center justify-between text-sm">
                <div className="flex items-center space-x-2">
                  <div 
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: item.color }}
                  ></div>
                  <span className="text-gray-600 dark:text-gray-300">{item.name}</span>
                </div>
                <span className="font-medium">{item.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Time Spent Chart */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 hover:shadow-lg transition-shadow duration-300">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold">Time Spent Learning</h3>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            Average: {formatTime(analytics.avgSession)} per session
          </div>
        </div>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={analytics.weekly} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
            <XAxis 
              dataKey="day" 
              stroke="#6b7280"
              fontSize={12}
            />
            <YAxis 
              stroke="#6b7280"
              fontSize={12}
            />
            <Tooltip 
              contentStyle={{
                backgroundColor: '#1f2937',
                border: '1px solid #374151',
                borderRadius: '8px',
                color: '#f9fafb'
              }}
              formatter={(value) => [formatTime(value), 'Time']}
            />
            <Line 
              type="monotone" 
              dataKey="minutes" 
              stroke="#10b981" 
              strokeWidth={3}
              dot={{ fill: '#10b981', strokeWidth: 2, r: 6 }}
              activeDot={{ r: 8, stroke: '#10b981', strokeWidth: 2 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Goals & Achievements */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-lg font-semibold mb-4">Weekly Goals</h3>
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Questions Asked</span>
                <span className="font-medium">32 / 50</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full" style={{ width: '64%' }}></div>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Learning Time</span>
                <span className="font-medium">6.5h / 10h</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div className="bg-gradient-to-r from-green-500 to-green-600 h-2 rounded-full" style={{ width: '65%' }}></div>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>New Chapters Explored</span>
                <span className="font-medium">2 / 3</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div className="bg-gradient-to-r from-purple-500 to-purple-600 h-2 rounded-full" style={{ width: '67%' }}></div>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Deep Dives (50+ words)</span>
                <span className="font-medium">15 / 20</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div className="bg-gradient-to-r from-orange-500 to-orange-600 h-2 rounded-full" style={{ width: '75%' }}></div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-lg font-semibold mb-4">Recent Achievements</h3>
          <div className="space-y-3">
            <div className="flex items-center space-x-3 p-3 bg-yellow-50 dark:bg-yellow-900/10 rounded-lg border border-yellow-200 dark:border-yellow-800">
              <div className="w-8 h-8 bg-yellow-100 dark:bg-yellow-900/20 rounded-full flex items-center justify-center">
                <Award className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />
              </div>
              <div>
                <div className="font-medium text-sm">Consistency Champion</div>
                <div className="text-xs text-gray-600 dark:text-gray-300">7-day learning streak</div>
              </div>
            </div>
            
            <div className="flex items-center space-x-3 p-3 bg-blue-50 dark:bg-blue-900/10 rounded-lg border border-blue-200 dark:border-blue-800">
              <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center">
                <BookOpen className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <div className="font-medium text-sm">Deep Diver</div>
                <div className="text-xs text-gray-600 dark:text-gray-300">Asked 10+ questions on Indexes</div>
              </div>
            </div>

            <div className="flex items-center space-x-3 p-3 bg-green-50 dark:bg-green-900/10 rounded-lg border border-green-200 dark:border-green-800">
              <div className="w-8 h-8 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center">
                <Target className="w-4 h-4 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <div className="font-medium text-sm">Explorer</div>
                <div className="text-xs text-gray-600 dark:text-gray-300">Covered 50% of documentation</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Suggested Next Topics - NEW */}
      <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl p-6 text-white">
        <h3 className="text-xl font-semibold mb-4">🎯 Suggested Next Topics</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm">
            <div className="text-lg font-bold mb-1">🔒 Replication</div>
            <div className="text-sm opacity-90">You haven't explored this yet</div>
          </div>
          <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm">
            <div className="text-lg font-bold mb-1">🛡️ Security</div>
            <div className="text-sm opacity-90">Important topic to cover next</div>
          </div>
          <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm">
            <div className="text-lg font-bold mb-1">⚡ Advanced Performance</div>
            <div className="text-sm opacity-90">Build on your Indexes knowledge</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DashboardPage


