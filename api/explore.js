const AL_URL = 'https://api.audiencelab.io';
const AL_KEY = process.env.AUDIENCELAB_API_KEY;
const SAMPLE_SIZE = 1000;
const SAMPLE_PAGES = 3;

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
    let stateHits = 0;
    let recordsSampled = 0;
    let totalRecords = 0;
    let totalPages = 1;

    // Sample up to SAMPLE_PAGES pages to estimate the ratio
    for (let page = 1; page <= SAMPLE_PAGES; page++) {
      const url = `${AL_URL}/audiences/${audienceId}?page=${page}&page_size=${SAMPLE_SIZE}`;
      const resp = await fetch(url, {
        headers: { 'X-Api-Key': AL_KEY, 'Accept': 'application/json' },
      });

      if (!resp.ok) {
        const errText = await resp.text();
        return res.status(resp.status).json({ error: `API error: ${errText}` });
      }

      const data = await resp.json();
      const records = data.data || [];

      if (page === 1) {
        totalRecords = data.total_records || 0;
        totalPages = data.total_pages || 1;
      }

      for (const record of records) {
        if ((record[stateField] || '').toUpperCase() === stateUpper) {
          stateHits++;
        }
      }

      recordsSampled += records.length;

      // If we've seen all pages, no need to continue
      if (page >= totalPages) break;
    }

    // If we sampled everything, use exact count. Otherwise, estimate.
    let count;
    if (recordsSampled >= totalRecords) {
      count = stateHits;
    } else {
      const ratio = stateHits / recordsSampled;
      count = Math.round(ratio * totalRecords);
    }

    return res.status(200).json({
      audienceId,
      state: stateUpper,
      count,
      totalNational: totalRecords,
      sampled: recordsSampled < totalRecords,
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
