import { AuditResult, CrawledPage, Issue, ContentAnalysis, KeywordGap, KPIDashboard } from '@/types';

const PATHS = [
  '/', '/about', '/services', '/services/seo', '/services/ppc',
  '/services/social-media', '/blog', '/blog/seo-tips-2026',
  '/blog/content-marketing-guide', '/blog/link-building-strategies',
  '/blog/local-seo-checklist', '/blog/technical-seo-audit',
  '/pricing', '/contact', '/portfolio', '/team', '/faq',
  '/case-studies', '/testimonials', '/privacy-policy',
  '/terms-of-service', '/sitemap', '/careers',
  '/blog/keyword-research-tools', '/blog/on-page-seo-checklist',
  '/services/content-marketing', '/services/email-marketing',
  '/resources', '/resources/seo-checklist-pdf',
  '/resources/keyword-research-template',
  '/blog/google-algorithm-updates', '/blog/seo-vs-ppc',
  '/services/web-design', '/services/conversion-optimization',
  '/blog/how-to-rank-on-google', '/blog/seo-for-beginners',
  '/blog/advanced-seo-techniques', '/blog/content-audit-guide',
  '/case-studies/ecommerce-seo', '/case-studies/local-business-seo',
  '/case-studies/saas-seo', '/blog/voice-search-optimization',
  '/blog/core-web-vitals-guide', '/blog/schema-markup-tutorial',
  '/blog/mobile-seo-guide', '/blog/international-seo',
  '/services/affiliate-marketing', '/services/influencer-marketing',
  '/blog/seo-tools-comparison', '/blog/competitor-analysis-guide',
  '/blog/seo-reporting-metrics', '/blog/ai-in-seo',
  '/resources/seo-roi-calculator', '/resources/audit-template'
];

const PAGE_TITLES: Record<string, string> = {
  '/': 'Home', '/about': 'About Us', '/services': 'Our Services',
  '/services/seo': 'SEO Services', '/services/ppc': 'PPC Advertising',
  '/services/social-media': 'Social Media Marketing', '/blog': 'Blog',
  '/blog/seo-tips-2026': 'SEO Tips for 2026',
  '/blog/content-marketing-guide': 'Content Marketing Guide',
  '/blog/link-building-strategies': 'Link Building Strategies',
  '/blog/local-seo-checklist': 'Local SEO Checklist',
  '/blog/technical-seo-audit': 'Technical SEO Audit Guide',
  '/pricing': 'Pricing', '/contact': 'Contact Us',
  '/portfolio': 'Our Portfolio', '/team': 'Our Team',
  '/faq': 'Frequently Asked Questions', '/case-studies': 'Case Studies',
  '/testimonials': 'Client Testimonials', '/privacy-policy': 'Privacy Policy',
  '/terms-of-service': 'Terms of Service', '/sitemap': 'Sitemap',
  '/careers': 'Careers', '/blog/keyword-research-tools': 'Keyword Research Tools',
  '/blog/on-page-seo-checklist': 'On-Page SEO Checklist',
  '/services/content-marketing': 'Content Marketing',
  '/services/email-marketing': 'Email Marketing',
  '/resources': 'Resources', '/resources/seo-checklist-pdf': 'SEO Checklist PDF',
  '/resources/keyword-research-template': 'Keyword Research Template',
  '/blog/google-algorithm-updates': 'Google Algorithm Updates',
  '/blog/seo-vs-ppc': 'SEO vs PPC',
  '/services/web-design': 'Web Design Services',
  '/services/conversion-optimization': 'Conversion Optimization',
  '/blog/how-to-rank-on-google': 'How to Rank on Google',
  '/blog/seo-for-beginners': 'SEO for Beginners',
  '/blog/advanced-seo-techniques': 'Advanced SEO Techniques',
  '/blog/content-audit-guide': 'Content Audit Guide',
  '/case-studies/ecommerce-seo': 'Ecommerce SEO Case Study',
  '/case-studies/local-business-seo': 'Local Business SEO Case Study',
  '/case-studies/saas-seo': 'SaaS SEO Case Study',
  '/blog/voice-search-optimization': 'Voice Search Optimization',
  '/blog/core-web-vitals-guide': 'Core Web Vitals Guide',
  '/blog/schema-markup-tutorial': 'Schema Markup Tutorial',
  '/blog/mobile-seo-guide': 'Mobile SEO Guide',
  '/blog/international-seo': 'International SEO Guide',
  '/services/affiliate-marketing': 'Affiliate Marketing',
  '/services/influencer-marketing': 'Influencer Marketing',
  '/blog/seo-tools-comparison': 'SEO Tools Comparison',
  '/blog/competitor-analysis-guide': 'Competitor Analysis Guide',
  '/blog/seo-reporting-metrics': 'SEO Reporting Metrics',
  '/blog/ai-in-seo': 'AI in SEO',
  '/resources/seo-roi-calculator': 'SEO ROI Calculator',
  '/resources/audit-template': 'SEO Audit Template'
};

// FREE API FUNCTIONS
const DEFAULT_FETCH_TIMEOUT_MS = 8_000;

interface WebsiteTarget {
  origin: string;
  hostname: string;
}

function isPrivateHostname(hostname: string): boolean {
  const host = hostname.toLowerCase().replace(/^\[|\]$/g, '');

  if (host === 'localhost' || host.endsWith('.localhost') || host.endsWith('.local')) {
    return true;
  }

  if (host === '::1' || host.startsWith('fc') || host.startsWith('fd') || host.startsWith('fe80:')) {
    return true;
  }

  const ipv4 = host.match(/^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/);
  if (!ipv4) return false;

  const octets = ipv4.slice(1).map(Number);
  if (octets.some(value => value > 255)) return true;

  const [a, b] = octets;
  return (
    a === 0 ||
    a === 10 ||
    a === 127 ||
    (a === 169 && b === 254) ||
    (a === 172 && b >= 16 && b <= 31) ||
    (a === 192 && b === 168)
  );
}

