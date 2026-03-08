export default function WelcomeStep({ onNext }: { onNext: () => void }) {
  return (
    <div className="text-center space-y-6">
      <div className="text-6xl mb-4">🌟</div>
      <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
        Welcome to Your Wellness Journey
      </h1>
      <p className="text-xl text-gray-600 dark:text-gray-400">
        Let's personalize your experience in just 5 minutes
      </p>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 my-8">
        {[
          { icon: '😴', label: 'Sleep' },
          { icon: '💪', label: 'Fitness' },
          { icon: '🥗', label: 'Nutrition' },
          { icon: '🧘', label: 'Mind' },
          { icon: '💧', label: 'Hydration' },
          { icon: '📊', label: 'Analytics' },
        ].map((item) => (
          <div key={item.label} className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div className="text-3xl mb-2">{item.icon}</div>
            <div className="text-sm font-semibold text-gray-700 dark:text-gray-300">{item.label}</div>
          </div>
        ))}
      </div>
      <button
        onClick={onNext}
        className="w-full py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-semibold text-lg hover:shadow-lg transform hover:scale-[1.02] transition-all"
      >
        Let's Get Started →
      </button>
      <p className="text-sm text-gray-500 dark:text-gray-400">
        ⏱️ Takes about 5 minutes • 🔒 Your data is secure and private
      </p>
    </div>
  );
}
