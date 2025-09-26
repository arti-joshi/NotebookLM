import { useEffect, useRef, useState } from 'react'
import { MessageCircle, Send, X, Bot, User, Minimize2, Maximize2 } from 'lucide-react'
import { callApi } from '../lib/api'
import { CitationList } from './CitationBadge'
import { ErrorBoundary } from './ErrorBoundary'
import './CitationBadge.css'

function ChatWidgetContent() {
  const [isOpen, setIsOpen] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [messages, setMessages] = useState([
    { 
      role: 'assistant', 
      content: 'Hi! I\'m your AI assistant. Ask me about your documents, request summaries, or get help with analysis.',
      timestamp: new Date()
    }
  ])
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const endRef = useRef(null)
  const inputRef = useRef(null)

  useEffect(() => {
    if (isOpen && !isMinimized) {
      endRef.current?.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages, isOpen, isMinimized])

  useEffect(() => {
    if (isOpen && !isMinimized) {
      inputRef.current?.focus()
    }
  }, [isOpen, isMinimized])

  async function sendMessage(e) {
    e.preventDefault()
    const text = input.trim()
    if (!text || isTyping) return
    
    const userMessage = { 
      role: 'user', 
      content: text, 
      timestamp: new Date() 
    }
    const updatedMessages = [...messages, userMessage]
    setMessages(updatedMessages)
    setInput('')
    setIsTyping(true)

    try {
      // Use PostgreSQL docs chat endpoint
      const response = await callApi('/postgres-docs/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: updatedMessages.map(({ role, content }) => ({ role, content })) })
      })
      
      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(`HTTP ${response.status}: ${errorText}`)
      }
      
      const data = await response.json()
      
      // Handle different response formats from the server
      let assistantReply = ''
      if (typeof data === 'string') {
        assistantReply = data
      } else if (data && typeof data === 'object') {
        // Check various possible response fields
        assistantReply = data.answer || data.reply || data.message || data.content || data.response || ''
      }
      
      // Fallback if no valid response
      if (!assistantReply) {
        assistantReply = 'I received your message but couldn\'t generate a proper response. Please try again.'
      }
      
      setMessages((prevMessages) => [...prevMessages, { 
        role: 'assistant', 
        content: assistantReply,
        timestamp: new Date(),
        citations: data.citations
      }])
    } catch (error) {
      console.error('Chat Error:', error)
      let errorMessage = 'Sorry, I encountered an error. '
      
      if (error.message) {
        if (error.message.includes('Failed to fetch')) {
          errorMessage += 'Unable to connect to the server. Please check if the backend is running on port 4003.'
        } else if (error.message.includes('401') || error.message.includes('Unauthorized')) {
          errorMessage += 'Authentication required. Please log in again.'
        } else if (error.message.includes('CORS')) {
          errorMessage += 'CORS error. Please check server configuration.'
        } else {
          errorMessage += error.message
        }
      } else {
        errorMessage += 'Unknown error occurred.'
      }
      
      setMessages((prevMessages) => [...prevMessages, { 
        role: 'assistant', 
        content: errorMessage,
        timestamp: new Date()
      }])
    } finally {
      setIsTyping(false)
    }
  }

  const formatTime = (date) => {
    try {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    } catch (error) {
      return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  }

  const clearChat = () => {
    setMessages([{
      role: 'assistant',
      content: 'Chat cleared! How can I help you with your documents?',
      timestamp: new Date()
    }])
  }

  const testConnection = async () => {
    try {
      const res = await callApi('/', { method: 'GET' })
      if (res.ok) {
        const data = await res.json()
        setMessages(prev => [...prev, {
          role: 'assistant',
          content: `✅ Connection successful! Server responded: ${JSON.stringify(data, null, 2)}`,
          timestamp: new Date()
        }])
      } else {
        throw new Error(`Server responded with status: ${res.status}`)
      }
    } catch (err) {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: `❌ Connection failed: ${err.message}`,
        timestamp: new Date()
      }])
    }
  }

  return (
    <>
      {/* Chat Button */}
      {!isOpen && (
        <div className="fixed bottom-6 right-6 z-50">
          <button
            onClick={() => setIsOpen(true)}
            className="group relative w-14 h-14 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-full shadow-xl hover:shadow-2xl transform hover:scale-110 transition-all duration-300 flex items-center justify-center"
          >
            <MessageCircle className="w-6 h-6" />
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
          </button>
        </div>
      )}

      {/* Chat Widget */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 z-50 animate-in slide-in-from-bottom-4 duration-300">
          <div className={`bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-2xl flex flex-col transition-all duration-300 ${
            isMinimized ? 'w-80 h-16' : 'w-96 h-[32rem]'
          }`}>
            
            {/* Header */}
            <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-t-2xl">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                  <Bot className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-medium text-sm">AI Assistant</div>
                  <div className="text-xs opacity-75">
                    {isTyping ? 'Typing...' : 'Online'}
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setIsMinimized(!isMinimized)}
                  className="p-1 hover:bg-white/20 rounded transition-colors duration-200"
                  title={isMinimized ? 'Maximize' : 'Minimize'}
                >
                  {isMinimized ? (
                    <Maximize2 className="w-4 h-4" />
                  ) : (
                    <Minimize2 className="w-4 h-4" />
                  )}
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1 hover:bg-white/20 rounded transition-colors duration-200"
                  title="Close"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {!isMinimized && (
              <>
                {/* Messages */}
                <div className="flex-1 overflow-y-auto px-4 py-3 space-y-4 scroll-smooth">
                  {messages.map((m, idx) => (
                    <div key={idx} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[80%] ${m.role === 'user' ? 'order-2' : 'order-1'}`}>
                        <div className={`flex items-start space-x-2 ${m.role === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                          <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium ${
                            m.role === 'user' 
                              ? 'bg-indigo-500 text-white' 
                              : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300'
                          }`}>
                            {m.role === 'user' ? <User className="w-3 h-3" /> : <Bot className="w-3 h-3" />}
                          </div>
                          <div className={`px-3 py-2 rounded-2xl text-sm whitespace-pre-wrap ${
                            m.role === 'user'
                              ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-br-md'
                              : 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-bl-md'
                          }`}>
                            {m.content}
                            {m.role === 'assistant' && m.citations && (
                              <CitationList citations={m.citations} />
                            )}
                          </div>
                        </div>
                        <div className={`text-xs text-gray-400 mt-1 ${m.role === 'user' ? 'text-right' : 'text-left'}`}>
                          {formatTime(m.timestamp)}
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {isTyping && (
                    <div className="flex justify-start">
                      <div className="flex items-start space-x-2">
                        <div className="w-6 h-6 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center">
                          <Bot className="w-3 h-3 text-gray-600 dark:text-gray-300" />
                        </div>
                        <div className="bg-gray-100 dark:bg-gray-800 px-3 py-2 rounded-2xl rounded-bl-md">
                          <div className="flex space-x-1">
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  <div ref={endRef} />
                </div>

                {/* Quick Actions */}
                <div className="px-4 py-2 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => setInput('Summarize the main points of this document')}
                      className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full transition-colors duration-200"
                    >
                      Summarize
                    </button>
                    <button
                      onClick={() => setInput('What are the key insights from this document?')}
                      className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full transition-colors duration-200"
                    >
                      Key Insights
                    </button>
                    <button
                      onClick={testConnection}
                      className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full transition-colors duration-200"
                    >
                      Test API
                    </button>
                    <button
                      onClick={clearChat}
                      className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full transition-colors duration-200"
                    >
                      Clear Chat
                    </button>
                  </div>
                </div>

                {/* Input */}
                <form onSubmit={sendMessage} className="p-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex space-x-2">
                    <input
                      ref={inputRef}
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      placeholder="Ask about your documents..."
                      disabled={isTyping}
                      className="flex-1 px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 focus:ring-2 focus:ring-indigo-500 focus:border-transparent disabled:opacity-50"
                    />
                    <button
                      type="submit"
                      disabled={!input.trim() || isTyping}
                      className="p-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl hover:from-indigo-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105"
                    >
                      <Send className="w-4 h-4" />
                    </button>
                  </div>
                </form>
              </>
            )}
          </div>
        </div>
      )}
    </>
  )
}

function ChatWidget() {
  return (
    <ErrorBoundary
      fallback={
        <div className="fixed bottom-6 right-6 z-50 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-2xl p-4">
          <p className="text-red-600 dark:text-red-400">
            Something went wrong with the chat widget. Please refresh the page.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="mt-2 px-3 py-1 text-sm bg-red-100 text-red-800 rounded-md hover:bg-red-200"
          >
            Refresh
          </button>
        </div>
      }
    >
      <ChatWidgetContent />
    </ErrorBoundary>
  );
}

export default ChatWidget;