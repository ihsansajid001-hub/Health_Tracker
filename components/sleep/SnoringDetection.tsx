'use client';

import { useState, useRef, useEffect } from 'react';
import { Mic, MicOff, Play, Pause, Square, Volume2, BarChart3 } from 'lucide-react';

interface SnoringEvent {
  timestamp: number;
  duration: number; // seconds
  intensity: number; // 0-100
  type: 'light' | 'moderate' | 'heavy';
}

interface Props {
  onRecordingComplete?: (events: SnoringEvent[]) => void;
}

export default function SnoringDetection({ onRecordingComplete }: Props) {
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [snoringEvents, setSnoringEvents] = useState<SnoringEvent[]>([]);
  const [audioLevel, setAudioLevel] = useState(0);
  const [isSupported, setIsSupported] = useState(true);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const animationRef = useRef<number | null>(null);

  useEffect(() => {
    // Check if browser supports required APIs
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setIsSupported(false);
    }

    return () => {
      stopRecording();
    };
  }, []);

  useEffect(() => {
    if (isRecording && !isPaused) {
      intervalRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRecording, isPaused]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: false,
          noiseSuppression: false,
          autoGainControl: false
        } 
      });
      
      streamRef.current = stream;
      
      // Set up audio analysis
      audioContextRef.current = new AudioContext();
      const source = audioContextRef.current.createMediaStreamSource(stream);
      analyserRef.current = audioContextRef.current.createAnalyser();
      analyserRef.current.fftSize = 2048;
      source.connect(analyserRef.current);
      
      // Set up media recorder
      mediaRecorderRef.current = new MediaRecorder(stream);
      
      setIsRecording(true);
      setRecordingTime(0);
      setSnoringEvents([]);
      
      // Start audio level monitoring
      monitorAudioLevel();
      
    } catch (error) {
      console.error('Error starting recording:', error);
      alert('Could not access microphone. Please check permissions.');
    }
  };

  const monitorAudioLevel = () => {
    if (!analyserRef.current) return;
    
    const bufferLength = analyserRef.current.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    
    const updateLevel = () => {
      if (!analyserRef.current || !isRecording) return;
      
      analyserRef.current.getByteFrequencyData(dataArray);
      
      // Calculate average volume
      let sum = 0;
      for (let i = 0; i < bufferLength; i++) {
        sum += dataArray[i];
      }
      const average = sum / bufferLength;
      const normalizedLevel = (average / 255) * 100;
      
      setAudioLevel(normalizedLevel);
      
      // Detect potential snoring (simplified algorithm)
      if (normalizedLevel > 30) { // Threshold for sound detection
        detectSnoring(normalizedLevel, dataArray);
      }
      
      animationRef.current = requestAnimationFrame(updateLevel);
    };
    
    updateLevel();
  };

  const detectSnoring = (level: number, frequencyData: Uint8Array) => {
    // Simplified snoring detection based on frequency patterns
    // In a real app, you'd use more sophisticated algorithms
    
    // Look for low-frequency dominance (typical of snoring)
    const lowFreqSum = frequencyData.slice(0, 50).reduce((sum, val) => sum + val, 0);
    const midFreqSum = frequencyData.slice(50, 150).reduce((sum, val) => sum + val, 0);
    const highFreqSum = frequencyData.slice(150, 300).reduce((sum, val) => sum + val, 0);
    
    const lowFreqRatio = lowFreqSum / (lowFreqSum + midFreqSum + highFreqSum);
    
    // If low frequencies dominate and volume is significant, it might be snoring
    if (lowFreqRatio > 0.4 && level > 40) {
      const intensity = Math.min(100, level);
      let type: SnoringEvent['type'] = 'light';
      
      if (intensity > 70) type = 'heavy';
      else if (intensity > 50) type = 'moderate';
      
      // Check if this is a continuation of the last event or a new one
      const lastEvent = snoringEvents[snoringEvents.length - 1];
      const currentTime = recordingTime;
      
      if (lastEvent && currentTime - lastEvent.timestamp < 3) {
        // Extend the last event
        setSnoringEvents(prev => {
          const updated = [...prev];
          updated[updated.length - 1] = {
            ...lastEvent,
            duration: currentTime - lastEvent.timestamp,
            intensity: Math.max(lastEvent.intensity, intensity)
          };
          return updated;
        });
      } else {
        // Create new event
        const newEvent: SnoringEvent = {
          timestamp: currentTime,
          duration: 1,
          intensity,
          type
        };
        setSnoringEvents(prev => [...prev, newEvent]);
      }
    }
  };

  const pauseRecording = () => {
    setIsPaused(true);
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
  };

  const resumeRecording = () => {
    setIsPaused(false);
    monitorAudioLevel();
  };

  const stopRecording = () => {
    setIsRecording(false);
    setIsPaused(false);
    
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
    }
    
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
    }
    
    if (audioContextRef.current) {
      audioContextRef.current.close();
    }
    
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
    
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    
    onRecordingComplete?.(snoringEvents);
  };

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  const getSnoringStats = () => {
    const totalEvents = snoringEvents.length;
    const totalDuration = snoringEvents.reduce((sum, event) => sum + event.duration, 0);
    const averageIntensity = totalEvents > 0 
      ? snoringEvents.reduce((sum, event) => sum + event.intensity, 0) / totalEvents 
      : 0;
    
    const typeCount = snoringEvents.reduce((acc, event) => {
      acc[event.type] = (acc[event.type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      totalEvents,
      totalDuration,
      averageIntensity,
      typeCount,
      snoringPercentage: recordingTime > 0 ? (totalDuration / recordingTime) * 100 : 0
    };
  };

  if (!isSupported) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 text-center">
        <MicOff size={48} className="text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          Microphone Not Supported
        </h3>
        <p className="text-gray-600 dark:text-gray-400">
          Your browser doesn't support audio recording. Please use a modern browser like Chrome, Firefox, or Safari.
        </p>
      </div>
    );
  }

  const stats = getSnoringStats();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Snoring Detection
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Monitor your sleep for snoring patterns. Place your device near your bed and start recording before sleep.
        </p>
      </div>

      {/* Recording Controls */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8">
        <div className="text-center mb-8">
          {/* Audio Level Visualizer */}
          <div className="mb-6">
            <div className="w-32 h-32 mx-auto rounded-full border-4 border-gray-200 dark:border-gray-700 flex items-center justify-center relative overflow-hidden">
              <div 
                className={`absolute inset-0 rounded-full transition-all duration-100 ${
                  isRecording && !isPaused ? 'bg-red-500' : 'bg-gray-300 dark:bg-gray-600'
                }`}
                style={{ 
                  transform: `scale(${0.3 + (audioLevel / 100) * 0.7})`,
                  opacity: 0.3 + (audioLevel / 100) * 0.7
                }}
              />
              <Mic size={32} className={`relative z-10 ${
                isRecording && !isPaused ? 'text-white' : 'text-gray-500 dark:text-gray-400'
              }`} />
            </div>
            <div className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              Audio Level: {Math.round(audioLevel)}%
            </div>
          </div>

          {/* Recording Time */}
          <div className="text-4xl font-bold text-gray-900 dark:text-white mb-6">
            {formatTime(recordingTime)}
          </div>

          {/* Controls */}
          <div className="flex justify-center space-x-4">
            {!isRecording ? (
              <button
                onClick={startRecording}
                className="px-8 py-4 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold transition-colors flex items-center space-x-2"
              >
                <Mic size={20} />
                <span>Start Recording</span>
              </button>
            ) : (
              <>
                <button
                  onClick={isPaused ? resumeRecording : pauseRecording}
                  className="px-6 py-3 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg font-semibold transition-colors flex items-center space-x-2"
                >
                  {isPaused ? <Play size={20} /> : <Pause size={20} />}
                  <span>{isPaused ? 'Resume' : 'Pause'}</span>
                </button>
                <button
                  onClick={stopRecording}
                  className="px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-semibold transition-colors flex items-center space-x-2"
                >
                  <Square size={20} />
                  <span>Stop</span>
                </button>
              </>
            )}
          </div>
        </div>

        {/* Live Stats */}
        {isRecording && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-6 border-t border-gray-200 dark:border-gray-700">
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600 dark:text-red-400">
                {stats.totalEvents}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Snoring Events</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                {formatTime(stats.totalDuration)}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Total Duration</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
                {Math.round(stats.averageIntensity)}%
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Avg Intensity</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                {Math.round(stats.snoringPercentage)}%
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Sleep Time</div>
            </div>
          </div>
        )}
      </div>

      {/* Results */}
      {snoringEvents.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8">
          <div className="flex items-center space-x-3 mb-6">
            <BarChart3 size={24} className="text-orange-500 dark:text-orange-400" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
              Snoring Analysis
            </h3>
          </div>

          {/* Summary Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-4">
              <h4 className="font-semibold text-red-900 dark:text-red-100 mb-2">
                Heavy Snoring
              </h4>
              <div className="text-2xl font-bold text-red-600 dark:text-red-400">
                {stats.typeCount.heavy || 0}
              </div>
              <div className="text-sm text-red-700 dark:text-red-300">events</div>
            </div>
            <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-4">
              <h4 className="font-semibold text-yellow-900 dark:text-yellow-100 mb-2">
                Moderate Snoring
              </h4>
              <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
                {stats.typeCount.moderate || 0}
              </div>
              <div className="text-sm text-yellow-700 dark:text-yellow-300">events</div>
            </div>
            <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
              <h4 className="font-semibold text-green-900 dark:text-green-100 mb-2">
                Light Snoring
              </h4>
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                {stats.typeCount.light || 0}
              </div>
              <div className="text-sm text-green-700 dark:text-green-300">events</div>
            </div>
          </div>

          {/* Recent Events */}
          <div>
            <h4 className="font-semibold text-gray-900 dark:text-white mb-3">
              Recent Snoring Events
            </h4>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {snoringEvents.slice(-10).reverse().map((event, index) => (
                <div key={index} className="flex items-center justify-between bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
                  <div className="flex items-center space-x-3">
                    <Volume2 size={16} className={`${
                      event.type === 'heavy' ? 'text-red-500' :
                      event.type === 'moderate' ? 'text-yellow-500' : 'text-green-500'
                    }`} />
                    <div>
                      <div className="font-medium text-gray-900 dark:text-white capitalize">
                        {event.type} Snoring
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        {formatTime(event.timestamp)} • {event.duration}s duration
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-gray-900 dark:text-white">
                      {Math.round(event.intensity)}%
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">intensity</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tips */}
      <div className="bg-orange-50 dark:bg-blue-900/20 rounded-lg p-6">
        <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-3">
          💡 Snoring Detection Tips:
        </h4>
        <ul className="space-y-2 text-blue-800 dark:text-blue-200 text-sm">
          <li>• Place your device 3-6 feet from your bed for optimal detection</li>
          <li>• Ensure the room is quiet to avoid false positives</li>
          <li>• Keep your device plugged in for all-night recording</li>
          <li>• Use airplane mode with WiFi to reduce interruptions</li>
          <li>• Consider sleep position - back sleeping often increases snoring</li>
          <li>• Consult a doctor if you have frequent heavy snoring</li>
        </ul>
      </div>
    </div>
  );
}