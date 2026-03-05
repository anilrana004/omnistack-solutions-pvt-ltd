// ================================================================
//  OMNISTACK.CO.IN - SEO AUTO-PUBLISHER
//  Platform: Google Apps Script (runs on Google's servers)
//  CMS: Sanity (omnistack.co.in blog)
//  AI: Google Gemini API
//  Publishes: 1 article/day to /blogs/
// ================================================================
//
//  QUICK SETUP:
//  1) Go to script.google.com -> New Project -> paste this file
//  2) Fill in CONFIG below (Sanity Project ID, Token, Gemini Key)
//  3) Run checkSanityConnection()
//  4) Run setupDailyTrigger() once

// ----------------------------------------------------------------
//  YOUR CONFIGURATION - FILL THESE IN
// ----------------------------------------------------------------
const CONFIG = {
  // --- GEMINI AI ---
  GEMINI_API_KEY: "PASTE_YOUR_GEMINI_API_KEY_HERE",
  GEMINI_MODEL: "gemini-1.5-flash",

  // --- SANITY CMS ---
  SANITY_PROJECT_ID: "PASTE_YOUR_SANITY_PROJECT_ID_HERE", // e.g. kvjr9xh2
  SANITY_DATASET: "production",
  SANITY_API_TOKEN: "PASTE_YOUR_SANITY_API_TOKEN_HERE", // write token

  // --- PUBLISH SETTINGS ---
  PUBLISH_HOUR: 9, // 24h format (IST)
  AUTO_PUBLISH: true,

  // --- BRAND ---
  AUTHOR_NAME: "OmniStack Solutions",
  SITE_URL: "https://omnistack.co.in",
};

const SCRIPT_PROP_KEYS = {
  GEMINI_API_KEY: "GEMINI_API_KEY",
  SANITY_PROJECT_ID: "SANITY_PROJECT_ID",
  SANITY_DATASET: "SANITY_DATASET",
  SANITY_API_TOKEN: "SANITY_API_TOKEN",
  PUBLISH_HOUR: "PUBLISH_HOUR",
  AUTO_PUBLISH: "AUTO_PUBLISH",
  AUTHOR_NAME: "AUTHOR_NAME",
  SITE_URL: "SITE_URL",
};

// ----------------------------------------------------------------
//  TOPIC BANK
// ----------------------------------------------------------------
const TOPICS = {
  "Full Stack Development": [
    "Next.js 15 features every developer should know {year}",
    "React vs Next.js which to choose for your project {year}",
    "Node.js best practices for scalable APIs {year}",
    "TypeScript tips for full stack developers {year}",
    "REST API vs GraphQL complete comparison {year}",
    "PostgreSQL vs MongoDB which database to choose {year}",
    "how to build a SaaS application from scratch {year}",
    "full stack web development roadmap for beginners {year}",
    "microservices architecture explained with examples {year}",
    "web performance optimization techniques {year}",
  ],
  "AI & Automation": [
    "how to integrate AI into your business website {year}",
    "best AI APIs for developers {year}",
    "building an AI chatbot with OpenAI API {year}",
    "workflow automation tools for small businesses {year}",
    "AI in web development trends {year}",
    "how to use Gemini API in your app {year}",
    "LangChain for beginners complete guide {year}",
    "AI-powered SEO strategies that actually work {year}",
    "automating customer support with AI {year}",
    "vector databases explained for developers {year}",
  ],
  "Cloud & DevOps": [
    "AWS vs Google Cloud vs Azure comparison {year}",
    "Docker and Kubernetes for beginners {year}",
    "CI/CD pipeline setup guide {year}",
    "how to deploy Next.js app on Vercel for free {year}",
    "cloud cost optimization strategies {year}",
    "DevOps best practices for small teams {year}",
    "serverless architecture pros and cons {year}",
    "GitHub Actions automation guide {year}",
    "monitoring and logging for web applications {year}",
    "cloud security best practices {year}",
  ],
  "Mobile App Development": [
    "React Native vs Flutter which to choose {year}",
    "building cross-platform apps with React Native {year}",
    "mobile app development cost guide {year}",
    "how to publish app to Play Store and App Store {year}",
    "Firebase for mobile apps complete guide {year}",
    "mobile app UI/UX best practices {year}",
    "push notifications in React Native {year}",
    "offline-first mobile app architecture {year}",
    "mobile app performance optimization {year}",
    "Expo vs bare React Native which is better {year}",
  ],
};

