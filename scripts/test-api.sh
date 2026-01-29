#!/bin/bash

# KBBI API Testing Script
# Usage: bash scripts/test-api.sh [local|production]

TARGET=${1:-local}

if [ "$TARGET" = "local" ]; then
  BASE_URL="http://localhost:3000"
  echo "🧪 Testing Local API at $BASE_URL"
elif [ "$TARGET" = "production" ]; then
  read -p "Enter Vercel deployment URL (e.g., https://kbbi-api.vercel.app): " BASE_URL
  echo "🧪 Testing Production API at $BASE_URL"
else
  echo "Usage: bash scripts/test-api.sh [local|production]"
  exit 1
fi

echo ""
echo "==================== API TESTS ===================="
echo ""

# Test 1: Root endpoint
echo "1️⃣  Testing GET /"
curl -s "$BASE_URL/" | jq . || echo "❌ Failed"
echo ""

# Test 2: Stats endpoint
echo "2️⃣  Testing GET /api/stats"
curl -s "$BASE_URL/api/stats" | jq . || echo "❌ Failed"
echo ""

# Test 3: Lookup endpoint
echo "3️⃣  Testing GET /api/lookup/rumah"
curl -s "$BASE_URL/api/lookup/rumah" | jq . || echo "❌ Failed"
echo ""

# Test 4: Word details
echo "4️⃣  Testing GET /api/word/rumah"
curl -s "$BASE_URL/api/word/rumah" | jq '.' | head -20 || echo "❌ Failed"
echo ""

# Test 5: Search
echo "5️⃣  Testing GET /api/search?q=rum&limit=5"
curl -s "$BASE_URL/api/search?q=rum&limit=5" | jq . || echo "❌ Failed"
echo ""

# Test 6: Non-existent word
echo "6️⃣  Testing GET /api/lookup/xyzabc (non-existent)"
curl -s "$BASE_URL/api/lookup/xyzabc" | jq . || echo "❌ Failed"
echo ""

# Test 7: Similar words
echo "7️⃣  Testing GET /api/similar/rum?limit=5"
curl -s "$BASE_URL/api/similar/rum?limit=3" | jq . || echo "❌ Failed"
echo ""

# Test 8: Check standard form
echo "8️⃣  Testing GET /api/check/rumah"
curl -s "$BASE_URL/api/check/rumah" | jq . || echo "❌ Failed"
echo ""

echo "==================== TESTS COMPLETE ===================="
echo ""
echo "✅ All endpoints tested!"
echo ""
echo "💡 Tips:"
echo "   - If responses are empty, run: npm run prepare-data"
echo "   - Check Vercel logs: vercel logs <project-name>"
echo "   - Local testing: npm run dev"
