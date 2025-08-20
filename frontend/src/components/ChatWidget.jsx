import { useEffect, useRef, useState } from 'react'

function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState([{ role: 'assistant', content: 'Hi! Ask me about your documents.' }])
  const [input, setInput] = useState('')
  const endRef = useRef(null)

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isOpen])

  async function sendMessage(e) {
    e.preventDefault()
    const text = input.trim()
    if (!text) return
    const next = [...messages, { role: 'user', content: text }]
    setMessages(next)
    setInput('')
    try {
      const api = import.meta.env.VITE_API_URL || 'http://localhost:4000'
      const res = await fetch(api + '/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: next.slice(-10) }),
      })
      const data = await res.json()
      setMessages((m) => [...m, { role: 'assistant', content: data.answer ?? 'No response' }])
    } catch (err) {
      setMessages((m) => [...m, { role: 'assistant', content: 'Error contacting AI service.' }])
    }
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {isOpen && (
        <div className="w-96 h-128 max-h-[70vh] bg-white dark:bg-gray-900 border dark:border-gray-800 rounded-xl shadow-xl flex flex-col">
          <div className="px-3 py-2 border-b dark:border-gray-800 flex items-center justify-between">
            <div className="font-medium">AI Assistant</div>
            <button className="text-sm text-gray-500" onClick={() => setIsOpen(false)}>Close</button>
          </div>
          <div className="flex-1 overflow-y-auto px-3 py-2 space-y-3">
            {messages.map((m, idx) => (
              <div key={idx} className={m.role === 'user' ? 'text-right' : 'text-left'}>
                <div className={m.role === 'user' ? 'inline-block bg-brand text-white px-3 py-2 rounded-lg' : 'inline-block bg-gray-100 dark:bg-gray-800 px-3 py-2 rounded-lg'}>
                  {m.content}
                </div>
              </div>
            ))}
            <div ref={endRef} />
          </div>
          <form onSubmit={sendMessage} className="p-2 border-t dark:border-gray-800 flex gap-2">
            <input value={input} onChange={(e)=>setInput(e.target.value)} placeholder="Ask a question..." className="flex-1 px-3 py-2 rounded border dark:border-gray-700 bg-white dark:bg-gray-900" />
            <button className="px-4 py-2 bg-brand text-white rounded">Send</button>
          </form>
        </div>
      )}
      <button onClick={() => setIsOpen((v)=>!v)} className="w-14 h-14 rounded-full bg-brand text-white shadow-lg">
        {isOpen ? '–' : 'AI'}
      </button>
    </div>
  )
}

export default ChatWidget


