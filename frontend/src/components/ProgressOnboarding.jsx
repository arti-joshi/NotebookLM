import { useEffect, useState } from 'react'

export default function ProgressOnboarding() {
  const [showOnboarding, setShowOnboarding] = useState(
    typeof window !== 'undefined' && !localStorage.getItem('progress_onboarding_seen')
  )

  function handleClose() {
    try { localStorage.setItem('progress_onboarding_seen', 'true') } catch {}
    setShowOnboarding(false)
  }

  if (!showOnboarding) return null

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-8 max-w-2xl w-[92vw] shadow-xl">
        <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-gray-100">Welcome to Smart Progress Tracking! 🎓</h2>

        <div className="space-y-4 mb-6">
          <div className="flex gap-3">
            <div className="text-3xl">🔍</div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-gray-100">Automatic Topic Detection</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">We analyze your questions to understand what you're learning</p>
            </div>
          </div>

          <div className="flex gap-3">
            <div className="text-3xl">📊</div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-gray-100">Multi-Dimensional Mastery</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">Your progress is measured by coverage, depth, confidence, diversity, and retention</p>
            </div>
          </div>

          <div className="flex gap-3">
            <div className="text-3xl">🎯</div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-gray-100">Smart Recommendations</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">Get personalized suggestions on what to learn next</p>
            </div>
          </div>

          <div className="flex gap-3">
            <div className="text-3xl">✅</div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-gray-100">Mastery Completion</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">Topics are marked complete when you've explored them deeply with high confidence</p>
            </div>
          </div>
        </div>

        <div className="bg-blue-50 dark:bg-blue-900/20 rounded p-4 mb-6">
          <p className="text-sm text-gray-800 dark:text-gray-200"><strong>Tip:</strong> Ask diverse questions on each topic and space them out over several days for best retention!</p>
        </div>

        <button 
          onClick={handleClose}
          className="w-full py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700"
        >
          Got it! Start Learning
        </button>
      </div>
    </div>
  )
}


