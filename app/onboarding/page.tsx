'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { OnboardingData } from '@/types';
import { calculateBMI, calculateBMR, calculateMaintenanceCalories } from '@/lib/utils/calculations';
import { supabase } from '@/lib/supabase/client';

const inputClass = "w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-400 text-gray-900 text-sm font-medium transition-all";

function OnboardingContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [username, setUsername] = useState('');
  const [data, setData] = useState<OnboardingData>({
    age: 25,
    gender: 'male',
    height: 170,
    weight: 70,
    activity_level: 'moderate',
    sleep_hours_avg: 7,
    stress_level: 5,
    primary_goal: 'general_wellness',
  });

  useEffect(() => { checkOnboardingStatus(); }, [searchParams]);

  const checkOnboardingStatus = async () => {
    const usernameParam = searchParams.get('username');
    if (usernameParam) setUsername(usernameParam);
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { data: existingProfile } = await supabase.from('user_profiles').select('id').eq('user_id', user.id).single();
      if (existingProfile) { window.location.href = '/dashboard'; return; }
      if (!usernameParam && user.user_metadata?.username) setUsername(user.user_metadata.username);
    }
  };

  const handleNext = () => { if (currentStep < 2) setCurrentStep(s => s + 1); else handleSubmit(); };
  const handleBack = () => { if (currentStep > 0) setCurrentStep(s => s - 1); };

  const handleSubmit = async () => {
    setLoading(true);
    setError('');
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { setError('Not authenticated. Please log in again.'); router.push('/login'); return; }
      const { data: existingProfile } = await supabase.from('user_profiles').select('id').eq('user_id', user.id).single();
      if (existingProfile) { window.location.href = '/dashboard'; return; }
      const bmi = calculateBMI(data.weight, data.height);
      const bmr = calculateBMR(data);
      const maintenanceCalories = calculateMaintenanceCalories(bmr, data.activity_level);
      const profileData = { user_id: user.id, username: username || user.user_metadata?.username || user.email?.split('@')[0], ...data, bmi, bmr, maintenance_calories: maintenanceCalories };
      const { error: dbError } = await supabase.from('user_profiles').insert(profileData).select().single();
      if (dbError) {
        if (dbError.code === '23505') { window.location.href = '/dashboard'; return; }
        setError(`Database error: ${dbError.message}`);
        setLoading(false);
        return;
      }
      window.location.href = '/dashboard';
    } catch (err: any) {
      setError(err.message || 'Unknown error occurred');
      setLoading(false);
    }
  };

  const steps = [
    { label: 'Personal Information', desc: 'Age, gender, height & weight' },
    { label: 'Activity & Goals', desc: 'Lifestyle and aspirations' },
    { label: 'Review & Complete', desc: 'Confirm and start tracking' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex">

      {/* ── Left panel ── */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-gray-900">
        <div className="absolute inset-0 flex flex-col items-center justify-center p-12 text-white">
          <div className="w-full max-w-sm">
            <div className="flex items-center gap-2 mb-10">
              <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-black text-sm">L</span>
              </div>
              <span className="text-xl font-black text-white tracking-tight">LifeScore</span>
            </div>
            <p className="section-tag text-white/30 mb-4">// LifeScore</p>
            <h2 className="text-5xl font-black leading-tight mb-6 tracking-tighter">Complete Your Profile</h2>
            <p className="text-white/40 text-sm leading-relaxed mb-10">
              Tell us about yourself so we can personalize your wellness journey and give you accurate insights.
            </p>
            <div className="space-y-3">
              {steps.map((s, i) => (
                <div key={i} className={`flex items-center gap-4 p-4 rounded-2xl transition-all ${i === currentStep ? 'bg-white/10 border border-white/15' : 'opacity-40'}`}>
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-sm flex-shrink-0 ${i === currentStep ? 'bg-orange-500 text-white' : i < currentStep ? 'bg-green-500 text-white' : 'bg-white/10 text-white'}`}>
                    {i < currentStep ? '✓' : i + 1}
                  </div>
                  <div>
                    <div className="font-black text-sm text-white">{s.label}</div>
                    <div className="text-xs text-white/40">{s.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Right panel ── */}
      <div className="flex-1 flex items-center justify-center p-8 lg:p-16 overflow-y-auto">
        <div className="w-full max-w-md py-8">

          {/* Logo */}
          <a href="/" className="flex items-center gap-2 mb-12 group w-fit">
            <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center group-hover:scale-105 transition-transform">
              <span className="text-white font-black text-sm">L</span>
            </div>
            <span className="text-xl font-black text-gray-900 tracking-tight">LifeScore</span>
          </a>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-2xl">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          <p className="section-tag mb-3">// Step {currentStep + 1} of 3</p>
          <h1 className="text-4xl font-black text-gray-900 tracking-tight mb-2">
            {currentStep === 0 && "Let's get started!"}
            {currentStep === 1 && 'Activity & Goals'}
            {currentStep === 2 && 'Almost there!'}
          </h1>
          <p className="text-gray-400 mb-6 text-sm">
            {currentStep === 0 && 'Tell us about yourself to personalize your experience'}
            {currentStep === 1 && 'Help us understand your lifestyle and aspirations'}
            {currentStep === 2 && 'Review your information and start your journey'}
          </p>

          {/* Progress bar */}
          <div className="flex gap-2 mb-8">
            {[0, 1, 2].map(s => (
              <div key={s} className={`h-1 rounded-full flex-1 transition-all ${s <= currentStep ? 'bg-orange-500' : 'bg-gray-100'}`} />
            ))}
          </div>

          {/* Form card */}
          <div className="card p-8 mb-5">

            {/* Step 0: Personal Info */}
            {currentStep === 0 && (
              <div className="space-y-5">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Age</label>
                    <input type="number" value={data.age} onChange={e => setData({ ...data, age: parseInt(e.target.value) })} min="13" max="120" className={inputClass} />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Gender</label>
                    <select value={data.gender} onChange={e => setData({ ...data, gender: e.target.value as any })} className={inputClass}>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Height (cm)</label>
                    <input type="number" value={data.height} onChange={e => setData({ ...data, height: parseInt(e.target.value) })} min="100" max="250" className={inputClass} />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Weight (kg)</label>
                    <input type="number" value={data.weight} onChange={e => setData({ ...data, weight: parseInt(e.target.value) })} min="30" max="300" className={inputClass} />
                  </div>
                </div>
              </div>
            )}

            {/* Step 1: Activity & Goals */}
            {currentStep === 1 && (
              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Activity Level</label>
                  <select value={data.activity_level} onChange={e => setData({ ...data, activity_level: e.target.value as any })} className={inputClass}>
                    <option value="sedentary">Sedentary (little or no exercise)</option>
                    <option value="light">Light (exercise 1-3 days/week)</option>
                    <option value="moderate">Moderate (exercise 3-5 days/week)</option>
                    <option value="active">Active (exercise 6-7 days/week)</option>
                    <option value="very_active">Very Active (intense exercise daily)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Average Sleep Hours</label>
                  <input type="number" step="0.5" value={data.sleep_hours_avg} onChange={e => setData({ ...data, sleep_hours_avg: parseFloat(e.target.value) })} min="3" max="12" className={inputClass} />
                </div>
                <div>
                  <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-2">
                    Stress Level: <span className="text-orange-500">{data.stress_level}</span>
                  </label>
                  <input type="range" value={data.stress_level} onChange={e => setData({ ...data, stress_level: parseInt(e.target.value) })} min="1" max="10" className="w-full accent-orange-500" />
                  <div className="flex justify-between text-xs text-gray-400 mt-1"><span>Low</span><span>High</span></div>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Primary Goal</label>
                  <select value={data.primary_goal} onChange={e => setData({ ...data, primary_goal: e.target.value as any })} className={inputClass}>
                    <option value="fat_loss">Fat Loss</option>
                    <option value="muscle_gain">Muscle Gain</option>
                    <option value="improve_sleep">Improve Sleep</option>
                    <option value="productivity">Boost Productivity</option>
                    <option value="general_wellness">General Wellness</option>
                  </select>
                </div>
              </div>
            )}

            {/* Step 2: Review */}
            {currentStep === 2 && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { label: 'Age', value: `${data.age} years` },
                    { label: 'Gender', value: data.gender },
                    { label: 'Height', value: `${data.height} cm` },
                    { label: 'Weight', value: `${data.weight} kg` },
                    { label: 'BMI', value: calculateBMI(data.weight, data.height) },
                    { label: 'Daily Calories', value: calculateMaintenanceCalories(calculateBMR(data), data.activity_level) },
                  ].map((item, i) => (
                    <div key={i} className="p-4 bg-gray-50 dark:bg-gray-800 rounded-2xl">
                      <p className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wide mb-1">{item.label}</p>
                      <p className="text-lg font-black text-gray-900 dark:text-white capitalize">{item.value}</p>
                    </div>
                  ))}
                </div>
                <div className="p-4 bg-orange-50 dark:bg-orange-900/20 rounded-2xl border border-orange-200 dark:border-orange-800">
                  <p className="text-sm font-bold text-gray-900 dark:text-orange-200">
                    Primary Goal: <span className="capitalize">{data.primary_goal.replace(/_/g, ' ')}</span>
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Navigation */}
          <div className="flex gap-3">
            {currentStep > 0 && (
              <button onClick={handleBack}
                className="flex items-center gap-2 px-6 py-4 border border-gray-200 text-gray-500 font-bold rounded-full hover:bg-gray-50 transition-all text-sm">
                <ArrowLeft size={16} /> Back
              </button>
            )}
            <button onClick={handleNext} disabled={loading}
              className="flex-1 py-4 bg-gray-900 hover:bg-gray-700 text-white font-black rounded-full transition-all shadow-lg hover:-translate-y-0.5 disabled:opacity-50 flex items-center justify-center gap-3">
              {loading ? (
                <><svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>Saving…</>
              ) : currentStep === 2 ? 'Complete Setup →' : 'Continue →'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function OnboardingPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <OnboardingContent />
    </Suspense>
  );
}
