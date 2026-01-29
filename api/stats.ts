/**
 * GET /api/stats
 * Get API statistics and documentation
 */

import type { VercelRequest, VercelResponse } from '../lib/vercel-types';
import { getWordIndex } from '../lib/data-loader';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Cache-Control', 'public, max-age=3600');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  const wordIndex = await getWordIndex();
  const wordCount = wordIndex.length;

  return res.status(200).json({
    total_words: wordCount,
    api_version: '2.0.0',
    platform: 'Vercel Serverless Functions',
    endpoints: [
      'GET / - API root',
      'GET /api/lookup/:word - Check if word exists',
      'GET /api/word/:word - Get word details',
      'GET /api/check/:word - Check if word is standard form',
      'GET /api/similar/:word - Get similar words (typo suggestions)',
      'GET /api/search?q=query - Search words',
      'GET /api/stats - API statistics',
    ],
  });
}
