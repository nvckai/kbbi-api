/**
 * GET /api/check/:word
 * Check if a word is in standard KBBI form
 */

import type { VercelRequest, VercelResponse } from '../../lib/vercel-types';
import { getWordEntry, getNonStandardIndex } from '../../lib/data-loader';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Content-Type', 'application/json');

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
    const hasNonStandard = entry.entri.some(e => e.bentuk_tidak_baku.length > 0);
    return res.status(200).json({
      is_standard: true,
      word: decodedWord,
      non_standard_forms: entry.entri[0]?.bentuk_tidak_baku || [],
    });
  }

  // Check if this word is listed as non-standard in any other entry
  const nonStandardIndex = await getNonStandardIndex();
  const standardForm = nonStandardIndex[decodedWord];

  if (standardForm) {
    return res.status(200).json({
      is_standard: false,
      word: decodedWord,
      standard_form: standardForm,
    });
  }

  return res.status(200).json({
    is_standard: false,
    word: decodedWord,
    exists_in_kbbi: false,
  });
}
