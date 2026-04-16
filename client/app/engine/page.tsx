import Link from "next/link";
import { NeuroLink } from "@/components/neuro/NeuroLink";
import { LightRays } from "@/components/ui/LightRays";

export default function EnginePage() {
  return (
    <main className="relative min-h-screen flex flex-col font-rostex bg-[#030303] text-white overflow-x-hidden">
      <div className="absolute inset-0 pointer-events-none z-0">
        <LightRays
          raysOrigin="top-center"
          raysColor="#ffffff"
          raysSpeed={0.5}
          lightSpread={1.0}
          rayLength={3}
          followMouse={true}
          mouseInfluence={0.1}
          className="opacity-60"
        />
      </div>

      <nav className="relative z-30 flex items-center justify-between px-12 py-8 border-b border-white/5">
        <div className="flex items-center gap-12">
          <Link href="/">
            <h1 className="text-xl font-bold uppercase tracking-[0.4em] hover:opacity-80 transition-opacity">CORTEX</h1>
          </Link>
        </div>
        
        <div className="flex items-center gap-10 text-[10px] uppercase tracking-[0.2em] font-bold opacity-60">
          <Link href="/engine" className="text-white opacity-100 underline underline-offset-8 decoration-accent-cyan">Engine</Link>
          <Link href="/docs" className="hover:text-white transition-all cursor-pointer">Docs</Link>
          <a href="https://github.com/projectakshith/Cortex" target="_blank" rel="noreferrer" className="hover:text-white transition-all cursor-pointer">GitHub</a>
        </div>
      </nav>

      <NeuroLink />
    </main>
  );
}
