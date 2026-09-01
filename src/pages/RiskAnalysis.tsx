import { useState } from 'react';
import { riskEvents } from '../data/mock';
import type { RiskLevel } from '../data/mock';

const levelCfg: Record<RiskLevel, { color: string; bg: string; border: string; bar: string; dot: string }> = {
  Low:      { color: '#34d399', bg: 'rgba(52,211,153,0.05)',  border: 'rgba(52,211,153,0.2)',  bar: '#34d399', dot: '#34d399' },
  Medium:   { color: '#fbbf24', bg: 'rgba(251,191,36,0.05)',  border: 'rgba(251,191,36,0.2)',  bar: '#fbbf24', dot: '#fbbf24' },
  High:     { color: '#fb923c', bg: 'rgba(251,146,60,0.05)',  border: 'rgba(251,146,60,0.2)',  bar: '#fb923c', dot: '#fb923c' },
  Critical: { color: '#ef4444', bg: 'rgba(239,68,68,0.07)',   border: 'rgba(239,68,68,0.25)', bar: '#ef4444', dot: '#ef4444' },
};

const statusStyle: Record<string, { color: string; bg: string; border: string }> = {
  Open:           { color: '#f87171', bg: 'rgba(248,113,113,0.1)', border: 'rgba(248,113,113,0.2)' },
  'Under Review': { color: '#fbbf24', bg: 'rgba(251,191,36,0.1)',  border: 'rgba(251,191,36,0.2)'  },
  Reviewed:       { color: '#60a5fa', bg: 'rgba(96,165,250,0.1)',  border: 'rgba(96,165,250,0.2)'  },
  Resolved:       { color: '#34d399', bg: 'rgba(52,211,153,0.1)',  border: 'rgba(52,211,153,0.2)'  },
};

