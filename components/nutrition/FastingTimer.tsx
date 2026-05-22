'use client';

import { useState, useEffect } from 'react';
import { Clock, Play, Pause, Square, TrendingUp } from 'lucide-react';

interface FastingPlan {
  id: string;
  name: string;
  fastingHours: number;
  eatingHours: number;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  benefits: string[];
}

const fastingPlans: FastingPlan[] = [
  { id: '16-8',  name: '16:8',         fastingHours: 16, eatingHours: 8,  description: 'Fast 16h, eat within 8h. Most popular.',          difficulty: 'beginner',     benefits: ['Weight loss', 'Insulin sensitivity', 'Cellular repair'] },
  { id: '14-10', name: '14:10',        fastingHours: 14, eatingHours: 10, description: 'Gentle intro to IF. Fast 14h, eat within 10h.',    difficulty: 'beginner',     benefits: ['Easy to maintain', 'Better sleep', 'Digestive rest'] },
  { id: '18-6',  name: '18:6',         fastingHours: 18, eatingHours: 6,  description: 'Extended 18h fast, 6h eating window.',             difficulty: 'intermediate', benefits: ['Enhanced autophagy', 'Fat burning', 'Mental clarity'] },
  { id: '20-4',  name: '20:4 Warrior', fastingHours: 20, eatingHours: 4,  description: 'Fast 20h with a 4h eating window.',                difficulty: 'advanced',     benefits: ['Max autophagy', 'Hormone optimization', 'Deep ketosis'] },
  { id: '23-1',  name: 'OMAD',         fastingHours: 23, eatingHours: 1,  description: 'One Meal A Day. Fast 23h, eat one meal.',           difficulty: 'advanced',     benefits: ['Simplicity', 'Time saving', 'Maximum benefits'] },
];

const difficultyStyle: Record<string, string> = {
  beginner:     'bg-green-100 text-green-700',
  intermediate: 'bg-amber-100 text-amber-700',
  advanced:     'bg-red-100 text-red-700',
};

interface Props { onFastingComplete?: () => void; }

