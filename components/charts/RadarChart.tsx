'use client';

import { LifeScore } from '@/types';
import { Radar, RadarChart as RechartsRadar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';

interface Props {
  data: LifeScore | null;
}

export default function RadarChart({ data }: Props) {
  if (!data) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 animate-pulse">
        <div className="h-80 bg-gray-200 dark:bg-gray-700 rounded"></div>
      </div>
    );
  }

  const chartData = [
    { category: 'Sleep', value: data.sleep, fullMark: 100 },
    { category: 'Fitness', value: data.fitness, fullMark: 100 },
    { category: 'Nutrition', value: data.nutrition, fullMark: 100 },
    { category: 'Mind', value: data.mind, fullMark: 100 },
    { category: 'Hydration', value: data.hydration, fullMark: 100 },
    { category: 'Consistency', value: data.consistency, fullMark: 100 },
  ];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 animate-fade-in">
      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
        Wellness Balance
      </h3>
      <ResponsiveContainer width="100%" height={300}>
        <RechartsRadar data={chartData}>
          <PolarGrid stroke="#e5e7eb" className="dark:stroke-gray-700" />
          <PolarAngleAxis
            dataKey="category"
            tick={{ fill: '#6b7280', fontSize: 12 }}
            className="dark:fill-gray-400"
          />
          <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fill: '#6b7280' }} />
          <Radar
            name="Score"
            dataKey="value"
            stroke="#0ea5e9"
            fill="#0ea5e9"
            fillOpacity={0.6}
          />
        </RechartsRadar>
      </ResponsiveContainer>
    </div>
  );
}