export default function RiskAnalysis() {
  const [filterLevel, setFilterLevel] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
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
        <h2 className="text-lg font-semibold" style={{ color: 'var(--tt-text-1)' }}>Risk Analysis</h2>
        <p className="text-xs mt-0.5" style={{ color: 'var(--tt-text-3)' }}>Anti-counterfeit alerts, movement anomalies, and risk scores</p>
      </div>

      <div className="grid grid-cols-4 gap-3">
        {[
          { label: 'Total Events', value: counts.total, color: 'var(--tt-text-1)', bg: 'var(--tt-surface)', border: 'var(--tt-border)' },
          { label: 'Critical', value: counts.critical, color: '#ef4444', bg: 'rgba(239,68,68,0.05)', border: 'rgba(239,68,68,0.2)' },
          { label: 'High Risk', value: counts.high, color: '#fb923c', bg: 'rgba(251,146,60,0.05)', border: 'rgba(251,146,60,0.2)' },
          { label: 'Open / Unresolved', value: counts.open, color: '#fbbf24', bg: 'rgba(251,191,36,0.05)', border: 'rgba(251,191,36,0.2)' },
        ].map(k => (
          <div key={k.label} className="rounded-lg p-3" style={{ background: k.bg, border: `1px solid ${k.border}` }}>
            <div className="text-xl font-semibold font-mono" style={{ color: k.color }}>{k.value}</div>
            <div className="text-xs mt-1" style={{ color: 'var(--tt-text-3)' }}>{k.label}</div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex gap-4 flex-wrap">
        <div className="flex gap-1.5">
          {['all','Critical','High','Medium','Low'].map(f => {
            const cfg = f !== 'all' ? levelCfg[f as RiskLevel] : null;
            return (
              <button key={f} onClick={() => setFilterLevel(f)}
                className="px-3 py-1 text-[11px] font-medium rounded border transition-colors"
                style={{
                  background: filterLevel === f ? (cfg?.bg ?? 'var(--tt-raised)') : 'transparent',
                  borderColor: filterLevel === f ? (cfg?.border ?? 'var(--tt-border-2)') : 'var(--tt-border)',
                  color: filterLevel === f ? (cfg?.color ?? 'var(--tt-text-1)') : 'var(--tt-text-3)',
                }}>
                {f === 'all' ? 'All Levels' : f}
              </button>
            );
          })}
        </div>
        <div className="flex gap-1.5">
          {['all','Open','Under Review','Reviewed','Resolved'].map(f => (
            <button key={f} onClick={() => setFilterStatus(f)}
              className="px-3 py-1 text-[11px] font-medium rounded border transition-colors"
              style={{
                background: filterStatus === f ? 'var(--tt-raised)' : 'transparent',
                borderColor: filterStatus === f ? 'var(--tt-border-2)' : 'var(--tt-border)',
                color: filterStatus === f ? 'var(--tt-text-1)' : 'var(--tt-text-3)',
              }}>
              {f === 'all' ? 'All Status' : f}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        {filtered.map(r => {
          const cfg = levelCfg[r.level];
          const ss = statusStyle[r.status];
          const isOpen = selected === r.id;
          return (
            <div key={r.id} className="rounded-lg border cursor-pointer overflow-hidden transition-all"
              style={{ background: cfg.bg, borderColor: isOpen ? cfg.color : cfg.border }}
              onClick={() => setSelected(isOpen ? null : r.id)}>
              <div className="p-4 flex items-start gap-3">
                <div className="relative w-2 h-2 flex-shrink-0 mt-1.5">
                  <div className="w-2 h-2 rounded-full" style={{ background: cfg.dot }} />
                  {(r.level === 'Critical' || r.level === 'High') && r.status === 'Open' && (
                    <span className="absolute inset-0 rounded-full animate-ping opacity-60" style={{ background: cfg.dot }} />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                    <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: cfg.color }}>{r.level}</span>
                    <span className="text-[10px]" style={{ color: 'var(--tt-text-3)' }}>·</span>
                    <span className="text-[11px] font-semibold" style={{ color: cfg.color }}>{r.type}</span>
                    <span className="ml-auto inline-flex px-1.5 py-0.5 rounded border text-[10px] font-semibold"
                      style={{ color: ss.color, background: ss.bg, borderColor: ss.border }}>{r.status}</span>
                  </div>
                  <div className="flex items-center gap-3 flex-wrap">
                    <span className="font-mono text-[11px]" style={{ color: 'var(--tt-text-2)' }}>{r.qr}</span>
                    <span className="text-[10px]" style={{ color: 'var(--tt-text-3)' }}>·</span>
                    <span className="text-[11px]" style={{ color: 'var(--tt-text-2)' }}>{r.product}</span>
                    <span className="text-[10px]" style={{ color: 'var(--tt-text-3)' }}>·</span>
                    <span className="font-mono text-[10px]" style={{ color: 'var(--tt-text-3)' }}>{r.timestamp}</span>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1 flex-shrink-0">
                  <span className="font-mono text-2xl font-bold leading-none" style={{ color: cfg.color }}>{r.score}</span>
                  <div className="w-16 rounded-full h-1" style={{ background: 'var(--tt-raised)' }}>
                    <div className="h-1 rounded-full" style={{ width: `${r.score}%`, background: cfg.bar }} />
                  </div>
                  <span className="text-[9px]" style={{ color: 'var(--tt-text-3)' }}>RISK SCORE</span>
                </div>
              </div>
              {isOpen && (
                <div className="px-4 pb-4 pt-0" style={{ borderTop: `1px solid ${cfg.border}` }}>
                  <div className="grid grid-cols-2 gap-3 mb-3 mt-3 text-xs">
                    {[
                      ['Event ID', r.id], ['Detected At', r.location],
                      ...(r.expectedLocation ? [['Expected Location', r.expectedLocation]] : []),
                      ['Timestamp', r.timestamp],
                    ].map(([l, v]) => (
                      <div key={l as string} className="rounded-lg p-2.5"
                        style={{ background: 'var(--tt-raised)', border: '1px solid var(--tt-border)' }}>
                        <div className="text-[10px] uppercase tracking-wider mb-0.5" style={{ color: 'var(--tt-text-3)' }}>{l}</div>
                        <div className="font-mono" style={{ color: 'var(--tt-text-1)' }}>{v}</div>
                      </div>
                    ))}
                  </div>
                  <div className="rounded-lg p-3 mb-3" style={{ background: 'var(--tt-raised)', border: '1px solid var(--tt-border)' }}>
                    <div className="text-[10px] uppercase tracking-wider mb-1" style={{ color: 'var(--tt-text-3)' }}>Description</div>
                    <div className="text-xs leading-relaxed" style={{ color: 'var(--tt-text-1)' }}>{r.description}</div>
                  </div>
                  <div className="flex gap-2">
                    {r.status === 'Open' && (
                      <>
                        <button className="px-3 py-1.5 text-[11px] font-semibold rounded border transition-colors"
                          style={{ background: 'var(--tt-raised)', borderColor: 'var(--tt-border)', color: 'var(--tt-text-2)' }}>
                          Mark Under Review
                        </button>
                        <button className="px-3 py-1.5 text-[11px] font-semibold rounded border transition-colors"
                          style={{ background: 'rgba(239,68,68,0.12)', borderColor: 'rgba(239,68,68,0.25)', color: '#f87171' }}>
                          Escalate
                        </button>
                      </>
                    )}
                    {r.status === 'Under Review' && (
                      <button className="px-3 py-1.5 text-[11px] font-semibold rounded border transition-colors"
                        style={{ background: 'rgba(52,211,153,0.12)', borderColor: 'rgba(52,211,153,0.25)', color: '#34d399' }}>
                        Mark Resolved
                      </button>
                    )}
                    <button className="px-3 py-1.5 text-[11px] font-medium transition-colors"
                      style={{ color: 'var(--tt-text-3)' }}>View Audit Trail</button>
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
