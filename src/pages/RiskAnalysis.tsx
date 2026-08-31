import { useState } from 'react';
import { riskEvents } from '../data/mock';
import type { RiskLevel } from '../data/mock';

const levelConfig: Record<RiskLevel, { bg: string; border: string; text: string; dot: string; score: string }> = {
  Low: { bg: 'bg-emerald-500/5', border: 'border-emerald-500/20', text: 'text-emerald-400', dot: 'bg-emerald-400', score: 'bg-emerald-400' },
  Medium: { bg: 'bg-amber-500/5', border: 'border-amber-500/20', text: 'text-amber-400', dot: 'bg-amber-400', score: 'bg-amber-400' },
  High: { bg: 'bg-orange-500/5', border: 'border-orange-500/20', text: 'text-orange-400', dot: 'bg-orange-400', score: 'bg-orange-400' },
  Critical: { bg: 'bg-red-500/8', border: 'border-red-500/30', text: 'text-red-400', dot: 'bg-red-400', score: 'bg-red-500' },
};

const statusBadge: Record<string, string> = {
  Open: 'text-red-400 bg-red-400/10 border-red-400/20',
  'Under Review': 'text-amber-400 bg-amber-400/10 border-amber-400/20',
  Reviewed: 'text-blue-400 bg-blue-400/10 border-blue-400/20',
  Resolved: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20',
};

