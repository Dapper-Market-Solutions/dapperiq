const AL_URL = 'https://api.audiencelab.io';
const AL_KEY = process.env.AUDIENCELAB_API_KEY;
const PAGE_SIZE = 1000;

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { audienceId, state, stateField = 'PERSONAL_STATE' } = req.body || {};

  if (!audienceId || !state) {
    return res.status(400).json({ error: 'audienceId and state are required' });
  }

  if (!AL_KEY) {
    return res.status(500).json({ error: 'API key not configured' });
  }

  try {
    const stateUpper = state.toUpperCase();
    let totalForState = 0;
    let totalRecords = 0;
    let page = 1;
    let hasMore = true;

    while (hasMore) {
      const url = `${AL_URL}/audiences/${audienceId}?page=${page}&page_size=${PAGE_SIZE}`;
      const resp = await fetch(url, {
        headers: { 'X-Api-Key': AL_KEY, 'Accept': 'application/json' },
      });

      if (!resp.ok) {
        const errText = await resp.text();
        return res.status(resp.status).json({ error: `AudienceLab API error: ${errText}` });
      }

      const data = await resp.json();
      const records = data.data || [];

      if (page === 1) {
        totalRecords = data.total_records || 0;
      }

      for (const record of records) {
        const recState = (record[stateField] || '').toUpperCase();
        if (recState === stateUpper) {
          totalForState++;
        }
      }

      if (records.length < PAGE_SIZE || page >= (data.total_pages || 1)) {
        hasMore = false;
      } else {
        page++;
      }
    }

    return res.status(200).json({
      audienceId,
      state: stateUpper,
      count: totalForState,
      totalNational: totalRecords,
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
