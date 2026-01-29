/**
 * GET /api/lookup/:word
 * Check if a word exists in KBBI
 */

import type { VercelRequest, VercelResponse } from '../../lib/vercel-types';
import { getWordEntry } from '../../lib/data-loader';

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

  if (!word || typeof word !== 'string') {
    return res.status(400).json({ error: 'Word parameter is required' });
  }

  const decodedWord = decodeURIComponent(word).toLowerCase();
  const entry = await getWordEntry(decodedWord);

  if (entry) {
    return res.status(200).json({
      exists: true,
      word: decodedWord,
    });
  }

  return res.status(200).json({
    exists: false,
    word: decodedWord,
  });
}
