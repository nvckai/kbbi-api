/**
 * GET /api/search?q=query
 * Search for words in KBBI
 */

import type { VercelRequest, VercelResponse } from '../lib/vercel-types';
import { getWordIndex } from '../lib/data-loader';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Cache-Control', 'public, max-age=600');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  const query = req.query.q as string;
  const limit = parseInt((req.query.limit as string) || '10', 10);

  if (!query) {
    return res.status(400).json({ error: 'Query parameter (q) is required' });
  }

  const searchQuery = query.toLowerCase();
  const wordIndex = await getWordIndex();

  if (wordIndex.length === 0) {
    return res.status(500).json({
      error: 'Word index not found',
      results: [],
    });
  }

  // Search for words that start with or contain the query
  const results = wordIndex
    .filter(w => w.includes(searchQuery))
    .sort((a, b) => {
      // Prioritize words that start with the query
      const aStarts = a.startsWith(searchQuery);
      const bStarts = b.startsWith(searchQuery);
      if (aStarts && !bStarts) return -1;
      if (!aStarts && bStarts) return 1;
      return a.localeCompare(b);
    })
    .slice(0, limit);

  return res.status(200).json({
    query: searchQuery,
    count: results.length,
    results,
  });
}
