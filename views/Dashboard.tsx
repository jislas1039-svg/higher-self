
import React, { useState, useEffect, useRef } from 'react';
import { UserProfile, DailyStats, Theme } from '../types';
import { ICONS, THEMES } from '../constants';

interface DashboardProps {
  profile: UserProfile;
  stats: DailyStats;
  theme: Theme;
  onUpdateStats: (newStats: Partial<DailyStats>) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ profile, stats, theme, onUpdateStats }) => {
  const [steps, setSteps] = useState(stats.steps);
  const [isAlertVisible, setIsAlertVisible] = useState(false);
  const [walkTimer, setWalkTimer] = useState<number | null>(null); // seconds
  const colors = THEMES[theme];
  const timerRef = useRef<number | null>(null);

  // Activity tracking for sedentary alert
  useEffect(() => {
    const checkSedentary = setInterval(() => {
      const now = Date.now();
      const idleTime = now - stats.lastActiveTimestamp;
      const MAX_IDLE = 3600000; // 60 minutes
      
      if (idleTime > MAX_IDLE && !isAlertVisible && !walkTimer) {
        setIsAlertVisible(true);
      }
    }, 60000); // Check every minute

    return () => clearInterval(checkSedentary);
  }, [stats.lastActiveTimestamp, isAlertVisible, walkTimer]);

  // Simulated passive step growth
  useEffect(() => {
    const interval = setInterval(() => {
      setSteps(s => Math.min(s + Math.floor(Math.random() * 5), profile.dailyStepGoal + 500));
      onUpdateStats({ lastActiveTimestamp: Date.now() });
    }, 30000);
    return () => clearInterval(interval);
  }, [profile.dailyStepGoal]);

  // Walk Ritual Timer
  useEffect(() => {
    if (walkTimer !== null && walkTimer > 0) {
      timerRef.current = window.setTimeout(() => {
        setWalkTimer(walkTimer - 1);
        // Every 30 seconds of walking adds ~50 steps
        if (walkTimer % 30 === 0) {
          setSteps(s => s + 50);
        }
      }, 1000);
    } else if (walkTimer === 0) {
      setWalkTimer(null);
      alert("Movement Ritual complete. Your spirit feels lighter.");
      onUpdateStats({ lastActiveTimestamp: Date.now() });
    }
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [walkTimer]);

  useEffect(() => {
    onUpdateStats({ steps });
  }, [steps]);

  const startWalk = (mins: number) => {
    setWalkTimer(mins * 60);
    setIsAlertVisible(false);
    onUpdateStats({ lastActiveTimestamp: Date.now() });
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-8 py-4 animate-fadeIn">
      {/* Sedentary Alert Notification */}
      {isAlertVisible && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/40 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-sm rounded-[2.5rem] p-8 text-center shadow-2xl border transition-all" style={{ backgroundColor: colors.surface, borderColor: colors.primary }}>
            <div className="w-16 h-16 rounded-full mx-auto mb-6 flex items-center justify-center bg-accent/20" style={{ color: colors.primary, backgroundColor: colors.accent }}>
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
            </div>
            <h3 className="text-xl font-serif font-bold mb-2" style={{ color: colors.primary }}>Stagnation Alert</h3>
            <p className="text-xs mb-8 italic opacity-70 leading-relaxed" style={{ color: colors.text }}>
              Your energy has settled. The Earth calls for your rhythm. Would you like to initiate a movement ritual?
            </p>
            <div className="space-y-3">
              <button onClick={() => startWalk(15)} className="w-full py-4 rounded-2xl font-bold shadow-lg" style={{ backgroundColor: colors.primary, color: theme === 'dark' ? '#000000' : '#FFFFFF' }}>Initiate 15m Walk</button>
              <button onClick={() => setIsAlertVisible(false)} className="w-full py-2 text-[10px] font-bold uppercase tracking-widest opacity-40">Not right now</button>
            </div>
          </div>
        </div>
      )}

      {/* Main Progress Ring */}
      <section className="p-6 rounded-[2.5rem] border shadow-sm transition-all" style={{ backgroundColor: theme === 'dark' ? '#0A0A0A' : colors.surface, borderColor: colors.border }}>
        <h2 className="text-lg font-serif italic" style={{ color: colors.textDim }}>Daily Quest</h2>
        <div className="flex items-end justify-between">
          <p className="text-4xl font-bold mt-1" style={{ color: colors.primary }}>{Math.round(stats.progressPercentage)}% Complete</p>
          <span className="text-[10px] font-bold uppercase tracking-widest opacity-40 mb-1">{profile.experienceLevel}</span>
        </div>
        <div className="w-full h-2 rounded-full mt-4 overflow-hidden" style={{ backgroundColor: colors.accent }}>
          <div 
            className="h-full transition-all duration-1000"
            style={{ width: `${stats.progressPercentage}%`, backgroundColor: colors.primary }}
          />
        </div>
      </section>

      {/* Stats Cards */}
      <section className="grid grid-cols-2 gap-4">
        <div className="p-6 rounded-[2.5rem] flex flex-col justify-between aspect-square shadow-xl transition-all relative overflow-hidden" 
          style={{ 
            backgroundColor: theme === 'dark' ? colors.primary : colors.primary, 
            color: theme === 'dark' ? '#000000' : '#FFFFFF' 
          }}>
          <div className="w-10 h-10 rounded-xl flex items-center justify-center relative z-10" style={{ backgroundColor: 'rgba(255,255,255,0.2)' }}>
            {ICONS.steps}
          </div>
          <div className="relative z-10">
            <p className="text-4xl font-bold">{steps.toLocaleString()}</p>
            <p className="text-[10px] font-bold uppercase tracking-widest mt-1 opacity-70">Steps Today</p>
            <div className="mt-2 w-full h-1 bg-white/20 rounded-full overflow-hidden">
               <div className="h-full bg-white/60 transition-all" style={{ width: `${Math.min((steps / profile.dailyStepGoal) * 100, 100)}%` }} />
            </div>
          </div>
        </div>

        <div className="p-6 rounded-[2.5rem] flex flex-col justify-between aspect-square border transition-all" 
          style={{ backgroundColor: colors.accent, color: colors.primary, borderColor: colors.border }}>
          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: theme === 'dark' ? 'rgba(0,0,0,0.1)' : 'rgba(255,255,255,0.5)' }}>
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <p className="text-3xl font-bold" style={{ color: theme === 'dark' ? colors.secondary : colors.primary }}>{stats.meditationMinutes}m</p>
            <p className="text-[10px] font-bold uppercase tracking-widest mt-1" style={{ color: colors.textDim }}>Mindfulness</p>
          </div>
        </div>
      </section>

      {/* Walk Ritual Center */}
      <section className="p-6 rounded-[2.5rem] border shadow-sm transition-all" style={{ backgroundColor: colors.surface, borderColor: colors.border }}>
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-serif font-bold text-xl" style={{ color: colors.text }}>Movement Rituals</h3>
          {walkTimer !== null && (
             <div className="px-4 py-2 rounded-full bg-accent text-[10px] font-bold animate-pulse" style={{ color: colors.primary }}>
               Active: {formatTime(walkTimer)}
             </div>
          )}
        </div>
        
        {walkTimer === null ? (
          <div className="grid grid-cols-3 gap-2">
            {[10, 20, 30].map(mins => (
              <button 
                key={mins}
                onClick={() => startWalk(mins)}
                className="py-4 rounded-2xl border text-[10px] font-bold uppercase tracking-widest transition-all hover:scale-105 active:scale-95"
                style={{ backgroundColor: colors.bg, borderColor: colors.border, color: colors.primary }}
              >
                {mins}m Walk
              </button>
            ))}
          </div>
        ) : (
          <button 
            onClick={() => setWalkTimer(null)}
            className="w-full py-4 rounded-2xl border border-red-200 text-red-500 font-bold uppercase text-[10px] tracking-widest"
          >
            End Ritual Early
          </button>
        )}
      </section>

      {/* Task List */}
      <section className="space-y-4">
        <h3 className="font-serif font-bold text-xl" style={{ color: colors.text }}>Mind & Body Tasks</h3>
        {[
          { label: 'Step Goal reached', done: steps >= profile.dailyStepGoal },
          { label: 'Workout completed', done: stats.workoutCompleted },
          { label: 'Journaled for clarity', done: stats.journalCompleted },
          { label: 'Meditation session', done: stats.meditationMinutes >= 10 }
        ].map((task, idx) => (
          <div key={idx} className="flex items-center gap-4 p-4 rounded-2xl border shadow-sm transition-all" 
            style={{ backgroundColor: colors.surface, borderColor: colors.border }}>
             <div className={`w-6 h-6 rounded-full flex items-center justify-center border-2 transition-all`}
               style={{ 
                 backgroundColor: task.done ? colors.primary : 'transparent', 
                 borderColor: task.done ? colors.primary : colors.accent 
               }}>
               {task.done && <svg className="w-4 h-4" fill="none" stroke={theme === 'dark' ? '#000000' : '#FFFFFF'} viewBox="0 0 24 24" style={{ strokeWidth: 3 }}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>}
             </div>
             <span className={`flex-1 text-sm font-medium transition-all ${task.done ? 'line-through opacity-30' : ''}`} style={{ color: colors.text }}>{task.label}</span>
          </div>
        ))}
      </section>
      
      {/* Aesthetic Affirmation Video Section */}
      <section className="relative h-48 rounded-[2.5rem] overflow-hidden shadow-2xl border" style={{ borderColor: colors.border }}>
        <video 
          autoPlay 
          muted 
          loop 
          playsInline
          className={`absolute inset-0 w-full h-full object-cover transition-all duration-1000 ${theme === 'dark' ? 'brightness-50 grayscale' : 'grayscale opacity-40'}`}
        >
          <source src="https://player.vimeo.com/external/371433846.sd.mp4?s=231da6517a1baf963740553687a810d7204654b4&profile_id=164&oauth2_token_id=57447761" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-black/20 flex flex-col items-center justify-center p-8 text-center backdrop-blur-[2px]">
          <p className="text-white font-serif italic text-lg leading-relaxed shadow-black drop-shadow-lg">
            "I am evolving into my highest version every single day."
          </p>
          {theme === 'dark' && <div className="mt-4 w-12 h-1 rounded-full bg-[#007AFF] shadow-[0_0_15px_#007AFF]" />}
        </div>
      </section>
    </div>
  );
};
