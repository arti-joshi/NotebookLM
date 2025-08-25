// import { useEffect, useState } from 'react'
// import { LineChart, Line, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from 'recharts'

// function DashboardPage() {
//   const [weekly, setWeekly] = useState([])
//   const [streak, setStreak] = useState(0)
//   const [isLoading, setIsLoading] = useState(true)
//   const [error, setError] = useState(null)

//   useEffect(() => {
//     async function load() {
//       try {
//         setIsLoading(true)
//         const api = import.meta.env.VITE_API_URL || 'http://localhost:4000'
//         const res = await fetch(`${api}/progress/summary`)
        
//         if (!res.ok) {
//           throw new Error(`HTTP error! status: ${res.status}`)
//         }
        
//         const data = await res.json()
//         setWeekly(data.weekly || [])
//         setStreak(data.streak || 0)
//       } catch (err) {
//         setError(err.message)
//         console.error('Failed to fetch dashboard data:', err)
//       } finally {
//         setIsLoading(false)
//       }
//     }
//     load()
//   }, [])

//   if (isLoading) {
//     return (
//       <div className="flex items-center justify-center h-64">
//         <div className="text-lg">Loading dashboard data...</div>
//       </div>
//     )
//   }

//   if (error) {
//     return (
//       <div className="flex items-center justify-center h-64">
//         <div className="text-lg text-red-600">Error: {error}</div>
//       </div>
//     )
//   }

//   return (
//     <div className="space-y-6">
//       <div className="flex items-center justify-between">
//         <h1 className="text-2xl font-semibold">Dashboard</h1>
//         <div className="text-sm">
//           Streak: <span className="font-medium">{streak} days</span>
//         </div>
//       </div>
      
//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//         <div className="p-4 border rounded dark:border-gray-800">
//           <div className="font-medium mb-2">Pages Read (Weekly)</div>
//           <ResponsiveContainer width="100%" height={260}>
//             <BarChart data={weekly}>
//               <CartesianGrid strokeDasharray="3 3" />
//               <XAxis dataKey="day" />
//               <YAxis />
//               <Tooltip />
//               <Bar dataKey="pages" fill="#4f46e5" />
//             </BarChart>
//           </ResponsiveContainer>
//         </div>

//         <div className="p-4 border rounded dark:border-gray-800">
//           <div className="font-medium mb-2">Time Spent (Weekly)</div>
//           <ResponsiveContainer width="100%" height={260}>
//             <LineChart data={weekly}>
//               <CartesianGrid strokeDasharray="3 3" />
//               <XAxis dataKey="day" />
//               <YAxis />
//               <Tooltip />
//               <Line 
//                 type="monotone" 
//                 dataKey="minutes" 
//                 stroke="#10b981" 
//                 strokeWidth={2} 
//               />
//             </LineChart>
//           </ResponsiveContainer>
//         </div>
//       </div>
//     </div>
//   )
// }

// export default DashboardPage

import { useEffect, useState } from 'react'
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import { TrendingUp, Clock, BookOpen, Target, Award, Calendar } from 'lucide-react'

