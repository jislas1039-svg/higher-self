
import React, { useState } from 'react';
import { UserProfile, BodyType, FitnessGoal, Theme, ExperienceLevel } from '../types';
import { FOCUS_AREAS, THEMES } from '../constants';

interface OnboardingProps {
  onComplete: (profile: UserProfile) => void;
  theme?: Theme;
}

const CUISINES = ['Asian', 'American', 'Italian', 'Mediterranean', 'Mexican', 'Indian', 'French', 'Middle Eastern', 'Healthy Fusion'];

export const Onboarding: React.FC<OnboardingProps> = ({ onComplete, theme = 'light' }) => {
  const [step, setStep] = useState(1);
  const [profile, setProfile] = useState<Partial<UserProfile>>({
    goals: [],
    fatFocusAreas: [],
    cuisines: [],
    favoriteFoods: [],
    dietaryRestrictions: '',
    dailyStepGoal: 8000,
    hasOnboarded: true,
    pronouns: '',
    height: '',
    currentWeight: '',
    targetWeight: '',
    experienceLevel: ExperienceLevel.Beginner
  });

  const colors = THEMES[theme];

  const nextStep = () => setStep(prev => prev + 1);
  const prevStep = () => setStep(prev => prev - 1);

  const toggleGoal = (goal: FitnessGoal) => {
    const goals = profile.goals || [];
    setProfile({
      ...profile,
      goals: goals.includes(goal) ? goals.filter(g => g !== goal) : [...goals, goal]
    });
  };

  const toggleFocus = (area: string) => {
    const areas = profile.fatFocusAreas || [];
    setProfile({
      ...profile,
      fatFocusAreas: areas.includes(area) ? areas.filter(a => a !== area) : [...areas, area]
    });
  };

  const toggleCuisine = (cuisine: string) => {
    const cuisines = profile.cuisines || [];
    setProfile({
      ...profile,
      cuisines: cuisines.includes(cuisine) ? cuisines.filter(c => c !== cuisine) : [...cuisines, cuisine]
    });
  };

  const isStep1Valid = profile.name && profile.name.trim().length > 0 && profile.pronouns && profile.pronouns.trim().length > 0;
  const isStep2Valid = profile.height && profile.currentWeight && profile.targetWeight;

  const inputClass = `w-full p-4 rounded-2xl shadow-sm outline-none transition-all border`;
  const btnClass = `w-full py-4 rounded-2xl font-bold shadow-lg transition-all active:scale-95`;

  return (
    <div className="min-h-screen p-8 flex flex-col justify-center animate-fadeIn transition-colors duration-500" style={{ backgroundColor: colors.bg }}>
      {step === 1 && (
        <div className="space-y-6">
          <h2 className="text-4xl font-serif font-bold" style={{ color: colors.primary }}>Welcome.</h2>
          <p style={{ color: colors.textDim }}>Let's begin your journey to the Higher Self. What is your name and preferred pronouns?</p>
          <div className="space-y-4">
            <input 
              type="text" 
              placeholder="Your name"
              className={inputClass}
              style={{ backgroundColor: colors.surface, color: colors.text, borderColor: colors.border }}
              onChange={(e) => setProfile({...profile, name: e.target.value})}
              value={profile.name || ''}
            />
            <input 
              type="text" 
              placeholder="Your pronouns"
              className={inputClass}
              style={{ backgroundColor: colors.surface, color: colors.text, borderColor: colors.border }}
              onChange={(e) => setProfile({...profile, pronouns: e.target.value})}
              value={profile.pronouns || ''}
            />
          </div>
          <button 
            onClick={nextStep} 
            disabled={!isStep1Valid}
            className={btnClass}
            style={{ 
                backgroundColor: isStep1Valid ? colors.primary : colors.accent,
                color: isStep1Valid ? (theme === 'dark' ? '#000000' : '#FFFFFF') : colors.textDim 
            }}
          >
            Start Journey
          </button>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-6">
          <h2 className="text-3xl font-serif font-bold" style={{ color: colors.primary }}>Physical Vessel</h2>
          <p style={{ color: colors.textDim }}>Provide your current and target metrics:</p>
          <div className="space-y-4">
            <input 
              type="text" 
              placeholder="Height (e.g. 5'11 or 180cm)"
              className={inputClass}
              style={{ backgroundColor: colors.surface, color: colors.text, borderColor: colors.border }}
              onChange={(e) => setProfile({...profile, height: e.target.value})}
              value={profile.height || ''}
            />
            <input 
              type="text" 
              placeholder="Current Weight (e.g. 180 lbs or 82 kg)"
              className={inputClass}
              style={{ backgroundColor: colors.surface, color: colors.text, borderColor: colors.border }}
              onChange={(e) => setProfile({...profile, currentWeight: e.target.value})}
              value={profile.currentWeight || ''}
            />
            <input 
              type="text" 
              placeholder="Target Weight Goal"
              className={inputClass}
              style={{ backgroundColor: colors.surface, color: colors.text, borderColor: colors.border }}
              onChange={(e) => setProfile({...profile, targetWeight: e.target.value})}
              value={profile.targetWeight || ''}
            />
          </div>
          <button 
            onClick={nextStep} 
            disabled={!isStep2Valid}
            className={btnClass}
            style={{ 
                backgroundColor: isStep2Valid ? colors.primary : colors.accent,
                color: isStep2Valid ? (theme === 'dark' ? '#000000' : '#FFFFFF') : colors.textDim 
            }}
          >
            Continue
          </button>
          <button onClick={prevStep} className="underline text-sm opacity-50 block mx-auto mt-4" style={{ color: colors.text }}>Back</button>
        </div>
      )}

      {step === 3 && (
        <div className="space-y-6">
          <h2 className="text-2xl font-serif font-bold" style={{ color: colors.primary }}>Fitness Experience</h2>
          <p className="text-sm" style={{ color: colors.textDim }}>Where are you in your training legacy?</p>
          <div className="grid grid-cols-1 gap-3">
            {Object.values(ExperienceLevel).map((lvl) => (
              <button
                key={lvl}
                onClick={() => { setProfile({...profile, experienceLevel: lvl}); nextStep(); }}
                className={`p-4 rounded-2xl border transition-all text-left font-medium`}
                style={{ 
                    backgroundColor: profile.experienceLevel === lvl ? colors.primary : colors.surface,
                    borderColor: profile.experienceLevel === lvl ? colors.primary : colors.border,
                    color: profile.experienceLevel === lvl ? (theme === 'dark' ? '#000000' : '#FFFFFF') : colors.text
                }}
              >
                {lvl}
              </button>
            ))}
          </div>
          <button onClick={prevStep} className="underline text-sm opacity-50 block mx-auto mt-4" style={{ color: colors.text }}>Back</button>
        </div>
      )}

      {step === 4 && (
        <div className="space-y-6">
          <h2 className="text-2xl font-serif font-bold" style={{ color: colors.primary }}>Your Starting Point</h2>
          <p className="text-sm" style={{ color: colors.textDim }}>Select your current body composition:</p>
          <div className="grid grid-cols-1 gap-3">
            {Object.values(BodyType).map((type) => (
              <button
                key={type}
                onClick={() => { setProfile({...profile, bodyType: type}); nextStep(); }}
                className={`p-4 rounded-2xl border transition-all text-left font-medium`}
                style={{ 
                    backgroundColor: profile.bodyType === type ? colors.primary : colors.surface,
                    borderColor: profile.bodyType === type ? colors.primary : colors.border,
                    color: profile.bodyType === type ? (theme === 'dark' ? '#000000' : '#FFFFFF') : colors.text
                }}
              >
                {type}
              </button>
            ))}
          </div>
          <button onClick={prevStep} className="underline text-sm opacity-50 block mx-auto mt-4" style={{ color: colors.text }}>Back</button>
        </div>
      )}

      {step === 5 && (
        <div className="space-y-6 max-h-[80vh] overflow-y-auto pr-2 custom-scrollbar">
          <h2 className="text-2xl font-serif font-bold" style={{ color: colors.primary }}>What are your goals?</h2>
          <p className="text-sm" style={{ color: colors.textDim }}>Select all that apply. Notice specialized options for Running, Splits, and Bulking:</p>
          <div className="grid grid-cols-1 gap-3">
            {Object.values(FitnessGoal).map((goal) => (
              <button
                key={goal}
                onClick={() => toggleGoal(goal)}
                className={`p-4 rounded-2xl border transition-all text-left font-medium`}
                style={{ 
                    backgroundColor: profile.goals?.includes(goal) ? colors.primary : colors.surface,
                    borderColor: profile.goals?.includes(goal) ? colors.primary : colors.border,
                    color: profile.goals?.includes(goal) ? (theme === 'dark' ? '#000000' : '#FFFFFF') : colors.text
                }}
              >
                <div className="flex justify-between items-center">
                  <span>{goal}</span>
                  {profile.goals?.includes(goal) && (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                  )}
                </div>
              </button>
            ))}
          </div>
          <button 
            onClick={nextStep} 
            disabled={profile.goals?.length === 0} 
            className={btnClass}
            style={{ 
                backgroundColor: colors.primary,
                color: theme === 'dark' ? '#000000' : '#FFFFFF'
            }}
          >
            Continue
          </button>
          <button onClick={prevStep} className="underline text-sm opacity-50 block mx-auto mt-4" style={{ color: colors.text }}>Back</button>
        </div>
      )}

      {step === 6 && (
        <div className="space-y-6 max-h-[80vh] overflow-y-auto pr-2 custom-scrollbar">
          <h2 className="text-2xl font-serif font-bold" style={{ color: colors.primary }}>Target Focus Areas</h2>
          <p className="text-sm" style={{ color: colors.textDim }}>Where would you like to see the most change?</p>
          <div className="grid grid-cols-2 gap-3">
            {FOCUS_AREAS.map((area) => (
              <button
                key={area}
                onClick={() => toggleFocus(area)}
                className={`p-3 text-[10px] font-bold uppercase tracking-widest rounded-xl border transition-all`}
                style={{ 
                    backgroundColor: profile.fatFocusAreas?.includes(area) ? colors.primary : colors.surface,
                    borderColor: profile.fatFocusAreas?.includes(area) ? colors.primary : colors.border,
                    color: profile.fatFocusAreas?.includes(area) ? (theme === 'dark' ? '#000000' : '#FFFFFF') : colors.textDim
                }}
              >
                {area}
              </button>
            ))}
          </div>
          <button 
            onClick={nextStep} 
            className={btnClass}
            style={{ 
                backgroundColor: colors.primary,
                color: theme === 'dark' ? '#000000' : '#FFFFFF'
            }}
          >
            Almost there
          </button>
          <button onClick={prevStep} className="underline text-sm opacity-50 block mx-auto mt-4" style={{ color: colors.text }}>Back</button>
        </div>
      )}

      {step === 7 && (
        <div className="space-y-6 max-h-[80vh] overflow-y-auto pr-2 custom-scrollbar">
          <h2 className="text-2xl font-serif font-bold" style={{ color: colors.primary }}>Divine Palate</h2>
          <p className="text-sm" style={{ color: colors.textDim }}>What cuisines do you feel most aligned with?</p>
          <div className="grid grid-cols-2 gap-2">
            {CUISINES.map((c) => (
              <button
                key={c}
                onClick={() => toggleCuisine(c)}
                className={`p-2 text-[10px] font-bold uppercase rounded-xl border transition-all`}
                style={{ 
                    backgroundColor: profile.cuisines?.includes(c) ? colors.primary : colors.surface,
                    borderColor: profile.cuisines?.includes(c) ? colors.primary : colors.border,
                    color: profile.cuisines?.includes(c) ? (theme === 'dark' ? '#000000' : '#FFFFFF') : colors.textDim
                }}
              >
                {c}
              </button>
            ))}
          </div>

          <div className="space-y-4">
             <div>
                <label className="block text-xs font-bold uppercase tracking-widest mb-2" style={{ color: colors.textDim }}>Favorite food types</label>
                <input 
                  type="text"
                  className={inputClass}
                  style={{ backgroundColor: colors.surface, color: colors.text, borderColor: colors.border }}
                  placeholder="Pizza, Tacos, Sushi..."
                  onChange={(e) => setProfile({...profile, favoriteFoods: e.target.value.split(',').map(s => s.trim())})}
                />
             </div>
             <div>
                <label className="block text-xs font-bold uppercase tracking-widest mb-2" style={{ color: colors.textDim }}>Dietary Restrictions</label>
                <input 
                  type="text"
                  className={inputClass}
                  style={{ backgroundColor: colors.surface, color: colors.text, borderColor: colors.border }}
                  placeholder="Vegan, No nuts, etc."
                  onChange={(e) => setProfile({...profile, dietaryRestrictions: e.target.value})}
                />
             </div>
             <div>
                <label className="block text-xs font-bold uppercase tracking-widest mb-2" style={{ color: colors.textDim }}>Medical Context</label>
                <textarea 
                  className={inputClass}
                  style={{ backgroundColor: colors.surface, color: colors.text, borderColor: colors.border, height: '60px' }}
                  placeholder="Any injuries or medical notes?"
                  onChange={(e) => setProfile({...profile, medicalIssues: e.target.value})}
                />
             </div>
          </div>
          <button 
            onClick={nextStep} 
            className={btnClass}
            style={{ 
                backgroundColor: colors.primary,
                color: theme === 'dark' ? '#000000' : '#FFFFFF'
            }}
          >
            One Last Step
          </button>
          <button onClick={prevStep} className="underline text-sm opacity-50 block mx-auto mt-4" style={{ color: colors.text }}>Back</button>
        </div>
      )}

      {step === 8 && (
        <div className="space-y-6">
          <h2 className="text-3xl font-serif font-bold" style={{ color: colors.primary }}>Step Goal</h2>
          <p style={{ color: colors.textDim }}>Set your daily movement intention. Recommended range: 5,000 - 15,000.</p>
          
          <div className="space-y-4">
             <div className="flex flex-wrap gap-2">
                {[5000, 8000, 10000, 12000].map(s => (
                  <button 
                    key={s}
                    onClick={() => setProfile({...profile, dailyStepGoal: s})}
                    className={`flex-1 min-w-[80px] py-3 rounded-xl border font-bold text-xs transition-all`}
                    style={{ 
                      backgroundColor: profile.dailyStepGoal === s ? colors.primary : colors.surface,
                      borderColor: profile.dailyStepGoal === s ? colors.primary : colors.border,
                      color: profile.dailyStepGoal === s ? (theme === 'dark' ? '#000000' : '#FFFFFF') : colors.text
                    }}
                  >
                    {s.toLocaleString()}
                  </button>
                ))}
             </div>
             <div className="pt-2">
                <label className="block text-[10px] font-bold uppercase tracking-widest mb-2 opacity-50">Custom Step Goal</label>
                <div className="relative">
                  <input 
                    type="number"
                    className={inputClass}
                    style={{ backgroundColor: colors.surface, color: colors.text, borderColor: colors.border }}
                    placeholder="Enter custom goal..."
                    value={profile.dailyStepGoal || ''}
                    onChange={(e) => setProfile({...profile, dailyStepGoal: parseInt(e.target.value) || 0})}
                  />
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-bold uppercase opacity-30" style={{ color: colors.text }}>Steps</div>
                </div>
             </div>
          </div>

          <button 
            onClick={() => onComplete(profile as UserProfile)} 
            className={btnClass}
            style={{ 
                backgroundColor: colors.primary,
                color: theme === 'dark' ? '#000000' : '#FFFFFF'
            }}
          >
            Awaken My Potential
          </button>
          <button onClick={prevStep} className="underline text-sm opacity-50 block mx-auto mt-4" style={{ color: colors.text }}>Back</button>
        </div>
      )}
    </div>
  );
};
