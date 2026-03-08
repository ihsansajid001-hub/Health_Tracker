import { CheckCircle, Moon, Dumbbell, Apple, Droplet, Brain, TrendingUp } from 'lucide-react';

interface Props {
  data: any;
  onComplete: () => void;
  loading: boolean;
}

export default function CompleteStep({ data, onComplete, loading }: Props) {
  // Calculate metrics
  const heightM = (data.height || 170) / 100;
  const bmi = ((data.weight || 70) / (heightM * heightM)).toFixed(1);
  
  let bmr = 0;
  if (data.gender === 'male') {
    bmr = (10 * (data.weight || 70)) + (6.25 * (data.height || 170)) - (5 * (data.age || 30)) + 5;
  } else {
    bmr = (10 * (data.weight || 70)) + (6.25 * (data.height || 170)) - (5 * (data.age || 30)) - 161;
  }
  
  const activityMultipliers: any = {
    sedentary: 1.2,
    light: 1.375,
    moderate: 1.55,
    active: 1.725,
    very_active: 1.9,
  };
  const tdee = bmr * activityMultipliers[data.activity_level || 'moderate'];
  
  let dailyCalories = tdee;
  if (data.primary_goal === 'weight_loss') dailyCalories = tdee - 500;
  else if (data.primary_goal === 'muscle_gain') dailyCalories = tdee + 300;
  
  const dailyWater = (data.weight || 70) * 35;

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <CheckCircle size={64} className="mx-auto text-green-500 mb-4" />
        <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">You're All Set!</h2>
        <p className="text-gray-600 dark:text-gray-400">
          Here's your personalized wellness plan
        </p>
      </div>

      <div className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-700 dark:to-gray-800 rounded-2xl p-6 space-y-4">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Your Daily Goals</h3>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <TrendingUp size={20} className="text-blue-500" />
              <span className="text-sm text-gray-600 dark:text-gray-400">BMI</span>
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{bmi}</p>
          </div>

          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <Apple size={20} className="text-green-500" />
              <span className="text-sm text-gray-600 dark:text-gray-400">Calories</span>
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{Math.round(dailyCalories)}</p>
            <p className="text-xs text-gray-500">kcal/day</p>
          </div>

          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <Droplet size={20} className="text-cyan-500" />
              <span className="text-sm text-gray-600 dark:text-gray-400">Water</span>
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{Math.round(dailyWater)}</p>
            <p className="text-xs text-gray-500">ml/day</p>
          </div>

          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <Moon size={20} className="text-purple-500" />
              <span className="text-sm text-gray-600 dark:text-gray-400">Sleep</span>
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{data.target_sleep_hours || 8}</p>
            <p className="text-xs text-gray-500">hours/night</p>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 space-y-3">
        <h3 className="font-bold text-gray-900 dark:text-white mb-3">Your Personalized Schedule</h3>
        <div className="space-y-2 text-sm">
          <div className="flex items-center space-x-3">
            <span className="text-2xl">🌅</span>
            <span className="text-gray-600 dark:text-gray-400">Wake up:</span>
            <span className="font-semibold text-gray-900 dark:text-white">{data.target_wake_time || '07:00'}</span>
          </div>
          <div className="flex items-center space-x-3">
            <span className="text-2xl">💧</span>
            <span className="text-gray-600 dark:text-gray-400">First water reminder:</span>
            <span className="font-semibold text-gray-900 dark:text-white">{data.wake_time || '07:00'}</span>
          </div>
          <div className="flex items-center space-x-3">
            <span className="text-2xl">🏋️</span>
            <span className="text-gray-600 dark:text-gray-400">Workout time:</span>
            <span className="font-semibold text-gray-900 dark:text-white">{data.preferred_workout_time || 'Flexible'}</span>
          </div>
          <div className="flex items-center space-x-3">
            <span className="text-2xl">🧘</span>
            <span className="text-gray-600 dark:text-gray-400">Meditation reminder:</span>
            <span className="font-semibold text-gray-900 dark:text-white">Evening</span>
          </div>
          <div className="flex items-center space-x-3">
            <span className="text-2xl">😴</span>
            <span className="text-gray-600 dark:text-gray-400">Bedtime reminder:</span>
            <span className="font-semibold text-gray-900 dark:text-white">{data.target_bedtime || '23:00'}</span>
          </div>
        </div>
      </div>

      <button
        onClick={onComplete}
        disabled={loading}
        className="w-full py-4 bg-gradient-to-r from-green-500 to-green-700 text-white rounded-xl font-semibold text-lg hover:shadow-lg transform hover:scale-[1.02] transition-all disabled:opacity-50"
      >
        {loading ? 'Setting up your account...' : 'Go to Dashboard →'}
      </button>

      <p className="text-center text-sm text-gray-500 dark:text-gray-400">
        🎉 You can customize these settings anytime in your profile
      </p>
    </div>
  );
}
