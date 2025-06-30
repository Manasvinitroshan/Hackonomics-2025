// backend/routes/news.ts
import express from 'express';
import axios from 'axios';

const router = express.Router();
const NEWSAPI_KEY = '2e0e858439634e1c9cb86522f263c399';

/**
 * GET /api/news/finance?limit=3
 * Returns the top `limit` finance-focused articles from premium outlets.
 */
router.get('/finance', async (req, res) => {
  const limit = parseInt(req.query.limit as string, 10) || 5;  // default to 5
  try {
    const response = await axios.get('https://newsapi.org/v2/everything', {
      params: {
        // finance-focused keywords
        q: 'finance OR markets OR economy OR investing',
        // only from top finance sites
        domains: [
          'bloomberg.com',
          'ft.com',
          'reuters.com',
          'wsj.com',
          'cnbc.com',
          'marketwatch.com'
        ].join(','),
        language: 'en',
        sortBy: 'publishedAt',
        pageSize: limit,
        apiKey: NEWSAPI_KEY,
      },
    });

    const articles = (response.data.articles as any[]).map(a => ({
      title:  a.title,
      url:    a.url,
      source: a.source?.name || 'Unknown',
    }));

    res.json(articles);
  } catch (err) {
    console.error('NewsAPI error:', err.message);
    res.status(502).json({ error: 'Failed to fetch financial news' });
  }
});

export default router;
