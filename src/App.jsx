import { useState } from 'react'
import ChatInput from './components/ChatInput'
import ResponseDisplay from './components/ResponseDisplay'

function App() {
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState([])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [listening, setListening] = useState(false)

  const handleSend = async (message) => {
    const userMessage = { role: 'user', content: message }
    setMessages(prev => [...prev, userMessage])
    setLoading(true)
    setError('')

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: [...messages, userMessage] }),
      })

      const text = await res.text()
      let data
      try {
        data = JSON.parse(text)
      } catch {
        throw new Error(
          'Сервер API недоступен. Запустите npm run dev (или npm run build && npm start).'
        )
      }

      if (!res.ok) {
        throw new Error(data.error || 'Server error: ' + res.status)
      }

      setMessages(prev => [...prev, { role: 'assistant', content: data.response }])
      setInput('')
    } catch (err) {
      setError(err.message || 'Failed to connect.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b border-gray-200 dark:border-gray-700 py-4">
        <h1 className="text-xl font-semibold text-gray-900 dark:text-gray-100 text-center">
          ChatGPT Chat
        </h1>
      </header>

      <main className="flex-1 flex flex-col max-w-2xl w-full mx-auto px-4 py-6 gap-6">
        <div className="flex-1 flex flex-col justify-end gap-4">
          <ResponseDisplay messages={messages} loading={loading} error={error} />
        </div>

        <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
          <ChatInput
            input={input}
            setInput={setInput}
            onSend={handleSend}
            loading={loading}
            listening={listening}
            setListening={setListening}
          />
        </div>
      </main>
    </div>
  )
}

export default App
