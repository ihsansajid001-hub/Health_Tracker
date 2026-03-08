'use client';

import { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, Plus, Minus } from 'lucide-react';

export default function RestTimer() {
  const [restTime, setRestTime] = useState(60); // seconds
  const [timeLeft, setTimeLeft] = useState(60);
  const [isActive, setIsActive] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(time => {
          if (time <= 1) {
            setIsActive(false);
            setIsComplete(true);
            // Play sound notification
            playNotificationSound();
            return 0;
          }
          return time - 1;
        });
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, timeLeft]);

  const playNotificationSound = () => {
    // Play a beep sound
    const audio = new Audio('/sounds/beep.mp3');
    audio.play().catch(() => {});
  };

  const startTimer = () => {
    setIsActive(true);
    setIsComplete(false);
  };

  const pauseTimer = () => {
    setIsActive(false);
  };

  const resetTimer = () => {
    setIsActive(false);
    setTimeLeft(restTime);
    setIsComplete(false);
  };

  const adjustRestTime = (seconds: number) => {
    const newTime = Math.max(10, Math.min(300, restTime + seconds));
    setRestTime(newTime);
    if (!isActive) {
      setTimeLeft(newTime);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = ((restTime - timeLeft) / restTime) * 100;

  return (
    <div className="max-w-md mx-auto">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
        {/* Timer Display */}
        <div className="relative mb-8">
          {/* Progress Ring */}
          <svg className="w-64 h-64 mx-auto transform -rotate-90">
            <circle
              cx="128"
              cy="128"
              r="120"
              stroke="currentColor"
              strokeWidth="8"
              fill="none"
              className="text-gray-200 dark:text-gray-700"
            />
            <circle
              cx="128"
              cy="128"
              r="120"
              stroke="currentColor"
              strokeWidth="8"
              fill="none"
              strokeDasharray={`${2 * Math.PI * 120}`}
              strokeDashoffset={`${2 * Math.PI * 120 * (1 - progress / 100)}`}
              className={`transition-all duration-1000 ${
                isComplete ? 'text-green-500' : 'text-red-500'
              }`}
              strokeLinecap="round"
            />
          </svg>

          {/* Time Display */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className={`text-6xl font-bold ${
                isComplete ? 'text-green-500' : 'text-gray-900 dark:text-white'
              }`}>
                {formatTime(timeLeft)}
              </div>
              {isComplete && (
                <div className="text-green-500 font-semibold mt-2 animate-pulse">
                  Rest Complete!
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Rest Time Adjustment */}
        {!isActive && !isComplete && (
          <div className="mb-6">
            <p className="text-center text-sm text-gray-600 dark:text-gray-400 mb-3">
              Adjust Rest Time
            </p>
            <div className="flex items-center justify-center space-x-4">
              <button
                onClick={() => adjustRestTime(-10)}
                className="p-3 bg-gray-200 dark:bg-gray-700 rounded-full hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
              >
                <Minus size={20} />
              </button>
              <span className="text-2xl font-bold text-gray-900 dark:text-white w-24 text-center">
                {restTime}s
              </span>
              <button
                onClick={() => adjustRestTime(10)}
                className="p-3 bg-gray-200 dark:bg-gray-700 rounded-full hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
              >
                <Plus size={20} />
              </button>
            </div>
          </div>
        )}

        {/* Quick Time Buttons */}
        {!isActive && !isComplete && (
          <div className="grid grid-cols-4 gap-2 mb-6">
            {[30, 60, 90, 120].map(seconds => (
              <button
                key={seconds}
                onClick={() => {
                  setRestTime(seconds);
                  setTimeLeft(seconds);
                }}
                className={`py-2 rounded-lg font-semibold text-sm transition-colors ${
                  restTime === seconds
                    ? 'bg-red-500 text-white'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-red-100 dark:hover:bg-red-900/20'
                }`}
              >
                {seconds}s
              </button>
            ))}
          </div>
        )}

        {/* Controls */}
        <div className="flex items-center justify-center space-x-4">
          {!isActive ? (
            <button
              onClick={startTimer}
              className="px-8 py-4 bg-gradient-to-r from-green-500 to-green-700 text-white rounded-xl font-semibold flex items-center space-x-2 hover:shadow-lg transform hover:scale-[1.02] transition-all"
            >
              <Play size={24} />
              <span>Start</span>
            </button>
          ) : (
            <button
              onClick={pauseTimer}
              className="px-8 py-4 bg-gradient-to-r from-orange-500 to-orange-700 text-white rounded-xl font-semibold flex items-center space-x-2 hover:shadow-lg transform hover:scale-[1.02] transition-all"
            >
              <Pause size={24} />
              <span>Pause</span>
            </button>
          )}
          
          <button
            onClick={resetTimer}
            className="px-8 py-4 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl font-semibold flex items-center space-x-2 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
          >
            <RotateCcw size={24} />
            <span>Reset</span>
          </button>
        </div>

        {/* Info */}
        <div className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
          <p>Rest between sets to maximize performance and prevent injury</p>
        </div>
      </div>
    </div>
  );
}
