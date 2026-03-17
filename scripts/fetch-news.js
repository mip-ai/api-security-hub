/**
 * API Security News Fetcher (Multilingual)
 *
 * Fetches security news from RSS feeds, filters for API-related content,
 * translates to multiple languages, and outputs to data/news.json.
 *
 * Runs via GitHub Actions cron at JST 6:00, 12:00, 18:00, 0:00.
 */

const fs = require('fs');
const path = require('path');
const translate = require('google-translate-api-x');

// --- RSS Feed Sources ---
const FEEDS = [
  {
    url: 'https://feeds.feedburner.com/TheHackersNews',
    source: 'The Hacker News',
  },
  {
    url: 'https://www.bleepingcomputer.com/feed/',
    source: 'BleepingComputer',
  },
  {
    url: 'https://www.securityweek.com/feed/',
    source: 'SecurityWeek',
  },
  {
    url: 'https://portswigger.net/daily-swig/rss',
    source: 'PortSwigger Daily Swig',
  },
  {
    url: 'https://blog.cloudflare.com/tag/security/rss',
    source: 'Cloudflare Blog',
  },
];

// --- Target languages for translation ---
const TARGET_LANGS = [
  { code: 'ja', googleCode: 'ja' },
  { code: 'es', googleCode: 'es' },
  { code: 'pt', googleCode: 'pt' },
  { code: 'fr', googleCode: 'fr' },
];

// --- API Security Keywords (case-insensitive matching) ---
const API_KEYWORDS = [
  'api',
  'oauth',
  'jwt',
  'token',
  'authentication bypass',
  'authorization',
  'ssrf',
  'injection',
  'endpoint',
  'rest api',
  'graphql',
  'webhook',
  'api key',
  'rate limit',
  'cors',
  'openapi',
  'swagger',
  'microservice',
  'api gateway',
  'broken access',
  'bola',
  'idor',
  'credential',
  'owasp',
  'cve-',
  'vulnerability',
  'exploit',
  'breach',
  'data leak',
  'data exposure',
  'security flaw',
];

const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000;

// --- Simple XML tag extractor ---
function extractTag(xml, tag) {
  const regex = new RegExp(`<${tag}[^>]*><!\\[CDATA\\[([\\s\\S]*?)\\]\\]></${tag}>|<${tag}[^>]*>([\\s\\S]*?)</${tag}>`);
  const match = xml.match(regex);
  if (!match) return '';
  return (match[1] || match[2] || '').trim();
}

// --- Extract all items from RSS XML ---
function parseRSS(xml, source) {
  const items = [];
  const itemRegex = /<item[\s>]([\s\S]*?)<\/item>/gi;
  let match;

  while ((match = itemRegex.exec(xml)) !== null) {
    const itemXml = match[1];
    const title = extractTag(itemXml, 'title');
    const link = extractTag(itemXml, 'link');
    const pubDate = extractTag(itemXml, 'pubDate');
    const description = extractTag(itemXml, 'description');

    // Strip HTML tags from description
    const cleanDesc = description
      .replace(/<[^>]*>/g, '')
      .replace(/&nbsp;/g, ' ')
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/&#039;/g, "'")
      .replace(/\s+/g, ' ')
      .trim()
      .slice(0, 300);

    items.push({
      title,
      link,
      pubDate: pubDate ? new Date(pubDate).toISOString() : null,
      description: cleanDesc,
      source,
    });
  }

  return items;
}

// --- Check if an item is API-security related ---
function isApiRelated(item) {
  const text = `${item.title} ${item.description}`.toLowerCase();
  return API_KEYWORDS.some((kw) => text.includes(kw.toLowerCase()));
}

