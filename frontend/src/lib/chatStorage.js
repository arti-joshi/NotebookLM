// Local storage keys
const STORAGE_KEYS = {
  MESSAGES: 'chat_messages',
  IS_OPEN: 'chat_is_open',
  IS_MINIMIZED: 'chat_is_minimized',
  RECENT_TOPICS: 'chat_recent_topics',
  LAST_UPDATED: 'chat_last_updated'
}

// Maximum age of stored chat data (24 hours)
const MAX_AGE_MS = 24 * 60 * 60 * 1000

// Check if stored data is still valid
function isDataFresh() {
  const lastUpdated = localStorage.getItem(STORAGE_KEYS.LAST_UPDATED)
  if (!lastUpdated) return false
  
  const age = Date.now() - parseInt(lastUpdated, 10)
  return age < MAX_AGE_MS
}

// Save chat state to localStorage
export function saveChatState(state) {
  try {
    if (state.messages) {
      localStorage.setItem(STORAGE_KEYS.MESSAGES, JSON.stringify(state.messages))
    }
    if (typeof state.isOpen === 'boolean') {
      localStorage.setItem(STORAGE_KEYS.IS_OPEN, JSON.stringify(state.isOpen))
    }
    if (typeof state.isMinimized === 'boolean') {
      localStorage.setItem(STORAGE_KEYS.IS_MINIMIZED, JSON.stringify(state.isMinimized))
    }
    if (state.recentTopics) {
      localStorage.setItem(STORAGE_KEYS.RECENT_TOPICS, JSON.stringify(state.recentTopics))
    }
    
    localStorage.setItem(STORAGE_KEYS.LAST_UPDATED, Date.now().toString())
    console.log('Chat state saved to localStorage')
  } catch (err) {
    console.error('Failed to save chat state:', err)
  }
}

// Load chat state from localStorage
export function loadChatState() {
  try {
    if (!isDataFresh()) {
      console.log('Stored chat data is stale, clearing...')
      clearChatState()
      return null
    }
    
    const messages = localStorage.getItem(STORAGE_KEYS.MESSAGES)
    const isOpen = localStorage.getItem(STORAGE_KEYS.IS_OPEN)
    const isMinimized = localStorage.getItem(STORAGE_KEYS.IS_MINIMIZED)
    const recentTopics = localStorage.getItem(STORAGE_KEYS.RECENT_TOPICS)
    
    return {
      messages: messages ? JSON.parse(messages) : null,
      isOpen: isOpen ? JSON.parse(isOpen) : null,
      isMinimized: isMinimized ? JSON.parse(isMinimized) : null,
      recentTopics: recentTopics ? JSON.parse(recentTopics) : null
    }
  } catch (err) {
    console.error('Failed to load chat state:', err)
    return null
  }
}

// Clear chat state from localStorage
export function clearChatState() {
  try {
    Object.values(STORAGE_KEYS).forEach(key => {
      localStorage.removeItem(key)
    })
    console.log('Chat state cleared from localStorage')
  } catch (err) {
    console.error('Failed to clear chat state:', err)
  }
}

// Clear chat state when user logs out
export function clearChatOnLogout() {
  clearChatState()
}
