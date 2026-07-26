'use client';

import { useState } from 'react';
import { Issue, FixResult } from '@/types';
import { Zap, Shield, CheckCircle2, Loader2 } from 'lucide-react';

interface Props {
  allIssues: Issue[];
  fixResults: FixResult[];
  onBulkFix: (results: FixResult[]) => void;
  fixedIssues: string[];
}

export default function AutoFixPanel({ allIssues, fixResults, onBulkFix, fixedIssues }: Props) {
  const [isBulkFixing, setIsBulkFixing] = useState(false);

  const fixableIssues = allIssues.filter(i => i.fixable && !fixedIssues.includes(i.id));

  const handleBulkFix = async () => {
    if (fixableIssues.length === 0) return;
    setIsBulkFixing(true);
    try {
      const res = await fetch('/api/fix', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ issues: fixableIssues, mode: 'bulk' })
      });
      const data = await res.json();
      if (data.success) {
        onBulkFix(data.results);
      }
    } catch (e) { console.error(e); }
    setIsBulkFixing(false);
  };

  return (
    <div className="space-y-6">
      {/* Bulk Fix Card */}
      <div className="bg-gradient-to-r from-[#0f0f23] to-[#1a1a3e] rounded-2xl p-8 text-white text-center">
        <Zap className="w-12 h-12 text-[#00f5a0] mx-auto mb-4" />
        <h3 className="text-2xl font-bold mb-2">Bulk Auto-Fix Engine</h3>
        <p className="text-gray-400 mb-6 max-w-lg mx-auto">
          AI Agent will automatically fix all {fixableIssues.length} fixable issues in sequence. 
          This includes meta tags, schema markup, redirects, alt text, and more.
        </p>
        <button
          onClick={handleBulkFix}
          disabled={isBulkFixing || fixableIssues.length === 0}
          className="px-8 py-4 bg-gradient-to-r from-[#00f5a0] to-[#00d9f5] text-[#0f0f23] font-extrabold rounded-xl hover:shadow-lg hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:transform-none text-lg"
        >
          {isBulkFixing ? (
            <span className="flex items-center gap-2">
              <Loader2 className="w-5 h-5 animate-spin" />
              Fixing {fixableIssues.length} Issues...
            </span>
          ) : (
            <span className="flex items-center gap-2">
              <Zap className="w-5 h-5" />
              ⚡ Fix All {fixableIssues.length} Issues at Once
            </span>
          )}
        </button>
      </div>

      {/* Fix Log */}
      <div className="bg-white rounded-2xl p-6 shadow-md">
        <h3 className="text-lg font-bold text-[#0f0f23] mb-4 flex items-center gap-2">
          <Shield className="w-5 h-5 text-[#00f5a0]" />
          Fix Log ({fixResults.length} fixes applied)
        </h3>

        {fixResults.length === 0 ? (
          <div className="text-center py-10 text-gray-400">
            <CheckCircle2 className="w-10 h-10 mx-auto mb-2 opacity-30" />
            <p>No fixes applied yet. Go to Technical or On-Page tabs to fix individual issues, or use Bulk Fix above.</p>
          </div>
        ) : (
          <div className="space-y-3 max-h-96 overflow-y-auto scrollbar-thin">
            {fixResults.map((result, i) => (
              <div key={i} className="p-4 bg-emerald-50 rounded-xl border-l-4 border-emerald-500">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="font-bold text-emerald-900 text-sm">{result.message}</div>
                    <div className="text-xs text-emerald-700 mt-1 leading-relaxed">{result.details}</div>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="text-2xl font-extrabold text-emerald-600">{result.pagesFixed}</div>
                    <div className="text-xs text-emerald-600">pages fixed</div>
                  </div>
                </div>
                <div className="mt-2 text-xs text-gray-400">
                  {new Date(result.timestamp).toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Pending Fixes */}
      {fixableIssues.length > 0 && (
        <div className="bg-white rounded-2xl p-6 shadow-md">
          <h3 className="text-lg font-bold text-[#0f0f23] mb-4">⏳ Pending Fixes ({fixableIssues.length})</h3>
          <div className="space-y-2">
            {fixableIssues.map(issue => (
              <div key={issue.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <div className="font-bold text-sm text-[#0f0f23]">{issue.title}</div>
                  <div className="text-xs text-gray-500">{issue.fixAction}</div>
                </div>
                <span className="px-2 py-1 bg-amber-100 text-amber-700 rounded text-xs font-bold">
                  {issue.affectedPages.length} pages
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
