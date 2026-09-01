import { useState } from 'react';

const reportCatalog = [
  { id: 'RPT-001', name: 'Complete Product Genealogy', category: 'Traceability', description: 'Production → parent packaging → all movements → sale → end user', format: 'CSV/PDF', schedule: 'On-demand', lastRun: '2024-11-20' },
  { id: 'RPT-002', name: 'Parent–Child Hierarchy', category: 'Traceability', description: 'Full pallet → carton → product aggregation view', format: 'Excel', schedule: 'On-demand', lastRun: '2024-11-18' },
  { id: 'RPT-003', name: 'Movement & Transit Report', category: 'Supply Chain', description: 'All movements with entry/exit scan status and exceptions', format: 'CSV/PDF', schedule: 'Daily', lastRun: '2024-11-21' },
  { id: 'RPT-004', name: 'Entry vs Exit Reconciliation', category: 'Supply Chain', description: 'Compare dispatched vs received quantities per movement', format: 'Excel', schedule: 'Weekly', lastRun: '2024-11-17' },
  { id: 'RPT-005', name: 'Warehouse Inbound/Outbound', category: 'Warehouse', description: 'Stock in/out by location with parent and child breakdowns', format: 'CSV', schedule: 'Daily', lastRun: '2024-11-21' },
  { id: 'RPT-006', name: 'Distributor/Dealer Stock', category: 'Distribution', description: 'Current custody and stock by distributor and dealer', format: 'Excel', schedule: 'On-demand', lastRun: '2024-11-19' },
  { id: 'RPT-007', name: 'QR Lifecycle Report', category: 'QR', description: 'QR codes by status with full state transition history', format: 'CSV', schedule: 'On-demand', lastRun: '2024-11-15' },
  { id: 'RPT-008', name: 'Missing / Extra / Exception QR', category: 'QR', description: 'All exception scan events with resolution status', format: 'PDF', schedule: 'On-demand', lastRun: '2024-11-10' },
  { id: 'RPT-009', name: 'End User Registration', category: 'Customers', description: 'Customer registrations with product and dealer attribution', format: 'CSV/Excel', schedule: 'Weekly', lastRun: '2024-11-17' },
  { id: 'RPT-010', name: 'Warranty Activation/Expiry', category: 'Warranty', description: 'Warranty activations, upcoming expiries and claim summary', format: 'PDF', schedule: 'Monthly', lastRun: '2024-11-01' },
  { id: 'RPT-011', name: 'Service & Replacement History', category: 'Warranty', description: 'Complete service event and replacement chain per product', format: 'PDF', schedule: 'On-demand', lastRun: '2024-11-20' },
  { id: 'RPT-012', name: 'Counterfeit / Risk Alert Report', category: 'Risk', description: 'Risk events by level, type and resolution status', format: 'PDF', schedule: 'Daily', lastRun: '2024-11-21' },
  { id: 'RPT-013', name: 'Audit Trail Report', category: 'Compliance', description: 'Complete immutable audit log with actor, action and timestamp', format: 'PDF', schedule: 'On-demand', lastRun: '2024-11-19' },
];

const categories = ['All','Traceability','Supply Chain','Warehouse','Distribution','QR','Customers','Warranty','Risk','Compliance'];

const catStyle: Record<string, { color: string; bg: string }> = {
  Traceability:  { color: '#34d399', bg: 'rgba(52,211,153,0.1)'  },
  'Supply Chain':{ color: '#60a5fa', bg: 'rgba(96,165,250,0.1)'  },
  Warehouse:     { color: '#22d3ee', bg: 'rgba(34,211,238,0.1)'  },
  Distribution:  { color: '#a78bfa', bg: 'rgba(167,139,250,0.1)' },
  QR:            { color: '#fbbf24', bg: 'rgba(251,191,36,0.1)'  },
  Customers:     { color: '#2dd4bf', bg: 'rgba(45,212,191,0.1)'  },
  Warranty:      { color: '#818cf8', bg: 'rgba(129,140,248,0.1)' },
  Risk:          { color: '#f87171', bg: 'rgba(248,113,113,0.1)' },
  Compliance:    { color: '#94a3b8', bg: 'rgba(148,163,184,0.1)' },
};

