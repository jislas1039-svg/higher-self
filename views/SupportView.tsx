
import React from 'react';
import { Theme } from '../types';
import { THEMES } from '../constants';

interface SupportViewProps {
  theme: Theme;
}

export const SupportView: React.FC<SupportViewProps> = ({ theme }) => {
  const colors = THEMES[theme];

  const ResourceCard = ({ title, desc, phone, textCode, colorClass }: { title: string, desc: string, phone: string, textCode?: string, colorClass: string }) => (
    <div className="p-6 rounded-[2rem] border transition-all mb-4 shadow-sm" style={{ backgroundColor: colors.surface, borderColor: colors.border }}>
      <h3 className="text-xl font-serif font-bold mb-2" style={{ color: colors.primary }}>{title}</h3>
      <p className="text-xs leading-relaxed mb-4 opacity-70" style={{ color: colors.text }}>{desc}</p>
      
      <div className="flex flex-col gap-3">
        <a 
          href={`tel:${phone.replace(/\D/g,'')}`}
          className="flex items-center justify-center gap-3 py-4 rounded-2xl font-bold text-sm transition-all active:scale-95 shadow-lg"
          style={{ backgroundColor: colors.primary, color: theme === 'dark' ? '#000000' : '#FFFFFF' }}
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 005.47 5.47l.773-1.548a1 1 0 011.06-.539l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" /></svg>
          Call {phone}
        </a>
        
        {textCode && (
          <div className="p-4 rounded-xl text-center text-[10px] font-bold uppercase tracking-widest border transition-all" style={{ backgroundColor: colors.bg, borderColor: colors.border, color: colors.textDim }}>
            Text "{textCode}" to {phone}
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="space-y-8 py-4 animate-fadeIn">
      <header className="space-y-2">
        <h2 className="text-2xl font-serif font-bold" style={{ color: colors.primary }}>The Support Sanctuary</h2>
        <p className="text-sm italic" style={{ color: colors.textDim }}>Your spirit is light. Your life is an infinite masterpiece.</p>
      </header>

      <section className="bg-[#E6DED5] p-8 rounded-[2.5rem] text-center mb-8 border border-[#DED4C9]" style={{ backgroundColor: theme === 'dark' ? '#1A1A1A' : colors.accent }}>
        <p className="text-sm font-serif italic leading-relaxed" style={{ color: colors.primary }}>
          "If you are feeling overwhelmed, remember that you do not have to walk this path alone. The strongest act of creation is reaching out for connection."
        </p>
      </section>

      <div className="space-y-6">
        <ResourceCard 
          title="Crisis & Suicide Prevention"
          desc="Immediate, 24/7 confidential support for people in distress, prevention and crisis resources for you or your loved ones."
          phone="988"
          textCode="HOME"
          colorClass="bg-[#5E6B5A]"
        />

        <ResourceCard 
          title="Eating Disorders Help"
          desc="Guidance and support for those struggling with eating disorders. Healing your relationship with food and your vessel."
          phone="1-800-931-2237"
          colorClass="bg-[#8B7D6B]"
        />

        <ResourceCard 
          title="Substance Recovery"
          desc="SAMHSA’s National Helpline for individuals and family members facing mental and/or substance use disorders."
          phone="1-800-662-4357"
          colorClass="bg-[#E6DED5]"
        />
      </div>

      <section className="p-8 text-center bg-white/50 rounded-[2.5rem] border border-white mt-8" style={{ backgroundColor: colors.surface }}>
        <p className="text-[10px] font-bold uppercase tracking-widest mb-2 opacity-40">International Support</p>
        <p className="text-xs" style={{ color: colors.textDim }}>
          Outside the US? Please visit <a href="https://findahelpline.com" target="_blank" className="underline font-bold" style={{ color: colors.primary }}>findahelpline.com</a> for global resources tailored to your location.
        </p>
      </section>

      <div className="h-20" /> {/* Spacer for nav */}
    </div>
  );
};
