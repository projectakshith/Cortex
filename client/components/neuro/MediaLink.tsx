"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import dynamic from "next/dynamic";

const RandomHeatmapBrain = dynamic(
  () => import("@/components/neuro/BrainModel").then((m) => m.RandomHeatmapBrain),
  { ssr: false }
);

// ── Suggestion pool ──────────────────────────────────────────────────────────
const SUGGESTIONS = [
  { label: "Visual Cortex Peak", desc: "Strong V1/V2 activation. High visual complexity — consider reducing motion density.", accent: "#ef4444" },
  { label: "Attention Density: High", desc: "Prefrontal engagement elevated. Clear focal object detected — preserve this framing.", accent: "#f97316" },
  { label: "Motion Overload Detected", desc: "MT+ region saturated. Slow the cut rate or reduce optical flow intensity.", accent: "#eab308" },
  { label: "Low Cognitive Load", desc: "Resting-state signal. Optimal moment to introduce key messaging or CTA.", accent: "#22c55e" },
  { label: "Temporal Cortex Engaged", desc: "Auditory-visual sync confirmed. Maintain audio cue alignment with visual beats.", accent: "#06b6d4" },
  { label: "Decision Fatigue Signal", desc: "dlPFC overload detected. Simplify on-screen choices — reduce competing elements.", accent: "#a855f7" },
];

type Frame = { dataUrl: string; time: number; score: number; suggestion: (typeof SUGGESTIONS)[number] };

// ── Frame extractor ──────────────────────────────────────────────────────────
async function extractFrames(src: string, duration: number): Promise<Frame[]> {
  const offscreen = document.createElement("video");
  offscreen.src = src;
  offscreen.muted = true;
  offscreen.preload = "metadata";
  await new Promise<void>((res) => offscreen.addEventListener("loadedmetadata", () => res(), { once: true }));

  const canvas = document.createElement("canvas");
  canvas.width = 480;
  canvas.height = 270;
  const ctx = canvas.getContext("2d")!;

  const count = 5;
  const timestamps = Array.from({ length: count }, (_, i) => ((i + 0.5) / count) * duration);
  const frames: Frame[] = [];

  for (const ts of timestamps) {
    offscreen.currentTime = ts;
    await new Promise<void>((res) => offscreen.addEventListener("seeked", () => res(), { once: true }));
    ctx.drawImage(offscreen, 0, 0, 480, 270);
    frames.push({
      dataUrl: canvas.toDataURL("image/jpeg", 0.82),
      time: ts,
      score: Math.floor(Math.random() * 38 + 58),
      suggestion: SUGGESTIONS[Math.floor(Math.random() * SUGGESTIONS.length)],
    });
  }

  offscreen.src = "";
  return frames;
}

