export default function SegmentCard({ segment, quantity, onQuantityChange }) {
  const maxRecords = segment.max_records_per_pull
  const activeLeads = segment.active_leads

  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-5 space-y-3 shadow-sm">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="font-semibold text-gray-900">{segment.segment_name}</h3>
          <p className="text-xs text-gray-400 mt-0.5">
            {segment.client_short} / {segment.segment_short}
          </p>
        </div>
        {segment.rate > 0 && (
          <span className="text-xs font-medium bg-gold-400/15 text-navy-700 px-2.5 py-1 rounded-full border border-gold-400/30">
            ${segment.rate.toFixed(2)}/record
          </span>
        )}
      </div>

      {activeLeads != null && (
        <div className="flex items-center gap-2 text-sm text-emerald-600 font-medium">
          <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          {activeLeads.toLocaleString()} people searching in the last 7 days
        </div>
      )}

      <div className="flex items-center gap-4 text-xs text-gray-500">
        <span>{(segment.total_records_delivered || 0).toLocaleString()} delivered</span>
        {segment.last_delivery_date && (
          <span>Last: {segment.last_delivery_date}</span>
        )}
      </div>

      {segment.notes && (
        <p className="text-xs text-gray-400 italic">{segment.notes}</p>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Records to pull</label>
        <input
          type="number"
          min="0"
          max={maxRecords}
          value={quantity || ''}
          onChange={(e) => onQuantityChange(parseInt(e.target.value) || 0)}
          placeholder="0"
          className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-gray-900
                     placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-navy-500
                     focus:border-transparent transition tabular-nums"
        />
        {quantity > maxRecords && (
          <p className="text-xs text-red-500 mt-1">
            Exceeds maximum of {maxRecords.toLocaleString()} per pull
          </p>
        )}
      </div>
    </div>
  )
}
