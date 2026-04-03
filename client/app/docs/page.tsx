"use client";
import { useEffect } from "react";
import { LightRays } from "@/components/ui/LightRays";

export default function Docs() {
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const maxScroll = document.body.scrollHeight - window.innerHeight;
      const progress = scrollY / maxScroll;
      const x = window.innerWidth * 0.5;
      const y = -100 + progress * (window.innerHeight * 0.8);
      window.dispatchEvent(new MouseEvent("mousemove", {
        clientX: x,
        clientY: Math.max(0, y),
        bubbles: true,
      }));
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <main className="relative min-h-screen flex flex-col bg-black overflow-hidden font-sans">
      <div className="absolute inset-0 pointer-events-none z-0">
        <LightRays
          raysOrigin="top-center"
          raysColor="#ffffff"
          raysSpeed={0.5}
          lightSpread={1.0}
          rayLength={3}
          followMouse={true}
          mouseInfluence={0.6}
          className="opacity-100"
        />
      </div>

      <header className="relative z-20 px-10 py-8 flex items-center justify-between">
        <h1 className="text-xl text-white font-bold uppercase tracking-[0.4em] font-rostex">CORTEX</h1>
        <div className="flex items-center gap-2 opacity-30">
          <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
          <span className="text-[9px] font-mono uppercase tracking-[0.3em] text-white">System Online</span>
        </div>
      </header>

      <div className="relative z-20 flex flex-col items-center px-6 pb-24">
        <div className="w-full max-w-3xl flex flex-col gap-16">

          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
              <h2 className="text-3xl text-transparent bg-clip-text bg-gradient-to-b from-white to-white/40 uppercase tracking-[0.5em] font-rostex drop-shadow-[0_0_20px_rgba(255,255,255,0.4)]">
                Docs
              </h2>
              <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
            </div>
            <p className="text-[11px] font-mono text-white/50 leading-relaxed tracking-wide">
              A neuro-linter that detects cognitive overload in UI designs using simulated brain data and automatically rewrites chaotic CSS into clean components.
            </p>
            <a
              href="https://github.com/projectakshith/Cortex"
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-2 text-[10px] font-mono uppercase tracking-[0.15em] text-white/40 underline underline-offset-4 hover:text-white hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.6)] transition-all duration-300"
            >
              <span className="w-1 h-1 rounded-full bg-white/40 group-hover:bg-white group-hover:shadow-[0_0_6px_white] transition-all" />
              github.com/projectakshith/Cortex
            </a>
          </div>

          <section className="flex flex-col gap-4">
            <h3 className="text-[10px] text-white/60 uppercase tracking-[0.5em] font-rostex border-b border-white/10 pb-2">Tech Stack</h3>
            <ul className="flex flex-col gap-3 text-[11px] font-mono text-white/50 leading-relaxed tracking-wide">
              <li><span className="text-white/80">Next.js 16 + Tailwind CSS</span> — Frontend UI, captures Base64 screenshots and sends raw code to the backend</li>
              <li><span className="text-white/80">Node.js + Express</span> — Middleware layer, routes data between the brain model and Gemini, handles CORS and API logic</li>
              <li><span className="text-white/80">Python + FastAPI</span> — Hosts the TRIBE v2 brain simulation model, exposes a REST endpoint for image analysis</li>
              <li><span className="text-white/80">Google Gemini 2.5 Flash</span> — LLM that rewrites high-friction UI code into brutalist, minimal, or accessible output</li>
              <li><span className="text-white/80">Axios</span> — Used by the Node server to forward image data to the Python model</li>
            </ul>
          </section>

          <section className="flex flex-col gap-4">
            <h3 className="text-[10px] text-white/60 uppercase tracking-[0.5em] font-rostex border-b border-white/10 pb-2">Meta TRIBE v2</h3>
            <div className="flex flex-col gap-3 text-[11px] font-mono text-white/50 leading-relaxed tracking-wide">
              <p>TRIBE v2 is a neuroscience-inspired brain simulation model built in Python. It analyzes UI screenshots and produces a cognitive friction score by simulating how different regions of the human brain respond to visual stimuli.</p>
              <p>Rather than using traditional accessibility metrics, TRIBE v2 models actual neurological stress responses — measuring how much mental effort a UI demands from the user at a neurological level.</p>
              <div className="flex flex-col gap-2 mt-1 pl-3 border-l border-white/10">
                <p className="text-[9px] text-white/30 uppercase tracking-[0.4em] font-rostex">Input</p>
                <p>A Base64-encoded screenshot of the UI component or page.</p>
              </div>
              <div className="flex flex-col gap-2 pl-3 border-l border-white/10">
                <p className="text-[9px] text-white/30 uppercase tracking-[0.4em] font-rostex">Output</p>
                <p>A friction score (0–100) and activation values for four brain regions, each representing a distinct cognitive stress vector:</p>
                <ul className="flex flex-col gap-1 pl-2">
                  <li><span className="text-white/80">visual_cortex</span> — Detects competing visual elements, excessive color, or layout chaos</li>
                  <li><span className="text-white/80">prefrontal</span> — Measures decision fatigue from unclear hierarchy or too many choices</li>
                  <li><span className="text-white/80">amygdala</span> — Triggered by aggressive color combinations or disorienting layouts</li>
                  <li><span className="text-white/80">hippocampus</span> — Measures memory load; high values mean the UI is too complex to parse quickly</li>
                </ul>
              </div>
              <p>When the friction score exceeds 40, the system automatically triggers Gemini to refactor the code. Scores above 75 are classified as critical.</p>
            </div>
          </section>

          <section className="flex flex-col gap-4">
            <h3 className="text-[10px] text-white/60 uppercase tracking-[0.5em] font-rostex border-b border-white/10 pb-2">Data Flow</h3>
            <ol className="flex flex-col gap-3 text-[11px] font-mono text-white/50 leading-relaxed tracking-wide">
              <li><span className="text-white/30 mr-3">01</span>Frontend sends <code className="text-white/80 bg-white/5 px-1 rounded">raw_code</code> + <code className="text-white/80 bg-white/5 px-1 rounded">image_base64</code> to <code className="text-white/80 bg-white/5 px-1 rounded">POST /api/evaluate-ui</code></li>
              <li><span className="text-white/30 mr-3">02</span>Backend forwards the image to the Python brain model</li>
              <li><span className="text-white/30 mr-3">03</span>Brain model returns a <code className="text-white/80 bg-white/5 px-1 rounded">friction_score</code> and region activations</li>
              <li><span className="text-white/30 mr-3">04</span>If score &gt; 40, Gemini rewrites the code using the brutalist system prompt</li>
              <li><span className="text-white/30 mr-3">05</span>Final payload returned with score, severity, brain regions, and clean code</li>
            </ol>
          </section>

          <section className="flex flex-col gap-6">
            <h3 className="text-[10px] text-white/60 uppercase tracking-[0.5em] font-rostex border-b border-white/10 pb-2">API Reference</h3>

            <div className="flex flex-col gap-3 border border-white/10 rounded-xl p-6 bg-white/[0.03] hover:border-white/20 transition-colors">
              <div className="flex items-center gap-3">
                <span className="text-[9px] font-rostex tracking-widest text-black bg-white px-2 py-1 rounded">POST</span>
                <code className="text-sm text-white/80 tracking-wider">/api/evaluate-ui</code>
              </div>
              <p className="text-[11px] font-mono text-white/40 leading-relaxed tracking-wide">Main endpoint. Accepts raw UI code and a Base64 screenshot, returns friction score and refactored code.</p>
              <div className="flex flex-col gap-1">
                <p className="text-[9px] text-white/30 uppercase tracking-[0.4em] font-rostex">Request</p>
                <pre className="text-[10px] bg-white/[0.03] rounded-lg p-4 overflow-x-auto text-white/40 font-mono">{`{
  "raw_code": "<div class='...'>...</div>",
  "image_base64": "data:image/png;base64,...",
  "style": "brutalist" // optional: brutalist | minimal | accessible
}`}</pre>
              </div>
              <div className="flex flex-col gap-1">
                <p className="text-[9px] text-white/30 uppercase tracking-[0.4em] font-rostex">Response</p>
                <pre className="text-[10px] bg-white/[0.03] rounded-lg p-4 overflow-x-auto text-white/40 font-mono">{`{
  "original_score": 88,
  "severity": "critical",
  "brain_regions": {
    "visual_cortex": { "score": 0.95, "label": "Visual Overload" },
    "prefrontal": { "score": 0.82, "label": "Decision Fatigue" }
  },
  "ai_refactored": true,
  "clean_code": "<div ...>...</div>",
  "css_diff": { "removed": [...], "added": [...] }
}`}</pre>
              </div>
            </div>

            <div className="flex flex-col gap-2 border border-white/10 rounded-xl p-6 bg-white/[0.03] hover:border-white/20 transition-colors">
              <div className="flex items-center gap-3">
                <span className="text-[9px] font-rostex tracking-widest text-white/60 bg-white/10 px-2 py-1 rounded">GET</span>
                <code className="text-sm text-white/80 tracking-wider">/api/health</code>
              </div>
              <p className="text-[11px] font-mono text-white/40 leading-relaxed tracking-wide">Returns server status and uptime.</p>
            </div>

            <div className="flex flex-col gap-2 border border-white/10 rounded-xl p-6 bg-white/[0.03] hover:border-white/20 transition-colors">
              <div className="flex items-center gap-3">
                <span className="text-[9px] font-rostex tracking-widest text-white/60 bg-white/10 px-2 py-1 rounded">GET</span>
                <code className="text-sm text-white/80 tracking-wider">/api/history</code>
              </div>
              <p className="text-[11px] font-mono text-white/40 leading-relaxed tracking-wide">Returns the last 50 friction score evaluations stored in memory.</p>
            </div>
          </section>

          <section className="flex flex-col gap-4">
            <h3 className="text-[10px] text-white/60 uppercase tracking-[0.5em] font-rostex border-b border-white/10 pb-2">Severity Levels</h3>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {[
                { level: 'Low', range: '0–25', color: 'border border-green-900 text-green-500/70' },
                { level: 'Medium', range: '26–50', color: 'border border-yellow-900 text-yellow-500/70' },
                { level: 'High', range: '51–75', color: 'border border-orange-900 text-orange-500/70' },
                { level: 'Critical', range: '76–100', color: 'border border-red-900 text-red-500/70' },
              ].map(s => (
                <div key={s.level} className={`flex flex-col gap-1 rounded-lg p-4 bg-white/[0.02] ${s.color}`}>
                  <span className="text-[9px] uppercase tracking-[0.3em] font-rostex">{s.level}</span>
                  <span className="text-[10px] font-mono opacity-60">{s.range}</span>
                </div>
              ))}
            </div>
          </section>

          <section className="flex flex-col gap-4">
            <h3 className="text-[10px] text-white/60 uppercase tracking-[0.5em] font-rostex border-b border-white/10 pb-2">Refactor Styles</h3>
            <div className="flex flex-col gap-3 text-[11px] font-mono text-white/50 leading-relaxed tracking-wide">
              <p><span className="text-white/80">Brutalist</span> — Stark white backgrounds, heavy black borders, red <code className="bg-white/5 px-1 rounded">#dd2b37</code> accents. Maximum contrast.</p>
              <p><span className="text-white/80">Minimal</span> — White background, light gray borders, generous whitespace. No decorative elements.</p>
              <p><span className="text-white/80">Accessible</span> — WCAG AA compliant. Semantic HTML, visible focus states, 4.5:1 contrast ratio.</p>
            </div>
          </section>

          <section className="flex flex-col gap-4">
            <h3 className="text-[10px] text-white/60 uppercase tracking-[0.5em] font-rostex border-b border-white/10 pb-2">Brain Regions</h3>
            <div className="flex flex-col gap-3 text-[11px] font-mono text-white/50 leading-relaxed tracking-wide">
              <p><span className="text-white/80">visual_cortex</span> — Visual Overload. High activation means too much competing visual information.</p>
              <p><span className="text-white/80">prefrontal</span> — Decision Fatigue. High activation means too many choices or unclear hierarchy.</p>
              <p><span className="text-white/80">amygdala</span> — Stress Response. Triggered by aggressive colors or chaotic layouts.</p>
              <p><span className="text-white/80">hippocampus</span> — Memory Load. High activation means the UI is too complex to parse quickly.</p>
            </div>
          </section>

          <div className="flex justify-center opacity-20 pb-4">
            <div className="flex items-center gap-4 text-[9px] font-mono uppercase tracking-[0.4em] text-white">
              <span className="w-8 h-px bg-white/40" />
              Cortex v1.0 — Neural Design Engine
              <span className="w-8 h-px bg-white/40" />
            </div>
          </div>

        </div>
      </div>
    </main>
  )
}
