export interface CrawledPage {
  url: string;
  title: string;
  metaTitle: string | null;
  metaDescription: string | null;
  h1: string | null;
  h1Count: number;
  wordCount: number;
  imagesWithoutAlt: number;
  totalImages: number;
  hasCanonical: boolean;
  hasSchema: boolean;
  loadTime: number;
  statusCode: number;
  isIndexable: boolean;
  hasRobotsMeta: boolean;
  ogTags: boolean;
  twitterCard: boolean;
  internalLinks: number;
  externalLinks: number;
  brokenLinks: string[];
  headingStructure: string[];
  keywordDensity: number;
  contentScore: number;
}

export interface Issue {
  id: string;
  type: 'critical' | 'warning' | 'info';
  category: 'technical' | 'onpage' | 'content';
  title: string;
  description: string;
  impact: string;
  affectedPages: CrawledPage[];
  fixable: boolean;
  fixAction: string;
  fixApplied?: boolean;
  fixTimestamp?: string;
}

export interface ContentAnalysis {
  overallScore: number;
  intentMatch: number;
  readability: number;
  keywordDensity: number;
  contentFreshness: number;
  eeatScore: number;
  issues: {
    title: string;
    detail: string;
    severity: 'high' | 'medium' | 'low';
    affectedPages: string[];
  }[];
  suggestions: string[];
  intentBreakdown: {
    informational: number;
    commercial: number;
    transactional: number;
    navigational: number;
  };
}

export interface KeywordGap {
  current: string[];
  missing: {
    keyword: string;
    volume: string;
    difficulty: 'Low' | 'Medium' | 'High';
    intent: string;
    cpc: string;
    opportunity: string;
  }[];
  longtail: {
    keyword: string;
    volume: string;
    competition: 'Low' | 'Medium' | 'High';
    snippetPotential: boolean;
  }[];
  localKeywords: {
    keyword: string;
    volume: string;
    location: string;
  }[];
}

// ═══════════════════════════════════════════════════════════════
// 📊 NEW: SEO KPIs Interfaces
// ═══════════════════════════════════════════════════════════════

export interface SEOKPI {
  name: string;
  value: number;
  previousValue: number;
  change: number;
  changePercent: number;
  trend: 'up' | 'down' | 'stable';
  status: 'good' | 'warning' | 'critical';
  target: number;
  unit: string;
  icon: string;
}

export interface TrafficData {
  month: string;
  organic: number;
  direct: number;
  referral: number;
  social: number;
}

export interface RankingData {
  keyword: string;
  position: number;
  previousPosition: number;
  volume: string;
  url: string;
}

export interface BacklinkData {
  month: string;
  total: number;
  dofollow: number;
  nofollow: number;
  new: number;
  lost: number;
}

export interface PageSpeedHistory {
  date: string;
  lcp: number;
  fid: number;
  cls: number;
  score: number;
}

export interface CompetitorKPI {
  domain: string;
  authority: number;
  backlinks: number;
  organicTraffic: number;
  keywords: number;
}

export interface KPIDashboard {
  kpis: SEOKPI[];
  trafficHistory: TrafficData[];
  rankings: RankingData[];
  backlinkHistory: BacklinkData[];
  speedHistory: PageSpeedHistory[];
  competitors: CompetitorKPI[];
  indexCoverage: {
    valid: number;
    warning: number;
    error: number;
    excluded: number;
  };
  topPages: {
    url: string;
    clicks: number;
    impressions: number;
    ctr: number;
    position: number;
  }[];
}

export interface AuditResult {
  domain: string;
  targetKeyword: string;
  crawlDate: string;
  totalPages: number;
  crawledPages: number;
  healthScore: number;
  technicalScore: number;
  onPageScore: number;
  contentScore: number;
  pages: CrawledPage[];
  issues: Issue[];
  technicalIssues: Issue[];
  onPageIssues: Issue[];
  contentAnalysis: ContentAnalysis;
  keywordGaps: KeywordGap;
  coreWebVitals: {
    lcp: number;
    fid: number;
    cls: number;
    fcp: number;
    ttfb: number;
  };
  siteStructure: {
    hasSitemap: boolean;
    hasRobotsTxt: boolean;
    hasHttps: boolean;
    mobileFriendly: boolean;
    schemaTypes: string[];
  };
  // ═══════════════════════════════════════════════════
  // 📊 NEW: KPI Dashboard Data
  // ═══════════════════════════════════════════════════
  kpiDashboard: KPIDashboard;
}

export interface FixResult {
  issueId: string;
  success: boolean;
  message: string;
  details: string;
  pagesFixed: number;
  timestamp: string;
}
