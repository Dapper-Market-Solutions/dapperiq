export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const webhookUrl = process.env.WEBHOOK_URL
  if (!webhookUrl) {
    return res.status(500).json({ error: 'Server misconfigured' })
  }

  const body = { ...req.body }
  const webhookSecret = process.env.WEBHOOK_SECRET
  if (webhookSecret) {
    body._webhook_secret = webhookSecret
  }

  try {
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })

    const data = await response.json()
    return res.status(response.status).json(data)
  } catch (err) {
    return res.status(502).json({ error: 'Upstream service unavailable' })
  }
}
