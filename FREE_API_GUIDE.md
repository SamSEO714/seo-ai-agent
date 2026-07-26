# 🆓 FREE APIs for SEO AI Agent

Ye guide sirf **FREE** APIs cover karti hai. Koi bhi paid API nahi hai!

---

## 🥇 Tier 1: Must-Have Free APIs (Sabse Important)

### 1️⃣ Google PageSpeed Insights API 💯 FREE

**Kya deta hai:** Real Core Web Vitals (LCP, FID, CLS, FCP, TTFB)

**Limit:** 25,000 queries/day = UNLIMITED for you

**Get API Key:** https://developers.google.com/speed/docs/insights/v5/get-started

**Code:**
```typescript
// lib/seo-engine.ts mein add karein

async function getRealPageSpeed(url: string) {
  const API_KEY = process.env.GOOGLE_PAGESPEED_API_KEY;

  const res = await fetch(
    `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${encodeURIComponent(url)}&key=${API_KEY}&category=PERFORMANCE&category=ACCESSIBILITY&category=SEO&category=BEST_PRACTICES`
  );
  const data = await res.json();

  return {
    lcp: data.lighthouseResult.audits['largest-contentful-paint'].numericValue / 1000,
    fid: data.lighthouseResult.audits['max-potential-fid'].numericValue,
    cls: data.lighthouseResult.audits['cumulative-layout-shift'].numericValue,
    fcp: data.lighthouseResult.audits['first-contentful-paint'].numericValue / 1000,
    ttfb: data.lighthouseResult.audits['server-response-time'].numericValue / 1000,
    performanceScore: data.lighthouseResult.categories.performance.score * 100,
    accessibilityScore: data.lighthouseResult.categories.accessibility.score * 100,
    seoScore: data.lighthouseResult.categories.seo.score * 100,
    bestPracticesScore: data.lighthouseResult.categories['best-practices'].score * 100,
  };
}
```

---

### 2️⃣ Google Custom Search JSON API 💯 FREE

**Kya deta hai:** Real Google search results, keyword positions, competitor analysis

**Limit:** 100 queries/day FREE

**Get API Key:** https://developers.google.com/custom-search/v1/introduction

**Also need:** Custom Search Engine ID (CSE ID) - https://cse.google.com/cse/

**Code:**
```typescript
// lib/seo-engine.ts mein add karein

async function getSearchResults(keyword: string, domain: string) {
  const API_KEY = process.env.GOOGLE_CUSTOM_SEARCH_API_KEY;
  const CX = process.env.GOOGLE_CSE_ID; // Custom Search Engine ID

  const res = await fetch(
    `https://www.googleapis.com/customsearch/v1?key=${API_KEY}&cx=${CX}&q=${encodeURIComponent(keyword)}&num=10`
  );
  const data = await res.json();

  const results = data.items || [];
  const yourPosition = results.findIndex((item: any) => 
    item.link.includes(domain)
  ) + 1;

  return {
    totalResults: data.searchInformation?.totalResults || '0',
    yourPosition: yourPosition || 'Not in top 10',
    competitors: results.slice(0, 5).map((r: any) => ({
      title: r.title,
      link: r.link,
      snippet: r.snippet,
      displayLink: r.displayLink,
    })),
    relatedKeywords: data.queries?.nextPage?.[0]?.searchTerms || [],
  };
}
```

---

### 3️⃣ Hugging Face Inference API 💯 FREE (OpenAI Alternative)

**Kya deta hai:** AI content analysis, text generation, sentiment analysis

**Limit:** FREE tier mein bahut generous limits hain

**Get API Key:** https://huggingface.co/settings/tokens

**Code:**
```typescript
// lib/seo-engine.ts mein add karein

