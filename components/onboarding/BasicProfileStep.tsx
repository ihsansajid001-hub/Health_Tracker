interface Props {
  data: any;
  setData: (data: any) => void;
  onNext: () => void;
  onBack: () => void;
}

export default function BasicProfileStep({ data, setData, onNext, onBack }: Props) {
  const calculateAge = (dob: string) => {
    const today = new Date();
    const birthDate = new Date(dob);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const handleDOBChange = (dob: string) => {
    const age = calculateAge(dob);
    setData({ ...data, date_of_birth: dob, age });
  };

  const handleNext = () => {
    if (!data.date_of_birth || !data.gender) {
      alert('Please fill in all required fields');
      return;
    }
    if (data.age < 13) {
      alert('You must be at least 13 years old to use this app');
      return;
    }
    onNext();
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <div className="text-5xl mb-3">👋</div>
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Tell Us About Yourself</h2>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          We use this to calculate accurate health metrics
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Full Name (Optional)
        </label>
        <input
          type="text"
          value={data.full_name || ''}
          onChange={(e) => setData({ ...data, full_name: e.target.value })}
          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          placeholder="John Doe"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Date of Birth <span className="text-red-500">*</span>
        </label>
        <input
          type="date"
          value={data.date_of_birth || ''}
          onChange={(e) => handleDOBChange(e.target.value)}
          max={new Date().toISOString().split('T')[0]}
          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          required
        />
        {data.age && (
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Age: {data.age} years old
          </p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
          Gender <span className="text-red-500">*</span>
        </label>
        <div className="grid grid-cols-3 gap-3">
          {[
            { value: 'male', label: 'Male', icon: '👨' },
            { value: 'female', label: 'Female', icon: '👩' },
            { value: 'other', label: 'Other', icon: '🧑' },
          ].map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => setData({ ...data, gender: option.value })}
              className={`p-4 border-2 rounded-lg transition-all ${
                data.gender === option.value
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                  : 'border-gray-300 dark:border-gray-600 hover:border-blue-300'
              }`}
            >
              <div className="text-3xl mb-2">{option.icon}</div>
              <div className="font-semibold text-gray-900 dark:text-white">{option.label}</div>
            </button>
          ))}
        </div>
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
