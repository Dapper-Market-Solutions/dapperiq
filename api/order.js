export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const webhookUrl = process.env.N8N_WEBHOOK_URL
  if (!webhookUrl) {
    return res.status(500).json({ error: 'Server misconfigured' })
  }

  const webhookSecret = process.env.N8N_WEBHOOK_SECRET
  const headers = { 'Content-Type': 'application/json' }
  if (webhookSecret) {
    headers['X-Webhook-Secret'] = webhookSecret
  }

  try {
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers,
      body: JSON.stringify(req.body),
    })

    const data = await response.json()
    return res.status(response.status).json(data)
  } catch (err) {
    return res.status(502).json({ error: 'Upstream service unavailable' })
  }
}