// ----------------------------------------------------------------
//  MAIN FUNCTION - runs daily
// ----------------------------------------------------------------
function dailyAutoPublish() {
  const lock = LockService.getScriptLock();
  if (!lock.tryLock(25000)) {
    Logger.log("Another publish run is already in progress. Skipping this run.");
    return;
  }

  try {
    const cfg = getRuntimeConfig();
    validateConfig(cfg);
    Logger.log("OmniStack SEO Auto-Publisher starting...");

    const { topic, category } = getNextTopic();
    Logger.log(`Topic: ${topic} | Category: ${category}`);

    const article = generateArticle(topic, category, cfg);
    Logger.log(`Article generated: "${article.title}"`);

    const uniqueSlug = ensureUniqueSlug(article.slug, cfg);
    if (uniqueSlug !== article.slug) {
      Logger.log(`Slug exists. Adjusted slug to: ${uniqueSlug}`);
      article.slug = uniqueSlug;
    }

    const sanityDoc = buildSanityDocument(article, category, cfg);
    const result = publishToSanity(sanityDoc, cfg);
    Logger.log(`Published! ID: ${result.documentId}`);

    pingSearchConsole(cfg);
    logPost(article.title, topic, category);
    Logger.log("Done. Check /blogs/ in a few minutes.");
  } catch (err) {
    Logger.log("Error: " + (err && err.message ? err.message : String(err)));
    notifyError(err && err.message ? err.message : String(err));
  } finally {
    lock.releaseLock();
  }
}

// ----------------------------------------------------------------
//  TOPIC ROTATOR
// ----------------------------------------------------------------
function getNextTopic() {
  const props = PropertiesService.getScriptProperties();
  const categories = Object.keys(TOPICS);
  const catIndex = parseInt(props.getProperty("catIndex") || "0", 10);
  const topicIndex = parseInt(props.getProperty("topicIndex") || "0", 10);
  const year = new Date().getFullYear();

  const category = categories[catIndex % categories.length];
  const topicList = TOPICS[category];
  const rawTopic = topicList[topicIndex % topicList.length];
  const topic = rawTopic.replace("{year}", String(year));

  const nextTopicIdx = topicIndex + 1;
  const nextCatIdx = nextTopicIdx % topicList.length === 0 ? catIndex + 1 : catIndex;

  props.setProperty("topicIndex", String(nextTopicIdx));
  props.setProperty("catIndex", String(nextCatIdx));

  return { topic, category };
}

// ----------------------------------------------------------------
//  AI ARTICLE GENERATOR
// ----------------------------------------------------------------
function generateArticle(topic, category, cfg) {
  const prompt = `You are a senior tech writer for OmniStack Solutions (omnistack.co.in),
a full-stack development company in India that builds websites, apps, AI systems, and cloud infrastructure.

Write a complete SEO blog post about: "${topic}"
Category: ${category}

Respond ONLY with valid JSON (no markdown, no extra text):
{
  "title": "SEO-optimized title with keyword (max 65 chars)",
  "slug": "url-friendly-slug-lowercase-dashes-only",
  "metaDescription": "Compelling meta description with keyword (max 155 chars)",
  "excerpt": "2-sentence summary of the article for blog card previews",
  "tags": ["tag1", "tag2", "tag3", "tag4"],
  "readingTime": 5,
  "body": [
    { "style": "normal", "text": "Opening paragraph..." },
    { "style": "h2", "text": "Section heading" },
    { "style": "normal", "text": "Body paragraph..." }
  ]
}

Rules:
- Minimum 10 body items, target 14-16
- Write for developers and business owners in India and globally
- Mention the topic keyword naturally 4-5 times
- Each paragraph 3-5 sentences, practical and informative
- Tone: professional, approachable, plain text only
- Tags lowercase, relevant, max 2 words each`;

  const url = `https://generativelanguage.googleapis.com/v1beta/models/${cfg.GEMINI_MODEL}:generateContent?key=${encodeURIComponent(cfg.GEMINI_API_KEY)}`;
  const response = fetchWithRetry(url, {
    method: "POST",
    contentType: "application/json",
    payload: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: { temperature: 0.75, maxOutputTokens: 2500 },
    }),
    muteHttpExceptions: true,
  });

  const responseBody = response.getContentText();
  const result = safeJsonParse(responseBody);

  if (response.getResponseCode() >= 400) {
    throw new Error(`Gemini HTTP ${response.getResponseCode()}: ${(result && result.error && result.error.message) || responseBody.slice(0, 400)}`);
  }
  if (result.error) {
    throw new Error("Gemini error: " + result.error.message);
  }

  const raw = (((result.candidates || [])[0] || {}).content || {}).parts
    ? result.candidates[0].content.parts.map((p) => p.text || "").join("\n")
    : "";
  if (!raw) {
    throw new Error("Gemini returned empty content.");
  }

  const jsonText = extractJsonObject(raw);
  const article = JSON.parse(jsonText);
  return normalizeArticle(article, topic);
}

