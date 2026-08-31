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

const categories = ['All', 'Traceability', 'Supply Chain', 'Warehouse', 'Distribution', 'QR', 'Customers', 'Warranty', 'Risk', 'Compliance'];

const catColor: Record<string, string> = {
  Traceability: 'text-emerald-400 bg-emerald-500/10',
  'Supply Chain': 'text-blue-400 bg-blue-500/10',
  Warehouse: 'text-cyan-400 bg-cyan-500/10',
  Distribution: 'text-violet-400 bg-violet-500/10',
  QR: 'text-amber-400 bg-amber-500/10',
  Customers: 'text-teal-400 bg-teal-500/10',
  Warranty: 'text-indigo-400 bg-indigo-500/10',
  Risk: 'text-red-400 bg-red-500/10',
  Compliance: 'text-slate-400 bg-slate-500/10',
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
          <h2 className="text-lg font-semibold text-slate-100">Reports</h2>
          <p className="text-xs text-slate-500 mt-0.5">Generate and export supply chain, traceability, warranty and compliance reports</p>
        </div>
        <button className="flex items-center gap-2 px-3 py-1.5 bg-[#1e2d45] hover:bg-[#2d4a78] text-slate-300 text-xs font-semibold rounded transition-colors border border-[#2d4a78]">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-3.5 h-3.5"><path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01"/></svg>
          Scheduled Reports
        </button>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-4 gap-3">
        {[
          { label: 'Total Reports', value: reportCatalog.length, color: 'text-slate-200' },
          { label: 'Scheduled (Daily)', value: reportCatalog.filter(r => r.schedule === 'Daily').length, color: 'text-blue-400' },
          { label: 'Last Generated', value: 'Today', color: 'text-emerald-400' },
          { label: 'Formats', value: 'CSV · Excel · PDF', color: 'text-slate-400' },
        ].map(k => (
          <div key={k.label} className="bg-[#0f1623] border border-[#1e2d45] rounded-lg p-3">
            <div className={`text-xl font-semibold ${k.color}`}>{k.value}</div>
            <div className="text-xs text-slate-400 mt-1">{k.label}</div>
          </div>
        ))}
      </div>

      {/* Category Filter */}
      <div className="flex gap-1.5 flex-wrap">
        {categories.map(c => (
          <button key={c} onClick={() => setCategory(c)}
            className={`px-3 py-1 text-[11px] font-medium rounded border transition-colors ${category === c ? 'bg-[#1e2d45] text-slate-200 border-[#2d4a78]' : 'text-slate-500 border-transparent hover:border-[#1e2d45] hover:text-slate-300'}`}>
            {c}
          </button>
        ))}
      </div>

      {/* Report Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        {filtered.map(r => (
          <div key={r.id} className="bg-[#0f1623] border border-[#1e2d45] rounded-lg p-4 hover:border-[#2d4a78] transition-colors">
            <div className="flex items-start justify-between gap-3 mb-2">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-mono text-[10px] text-slate-600">{r.id}</span>
                  <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded ${catColor[r.category]}`}>{r.category}</span>
                </div>
                <div className="text-sm font-semibold text-slate-200">{r.name}</div>
                <div className="text-[11px] text-slate-500 mt-0.5">{r.description}</div>
              </div>
            </div>
            <div className="flex items-center justify-between mt-3">
              <div className="flex gap-4 text-[10px] text-slate-500">
                <span>Format: <span className="text-slate-400">{r.format}</span></span>
                <span>Schedule: <span className="text-slate-400">{r.schedule}</span></span>
                <span>Last: <span className="font-mono text-slate-400">{r.lastRun}</span></span>
              </div>
              <button
                onClick={() => handleRun(r.id)}
                disabled={running === r.id}
                className={`flex items-center gap-1.5 px-3 py-1 text-[11px] font-semibold rounded border transition-all ${
                  running === r.id
                    ? 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10'
                    : 'text-slate-400 border-[#1e2d45] hover:text-slate-200 hover:border-[#2d4a78]'
                }`}>
                {running === r.id ? (
                  <>
                    <svg className="w-3 h-3 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" strokeOpacity="0.25"/><path d="M12 2a10 10 0 0 1 10 10" /></svg>
                    Generating...
                  </>
                ) : (
                  <>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3 h-3"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3"/></svg>
                    Export
                  </>
                )}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
