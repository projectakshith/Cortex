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

      <header className="relative z-30 px-12 py-10">
        <h1 className="text-xl font-bold uppercase tracking-[0.4em]">CORTEX</h1>
      </header>

      <NeuroLink />
    </main>
  );
}
