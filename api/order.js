export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const clientId = (req.body.client_id || '').trim().toLowerCase()

  // Per-client routing: CLIENT_ROUTES = {"dms2026":{"url":"...","secret":"..."}}
  let routes = {}
  try { routes = JSON.parse(process.env.CLIENT_ROUTES || '{}') } catch {}

  const route = routes[clientId]
  const webhookUrl = route?.url || process.env.WEBHOOKURL
  const webhookSecret = route?.secret || process.env.WEBHOOKSECRET

  if (!webhookUrl) {
    return res.status(400).json({ error: 'Unknown client' })
  }

  const body = { ...req.body }
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
