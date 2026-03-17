/**
 * i18n Translation Generator
 *
 * Reads English JSON files from i18n/en/ and generates translations
 * for es, zh, pt, fr using google-translate-api-x.
 * Japanese (ja) is skipped as it is manually maintained.
 *
 * Usage: node scripts/translate-i18n.js
 */

const fs = require('fs');
const path = require('path');
const translate = require('google-translate-api-x');

const ROOT_DIR = path.join(__dirname, '..');
const I18N_DIR = path.join(ROOT_DIR, 'i18n');
const SOURCE_LANG = 'en';
const TARGET_LANGS = ['es', 'pt', 'fr'];
const DELAY_MS = 300; // Rate limit delay between API calls

// --- Delay helper ---
function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// --- Translate a single string ---
async function translateText(text, targetLang) {
  // Map our lang codes to Google Translate codes
  const langMap = { zh: 'zh-cn' };
  const to = langMap[targetLang] || targetLang;

  try {
    const result = await translate(text, { from: SOURCE_LANG, to });
    return result.text;
  } catch (err) {
    console.error(`  [ERR] translate("${text.slice(0, 40)}...", ${to}): ${err.message}`);
    return text; // fallback to English
  }
}

// --- Translate all values in a JSON object ---
async function translateJSON(obj, targetLang, fileName) {
  const translated = {};
  const keys = Object.keys(obj);

  for (let i = 0; i < keys.length; i++) {
    const key = keys[i];
    const value = obj[key];

    if (typeof value === 'string' && value.trim()) {
      translated[key] = await translateText(value, targetLang);
      if (i > 0 && i % 5 === 0) {
        await delay(DELAY_MS);
      }
    } else {
      translated[key] = value;
    }

    // Progress indicator
    if ((i + 1) % 10 === 0 || i === keys.length - 1) {
      process.stdout.write(`\r    ${fileName}: ${i + 1}/${keys.length} keys`);
    }
  }
  console.log('');

  return translated;
}

// --- Main ---
async function main() {
  console.log('=== i18n Translation Generator ===\n');

  // Get all English JSON files
  const enDir = path.join(I18N_DIR, SOURCE_LANG);
  const jsonFiles = fs
    .readdirSync(enDir)
    .filter((f) => f.endsWith('.json'));

  console.log(`Source files: ${jsonFiles.join(', ')}`);
  console.log(`Target languages: ${TARGET_LANGS.join(', ')}\n`);

  for (const lang of TARGET_LANGS) {
    console.log(`\n--- Translating to: ${lang} ---`);
    const outDir = path.join(I18N_DIR, lang);
    fs.mkdirSync(outDir, { recursive: true });

    for (const file of jsonFiles) {
      const srcPath = path.join(enDir, file);
      const srcData = JSON.parse(fs.readFileSync(srcPath, 'utf-8'));

      const translated = await translateJSON(srcData, lang, file);

      const outPath = path.join(outDir, file);
      fs.writeFileSync(outPath, JSON.stringify(translated, null, 2), 'utf-8');
      console.log(`  [OK] ${lang}/${file} written`);

      // Delay between files
      await delay(DELAY_MS);
    }
  }

  console.log('\n=== Translation complete ===');
}

main().catch((err) => {
  console.error('Fatal error:', err);
  process.exit(1);
});
