interface Props {
  data: any;
  setData: (data: any) => void;
  onNext: () => void;
  onBack: () => void;
}

export default function PhysicalStatsStep({ data, setData, onNext, onBack }: Props) {
  const calculateBMI = () => {
    if (!data.height || !data.weight) return null;
    const heightM = data.height / 100;
    return (data.weight / (heightM * heightM)).toFixed(1);
  };

  const bmi = calculateBMI();

  const getBMICategory = (bmi: number) => {
    if (bmi < 18.5) return { label: 'Underweight', color: 'text-blue-600' };
    if (bmi < 25) return { label: 'Normal', color: 'text-green-600' };
    if (bmi < 30) return { label: 'Overweight', color: 'text-yellow-600' };
    return { label: 'Obese', color: 'text-red-600' };
  };

  const handleNext = () => {
    if (!data.height || !data.weight) {
      alert('Please enter your height and weight');
      return;
    }
    onNext();
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <div className="text-5xl mb-3">📏</div>
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Your Body Metrics</h2>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Help us calculate your personalized goals
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Height (cm) <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            value={data.height || ''}
            onChange={(e) => setData({ ...data, height: parseInt(e.target.value) || 0 })}
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            placeholder="170"
            min="100"
            max="250"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Weight (kg) <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            value={data.weight || ''}
            onChange={(e) => setData({ ...data, weight: parseInt(e.target.value) || 0 })}
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            placeholder="70"
            min="30"
            max="300"
          />
        </div>
      </div>

      {bmi && (
        <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
          <div className="text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Your BMI</p>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">{bmi}</p>
            <p className={`text-sm font-semibold mt-1 ${getBMICategory(parseFloat(bmi)).color}`}>
              {getBMICategory(parseFloat(bmi)).label}
            </p>
          </div>
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Target Weight (kg) - Optional
        </label>
        <input
          type="number"
          value={data.target_weight || ''}
          onChange={(e) => setData({ ...data, target_weight: parseInt(e.target.value) || undefined })}
          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          placeholder="65"
          min="30"
          max="300"
        />
        <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
          Only if your goal is weight-related
        </p>
      </div>

      <div className="flex space-x-3 pt-4">
        <button
          onClick={onBack}
          className="flex-1 py-3 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg font-semibold hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
        >
          ← Back
        </button>
        <button
          onClick={handleNext}
          className="flex-1 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg font-semibold hover:shadow-lg transform hover:scale-[1.02] transition-all"
        >
          Next →
        </button>
      </div>
    </div>
  );
}
