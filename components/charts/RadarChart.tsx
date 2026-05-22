'use client';

import { Radar, RadarChart as RechartsRadar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';

interface RadarData {
  category: string;
  value: number;
  max: number;
}

interface Props {
  data: RadarData[];
}

export default function RadarChart({ data }: Props) {
  if (!data || data.length === 0) {
    return (
      <div className="h-80 flex items-center justify-center text-gray-500 dark:text-gray-400">
        <p>Start tracking to see your wellness balance!</p>
      </div>
    );
  }

  // Normalize data to percentage for consistent display
  const chartData = data.map(item => ({
    category: item.category,
    value: Math.round((item.value / item.max) * 100),
    fullMark: 100
  }));

  return (
    <ResponsiveContainer width="100%" height={300}>
      <RechartsRadar data={chartData}>
        <PolarGrid stroke="#e5e7eb" className="dark:stroke-gray-700" />
        <PolarAngleAxis
          dataKey="category"
          tick={{ fill: '#6b7280', fontSize: 12 }}
          className="dark:fill-gray-400"
        />
        <PolarRadiusAxis 
          angle={90} 
          domain={[0, 100]} 
          tick={{ fill: '#6b7280', fontSize: 10 }}
          tickFormatter={(value) => `${value}%`}
        />
        <Radar
          name="Score"
          dataKey="value"
          stroke="#f97316"
          fill="#f97316"
          fillOpacity={0.3}
          strokeWidth={2}
        />
      </RechartsRadar>
    </ResponsiveContainer>
  );
}
