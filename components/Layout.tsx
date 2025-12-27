
import React from 'react';
import { NavLink } from 'react-router-dom';
import { ICONS, THEMES } from '../constants';
import { Theme } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  progress: number;
  theme: Theme;
  onToggleTheme: () => void;
}

export const Layout: React.FC<LayoutProps> = ({ children, progress, theme, onToggleTheme }) => {
  const colors = THEMES[theme];

  return (
    <div className="max-w-md mx-auto min-h-screen flex flex-col relative overflow-hidden transition-colors duration-500" style={{ backgroundColor: colors.bg }}>
      {/* Top Header */}
      <header className="p-6 flex justify-between items-center backdrop-blur-md sticky top-0 z-50 border-b transition-colors" style={{ backgroundColor: `${colors.bg}CC`, borderColor: colors.border }}>
        <div>
          <h1 className="text-2xl font-serif font-bold transition-colors" style={{ color: colors.primary }}>HigherSelf</h1>
          <p className="text-[10px] font-medium tracking-widest uppercase transition-colors" style={{ color: colors.textDim }}>Wellness Sanctuary</p>
        </div>
        
        <div className="flex items-center gap-4">
          <button 
            onClick={onToggleTheme}
            className="p-2 rounded-full transition-all active:scale-90"
            style={{ backgroundColor: colors.surface, border: `1px solid ${colors.border}`, color: colors.primary }}
          >
            {theme === 'light' ? (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 9H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
            )}
          </button>

          <div className="relative w-12 h-12 flex items-center justify-center">
            <svg className="w-full h-full -rotate-90">
              <circle
                cx="24"
                cy="24"
                r="20"
                stroke={colors.accent}
                strokeWidth="4"
                fill="transparent"
              />
              <circle
                cx="24"
                cy="24"
                r="20"
                stroke={colors.primary}
                strokeWidth="4"
                fill="transparent"
                strokeDasharray={125.6}
                strokeDashoffset={125.6 - (125.6 * progress) / 100}
                className="transition-all duration-1000 ease-out"
              />
            </svg>
            <span className="absolute text-[10px] font-bold" style={{ color: colors.primary }}>{Math.round(progress)}%</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 pb-32 px-4 custom-scrollbar overflow-y-auto">
        {children}
      </main>

      {/* Navigation */}
      <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[96%] max-w-[420px] backdrop-blur-xl border rounded-[2.5rem] p-2 flex justify-around items-center shadow-2xl z-50 transition-all duration-300" style={{ backgroundColor: colors.navBg, borderColor: colors.border }}>
        <NavLink 
          to="/" 
          className={({ isActive }) => `p-2.5 rounded-2xl transition-all ${isActive ? 'shadow-md' : 'opacity-40'}`}
          style={({ isActive }) => ({
            backgroundColor: isActive ? colors.primary : 'transparent',
            color: isActive ? (theme === 'dark' ? '#000000' : '#FFFFFF') : colors.text
          })}
        >
          {ICONS.steps}
        </NavLink>
        <NavLink 
          to="/workout" 
          className={({ isActive }) => `p-2.5 rounded-2xl transition-all ${isActive ? 'shadow-md' : 'opacity-40'}`}
          style={({ isActive }) => ({
            backgroundColor: isActive ? colors.primary : 'transparent',
            color: isActive ? (theme === 'dark' ? '#000000' : '#FFFFFF') : colors.text
          })}
        >
          {ICONS.workout}
        </NavLink>
        <NavLink 
          to="/scanner" 
          className={({ isActive }) => `p-2.5 rounded-2xl transition-all ${isActive ? 'shadow-md' : 'opacity-40'}`}
          style={({ isActive }) => ({
            backgroundColor: isActive ? colors.primary : 'transparent',
            color: isActive ? (theme === 'dark' ? '#000000' : '#FFFFFF') : colors.text
          })}
        >
          {ICONS.scanner}
        </NavLink>
        <NavLink 
          to="/nutrition" 
          className={({ isActive }) => `p-2.5 rounded-2xl transition-all ${isActive ? 'shadow-md' : 'opacity-40'}`}
          style={({ isActive }) => ({
            backgroundColor: isActive ? colors.primary : 'transparent',
            color: isActive ? (theme === 'dark' ? '#000000' : '#FFFFFF') : colors.text
          })}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
          </svg>
        </NavLink>
        <NavLink 
          to="/mindfulness" 
          className={({ isActive }) => `p-2.5 rounded-2xl transition-all ${isActive ? 'shadow-md' : 'opacity-40'}`}
          style={({ isActive }) => ({
            backgroundColor: isActive ? colors.primary : 'transparent',
            color: isActive ? (theme === 'dark' ? '#000000' : '#FFFFFF') : colors.text
          })}
        >
          {ICONS.mindfulness}
        </NavLink>
        <NavLink 
          to="/support" 
          className={({ isActive }) => `p-2.5 rounded-2xl transition-all ${isActive ? 'shadow-md' : 'opacity-40'}`}
          style={({ isActive }) => ({
            backgroundColor: isActive ? colors.primary : 'transparent',
            color: isActive ? (theme === 'dark' ? '#000000' : '#FFFFFF') : colors.text
          })}
        >
          {ICONS.support}
        </NavLink>
      </nav>
    </div>
  );
};
