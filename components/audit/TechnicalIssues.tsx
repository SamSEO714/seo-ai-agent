'use client';

import { useState } from 'react';
import { Issue, CrawledPage, AuditResult, FixResult } from '@/types';
import { ChevronDown, ChevronUp, Wrench, Clock, Shield, Smartphone, Sitemap, FileCode } from 'lucide-react';

interface Props {
  issues: Issue[];
  pages: CrawledPage[];
  coreWebVitals: AuditResult['coreWebVitals'];
  siteStructure: AuditResult['siteStructure'];
  onFix: (issueId: string, result: FixResult) => void;
  fixedIssues: string[];
}

export default function TechnicalIssues({ issues, pages, coreWebVitals, siteStructure, onFix, fixedIssues }: Props) {
  const [expandedIssues, setExpandedIssues] = useState<string[]>([]);
  const [fixingIssue, setFixingIssue] = useState<string | null>(null);

  const toggleExpand = (id: string) => {
    setExpandedIssues(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const handleFix = async (issue: Issue) => {
    setFixingIssue(issue.id);
    try {
      const res = await fetch('/api/fix', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ issue })
      });
      const data = await res.json();
      if (data.success) {
        onFix(issue.id, data.result);
      }
    } catch (e) {
      console.error(e);
    }
    setFixingIssue(null);
  };

  const getTypeStyles = (type: string) => {
    switch (type) {
      case 'critical': return { border: 'border-l-red-500', bg: 'bg-red-50', badge: 'bg-red-100 text-red-700', text: 'text-red-600' };
      case 'warning': return { border: 'border-l-amber-500', bg: 'bg-amber-50', badge: 'bg-amber-100 text-amber-700', text: 'text-amber-600' };
      default: return { border: 'border-l-blue-500', bg: 'bg-blue-50', badge: 'bg-blue-100 text-blue-700', text: 'text-blue-600' };
    }
  };

  const cwvGood = (value: number, threshold: number) => value <= threshold;

  return (
    <div className="space-y-6">
      {/* Core Web Vitals */}
      <div className="bg-white rounded-2xl p-6 shadow-md">
        <h3 className="text-lg font-bold text-[#0f0f23] mb-4 flex items-center gap-2">
          <Clock className="w-5 h-5 text-[#00f5a0]" />
          Core Web Vitals
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {[
            { label: 'LCP', value: `${coreWebVitals.lcp}s`, threshold: 2.5, unit: 's', good: cwvGood(coreWebVitals.lcp, 2.5) },
            { label: 'FID', value: `${coreWebVitals.fid}ms`, threshold: 100, unit: 'ms', good: cwvGood(coreWebVitals.fid, 100) },
            { label: 'CLS', value: `${coreWebVitals.cls}`, threshold: 0.1, unit: '', good: cwvGood(coreWebVitals.cls, 0.1) },
            { label: 'FCP', value: `${coreWebVitals.fcp}s`, threshold: 1.8, unit: 's', good: cwvGood(coreWebVitals.fcp, 1.8) },
            { label: 'TTFB', value: `${coreWebVitals.ttfb}s`, threshold: 0.8, unit: 's', good: cwvGood(coreWebVitals.ttfb, 0.8) },
          ].map((metric, i) => (
            <div key={i} className={`text-center p-4 rounded-xl ${metric.good ? 'bg-emerald-50' : 'bg-red-50'}`}>
              <div className={`text-2xl font-extrabold ${metric.good ? 'text-emerald-600' : 'text-red-500'}`}>{metric.value}</div>
              <div className="text-xs text-gray-500 mt-1">{metric.label}</div>
              <div className={`text-xs font-bold mt-1 ${metric.good ? 'text-emerald-600' : 'text-red-500'}`}>
                {metric.good ? '✅ Good' : '❌ Needs Fix'}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Site Structure */}
      <div className="bg-white rounded-2xl p-6 shadow-md">
        <h3 className="text-lg font-bold text-[#0f0f23] mb-4 flex items-center gap-2">
          <Sitemap className="w-5 h-5 text-[#00f5a0]" />
          Site Structure
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {[
            { label: 'XML Sitemap', status: siteStructure.hasSitemap, icon: <FileCode className="w-4 h-4" /> },
            { label: 'robots.txt', status: siteStructure.hasRobotsTxt, icon: <Shield className="w-4 h-4" /> },
            { label: 'HTTPS', status: siteStructure.hasHttps, icon: <Shield className="w-4 h-4" /> },
            { label: 'Mobile Friendly', status: siteStructure.mobileFriendly, icon: <Smartphone className="w-4 h-4" /> },
            { label: 'Schema Types', status: siteStructure.schemaTypes.length > 0, text: siteStructure.schemaTypes.join(', ') || 'None', icon: <FileCode className="w-4 h-4" /> },
          ].map((item, i) => (
            <div key={i} className={`p-4 rounded-xl text-center ${item.status ? 'bg-emerald-50' : 'bg-red-50'}`}>
              <div className={`flex justify-center mb-2 ${item.status ? 'text-emerald-600' : 'text-red-500'}`}>{item.icon}</div>
              <div className="text-xs text-gray-600 font-medium">{item.label}</div>
              <div className={`text-sm font-bold mt-1 ${item.status ? 'text-emerald-600' : 'text-red-500'}`}>
                {item.text || (item.status ? '✅ Present' : '❌ Missing')}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Issues List */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-[#0f0f23]">🔧 Technical Issues Found ({issues.length})</h3>
        {issues.map(issue => {
          const styles = getTypeStyles(issue.type);
          const isFixed = fixedIssues.includes(issue.id);
          const isExpanded = expandedIssues.includes(issue.id);

          return (
            <div 
              key={issue.id} 
              className={`bg-white rounded-xl shadow-md border-l-4 ${isFixed ? 'border-l-emerald-500' : styles.border} overflow-hidden transition-all`}
            >
              <div className="p-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                      <span className={`px-2.5 py-1 rounded-md text-xs font-extrabold uppercase ${isFixed ? 'bg-emerald-100 text-emerald-700' : styles.badge}`}>
                        {isFixed ? 'FIXED' : issue.type}
                      </span>
                      <span className="text-xs text-gray-400 font-medium">{issue.impact}</span>
                    </div>
                    <h4 className={`font-bold text-base mb-1 ${isFixed ? 'text-emerald-700 line-through opacity-70' : 'text-[#0f0f23]'}`}>
                      {issue.title}
                    </h4>
                    <p className={`text-sm leading-relaxed ${isFixed ? 'text-gray-400 line-through' : 'text-gray-600'}`}>
                      {issue.description}
                    </p>
                  </div>
                  <div className="text-right flex flex-col items-end gap-2">
                    <div className={`text-2xl font-extrabold ${isFixed ? 'text-emerald-500' : styles.text}`}>
                      {issue.affectedPages.length}
                    </div>
                    <div className="text-xs text-gray-400">pages</div>
                  </div>
                </div>

                <div className="flex gap-2 mt-4 flex-wrap">
                  <button 
                    onClick={() => toggleExpand(issue.id)}
                    className="flex items-center gap-1 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-xs font-bold text-gray-600 transition-colors"
                  >
                    {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                    {isExpanded ? 'Hide' : 'View'} Affected Pages ({issue.affectedPages.length})
                  </button>

                  {issue.fixable && !isFixed && (
                    <button 
                      onClick={() => handleFix(issue)}
                      disabled={fixingIssue === issue.id}
                      className="flex items-center gap-1 px-4 py-2 bg-gradient-to-r from-[#00f5a0] to-[#00d9f5] hover:shadow-md rounded-lg text-xs font-extrabold text-[#0f0f23] transition-all disabled:opacity-50"
                    >
                      <Wrench className="w-3 h-3" />
                      {fixingIssue === issue.id ? 'Fixing...' : `🔨 ${issue.fixAction}`}
                    </button>
                  )}

                  {isFixed && (
                    <span className="flex items-center gap-1 px-4 py-2 bg-emerald-100 rounded-lg text-xs font-extrabold text-emerald-700">
                      <Shield className="w-3 h-3" />
                      ✅ Fixed
                    </span>
                  )}
                </div>
              </div>

              {/* Expanded Page List */}
              {isExpanded && (
                <div className="px-5 pb-5">
                  <div className="bg-gray-50 rounded-lg overflow-hidden max-h-64 overflow-y-auto scrollbar-thin">
                    <table className="w-full text-sm">
                      <thead className="bg-gray-100 sticky top-0">
                        <tr>
                          <th className="text-left px-4 py-2.5 font-bold text-gray-600 text-xs">Page URL</th>
                          <th className="text-left px-4 py-2.5 font-bold text-gray-600 text-xs">Status</th>
                          <th className="text-left px-4 py-2.5 font-bold text-gray-600 text-xs">Load Time</th>
                          <th className="text-left px-4 py-2.5 font-bold text-gray-600 text-xs">Word Count</th>
                        </tr>
                      </thead>
                      <tbody>
                        {issue.affectedPages.map((page, idx) => (
                          <tr key={idx} className="border-b border-gray-100 last:border-0">
                            <td className="px-4 py-2.5 font-medium text-gray-700 truncate max-w-[200px]">{page.url}</td>
                            <td className="px-4 py-2.5">
                              <span className={`px-2 py-0.5 rounded text-xs font-bold ${page.statusCode === 200 ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                                {page.statusCode}
                              </span>
                            </td>
                            <td className="px-4 py-2.5 text-gray-600">{page.loadTime}s</td>
                            <td className="px-4 py-2.5 text-gray-600">{page.wordCount}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
