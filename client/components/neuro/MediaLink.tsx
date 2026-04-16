"use client";

import { useState, useRef } from "react";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { motion } from "framer-motion";
import dynamic from "next/dynamic";

const SolidHeatmapBrain = dynamic(() => import("@/components/neuro/BrainModel").then(mod => mod.SolidHeatmapBrain), { ssr: false });
const HUDHeadModel = dynamic(() => import("@/components/neuro/BrainModel").then(mod => mod.HUDHeadModel), { ssr: false });

export function MediaLink() {
  const [media, setMedia] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [metrics, setResultMetrics] = useState({ 
    score: 0, 
    recall: 0, 
    saturation: 0,
    timeline: Array(20).fill(0) 
  });

  const handleMediaUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setMedia(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const clearMedia = () => {
    setMedia(null);
    setResultMetrics({ score: 0, recall: 0, saturation: 0, timeline: Array(20).fill(0) });
  };

  const triggerAnalysis = async () => {
    if (!media) return;
    setIsProcessing(true);
    setResultMetrics({ score: 0, recall: 0, saturation: 0, timeline: Array(20).fill(0) });

    try {
      await new Promise((resolve) => setTimeout(resolve, 3500));
      
      const score = Math.floor(Math.random() * (98 - 75 + 1) + 75);
      const recall = Math.floor(Math.random() * (95 - 60 + 1) + 60);
      const saturation = Math.floor(Math.random() * (80 - 40 + 1) + 40);
      const timeline = Array.from({ length: 20 }, () => Math.random() * 100);

      setResultMetrics({ score, recall, saturation, timeline });
    } catch (err) {
      console.warn("Analysis Failed");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row w-full max-w-[1800px] mx-auto gap-8 px-8 py-12 relative z-10 min-h-[85vh] font-rostex uppercase text-white overflow-hidden">
      
      {/* LEFT PANEL: The Naked Naked Solid BOLD Anatomy (65%) */}
      <div className="flex-1 lg:flex-[2.5] flex flex-col gap-6 relative">
        <GlassPanel className="flex-1 flex flex-col min-h-[600px] rounded-[2rem] bg-black/80 border border-white/20 relative overflow-hidden backdrop-blur-2xl">
          <div className="absolute top-6 left-6 z-20 flex items-center gap-4">
             <button className="px-4 py-2 rounded-full border border-white/40 text-xs font-smooch font-bold hover:bg-white hover:text-black transition-colors pointer-events-auto mix-blend-difference">Show Guide</button>
          </div>
          
          <div className="absolute top-6 right-6 z-20 flex flex-col items-end gap-1 opacity-80 mix-blend-difference">
             <span className="text-[10px] tracking-widest font-smooch font-bold">Low</span>
             <div className="w-32 h-[3px] rounded-full bg-gradient-to-r from-red-600 via-orange-500 to-yellow-300" />
             <span className="text-[10px] tracking-widest font-smooch font-bold w-full text-right">High</span>
             <span className="text-[10px] tracking-widest font-smooch opacity-50">BOLD Activity</span>
          </div>

          <div className="absolute inset-0 w-full h-full pointer-events-auto">
             <SolidHeatmapBrain isProcessing={isProcessing} metricsSync={metrics.score > 0} />
          </div>

          <div className="absolute bottom-6 left-6 z-20 flex gap-2 mix-blend-difference pointer-events-auto">
             <button className="px-6 py-2 rounded-xl bg-white/10 text-white border border-white/20 text-xs font-smooch font-bold hover:bg-white hover:text-black transition-colors">True</button>
             <button className="px-6 py-2 rounded-xl bg-white text-black border border-white text-xs font-smooch font-bold pointer-events-none">Predicted</button>
             <div className="w-4" />
             <button className="px-6 py-2 rounded-xl bg-white/10 text-white border border-white/20 text-xs font-smooch font-bold hover:bg-white hover:text-black transition-colors pointer-events-auto">Normal</button>
             <button className="px-6 py-2 rounded-xl bg-white/10 text-white border border-white/20 text-xs font-smooch font-bold hover:bg-white hover:text-black transition-colors pointer-events-auto">Open</button>
          </div>
        </GlassPanel>
      </div>

      {/* RIGHT PANEL: Media Target & Telemetry Data (35%) */}
      <div className="flex-1 lg:max-w-[500px] flex flex-col gap-6">
        
        {/* Media Dropzone Source Block */}
        <GlassPanel className="rounded-[2rem] bg-black/60 border border-white/20 p-6 flex flex-col relative overflow-hidden backdrop-blur-2xl">
           <div className="flex justify-between items-center opacity-90 text-sm tracking-widest font-smooch font-bold border-b border-white/20 pb-4 mb-4">
             <span>Simulation Target</span>
             {media && <button onClick={clearMedia} className="text-[10px] text-red-400 hover:text-red-300 transition-colors uppercase">Clear Media X</button>}
           </div>

           <div className="relative w-full h-[180px] bg-[#0a0a0a] rounded-xl overflow-hidden border border-white/10 group flex items-center justify-center pointer-events-auto">
             {media ? (
               <>
                 <img src={media} alt="Target" className={`w-full h-full object-cover transition-all duration-1000 ${isProcessing ? 'blur-md brightness-50' : 'brightness-100'}`} />
                 {isProcessing && (
                   <div className="absolute inset-0 flex items-center justify-center z-20 bg-black/40">
                      <span className="text-xs tracking-widest animate-pulse font-bold text-white font-smooch">EXTRACTING VECTORS...</span>
                   </div>
                 )}
               </>
             ) : (
               <label className="cursor-pointer flex flex-col items-center justify-center gap-4 w-full h-full hover:bg-white/5 transition-colors">
                 <div className="w-12 h-12 border-2 border-dashed border-white/40 rounded-full flex items-center justify-center group-hover:border-white transition-colors">
                   <span className="text-2xl transition-transform group-hover:scale-125">+</span>
                 </div>
                 <span className="text-[10px] tracking-widest opacity-60 group-hover:opacity-100 transition-opacity font-bold">Inject Media File</span>
                 <input type="file" className="hidden" onChange={handleMediaUpload} accept="image/*,video/*" />
               </label>
             )}
           </div>

           <button 
             onClick={triggerAnalysis}
             className="w-full py-4 mt-4 rounded-xl bg-white text-black font-bold text-xs uppercase tracking-widest hover:bg-white/90 active:scale-[0.98] transition-all shadow-lg disabled:opacity-50 disabled:active:scale-100"
             disabled={isProcessing || !media}
           >
             {isProcessing ? "PROCESSING..." : "ANALYZE MEDIA"}
           </button>
        </GlassPanel>

        {/* Global HUD Ghost Overlay Block */}
        <GlassPanel className="rounded-[2rem] bg-black/60 border border-white/20 relative overflow-hidden backdrop-blur-2xl h-[260px] flex flex-col p-6 group pointer-events-auto">
          <div className="absolute top-6 left-6 z-10 opacity-90 text-sm tracking-widest font-smooch font-bold pointer-events-none drop-shadow-md">Cortical Activation</div>
          
          <div className="absolute inset-0 w-full h-full pointer-events-none opacity-60 translate-x-[20%] scale-[1.2]">
             <HUDHeadModel />
          </div>

          <div className="flex-1" />

          <div className="absolute bottom-6 left-6 z-10 flex flex-col gap-1 pointer-events-none drop-shadow-[0_0_15px_rgba(255,255,255,0.8)]">
             <div className="flex items-baseline gap-2">
               <span className="text-[6rem] leading-none tracking-tighter text-white font-bold">{metrics.score > 0 ? metrics.score : "00"}</span>
               <span className="text-2xl opacity-80">%</span>
             </div>
             <span className="text-xs tracking-widest font-smooch opacity-80 pl-1 uppercase text-red-400 font-bold">{isProcessing ? "Simulating..." : "Overall Impact"}</span>
          </div>
        </GlassPanel>

        <GlassPanel className="h-[120px] rounded-[1.5rem] bg-black/60 border border-white/20 p-6 flex flex-col justify-end backdrop-blur-2xl relative overflow-hidden">
           <div className="absolute top-4 left-6 opacity-80 text-sm tracking-widest font-smooch font-bold">Spatial Timeline</div>
           
           <div className="w-full flex items-end gap-[2px] h-12 relative z-10 mt-6">
             {metrics.timeline.map((val, i) => (
               <div key={i} className="flex-1 flex flex-col justify-end h-full">
                 <motion.div 
                   initial={{ height: 0 }}
                   animate={{ height: `${metrics.score > 0 ? val : Math.random() * 5 + 5}%` }}
                   transition={{ duration: 1, delay: i * 0.05 }}
                   className={`w-full rounded-[1px] ${val > 80 ? 'bg-red-500 shadow-[0_0_15px_red]' : 'bg-white/20'}`}
                 />
               </div>
             ))}
           </div>
        </GlassPanel>

      </div>
    </div>
  );
}
