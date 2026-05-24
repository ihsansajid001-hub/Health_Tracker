/**
 * Reusable ambient page header for all dashboard sub-pages.
 * Uses orange/black palette with a subtle glow effect.
 */
import { LucideIcon } from 'lucide-react';

interface Tab { id: string; label: string; icon: LucideIcon; }

interface Props {
  title: string;
  subtitle: string;
  icon: LucideIcon;
  tabs: Tab[];
  activeTab: string;
  onTabChange: (id: string) => void;
}

export default function PageHeader({ title, subtitle, icon: Icon, tabs, activeTab, onTabChange }: Props) {
  return (
    <div className="space-y-4">
      {/* Header banner */}
      <div className="relative bg-gray-900 rounded-3xl p-7 text-white overflow-hidden">
        {/* Ambient glow */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/15 rounded-full blur-3xl translate-x-1/3 -translate-y-1/3 pointer-events-none" />
        <div className="absolute bottom-0 left-1/2 w-48 h-48 bg-orange-600/8 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex items-center gap-5">
          <div className="w-14 h-14 bg-orange-500/20 border border-orange-500/30 rounded-2xl flex items-center justify-center flex-shrink-0">
            <Icon size={26} className="text-orange-400" />
          </div>
          <div>
            <p className="section-tag text-white/30 mb-1">// Dashboard</p>
            <h1 className="text-3xl font-black tracking-tight">{title}</h1>
            <p className="text-white/40 text-sm mt-0.5">{subtitle}</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {tabs.map(t => {
          const active = activeTab === t.id;
          return (
            <button key={t.id} onClick={() => onTabChange(t.id)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-full font-bold text-sm whitespace-nowrap transition-all ${
                active
                  ? 'bg-gray-900 text-white shadow-lg'
                  : 'bg-white border border-gray-200 text-gray-500 hover:border-orange-300 hover:text-orange-500'
              }`}>
              <t.icon size={14} className={active ? 'text-orange-400' : ''} />
              {t.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
