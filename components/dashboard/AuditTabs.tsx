'use client';

import { useState } from 'react';
import { AuditResult, FixResult } from '@/types';
import { Wrench, FileText, Target, BarChart3, Zap } from 'lucide-react';
import TechnicalIssues from '../audit/TechnicalIssues';
import OnPageIssues from '../audit/OnPageIssues';
import ContentAnalysis from '../audit/ContentAnalysis';
import KeywordGaps from '../audit/KeywordGaps';
import AutoFixPanel from '../audit/AutoFixPanel';

interface Props {
  result: AuditResult;
}

const tabs = [
  { id: 'technical', label: 'Technical SEO', icon: <Wrench className="w-4 h-4" /> },
  { id: 'onpage', label: 'On-Page SEO', icon: <FileText className="w-4 h-4" /> },
  { id: 'content', label: 'Content Analysis', icon: <BarChart3 className="w-4 h-4" /> },
  { id: 'keywords', label: 'Keywords', icon: <Target className="w-4 h-4" /> },
  { id: 'fixes', label: 'Auto-Fixes', icon: <Zap className="w-4 h-4" /> },
];

export default function AuditTabs({ result }: Props) {
  const [activeTab, setActiveTab] = useState('technical');
  const [fixedIssues, setFixedIssues] = useState<string[]>([]);
  const [fixResults, setFixResults] = useState<FixResult[]>([]);

  const handleFix = (issueId: string, result: FixResult) => {
    setFixedIssues(prev => [...prev, issueId]);
    setFixResults(prev => [result, ...prev]);
  };

  const handleBulkFix = (results: FixResult[]) => {
    const newFixed = results.map(result => result.issueId);
    setFixedIssues(prev => [...prev, ...newFixed]);
    setFixResults(prev => [...results, ...prev]);
  };

  return (
    <div>
      {/* Tab Buttons */}
      <div className="flex flex-wrap gap-2 mb-6">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition-all ${
              activeTab === tab.id
                ? 'bg-gradient-to-r from-[#00f5a0] to-[#00d9f5] text-[#0f0f23] shadow-md'
                : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
            }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Panels */}
      {activeTab === 'technical' && (
        <TechnicalIssues 
          issues={result.technicalIssues} 
          pages={result.pages}
          coreWebVitals={result.coreWebVitals}
          siteStructure={result.siteStructure}
          onFix={handleFix}
          fixedIssues={fixedIssues}
        />
      )}
      {activeTab === 'onpage' && (
        <OnPageIssues 
          issues={result.onPageIssues} 
          pages={result.pages}
          onFix={handleFix}
          fixedIssues={fixedIssues}
        />
      )}
      {activeTab === 'content' && (
        <ContentAnalysis analysis={result.contentAnalysis} />
      )}
      {activeTab === 'keywords' && (
        <KeywordGaps gaps={result.keywordGaps} targetKeyword={result.targetKeyword} />
      )}
      {activeTab === 'fixes' && (
        <AutoFixPanel 
          allIssues={result.issues} 
          fixResults={fixResults}
          onBulkFix={handleBulkFix}
          fixedIssues={fixedIssues}
        />
      )}
    </div>
  );
}
