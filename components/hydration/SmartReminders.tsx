'use client';

import { useState, useEffect } from 'react';
import { Bell, Clock, Droplets, Sun, Moon, Coffee, Utensils, Zap, Settings } from 'lucide-react';
import { supabase } from '@/lib/supabase/client';

interface ReminderSettings {
  id?: string;
  reminder_enabled: boolean;
  wake_up_reminder: boolean;
  meal_reminders: boolean;
  bedtime_reminder: boolean;
  workout_reminders: boolean;
  custom_reminders: boolean;
  reminder_interval_minutes: number;
  reminder_start_time: string;
  reminder_end_time: string;
  wake_time: string;
  bed_time: string;
  meal_times: {
    breakfast: string;
    lunch: string;
    dinner: string;
  };
  custom_reminder_times: string[];
  reminder_message: string;
}

interface ReminderSchedule {
  time: string;
  type: 'wake' | 'meal' | 'interval' | 'workout' | 'bedtime' | 'custom';
  message: string;
  icon: string;
}

export default function SmartReminders() {
  const [settings, setSettings] = useState<ReminderSettings>({
    reminder_enabled: true,
    wake_up_reminder: true,
    meal_reminders: true,
    bedtime_reminder: true,
    workout_reminders: false,
    custom_reminders: false,
    reminder_interval_minutes: 120,
    reminder_start_time: '07:00',
    reminder_end_time: '22:00',
    wake_time: '07:00',
    bed_time: '22:00',
    meal_times: {
      breakfast: '08:00',
      lunch: '12:30',
      dinner: '18:30',
    },
    custom_reminder_times: [],
    reminder_message: 'Time to hydrate! 💧',
  });

  const [schedule, setSchedule] = useState<ReminderSchedule[]>([]);
  const [loading, setLoading] = useState(false);
  const [notificationPermission, setNotificationPermission] = useState<NotificationPermission>('default');

  useEffect(() => {
    loadSettings();
    checkNotificationPermission();
  }, []);

  useEffect(() => {
    generateSchedule();
  }, [settings]);

  const loadSettings = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('hydration_settings')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (data) {
        setSettings({
          ...settings,
          reminder_enabled: data.reminder_enabled,
          reminder_interval_minutes: data.reminder_interval_minutes,
          reminder_start_time: data.reminder_start_time,
          reminder_end_time: data.reminder_end_time,
          // Load other settings from a separate reminders table if needed
        });
      }
    } catch (error) {
      console.error('Error loading reminder settings:', error);
    }
  };

  const checkNotificationPermission = () => {
    if ('Notification' in window) {
      setNotificationPermission(Notification.permission);
    }
  };

  const requestNotificationPermission = async () => {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission();
      setNotificationPermission(permission);
      return permission === 'granted';
    }
    return false;
  };

  const generateSchedule = () => {
    const newSchedule: ReminderSchedule[] = [];

    if (!settings.reminder_enabled) {
      setSchedule([]);
      return;
    }

    // Wake up reminder
    if (settings.wake_up_reminder) {
      newSchedule.push({
        time: settings.wake_time,
        type: 'wake',
        message: 'Good morning! Start your day with a glass of water 🌅',
        icon: '🌅',
      });
    }

    // Meal reminders (30 minutes before meals)
    if (settings.meal_reminders) {
      const mealReminders = [
        { meal: 'breakfast', time: settings.meal_times.breakfast, icon: '🍳' },
        { meal: 'lunch', time: settings.meal_times.lunch, icon: '🥗' },
        { meal: 'dinner', time: settings.meal_times.dinner, icon: '🍽️' },
      ];

      mealReminders.forEach(({ meal, time, icon }) => {
        const mealTime = new Date(`2000-01-01T${time}:00`);
        const reminderTime = new Date(mealTime.getTime() - 30 * 60 * 1000); // 30 minutes before
        
        newSchedule.push({
          time: reminderTime.toTimeString().slice(0, 5),
          type: 'meal',
          message: `Hydrate before ${meal}! Water helps with digestion ${icon}`,
          icon: icon,
        });
      });
    }

    // Regular interval reminders
    if (settings.reminder_interval_minutes > 0) {
      const startTime = new Date(`2000-01-01T${settings.reminder_start_time}:00`);
      const endTime = new Date(`2000-01-01T${settings.reminder_end_time}:00`);
      const intervalMs = settings.reminder_interval_minutes * 60 * 1000;

      let currentTime = new Date(startTime.getTime() + intervalMs); // Start after first interval

      while (currentTime <= endTime) {
        // Skip if it conflicts with meal reminders
        const timeStr = currentTime.toTimeString().slice(0, 5);
        const hasConflict = newSchedule.some(reminder => 
          Math.abs(new Date(`2000-01-01T${reminder.time}:00`).getTime() - currentTime.getTime()) < 30 * 60 * 1000
        );

        if (!hasConflict) {
          newSchedule.push({
            time: timeStr,
            type: 'interval',
            message: settings.reminder_message,
            icon: '💧',
          });
        }

        currentTime = new Date(currentTime.getTime() + intervalMs);
      }
    }

    // Workout reminders
    if (settings.workout_reminders) {
      newSchedule.push({
        time: '15:00', // Example workout time
        type: 'workout',
        message: 'Pre-workout hydration! Drink water before exercising 💪',
        icon: '💪',
      });
    }

    // Bedtime reminder
    if (settings.bedtime_reminder) {
      const bedTime = new Date(`2000-01-01T${settings.bed_time}:00`);
      const reminderTime = new Date(bedTime.getTime() - 60 * 60 * 1000); // 1 hour before bed
      
      newSchedule.push({
        time: reminderTime.toTimeString().slice(0, 5),
        type: 'bedtime',
        message: 'Last chance to hydrate! But not too much before bed 🌙',
        icon: '🌙',
      });
    }

    // Custom reminders
    if (settings.custom_reminders) {
      settings.custom_reminder_times.forEach(time => {
        newSchedule.push({
          time,
          type: 'custom',
          message: 'Custom reminder: Time to drink water! 💧',
          icon: '⏰',
        });
      });
    }

    // Sort by time
    newSchedule.sort((a, b) => a.time.localeCompare(b.time));
    setSchedule(newSchedule);
  };

  const saveSettings = async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      // Update hydration settings
      const { error } = await supabase
        .from('hydration_settings')
        .update({
          reminder_enabled: settings.reminder_enabled,
          reminder_interval_minutes: settings.reminder_interval_minutes,
          reminder_start_time: settings.reminder_start_time,
          reminder_end_time: settings.reminder_end_time,
        })
        .eq('user_id', user.id);

      if (error) throw error;

      // In a real app, you'd also save the detailed reminder settings
      // to a separate table and set up actual notifications

      alert('Reminder settings saved successfully!');
    } catch (error) {
      console.error('Error saving settings:', error);
      alert('Failed to save settings. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const addCustomReminder = () => {
    setSettings({
      ...settings,
      custom_reminder_times: [...settings.custom_reminder_times, '12:00'],
    });
  };

  const updateCustomReminder = (index: number, time: string) => {
    const newTimes = [...settings.custom_reminder_times];
    newTimes[index] = time;
    setSettings({ ...settings, custom_reminder_times: newTimes });
  };

  const removeCustomReminder = (index: number) => {
    const newTimes = settings.custom_reminder_times.filter((_, i) => i !== index);
    setSettings({ ...settings, custom_reminder_times: newTimes });
  };

  return (
    <div className="space-y-6">
      {/* Notification Permission */}
      {notificationPermission !== 'granted' && (
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <Bell className="w-5 h-5 text-yellow-600 mt-0.5" />
            <div>
              <h4 className="font-medium text-yellow-900 dark:text-yellow-100">
                Enable Notifications
              </h4>
              <p className="text-yellow-800 dark:text-yellow-200 text-sm mt-1">
                Allow notifications to receive hydration reminders throughout the day.
              </p>
              <button
                onClick={requestNotificationPermission}
                className="mt-2 px-3 py-1 bg-yellow-600 hover:bg-yellow-700 text-white text-sm rounded-lg transition-colors"
              >
                Enable Notifications
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Settings */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          <Droplets className="w-5 h-5 inline mr-2" />
          Smart Hydration Reminders
        </h3>

        <div className="space-y-6">
          {/* Master Toggle */}
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-gray-900 dark:text-white">
                Enable Reminders
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Turn on smart hydration reminders
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.reminder_enabled}
                onChange={(e) => setSettings({ ...settings, reminder_enabled: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
            </label>
          </div>

          {settings.reminder_enabled && (
            <>
              {/* Reminder Types */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Sun className="w-4 h-4 text-yellow-500" />
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        Wake-up reminder
                      </span>
                    </div>
                    <input
                      type="checkbox"
                      checked={settings.wake_up_reminder}
                      onChange={(e) => setSettings({ ...settings, wake_up_reminder: e.target.checked })}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Utensils className="w-4 h-4 text-green-500" />
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        Meal reminders
                      </span>
                    </div>
                    <input
                      type="checkbox"
                      checked={settings.meal_reminders}
                      onChange={(e) => setSettings({ ...settings, meal_reminders: e.target.checked })}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Moon className="w-4 h-4 text-purple-500" />
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        Bedtime reminder
                      </span>
                    </div>
                    <input
                      type="checkbox"
                      checked={settings.bedtime_reminder}
                      onChange={(e) => setSettings({ ...settings, bedtime_reminder: e.target.checked })}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Zap className="w-4 h-4 text-orange-500" />
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        Workout reminders
                      </span>
                    </div>
                    <input
                      type="checkbox"
                      checked={settings.workout_reminders}
                      onChange={(e) => setSettings({ ...settings, workout_reminders: e.target.checked })}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Clock className="w-4 h-4 text-blue-500" />
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        Regular intervals
                      </span>
                    </div>
                    <input
                      type="checkbox"
                      checked={settings.reminder_interval_minutes > 0}
                      onChange={(e) => setSettings({ 
                        ...settings, 
                        reminder_interval_minutes: e.target.checked ? 120 : 0 
                      })}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>

              {/* Interval Settings */}
              {settings.reminder_interval_minutes > 0 && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Reminder Interval: Every {settings.reminder_interval_minutes} minutes
                    </label>
                    <input
                      type="range"
                      min="30"
                      max="240"
                      step="30"
                      value={settings.reminder_interval_minutes}
                      onChange={(e) => setSettings({ ...settings, reminder_interval_minutes: parseInt(e.target.value) })}
                      className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer"
                    />
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                      <span>30 min</span>
                      <span>2 hours</span>
                      <span>4 hours</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Start Time
                      </label>
                      <input
                        type="time"
                        value={settings.reminder_start_time}
                        onChange={(e) => setSettings({ ...settings, reminder_start_time: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        End Time
                      </label>
                      <input
                        type="time"
                        value={settings.reminder_end_time}
                        onChange={(e) => setSettings({ ...settings, reminder_end_time: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Meal Times */}
              {settings.meal_reminders && (
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white mb-3">
                    Meal Times
                  </h4>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">
                        Breakfast
                      </label>
                      <input
                        type="time"
                        value={settings.meal_times.breakfast}
                        onChange={(e) => setSettings({
                          ...settings,
                          meal_times: { ...settings.meal_times, breakfast: e.target.value }
                        })}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">
                        Lunch
                      </label>
                      <input
                        type="time"
                        value={settings.meal_times.lunch}
                        onChange={(e) => setSettings({
                          ...settings,
                          meal_times: { ...settings.meal_times, lunch: e.target.value }
                        })}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">
                        Dinner
                      </label>
                      <input
                        type="time"
                        value={settings.meal_times.dinner}
                        onChange={(e) => setSettings({
                          ...settings,
                          meal_times: { ...settings.meal_times, dinner: e.target.value }
                        })}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Custom Message */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Reminder Message
                </label>
                <input
                  type="text"
                  value={settings.reminder_message}
                  onChange={(e) => setSettings({ ...settings, reminder_message: e.target.value })}
                  placeholder="Time to hydrate! 💧"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
            </>
          )}
        </div>

        <button
          onClick={saveSettings}
          disabled={loading}
          className="mt-6 w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded-lg font-semibold transition-colors flex items-center justify-center"
        >
          {loading ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
              Saving...
            </>
          ) : (
            <>
              <Settings className="w-4 h-4 mr-2" />
              Save Settings
            </>
          )}
        </button>
      </div>

      {/* Today's Schedule Preview */}
      {settings.reminder_enabled && schedule.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Today's Reminder Schedule
          </h3>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {schedule.map((reminder, index) => (
              <div
                key={index}
                className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
              >
                <span className="text-xl">{reminder.icon}</span>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-gray-900 dark:text-white">
                      {reminder.time}
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-400 capitalize">
                      {reminder.type}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {reminder.message}
                  </p>
                </div>
              </div>
            ))}
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-3">
            💡 You'll receive {schedule.length} reminders throughout the day
          </p>
        </div>
      )}
    </div>
  );
}