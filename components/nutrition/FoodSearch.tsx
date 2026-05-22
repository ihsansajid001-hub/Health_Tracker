'use client';

import { useState, useEffect, useRef } from 'react';
import { Search, Loader2, Package, AlertTriangle, ChevronLeft } from 'lucide-react';
import { OpenFoodFactsAPI, SERVING_SIZES } from '@/lib/api/openfoodfacts';

interface FoodItem {
  id: string;
  name: string;
  brand: string;
  image: string;
  category: string;
  nutrition: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    fiber: number;
    sugar: number;
    sodium: number;
  };
  allergens: string[];
  servingSize: number;
}

interface FoodSearchProps {
  onSelectFood: (food: FoodItem, servingGrams: number) => void;
  userAllergies?: string[];
}

export default function FoodSearch({ onSelectFood, userAllergies = [] }: FoodSearchProps) {
  const [query, setQuery] = useState('');
  const [foods, setFoods] = useState<FoodItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedFood, setSelectedFood] = useState<FoodItem | null>(null);
  const [servingGrams, setServingGrams] = useState(100);
  const [showNutrition, setShowNutrition] = useState(false);
  const searchTimeoutRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
    if (query.length >= 2) {
      searchTimeoutRef.current = setTimeout(() => searchFoods(query), 500);
    } else {
      setFoods([]);
    }
    return () => { if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current); };
  }, [query]);

  const searchFoods = async (q: string) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/nutrition/search?q=${encodeURIComponent(q)}&pageSize=10`);
      const data = await res.json();
      setFoods(res.ok ? data.products : []);
    } catch {
      setFoods([]);
    } finally {
      setLoading(false);
    }
  };

  const handleFoodSelect = (food: FoodItem) => {
    setSelectedFood(food);
    setServingGrams(food.servingSize);
    setShowNutrition(true);
  };

  const handleAddFood = () => {
    if (selectedFood) {
      onSelectFood(selectedFood, servingGrams);
      setSelectedFood(null);
      setShowNutrition(false);
      setQuery('');
      setFoods([]);
    }
  };

  const calcNutrition = (food: FoodItem, grams: number) => {
    const f = grams / 100;
    return {
      calories: Math.round(food.nutrition.calories * f),
      protein: Math.round(food.nutrition.protein * f * 10) / 10,
      carbs: Math.round(food.nutrition.carbs * f * 10) / 10,
      fat: Math.round(food.nutrition.fat * f * 10) / 10,
      fiber: Math.round(food.nutrition.fiber * f * 10) / 10,
      sugar: Math.round(food.nutrition.sugar * f * 10) / 10,
      sodium: Math.round(food.nutrition.sodium * f * 10) / 10,
    };
  };

  const checkAllergens = (food: FoodItem) =>
    OpenFoodFactsAPI.checkAllergens({ allergens_tags: food.allergens } as any, userAllergies);

  // ── Nutrition detail view ─────────────────────────────────────────────────
  if (showNutrition && selectedFood) {
    const nutrition = calcNutrition(selectedFood, servingGrams);
    const foundAllergens = checkAllergens(selectedFood);

    return (
      <div className="space-y-5">
        <button
          onClick={() => setShowNutrition(false)}
          className="flex items-center gap-1.5 text-sm font-semibold text-gray-500 hover:text-orange-500 transition-colors"
        >
          <ChevronLeft size={16} /> Back to search
        </button>

        {/* Allergen warning */}
        {foundAllergens.length > 0 && (
          <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-2xl">
            <AlertTriangle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-red-800 text-sm">Allergen Alert</p>
              <p className="text-red-700 text-sm mt-0.5">Contains: {foundAllergens.join(', ')}</p>
            </div>
          </div>
        )}

        {/* Food card */}
        <div className="flex items-center gap-4 p-4 bg-orange-50 border border-orange-100 rounded-2xl">
          {selectedFood.image ? (
            <img src={selectedFood.image} alt={selectedFood.name} className="w-14 h-14 object-cover rounded-xl flex-shrink-0" />
          ) : (
            <div className="w-14 h-14 bg-orange-100 rounded-xl flex items-center justify-center flex-shrink-0">
              <Package className="w-7 h-7 text-orange-400" />
            </div>
          )}
          <div>
            <p className="font-black text-gray-900">{selectedFood.name}</p>
            {selectedFood.brand && <p className="text-sm text-gray-500">{selectedFood.brand}</p>}
            <p className="text-xs text-gray-400 mt-0.5">{selectedFood.category}</p>
          </div>
        </div>

        {/* Serving size */}
        <div>
          <p className="text-sm font-bold text-gray-700 mb-2">Serving Size</p>
          <div className="grid grid-cols-3 gap-2 mb-3">
            {SERVING_SIZES.slice(0, 6).map((size) => (
              <button
                key={size.grams}
                onClick={() => setServingGrams(size.grams)}
                className={`py-2 text-xs font-bold rounded-xl border transition-all ${
                  servingGrams === size.grams
                    ? 'border-orange-400 bg-orange-50 text-orange-600'
                    : 'border-gray-200 text-gray-600 hover:border-orange-300'
                }`}
              >
                {size.label}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <input
              type="number"
              value={servingGrams}
              onChange={(e) => setServingGrams(parseInt(e.target.value) || 0)}
              className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-orange-400"
              min="1" max="1000"
            />
            <span className="text-sm text-gray-500 font-semibold">grams</span>
          </div>
        </div>

        {/* Nutrition facts */}
        <div className="bg-gray-50 rounded-2xl p-4">
          <p className="font-black text-gray-900 mb-3 text-sm">Nutrition Facts ({servingGrams}g)</p>
          <div className="grid grid-cols-2 gap-x-6 gap-y-2">
            {[
              { label: 'Calories', value: `${nutrition.calories}`, color: 'text-orange-500' },
              { label: 'Protein', value: `${nutrition.protein}g`, color: 'text-blue-500' },
              { label: 'Carbs', value: `${nutrition.carbs}g`, color: 'text-amber-500' },
              { label: 'Fat', value: `${nutrition.fat}g`, color: 'text-purple-500' },
              { label: 'Fiber', value: `${nutrition.fiber}g`, color: 'text-green-500' },
              { label: 'Sugar', value: `${nutrition.sugar}g`, color: 'text-pink-500' },
              { label: 'Sodium', value: `${nutrition.sodium}mg`, color: 'text-gray-500' },
            ].map(({ label, value, color }) => (
              <div key={label} className="flex justify-between items-center py-1 border-b border-gray-100 last:border-0">
                <span className="text-xs text-gray-500 font-semibold">{label}</span>
                <span className={`text-xs font-black ${color}`}>{value}</span>
              </div>
            ))}
          </div>
        </div>

        <button
          onClick={handleAddFood}
          disabled={foundAllergens.length > 0}
          className={`w-full py-3.5 rounded-2xl font-black text-sm transition-all shadow-lg ${
            foundAllergens.length > 0
              ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
              : 'bg-orange-500 hover:bg-orange-600 text-white shadow-orange-200 hover:-translate-y-0.5'
          }`}
        >
          {foundAllergens.length > 0 ? 'Cannot Add — Contains Allergens' : 'Add to Meal'}
        </button>
      </div>
    );
  }

  // ── Search view ───────────────────────────────────────────────────────────
  return (
    <div className="space-y-4">
      {/* Search input */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search foods… (e.g. apple, chicken breast)"
          className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-2xl text-sm font-medium text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent bg-gray-50"
        />
        {loading && <Loader2 className="absolute right-4 top-1/2 -translate-y-1/2 text-orange-400 w-4 h-4 animate-spin" />}
      </div>

      {query.length > 0 && query.length < 2 && (
        <p className="text-xs text-gray-400 font-semibold px-1">Type at least 2 characters…</p>
      )}

      {/* Results */}
      {foods.length > 0 && (
        <div className="space-y-2 max-h-96 overflow-y-auto pr-1">
          {foods.map((food) => {
            const allergens = checkAllergens(food);
            return (
              <button
                key={food.id}
                onClick={() => handleFoodSelect(food)}
                className="w-full flex items-center gap-3 p-3 bg-white border border-gray-100 rounded-2xl hover:border-orange-200 hover:bg-orange-50 text-left transition-all group"
              >
                {food.image ? (
                  <img src={food.image} alt={food.name} className="w-12 h-12 object-cover rounded-xl flex-shrink-0" />
                ) : (
                  <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Package className="w-6 h-6 text-gray-400" />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-sm text-gray-900 truncate group-hover:text-orange-700">{food.name}</p>
                  {food.brand && <p className="text-xs text-gray-500 truncate">{food.brand}</p>}
                  {allergens.length > 0 && (
                    <div className="flex items-center gap-1 mt-0.5">
                      <AlertTriangle className="w-3 h-3 text-red-500" />
                      <span className="text-[10px] text-red-500 font-semibold">{allergens.join(', ')}</span>
                    </div>
                  )}
                  <div className="flex gap-3 text-[10px] text-gray-400 font-semibold mt-1">
                    <span>P {food.nutrition.protein}g</span>
                    <span>C {food.nutrition.carbs}g</span>
                    <span>F {food.nutrition.fat}g</span>
                  </div>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="font-black text-orange-500 text-sm">{food.nutrition.calories}</p>
                  <p className="text-[10px] text-gray-400">kcal/100g</p>
                </div>
              </button>
            );
          })}
        </div>
      )}

      {query.length >= 2 && !loading && foods.length === 0 && (
        <div className="text-center py-10">
          <Package className="w-10 h-10 text-gray-300 mx-auto mb-3" />
          <p className="text-sm font-semibold text-gray-500">No results for "{query}"</p>
          <p className="text-xs text-gray-400 mt-1">Try a different search term</p>
        </div>
      )}
    </div>
  );
}
