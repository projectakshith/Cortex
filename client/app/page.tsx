import Link from "next/link";
import { LightRays } from "@/components/ui/LightRays";
import { BrainModel } from "@/components/neuro/BrainModel";
export default function RootPage() {
  return (
    <main className="relative min-h-screen bg-[#030303] text-white font-rostex overflow-x-hidden">
      {/* Dynamic Native Cortex Engine Background */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <LightRays
          raysOrigin="top-center"
          raysColor="#ffffff"
          raysSpeed={0.5}
          lightSpread={1.0}
          rayLength={3}
          followMouse={true}
          mouseInfluence={0.1}
          className="opacity-40"
        />
      </div>

      <nav className="relative z-30 flex items-center justify-between px-12 py-8 border-b border-white/5">
        <div className="flex items-center gap-12">
          <h1 className="text-xl font-bold uppercase tracking-[0.4em]">CORTEX</h1>
        </div>
        <div className="flex items-center gap-10 text-[10px] uppercase tracking-[0.2em] font-bold opacity-60">
          <Link href="/engine" className="hover:text-white transition-all cursor-pointer">Engine</Link>
          <a href="https://github.com/projectakshith/Cortex" target="_blank" rel="noreferrer" className="hover:text-white transition-all cursor-pointer">Docs</a>
        </div>
      </nav>

      <div className="relative z-10 w-full pointer-events-none">
        {/* Core Identity Section */}
        <section className="min-h-[85vh] flex flex-col items-center justify-center relative overflow-hidden">
          <h1 className="text-7xl md:text-[8rem] lg:text-[10rem] font-bold uppercase tracking-[0.3em] mb-4 text-center ml-[0.3em] relative z-10 mix-blend-screen pointer-events-none text-white opacity-90 drop-shadow-2xl">
            CORTEX
          </h1>
          <p className="text-xs md:text-sm opacity-60 tracking-[0.3em] uppercase text-center mb-16 px-4">
            Zero cognitive load, by design.
          </p>
          <Link href="/engine" className="px-10 py-5 bg-white/[0.03] border border-white/10 hover:bg-white/10 hover:border-white/30 hover:-translate-y-1 transition-all rounded-full text-xs tracking-[0.2em] uppercase backdrop-blur-sm">
            Launch Engine
          </Link>
        </section>

        {/* Narrative Section derived from README */}
        <section className="min-h-screen flex flex-col justify-center px-12 md:px-24 w-full max-w-7xl mx-auto py-24 pointer-events-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center w-full mb-24">
            <div className="flex flex-col items-start text-left">
              <h2 className="text-2xl md:text-4xl font-bold uppercase tracking-[0.3em] mb-12">What is Cortex?</h2>
              <p className="text-sm md:text-lg leading-loose opacity-60 font-mono border-l border-white/20 pl-8">
                An in-silico cognitive load balancer and auto-remediation engine for UI/UX code. It replaces subjective design opinions with hard neuroscience data, parsing visual telemetry directly through simulated neurological strain.
              </p>
            </div>
            <div className="w-full h-[300px] md:h-[500px] relative pointer-events-auto flex items-center justify-center">
              <BrainModel />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-12 w-full">
            <div className="p-10 border border-white/5 bg-black/40 rounded-[2rem] backdrop-blur-md hover:border-white/20 transition-all group">
              <h3 className="text-2xl font-bold uppercase tracking-[0.2em] mb-6 opacity-80 group-hover:opacity-100 transition-opacity">1. Predict</h3>
              <p className="text-xs md:text-sm opacity-50 font-mono leading-loose">
                We feed your UI components directly into our PyTorch Brain Node pipeline to predict the exact BOLD signals that would fire in a real human brain when perceiving your interface geometry.
              </p>
            </div>
            <div className="p-10 border border-white/5 bg-black/40 rounded-[2rem] backdrop-blur-md hover:border-white/20 transition-all group">
              <h3 className="text-2xl font-bold uppercase tracking-[0.2em] mb-6 opacity-80 group-hover:opacity-100 transition-opacity">2. Refactor</h3>
              <p className="text-xs md:text-sm opacity-50 font-mono leading-loose">
                If signals indicate severe visual cortex overload or decision fatigue, the autonomous Orchestrator agent kicks in—rewriting your JSX structural trees over the wire into zero-friction layouts.
              </p>
            </div>
          </div>
        </section>

        {/* TRIBE v2 Deep Dive */}
        <section className="min-h-screen flex flex-col items-center justify-center px-12 md:px-24 border-t border-dashed border-white/10 py-24">
          <p className="text-[10px] tracking-[0.5em] uppercase opacity-40 mb-6">Built Upon</p>
          <h2 className="text-5xl md:text-8xl font-bold uppercase tracking-[0.2em] text-center mb-12">
            Meta TRIBE v2
          </h2>
          <p className="text-xs md:text-sm text-center max-w-2xl opacity-50 font-mono leading-loose mb-16">
            Our neuroscience logic leverages the Trimodal Brain Encoder, an architectural breakthrough trained on over 1,100 hours of fMRI data capable of predicting parallel activity across 70,000 specific brain voxels in real-time.
          </p>

          <div className="flex gap-4 opacity-40 mix-blend-screen grayscale">
            <div className="h-[2px] w-12 bg-white/50 rounded-full" />
            <div className="h-[2px] w-24 bg-white/50 rounded-full" />
            <div className="h-[2px] w-12 bg-white/50 rounded-full" />
          </div>
        </section>
      </div>
    </main>
  );
}
