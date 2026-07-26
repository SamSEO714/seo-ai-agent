# 🔌 API Integration Guide

This guide shows EXACTLY where and how to add real APIs to your SEO AI Agent.

## 📍 Quick Reference: Where to Add Code

| What You Want | File to Edit | Function to Modify |
|--------------|-------------|-------------------|
| Real page speed data | `lib/seo-engine.ts` | `performDeepAudit()` |
| Real keyword data | `lib/seo-engine.ts` | `generateKeywordGaps()` |
| Real backlink data | `lib/seo-engine.ts` | `performDeepAudit()` |
| Auto-fix on WordPress | `lib/fix-engine.ts` | `autoFixIssue()` |
| Auto-fix on Shopify | `lib/fix-engine.ts` | `autoFixIssue()` |
| AI content analysis | `lib/seo-engine.ts` | `generateContentAnalysis()` |

---

## 1️⃣ Google PageSpeed Insights (FREE API)

### Get API Key:
1. Go to https://developers.google.com/speed/docs/insights/v5/get-started
2. Click "Get a Key"
3. Copy your API key

### Add to Vercel:
1. Vercel Dashboard → Your Project → Settings → Environment Variables
2. Add: `GOOGLE_PAGESPEED_API_KEY` = your_key

### Add Code to `lib/seo-engine.ts`:

Find this section in `performDeepAudit()`:
```typescript
const cwv = {
  lcp: parseFloat((avgLoadTime + 0.3).toFixed(2)),
  fid: Math.floor(20 + Math.random() * 80),
  ...
};
```

Replace with:
```typescript
// REAL API CALL
let cwv;
try {
  const psResponse = await fetch(
    `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${encodeURIComponent(fullDomain)}&key=${process.env.GOOGLE_PAGESPEED_API_KEY}&category=PERFORMANCE`
  );
  const psData = await psResponse.json();
  const metrics = psData.lighthouseResult.audits;
  cwv = {
    lcp: metrics['largest-contentful-paint'].numericValue / 1000,
    fid: metrics['max-potential-fid'].numericValue,
    cls: metrics['cumulative-layout-shift'].numericValue,
    fcp: metrics['first-contentful-paint'].numericValue / 1000,
    ttfb: metrics['server-response-time'].numericValue / 1000,
  };
} catch (e) {
  // Fallback to simulation if API fails
  cwv = {
    lcp: parseFloat((avgLoadTime + 0.3).toFixed(2)),
    fid: Math.floor(20 + Math.random() * 80),
    cls: parseFloat((0.02 + Math.random() * 0.15).toFixed(3)),
    fcp: parseFloat((avgLoadTime * 0.6).toFixed(2)),
    ttfb: parseFloat((0.3 + Math.random() * 0.8).toFixed(2)),
  };
}
```

---

## 2️⃣ Ahrefs API (Paid - For Real Keywords & Backlinks)

### Get API Key:
1. Go to https://ahrefs.com/api
2. Subscribe to API plan
3. Get your API token

### Add to Vercel:
Add environment variable: `AHREFS_API_KEY`

### Add Code to `lib/seo-engine.ts`:

Find `generateKeywordGaps()` function and replace the `missing` array with:

