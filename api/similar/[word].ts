/**
 * GET /api/similar/:word
 * Get similar words (typo suggestions) using Levenshtein distance
 */

import { VercelRequest, VercelResponse } from '@vercel/node';
import { levenshteinDistance } from '../../lib/utils';
import { getWordIndex } from '../../lib/data-loader';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Cache-Control', 'public, max-age=3600');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  const { word } = req.query;
  const limit = parseInt((req.query.limit as string) || '5', 10);

  if (!word || typeof word !== 'string') {
    return res.status(400).json({ error: 'Word parameter is required' });
  }

  const decodedWord = decodeURIComponent(word).toLowerCase();
  const wordIndex = await getWordIndex();

  if (wordIndex.length === 0) {
    return res.status(500).json({
      error: 'Word index not found',
      suggestions: [],
    });
  }

  // Calculate Levenshtein distance for all words
  const distances = wordIndex
    .map(w => ({
      word: w,
      distance: levenshteinDistance(decodedWord, w),
    }))
    .filter(d => d.distance > 0 && d.distance <= 3) // Only suggest words within distance 3
    .sort((a, b) => a.distance - b.distance)
    .slice(0, limit);

  return res.status(200).json({
    word: decodedWord,
    suggestions: distances,
  });
}