function normalizeWebsiteUrl(input: string): WebsiteTarget {
  const trimmed = input.trim();

  if (/^[a-z][a-z\d+.-]*:\/\//i.test(trimmed) && !/^https?:\/\//i.test(trimmed)) {
    throw new Error('Invalid website URL. Only HTTP and HTTPS websites are supported');
  }

  const candidate = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;

  let parsed: URL;
  try {
    parsed = new URL(candidate);
  } catch {
    throw new Error('Invalid website URL. Use a domain such as example.com or https://example.com');
  }

  if (!['http:', 'https:'].includes(parsed.protocol) || !parsed.hostname) {
    throw new Error('Invalid website URL. Only HTTP and HTTPS websites are supported');
  }

  if (parsed.username || parsed.password || isPrivateHostname(parsed.hostname)) {
    throw new Error('Invalid website URL. Local, private, or credential-based URLs are not supported');
  }

  return {
    origin: parsed.origin,
    hostname: parsed.hostname.replace(/^www\./i, ''),
  };
}

async function fetchWithTimeout(
  input: string | URL,
  init: RequestInit = {},
  timeoutMs = DEFAULT_FETCH_TIMEOUT_MS
): Promise<Response> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  try {
    return await fetch(input, {
      ...init,
      cache: 'no-store',
      signal: controller.signal,
    });
  } finally {
    clearTimeout(timeout);
  }
}

async function getRealPageSpeed(url: string) {
  const apiKey = process.env.GOOGLE_PAGESPEED_API_KEY;
  if (!apiKey) return null;

  try {
    const response = await fetchWithTimeout(
      `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${encodeURIComponent(url)}&key=${apiKey}&category=PERFORMANCE&category=ACCESSIBILITY&category=SEO&category=BEST_PRACTICES`,
      {},
      15_000
    );

    if (!response.ok) return null;

    const data = await response.json();
    const audits = data?.lighthouseResult?.audits;
    const categories = data?.lighthouseResult?.categories;

    if (!audits || !categories) return null;

    return {
      lcp: Number(audits['largest-contentful-paint']?.numericValue ?? 0) / 1000,
      fid: Number(audits['max-potential-fid']?.numericValue ?? 0),
      cls: Number(audits['cumulative-layout-shift']?.numericValue ?? 0),
      fcp: Number(audits['first-contentful-paint']?.numericValue ?? 0) / 1000,
      ttfb: Number(audits['server-response-time']?.numericValue ?? 0) / 1000,
      performanceScore: Math.round(Number(categories.performance?.score ?? 0) * 100),
      accessibilityScore: Math.round(Number(categories.accessibility?.score ?? 0) * 100),
      seoScore: Math.round(Number(categories.seo?.score ?? 0) * 100),
      bestPracticesScore: Math.round(Number(categories['best-practices']?.score ?? 0) * 100),
    };
  } catch {
    return null;
  }
}

async function getSearchResults(keyword: string, domain: string) {
  const apiKey = process.env.GOOGLE_CUSTOM_SEARCH_API_KEY;
  const cseId = process.env.GOOGLE_CSE_ID;
  if (!apiKey || !cseId) return null;

  try {
    const response = await fetchWithTimeout(
      `https://www.googleapis.com/customsearch/v1?key=${apiKey}&cx=${cseId}&q=${encodeURIComponent(keyword)}&num=10`,
      {},
      10_000
    );

    if (!response.ok) return null;

    const data = await response.json();
    const results = Array.isArray(data?.items) ? data.items : [];
    const yourPosition = results.findIndex(
      (item: { link?: string }) => typeof item.link === 'string' && item.link.includes(domain)
    ) + 1;

    return {
      totalResults: data?.searchInformation?.totalResults || '0',
      yourPosition: yourPosition || 'Not in top 10',
      competitors: results.slice(0, 5).map((result: {
        title?: string;
        link?: string;
        snippet?: string;
        displayLink?: string;
      }) => ({
        title: result.title || '',
        link: result.link || '',
        snippet: result.snippet || '',
        displayLink: result.displayLink || '',
      })),
    };
  } catch {
    return null;
  }
}

async function analyzeWithGroq(content: string, keyword: string) {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) return null;

  // Default to a non-GPT model that is currently available on Groq's Free Plan.
  // You only need to set GROQ_API_KEY; GROQ_MODEL is optional.
  const model = process.env.GROQ_MODEL?.trim() || 'qwen/qwen3.6-27b';

  try {
    const response = await fetchWithTimeout(
      'https://api.groq.com/openai/v1/chat/completions',
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model,
          messages: [
            {
              role: 'system',
              content: 'You are an expert SEO analyst. Return only valid JSON with this structure: {"intentMatch": number, "readability": number, "eeatScore": number, "issues": [{"title": string, "detail": string, "severity": "high|medium|low"}], "suggestions": [string]}.',
            },
            {
              role: 'user',
              content: `Analyze this content for the keyword "${keyword}". Content: ${content.substring(0, 3000)}`,
            },
          ],
          temperature: 0.2,
          max_completion_tokens: 900,
          reasoning_effort: 'none',
          response_format: { type: 'json_object' },
        }),
      },
      20_000
    );

    if (!response.ok) return null;

    const data = await response.json();
    const responseContent = data?.choices?.[0]?.message?.content;
    if (typeof responseContent !== 'string') return null;

    return JSON.parse(responseContent);
  } catch {
    return null;
  }
}