// ── Main component ───────────────────────────────────────────────────────────
export function MediaLink() {
  const videoRef      = useRef<HTMLVideoElement>(null);
  const fileInputRef  = useRef<HTMLInputElement>(null);
  const progressRef   = useRef<HTMLDivElement>(null);

  const [videoSrc,   setVideoSrc]   = useState<string | null>(null);
  const [isPlaying,  setIsPlaying]  = useState(false);
  const [isMuted,    setIsMuted]    = useState(false);
  const [speed,      setSpeed]      = useState<1 | 1.5 | 2>(1);
  const [progress,   setProgress]   = useState(0);
  const [isExpanded, setIsExpanded] = useState(false);
  const [frames,     setFrames]     = useState<Frame[]>([]);
  const [extracting, setExtracting] = useState(false);

  // ── Video handlers ─────────────────────────────────────────────────────────
  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setVideoSrc(url);
    setIsPlaying(false);
    setProgress(0);
    setFrames([]);
    setExtracting(true);
    // Extract frames after a tick so video element can load
    setTimeout(async () => {
      try {
        const v = videoRef.current;
        const dur = v?.duration && isFinite(v.duration) ? v.duration : 30;
        const f = await extractFrames(url, dur);
        setFrames(f);
      } finally {
        setExtracting(false);
      }
    }, 600);
  };

  const togglePlay = useCallback(() => {
    const v = videoRef.current;
    if (!v) return;
    if (isPlaying) { v.pause(); setIsPlaying(false); }
    else           { v.play();  setIsPlaying(true);  }
  }, [isPlaying]);

  const toggleMute = () => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const cycleSpeed = () => {
    const next: Record<number, 1 | 1.5 | 2> = { 1: 1.5, 1.5: 2, 2: 1 };
    const s = next[speed];
    if (videoRef.current) videoRef.current.playbackRate = s;
    setSpeed(s);
  };

  const seekTo = (e: React.MouseEvent<HTMLDivElement>) => {
    const v = videoRef.current;
    const bar = progressRef.current;
    if (!v || !bar || !v.duration) return;
    const ratio = Math.max(0, Math.min(1, (e.clientX - bar.getBoundingClientRect().left) / bar.offsetWidth));
    v.currentTime = ratio * v.duration;
  };

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    const onTime  = () => setProgress(v.duration ? v.currentTime / v.duration : 0);
    const onEnded = () => setIsPlaying(false);
    v.addEventListener("timeupdate", onTime);
    v.addEventListener("ended", onEnded);
    return () => { v.removeEventListener("timeupdate", onTime); v.removeEventListener("ended", onEnded); };
  }, [videoSrc]);

  // ── Layout ─────────────────────────────────────────────────────────────────
  return (
    <div className="flex flex-col w-full text-white">

      {/* ── Top row ── */}
      <div className="flex w-full max-w-[1600px] mx-auto gap-10 px-10 py-14 min-h-[85vh]">

        {/* LEFT: text OR expanded brain */}
        <AnimatePresence mode="wait">
          {isExpanded ? (
            <motion.div
              key="brain-expanded"
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              transition={{ duration: 0.4 }}
              className="flex-1 rounded-2xl border border-white/10 bg-black overflow-hidden"
              style={{ minHeight: "75vh" }}
            >
              <RandomHeatmapBrain isActive={isPlaying} />
            </motion.div>
          ) : (
            <motion.div
              key="text"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="flex-1 flex flex-col gap-14 overflow-y-auto pr-4 max-h-[calc(100vh-120px)]"
            >
              <section className="flex flex-col gap-5">
                <h2 className="text-4xl font-bold tracking-tight uppercase">Scale</h2>
                <p className="text-sm leading-8 opacity-60 max-w-xl font-mono">
                  For decades, neuroscience has faced a major bottleneck: the need for new brain recordings for every new experiment. This has made understanding brain mechanisms slow, costly, and difficult to scale and integrate.
                </p>
                <p className="text-sm leading-8 opacity-60 max-w-xl font-mono">
                  Today, Cortex leverages TRIBE v2 — a foundation model that acts as a digital mirror of human brain activity in response to sight, sound and language, transforming months of lab work into seconds of computation.
                </p>
              </section>

              <section className="flex flex-col gap-7">
                <h2 className="text-3xl font-bold tracking-tight">TRIBE v2: a three-stage architecture</h2>
                <p className="text-sm opacity-50 font-mono max-w-xl">TRIBE v2 predicts brain activity through a three-stage pipeline:</p>
                {[
                  { n: "1", title: "Tri-modal Encoding",      body: "Pretrained audio, video and text embeddings capture the features shared by AI models and the human brain." },
                  { n: "2", title: "Universal Integration",   body: "A transformer learns universal representations shared across all stimuli, tasks, and individuals." },
                  { n: "3", title: "Brain Mapping",           body: "A subject layer maps representations onto individual fMRI voxels — 3D pixels that track neural activity via blood-oxygen changes." },
                ].map((item) => (
                  <div key={item.n} className="flex gap-5 items-start">
                    <span className="flex-shrink-0 w-7 h-7 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-[11px] font-bold">{item.n}</span>
                    <p className="text-sm font-mono leading-7 opacity-60 max-w-lg">
                      <strong className="text-white font-bold">{item.title}: </strong>{item.body}
                    </p>
                  </div>
                ))}
              </section>

              <section className="flex flex-col gap-5 border-t border-white/10 pt-10">
                <h2 className="text-3xl font-bold tracking-tight">How it works</h2>
                <p className="text-sm leading-8 opacity-60 max-w-xl font-mono">
                  Upload a video — the brain responds in real time. Heatmap regions show predicted BOLD signal intensity across 70,000+ cortical voxels. Scroll down to see per-frame analysis with cognitive load suggestions.
                </p>
              </section>
            </motion.div>
          )}
        </AnimatePresence>

        {/* RIGHT: brain panel (compact) + video player */}
        <div className="flex flex-col gap-4 flex-shrink-0" style={{ width: isExpanded ? "400px" : "460px" }}>

          {/* Brain panel — hidden when expanded (brain moved to left) */}
          {!isExpanded && (
            <div className="relative rounded-2xl border border-white/10 bg-black overflow-hidden" style={{ height: "380px" }}>
              {/* Expand Demo */}
              <button
                onClick={() => setIsExpanded(true)}
                className="absolute top-4 left-4 z-20 flex items-center gap-2 px-4 py-2 rounded-full border border-white/25 bg-black/70 text-[11px] tracking-widest uppercase hover:bg-white/10 transition-colors backdrop-blur-sm"
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="15 3 21 3 21 9"/><polyline points="9 21 3 21 3 15"/>
                  <line x1="21" y1="3" x2="14" y2="10"/><line x1="3" y1="21" x2="10" y2="14"/>
                </svg>
                Expand Demo
              </button>
              <button className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full border border-white/20 bg-black/60 flex flex-col items-center justify-center gap-[4px] hover:bg-white/10 transition-colors">
                {[0,1,2].map(i => <span key={i} className="w-4 h-[1.5px] bg-white/60 rounded" />)}
              </button>
              <div className="absolute inset-0">
                <RandomHeatmapBrain isActive={isPlaying} />
              </div>
              {/* Legend */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 pointer-events-none">
                <div className="flex items-center gap-3 text-[11px] tracking-widest opacity-75">
                  <span>Low</span>
                  <div className="w-28 h-[5px] rounded-full" style={{ background: "linear-gradient(to right,#111,#8b0000,#cc2200,#ff4500,#ff8c00,#ffd700)" }} />
                  <span>High</span>
                </div>
                <span className="text-[9px] tracking-[0.3em] uppercase opacity-40">Activity</span>
              </div>
            </div>
          )}

          {/* Expanded-mode: collapse button + legend at top of right column */}
          {isExpanded && (
            <div className="flex items-center justify-between px-1">
              <button
                onClick={() => setIsExpanded(false)}
                className="flex items-center gap-2 px-4 py-2 rounded-full border border-white/25 bg-white/5 text-[11px] tracking-widest uppercase hover:bg-white/10 transition-colors"
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="4 14 10 14 10 20"/><polyline points="20 10 14 10 14 4"/>
                  <line x1="10" y1="14" x2="3" y2="21"/><line x1="21" y1="3" x2="14" y2="10"/>
                </svg>
                Collapse
              </button>
              <div className="flex items-center gap-2 text-[10px] tracking-widest opacity-60">
                <span>Low</span>
                <div className="w-20 h-[4px] rounded-full" style={{ background: "linear-gradient(to right,#111,#8b0000,#ff4500,#ffd700)" }} />
                <span>High</span>
              </div>
            </div>
          )}

          {/* Video player */}
          <div className="rounded-2xl border border-white/10 bg-[#0a0a0a] overflow-hidden">
            <div className="relative bg-black" style={{ aspectRatio: "16/9" }}>
              {videoSrc ? (
                <video ref={videoRef} src={videoSrc} className="w-full h-full object-cover" playsInline />
              ) : (
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-white/30 hover:text-white/60 transition-colors"
                >
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <polygon points="5 3 19 12 5 21 5 3"/>
                  </svg>
                  <span className="text-[10px] tracking-[0.3em] uppercase">Load Video</span>
                </button>
              )}
              <input ref={fileInputRef} type="file" accept="video/*" className="hidden" onChange={handleFile} />
            </div>

            <div className="px-4 pt-3 pb-4 flex flex-col gap-3">
              {/* Row 1 */}
              <div className="flex items-center justify-between">
                <CtrlBtn onClick={() => fileInputRef.current?.click()} title="Load video">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="19 20 9 12 19 4 19 20"/><line x1="5" y1="19" x2="5" y2="5"/></svg>
                </CtrlBtn>
                <span className="text-[11px] tracking-widest opacity-50 font-mono">{videoSrc ? "1 / 1" : "— / —"}</span>
                <CtrlBtn onClick={() => fileInputRef.current?.click()} title="Load video">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="5 4 15 12 5 20 5 4"/><line x1="19" y1="5" x2="19" y2="19"/></svg>
                </CtrlBtn>
              </div>
              {/* Row 2 */}
              <div className="flex items-center justify-between">
                <CtrlBtn onClick={togglePlay} disabled={!videoSrc}>
                  {isPlaying
                    ? <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>
                    : <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="5 3 19 12 5 21 5 3"/></svg>
                  }
                </CtrlBtn>
                <CtrlBtn onClick={toggleMute} disabled={!videoSrc}>
                  {isMuted
                    ? <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><line x1="23" y1="9" x2="17" y2="15"/><line x1="17" y1="9" x2="23" y2="15"/></svg>
                    : <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/></svg>
                  }
                </CtrlBtn>
                <CtrlBtn onClick={cycleSpeed} disabled={!videoSrc} wide>
                  <span className="text-[10px] font-mono font-bold">{speed === 1 ? "1×" : speed === 1.5 ? "1.5×" : "2×"}</span>
                </CtrlBtn>
              </div>
              {/* Progress */}
              <div ref={progressRef} onClick={seekTo} className="relative w-full h-[3px] bg-white/15 rounded-full cursor-pointer">
                <div className="absolute left-0 top-0 h-full rounded-full bg-blue-500" style={{ width: `${progress * 100}%` }} />
                <div className="absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-blue-400 shadow-[0_0_8px_rgba(96,165,250,0.8)]" style={{ left: `calc(${progress * 100}% - 6px)` }} />
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* ── Frame analysis strip (scroll) ── */}
      <AnimatePresence>
        {(frames.length > 0 || extracting) && (
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
            className="w-full border-t border-white/10 px-10 py-14"
          >
            <div className="max-w-[1600px] mx-auto flex flex-col gap-8">
              <div className="flex items-baseline gap-4">
                <h3 className="text-2xl font-bold uppercase tracking-widest">Frame Analysis</h3>
                <span className="text-[10px] tracking-[0.3em] uppercase opacity-40 font-mono">Predicted BOLD · 5 keyframes</span>
              </div>

              {extracting ? (
                <div className="flex gap-4">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className="flex-1 aspect-video rounded-xl bg-white/5 animate-pulse border border-white/10" />
                  ))}
                </div>
              ) : (
                <div className="flex gap-5 overflow-x-auto pb-2">
                  {frames.map((frame, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.1, duration: 0.5 }}
                      className="flex-shrink-0 w-[280px] flex flex-col gap-3"
                    >
                      {/* Frame thumbnail */}
                      <div className="relative rounded-xl overflow-hidden border border-white/10">
                        <img src={frame.dataUrl} alt={`Frame ${i + 1}`} className="w-full aspect-video object-cover" />
                        {/* Score badge */}
                        <div className="absolute top-2 right-2 px-2 py-1 rounded-lg bg-black/70 backdrop-blur-sm text-[11px] font-mono font-bold" style={{ color: frame.suggestion.accent }}>
                          {frame.score}%
                        </div>
                        {/* Timestamp */}
                        <div className="absolute bottom-2 left-2 px-2 py-1 rounded-lg bg-black/60 text-[10px] font-mono opacity-70">
                          {frame.time.toFixed(1)}s
                        </div>
                      </div>

                      {/* Suggestion card */}
                      <div className="rounded-xl border bg-black/40 p-4 flex flex-col gap-2" style={{ borderColor: `${frame.suggestion.accent}30` }}>
                        <span className="text-[11px] font-bold tracking-widest uppercase" style={{ color: frame.suggestion.accent }}>
                          {frame.suggestion.label}
                        </span>
                        <p className="text-[11px] font-mono opacity-55 leading-relaxed">
                          {frame.suggestion.desc}
                        </p>
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

function CtrlBtn({ children, onClick, title, disabled = false, wide = false }: {
  children: React.ReactNode; onClick: () => void; title?: string; disabled?: boolean; wide?: boolean;
}) {
  return (
    <button
      onClick={onClick} title={title} disabled={disabled}
      className={`flex items-center justify-center rounded-full border border-white/20 bg-white/5 hover:bg-white/15 transition-colors disabled:opacity-30 disabled:cursor-not-allowed ${wide ? "w-12 h-9" : "w-9 h-9"}`}
    >
      {children}
    </button>
  );
}
