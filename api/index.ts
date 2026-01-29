/**
 * GET /api
 * Root API endpoint with API information
 */

import type { VercelRequest, VercelResponse } from '../lib/vercel-types';
import { corsHeaders, createResponse } from '../lib/utils';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    res.status(200).setHeader('Access-Control-Allow-Origin', '*').end();
    return;
  }

  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Cache-Control', 'public, max-age=3600');

  const response = {
    name: 'KBBI API - Indonesian Dictionary API',
    version: '2.0.0',
    platform: 'Vercel Serverless Functions',
    description: 'Indonesian dictionary API with word lookup, search, and typo suggestions',
    documentation: 'https://github.com/baguskto/kbbi-api',
    endpoints: [
      {
        name: 'Check if word exists',
        method: 'GET',
        path: '/api/lookup/:word',
        example: '/api/lookup/rumah',
        description: 'Check if a word exists in KBBI dictionary'
      },
      {
        name: 'Get word details',
        method: 'GET',
        path: '/api/word/:word',
        example: '/api/word/rumah',
        description: 'Get complete word information (meanings, examples, etymology)'
      },
      {
        name: 'Check standard form',
        method: 'GET',
        path: '/api/check/:word',
        example: '/api/check/rumah',
        description: 'Check if word is standard form and get non-standard variants'
      },
      {
        name: 'Get similar words',
        method: 'GET',
        path: '/api/similar/:word',
        example: '/api/similar/rumh?limit=5',
        description: 'Get typo suggestions using Levenshtein distance'
      },
      {
        name: 'Search words',
        method: 'GET',
        path: '/api/search',
        example: '/api/search?q=rum&limit=10',
        description: 'Search words by prefix or substring',
        parameters: {
          q: 'search query (required)',
          limit: 'number of results (default: 10)'
        }
      },
      {
        name: 'API Statistics',
        method: 'GET',
        path: '/api/stats',
        example: '/api/stats',
        description: 'Get API statistics and available endpoints'
      }
    ],
    quick_examples: {
      lookup: 'curl https://kbbi-id.vercel.app/api/lookup/sayang',
      word_details: 'curl https://kbbi-id.vercel.app/api/word/sayang',
      search: 'curl https://kbbi-id.vercel.app/api/search?q=saya&limit=5',
      similar: 'curl https://kbbi-id.vercel.app/api/similar/saeng?limit=5',
      stats: 'curl https://kbbi-id.vercel.app/api/stats'
    },
    features: [
      '112,542+ Indonesian dictionary entries',
      'Fast word lookup and search',
      'Typo suggestions with Levenshtein distance',
      'Standard/non-standard word detection',
      'Complete word information with meanings and examples',
      'CORS enabled for web/mobile apps',
      'Global Vercel edge network',
      'Cache-optimized responses'
    ]
  };

  res.status(200).json(response);
}
