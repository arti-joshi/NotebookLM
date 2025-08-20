import { useEffect, useState } from 'react'
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from 'recharts'

function DashboardPage() {
  const [weekly, setWeekly] = useState([])
  const [streak, setStreak] = useState(0)

  useEffect(() => {
    async function load() {
      try {
        const api = import.meta.env.VITE_API_URL || 'http://localhost:4000'
        const res = await fetch(api + '/progress/summary')
        const data = await res.json()
        setWeekly(data.weekly || [])
        setStreak(data.streak || 0)
      } catch {}
    }
    load()
  }, [])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Dashboard</h1>
        <div className="text-sm">Streak: <span className="font-medium">{streak} days</span></div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="p-4 border rounded dark:border-gray-800">
          <div className="font-medium mb-2">Pages Read (Weekly)</div>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={weekly}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="pages" fill="#4f46e5" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="p-4 border rounded dark:border-gray-800">
          <div className="font-medium mb-2">Time Spent (Weekly)</div>
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={weekly}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="minutes" stroke="#10b981" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}

export default DashboardPage


