'use client';

import { useState, useEffect, useRef } from 'react';
import { Play, Pause, Volume2, VolumeX, Clock } from 'lucide-react';
import sleepSoundsData from '@/data/sleep-sounds.json';

export default function SleepSoundPlayer() {
  const [selectedSounds, setSelectedSounds] = useState<string[]>([]);
  const [playing, setPlaying] = useState(false);
  const [volumes, setVolumes] = useState<{ [key: string]: number }>({});
  const [timer, setTimer] = useState<number | null>(null);
  const audioRefs = useRef<{ [key: string]: HTMLAudioElement }>({});

  const toggleSound = (soundId: string) => {
    if (selectedSounds.includes(soundId)) {
      setSelectedSounds(selectedSounds.filter(id => id !== soundId));
      if (audioRefs.current[soundId]) {
        audioRefs.current[soundId].pause();
        audioRefs.current[soundId].currentTime = 0;
      }
    } else {
      setSelectedSounds([...selectedSounds, soundId]);
      if (!volumes[soundId]) {
        setVolumes({ ...volumes, [soundId]: 0.5 });
      }
    }
  };

  const togglePlayPause = () => {
    if (playing) {
      // Pause all
      selectedSounds.forEach(soundId => {
        if (audioRefs.current[soundId]) {
          audioRefs.current[soundId].pause();
        }
      });
    } else {
      // Play all
      selectedSounds.forEach(soundId => {
        if (audioRefs.current[soundId]) {
          audioRefs.current[soundId].play();
        }
      });
    }
    setPlaying(!playing);
  };

  const setVolume = (soundId: string, volume: number) => {
    setVolumes({ ...volumes, [soundId]: volume });
    if (audioRefs.current[soundId]) {
      audioRefs.current[soundId].volume = volume;
    }
  };

  const setTimerDuration = (minutes: number) => {
    setTimer(minutes);
    if (minutes > 0) {
      setTimeout(() => {
        selectedSounds.forEach(soundId => {
          if (audioRefs.current[soundId]) {
            audioRefs.current[soundId].pause();
          }
        });
        setPlaying(false);
        setTimer(null);
      }, minutes * 60 * 1000);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Sleep Sounds
        </h2>
        <div className="flex items-center space-x-3">
          {selectedSounds.length > 0 && (
            <button
              onClick={togglePlayPause}
              className={`p-3 rounded-full ${
                playing
                  ? 'bg-red-500 hover:bg-red-600'
                  : 'bg-green-500 hover:bg-green-600'
              } text-white transition-colors`}
            >
              {playing ? <Pause size={24} /> : <Play size={24} />}
            </button>
          )}
        </div>
      </div>

      {/* Timer */}
      {selectedSounds.length > 0 && (
        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
          <div className="flex items-center space-x-3 mb-3">
            <Clock size={20} className="text-blue-600 dark:text-blue-400" />
            <span className="font-semibold text-gray-900 dark:text-white">
              Sleep Timer
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            {[15, 30, 45, 60, 90, 120].map(minutes => (
              <button
                key={minutes}
                onClick={() => setTimerDuration(minutes)}
                className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                  timer === minutes
                    ? 'bg-blue-600 text-white'
                    : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-blue-100 dark:hover:bg-blue-900/30'
                }`}
              >
                {minutes}min
              </button>
            ))}
          </div>
          {timer && (
            <p className="text-sm text-blue-600 dark:text-blue-400 mt-2">
              Sounds will stop in {timer} minutes
            </p>
          )}
        </div>
      )}

      {/* Sound Categories */}
      {sleepSoundsData.categories.map(category => (
        <div key={category.id} className="space-y-3">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center space-x-2">
            <span>{category.icon}</span>
            <span>{category.name}</span>
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {category.sounds.map(sound => {
              const isSelected = selectedSounds.includes(sound.id);
              return (
                <div key={sound.id}>
                  <button
                    onClick={() => toggleSound(sound.id)}
                    className={`w-full p-4 rounded-lg transition-all ${
                      isSelected
                        ? 'bg-gradient-to-br from-purple-500 to-purple-700 text-white shadow-lg'
                        : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-purple-50 dark:hover:bg-purple-900/20'
                    }`}
                  >
                    <div className="text-center">
                      <p className="font-semibold">{sound.name}</p>
                      <p className="text-xs opacity-75 mt-1">{sound.duration}</p>
                    </div>
                  </button>

                  {/* Volume Control */}
                  {isSelected && (
                    <div className="mt-2 px-2">
                      <div className="flex items-center space-x-2">
                        <VolumeX size={16} className="text-gray-500" />
                        <input
                          type="range"
                          min="0"
                          max="1"
                          step="0.1"
                          value={volumes[sound.id] || 0.5}
                          onChange={(e) => setVolume(sound.id, parseFloat(e.target.value))}
                          className="flex-1"
                        />
                        <Volume2 size={16} className="text-gray-500" />
                      </div>
                    </div>
                  )}

                  {/* Hidden Audio Element */}
                  {isSelected && (
                    <audio
                      ref={(el) => {
                        if (el) audioRefs.current[sound.id] = el;
                      }}
                      loop
                      src={sound.url}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ))}

      {selectedSounds.length === 0 && (
        <div className="text-center py-12 text-gray-500 dark:text-gray-400">
          <p>Select sounds to create your perfect sleep environment</p>
          <p className="text-sm mt-2">You can mix multiple sounds together</p>
        </div>
      )}
    </div>
  );
}
