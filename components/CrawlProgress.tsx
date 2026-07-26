'use client';

interface Props {
  progress: number;
  logs: string[];
}

export default function CrawlProgress({ progress, logs }: Props) {
  const pagesFound = Math.floor(progress * 0.47);
  const linksCrawled = Math.floor(progress * 1.2);
  const imagesFound = Math.floor(progress * 0.35);
  const issuesFound = Math.floor(progress * 0.18);

  return (
    <section className="max-w-3xl mx-auto px-4 mb-8">
      <div className="bg-gradient-to-r from-[#0f0f23] to-[#1a1a3e] rounded-2xl p-8 text-white shadow-2xl">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-xl font-bold">🕷️ Deep Crawl in Progress...</h3>
          <span className="text-3xl font-extrabold text-[#00f5a0]">{progress}%</span>
        </div>

        <div className="w-full h-2.5 bg-white/10 rounded-full overflow-hidden mb-5">
          <div 
            className="h-full bg-gradient-to-r from-[#00f5a0] to-[#00d9f5] rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="font-mono text-xs text-gray-400 max-h-32 overflow-y-auto mb-5 space-y-1 scrollbar-thin">
          {logs.map((log, i) => (
            <div key={i} className={log.includes('✅') ? 'text-[#00f5a0] font-bold' : ''}>{log}</div>
          ))}
        </div>

        <div className="flex flex-wrap gap-3">
          <span className="px-4 py-2 bg-white/10 rounded-lg text-sm">📄 Pages Found: {pagesFound}</span>
          <span className="px-4 py-2 bg-white/10 rounded-lg text-sm">🔗 Links Crawled: {linksCrawled}</span>
          <span className="px-4 py-2 bg-white/10 rounded-lg text-sm">🖼️ Images: {imagesFound}</span>
          <span className="px-4 py-2 bg-white/10 rounded-lg text-sm">⚠️ Issues Found: {issuesFound}</span>
        </div>
      </div>
    </section>
  );
}
