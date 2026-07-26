'use client';

import { KPIDashboard as KPIData } from '@/types';
import { 
  TrendingUp, TrendingDown, Minus, Users, MousePointer, 
  Eye, Target, Link2, Gauge, BarChart3, Globe, AlertTriangle 
} from 'lucide-react';

interface Props {
  data: KPIData;
}

const KPI_ICONS: Record<string, any> = {
  'Organic Traffic': <Users className="w-5 h-5" />,
  'Keyword Rankings': <Target className="w-5 h-5" />,
  'Domain Authority': <Globe className="w-5 h-5" />,
  'Backlinks': <Link2 className="w-5 h-5" />,
  'Page Speed': <Gauge className="w-5 h-5" />,
  'CTR': <MousePointer className="w-5 h-5" />,
  'Bounce Rate': <Eye className="w-5 h-5" />,
  'Conversion Rate': <BarChart3 className="w-5 h-5" />,
};

export default function KPIDashboard({ data }: Props) {
  const { kpis, trafficHistory, rankings, backlinkHistory, speedHistory, competitors, indexCoverage, topPages } = data;

  return (
    <div className="space-y-6">
      {/* ═══════════════════════════════════════════════════ */}
      {/* 📊 TOP KPI CARDS */}
      {/* ═══════════════════════════════════════════════════ */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {kpis.map((kpi, i) => {
          const isGood = kpi.trend === 'up' && kpi.status === 'good';
          const isBad = kpi.trend === 'down' && kpi.status === 'critical';

          return (
            <div key={i} className={`bg-white rounded-xl p-5 shadow-md hover:shadow-lg transition-all border-l-4 ${
              kpi.status === 'good' ? 'border-l-emerald-500' :
              kpi.status === 'warning' ? 'border-l-amber-500' : 'border-l-red-500'
            }`}>
              <div className="flex items-center justify-between mb-3">
                <div className={`p-2 rounded-lg ${
                  kpi.status === 'good' ? 'bg-emerald-100 text-emerald-600' :
                  kpi.status === 'warning' ? 'bg-amber-100 text-amber-600' : 'bg-red-100 text-red-600'
                }`}>
                  {KPI_ICONS[kpi.name] || <BarChart3 className="w-5 h-5" />}
                </div>
                <div className={`flex items-center gap-1 text-xs font-bold ${
                  isGood ? 'text-emerald-600' : isBad ? 'text-red-600' : 'text-gray-500'
                }`}>
                  {kpi.trend === 'up' ? <TrendingUp className="w-3 h-3" /> :
                   kpi.trend === 'down' ? <TrendingDown className="w-3 h-3" /> :
                   <Minus className="w-3 h-3" />}
                  {kpi.changePercent > 0 ? '+' : ''}{kpi.changePercent}%
                </div>
              </div>
              <div className="text-2xl font-extrabold text-[#0f0f23]">
                {kpi.value.toLocaleString()}{kpi.unit}
              </div>
              <div className="text-xs text-gray-500 mt-1">{kpi.name}</div>
              <div className="mt-2 w-full bg-gray-100 rounded-full h-1.5">
                <div 
                  className={`h-full rounded-full ${
                    kpi.status === 'good' ? 'bg-emerald-500' :
                    kpi.status === 'warning' ? 'bg-amber-500' : 'bg-red-500'
                  }`}
                  style={{ width: `${Math.min(100, (kpi.value / kpi.target) * 100)}%` }}
                />
              </div>
              <div className="text-xs text-gray-400 mt-1">Target: {kpi.target.toLocaleString()}{kpi.unit}</div>
            </div>
          );
        })}
      </div>

      {/* ═══════════════════════════════════════════════════ */}
      {/* 📈 TRAFFIC & SPEED CHARTS */}
      {/* ═══════════════════════════════════════════════════ */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Traffic History */}
        <div className="bg-white rounded-2xl p-6 shadow-md">
          <h3 className="text-lg font-bold text-[#0f0f23] mb-4 flex items-center gap-2">
            <Users className="w-5 h-5 text-[#00f5a0]" />
            📈 Traffic Sources (6 Months)
          </h3>
          <div className="space-y-3">
            {trafficHistory.map((month, i) => (
              <div key={i}>
                <div className="flex justify-between text-xs text-gray-500 mb-1">
                  <span className="font-bold">{month.month}</span>
                  <span>{(month.organic + month.direct + month.referral + month.social).toLocaleString()} total</span>
                </div>
                <div className="flex h-6 rounded-lg overflow-hidden">
                  <div className="bg-emerald-500" style={{ width: `${(month.organic / (month.organic + month.direct + month.referral + month.social)) * 100}%` }} />
                  <div className="bg-blue-500" style={{ width: `${(month.direct / (month.organic + month.direct + month.referral + month.social)) * 100}%` }} />
                  <div className="bg-purple-500" style={{ width: `${(month.referral / (month.organic + month.direct + month.referral + month.social)) * 100}%` }} />
                  <div className="bg-amber-500" style={{ width: `${(month.social / (month.organic + month.direct + month.referral + month.social)) * 100}%` }} />
                </div>
              </div>
            ))}
          </div>
          <div className="flex gap-4 mt-4 text-xs">
            <span className="flex items-center gap-1"><div className="w-2 h-2 bg-emerald-500 rounded-full" /> Organic</span>
            <span className="flex items-center gap-1"><div className="w-2 h-2 bg-blue-500 rounded-full" /> Direct</span>
            <span className="flex items-center gap-1"><div className="w-2 h-2 bg-purple-500 rounded-full" /> Referral</span>
            <span className="flex items-center gap-1"><div className="w-2 h-2 bg-amber-500 rounded-full" /> Social</span>
          </div>
        </div>

        {/* Page Speed History */}
        <div className="bg-white rounded-2xl p-6 shadow-md">
          <h3 className="text-lg font-bold text-[#0f0f23] mb-4 flex items-center gap-2">
            <Gauge className="w-5 h-5 text-[#00f5a0]" />
            ⚡ Core Web Vitals Trend
          </h3>
          <div className="space-y-4">
            {speedHistory.map((entry, i) => (
              <div key={i} className="flex items-center gap-3">
                <span className="text-xs text-gray-500 w-16">{entry.date}</span>
                <div className="flex-1">
                  <div className="flex justify-between text-xs mb-1">
                    <span className="font-bold text-[#0f0f23]">Score: {entry.score}</span>
                    <span className="text-gray-400">LCP: {entry.lcp}s</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2">
                    <div 
                      className={`h-full rounded-full ${entry.score >= 90 ? 'bg-emerald-500' : entry.score >= 70 ? 'bg-amber-500' : 'bg-red-500'}`}
                      style={{ width: `${entry.score}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════ */}
      {/* 🎯 KEYWORD RANKINGS */}
      {/* ═══════════════════════════════════════════════════ */}
      <div className="bg-white rounded-2xl p-6 shadow-md">
        <h3 className="text-lg font-bold text-[#0f0f23] mb-4 flex items-center gap-2">
          <Target className="w-5 h-5 text-[#00f5a0]" />
          🎯 Top Keyword Rankings
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left py-3 px-4 font-bold text-gray-600">Keyword</th>
                <th className="text-center py-3 px-4 font-bold text-gray-600">Position</th>
                <th className="text-center py-3 px-4 font-bold text-gray-600">Change</th>
                <th className="text-center py-3 px-4 font-bold text-gray-600">Volume</th>
                <th className="text-left py-3 px-4 font-bold text-gray-600">Ranking URL</th>
              </tr>
            </thead>
            <tbody>
              {rankings.map((rank, i) => (
                <tr key={i} className="border-b border-gray-50 hover:bg-gray-50">
                  <td className="py-3 px-4 font-medium text-[#0f0f23]">{rank.keyword}</td>
                  <td className="py-3 px-4 text-center">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                      rank.position <= 3 ? 'bg-emerald-100 text-emerald-700' :
                      rank.position <= 10 ? 'bg-blue-100 text-blue-700' :
                      rank.position <= 20 ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'
                    }`}>
                      #{rank.position}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span className={`text-xs font-bold ${
                      rank.previousPosition > rank.position ? 'text-emerald-600' :
                      rank.previousPosition < rank.position ? 'text-red-600' : 'text-gray-400'
                    }`}>
                      {rank.previousPosition > rank.position ? '↑' :
                       rank.previousPosition < rank.position ? '↓' : '→'}
                      {Math.abs(rank.previousPosition - rank.position)}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-center text-gray-600">{rank.volume}</td>
                  <td className="py-3 px-4 text-gray-500 truncate max-w-[200px]">{rank.url}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════ */}
      {/* 🔗 BACKLINKS & COMPETITORS */}
      {/* ═══════════════════════════════════════════════════ */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Backlink History */}
        <div className="bg-white rounded-2xl p-6 shadow-md">
          <h3 className="text-lg font-bold text-[#0f0f23] mb-4 flex items-center gap-2">
            <Link2 className="w-5 h-5 text-[#00f5a0]" />
            🔗 Backlink Growth
          </h3>
          <div className="space-y-3">
            {backlinkHistory.map((month, i) => (
              <div key={i} className="flex items-center gap-3">
                <span className="text-xs text-gray-500 w-12">{month.month}</span>
                <div className="flex-1">
                  <div className="flex justify-between text-xs mb-1">
                    <span className="font-bold">{month.total.toLocaleString()} total</span>
                    <span className="text-emerald-600">+{month.new}</span>
                    <span className="text-red-500">-{month.lost}</span>
                  </div>
                  <div className="flex h-4 rounded-lg overflow-hidden">
                    <div className="bg-emerald-500" style={{ width: `${(month.dofollow / month.total) * 100}%` }} />
                    <div className="bg-gray-300" style={{ width: `${(month.nofollow / month.total) * 100}%` }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="flex gap-4 mt-3 text-xs">
            <span className="flex items-center gap-1"><div className="w-2 h-2 bg-emerald-500 rounded-full" /> Dofollow</span>
            <span className="flex items-center gap-1"><div className="w-2 h-2 bg-gray-300 rounded-full" /> Nofollow</span>
          </div>
        </div>

        {/* Competitors */}
        <div className="bg-white rounded-2xl p-6 shadow-md">
          <h3 className="text-lg font-bold text-[#0f0f23] mb-4 flex items-center gap-2">
            <Globe className="w-5 h-5 text-[#00f5a0]" />
            🥊 Competitor Comparison
          </h3>
          <div className="space-y-4">
            {competitors.map((comp, i) => (
              <div key={i} className="p-4 bg-gray-50 rounded-xl">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-bold text-[#0f0f23]">{comp.domain}</span>
                  <span className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded font-bold">DA: {comp.authority}</span>
                </div>
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div>
                    <div className="text-lg font-extrabold text-[#0f0f23]">{comp.backlinks.toLocaleString()}</div>
                    <div className="text-xs text-gray-500">Backlinks</div>
                  </div>
                  <div>
                    <div className="text-lg font-extrabold text-emerald-600">{comp.organicTraffic.toLocaleString()}</div>
                    <div className="text-xs text-gray-500">Traffic</div>
                  </div>
                  <div>
                    <div className="text-lg font-extrabold text-blue-600">{comp.keywords.toLocaleString()}</div>
                    <div className="text-xs text-gray-500">Keywords</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════ */}
      {/* 📊 INDEX COVERAGE & TOP PAGES */}
      {/* ═══════════════════════════════════════════════════ */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Index Coverage */}
        <div className="bg-white rounded-2xl p-6 shadow-md">
          <h3 className="text-lg font-bold text-[#0f0f23] mb-4 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-[#00f5a0]" />
            📊 Google Index Coverage
          </h3>
          <div className="flex items-center justify-center mb-4">
            <div className="relative w-40 h-40">
              <svg viewBox="0 0 36 36" className="w-full h-full">
                <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#e5e7eb" strokeWidth="3" />
                <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#10b981" strokeWidth="3" 
                  strokeDasharray={`${indexCoverage.valid}, 100`} />
                <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#f59e0b" strokeWidth="3" 
                  strokeDasharray={`${indexCoverage.warning}, 100`} strokeDashoffset={`-${indexCoverage.valid}`} />
                <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#ef4444" strokeWidth="3" 
                  strokeDasharray={`${indexCoverage.error}, 100`} strokeDashoffset={`-${indexCoverage.valid + indexCoverage.warning}`} />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-2xl font-extrabold text-[#0f0f23]">{indexCoverage.valid}%</div>
                  <div className="text-xs text-gray-500">Valid</div>
                </div>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 bg-emerald-50 rounded-lg text-center">
              <div className="text-lg font-extrabold text-emerald-600">{indexCoverage.valid}%</div>
              <div className="text-xs text-gray-500">Valid</div>
            </div>
            <div className="p-3 bg-amber-50 rounded-lg text-center">
              <div className="text-lg font-extrabold text-amber-600">{indexCoverage.warning}%</div>
              <div className="text-xs text-gray-500">Warning</div>
            </div>
            <div className="p-3 bg-red-50 rounded-lg text-center">
              <div className="text-lg font-extrabold text-red-600">{indexCoverage.error}%</div>
              <div className="text-xs text-gray-500">Error</div>
            </div>
            <div className="p-3 bg-gray-50 rounded-lg text-center">
              <div className="text-lg font-extrabold text-gray-600">{indexCoverage.excluded}%</div>
              <div className="text-xs text-gray-500">Excluded</div>
            </div>
          </div>
        </div>

        {/* Top Performing Pages */}
        <div className="bg-white rounded-2xl p-6 shadow-md">
          <h3 className="text-lg font-bold text-[#0f0f23] mb-4 flex items-center gap-2">
            <MousePointer className="w-5 h-5 text-[#00f5a0]" />
            🏆 Top Performing Pages
          </h3>
          <div className="space-y-3">
            {topPages.map((page, i) => (
              <div key={i} className="p-3 bg-gray-50 rounded-lg">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-xs text-gray-500 truncate max-w-[200px]">{page.url}</span>
                  <span className="text-xs px-2 py-1 bg-emerald-100 text-emerald-700 rounded font-bold">{page.ctr}% CTR</span>
                </div>
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div>
                    <div className="text-sm font-extrabold text-[#0f0f23]">{page.clicks.toLocaleString()}</div>
                    <div className="text-xs text-gray-500">Clicks</div>
                  </div>
                  <div>
                    <div className="text-sm font-extrabold text-blue-600">{page.impressions.toLocaleString()}</div>
                    <div className="text-xs text-gray-500">Impressions</div>
                  </div>
                  <div>
                    <div className="text-sm font-extrabold text-amber-600">#{page.position}</div>
                    <div className="text-xs text-gray-500">Position</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