// ----------------------------------------------------------------
//  BUILD SANITY DOCUMENT
//  IMPORTANT: matches your current schemaTypes/post.ts:
//  title, slug, excerpt, publishedAt, content
// ----------------------------------------------------------------
function buildSanityDocument(article, category, cfg) {
  const now = new Date().toISOString();
  const baseId = "auto-blog-" + Date.now();
  const docId = cfg.AUTO_PUBLISH ? baseId : "drafts." + baseId;

  const portableTextContent = article.body.map((block, i) => ({
    _type: "block",
    _key: "block_" + i,
    style: block.style || "normal",
    markDefs: [],
    children: [
      {
        _type: "span",
        _key: "span_" + i,
        text: block.text || "",
        marks: [],
      },
    ],
  }));

  const baseDoc = {
    _id: docId,
    _type: "post",
    title: article.title,
    slug: {
      _type: "slug",
      current: article.slug,
    },
    excerpt: article.excerpt,
    category: category,
    tags: article.tags || [],
    readingTime: article.readingTime || 5,
    publishedAt: now,
    content: portableTextContent,
    seo: {
      _type: "seo",
      metaTitle: article.title,
      metaDescription: article.metaDescription || article.excerpt || "",
      keywords: article.tags || [],
    },
  };

  return {
    mutations: [
      {
        createOrReplace: baseDoc,
      },
    ],
  };
}

// ----------------------------------------------------------------
//  PUBLISH TO SANITY
// ----------------------------------------------------------------
function publishToSanity(sanityDoc, cfg) {
  const url = `https://${cfg.SANITY_PROJECT_ID}.api.sanity.io/v2021-06-07/data/mutate/${cfg.SANITY_DATASET}`;

  const response = fetchWithRetry(url, {
    method: "POST",
    contentType: "application/json",
    headers: {
      Authorization: `Bearer ${cfg.SANITY_API_TOKEN}`,
    },
    payload: JSON.stringify(sanityDoc),
    muteHttpExceptions: true,
  });

  const responseBody = response.getContentText();
  const result = safeJsonParse(responseBody);

  if (response.getResponseCode() >= 400) {
    throw new Error(`Sanity HTTP ${response.getResponseCode()}: ${(result && result.error && result.error.description) || responseBody.slice(0, 400)}`);
  }
  if (result.error) {
    throw new Error("Sanity error: " + JSON.stringify(result.error));
  }
  if (!result.results || !result.results[0]) {
    throw new Error("Sanity: no result returned");
  }

  return { documentId: result.results[0].id };
}

// ----------------------------------------------------------------
//  PING GOOGLE
// ----------------------------------------------------------------
function pingSearchConsole(cfg) {
  try {
    const sitemapUrl = cfg.SITE_URL.replace(/\/+$/, "") + "/sitemap.xml";
    UrlFetchApp.fetch("https://www.google.com/ping?sitemap=" + encodeURIComponent(sitemapUrl), {
      muteHttpExceptions: true,
    });
    Logger.log("Google pinged: " + sitemapUrl);
  } catch (err) {
    Logger.log("Google ping failed (non-blocking): " + (err && err.message ? err.message : String(err)));
  }
}

// ----------------------------------------------------------------
//  LOGGING
// ----------------------------------------------------------------
function logPost(title, topic, category) {
  const props = PropertiesService.getScriptProperties();
  const log = JSON.parse(props.getProperty("publishLog") || "[]");
  log.push({
    date: new Date().toISOString().split("T")[0],
    title: title,
    topic: topic,
    category: category,
  });
  if (log.length > 200) {
    log.splice(0, log.length - 200);
  }
  props.setProperty("publishLog", JSON.stringify(log));
}