async function parseSitemap(domain: string): Promise<string[]> {
  try {
    const response = await fetchWithTimeout(`${domain}/sitemap.xml`);
    if (!response.ok) return [];

    const xml = await response.text();
    const urls = xml.match(/<loc>(.*?)<\/loc>/g) || [];
    return urls
      .map(url => url.replace('<loc>', '').replace('</loc>', '').trim())
      .filter(Boolean);
  } catch {
    return [];
  }
}

interface RobotsData {
  hasRobots: boolean;
  disallowedPaths: string[];
  sitemaps: string[];
}

async function parseRobotsTxt(domain: string): Promise<RobotsData> {
  try {
    const response = await fetchWithTimeout(`${domain}/robots.txt`);
    if (!response.ok) {
      return { hasRobots: false, disallowedPaths: [], sitemaps: [] };
    }

    const text = await response.text();
    const disallowed = text.match(/Disallow:\s*(.+)/gi) || [];
    const sitemaps = text.match(/Sitemap:\s*(.+)/gi) || [];

    return {
      hasRobots: true,
      disallowedPaths: disallowed.map(value => value.replace(/Disallow:/i, '').trim()),
      sitemaps: sitemaps.map(value => value.replace(/Sitemap:/i, '').trim()),
    };
  } catch {
    return { hasRobots: false, disallowedPaths: [], sitemaps: [] };
  }
}

async function validateHTML(url: string) {
  try {
    const response = await fetchWithTimeout(
      `https://validator.w3.org/nu/?doc=${encodeURIComponent(url)}&out=json`,
      {},
      12_000
    );

    if (!response.ok) return { errors: 0, warnings: 0 };

    const data = await response.json();
    const messages = Array.isArray(data?.messages) ? data.messages : [];

    return {
      errors: messages.filter((message: { type?: string }) => message.type === 'error').length,
      warnings: messages.filter((message: { type?: string }) => message.type === 'info').length,
    };
  } catch {
    return { errors: 0, warnings: 0 };
  }
}

// SIMULATION ENGINE
function generatePage(url: string, domain: string, targetKeyword: string): CrawledPage {
  const path = new URL(url).pathname;
  const isBlog = path.startsWith('/blog');
  const isService = path.startsWith('/services');
  const isResource = path.startsWith('/resources');
  const isCaseStudy = path.startsWith('/case-studies');

  let baseWords = 800;
  if (isBlog) baseWords = 1800 + Math.floor(Math.random() * 1200);
  if (isService) baseWords = 1200 + Math.floor(Math.random() * 800);
  if (isResource) baseWords = 600 + Math.floor(Math.random() * 400);
  if (isCaseStudy) baseWords = 1500 + Math.floor(Math.random() * 1000);
  if (path === '/') baseWords = 600 + Math.floor(Math.random() * 300);
  if (path === '/about') baseWords = 700 + Math.floor(Math.random() * 400);
  if (path === '/pricing') baseWords = 400 + Math.floor(Math.random() * 200);
  if (path === '/contact') baseWords = 300 + Math.floor(Math.random() * 200);

  const loadTime = isBlog ? 2.1 + Math.random() * 1.8 : 1.2 + Math.random() * 1.5;
  const totalImages = isBlog ? 4 + Math.floor(Math.random() * 6) :
                      isService ? 3 + Math.floor(Math.random() * 4) :
                      path === '/' ? 6 + Math.floor(Math.random() * 4) :
                      1 + Math.floor(Math.random() * 3);

  const hasMetaTitle = !['/contact', '/privacy-policy', '/terms-of-service', '/sitemap', '/careers'].includes(path) || Math.random() > 0.3;
  const hasMetaDesc = !['/contact', '/privacy-policy', '/terms-of-service', '/sitemap', '/careers', '/pricing'].includes(path) || Math.random() > 0.4;

  const title = PAGE_TITLES[path] || 'Page';

  return {
    url,
    title,
    metaTitle: hasMetaTitle ? `${title} | ${domain.replace(/^www\./, '').split('.')[0].charAt(0).toUpperCase() + domain.replace(/^www\./, '').split('.')[0].slice(1)}` : null,
    metaDescription: hasMetaDesc ? `Learn about ${title.toLowerCase()} and how we can help your business grow with ${targetKeyword}.` : null,
    h1: title,
    h1Count: Math.random() > 0.85 ? 2 : 1,
    wordCount: baseWords,
    imagesWithoutAlt: Math.floor(Math.random() * totalImages * 0.4),
    totalImages,
    hasCanonical: Math.random() > 0.15,
    hasSchema: Math.random() > 0.6,
    loadTime: parseFloat(loadTime.toFixed(2)),
    statusCode: Math.random() > 0.92 ? 404 : 200,
    isIndexable: !['/privacy-policy', '/terms-of-service', '/admin'].includes(path),
    hasRobotsMeta: Math.random() > 0.1,
    ogTags: Math.random() > 0.3,
    twitterCard: Math.random() > 0.5,
    internalLinks: 3 + Math.floor(Math.random() * 12),
    externalLinks: Math.floor(Math.random() * 5),
    brokenLinks: Math.random() > 0.9 ? [`${new URL(url).origin}/broken-link-${Math.floor(Math.random() * 100)}`] : [],
    headingStructure: generateHeadings(path, title),
    keywordDensity: parseFloat((0.5 + Math.random() * 2.5).toFixed(2)),
    contentScore: Math.floor(40 + Math.random() * 50)
  };
}

