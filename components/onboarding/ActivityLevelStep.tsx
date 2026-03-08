interface Props {
  data: any;
  setData: (data: any) => void;
  onNext: () => void;
  onBack: () => void;
}

export default function ActivityLevelStep({ data, setData, onNext, onBack }: Props) {
  const activities = [
    { value: 'sedentary', icon: '🛋️', label: 'Sedentary', desc: 'Little or no exercise' },
    { value: 'light', icon: '🚶', label: 'Lightly Active', desc: 'Exercise 1-3 days/week' },
    { value: 'moderate', icon: '🏃', label: 'Moderately Active', desc: 'Exercise 3-5 days/week' },
    { value: 'active', icon: '💪', label: 'Very Active', desc: 'Exercise 6-7 days/week' },
    { value: 'very_active', icon: '🔥', label: 'Extremely Active', desc: 'Intense daily exercise' },
  ];

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <div className="text-5xl mb-3">🏃</div>
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white">How Active Are You?</h2>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Helps calculate your daily calorie needs
        </p>
      </div>

      <div className="space-y-3">
        {activities.map((activity) => (
          <button
            key={activity.value}
            type="button"
            onClick={() => setData({ ...data, activity_level: activity.value })}
            className={`w-full p-4 border-2 rounded-lg transition-all text-left flex items-center space-x-4 ${
              data.activity_level === activity.value
                ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                : 'border-gray-300 dark:border-gray-600 hover:border-blue-300'
            }`}
          >
            <div className="text-4xl">{activity.icon}</div>
            <div className="flex-1">
              <div className="font-semibold text-gray-900 dark:text-white">{activity.label}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">{activity.desc}</div>
            </div>
          </button>
        ))}
      </div>

      <div className="flex space-x-3 pt-4">
        <button onClick={onBack} className="flex-1 py-3 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg font-semibold hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
          ← Back
        </button>
        <button onClick={onNext} disabled={!data.activity_level} className="flex-1 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg font-semibold hover:shadow-lg transform hover:scale-[1.02] transition-all disabled:opacity-50">
          Next →
        </button>
      </div>
    </div>
  );
}
