export async function getClientConfig(clientId) {
  const res = await fetch('/api/order', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ mode: 'config', client_id: clientId }),
  })
  if (!res.ok) throw new Error(`Config lookup failed: ${res.status}`)
  const data = await res.json()
  if (!data.success) throw new Error(data.error || 'Unknown error')
  return data
}

export async function submitOrder({ clientId, segmentName, recordCount, destinationEmail }) {
  const res = await fetch('/api/order', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      client_id: clientId,
      segment_name: segmentName,
      record_count: recordCount,
      destination_email: destinationEmail || '',
    }),
  })
  if (!res.ok) throw new Error(`Order failed: ${res.status}`)
  return res.json()
}
