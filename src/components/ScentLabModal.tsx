import React, { useState } from 'react';
import { Launch } from '../types';
import { computeScentBreakdown, evaluateScout, evaluateGuard, evaluateHunter } from '../utils/engine';
import { X, Play, ShieldAlert, CheckCircle, Eye, AlertTriangle } from 'lucide-react';

interface ScentLabModalProps {
  isOpen: boolean;
  onClose: () => void;
  onInjectLaunch?: (launch: Launch) => void;
}

export const ScentLabModal: React.FC<ScentLabModalProps> = ({ isOpen, onClose, onInjectLaunch }) => {
  const [ticker, setTicker] = useState('PONSFLY');
  const [age, setAge] = useState(700);
  const [inSnipe, setInSnipe] = useState(false);
  const [wallets, setWallets] = useState(48);
  const [volume, setVolume] = useState(6.2);
  const [creatorPct, setCreatorPct] = useState(0.04);
  const [topHolderPct, setTopHolderPct] = useState(0.05);
  const [mintOpen, setMintOpen] = useState(false);

  if (!isOpen) return null;

  const currentLaunch: Launch = {
    id: `custom-${Date.now().toString().slice(-4)}`,
    ticker,
    pair: '0x9999999999999999999999999999999999999999',
    created_ts: Math.floor(Date.now() / 1000) - age,
    age_s: age,
    unique_wallets: wallets,
    volume_eth: volume,
    creator_pct: creatorPct,
    top_holder_pct: topHolderPct,
    mint_open: mintOpen,
    in_snipe_window: inSnipe,
  };

  const breakdown = computeScentBreakdown(currentLaunch);
  const scoutRes = evaluateScout(currentLaunch, breakdown.total_scent);
  const guardRes = scoutRes.action === 'SKIP' 
    ? { action: 'REFUSED', why: 'low scent' } 
    : evaluateGuard(currentLaunch, breakdown.total_scent);
  const hunterRes = evaluateHunter(guardRes.action, 'paper', false);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="bg-[#050c18] border border-cyan-500/50 rounded-lg max-w-2xl w-full p-6 shadow-2xl relative">
        <div className="flex justify-between items-center pb-3 border-b border-cyan-500/30">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse"></span>
            <h2 className="font-['Orbitron'] text-base tracking-wider text-cyan-400 font-bold">
              SCENT FORMULA LABORATORY // LIVE INTERFACE
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-cyan-500/20 text-gray-400 hover:text-cyan-400 rounded transition"
          >
            <X size={20} />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-4 text-xs font-mono">
          {/* Left: Interactive Controls */}
          <div className="space-y-3.5 bg-black/40 p-4 rounded border border-cyan-500/20">
            <div>
              <label className="text-gray-300 block mb-1">TOKEN TICKER</label>
              <input
                type="text"
                value={ticker}
                onChange={(e) => setTicker(e.target.value)}
                className="w-full bg-[#020611] border border-cyan-500/40 rounded px-2.5 py-1 text-cyan-300 font-bold"
                placeholder="e.g. PONSFLY, VETO, EL VETO"
              />
            </div>

            <div>
              <div className="flex justify-between mb-1">
                <span className="text-gray-300">AGE: {age}s</span>
                <span className="text-cyan-400">f_age = {breakdown.age_factor.toFixed(2)}</span>
              </div>
              <input
                type="range"
                min="0"
                max="1000"
                step="10"
                value={age}
                onChange={(e) => setAge(Number(e.target.value))}
                className="w-full accent-cyan-400"
              />
              <div className="flex items-center gap-2 mt-1">
                <input
                  type="checkbox"
                  id="snipeCheck"
                  checked={inSnipe}
                  onChange={(e) => setInSnipe(e.target.checked)}
                  className="accent-pink-500"
                />
                <label htmlFor="snipeCheck" className="text-pink-400 text-[11px] cursor-pointer">
                  IN SNIPE WINDOW (forces age_factor = 0.0)
                </label>
              </div>
            </div>

            <div>
              <div className="flex justify-between mb-1">
                <span className="text-gray-300">UNIQUE WALLETS: {wallets}</span>
                <span className="text-cyan-400">f_unique = {breakdown.unique_factor.toFixed(2)}</span>
              </div>
              <input
                type="range"
                min="0"
                max="80"
                value={wallets}
                onChange={(e) => setWallets(Number(e.target.value))}
                className="w-full accent-cyan-400"
              />
            </div>

            <div>
              <div className="flex justify-between mb-1">
                <span className="text-gray-300">VOLUME: {volume.toFixed(1)} ETH</span>
                <span className="text-cyan-400">f_vol = {breakdown.volume_factor.toFixed(2)}</span>
              </div>
              <input
                type="range"
                min="0"
                max="15"
                step="0.1"
                value={volume}
                onChange={(e) => setVolume(Number(e.target.value))}
                className="w-full accent-cyan-400"
              />
            </div>

            <div>
              <div className="flex justify-between mb-1">
                <span className="text-gray-300">TOP HOLDER PCT: {(topHolderPct * 100).toFixed(1)}%</span>
                <span className="text-cyan-400">1 - conc = {breakdown.distributed_factor.toFixed(2)}</span>
              </div>
              <input
                type="range"
                min="0"
                max="0.50"
                step="0.01"
                value={topHolderPct}
                onChange={(e) => setTopHolderPct(Number(e.target.value))}
                className="w-full accent-cyan-400"
              />
            </div>

            <div className="pt-2 border-t border-cyan-500/20 flex flex-wrap gap-4">
              <div>
                <label className="text-gray-300 block mb-1">CREATOR SHARE: {(creatorPct * 100).toFixed(1)}%</label>
                <input
                  type="range"
                  min="0"
                  max="0.40"
                  step="0.01"
                  value={creatorPct}
                  onChange={(e) => setCreatorPct(Number(e.target.value))}
                  className="w-full accent-pink-500"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="mintCheck"
                  checked={mintOpen}
                  onChange={(e) => setMintOpen(e.target.checked)}
                  className="accent-pink-500"
                />
                <label htmlFor="mintCheck" className="text-pink-400 text-[11px] cursor-pointer">
                  MINT STILL OPEN
                </label>
              </div>
            </div>
          </div>

          {/* Right: Live Scent Calculation & Three Flies Decision */}
          <div className="space-y-4">
            <div className="bg-[#02050f] p-4 rounded border border-cyan-500/30">
              <div className="text-[11px] text-gray-400 mb-1">COMPUTED SCENT INDEX (0.00 .. 1.00)</div>
              <div className="flex items-baseline gap-2">
                <span className="font-['Orbitron'] text-4xl font-extrabold text-cyan-400 drop-shadow-[0_0_10px_rgba(0,245,255,0.6)]">
                  {breakdown.total_scent.toFixed(2)}
                </span>
                <span className="text-gray-500 text-xs">/ 1.00</span>
              </div>

              {/* Progress bar */}
              <div className="w-full bg-gray-900 h-2.5 rounded-full overflow-hidden mt-2 border border-cyan-500/20">
                <div
                  className="h-full bg-gradient-to-r from-pink-500 via-cyan-400 to-green-400 transition-all duration-300"
                  style={{ width: `${breakdown.total_scent * 100}%` }}
                />
              </div>

              <div className="mt-3 text-[10px] text-gray-400 space-y-1">
                <div>• Age component: 0.25 × {breakdown.age_factor.toFixed(2)} = {(0.25 * breakdown.age_factor).toFixed(3)}</div>
                <div>• Unique component: 0.25 × {breakdown.unique_factor.toFixed(2)} = {(0.25 * breakdown.unique_factor).toFixed(3)}</div>
                <div>• Volume component: 0.25 × {breakdown.volume_factor.toFixed(2)} = {(0.25 * breakdown.volume_factor).toFixed(3)}</div>
                <div>• Distribution: 0.25 × {breakdown.distributed_factor.toFixed(2)} = {(0.25 * breakdown.distributed_factor).toFixed(3)}</div>
              </div>
            </div>

            {/* Verdict of the Three Flies */}
            <div className="space-y-2">
              {/* Scout */}
              <div className="flex items-center justify-between p-2.5 rounded bg-black/60 border border-cyan-500/30">
                <div className="flex items-center gap-2">
                  <span className="text-cyan-400 font-bold font-['Orbitron']">SCOUT FLY</span>
                  <span className="text-gray-400 text-[10px]">(threshold &gt;= 0.35)</span>
                </div>
                <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                  scoutRes.action === 'SNIFF' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500' : 'bg-gray-800 text-gray-400'
                }`}>
                  {scoutRes.action}
                </span>
              </div>

              {/* Guard */}
              <div className="flex items-center justify-between p-2.5 rounded bg-black/60 border border-pink-500/30">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-pink-400 font-bold font-['Orbitron']">GUARD FLY</span>
                    <span className="text-gray-400 text-[10px]">(5 Veto Rules)</span>
                  </div>
                  {guardRes.why && (
                    <div className="text-[10px] text-pink-300 mt-0.5">Veto Reason: {guardRes.why}</div>
                  )}
                </div>
                <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                  guardRes.action === 'PASS' 
                    ? 'bg-green-500/20 text-green-300 border border-green-500' 
                    : 'bg-pink-600/20 text-pink-300 border border-pink-600'
                }`}>
                  {guardRes.action}
                </span>
              </div>

              {/* Hunter */}
              <div className="flex items-center justify-between p-2.5 rounded bg-black/60 border border-emerald-500/30">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-emerald-400 font-bold font-['Orbitron']">HUNTER FLY</span>
                    <span className="text-gray-400 text-[10px]">(Only after PASS)</span>
                  </div>
                  {hunterRes.action === 'LANDED' && (
                    <div className="text-[10px] text-emerald-300 mt-0.5">Fixed Position: 0.04 ETH</div>
                  )}
                </div>
                <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                  hunterRes.action === 'LANDED' 
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500' 
                    : 'bg-gray-800 text-gray-400'
                }`}>
                  {hunterRes.action}
                </span>
              </div>
            </div>

            {onInjectLaunch && (
              <button
                onClick={() => {
                  onInjectLaunch(currentLaunch);
                  onClose();
                }}
                className="w-full py-2 bg-cyan-500/20 hover:bg-cyan-500 text-cyan-300 hover:text-black border border-cyan-400 rounded font-['Orbitron'] text-xs font-bold transition flex items-center justify-center gap-2 tracking-wider"
              >
                <Play size={14} /> INJECT INTO COMMAND CENTER QUEUE
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
