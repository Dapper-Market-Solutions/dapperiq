import { useState } from 'react'
import { getClientConfig } from '../api/dapperiq'

export default function LoginScreen({ onLogin }) {
  const [clientId, setClientId] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  async function handleSubmit(e) {
    e.preventDefault()
    const id = clientId.trim().toLowerCase()
    if (!id) return
    setLoading(true)
    setError(null)
    try {
      const config = await getClientConfig(id)
      onLogin(config)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col items-center justify-center py-16">
      <img src="/logo.png" alt="DMS" className="h-16 mb-6 drop-shadow-sm" />

      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-navy-800 mb-2">
          Welcome to DapperIQ<sup className="text-lg align-super ml-0.5">TM</sup>
        </h1>
        <p className="text-gray-500 text-base">Your lead intelligence portal.</p>
        <p className="text-gray-400 text-sm mt-1">Enter your client ID below to get started.</p>
      </div>

      <div className="w-full max-w-sm bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="client-id" className="block text-sm font-medium text-gray-700 mb-1.5">
              Client ID
            </label>
            <input
              id="client-id"
              type="text"
              value={clientId}
              onChange={(e) => setClientId(e.target.value)}
              placeholder="Enter your client ID"
              autoFocus
              className="w-full px-4 py-3 border border-gray-200 rounded-xl text-gray-900
                         placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-navy-500
                         focus:border-transparent transition"
            />
          </div>

          {error && (
            <div className="bg-red-50 border border-red-100 text-red-600 rounded-xl p-3 text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading || !clientId.trim()}
            className="w-full py-3 bg-navy-600 text-white font-semibold rounded-xl
                       hover:bg-navy-700 disabled:opacity-50 disabled:cursor-not-allowed
                       transition flex items-center justify-center gap-2 shadow-sm"
          >
            {loading && (
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            )}
            {loading ? 'Looking up...' : 'Continue →'}
          </button>
        </form>
      </div>

      <p className="mt-6 text-xs text-gray-400">
        Need access? Contact{' '}
        <a href="mailto:support@dapperms.com" className="underline hover:text-gray-600 transition">
          support@dapperms.com
        </a>
      </p>
    </div>
  )
}
