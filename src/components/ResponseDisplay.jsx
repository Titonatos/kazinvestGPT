export default function ResponseDisplay({ loading, error, response }) {
  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <svg className="animate-spin h-8 w-8 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg p-4 text-red-700 dark:text-red-300 text-sm">
        {error}
      </div>
    )
  }

  if (!response) {
    return (
      <div className="text-center py-12 text-gray-400 dark:text-gray-500 text-sm">
        Send a message to get a response from ChatGPT.
      </div>
    )
  }

  return (
    <div className="bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-lg p-4 text-left">
      <p className="text-gray-900 dark:text-gray-100 whitespace-pre-wrap leading-relaxed">{response}</p>
    </div>
  )
}
