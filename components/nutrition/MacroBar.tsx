'use client';

interface Props {
  label: string;
  value: number;
  goal: number;
  unit: string;
  color: string;
  pct: number; // display percentage (can be from goal or fixed for demo)
}

export default function MacroBar({ label, value, goal, unit, color, pct }: Props) {
  const realPct = Math.min(100, Math.round((value / goal) * 100));
  const displayPct = value > 0 ? realPct : pct;

  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${color}`} />
          <span className="text-sm font-semibold text-gray-700">{label}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm font-black text-gray-900">
            {value}{unit}
          </span>
          <span className="text-xs font-bold text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
            {displayPct}%
          </span>
        </div>
      </div>
      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-700 ${color}`}
          style={{ width: `${displayPct}%` }}
        />
      </div>
      <p className="text-[10px] text-gray-400 mt-1 text-right">
        {value}{unit} / {goal}{unit}
      </p>
    </div>
  );
}
