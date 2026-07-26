# 🕷️ DeepCrawl SEO AI Agent

Advanced AI-powered website auditor with **FREE APIs only**! Performs deep crawls, technical SEO analysis, on-page optimization, content intent analysis, and auto-fixes.

## ✨ Features

- 🔍 **Deep Website Crawl** - Crawls entire site structure
- 🔧 **Technical SEO Audit** - Core Web Vitals, Schema, broken links, speed
- 📄 **On-Page SEO Audit** - Meta tags, headings, alt text, thin content
- ✍️ **Content Analysis** - Search intent matching, E-E-A-T, readability
- 🎯 **Keyword Gap Analysis** - Missing keywords, long-tail opportunities
- 🔨 **Auto-Fix Engine** - One-click fixes for all issues
- 📊 **Real-time Reports** - Detailed dashboards with expandable page lists

## 🆓 FREE APIs Used (No Paid APIs Required!)

| API | FREE Limit | Use For |
|-----|-----------|---------|
| **Google PageSpeed** | 25,000/day | Core Web Vitals, Performance |
| **Google Custom Search** | 100/day | SERP analysis, competitors |
| **Groq AI** | Free Plan limits apply | AI content analysis with Qwen 3.6 27B |
| **Hugging Face** | Very generous | AI keyword extraction |
| **URLScan.io** | 1/min | Screenshots, security, tech stack |
| **BuiltWith** | 1,000/month | Tech stack detection |
| **SecurityTrails** | 50/month | Subdomains, DNS records |
| **W3C Validator** | Unlimited | HTML validation |
| **Open PageRank** | Unlimited | Domain authority |
| **Sitemap/Robots** | Unlimited | Site structure (no key needed) |

**Total cost: $0** ✅

## 🚀 Quick Deploy to Vercel

### Step 1: Get FREE API Keys (5 minutes)

1. **Google PageSpeed** → https://developers.google.com/speed/docs/insights/v5/get-started
2. **Google Custom Search** → https://developers.google.com/custom-search/v1/introduction
3. **Groq AI** → https://console.groq.com/keys

### Step 2: Upload to GitHub

1. Go to [github.com](https://github.com) and create a new repository
2. Name it `seo-ai-agent`
3. Upload all files from this zip
4. Commit the files

### Step 3: Connect to Vercel

1. Go to [vercel.com](https://vercel.com)
2. Sign up / Log in with your GitHub account
3. Click "Add New Project"
4. Select your `seo-ai-agent` repository
5. Add your FREE API keys in Environment Variables:
   ```
   GOOGLE_PAGESPEED_API_KEY=your_key
   GOOGLE_CUSTOM_SEARCH_API_KEY=your_key
   GOOGLE_CSE_ID=your_cse_id
   GROQ_API_KEY=your_key
   GROQ_MODEL=qwen/qwen3.6-27b
   ```
6. Click "Deploy"
7. Done! 🎉

## 📁 Project Structure

```
seo-ai-agent/
├── app/
│   ├── api/
│   │   ├── audit/route.ts      # API: Start SEO audit
│   │   └── fix/route.ts        # API: Apply auto-fixes
│   ├── layout.tsx
│   ├── page.tsx                # Main UI
│   └── globals.css
├── components/
│   ├── audit/                  # Audit panels
│   │   ├── TechnicalIssues.tsx
│   │   ├── OnPageIssues.tsx
│   │   ├── ContentAnalysis.tsx
│   │   ├── KeywordGaps.tsx
│   │   └── AutoFixPanel.tsx
│   ├── dashboard/
│   │   ├── OverviewCards.tsx
│   │   └── AuditTabs.tsx
│   └── CrawlProgress.tsx
├── lib/
│   ├── seo-engine.ts           # Core audit logic + FREE APIs
│   └── fix-engine.ts           # Auto-fix logic
├── types/
│   └── index.ts                # TypeScript types
├── .env.example                # FREE API key template
├── FREE_API_GUIDE.md           # Detailed FREE API guide
└── API_INTEGRATION_GUIDE.md    # How to add more APIs
```

## 🔌 How FREE APIs Work

The app **automatically tries FREE APIs first**. If API keys are not set, it falls back to realistic simulation data.

### Priority Order:
1. **Google PageSpeed** → Real Core Web Vitals
2. **Groq AI** → Real AI content analysis
3. **Google Custom Search** → Real SERP data
4. **URLScan.io** → Real screenshots & security
5. **Sitemap/Robots parsers** → Real site structure (no key needed!)
6. **W3C Validator** → Real HTML errors (no key needed!)

## 📖 Documentation

- `FREE_API_GUIDE.md` - Complete list of FREE APIs with code examples
- `API_INTEGRATION_GUIDE.md` - How to add more APIs later
- `.env.example` - All API keys you can get for FREE

## 🎨 Customization

### Change Brand Colors

Edit `tailwind.config.js`:
```js
colors: {
  primary: { 
    500: '#00f5a0',
    600: '#00d9f5',
  }
}
```

## 📄 License

MIT License - Free to use and modify.