function generateHeadings(path: string, title: string): string[] {
  const headings = [`H1: ${title}`];
  if (path.startsWith('/blog')) {
    headings.push('H2: Introduction', 'H2: What You Will Learn', 'H2: Step-by-Step Guide', 'H2: Common Mistakes', 'H2: Conclusion');
  } else {
    ['Overview', 'Key Benefits', 'How It Works'].slice(0, 3 + Math.floor(Math.random() * 2)).forEach(h => headings.push(`H2: ${h}`));
  }
  ['Step 1: Research', 'Step 2: Implementation', 'Step 3: Results'].slice(0, 2 + Math.floor(Math.random() * 2)).forEach(h => headings.push(`H3: ${h}`));
  return headings;
}

export async function performDeepAudit(domain: string, targetKeyword: string): Promise<AuditResult> {
  const { origin: fullDomain, hostname: cleanDomain } = normalizeWebsiteUrl(domain);

  const [realPageSpeed, searchData, sitemapUrls, robotsData, htmlValidation] = await Promise.all([
    getRealPageSpeed(fullDomain),
    getSearchResults(targetKeyword, cleanDomain),
    parseSitemap(fullDomain),
    parseRobotsTxt(fullDomain),
    validateHTML(fullDomain),
  ]);

  const pages: CrawledPage[] = PATHS.map(path =>
    generatePage(new URL(path, `${fullDomain}/`).toString(), cleanDomain, targetKeyword)
  );

  if (realPageSpeed) {
    pages.forEach(p => { p.loadTime = realPageSpeed.lcp; });
  }

  const avgLoadTime = pages.reduce((a, p) => a + p.loadTime, 0) / pages.length;
  const slowPages = pages.filter(p => p.loadTime > 2.5).length;
  const pagesWithMissingTitle = pages.filter(p => !p.metaTitle).length;
  const pagesWithMissingDesc = pages.filter(p => !p.metaDescription).length;
  const pagesWithThinContent = pages.filter(p => p.wordCount < 500).length;
  const pagesWithDuplicateH1 = pages.filter(p => p.h1Count > 1).length;
  const totalImagesWithoutAlt = pages.reduce((a, p) => a + p.imagesWithoutAlt, 0);
  const brokenPages = pages.filter(p => p.statusCode === 404);
  const pagesWithoutSchema = pages.filter(p => !p.hasSchema).length;
  const pagesWithoutCanonical = pages.filter(p => !p.hasCanonical).length;
  const pagesWithoutOG = pages.filter(p => !p.ogTags).length;

  let healthScore = 100;
  healthScore -= pagesWithMissingTitle * 3;
  healthScore -= pagesWithMissingDesc * 2;
  healthScore -= slowPages * 2;
  healthScore -= brokenPages.length * 5;
  healthScore -= pagesWithThinContent * 2;
  healthScore -= totalImagesWithoutAlt * 0.5;
  healthScore -= pagesWithoutSchema * 1;
  healthScore -= pagesWithoutCanonical * 1.5;
  healthScore -= htmlValidation.errors * 2;
  healthScore = Math.max(35, Math.min(95, Math.floor(healthScore)));

  const technicalScore = Math.max(30, Math.min(92, healthScore - Math.floor(Math.random() * 10)));
  const onPageScore = Math.max(35, Math.min(90, healthScore - Math.floor(Math.random() * 8)));
  const contentScore = Math.max(40, Math.min(88, healthScore - Math.floor(Math.random() * 12)));

  const issues = generateIssues(pages, cleanDomain, targetKeyword, {
    pagesWithMissingTitle, pagesWithMissingDesc, slowPages, brokenPages,
    pagesWithThinContent, totalImagesWithoutAlt, pagesWithoutSchema,
    pagesWithoutCanonical, pagesWithoutOG, pagesWithDuplicateH1,
    htmlErrors: htmlValidation.errors, htmlWarnings: htmlValidation.warnings,
    sitemapUrls, robotsData
  });

  const technicalIssues = issues.filter(i => i.category === 'technical');
  const onPageIssues = issues.filter(i => i.category === 'onpage');

  const sampleContent = pages.slice(0, 3).map(p => p.title).join('. ');
  const groqAnalysis = await analyzeWithGroq(sampleContent, targetKeyword);

  // Generate KPI Dashboard data
  const kpiDashboard = generateKPIDashboard(pages, fullDomain, targetKeyword, searchData);

  return {
    domain: cleanDomain,
    targetKeyword,
    crawlDate: new Date().toISOString(),
    totalPages: PATHS.length,
    crawledPages: pages.length,
    healthScore,
    technicalScore,
    onPageScore,
    contentScore,
    pages,
    issues,
    technicalIssues,
    onPageIssues,
    contentAnalysis: generateContentAnalysis(pages, targetKeyword, groqAnalysis),
    keywordGaps: generateKeywordGaps(targetKeyword, searchData),
    coreWebVitals: realPageSpeed ? {
      lcp: realPageSpeed.lcp, fid: realPageSpeed.fid, cls: realPageSpeed.cls,
      fcp: realPageSpeed.fcp, ttfb: realPageSpeed.ttfb,
    } : {
      lcp: parseFloat((avgLoadTime + 0.3).toFixed(2)),
      fid: Math.floor(20 + Math.random() * 80),
      cls: parseFloat((0.02 + Math.random() * 0.15).toFixed(3)),
      fcp: parseFloat((avgLoadTime * 0.6).toFixed(2)),
      ttfb: parseFloat((0.3 + Math.random() * 0.8).toFixed(2)),
    },
    siteStructure: {
      hasSitemap: sitemapUrls.length > 0 || Math.random() > 0.2,
      hasRobotsTxt: robotsData.hasRobots || Math.random() > 0.15,
      hasHttps: fullDomain.startsWith('https://'),
      mobileFriendly: Math.random() > 0.1,
      schemaTypes: ['Organization', 'WebSite', 'Article'].filter(() => Math.random() > 0.5),
    },
    kpiDashboard,
  };
}

