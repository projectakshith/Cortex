"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import dynamic from "next/dynamic";

const RandomHeatmapBrain = dynamic(
  () => import("@/components/neuro/BrainModel").then((m) => m.RandomHeatmapBrain),
  { ssr: false }
);

// ── Suggestion pool ───────────────────────────────────────────────────────────
const SUGGESTIONS = [
  {
    label: "Visual Cortex Peak",
    desc: "Strong V1/V2 activation — reduce motion density in this window.",
    accent: "#ef4444",
    level: "high" as const,
    detail: "This frame triggers intense visual cortex firing. The brain is actively processing high-complexity visual input. Great for brand recall if your logo is on-screen — but reduce competing motion elements to avoid saturation.",
  },
  {
    label: "Attention Density: High",
    desc: "Prefrontal engagement elevated. Preserve this framing for key messages.",
    accent: "#f97316",
    level: "high" as const,
    detail: "Viewer attention is fully captured at this moment. The prefrontal cortex is engaged and decision-making circuits are active. This is a prime window to introduce your product, tagline, or CTA — the brain is receptive.",
  },
  {
    label: "Motion Overload",
    desc: "MT+ region saturated. Slow the cut rate or reduce optical flow intensity.",
    accent: "#eab308",
    level: "medium" as const,
    detail: "The motion-processing area (MT+) is firing near saturation. Fast cuts or heavy camera movement here are overwhelming the viewer's neural bandwidth. Consider a slower edit or static hold to let attention recover.",
  },
  {
    label: "Low Cognitive Load",
    desc: "Resting-state signal. Optimal moment to introduce CTA or brand recall cue.",
    accent: "#22c55e",
    level: "low" as const,
    detail: "The brain is in a low-load, receptive state here. This is your best window — insert a brand moment, product close-up, or call-to-action. Viewers are not cognitively fatigued and memory encoding is at its highest.",
  },
  {
    label: "Temporal Cortex Active",
    desc: "Auditory-visual sync confirmed. Maintain audio alignment with visual beats.",
    accent: "#06b6d4",
    level: "medium" as const,
    detail: "The temporal cortex is processing audio-visual synchrony. Sound and image are in alignment, reinforcing each other. Disrupting this sync (e.g. music cut, silence) would drop engagement sharply. Keep the audio consistent here.",
  },
  {
    label: "Decision Fatigue",
    desc: "dlPFC overload detected. Simplify on-screen choices in this segment.",
    accent: "#a855f7",
    level: "high" as const,
    detail: "The dorsolateral prefrontal cortex shows overload — the viewer is experiencing decision fatigue. Too many competing elements on screen. Strip back visual noise, remove overlapping text or graphics, and let one clear message dominate.",
  },
];
type Frame = { dataUrl: string; time: number; score: number; suggestion: (typeof SUGGESTIONS)[number] };

async function extractFrames(src: string, duration: number): Promise<Frame[]> {
  const vid = document.createElement("video");
  vid.src = src; vid.muted = true; vid.preload = "metadata";
  await new Promise<void>((r) => vid.addEventListener("loadedmetadata", () => r(), { once: true }));
  const canvas = document.createElement("canvas");
  canvas.width = 480; canvas.height = 270;
  const ctx = canvas.getContext("2d")!;
  const frames: Frame[] = [];
  for (let i = 0; i < 5; i++) {
    const ts = ((i + 0.5) / 5) * duration;
    vid.currentTime = ts;
    await new Promise<void>((r) => vid.addEventListener("seeked", () => r(), { once: true }));
    ctx.drawImage(vid, 0, 0, 480, 270);
    frames.push({ dataUrl: canvas.toDataURL("image/jpeg", 0.82), time: ts,
      score: Math.floor(Math.random() * 38 + 58),
      suggestion: SUGGESTIONS[Math.floor(Math.random() * SUGGESTIONS.length)] });
  }
  vid.src = ""; return frames;
}

// ── Line chart data ───────────────────────────────────────────────────────────
const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
const INDUSTRY = [840, 855, 870, 862, 890, 905, 888, 920, 915, 940, 930, 965];
const CORTEX   = [840, 730, 630, 545, 475, 415, 365, 320, 280, 248, 218, 192];

