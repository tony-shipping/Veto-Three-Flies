import React, { useState, useEffect } from 'react';
import { NeuralMapCanvas } from './components/NeuralMapCanvas';
import { SpectrogramCanvas } from './components/SpectrogramCanvas';
import { RadarCanvas } from './components/RadarCanvas';
import { EcgLine } from './components/EcgLine';
import { ScentLabModal } from './components/ScentLabModal';
import { LedgerTableModal } from './components/LedgerTableModal';
import { LandingPage } from './components/LandingPage';
import { SwarmVideoFeed } from './components/SwarmVideoFeed';
import { INITIAL_FIXTURES } from './data/fixtures';
import { processLaunch } from './utils/engine';
import { Decision, Launch } from './types';
import { FlaskConical, Table, Play, RefreshCw, Terminal, CheckCircle2, ShieldAlert, Pause, Sparkles, Globe, ShieldCheck } from 'lucide-react';

export default function App() {
  const [activeView, setActiveView] = useState<'website' | 'terminal'>('website');
  const [terminalDisplayMode, setTerminalDisplayMode] = useState<'video' | 'schematic'>('video');
  const [headerLatency, setHeaderLatency] = useState<number>(4.2);
  const [fixtures, setFixtures] = useState<Launch[]>(INITIAL_FIXTURES);
  const [decisions, setDecisions] = useState<Decision[]>([]);
  const [alreadyLandedIds, setAlreadyLandedIds] = useState<Set<string>>(new Set());
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isAutoCycling, setIsAutoCycling] = useState<boolean>(true);

  // Modals
  const [isLabOpen, setIsLabOpen] = useState<boolean>(false);
  const [isLedgerOpen, setIsLedgerOpen] = useState<boolean>(false);

  // Telemetry state
  const [lastEvaluated, setLastEvaluated] = useState<Decision | null>(null);

  // Dynamic header latency
  useEffect(() => {
    const timer = setInterval(() => {
      setHeaderLatency(+(3.8 + Math.random() * 0.7).toFixed(1));
    }, 1500);
    return () => clearInterval(timer);
  }, []);

  // Initialize initial evaluations from fixtures
  useEffect(() => {
    const landed = new Set<string>();
    const initialDecisions: Decision[] = [];
    INITIAL_FIXTURES.forEach((l) => {
      const d = processLaunch(l, landed);
      if (d.hunter === 'LANDED') {
        landed.add(d.launch_id);
      }
      initialDecisions.push(d);
    });
    setAlreadyLandedIds(landed);
    setDecisions(initialDecisions);
    setLastEvaluated(initialDecisions[0] || null);
  }, []);

  // Step cycle function
  const handleStepCycle = () => {
    if (fixtures.length === 0) return;
    const launchToEval = fixtures[currentIndex % fixtures.length];
    const newDecision = processLaunch(launchToEval, alreadyLandedIds);

    if (newDecision.hunter === 'LANDED') {
      setAlreadyLandedIds((prev) => new Set(prev).add(newDecision.launch_id));
    }

    setDecisions((prev) => [newDecision, ...prev]);
    setLastEvaluated(newDecision);
    setCurrentIndex((prev) => prev + 1);
  };

  // Auto cycling timer
  useEffect(() => {
    if (!isAutoCycling) return;
    const timer = setInterval(() => {
      handleStepCycle();
    }, 3800);
    return () => clearInterval(timer);
  }, [isAutoCycling, fixtures, currentIndex, alreadyLandedIds]);

  const handleInjectCustomLaunch = (customLaunch: Launch) => {
    setFixtures((prev) => [customLaunch, ...prev]);
    const newDecision = processLaunch(customLaunch, alreadyLandedIds);
    if (newDecision.hunter === 'LANDED') {
      setAlreadyLandedIds((prev) => new Set(prev).add(newDecision.launch_id));
    }
    setDecisions((prev) => [newDecision, ...prev]);
    setLastEvaluated(newDecision);
  };

  return (
    <div className="min-h-screen bg-[#030712] text-[#e0f2fe] font-['Rajdhani',sans-serif] selection:bg-cyan-500 selection:text-black">
      {/* Background Grid Pattern */}
      <div 
        className="fixed inset-0 pointer-events-none opacity-40 z-0"
        style={{
          backgroundImage: `
            radial-gradient(circle at 50% 10%, rgba(255, 0, 127, 0.12) 0%, transparent 45%),
            radial-gradient(circle at 50% 70%, rgba(0, 245, 255, 0.09) 0%, transparent 55%),
            linear-gradient(rgba(0, 245, 255, 0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0, 245, 255, 0.04) 1px, transparent 1px)
          `,
          backgroundSize: '100% 100%, 100% 100%, 32px 32px, 32px 32px'
        }}
      />

      <div className="relative z-10 max-w-[1520px] mx-auto p-3 flex flex-col min-h-screen gap-3">
        
        {/* ================= GLOBAL TOP NAVIGATION BAR ================= */}
        <header className="bg-[#060e1a]/95 border border-cyan-500/35 rounded-lg px-4 py-2.5 shadow-[0_0_20px_rgba(0,245,255,0.08)] flex flex-wrap items-center justify-between gap-3 relative before:absolute before:-top-px before:-left-px before:w-3 before:h-3 before:border-t-2 before:border-l-2 before:border-cyan-400 after:absolute after:-bottom-px after:-right-px after:w-3 after:h-3 after:border-b-2 after:border-r-2 after:border-cyan-400">
          
          {/* Logo & Protocol Title */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-1 rounded border border-pink-500/50 bg-gradient-to-r from-pink-950/40 via-purple-950/30 to-pink-950/40 shadow-[0_0_15px_rgba(255,0,127,0.3)]">
              {/* Fly Icon */}
              <svg className="w-5 h-5 text-pink-500 drop-shadow-[0_0_8px_#ff007f]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <ellipse cx="12" cy="11" rx="2.5" ry="3" fill="currentColor" fillOpacity="0.2" />
                <circle cx="12" cy="5.5" r="1.8" />
                <circle cx="10" cy="5" r="0.8" fill="#ff1133" />
                <circle cx="14" cy="5" r="0.8" fill="#ff1133" />
                <path d="M11 3.8 L8.5 1.5 M13 3.8 L15.5 1.5" />
                <ellipse cx="12" cy="18" rx="2.2" ry="4" strokeWidth="1.5" />
                <line x1="10.5" y1="16" x2="13.5" y2="16" strokeWidth="1.2" />
                <line x1="10.2" y1="18.5" x2="13.8" y2="18.5" strokeWidth="1.2" />
                <path d="M10 9 C4 5, 2 12, 10 13 Z" strokeWidth="1.3" fill="currentColor" fillOpacity="0.15" />
                <path d="M14 9 C20 5, 22 12, 14 13 Z" strokeWidth="1.3" fill="currentColor" fillOpacity="0.15" />
              </svg>

              <span className="font-['Orbitron'] font-black text-sm tracking-[0.2em] text-pink-500 drop-shadow-[0_0_8px_#ff007f]">
                VETO DROSOPHILA
              </span>
            </div>

            <div className="hidden sm:flex flex-col text-left">
              <span className="font-mono text-[9px] text-cyan-400 tracking-wider">CONNECTOME SWARM PROTOCOL</span>
              <span className="font-mono text-[9px] text-slate-400">ROBINHOOD MEMPOOL // WASM CORE</span>
            </div>
          </div>

          {/* VIEW SWITCHER TABS: WEBSITE <-> TERMINAL */}
          <div className="flex items-center p-1 rounded-md border border-cyan-500/30 bg-[#030712] shadow-inner">
            <button
              onClick={() => setActiveView('website')}
              className={`flex items-center gap-2 px-4 py-1.5 rounded font-['Orbitron'] text-xs tracking-wider font-semibold transition-all ${
                activeView === 'website'
                  ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-[0_0_15px_rgba(255,0,127,0.5)]'
                  : 'text-slate-400 hover:text-cyan-300'
              }`}
            >
              <Globe className="w-3.5 h-3.5" />
              <span>OVERVIEW / WEBSITE</span>
            </button>

            <button
              onClick={() => setActiveView('terminal')}
              className={`flex items-center gap-2 px-4 py-1.5 rounded font-['Orbitron'] text-xs tracking-wider font-semibold transition-all ${
                activeView === 'terminal'
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-black shadow-[0_0_15px_rgba(0,245,255,0.6)] font-bold'
                  : 'text-slate-400 hover:text-cyan-300'
              }`}
            >
              <Terminal className="w-3.5 h-3.5" />
              <span>COMMAND TERMINAL</span>
            </button>
          </div>

          {/* Right Status Indicator */}
          <div className="flex items-center gap-3">
            <span className="hidden md:inline-flex items-center gap-1.5 text-xs font-mono text-slate-400">
              <span>LATENCY:</span>
              <span className="text-cyan-400 font-bold transition-all duration-300">{headerLatency}ms</span>
            </span>
            <span className="flex items-center gap-1.5 text-pink-500 font-mono text-xs drop-shadow-[0_0_6px_#ff007f] px-2.5 py-1 rounded bg-pink-950/40 border border-pink-500/30">
              <span className="w-2 h-2 rounded-full bg-pink-500 animate-pulse shadow-[0_0_8px_#ff007f]" />
              NET: LIVE
            </span>
          </div>
        </header>

        {/* CONDITIONALLY RENDER WEBSITE OR TERMINAL HUD */}
        {activeView === 'website' ? (
          <LandingPage onLaunchTerminal={() => setActiveView('terminal')} />
        ) : (
          /* MAIN HUD 3-COLUMN LAYOUT */
          <div className="grid grid-cols-1 lg:grid-cols-[440px_1fr_360px] gap-3 flex-1 items-start">
          
          {/* ================= LEFT COLUMN ================= */}
          <div className="flex flex-col gap-3">
            
            {/* Header & Spectrogram */}
            <div className="bg-[#060e1a]/95 border border-cyan-500/35 rounded p-3 shadow-[0_0_15px_rgba(0,245,255,0.06)] relative before:absolute before:-top-px before:-left-px before:w-2 before:h-2 before:border-t-2 before:border-l-2 before:border-cyan-400 after:absolute after:-bottom-px after:-right-px after:w-2 after:h-2 after:border-b-2 after:border-r-2 after:border-cyan-400">
              <div className="flex items-center justify-between font-['Orbitron'] text-[11px] tracking-widest text-cyan-400 drop-shadow-[0_0_8px_rgba(0,245,255,0.6)] mb-1">
                <span>VETO DROSOPHILA CMD v2.7.4</span>
                
                {/* Stylized Big VETO Badge with 3 Drosophila Flies Logo */}
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-3 px-4 py-1.5 rounded-md border border-pink-500/50 bg-gradient-to-r from-pink-950/40 via-purple-950/30 to-pink-950/40 shadow-[0_0_20px_rgba(255,0,127,0.35)] backdrop-blur-sm">
                    {/* The Trio of 3 Drosophila Flies (Scout, Guard, Hunter) */}
                    <div className="flex items-center -space-x-1.5">
                      {/* 1. Scout Fly (Cyan) */}
                      <svg className="w-7 h-7 text-cyan-400 drop-shadow-[0_0_8px_#00f5ff] -rotate-12 transition-transform hover:scale-110" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <ellipse cx="12" cy="11" rx="2.4" ry="2.8" fill="currentColor" fillOpacity="0.2" />
                        <circle cx="12" cy="5.5" r="1.6" />
                        <circle cx="10" cy="5" r="0.8" fill="#ff1133" />
                        <circle cx="14" cy="5" r="0.8" fill="#ff1133" />
                        <path d="M11 3.8 L8 1.5 M13 3.8 L16 1.5" />
                        <ellipse cx="12" cy="17.5" rx="2.2" ry="3.8" strokeWidth="1.3" />
                        <line x1="10.5" y1="16" x2="13.5" y2="16" strokeWidth="1" />
                        <path d="M10 8.5 C4 4.5, 2 12, 10 13 Z" strokeWidth="1.2" fill="currentColor" fillOpacity="0.15" />
                        <path d="M14 8.5 C20 4.5, 22 12, 14 13 Z" strokeWidth="1.2" fill="currentColor" fillOpacity="0.15" />
                        <path d="M9.5 9 L5 7 M9.5 12 L4 13.5 M10 15 L6 19" strokeWidth="1.1" />
                        <path d="M14.5 9 L19 7 M14.5 12 L20 13.5 M14 15 L18 19" strokeWidth="1.1" />
                      </svg>

                      {/* 2. Guard Fly (Magenta / Center Hero) */}
                      <svg className="w-8 h-8 text-pink-500 drop-shadow-[0_0_12px_#ff007f] z-10 scale-110 transition-transform hover:scale-125" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                        <ellipse cx="12" cy="11" rx="2.6" ry="3" fill="currentColor" fillOpacity="0.25" />
                        <circle cx="12" cy="5.5" r="1.8" />
                        <circle cx="9.8" cy="5" r="1.0" fill="#ff1133" />
                        <circle cx="14.2" cy="5" r="1.0" fill="#ff1133" />
                        <path d="M11 3.8 L7.5 1.2 M13 3.8 L16.5 1.2" strokeWidth="1.4" />
                        <ellipse cx="12" cy="18" rx="2.4" ry="4" strokeWidth="1.5" />
                        <line x1="10.2" y1="16" x2="13.8" y2="16" strokeWidth="1.2" />
                        <line x1="10" y1="18.5" x2="14" y2="18.5" strokeWidth="1.2" />
                        <path d="M9.5 8.5 C3 4, 1 12, 9.5 13 Z" strokeWidth="1.3" fill="currentColor" fillOpacity="0.2" />
                        <path d="M14.5 8.5 C21 4, 23 12, 14.5 13 Z" strokeWidth="1.3" fill="currentColor" fillOpacity="0.2" />
                        <path d="M9.5 9 L4.5 6.5 M9.5 12 L3.5 13.5 M10 15 L5.5 19.5" strokeWidth="1.2" />
                        <path d="M14.5 9 L19.5 6.5 M14.5 12 L20.5 13.5 M14 15 L18.5 19.5" strokeWidth="1.2" />
                      </svg>

                      {/* 3. Hunter Fly (Purple) */}
                      <svg className="w-7 h-7 text-purple-400 drop-shadow-[0_0_8px_#9d4edd] rotate-12 transition-transform hover:scale-110" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <ellipse cx="12" cy="11" rx="2.4" ry="2.8" fill="currentColor" fillOpacity="0.2" />
                        <circle cx="12" cy="5.5" r="1.6" />
                        <circle cx="10" cy="5" r="0.8" fill="#ff1133" />
                        <circle cx="14" cy="5" r="0.8" fill="#ff1133" />
                        <path d="M11 3.8 L8 1.5 M13 3.8 L16 1.5" />
                        <ellipse cx="12" cy="17.5" rx="2.2" ry="3.8" strokeWidth="1.3" />
                        <line x1="10.5" y1="16" x2="13.5" y2="16" strokeWidth="1" />
                        <path d="M10 8.5 C4 4.5, 2 12, 10 13 Z" strokeWidth="1.2" fill="currentColor" fillOpacity="0.15" />
                        <path d="M14 8.5 C20 4.5, 22 12, 14 13 Z" strokeWidth="1.2" fill="currentColor" fillOpacity="0.15" />
                        <path d="M9.5 9 L5 7 M9.5 12 L4 13.5 M10 15 L6 19" strokeWidth="1.1" />
                        <path d="M14.5 9 L19 7 M14.5 12 L20 13.5 M14 15 L18 19" strokeWidth="1.1" />
                      </svg>
                    </div>
                    
                    {/* Big Stylized VETO Typography */}
                    <div className="flex flex-col items-start leading-none">
                      <span className="font-['Orbitron'] font-black text-[22px] tracking-[0.26em] text-pink-500 drop-shadow-[0_0_12px_#ff007f]">
                        VETO
                      </span>
                      <span className="font-mono text-[7.5px] tracking-[0.3em] text-pink-300/70 font-semibold mt-0.5">
                        SWARM PROTOCOL
                      </span>
                    </div>
                  </div>

                  <span className="flex items-center gap-1.5 text-pink-500 font-mono text-[10px] drop-shadow-[0_0_6px_#ff007f]">
                    <span className="w-2.5 h-2.5 rounded-full bg-pink-500 animate-pulse shadow-[0_0_10px_#ff007f]" />
                    ACTIVE
                  </span>
                </div>
              </div>
              <div className="text-[10px] font-mono text-sky-400/90 mb-2">
                NEURAL INTERFACE // LIVE BIO-FEED
              </div>

              {/* Title label for spectrogram */}
              <div className="text-[10px] font-['Orbitron'] text-pink-400 mb-1 tracking-wider">
                SPECTROGRAM // OPTIC LOBE ACTIVITY
              </div>
              
              <SpectrogramCanvas />

              <div className="mt-2 font-mono text-[10px] text-sky-200/80 flex items-center justify-between">
                <div>DOMINANT FREQ: <span className="text-cyan-400 font-bold">38.7 Hz</span></div>
                <div>POWER: <span className="text-cyan-400 font-bold">82.4%</span></div>
                <div>COHERENCE: <span className="text-cyan-400 font-bold">0.91</span></div>
              </div>
            </div>

            {/* Split Section: Large Command Column (Left) + Tactical Radar (Right) */}
            <div className="bg-[#060e1a]/95 border border-cyan-500/35 rounded p-3 shadow-[0_0_15px_rgba(0,245,255,0.06)] relative before:absolute before:-top-px before:-left-px before:w-2 before:h-2 before:border-t-2 before:border-l-2 before:border-cyan-400 after:absolute after:-bottom-px after:-right-px after:w-2 after:h-2 after:border-b-2 after:border-r-2 after:border-cyan-400">
              <div className="flex items-center justify-between font-['Orbitron'] text-[11px] tracking-widest text-cyan-400 drop-shadow-[0_0_8px_rgba(0,245,255,0.6)] mb-2.5">
                <span>TACTICAL OPS & ENVIRONMENTAL RADAR</span>
                <span className="text-[9px] font-mono text-gray-400">20 Hz SCAN</span>
              </div>

              {/* Split 50/50 Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-center">
                
                {/* LEFT: 3 Big Prominent Action Buttons stacked vertically */}
                <div className="flex flex-col gap-2.5">
                  
                  {/* Button 1: CYCLE */}
                  <button
                    onClick={handleStepCycle}
                    className="w-full py-2.5 px-3 bg-gradient-to-r from-cyan-950/70 to-[#02182b] hover:from-cyan-500/25 hover:to-cyan-400/20 text-cyan-300 border border-cyan-500/50 hover:border-cyan-400 rounded-md transition duration-200 group text-left shadow-[0_0_12px_rgba(0,245,255,0.12)] flex items-center justify-between"
                  >
                    <div>
                      <div className="flex items-center gap-1.5 font-['Orbitron'] text-xs font-bold tracking-wider text-cyan-300 group-hover:text-white drop-shadow-[0_0_6px_#00f5ff]">
                        <Play size={13} className="text-cyan-400 fill-cyan-400/30" />
                        CYCLE CANDIDATE
                      </div>
                      <div className="text-[9px] font-mono text-cyan-400/70 pl-5">
                        STEP NEXT POOL LAUNCH
                      </div>
                    </div>
                    <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                      STEP
                    </span>
                  </button>

                  {/* Button 2: SCENT LAB */}
                  <button
                    onClick={() => setIsLabOpen(true)}
                    className="w-full py-2.5 px-3 bg-gradient-to-r from-pink-950/70 to-[#1e0216] hover:from-pink-500/25 hover:to-pink-400/20 text-pink-300 border border-pink-500/50 hover:border-pink-400 rounded-md transition duration-200 group text-left shadow-[0_0_12px_rgba(255,0,127,0.12)] flex items-center justify-between"
                  >
                    <div>
                      <div className="flex items-center gap-1.5 font-['Orbitron'] text-xs font-bold tracking-wider text-pink-400 group-hover:text-white drop-shadow-[0_0_6px_#ff007f]">
                        <FlaskConical size={13} className="text-pink-400" />
                        SCENT LAB
                      </div>
                      <div className="text-[9px] font-mono text-pink-400/70 pl-5">
                        FORMULA & 5 VETO RULES
                      </div>
                    </div>
                    <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-pink-500/20 text-pink-300 border border-pink-500/40">
                      SIM
                    </span>
                  </button>

                  {/* Button 3: AUDIT LEDGER */}
                  <button
                    onClick={() => setIsLedgerOpen(true)}
                    className="w-full py-2.5 px-3 bg-gradient-to-r from-emerald-950/70 to-[#021d15] hover:from-emerald-500/25 hover:to-emerald-400/20 text-emerald-300 border border-emerald-500/50 hover:border-emerald-400 rounded-md transition duration-200 group text-left shadow-[0_0_12px_rgba(0,255,136,0.12)] flex items-center justify-between"
                  >
                    <div>
                      <div className="flex items-center gap-1.5 font-['Orbitron'] text-xs font-bold tracking-wider text-emerald-400 group-hover:text-white drop-shadow-[0_0_6px_#00ff88]">
                        <Table size={13} className="text-emerald-400" />
                        AUDIT LEDGER
                      </div>
                      <div className="text-[9px] font-mono text-emerald-400/70 pl-5">
                        LEDGER.JSONL ({decisions.length})
                      </div>
                    </div>
                    <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                      JSONL
                    </span>
                  </button>

                  {/* Auto-Cycle toggle pill */}
                  <div className="flex items-center justify-between px-2.5 py-1.5 bg-black/40 rounded border border-gray-800 text-[10px] font-mono text-gray-400 mt-0.5">
                    <span>AUTO-EVALUATION:</span>
                    <button
                      onClick={() => setIsAutoCycling(!isAutoCycling)}
                      className={`px-2 py-0.5 rounded text-[9.5px] font-bold transition flex items-center gap-1 border ${
                        isAutoCycling
                          ? 'bg-cyan-500/20 text-cyan-300 border-cyan-400 shadow-[0_0_8px_rgba(0,245,255,0.4)]'
                          : 'bg-gray-800 text-gray-400 border-gray-700'
                      }`}
                    >
                      {isAutoCycling ? (
                        <>
                          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
                          RUNNING
                        </>
                      ) : (
                        <>
                          <Pause size={10} />
                          PAUSED
                        </>
                      )}
                    </button>
                  </div>

                </div>

                {/* RIGHT: High-tech Azimuth Radar (No empty sides) */}
                <div className="flex flex-col items-center">
                  <RadarCanvas />
                  
                  {/* Dense, sharp legend underneath radar */}
                  <div className="grid grid-cols-2 gap-x-2 gap-y-1 text-[9.5px] font-mono mt-2 w-full px-1">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-[#ff007f] shadow-[0_0_6px_#ff007f]" />
                      <span className="text-gray-300">ODOR PLUME</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-[#00f5ff] shadow-[0_0_6px_#00f5ff]" />
                      <span className="text-gray-300">HUMIDITY</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-[#ffd000] shadow-[0_0_6px_#ffd000]" />
                      <span className="text-gray-300">TEMP ∇</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-[#00ff88] shadow-[0_0_6px_#00ff88]" />
                      <span className="text-gray-300">AIRFLOW</span>
                    </div>
                  </div>
                </div>

              </div>

              <div className="font-mono text-[9px] text-gray-500 mt-2.5 pt-1.5 border-t border-cyan-500/15 flex justify-between">
                <span>RANGE: 2.5 m // SCAN RATE: 20 Hz</span>
                <span>PONS POOL SCANNER ACTIVE</span>
              </div>
            </div>

          </div>

          {/* ================= CENTER COLUMN ================= */}
          <div className="flex flex-col gap-3">
            
            {/* Top 3D Neural Map or Live Video Feed */}
            <div className="bg-[#060e1a]/95 border border-cyan-500/35 rounded p-3 shadow-[0_0_15px_rgba(0,245,255,0.06)] relative before:absolute before:-top-px before:-left-px before:w-2 before:h-2 before:border-t-2 before:border-l-2 before:border-cyan-400 after:absolute after:-bottom-px after:-right-px after:w-2 after:h-2 after:border-b-2 after:border-r-2 after:border-cyan-400">
              <div className="flex items-center justify-between font-['Orbitron'] text-[11px] tracking-widest text-cyan-400 drop-shadow-[0_0_8px_rgba(0,245,255,0.6)] mb-2">
                <span>VETO DROSOPHILA HIVE // NEURAL BIO-FEED</span>
                <div className="flex items-center gap-2">
                  <div className="inline-flex p-0.5 rounded border border-cyan-500/30 bg-[#030712] text-[9px] font-mono">
                    <button
                      onClick={() => setTerminalDisplayMode('video')}
                      className={`px-2 py-0.5 rounded transition ${
                        terminalDisplayMode === 'video'
                          ? 'bg-pink-600 text-white font-bold shadow-[0_0_8px_#ff007f]'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      3D VIDEO
                    </button>
                    <button
                      onClick={() => setTerminalDisplayMode('schematic')}
                      className={`px-2 py-0.5 rounded transition ${
                        terminalDisplayMode === 'schematic'
                          ? 'bg-cyan-600 text-black font-bold shadow-[0_0_8px_#00f5ff]'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      SCHEMATIC
                    </button>
                  </div>

                  <div className="hidden sm:flex items-center gap-2.5 text-[10px] font-mono ml-1">
                    <span className="flex items-center gap-1 text-cyan-400">
                      <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_6px_#00f5ff]" />
                      SCOUT
                    </span>
                    <span className="flex items-center gap-1 text-pink-500">
                      <span className="w-1.5 h-1.5 rounded-full bg-pink-500 shadow-[0_0_6px_#ff007f]" />
                      GUARD
                    </span>
                    <span className="flex items-center gap-1 text-purple-400">
                      <span className="w-1.5 h-1.5 rounded-full bg-purple-400 shadow-[0_0_6px_#9d4edd]" />
                      HUNTER
                    </span>
                  </div>
                </div>
              </div>

              {terminalDisplayMode === 'video' ? (
                <SwarmVideoFeed className="max-h-[380px]" />
              ) : (
                <NeuralMapCanvas 
                  scoutActive={true}
                  guardVeto={lastEvaluated?.guard === 'REFUSED'}
                  hunterLanded={lastEvaluated?.hunter === 'LANDED'}
                />
              )}
            </div>

            {/* Platform Pedestal Cards for Scout, Guard, Hunter */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5">
              
              {/* SCOUT */}
              <div className="bg-[#030a16]/95 border border-cyan-500/40 rounded p-2.5 shadow-[0_0_10px_rgba(0,245,255,0.1)] hover:border-cyan-400 transition">
                <div className="flex justify-between items-center mb-1">
                  <span className="font-['Orbitron'] text-sm font-extrabold tracking-widest text-cyan-400 drop-shadow-[0_0_6px_#00f5ff]">
                    SCOUT
                  </span>
                  <span className="text-[10px] font-mono font-bold text-cyan-300 bg-cyan-500/15 px-1.5 py-0.5 rounded border border-cyan-500/30">
                    ≥ 0.35 SCENT
                  </span>
                </div>
                <div className="font-mono text-[9.5px] text-gray-400 leading-tight space-y-0.5">
                  <div>ROLE: <span className="text-white font-semibold">ENVIRONMENT MAPPING</span></div>
                  <div>STATUS: <span className="text-cyan-400 font-bold">SNIFFING POOL</span></div>
                  <div>LAST ACTION: <span className="text-white font-semibold">{lastEvaluated?.scout || 'SNIFF'}</span></div>
                </div>
                <div className="mt-1 pt-1 border-t border-cyan-500/20">
                  <EcgLine color="#00f5ff" />
                </div>
              </div>

              {/* GUARD */}
              <div className="bg-[#030a16]/95 border border-pink-500/40 rounded p-2.5 shadow-[0_0_10px_rgba(255,0,127,0.1)] hover:border-pink-400 transition">
                <div className="flex justify-between items-center mb-1">
                  <span className="font-['Orbitron'] text-sm font-extrabold tracking-widest text-pink-500 drop-shadow-[0_0_6px_#ff007f]">
                    GUARD
                  </span>
                  <span className="text-[10px] font-mono font-bold text-pink-300 bg-pink-500/15 px-1.5 py-0.5 rounded border border-pink-500/30">
                    5 VETO RULES
                  </span>
                </div>
                <div className="font-mono text-[9.5px] text-gray-400 leading-tight space-y-0.5">
                  <div>ROLE: <span className="text-white font-semibold">THREAT DETECTION</span></div>
                  <div>STATUS: <span className="text-pink-400 font-bold">{lastEvaluated?.guard === 'PASS' ? 'CLEARED (PASS)' : 'DEFENDING'}</span></div>
                  <div>REASON: <span className="text-pink-300 font-semibold">{lastEvaluated?.why || 'NONE (PASS)'}</span></div>
                </div>
                <div className="mt-1 pt-1 border-t border-pink-500/20">
                  <EcgLine color="#ff007f" />
                </div>
              </div>

              {/* HUNTER */}
              <div className="bg-[#030a16]/95 border border-cyan-500/40 rounded p-2.5 shadow-[0_0_10px_rgba(0,245,255,0.1)] hover:border-cyan-400 transition">
                <div className="flex justify-between items-center mb-1">
                  <span className="font-['Orbitron'] text-sm font-extrabold tracking-widest text-cyan-400 drop-shadow-[0_0_6px_#00f5ff]">
                    HUNTER
                  </span>
                  <span className="text-[10px] font-mono font-bold text-emerald-300 bg-emerald-500/15 px-1.5 py-0.5 rounded border border-emerald-500/30">
                    0.04 ETH
                  </span>
                </div>
                <div className="font-mono text-[9.5px] text-gray-400 leading-tight space-y-0.5">
                  <div>ROLE: <span className="text-white font-semibold">TARGET ACQUISITION</span></div>
                  <div>STATUS: <span className="text-cyan-400 font-bold">{lastEvaluated?.hunter === 'LANDED' ? 'LANDED' : 'HOVERING'}</span></div>
                  <div>MODE: <span className="text-emerald-400 font-bold">PAPER // SAFE</span></div>
                </div>
                <div className="mt-1 pt-1 border-t border-cyan-500/20">
                  <EcgLine color="#00f5ff" />
                </div>
              </div>

            </div>

          </div>

          {/* ================= RIGHT COLUMN ================= */}
          <div className="flex flex-col gap-3">
            
            {/* System Journal / Terminal Log */}
            <div className="bg-[#060e1a]/95 border border-cyan-500/35 rounded p-3 shadow-[0_0_15px_rgba(0,245,255,0.06)] relative flex-1 flex flex-col before:absolute before:-top-px before:-left-px before:w-2 before:h-2 before:border-t-2 before:border-l-2 before:border-cyan-400 after:absolute after:-bottom-px after:-right-px after:w-2 after:h-2 after:border-b-2 after:border-r-2 after:border-cyan-400">
              <div className="flex items-center justify-between font-['Orbitron'] text-[11px] tracking-widest text-cyan-400 drop-shadow-[0_0_8px_rgba(0,245,255,0.6)] mb-2">
                <span>JOURNAL // SYSTEM LOG</span>
                <span className="flex items-center gap-1 text-[9px] font-mono text-cyan-300">
                  <span className="w-2 h-2 rounded-full bg-pink-500 shadow-[0_0_6px_#ff007f] animate-pulse" />
                  STREAM
                </span>
              </div>

              {/* Clean Telemetry Terminal Stream */}
              <div className="bg-[#01040a] border border-cyan-500/20 rounded p-2.5 font-mono text-[9.5px] flex-1 overflow-y-auto max-h-[300px] space-y-1.5 leading-relaxed text-sky-400">
                <div className="text-gray-500">[14:22:01] SYSTEM BOOT................... OK</div>
                <div className="text-gray-500">[14:22:03] SENSOR ARRAY................. CALIBRATED</div>
                <div className="text-gray-500">[14:22:05] OPTIC LOBES.................. LINKED</div>
                <div className="text-pink-400 font-bold">[14:22:07] AXON FILAMENTS............... CONNECTED [3]</div>
                <div className="text-cyan-300">[14:22:08] SIGNAL INTEGRITY............ 98.7%</div>
                <div className="text-sky-300">[14:22:10] BEHAVIORAL PROTOCOLS......... LOADED</div>
                <div className="border-t border-gray-800 my-1 pt-1 text-[8.5px] text-gray-400">
                  <div>VETO PROTOCOLS IN EFFECT:</div>
                  <div>1. SNIPE WINDOW (60s) &nbsp; 2. CREATOR &gt; 15%</div>
                  <div>3. MINT STILL OPEN &nbsp;&nbsp;&nbsp; 4. FORBIDDEN NAMES</div>
                  <div>5. SCENT INDEX &lt; 0.60</div>
                  <div className="text-pink-400 font-semibold mt-0.5">// STIMULUS: ETHYL BUTYRATE 10^-6</div>
                </div>

                {/* Live stream lines from decisions */}
                {decisions.slice(0, 18).map((d, i) => (
                  <div key={i} className="pt-1.5 border-t border-cyan-500/10 flex items-center justify-between text-[9px]">
                    <span className="text-gray-500">[{d.ts.split('T')[1]?.slice(0, 8)}]</span>
                    <span className="font-bold text-cyan-300">{d.ticker}</span>
                    <span className="text-sky-300">s:{d.scent.toFixed(2)}</span>
                    <span className={d.guard === 'PASS' ? 'text-emerald-400 font-bold' : 'text-pink-400'}>
                      {d.guard}{d.why ? ` (${d.why})` : ''}
                    </span>
                    <span className={d.hunter === 'LANDED' ? 'text-emerald-400 font-extrabold' : 'text-gray-500'}>
                      {d.hunter === 'LANDED' ? '🎯 LANDED' : 'IDLE'}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Neural Link Status & Ring Gauge */}
            <div className="bg-[#060e1a]/95 border border-cyan-500/35 rounded p-3 shadow-[0_0_15px_rgba(0,245,255,0.06)] relative before:absolute before:-top-px before:-left-px before:w-2 before:h-2 before:border-t-2 before:border-l-2 before:border-cyan-400 after:absolute after:-bottom-px after:-right-px after:w-2 after:h-2 after:border-b-2 after:border-r-2 after:border-cyan-400">
              <div className="font-['Orbitron'] text-[11px] tracking-widest text-cyan-400 drop-shadow-[0_0_8px_rgba(0,245,255,0.6)] mb-2">
                NEURAL LINK STATUS
              </div>

              <div className="flex items-center gap-4 py-1">
                {/* Circular Gauge matching reference */}
                <div className="relative w-16 h-16 flex-shrink-0">
                  <svg className="w-full h-full -rotate-90" viewBox="0 0 68 68">
                    <circle
                      cx="34"
                      cy="34"
                      r="28"
                      className="fill-none stroke-pink-500/25 stroke-[5]"
                    />
                    <circle
                      cx="34"
                      cy="34"
                      r="28"
                      className="fill-none stroke-cyan-400 stroke-[5] drop-shadow-[0_0_6px_#00f5ff]"
                      strokeDasharray="176"
                      strokeDashoffset="12"
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center font-['Orbitron'] text-[11px] font-bold text-white">
                    98.7%
                    <span className="text-[7.5px] text-pink-400 font-semibold tracking-wider">SYNC</span>
                  </div>
                </div>

                <div className="font-mono text-[9.5px] text-gray-400 space-y-1 leading-tight flex-1">
                  <div>LATENCY: <span className="text-white font-semibold">1.2 ms</span></div>
                  <div>PACKET LOSS: <span className="text-white font-semibold">0.00%</span></div>
                  <div>SIGNAL QUALITY: <span className="text-emerald-400 font-bold">EXCELLENT</span></div>
                </div>
              </div>

              {/* Fly units activity */}
              <div className="mt-2.5 pt-2 border-t border-cyan-500/20 font-mono text-[9.5px]">
                <div className="font-['Orbitron'] text-[10px] text-cyan-400 mb-1 tracking-wider">
                  FLY UNITS COHERENCE
                </div>
                <div className="space-y-1 text-gray-400">
                  <div className="flex justify-between">
                    <span className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                      SCOUT
                    </span>
                    <span className="text-cyan-300 font-bold">0.83%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-pink-500" />
                      GUARD
                    </span>
                    <span className="text-pink-400 font-bold">1.46%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                      HUNTER
                    </span>
                    <span className="text-cyan-300 font-bold">2.12%</span>
                  </div>
                </div>
              </div>
            </div>

          </div>

        </div>
        )}

        {/* ================= BOTTOM STATUS BAR ================= */}
        <div className="bg-[#040c18]/95 border border-cyan-500/40 rounded px-4 py-2 flex flex-wrap items-center justify-between text-[11px] font-['Orbitron'] tracking-wider text-cyan-400 drop-shadow-[0_0_6px_rgba(0,245,255,0.6)]">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-pink-500 animate-pulse shadow-[0_0_8px_#ff007f]" />
            <span>UNITS DEPLOYED: 3 // ALL SYSTEMS NOMINAL</span>
          </div>

          <div className="font-mono text-[10px] text-gray-400 flex items-center gap-4">
            <span>PONS LAUNCHPAD (ROBINHOOD CHAIN)</span>
            <span className="text-pink-400 font-semibold">// LIVE SIGNING DISABLED</span>
            <span className="text-emerald-400 font-bold">SIZE: 0.04 ETH (PAPER)</span>
          </div>
        </div>

      </div>

      {/* Scent Laboratory Modal */}
      <ScentLabModal
        isOpen={isLabOpen}
        onClose={() => setIsLabOpen(false)}
        onInjectLaunch={handleInjectCustomLaunch}
      />

      {/* Audit Ledger Modal */}
      <LedgerTableModal
        isOpen={isLedgerOpen}
        onClose={() => setIsLedgerOpen(false)}
        decisions={decisions}
      />
    </div>
  );
}