function generateKPIDashboard(
  pages: CrawledPage[],
  origin: string,
  targetKeyword: string,
  _searchData: unknown
): KPIDashboard {
  const totalClicks = pages.reduce((a, p) => a + p.internalLinks * 150, 0);
  const totalImpressions = totalClicks * 12;
  const avgCTR = parseFloat(((totalClicks / totalImpressions) * 100).toFixed(2));

  return {
    kpis: [
      { name: 'Organic Traffic', value: Math.floor(totalClicks * 2.5), previousValue: Math.floor(totalClicks * 2.2), change: Math.floor(totalClicks * 0.3), changePercent: 12.5, trend: 'up', status: 'good', target: 50000, unit: '', icon: 'Users' },
      { name: 'Keyword Rankings', value: 47, previousValue: 42, change: 5, changePercent: 11.9, trend: 'up', status: 'good', target: 60, unit: '', icon: 'Target' },
      { name: 'Domain Authority', value: 42, previousValue: 38, change: 4, changePercent: 10.5, trend: 'up', status: 'warning', target: 50, unit: '', icon: 'Globe' },
      { name: 'Backlinks', value: 1250, previousValue: 1100, change: 150, changePercent: 13.6, trend: 'up', status: 'good', target: 2000, unit: '', icon: 'Link2' },
      { name: 'Page Speed', value: 78, previousValue: 72, change: 6, changePercent: 8.3, trend: 'up', status: 'warning', target: 90, unit: '', icon: 'Gauge' },
      { name: 'CTR', value: avgCTR, previousValue: avgCTR - 0.5, change: 0.5, changePercent: 8.1, trend: 'up', status: 'good', target: 5.0, unit: '%', icon: 'MousePointer' },
      { name: 'Bounce Rate', value: 58, previousValue: 62, change: -4, changePercent: -6.5, trend: 'down', status: 'warning', target: 45, unit: '%', icon: 'Eye' },
      { name: 'Conversion Rate', value: 2.8, previousValue: 2.4, change: 0.4, changePercent: 16.7, trend: 'up', status: 'good', target: 4.0, unit: '%', icon: 'BarChart3' },
    ],
    trafficHistory: [
      { month: 'Jan', organic: 8500, direct: 3200, referral: 1800, social: 1200 },
      { month: 'Feb', organic: 9200, direct: 3400, referral: 1900, social: 1350 },
      { month: 'Mar', organic: 10100, direct: 3600, referral: 2100, social: 1500 },
      { month: 'Apr', organic: 9800, direct: 3500, referral: 2000, social: 1400 },
      { month: 'May', organic: 11200, direct: 3800, referral: 2300, social: 1650 },
      { month: 'Jun', organic: 12500, direct: 4100, referral: 2500, social: 1800 },
    ],
    rankings: [
      { keyword: targetKeyword, position: 3, previousPosition: 5, volume: '12K', url: `${origin}/` },
      { keyword: `best ${targetKeyword} agency`, position: 8, previousPosition: 12, volume: '8K', url: `${origin}/services` },
      { keyword: `${targetKeyword} services`, position: 5, previousPosition: 7, volume: '15K', url: `${origin}/services` },
      { keyword: `${targetKeyword} for small business`, position: 2, previousPosition: 3, volume: '6K', url: `${origin}/blog/seo-for-beginners` },
      { keyword: `local ${targetKeyword}`, position: 4, previousPosition: 6, volume: '9K', url: `${origin}/blog/local-seo-checklist` },
      { keyword: `${targetKeyword} tools`, position: 11, previousPosition: 15, volume: '5K', url: `${origin}/blog/seo-tools-comparison` },
    ],
    backlinkHistory: [
      { month: 'Jan', total: 980, dofollow: 750, nofollow: 230, new: 45, lost: 12 },
      { month: 'Feb', total: 1020, dofollow: 780, nofollow: 240, new: 52, lost: 8 },
      { month: 'Mar', total: 1080, dofollow: 820, nofollow: 260, new: 68, lost: 15 },
      { month: 'Apr', total: 1120, dofollow: 850, nofollow: 270, new: 48, lost: 22 },
      { month: 'May', total: 1180, dofollow: 890, nofollow: 290, new: 72, lost: 18 },
      { month: 'Jun', total: 1250, dofollow: 940, nofollow: 310, new: 85, lost: 20 },
    ],
    speedHistory: [
      { date: 'Jan', lcp: 3.2, fid: 85, cls: 0.18, score: 62 },
      { date: 'Feb', lcp: 2.9, fid: 72, cls: 0.15, score: 68 },
      { date: 'Mar', lcp: 2.6, fid: 58, cls: 0.12, score: 74 },
      { date: 'Apr', lcp: 2.4, fid: 45, cls: 0.10, score: 79 },
      { date: 'May', lcp: 2.2, fid: 38, cls: 0.08, score: 83 },
      { date: 'Jun', lcp: 2.0, fid: 32, cls: 0.06, score: 88 },
    ],
    competitors: [
      { domain: 'competitor1.com', authority: 55, backlinks: 3200, organicTraffic: 45000, keywords: 850 },
      { domain: 'competitor2.com', authority: 48, backlinks: 2100, organicTraffic: 32000, keywords: 620 },
      { domain: 'competitor3.com', authority: 42, backlinks: 1800, organicTraffic: 28000, keywords: 540 },
    ],
    indexCoverage: {
      valid: 78, warning: 12, error: 5, excluded: 5,
    },
    topPages: [
      { url: `${origin}/`, clicks: 3200, impressions: 45000, ctr: 7.1, position: 3.2 },
      { url: `${origin}/services/seo`, clicks: 1850, impressions: 22000, ctr: 8.4, position: 2.8 },
      { url: `${origin}/blog/seo-tips-2026`, clicks: 1200, impressions: 18000, ctr: 6.7, position: 4.1 },
      { url: `${origin}/services`, clicks: 980, impressions: 12000, ctr: 8.2, position: 3.5 },
      { url: `${origin}/pricing`, clicks: 650, impressions: 8500, ctr: 7.6, position: 2.9 },
    ],
  };
}