export default function FastingTimer({ onFastingComplete }: Props) {
  const [selectedPlan, setSelectedPlan] = useState<FastingPlan>(fastingPlans[0]);
  const [isActive, setIsActive] = useState(false);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [phase, setPhase] = useState<'fasting' | 'eating' | 'complete'>('fasting');

  useEffect(() => {
    const t = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    if (!isActive || !startTime) return;
    const elapsed = (currentTime.getTime() - startTime.getTime()) / 3600000;
    if (elapsed >= selectedPlan.fastingHours && phase === 'fasting') setPhase('eating');
    else if (elapsed >= selectedPlan.fastingHours + selectedPlan.eatingHours && phase === 'eating') {
      setPhase('complete'); setIsActive(false); onFastingComplete?.();
    }
  }, [currentTime]);

  const getElapsed = () => {
    if (!startTime) return { h: 0, m: 0, s: 0 };
    const e = (currentTime.getTime() - startTime.getTime()) / 1000;
    return { h: Math.floor(e / 3600), m: Math.floor((e % 3600) / 60), s: Math.floor(e % 60) };
  };

  const getRemaining = () => {
    if (!startTime) return { h: selectedPlan.fastingHours, m: 0, s: 0 };
    const elapsed = (currentTime.getTime() - startTime.getTime()) / 3600000;
    const target = phase === 'fasting' ? selectedPlan.fastingHours : selectedPlan.fastingHours + selectedPlan.eatingHours;
    const rem = Math.max(0, target - elapsed);
    return { h: Math.floor(rem), m: Math.floor((rem % 1) * 60), s: Math.floor(((rem % 1) * 60 % 1) * 60) };
  };

  const getPhaseProgress = () => {
    if (!startTime) return 0;
    const elapsed = (currentTime.getTime() - startTime.getTime()) / 3600000;
    if (phase === 'fasting') return Math.min(100, (elapsed / selectedPlan.fastingHours) * 100);
    if (phase === 'eating') return Math.min(100, ((elapsed - selectedPlan.fastingHours) / selectedPlan.eatingHours) * 100);
    return 100;
  };

  const elapsed = getElapsed();
  const remaining = getRemaining();
  const progress = getPhaseProgress();

  const phaseColor = phase === 'fasting' ? 'bg-orange-500' : phase === 'eating' ? 'bg-green-500' : 'bg-purple-500';
  const phaseLabel = phase === 'fasting' ? '🚫 Fasting Phase' : phase === 'eating' ? '🍽️ Eating Window' : '✅ Cycle Complete';

  const pad = (n: number) => n.toString().padStart(2, '0');

  return (
    <div className="space-y-6">
      {/* Plan cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {fastingPlans.map((plan) => (
          <button
            key={plan.id}
            onClick={() => !isActive && setSelectedPlan(plan)}
            disabled={isActive}
            className={`text-left p-4 rounded-2xl border-2 transition-all ${
              selectedPlan.id === plan.id
                ? 'border-orange-400 bg-orange-50 shadow-md shadow-orange-100'
                : 'border-gray-100 bg-white hover:border-orange-200'
            } ${isActive ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="font-black text-gray-900">{plan.name}</span>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${difficultyStyle[plan.difficulty]}`}>
                {plan.difficulty}
              </span>
            </div>
            <p className="text-xs text-gray-500 mb-3">{plan.description}</p>
            <div className="flex gap-4">
              <div>
                <p className="font-black text-orange-500 text-lg leading-none">{plan.fastingHours}h</p>
                <p className="text-[10px] text-gray-400 font-semibold">Fast</p>
              </div>
              <div>
                <p className="font-black text-green-500 text-lg leading-none">{plan.eatingHours}h</p>
                <p className="text-[10px] text-gray-400 font-semibold">Eat</p>
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* Timer card */}
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
        <div className="text-center">
          {/* Phase badge */}
          <span className={`inline-block px-4 py-1.5 rounded-full text-white text-sm font-black mb-6 ${phaseColor}`}>
            {phaseLabel}
          </span>

          {/* Elapsed */}
          <div className="mb-2">
            <p className="text-6xl font-black text-gray-900 tabular-nums tracking-tight">
              {pad(elapsed.h)}:{pad(elapsed.m)}:{pad(elapsed.s)}
            </p>
            <p className="text-sm text-gray-400 font-semibold mt-1">Elapsed Time</p>
          </div>

          {/* Remaining */}
          {isActive && (
            <div className="mb-6">
              <p className="text-2xl font-black text-gray-600 tabular-nums">
                {pad(remaining.h)}:{pad(remaining.m)}:{pad(remaining.s)}
              </p>
              <p className="text-xs text-gray-400 font-semibold">
                {phase === 'fasting' ? 'Until Eating Window' : 'Until Next Fast'}
              </p>
            </div>
          )}

          {/* Progress bar */}
          <div className="mb-8">
            <div className="flex justify-between text-xs font-semibold text-gray-400 mb-2">
              <span>{phase === 'fasting' ? 'Fasting Progress' : 'Eating Window'}</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-1000 ${phaseColor}`}
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* Controls */}
          <div className="flex justify-center gap-3">
            {!isActive ? (
              <button
                onClick={() => { setStartTime(new Date()); setIsActive(true); setPhase('fasting'); }}
                className="flex items-center gap-2 px-8 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-2xl font-black text-sm transition-all shadow-lg shadow-orange-200 hover:-translate-y-0.5"
              >
                <Play size={18} /> Start Fasting
              </button>
            ) : (
              <>
                <button onClick={() => setIsActive(false)} className="flex items-center gap-2 px-6 py-3 bg-amber-500 hover:bg-amber-600 text-white rounded-2xl font-black text-sm transition-colors">
                  <Pause size={18} /> Pause
                </button>
                <button onClick={() => { setIsActive(false); setStartTime(null); setPhase('fasting'); }} className="flex items-center gap-2 px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-2xl font-black text-sm transition-colors">
                  <Square size={18} /> Stop
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Benefits */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
        <p className="font-black text-gray-900 mb-3">Benefits of {selectedPlan.name}</p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {selectedPlan.benefits.map((b, i) => (
            <div key={i} className="flex items-center gap-2 p-3 bg-green-50 rounded-xl">
              <TrendingUp size={14} className="text-green-500 flex-shrink-0" />
              <span className="text-xs font-semibold text-green-700">{b}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Tips */}
      <div className="bg-amber-50 rounded-2xl p-5 border border-amber-100">
        <p className="font-black text-amber-800 mb-3 text-sm">💡 Fasting Tips</p>
        <ul className="space-y-1.5 text-xs text-amber-700 font-semibold">
          {['Stay hydrated with water, herbal tea, and black coffee', 'Start gradually and listen to your body', 'Break your fast with nutritious, whole foods', 'Avoid intense exercise during extended fasts', 'Consult a healthcare provider if you have medical conditions'].map((tip, i) => (
            <li key={i}>• {tip}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
