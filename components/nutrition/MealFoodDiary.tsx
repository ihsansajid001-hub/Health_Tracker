'use client';

import { Plus } from 'lucide-react';

interface FoodEntry {
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  serving_grams: number;
  meal_type: string;
}

interface Props {
  mealsByType: Record<string, FoodEntry[]>;
  onAddToMeal: (meal: 'breakfast' | 'lunch' | 'dinner' | 'snack') => void;
}

const MEAL_CONFIG = [
  { key: 'breakfast', label: 'Breakfast', emoji: '🍳', color: 'bg-amber-500', lightBg: 'bg-amber-50', textColor: 'text-amber-600', border: 'border-amber-200' },
  { key: 'lunch',     label: 'Lunch',     emoji: '🥗', color: 'bg-green-500',  lightBg: 'bg-green-50',  textColor: 'text-green-600',  border: 'border-green-200' },
  { key: 'dinner',    label: 'Dinner',    emoji: '🍽️', color: 'bg-orange-500',   lightBg: 'bg-orange-50',   textColor: 'text-orange-500',   border: 'border-orange-200' },
  { key: 'snack',     label: 'Snack',     emoji: '🍎', color: 'bg-orange-400', lightBg: 'bg-orange-50', textColor: 'text-orange-600', border: 'border-orange-200' },
];

export default function MealFoodDiary({ mealsByType, onAddToMeal }: Props) {
  if (Object.keys(mealsByType).length === 0) {
    return (
      <div className="text-center py-10">
        <div className="text-4xl mb-3">🥗</div>
        <p className="text-gray-500 font-semibold">No foods logged today</p>
        <p className="text-sm text-gray-400 mt-1">Use the buttons above to start tracking</p>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {MEAL_CONFIG.map(({ key, label, emoji, color, lightBg, textColor, border }) => {
        const foods = mealsByType[key] || [];
        if (foods.length === 0) return null;

        const totalCal = foods.reduce((s, f) => s + f.calories, 0);

        return (
          <div key={key}>
            {/* Meal header */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className={`w-7 h-7 ${color} rounded-xl flex items-center justify-center text-sm`}>
                  {emoji}
                </div>
                <span className="font-black text-gray-800">{label}</span>
                <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${lightBg} ${textColor}`}>
                  {totalCal} kcal
                </span>
              </div>
              <button
                onClick={() => onAddToMeal(key as any)}
                className="flex items-center gap-1 text-xs font-semibold text-gray-400 hover:text-orange-500 transition-colors"
              >
                <Plus size={13} /> Add
              </button>
            </div>

            {/* Food items */}
            <div className="space-y-2">
              {foods.map((food, i) => (
                <div key={i} className={`flex items-center gap-3 p-3 rounded-xl border ${border} ${lightBg}`}>
                  <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-lg shadow-sm flex-shrink-0">
                    {emoji}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-sm text-gray-800 truncate">{food.name}</p>
                    <div className="flex gap-3 text-[11px] text-gray-500 font-medium mt-0.5">
                      <span>C {food.carbs}g</span>
                      <span>P {food.protein}g</span>
                      <span>F {food.fat}g</span>
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="font-black text-gray-900 text-sm">{food.calories}</p>
                    <p className="text-[10px] text-gray-400">kcal</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