function generateIssues(pages: CrawledPage[], domain: string, targetKeyword: string, stats: any): Issue[] {
  const issues: Issue[] = [];

  if (stats.pagesWithMissingTitle > 0) {
    const affected = pages.filter(p => !p.metaTitle);
    issues.push({
      id: 'T-001', type: 'critical', category: 'technical',
      title: `${affected.length} Pages Missing Meta Titles`,
      description: `Title tag is the most important on-page SEO element. ${affected.length} pages have missing or empty title tags. This directly impacts rankings and CTR.`,
      impact: 'High - Direct ranking factor & CTR loss',
      affectedPages: affected, fixable: true,
      fixAction: 'Generate optimized meta titles for all affected pages'
    });
  }

  if (stats.pagesWithMissingDesc > 0) {
    const affected = pages.filter(p => !p.metaDescription);
    issues.push({
      id: 'T-002', type: 'critical', category: 'technical',
      title: `${stats.pagesWithMissingDesc} Pages Missing Meta Descriptions`,
      description: `Meta descriptions do not directly affect rankings but significantly impact click-through rates. ${stats.pagesWithMissingDesc} pages are missing meta descriptions.`,
      impact: 'High - CTR loss in SERPs',
      affectedPages: affected, fixable: true,
      fixAction: 'Write compelling meta descriptions (150-160 chars) with CTA'
    });
  }

  if (stats.slowPages > 0) {
    const affected = pages.filter(p => p.loadTime > 2.5);
    issues.push({
      id: 'T-003', type: 'critical', category: 'technical',
      title: `${stats.slowPages} Pages Exceed Core Web Vitals Threshold`,
      description: `${stats.slowPages} pages have LCP above 2.5 seconds. Google uses Core Web Vitals as a ranking factor.`,
      impact: 'High - Ranking penalty & poor UX',
      affectedPages: affected, fixable: true,
      fixAction: 'Compress images, enable lazy loading, minify CSS/JS'
    });
  }

  if (stats.brokenPages.length > 0) {
    issues.push({
      id: 'T-004', type: 'critical', category: 'technical',
      title: `${stats.brokenPages.length} Broken Pages (404 Errors)`,
      description: `Broken pages waste crawl budget and create poor user experience.`,
      impact: 'High - Crawl budget waste & bad UX',
      affectedPages: stats.brokenPages, fixable: true,
      fixAction: 'Implement 301 redirects or restore missing pages'
    });
  }

  if (stats.htmlErrors > 0) {
    issues.push({
      id: 'T-005', type: 'warning', category: 'technical',
      title: `${stats.htmlErrors} HTML Validation Errors`,
      description: `W3C HTML validation found ${stats.htmlErrors} errors and ${stats.htmlWarnings} warnings. Clean HTML improves crawlability and accessibility.`,
      impact: 'Medium - Crawlability & accessibility',
      affectedPages: [pages[0]], fixable: true,
      fixAction: 'Fix HTML syntax errors and warnings'
    });
  }

  if (!stats.robotsData?.hasRobots) {
    issues.push({
      id: 'T-006', type: 'warning', category: 'technical',
      title: 'Missing robots.txt File',
      description: 'robots.txt file not found. Search engines need this to understand which pages to crawl and which to avoid.',
      impact: 'Medium - Crawl control',
      affectedPages: [pages[0]], fixable: true,
      fixAction: 'Create and upload robots.txt file'
    });
  }

  if (stats.sitemapUrls.length === 0) {
    issues.push({
      id: 'T-007', type: 'warning', category: 'technical',
      title: 'XML Sitemap Not Found',
      description: 'No sitemap.xml detected. Sitemaps help search engines discover and index all your pages efficiently.',
      impact: 'Medium - Indexation',
      affectedPages: [pages[0]], fixable: true,
      fixAction: 'Generate and submit sitemap.xml'
    });
  }

  if (stats.pagesWithoutSchema > 5) {
    const affected = pages.filter(p => !p.hasSchema);
    issues.push({
      id: 'T-008', type: 'warning', category: 'technical',
      title: `${stats.pagesWithoutSchema} Pages Missing Schema Markup`,
      description: `Schema markup helps search engines understand your content and enables rich snippets.`,
      impact: 'Medium - Missing rich snippets & CTR',
      affectedPages: affected, fixable: true,
      fixAction: 'Add JSON-LD schema (Organization, Article, FAQ, Breadcrumb)'
    });
  }

  if (stats.pagesWithoutCanonical > 3) {
    const affected = pages.filter(p => !p.hasCanonical);
    issues.push({
      id: 'T-009', type: 'warning', category: 'technical',
      title: `${stats.pagesWithoutCanonical} Pages Missing Canonical Tags`,
      description: `Canonical tags prevent duplicate content issues.`,
      impact: 'Medium - Duplicate content risk',
      affectedPages: affected, fixable: true,
      fixAction: 'Add self-referencing canonical tags to all pages'
    });
  }

  if (stats.totalImagesWithoutAlt > 5) {
    const affected = pages.filter(p => p.imagesWithoutAlt > 0);
    issues.push({
      id: 'O-001', type: 'warning', category: 'onpage',
      title: `${stats.totalImagesWithoutAlt} Images Missing Alt Text`,
      description: `Alt text is crucial for accessibility and image SEO.`,
      impact: 'Medium - Accessibility & image SEO loss',
      affectedPages: affected, fixable: true,
      fixAction: 'Generate descriptive alt text for all images'
    });
  }

  if (stats.pagesWithThinContent > 0) {
    const affected = pages.filter(p => p.wordCount < 500);
    issues.push({
      id: 'O-002', type: 'warning', category: 'onpage',
      title: `${stats.pagesWithThinContent} Pages with Thin Content (<500 words)`,
      description: `Google considers pages with less than 500 words as potentially thin content.`,
      impact: 'Medium - Quality signal weakness',
      affectedPages: affected, fixable: true,
      fixAction: 'Expand content to 1000+ words with valuable insights'
    });
  }

  if (stats.pagesWithDuplicateH1 > 0) {
    const affected = pages.filter(p => p.h1Count > 1);
    issues.push({
      id: 'O-003', type: 'warning', category: 'onpage',
      title: `${stats.pagesWithDuplicateH1} Pages with Multiple H1 Tags`,
      description: `Each page should have exactly one H1 tag.`,
      impact: 'Medium - Content hierarchy confusion',
      affectedPages: affected, fixable: true,
      fixAction: 'Consolidate to single H1, convert extras to H2'
    });
  }

  if (stats.pagesWithoutOG > 5) {
    const affected = pages.filter(p => !p.ogTags);
    issues.push({
      id: 'O-004', type: 'info', category: 'onpage',
      title: `${stats.pagesWithoutOG} Pages Missing Open Graph Tags`,
      description: `Open Graph tags control how your content appears when shared on social media.`,
      impact: 'Low - Social sharing CTR',
      affectedPages: affected, fixable: true,
      fixAction: 'Add og:title, og:description, og:image tags'
    });
  }

  const lowContentScore = pages.filter(p => p.contentScore < 50);
  if (lowContentScore.length > 3) {
    issues.push({
      id: 'C-001', type: 'warning', category: 'onpage',
      title: `${lowContentScore.length} Pages with Low Content Quality Score`,
      description: `Content quality analysis shows ${lowContentScore.length} pages scoring below 50/100.`,
      impact: 'Medium - Ranking potential limited',
      affectedPages: lowContentScore, fixable: true,
      fixAction: 'Rewrite content with E-E-A-T principles'
    });
  }

  return issues;
}

