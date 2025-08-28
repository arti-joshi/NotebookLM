// import { useEffect, useRef, useState } from 'react'

// function ChatWidget() {
//   const [isOpen, setIsOpen] = useState(false)
//   const [messages, setMessages] = useState([{ role: 'assistant', content: 'Hi! Ask me about your documents.' }])
//   const [input, setInput] = useState('')
//   const endRef = useRef(null)

//   useEffect(() => {
//     endRef.current?.scrollIntoView({ behavior: 'smooth' })
//   }, [messages, isOpen])

//   async function sendMessage(e) {
//     e.preventDefault()
//     const text = input.trim()
//     if (!text) return
//     const next = [...messages, { role: 'user', content: text }]
//     setMessages(next)
//     setInput('')
//     try {
//       const api = import.meta.env.VITE_API_URL || 'http://localhost:4000'
//       const res = await fetch(api + '/ai/chat', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ messages: next.slice(-10) }),
//       })
//       const data = await res.json()
//       setMessages((m) => [...m, { role: 'assistant', content: data.answer ?? 'No response' }])
//     } catch (err) {
//       setMessages((m) => [...m, { role: 'assistant', content: 'Error contacting AI service.' }])
//     }
//   }

//   return (
//     <div className="fixed bottom-4 right-4 z-50">
//       {isOpen && (
//         <div className="w-96 h-128 max-h-[70vh] bg-white dark:bg-gray-900 border dark:border-gray-800 rounded-xl shadow-xl flex flex-col">
//           <div className="px-3 py-2 border-b dark:border-gray-800 flex items-center justify-between">
//             <div className="font-medium">AI Assistant</div>
//             <button className="text-sm text-gray-500" onClick={() => setIsOpen(false)}>Close</button>
//           </div>
//           <div className="flex-1 overflow-y-auto px-3 py-2 space-y-3">
//             {messages.map((m, idx) => (
//               <div key={idx} className={m.role === 'user' ? 'text-right' : 'text-left'}>
//                 <div className={m.role === 'user' ? 'inline-block bg-brand text-white px-3 py-2 rounded-lg' : 'inline-block bg-gray-100 dark:bg-gray-800 px-3 py-2 rounded-lg'}>
//                   {m.content}
//                 </div>
//               </div>
//             ))}
//             <div ref={endRef} />
//           </div>
//           <form onSubmit={sendMessage} className="p-2 border-t dark:border-gray-800 flex gap-2">
//             <input value={input} onChange={(e)=>setInput(e.target.value)} placeholder="Ask a question..." className="flex-1 px-3 py-2 rounded border dark:border-gray-700 bg-white dark:bg-gray-900" />
//             <button className="px-4 py-2 bg-brand text-white rounded">Send</button>
//           </form>
//         </div>
//       )}
//       <button onClick={() => setIsOpen((v)=>!v)} className="w-14 h-14 rounded-full bg-brand text-white shadow-lg">
//         {isOpen ? '–' : 'AI'}
//       </button>
//     </div>
//   )
// }

// export default ChatWidget


import { useEffect, useRef, useState } from 'react'
import { MessageCircle, Send, X, Bot, User, Minimize2, Maximize2 } from 'lucide-react'

function ChatWidget() {
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
      const api = import.meta.env.VITE_API_URL || 'http://localhost:4000'
      const url = `${api}/ai/chat-sambanova/stream?q=${encodeURIComponent(text)}&ts=${Date.now()}`
      console.log('Streaming from:', url)

      const res = await fetch(url, {
        method: 'GET',
        headers: {
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache'
        },
        cache: 'no-store'
      })

      if (!res.ok || !res.body) {
        let errText = ''
        try { errText = await res.text() } catch {}
        throw new Error(errText || `Server error: ${res.status}`)
      }

      let assistant = { role: 'assistant', content: '', timestamp: new Date() }
      setMessages(prev => [...prev, assistant])

      try {
        const reader = res.body.getReader()
        const decoder = new TextDecoder()
        let buffer = ''
        while (true) {
          const { value, done } = await reader.read()
          if (done) break
          buffer += decoder.decode(value, { stream: true })
          const events = buffer.split('\n\n')
          buffer = events.pop() || ''
          for (const evt of events) {
            if (!evt.startsWith('data:')) continue
            const json = evt.slice(5).trim()
            try {
              const { delta, done: finished, error } = JSON.parse(json)
              if (error) throw new Error(error)
              if (delta) {
                assistant = { ...assistant, content: assistant.content + delta }
                setMessages(prev => {
                  const copy = [...prev]
                  copy[copy.length - 1] = assistant
                  return copy
                })
              }
              if (finished) break
            } catch {}
          }
        }
      } catch (streamErr) {
        console.warn('Stream failed, falling back:', streamErr)
        // Fallback to non-streaming GET
        const fallbackUrl = `${api}/ai/chat-sambanova?q=${encodeURIComponent(text)}&ts=${Date.now()}`
        const r = await fetch(fallbackUrl, {
          method: 'GET',
          headers: { 'Cache-Control': 'no-cache', 'Pragma': 'no-cache' },
          cache: 'no-store'
        })
        const data = await r.json().catch(() => ({}))
        const content = r.ok ? (data.answer || 'No response') : (data.error || `Server error: ${r.status}`)
        assistant = { ...assistant, content }
        setMessages(prev => {
          const copy = [...prev]
          copy[copy.length - 1] = assistant
          return copy
        })
      }
      
    } catch (err) {
      console.error('Chat error:', err)
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: `Error: ${err.message}. Please check your connection and try again.`,
        timestamp: new Date()
      }])
    } finally {
      setIsTyping(false)
    }
  }

  const formatTime = (date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
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
      const api = import.meta.env.VITE_API_URL || 'http://localhost:4000'
      const res = await fetch(api + '/')
      const text = await res.text()
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: `Connection test: ${text}`,
        timestamp: new Date()
      }])
    } catch (err) {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: `Connection failed: ${err.message}`,
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
                          <div className={`px-3 py-2 rounded-2xl text-sm ${
                            m.role === 'user'
                              ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-br-md'
                              : 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-bl-md'
                          }`}>
                            {m.content}
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

export default ChatWidget