/**
 * i18n Build Script
 *
 * Reads HTML templates from templates/ and translation JSON from i18n/{lang}/,
 * replaces data-i18n and data-i18n-html attributes with translated text,
 * adjusts paths, inserts hreflang tags, and outputs to {lang}/ directories.
 */

const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio');

const ROOT_DIR = path.join(__dirname, '..');
const TEMPLATES_DIR = path.join(ROOT_DIR, 'templates');
const I18N_DIR = path.join(ROOT_DIR, 'i18n');

const LANGUAGES = ['en', 'ja', 'es', 'pt', 'fr'];
const BASE_PATH = '/api-security-hub';

// --- Load JSON translation file ---
function loadJSON(filePath) {
  if (!fs.existsSync(filePath)) return {};
  return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
}

// --- Generate hreflang tags for a given page ---
function generateHreflangTags(pageFile) {
  const tags = LANGUAGES.map(
    (lang) =>
      `<link rel="alternate" hreflang="${lang}" href="${BASE_PATH}/${lang}/${pageFile}">`
  );
  tags.push(
    `<link rel="alternate" hreflang="x-default" href="${BASE_PATH}/en/${pageFile}">`
  );
  return tags.join('\n    ');
}

// --- Process a single template for a single language ---
function buildPage(templateFile, lang) {
  const templatePath = path.join(TEMPLATES_DIR, templateFile);
  const html = fs.readFileSync(templatePath, 'utf-8');
  const $ = cheerio.load(html, { decodeEntities: false });

  // Determine the page name (without extension) for loading page-specific JSON
  const pageName = path.basename(templateFile, '.html');

  // Load translations: common + page-specific
  const common = loadJSON(path.join(I18N_DIR, lang, 'common.json'));
  const page = loadJSON(path.join(I18N_DIR, lang, `${pageName}.json`));
  const translations = { ...common, ...page };

  // Replace data-i18n (textContent)
  $('[data-i18n]').each(function () {
    const key = $(this).attr('data-i18n');
    if (translations[key] !== undefined) {
      $(this).text(translations[key]);
    }
  });

  // Replace data-i18n-html (innerHTML)
  $('[data-i18n-html]').each(function () {
    const key = $(this).attr('data-i18n-html');
    if (translations[key] !== undefined) {
      $(this).html(translations[key]);
    }
  });

  // Set <html lang>
  $('html').attr('lang', lang);

  // Fix CSS/JS paths: href="css/..." -> href="../css/..."
  $('link[rel="stylesheet"]').each(function () {
    const href = $(this).attr('href');
    if (href && !href.startsWith('..') && !href.startsWith('http')) {
      $(this).attr('href', '../' + href);
    }
  });

  $('script[src]').each(function () {
    const src = $(this).attr('src');
    if (src && !src.startsWith('..') && !src.startsWith('http')) {
      $(this).attr('src', '../' + src);
    }
  });

  // Insert hreflang tags into <head>
  const hreflangTags = generateHreflangTags(templateFile);
  $('head').append('\n    ' + hreflangTags + '\n');

  // Output to {lang}/ directory
  const outDir = path.join(ROOT_DIR, lang);
  fs.mkdirSync(outDir, { recursive: true });
  const outPath = path.join(outDir, templateFile);
  fs.writeFileSync(outPath, $.html(), 'utf-8');
}

// --- Main ---
function main() {
  console.log('=== i18n Build Script ===\n');

  // Get all template files
  const templates = fs
    .readdirSync(TEMPLATES_DIR)
    .filter((f) => f.endsWith('.html'));

  console.log(`Templates: ${templates.join(', ')}`);
  console.log(`Languages: ${LANGUAGES.join(', ')}\n`);

  let count = 0;
  for (const lang of LANGUAGES) {
    for (const tpl of templates) {
      buildPage(tpl, lang);
      count++;
    }
    console.log(`[OK] ${lang}/ - ${templates.length} pages generated`);
  }

  console.log(`\nTotal: ${count} files generated.`);
  console.log('Done.');
}

main();
