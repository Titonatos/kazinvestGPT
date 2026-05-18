import { useState } from 'react'
import ChatInput from './components/ChatInput'
import ResponseDisplay from './components/ResponseDisplay'

function App() {
  const [input, setInput] = useState('')
  const [response, setResponse] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [listening, setListening] = useState(false)

  const handleSend = async (message) => {
    setLoading(true)
    setError('')
    setResponse('')

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Server error: ' + res.status)
      }

      setResponse(data.response)
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
          <ResponseDisplay loading={loading} error={error} response={response} />
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