function viewLog() {
  const log = JSON.parse(PropertiesService.getScriptProperties().getProperty("publishLog") || "[]");
  Logger.log(`Published ${log.length} posts so far:`);
  const recent = log.slice(-20);
  recent.forEach((e, i) => {
    Logger.log(`  ${log.length - recent.length + i + 1}. [${e.date}] [${e.category}] ${e.title}`);
  });
}

// ----------------------------------------------------------------
//  ERROR NOTIFICATIONS
// ----------------------------------------------------------------
function notifyError(msg) {
  try {
    const email = Session.getActiveUser().getEmail();
    if (!email) {
      Logger.log("No active user email available for notifications.");
      return;
    }
    MailApp.sendEmail({
      to: email,
      subject: "OmniStack Auto-Publisher Error",
      body: `Your OmniStack SEO auto-publisher hit an error:\n\n${msg}\n\nFix at: https://script.google.com`,
    });
  } catch (e) {
    Logger.log("Could not send email: " + e.message);
  }
}

// ----------------------------------------------------------------
//  SANITY CONNECTION CHECK
// ----------------------------------------------------------------
function checkSanityConnection() {
  const cfg = getRuntimeConfig();
  validateConfig(cfg);
  Logger.log("Checking Sanity connection...");
  const query = '*[_type=="post"][0..2]{_id,title,slug,publishedAt}';
  const url = `https://${cfg.SANITY_PROJECT_ID}.api.sanity.io/v2021-06-07/data/query/${cfg.SANITY_DATASET}?query=${encodeURIComponent(query)}`;

  const response = fetchWithRetry(url, {
    headers: { Authorization: `Bearer ${cfg.SANITY_API_TOKEN}` },
    muteHttpExceptions: true,
  });

  const result = safeJsonParse(response.getContentText());
  if (response.getResponseCode() >= 400) {
    Logger.log(`Connection failed with HTTP ${response.getResponseCode()}`);
    Logger.log("Response: " + response.getContentText().slice(0, 400));
    Logger.log("Check SANITY_PROJECT_ID / SANITY_DATASET / SANITY_API_TOKEN.");
    return;
  }
  if (result.error) {
    Logger.log("Connection failed: " + JSON.stringify(result.error));
    Logger.log("Check SANITY_PROJECT_ID / SANITY_DATASET / SANITY_API_TOKEN.");
    return;
  }

  Logger.log("Sanity connected. Existing posts:");
  (result.result || []).forEach((p) => {
    Logger.log(`  - ${p._id}: "${p.title}" -> /blogs/${(p.slug && p.slug.current) || ""}`);
  });
  Logger.log("Schema type 'post' reachable. Ready to publish.");
}

// ----------------------------------------------------------------
//  TEST RUN (generate only)
// ----------------------------------------------------------------
function testGenerateOnly() {
  const cfg = getRuntimeConfig();
  validateConfig(cfg);
  Logger.log("Testing article generation (no publish)...");
  const { topic, category } = getNextTopic();
  Logger.log("Topic: " + topic + " | Category: " + category);
  const article = generateArticle(topic, category, cfg);
  Logger.log("Title: " + article.title);
  Logger.log("Slug: " + article.slug);
  Logger.log("Meta: " + article.metaDescription);
  Logger.log("Tags: " + article.tags.join(", "));
  Logger.log("Body blocks: " + article.body.length);
  Logger.log("--- First 3 blocks ---");
  article.body.slice(0, 3).forEach((b, i) => {
    Logger.log(`  [${b.style}] ${String(b.text || "").substring(0, 80)}...`);
  });
  Logger.log("Generation test passed. Run testFullPublish() for real publish.");
}

// ----------------------------------------------------------------
//  FULL TEST (generate + publish)
// ----------------------------------------------------------------
function testFullPublish() {
  const cfg = getRuntimeConfig();
  validateConfig(cfg);
  Logger.log("Full test: this will publish a real post...");
  dailyAutoPublish();
}

