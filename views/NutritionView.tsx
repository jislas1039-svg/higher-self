
import React, { useState } from 'react';
import { MealRecommendation, Theme } from '../types';
import { generateCustomAlternative } from '../geminiService';
import { THEMES } from '../constants';

interface NutritionViewProps {
  recommendations: MealRecommendation[];
  dietaryRestrictions: string;
  theme: Theme;
}

export const NutritionView: React.FC<NutritionViewProps> = ({ recommendations, dietaryRestrictions, theme }) => {
  const [craving, setCraving] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [customResult, setCustomResult] = useState<any>(null);

  const colors = THEMES[theme];

  const handleTransform = async () => {
    if (!craving.trim()) return;
    setIsGenerating(true);
    const result = await generateCustomAlternative(craving, dietaryRestrictions);
    if (result) {
      setCustomResult(result);
    }
    setIsGenerating(false);
  };

  const macroBlock = (label: string, value: number) => (
    <div className="p-2 rounded-xl text-center transition-all" style={{ backgroundColor: colors.bg }}>
      <p className="text-[9px] uppercase font-bold" style={{ color: colors.textDim }}>{label}</p>
      <p className="text-sm font-bold" style={{ color: colors.primary }}>{value}g</p>
    </div>
  );

  return (
    <div className="space-y-8 py-4 animate-fadeIn transition-colors duration-500">
      <header className="space-y-1">
        <h2 className="text-2xl font-serif font-bold" style={{ color: colors.primary }}>Divine Fuel</h2>
        <p className="text-sm" style={{ color: colors.textDim }}>Transforming cravings into vitality.</p>
      </header>

      {/* Craving Transformer */}
      <section className="rounded-[2.5rem] p-6 shadow-sm border overflow-hidden relative transition-all" style={{ backgroundColor: colors.surface, borderColor: colors.border }}>
        <div className="absolute top-0 right-0 p-4 opacity-10" style={{ color: colors.primary }}>
           <svg className="w-20 h-20" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" /></svg>
        </div>
        
        <h3 className="text-lg font-serif font-bold mb-4" style={{ color: colors.primary }}>Craving Transformer</h3>
        <p className="text-xs mb-4 leading-relaxed" style={{ color: colors.textDim }}>Tell me what your heart wants, and I will show you how to honor your body with basic ingredients.</p>
        
        <div className="space-y-3">
          <input 
            type="text" 
            placeholder="Double cheeseburger, Pad Thai..."
            value={craving}
            onChange={(e) => setCraving(e.target.value)}
            className="w-full p-4 rounded-2xl text-sm border outline-none transition-all"
            style={{ backgroundColor: colors.bg, borderColor: colors.border, color: colors.text }}
          />
          <button 
            onClick={handleTransform}
            disabled={isGenerating || !craving.trim()}
            className={`w-full py-4 rounded-2xl font-bold transition-all shadow-lg active:scale-95`}
            style={{ 
                backgroundColor: colors.primary, 
                color: theme === 'dark' ? '#000000' : '#FFFFFF',
                opacity: isGenerating || !craving.trim() ? 0.5 : 1
            }}
          >
            {isGenerating ? 'Manifesting...' : 'Transform My Craving'}
          </button>
        </div>

        {customResult && (
          <div className="mt-8 pt-8 border-t animate-fadeIn" style={{ borderColor: colors.border }}>
            <div className="flex justify-between items-start mb-4">
               <h4 className="text-xl font-serif font-bold" style={{ color: colors.primary }}>{customResult.recipeName}</h4>
               <button onClick={() => setCustomResult(null)} className="opacity-30 hover:opacity-100" style={{ color: colors.text }}>
                 <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
               </button>
            </div>
            
            <p className="text-xs italic mb-6 leading-relaxed" style={{ color: colors.textDim }}>"{customResult.philosophy}"</p>

            <div className="grid grid-cols-4 gap-2 mb-6">
              {macroBlock('Cal', customResult.macros.calories)}
              {macroBlock('Pro', customResult.macros.protein)}
              {macroBlock('Carb', customResult.macros.carbs)}
              {macroBlock('Fat', customResult.macros.fat)}
            </div>

            <div className="space-y-4">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest mb-2" style={{ color: colors.primary }}>Basic Kitchen Items</p>
                <ul className="text-xs space-y-1.5 pl-4 list-disc opacity-80" style={{ color: colors.text }}>
                  {customResult.basicIngredients.map((ing: string, i: number) => <li key={i}>{ing}</li>)}
                </ul>
              </div>

              <div className="p-4 rounded-2xl border" style={{ backgroundColor: `${colors.primary}0D`, borderColor: `${colors.primary}33` }}>
                <p className="text-[10px] font-bold uppercase tracking-widest mb-2" style={{ color: colors.primary }}>Divine Add-ons (Optional)</p>
                <ul className="text-xs space-y-1.5 pl-4 list-disc opacity-80" style={{ color: colors.text }}>
                  {customResult.extraAddOns.map((ing: string, i: number) => <li key={i}>{ing}</li>)}
                </ul>
              </div>

              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest mb-2" style={{ color: colors.primary }}>Preparation</p>
                <p className="text-xs leading-relaxed opacity-80" style={{ color: colors.text }}>{customResult.instructions}</p>
              </div>
            </div>
          </div>
        )}
      </section>

      <div className="space-y-4">
        <h3 className="text-[10px] font-bold uppercase tracking-widest pl-2" style={{ color: colors.textDim }}>Curated Devotions</h3>
        <div className="space-y-6">
          {recommendations.map((meal, idx) => (
            <div key={idx} className="rounded-[2rem] p-6 shadow-sm border transition-all" style={{ backgroundColor: colors.surface, borderColor: colors.border }}>
               <div className="flex justify-between items-center mb-4">
                  <span className="text-[9px] font-bold px-3 py-1 rounded-full uppercase transition-all" style={{ backgroundColor: theme === 'dark' ? '#330000' : '#FFF0F0', color: theme === 'dark' ? '#FF5555' : '#FF0000' }}>Avoid: {meal.original}</span>
                  <span className="text-[9px] font-bold px-3 py-1 rounded-full uppercase transition-all" style={{ backgroundColor: theme === 'dark' ? '#003366' : '#F0F7FF', color: colors.primary }}>Choice: {meal.alternative}</span>
               </div>
               
               <h3 className="text-xl font-serif font-bold mb-2" style={{ color: colors.text }}>{meal.recipeName}</h3>
               
               <div className="grid grid-cols-4 gap-2 mb-6">
                  {macroBlock('Cal', meal.macros.calories)}
                  {macroBlock('Pro', meal.macros.protein)}
                  {macroBlock('Carb', meal.macros.carbs)}
                  {macroBlock('Fat', meal.macros.fat)}
               </div>

               <div className="space-y-2">
                 <p className="text-[10px] font-bold uppercase tracking-widest" style={{ color: colors.primary }}>Ingredients</p>
                 <ul className="text-xs space-y-1 pl-4 list-disc opacity-80" style={{ color: colors.text }}>
                    {meal.ingredients.map((ing, i) => (
                      <li key={i}>{ing}</li>
                    ))}
                 </ul>
               </div>
            </div>
          ))}
        </div>
      </div>

      <div className="p-8 rounded-[2.5rem] shadow-xl transition-all" style={{ backgroundColor: colors.primary, color: theme === 'dark' ? '#000000' : '#FFFFFF' }}>
         <h4 className="font-serif italic text-lg mb-3">Chef's Secret</h4>
         <p className="text-sm opacity-90 leading-relaxed font-light">
           "Season your meals with pink salt and fresh herbs. Healthy food should never be bland—it is a celebration of the Earth and the vessels we inhabit."
         </p>
      </div>
    </div>
  );
};
