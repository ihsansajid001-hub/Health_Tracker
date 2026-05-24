'use client';

import { useState } from 'react';
import { Play, Clock, Flame, AlertTriangle, ShieldAlert } from 'lucide-react';
import exercisesData from '@/data/exercises.json';
import { checkExerciseSafety } from '@/lib/safety/medicalConditions';

interface ExerciseLibraryProps {
  userConditions?: string[];
  onStartExercise?: (exerciseId: string) => void;
}

const DIFFICULTY_STYLES: Record<string, { pill: string; dot: string }> = {
  beginner:     { pill: 'bg-emerald-50 text-emerald-600 border border-emerald-100',  dot: 'bg-emerald-400' },
  intermediate: { pill: 'bg-amber-50 text-amber-600 border border-amber-100',        dot: 'bg-amber-400' },
  advanced:     { pill: 'bg-red-50 text-red-600 border border-red-100',              dot: 'bg-red-400' },
};

export default function ExerciseLibrary({ userConditions = [], onStartExercise }: ExerciseLibraryProps) {
  const [category, setCategory] = useState(exercisesData.categories[0].id);
  const [difficulty, setDifficulty] = useState('all');

  const currentCat = exercisesData.categories.find(c => c.id === category);
  const exercises = (currentCat?.exercises ?? []).filter(e =>
    difficulty === 'all' || e.difficulty === difficulty
  );

  return (
    <div className="space-y-5">

      {/* Category tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
        {exercisesData.categories.map(cat => (
          <button key={cat.id} onClick={() => setCategory(cat.id)}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-[12px] font-bold whitespace-nowrap transition-all ${
              category === cat.id
                ? 'bg-gray-900 text-white shadow-sm'
                : 'bg-gray-100 text-gray-500 hover:bg-gray-200 hover:text-gray-700'
            }`}>
            <span>{cat.icon}</span>
            <span>{cat.name}</span>
          </button>
        ))}
      </div>

      {/* Difficulty filter */}
      <div className="flex gap-2">
        {['all', 'beginner', 'intermediate', 'advanced'].map(d => (
          <button key={d} onClick={() => setDifficulty(d)}
            className={`px-3.5 py-1.5 rounded-xl text-[12px] font-bold capitalize transition-all ${
              difficulty === d
                ? 'bg-gray-900 text-white'
                : 'bg-gray-100 text-gray-500 hover:bg-gray-200 hover:text-gray-700'
            }`}>
            {d}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {exercises.map(ex => {
          const safety = checkExerciseSafety(ex.name, ex.difficulty, {
            conditions: userConditions as any[], allergies: [], medications: [],
            age: 30, weight: 70, height: 170, gender: 'male',
          });
          const blocked = !safety.isSafe;
          const ds = DIFFICULTY_STYLES[ex.difficulty] ?? DIFFICULTY_STYLES.beginner;

          return (
            <div key={ex.id}
              className={`bg-white rounded-2xl border border-gray-100 overflow-hidden transition-all hover:shadow-md hover:-translate-y-0.5 ${blocked ? 'opacity-60' : ''}`}>

              {/* Header */}
              <div className="px-4 pt-4 pb-3 border-b border-gray-50">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="text-[14px] font-black text-gray-900 leading-snug">{ex.name}</h3>
                  <span className={`flex-shrink-0 flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-black capitalize ${ds.pill}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${ds.dot}`} />
                    {ex.difficulty}
                  </span>
                </div>
                <p className="text-[11px] text-gray-500 mt-1.5 leading-relaxed line-clamp-2">{ex.instructions}</p>
              </div>

              {/* Stats */}
              <div className="px-4 py-3 space-y-3">
                <div className="grid grid-cols-2 gap-2">
                  {ex.reps && (
                    <div className="bg-gray-50 rounded-xl px-3 py-2">
                      <p className="text-[9px] font-black uppercase text-gray-400 mb-0.5">Reps</p>
                      <p className="text-[13px] font-black text-gray-900">{ex.reps}</p>
                    </div>
                  )}
                  {ex.sets && (
                    <div className="bg-gray-50 rounded-xl px-3 py-2">
                      <p className="text-[9px] font-black uppercase text-gray-400 mb-0.5">Sets</p>
                      <p className="text-[13px] font-black text-gray-900">{ex.sets}</p>
                    </div>
                  )}
                  <div className="bg-gray-50 rounded-xl px-3 py-2 flex items-center gap-1.5">
                    <Clock size={11} className="text-gray-400 flex-shrink-0" />
                    <div>
                      <p className="text-[9px] font-black uppercase text-gray-400">Duration</p>
                      <p className="text-[13px] font-black text-gray-900">{ex.duration}s</p>
                    </div>
                  </div>
                  <div className="bg-orange-50 rounded-xl px-3 py-2 flex items-center gap-1.5">
                    <Flame size={11} className="text-orange-400 flex-shrink-0" />
                    <div>
                      <p className="text-[9px] font-black uppercase text-orange-400">Calories</p>
                      <p className="text-[13px] font-black text-gray-900">{ex.calories} cal</p>
                    </div>
                  </div>
                </div>

                {/* Muscles */}
                <div className="flex flex-wrap gap-1">
                  {ex.targetMuscles.map(m => (
                    <span key={m} className="px-2 py-0.5 bg-orange-50 text-orange-500 text-[10px] font-bold rounded-lg border border-orange-100">
                      {m.replace('_', ' ')}
                    </span>
                  ))}
                </div>

                {/* Safety */}
                {blocked && (
                  <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-100 rounded-xl">
                    <ShieldAlert size={14} className="text-red-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-[11px] font-black text-red-600 mb-0.5">Not safe for you</p>
                      {safety.blockers.slice(0, 1).map((b, i) => (
                        <p key={i} className="text-[10px] text-red-500">{b}</p>
                      ))}
                    </div>
                  </div>
                )}
                {!blocked && safety.warnings.length > 0 && (
                  <div className="flex items-start gap-2 p-3 bg-amber-50 border border-amber-100 rounded-xl">
                    <AlertTriangle size={14} className="text-amber-500 flex-shrink-0 mt-0.5" />
                    <p className="text-[10px] text-amber-600 font-semibold">{safety.warnings[0]}</p>
                  </div>
                )}

                {/* CTA */}
                <button
                  onClick={() => !blocked && onStartExercise?.(ex.id)}
                  disabled={blocked}
                  className={`w-full py-2.5 rounded-xl text-[12px] font-black flex items-center justify-center gap-2 transition-all ${
                    blocked
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'bg-gray-900 text-white hover:bg-gray-800 active:scale-[0.98]'
                  }`}>
                  <Play size={13} fill="currentColor" />
                  {blocked ? 'Not Available' : 'Start Exercise'}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {exercises.length === 0 && (
        <div className="text-center py-16 text-gray-400">
          <p className="text-[13px] font-semibold">No exercises for this filter</p>
        </div>
      )}
    </div>
  );
}
