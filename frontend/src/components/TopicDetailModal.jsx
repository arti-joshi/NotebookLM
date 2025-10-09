import { useEffect, useState } from 'react'
import { X, CheckCircle, Circle } from 'lucide-react'
import { getTopicProgress, markTopicComplete } from '../lib/api'

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

function CircularProgress({ value = 0, size = 140, strokeWidth = 12, color = '#2563eb' }) {
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const clamped = Math.max(0, Math.min(100, value))
  const offset = circumference - (clamped / 100) * circumference
  return (
    <svg width={size} height={size} className="block">
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        stroke="#e5e7eb"
        strokeWidth={strokeWidth}
        fill="none"
      />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        stroke={color}
        strokeWidth={strokeWidth}
        fill="none"
        strokeLinecap="round"
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        transform={`rotate(-90 ${size / 2} ${size / 2})`}
      />
      <text
        x="50%"
        y="50%"
        dominantBaseline="middle"
        textAnchor="middle"
        className="fill-gray-900 dark:fill-gray-100"
        style={{ fontSize: 18, fontWeight: 700 }}
      >
        {Math.round(clamped)}%
      </text>
    </svg>
  )
}

function ScoreRow({ label, value }) {
  const pct = Math.max(0, Math.min(100, Math.round(value || 0)))
  return (
    <div>
      <div className="flex items-center justify-between text-sm mb-1">
        <span className="text-gray-700 dark:text-gray-200">{label}</span>
        <span className="text-gray-500 dark:text-gray-400">{pct}%</span>
      </div>
      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
        <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${pct}%` }} />
      </div>
    </div>
  )
}

export default function TopicDetailModal({ topicId, onClose }) {
  const [detail, setDetail] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [submitting, setSubmitting] = useState(false)

  async function load() {
    setLoading(true)
    setError(null)
    try {
      const d = await getTopicProgress(topicId)
      setDetail(d)
    } catch (e) {
      setError(e?.message || 'Failed to load topic detail')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    let cancelled = false
    
    const loadData = async () => {
      if (!topicId) return
      
      try {
        setLoading(true)
        setError(null)
        const data = await getTopicProgress(topicId)
        if (!cancelled) {
          setDetail(data)
        }
      } catch (err) {
        if (!cancelled) {
          console.error('Failed to load topic detail:', err)
          setError('Failed to load topic details')
        }
      } finally {
        if (!cancelled) {
          setLoading(false)
        }
      }
    }
    
    loadData()
    
    return () => {
      cancelled = true // Cleanup on unmount
    }
  }, [topicId])

  async function handleMarkComplete() {
    try {
      setSubmitting(true)
      await markTopicComplete(topicId)
      await load()
      try { window?.alert?.('Marked as mastered!') } catch {}
    } catch (e) {
      try { window?.alert?.(e?.message || 'Failed to mark complete') } catch {}
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={onClose}>
      <div className="bg-white dark:bg-gray-800 rounded-lg p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        {loading && (
          <div className="text-gray-600 dark:text-gray-300">Loading...</div>
        )}
        {error && (
          <div className="text-red-600 dark:text-red-400">{error}</div>
        )}
        {!loading && !error && detail && (
          <>
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">{detail.topic?.name}</h2>
                <p className="text-gray-600 dark:text-gray-300">{detail.topic?.level === 1 && detail.topic?.chapterNum ? `Chapter ${detail.topic.chapterNum}` : 'Topic'}</p>
              </div>
              <button onClick={onClose} className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"><X /></button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="flex items-center justify-center">
                <CircularProgress value={detail.mastery?.masteryLevel || 0} />
              </div>
              <div className="space-y-4">
                <ScoreRow label="Coverage" value={(detail.mastery?.coverageScore || 0) * 100} />
                <ScoreRow label="Depth" value={(detail.mastery?.depthScore || 0) * 100} />
                <ScoreRow label="Confidence" value={(detail.mastery?.confidenceScore || 0) * 100} />
                <ScoreRow label="Diversity" value={(detail.mastery?.diversityScore || 0) * 100} />
                <ScoreRow label="Retention" value={(detail.mastery?.retentionScore || 0) * 100} />
              </div>
            </div>

            {Array.isArray(detail.subtopicsProgress) && detail.subtopicsProgress.length > 0 && (
              <div className="mb-8">
                <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-gray-100">Subtopics Explored</h3>
                <div className="grid grid-cols-2 gap-2">
                  {detail.subtopicsProgress.map((sub) => (
                    <div key={sub.subtopic.id} className="flex items-center gap-2">
                      {sub.explored ? <CheckCircle className="text-green-600" /> : <Circle className="text-gray-400" />}
                      <span className={sub.explored ? 'text-gray-900 dark:text-gray-100' : 'text-gray-400 dark:text-gray-500'}>{sub.subtopic.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-gray-100">Recent Questions</h3>
              <div className="space-y-3">
                {(detail.recentInteractions || []).map((interaction) => (
                  <div key={interaction.id} className="bg-gray-50 dark:bg-gray-700 rounded p-3">
                    <p className="text-sm font-medium mb-1 text-gray-900 dark:text-gray-100">{interaction.query}</p>
                    <div className="flex gap-4 text-xs text-gray-600 dark:text-gray-300">
                      <span>Confidence: {interaction.ragConfidence}</span>
                      <span>Citations: {interaction.citationCount}</span>
                      <span>{formatRelativeTime(interaction.createdAt)}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex gap-3">
              {detail.mastery?.status !== 'MASTERED' && (
                <button
                  onClick={handleMarkComplete}
                  disabled={submitting}
                  className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-60"
                >
                  {submitting ? 'Marking…' : 'Mark as Mastered'}
                </button>
              )}
              <button
                onClick={onClose}
                className="px-4 py-2 bg-gray-200 dark:bg-gray-700 dark:text-gray-100 rounded hover:bg-gray-300 dark:hover:bg-gray-600"
              >
                Close
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}


