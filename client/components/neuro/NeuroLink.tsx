"use client";
import React, { useState, Suspense, useRef } from "react";
import { GlassPanel } from "@/components/ui/GlassPanel";
import Spline from '@splinetool/react-spline';

export function NeuroLink() {
  const [code, setCode] = useState("");
  const [image, setImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [resultCode, setResultCode] = useState<string | null>(null);
  const [metrics, setResultMetrics] = useState({ score: 0, visual: 0, prefrontal: 0 });
  
  const splineRef = useRef<any>(null);

  function onLoad(splineApp: any) {
    splineRef.current = splineApp;
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setImage(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const triggerSynapse = async () => {
    setIsProcessing(true);
    setResultCode(null);
    setResultMetrics({ score: 0, visual: 0, prefrontal: 0 });

    setTimeout(() => {
      const dummyData = {
        original_score: 84,
        brain_regions: { visual_cortex: 1, prefrontal: 0.2 },
        clean_code: `export default function OptimizedUI() {\n  return (\n    <div className="flex flex-col items-center justify-center p-8 bg-black border border-white/10 rounded-3xl">\n      <h1 className="text-2xl font-bold tracking-tight text-white uppercase">Neural Safe Design</h1>\n      <p className="text-sm opacity-40 uppercase tracking-widest mt-4">Friction: 0.00</p>\n    </div>\n  );\n}`
      };

      if (splineRef.current) {
        splineRef.current.setVariable('Visual_Intensity', dummyData.brain_regions.visual_cortex * 100);
        splineRef.current.setVariable('Prefrontal_Intensity', dummyData.brain_regions.prefrontal * 100);
      }

      setResultMetrics({
        score: dummyData.original_score,
        visual: dummyData.brain_regions.visual_cortex,
        prefrontal: dummyData.brain_regions.prefrontal
      });
      setResultCode(dummyData.clean_code);
      setIsProcessing(false);
    }, 2500);
  };

  return (
    <div className="flex-1 flex relative w-full max-w-[1700px] mx-auto overflow-hidden">
      
      <div className={`absolute inset-0 z-0 flex items-center justify-center pointer-events-auto mt-[-150px] transition-all duration-1000 ${metrics.score > 0 ? 'grayscale-0 brightness-100' : 'grayscale brightness-50'}`}>
        <div className="w-full h-full max-w-[1000px] max-h-[800px] relative pointer-events-auto">
          <Suspense fallback={null}>
            <Spline 
              onLoad={onLoad}
              scene="https://prod.spline.design/XlRHLmY1xGd1Sbnx/scene.splinecode" 
              className="w-full h-full scale-[0.9] transform"
            />
          </Suspense>
          <div className="absolute bottom-[-20px] right-10 w-32 h-40 bg-[#030303] z-50 pointer-events-none" />
        </div>
      </div>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-[380px_1fr_380px] gap-8 px-12 py-12 relative z-10 w-full h-full pointer-events-none text-white font-rostex font-bold uppercase">
        
        <div className="flex flex-col gap-6 h-full pointer-events-auto">
          <GlassPanel className="h-[240px] rounded-[2rem] flex flex-col gap-4 p-6 bg-white/[0.03] border-white/10 hover:border-white/20 transition-all text-white">
            <div className="flex justify-between items-center opacity-40 text-[9px] tracking-widest font-mono">
              <span>Design</span>
            </div>
            <div className="flex-1 border border-dashed border-white/10 rounded-2xl flex items-center justify-center relative overflow-hidden bg-black/40">
              {image ? (
                <img src={image} alt="Input" className="w-full h-full object-cover" />
              ) : (
                <label className="cursor-pointer flex flex-col items-center gap-2">
                  <span className="text-[10px] uppercase tracking-widest opacity-20 hover:opacity-40 transition-opacity">+ Screenshot</span>
                  <input type="file" className="hidden" onChange={handleImageUpload} accept="image/*" />
                </label>
              )}
            </div>
          </GlassPanel>

          <GlassPanel className="flex-1 rounded-[2rem] flex flex-col gap-4 p-6 bg-white/[0.03] border-white/10 hover:border-white/20 transition-all text-white">
            <div className="flex justify-between items-center opacity-40 text-[9px] tracking-widest font-mono">
              <span>Source</span>
            </div>
            <textarea 
              className="flex-1 bg-transparent border-none p-0 text-[11px] font-mono focus:outline-none resize-none placeholder-white/10 text-white/60 leading-relaxed scrollbar-hide"
              placeholder="Paste JSX..."
              value={code}
              onChange={(e) => setCode(e.target.value)}
            />
            <button 
              onClick={triggerSynapse}
              className="pill bg-white text-black font-bold text-[10px] uppercase tracking-widest hover:opacity-90 transition-all w-full py-4 shadow-2xl disabled:opacity-50"
              disabled={isProcessing}
            >
              {isProcessing ? "Analyzing..." : "Fix Design"}
            </button>
          </GlassPanel>
        </div>

        <div className="flex items-end justify-center pb-12 pointer-events-none text-white">
          <div className="flex flex-col gap-3 w-full max-w-[200px] opacity-20">
            <div className="flex justify-between text-[8px] uppercase tracking-widest font-mono">
              <span>Low</span>
              <span>High</span>
            </div>
            <div className="h-[2px] w-full bg-white/10 rounded-full overflow-hidden">
              <div className={`h-full bg-white/40 transition-all duration-1000 ${isProcessing ? 'w-[95%]' : metrics.score > 0 ? `w-[${metrics.score}%]` : 'w-[10%]'}`} />
            </div>
            <p className="text-center text-[8px] uppercase tracking-[0.4em]">Activity</p>
          </div>
        </div>

        <div className="flex flex-col h-full pointer-events-auto">
          <GlassPanel className="flex-1 rounded-[2.5rem] bg-white/[0.03] border-white/10 p-8 flex flex-col gap-6 text-white">
            <div className="flex justify-between items-center opacity-40 text-[9px] uppercase tracking-widest font-mono">
              <span>Result</span>
            </div>
            <div className="flex-1 flex flex-col items-start border border-white/5 rounded-3xl bg-black/40 p-6 relative overflow-hidden">
               {resultCode ? (
                 <pre className="text-[10px] font-mono text-white/80 whitespace-pre-wrap leading-relaxed overflow-auto scrollbar-hide h-full w-full">
                   <code>{resultCode}</code>
                 </pre>
               ) : (
                 <div className="w-full h-full flex items-center justify-center text-white">
                   <p className="text-[10px] uppercase tracking-[0.5em] opacity-20 font-mono text-center font-bold leading-loose">
                     {isProcessing ? "Syncing..." : "Ready"}
                   </p>
                 </div>
               )}
            </div>
            <div className="pt-4 border-t border-white/5 flex flex-col gap-4 opacity-20 text-[8px] uppercase tracking-widest font-mono font-bold text-white">
               <div className="flex justify-between">
                 <span>Status</span>
                 <span>{isProcessing ? "Processing" : metrics.score > 0 ? "Processed" : "Ready"}</span>
               </div>
               <div className="flex justify-between">
                 <span>Score</span>
                 <span>{metrics.score > 0 ? metrics.score : "0"}</span>
               </div>
            </div>
          </GlassPanel>
        </div>

      </div>
    </div>
  );
}