function DashboardPage() {
  const [analytics, setAnalytics] = useState({
    weekly: [],
    streak: 0,
    totalPages: 0,
    totalTime: 0,
    documentsRead: 0,
    avgSession: 0
  })
  const [timeframe, setTimeframe] = useState('week') // week, month, year

  useEffect(() => {
    async function load() {
      try {
        const api = import.meta.env.VITE_API_URL || 'http://localhost:4000'
        const res = await fetch(api + '/progress/summary')
        const data = await res.json()
        setAnalytics({
          weekly: data.weekly || generateMockData(),
          streak: data.streak || 7,
          totalPages: data.totalPages || 234,
          totalTime: data.totalTime || 1247,
          documentsRead: data.documentsRead || 12,
          avgSession: data.avgSession || 28
        })
      } catch {
        // Fallback to mock data for demo
        setAnalytics({
          weekly: generateMockData(),
          streak: 7,
          totalPages: 234,
          totalTime: 1247,
          documentsRead: 12,
          avgSession: 28
        })
      }
    }
    load()
  }, [timeframe])

  function generateMockData() {
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
    return days.map(day => ({
      day,
      pages: Math.floor(Math.random() * 50) + 10,
      minutes: Math.floor(Math.random() * 120) + 30,
      sessions: Math.floor(Math.random() * 5) + 1
    }))
  }

  const formatTime = (minutes) => {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`
  }

  const stats = [
    {
      label: 'Current Streak',
      value: `${analytics.streak} days`,
      icon: Target,
      color: 'text-orange-600 dark:text-orange-400',
      bg: 'bg-orange-100 dark:bg-orange-900/20',
      change: '+2 from last week'
    },
    {
      label: 'Total Pages Read',
      value: analytics.totalPages.toLocaleString(),
      icon: BookOpen,
      color: 'text-blue-600 dark:text-blue-400',
      bg: 'bg-blue-100 dark:bg-blue-900/20',
      change: '+47 this week'
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
      label: 'Documents',
      value: analytics.documentsRead,
      icon: Award,
      color: 'text-purple-600 dark:text-purple-400',
      bg: 'bg-purple-100 dark:bg-purple-900/20',
      change: '+2 this month'
    }
  ]

  const readingTypeData = [
    { name: 'Research Papers', value: 45, color: '#4f46e5' },
    { name: 'Books', value: 30, color: '#10b981' },
    { name: 'Articles', value: 25, color: '#f59e0b' }
  ]

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Reading Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mt-1">
            Track your reading progress and insights
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

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Pages Read Chart */}
        <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 hover:shadow-lg transition-shadow duration-300">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold">Reading Activity</h3>
            <div className="flex items-center space-x-4 text-sm">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-indigo-500 rounded-full"></div>
                <span className="text-gray-600 dark:text-gray-300">Pages</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-gray-600 dark:text-gray-300">Minutes</span>
              </div>
            </div>
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
              <Bar dataKey="pages" fill="#4f46e5" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Reading Distribution */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 hover:shadow-lg transition-shadow duration-300">
          <h3 className="text-lg font-semibold mb-6">Reading Distribution</h3>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={readingTypeData}
                cx="50%"
                cy="50%"
                innerRadius={40}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {readingTypeData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-4 space-y-2">
            {readingTypeData.map((item, index) => (
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
          <h3 className="text-lg font-semibold">Time Spent Reading</h3>
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
                <span>Pages Read</span>
                <span className="font-medium">180 / 200</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full" style={{ width: '90%' }}></div>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Reading Time</span>
                <span className="font-medium">8.5h / 10h</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div className="bg-gradient-to-r from-green-500 to-green-600 h-2 rounded-full" style={{ width: '85%' }}></div>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Documents</span>
                <span className="font-medium">3 / 5</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div className="bg-gradient-to-r from-purple-500 to-purple-600 h-2 rounded-full" style={{ width: '60%' }}></div>
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
                <div className="font-medium text-sm">Week Warrior</div>
                <div className="text-xs text-gray-600 dark:text-gray-300">Completed 7-day reading streak</div>
              </div>
            </div>
            
            <div className="flex items-center space-x-3 p-3 bg-blue-50 dark:bg-blue-900/10 rounded-lg border border-blue-200 dark:border-blue-800">
              <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center">
                <BookOpen className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <div className="font-medium text-sm">Speed Reader</div>
                <div className="text-xs text-gray-600 dark:text-gray-300">Read 50+ pages in one session</div>
              </div>
            </div>

            <div className="flex items-center space-x-3 p-3 bg-green-50 dark:bg-green-900/10 rounded-lg border border-green-200 dark:border-green-800">
              <div className="w-8 h-8 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center">
                <Target className="w-4 h-4 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <div className="font-medium text-sm">Goal Crusher</div>
                <div className="text-xs text-gray-600 dark:text-gray-300">Hit weekly reading target</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Reading Insights */}
      <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl p-6 text-white">
        <h3 className="text-xl font-semibold mb-4">📊 Weekly Insights</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm">
            <div className="text-2xl font-bold mb-1">47%</div>
            <div className="text-sm opacity-90">More productive than last week</div>
          </div>
          <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm">
            <div className="text-2xl font-bold mb-1">Tuesday</div>
            <div className="text-sm opacity-90">Your most productive day</div>
          </div>
          <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm">
            <div className="text-2xl font-bold mb-1">18 min</div>
            <div className="text-sm opacity-90">Average session length</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DashboardPage