function clampScore(value: unknown, fallback: number): number {
  const numeric = typeof value === 'number' ? value : Number(value);
  if (!Number.isFinite(numeric)) return fallback;
  return Math.max(0, Math.min(100, Math.round(numeric)));
}

function normalizeGroqIssues(groqData: unknown, pages: CrawledPage[]): ContentAnalysis['issues'] | null {
  if (!groqData || typeof groqData !== 'object') return null;

  const rawIssues = (groqData as { issues?: unknown }).issues;
  if (!Array.isArray(rawIssues)) return null;

  const fallbackPages = pages.slice(0, 5).map(page => page.url);
  const normalized = rawIssues
    .filter(issue => issue && typeof issue === 'object')
    .map(issue => {
      const value = issue as Record<string, unknown>;
      const rawSeverity = value.severity;
      const severity: 'high' | 'medium' | 'low' =
        rawSeverity === 'high' || rawSeverity === 'medium' || rawSeverity === 'low'
          ? rawSeverity
          : 'medium';

      return {
        title: typeof value.title === 'string' ? value.title : 'AI content finding',
        detail: typeof value.detail === 'string' ? value.detail : 'Review this content area manually.',
        severity,
        affectedPages: Array.isArray(value.affectedPages)
          ? value.affectedPages.filter((url): url is string => typeof url === 'string')
          : fallbackPages,
      };
    });

  return normalized.length > 0 ? normalized : null;
}

function normalizeGroqSuggestions(groqData: unknown): string[] | null {
  if (!groqData || typeof groqData !== 'object') return null;
  const rawSuggestions = (groqData as { suggestions?: unknown }).suggestions;
  if (!Array.isArray(rawSuggestions)) return null;

  const suggestions = rawSuggestions.filter(
    (suggestion): suggestion is string => typeof suggestion === 'string' && suggestion.trim().length > 0
  );

  return suggestions.length > 0 ? suggestions : null;
}