// --- Fetch a single feed with timeout ---
async function fetchFeed(feed) {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15000);

    const res = await fetch(feed.url, {
      signal: controller.signal,
      headers: { 'User-Agent': 'API-Security-Hub-Bot/1.0' },
    });
    clearTimeout(timeout);

    if (!res.ok) {
      console.error(`  [WARN] ${feed.source}: HTTP ${res.status}`);
      return [];
    }

    const xml = await res.text();
    const items = parseRSS(xml, feed.source);
    console.log(`  [OK] ${feed.source}: ${items.length} items fetched`);
    return items;
  } catch (err) {
    console.error(`  [ERR] ${feed.source}: ${err.message}`);
    return [];
  }
}

// --- Translate text to a target language ---
async function translateText(text, targetLangCode) {
  if (!text) return '';
  try {
    const result = await translate(text, { from: 'en', to: targetLangCode });
    return result.text;
  } catch (err) {
    console.error(`  [TRANSLATE ERR] ${targetLangCode}: ${err.message}`);
    return text; // fallback to original
  }
}

// --- Translate a single news item to all target languages ---
async function translateItem(item, index) {
  // Small delay between items to avoid rate limiting
  if (index > 0) {
    await new Promise((r) => setTimeout(r, 300));
  }

  const titleTranslations = { en: item.title };
  const descTranslations = { en: item.description };

  for (const lang of TARGET_LANGS) {
    const [translatedTitle, translatedDesc] = await Promise.all([
      translateText(item.title, lang.googleCode),
      translateText(item.description, lang.googleCode),
    ]);
    titleTranslations[lang.code] = translatedTitle;
    descTranslations[lang.code] = translatedDesc;

    // Small delay between languages
    await new Promise((r) => setTimeout(r, 200));
  }

  return {
    ...item,
    titleTranslations,
    descTranslations,
  };
}

// --- Main ---
async function main() {
  console.log('=== API Security News Fetcher (Multilingual) ===');
  console.log(`Time: ${new Date().toISOString()}\n`);

  // Fetch all feeds in parallel
  console.log('Fetching RSS feeds...');
  const results = await Promise.all(FEEDS.map(fetchFeed));
  const allItems = results.flat();
  console.log(`\nTotal items fetched: ${allItems.length}`);

  // Filter: API-related only
  const apiItems = allItems.filter(isApiRelated);
  console.log(`API-related items: ${apiItems.length}`);

  // Filter: last 7 days only
  const now = Date.now();
  const recentItems = apiItems.filter((item) => {
    if (!item.pubDate) return false;
    const itemTime = new Date(item.pubDate).getTime();
    return now - itemTime <= SEVEN_DAYS_MS;
  });
  console.log(`Within last 7 days: ${recentItems.length}`);

  // Sort by date (newest first)
  recentItems.sort((a, b) => new Date(b.pubDate) - new Date(a.pubDate));

  // Limit to top 20
  const finalItems = recentItems.slice(0, 20);

  // Translate to all target languages
  const langList = TARGET_LANGS.map((l) => l.code).join(', ');
  console.log(`\nTranslating ${finalItems.length} items to: ${langList}...`);
  const translatedItems = [];
  for (let i = 0; i < finalItems.length; i++) {
    const item = await translateItem(finalItems[i], i);
    translatedItems.push(item);
    console.log(`  [${i + 1}/${finalItems.length}] ${item.title.slice(0, 50)}...`);
  }
  console.log('Translation complete.');

  // Build output JSON (multilingual format)
  const output = {
    lastUpdated: new Date().toISOString(),
    itemCount: translatedItems.length,
    items: translatedItems.map((item) => ({
      title: item.titleTranslations,
      titleOriginal: item.title,
      link: item.link,
      pubDate: item.pubDate,
      description: item.descTranslations,
      descriptionOriginal: item.description,
      source: item.source,
    })),
  };

  // Write to data/news.json
  const outPath = path.join(__dirname, '..', 'data', 'news.json');
  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, JSON.stringify(output, null, 2), 'utf-8');
  console.log(`\nWritten ${translatedItems.length} items to ${outPath}`);
  console.log('Done.');
}

main().catch((err) => {
  console.error('Fatal error:', err);
  process.exit(1);
});
