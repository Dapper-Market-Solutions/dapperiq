import { useState } from 'react'
import SegmentCard from './SegmentCard'

const TERMS = [
  {
    title: 'Intended Use',
    text: 'The data provided through DapperIQ\u2122 is intended for cold email outreach, cold outbound marketing, direct mail campaigns, and use in advertising platforms. These records are not intended for use as telemarketing leads or phone-based solicitation.',
  },
  {
    title: 'Compliance Responsibility',
    text: 'You are solely responsible for ensuring that your use of the data complies with all applicable federal, state, and local laws and regulations, including but not limited to the CAN-SPAM Act, the Telephone Consumer Protection Act (TCPA), and any state-specific data privacy laws.',
  },
  {
    title: 'Do Not Call (DNC) Compliance',
    text: 'If you choose to contact any individuals by phone, you agree to scrub all records against the National Do Not Call Registry and any applicable state DNC lists prior to making any calls.',
  },
  {
    title: 'No Liability',
    text: 'Dapper Market Solutions LLC provides high-intent consumer data as a service. We make no guarantees regarding deliverability, response rates, or conversion. We assume no liability for your misuse of the data or any failure to comply with applicable laws and regulations.',
  },
  {
    title: 'Data Handling',
    text: 'You agree to handle all delivered records in accordance with industry-standard data security practices and to not resell, redistribute, or share the data with unauthorized third parties.',
  },
]

export default function OrderForm({ config, onSubmit, onBack }) {
  const [quantities, setQuantities] = useState(
    Object.fromEntries(config.segments.map((s) => [s.segment_name, 0]))
  )
  const [showTerms, setShowTerms] = useState(false)
  const [showAuth, setShowAuth] = useState(false)
  const [agreed, setAgreed] = useState(false)

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
    setAgreed(false)
    setShowTerms(true)
  }

  function handleConfirmTerms() {
    setShowTerms(false)
    setShowAuth(true)
  }

  function handleAuthorize() {
    setShowAuth(false)
    const termsAgreedAt = new Date().toISOString()
    const orderList = activeOrders.map((o) => ({
      segmentName: o.segmentName,
      recordCount: o.recordCount,
      termsAgreedAt,
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

      {showTerms && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] flex flex-col">
            <div className="px-6 pt-6 pb-4 border-b border-gray-100">
              <h3 className="text-lg font-bold text-navy-800">Data Usage &amp; Compliance Agreement</h3>
              <p className="text-sm text-gray-500 mt-1">Please review and accept before placing your order.</p>
            </div>

            <div className="px-6 py-4 overflow-y-auto flex-1 space-y-4">
              {TERMS.map((term, i) => (
                <div key={i}>
                  <h4 className="text-sm font-semibold text-navy-700">{i + 1}. {term.title}</h4>
                  <p className="text-sm text-gray-600 mt-1 leading-relaxed">{term.text}</p>
                </div>
              ))}
            </div>

            <div className="px-6 pb-6 pt-4 border-t border-gray-100 space-y-4">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={agreed}
                  onChange={(e) => setAgreed(e.target.checked)}
                  className="mt-0.5 h-4 w-4 rounded border-gray-300 text-navy-600 focus:ring-navy-500"
                />
                <span className="text-sm text-gray-700">
                  I have read and agree to the Data Usage &amp; Compliance Agreement.
                </span>
              </label>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowTerms(false)}
                  className="flex-1 py-2.5 border border-gray-200 text-gray-600 font-medium rounded-xl
                             hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmTerms}
                  disabled={!agreed}
                  className="flex-1 py-2.5 bg-navy-600 text-white font-semibold rounded-xl
                             hover:bg-navy-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
                >
                  Continue
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {showAuth && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full">
            <div className="px-6 pt-6 pb-4 border-b border-gray-100">
              <h3 className="text-lg font-bold text-navy-800">Payment Authorization</h3>
            </div>

            <div className="px-6 py-6 space-y-4">
              <p className="text-sm text-gray-700 leading-relaxed">
                By clicking <strong>Authorize</strong>, you authorize <strong>Dapper Market Solutions LLC</strong> to
                charge your payment method on file for this order.
              </p>

              {estimatedCost > 0 && (
                <div className="bg-navy-50 border border-navy-100 rounded-xl p-4 space-y-1">
                  {activeOrders.map((o) => (
                    <div key={o.segmentName} className="flex justify-between text-sm text-navy-700">
                      <span>{o.segmentName}</span>
                      <span className="tabular-nums">{o.recordCount.toLocaleString()} records</span>
                    </div>
                  ))}
                  <div className="flex justify-between text-sm font-semibold text-navy-800 pt-2 border-t border-navy-200">
                    <span>Total</span>
                    <span>${estimatedCost.toFixed(2)}</span>
                  </div>
                </div>
              )}
            </div>

            <div className="px-6 pb-6 flex gap-3">
              <button
                onClick={() => setShowAuth(false)}
                className="flex-1 py-2.5 border border-gray-200 text-gray-600 font-medium rounded-xl
                           hover:bg-gray-50 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleAuthorize}
                className="flex-1 py-2.5 bg-navy-600 text-white font-semibold rounded-xl
                           hover:bg-navy-700 transition"
              >
                Authorize
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
