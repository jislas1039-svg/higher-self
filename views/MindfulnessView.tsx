
import React, { useState, useRef, useEffect } from 'react';
import { JournalEntry, Theme } from '../types';
import { AUDIO_TRACKS, FREQUENCY_MODES, THEMES } from '../constants';
import { generateIntimatePrompts } from '../geminiService';

interface MindfulnessViewProps {
  prompts: string[];
  entries: JournalEntry[];
  onAddEntry: (entry: JournalEntry) => void;
  onAddMeditation: (mins: number) => void;
  theme: Theme;
}

export const MindfulnessView: React.FC<MindfulnessViewProps> = ({ prompts: initialPrompts, entries, onAddEntry, onAddMeditation, theme }) => {
  const [activePrompts, setActivePrompts] = useState<string[]>(initialPrompts);
  const [isJournaling, setIsJournaling] = useState(false);
  const [showQuiz, setShowQuiz] = useState(false);
  const [quizStep, setQuizStep] = useState(0);
  const [quizResponses, setQuizResponses] = useState({
    embarrassment: '',
    friendships: '',
    love: '',
    fitnessMotivation: '',
    introversion: ''
  });
  const [isCalibrating, setIsCalibrating] = useState(false);
  const [currentPromptIdx, setCurrentPromptIdx] = useState(0);
  const [content, setContent] = useState('');
  const [showArchive, setShowArchive] = useState(false);
  
  const [playingTrackId, setPlayingTrackId] = useState<string | null>(null);
  const [isFrequencyActive, setIsFrequencyActive] = useState(false);
  const [activeFreq, setActiveFreq] = useState<number | null>(null);
  
  const colors = THEMES[theme];

  // Audio Context for Internal Healing
  const audioCtxRef = useRef<AudioContext | null>(null);
  const oscillatorRef = useRef<OscillatorNode | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);

  useEffect(() => {
    return () => {
      stopFrequency();
    };
  }, []);

  const startFrequency = (freq: number) => {
    stopFrequency();
    setPlayingTrackId(null);
    
    if (!audioCtxRef.current) {
      audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    
    const ctx = audioCtxRef.current;
    
    // Resume context if suspended by browser
    if (ctx.state === 'suspended') {
      ctx.resume();
    }

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, ctx.currentTime);
    
    gain.gain.setValueAtTime(0, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.08, ctx.currentTime + 3); // Slow gentle fade in
    
    osc.connect(gain);
    gain.connect(ctx.destination);
    
    // Oscillators play indefinitely until stop() is called
    osc.start();
    oscillatorRef.current = osc;
    gainNodeRef.current = gain;
    setActiveFreq(freq);
    setIsFrequencyActive(true);
  };

  const stopFrequency = () => {
    if (gainNodeRef.current && audioCtxRef.current) {
      const ctx = audioCtxRef.current;
      gainNodeRef.current.gain.linearRampToValueAtTime(0, ctx.currentTime + 1.5); // Smoother fade out
      setTimeout(() => {
        oscillatorRef.current?.stop();
        oscillatorRef.current?.disconnect();
        gainNodeRef.current?.disconnect();
        oscillatorRef.current = null;
        gainNodeRef.current = null;
      }, 1500);
    }
    setIsFrequencyActive(false);
    setActiveFreq(null);
  };

  const startJournalingJourney = () => {
    setShowQuiz(true);
    setQuizStep(0);
  };

  const handleQuizNext = () => {
    if (quizStep < 4) {
      setQuizStep(prev => prev + 1);
    } else {
      handleQuizSubmit();
    }
  };

  const handleQuizSubmit = async () => {
    setIsCalibrating(true);
    const deeperPrompts = await generateIntimatePrompts(quizResponses);
    if (deeperPrompts && deeperPrompts.length > 0) {
      setActivePrompts(deeperPrompts);
      setCurrentPromptIdx(0);
    }
    setIsCalibrating(false);
    setShowQuiz(false);
    setIsJournaling(true);
  };

  const handleSubmitJournal = () => {
    onAddEntry({
      id: Date.now().toString(),
      date: new Date().toLocaleDateString(),
      prompt: activePrompts[currentPromptIdx],
      content,
      mood: 5,
      isCheckIn: false
    });
    setIsJournaling(false);
    setContent('');
    setCurrentPromptIdx((currentPromptIdx + 1) % activePrompts.length);
  };

  const quizQuestions = [
    {
      key: 'embarrassment',
      title: 'Public Resilience',
      q: 'How do you handle situations where someone tries to embarrass or mock you in public? Describe a real or hypothetical response.',
      placeholder: 'Describe your reaction and internal state...'
    },
    {
      key: 'friendships',
      title: 'Friendship Dynamics',
      q: 'How do you navigate your friendships and the complications that inevitably arise? What values guide your choice of companions?',
      placeholder: 'Reflect on your boundaries and connections...'
    },
    {
      key: 'love',
      title: 'The Frequency of Love',
      q: 'How do you truly feel about love? Do you desire a deep romantic connection in your life right now, or are you focusing elsewhere?',
      placeholder: 'Be honest about your heart\'s current state...'
    },
    {
      key: 'fitnessMotivation',
      title: 'The Core Driver',
      q: 'Beyond appearance, why are you truly pursuing these fitness goals? What is the deeper "why" that will keep you going forever?',
      placeholder: 'Connect with your underlying purpose...'
    },
    {
      key: 'introversion',
      title: 'Social Battery',
      q: 'Do you identify as more of an introvert or extrovert? How does this affect how you protect and recharge your energy?',
      placeholder: 'Explain how you interact with the world\'s noise...'
    }
  ];

  return (
    <div className="space-y-8 py-4 animate-fadeIn transition-colors duration-500">
      <header className="flex justify-between items-end px-2">
        <div className="space-y-1">
          <h2 className="text-2xl font-serif font-bold" style={{ color: colors.primary }}>The Inner Sanctuary</h2>
          <p className="text-sm" style={{ color: colors.textDim }}>Silence is where your truth speaks.</p>
        </div>
        <button 
          onClick={() => setShowArchive(!showArchive)}
          className="text-[10px] font-bold uppercase tracking-widest px-4 py-2 rounded-full transition-all border shadow-sm"
          style={{ backgroundColor: colors.surface, color: colors.primary, borderColor: colors.border }}
        >
          {showArchive ? 'Back' : 'Archive'}
        </button>
      </header>

      {showArchive ? (
        <section className="animate-fadeIn space-y-4">
          <h3 className="font-serif text-xl font-bold" style={{ color: colors.primary }}>Private Chronicles</h3>
          <p className="text-xs italic mb-6" style={{ color: colors.textDim }}>Only you hold the key to these reflections.</p>
          
          <div className="space-y-4">
            {entries.length === 0 ? (
              <p className="text-center py-12 text-sm opacity-40">Your book of shifts is empty. Begin your first ritual to see it grow.</p>
            ) : (
              entries.slice().reverse().map(e => (
                <div key={e.id} className="p-6 rounded-[2rem] border transition-all shadow-sm" style={{ backgroundColor: colors.surface, borderColor: colors.border }}>
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-[10px] font-bold uppercase tracking-widest opacity-50" style={{ color: colors.textDim }}>{e.date}</span>
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: colors.primary }}></div>
                  </div>
                  <p className="text-xs font-bold italic mb-3" style={{ color: colors.primary }}>"{e.prompt}"</p>
                  <p className="text-sm leading-relaxed" style={{ color: colors.text }}>{e.content}</p>
                </div>
              ))
            )}
          </div>
        </section>
      ) : (
        <>
          {/* Sound Healing Section */}
          <section className="rounded-[2.5rem] p-6 shadow-sm border overflow-hidden transition-all" style={{ backgroundColor: colors.surface, borderColor: colors.border }}>
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-serif font-bold" style={{ color: colors.text }}>Divine Audio</h3>
              <span className="text-[9px] font-bold uppercase tracking-widest px-3 py-1 rounded-full shadow-inner" style={{ backgroundColor: colors.bg, color: colors.textDim }}>Healing Waves</span>
            </div>

            {/* AI Frequency Generator */}
            <div className="mb-8 p-6 rounded-[2rem] border transition-all relative overflow-hidden" style={{ backgroundColor: colors.bg, borderColor: colors.border }}>
              {isFrequencyActive && (
                <div className="absolute inset-0 opacity-10 pointer-events-none">
                  <div className="absolute inset-0 animate-pulse bg-gradient-to-r from-transparent via-current to-transparent" style={{ color: colors.primary }}></div>
                </div>
              )}
              
              <div className="flex items-center gap-3 mb-6 relative z-10">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${isFrequencyActive ? 'animate-spin-slow' : ''}`} style={{ backgroundColor: colors.primary, color: theme === 'dark' ? '#000000' : '#FFFFFF' }}>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                </div>
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-widest" style={{ color: colors.primary }}>AI Frequencies</p>
                  <p className="text-[9px] uppercase tracking-tighter opacity-60" style={{ color: colors.textDim }}>Infinite resonance field</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 gap-3 relative z-10">
                {FREQUENCY_MODES.map((mode) => (
                  <button
                    key={mode.freq}
                    onClick={() => activeFreq === mode.freq ? stopFrequency() : startFrequency(mode.freq)}
                    className={`flex items-center justify-between p-4 rounded-2xl transition-all border font-bold shadow-sm active:scale-95`}
                    style={{ 
                      backgroundColor: activeFreq === mode.freq ? colors.primary : colors.surface,
                      borderColor: activeFreq === mode.freq ? colors.primary : colors.border,
                      color: activeFreq === mode.freq ? (theme === 'dark' ? '#000000' : '#FFFFFF') : colors.text
                    }}
                  >
                    <div className="text-left">
                      <p className="text-[10px] uppercase tracking-wider">{mode.name}</p>
                      <p className="text-[8px] opacity-60 uppercase tracking-widest">{mode.type} • {mode.freq}Hz</p>
                    </div>
                    {activeFreq === mode.freq ? (
                      <div className="flex gap-1 items-end h-5">
                        <div className="w-1 h-3 animate-[bounce_0.6s_infinite]" style={{ backgroundColor: theme === 'dark' ? '#000000' : '#FFFFFF' }}></div>
                        <div className="w-1 h-5 animate-[bounce_0.8s_infinite_0.1s]" style={{ backgroundColor: theme === 'dark' ? '#000000' : '#FFFFFF' }}></div>
                        <div className="w-1 h-4 animate-[bounce_0.7s_infinite_0.2s]" style={{ backgroundColor: theme === 'dark' ? '#000000' : '#FFFFFF' }}></div>
                      </div>
                    ) : (
                      <div className="w-8 h-8 rounded-full flex items-center justify-center bg-black/5 opacity-40">
                         <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" /></svg>
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* YouTube Section with Thumbnails */}
            <div className="space-y-6">
              <div className="px-1">
                <p className="text-[10px] font-bold uppercase tracking-widest mb-1" style={{ color: colors.primary }}>Atmospheric Healing</p>
                <p className="text-[9px] opacity-50 uppercase tracking-tighter" style={{ color: colors.textDim }}>Cinematic soundscapes for deep focus</p>
              </div>

              {playingTrackId && (
                <div className="mb-6 aspect-video rounded-3xl overflow-hidden shadow-2xl border bg-black animate-fadeIn relative ring-4 ring-offset-4 ring-offset-transparent" style={{ ringColor: `${colors.primary}33`, borderColor: colors.primary }}>
                  <iframe
                    width="100%"
                    height="100%"
                    src={`https://www.youtube.com/embed/${playingTrackId}?autoplay=1`}
                    title="YouTube video player"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                  ></iframe>
                  <button 
                    onClick={() => setPlayingTrackId(null)}
                    className="absolute top-4 right-4 bg-black/60 text-white p-2 rounded-full hover:bg-black backdrop-blur-md transition-all active:scale-90"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                  </button>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                {AUDIO_TRACKS.map(track => (
                  <button 
                    key={track.id} 
                    onClick={() => {
                      stopFrequency();
                      setPlayingTrackId(playingTrackId === track.id ? null : track.id);
                    }}
                    className={`group flex flex-col rounded-[2rem] overflow-hidden transition-all border text-left font-bold shadow-sm hover:shadow-md active:scale-95`}
                    style={{ 
                      backgroundColor: colors.surface,
                      borderColor: playingTrackId === track.id ? colors.primary : colors.border,
                    }}
                  >
                    <div className="relative aspect-video w-full overflow-hidden">
                       <img 
                        src={`https://img.youtube.com/vi/${track.id}/hqdefault.jpg`} 
                        alt={track.title}
                        className={`w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 ${playingTrackId === track.id ? 'brightness-50' : 'brightness-90'}`}
                       />
                       <div className="absolute inset-0 flex items-center justify-center">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center backdrop-blur-md border border-white/30 transition-all ${playingTrackId === track.id ? 'scale-110 bg-white/20' : 'bg-black/20 group-hover:scale-110'}`}>
                             {playingTrackId === track.id ? (
                               <div className="flex gap-1 items-end h-3">
                                 <div className="w-0.5 h-2 bg-white animate-bounce"></div>
                                 <div className="w-0.5 h-3 bg-white animate-bounce [animation-delay:0.2s]"></div>
                                 <div className="w-0.5 h-2 bg-white animate-bounce [animation-delay:0.4s]"></div>
                               </div>
                             ) : (
                               <svg className="w-4 h-4 text-white fill-current ml-0.5" viewBox="0 0 20 20"><path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.333-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" /></svg>
                             )}
                          </div>
                       </div>
                    </div>
                    <div className="p-4">
                       <p className="text-[10px] uppercase tracking-tighter truncate w-full" style={{ color: colors.text }}>{track.title}</p>
                       <div className="flex justify-between items-center mt-2">
                          <span className="text-[8px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full" style={{ backgroundColor: colors.bg, color: colors.textDim }}>{track.type}</span>
                          <p className="text-[8px] opacity-40 uppercase tracking-widest">{track.duration}</p>
                       </div>
                    </div>
                  </button>
                ))}
              </div>

              {(playingTrackId || isFrequencyActive) && (
                <button 
                  onClick={() => { onAddMeditation(10); alert("Devotion logged. Your aura is bright.")}}
                  className="w-full mt-4 py-4 rounded-3xl text-[10px] font-bold uppercase tracking-widest transition-all shadow-xl active:scale-95 hover:brightness-105"
                  style={{ backgroundColor: colors.accent, color: colors.primary }}
                >
                  Log Session Complete
                </button>
              )}
            </div>
          </section>

          {/* Journaling Section with Quiz */}
          <section className="rounded-[2.5rem] p-8 border relative overflow-hidden transition-all shadow-xl min-h-[420px] flex flex-col justify-center" 
            style={{ 
              backgroundColor: theme === 'dark' ? '#1A1A1A' : colors.accent, 
              borderColor: theme === 'dark' ? colors.primary : colors.border,
              color: colors.text
            }}>
            {showQuiz ? (
              <div className="space-y-6 animate-fadeIn">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-[10px] font-bold uppercase tracking-widest opacity-50">Intimate Assessment • {quizStep + 1}/5</span>
                  <div className="flex gap-1">
                    {[0,1,2,3,4].map(s => (
                      <div key={s} className="w-4 h-1 rounded-full transition-all" style={{ backgroundColor: s <= quizStep ? colors.primary : colors.surface }}></div>
                    ))}
                  </div>
                </div>
                
                <h4 className="text-xl font-serif font-bold text-center" style={{ color: colors.primary }}>{quizQuestions[quizStep].title}</h4>
                <p className="text-xs text-center italic opacity-80 mb-4 px-2">{quizQuestions[quizStep].q}</p>
                
                <textarea 
                  value={(quizResponses as any)[quizQuestions[quizStep].key]}
                  onChange={(e) => setQuizResponses({...quizResponses, [quizQuestions[quizStep].key]: e.target.value})}
                  className="w-full h-32 border-none rounded-3xl p-6 outline-none text-sm shadow-inner transition-all resize-none"
                  style={{ backgroundColor: colors.surface, color: colors.text }}
                  placeholder={quizQuestions[quizStep].placeholder}
                />
                
                <button 
                  onClick={handleQuizNext}
                  disabled={!(quizResponses as any)[quizQuestions[quizStep].key].trim()}
                  className="w-full py-4 rounded-2xl font-bold shadow-xl transition-all active:scale-95 disabled:opacity-30"
                  style={{ backgroundColor: colors.primary, color: theme === 'dark' ? '#000000' : '#FFFFFF' }}
                >
                  {quizStep === 4 ? 'Calibrate My Higher Self' : 'Continue Deepening'}
                </button>
              </div>
            ) : isCalibrating ? (
              <div className="text-center py-12 space-y-4 animate-pulse">
                <div className="w-12 h-12 border-4 rounded-full mx-auto border-t-transparent animate-spin" style={{ borderColor: colors.primary, borderTopColor: 'transparent' }}></div>
                <p className="font-serif italic text-lg" style={{ color: colors.primary }}>Calibrating your frequency...</p>
                <p className="text-[10px] font-bold uppercase tracking-widest opacity-50">Unlocking Deeper Truths</p>
              </div>
            ) : isJournaling ? (
              <div className="space-y-4 animate-fadeIn">
                 <div className="flex justify-between items-center px-1">
                    <p className="text-[10px] font-bold uppercase tracking-widest opacity-60">Personalized Reflection</p>
                    <button onClick={() => setIsJournaling(false)} className="text-[10px] font-bold uppercase opacity-40 hover:opacity-100 transition-opacity">Cancel</button>
                 </div>
                 <h4 className="font-serif italic text-lg leading-relaxed text-center" style={{ color: colors.primary }}>"{activePrompts[currentPromptIdx]}"</h4>
                 <textarea 
                   value={content}
                   onChange={(e) => setContent(e.target.value)}
                   className="w-full h-44 border-none rounded-3xl p-6 outline-none text-sm shadow-inner transition-all resize-none"
                   style={{ backgroundColor: colors.surface, color: colors.text }}
                   placeholder="Pour your soul here... everything is safe."
                 />
                 <button 
                   onClick={handleSubmitJournal}
                   className="w-full py-4 rounded-2xl font-bold shadow-lg transition-all active:scale-95"
                   style={{ backgroundColor: colors.primary, color: theme === 'dark' ? '#000000' : '#FFFFFF' }}
                 >
                   Seal Ritual
                 </button>
              </div>
            ) : (
              <div className="text-center py-4">
                <h4 className="font-serif text-3xl mb-4" style={{ color: colors.primary }}>Reflection</h4>
                <p className="text-xs mb-8 leading-relaxed px-6 italic opacity-70">The version of you that exists in the future is built upon the truths you tell yourself today. Take the quiz to generate intimate prompts.</p>
                <button 
                  onClick={startJournalingJourney}
                  className="px-10 py-5 rounded-[2.5rem] font-bold shadow-2xl transition-all active:scale-95 border border-white/20"
                  style={{ backgroundColor: colors.primary, color: theme === 'dark' ? '#000000' : '#FFFFFF' }}
                >
                  Consult My Higher Self
                </button>
                
                {entries.length > 0 && (
                  <div className="mt-12 text-left space-y-4 px-2">
                    <p className="text-[10px] font-bold uppercase tracking-widest opacity-70">Latest Chronicle</p>
                    {entries.slice(-1).map(e => (
                       <div key={e.id} className="p-5 rounded-[2.2rem] border shadow-sm relative overflow-hidden group transition-all" style={{ backgroundColor: colors.surface, borderColor: colors.border }}>
                          <p className="text-[9px] opacity-60 font-bold uppercase tracking-widest" style={{ color: colors.textDim }}>{e.date}</p>
                          <p className="text-xs font-medium line-clamp-2 mt-2 italic leading-relaxed" style={{ color: colors.text }}>{e.content}</p>
                       </div>
                    ))}
                    <button 
                      onClick={() => setShowArchive(true)}
                      className="w-full py-2 text-[10px] font-bold uppercase tracking-widest opacity-40 hover:opacity-100 transition-opacity"
                    >
                      View Full Archive
                    </button>
                  </div>
                )}
              </div>
            )}
          </section>

          {/* Manifestation Affirmation Section */}
          <section className="p-10 text-center rounded-[2.5rem] shadow-sm border italic transition-all relative overflow-hidden" style={{ backgroundColor: colors.surface, borderColor: colors.border, color: colors.text }}>
             <div className="absolute top-0 left-0 w-24 h-24 opacity-5" style={{ color: colors.primary }}>
               <svg fill="currentColor" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
             </div>
             <div className="w-10 h-10 rounded-full mx-auto mb-6 flex items-center justify-center shadow-inner transition-all" style={{ backgroundColor: colors.accent, color: colors.primary }}>
               <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" /></svg>
             </div>
             <p className="text-base leading-relaxed mb-6 opacity-80 px-2 font-serif italic">
               "I am not chasing a body. I am creating a vessel worthy of my spirit. Every step, every meal, and every thought is an act of creation."
             </p>
             <p className="text-[10px] font-bold uppercase tracking-widest opacity-40">— The Higher Self Legacy</p>
          </section>
        </>
      )}
      <div className="h-10" />
    </div>
  );
};