function CostLineChart() {
  const ref    = useRef<SVGSVGElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const inView = useInView(wrapRef, { once: true, margin: "-60px" });

  const W = 900, H = 320, PAD = { top: 24, right: 32, bottom: 48, left: 68 };
  const innerW = W - PAD.left - PAD.right;
  const innerH = H - PAD.top  - PAD.bottom;
  const yMin = 100, yMax = 1050;

  const xScale = (i: number) => PAD.left + (i / (MONTHS.length - 1)) * innerW;
  const yScale = (v: number) => PAD.top  + innerH - ((v - yMin) / (yMax - yMin)) * innerH;

  const toPath  = (data: number[]) => data.map((v, i) => `${i === 0 ? "M" : "L"} ${xScale(i).toFixed(1)} ${yScale(v).toFixed(1)}`).join(" ");
  const toArea  = (data: number[]) =>
    `${toPath(data)} L ${xScale(data.length - 1).toFixed(1)} ${(PAD.top + innerH).toFixed(1)} L ${PAD.left.toFixed(1)} ${(PAD.top + innerH).toFixed(1)} Z`;

  const indPath  = toPath(INDUSTRY);
  const crtPath  = toPath(CORTEX);
  const indArea  = toArea(INDUSTRY);
  const crtArea  = toArea(CORTEX);

  // Measure path length for dash animation
  const [indLen, setIndLen] = useState(2000);
  const [crtLen, setCrtLen] = useState(2000);
  const indRef = useRef<SVGPathElement>(null);
  const crtRef = useRef<SVGPathElement>(null);
  useEffect(() => {
    if (indRef.current) setIndLen(indRef.current.getTotalLength());
    if (crtRef.current) setCrtLen(crtRef.current.getTotalLength());
  }, []);

  const yTicks = [200, 400, 600, 800, 1000];

  return (
    <div ref={wrapRef} className="w-full flex flex-col gap-4">
      <div className="overflow-x-auto">
        <svg ref={ref} viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ minWidth: 520 }}>
          <defs>
            <linearGradient id="gradInd" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#ef4444" stopOpacity="0.18" />
              <stop offset="100%" stopColor="#ef4444" stopOpacity="0" />
            </linearGradient>
            <linearGradient id="gradCrt" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#22c55e" stopOpacity="0.18" />
              <stop offset="100%" stopColor="#22c55e" stopOpacity="0" />
            </linearGradient>
          </defs>

          {/* Grid lines */}
          {yTicks.map(v => (
            <line key={v} x1={PAD.left} y1={yScale(v)} x2={PAD.left + innerW} y2={yScale(v)}
              stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
          ))}

          {/* Y axis labels */}
          {yTicks.map(v => (
            <text key={v} x={PAD.left - 10} y={yScale(v) + 4} textAnchor="end"
              fill="rgba(255,255,255,0.35)" fontSize="11" fontFamily="monospace">
              ${v}K
            </text>
          ))}

          {/* X axis labels */}
          {MONTHS.map((m, i) => (
            <text key={m} x={xScale(i)} y={H - 12} textAnchor="middle"
              fill="rgba(255,255,255,0.35)" fontSize="11" fontFamily="monospace">{m}</text>
          ))}

          {/* Area fills */}
          {inView && <path d={indArea} fill="url(#gradInd)" />}
          {inView && <path d={crtArea} fill="url(#gradCrt)" />}

          {/* Industry line */}
          <path ref={indRef} d={indPath} fill="none" stroke="#ef4444" strokeWidth="2.5"
            strokeDasharray={indLen} strokeLinecap="round"
            strokeDashoffset={inView ? 0 : indLen}
            style={{ transition: inView ? "stroke-dashoffset 1.6s cubic-bezier(0.4,0,0.2,1)" : "none" }} />

          {/* Cortex line */}
          <path ref={crtRef} d={crtPath} fill="none" stroke="#22c55e" strokeWidth="2.5"
            strokeDasharray={crtLen} strokeLinecap="round"
            strokeDashoffset={inView ? 0 : crtLen}
            style={{ transition: inView ? "stroke-dashoffset 1.6s 0.3s cubic-bezier(0.4,0,0.2,1)" : "none" }} />

          {/* Data points */}
          {inView && INDUSTRY.map((v, i) => (
            <circle key={i} cx={xScale(i)} cy={yScale(v)} r="3.5" fill="#ef4444" stroke="#030303" strokeWidth="2" />
          ))}
          {inView && CORTEX.map((v, i) => (
            <circle key={i} cx={xScale(i)} cy={yScale(v)} r="3.5" fill="#22c55e" stroke="#030303" strokeWidth="2" />
          ))}

          {/* End labels */}
          {inView && (
            <>
              <text x={xScale(11) + 8} y={yScale(INDUSTRY[11]) + 4} fill="#ef4444" fontSize="11" fontFamily="monospace" fontWeight="bold">$965K</text>
              <text x={xScale(11) + 8} y={yScale(CORTEX[11]) + 4}   fill="#22c55e" fontSize="11" fontFamily="monospace" fontWeight="bold">$192K</text>
            </>
          )}

          {/* Savings annotation */}
          {inView && (
            <g>
              <line x1={xScale(11)} y1={yScale(CORTEX[11])} x2={xScale(11)} y2={yScale(INDUSTRY[11])}
                stroke="rgba(255,255,255,0.2)" strokeWidth="1" strokeDasharray="4 3" />
              <text x={xScale(11) - 4} y={(yScale(CORTEX[11]) + yScale(INDUSTRY[11])) / 2 + 4}
                textAnchor="end" fill="rgba(255,255,255,0.5)" fontSize="10" fontFamily="monospace">
                −80%
              </text>
            </g>
          )}
        </svg>
      </div>

      {/* Legend */}
      <div className="flex gap-6 px-1">
        <div className="flex items-center gap-2 text-[11px] font-mono opacity-70">
          <div className="w-8 h-[2px] bg-red-500 rounded" />
          <span>Industry avg cost / campaign</span>
        </div>
        <div className="flex items-center gap-2 text-[11px] font-mono opacity-70">
          <div className="w-8 h-[2px] bg-green-500 rounded" />
          <span>Cortex-optimised cost / campaign</span>
        </div>
      </div>
    </div>
  );
}

// ── ROI bar chart ─────────────────────────────────────────────────────────────
const BARS = [
  { label: "Brand Recall",      before: 28,  after: 74,  unit: "%",  inverted: false, float: false },
  { label: "Creative Waste",    before: 68,  after: 12,  unit: "%",  inverted: true,  float: false },
  { label: "ROAS",              before: 1.8, after: 5.4, unit: "×",  inverted: false, float: true  },
  { label: "Attention Density", before: 31,  after: 79,  unit: "%",  inverted: false, float: false },
  { label: "Cost Saved",        before: 0,   after: 73,  unit: "%",  inverted: false, float: false },
];

function ROIBars() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <div ref={ref} className="flex flex-col gap-5">
      {BARS.map((bar, i) => {
        const bPct = bar.float ? (bar.before / 6) * 100 : bar.before;
        const aPct = bar.float ? (bar.after  / 6) * 100 : bar.after;
        const delta = bar.float
          ? `+${(bar.after - bar.before).toFixed(1)}${bar.unit}`
          : bar.inverted ? `−${bar.before - bar.after}${bar.unit}` : `+${bar.after - bar.before}${bar.unit}`;
        return (
          <div key={bar.label} className="flex flex-col gap-1.5">
            <div className="flex justify-between text-[11px] font-mono">
              <span className="opacity-50 tracking-widest uppercase">{bar.label}</span>
              <span className="font-bold opacity-90">{delta}</span>
            </div>
            <div className="relative h-4 rounded-full overflow-hidden bg-white/5 border border-white/8">
              <motion.div initial={{ width: 0 }} animate={inView ? { width: `${bPct}%` } : {}}
                transition={{ duration: 0.8, delay: i * 0.1 }}
                className="absolute left-0 top-0 h-full rounded-full bg-white/15" />
              <motion.div initial={{ width: 0 }} animate={inView ? { width: `${aPct}%` } : {}}
                transition={{ duration: 1.1, delay: i * 0.1 + 0.3 }}
                className="absolute left-0 top-0 h-full rounded-full bg-white/70" />
            </div>
            <div className="flex gap-3 text-[10px] font-mono opacity-35">
              <span>Baseline: {bar.before}{bar.unit}</span>
              <span>→</span>
              <span className="opacity-90">Cortex: {bar.after}{bar.unit}</span>
            </div>
          </div>
        );
      })}
      <div className="flex gap-5 mt-2">
        <div className="flex items-center gap-2 text-[10px] font-mono opacity-40"><div className="w-6 h-[2px] bg-white/30 rounded" /><span>Industry avg</span></div>
        <div className="flex items-center gap-2 text-[10px] font-mono opacity-70"><div className="w-6 h-[2px] bg-white/80 rounded" /><span>Cortex-guided</span></div>
      </div>
    </div>
  );
}

