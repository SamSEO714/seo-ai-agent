'use client';

import { useState } from 'react';
import { Issue, CrawledPage, FixResult } from '@/types';
import { ChevronDown, ChevronUp, Wrench, Image, Heading, FileText, Link2 } from 'lucide-react';

interface Props {
  issues: Issue[];
  pages: CrawledPage[];
  onFix: (issueId: string, result: FixResult) => void;
  fixedIssues: string[];
}

export default function OnPageIssues({ issues, pages, onFix, fixedIssues }: Props) {
  const [expandedIssues, setExpandedIssues] = useState<string[]>([]);
  const [fixingIssue, setFixingIssue] = useState<string | null>(null);

  const toggleExpand = (id: string) => {
    setExpandedIssues(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
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
      if (data.success) onFix(issue.id, data.result);
    } catch (e) { console.error(e); }
    setFixingIssue(null);
  };

  const getTypeStyles = (type: string) => {
    switch (type) {
      case 'critical': return { border: 'border-l-red-500', badge: 'bg-red-100 text-red-700', text: 'text-red-600' };
      case 'warning': return { border: 'border-l-amber-500', badge: 'bg-amber-100 text-amber-700', text: 'text-amber-600' };
      default: return { border: 'border-l-blue-500', badge: 'bg-blue-100 text-blue-700', text: 'text-blue-600' };
    }
  };

  const getIcon = (title: string) => {
    if (title.includes('Image') || title.includes('Alt')) return <Image className="w-5 h-5" />;
    if (title.includes('H1') || title.includes('Heading')) return <Heading className="w-5 h-5" />;
    if (title.includes('Content')) return <FileText className="w-5 h-5" />;
    if (title.includes('Link')) return <Link2 className="w-5 h-5" />;
    return <FileText className="w-5 h-5" />;
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-bold text-[#0f0f23]">📄 On-Page Issues Found ({issues.length})</h3>
      {issues.map(issue => {
        const styles = getTypeStyles(issue.type);
        const isFixed = fixedIssues.includes(issue.id);
        const isExpanded = expandedIssues.includes(issue.id);

        return (
          <div key={issue.id} className={`bg-white rounded-xl shadow-md border-l-4 ${isFixed ? 'border-l-emerald-500' : styles.border} overflow-hidden`}>
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
                <div className={`p-3 rounded-xl ${isFixed ? 'bg-emerald-50 text-emerald-600' : 'bg-gray-50 ' + styles.text}`}>
                  {getIcon(issue.title)}
                </div>
              </div>

              <div className="flex gap-2 mt-4 flex-wrap">
                <button onClick={() => toggleExpand(issue.id)} className="flex items-center gap-1 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-xs font-bold text-gray-600 transition-colors">
                  {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                  {isExpanded ? 'Hide' : 'View'} Affected Pages ({issue.affectedPages.length})
                </button>

                {issue.fixable && !isFixed && (
                  <button onClick={() => handleFix(issue)} disabled={fixingIssue === issue.id}
                    className="flex items-center gap-1 px-4 py-2 bg-gradient-to-r from-[#00f5a0] to-[#00d9f5] hover:shadow-md rounded-lg text-xs font-extrabold text-[#0f0f23] transition-all disabled:opacity-50">
                    <Wrench className="w-3 h-3" />
                    {fixingIssue === issue.id ? 'Fixing...' : `🔨 ${issue.fixAction}`}
                  </button>
                )}

                {isFixed && (
                  <span className="flex items-center gap-1 px-4 py-2 bg-emerald-100 rounded-lg text-xs font-extrabold text-emerald-700">
                    ✅ Fixed
                  </span>
                )}
              </div>
            </div>

            {isExpanded && (
              <div className="px-5 pb-5">
                <div className="bg-gray-50 rounded-lg overflow-hidden max-h-64 overflow-y-auto scrollbar-thin">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-100 sticky top-0">
                      <tr>
                        <th className="text-left px-4 py-2.5 font-bold text-gray-600 text-xs">Page URL</th>
                        <th className="text-left px-4 py-2.5 font-bold text-gray-600 text-xs">Meta Title</th>
                        <th className="text-left px-4 py-2.5 font-bold text-gray-600 text-xs">Word Count</th>
                        <th className="text-left px-4 py-2.5 font-bold text-gray-600 text-xs">Images</th>
                      </tr>
                    </thead>
                    <tbody>
                      {issue.affectedPages.map((page, idx) => (
                        <tr key={idx} className="border-b border-gray-100 last:border-0">
                          <td className="px-4 py-2.5 font-medium text-gray-700 truncate max-w-[200px]">{page.url}</td>
                          <td className="px-4 py-2.5 text-gray-600 truncate max-w-[150px]">{page.metaTitle || '—'}</td>
                          <td className="px-4 py-2.5 text-gray-600">{page.wordCount}</td>
                          <td className="px-4 py-2.5 text-gray-600">{page.totalImages - page.imagesWithoutAlt}/{page.totalImages}</td>
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
  );
}
