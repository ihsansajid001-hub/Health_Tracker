'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase/client';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';

interface Props {
  data: any;
  setData: (data: any) => void;
  onNext: () => void;
  onBack: () => void;
}

export default function UsernameStep({ data, setData, onNext, onBack }: Props) {
  const [checking, setChecking] = useState(false);
  const [available, setAvailable] = useState<boolean | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const checkUsername = async () => {
      if (!data.username || data.username.length < 3) {
        setAvailable(null);
        return;
      }

      setChecking(true);
      setError('');

      try {
        const { data: existing } = await supabase
          .from('user_profiles')
          .select('username')
          .eq('username', data.username)
          .single();

        setAvailable(!existing);
      } catch (err) {
        setAvailable(true); // If error, assume available
      } finally {
        setChecking(false);
      }
    };

    const timer = setTimeout(checkUsername, 500);
    return () => clearTimeout(timer);
  }, [data.username]);

  const handleNext = () => {
    if (!data.username) {
      setError('Username is required');
      return;
    }
    if (data.username.length < 3) {
      setError('Username must be at least 3 characters');
      return;
    }
    if (!/^[a-zA-Z0-9_]+$/.test(data.username)) {
      setError('Username can only contain letters, numbers, and underscores');
      return;
    }
    if (!available) {
      setError('Username is already taken');
      return;
    }
    onNext();
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <div className="text-5xl mb-3">👤</div>
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Choose Your Username</h2>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          This will be your unique identifier
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Username
        </label>
        <div className="relative">
          <input
            type="text"
            value={data.username || ''}
            onChange={(e) => setData({ ...data, username: e.target.value.toLowerCase() })}
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white pr-12"
            placeholder="johndoe"
            autoFocus
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            {checking && <Loader2 size={20} className="animate-spin text-gray-400" />}
            {!checking && available === true && <CheckCircle size={20} className="text-green-500" />}
            {!checking && available === false && <XCircle size={20} className="text-red-500" />}
          </div>
        </div>
        {error && (
          <p className="mt-2 text-sm text-red-600 dark:text-red-400">{error}</p>
        )}
        {!error && available === true && (
          <p className="mt-2 text-sm text-green-600 dark:text-green-400">✓ Username is available!</p>
        )}
        {!error && available === false && (
          <p className="mt-2 text-sm text-red-600 dark:text-red-400">✗ Username is already taken</p>
        )}
        <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
          3-20 characters, letters, numbers, and underscores only
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
          disabled={!available || checking}
          className="flex-1 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg font-semibold hover:shadow-lg transform hover:scale-[1.02] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Next →
        </button>
      </div>
    </div>
  );
}