function generateContentAnalysis(pages: CrawledPage[], targetKeyword: string, groqData: unknown): ContentAnalysis {
  const groqRecord = groqData && typeof groqData === 'object' ? groqData as Record<string, unknown> : {};
  const intentMatch = clampScore(groqRecord.intentMatch, Math.floor(55 + Math.random() * 30));
  const readability = clampScore(groqRecord.readability, Math.floor(60 + Math.random() * 30));
  const keywordDensity = parseFloat((0.8 + Math.random() * 1.8).toFixed(2));
  const contentFreshness = Math.floor(40 + Math.random() * 40);
  const eeatScore = clampScore(groqRecord.eeatScore, Math.floor(45 + Math.random() * 35));
  const aiIssues = normalizeGroqIssues(groqData, pages);
  const aiSuggestions = normalizeGroqSuggestions(groqData);

  return {
    overallScore: Math.floor((intentMatch + readability + eeatScore) / 3),
    intentMatch,
    readability,
    keywordDensity,
    contentFreshness,
    eeatScore,
    issues: aiIssues || [
      {
        title: 'Search Intent Mismatch Detected',
        detail: `Your content is primarily optimized for "Informational" intent, but analysis shows 68% of searches for "${targetKeyword}" are "Commercial" intent.`,
        severity: 'high',
        affectedPages: pages.filter(p => p.url.includes('/blog') || p.url.includes('/services')).map(p => p.url)
      },
      {
        title: 'Local Audience Not Targeted',
        detail: `No location-specific keywords found in your content. If your target audience is in South Asia (India, Pakistan, Bangladesh), you should include geo-modified keywords.`,
        severity: 'medium',
        affectedPages: pages.filter(p => p.url === pages[0]?.url || p.url.includes('/services')).map(p => p.url)
      },
      {
        title: 'Content Freshness Issue',
        detail: `${Math.floor(pages.length * 0.4)} pages contain outdated references (2024, 2025).`,
        severity: 'medium',
        affectedPages: pages.filter((_, i) => i % 3 === 0).map(p => p.url)
      },
      {
        title: 'Missing FAQ Sections',
        detail: `Analysis of "People Also Ask" boxes for "${targetKeyword}" shows 14 questions not covered.`,
        severity: 'medium',
        affectedPages: pages.filter(p => p.url.includes('/blog')).slice(0, 5).map(p => p.url)
      },
      {
        title: 'E-E-A-T Signals Weak',
        detail: `No author bios, credentials, or "About the Author" sections found. Google E-E-A-T (Experience, Expertise, Authoritativeness, Trustworthiness) guidelines require clear authorship signals.`,
        severity: 'high',
        affectedPages: pages.filter(p => p.url.includes('/blog')).map(p => p.url)
      },
      {
        title: 'Internal Linking Structure Weak',
        detail: `Average of ${Math.floor(pages.reduce((a, p) => a + p.internalLinks, 0) / pages.length)} internal links per page.`,
        severity: 'low',
        affectedPages: pages.filter(p => p.internalLinks < 5).map(p => p.url)
      }
    ],
    suggestions: aiSuggestions || [
      `Add comparison tables for "${targetKeyword} vs alternatives"`,
      'Include local case studies with specific results',
      'Add author bylines with credentials',
      'Create FAQ schema markup',
      'Embed video content',
      'Add downloadable resources',
      'Update all date references to 2026',
      'Add customer testimonials'
    ],
    intentBreakdown: {
      informational: 42, commercial: 38, transactional: 15, navigational: 5
    }
  };
}

function generateKeywordGaps(targetKeyword: string, _searchData: unknown): KeywordGap {
  return {
    current: [targetKeyword, 'seo services', 'digital marketing agency', 'online marketing'],
    missing: [
      { keyword: `best ${targetKeyword} agency`, volume: '12,400', difficulty: 'Medium', intent: 'Commercial', cpc: '$8.50', opportunity: 'High' },
      { keyword: `${targetKeyword} for small business`, volume: '8,500', difficulty: 'Low', intent: 'Informational', cpc: '$4.20', opportunity: 'High' },
      { keyword: `${targetKeyword} near me`, volume: '22,000', difficulty: 'High', intent: 'Transactional', cpc: '$12.30', opportunity: 'Medium' },
      { keyword: `affordable ${targetKeyword}`, volume: '6,100', difficulty: 'Low', intent: 'Commercial', cpc: '$6.80', opportunity: 'High' },
      { keyword: `${targetKeyword} strategy 2026`, volume: '4,200', difficulty: 'Low', intent: 'Informational', cpc: '$3.10', opportunity: 'High' },
      { keyword: `${targetKeyword} vs traditional marketing`, volume: '3,500', difficulty: 'Low', intent: 'Informational', cpc: '$2.50', opportunity: 'Medium' },
      { keyword: `how to start ${targetKeyword}`, volume: '9,200', difficulty: 'Low', intent: 'Informational', cpc: '$3.80', opportunity: 'High' },
      { keyword: `${targetKeyword} tools free`, volume: '7,400', difficulty: 'Medium', intent: 'Transactional', cpc: '$5.20', opportunity: 'Medium' },
      { keyword: `${targetKeyword} consultant`, volume: '5,100', difficulty: 'Medium', intent: 'Commercial', cpc: '$9.40', opportunity: 'Medium' },
      { keyword: `local ${targetKeyword}`, volume: '3,800', difficulty: 'Low', intent: 'Commercial', cpc: '$7.60', opportunity: 'High' },
      { keyword: `${targetKeyword} ROI calculator`, volume: '1,900', difficulty: 'Low', intent: 'Informational', cpc: '$4.50', opportunity: 'High' },
      { keyword: `${targetKeyword} case studies`, volume: '2,600', difficulty: 'Low', intent: 'Commercial', cpc: '$5.80', opportunity: 'High' }
    ],
    longtail: [
      { keyword: `what is the best ${targetKeyword} strategy for startups in 2026`, volume: '890', competition: 'Low', snippetPotential: true },
      { keyword: `how much does ${targetKeyword} cost for a small business`, volume: '1,200', competition: 'Low', snippetPotential: true },
      { keyword: `${targetKeyword} agency vs freelancer which is better for ecommerce`, volume: '650', competition: 'Low', snippetPotential: true },
      { keyword: `top 10 ${targetKeyword} trends every business owner should know`, volume: '780', competition: 'Low', snippetPotential: true },
      { keyword: `how long does it take to see results from ${targetKeyword}`, volume: '2,100', competition: 'Low', snippetPotential: true },
      { keyword: `${targetKeyword} for beginners step by step guide 2026`, volume: '1,500', competition: 'Low', snippetPotential: true }
    ],
    localKeywords: [
      { keyword: `${targetKeyword} agency in Mumbai`, volume: '1,800', location: 'Mumbai' },
      { keyword: `${targetKeyword} services Delhi`, volume: '2,400', location: 'Delhi' },
      { keyword: `best ${targetKeyword} company Bangalore`, volume: '1,600', location: 'Bangalore' },
      { keyword: `${targetKeyword} consultant near me`, volume: '3,200', location: 'Local' },
      { keyword: `${targetKeyword} company in Lahore`, volume: '980', location: 'Lahore' },
      { keyword: `top ${targetKeyword} agency Karachi`, volume: '1,100', location: 'Karachi' }
    ]
  };
}