// ----------------------------------------------------------------
//  DAILY TRIGGER SETUP
// ----------------------------------------------------------------
function setupDailyTrigger() {
  const cfg = getRuntimeConfig();
  validateConfig(cfg);
  ScriptApp.getProjectTriggers()
    .filter((t) => t.getHandlerFunction() === "dailyAutoPublish")
    .forEach((t) => ScriptApp.deleteTrigger(t));

  ScriptApp.newTrigger("dailyAutoPublish")
    .timeBased()
    .everyDays(1)
    .atHour(cfg.PUBLISH_HOUR)
    .inTimezone("Asia/Kolkata")
    .create();

  Logger.log(`Daily trigger set for ${cfg.PUBLISH_HOUR}:00 IST`);
  Logger.log(`Posts will appear at: ${cfg.SITE_URL.replace(/\/+$/, "")}/blogs/`);
}

// ----------------------------------------------------------------
//  INTERNAL HELPERS
// ----------------------------------------------------------------
function validateConfig(cfg) {
  const required = ["GEMINI_API_KEY", "SANITY_PROJECT_ID", "SANITY_DATASET", "SANITY_API_TOKEN", "SITE_URL"];
  required.forEach((key) => {
    if (!cfg[key] || String(cfg[key]).indexOf("PASTE_YOUR_") === 0) {
      throw new Error(`Missing CONFIG.${key}`);
    }
  });
  if (!/^[a-z0-9-]+$/.test(String(cfg.SANITY_PROJECT_ID))) {
    throw new Error("SANITY_PROJECT_ID format is invalid.");
  }
  if (!/^[a-z0-9][-\w]{0,63}$/i.test(String(cfg.SANITY_DATASET))) {
    throw new Error("SANITY_DATASET format is invalid.");
  }
  if (!/^https?:\/\//i.test(String(cfg.SITE_URL))) {
    throw new Error("SITE_URL must start with http:// or https://");
  }
}

function extractJsonObject(text) {
  const start = text.indexOf("{");
  const end = text.lastIndexOf("}");
  if (start < 0 || end < 0 || end <= start) {
    throw new Error("AI response did not contain a valid JSON object.");
  }
  return text.substring(start, end + 1);
}

function normalizeArticle(article, fallbackTopic) {
  const safeTitle = String(article.title || fallbackTopic || "OmniStack Blog").trim();
  const safeSlug = sanitizeSlug(article.slug || safeTitle);
  const safeExcerpt = String(article.excerpt || article.metaDescription || safeTitle).trim().slice(0, 300);
  const safeMeta = String(article.metaDescription || safeExcerpt).trim().slice(0, 160);
  const safeTags = Array.isArray(article.tags)
    ? article.tags.map((t) => String(t).trim().toLowerCase()).filter(Boolean).slice(0, 8)
    : [];
  const safeReading = Math.max(2, Math.min(30, parseInt(article.readingTime || 5, 10) || 5));
  const safeBody = Array.isArray(article.body)
    ? article.body
        .map((b) => ({
          style: normalizeStyle(b && b.style),
          text: String((b && b.text) || "").trim(),
        }))
        .filter((b) => b.text.length > 0)
    : [];

  if (safeBody.length < 4) {
    throw new Error("Generated article body is too short.");
  }

  return {
    title: safeTitle,
    slug: safeSlug,
    excerpt: safeExcerpt,
    metaDescription: safeMeta,
    tags: safeTags,
    readingTime: safeReading,
    body: safeBody,
  };
}

function sanitizeSlug(input) {
  return String(input || "")
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 96);
}

function normalizeStyle(style) {
  const s = String(style || "normal").toLowerCase();
  if (s === "h1" || s === "h2" || s === "h3" || s === "h4" || s === "blockquote") {
    return s;
  }
  return "normal";
}

