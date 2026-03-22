/**
 * API & AI Security News Fetcher (Multilingual)
 *
 * Fetches security news from RSS feeds, filters for API & AI security content,
 * translates to multiple languages, and outputs to data/news.json.
 *
 * Runs via GitHub Actions cron at JST 6:00, 12:00, 18:00, 0:00.
 */

const fs = require('fs');
const path = require('path');
const deepl = require('deepl-node');
const translator = new deepl.Translator(process.env.DEEPL_API_KEY);

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
  { code: 'ja', deeplCode: 'ja' },
  { code: 'es', deeplCode: 'es' },
  { code: 'pt', deeplCode: 'pt-BR' },
  { code: 'fr', deeplCode: 'fr' },
];

// --- Tier 1: API & AI security keywords (match alone = include) ---
const TIER1_KEYWORDS = [
  // API-specific
  'api',
  'rest api',
  'graphql',
  'api key',
  'api gateway',
  'api endpoint',
  'api security',
  'api token',
  'api abuse',
  'openapi',
  'swagger',
  'webhook',
  'oauth',
  'jwt',
  'bola',
  'idor',
  'broken object level',
  'broken function level',
  'cors',
  'rate limit',
  'ssrf',
  'microservice',
  // AI / LLM / Agentic security
  'llm',
  'large language model',
  'ai agent',
  'agentic ai',
  'prompt injection',
  'ai security',
  'ai safety',
  'genai',
  'generative ai',
  'model poisoning',
  'rag attack',
  'retrieval augmented',
  'ai vulnerability',
  'llm vulnerability',
  'owasp llm',
  'owasp agentic',
  'ai supply chain',
  'agent hijack',
];

// --- Tier 2: General security keywords (match only when 2+ match) ---
const TIER2_KEYWORDS = [
  // General security
  'authentication bypass',
  'authorization',
  'injection',
  'endpoint',
  'token',
  'credential',
  'broken access',
  'owasp',
  'cve-',
  'vulnerability',
  'exploit',
  'breach',
  'data leak',
  'data exposure',
  'security flaw',
  // AI / ML general
  'artificial intelligence',
  'machine learning',
  'chatbot',
  'copilot',
  'deepfake',
  'hallucination',
  'training data',
  'fine-tuning',
  'model jailbreak',
  'ai model',
  'neural network',
  'adversarial attack',
];

// --- Category classification keywords ---
const AI_KEYWORDS = [
  'llm', 'large language model', 'ai agent', 'agentic ai', 'prompt injection',
  'ai security', 'ai safety', 'genai', 'generative ai', 'model poisoning',
  'rag attack', 'retrieval augmented', 'ai vulnerability', 'llm vulnerability',
  'owasp llm', 'owasp agentic', 'ai supply chain', 'agent hijack',
  'chatgpt', 'deepseek', 'copilot', 'chatbot', 'deepfake', 'hallucination',
  'training data', 'fine-tuning', 'model jailbreak', 'ai model', 'neural network',
  'adversarial attack', 'machine learning', 'langchain', 'langflow',
  'artificial intelligence', 'openai', 'anthropic', 'hugging face',
];

const INFRA_KEYWORDS = [
  'api gateway', 'api endpoint', 'api key', 'api token', 'api abuse',
  'rest api', 'graphql', 'openapi', 'swagger', 'webhook',
  'oauth', 'jwt', 'bola', 'idor', 'broken object level', 'broken function level',
  'cors', 'rate limit', 'ssrf', 'microservice',
  'kubernetes', 'k8s', 'docker', 'container', 'ci/cd', 'pipeline',
  'waf', 'cloud', 'aws', 'azure', 'gcp', 'terraform',
  'jenkins', 'github actions', 'gitlab ci',
];

// --- Classify item category: "ai" | "infra" | "general" ---
function classifyCategory(item) {
  const text = `${item.title} ${item.description}`.toLowerCase();
  const aiHits = AI_KEYWORDS.filter((kw) => text.includes(kw)).length;
  const infraHits = INFRA_KEYWORDS.filter((kw) => text.includes(kw)).length;

  if (aiHits > 0 && infraHits > 0) {
    // Both match — use ratio, AI wins ties
    return aiHits >= infraHits ? 'ai' : 'infra';
  }
  if (aiHits > 0) return 'ai';
  if (infraHits > 0) return 'infra';
  return 'general';
}

const FOURTEEN_DAYS_MS = 14 * 24 * 60 * 60 * 1000;

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
// Tier 1 hit = include (API-specific term found).
// Tier 2 only = include if 2+ Tier 2 keywords match (strong security signal).
function isApiRelated(item) {
  const text = `${item.title} ${item.description}`.toLowerCase();
  const hasTier1 = TIER1_KEYWORDS.some((kw) => text.includes(kw));
  const tier2Hits = TIER2_KEYWORDS.filter((kw) => text.includes(kw));

  if (hasTier1 && tier2Hits.length > 0) {
    console.log(`    [T1+T2] ${item.title.slice(0, 60)}`);
    return true;
  }
  if (hasTier1) {
    console.log(`    [T1] ${item.title.slice(0, 60)}`);
    return true;
  }
  if (tier2Hits.length >= 2) {
    console.log(`    [T2x${tier2Hits.length}] ${item.title.slice(0, 60)}`);
    return true;
  }
  return false;
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
    const result = await translator.translateText(text, 'en', targetLangCode);
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
      translateText(item.title, lang.deeplCode),
      translateText(item.description, lang.deeplCode),
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

  // Filter: last 14 days only
  const now = Date.now();
  const recentItems = apiItems.filter((item) => {
    if (!item.pubDate) return false;
    const itemTime = new Date(item.pubDate).getTime();
    return now - itemTime <= FOURTEEN_DAYS_MS;
  });
  console.log(`Within last 14 days: ${recentItems.length}`);

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
      category: classifyCategory(item),
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
