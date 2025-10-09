// Custom event system for progress updates
class ProgressEventEmitter {
  constructor() {
    this.listeners = new Map()
  }

  // Subscribe to progress updates
  on(event, callback) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, [])
    }
    this.listeners.get(event).push(callback)
    
    // Return unsubscribe function
    return () => {
      const callbacks = this.listeners.get(event)
      if (callbacks) {
        const index = callbacks.indexOf(callback)
        if (index > -1) {
          callbacks.splice(index, 1)
        }
      }
    }
  }

  // Emit progress update event
  emit(event, data) {
    const callbacks = this.listeners.get(event)
    if (callbacks) {
      callbacks.forEach(callback => {
        try {
          callback(data)
        } catch (err) {
          console.error('Progress event listener error:', err)
        }
      })
    }
  }

  // Clear all listeners
  clear() {
    this.listeners.clear()
  }
}

// Singleton instance
export const progressEvents = new ProgressEventEmitter()

// Event types
export const PROGRESS_EVENTS = {
  INTERACTION_RECORDED: 'interaction_recorded',
  MASTERY_UPDATED: 'mastery_updated',
  TOPIC_COMPLETED: 'topic_completed',
  PROGRESS_CHANGED: 'progress_changed'
}

// Helper to trigger progress update
export function notifyProgressUpdate(data = {}) {
  console.log('Progress update notification:', data)
  progressEvents.emit(PROGRESS_EVENTS.PROGRESS_CHANGED, {
    timestamp: new Date().toISOString(),
    ...data
  })
}
