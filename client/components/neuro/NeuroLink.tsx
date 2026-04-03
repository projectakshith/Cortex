"use client";
import React, { useState } from "react";
import { GlassPanel } from "@/components/ui/GlassPanel";

export function NeuroLink() {
  const [code, setCode] = useState("");
  const [image, setImage] = useState<string | null>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setImage(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="flex-1 grid grid-cols-1 lg:grid-cols-[1.2fr_1.5fr_1.2fr] gap-8 p-10 relative z-10 w-full max-w-[1600px] mx-auto">
      <div className="flex flex-col gap-6 h-full">
        <GlassPanel className="h-[250px] rounded-[2rem] flex flex-col gap-4 p-6 bg-white/[0.06] border-white/20">
          <div className="flex justify-between items-center opacity-40 text-[10px] uppercase tracking-widest font-mono font-bold">
            <span>Design</span>
          </div>
          <div className="flex-1 border border-dashed border-white/20 rounded-2xl flex flex-col items-center justify-center relative overflow-hidden hover:bg-white/[0.02] transition-colors">
            {image ? (
              <img src={image} alt="UI Preview" className="w-full h-full object-cover" />
            ) : (
              <label className="cursor-pointer flex flex-col items-center gap-3 w-full h-full justify-center">
                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white/40 text-xl font-light">+</div>
                <span className="text-[10px] uppercase tracking-[0.3em] opacity-40">Upload Screenshot</span>
                <input type="file" className="hidden" onChange={handleImageUpload} accept="image/*" />
              </label>
            )}
          </div>
        </GlassPanel>

        <GlassPanel className="flex-1 rounded-[2rem] flex flex-col gap-4 p-6 bg-white/[0.06] border-white/20">
          <div className="flex justify-between items-center opacity-40 text-[10px] uppercase tracking-widest font-mono font-bold">
            <span>Code</span>
          </div>
          <textarea 
            className="flex-1 bg-transparent border-none p-0 text-xs font-mono focus:outline-none resize-none placeholder-white/20 text-white/80 leading-relaxed scrollbar-hide"
            placeholder="Paste JSX / Tailwind here..."
            value={code}
            onChange={(e) => setCode(e.target.value)}
          />
          <button className="bg-white text-black font-bold text-[10px] uppercase tracking-[0.3em] hover:opacity-90 transition-all w-full py-4 rounded-2xl">
            Fix Design
          </button>
        </GlassPanel>
      </div>

      <div className="flex flex-col h-full">
        <div className="flex-1 glass rounded-[3rem] border-white/10 flex flex-col items-center justify-center relative overflow-hidden bg-white/[0.03]">
          <div className="absolute inset-0 bg-gradient-to-b from-white/[0.04] to-transparent pointer-events-none" />
          <div className="relative w-full h-full flex items-center justify-center text-center">
            <div className="absolute w-80 h-80 bg-white/5 blur-[120px] rounded-full animate-pulse" />
            <div className="space-y-4">
               <div className="w-20 h-20 border border-white/10 rounded-full mx-auto animate-spin-slow opacity-20" />
               <p className="text-[10px] uppercase tracking-[0.6em] opacity-30 font-bold font-mono">Neural Interface</p>
            </div>
          </div>
          <div className="absolute bottom-12 left-0 right-0 px-12 flex justify-between items-end opacity-20 text-[9px] uppercase tracking-[0.3em] font-mono font-bold">
            <div className="space-y-1">
              <p>Load: 0ms</p>
              <p>Index: 0.94</p>
            </div>
            <div className="text-right">
              <p>TRIBE V2</p>
              <p>Status: Ready</p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col h-full">
        <GlassPanel className="flex-1 rounded-[2rem] flex flex-col gap-4 p-8 bg-white/[0.06] border-white/20">
          <div className="flex justify-between items-center opacity-40 text-[10px] uppercase tracking-widest font-mono font-bold">
            <span>Result</span>
          </div>
          <div className="flex-1 flex flex-col items-center justify-center border border-white/10 rounded-2xl bg-black/40">
             <p className="text-[10px] uppercase tracking-[0.5em] opacity-30 font-mono text-center font-bold px-10 leading-loose">
               Waiting for analysis...
             </p>
          </div>
        </GlassPanel>
      </div>
    </div>
  );
}
