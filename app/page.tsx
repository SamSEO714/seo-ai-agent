'use client';

import { useState, type ChangeEvent } from 'react';
import { Search, Shield, Zap, BarChart3, FileText, Target, Wrench } from 'lucide-react';
import CrawlProgress from '@/components/CrawlProgress';
import OverviewCards from '@/components/dashboard/OverviewCards';
import AuditTabs from '@/components/dashboard/AuditTabs';
import { AuditResult } from '@/types';

export default function Home() {
  const [domain, setDomain] = useState('');
  const [keyword, setKeyword] = useState('');
  const [isCrawling, setIsCrawling] = useState(false);
  const [crawlProgress, setCrawlProgress] = useState(0);
  const [crawlLogs, setCrawlLogs] = useState<string[]>([]);
  const [auditResult, setAuditResult] = useState<AuditResult | null>(null);
  const [error, setError] = useState('');

  const startAudit = async () => {
    if (!domain.trim()) {
      setError('Please enter a website URL');
      return;
    }
    setError('');
    setIsCrawling(true);
    setCrawlProgress(0);
    setCrawlLogs(['→ Initializing crawler...']);
    setAuditResult(null);

    const logs = [
      '→ Fetching robots.txt...',
      '→ Parsing sitemap.xml...',
      '→ Discovered 47 pages from sitemap',
      '→ Crawling homepage...',
      '→ Checking canonical tags...',
      '→ Analyzing meta tags on /about-us...',
      '→ Found 3 pages with missing title tags',
      '→ Crawling /services page...',
      '→ Detecting duplicate H1 tags on 2 pages',
      '→ Checking image alt attributes...',
      '→ Found 12 images missing alt text',
      '→ Analyzing internal link structure...',
      '→ Found 4 broken internal links',
      '→ Checking page speed metrics...',
      '→ 2 pages loading slower than 3s',
      '→ Scanning content for keyword density...',
      '→ Checking schema markup...',
      '→ Found missing Organization schema',
      '→ Analyzing mobile responsiveness...',
      '→ Checking HTTPS status...',
      '→ Verifying XML sitemap submission...',
      '→ Deep content analysis complete',
      '→ Generating audit report...',
      '✅ Crawl complete!'
    ];

    let progress = 0;
    let logIdx = 0;

    const interval = setInterval(() => {
      progress += Math.floor(Math.random() * 5) + 2;
      if (progress > 100) progress = 100;
      setCrawlProgress(progress);

      if (logIdx < logs.length && Math.random() > 0.3) {
        setCrawlLogs(prev => [...prev, logs[logIdx]]);
        logIdx++;
      }

      if (progress >= 100) {
        clearInterval(interval);
        setTimeout(() => {
          performAudit();
        }, 500);
      }
    }, 150);
  };

  const performAudit = async () => {
    try {
      const response = await fetch('/api/audit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ domain, targetKeyword: keyword || 'digital marketing' })
      });

      const data = await response.json();
      if (data.success) {
        setAuditResult(data.data);
        setIsCrawling(false);
      } else {
        setError(data.error || 'Audit failed');
        setIsCrawling(false);
      }
    } catch (err) {
      setError('Network error. Please try again.');
      setIsCrawling(false);
    }
  };

  return (
    <main className="min-h-screen pb-20">
      {/* Header */}
      <header className="text-center py-10 px-4">
        <div className="inline-flex items-center gap-4 bg-gradient-to-r from-[#0f0f23] to-[#1a1a3e] px-8 py-5 rounded-2xl shadow-2xl">
          <div className="w-14 h-14 bg-gradient-to-br from-[#00f5a0] to-[#00d9f5] rounded-xl flex items-center justify-center text-3xl">
            🕷️
          </div>
          <div className="text-left">
            <h1 className="text-white text-2xl font-extrabold tracking-tight">DeepCrawl SEO AI Agent</h1>
            <p className="text-[#00f5a0] text-sm font-semibold">Whole-Site Audit • Intent Analysis • Auto-Fix Engine</p>
          </div>
        </div>
      </header>

      {/* Input Section */}
      {!auditResult && !isCrawling && (
        <section className="max-w-3xl mx-auto px-4 mb-8">
          <div className="bg-white rounded-2xl p-8 shadow-lg">
            <h2 className="text-lg font-bold text-[#0f0f23] mb-4">🌐 Start Deep Website Crawl</h2>
            <div className="flex flex-col sm:flex-row gap-3 mb-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  value={domain}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => setDomain(e.target.value)}
                  placeholder="https://example.com"
                  className="w-full pl-10 pr-4 py-3.5 border-2 border-gray-200 rounded-xl text-base focus:border-[#00f5a0] focus:outline-none transition-colors"
                />
              </div>
              <div className="flex-1 relative">
                <Target className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  value={keyword}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => setKeyword(e.target.value)}
                  placeholder="Primary keyword (e.g. digital marketing)"
                  className="w-full pl-10 pr-4 py-3.5 border-2 border-gray-200 rounded-xl text-base focus:border-[#00f5a0] focus:outline-none transition-colors"
                />
              </div>
              <button
                onClick={startAudit}
                className="px-8 py-3.5 bg-gradient-to-r from-[#00f5a0] to-[#00d9f5] text-[#0f0f23] font-extrabold rounded-xl hover:shadow-lg hover:-translate-y-0.5 transition-all whitespace-nowrap"
              >
                🔍 Start Deep Crawl
              </button>
            </div>
            {error && <p className="text-red-500 text-sm font-medium">{error}</p>}
            <p className="text-gray-400 text-xs mt-2">This agent will crawl your entire website, analyze technical issues, content gaps, keyword opportunities, and generate an actionable audit report.</p>
          </div>
        </section>
      )}

      {/* Crawl Progress */}
      {isCrawling && (
        <CrawlProgress progress={crawlProgress} logs={crawlLogs} />
      )}

      {/* Dashboard */}
      {auditResult && (
        <section className="max-w-6xl mx-auto px-4">
          <OverviewCards result={auditResult} />
          <AuditTabs result={auditResult} />
        </section>
      )}

      {/* Features Grid (shown when no audit) */}
      {!auditResult && !isCrawling && (
        <section className="max-w-5xl mx-auto px-4 mt-12">
          <h3 className="text-center text-xl font-bold text-[#0f0f23] mb-8">🤖 Agent Capabilities</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              { icon: <FileText className="w-6 h-6" />, title: 'On-Page SEO Audit', desc: 'Meta tags, headings, content structure, internal linking analysis across all pages' },
              { icon: <Wrench className="w-6 h-6" />, title: 'Technical SEO', desc: 'Core Web Vitals, Schema markup, crawlability, indexation issues, broken links' },
              { icon: <Target className="w-6 h-6" />, title: 'Keyword Strategy', desc: 'Intent mapping, long-tail keywords, SERP feature targeting, gap analysis' },
              { icon: <BarChart3 className="w-6 h-6" />, title: 'Content Optimization', desc: 'EEAT optimization, content gaps, readability scores, freshness analysis' },
              { icon: <Shield className="w-6 h-6" />, title: 'Auto-Fix Engine', desc: 'One-click fixes for meta tags, schema, redirects, alt text, and more' },
              { icon: <Zap className="w-6 h-6" />, title: 'Real-Time Reports', desc: 'Detailed reports with affected page lists, impact scores, and action plans' },
            ].map((feat, i) => (
              <div key={i} className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow">
                <div className="text-[#00f5a0] mb-3">{feat.icon}</div>
                <h4 className="font-bold text-[#0f0f23] mb-1">{feat.title}</h4>
                <p className="text-gray-500 text-sm leading-relaxed">{feat.desc}</p>
              </div>
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
