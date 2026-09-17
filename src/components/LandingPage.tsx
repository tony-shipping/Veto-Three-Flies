import React, { useState, useEffect, useRef } from 'react';
import { 
  ShieldCheck, 
  Terminal, 
  Cpu, 
  Radio, 
  Zap, 
  GitBranch, 
  Layers, 
  ExternalLink, 
  Activity, 
  CheckCircle2, 
  XCircle,
  Eye,
  ChevronRight,
  ArrowRight,
  Fingerprint,
  Radar,
  TrendingUp,
  Sparkles
} from 'lucide-react';
import { NeuralMapCanvas } from './NeuralMapCanvas';
import { SwarmVideoFeed } from './SwarmVideoFeed';

interface LandingPageProps {
  onLaunchTerminal: () => void;
}

// Mini SVG Sparkline with live animated points
const MiniSparkline: React.FC<{ color: string; points: number[] }> = ({ color, points }) => {
  const max = Math.max(...points, 10);
  const min = Math.min(...points, 0);
  const range = max - min || 1;
  const width = 120;
  const height = 24;
  
  const pathD = points.map((val, idx) => {
    const x = (idx / (points.length - 1)) * width;
    const y = height - ((val - min) / range) * (height - 4) - 2;
    return `${idx === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${y.toFixed(1)}`;
  }).join(' ');

  return (
    <svg className="w-28 h-5 overflow-visible mt-1.5 opacity-80" viewBox={`0 0 ${width} ${height}`}>
      <path 
        d={pathD} 
        fill="none" 
        stroke={color} 
        strokeWidth="1.6" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        className="transition-all duration-500 ease-out"
      />
      {points.length > 0 && (
        <circle 
          cx={width} 
          cy={height - ((points[points.length - 1] - min) / range) * (height - 4) - 2} 
          r="2.5" 
          fill={color} 
          className="animate-ping" 
        />
      )}
    </svg>
  );
};

