"use client";

import Link from "next/link";
import Beams from "@/components/ui/Beams";
import { LightRays } from "@/components/ui/LightRays";
import { BrainModel } from "@/components/neuro/BrainModel";
import { motion, useScroll, useTransform } from "framer-motion";

export default function RootPage() {
  const { scrollY } = useScroll();
  const navY = useTransform(scrollY, [0, 200], [-100, 0]);
  const navOpacity = useTransform(scrollY, [0, 200], [0, 1]);

  return (
    <main className="relative min-h-screen bg-[#030303] text-white font-rostex overflow-x-hidden">
      {/* Dynamic Native Cortex Engine Background */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 opacity-40">
          <Beams
            beamWidth={2}
            beamHeight={40}
            beamNumber={40}
            lightColor="#ffffff"
            speed={2}
            noiseIntensity={1.75}
            scale={0.2}
            rotation={30}
          />
        </div>
        <div className="absolute inset-0 z-10">
          <LightRays
            raysOrigin="top-center"
            raysColor="#ffffff"
            raysSpeed={0.5}
            lightSpread={1.0}
            rayLength={3}
            followMouse={true}
            mouseInfluence={0.1}
            className="opacity-40 blend-screen mix-blend-screen"
          />
        </div>
      </div>

      <motion.nav 
        style={{ y: navY, opacity: navOpacity }}
        className="fixed top-0 w-full z-50 flex items-center justify-between px-12 py-8 border-b border-white/5 backdrop-blur-md bg-black/50"
      >
        <div className="flex items-center gap-12">
          <Link href="/">
            <h1 className="text-xl font-bold uppercase tracking-[0.4em] hover:opacity-80 transition-opacity">CORTEX</h1>
          </Link>
        </div>
        <div className="flex items-center gap-10 text-[10px] uppercase tracking-[0.2em] font-bold opacity-60">
          <Link href="/engine" className="hover:text-white transition-all cursor-pointer">Engine</Link>
          <Link href="/docs" className="hover:text-white transition-all cursor-pointer">Docs</Link>
          <a href="https://github.com/projectakshith/Cortex" target="_blank" rel="noreferrer" className="hover:text-white transition-all cursor-pointer">GitHub</a>
        </div>
      </motion.nav>

      <div className="relative z-10 w-full pointer-events-none">
        {/* Core Identity Section */}
        <section className="min-h-[85vh] flex flex-col items-center justify-center relative overflow-hidden">
          <motion.h1 
            initial={{ opacity: 0, y: 100, scale: 0.9 }}
            animate={{ opacity: 0.9, y: 0, scale: 1 }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            className="text-7xl md:text-[8rem] lg:text-[10rem] font-bold uppercase tracking-[0.3em] mb-4 text-center ml-[0.3em] relative z-10 mix-blend-screen pointer-events-none text-white drop-shadow-2xl"
          >
            CORTEX
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.6 }}
            transition={{ delay: 1, duration: 1 }}
            className="text-xs md:text-sm tracking-[0.3em] uppercase text-center mb-16 px-4"
          >
            Zero cognitive load, by design.
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.5, duration: 0.8 }}
            className="pointer-events-auto"
          >
            <Link href="/engine" className="px-10 py-5 bg-white/[0.03] border border-white/10 hover:bg-white/10 hover:border-white/30 hover:-translate-y-1 transition-all rounded-full text-xs tracking-[0.2em] uppercase backdrop-blur-sm pointer-events-auto">
              Launch Engine
            </Link>
          </motion.div>
        </section>

        {/* Narrative Section derived from README */}
        <section className="min-h-screen flex flex-col justify-center px-12 md:px-24 w-full max-w-7xl mx-auto py-24 pointer-events-auto overflow-hidden">
          <div className="grid lg:grid-cols-2 gap-12 items-center w-full mb-24">
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="flex flex-col items-start text-left"
            >
              <h2 className="text-2xl md:text-4xl font-bold uppercase tracking-[0.3em] mb-12">What is Cortex?</h2>
              <p className="text-sm md:text-lg leading-loose opacity-60 font-mono border-l border-white/20 pl-8">
                An in-silico cognitive load balancer and auto-remediation engine for UI/UX code. It replaces subjective design opinions with hard neuroscience data, parsing visual telemetry directly through simulated neurological strain.
              </p>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
              className="w-full h-[300px] md:h-[500px] relative pointer-events-auto flex items-center justify-center"
            >
              <BrainModel />
            </motion.div>
          </div>

          <div className="grid md:grid-cols-2 gap-12 w-full">
            <motion.div 
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6 }}
              className="p-10 border border-white/5 bg-black/40 rounded-[2rem] backdrop-blur-md hover:border-white/20 transition-all group pointer-events-auto"
            >
              <h3 className="text-2xl font-bold uppercase tracking-[0.2em] mb-6 opacity-80 group-hover:opacity-100 transition-opacity">1. Predict</h3>
              <p className="text-xs md:text-sm opacity-50 font-mono leading-loose">
                We feed your UI components directly into our PyTorch Brain Node pipeline to predict the exact BOLD signals that would fire in a real human brain when perceiving your interface geometry.
              </p>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="p-10 border border-white/5 bg-black/40 rounded-[2rem] backdrop-blur-md hover:border-white/20 transition-all group pointer-events-auto"
            >
              <h3 className="text-2xl font-bold uppercase tracking-[0.2em] mb-6 opacity-80 group-hover:opacity-100 transition-opacity">2. Refactor</h3>
              <p className="text-xs md:text-sm opacity-50 font-mono leading-loose">
                If signals indicate severe visual cortex overload or decision fatigue, the autonomous Orchestrator agent kicks in—rewriting your JSX structural trees over the wire into zero-friction layouts.
              </p>
            </motion.div>
          </div>
        </section>

        {/* TRIBE v2 Deep Dive */}
        <section className="min-h-screen flex flex-col items-center justify-center px-12 md:px-24 border-t border-dashed border-white/10 py-24">
          <motion.p 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 0.4 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            className="text-[10px] tracking-[0.5em] uppercase mb-6"
          >
            Built Upon
          </motion.p>
          
          <motion.h2 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
            className="text-5xl md:text-8xl font-bold uppercase tracking-[0.2em] text-center mb-12"
          >
            Meta TRIBE v2
          </motion.h2>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 0.5, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-xs md:text-sm text-center max-w-2xl font-mono leading-loose mb-16"
          >
            Our neuroscience logic leverages the Trimodal Brain Encoder, an architectural breakthrough trained on over 1,100 hours of fMRI data capable of predicting parallel activity across 70,000 specific brain voxels in real-time.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 0.4 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.6 }}
            className="flex gap-4 mix-blend-screen grayscale"
          >
            <div className="h-[2px] w-12 bg-white/50 rounded-full" />
            <div className="h-[2px] w-24 bg-white/50 rounded-full" />
            <div className="h-[2px] w-12 bg-white/50 rounded-full" />
          </motion.div>
        </section>
      </div>
    </main>
  );
}
