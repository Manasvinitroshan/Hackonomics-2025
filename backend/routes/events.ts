import express from 'express';
import { getJson, config } from 'serpapi';

config.api_key = process.env.SERPAPI_KEY!;

const router = express.Router();

/**
 * GET /api/events?q=...&location=...
 */
router.get('/', async (req, res) => {
  const q = String(req.query.q || '');
  const location = String(req.query.location || '');

  if (!q || !location) {
    return res
      .status(400)
      .json({ error: 'Missing required query parameters: q and location' });
  }

  try {
    const response = await getJson({
      engine: 'google_events',
      q,
      location,
    });
    const events = response.events_results || [];
    res.json(events);
  } catch (err) {
    console.error('⚠️ /api/events error', err);
    res.status(500).json({ error: 'Failed to fetch events' });
  }
});

export default router;
