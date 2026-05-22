'use client';

import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import FoodSearch from '@/components/nutrition/FoodSearch';
import BarcodeScanner from '@/components/nutrition/BarcodeScanner';
import RecipeImporter from '@/components/nutrition/RecipeImporter';
import MealPlanner from '@/components/nutrition/MealPlanner';
import FastingTimer from '@/components/nutrition/FastingTimer';
import CaloriesDonut from '@/components/nutrition/CaloriesDonut';
import MacroBar from '@/components/nutrition/MacroBar';
import MealFoodDiary from '@/components/nutrition/MealFoodDiary';
import { Search, Camera, ChefHat, Calendar, Clock, Plus, Zap, Flame } from 'lucide-react';
import { supabase } from '@/lib/supabase/client';
import { formatDate } from '@/lib/utils/calculations';

interface FoodEntry {
  id?: string;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  serving_grams: number;
  meal_type: 'breakfast' | 'lunch' | 'dinner' | 'snack';
}

const CALORIE_GOAL = 2000;
const PROTEIN_GOAL = 150;
const CARBS_GOAL = 250;
const FAT_GOAL = 65;

export default function NutritionPage() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [view, setView] = useState<'log' | 'search' | 'planner' | 'fasting'>('log');
  const [showScanner, setShowScanner] = useState(false);
  const [showRecipeImporter, setShowRecipeImporter] = useState(false);
  const [userAllergies, setUserAllergies] = useState<string[]>([]);
  const [todaysFoods, setTodaysFoods] = useState<FoodEntry[]>([]);
  const [selectedMealType, setSelectedMealType] = useState<FoodEntry['meal_type']>('breakfast');

  const [dailyTotals, setDailyTotals] = useState({ calories: 0, protein: 0, carbs: 0, fat: 0 });

  useEffect(() => {
    loadUserAllergies();
    loadTodaysFoods();
  }, []);

  useEffect(() => {
    const totals = todaysFoods.reduce(
      (acc, food) => ({
        calories: acc.calories + food.calories,
        protein: acc.protein + food.protein,
        carbs: acc.carbs + food.carbs,
        fat: acc.fat + food.fat,
      }),
      { calories: 0, protein: 0, carbs: 0, fat: 0 }
    );
    setDailyTotals(totals);
  }, [todaysFoods]);

  const loadUserAllergies = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { data } = await supabase.from('nutrition_settings').select('allergies').eq('user_id', user.id).single();
      if (data?.allergies) setUserAllergies(data.allergies);
    } catch {}
  };

  const loadTodaysFoods = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const today = formatDate(new Date());
      const { data } = await supabase.from('food_entries').select('*').eq('user_id', user.id).eq('date', today).order('created_at', { ascending: true });
      if (data) setTodaysFoods(data);
    } catch {}
  };

  const handleFoodSelect = async (food: any, servingGrams: number) => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');
      const factor = servingGrams / 100;
      const entry: FoodEntry = {
        name: food.name,
        calories: Math.round(food.nutrition.calories * factor),
        protein: Math.round(food.nutrition.protein * factor * 10) / 10,
        carbs: Math.round(food.nutrition.carbs * factor * 10) / 10,
        fat: Math.round(food.nutrition.fat * factor * 10) / 10,
        serving_grams: servingGrams,
        meal_type: selectedMealType,
      };
      const { error } = await supabase.from('food_entries').insert({ user_id: user.id, date: formatDate(new Date()), ...entry });
      if (error) throw error;
      setTodaysFoods(prev => [...prev, entry]);
      setView('log');
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch {
      alert('Failed to add food. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const groupFoodsByMeal = () =>
    todaysFoods.reduce((acc, food) => {
      if (!acc[food.meal_type]) acc[food.meal_type] = [];
      acc[food.meal_type].push(food);
      return acc;
    }, {} as Record<string, FoodEntry[]>);

  const caloriesLeft = Math.max(0, CALORIE_GOAL - dailyTotals.calories);
  const burnedCalories = 510; // placeholder

  // ── Search view ──────────────────────────────────────────────────────────
  if (view === 'search') {
    return (
      <DashboardLayout>
        <div className="max-w-3xl mx-auto py-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-black text-gray-900">Search Foods</h1>
              <p className="text-sm text-gray-500 mt-0.5">Find and log what you ate</p>
            </div>
            <button onClick={() => setView('log')} className="px-4 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold text-sm transition-colors">
              ← Back
            </button>
          </div>

          {/* Meal type selector */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 mb-5">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Adding to</p>
            <div className="flex gap-2 flex-wrap">
              {(['breakfast', 'lunch', 'dinner', 'snack'] as const).map((meal) => {
                const colors: Record<string, string> = {
                  breakfast: 'bg-amber-500 text-white',
                  lunch: 'bg-green-500 text-white',
                  dinner: 'bg-orange-500 text-white',
                  snack: 'bg-purple-500 text-white',
                };
                const icons: Record<string, string> = { breakfast: '🍳', lunch: '🥗', dinner: '🍽️', snack: '🍎' };
                return (
                  <button
                    key={meal}
                    onClick={() => setSelectedMealType(meal)}
                    className={`px-4 py-2 rounded-xl font-semibold text-sm transition-all ${
                      selectedMealType === meal ? colors[meal] + ' shadow-md scale-105' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {icons[meal]} {meal.charAt(0).toUpperCase() + meal.slice(1)}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
            <FoodSearch onSelectFood={handleFoodSelect} userAllergies={userAllergies} />
          </div>

          {showScanner && (
            <BarcodeScanner onScanSuccess={(p) => handleFoodSelect(p, 100)} onClose={() => setShowScanner(false)} userAllergies={userAllergies} />
          )}
        </div>
      </DashboardLayout>
    );
  }

  // ── Planner view ─────────────────────────────────────────────────────────
  if (view === 'planner') {
    return (
      <DashboardLayout>
        <div className="max-w-7xl mx-auto py-6">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-black text-gray-900">Meal Planner</h1>
            <button onClick={() => setView('log')} className="px-4 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold text-sm transition-colors">
              ← Back
            </button>
          </div>
          <MealPlanner onMealSelect={(meal) => console.log('Selected meal:', meal)} />
        </div>
      </DashboardLayout>
    );
  }

  // ── Fasting view ─────────────────────────────────────────────────────────
  if (view === 'fasting') {
    return (
      <DashboardLayout>
        <div className="max-w-4xl mx-auto py-6">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-black text-gray-900">Fasting Timer</h1>
            <button onClick={() => setView('log')} className="px-4 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold text-sm transition-colors">
              ← Back
            </button>
          </div>
          <FastingTimer />
        </div>
      </DashboardLayout>
    );
  }

  // ── Main log view ─────────────────────────────────────────────────────────
  const mealsByType = groupFoodsByMeal();

  return (
    <DashboardLayout>
      <div className="py-6">
        {/* Page title */}
        <div className="mb-6">
          <h1 className="text-2xl font-black text-gray-900">Nutrition Tracker</h1>
          <p className="text-sm text-gray-500 mt-0.5">Let's keep your diet on track today 🥗</p>
        </div>

        {success && (
          <div className="mb-5 px-4 py-3 bg-green-50 border border-green-200 rounded-2xl text-green-700 font-semibold text-sm animate-fade-in">
            ✅ Food logged successfully!
          </div>
        )}

        {/* ── Quick action buttons ── */}
        <div className="flex flex-wrap gap-2 mb-6">
          {[
            { label: 'Search Foods', icon: Search, color: 'bg-[#F97316] hover:bg-orange-600 text-white', action: () => setView('search') },
            { label: 'Scan Barcode', icon: Camera, color: 'bg-[#84CC16] hover:bg-lime-600 text-white', action: () => setShowScanner(true) },
            { label: 'Import Recipe', icon: ChefHat, color: 'bg-white hover:bg-gray-50 text-gray-700 border border-gray-200', action: () => setShowRecipeImporter(true) },
            { label: 'Meal Planner', icon: Calendar, color: 'bg-white hover:bg-gray-50 text-gray-700 border border-gray-200', action: () => setView('planner') },
            { label: 'Fasting Timer', icon: Clock, color: 'bg-white hover:bg-gray-50 text-gray-700 border border-gray-200', action: () => setView('fasting') },
          ].map(({ label, icon: Icon, color, action }) => (
            <button key={label} onClick={action} className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm shadow-sm transition-all hover:-translate-y-0.5 ${color}`}>
              <Icon size={15} />
              {label}
            </button>
          ))}
        </div>

        {/* ── Main grid ── */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">

          {/* ── Left column: stats + macros ── */}
          <div className="xl:col-span-2 space-y-5">

            {/* Stat cards row */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: 'Calories Eaten', value: dailyTotals.calories, unit: 'kcal', color: 'text-orange-500', bg: 'bg-orange-50', icon: Flame },
                { label: 'Calories Left', value: caloriesLeft, unit: 'kcal', color: 'text-green-500', bg: 'bg-green-50', icon: Zap },
                { label: 'Protein', value: dailyTotals.protein, unit: 'g', color: 'text-blue-500', bg: 'bg-blue-50', icon: null },
                { label: 'Burned', value: burnedCalories, unit: 'kcal', color: 'text-amber-500', bg: 'bg-amber-50', icon: null },
              ].map((s, i) => (
                <div key={i} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
                  <p className="text-xs font-semibold text-gray-400 mb-2">{s.label}</p>
                  <div className={`text-2xl font-black ${s.color}`}>
                    {s.value}
                    <span className="text-sm font-bold ml-1 text-gray-400">{s.unit}</span>
                  </div>
                  {/* Mini progress bar */}
                  <div className="mt-3 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-700 ${
                        i === 0 ? 'bg-orange-400' : i === 1 ? 'bg-green-400' : i === 2 ? 'bg-blue-400' : 'bg-amber-400'
                      }`}
                      style={{ width: `${Math.min(100, i === 0 ? (dailyTotals.calories / CALORIE_GOAL) * 100 : i === 1 ? (caloriesLeft / CALORIE_GOAL) * 100 : i === 2 ? (dailyTotals.protein / PROTEIN_GOAL) * 100 : 60)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Calories donut + macros */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Donut */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-black text-gray-900">Calories Intake</h2>
                  <span className="text-xs text-gray-400 font-semibold">Today</span>
                </div>
                <CaloriesDonut eaten={dailyTotals.calories} goal={CALORIE_GOAL} burned={burnedCalories} />
              </div>

              {/* Macros */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-black text-gray-900">Macronutrients</h2>
                  <span className="text-xs text-gray-400 font-semibold">Daily goals</span>
                </div>
                <div className="space-y-4">
                  <MacroBar label="Carbohydrates" value={dailyTotals.carbs} goal={CARBS_GOAL} unit="g" color="bg-orange-400" pct={37} />
                  <MacroBar label="Proteins" value={dailyTotals.protein} goal={PROTEIN_GOAL} unit="g" color="bg-green-400" pct={93} />
                  <MacroBar label="Fats" value={dailyTotals.fat} goal={FAT_GOAL} unit="g" color="bg-amber-400" pct={45} />
                </div>
              </div>
            </div>

            {/* Meal food diary */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center justify-between mb-5">
                <h2 className="font-black text-gray-900">Food Diary</h2>
                <button
                  onClick={() => setView('search')}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-orange-500 hover:bg-orange-600 text-white rounded-xl text-xs font-bold transition-colors"
                >
                  <Plus size={13} /> Add Food
                </button>
              </div>
              <MealFoodDiary mealsByType={mealsByType} onAddToMeal={(meal) => { setSelectedMealType(meal); setView('search'); }} />
            </div>
          </div>

          {/* ── Right column: full-day meal list ── */}
          <div className="space-y-5">
            {/* Date strip */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
              <div className="flex items-center justify-between mb-3">
                <span className="font-black text-gray-900 text-sm">
                  {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                </span>
                <div className="flex gap-1">
                  <button className="w-6 h-6 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500 text-xs transition-colors">‹</button>
                  <button className="w-6 h-6 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500 text-xs transition-colors">›</button>
                </div>
              </div>
              <div className="grid grid-cols-7 gap-1 text-center">
                {['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'].map((d, i) => (
                  <div key={d} className="text-[10px] font-semibold text-gray-400 mb-1">{d}</div>
                ))}
                {Array.from({ length: 7 }, (_, i) => {
                  const today = new Date();
                  const dayOfWeek = today.getDay();
                  const monday = new Date(today);
                  monday.setDate(today.getDate() - ((dayOfWeek + 6) % 7));
                  const d = new Date(monday);
                  d.setDate(monday.getDate() + i);
                  const isToday = d.toDateString() === today.toDateString();
                  return (
                    <button key={i} className={`w-full aspect-square rounded-xl text-xs font-bold transition-all ${isToday ? 'bg-orange-500 text-white shadow-md shadow-orange-200' : 'text-gray-600 hover:bg-gray-100'}`}>
                      {d.getDate()}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Meal accordion list */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
              <h2 className="font-black text-gray-900 mb-4">Today's Meals</h2>
              <MealAccordion mealsByType={mealsByType} onAddToMeal={(meal) => { setSelectedMealType(meal); setView('search'); }} />
            </div>

            {/* Water intake card */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
              <div className="flex items-center justify-between mb-3">
                <h2 className="font-black text-gray-900 text-sm">Water Intake</h2>
                <span className="text-xs text-gray-400">Goal: 2L</span>
              </div>
              <div className="h-3 bg-gray-100 rounded-full overflow-hidden mb-2">
                <div className="h-full bg-blue-400 rounded-full transition-all duration-700" style={{ width: '65%' }} />
              </div>
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-blue-500">1.3L consumed</span>
                <span className="text-gray-400">0.7L left</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showScanner && (
        <BarcodeScanner onScanSuccess={(p) => handleFoodSelect(p, 100)} onClose={() => setShowScanner(false)} userAllergies={userAllergies} />
      )}
      {showRecipeImporter && (
        <RecipeImporter onRecipeImported={(r) => { console.log('Recipe imported:', r); setShowRecipeImporter(false); }} onClose={() => setShowRecipeImporter(false)} />
      )}
    </DashboardLayout>
  );
}

// ── Meal accordion (right sidebar) ───────────────────────────────────────────
function MealAccordion({ mealsByType, onAddToMeal }: { mealsByType: Record<string, any[]>; onAddToMeal: (meal: any) => void }) {
  const [open, setOpen] = useState<string | null>('breakfast');

  const meals = [
    { key: 'breakfast', label: 'Breakfast', color: 'bg-amber-500', textColor: 'text-amber-600', lightBg: 'bg-amber-50' },
    { key: 'lunch', label: 'Lunch', color: 'bg-green-500', textColor: 'text-green-600', lightBg: 'bg-green-50' },
    { key: 'snack', label: 'Snack', color: 'bg-orange-400', textColor: 'text-orange-600', lightBg: 'bg-orange-50' },
    { key: 'dinner', label: 'Dinner', color: 'bg-blue-500', textColor: 'text-blue-600', lightBg: 'bg-blue-50' },
  ];

  return (
    <div className="space-y-2">
      {meals.map(({ key, label, color, textColor, lightBg }) => {
        const foods = mealsByType[key] || [];
        const totalCal = foods.reduce((s: number, f: any) => s + f.calories, 0);
        const isOpen = open === key;

        return (
          <div key={key} className="rounded-xl overflow-hidden border border-gray-100">
            <button
              onClick={() => setOpen(isOpen ? null : key)}
              className={`w-full flex items-center justify-between px-3 py-2.5 transition-colors ${isOpen ? lightBg : 'bg-gray-50 hover:bg-gray-100'}`}
            >
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${color}`} />
                <span className="font-bold text-sm text-gray-800">{label}</span>
              </div>
              <div className="flex items-center gap-2">
                {totalCal > 0 && (
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${lightBg} ${textColor}`}>
                    {totalCal} kcal
                  </span>
                )}
                <span className="text-gray-400 text-xs">{isOpen ? '▲' : '▼'}</span>
              </div>
            </button>

            {isOpen && (
              <div className="bg-white px-3 pb-3 pt-1 space-y-2">
                {foods.length === 0 ? (
                  <p className="text-xs text-gray-400 py-2 text-center">No foods logged yet</p>
                ) : (
                  foods.map((food: any, i: number) => (
                    <div key={i} className="flex items-center gap-3 py-1.5 border-b border-gray-50 last:border-0">
                      <div className="w-9 h-9 rounded-xl bg-gray-100 flex items-center justify-center text-base flex-shrink-0">
                        {key === 'breakfast' ? '🍳' : key === 'lunch' ? '🥗' : key === 'snack' ? '🍎' : '🍽️'}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold text-gray-800 truncate">{food.name}</p>
                        <div className="flex gap-2 text-[10px] text-gray-400 font-medium mt-0.5">
                          <span>C {food.carbs}g</span>
                          <span>P {food.protein}g</span>
                          <span>F {food.fat}g</span>
                        </div>
                      </div>
                      <span className="text-xs font-black text-gray-700 flex-shrink-0">{food.calories}</span>
                    </div>
                  ))
                )}
                <button
                  onClick={() => onAddToMeal(key as any)}
                  className="w-full mt-1 py-1.5 rounded-xl border border-dashed border-gray-200 text-xs font-semibold text-gray-400 hover:border-orange-300 hover:text-orange-500 transition-colors"
                >
                  + Add food
                </button>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
