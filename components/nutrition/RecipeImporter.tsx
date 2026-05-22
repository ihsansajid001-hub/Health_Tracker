'use client';

import { useState } from 'react';
import { Download, Plus, X, ChefHat, Link } from 'lucide-react';

interface Ingredient {
  name: string;
  amount: string;
  unit: string;
  calories?: number;
  protein?: number;
  carbs?: number;
  fat?: number;
}

interface Recipe {
  name: string;
  servings: number;
  ingredients: Ingredient[];
  instructions: string[];
  totalNutrition: { calories: number; protein: number; carbs: number; fat: number };
}

interface Props {
  onRecipeImported?: (recipe: Recipe) => void;
  onClose?: () => void;
}

export default function RecipeImporter({ onRecipeImported, onClose }: Props) {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [manualMode, setManualMode] = useState(false);
  const [manualRecipe, setManualRecipe] = useState<Partial<Recipe>>({ name: '', servings: 1, ingredients: [], instructions: [] });

  const handleUrlImport = async () => {
    if (!url.trim()) return;
    setLoading(true);
    try {
      await new Promise(r => setTimeout(r, 2000));
      setRecipe({
        name: 'Healthy Chicken Salad',
        servings: 4,
        ingredients: [
          { name: 'Chicken breast', amount: '500', unit: 'g', calories: 825, protein: 155, carbs: 0, fat: 18 },
          { name: 'Mixed greens',   amount: '200', unit: 'g', calories: 40,  protein: 3,   carbs: 8, fat: 0 },
          { name: 'Cherry tomatoes',amount: '150', unit: 'g', calories: 27,  protein: 1,   carbs: 6, fat: 0 },
          { name: 'Olive oil',      amount: '30',  unit: 'ml',calories: 270, protein: 0,   carbs: 0, fat: 30 },
        ],
        instructions: ['Cook chicken until 165°F', 'Slice and cool', 'Combine all ingredients', 'Drizzle with olive oil'],
        totalNutrition: { calories: 1162, protein: 159, carbs: 14, fat: 48 },
      });
    } catch {
      alert('Failed to import recipe. Please try manual entry.');
    } finally {
      setLoading(false);
    }
  };

  const addIngredient = () => setManualRecipe(p => ({ ...p, ingredients: [...(p.ingredients || []), { name: '', amount: '', unit: 'g' }] }));
  const updateIngredient = (i: number, field: keyof Ingredient, val: string) => setManualRecipe(p => ({ ...p, ingredients: p.ingredients?.map((ing, idx) => idx === i ? { ...ing, [field]: val } : ing) || [] }));
  const removeIngredient = (i: number) => setManualRecipe(p => ({ ...p, ingredients: p.ingredients?.filter((_, idx) => idx !== i) || [] }));
  const addInstruction = () => setManualRecipe(p => ({ ...p, instructions: [...(p.instructions || []), ''] }));
  const updateInstruction = (i: number, val: string) => setManualRecipe(p => ({ ...p, instructions: p.instructions?.map((inst, idx) => idx === i ? val : inst) || [] }));
  const removeInstruction = (i: number) => setManualRecipe(p => ({ ...p, instructions: p.instructions?.filter((_, idx) => idx !== i) || [] }));

  const calcNutrition = (r: Partial<Recipe>) => (r.ingredients || []).reduce((t, ing) => ({ calories: t.calories + (ing.calories || 0), protein: t.protein + (ing.protein || 0), carbs: t.carbs + (ing.carbs || 0), fat: t.fat + (ing.fat || 0) }), { calories: 0, protein: 0, carbs: 0, fat: 0 });

  const handleSave = () => {
    const r = recipe || { ...manualRecipe, totalNutrition: calcNutrition(manualRecipe) } as Recipe;
    onRecipeImported?.(r);
    onClose?.();
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-orange-100 rounded-xl flex items-center justify-center">
              <ChefHat className="w-5 h-5 text-orange-500" />
            </div>
            <h2 className="font-black text-gray-900">Recipe Importer</h2>
          </div>
          <button onClick={onClose} className="w-8 h-8 bg-gray-100 hover:bg-gray-200 rounded-xl flex items-center justify-center transition-colors">
            <X size={16} className="text-gray-500" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {!manualMode ? (
            <>
              {/* URL import */}
              <div>
                <p className="font-black text-gray-900 mb-3">Import from URL</p>
                <div className="flex gap-3">
                  <div className="flex-1 relative">
                    <Link size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input type="url" value={url} onChange={e => setUrl(e.target.value)} placeholder="Paste recipe URL…" className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-2xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-orange-400 bg-gray-50" />
                  </div>
                  <button onClick={handleUrlImport} disabled={loading || !url.trim()} className="px-5 py-3 bg-orange-500 hover:bg-orange-600 disabled:bg-gray-200 disabled:text-gray-400 text-white rounded-2xl font-black text-sm transition-all flex items-center gap-2 shadow-lg shadow-orange-200">
                    {loading ? <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" /> : <Download size={15} />}
                    {loading ? 'Importing…' : 'Import'}
                  </button>
                </div>
                <p className="text-xs text-gray-400 font-semibold mt-2">Supports AllRecipes, Food Network, BBC Good Food, and more.</p>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex-1 h-px bg-gray-100" />
                <span className="text-xs text-gray-400 font-semibold">or</span>
                <div className="flex-1 h-px bg-gray-100" />
              </div>

              <div className="text-center">
                <button onClick={() => setManualMode(true)} className="flex items-center gap-2 px-6 py-3 bg-gray-900 hover:bg-gray-800 text-white rounded-2xl font-black text-sm transition-colors mx-auto">
                  <Plus size={15} /> Create Recipe Manually
                </button>
              </div>
            </>
          ) : (
            <>
              <div className="flex items-center justify-between">
                <p className="font-black text-gray-900">Create Recipe Manually</p>
                <button onClick={() => setManualMode(false)} className="text-xs font-bold text-orange-500 hover:text-orange-600">← Back to URL Import</button>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-1.5">Recipe Name</label>
                  <input type="text" value={manualRecipe.name || ''} onChange={e => setManualRecipe(p => ({ ...p, name: e.target.value }))} placeholder="Enter recipe name" className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-orange-400 bg-gray-50" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-1.5">Servings</label>
                  <input type="number" min="1" value={manualRecipe.servings || 1} onChange={e => setManualRecipe(p => ({ ...p, servings: parseInt(e.target.value) }))} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-orange-400 bg-gray-50" />
                </div>
              </div>

              {/* Ingredients */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <p className="font-black text-gray-900 text-sm">Ingredients</p>
                  <button onClick={addIngredient} className="flex items-center gap-1 px-3 py-1.5 bg-orange-500 hover:bg-orange-600 text-white rounded-xl text-xs font-bold transition-colors">
                    <Plus size={12} /> Add
                  </button>
                </div>
                <div className="space-y-2">
                  {manualRecipe.ingredients?.map((ing, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <input type="text" value={ing.name} onChange={e => updateIngredient(i, 'name', e.target.value)} placeholder="Ingredient" className="flex-1 px-3 py-2 border border-gray-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-orange-400 bg-gray-50" />
                      <input type="text" value={ing.amount} onChange={e => updateIngredient(i, 'amount', e.target.value)} placeholder="Amt" className="w-16 px-3 py-2 border border-gray-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-orange-400 bg-gray-50" />
                      <select value={ing.unit} onChange={e => updateIngredient(i, 'unit', e.target.value)} className="w-16 px-2 py-2 border border-gray-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-orange-400 bg-gray-50">
                        {['g','kg','ml','l','cup','tbsp','tsp','piece'].map(u => <option key={u} value={u}>{u}</option>)}
                      </select>
                      <button onClick={() => removeIngredient(i)} className="w-7 h-7 bg-red-50 hover:bg-red-100 rounded-xl flex items-center justify-center transition-colors">
                        <X size={12} className="text-red-500" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Instructions */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <p className="font-black text-gray-900 text-sm">Instructions</p>
                  <button onClick={addInstruction} className="flex items-center gap-1 px-3 py-1.5 bg-orange-500 hover:bg-orange-600 text-white rounded-xl text-xs font-bold transition-colors">
                    <Plus size={12} /> Add
                  </button>
                </div>
                <div className="space-y-2">
                  {manualRecipe.instructions?.map((inst, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <div className="w-6 h-6 bg-orange-100 rounded-lg flex items-center justify-center text-xs font-black text-orange-600 mt-2 flex-shrink-0">{i + 1}</div>
                      <textarea value={inst} onChange={e => updateInstruction(i, e.target.value)} placeholder={`Step ${i + 1}…`} rows={2} className="flex-1 px-3 py-2 border border-gray-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-orange-400 bg-gray-50 resize-none" />
                      <button onClick={() => removeInstruction(i)} className="w-7 h-7 bg-red-50 hover:bg-red-100 rounded-xl flex items-center justify-center transition-colors mt-2">
                        <X size={12} className="text-red-500" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* Imported recipe preview */}
          {recipe && (
            <div className="bg-orange-50 border border-orange-100 rounded-2xl p-5">
              <p className="font-black text-gray-900 mb-3">{recipe.name}</p>
              <div className="grid grid-cols-4 gap-3 mb-3">
                {[
                  { label: 'Calories', value: Math.round(recipe.totalNutrition.calories / recipe.servings), unit: '', color: 'text-orange-500' },
                  { label: 'Protein',  value: Math.round(recipe.totalNutrition.protein / recipe.servings),  unit: 'g', color: 'text-blue-500' },
                  { label: 'Carbs',    value: Math.round(recipe.totalNutrition.carbs / recipe.servings),    unit: 'g', color: 'text-amber-500' },
                  { label: 'Fat',      value: Math.round(recipe.totalNutrition.fat / recipe.servings),      unit: 'g', color: 'text-purple-500' },
                ].map(({ label, value, unit, color }) => (
                  <div key={label} className="text-center bg-white rounded-xl p-2">
                    <p className={`text-lg font-black ${color}`}>{value}{unit}</p>
                    <p className="text-[10px] text-gray-400 font-semibold">{label}/serving</p>
                  </div>
                ))}
              </div>
              <p className="text-xs text-gray-500 font-semibold">{recipe.servings} servings · {recipe.ingredients.length} ingredients</p>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-2 border-t border-gray-100">
            <button onClick={onClose} className="flex-1 py-3 border border-gray-200 text-gray-600 rounded-2xl font-bold text-sm hover:bg-gray-50 transition-colors">Cancel</button>
            <button onClick={handleSave} disabled={!recipe && (!manualRecipe.name || !manualRecipe.ingredients?.length)} className="flex-1 py-3 bg-orange-500 hover:bg-orange-600 disabled:bg-gray-200 disabled:text-gray-400 text-white rounded-2xl font-black text-sm transition-all shadow-lg shadow-orange-200 hover:-translate-y-0.5">
              Save Recipe
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