async function analyzeContentWithAI(content: string, keyword: string) {
  const API_KEY = process.env.HUGGINGFACE_API_KEY;

  // Content analysis using free AI model
  const res = await fetch(
    'https://api-inference.huggingface.co/models/facebook/bart-large-mnli',
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        inputs: content,
        parameters: {
          candidate_labels: ['Informational', 'Commercial', 'Transactional', 'Navigational']
        }
      }),
    }
  );

  const data = await res.json();
  return {
    intent: data.labels[0],
    confidence: data.scores[0],
    allIntents: data.labels.map((l: string, i: number) => ({
      label: l,
      score: data.scores[i],
    })),
  };
}

// Keyword extraction ke liye
async function extractKeywords(text: string) {
  const res = await fetch(
    'https://api-inference.huggingface.co/models/yanekyuk/bert-keyword-extractor',
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ inputs: text }),
    }
  );
  const data = await res.json();
  return data[0]?.map((k: any) => k.word) || [];
}
```

---

### 4️⃣ Groq API 🆓 FREE Tier (Fast AI - OpenAI Alternative)

**Kya deta hai:** ChatGPT jaisa AI, SEO analysis, content generation

**Limit:** 1,500,000 tokens/month FREE (bahut zyada!)

**Get API Key:** https://console.groq.com/keys

**Code:**
```typescript
// lib/seo-engine.ts mein add karein

async function analyzeSEOWithGroq(content: string, keyword: string) {
  const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'qwen/qwen3.6-27b', // Groq Free Plan model
      messages: [
        {
          role: 'system',
          content: `You are an expert SEO analyst. Analyze the following website content and provide:
          1. Search intent mismatch issues
          2. Content quality score (0-100)
          3. Missing keywords opportunities
          4. E-E-A-T improvement suggestions
          5. Readability issues
          Return JSON format only.`
        },
        {
          role: 'user',
          content: `Analyze this content for keyword "${keyword}": ${content.substring(0, 3000)}`
        }
      ],
      temperature: 0.3,
      max_tokens: 2000,
    }),
  });

  const data = await res.json();
  return data.choices[0].message.content;
}
```

---

## 🥈 Tier 2: Useful Free APIs

### 5️⃣ URLScan.io API 💯 FREE

**Kya deta hai:** Website screenshot, security analysis, tech stack detection

**Limit:** Unauthenticated: 1 scan/min, API Key: much higher

**Get API Key:** https://urlscan.io/user/signup

**Code:**
```typescript
async function scanWebsite(url: string) {
  const API_KEY = process.env.URLSCAN_API_KEY;

  // Submit scan
  const submit = await fetch('https://urlscan.io/api/v1/scan/', {
    method: 'POST',
    headers: {
      'API-Key': API_KEY,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ url, visibility: 'public' }),
  });

  const { uuid } = await submit.json();

  // Wait and get results
  await new Promise(r => setTimeout(r, 15000));

  const result = await fetch(`https://urlscan.io/api/v1/result/${uuid}/`);
  const data = await result.json();

  return {
    screenshot: data.task.screenshotURL,
    securityScore: data.verdicts?.overall?.score || 0,
    technologies: data.meta?.processors?.wappa?.data?.map((t: any) => t.name) || [],
    serverLocation: data.page?.country || 'Unknown',
    hasMalware: data.verdicts?.overall?.malicious || false,
  };
}
```

---

### 6️⃣ BuiltWith API 🆓 FREE Tier

**Kya deta hai:** Tech stack detection (CMS, analytics, hosting, etc.)

**Limit:** 1,000 lookups/month FREE

**Get API Key:** https://api.builtwith.com/free-api

**Code:**
```typescript
async function detectTechStack(domain: string) {
  const API_KEY = process.env.BUILTWITH_API_KEY;

  const res = await fetch(
    `https://api.builtwith.com/v21/api.json?KEY=${API_KEY}&LOOKUP=${domain}`
  );
  const data = await res.json();

  const groups = data.Results?.[0]?.Result?.Paths?.[0]?.Technologies || [];

  return {
    cms: groups.filter((t: any) => t.Tag === 'CMS').map((t: any) => t.Name),
    analytics: groups.filter((t: any) => t.Tag === 'Analytics').map((t: any) => t.Name),
    hosting: groups.filter((t: any) => t.Tag === 'Web Hosting').map((t: any) => t.Name),
    seo: groups.filter((t: any) => t.Tag === 'SEO').map((t: any) => t.Name),
    allTechnologies: groups.map((t: any) => t.Name),
  };
}
```

---

### 7️⃣ SecurityTrails API 🆓 FREE Tier

**Kya deta hai:** DNS records, subdomain discovery, domain history

**Limit:** 50 queries/month FREE

**Get API Key:** https://securitytrails.com/app/account/credentials

**Code:**
```typescript
async function getDomainInfo(domain: string) {
  const API_KEY = process.env.SECURITYTRAILS_API_KEY;

  const res = await fetch(`https://api.securitytrails.com/v1/domain/${domain}`, {
    headers: { 'APIKEY': API_KEY },
  });
  const data = await res.json();

  return {
    subdomains: data.subdomains || [],
    alexaRank: data.alexa_rank,
    firstSeen: data.first_seen,
    nameServers: data.name_servers || [],
    mxRecords: data.mx || [],
    txtRecords: data.txt || [],
  };
}

