'use client';

import { useState } from 'react';
import { AlarmClock, Bell, Sun, Volume2 } from 'lucide-react';

export default function SmartAlarm() {
  const [alarmTime, setAlarmTime] = useState('07:00');
  const [wakeWindow, setWakeWindow] = useState(30); // minutes
  const [alarmSound, setAlarmSound] = useState('gentle');
  const [gradualWake, setGradualWake] = useState(true);
  const [enabled, setEnabled] = useState(false);

  const alarmSounds = [
    { id: 'gentle', name: 'Gentle Chimes', icon: '🔔' },
    { id: 'birds', name: 'Birds Chirping', icon: '🐦' },
    { id: 'ocean', name: 'Ocean Waves', icon: '🌊' },
    { id: 'piano', name: 'Soft Piano', icon: '🎹' },
    { id: 'nature', name: 'Nature Sounds', icon: '🌿' },
  ];

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-br from-purple-500 to-indigo-600 rounded-2xl p-6 text-white">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <AlarmClock size={32} />
            <div>
              <h2 className="text-2xl font-bold">Smart Alarm</h2>
              <p className="text-purple-100 text-sm">Wake during lightest sleep phase</p>
            </div>
          </div>
          <button
            onClick={() => setEnabled(!enabled)}
            className={`relative w-16 h-8 rounded-full transition-colors ${
              enabled ? 'bg-green-500' : 'bg-white/30'
            }`}
          >
            <div
              className={`absolute top-1 left-1 w-6 h-6 bg-white rounded-full transition-transform ${
                enabled ? 'transform translate-x-8' : ''
              }`}
            />
          </button>
        </div>

        <div className="text-6xl font-bold text-center my-8">
          {alarmTime}
        </div>

        <div className="text-center text-purple-100">
          {enabled ? (
            <p>Alarm will ring between {alarmTime} and {calculateEndTime(alarmTime, wakeWindow)}</p>
          ) : (
            <p>Alarm is off</p>
          )}
        </div>
      </div>

      {/* Alarm Time */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
          Target Wake Time
        </label>
        <input
          type="time"
          value={alarmTime}
          onChange={(e) => setAlarmTime(e.target.value)}
          className="w-full px-4 py-3 text-2xl text-center border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
        />
      </div>

      {/* Wake Window */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
          Smart Wake Window: {wakeWindow} minutes
        </label>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
          Alarm will ring during your lightest sleep phase within this window
        </p>
        <input
          type="range"
          min="10"
          max="60"
          step="5"
          value={wakeWindow}
          onChange={(e) => setWakeWindow(parseInt(e.target.value))}
          className="w-full"
        />
        <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mt-2">
          <span>10 min</span>
          <span>60 min</span>
        </div>
      </div>

      {/* Alarm Sound */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
          Alarm Sound
        </label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {alarmSounds.map(sound => (
            <button
              key={sound.id}
              onClick={() => setAlarmSound(sound.id)}
              className={`p-4 rounded-lg transition-all ${
                alarmSound === sound.id
                  ? 'bg-gradient-to-br from-purple-500 to-indigo-600 text-white shadow-lg'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-purple-50 dark:hover:bg-purple-900/20'
              }`}
            >
              <div className="text-3xl mb-2">{sound.icon}</div>
              <div className="text-sm font-semibold">{sound.name}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Gradual Wake */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Sun size={24} className="text-orange-500" />
            <div>
              <p className="font-semibold text-gray-900 dark:text-white">Gradual Wake-Up</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Alarm volume increases slowly over 5 minutes
              </p>
            </div>
          </div>
          <button
            onClick={() => setGradualWake(!gradualWake)}
            className={`relative w-14 h-7 rounded-full transition-colors ${
              gradualWake ? 'bg-purple-500' : 'bg-gray-300 dark:bg-gray-600'
            }`}
          >
            <div
              className={`absolute top-1 left-1 w-5 h-5 bg-white rounded-full transition-transform ${
                gradualWake ? 'transform translate-x-7' : ''
              }`}
            />
          </button>
        </div>
      </div>

      {/* Info */}
      <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-6">
        <h3 className="font-bold text-blue-900 dark:text-blue-400 mb-2">
          How Smart Alarm Works
        </h3>
        <ul className="space-y-2 text-sm text-blue-800 dark:text-blue-300">
          <li>• Monitors your sleep cycles throughout the night</li>
          <li>• Detects when you're in light sleep phase</li>
          <li>• Wakes you during lightest sleep within your wake window</li>
          <li>• Helps you feel more refreshed and energized</li>
          <li>• No wearable device needed - uses audio analysis</li>
        </ul>
      </div>
    </div>
  );
}

function calculateEndTime(startTime: string, windowMinutes: number): string {
  const [hours, minutes] = startTime.split(':').map(Number);
  const totalMinutes = hours * 60 + minutes + windowMinutes;
  const endHours = Math.floor(totalMinutes / 60) % 24;
  const endMinutes = totalMinutes % 60;
  return `${endHours.toString().padStart(2, '0')}:${endMinutes.toString().padStart(2, '0')}`;
}