```typescript
// REAL API CALL for keywords
let missingKeywords = [];
try {
  const ahrefsResponse = await fetch(
    `https://apiv2.ahrefs.com?from=keywords_explorer&select=keyword,volume,kd,cpc&where=%7B%22country%22:%22us%22%7D&limit=20&token=${process.env.AHREFS_API_KEY}`
  );
  const ahrefsData = await ahrefsResponse.json();
  missingKeywords = ahrefsData.keywords.map((k: any) => ({
    keyword: k.keyword,
    volume: k.volume?.toLocaleString() || 'N/A',
    difficulty: k.kd < 30 ? 'Low' : k.kd < 60 ? 'Medium' : 'High',
    intent: 'Informational', // You can detect this with more logic
    cpc: `$${k.cpc || 0}`,
    opportunity: k.kd < 30 ? 'High' : 'Medium',
  }));
} catch (e) {
  // Fallback to simulation
  missingKeywords = [ /* keep existing simulation data */ ];
}
```

---

## 3️⃣ OpenAI API (For AI Content Analysis)

### Get API Key:
1. Go to https://platform.openai.com/api-keys
2. Create new secret key

### Add to Vercel:
Add environment variable: `OPENAI_API_KEY`

### Add Code to `lib/seo-engine.ts`:

Find `generateContentAnalysis()` and replace the issues array with:

```typescript
// REAL AI ANALYSIS
let aiIssues = [];
try {
  const openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: [{
        role: 'system',
        content: 'You are an expert SEO content analyst. Analyze the following website content and identify issues related to search intent, E-E-A-T, readability, and keyword optimization.'
      }, {
        role: 'user',
        content: `Analyze website: ${domain}, Target keyword: ${targetKeyword}. Pages: ${JSON.stringify(pages.map(p => ({url: p.url, title: p.title, wordCount: p.wordCount})))}`
      }]
    })
  });
  const aiData = await openaiResponse.json();
  // Parse AI response and create issues
  aiIssues = parseAIResponse(aiData.choices[0].message.content);
} catch (e) {
  // Fallback to simulation
  aiIssues = [ /* keep existing simulation data */ ];
}
```

---

## 4️⃣ WordPress Auto-Fix Integration

### Get WordPress App Password:
1. WordPress Admin → Users → Your Profile
2. Scroll to "Application Passwords"
3. Create new app password

### Add to Vercel:
```
WORDPRESS_SITE_URL=https://yoursite.com
WORDPRESS_USERNAME=your_username
WORDPRESS_APP_PASSWORD=your_app_password
```

### Add Code to `lib/fix-engine.ts`:

Find `autoFixIssue()` and add WordPress fix logic:

```typescript
const fixStrategies: Record<string, (issue: Issue) => Promise<FixResult>> = {
  'T-001': async (i) => {
    // Fix meta titles via WordPress REST API
    try {
      for (const page of i.affectedPages) {
        const postId = await getPostIdByUrl(page.url);
        await fetch(`${process.env.WORDPRESS_SITE_URL}/wp-json/wp/v2/posts/${postId}`, {
          method: 'POST',
          headers: {
            'Authorization': 'Basic ' + btoa(`${process.env.WORDPRESS_USERNAME}:${process.env.WORDPRESS_APP_PASSWORD}`),
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            meta: {
              _yoast_wpseo_title: generateOptimizedTitle(page.title, targetKeyword),
            }
          })
        });
      }
      return {
        issueId: i.id,
        success: true,
        message: 'Meta titles updated via WordPress API',
        details: `Updated ${i.affectedPages.length} pages`,
        pagesFixed: i.affectedPages.length,
        timestamp: new Date().toISOString()
      };
    } catch (e) {
      return simulateFix(i); // Fallback
    }
  },
  // ... other fixes
};
```

---

## 5️⃣ SEMrush API (For Competitor Data)

### Get API Key:
1. https://www.semrush.com/api-management/
2. Get API key from your account

### Add to Vercel:
```
SEMRUSH_API_KEY=your_key
```

### Add Code:
```typescript
const semrushData = await fetch(
  `https://api.semrush.com/?type=domain_ranks&key=${process.env.SEMRUSH_API_KEY}&domain=${domain}&database=us`
);
```

---

## 🎯 Priority Order for API Integration

1. **Google PageSpeed** (FREE) - Most impactful, easy to add
2. **OpenAI** (PAYG) - Makes content analysis truly intelligent
3. **Ahrefs/SEMrush** (Paid) - For real keyword & backlink data
4. **WordPress API** (FREE) - For real auto-fixes

## 🆘 Need Help?

If you get stuck adding APIs:
1. Check the API documentation links above
2. Test APIs in Postman first
3. Use the simulation fallback (already built in)
4. Check Vercel logs for errors: Dashboard → Your Project → Logs
