'use client';

import { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw } from 'lucide-react';
import breathingData from '@/data/breathing-exercises.json';

export default function BreathingExercise() {
  const [selectedExercise, setSelectedExercise] = useState(breathingData.exercises[0]);
  const [isActive, setIsActive] = useState(false);
  const [phase, setPhase] = useState<'inhale' | 'hold1' | 'exhale' | 'hold2'>('inhale');
  const [countdown, setCountdown] = useState(selectedExercise.pattern.inhale);
  const [cyclesCompleted, setCyclesCompleted] = useState(0);

  useEffect(() => {
    if (!isActive) return;

    const interval = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          // Move to next phase
          switch (phase) {
            case 'inhale':
              if (selectedExercise.pattern.hold1 > 0) {
                setPhase('hold1');
                return selectedExercise.pattern.hold1;
              } else {
                setPhase('exhale');
                return selectedExercise.pattern.exhale;
              }
            case 'hold1':
              setPhase('exhale');
              return selectedExercise.pattern.exhale;
            case 'exhale':
              if (selectedExercise.pattern.hold2 > 0) {
                setPhase('hold2');
                return selectedExercise.pattern.hold2;
              } else {
                setPhase('inhale');
                setCyclesCompleted(c => c + 1);
                return selectedExercise.pattern.inhale;
              }
            case 'hold2':
              setPhase('inhale');
              setCyclesCompleted(c => c + 1);
              return selectedExercise.pattern.inhale;
          }
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isActive, phase, selectedExercise]);

  const startExercise = () => {
    setIsActive(true);
    setPhase('inhale');
    setCountdown(selectedExercise.pattern.inhale);
    setCyclesCompleted(0);
  };

  const pauseExercise = () => {
    setIsActive(false);
  };

  const resetExercise = () => {
    setIsActive(false);
    setPhase('inhale');
    setCountdown(selectedExercise.pattern.inhale);
    setCyclesCompleted(0);
  };

  const getPhaseText = () => {
    switch (phase) {
      case 'inhale': return 'Breathe In';
      case 'hold1': return 'Hold';
      case 'exhale': return 'Breathe Out';
      case 'hold2': return 'Hold';
    }
  };

  const getPhaseColor = () => {
    switch (phase) {
      case 'inhale': return 'from-blue-500 to-cyan-500';
      case 'hold1': return 'from-purple-500 to-pink-500';
      case 'exhale': return 'from-green-500 to-teal-500';
      case 'hold2': return 'from-orange-500 to-red-500';
    }
  };

  return (
    <div className="space-y-6">
      {/* Exercise Selection */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {breathingData.exercises.map(exercise => (
          <button
            key={exercise.id}
            onClick={() => {
              setSelectedExercise(exercise);
              resetExercise();
            }}
            className={`p-4 rounded-lg text-left transition-all ${
              selectedExercise.id === exercise.id
                ? 'bg-gradient-to-br from-blue-500 to-purple-600 text-white shadow-lg'
                : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-blue-900/20'
            }`}
          >
            <h3 className="font-bold">{exercise.name}</h3>
            <p className="text-sm opacity-90 mt-1">{exercise.duration} min</p>
            <span className={`inline-block px-2 py-1 rounded text-xs mt-2 ${
              selectedExercise.id === exercise.id
                ? 'bg-white/20'
                : 'bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400'
            }`}>
              {exercise.difficulty}
            </span>
          </button>
        ))}
      </div>

      {/* Breathing Circle */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
        <div className="flex flex-col items-center space-y-6">
          {/* Circle Animation */}
          <div className="relative w-64 h-64 flex items-center justify-center">
            <div
              className={`absolute inset-0 rounded-full bg-gradient-to-br ${getPhaseColor()} transition-all duration-1000 ${
                isActive ? 'scale-100 opacity-100' : 'scale-75 opacity-50'
              }`}
              style={{
                transform: phase === 'inhale' ? 'scale(1.2)' : phase === 'exhale' ? 'scale(0.8)' : 'scale(1)',
                transition: 'transform 1s ease-in-out'
              }}
            />
            <div className="relative z-10 text-center text-white">
              <div className="text-6xl font-bold">{countdown}</div>
              <div className="text-xl mt-2">{getPhaseText()}</div>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center space-x-4">
            {!isActive ? (
              <button
                onClick={startExercise}
                className="px-8 py-3 bg-gradient-to-r from-green-500 to-green-700 text-white rounded-lg font-semibold flex items-center space-x-2 hover:shadow-lg transform hover:scale-[1.02] transition-all"
              >
                <Play size={20} />
                <span>Start</span>
              </button>
            ) : (
              <button
                onClick={pauseExercise}
                className="px-8 py-3 bg-gradient-to-r from-orange-500 to-orange-700 text-white rounded-lg font-semibold flex items-center space-x-2 hover:shadow-lg transform hover:scale-[1.02] transition-all"
              >
                <Pause size={20} />
                <span>Pause</span>
              </button>
            )}
            <button
              onClick={resetExercise}
              className="px-8 py-3 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg font-semibold flex items-center space-x-2 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
            >
              <RotateCcw size={20} />
              <span>Reset</span>
            </button>
          </div>

          {/* Stats */}
          <div className="text-center">
            <p className="text-gray-600 dark:text-gray-400">
              Cycles Completed: <span className="font-bold text-gray-900 dark:text-white">{cyclesCompleted}</span>
            </p>
          </div>
        </div>
      </div>

      {/* Exercise Info */}
      <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-6">
        <h3 className="font-bold text-gray-900 dark:text-white mb-2">
          {selectedExercise.name}
        </h3>
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          {selectedExercise.description}
        </p>
        
        <div className="space-y-3">
          <div>
            <p className="font-semibold text-gray-700 dark:text-gray-300 mb-1">Benefits:</p>
            <div className="flex flex-wrap gap-2">
              {selectedExercise.benefits.map((benefit, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 text-sm rounded-full"
                >
                  {benefit}
                </span>
              ))}
            </div>
          </div>

          <div>
            <p className="font-semibold text-gray-700 dark:text-gray-300 mb-1">Best for:</p>
            <div className="flex flex-wrap gap-2">
              {selectedExercise.useCases.map((useCase, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-sm rounded-full"
                >
                  {useCase}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
