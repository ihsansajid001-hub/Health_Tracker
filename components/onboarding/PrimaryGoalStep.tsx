interface Props {
  data: any;
  setData: (data: any) => void;
  onNext: () => void;
  onBack: () => void;
}

export default function PrimaryGoalStep({ data, setData, onNext, onBack }: Props) {
  const goals = [
    { value: 'weight_loss', icon: '🔥', label: 'Weight Loss', color: 'from-red-500 to-orange-500' },
    { value: 'muscle_gain', icon: '💪', label: 'Muscle Gain', color: 'from-blue-500 to-cyan-500' },
    { value: 'better_sleep', icon: '😴', label: 'Better Sleep', color: 'from-purple-500 to-pink-500' },
    { value: 'reduce_stress', icon: '🧘', label: 'Reduce Stress', color: 'from-green-500 to-teal-500' },
    { value: 'better_nutrition', icon: '🥗', label: 'Better Nutrition', color: 'from-lime-500 to-green-500' },
    { value: 'stay_hydrated', icon: '💧', label: 'Stay Hydrated', color: 'from-cyan-500 to-blue-500' },
    { value: 'general_wellness', icon: '✨', label: 'General Wellness', color: 'from-yellow-500 to-orange-500' },
  ];

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <div className="text-5xl mb-3">🎯</div>
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white">What's Your Main Goal?</h2>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          You can work on multiple goals, but pick your top priority
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {goals.map((goal) => (
          <button
            key={goal.value}
            type="button"
            onClick={() => setData({ ...data, primary_goal: goal.value })}
            className={`p-4 border-2 rounded-lg transition-all ${
              data.primary_goal === goal.value
                ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                : 'border-gray-300 dark:border-gray-600 hover:border-blue-300'
            }`}
          >
            <div className="text-4xl mb-2">{goal.icon}</div>
            <div className="font-semibold text-gray-900 dark:text-white text-sm">{goal.label}</div>
          </button>
        ))}
      </div>

      <div className="flex space-x-3 pt-4">
        <button onClick={onBack} className="flex-1 py-3 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg font-semibold">← Back</button>
        <button onClick={onNext} disabled={!data.primary_goal} className="flex-1 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg font-semibold disabled:opacity-50">Next →</button>
      </div>
    </div>
  );
}
