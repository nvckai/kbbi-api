/**
 * GET /api
 * Root API endpoint with API information
 */

import { VercelRequest, VercelResponse } from '@vercel/node';
import { corsHeaders, createResponse } from '../lib/utils';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    res.status(200).setHeader('Access-Control-Allow-Origin', '*').end();
    return;
  }

  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Content-Type', 'application/json');

  const response = {
    message: 'KBBI API - Indonesian Dictionary API',
    version: '2.0.0',
    platform: 'Vercel',
    documentation: '/api/stats',
    endpoints: {
      lookup: 'GET /api/lookup/:word',
      word: 'GET /api/word/:word',
      check: 'GET /api/check/:word',
      similar: 'GET /api/similar/:word',
      search: 'GET /api/search?q=query',
      stats: 'GET /api/stats',
    },
  };

  res.status(200).json(response);
}
