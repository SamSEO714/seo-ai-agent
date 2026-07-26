'use client';

import { KeywordGap } from '@/types';
import { Target, TrendingUp, MapPin, Search } from 'lucide-react';

interface Props {
  gaps: KeywordGap;
  targetKeyword: string;
}

export default function KeywordGaps({ gaps, targetKeyword }: Props) {
  return (
    <div className="space-y-6">
      {/* Current vs Missing */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl p-6 shadow-md">
          <h3 className="text-lg font-bold text-[#0f0f23] mb-4 flex items-center gap-2">
            <Target className="w-5 h-5 text-gray-400" />
            Currently Targeting ({gaps.current.length})
          </h3>
          <div className="flex flex-wrap gap-2 mb-4">
            {gaps.current.map((k, i) => (
              <span key={i} className="px-3 py-1.5 bg-emerald-50 text-emerald-700 rounded-full text-sm font-bold border border-emerald-200">
                {k}
              </span>
            ))}
          </div>
          <div className="p-3 bg-amber-50 rounded-lg text-sm text-amber-800">
            ⚠️ Only {gaps.current.length} keywords targeted. Competitors average 25+ keywords.
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-md">
          <h3 className="text-lg font-bold text-[#0f0f23] mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-red-500" />
            Missing Keywords ({gaps.missing.length})
          </h3>
          <div className="max-h-80 overflow-y-auto scrollbar-thin space-y-2">
            {gaps.missing.map((k, i) => (
              <div key={i} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors border border-gray-100">
                <div>
                  <div className="font-bold text-[#0f0f23] text-sm">{k.keyword}</div>
                  <div className="text-xs text-gray-400">Intent: {k.intent}</div>
                </div>
                <div className="text-right">
                  <div className="font-extrabold text-emerald-600 text-sm">{k.volume}</div>
                  <div className="text-xs text-gray-400">{k.difficulty} • {k.cpc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Long-tail Opportunities */}
      <div className="bg-white rounded-2xl p-6 shadow-md">
        <h3 className="text-lg font-bold text-[#0f0f23] mb-4 flex items-center gap-2">
          <Search className="w-5 h-5 text-[#00f5a0]" />
          🎯 Long-Tail Opportunities (Featured Snippet Potential)
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {gaps.longtail.map((k, i) => (
            <div key={i} className="p-4 bg-emerald-50 rounded-xl border border-emerald-200">
              <div className="font-bold text-emerald-900 text-sm leading-relaxed">"{k.keyword}"</div>
              <div className="mt-2 flex gap-2">
                <span className="px-2 py-0.5 bg-emerald-500 text-white rounded text-xs font-bold">LOW COMPETITION</span>
                {k.snippetPotential && <span className="px-2 py-0.5 bg-blue-500 text-white rounded text-xs font-bold">SNIPPET READY</span>}
              </div>
              <div className="mt-1 text-xs text-emerald-700 font-medium">Volume: {k.volume}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Local Keywords */}
      <div className="bg-white rounded-2xl p-6 shadow-md">
        <h3 className="text-lg font-bold text-[#0f0f23] mb-4 flex items-center gap-2">
          <MapPin className="w-5 h-5 text-[#00d9f5]" />
          📍 Local Keywords (Untapped)
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {gaps.localKeywords.map((k, i) => (
            <div key={i} className="p-3 bg-blue-50 rounded-lg border border-blue-100">
              <div className="font-bold text-blue-900 text-sm">{k.keyword}</div>
              <div className="flex items-center justify-between mt-1">
                <span className="text-xs text-blue-600 font-medium">{k.location}</span>
                <span className="text-xs font-extrabold text-blue-700">{k.volume}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
