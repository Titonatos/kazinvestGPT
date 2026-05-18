import { useRef, useCallback } from 'react'

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition

export default function ChatInput({ input, setInput, onSend, loading, listening, setListening }) {
  const recognitionRef = useRef(null)

  const startListening = useCallback(() => {
    if (!SpeechRecognition) {
      alert('Speech recognition is not supported.')
      return
    }
    const recognition = new SpeechRecognition()
    recognition.lang = 'en-US'
    recognition.interimResults = false
    recognition.continuous = false

    recognition.onresult = (event) => {
      setInput(event.results[0][0].transcript)
    }

    recognition.onerror = (event) => {
      console.error('Speech error:', event.error)
      setListening(false)
    }

    recognition.onend = () => setListening(false)

    recognitionRef.current = recognition
    recognition.start()
    setListening(true)
  }, [setInput, setListening])

  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop()
      recognitionRef.current = null
    }
    setListening(false)
  }, [setListening])

  const toggleMic = () => (listening ? stopListening() : startListening())

  const handleSubmit = (e) => {
    e.preventDefault()
    if (input.trim() && !loading) onSend(input)
  }

  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-2 w-full">
      <button type="button" onClick={toggleMic} disabled={loading}
        className={`shrink-0 w-10 h-10 flex items-center justify-center rounded-full transition-colors ${
          listening
            ? 'bg-red-500 text-white animate-pulse'
            : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
        } disabled:opacity-50 disabled:cursor-not-allowed`}
        title={listening ? 'Stop recording' : 'Start voice input'}
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
          <path d="M12 2a3 3 0 0 0-3 3v6a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
          <path d="M19 10a1 1 0 0 0-2 0 5 5 0 0 1-10 0 1 1 0 0 0-2 0 7 7 0 0 0 6 6.93V20H8a1 1 0 1 0 0 2h8a1 1 0 1 0 0-2h-3v-3.07A7 7 0 0 0 19 10Z" />
        </svg>
      </button>

      <input type="text" value={input} onChange={(e) => setInput(e.target.value)}
        placeholder="Type your message..." disabled={loading}
        className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
      />

      <button type="submit" disabled={!input.trim() || loading}
        className="shrink-0 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
      >
        {loading ? (
          <>
            <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            Sending
          </>
        ) : 'Send'}
      </button>
    </form>
  )
}
