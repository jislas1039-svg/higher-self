
import React, { useState, useEffect, useMemo } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { UserProfile, DailyStats, WorkoutDay, MealRecommendation, JournalEntry, Theme } from './types';
import { Layout } from './components/Layout';
import { Onboarding } from './views/Onboarding';
import { Dashboard } from './views/Dashboard';
import { WorkoutView } from './views/WorkoutView';
import { NutritionView } from './views/NutritionView';
import { MindfulnessView } from './views/MindfulnessView';
import { SupportView } from './views/SupportView';
import { ScannerView } from './views/ScannerView';
import { generatePersonalizedPlan } from './geminiService';
import { THEMES } from './constants';

const App: React.FC = () => {
  const [profile, setProfile] = useState<UserProfile | null>(() => {
    try {
      const saved = localStorage.getItem('hs_profile');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [theme, setTheme] = useState<Theme>(() => {
    try {
      const saved = localStorage.getItem('hs_theme');
      return (saved as Theme) || 'light';
    } catch {
      return 'light';
    }
  });

  const [isLoading, setIsLoading] = useState(false);
  const [plan, setPlan] = useState<{ schedule: WorkoutDay[], meals: MealRecommendation[], journalPrompts: string[] } | null>(() => {
    try {
      const saved = localStorage.getItem('hs_plan');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [stats, setStats] = useState<DailyStats>(() => {
    try {
      const saved = localStorage.getItem('hs_stats');
      return saved ? JSON.parse(saved) : {
        steps: 0,
        workoutCompleted: false,
        journalCompleted: false,
        meditationMinutes: 0,
        progressPercentage: 0
      };
    } catch {
      return {
        steps: 0,
        workoutCompleted: false,
        journalCompleted: false,
        meditationMinutes: 0,
        progressPercentage: 0
      };
    }
  });

  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>(() => {
    try {
      const saved = localStorage.getItem('hs_journal');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const colors = THEMES[theme];

  // Calculate global daily progress
  const dailyProgress = useMemo(() => {
    let completed = 0;
    let total = 4;
    
    if (profile && stats.steps >= profile.dailyStepGoal) completed++;
    if (stats.workoutCompleted) completed++;
    if (stats.journalCompleted) completed++;
    if (stats.meditationMinutes >= 10) completed++;

    return (completed / total) * 100;
  }, [stats, profile]);

  useEffect(() => {
    setStats(prev => ({ ...prev, progressPercentage: dailyProgress }));
  }, [dailyProgress]);

  // Persistent storage
  useEffect(() => {
    try {
      if (profile) localStorage.setItem('hs_profile', JSON.stringify(profile));
      if (plan) localStorage.setItem('hs_plan', JSON.stringify(plan));
      localStorage.setItem('hs_stats', JSON.stringify(stats));
      localStorage.setItem('hs_journal', JSON.stringify(journalEntries));
      localStorage.setItem('hs_theme', theme);
    } catch (e) {
      if (e instanceof DOMException && e.name === 'QuotaExceededError') {
        console.warn('Storage quota exceeded. Attempting to free space...');
        // Non-critical data cleanup: Clear images first
        localStorage.removeItem('hs_ai_images');
      }
    }
  }, [profile, plan, stats, journalEntries, theme]);

  const handleOnboardingComplete = async (newProfile: UserProfile) => {
    setIsLoading(true);
    setProfile(newProfile);
    const generatedPlan = await generatePersonalizedPlan(newProfile);
    if (generatedPlan) {
      setPlan({
        schedule: generatedPlan.schedule,
        meals: generatedPlan.meals,
        journalPrompts: generatedPlan.journalPrompts
      });
    }
    setIsLoading(false);
  };

  const toggleTheme = () => setTheme(prev => prev === 'light' ? 'dark' : 'light');

  if (isLoading) {
    return (
      <div className="min-h-screen transition-colors duration-500 flex flex-col items-center justify-center p-8 text-center space-y-6" style={{ backgroundColor: colors.bg }}>
        <div className="w-16 h-16 border-4 rounded-full animate-spin" style={{ borderColor: `${colors.primary}33`, borderTopColor: colors.primary }}></div>
        <h2 className="text-2xl font-serif font-bold" style={{ color: colors.primary }}>Consulting the Universe</h2>
        <p className="max-w-xs italic" style={{ color: colors.textDim }}>Crafting your custom path to peak vitality and mental clarity. Please stay centered.</p>
      </div>
    );
  }

  if (!profile || !plan) {
    return <Onboarding onComplete={handleOnboardingComplete} theme={theme} />;
  }

  return (
    <HashRouter>
      <Layout progress={dailyProgress} theme={theme} onToggleTheme={toggleTheme}>
        <Routes>
          <Route path="/" element={
            <Dashboard 
              profile={profile} 
              stats={stats} 
              theme={theme}
              onUpdateStats={(s) => setStats(prev => ({...prev, ...s}))} 
            />
          } />
          <Route path="/workout" element={
            <WorkoutView 
              schedule={plan.schedule} 
              theme={theme}
              onCompleteWorkout={() => setStats(prev => ({...prev, workoutCompleted: true}))} 
            />
          } />
          <Route path="/scanner" element={
            <ScannerView 
              theme={theme} 
              goals={profile.goals} 
            />
          } />
          <Route path="/nutrition" element={
            <NutritionView 
              recommendations={plan.meals} 
              theme={theme}
              dietaryRestrictions={profile.dietaryRestrictions} 
            />
          } />
          <Route path="/mindfulness" element={
            <MindfulnessView 
              prompts={plan.journalPrompts} 
              entries={journalEntries}
              theme={theme}
              onAddEntry={(entry) => {
                setJournalEntries(prev => [...prev, entry]);
                setStats(prev => ({...prev, journalCompleted: true}));
              }}
              onAddMeditation={(mins) => {
                setStats(prev => ({...prev, meditationMinutes: prev.meditationMinutes + mins}));
              }}
            />
          } />
          <Route path="/support" element={<SupportView theme={theme} />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Layout>
    </HashRouter>
  );
};

export default App;
