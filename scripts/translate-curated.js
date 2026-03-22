/**
 * Curated Content Translator
 *
 * Reads data/curated.json, finds text fields with only "ja" key,
 * translates them to en/es/pt/fr, and writes back.
 *
 * Usage: node scripts/translate-curated.js
 *
 * Workflow:
 *   1. Edit data/curated.json — write title/commentary/summary in Japanese only
 *   2. Run this script
 *   3. git commit & push
 */

const fs = require('fs');
const path = require('path');
const deepl = require('deepl-node');
const translator = new deepl.Translator(process.env.DEEPL_API_KEY);

const TARGET_LANGS = [
  { code: 'en', deeplCode: 'en-US' },
  { code: 'es', deeplCode: 'es' },
  { code: 'pt', deeplCode: 'pt-BR' },
  { code: 'fr', deeplCode: 'fr' },
];

const SOURCE_LANG = 'ja';

// --- Translate text ---
async function translateText(text, targetLangCode) {
  if (!text) return '';
  try {
    const result = await translator.translateText(text, SOURCE_LANG, targetLangCode);
    return result.text;
  } catch (err) {
    console.error(`  [TRANSLATE ERR] ${targetLangCode}: ${err.message}`);
    return text;
  }
}

// --- Translate a multilingual text object ---
// If only "ja" exists, translate to en/es/pt/fr
// If "ja" exists and others exist, skip (already translated)
async function translateField(obj) {
  if (!obj || typeof obj !== 'object') return obj;
  if (!obj[SOURCE_LANG]) return obj; // no source text

  // Check if translation is needed (missing any target lang)
  const needsTranslation = TARGET_LANGS.some(lang => !obj[lang.code]);
  if (!needsTranslation) return obj;

  console.log(`    Translating: "${obj[SOURCE_LANG].slice(0, 50)}..."`);

  for (const lang of TARGET_LANGS) {
    if (!obj[lang.code]) {
      obj[lang.code] = await translateText(obj[SOURCE_LANG], lang.deeplCode);
      await new Promise(r => setTimeout(r, 200));
    }
  }

  return obj;
}

// --- Main ---
async function main() {
  console.log('=== Curated Content Translator ===');
  console.log(`Source language: ${SOURCE_LANG}`);
  console.log(`Target languages: ${TARGET_LANGS.map(l => l.code).join(', ')}\n`);

  const filePath = path.join(__dirname, '..', 'data', 'curated.json');
  const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

  let translationCount = 0;

  // Translate editorPicks
  if (data.editorPicks) {
    console.log(`Processing ${data.editorPicks.length} editor picks...`);
    for (const pick of data.editorPicks) {
      if (pick.title) { pick.title = await translateField(pick.title); translationCount++; }
      if (pick.commentary) { pick.commentary = await translateField(pick.commentary); translationCount++; }
    }
  }

  // Translate weeklyHighlights
  if (data.weeklyHighlights) {
    console.log(`Processing ${data.weeklyHighlights.length} weekly highlights...`);
    for (const wh of data.weeklyHighlights) {
      if (wh.title) { wh.title = await translateField(wh.title); translationCount++; }
      if (wh.summary) { wh.summary = await translateField(wh.summary); translationCount++; }
    }
  }

  // Update lastUpdated
  data.lastUpdated = new Date().toISOString().split('T')[0];

  // Write back
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
  console.log(`\nProcessed ${translationCount} fields.`);
  console.log(`Written to ${filePath}`);
  console.log('Done.');
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
