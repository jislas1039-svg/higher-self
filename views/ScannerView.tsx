
import React, { useState, useRef, useEffect } from 'react';
import { Theme } from '../types';
import { THEMES } from '../constants';
import { analyzeFoodImage } from '../geminiService';

interface ScannerViewProps {
  theme: Theme;
  goals: string[];
}

export const ScannerView: React.FC<ScannerViewProps> = ({ theme, goals }) => {
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<any>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const colors = THEMES[theme];

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } 
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setIsCameraActive(true);
      }
    } catch (err) {
      console.error("Error accessing camera:", err);
      alert("Camera access is needed to scan items.");
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
      tracks.forEach(track => track.stop());
      setIsCameraActive(false);
    }
  };

  const captureAndAnalyze = async () => {
    if (!canvasRef.current || !videoRef.current) return;
    
    const context = canvasRef.current.getContext('2d');
    if (!context) return;

    canvasRef.current.width = videoRef.current.videoWidth;
    canvasRef.current.height = videoRef.current.videoHeight;
    context.drawImage(videoRef.current, 0, 0);
    
    const base64Image = canvasRef.current.toDataURL('image/jpeg', 0.8);
    
    stopCamera();
    setIsAnalyzing(true);
    
    const result = await analyzeFoodImage(base64Image, goals);
    setAnalysisResult(result);
    setIsAnalyzing(false);
  };

  const getRatingColor = (rating: string) => {
    if (rating === 'green') return '#10B981';
    if (rating === 'yellow') return '#FBBF24';
    if (rating === 'red') return '#EF4444';
    return colors.primary;
  };

  return (
    <div className="space-y-6 py-4 animate-fadeIn">
      <header className="space-y-1 px-2">
        <h2 className="text-2xl font-serif font-bold" style={{ color: colors.primary }}>Aura Scan</h2>
        <p className="text-sm" style={{ color: colors.textDim }}>Identify alignment with your vessel.</p>
      </header>

      {!isCameraActive && !analysisResult && !isAnalyzing && (
        <section className="p-8 text-center rounded-[2.5rem] border shadow-sm transition-all bg-opacity-50" 
          style={{ backgroundColor: colors.surface, borderColor: colors.border }}>
          <div className="w-16 h-16 rounded-full mx-auto mb-6 flex items-center justify-center transition-all" 
            style={{ backgroundColor: colors.accent, color: colors.primary }}>
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-serif font-bold mb-2" style={{ color: colors.text }}>Ingredient Decoder</h3>
          <p className="text-xs mb-8 opacity-70 leading-relaxed px-4" style={{ color: colors.text }}>
            Scan protein shakes, snacks, or labels. I will analyze macros and inflammatory potential to ensure they help you bulk and thrive.
          </p>
          <button 
            onClick={startCamera}
            className="w-full py-4 rounded-[2rem] font-bold shadow-xl transition-all active:scale-95"
            style={{ backgroundColor: colors.primary, color: theme === 'dark' ? '#000000' : '#FFFFFF' }}
          >
            Start Scanner
          </button>
        </section>
      )}

      {isCameraActive && (
        <div className="relative rounded-[2.5rem] overflow-hidden border shadow-2xl animate-fadeIn" style={{ borderColor: colors.primary }}>
          <video ref={videoRef} autoPlay playsInline className="w-full aspect-[3/4] object-cover" />
          <div className="absolute inset-0 flex flex-col justify-between p-8">
            <div className="flex justify-end">
              <button onClick={stopCamera} className="p-2 bg-black/50 text-white rounded-full">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-48 h-48 border-2 border-white/50 border-dashed rounded-3xl mb-8 flex items-center justify-center">
                <p className="text-[10px] text-white/50 uppercase tracking-widest font-bold">Center Item</p>
              </div>
              <button 
                onClick={captureAndAnalyze}
                className="w-20 h-20 rounded-full bg-white/20 border-4 border-white flex items-center justify-center active:scale-90 transition-all shadow-2xl backdrop-blur-md"
              >
                <div className="w-14 h-14 rounded-full bg-white"></div>
              </button>
            </div>
          </div>
          <canvas ref={canvasRef} className="hidden" />
        </div>
      )}

      {isAnalyzing && (
        <div className="p-12 text-center space-y-6 animate-pulse">
          <div className="w-16 h-16 border-4 rounded-full mx-auto border-t-transparent animate-spin" 
            style={{ borderColor: colors.primary, borderTopColor: 'transparent' }}></div>
          <p className="font-serif italic text-xl" style={{ color: colors.primary }}>Consulting the archives...</p>
          <p className="text-[10px] font-bold uppercase tracking-widest opacity-50">Decoding molecular alignment</p>
        </div>
      )}

      {analysisResult && (
        <div className="animate-fadeIn space-y-4">
          <section className="p-6 rounded-[2.5rem] border shadow-sm relative overflow-hidden transition-all" 
            style={{ backgroundColor: colors.surface, borderColor: colors.border }}>
            
            <div className="flex justify-between items-start mb-6">
              <div>
                <h3 className="text-2xl font-serif font-bold" style={{ color: colors.text }}>{analysisResult.itemName}</h3>
                <div className="mt-2 flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full shadow-sm" style={{ backgroundColor: getRatingColor(analysisResult.rating) }}></div>
                  <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: getRatingColor(analysisResult.rating) }}>
                    {analysisResult.rating === 'green' ? 'Healing Alignment' : analysisResult.rating === 'yellow' ? 'Moderate Choice' : 'Inflammatory Alert'}
                  </span>
                </div>
              </div>
              <button 
                onClick={() => setAnalysisResult(null)}
                className="opacity-30 hover:opacity-100 p-2"
                style={{ color: colors.text }}
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>

            <div className="grid grid-cols-4 gap-2 mb-6">
              {[
                { l: 'Cal', v: analysisResult.macros.calories },
                { l: 'Pro', v: analysisResult.macros.protein },
                { l: 'Carb', v: analysisResult.macros.carbs },
                { l: 'Fat', v: analysisResult.macros.fat }
              ].map((m, i) => (
                <div key={i} className="p-3 rounded-2xl text-center" style={{ backgroundColor: colors.bg }}>
                  <p className="text-[8px] uppercase font-bold opacity-50 mb-1" style={{ color: colors.text }}>{m.l}</p>
                  <p className="text-xs font-bold" style={{ color: colors.primary }}>{m.v}</p>
                </div>
              ))}
            </div>

            <div className="space-y-4">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest mb-3" style={{ color: colors.primary }}>Ingredient Analysis</p>
                <div className="flex flex-wrap gap-2">
                  {analysisResult.ingredientsAnalysis.map((ing: string, i: number) => (
                    <span key={i} className="px-4 py-2 rounded-xl text-[10px] border font-medium" 
                      style={{ backgroundColor: colors.bg, borderColor: colors.border, color: colors.text }}>
                      {ing}
                    </span>
                  ))}
                </div>
              </div>

              <div className="p-6 rounded-3xl border italic leading-relaxed" 
                style={{ backgroundColor: `${getRatingColor(analysisResult.rating)}11`, borderColor: `${getRatingColor(analysisResult.rating)}33` }}>
                <p className="text-sm" style={{ color: colors.text }}>"{analysisResult.verdict}"</p>
              </div>
            </div>
          </section>

          <button 
            onClick={() => { setAnalysisResult(null); startCamera(); }}
            className="w-full py-4 rounded-[2rem] font-bold border-2 transition-all active:scale-95"
            style={{ borderColor: colors.primary, color: colors.primary }}
          >
            Scan Another
          </button>
        </div>
      )}
      <div className="h-10" />
    </div>
  );
};
