'use client';

import { useState, useEffect } from 'react';
import { Moon, Sun, Activity, Brain } from 'lucide-react';

interface SleepCycle {
  phase: 'awake' | 'light' | 'deep' | 'rem';
  startTime: string;
  duration: number; // minutes
}

interface Props {
  totalSleepHours: number;
  sleepQuality: number;
  onCycleComplete?: (cycles: SleepCycle[]) => void;
}

export default function SleepCycleTracker({ totalSleepHours, sleepQuality, onCycleComplete }: Props) {
  const [cycles, setCycles] = useState<SleepCycle[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  useEffect(() => {
    generateSleepCycles();
  }, [totalSleepHours, sleepQuality]);

  const generateSleepCycles = () => {
    setIsAnalyzing(true);
    
    // Simulate sleep cycle analysis based on total sleep and quality
    const totalMinutes = totalSleepHours * 60;
    const cycleLength = 90; // Average sleep cycle is 90 minutes
    const numCycles = Math.floor(totalMinutes / cycleLength);
    
    const newCycles: SleepCycle[] = [];
    let currentTime = 0;
    
    for (let i = 0; i < numCycles; i++) {
      const cycleStart = currentTime;
      
      // Each cycle has different phases
      const phases: Array<{ phase: SleepCycle['phase'], percentage: number }> = [
        { phase: 'light', percentage: 0.5 }, // 45 minutes
        { phase: 'deep', percentage: 0.25 }, // 22.5 minutes
        { phase: 'rem', percentage: 0.25 }, // 22.5 minutes
      ];
      
      // Adjust phases based on sleep quality
      if (sleepQuality < 5) {
        // Poor sleep - more awake periods
        phases.unshift({ phase: 'awake', percentage: 0.1 });
        phases.forEach(p => p.percentage *= 0.9);
      }
      
      phases.forEach(({ phase, percentage }) => {
        const duration = cycleLength * percentage;
        const hours = Math.floor(currentTime / 60);
        const minutes = currentTime % 60;
        const startTime = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
        
        newCycles.push({
          phase,
          startTime,
          duration: Math.round(duration)
        });
        
        currentTime += duration;
      });
    }
    
    setCycles(newCycles);
    onCycleComplete?.(newCycles);
    
    setTimeout(() => setIsAnalyzing(false), 2000);
  };

  const getPhaseIcon = (phase: SleepCycle['phase']) => {
    switch (phase) {
      case 'awake': return <Sun size={16} className="text-yellow-500" />;
      case 'light': return <Moon size={16} className="text-orange-400" />;
      case 'deep': return <Activity size={16} className="text-orange-500" />;
      case 'rem': return <Brain size={16} className="text-purple-600" />;
    }
  };

  const getPhaseColor = (phase: SleepCycle['phase']) => {
    switch (phase) {
      case 'awake': return 'bg-yellow-100 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800';
      case 'light': return 'bg-orange-100 dark:bg-blue-900/20 border-orange-200 dark:border-blue-800';
      case 'deep': return 'bg-indigo-100 dark:bg-indigo-900/20 border-indigo-200 dark:border-indigo-800';
      case 'rem': return 'bg-purple-100 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800';
    }
  };

  const getPhaseDescription = (phase: SleepCycle['phase']) => {
    switch (phase) {
      case 'awake': return 'Brief awakenings';
      case 'light': return 'Light sleep - easy to wake';
      case 'deep': return 'Deep sleep - physical restoration';
      case 'rem': return 'REM sleep - dreams & memory';
    }
  };

  const calculatePhaseStats = () => {
    const stats = cycles.reduce((acc, cycle) => {
      acc[cycle.phase] = (acc[cycle.phase] || 0) + cycle.duration;
      return acc;
    }, {} as Record<string, number>);

    const total = Object.values(stats).reduce((sum, duration) => sum + duration, 0);
    
    return Object.entries(stats).map(([phase, duration]) => ({
      phase: phase as SleepCycle['phase'],
      duration,
      percentage: total > 0 ? Math.round((duration / total) * 100) : 0
    }));
  };

  if (isAnalyzing) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
        <p className="text-gray-600 dark:text-gray-400">Analyzing your sleep cycles...</p>
      </div>
    );
  }

  const phaseStats = calculatePhaseStats();

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Sleep Cycle Analysis
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
          Based on your {totalSleepHours}h sleep with quality rating of {sleepQuality}/10
        </p>
      </div>

      {/* Phase Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {phaseStats.map(({ phase, duration, percentage }) => (
          <div key={phase} className={`p-4 rounded-lg border ${getPhaseColor(phase)}`}>
            <div className="flex items-center space-x-2 mb-2">
              {getPhaseIcon(phase)}
              <span className="font-medium text-gray-900 dark:text-white capitalize">
                {phase}
              </span>
            </div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {Math.round(duration)}m
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              {percentage}% of sleep
            </div>
          </div>
        ))}
      </div>

      {/* Sleep Cycle Timeline */}
      <div>
        <h4 className="font-medium text-gray-900 dark:text-white mb-3">
          Sleep Cycle Timeline
        </h4>
        <div className="space-y-2">
          {cycles.map((cycle, index) => (
            <div key={index} className={`flex items-center justify-between p-3 rounded-lg border ${getPhaseColor(cycle.phase)}`}>
              <div className="flex items-center space-x-3">
                {getPhaseIcon(cycle.phase)}
                <div>
                  <div className="font-medium text-gray-900 dark:text-white capitalize">
                    {cycle.phase} Sleep
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {getPhaseDescription(cycle.phase)}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="font-medium text-gray-900 dark:text-white">
                  {cycle.startTime}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  {cycle.duration}min
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Sleep Quality Insights */}
      <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
        <h4 className="font-medium text-gray-900 dark:text-white mb-2">
          💡 Sleep Insights
        </h4>
        <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
          {sleepQuality >= 8 && (
            <p>✅ Excellent sleep quality! Your cycles show good deep and REM sleep.</p>
          )}
          {sleepQuality >= 6 && sleepQuality < 8 && (
            <p>👍 Good sleep quality. Consider optimizing your sleep environment for deeper rest.</p>
          )}
          {sleepQuality < 6 && (
            <p>⚠️ Sleep quality could improve. Try establishing a consistent bedtime routine.</p>
          )}
          {phaseStats.find(s => s.phase === 'deep')?.percentage! < 20 && (
            <p>💤 Low deep sleep detected. Avoid caffeine 6 hours before bed.</p>
          )}
          {phaseStats.find(s => s.phase === 'rem')?.percentage! < 20 && (
            <p>🧠 Low REM sleep. REM is crucial for memory and learning.</p>
          )}
        </div>
      </div>
    </div>
  );
}