export default function Reports() {
  const [category, setCategory] = useState('All');
  const [running, setRunning] = useState<string | null>(null);

  const filtered = reportCatalog.filter(r => category === 'All' || r.category === category);

  const handleRun = (id: string) => {
    setRunning(id);
    setTimeout(() => setRunning(null), 2000);
  };

  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold" style={{ color: 'var(--tt-text-1)' }}>Reports</h2>
          <p className="text-xs mt-0.5" style={{ color: 'var(--tt-text-3)' }}>Generate and export supply chain, traceability, warranty and compliance reports</p>
        </div>
        <button className="flex items-center gap-2 px-3 py-1.5 text-xs font-semibold rounded border transition-colors"
          style={{ background: 'var(--tt-raised)', border: '1px solid var(--tt-border-2)', color: 'var(--tt-text-2)' }}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-3.5 h-3.5"><path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01"/></svg>
          Scheduled Reports
        </button>
      </div>

      <div className="grid grid-cols-4 gap-3">
        {[
          { label: 'Total Reports', value: reportCatalog.length, color: 'var(--tt-text-1)' },
          { label: 'Scheduled Daily', value: reportCatalog.filter(r => r.schedule === 'Daily').length, color: '#60a5fa' },
          { label: 'Last Generated', value: 'Today', color: '#34d399' },
          { label: 'Formats', value: 'CSV · Excel · PDF', color: 'var(--tt-text-2)' },
        ].map(k => (
          <div key={k.label} className="rounded-lg border p-3"
            style={{ background: 'var(--tt-surface)', borderColor: 'var(--tt-border)' }}>
            <div className="text-lg font-semibold" style={{ color: k.color }}>{k.value}</div>
            <div className="text-xs mt-1" style={{ color: 'var(--tt-text-3)' }}>{k.label}</div>
          </div>
        ))}
      </div>

      <div className="flex gap-1.5 flex-wrap">
        {categories.map(c => (
          <button key={c} onClick={() => setCategory(c)}
            className="px-3 py-1 text-[11px] font-medium rounded border transition-colors"
            style={{
              background: category === c ? 'var(--tt-raised)' : 'transparent',
              borderColor: category === c ? 'var(--tt-border-2)' : 'var(--tt-border)',
              color: category === c ? 'var(--tt-text-1)' : 'var(--tt-text-3)',
            }}>{c}</button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        {filtered.map(r => {
          const cs = catStyle[r.category] ?? catStyle.Compliance;
          return (
            <div key={r.id} className="rounded-lg border p-4 transition-colors"
              style={{ background: 'var(--tt-surface)', borderColor: 'var(--tt-border)' }}
              onMouseEnter={e => (e.currentTarget.style.borderColor = 'var(--tt-border-2)')}
              onMouseLeave={e => (e.currentTarget.style.borderColor = 'var(--tt-border)')}>
              <div className="flex items-start justify-between gap-3 mb-2">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-mono text-[10px]" style={{ color: 'var(--tt-text-3)' }}>{r.id}</span>
                    <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded"
                      style={{ color: cs.color, background: cs.bg }}>{r.category}</span>
                  </div>
                  <div className="text-sm font-semibold" style={{ color: 'var(--tt-text-1)' }}>{r.name}</div>
                  <div className="text-[11px] mt-0.5" style={{ color: 'var(--tt-text-3)' }}>{r.description}</div>
                </div>
              </div>
              <div className="flex items-center justify-between mt-3">
                <div className="flex gap-4 text-[10px]" style={{ color: 'var(--tt-text-3)' }}>
                  <span>Format: <span style={{ color: 'var(--tt-text-2)' }}>{r.format}</span></span>
                  <span>Schedule: <span style={{ color: 'var(--tt-text-2)' }}>{r.schedule}</span></span>
                  <span>Last: <span className="font-mono" style={{ color: 'var(--tt-text-2)' }}>{r.lastRun}</span></span>
                </div>
                <button onClick={() => handleRun(r.id)} disabled={running === r.id}
                  className="flex items-center gap-1.5 px-3 py-1 text-[11px] font-semibold rounded border transition-all"
                  style={{
                    color: running === r.id ? '#34d399' : 'var(--tt-text-2)',
                    borderColor: running === r.id ? 'rgba(52,211,153,0.3)' : 'var(--tt-border)',
                    background: running === r.id ? 'rgba(52,211,153,0.08)' : 'transparent',
                  }}>
                  {running === r.id ? (
                    <><svg className="w-3 h-3 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" strokeOpacity="0.25"/><path d="M12 2a10 10 0 0 1 10 10"/></svg>Generating…</>
                  ) : (
                    <><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3 h-3"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3" strokeLinecap="round"/></svg>Export</>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
