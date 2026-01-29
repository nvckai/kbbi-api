/**
 * Data loader for KBBI entries
 * Loads data from generated JSON files
 * For production, consider using Vercel KV or a database
 */

import { KBBIEntry } from './utils';
import fs from 'fs';
import path from 'path';

let cachedData: Map<string, KBBIEntry> = new Map();
let cachedWordIndex: string[] = [];
let cachedNonStandardIndex: Record<string, string> = {};

const DATA_DIR = path.join(process.cwd(), 'data');

// Load data from JSON files
async function loadData(): Promise<Map<string, KBBIEntry>> {
  if (cachedData.size > 0) {
    return cachedData;
  }

  try {
    const entriesPath = path.join(DATA_DIR, 'entries.json');
    
    // Check if data files exist
    if (!fs.existsSync(entriesPath)) {
      console.warn('Data files not found. Please run: npm run prepare-data');
      return cachedData;
    }

    // Load entries
    const entriesData = JSON.parse(fs.readFileSync(entriesPath, 'utf-8'));
    
    for (const [word, entry] of Object.entries(entriesData)) {
      cachedData.set(word, entry as KBBIEntry);
    }

    console.log(`Loaded ${cachedData.size} KBBI entries`);
    return cachedData;
  } catch (error) {
    console.error('Error loading data:', error);
    return cachedData;
  }
}

export async function getWordEntry(word: string): Promise<KBBIEntry | null> {
  const data = await loadData();
  const normalized = word.toLowerCase();
  return data.get(normalized) || null;
}

export async function getWordIndex(): Promise<string[]> {
  if (cachedWordIndex.length > 0) {
    return cachedWordIndex;
  }

  try {
    const indexPath = path.join(DATA_DIR, 'word-index.json');
    
    if (!fs.existsSync(indexPath)) {
      console.warn('Word index not found. Please run: npm run prepare-data');
      return [];
    }

    const parsed = JSON.parse(fs.readFileSync(indexPath, 'utf-8')) as string[];
    cachedWordIndex = Array.isArray(parsed) ? parsed : [];
    return cachedWordIndex;
  } catch (error) {
    console.error('Error loading word index:', error);
    return [];
  }
}

export async function getNonStandardIndex(): Promise<Record<string, string>> {
  if (Object.keys(cachedNonStandardIndex).length > 0) {
    return cachedNonStandardIndex;
  }

  try {
    const indexPath = path.join(DATA_DIR, 'non-standard-index.json');
    
    if (!fs.existsSync(indexPath)) {
      console.warn('Non-standard index not found. Please run: npm run prepare-data');
      return {};
    }

    const parsed = JSON.parse(fs.readFileSync(indexPath, 'utf-8')) as Record<string, string>;
    cachedNonStandardIndex = parsed && typeof parsed === 'object' ? parsed : {};
    return cachedNonStandardIndex;
  } catch (error) {
    console.error('Error loading non-standard index:', error);
    return {};
  }
}

export function clearCache() {
  cachedData = new Map();
  cachedWordIndex = [];
  cachedNonStandardIndex = {};
}
