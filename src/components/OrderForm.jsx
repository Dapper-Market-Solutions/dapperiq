import { useState } from 'react'
import SegmentCard from './SegmentCard'

export default function OrderForm({ config, onSubmit, onBack }) {
  const [quantities, setQuantities] = useState(
    Object.fromEntries(config.segments.map((s) => [s.segment_name, 0]))
  )
  const [extraEmail, setExtraEmail] = useState('')

  function updateQuantity(segmentName, value) {
    setQuantities((prev) => ({ ...prev, [segmentName]: value }))
  }

  const activeOrders = config.segments
    .filter((s) => (quantities[s.segment_name] || 0) > 0)
    .map((s) => ({
      segmentName: s.segment_name,
      recordCount: quantities[s.segment_name],
      maxRecords: s.max_records_per_pull,
      rate: s.rate || 0,
    }))

  const hasValidOrders = activeOrders.length > 0 &&
    activeOrders.every((o) => o.recordCount > 0 && o.recordCount <= o.maxRecords)

  const estimatedCost = activeOrders.reduce((sum, o) => sum + o.recordCount * o.rate, 0)

  function handleSubmit(e) {
    e.preventDefault()
    const orderList = activeOrders.map((o) => ({
      segmentName: o.segmentName,
      recordCount: o.recordCount,
      destinationEmail: extraEmail.trim(),
      status: 'pending',
      result: null,
    }))
    onSubmit(orderList)
  }

  return (
    <div>
      <div className="mb-8">
        <button onClick={onBack} className="text-sm text-navy-600 hover:text-navy-800 transition mb-4 flex items-center gap-1">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          Switch account
        </button>
        <h2 className="text-2xl font-bold text-navy-800">Place an Order</h2>
        <p className="text-gray-500 mt-1">
          Select how many records to pull from each segment.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {config.segments.map((segment) => (
          <SegmentCard
            key={segment.segment_name}
            segment={segment}
            quantity={quantities[segment.segment_name]}
            onQuantityChange={(val) => updateQuantity(segment.segment_name, val)}
          />
        ))}

        <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Additional delivery email <span className="text-gray-400">(optional)</span>
          </label>
          <input
            type="email"
            value={extraEmail}
            onChange={(e) => setExtraEmail(e.target.value)}
            placeholder="colleague@company.com"
            className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-gray-900
                       placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-navy-500
                       focus:border-transparent transition"
          />
          <p className="text-xs text-gray-400 mt-1">
            The download link will also be sent to this address.
          </p>
        </div>

        {activeOrders.length > 0 && (
          <div className="bg-navy-50 border border-navy-100 rounded-2xl p-5 space-y-2">
            <h4 className="text-sm font-semibold text-navy-800">Order Summary</h4>
            {activeOrders.map((o) => (
              <div key={o.segmentName} className="flex justify-between text-sm text-navy-700">
                <span>{o.segmentName}</span>
                <span className="tabular-nums font-medium">{o.recordCount.toLocaleString()} records</span>
              </div>
            ))}
            {estimatedCost > 0 && (
              <div className="flex justify-between text-sm font-semibold text-navy-800 pt-2 border-t border-navy-200">
                <span>Estimated cost</span>
                <span>${estimatedCost.toFixed(2)}</span>
              </div>
            )}
          </div>
        )}

        <button
          type="submit"
          disabled={!hasValidOrders}
          className="w-full py-3 bg-navy-600 text-white font-semibold rounded-xl
                     hover:bg-navy-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
        >
          {hasValidOrders
            ? `Place Order (${activeOrders.length} segment${activeOrders.length !== 1 ? 's' : ''})`
            : 'Select records to order'}
        </button>
      </form>
    </div>
  )
}
