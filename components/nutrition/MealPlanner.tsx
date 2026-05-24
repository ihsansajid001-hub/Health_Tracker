'use client';

import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Clock, ChevronLeft, ChevronRight } from 'lucide-react';

interface MealPlan {
  id: string;
  date: string;
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  ingredients?: string[];
  prepTime?: number;
  notes?: string;
}

interface Props { onMealSelect?: (meal: MealPlan) => void; }

const MEAL_COLORS: Record<string, { bg: string; text: string; dot: string }> = {
  breakfast: { bg: 'bg-amber-50',  text: 'text-amber-700',  dot: 'bg-amber-400' },
  lunch:     { bg: 'bg-green-50',  text: 'text-green-700',  dot: 'bg-green-400' },
  dinner:    { bg: 'bg-orange-50',   text: 'text-orange-600',   dot: 'bg-blue-400' },
  snack:     { bg: 'bg-orange-50', text: 'text-orange-700', dot: 'bg-orange-400' },
};

const MEAL_EMOJI: Record<string, string> = { breakfast: '🍳', lunch: '🥗', dinner: '🍽️', snack: '🍎' };

export default function MealPlanner({ onMealSelect }: Props) {
  const [currentWeek, setCurrentWeek] = useState(new Date());
  const [mealPlans, setMealPlans] = useState<MealPlan[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedMealType, setSelectedMealType] = useState<MealPlan['mealType']>('breakfast');
  const [editingMeal, setEditingMeal] = useState<MealPlan | null>(null);
  const [form, setForm] = useState<Partial<MealPlan>>({ name: '', calories: 0, protein: 0, carbs: 0, fat: 0, prepTime: 15, notes: '' });

  useEffect(() => { loadMealPlans(); }, [currentWeek]);

  const loadMealPlans = () => {
    setMealPlans([
      { id: '1', date: '2024-03-20', mealType: 'breakfast', name: 'Overnight Oats with Berries', calories: 320, protein: 12, carbs: 45, fat: 8, prepTime: 5 },
      { id: '2', date: '2024-03-20', mealType: 'lunch',     name: 'Quinoa Buddha Bowl',          calories: 450, protein: 18, carbs: 52, fat: 16, prepTime: 25 },
      { id: '3', date: '2024-03-21', mealType: 'breakfast', name: 'Protein Smoothie Bowl',        calories: 380, protein: 25, carbs: 35, fat: 12, prepTime: 10 },
    ]);
  };

  const getWeekDates = () => {
    const start = new Date(currentWeek);
    start.setDate(currentWeek.getDate() - currentWeek.getDay());
    return Array.from({ length: 7 }, (_, i) => { const d = new Date(start); d.setDate(start.getDate() + i); return d; });
  };

  const fmtDate = (d: Date) => d.toISOString().split('T')[0];
  const getMealsForDate = (date: string) => mealPlans.filter(m => m.date === date);
  const getDailyTotals = (meals: MealPlan[]) => meals.reduce((t, m) => ({ calories: t.calories + m.calories, protein: t.protein + m.protein, carbs: t.carbs + m.carbs, fat: t.fat + m.fat }), { calories: 0, protein: 0, carbs: 0, fat: 0 });

  const openAdd = (date: string) => { setSelectedDate(date); setEditingMeal(null); setForm({ name: '', calories: 0, protein: 0, carbs: 0, fat: 0, prepTime: 15, notes: '' }); setShowModal(true); };
  const openEdit = (meal: MealPlan) => { setEditingMeal(meal); setForm(meal); setSelectedDate(meal.date); setSelectedMealType(meal.mealType); setShowModal(true); };
  const closeModal = () => { setShowModal(false); setEditingMeal(null); };

  const handleSave = () => {
    if (!form.name || !selectedDate) return;
    const meal: MealPlan = { id: editingMeal?.id || Date.now().toString(), date: selectedDate, mealType: selectedMealType, name: form.name, calories: form.calories || 0, protein: form.protein || 0, carbs: form.carbs || 0, fat: form.fat || 0, prepTime: form.prepTime || 15, notes: form.notes || '' };
    setMealPlans(prev => editingMeal ? prev.map(m => m.id === editingMeal.id ? meal : m) : [...prev, meal]);
    closeModal();
  };

  const handleDelete = (id: string) => setMealPlans(prev => prev.filter(m => m.id !== id));

  const weekDates = getWeekDates();

  return (
    <div className="space-y-6">
      {/* Week nav */}
      <div className="flex items-center justify-between bg-white rounded-2xl shadow-sm border border-gray-100 px-5 py-4">
        <button onClick={() => { const d = new Date(currentWeek); d.setDate(d.getDate() - 7); setCurrentWeek(d); }} className="w-8 h-8 bg-gray-100 hover:bg-gray-200 rounded-xl flex items-center justify-center transition-colors">
          <ChevronLeft size={16} className="text-gray-600" />
        </button>
        <span className="font-black text-gray-900">
          {weekDates[0].toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} – {weekDates[6].toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
        </span>
        <button onClick={() => { const d = new Date(currentWeek); d.setDate(d.getDate() + 7); setCurrentWeek(d); }} className="w-8 h-8 bg-gray-100 hover:bg-gray-200 rounded-xl flex items-center justify-center transition-colors">
          <ChevronRight size={16} className="text-gray-600" />
        </button>
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-1 lg:grid-cols-7 gap-3">
        {weekDates.map((date, idx) => {
          const dateStr = fmtDate(date);
          const dayMeals = getMealsForDate(dateStr);
          const totals = getDailyTotals(dayMeals);
          const isToday = dateStr === fmtDate(new Date());

          return (
            <div key={idx} className={`bg-white rounded-2xl border-2 overflow-hidden transition-all ${isToday ? 'border-orange-400 shadow-md shadow-orange-100' : 'border-gray-100'}`}>
              {/* Day header */}
              <div className={`px-3 py-2.5 flex items-center justify-between ${isToday ? 'bg-orange-500' : 'bg-gray-50'}`}>
                <div>
                  <p className={`text-xs font-bold ${isToday ? 'text-orange-100' : 'text-gray-400'}`}>
                    {date.toLocaleDateString('en-US', { weekday: 'short' })}
                  </p>
                  <p className={`text-lg font-black leading-none ${isToday ? 'text-white' : 'text-gray-800'}`}>
                    {date.getDate()}
                  </p>
                </div>
                <button onClick={() => openAdd(dateStr)} className={`w-6 h-6 rounded-lg flex items-center justify-center transition-colors ${isToday ? 'bg-white/20 hover:bg-white/30 text-white' : 'bg-orange-100 hover:bg-orange-200 text-orange-600'}`}>
                  <Plus size={14} />
                </button>
              </div>

              {/* Meals */}
              <div className="p-2 space-y-1.5 min-h-[180px]">
                {dayMeals.length === 0 ? (
                  <p className="text-[10px] text-gray-300 text-center pt-4 font-semibold">No meals</p>
                ) : (
                  dayMeals.map(meal => {
                    const c = MEAL_COLORS[meal.mealType];
                    return (
                      <div key={meal.id} className={`p-2 rounded-xl ${c.bg} cursor-pointer group`} onClick={() => onMealSelect?.(meal)}>
                        <div className="flex items-start justify-between gap-1">
                          <p className={`text-[10px] font-black ${c.text} truncate flex-1`}>{meal.name}</p>
                          <div className="flex gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                            <button onClick={(e) => { e.stopPropagation(); openEdit(meal); }} className="w-4 h-4 bg-white rounded flex items-center justify-center">
                              <Edit size={9} className="text-gray-500" />
                            </button>
                            <button onClick={(e) => { e.stopPropagation(); handleDelete(meal.id); }} className="w-4 h-4 bg-white rounded flex items-center justify-center">
                              <Trash2 size={9} className="text-red-500" />
                            </button>
                          </div>
                        </div>
                        <p className={`text-[10px] font-semibold ${c.text} opacity-70`}>{meal.calories} kcal</p>
                        {meal.prepTime && (
                          <div className={`flex items-center gap-0.5 text-[9px] ${c.text} opacity-60 mt-0.5`}>
                            <Clock size={8} />{meal.prepTime}min
                          </div>
                        )}
                      </div>
                    );
                  })
                )}
                {dayMeals.length > 0 && (
                  <p className="text-[10px] text-gray-400 font-bold text-center pt-1">{totals.calories} kcal total</p>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Add/Edit modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
              <h3 className="font-black text-gray-900">{editingMeal ? 'Edit Meal' : 'Add Meal'}</h3>
              <button onClick={closeModal} className="w-8 h-8 bg-gray-100 hover:bg-gray-200 rounded-xl flex items-center justify-center transition-colors">
                <Plus size={16} className="rotate-45 text-gray-500" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="col-span-2">
                  <label className="block text-xs font-bold text-gray-500 mb-1.5">Meal Name</label>
                  <input type="text" value={form.name || ''} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} placeholder="Enter meal name" className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-orange-400 bg-gray-50" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-1.5">Meal Type</label>
                  <select value={selectedMealType} onChange={e => setSelectedMealType(e.target.value as MealPlan['mealType'])} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-orange-400 bg-gray-50">
                    <option value="breakfast">🍳 Breakfast</option>
                    <option value="lunch">🥗 Lunch</option>
                    <option value="dinner">🍽️ Dinner</option>
                    <option value="snack">🍎 Snack</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-1.5">Prep Time (min)</label>
                  <input type="number" value={form.prepTime || ''} onChange={e => setForm(p => ({ ...p, prepTime: parseInt(e.target.value) || 0 }))} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-orange-400 bg-gray-50" />
                </div>
              </div>

              <div className="grid grid-cols-4 gap-3">
                {[
                  { key: 'calories', label: 'Calories' },
                  { key: 'protein',  label: 'Protein (g)' },
                  { key: 'carbs',    label: 'Carbs (g)' },
                  { key: 'fat',      label: 'Fat (g)' },
                ].map(({ key, label }) => (
                  <div key={key}>
                    <label className="block text-xs font-bold text-gray-500 mb-1.5">{label}</label>
                    <input type="number" value={(form as any)[key] || ''} onChange={e => setForm(p => ({ ...p, [key]: parseInt(e.target.value) || 0 }))} className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-orange-400 bg-gray-50" />
                  </div>
                ))}
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1.5">Notes</label>
                <textarea value={form.notes || ''} onChange={e => setForm(p => ({ ...p, notes: e.target.value }))} rows={2} placeholder="Cooking instructions, ingredients…" className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-orange-400 bg-gray-50 resize-none" />
              </div>

              <div className="flex gap-3 pt-2">
                <button onClick={closeModal} className="flex-1 py-3 border border-gray-200 text-gray-600 rounded-2xl font-bold text-sm hover:bg-gray-50 transition-colors">Cancel</button>
                <button onClick={handleSave} className="flex-1 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-2xl font-black text-sm transition-all shadow-lg shadow-orange-200 hover:-translate-y-0.5">
                  {editingMeal ? 'Update Meal' : 'Add Meal'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
