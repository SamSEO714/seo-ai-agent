'use client';

import { ContentAnalysis as CA } from '@/types';
import { BookOpen, Users, Award, Lightbulb } from 'lucide-react';

interface Props {
  analysis: CA;
}

export default function ContentAnalysis({ analysis }: Props) {
  return (
    <div className="space-y-6">
      {/* Score Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Content Quality', value: analysis.overallScore, icon: <BookOpen className="w-5 h-5" /> },
          { label: 'Intent Match', value: analysis.intentMatch, icon: <Users className="w-5 h-5" /> },
          { label: 'Readability', value: analysis.readability, icon: <BookOpen className="w-5 h-5" /> },
          { label: 'E-E-A-T Score', value: analysis.eeatScore, icon: <Award className="w-5 h-5" /> },
        ].map((card, i) => (
          <div key={i} className="bg-white rounded-xl p-5 shadow-md text-center">
            <div className="flex justify-center text-[#00f5a0] mb-2">{card.icon}</div>
            <div className={`text-3xl font-extrabold ${card.value >= 70 ? 'text-emerald-500' : card.value >= 50 ? 'text-amber-500' : 'text-red-500'}`}>
              {card.value}%
            </div>
            <div className="text-xs text-gray-500 mt-1 font-medium">{card.label}</div>
          </div>
        ))}
      </div>

      {/* Intent Breakdown */}
      <div className="bg-white rounded-2xl p-6 shadow-md">
        <h3 className="text-lg font-bold text-[#0f0f23] mb-4 flex items-center gap-2">
          <Users className="w-5 h-5 text-[#00f5a0]" />
          Search Intent Breakdown
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Informational', value: analysis.intentBreakdown.informational, color: 'bg-blue-500' },
            { label: 'Commercial', value: analysis.intentBreakdown.commercial, color: 'bg-amber-500' },
            { label: 'Transactional', value: analysis.intentBreakdown.transactional, color: 'bg-emerald-500' },
            { label: 'Navigational', value: analysis.intentBreakdown.navigational, color: 'bg-purple-500' },
          ].map((item, i) => (
            <div key={i} className="text-center p-4 bg-gray-50 rounded-xl">
              <div className="text-2xl font-extrabold text-[#0f0f23]">{item.value}%</div>
              <div className="text-xs text-gray-500 mt-1">{item.label}</div>
              <div className="w-full h-2 bg-gray-200 rounded-full mt-2 overflow-hidden">
                <div className={`h-full ${item.color} rounded-full`} style={{ width: `${item.value}%` }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Content Issues */}
      <div className="bg-white rounded-2xl p-6 shadow-md">
        <h3 className="text-lg font-bold text-[#0f0f23] mb-4">🚨 Content Issues & Findings</h3>
        <div className="space-y-3">
          {analysis.issues.map((issue, i) => {
            const color = issue.severity === 'high' ? 'border-l-red-500 bg-red-50' : issue.severity === 'medium' ? 'border-l-amber-500 bg-amber-50' : 'border-l-blue-500 bg-blue-50';
            return (
              <div key={i} className={`p-4 rounded-xl border-l-4 ${color}`}>
                <div className="flex items-center gap-2 mb-1">
                  <span className={`text-xs font-extrabold uppercase ${issue.severity === 'high' ? 'text-red-600' : issue.severity === 'medium' ? 'text-amber-600' : 'text-blue-600'}`}>
                    {issue.severity}
                  </span>
                  <span className="font-bold text-[#0f0f23] text-sm">{issue.title}</span>
                </div>
                <p className="text-sm text-gray-600 leading-relaxed">{issue.detail}</p>
                <div className="mt-2 flex flex-wrap gap-1">
                  {issue.affectedPages.slice(0, 3).map((url, j) => (
                    <span key={j} className="text-xs px-2 py-1 bg-white rounded text-gray-500 truncate max-w-[200px]">{url}</span>
                  ))}
                  {issue.affectedPages.length > 3 && (
                    <span className="text-xs px-2 py-1 bg-white rounded text-gray-400">+{issue.affectedPages.length - 3} more</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Suggestions */}
      <div className="bg-gradient-to-r from-[#0f0f23] to-[#1a1a3e] rounded-2xl p-6 text-white">
        <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
          <Lightbulb className="w-5 h-5 text-[#00f5a0]" />
          💡 AI Content Recommendations
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {analysis.suggestions.map((s, i) => (
            <div key={i} className="flex items-start gap-3 p-3 bg-white/10 rounded-lg text-sm">
              <span className="text-[#00f5a0] text-lg">✨</span>
              <span>{s}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