export const LandingPage: React.FC<LandingPageProps> = ({ onLaunchTerminal }) => {
  const [activeTab, setActiveTab] = useState<'scout' | 'guard' | 'hunter'>('guard');
  const [displayMode, setDisplayMode] = useState<'video' | 'schematic'>('video');

  // ================= DYNAMIC LIVE TELEMETRY STATE =================
  const [latency, setLatency] = useState<number>(4.2);
  const [latencyHistory, setLatencyHistory] = useState<number[]>([4.1, 4.3, 4.0, 4.4, 4.2, 4.1, 4.2]);
  
  const [vetoedCount, setVetoedCount] = useState<number>(1842);
  const [justVetoed, setJustVetoed] = useState<boolean>(false);
  const [vetoHistory, setVetoHistory] = useState<number[]>([1835, 1837, 1839, 1840, 1841, 1842]);

  const [activeFirings, setActiveFirings] = useState<number>(482);
  const [synapseHistory, setSynapseHistory] = useState<number[]>([420, 460, 440, 510, 490, 482]);

  const [protectedVolume, setProtectedVolume] = useState<number>(4824190);

  // Dynamic Scout, Guard, Hunter Card Stats
  const [scoutScore, setScoutScore] = useState<number>(99.84);
  const [guardSims, setGuardSims] = useState<number>(43192);
  const [hunterBundles, setHunterBundles] = useState<number>(8942);

  // Rotating Hero Ticker
  const HERO_TICKERS = [
    'CONNECTOME SWARM // 139,256 NEURONS ONLINE',
    'OR42a ODOR DETECTOR // SNIFFING UNISWAP & PONS POOLS',
    'GUARD OPTIC LOBE // LATERAL INHIBITION VETO GATING ARMED',
    'HUNTER PROTOCOL // PRIVATE FLASHBOTS MEV BUNDLES ROUTED',
    'ZERO EXPOSURE TO PUBLIC MEMPOOL // ADVERSARIAL IMMUNITY'
  ];
  const [tickerIndex, setTickerIndex] = useState<number>(0);

  // Live Simulated Stream Log
  const [logs, setLogs] = useState<string[]>([
    '[07:42:01] Scout: Antennal glomerulus OR42a scanned pool 0x7a...8b -> Scent Pure (Toxicity: 0.04)',
    '[07:42:08] Guard: Simulation pass for Tx 0x4f...2c -> No reentrancy / No hidden fees [VETO: CLEAR]',
    '[07:42:15] Hunter: Flashbots private bundle submitted -> Block #21048432 mined in 3.9ms'
  ]);

  // Periodic updates for dynamic numbers
  useEffect(() => {
    // 1. Latency fluctuation every 1.2s
    const latencyInterval = setInterval(() => {
      const next = +(3.8 + Math.random() * 0.7).toFixed(1);
      setLatency(next);
      setLatencyHistory(prev => [...prev.slice(1), next]);
    }, 1400);

    // 2. Veto count increment every 4.5s
    const vetoInterval = setInterval(() => {
      setVetoedCount(v => v + 1);
      setJustVetoed(true);
      setTimeout(() => setJustVetoed(false), 1200);
      setVetoHistory(prev => [...prev.slice(1), prev[prev.length - 1] + 1]);

      // Add dynamic log
      const fakePools = ['0x8c...4e', '0x1a...99', '0x5e...2d', '0xbf...71'];
      const picked = fakePools[Math.floor(Math.random() * fakePools.length)];
      const nowTime = new Date().toLocaleTimeString('en-US', { hour12: false });
      setLogs(prev => [
        `[${nowTime}] Guard: Malicious honeypot trap vetoed on ${picked} in 1.1ms! [Zero Loss]`,
        ...prev.slice(0, 3)
      ]);
    }, 4500);

    // 3. Synapse firings fluctuation every 900ms
    const synapseInterval = setInterval(() => {
      const nextFirings = Math.floor(420 + Math.random() * 150);
      setActiveFirings(nextFirings);
      setSynapseHistory(prev => [...prev.slice(1), nextFirings]);
    }, 900);

    // 4. Protected volume ticker every 2s
    const volumeInterval = setInterval(() => {
      setProtectedVolume(vol => vol + Math.floor(150 + Math.random() * 850));
      setGuardSims(s => s + Math.floor(1 + Math.random() * 3));
      setHunterBundles(b => b + (Math.random() > 0.6 ? 1 : 0));
      setScoutScore(+(99.78 + Math.random() * 0.18).toFixed(2));
    }, 2200);

    // 5. Hero ticker rotation every 3.5s
    const tickerTimer = setInterval(() => {
      setTickerIndex(i => (i + 1) % HERO_TICKERS.length);
    }, 3600);

    return () => {
      clearInterval(latencyInterval);
      clearInterval(vetoInterval);
      clearInterval(synapseInterval);
      clearInterval(volumeInterval);
      clearInterval(tickerTimer);
    };
  }, []);

  return (
    <div className="flex flex-col gap-20 pb-20 text-[#e2e8f0]">
      
      {/* =====================================================================
          HERO SECTION
      ====================================================================== */}
      <section className="relative pt-6 md:pt-12 flex flex-col items-center text-center">
        {/* Ambient Top Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-pink-500/15 blur-[120px] pointer-events-none rounded-full" />
        <div className="absolute top-1/3 left-1/4 w-[400px] h-[250px] bg-cyan-500/10 blur-[100px] pointer-events-none rounded-full" />

        {/* Dynamic Rotating Protocol Eyebrow Badge */}
        <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full border border-pink-500/40 bg-pink-950/30 backdrop-blur-md shadow-[0_0_20px_rgba(255,0,127,0.3)] mb-6 transition-all duration-300">
          <span className="w-2 h-2 rounded-full bg-pink-500 animate-pulse shadow-[0_0_8px_#ff007f]" />
          <span className="font-['Orbitron'] text-[11px] tracking-[0.2em] text-pink-400 font-semibold min-w-[280px] sm:min-w-[420px] transition-all duration-500">
            {HERO_TICKERS[tickerIndex]}
          </span>
        </div>

        {/* Main Hero Headline with soft neon breathing */}
        <h1 className="max-w-4xl font-['Orbitron'] font-black text-4xl sm:text-6xl md:text-7xl leading-[1.1] tracking-tight uppercase mb-6 select-none">
          <span className="text-white drop-shadow-[0_2px_15px_rgba(255,255,255,0.3)]">VETO</span>{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-purple-400 to-cyan-400 drop-shadow-[0_0_40px_rgba(255,0,127,0.7)] hover:brightness-125 transition-all">
            DROSOPHILA
          </span>
        </h1>

        <p className="max-w-2xl text-base sm:text-lg text-slate-300 font-['Rajdhani'] font-medium leading-relaxed mb-8">
          The first decentralized on-chain autonomous triad inspired by the{' '}
          <span className="text-cyan-400 font-bold border-b border-cyan-400/40 pb-0.5 animate-pulse">
            Drosophila Melanogaster
          </span>{' '}
          connectome. Protecting capital through real-time olfactory candidate sniffing, immutable sub-millisecond veto gates, and razor-sharp liquidity hunting.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-4 mb-14">
          <button
            onClick={onLaunchTerminal}
            className="group relative inline-flex items-center gap-3 px-8 py-3.5 rounded-md font-['Orbitron'] font-bold text-sm tracking-wider text-black bg-gradient-to-r from-cyan-400 to-pink-500 shadow-[0_0_25px_rgba(0,245,255,0.5)] hover:shadow-[0_0_40px_rgba(255,0,127,0.8)] transition-all hover:scale-[1.03] active:scale-[0.98]"
          >
            <Terminal className="w-4 h-4 text-black group-hover:rotate-12 transition-transform" />
            <span>LAUNCH COMMAND TERMINAL</span>
            <ArrowRight className="w-4 h-4 text-black group-hover:translate-x-1.5 transition-transform" />
          </button>

          <a
            href="#architecture"
            className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-md font-['Orbitron'] text-xs tracking-wider text-slate-200 border border-slate-700/80 bg-slate-900/60 hover:border-pink-500/50 hover:bg-slate-900/90 transition-all hover:text-white"
          >
            <Radio className="w-4 h-4 text-pink-400 animate-pulse" />
            <span>EXPLORE TRIAD PROTOCOL</span>
          </a>
        </div>

        {/* =====================================================================
            KEY REALTIME DYNAMIC TELEMETRY STRIP (USER REQUESTED DYNAMICS)
        ====================================================================== */}
        <div className="w-full max-w-4xl grid grid-cols-2 md:grid-cols-4 gap-3 p-3.5 rounded-lg border border-cyan-500/35 bg-[#060e1a]/85 backdrop-blur-md shadow-[0_0_25px_rgba(0,245,255,0.08)] relative overflow-hidden before:absolute before:-top-px before:-left-px before:w-3 before:h-3 before:border-t-2 before:border-l-2 before:border-cyan-400 after:absolute after:-bottom-px after:-right-px after:w-3 after:h-3 after:border-b-2 after:border-r-2 after:border-cyan-400">
          
          {/* Metric 1: RESPONSE LATENCY (Fluctuates dynamically) */}
          <div className="flex flex-col items-center p-3 border-r border-slate-800/80 last:border-0 relative">
            <span className="text-[10px] font-mono text-slate-400 tracking-wider flex items-center gap-1">
              <span>RESPONSE LATENCY</span>
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
            </span>
            <span className="font-['Orbitron'] font-bold text-2xl text-cyan-400 mt-1 transition-all duration-300 drop-shadow-[0_0_8px_rgba(0,245,255,0.6)]">
              {latency} ms
            </span>
            <MiniSparkline color="#00f5ff" points={latencyHistory} />
            <span className="text-[9px] font-mono text-cyan-300/70 mt-1">
              Sub-block Execution
            </span>
          </div>

          {/* Metric 2: SCAMS VETOED (Ticks up dynamically with neon flash) */}
          <div className="flex flex-col items-center p-3 border-r border-slate-800/80 last:border-0 relative">
            <span className="text-[10px] font-mono text-slate-400 tracking-wider flex items-center gap-1">
              <span>SCAMS VETOED</span>
              <span className="w-1.5 h-1.5 rounded-full bg-pink-500 animate-pulse" />
            </span>
            <span 
              className={`font-['Orbitron'] font-bold text-2xl mt-1 transition-all duration-300 ${
                justVetoed 
                  ? 'text-pink-300 scale-110 drop-shadow-[0_0_18px_#ff007f]' 
                  : 'text-pink-500 drop-shadow-[0_0_10px_#ff007f]'
              }`}
            >
              {vetoedCount.toLocaleString()}
            </span>
            <MiniSparkline color="#ff007f" points={vetoHistory} />
            <span className="text-[9px] font-mono text-pink-300/70 mt-1">
              Zero False Positives {justVetoed && <span className="text-pink-400 font-bold animate-pulse">(+1)</span>}
            </span>
          </div>

          {/* Metric 3: SYNAPSE CHANNELS (Fluctuates dynamically) */}
          <div className="flex flex-col items-center p-3 border-r border-slate-800/80 last:border-0 relative">
            <span className="text-[10px] font-mono text-slate-400 tracking-wider flex items-center gap-1">
              <span>SYNAPSE CHANNELS</span>
              <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-pulse" />
            </span>
            <span className="font-['Orbitron'] font-bold text-2xl text-purple-400 mt-1 transition-all duration-300 drop-shadow-[0_0_8px_rgba(157,78,221,0.6)]">
              139,256
            </span>
            <MiniSparkline color="#9d4edd" points={synapseHistory} />
            <span className="text-[9px] font-mono text-purple-300/70 mt-1">
              {activeFirings} active firings/s
            </span>
          </div>

          {/* Metric 4: SANDWICH DEFENSE (Live volume counter) */}
          <div className="flex flex-col items-center p-3 relative">
            <span className="text-[10px] font-mono text-slate-400 tracking-wider flex items-center gap-1">
              <span>SANDWICH DEFENSE</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
            </span>
            <span className="font-['Orbitron'] font-bold text-2xl text-emerald-400 mt-1 drop-shadow-[0_0_8px_rgba(52,211,153,0.6)]">
              100%
            </span>
            <span className="font-mono text-[11px] text-emerald-300 font-bold mt-1.5 tracking-wider">
              ${(protectedVolume / 1000000).toFixed(3)}M
            </span>
            <span className="text-[9px] font-mono text-emerald-300/70 mt-1">
              Protected Volume
            </span>
          </div>

        </div>
      </section>


      {/* =====================================================================
          INTERACTIVE LIVE EXHIBIT (THE CONNECTOME & SWARM VIDEO)
      ====================================================================== */}
      <section className="relative w-full max-w-6xl mx-auto flex flex-col gap-4">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-3 border-b border-slate-800 pb-4">
          <div>
            <div className="flex items-center gap-2 text-pink-500 font-mono text-xs mb-1">
              <Eye className="w-3.5 h-3.5 animate-pulse" />
              <span>LIVE CONNECTOME MATRIX</span>
            </div>
            <h2 className="font-['Orbitron'] font-bold text-2xl md:text-3xl text-white">
              VETO SWARM BIO-FEED // DROSOPHILA CONNECTOME
            </h2>
          </div>

          {/* Toggle between Video Feed and Vector Schematic */}
          <div className="flex items-center gap-2">
            <div className="inline-flex p-1 rounded-md border border-cyan-500/30 bg-[#030712]">
              <button
                onClick={() => setDisplayMode('video')}
                className={`px-3 py-1 text-xs font-mono rounded transition-all ${
                  displayMode === 'video'
                    ? 'bg-pink-600 text-white font-bold shadow-[0_0_12px_#ff007f]'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                ● 3D BIO-FEED (VIDEO)
              </button>
              <button
                onClick={() => setDisplayMode('schematic')}
                className={`px-3 py-1 text-xs font-mono rounded transition-all ${
                  displayMode === 'schematic'
                    ? 'bg-cyan-600 text-black font-bold shadow-[0_0_12px_#00f5ff]'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                VECTOR SCHEMATIC
              </button>
            </div>
          </div>
        </div>

        {/* The Live Video / Canvas Exhibition */}
        <div className="relative rounded-xl border border-cyan-500/40 p-2 bg-[#030611] shadow-[0_0_35px_rgba(0,245,255,0.15)]">
          {displayMode === 'video' ? (
            <SwarmVideoFeed />
          ) : (
            <NeuralMapCanvas scoutActive={true} guardVeto={false} hunterLanded={false} />
          )}
          
          <div className="mt-2 px-3 py-2 flex flex-wrap items-center justify-between gap-3 text-xs font-mono text-slate-400 bg-slate-950/60 rounded border border-slate-800">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5 text-cyan-400">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                SCOUT: Olfactory Odor Matrix ({scoutScore}% Precision)
              </span>
              <span className="flex items-center gap-1.5 text-pink-500">
                <span className="w-2 h-2 rounded-full bg-pink-500 animate-pulse" />
                GUARD: Optic Veto Gate ({vetoedCount} Vetoes)
              </span>
              <span className="flex items-center gap-1.5 text-purple-400">
                <span className="w-2 h-2 rounded-full bg-purple-400 animate-pulse" />
                HUNTER: Flashbots Bundles ({hunterBundles} Routed)
              </span>
            </div>
            <button 
              onClick={onLaunchTerminal}
              className="text-cyan-400 hover:text-cyan-300 underline font-semibold flex items-center gap-1"
            >
              Inspect Live Feeds in Terminal ↗
            </button>
          </div>
        </div>
      </section>


      {/* =====================================================================
          THE 3-TIER TRIAD ARCHITECTURE WITH DYNAMIC METRICS
      ====================================================================== */}
      <section id="architecture" className="relative w-full max-w-6xl mx-auto flex flex-col gap-10">
        <div className="text-center max-w-2xl mx-auto">
          <span className="font-mono text-xs text-cyan-400 tracking-widest uppercase">Biological Autonomous Engine</span>
          <h2 className="font-['Orbitron'] font-black text-3xl md:text-4xl text-white mt-2">
            THE THREE DRUIDS OF THE HIVE
          </h2>
          <p className="text-sm font-['Rajdhani'] text-slate-400 mt-2">
            Each unit maps directly to specialized neuropils in the Drosophila brain, creating an unhackable decentralized verification cascade.
          </p>
        </div>

        {/* 3 Interactive Cards with live fluctuating status */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          
          {/* Unit 1: SCOUT */}
          <div className="flex flex-col p-6 rounded-lg border border-cyan-500/30 bg-[#060e1a]/90 relative overflow-hidden shadow-[0_0_20px_rgba(0,245,255,0.05)] hover:border-cyan-400 transition-all group">
            <div className="absolute top-0 right-0 w-28 h-28 bg-cyan-500/10 rounded-full blur-2xl pointer-events-none" />
            <div className="flex items-center justify-between mb-4">
              <span className="font-['Orbitron'] font-black text-2xl text-cyan-400">01 // SCOUT</span>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-cyan-950/80 border border-cyan-500/40 text-cyan-300 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
                SNIFFING
              </span>
            </div>
            <h3 className="font-['Orbitron'] font-bold text-lg text-white mb-2">Antennal Lobe Odor Analyzer</h3>
            <p className="text-sm text-slate-300 font-['Rajdhani'] leading-relaxed mb-6">
              Continuously decodes the PONS pool and mempool candidate streams. Translates bytecode signatures into vector odors, matching against 50+ known malicious honeypot scents.
            </p>
            
            {/* Live Mini Frequency Visualizer */}
            <div className="mb-4 p-2 rounded bg-cyan-950/30 border border-cyan-500/20 flex items-center justify-between font-mono text-[10px]">
              <span className="text-slate-400">ODOR FREQUENCY:</span>
              <span className="text-cyan-400 font-bold flex items-center gap-1">
                <Activity className="w-3 h-3 animate-pulse" />
                38.7 Hz OR42a
              </span>
            </div>

            <div className="mt-auto pt-4 border-t border-slate-800/80 flex flex-col gap-2 font-mono text-xs">
              <div className="flex justify-between text-slate-400">
                <span>Synapse Path:</span>
                <span className="text-cyan-400">OR42a / OR47b Glomeruli</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Target Mempools:</span>
                <span className="text-slate-200">Robinhood, Base, Arbitrum</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Filter Accuracy:</span>
                <span className="text-cyan-400 font-bold transition-all duration-300">{scoutScore}% Sniff Score</span>
              </div>
            </div>
          </div>

          {/* Unit 2: GUARD */}
          <div className="flex flex-col p-6 rounded-lg border border-pink-500/40 bg-[#0a0512]/90 relative overflow-hidden shadow-[0_0_25px_rgba(255,0,127,0.1)] hover:border-pink-400 transition-all group">
            <div className="absolute top-0 right-0 w-28 h-28 bg-pink-500/15 rounded-full blur-2xl pointer-events-none" />
            <div className="flex items-center justify-between mb-4">
              <span className="font-['Orbitron'] font-black text-2xl text-pink-500">02 // GUARD</span>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-pink-950/80 border border-pink-500/40 text-pink-300 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-pink-500 animate-pulse" />
                VETO GATE
              </span>
            </div>
            <h3 className="font-['Orbitron'] font-bold text-lg text-white mb-2">Optic Lobe Veto Engine</h3>
            <p className="text-sm text-slate-300 font-['Rajdhani'] leading-relaxed mb-6">
              Holds absolute unilateral veto power. Simulates bytecode execution in isolated EVM sandboxes. If reentrancy, hidden mints, or tax manipulation are detected, it severs the hunter channel instantly.
            </p>

            {/* Live Sandbox Simulations Count */}
            <div className="mb-4 p-2 rounded bg-pink-950/30 border border-pink-500/20 flex items-center justify-between font-mono text-[10px]">
              <span className="text-slate-400">EVM SIMULATIONS:</span>
              <span className="text-pink-400 font-bold flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-pink-400" />
                {guardSims.toLocaleString()} verified
              </span>
            </div>

            <div className="mt-auto pt-4 border-t border-slate-800/80 flex flex-col gap-2 font-mono text-xs">
              <div className="flex justify-between text-slate-400">
                <span>Synapse Path:</span>
                <span className="text-pink-500">Lobula Plate Motion T4/T5</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Veto Enforcement:</span>
                <span className="text-slate-200">Zero-Gas Circuit Breaker</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>False-Negatives:</span>
                <span className="text-pink-400 font-bold">0.000% Absolute Veto</span>
              </div>
            </div>
          </div>

          {/* Unit 3: HUNTER */}
          <div className="flex flex-col p-6 rounded-lg border border-purple-500/30 bg-[#080516]/90 relative overflow-hidden shadow-[0_0_20px_rgba(157,78,221,0.06)] hover:border-purple-400 transition-all group">
            <div className="absolute top-0 right-0 w-28 h-28 bg-purple-500/10 rounded-full blur-2xl pointer-events-none" />
            <div className="flex items-center justify-between mb-4">
              <span className="font-['Orbitron'] font-black text-2xl text-purple-400">03 // HUNTER</span>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-purple-950/80 border border-purple-500/40 text-purple-300 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-ping" />
                EXECUTION
              </span>
            </div>
            <h3 className="font-['Orbitron'] font-bold text-lg text-white mb-2">Mushroom Body Striker</h3>
            <p className="text-sm text-slate-300 font-['Rajdhani'] leading-relaxed mb-6">
              Only awakened when Guard validates the transaction vector. Dispatches Flashbots MEV bundles at private block builder RPCs, capturing guaranteed liquidity fills without public mempool leak.
            </p>

            {/* Live Private Bundles Count */}
            <div className="mb-4 p-2 rounded bg-purple-950/30 border border-purple-500/20 flex items-center justify-between font-mono text-[10px]">
              <span className="text-slate-400">BUNDLES ROUTED:</span>
              <span className="text-purple-400 font-bold flex items-center gap-1">
                <Zap className="w-3 h-3 text-purple-400" />
                {hunterBundles.toLocaleString()} private
              </span>
            </div>

            <div className="mt-auto pt-4 border-t border-slate-800/80 flex flex-col gap-2 font-mono text-xs">
              <div className="flex justify-between text-slate-400">
                <span>Synapse Path:</span>
                <span className="text-purple-400">Central Complex Ellipsoid</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Bundle Routing:</span>
                <span className="text-slate-200">Titan, Beaver, Flashbots</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Slippage Protection:</span>
                <span className="text-purple-400 font-bold">&lt; 0.08% Guaranteed</span>
              </div>
            </div>
          </div>

        </div>
      </section>


      {/* =====================================================================
          TECHNICAL WHITEPAPER & LIVE TELEMETRY FEED
      ====================================================================== */}
      <section className="relative w-full max-w-6xl mx-auto rounded-xl border border-slate-800 bg-[#060c17]/70 p-8 backdrop-blur-md">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <div>
            <span className="font-mono text-xs text-pink-400 tracking-wider">PROTOCOL SPECIFICATION v2.7</span>
            <h2 className="font-['Orbitron'] font-bold text-2xl md:text-3xl text-white mt-2 mb-4">
              WHY DROSOPHILA CONNECTOME IN CRYPTO?
            </h2>
            <div className="space-y-4 text-sm font-['Rajdhani'] text-slate-300 leading-relaxed">
              <p>
                Modern high-frequency trading bots rely on linear heuristic trees, making them susceptible to reverse-engineering, front-running, and toxic sandwich attacks.
              </p>
              <p>
                The fruit fly (<em className="text-cyan-400 font-serif italic">Drosophila Melanogaster</em>) possesses 139,256 neurons connected by over 50 million synapses. In nature, it dodges predatory threats in <strong>under 5 milliseconds</strong> using non-linear lateral inhibition.
              </p>
              <p>
                By translating the whole-brain connectome from the Princeton FlyWire project into a deterministic WASM execution model, <strong>VETO DROSOPHILA</strong> achieves unparalleled immunity to adversarial MEV.
              </p>
            </div>

            {/* Live Interactive Telemetry Log Box */}
            <div className="mt-6 p-3 rounded-md border border-cyan-500/30 bg-[#030611] font-mono text-[11px] flex flex-col gap-1.5">
              <div className="flex items-center justify-between text-cyan-400 font-bold text-[10px] pb-1 border-b border-slate-800">
                <span className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
                  LIVE WASM KERNEL ACTIVITY STREAM
                </span>
                <span className="text-slate-400 text-[9px]">AUTONOMOUS</span>
              </div>
              {logs.map((line, idx) => (
                <div key={idx} className="text-slate-300 truncate transition-all duration-300 hover:text-white">
                  {line}
                </div>
              ))}
            </div>

            <div className="mt-6 flex flex-wrap gap-4">
              <button
                onClick={onLaunchTerminal}
                className="px-6 py-2.5 rounded font-['Orbitron'] text-xs tracking-wider font-bold bg-pink-600 hover:bg-pink-500 text-white shadow-[0_0_15px_#ff007f] transition-all hover:scale-105"
              >
                OPEN SYSTEM TERMINAL
              </button>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded border border-slate-700 text-xs font-mono text-slate-400">
                <Fingerprint className="w-4 h-4 text-cyan-400" />
                <span>CONTRACT: 0xVETO...FLY77</span>
              </div>
            </div>
          </div>

          {/* Code / Mathematical Spec Block with active cursor */}
          <div className="rounded-lg border border-cyan-500/20 bg-[#030611] p-5 font-mono text-xs text-slate-300 shadow-inner relative">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-3 text-[11px] text-slate-400">
              <span className="text-cyan-400 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                veto_circuit.rs [WASM BIO-CORE]
              </span>
              <span className="text-emerald-400 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                VERIFIED BYTECODE
              </span>
            </div>
            <pre className="text-[11px] leading-relaxed overflow-x-auto text-slate-400">
              <span className="text-purple-400">pub fn</span> <span className="text-cyan-400">evaluate_candidate_scent</span>(
                bytecode: &amp;[<span className="text-yellow-400">u8</span>], 
                pool_liquidity: <span className="text-yellow-400">U256</span>
              ) -&gt; <span className="text-pink-400">Result</span>&lt;<span className="text-cyan-400">VetoDecision</span>, <span className="text-red-400">SwarmAbort</span>&gt; &#123;
              <br />
              &nbsp;&nbsp;<span className="text-slate-500">// 1. Mushroom body olfactory glomerulus projection</span>
              <br />
              &nbsp;&nbsp;<span className="text-purple-400">let</span> odor_vector = <span className="text-cyan-400">Or42a::project_hash</span>(bytecode);
              <br />
              &nbsp;&nbsp;<span className="text-purple-400">if</span> odor_vector.toxicity_index() &gt; <span className="text-amber-400">0.82</span> &#123;
              <br />
              &nbsp;&nbsp;&nbsp;&nbsp;<span className="text-purple-400">return</span> <span className="text-red-400">Guard::execute_hard_veto</span>(
                <span className="text-emerald-400">"REENTRANCY_HONEYPOT_DETECTED"</span>
              );
              <br />
              &nbsp;&nbsp;&#125;
              <br />
              <br />
              &nbsp;&nbsp;<span className="text-slate-500">// 2. Optic lobe motion gating before hunter launch</span>
              <br />
              &nbsp;&nbsp;<span className="text-purple-400">let</span> bundle = <span className="text-cyan-400">Hunter::compose_flashbots_bundle</span>(
                pool_liquidity, 
                MAX_SLIPPAGE_BPS
              );
              <br />
              &nbsp;&nbsp;<span className="text-pink-400">Ok</span>(<span className="text-cyan-400">VetoDecision</span>::<span className="text-emerald-400">Landed</span>(bundle))
              <br />
              &#125;
            </pre>
            <div className="mt-3 pt-2 border-t border-slate-800 flex items-center justify-between text-[10px] text-slate-500">
              <span>LATENCY LIMIT: 5.0ms</span>
              <span className="text-cyan-400 animate-pulse">● COMPILER: LLVM-WASM32 READY</span>
            </div>
          </div>
        </div>
      </section>


      {/* =====================================================================
          FINAL BOTTOM CTA BANNER
      ====================================================================== */}
      <section className="relative w-full max-w-4xl mx-auto text-center p-10 rounded-2xl border border-pink-500/40 bg-gradient-to-b from-pink-950/30 to-[#050814] shadow-[0_0_40px_rgba(255,0,127,0.15)] flex flex-col items-center">
        <h3 className="font-['Orbitron'] font-black text-2xl md:text-3xl text-white mb-3">
          EXPERIENCE THE SWARM IN ACTION
        </h3>
        <p className="text-sm text-slate-300 max-w-lg mb-6 font-['Rajdhani']">
          Enter the full mission command terminal. Audit mempool blocks, inspect candidate pools, trigger candidate rotations, and observe the Guard veto engine live.
        </p>
        <button
          onClick={onLaunchTerminal}
          className="inline-flex items-center gap-3 px-8 py-3.5 rounded-md font-['Orbitron'] font-bold text-sm tracking-wider text-black bg-cyan-400 hover:bg-cyan-300 shadow-[0_0_25px_rgba(0,245,255,0.6)] hover:scale-105 transition-all"
        >
          <Terminal className="w-4 h-4 text-black" />
          <span>ENTER COMMAND TERMINAL</span>
          <ChevronRight className="w-4 h-4 text-black" />
        </button>
      </section>

    </div>
  );
};

