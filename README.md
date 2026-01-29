# KBBI API - Indonesian Dictionary API

Backend API for the KBBI Assistant mobile app, deployed on **Vercel Serverless Functions**.

## Features

- **Word Lookup**: Check if a word exists in KBBI
- **Word Details**: Get complete word information (meanings, word class, etymology, etc.)
- **Non-Standard Check**: Check if a word is in standard form and get suggestions
- **Similar Words**: Get typo suggestions using Levenshtein distance
- **Search**: Search words by prefix or substring
- **Fast Deployment**: Deployed on Vercel's global serverless network
- **CORS Enabled**: Ready for mobile and web apps
- **TypeScript**: Fully typed for better development experience

## API Endpoints

### 1. Check if word exists
```
GET /api/lookup/:word
```

**Example:**
```bash
curl https://your-vercel-app.vercel.app/api/lookup/rumah
```

**Response:**
```json
{
  "exists": true,
  "word": "rumah"
}
```

### 2. Get word details
```
GET /api/word/:word
```

**Example:**
```bash
curl https://your-vercel-app.vercel.app/api/word/rumah
```

**Response:**
```json
{
  "status": "success",
  "data": {
    "pranala": "https://kbbi.kemdikbud.go.id/entri/rumah",
    "entri": [
      {
        "nama": "rumah",
        "kata_dasar": ["rumah"],
        "makna": [...],
        "etimologi": "...",
        ...
      }
    ]
  }
}
```

### 3. Check standard/non-standard form
```
GET /api/check/:word
```

**Example:**
```bash
curl https://your-vercel-app.vercel.app/api/check/rumah
```

**Response:**
```json
{
  "is_standard": true,
  "word": "rumah",
  "non_standard_forms": ["ruma"]
}
```

### 4. Get similar words (typo suggestions)
```
GET /api/similar/:word?limit=5
```

**Example:**
```bash
curl https://your-vercel-app.vercel.app/api/similar/rumh?limit=5
```

**Response:**
```json
{
  "word": "rumh",
  "suggestions": [
    { "word": "rumah", "distance": 1 },
    { "word": "ruma", "distance": 1 }
  ]
}
```

### 5. Search words
```
GET /api/search?q=query&limit=10
```

**Example:**
```bash
curl https://your-vercel-app.vercel.app/api/search?q=rum&limit=10
```

**Response:**
```json
{
  "query": "rum",
  "count": 10,
  "results": ["rumah", "rumania", "rumbia", ...]
}
```

### 6. API Statistics
```
GET /api/stats
```

**Response:**
```json
{
  "total_words": 112651,
  "api_version": "2.0.0",
  "platform": "Vercel Serverless Functions",
  "endpoints": [...]
}
```

## Deployment Guide

### Prerequisites