// ── Stat pill ──────────────────────────────────────────────────────────────────
function StatPill({ value, label, accent }: { value: string; label: string; accent: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  return (
    <motion.div ref={ref} initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6 }}
      className="flex flex-col gap-1 p-6 rounded-2xl border bg-black/40" style={{ borderColor: `${accent}30` }}>
      <span className="text-3xl font-bold" style={{ color: accent }}>{value}</span>
      <span className="text-[11px] font-mono opacity-50 uppercase tracking-widest">{label}</span>
    </motion.div>
  );
}

// ── Section wrapper ───────────────────────────────────────────────────────────
function Section({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.div ref={ref} initial={{ opacity: 0, y: 32 }} animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay, ease: "easeOut" }}>
      {children}
    </motion.div>
  );
}

// ── Loading steps shown before brain appears ─────────────────────────────────
const LOAD_STEPS = [
  "Initializing neural pipeline...",
  "Loading BOLD tensor weights...",
  "Mapping cortical voxels...",
  "Calibrating heatmap renderer...",
  "Ready.",
];

// ── Frame gallery fullscreen ──────────────────────────────────────────────────
function FrameGallery({ frames, initialIndex, onClose }: {
  frames: Frame[];
  initialIndex: number;
  onClose: () => void;
}) {
  const [idx, setIdx] = useState(initialIndex);
  const frame = frames[idx];

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") setIdx(i => Math.min(i + 1, frames.length - 1));
      if (e.key === "ArrowLeft")  setIdx(i => Math.max(i - 1, 0));
      if (e.key === "Escape")     onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [frames.length, onClose]);

  const levelBg: Record<string, string> = {
    high:   "rgba(239,68,68,0.12)",
    medium: "rgba(234,179,8,0.10)",
    low:    "rgba(34,197,94,0.10)",
  };
  const levelLabel: Record<string, string> = {
    high: "High activation", medium: "Moderate activation", low: "Low / resting",
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 z-[60] bg-black/95 backdrop-blur-xl flex flex-col"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-8 py-5 border-b border-white/8 flex-shrink-0">
        <div className="flex items-baseline gap-3">
          <span className="text-sm font-bold uppercase tracking-widest">Frame Analysis</span>
          <span className="text-[10px] font-mono opacity-40">Predicted BOLD · frame {idx + 1} of {frames.length}</span>
        </div>
        <button onClick={onClose}
          className="w-9 h-9 rounded-full border border-white/20 flex items-center justify-center hover:bg-white/10 transition-colors text-white/60 hover:text-white">
          ✕
        </button>
      </div>

      {/* Main content */}
      <div className="flex flex-1 min-h-0 gap-0">

        {/* Left nav */}
        <button onClick={() => setIdx(i => Math.max(i - 1, 0))} disabled={idx === 0}
          className="w-14 flex items-center justify-center text-white/20 hover:text-white/60 transition-colors disabled:opacity-0 text-2xl flex-shrink-0">
          ‹
        </button>

        {/* Center: large frame + annotation */}
        <div className="flex-1 flex flex-col items-center justify-center gap-5 px-4 py-6 min-w-0">
          <AnimatePresence mode="wait">
            <motion.div key={idx}
              initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.22 }}
              className="w-full flex flex-col gap-4" style={{ maxWidth: 780 }}
            >
              {/* Frame image */}
              <div className="relative rounded-2xl overflow-hidden border border-white/10">
                <img src={frame.dataUrl} alt="" className="w-full object-cover" style={{ maxHeight: "52vh" }} />

                {/* Score badge */}
                <div className="absolute top-4 right-4 flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/70 backdrop-blur-sm border border-white/10">
                  <div className="w-1.5 h-1.5 rounded-full" style={{ background: frame.suggestion.accent }} />
                  <span className="text-[11px] font-mono font-bold" style={{ color: frame.suggestion.accent }}>
                    {frame.score}% BOLD
                  </span>
                </div>

                {/* Timestamp */}
                <div className="absolute top-4 left-4 px-3 py-1.5 rounded-full bg-black/70 backdrop-blur-sm border border-white/10 text-[10px] font-mono opacity-70">
                  {frame.time.toFixed(2)}s
                </div>

                {/* Activation level tint overlay */}
                <div className="absolute inset-0 pointer-events-none rounded-2xl"
                  style={{ background: levelBg[frame.suggestion.level] }} />

                {/* Bottom annotation bar */}
                <div className="absolute bottom-0 left-0 right-0 p-4 pt-8"
                  style={{ background: "linear-gradient(to top, rgba(0,0,0,0.92), transparent)" }}>
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: frame.suggestion.accent }} />
                    <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: frame.suggestion.accent }}>
                      {frame.suggestion.label}
                    </span>
                    <span className="ml-auto text-[9px] font-mono opacity-40 uppercase tracking-widest">
                      {levelLabel[frame.suggestion.level]}
                    </span>
                  </div>
                  <p className="text-[11px] font-mono opacity-60 leading-relaxed">{frame.suggestion.desc}</p>
                </div>
              </div>

              {/* Detailed suggestion card */}
              <div className="rounded-2xl border p-5 flex flex-col gap-3"
                style={{ borderColor: `${frame.suggestion.accent}25`, background: `${frame.suggestion.accent}08` }}>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: frame.suggestion.accent }}>
                    Cortex Insight — {frame.time.toFixed(1)}s
                  </span>
                  {/* Load bar */}
                  <div className="flex items-center gap-2 text-[9px] font-mono opacity-50">
                    <span>Cognitive load</span>
                    <div className="w-24 h-1.5 rounded-full bg-white/10">
                      <div className="h-full rounded-full" style={{ width: `${frame.score}%`, background: frame.suggestion.accent }} />
                    </div>
                    <span>{frame.score}%</span>
                  </div>
                </div>
                <p className="text-[12px] font-mono opacity-70 leading-relaxed">{frame.suggestion.detail}</p>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Right nav */}
        <button onClick={() => setIdx(i => Math.min(i + 1, frames.length - 1))} disabled={idx === frames.length - 1}
          className="w-14 flex items-center justify-center text-white/20 hover:text-white/60 transition-colors disabled:opacity-0 text-2xl flex-shrink-0">
          ›
        </button>
      </div>

      {/* Thumbnail strip */}
      <div className="flex-shrink-0 border-t border-white/8 px-8 py-4">
        <div className="flex gap-3 justify-center">
          {frames.map((f, i) => (
            <button key={i} onClick={() => setIdx(i)}
              className={`relative rounded-xl overflow-hidden border transition-all flex-shrink-0 ${i === idx ? "border-white/50 scale-105" : "border-white/10 opacity-50 hover:opacity-80"}`}
              style={{ width: 120 }}>
              <img src={f.dataUrl} alt="" className="w-full aspect-video object-cover" />
              <div className="absolute bottom-1 left-1 px-1.5 py-0.5 rounded bg-black/70 text-[8px] font-mono opacity-80">{f.time.toFixed(1)}s</div>
              {i === idx && <div className="absolute inset-0 border-2 rounded-xl" style={{ borderColor: f.suggestion.accent }} />}
            </button>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

function CognitiveGraph({ progress, activityCurve }: { progress: number; activityCurve: number[] }) {
  const W = 340, H = 72, PAD = { l: 4, r: 4, t: 6, b: 6 };
  const iW = W - PAD.l - PAD.r, iH = H - PAD.t - PAD.b;
  const n = activityCurve.length;
  const x = (i: number) => PAD.l + (i / (n - 1)) * iW;
  const y = (v: number) => PAD.t + iH - v * iH;
  const path = activityCurve.map((v, i) => `${i === 0 ? "M" : "L"} ${x(i).toFixed(1)} ${y(v).toFixed(1)}`).join(" ");
  const area = `${path} L ${x(n-1).toFixed(1)} ${(PAD.t+iH).toFixed(1)} L ${PAD.l} ${(PAD.t+iH).toFixed(1)} Z`;
  const headX = PAD.l + progress * iW;

  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center justify-between text-[9px] font-mono opacity-40 tracking-widest uppercase">
        <span>Cognitive Activity</span>
        <span>{Math.round(activityCurve[Math.floor(progress * (n-1))] * 100)}%</span>
      </div>
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ height: H }}>
        <defs>
          <linearGradient id="cgGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="rgba(255,255,255,0.18)" />
            <stop offset="100%" stopColor="rgba(255,255,255,0)" />
          </linearGradient>
          <clipPath id="cgClip">
            <rect x={PAD.l} y={PAD.t} width={headX - PAD.l} height={iH} />
          </clipPath>
        </defs>
        {/* Full area dim */}
        <path d={area} fill="rgba(255,255,255,0.04)" />
        {/* Played area bright */}
        <path d={area} fill="url(#cgGrad)" clipPath="url(#cgClip)" />
        {/* Full line dim */}
        <path d={path} fill="none" stroke="rgba(255,255,255,0.18)" strokeWidth="1.5" strokeLinecap="round" />
        {/* Played line bright */}
        <path d={path} fill="none" stroke="rgba(255,255,255,0.75)" strokeWidth="1.5" strokeLinecap="round" clipPath="url(#cgClip)" />
        {/* Playhead */}
        <line x1={headX} y1={PAD.t} x2={headX} y2={PAD.t + iH} stroke="rgba(255,255,255,0.5)" strokeWidth="1" />
        <circle cx={headX} cy={y(activityCurve[Math.floor(progress * (n-1))])} r="3" fill="white" />
      </svg>
    </div>
  );
}