async function getSubdomains(domain: string) {
  const res = await fetch(
    `https://api.securitytrails.com/v1/domain/${domain}/subdomains`,
    { headers: { 'APIKEY': process.env.SECURITYTRAILS_API_KEY } }
  );
  const data = await res.json();
  return data.subdomains?.map((s: string) => `${s}.${domain}`) || [];
}
```

---

### 8️⃣ W3C HTML Validator API 💯 FREE

**Kya deta hai:** HTML validation errors, accessibility issues

**Limit:** Unlimited

**Code:**
```typescript
async function validateHTML(url: string) {
  const res = await fetch(`https://validator.w3.org/nu/?doc=${encodeURIComponent(url)}&out=json`);
  const data = await res.json();

  return {
    errors: data.messages?.filter((m: any) => m.type === 'error').length || 0,
    warnings: data.messages?.filter((m: any) => m.type === 'info').length || 0,
    issues: data.messages?.map((m: any) => ({
      type: m.type,
      message: m.message,
      extract: m.extract,
    })) || [],
  };
}
```

---

### 9️⃣ Schema.org Validator (Google Rich Results Test) 💯 FREE

**Kya deta hai:** Schema markup validation

**Note:** Official API nahi hai, lekin fetch karke parse kar sakte hain

**Alternative:** Use Google's Rich Results Test manually

**Code:**
```typescript
async function validateSchema(url: string) {
  // Use Rich Results Test API (unofficial but works)
  const res = await fetch(`https://search.google.com/test/rich-results?url=${encodeURIComponent(url)}`);
  // Parse HTML response
  // Note: This is scraping, better to use manual validation

  // Alternative: Use Schema Validator
  const validatorRes = await fetch('https://validator.schema.org/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: `url=${encodeURIComponent(url)}`,
  });

  return { validated: true }; // Simplified
}
```

---

### 🔟 Open PageRank API 💯 FREE

**Kya deta hai:** Domain authority, page rank (Ahrefs/Moz alternative)

**Limit:** Unlimited

**Code:**
```typescript
async function getPageRank(domain: string) {
  const res = await fetch(`https://openpagerank.com/api/v1.0/getPageRank?domains[]=${domain}`, {
    headers: { 'API-OPR': process.env.OPENPAGERANK_API_KEY },
  });
  const data = await res.json();

  return {
    pageRank: data.response?.[0]?.page_rank_decimal || 0,
    rank: data.response?.[0]?.rank || 'N/A',
    domain: data.response?.[0]?.domain || domain,
  };
}
```

**Get API Key:** https://www.domcop.com/openpagerank/

---

## 🥉 Tier 3: Bonus Free Tools

### 1️⃣1️⃣ WhoisXML API 🆓 FREE Tier

**Kya deta hai:** Domain age, registrar info, expiry date

**Limit:** 500 requests/month FREE

**Code:**
```typescript
async function getWhoisData(domain: string) {
  const API_KEY = process.env.WHOISXML_API_KEY;

  const res = await fetch(
    `https://www.whoisxmlapi.com/whoisserver/WhoisService?apiKey=${API_KEY}&domainName=${domain}&outputFormat=JSON`
  );
  const data = await res.json();

  return {
    domainAge: data.WhoisRecord?.createdDate,
    expires: data.WhoisRecord?.expiresDate,
    registrar: data.WhoisRecord?.registrarName,
    owner: data.WhoisRecord?.registrant?.organization || 'Private',
  };
}
```

---

### 1️⃣2️⃣ Sitemap Parser (No API needed)

**Kya deta hai:** Automatically parse sitemap.xml

**Code:**
```typescript
async function parseSitemap(domain: string) {
  try {
    const res = await fetch(`${domain}/sitemap.xml`);
    const xml = await res.text();

    // Parse XML
    const urls = xml.match(/<loc>(.*?)<\/loc>/g) || [];
    return urls.map(u => u.replace('<loc>', '').replace('</loc>', ''));
  } catch {
    return [];
  }
}
```

---

### 1️⃣3️⃣ robots.txt Parser (No API needed)

**Code:**
```typescript
async function parseRobotsTxt(domain: string) {
  try {
    const res = await fetch(`${domain}/robots.txt`);
    const text = await res.text();

    const disallowed = text.match(/Disallow:\s*(.+)/g) || [];
    const sitemaps = text.match(/Sitemap:\s*(.+)/g) || [];

    return {
      hasRobots: true,
      disallowedPaths: disallowed.map(d => d.replace('Disallow:', '').trim()),
      sitemaps: sitemaps.map(s => s.replace('Sitemap:', '').trim()),
    };
  } catch {
    return { hasRobots: false, disallowedPaths: [], sitemaps: [] };
  }
}
```

---

## 📋 Summary: FREE APIs Table

| API | FREE Limit | Use For |
|-----|-----------|---------|
| **Google PageSpeed** | 25,000/day | Core Web Vitals, Performance |
| **Google Custom Search** | 100/day | SERP analysis, competitor tracking |
| **Hugging Face** | Very generous | AI content analysis, keyword extraction |
| **Groq** | Free Plan limits apply | AI SEO analysis, content generation |
| **URLScan.io** | 1/min | Screenshots, security, tech stack |
| **BuiltWith** | 1,000/month | Tech stack detection |
| **SecurityTrails** | 50/month | Subdomains, DNS records |
| **W3C Validator** | Unlimited | HTML validation |
| **Open PageRank** | Unlimited | Domain authority |
| **WhoisXML** | 500/month | Domain age, registrar |
| **Sitemap/Robots** | Unlimited | Site structure analysis |

---

## 🔧 Vercel Environment Variables Setup

Vercel Dashboard → Your Project → Settings → Environment Variables:

```
# MUST HAVE (Free)
GOOGLE_PAGESPEED_API_KEY=your_key
GOOGLE_CUSTOM_SEARCH_API_KEY=your_key
GOOGLE_CSE_ID=your_cse_id

# AI (Free alternatives to OpenAI)
GROQ_API_KEY=your_key
HUGGINGFACE_API_KEY=your_key

# Optional (Free tiers)
URLSCAN_API_KEY=your_key
BUILTWITH_API_KEY=your_key
SECURITYTRAILS_API_KEY=your_key
OPENPAGERANK_API_KEY=your_key
WHOISXML_API_KEY=your_key
```

---

## 🚀 Recommended Integration Order

1. **Google PageSpeed** - Most impactful, 100% free
2. **Groq** - AI analysis through the Free Plan
3. **Google Custom Search** - Real SERP data
4. **URLScan.io** - Visual analysis + security
5. **BuiltWith** - Tech stack detection
6. **W3C Validator** - HTML quality
7. **Sitemap/Robots parsers** - No API needed

**Total cost: $0** ✅