1. **Vercel Account**: Sign up at [vercel.com](https://vercel.com)
2. **Vercel CLI**: `npm install -g vercel`
3. **Node.js**: Version 18 or higher
4. **GitHub Account** (recommended): For easier deployment

### Step 1: Prepare the Data

Process the KBBI JSON files and create optimized data files:

```bash
npm run prepare-data
```

This will create JSON files in `data/` directory:
- `entries.json` - All dictionary entries
- `word-index.json` - Complete word list
- `non-standard-index.json` - Non-standard word mappings

### Step 2: Install Dependencies

```bash
npm install
```

### Step 3: Test Locally

```bash
npm run dev
```

The API will be available at `http://localhost:3000`

Test the endpoints:
```bash
curl http://localhost:3000/api/stats
```

### Step 4: Deploy to Vercel

#### Option A: Using Vercel CLI (Fastest)

```bash
vercel deploy --prod
```

You'll be prompted to:
1. Confirm project settings
2. Link to a Vercel project (or create new)
3. Set project name

Your API will be deployed to: `https://kbbi-api.vercel.app` (or your custom domain)

#### Option B: Using GitHub (Recommended)

1. Push your code to GitHub:
```bash
git add .
git commit -m "Convert to Vercel deployment"
git push origin main
```

2. Go to [vercel.com/new](https://vercel.com/new)
3. Import your GitHub repository
4. Vercel will auto-detect the configuration and deploy
5. Set up automatic deployments on push

#### Option C: Using Vercel Dashboard

1. Go to [vercel.com/dashboard](https://vercel.com/dashboard)
2. Click "New Project"
3. Import your GitHub/GitLab/Bitbucket repository
4. Configure and deploy

### Step 5: Set Environment Variables (Optional)

If needed, set environment variables in Vercel:

```bash
vercel env add ENVIRONMENT production
```

Or via Vercel Dashboard:
1. Settings → Environment Variables
2. Add `ENVIRONMENT = production`

## Project Structure

```
kbbi-api/
├── api/                    # Vercel API routes
│   ├── index.ts           # Root endpoint
│   ├── lookup/[word].ts   # Word lookup endpoint
│   ├── word/[word].ts     # Word details endpoint
│   ├── check/[word].ts    # Standard form check
│   ├── similar/[word].ts  # Similar words endpoint
│   ├── search.ts          # Search endpoint
│   └── stats.ts           # API stats endpoint
├── lib/                    # Shared utilities
│   ├── utils.ts           # Common utilities
│   └── data-loader.ts     # Data loading logic
├── data/                   # Generated data files (created by prepare-data)
│   ├── entries.json
│   ├── word-index.json
│   └── non-standard-index.json
├── scripts/
│   └── prepare-data-vercel.js  # Data preparation script
├── package.json           # Dependencies
├── tsconfig.json          # TypeScript configuration
├── vercel.json            # Vercel configuration
└── README.md             # This file
```

## Performance Optimization

- **Serverless**: Auto-scales based on traffic
- **Edge Caching**: Responses cached with appropriate `Cache-Control` headers
- **Fast Data Loading**: In-memory caching of dictionary data
- **CORS**: Pre-configured for cross-origin requests
- **TypeScript**: Type-safe code for better reliability

## Usage in React Native App

```javascript
const KBBI_API_URL = 'https://your-vercel-app.vercel.app';

// Check if word exists
async function checkWord(word) {
  const response = await fetch(`${KBBI_API_URL}/api/lookup/${word}`);
  return response.json();
}

// Get word details
async function getWordDetails(word) {
  const response = await fetch(`${KBBI_API_URL}/api/word/${word}`);
  return response.json();
}

// Get typo suggestions
async function getSuggestions(word) {
  const response = await fetch(`${KBBI_API_URL}/api/similar/${word}?limit=5`);
  return response.json();
}

// Search words
async function searchWords(query) {
  const response = await fetch(`${KBBI_API_URL}/api/search?q=${query}&limit=10`);
  return response.json();
}
```

## Monitoring and Logging

View deployment logs:

```bash
vercel logs <project-name>
```

Or via Vercel Dashboard:
1. Go to your project
2. Click "Deployments" tab
3. Select a deployment to view logs

## Scaling Considerations

**Free Plan Limits:**
- 100,000 invocations/month
- 50 GB-hours/month
- 100 concurrent connections

**For larger scale, upgrade to:**
- **Pro Plan**: $20/month, unlimited invocations
- **Enterprise**: Custom limits

## Database Options (For Future Enhancement)

If you need to scale beyond file-based storage:

1. **Vercel KV** (Redis): Perfect for caching
2. **PostgreSQL**: For complex queries
3. **MongoDB**: For document storage
4. **Supabase**: PostgreSQL with real-time capabilities

## Cost Estimate

- **Free Plan**: Sufficient for development and low traffic
- **Pro Plan** ($20/month): Good for production with moderate traffic
- **Data storage**: Minimal (JSON files < 100MB)

## Data Source

KBBI dataset from: [kbbi-dataset-kbbi-v-main](https://github.com/damzaky/kumpulan-kata-bahasa-indonesia-KBBI)

**Copyright:** All data is owned by Badan Pengembangan dan Pembinaan Bahasa, Kementerian Pendidikan, Kebudayaan, Riset, dan Teknologi Republik Indonesia.

**License:** Non-commercial use only. See dataset README for details.

## Troubleshooting

### Build Fails
- Ensure Node.js 18+ is installed: `node --version`
- Clear node_modules: `rm -rf node_modules && npm install`
- Check TypeScript errors: `npx tsc --noEmit`

### Data Not Found
- Run prepare-data script: `npm run prepare-data`
- Verify data files exist in `data/` directory
- Check file permissions

### Deployment Issues
- Ensure vercel.json is valid JSON
- Check all dependencies in package.json
- View logs: `vercel logs <project-name>`

## API Comparison: Cloudflare vs Vercel

| Feature | Cloudflare Workers | Vercel Functions |
|---------|-------------------|------------------|
| Startup Time | < 1ms | ~ 100ms |
| Global Network | Yes (Edge) | Yes (Data Centers) |
| Free Tier | Generous | 100k invocations |
| Cost | Pay-per-request | Monthly plan |
| Cold Start | Minimal | Higher |
| Best For | Low latency, global | Rapid development, scaling |

Choose **Vercel** if you prefer:
- Simpler setup and deployment
- GitHub integration
- Pay-as-you-go or monthly pricing
- Node.js ecosystem

## Next Steps

After deployment:
1. Test all endpoints with real data
2. Integrate with React Native app
3. Monitor usage in Vercel Dashboard
4. Consider adding rate limiting middleware
5. Set up custom domain (optional)

## Support

For issues or questions:
- [Vercel Docs](https://vercel.com/docs)
- [Vercel Support](https://vercel.com/support)
- [Node.js Docs](https://nodejs.org/docs/)