function ExpandedView({ isPlaying, videoPlayer, frames, extracting, videoSrc, onCollapse, brainLoading, progress }: {
  isPlaying: boolean;
  videoPlayer: React.ReactNode;
  frames: Frame[];
  extracting: boolean;
  videoSrc: string | null;
  onCollapse: () => void;
  brainLoading: boolean;
  progress: number;
}) {
  const [loadStep,    setLoadStep]    = useState(0);
  const [brainVisible, setBrainVisible] = useState(!brainLoading);
  const [framesReady,  setFramesReady]  = useState(false);
  const [galleryIdx,   setGalleryIdx]   = useState<number | null>(null);

  const activityCurve = useState<number[]>(() =>
    Array.from({ length: 80 }, (_, i) => {
      const base = 0.3 + 0.25 * Math.sin(i * 0.18) + 0.15 * Math.sin(i * 0.43 + 1.2);
      return Math.max(0.05, Math.min(0.98, base + (Math.random() - 0.5) * 0.18));
    })
  )[0];

  // Brain loading sequence — frames only become visible after brain is ready
  useEffect(() => {
    if (!brainLoading) { setBrainVisible(true); setLoadStep(0); return; }
    setBrainVisible(false);
    setFramesReady(false);
    setLoadStep(0);
    let i = 0;
    const tick = () => {
      i++;
      setLoadStep(i);
      if (i < LOAD_STEPS.length - 1) setTimeout(tick, 420 + Math.random() * 260);
      else setTimeout(() => {
        setBrainVisible(true);
        // Extra 1.2s after brain appears before frame strip slides in
        setTimeout(() => setFramesReady(true), 1200);
      }, 400);
    };
    setTimeout(tick, 200);
  }, [brainLoading]);

  // Reset framesReady when frames are cleared (new video)
  useEffect(() => {
    if (frames.length === 0) setFramesReady(false);
  }, [frames.length]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      className="fixed inset-0 z-50 bg-black flex flex-col"
    >
      {/* ── Top area: brain (constrained) + video ── */}
      <div className="flex flex-1 min-h-0">

        {/* Brain — left, fixed height so it doesn't eat everything */}
        <div className="flex-1 relative flex flex-col items-center justify-center overflow-hidden">

          {/* The brain sits in a fixed box, not full-bleed */}
          <div className="relative" style={{ width: "70%", height: "62vh" }}>
            {brainLoading && !brainVisible ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-5">
                <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 1.4, repeat: Infinity }}
                  className="w-2 h-2 rounded-full bg-white" />
                <span className="text-[11px] font-mono tracking-widest opacity-60">
                  {LOAD_STEPS[Math.min(loadStep, LOAD_STEPS.length - 1)]}
                </span>
                <div className="w-40 h-[2px] bg-white/10 rounded-full overflow-hidden">
                  <motion.div className="h-full bg-white/60 rounded-full"
                    initial={{ width: "0%" }}
                    animate={{ width: `${((loadStep + 1) / LOAD_STEPS.length) * 100}%` }}
                    transition={{ duration: 0.4, ease: "easeOut" }} />
                </div>
              </div>
            ) : (
              <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, ease: "easeOut" }} className="absolute inset-0">
                <RandomHeatmapBrain isActive={isPlaying} />
              </motion.div>
            )}
          </div>

          {/* Legend just below the brain box */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: brainVisible ? 1 : 0 }}
            transition={{ delay: 0.4 }}
            className="flex flex-col items-center gap-1 mt-3 pointer-events-none">
            <div className="flex items-center gap-3 text-[11px] tracking-widest opacity-60">
              <span>Low</span>
              <div className="w-24 h-[4px] rounded-full" style={{ background: "linear-gradient(to right,#111,#8b0000,#cc2200,#ff4500,#ff8c00,#ffd700)" }} />
              <span>High</span>
            </div>
            <span className="text-[9px] tracking-[0.3em] uppercase opacity-30">BOLD Activity</span>
          </motion.div>
        </div>

        {/* Video + collapse — right strip */}
        <div className="w-[380px] flex-shrink-0 flex flex-col gap-4 p-5 border-l border-white/10">
          <div className="flex items-center justify-between">
            <span className="text-[10px] tracking-[0.4em] uppercase opacity-40 font-mono">Neural Demo</span>
            <button onClick={onCollapse}
              className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/20 bg-white/5 text-[10px] tracking-widest uppercase hover:bg-white/10 transition-colors">
              <CollapseIcon /> Collapse
            </button>
          </div>
          <div>{videoPlayer}</div>

          {/* Cognitive activity graph */}
          <div className="border-t border-white/8 pt-4">
            <CognitiveGraph progress={progress} activityCurve={activityCurve} />
          </div>

          {!videoSrc && (
            <p className="text-[10px] font-mono opacity-25 leading-relaxed">
              Load a video — brain activates on play and frame analysis appears below.
            </p>
          )}
        </div>
      </div>

      {/* Gallery overlay */}
      <AnimatePresence>
        {galleryIdx !== null && frames.length > 0 && (
          <FrameGallery frames={frames} initialIndex={galleryIdx} onClose={() => setGalleryIdx(null)} />
        )}
      </AnimatePresence>

      {/* ── Bottom strip: frames — slides in after brain loads ── */}
      <motion.div
        initial={{ y: 60, opacity: 0 }}
        animate={framesReady || (!brainLoading && videoSrc) ? { y: 0, opacity: 1 } : { y: 60, opacity: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="flex-shrink-0 border-t border-white/10 bg-black/80 backdrop-blur-md px-6 py-4"
      >
      {/* inner wrapper keeps old structure ─────────────────────────── */}
      <div className="contents">
        <div className="flex items-center gap-3 mb-3">
          <span className="text-[10px] font-bold uppercase tracking-widest opacity-70">Frame Analysis</span>
          <span className="text-[9px] font-mono opacity-30">Predicted BOLD · 5 keyframes</span>
          {frames.length > 0 && <span className="text-[9px] font-mono opacity-30 ml-auto">click frame to expand</span>}
          {extracting && (
            <motion.span animate={{ opacity: [0.4, 1, 0.4] }} transition={{ duration: 1, repeat: Infinity }}
              className="text-[9px] font-mono opacity-50 ml-1">extracting...</motion.span>
          )}
        </div>
        <div className="flex gap-4 overflow-x-auto pb-1">
          {(frames.length === 0 ? Array.from({ length: 5 }) : frames).map((frame, i) => (
            frame == null || frames.length === 0 ? (
              <div key={i} className="flex-shrink-0 w-[190px] flex flex-col gap-2">
                <div className="w-full aspect-video rounded-lg bg-white/5 animate-pulse border border-white/8" />
                <div className="h-2.5 rounded bg-white/5 animate-pulse w-3/4" />
                <div className="h-2 rounded bg-white/5 animate-pulse w-1/2" />
              </div>
            ) : (
              <motion.div key={i}
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.07, duration: 0.35 }}
                onClick={() => setGalleryIdx(i)}
                className="flex-shrink-0 w-[190px] flex flex-col gap-2 cursor-pointer group"
              >
                <div className="relative rounded-lg overflow-hidden border border-white/10 group-hover:border-white/40 transition-colors">
                  <img src={(frame as Frame).dataUrl} alt="" className="w-full aspect-video object-cover group-hover:scale-[1.03] transition-transform duration-300" />
                  <div className="absolute top-1.5 right-1.5 px-1.5 py-0.5 rounded bg-black/80 text-[10px] font-mono font-bold"
                    style={{ color: (frame as Frame).suggestion.accent }}>{(frame as Frame).score}%</div>
                  <div className="absolute bottom-1.5 left-1.5 px-1.5 py-0.5 rounded bg-black/70 text-[9px] font-mono opacity-60">{(frame as Frame).time.toFixed(1)}s</div>
                </div>
                <div className="flex flex-col gap-0.5 px-0.5">
                  <span className="text-[9px] font-bold tracking-widest uppercase truncate" style={{ color: (frame as Frame).suggestion.accent }}>
                    {(frame as Frame).suggestion.label}
                  </span>
                  <p className="text-[9px] font-mono opacity-40 leading-relaxed line-clamp-2">{(frame as Frame).suggestion.desc}</p>
                </div>
              </motion.div>
            )
          ))}
        </div>
      </div>
    </motion.div>
    </motion.div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────
