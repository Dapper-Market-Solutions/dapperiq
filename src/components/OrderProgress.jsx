import { useState, useEffect, useRef } from 'react'
import { submitOrder } from '../api/dapperiq'

export default function OrderProgress({ orders: initialOrders, clientConfig, onNewOrder, onReset }) {
  const [orders, setOrders] = useState(initialOrders)
  const hasStarted = useRef(false)

  useEffect(() => {
    if (hasStarted.current) return
    hasStarted.current = true
    processOrders()
  }, [])

  async function processOrders() {
    for (let i = 0; i < initialOrders.length; i++) {
      setOrders((prev) =>
        prev.map((o, idx) => (idx === i ? { ...o, status: 'processing' } : o))
      )

      try {
        const result = await submitOrder({
          clientId: clientConfig.client_id,
          segmentName: initialOrders[i].segmentName,
          recordCount: initialOrders[i].recordCount,
          destinationEmail: initialOrders[i].destinationEmail,
          termsAgreedAt: initialOrders[i].termsAgreedAt,
        })

        setOrders((prev) =>
          prev.map((o, idx) =>
            idx === i ? { ...o, status: result.success ? 'success' : 'error', result } : o
          )
        )
      } catch (err) {
        setOrders((prev) =>
          prev.map((o, idx) =>
            idx === i ? { ...o, status: 'error', result: { success: false, error: err.message } } : o
          )
        )
      }
    }
  }

  const allDone = orders.every((o) => o.status === 'success' || o.status === 'error')

  useEffect(() => {
    if (allDone) {
      const timer = setTimeout(() => onNewOrder(), 3000)
      return () => clearTimeout(timer)
    }
  }, [allDone])

  return (
    <div>
      {allDone ? (
        <div className="bg-green-50 border border-green-100 rounded-2xl px-6 py-5 mb-8 flex items-start gap-4">
          <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0 mt-0.5">
            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <div>
            <h2 className="text-lg font-bold text-green-800">Orders Submitted!</h2>
            <p className="text-sm text-green-700 mt-0.5">Your records are on their way. You'll receive delivery confirmation shortly.</p>
          </div>
        </div>
      ) : (
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-navy-800 mb-2">Processing Orders</h2>
          <p className="text-gray-500">Submitting your orders, hang tight...</p>
        </div>
      )}

      <div className="space-y-4">
        {orders.map((order) => (
          <div
            key={order.segmentName}
            className={`bg-white border rounded-2xl p-5 shadow-sm transition ${
              order.status === 'processing'
                ? 'border-navy-300 ring-2 ring-navy-100'
                : 'border-gray-100'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-3">
                {order.status === 'pending' && (
                  <div className="w-6 h-6 rounded-full border-2 border-gray-200" />
                )}
                {order.status === 'processing' && (
                  <div className="w-6 h-6 border-2 border-navy-500 border-t-transparent rounded-full animate-spin" />
                )}
                {order.status === 'success' && (
                  <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center">
                    <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                )}
                {order.status === 'error' && (
                  <div className="w-6 h-6 rounded-full bg-red-500 flex items-center justify-center">
                    <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </div>
                )}
                <h3 className="font-semibold text-gray-900">{order.segmentName}</h3>
              </div>
              <span className="text-sm tabular-nums text-gray-500">
                {order.recordCount.toLocaleString()} records
              </span>
            </div>

            {order.status === 'processing' && (
              <p className="text-sm text-navy-600 ml-9">
                Submitting order...
              </p>
            )}

            {order.status === 'success' && order.result && (
              <div className="bg-green-50 border border-green-100 rounded-xl p-3 text-sm ml-9">
                <p className="text-green-800 font-medium">
                  {order.result.message || 'Order accepted'}
                </p>
              </div>
            )}

            {order.status === 'error' && order.result && (
              <div className="bg-red-50 border border-red-100 rounded-xl p-3 text-sm text-red-600 ml-9">
                {order.result.error || 'An unknown error occurred'}
              </div>
            )}
          </div>
        ))}
      </div>

      {allDone && (
        <div className="mt-8 flex gap-3">
          <button
            onClick={onNewOrder}
            className="flex-1 py-3 bg-navy-600 text-white font-semibold rounded-xl
                       hover:bg-navy-700 transition"
          >
            Place Another Order
          </button>
          <button
            onClick={onReset}
            className="flex-1 py-3 bg-white border border-gray-200 text-gray-700 font-semibold
                       rounded-xl hover:bg-gray-50 transition"
          >
            Switch Account
          </button>
        </div>
      )}
    </div>
  )
}
