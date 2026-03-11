const AL_URL = 'https://api.audiencelab.io';
const AL_KEY = process.env.AUDIENCELAB_API_KEY;
const PAGE_SIZES = [500, 200, 50, 20, 10];
const SAMPLE_PAGES = 5;

async function fetchPage(audienceId, page, pageSize) {
  const url = `${AL_URL}/audiences/${audienceId}?page=${page}&page_size=${pageSize}`;
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 12000);
  try {
    return await fetch(url, {
      headers: { 'X-Api-Key': AL_KEY, 'Accept': 'application/json' },
      signal: controller.signal,
    });
  } catch (err) {
    if (err.name === 'AbortError') {
      return { ok: false, status: 408 };
    }
    throw err;
  } finally {
    clearTimeout(timeout);
  }
}

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
    let workingPageSize = PAGE_SIZES[0];

    // Find a page size that works (some audiences have huge records)
    for (const size of PAGE_SIZES) {
      const testResp = await fetchPage(audienceId, 1, size);
      if (testResp.ok) {
        workingPageSize = size;
        const data = await testResp.json();
        const records = data.data || [];
        totalRecords = data.total_records || 0;
        totalPages = data.total_pages || 1;

        for (const record of records) {
          if ((record[stateField] || '').toUpperCase() === stateUpper) {
            stateHits++;
          }
        }
        recordsSampled += records.length;
        break;
      }
    }

    if (recordsSampled === 0) {
      return res.status(502).json({ error: 'Unable to fetch audience data' });
    }

    // Sample more pages if needed
    for (let page = 2; page <= SAMPLE_PAGES && page <= totalPages; page++) {
      const resp = await fetchPage(audienceId, page, workingPageSize);
      if (!resp.ok) break;

      const data = await resp.json();
      const records = data.data || [];

      for (const record of records) {
        if ((record[stateField] || '').toUpperCase() === stateUpper) {
          stateHits++;
        }
      }
      recordsSampled += records.length;
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