export default function RiskAnalysis() {
  const [filterLevel, setFilterLevel] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [selected, setSelected] = useState<string | null>(null);

  const filtered = riskEvents.filter(r =>
    (filterLevel === 'all' || r.level === filterLevel) &&
    (filterStatus === 'all' || r.status === filterStatus)
  );

  const counts = {
    total: riskEvents.length,
    critical: riskEvents.filter(r => r.level === 'Critical').length,
    high: riskEvents.filter(r => r.level === 'High').length,
    open: riskEvents.filter(r => r.status === 'Open').length,
  };

  return (
    <div className="p-6 space-y-4">
      <div>
        <h2 className="text-lg font-semibold text-slate-100">Risk Analysis</h2>
        <p className="text-xs text-slate-500 mt-0.5">Anti-counterfeit alerts, movement anomalies, and risk scores</p>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-4 gap-3">
        <div className="bg-[#0f1623] border border-[#1e2d45] rounded-lg p-3">
          <div className="text-xl font-semibold font-mono text-slate-200">{counts.total}</div>
          <div className="text-xs text-slate-400 mt-1">Total Events</div>
        </div>
        <div className="bg-red-500/5 border border-red-500/20 rounded-lg p-3">
          <div className="text-xl font-semibold font-mono text-red-400">{counts.critical}</div>
          <div className="text-xs text-red-400/60 mt-1">Critical</div>
        </div>
        <div className="bg-orange-500/5 border border-orange-500/20 rounded-lg p-3">
          <div className="text-xl font-semibold font-mono text-orange-400">{counts.high}</div>
          <div className="text-xs text-orange-400/60 mt-1">High Risk</div>
        </div>
        <div className="bg-amber-500/5 border border-amber-500/20 rounded-lg p-3">
          <div className="text-xl font-semibold font-mono text-amber-400">{counts.open}</div>
          <div className="text-xs text-amber-400/60 mt-1">Open / Unresolved</div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-4">
        <div className="flex gap-1.5">
          {['all', 'Critical', 'High', 'Medium', 'Low'].map(f => (
            <button key={f} onClick={() => setFilterLevel(f)}
              className={`px-3 py-1 text-[11px] font-medium rounded border transition-colors ${filterLevel === f ? (
                f === 'Critical' ? 'bg-red-500/20 text-red-400 border-red-500/30' :
                f === 'High' ? 'bg-orange-500/20 text-orange-400 border-orange-500/30' :
                f === 'Medium' ? 'bg-amber-500/20 text-amber-400 border-amber-500/30' :
                f === 'Low' ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' :
                'bg-[#1e2d45] text-slate-300 border-[#2d4a78]'
              ) : 'text-slate-500 border-transparent hover:border-[#1e2d45] hover:text-slate-300'}`}>
              {f === 'all' ? 'All Levels' : f}
            </button>
          ))}
        </div>
        <div className="flex gap-1.5">
          {['all', 'Open', 'Under Review', 'Reviewed', 'Resolved'].map(f => (
            <button key={f} onClick={() => setFilterStatus(f)}
              className={`px-3 py-1 text-[11px] font-medium rounded border transition-colors ${filterStatus === f ? 'bg-[#1e2d45] text-slate-300 border-[#2d4a78]' : 'text-slate-500 border-transparent hover:border-[#1e2d45] hover:text-slate-300'}`}>
              {f === 'all' ? 'All Status' : f}
            </button>
          ))}
        </div>
      </div>

      {/* Risk Events */}
      <div className="space-y-2">
        {filtered.map(r => {
          const cfg = levelConfig[r.level];
          const isOpen = selected === r.id;
          return (
            <div key={r.id} className={`border rounded-lg cursor-pointer transition-all ${cfg.bg} ${cfg.border} ${isOpen ? 'ring-1 ring-current/30' : 'hover:border-current/30'}`}
              style={{ color: cfg.text.replace('text-', '') }}
              onClick={() => setSelected(isOpen ? null : r.id)}>
              <div className="p-4 flex items-start gap-3">
                <div className={`w-2 h-2 rounded-full flex-shrink-0 mt-1 ${cfg.dot} relative`}>
                  {(r.level === 'Critical' || r.level === 'High') && r.status === 'Open' && (
                    <span className={`absolute inset-0 rounded-full ${cfg.dot} animate-ping opacity-75`} />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className={`text-[10px] font-bold uppercase tracking-widest ${cfg.text}`}>{r.level}</span>
                    <span className="text-[10px] text-slate-600">·</span>
                    <span className={`text-[10px] font-semibold ${cfg.text}`}>{r.type}</span>
                    <span className={`ml-auto inline-flex px-1.5 py-0.5 rounded border text-[10px] font-medium ${statusBadge[r.status]}`}>{r.status}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-[11px] text-slate-400">{r.qr}</span>
                    <span className="text-[10px] text-slate-500">·</span>
                    <span className="text-[11px] text-slate-400">{r.product}</span>
                    <span className="text-[10px] text-slate-500">·</span>
                    <span className="font-mono text-[10px] text-slate-500">{r.timestamp}</span>
                  </div>
                </div>
                {/* Score bar */}
                <div className="flex flex-col items-end gap-1 flex-shrink-0">
                  <span className={`font-mono text-xl font-semibold ${cfg.text}`}>{r.score}</span>
                  <div className="w-16 bg-[#1e2d45] rounded-full h-1">
                    <div className={`h-1 rounded-full ${cfg.score}`} style={{ width: `${r.score}%` }} />
                  </div>
                  <span className="text-[9px] text-slate-600">RISK SCORE</span>
                </div>
              </div>

              {isOpen && (
                <div className="border-t border-current/10 px-4 pb-4 pt-3">
                  <div className="grid grid-cols-2 gap-4 mb-3 text-xs">
                    <div>
                      <div className="text-[10px] text-slate-500 mb-0.5 uppercase tracking-wider">Event ID</div>
                      <div className="font-mono text-slate-300">{r.id}</div>
                    </div>
                    <div>
                      <div className="text-[10px] text-slate-500 mb-0.5 uppercase tracking-wider">Detected At</div>
                      <div className="font-mono text-slate-300">{r.location}</div>
                    </div>
                    {r.expectedLocation && (
                      <div>
                        <div className="text-[10px] text-slate-500 mb-0.5 uppercase tracking-wider">Expected Location</div>
                        <div className="font-mono text-slate-300">{r.expectedLocation}</div>
                      </div>
                    )}
                    <div>
                      <div className="text-[10px] text-slate-500 mb-0.5 uppercase tracking-wider">Timestamp</div>
                      <div className="font-mono text-slate-300">{r.timestamp}</div>
                    </div>
                  </div>
                  <div className="mb-3">
                    <div className="text-[10px] text-slate-500 mb-0.5 uppercase tracking-wider">Description</div>
                    <div className="text-xs text-slate-300 leading-relaxed">{r.description}</div>
                  </div>
                  <div className="flex gap-2">
                    {r.status === 'Open' && (
                      <>
                        <button className="px-3 py-1.5 text-[11px] font-semibold bg-[#1e2d45] text-slate-300 rounded hover:bg-[#2d4a78] transition-colors">Mark Under Review</button>
                        <button className="px-3 py-1.5 text-[11px] font-semibold bg-red-500/20 text-red-400 border border-red-500/30 rounded hover:bg-red-500/30 transition-colors">Escalate</button>
                      </>
                    )}
                    {r.status === 'Under Review' && (
                      <button className="px-3 py-1.5 text-[11px] font-semibold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded hover:bg-emerald-500/30 transition-colors">Mark Resolved</button>
                    )}
                    <button className="px-3 py-1.5 text-[11px] font-medium text-slate-500 hover:text-slate-300 transition-colors">View Full Audit Trail</button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
