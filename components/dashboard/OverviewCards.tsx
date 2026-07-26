'use client';

import { AuditResult } from '@/types';
import { Activity, FileText, AlertTriangle, AlertCircle, CheckCircle2 } from 'lucide-react';

interface Props {
  result: AuditResult;
}

export default function OverviewCards({ result }: Props) {
  const criticalCount = result.issues.filter(i => i.type === 'critical').length;
  const warningCount = result.issues.filter(i => i.type === 'warning').length;
  const infoCount = result.issues.filter(i => i.type === 'info').length;
  const fixedCount = result.issues.filter(i => i.fixApplied).length;

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-emerald-500';
    if (score >= 60) return 'text-amber-500';
    return 'text-red-500';
  };

  const cards = [
    { label: 'SEO Health Score', value: result.healthScore, icon: <Activity className="w-5 h-5" />, color: getScoreColor(result.healthScore) },
    { label: 'Pages Audited', value: result.crawledPages, icon: <FileText className="w-5 h-5" />, color: 'text-slate-800' },
    { label: 'Critical Issues', value: criticalCount, icon: <AlertCircle className="w-5 h-5" />, color: 'text-red-500' },
    { label: 'Warnings', value: warningCount, icon: <AlertTriangle className="w-5 h-5" />, color: 'text-amber-500' },
    { label: 'Auto-Fixed', value: fixedCount, icon: <CheckCircle2 className="w-5 h-5" />, color: 'text-emerald-500' },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
      {cards.map((card, i) => (
        <div key={i} className="bg-white rounded-xl p-5 shadow-md text-center hover:shadow-lg transition-shadow">
          <div className={`${card.color} mb-2 flex justify-center`}>{card.icon}</div>
          <div className={`text-3xl font-extrabold ${card.color}`}>{card.value}</div>
          <div className="text-xs text-gray-500 mt-1 font-medium">{card.label}</div>
        </div>
      ))}
    </div>
  );
}
