
import React, { useState, useEffect, memo } from 'react';
import { WorkoutDay, Exercise, Theme } from '../types';
import { generateExerciseGraphic } from '../geminiService';
import { THEMES } from '../constants';

interface WorkoutViewProps {
  schedule: WorkoutDay[];
  theme: Theme;
  onCompleteWorkout: () => void;
}

const ExerciseItem = memo(({ 
  ex, 
  index, 
  expandedEx, 
  onExpand, 
  aiImage, 
  isGenerating, 
  theme, 
  colors,
  soreLevel 
}: { 
  ex: Exercise, 
  index: number, 
  expandedEx: number | null, 
  onExpand: (idx: number, ex: Exercise) => void,
  aiImage: string | undefined,
  isGenerating: boolean,
  theme: Theme,
  colors: any,
  soreLevel: number
}) => {
  const isExpanded = expandedEx === index;

  return (
    <div 
      onClick={() => onExpand(index, ex)}
      className="flex flex-col gap-4 p-4 rounded-3xl border transition-all cursor-pointer group shadow-sm hover:scale-[1.01]"
      style={{ backgroundColor: colors.surface, borderColor: isExpanded ? colors.primary : colors.border }}
    >
      <div className="flex gap-4 items-center">
        <div className="w-16 h-16 rounded-2xl flex-shrink-0 flex items-center justify-center overflow-hidden border shadow-inner" style={{ backgroundColor: colors.bg, borderColor: colors.border }}>
          {aiImage ? (
            <img 
              src={aiImage} 
              alt={ex.name} 
              loading="lazy"
              className="w-full h-full object-cover transition-transform group-hover:scale-110" 
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center opacity-20" style={{ color: colors.primary }}>
              {isGenerating ? (
                <div className="w-4 h-4 border-2 rounded-full animate-spin" style={{ borderColor: `${colors.primary}33`, borderTopColor: colors.primary }}></div>
              ) : (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
              )}
            </div>
          )}
        </div>
        <div className="flex-1">
          <h4 className="font-bold leading-tight" style={{ color: colors.text }}>{ex.name}</h4>
          <p className="text-xs font-bold mt-1" style={{ color: colors.primary }}>{soreLevel > 1 ? `Light Volume` : ex.reps}</p>
        </div>
        <div className={`transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}>
          <svg className="w-5 h-5 opacity-40" style={{ color: colors.textDim }} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
        </div>
      </div>
      
      {isExpanded && (
        <div className="pt-2 animate-fadeIn space-y-4">
          <div className="aspect-video w-full rounded-2xl overflow-hidden border flex items-center justify-center relative shadow-inner" style={{ backgroundColor: colors.bg, borderColor: colors.border }}>
            {aiImage ? (
              <img 
                src={aiImage} 
                alt={`${ex.name} form`} 
                className={`w-full h-full object-cover ${theme === 'dark' ? 'invert brightness-90' : ''}`} 
              />
            ) : (
              <div className="flex flex-col items-center gap-2">
                 <div className="w-8 h-8 border-4 rounded-full animate-spin" style={{ borderColor: `${colors.primary}22`, borderTopColor: colors.primary }}></div>
                 <p className="text-[10px] font-bold uppercase tracking-widest" style={{ color: colors.primary }}>Visualizing Form...</p>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <p className="text-[10px] font-bold uppercase tracking-widest" style={{ color: colors.primary }}>Instructional Guide</p>
            <p className="text-sm leading-relaxed italic border-l-2 pl-4" style={{ color: colors.text, borderColor: colors.accent }}>
              {ex.description}
            </p>
          </div>

          {ex.evidence && (
            <div className="p-4 rounded-2xl border bg-opacity-30" style={{ backgroundColor: colors.accent, borderColor: colors.border }}>
              <p className="text-[9px] font-bold uppercase tracking-widest mb-1" style={{ color: colors.primary }}>Scientific Foundation</p>
              <p className="text-xs leading-relaxed opacity-80" style={{ color: colors.text }}>{ex.evidence}</p>
              {ex.articleLink && (
                <div className="mt-3 flex items-center gap-1.5 opacity-50">
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                  <span className="text-[8px] font-bold uppercase tracking-widest">Source: {ex.articleLink}</span>
                </div>
              )}
            </div>
          )}

          <div className="flex gap-2">
             <span className="text-[10px] px-3 py-1 rounded-full font-bold uppercase tracking-tighter" style={{ backgroundColor: colors.accent, color: colors.primary }}>{ex.category}</span>
          </div>
        </div>
      )}
    </div>
  );
});

export const WorkoutView: React.FC<WorkoutViewProps> = ({ schedule, theme, onCompleteWorkout }) => {
  const [activeDayIdx, setActiveDayIdx] = useState(0);
  const [soreLevel, setSoreLevel] = useState(0); // 0-3
  const [expandedEx, setExpandedEx] = useState<number | null>(null);
  const [aiImages, setAiImages] = useState<Record<string, string>>(() => {
    try {
      const saved = localStorage.getItem('hs_ai_images');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });
  const [generatingId, setGeneratingId] = useState<string | null>(null);

  const colors = THEMES[theme];

  useEffect(() => {
    try {
      localStorage.setItem('hs_ai_images', JSON.stringify(aiImages));
    } catch (e) {
      if (e instanceof DOMException && e.name === 'QuotaExceededError') {
        localStorage.removeItem('hs_ai_images');
      }
    }
  }, [aiImages]);

  const currentDay = schedule[activeDayIdx];

  const handleComplete = () => {
      onCompleteWorkout();
      window.scrollTo({ top: 0, behavior: 'smooth' });
      alert("Excellent work. Your body is thanking you.");
  };

  const handleExpand = async (idx: number, ex: Exercise) => {
    const isOpening = expandedEx !== idx;
    setExpandedEx(isOpening ? idx : null);

    if (isOpening && !aiImages[ex.name]) {
      setGeneratingId(ex.name);
      const imageUrl = await generateExerciseGraphic(ex.name, ex.description);
      if (imageUrl) {
        setAiImages(prev => ({ ...prev, [ex.name]: imageUrl }));
      }
      setGeneratingId(null);
    }
  };

  return (
    <div className="space-y-6 py-4 animate-fadeIn">
      <div className="flex overflow-x-auto gap-2 pb-2 no-scrollbar">
        {schedule.map((day, idx) => (
          <button
            key={idx}
            onClick={() => {
              setActiveDayIdx(idx);
              setExpandedEx(null);
            }}
            className={`flex-shrink-0 px-5 py-3 rounded-2xl font-bold transition-all text-xs uppercase tracking-widest`}
            style={{ 
              backgroundColor: activeDayIdx === idx ? colors.primary : colors.surface,
              color: activeDayIdx === idx ? (theme === 'dark' ? '#000000' : '#FFFFFF') : colors.textDim,
              boxShadow: activeDayIdx === idx ? `0 4px 14px ${colors.primary}44` : 'none'
            }}
          >
            {day.day}
          </button>
        ))}
      </div>

      <div className="rounded-[2.5rem] p-6 shadow-sm border transition-all" style={{ backgroundColor: colors.surface, borderColor: colors.border }}>
        <div className="flex justify-between items-start mb-6 px-2">
          <div>
            <h2 className="text-2xl font-serif font-bold" style={{ color: colors.primary }}>{currentDay.focus}</h2>
            <p className="text-xs italic mt-1 font-medium" style={{ color: colors.textDim }}>Calibrated for {currentDay.isRest ? 'Healing' : 'Performance'}</p>
          </div>
          {currentDay.isRest && (
            <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-tighter" style={{ backgroundColor: colors.accent, color: colors.primary }}>Rest Phase</span>
          )}
        </div>

        {currentDay.isRest ? (
          <div className="space-y-4 text-center py-16">
            <div className="w-20 h-20 rounded-full mx-auto flex items-center justify-center" style={{ backgroundColor: colors.bg }}>
               <svg className="w-10 h-10 opacity-30" style={{ color: colors.primary }} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-7.714 2.143L11 21l-2.286-6.857L1 12l7.714-2.143L11 3z" /></svg>
            </div>
            <p className="text-sm max-w-[200px] mx-auto opacity-70" style={{ color: colors.textDim }}>Rest is as vital as the work. Allow your fibers to reconnect and strengthen.</p>
          </div>
        ) : (
          <div className="space-y-6">
             <div className="p-5 rounded-3xl transition-all" style={{ backgroundColor: colors.bg }}>
                <p className="text-[10px] font-bold mb-3 uppercase tracking-widest opacity-80" style={{ color: colors.primary }}>Recovery State</p>
                <div className="flex gap-2">
                   {[0,1,2,3].map(v => (
                     <button 
                        key={v}
                        onClick={() => setSoreLevel(v)}
                        className={`flex-1 py-2 text-[10px] rounded-xl border transition-all font-bold uppercase`}
                        style={{ 
                          backgroundColor: soreLevel === v ? colors.primary : colors.surface,
                          borderColor: soreLevel === v ? colors.primary : colors.border,
                          color: soreLevel === v ? (theme === 'dark' ? '#000000' : '#FFFFFF') : colors.textDim
                        }}
                     >
                       {v === 0 ? 'Fresh' : v === 1 ? 'Tender' : v === 2 ? 'Sore' : 'Heavy'}
                     </button>
                   ))}
                </div>
             </div>

             <div className="space-y-4">
               {currentDay.exercises.map((ex, i) => (
                 <ExerciseItem 
                    key={`${activeDayIdx}-${i}`}
                    ex={ex}
                    index={i}
                    expandedEx={expandedEx}
                    onExpand={handleExpand}
                    aiImage={aiImages[ex.name]}
                    isGenerating={generatingId === ex.name}
                    theme={theme}
                    colors={colors}
                    soreLevel={soreLevel}
                 />
               ))}
             </div>

             <button 
               onClick={handleComplete}
               className="w-full py-5 rounded-3xl font-bold shadow-xl transition-all active:scale-95 mt-4"
               style={{ 
                 backgroundColor: colors.primary, 
                 color: theme === 'dark' ? '#000000' : '#FFFFFF',
                 boxShadow: `0 8px 30px ${colors.primary}44`
               }}
             >
               Seal Performance Ritual
             </button>
          </div>
        )}
      </div>
    </div>
  );
};
