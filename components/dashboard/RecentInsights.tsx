'use client';

import { useEffect, useState } from 'react';
import { Sparkles, AlertCircle, CheckCircle, Info, TrendingUp } from 'lucide-react';

interface Insight { type: string; title: string; message: string; priority: 'high' | 'medium' | 'positive' | 'low'; category: string; }

const cfg = {
  high:     { Icon: AlertCircle,  cls: 'text-red-500',    bg: 'bg-red-50 dark:bg-red-900/20 border-red-100 dark:border-red-800' },
  medium:   { Icon: Info,         cls: 'text-amber-500',  bg: 'bg-amber-50 dark:bg-amber-900/20 border-amber-100 dark:border-amber-800' },
  positive: { Icon: CheckCircle,  cls: 'text-green-500',  bg: 'bg-green-50 dark:bg-green-900/20 border-green-100 dark:border-green-800' },
  low:      { Icon: TrendingUp,   cls: 'text-blue-500',   bg: 'bg-blue-50 dark:bg-blue-900/20 border-blue-100 dark:border-blue-800' },
};

export default function RecentInsights() {
  const [insights, setInsights] = useState<Insight[]>([]);
  const [loading, setLoading]   = useState(true);

  useEffect(() => {
    fetch('/api/insights/recent').then(r => r.ok ? r.json() : null)
      .then(d => d && setInsights(d.insights || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="card p-6 animate-pulse">
      <div className="h-5 bg-gray-100 dark:bg-gray-800 rounded w-28 mb-4" />
      <div className="space-y-3">{[...Array(3)].map((_, i) => <div key={i} className="h-14 bg-gray-100 dark:bg-gray-800 rounded-2xl" />)}</div>
    </div>
  );

  return (
    <div className="card p-6">
      <div className="flex items-center gap-2 mb-1">
        <Sparkles size={14} className="text-orange-500" />
        <p className="section-tag">// AI Insights</p>
      </div>
      <h3 className="text-xl font-black text-gray-900 dark:text-white mb-5">Recent Insights</h3>

      {insights.length === 0 ? (
        <div className="text-center py-10 text-gray-300 dark:text-gray-600">
          <Sparkles size={36} className="mx-auto mb-3 opacity-40" />
          <p className="text-sm font-semibold">Start tracking to get personalized insights!</p>
        </div>
      ) : (
        <div className="space-y-3">
          {insights.slice(0, 4).map((ins, i) => {
            const { Icon, cls, bg } = cfg[ins.priority] || cfg.low;
            return (
              <div key={i} className={`p-4 rounded-2xl border animate-slide-up ${bg}`} style={{ animationDelay: `${i * 60}ms` }}>
                <div className="flex items-start gap-3">
                  <Icon size={16} className={`${cls} flex-shrink-0 mt-0.5`} />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-black text-gray-900 dark:text-white text-sm mb-0.5">{ins.title}</h4>
                    <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">{ins.message}</p>
                    <span className="inline-block mt-2 px-2 py-0.5 bg-white/60 dark:bg-gray-800/60 text-gray-500 text-[10px] font-black uppercase tracking-wide rounded-full capitalize">
                      {ins.category}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
          {insights.length > 4 && (
            <button className="w-full text-center text-xs font-black text-orange-500 hover:text-orange-600 py-2 transition-colors uppercase tracking-widest">
              View all {insights.length} insights →
            </button>
          )}
        </div>
      )}
    </div>
  );
}
