'use client';

interface Props {
  eaten: number;
  goal: number;
  burned: number;
}

export default function CaloriesDonut({ eaten, goal, burned }: Props) {
  const left = Math.max(0, goal - eaten);
  const pct = Math.min(1, eaten / goal);

  // SVG donut params
  const size = 160;
  const cx = size / 2;
  const cy = size / 2;
  const r = 60;
  const stroke = 14;
  const circumference = 2 * Math.PI * r;
  const dashOffset = circumference * (1 - pct);

  return (
    <div className="flex flex-col items-center">
      {/* Top stats */}
      <div className="flex justify-between w-full mb-4">
        <div className="text-center">
          <p className="text-xl font-black text-gray-900">{eaten.toLocaleString()}</p>
          <p className="text-xs text-gray-400 font-semibold mt-0.5">kcal</p>
          <p className="text-[10px] text-gray-400">Eaten calories</p>
        </div>
        <div className="text-center">
          <p className="text-xl font-black text-gray-900">{burned.toLocaleString()}</p>
          <p className="text-xs text-gray-400 font-semibold mt-0.5">kcal</p>
          <p className="text-[10px] text-gray-400">Burned calories</p>
        </div>
      </div>

      {/* Donut */}
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="-rotate-90">
          {/* Track */}
          <circle
            cx={cx} cy={cy} r={r}
            fill="none"
            stroke="#F3F4F6"
            strokeWidth={stroke}
          />
          {/* Progress */}
          <circle
            cx={cx} cy={cy} r={r}
            fill="none"
            stroke="url(#donutGrad)"
            strokeWidth={stroke}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={dashOffset}
            style={{ transition: 'stroke-dashoffset 0.8s ease' }}
          />
          <defs>
            <linearGradient id="donutGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#FB923C" />
              <stop offset="100%" stopColor="#F97316" />
            </linearGradient>
          </defs>
        </svg>

        {/* Center text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center mb-1">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#F97316" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
            </svg>
          </div>
          <p className="text-lg font-black text-gray-900 leading-none">{left.toLocaleString()}</p>
          <p className="text-[10px] text-gray-400 font-semibold mt-0.5">Calories left</p>
        </div>
      </div>

      {/* Goal label */}
      <p className="text-xs text-gray-400 font-semibold mt-3">
        Goal: <span className="text-gray-700">{goal.toLocaleString()} kcal</span>
      </p>
    </div>
  );
}