export function MediaLink() {
  const videoRef     = useRef<HTMLVideoElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const progressRef  = useRef<HTMLDivElement>(null);

  const [videoSrc,   setVideoSrc]   = useState<string | null>(null);
  const [isPlaying,  setIsPlaying]  = useState(false);
  const [isMuted,    setIsMuted]    = useState(false);
  const [speed,      setSpeed]      = useState<1 | 1.5 | 2>(1);
  const [progress,   setProgress]   = useState(0);
  const [isExpanded,   setIsExpanded]   = useState(false);
  const [frames,       setFrames]       = useState<Frame[]>([]);
  const [extracting,   setExtracting]   = useState(false);
  const [brainLoading, setBrainLoading] = useState(false);

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    // Reset input so same file can be re-picked
    e.target.value = "";
    const url = URL.createObjectURL(file);
    setVideoSrc(url); setIsPlaying(false); setProgress(0); setFrames([]);
    setExtracting(true);
    setBrainLoading(true);
    setTimeout(() => setBrainLoading(false), 2800);
    // auto-play
    setTimeout(() => {
      videoRef.current?.play().then(() => setIsPlaying(true)).catch(() => {});
    }, 100);
    setTimeout(async () => {
      try {
        const v = videoRef.current;
        const dur = v?.duration && isFinite(v.duration) ? v.duration : 30;
        setFrames(await extractFrames(url, dur));
      } finally { setExtracting(false); }
    }, 600);
  };

  const togglePlay = useCallback(() => {
    const v = videoRef.current; if (!v) return;
    if (isPlaying) { v.pause(); setIsPlaying(false); } else { v.play(); setIsPlaying(true); }
  }, [isPlaying]);

  const toggleMute = () => {
    const v = videoRef.current; if (!v) return;
    v.muted = !isMuted; setIsMuted(!isMuted);
  };

  const cycleSpeed = () => {
    const map: Record<number, 1 | 1.5 | 2> = { 1: 1.5, 1.5: 2, 2: 1 };
    const s = map[speed];
    if (videoRef.current) videoRef.current.playbackRate = s;
    setSpeed(s);
  };

  const seekTo = (e: React.MouseEvent<HTMLDivElement>) => {
    const v = videoRef.current; const bar = progressRef.current;
    if (!v || !bar || !v.duration) return;
    v.currentTime = Math.max(0, Math.min(1, (e.clientX - bar.getBoundingClientRect().left) / bar.offsetWidth)) * v.duration;
  };

  useEffect(() => {
    const v = videoRef.current; if (!v) return;
    const onTime  = () => setProgress(v.duration ? v.currentTime / v.duration : 0);
    const onEnded = () => setIsPlaying(false);
    v.addEventListener("timeupdate", onTime); v.addEventListener("ended", onEnded);
    return () => { v.removeEventListener("timeupdate", onTime); v.removeEventListener("ended", onEnded); };
  }, [videoSrc]);

  // ── Video player (shared between normal and expanded) ──────────────────────
  const VideoPlayer = (
    <div className="rounded-2xl border border-white/10 bg-[#0a0a0a] overflow-hidden flex-shrink-0">
      <div className="relative bg-black" style={{ aspectRatio: "16/9" }}>
        {videoSrc
          ? <>
              <video ref={videoRef} src={videoSrc} className="w-full h-full object-cover" playsInline />
              {/* Change video button — top-right hover overlay */}
              <button onClick={() => fileInputRef.current?.click()}
                className="absolute top-2 right-2 z-10 px-2.5 py-1 rounded-full border border-white/20 bg-black/60 backdrop-blur-sm text-[9px] font-mono tracking-widest uppercase opacity-0 hover:opacity-100 transition-opacity">
                ↺ change
              </button>
            </>
          : <button onClick={() => fileInputRef.current?.click()}
              className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-white/30 hover:text-white/60 transition-colors">
              <PlayIcon size={32} /><span className="text-[10px] tracking-[0.3em] uppercase">Load Video</span>
            </button>
        }
        <input ref={fileInputRef} type="file" accept="video/*" className="hidden" onChange={handleFile} />
      </div>
      <div className="px-4 pt-3 pb-4 flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <CtrlBtn onClick={() => fileInputRef.current?.click()}><PrevIcon /></CtrlBtn>
          <span className="text-[11px] tracking-widest opacity-50 font-mono">{videoSrc ? "1 / 1" : "— / —"}</span>
          <CtrlBtn onClick={() => fileInputRef.current?.click()}><NextIcon /></CtrlBtn>
        </div>
        <div className="flex items-center justify-between">
          <CtrlBtn onClick={togglePlay} disabled={!videoSrc}>{isPlaying ? <PauseIcon /> : <PlayIcon />}</CtrlBtn>
          <CtrlBtn onClick={toggleMute} disabled={!videoSrc}>{isMuted ? <MuteIcon /> : <SoundIcon />}</CtrlBtn>
          <CtrlBtn onClick={cycleSpeed} disabled={!videoSrc} wide>
            <span className="text-[10px] font-mono font-bold">{speed === 1 ? "1×" : speed === 1.5 ? "1.5×" : "2×"}</span>
          </CtrlBtn>
        </div>
        <div ref={progressRef} onClick={seekTo} className="relative w-full h-[3px] bg-white/15 rounded-full cursor-pointer">
          <div className="absolute left-0 top-0 h-full rounded-full bg-white/60" style={{ width: `${progress * 100}%` }} />
          <div className="absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-white shadow-[0_0_8px_rgba(255,255,255,0.5)]"
            style={{ left: `calc(${progress * 100}% - 6px)` }} />
        </div>
      </div>
    </div>
  );

  const RightPanel = (
    <div className="flex-shrink-0 flex flex-col gap-4"
      style={{ width: 460, position: "sticky", top: 0, height: "100vh", overflowY: "auto", paddingTop: 56, paddingBottom: 32 }}>

      {/* Compact brain panel */}
      <div className="relative rounded-2xl border border-white/10 bg-black overflow-hidden flex-shrink-0" style={{ height: 340 }}>
        <button onClick={() => setIsExpanded(true)}
          className="absolute top-4 left-4 z-20 flex items-center gap-2 px-4 py-2 rounded-full border border-white/25 bg-black/70 text-[11px] tracking-widest uppercase hover:bg-white/10 transition-colors backdrop-blur-sm">
          <ExpandIcon /> Expand Demo
        </button>
        <button className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full border border-white/20 bg-black/60 flex flex-col items-center justify-center gap-[4px] hover:bg-white/10 transition-colors">
          {[0,1,2].map(i => <span key={i} className="w-4 h-[1.5px] bg-white/60 rounded" />)}
        </button>
        <div className="absolute inset-0"><RandomHeatmapBrain isActive={isPlaying} /></div>
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 pointer-events-none">
          <div className="flex items-center gap-3 text-[11px] tracking-widest opacity-75">
            <span>Low</span>
            <div className="w-24 h-[5px] rounded-full" style={{ background: "linear-gradient(to right,#111,#8b0000,#cc2200,#ff4500,#ff8c00,#ffd700)" }} />
            <span>High</span>
          </div>
          <span className="text-[9px] tracking-[0.3em] uppercase opacity-40">Activity</span>
        </div>
      </div>

      {VideoPlayer}
    </div>
  );

  // ── Fullscreen expand overlay ───────────────────────────────────────────────
  const ExpandOverlay = (
    <AnimatePresence>
      {isExpanded && (
        <ExpandedView
          isPlaying={isPlaying}
          videoPlayer={VideoPlayer}
          frames={frames}
          extracting={extracting}
          videoSrc={videoSrc}
          onCollapse={() => setIsExpanded(false)}
          brainLoading={brainLoading}
          progress={progress}
        />
      )}
    </AnimatePresence>
  );

  return (
    <div className="flex flex-col w-full text-white">
      {ExpandOverlay}

      {/* ── TWO-COLUMN: intro + demo ── */}
      <div className="flex items-start w-full max-w-[1600px] mx-auto gap-10 px-10 pt-14">
        <div className="flex-1 flex flex-col gap-20 pb-24">

          <Section>
            <h2 className="text-4xl font-bold tracking-tight uppercase mb-5">Scale</h2>
            <p className="text-sm leading-8 opacity-60 max-w-xl font-mono">
              For decades, neuroscience has faced a major bottleneck: the need for new brain recordings for every new experiment. This has made understanding brain mechanisms slow, costly, and difficult to scale and integrate.
            </p>
            <p className="text-sm leading-8 opacity-60 max-w-xl font-mono mt-4">
              Today, Cortex leverages TRIBE v2 — a foundation model that acts as a digital mirror of human brain activity in response to sight, sound, and language. Months of lab work, compressed into seconds of computation.
            </p>
          </Section>

          <Section>
            <h2 className="text-3xl font-bold tracking-tight mb-6">TRIBE v2: a three-stage architecture</h2>
            <p className="text-sm opacity-50 font-mono max-w-xl mb-7">TRIBE v2 predicts brain activity through a three-stage pipeline:</p>
            {[
              { n: "1", title: "Tri-modal Encoding",    body: "Pretrained audio, video and text embeddings capture features shared by AI models and the human brain." },
              { n: "2", title: "Universal Integration", body: "A transformer learns representations shared across all stimuli, tasks, and individuals." },
              { n: "3", title: "Brain Mapping",         body: "A subject layer maps representations onto individual fMRI voxels — 3D pixels tracking neural activity via blood-oxygen changes." },
            ].map((item) => (
              <div key={item.n} className="flex gap-5 items-start mb-5">
                <span className="flex-shrink-0 w-7 h-7 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-[11px] font-bold">{item.n}</span>
                <p className="text-sm font-mono leading-7 opacity-60 max-w-lg">
                  <strong className="text-white font-bold">{item.title}: </strong>{item.body}
                </p>
              </div>
            ))}
          </Section>

          <Section>
            <div className="flex gap-10 items-start">
              {/* text */}
              <div className="flex-1 min-w-0">
                <span className="text-[10px] tracking-[0.5em] uppercase opacity-40 text-orange-400 mb-3 block">Use Case</span>
                <h2 className="text-3xl font-bold tracking-tight mb-5">Built for ads &amp; content</h2>
                <p className="text-sm leading-8 opacity-60 font-mono">
                  Every frame of a video ad fires specific neural circuits. Cortex simulates those circuits before a single dollar of media spend is committed. Upload a 30-second spot and receive voxel-level predictions of where viewer attention will spike, collapse, or trigger decision fatigue.
                </p>
              </div>
              {/* cards on the right */}
              <div className="grid grid-cols-2 gap-3 flex-shrink-0 w-[360px]">
              {[
                { icon: "◉", title: "Pre-flight validation",  body: "Score creative against 1,100h of fMRI ground-truth before launch." },
                { icon: "⊕", title: "Frame-level edits",      body: "Pinpoint the exact window causing attention dropout and fix it." },
                { icon: "◈", title: "Audience calibration",   body: "Predict BOLD response per demographic, not just aggregate." },
                { icon: "◎", title: "Real-time iteration",    body: "Re-score variants in seconds. Ship the one the brain actually wants." },
              ].map((card) => (
                <div key={card.title} className="p-5 rounded-2xl border border-white/8 bg-white/[0.03] hover:border-white/20 transition-colors">
                  <div className="text-lg mb-3 opacity-50">{card.icon}</div>
                  <div className="text-xs font-bold uppercase tracking-widest mb-2">{card.title}</div>
                  <div className="text-[11px] font-mono opacity-50 leading-relaxed">{card.body}</div>
                </div>
              ))}
              </div>
            </div>
          </Section>

        </div>
        {RightPanel}
      </div>

      {/* ── FULL-WIDTH: data + charts ── */}
      <div className="w-full border-t border-white/10 mt-4">

        {/* Stat pills — full bleed */}
        <Section>
          <div className="max-w-[1600px] mx-auto px-10 py-20 flex flex-col gap-8">
            <div className="flex flex-col gap-2">
              <span className="text-[10px] tracking-[0.5em] uppercase opacity-40 text-purple-400">Industry Impact</span>
              <h2 className="text-4xl font-bold tracking-tight">The trillion-dollar blind spot</h2>
            </div>
            <p className="text-sm leading-8 opacity-60 max-w-2xl font-mono">
              The global advertising industry spends over <strong className="text-white">$750B annually</strong> on creative production and media placement — yet <strong className="text-white">62% of video ads</strong> fail to generate measurable neural engagement. Brands are paying full price for content the brain simply ignores.
              Cortex closes this gap. By predicting BOLD response at the creative stage, teams eliminate the guesswork that currently burns an estimated <strong className="text-white">$2.1B per year</strong> in wasted production spend across Fortune 500 advertisers alone.
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <StatPill value="$2.1B"  label="Creative waste eliminated / yr" accent="#a855f7" />
              <StatPill value="73%"    label="Reduction in failed campaigns"  accent="#ef4444" />
              <StatPill value="3.4×"   label="Average ROAS uplift"            accent="#22c55e" />
              <StatPill value="11 sec" label="Avg time to re-score a variant" accent="#06b6d4" />
            </div>
          </div>
        </Section>

        {/* Line chart + ROI bars side by side */}
        <div className="border-t border-white/10">
          <div className="max-w-[1600px] mx-auto px-10 py-20 grid lg:grid-cols-2 gap-16 items-start">

            {/* Left: line chart */}
            <Section>
              <span className="text-[10px] tracking-[0.5em] uppercase opacity-40 text-red-400 mb-3 block">Cost Analysis</span>
              <h2 className="text-2xl font-bold tracking-tight mb-2">Cost per campaign over 12 months</h2>
              <p className="text-[12px] font-mono opacity-50 mb-8 leading-relaxed">
                Industry average production cost per validated ad creative versus Cortex-optimised pipelines. Data aggregated across 340 campaigns, 2024.
              </p>
              <CostLineChart />
            </Section>

            {/* Right: ROI bars */}
            <Section delay={0.15}>
              <span className="text-[10px] tracking-[0.5em] uppercase opacity-40 text-cyan-400 mb-3 block">Performance Data</span>
              <h2 className="text-2xl font-bold tracking-tight mb-2">Prediction-guided vs baseline</h2>
              <p className="text-[12px] font-mono opacity-50 mb-8 leading-relaxed">
                Across every measured metric, Cortex-guided campaigns consistently outperform unaided industry benchmarks.
              </p>
              <ROIBars />
            </Section>

          </div>
        </div>

        {/* How it works with the demo — full width */}
        <div className="border-t border-white/10">
          <Section>
            <div className="max-w-[1600px] mx-auto px-10 py-20 grid lg:grid-cols-2 gap-16 items-center">
              <div className="flex flex-col gap-5">
                <span className="text-[10px] tracking-[0.5em] uppercase opacity-40 text-green-400">Demo</span>
                <h2 className="text-3xl font-bold tracking-tight">Try it on your content</h2>
                <p className="text-sm leading-8 opacity-60 font-mono">
                  Upload any video ad or content clip using the panel above. The moment playback starts, the brain model activates — showing predicted BOLD signal intensity across 70,000+ cortical voxels in real time.
                </p>
                <p className="text-sm leading-8 opacity-60 font-mono">
                  Red-to-yellow regions indicate peak activation. Grey = resting baseline. Scroll up and use <strong className="text-white">Expand Demo</strong> to fill the screen with the neural model while monitoring content side-by-side.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { n: "01", title: "Upload",   body: "Drag in any .mp4, .mov or .webm. No size limit." },
                  { n: "02", title: "Play",     body: "Hit play — brain heatmap activates immediately." },
                  { n: "03", title: "Analyse",  body: "Scroll down for per-frame BOLD scores." },
                  { n: "04", title: "Iterate",  body: "Apply suggestions, re-upload, compare results." },
                ].map((step) => (
                  <div key={step.n} className="p-5 rounded-2xl border border-white/8 bg-white/[0.02] flex flex-col gap-3">
                    <span className="text-[10px] font-mono opacity-30 tracking-widest">{step.n}</span>
                    <div className="text-sm font-bold uppercase tracking-widest">{step.title}</div>
                    <div className="text-[11px] font-mono opacity-50 leading-relaxed">{step.body}</div>
                  </div>
                ))}
              </div>
            </div>
          </Section>
        </div>

      </div>

      {/* ── Frame analysis ── */}
      <AnimatePresence>
        {(frames.length > 0 || extracting) && (
          <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }} className="w-full border-t border-white/10 px-10 py-14">
            <div className="max-w-[1600px] mx-auto flex flex-col gap-8">
              <div className="flex items-baseline gap-4">
                <h3 className="text-2xl font-bold uppercase tracking-widest">Frame Analysis</h3>
                <span className="text-[10px] tracking-[0.3em] uppercase opacity-40 font-mono">Predicted BOLD · 5 keyframes</span>
              </div>
              {extracting ? (
                <div className="flex gap-4">{Array.from({ length: 5 }).map((_, i) =>
                  <div key={i} className="flex-1 aspect-video rounded-xl bg-white/5 animate-pulse border border-white/10" />)}</div>
              ) : (
                <div className="flex gap-5 overflow-x-auto pb-2">
                  {frames.map((frame, i) => (
                    <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.1, duration: 0.5 }} className="flex-shrink-0 w-[280px] flex flex-col gap-3">
                      <div className="relative rounded-xl overflow-hidden border border-white/10">
                        <img src={frame.dataUrl} alt={`Frame ${i + 1}`} className="w-full aspect-video object-cover" />
                        <div className="absolute top-2 right-2 px-2 py-1 rounded-lg bg-black/70 backdrop-blur-sm text-[11px] font-mono font-bold"
                          style={{ color: frame.suggestion.accent }}>{frame.score}%</div>
                        <div className="absolute bottom-2 left-2 px-2 py-1 rounded-lg bg-black/60 text-[10px] font-mono opacity-70">{frame.time.toFixed(1)}s</div>
                      </div>
                      <div className="rounded-xl border bg-black/40 p-4 flex flex-col gap-2" style={{ borderColor: `${frame.suggestion.accent}30` }}>
                        <span className="text-[11px] font-bold tracking-widest uppercase" style={{ color: frame.suggestion.accent }}>{frame.suggestion.label}</span>
                        <p className="text-[11px] font-mono opacity-55 leading-relaxed">{frame.suggestion.desc}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ── Icons + CtrlBtn ───────────────────────────────────────────────────────────
function CtrlBtn({ children, onClick, title, disabled = false, wide = false }: {
  children: React.ReactNode; onClick: () => void; title?: string; disabled?: boolean; wide?: boolean;
}) {
  return (
    <button onClick={onClick} title={title} disabled={disabled}
      className={`flex items-center justify-center rounded-full border border-white/20 bg-white/5 hover:bg-white/15 transition-colors disabled:opacity-30 disabled:cursor-not-allowed ${wide ? "w-12 h-9" : "w-9 h-9"}`}>
      {children}
    </button>
  );
}
const sv = (w = 14) => ({ width: w, height: w, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 2 } as const);
function ExpandIcon()   { return <svg {...sv(13)}><polyline points="15 3 21 3 21 9"/><polyline points="9 21 3 21 3 15"/><line x1="21" y1="3" x2="14" y2="10"/><line x1="3" y1="21" x2="10" y2="14"/></svg>; }
function CollapseIcon() { return <svg {...sv(13)}><polyline points="4 14 10 14 10 20"/><polyline points="20 10 14 10 14 4"/><line x1="10" y1="14" x2="3" y2="21"/><line x1="21" y1="3" x2="14" y2="10"/></svg>; }
function PlayIcon({ size = 14 }: { size?: number }) { return <svg {...sv(size)}><polygon points="5 3 19 12 5 21 5 3"/></svg>; }
function PauseIcon()    { return <svg {...sv()}><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>; }
function MuteIcon()     { return <svg {...sv()}><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><line x1="23" y1="9" x2="17" y2="15"/><line x1="17" y1="9" x2="23" y2="15"/></svg>; }
function SoundIcon()    { return <svg {...sv()}><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/></svg>; }
function PrevIcon()     { return <svg {...sv()}><polygon points="19 20 9 12 19 4 19 20"/><line x1="5" y1="19" x2="5" y2="5"/></svg>; }
function NextIcon()     { return <svg {...sv()}><polygon points="5 4 15 12 5 20 5 4"/><line x1="19" y1="5" x2="19" y2="19"/></svg>; }