function getRuntimeConfig() {
  const props = PropertiesService.getScriptProperties();
  const cfg = {
    GEMINI_API_KEY: props.getProperty(SCRIPT_PROP_KEYS.GEMINI_API_KEY) || CONFIG.GEMINI_API_KEY,
    GEMINI_MODEL: CONFIG.GEMINI_MODEL,
    SANITY_PROJECT_ID: props.getProperty(SCRIPT_PROP_KEYS.SANITY_PROJECT_ID) || CONFIG.SANITY_PROJECT_ID,
    SANITY_DATASET: props.getProperty(SCRIPT_PROP_KEYS.SANITY_DATASET) || CONFIG.SANITY_DATASET,
    SANITY_API_TOKEN: props.getProperty(SCRIPT_PROP_KEYS.SANITY_API_TOKEN) || CONFIG.SANITY_API_TOKEN,
    PUBLISH_HOUR: parseInt(
      props.getProperty(SCRIPT_PROP_KEYS.PUBLISH_HOUR) || String(CONFIG.PUBLISH_HOUR),
      10
    ),
    AUTO_PUBLISH: String(props.getProperty(SCRIPT_PROP_KEYS.AUTO_PUBLISH) || CONFIG.AUTO_PUBLISH) === "true",
    AUTHOR_NAME: props.getProperty(SCRIPT_PROP_KEYS.AUTHOR_NAME) || CONFIG.AUTHOR_NAME,
    SITE_URL: props.getProperty(SCRIPT_PROP_KEYS.SITE_URL) || CONFIG.SITE_URL,
  };
  if (!Number.isInteger(cfg.PUBLISH_HOUR) || cfg.PUBLISH_HOUR < 0 || cfg.PUBLISH_HOUR > 23) {
    throw new Error("PUBLISH_HOUR must be between 0 and 23.");
  }
  return cfg;
}

function setupScriptPropertiesFromConfig() {
  const props = PropertiesService.getScriptProperties();
  props.setProperties({
    [SCRIPT_PROP_KEYS.GEMINI_API_KEY]: CONFIG.GEMINI_API_KEY,
    [SCRIPT_PROP_KEYS.SANITY_PROJECT_ID]: CONFIG.SANITY_PROJECT_ID,
    [SCRIPT_PROP_KEYS.SANITY_DATASET]: CONFIG.SANITY_DATASET,
    [SCRIPT_PROP_KEYS.SANITY_API_TOKEN]: CONFIG.SANITY_API_TOKEN,
    [SCRIPT_PROP_KEYS.PUBLISH_HOUR]: String(CONFIG.PUBLISH_HOUR),
    [SCRIPT_PROP_KEYS.AUTO_PUBLISH]: String(CONFIG.AUTO_PUBLISH),
    [SCRIPT_PROP_KEYS.AUTHOR_NAME]: CONFIG.AUTHOR_NAME,
    [SCRIPT_PROP_KEYS.SITE_URL]: CONFIG.SITE_URL,
  });
  Logger.log("Script properties initialized. You can now clear secrets from CONFIG.");
}

function fetchWithRetry(url, options) {
  const maxAttempts = 3;
  let lastResponse = null;
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    const response = UrlFetchApp.fetch(url, options);
    const code = response.getResponseCode();
    lastResponse = response;
    if (code < 500 && code !== 429) {
      return response;
    }
    if (attempt < maxAttempts) {
      Utilities.sleep(800 * attempt);
    }
  }
  return lastResponse;
}

function safeJsonParse(text) {
  try {
    return JSON.parse(text);
  } catch (err) {
    throw new Error("Invalid JSON response: " + String(text || "").slice(0, 300));
  }
}

function ensureUniqueSlug(slug, cfg) {
  const base = sanitizeSlug(slug) || ("post-" + Date.now());
  const query =
    '*[_type == "post" && slug.current in $slugs]{ "slug": slug.current }';
  const candidateSlugs = [];
  for (let i = 0; i < 10; i++) {
    candidateSlugs.push(i === 0 ? base : `${base}-${i + 1}`);
  }

  const url = `https://${cfg.SANITY_PROJECT_ID}.api.sanity.io/v2021-06-07/data/query/${cfg.SANITY_DATASET}?query=${encodeURIComponent(query)}&$slugs=${encodeURIComponent(JSON.stringify(candidateSlugs))}`;
  const response = fetchWithRetry(url, {
    headers: { Authorization: `Bearer ${cfg.SANITY_API_TOKEN}` },
    muteHttpExceptions: true,
  });
  const code = response.getResponseCode();
  if (code >= 400) {
    return base;
  }

  const result = safeJsonParse(response.getContentText());
  const existing = new Set((result.result || []).map((d) => d.slug));
  for (let i = 0; i < candidateSlugs.length; i++) {
    if (!existing.has(candidateSlugs[i])) {
      return candidateSlugs[i];
    }
  }
  return `${base}-${Date.now()}`;
}
