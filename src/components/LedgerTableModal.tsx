import React, { useState } from 'react';
import { Decision } from '../types';
import { X, Download, Filter, CheckCircle2, XCircle, Search } from 'lucide-react';

interface LedgerTableModalProps {
  isOpen: boolean;
  onClose: () => void;
  decisions: Decision[];
}

export const LedgerTableModal: React.FC<LedgerTableModalProps> = ({
  isOpen,
  onClose,
  decisions,
}) => {
  const [filter, setFilter] = useState<'ALL' | 'LANDED' | 'REFUSED'>('ALL');
  const [search, setSearch] = useState('');

  if (!isOpen) return null;

  const filtered = decisions.filter((d) => {
    if (filter === 'LANDED' && d.hunter !== 'LANDED') return false;
    if (filter === 'REFUSED' && d.guard !== 'REFUSED') return false;
    if (search && !d.ticker.toLowerCase().includes(search.toLowerCase()) && !d.launch_id.toLowerCase().includes(search.toLowerCase())) {
      return false;
    }
    return true;
  });

  const exportJsonl = () => {
    const content = decisions.map((d) => JSON.stringify(d)).join('\n');
    const blob = new Blob([content], { type: 'application/x-jsonlines' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'ledger.jsonl';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm p-4">
      <div className="bg-[#050c18] border border-cyan-500/50 rounded-lg max-w-4xl w-full p-6 shadow-2xl relative flex flex-col max-h-[90vh]">
        <div className="flex justify-between items-center pb-3 border-b border-cyan-500/30">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400"></span>
            <h2 className="font-['Orbitron'] text-base tracking-wider text-cyan-400 font-bold">
              AUDIT LEDGER // LEDGER.JSONL
            </h2>
            <span className="text-xs font-mono text-gray-400">({decisions.length} entries)</span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={exportJsonl}
              className="flex items-center gap-1.5 px-3 py-1 bg-cyan-500/20 hover:bg-cyan-500 text-cyan-300 hover:text-black border border-cyan-500/40 rounded text-xs font-mono font-bold transition"
            >
              <Download size={14} /> EXPORT .JSONL
            </button>
            <button
              onClick={onClose}
              className="p-1 hover:bg-cyan-500/20 text-gray-400 hover:text-cyan-400 rounded transition"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center justify-between gap-3 py-3 border-b border-cyan-500/20 text-xs font-mono">
          <div className="flex items-center gap-2">
            <Search size={14} className="text-gray-400" />
            <input
              type="text"
              placeholder="Filter by ticker or ID..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-[#020611] border border-cyan-500/30 rounded px-2.5 py-1 text-cyan-300 w-48 text-xs"
            />
          </div>
          <div className="flex gap-1.5">
            {(['ALL', 'LANDED', 'REFUSED'] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-3 py-1 rounded border text-xs font-bold transition ${
                  filter === f
                    ? 'bg-cyan-500/30 text-cyan-300 border-cyan-400'
                    : 'bg-black/40 text-gray-400 border-gray-800 hover:border-gray-700'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        <div className="overflow-y-auto flex-1 mt-3 text-xs font-mono">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-cyan-500/20 text-gray-400 text-[11px]">
                <th className="pb-2 font-semibold">TIMESTAMP</th>
                <th className="pb-2 font-semibold">TICKER</th>
                <th className="pb-2 font-semibold">SCENT</th>
                <th className="pb-2 font-semibold">SCOUT</th>
                <th className="pb-2 font-semibold">GUARD</th>
                <th className="pb-2 font-semibold">VETO REASON</th>
                <th className="pb-2 font-semibold">HUNTER</th>
                <th className="pb-2 font-semibold">SIZE</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800/60">
              {filtered.map((d, i) => (
                <tr key={i} className="hover:bg-cyan-500/5 transition">
                  <td className="py-2.5 text-gray-500 text-[10px]">
                    {d.ts.split('T')[1]?.slice(0, 8) || d.ts}
                  </td>
                  <td className="py-2.5 font-bold text-cyan-300">{d.ticker}</td>
                  <td className="py-2.5 font-bold text-sky-400">{d.scent.toFixed(2)}</td>
                  <td className="py-2.5">
                    <span
                      className={`px-1.5 py-0.5 rounded text-[10px] ${
                        d.scout === 'SNIFF' ? 'bg-cyan-500/20 text-cyan-300' : 'bg-gray-800 text-gray-400'
                      }`}
                    >
                      {d.scout}
                    </span>
                  </td>
                  <td className="py-2.5">
                    <span
                      className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                        d.guard === 'PASS'
                          ? 'bg-emerald-500/20 text-emerald-400'
                          : 'bg-pink-500/20 text-pink-400'
                      }`}
                    >
                      {d.guard}
                    </span>
                  </td>
                  <td className="py-2.5 text-pink-300/90 text-[11px]">{d.why || '—'}</td>
                  <td className="py-2.5">
                    <span
                      className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                        d.hunter === 'LANDED'
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                          : 'text-gray-500'
                      }`}
                    >
                      {d.hunter}
                    </span>
                  </td>
                  <td className="py-2.5 text-gray-300 font-bold">
                    {d.size_eth ? `${d.size_eth} ETH` : '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
