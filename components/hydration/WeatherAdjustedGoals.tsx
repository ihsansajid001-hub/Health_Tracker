'use client';

import { useState, useEffect } from 'react';
import { Cloud, Sun, CloudRain, Thermometer, Droplets, Wind } from 'lucide-react';

interface WeatherData {
  temperature: number;
  humidity: number;
  condition: 'sunny' | 'cloudy' | 'rainy' | 'hot' | 'cold';
  windSpeed: number;
}

interface Props {
  baseWaterGoal: number; // in ml
  onAdjustedGoalChange?: (newGoal: number) => void;
}

export default function WeatherAdjustedGoals({ baseWaterGoal, onAdjustedGoalChange }: Props) {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(false);
  const [manualWeather, setManualWeather] = useState<WeatherData>({
    temperature: 22,
    humidity: 50,
    condition: 'sunny',
    windSpeed: 10
  });
  const [useManual, setUseManual] = useState(true); // Start with manual since we don't have weather API

  useEffect(() => {
    if (useManual) {
      setWeather(manualWeather);
    } else {
      fetchWeatherData();
    }
  }, [useManual, manualWeather]);

  useEffect(() => {
    if (weather) {
      const adjustedGoal = calculateAdjustedGoal(weather);
      onAdjustedGoalChange?.(adjustedGoal);
    }
  }, [weather, baseWaterGoal, onAdjustedGoalChange]);

  const fetchWeatherData = async () => {
    setLoading(true);
    try {
      // In a real app, you'd use a weather API like OpenWeatherMap
      // For demo purposes, we'll simulate weather data
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockWeather: WeatherData = {
        temperature: Math.floor(Math.random() * 30) + 10, // 10-40°C
        humidity: Math.floor(Math.random() * 60) + 30, // 30-90%
        condition: ['sunny', 'cloudy', 'rainy', 'hot'][Math.floor(Math.random() * 4)] as WeatherData['condition'],
        windSpeed: Math.floor(Math.random() * 20) + 5 // 5-25 km/h
      };
      
      setWeather(mockWeather);
    } catch (error) {
      console.error('Failed to fetch weather:', error);
      // Fallback to manual input
      setUseManual(true);
    } finally {
      setLoading(false);
    }
  };

  const calculateAdjustedGoal = (weatherData: WeatherData): number => {
    let adjustment = 1.0; // Base multiplier
    
    // Temperature adjustments
    if (weatherData.temperature > 30) {
      adjustment += 0.3; // Very hot: +30%
    } else if (weatherData.temperature > 25) {
      adjustment += 0.2; // Hot: +20%
    } else if (weatherData.temperature > 20) {
      adjustment += 0.1; // Warm: +10%
    } else if (weatherData.temperature < 5) {
      adjustment -= 0.1; // Very cold: -10%
    }
    
    // Humidity adjustments
    if (weatherData.humidity < 30) {
      adjustment += 0.15; // Very dry: +15%
    } else if (weatherData.humidity < 50) {
      adjustment += 0.1; // Dry: +10%
    }
    
    // Wind adjustments (increases dehydration)
    if (weatherData.windSpeed > 20) {
      adjustment += 0.1; // Very windy: +10%
    } else if (weatherData.windSpeed > 15) {
      adjustment += 0.05; // Windy: +5%
    }
    
    // Condition-specific adjustments
    switch (weatherData.condition) {
      case 'sunny':
        adjustment += 0.15; // Sunny: +15%
        break;
      case 'hot':
        adjustment += 0.25; // Hot: +25%
        break;
      case 'rainy':
        adjustment -= 0.05; // Rainy: -5%
        break;
      case 'cloudy':
        // No additional adjustment
        break;
    }
    
    // Cap the adjustment between 0.7x and 2.0x
    adjustment = Math.max(0.7, Math.min(2.0, adjustment));
    
    return Math.round(baseWaterGoal * adjustment);
  };

  const getWeatherIcon = (condition: string) => {
    switch (condition) {
      case 'sunny': return <Sun size={24} className="text-yellow-500" />;
      case 'cloudy': return <Cloud size={24} className="text-gray-500" />;
      case 'rainy': return <CloudRain size={24} className="text-blue-500" />;
      case 'hot': return <Thermometer size={24} className="text-red-500" />;
      default: return <Sun size={24} className="text-yellow-500" />;
    }
  };

  const getAdjustmentExplanation = (weatherData: WeatherData) => {
    const adjustments = [];
    
    if (weatherData.temperature > 30) {
      adjustments.push('Very hot weather (+30%)');
    } else if (weatherData.temperature > 25) {
      adjustments.push('Hot weather (+20%)');
    } else if (weatherData.temperature > 20) {
      adjustments.push('Warm weather (+10%)');
    } else if (weatherData.temperature < 5) {
      adjustments.push('Cold weather (-10%)');
    }
    
    if (weatherData.humidity < 30) {
      adjustments.push('Very dry air (+15%)');
    } else if (weatherData.humidity < 50) {
      adjustments.push('Dry air (+10%)');
    }
    
    if (weatherData.windSpeed > 20) {
      adjustments.push('Very windy (+10%)');
    } else if (weatherData.windSpeed > 15) {
      adjustments.push('Windy conditions (+5%)');
    }
    
    switch (weatherData.condition) {
      case 'sunny':
        adjustments.push('Sunny conditions (+15%)');
        break;
      case 'hot':
        adjustments.push('Hot conditions (+25%)');
        break;
      case 'rainy':
        adjustments.push('Rainy weather (-5%)');
        break;
    }
    
    return adjustments;
  };

  if (!weather) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading weather data...</p>
        </div>
      </div>
    );
  }

  const adjustedGoal = calculateAdjustedGoal(weather);
  const adjustmentPercentage = Math.round(((adjustedGoal - baseWaterGoal) / baseWaterGoal) * 100);
  const adjustmentExplanations = getAdjustmentExplanation(weather);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Weather-Adjusted Hydration Goals
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Your hydration needs change based on weather conditions. We automatically adjust your daily goal.
        </p>
      </div>

      {/* Weather Source Toggle */}
      <div className="flex items-center space-x-4 mb-6">
        <button
          onClick={() => setUseManual(false)}
          disabled={loading}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            !useManual
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-blue-100 dark:hover:bg-blue-900/20'
          }`}
        >
          Auto Weather
        </button>
        <button
          onClick={() => setUseManual(true)}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            useManual
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-blue-100 dark:hover:bg-blue-900/20'
          }`}
        >
          Manual Input
        </button>
      </div>

      {/* Manual Weather Input */}
      {useManual && (
        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
            Enter Current Weather Conditions
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Temperature (°C)
              </label>
              <input
                type="number"
                value={manualWeather.temperature}
                onChange={(e) => setManualWeather({
                  ...manualWeather,
                  temperature: parseInt(e.target.value) || 0
                })}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-600 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Humidity (%)
              </label>
              <input
                type="number"
                min="0"
                max="100"
                value={manualWeather.humidity}
                onChange={(e) => setManualWeather({
                  ...manualWeather,
                  humidity: parseInt(e.target.value) || 0
                })}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-600 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Condition
              </label>
              <select
                value={manualWeather.condition}
                onChange={(e) => setManualWeather({
                  ...manualWeather,
                  condition: e.target.value as WeatherData['condition']
                })}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-600 dark:text-white"
              >
                <option value="sunny">☀️ Sunny</option>
                <option value="cloudy">☁️ Cloudy</option>
                <option value="rainy">🌧️ Rainy</option>
                <option value="hot">🔥 Hot</option>
                <option value="cold">❄️ Cold</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Wind Speed (km/h)
              </label>
              <input
                type="number"
                min="0"
                value={manualWeather.windSpeed}
                onChange={(e) => setManualWeather({
                  ...manualWeather,
                  windSpeed: parseInt(e.target.value) || 0
                })}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-600 dark:text-white"
              />
            </div>
          </div>
        </div>
      )}

      {/* Current Weather Display */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Current Conditions
          </h3>
          {!useManual && (
            <button
              onClick={fetchWeatherData}
              disabled={loading}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded-lg font-medium transition-colors"
            >
              {loading ? 'Updating...' : 'Refresh'}
            </button>
          )}
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="text-center">
            <div className="flex items-center justify-center mb-2">
              {getWeatherIcon(weather.condition)}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Condition</div>
            <div className="font-semibold text-gray-900 dark:text-white capitalize">
              {weather.condition}
            </div>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center mb-2">
              <Thermometer size={24} className="text-red-500" />
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Temperature</div>
            <div className="font-semibold text-gray-900 dark:text-white">
              {weather.temperature}°C
            </div>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center mb-2">
              <Droplets size={24} className="text-blue-500" />
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Humidity</div>
            <div className="font-semibold text-gray-900 dark:text-white">
              {weather.humidity}%
            </div>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center mb-2">
              <Wind size={24} className="text-gray-500" />
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Wind</div>
            <div className="font-semibold text-gray-900 dark:text-white">
              {weather.windSpeed} km/h
            </div>
          </div>
        </div>

        {/* Goal Adjustment */}
        <div className="bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-lg p-6">
          <div className="text-center mb-4">
            <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Adjusted Daily Goal
            </h4>
            <div className="flex items-center justify-center space-x-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-600 dark:text-gray-400">
                  {baseWaterGoal}ml
                </div>
                <div className="text-sm text-gray-500 da
rk:text-gray-500">Base Goal</div>
              </div>
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">→</div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                  {adjustedGoal}ml
                </div>
                <div className="text-sm text-blue-600 dark:text-blue-400">
                  {adjustmentPercentage > 0 ? '+' : ''}{adjustmentPercentage}%
                </div>
              </div>
            </div>
          </div>

          {/* Adjustment Explanations */}
          {adjustmentExplanations.length > 0 && (
            <div>
              <h5 className="font-medium text-gray-900 dark:text-white mb-2">
                Adjustments Applied:
              </h5>
              <ul className="space-y-1">
                {adjustmentExplanations.map((explanation, index) => (
                  <li key={index} className="text-sm text-gray-700 dark:text-gray-300 flex items-center space-x-2">
                    <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                    <span>{explanation}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* Tips */}
      <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-6">
        <h4 className="font-semibold text-yellow-800 dark:text-yellow-200 mb-3">
          💡 Weather Hydration Tips:
        </h4>
        <ul className="space-y-2 text-yellow-700 dark:text-yellow-300 text-sm">
          <li>• Hot weather increases sweat rate - drink more frequently</li>
          <li>• Dry air (low humidity) increases water loss through breathing</li>
          <li>• Wind accelerates evaporation from skin and lungs</li>
          <li>• Cold weather can reduce thirst sensation - stay mindful</li>
          <li>• Air conditioning and heating can be dehydrating</li>
          <li>• Monitor urine color as a hydration indicator</li>
        </ul>
      </div>
    </div>
  );
}