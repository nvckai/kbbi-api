/**
 * Script untuk mengubah KBBI JSON dataset menjadi format yang optimized untuk Vercel
 * Run: node scripts/prepare-data-vercel.js
 */

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '../kbbi-dataset-kbbi-v-main/json');
const OUTPUT_DIR = path.join(__dirname, '../data');

// Ensure output directory exists
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

async function prepareData() {
  try {
    console.log('Starting data preparation...');

    const allEntries = {};
    const wordIndex = [];
    const nonStandardIndex = {};

    // Read all JSON files
    const files = fs.readdirSync(DATA_DIR).filter(f => f.endsWith('.json'));
    console.log(`Found ${files.length} JSON files to process`);

    for (const file of files) {
      const filePath = path.join(DATA_DIR, file);
      console.log(`Processing ${file}...`);

      const content = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
      const entries = Array.isArray(content) ? content : content.data || [];

      for (const entry of entries) {
        if (entry.entri && Array.isArray(entry.entri)) {
          for (const wordEntry of entry.entri) {
            const word = wordEntry.nama.toLowerCase();
            allEntries[word] = entry;
            wordIndex.push(word);

            // Build non-standard index
            if (wordEntry.bentuk_tidak_baku) {
              for (const nonStandard of wordEntry.bentuk_tidak_baku) {
                nonStandardIndex[nonStandard.toLowerCase()] = word;
              }
            }
          }
        }
      }
    }

    // Remove duplicates from word index
    const uniqueWords = [...new Set(wordIndex)];
    console.log(`Found ${uniqueWords.length} unique words`);

    // Save data
    fs.writeFileSync(
      path.join(OUTPUT_DIR, 'entries.json'),
      JSON.stringify(allEntries),
      'utf-8'
    );
    console.log('✓ Saved entries.json');

    fs.writeFileSync(
      path.join(OUTPUT_DIR, 'word-index.json'),
      JSON.stringify(uniqueWords),
      'utf-8'
    );
    console.log('✓ Saved word-index.json');

    fs.writeFileSync(
      path.join(OUTPUT_DIR, 'non-standard-index.json'),
      JSON.stringify(nonStandardIndex),
      'utf-8'
    );
    console.log('✓ Saved non-standard-index.json');

    console.log('\nData preparation completed!');
    console.log(`Total entries: ${uniqueWords.length}`);
  } catch (error) {
    console.error('Error preparing data:', error);
    process.exit(1);
  }
}

prepareData();
