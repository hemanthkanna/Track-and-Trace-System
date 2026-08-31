import { useState } from 'react';
import { qrBatches, childQRs, parentQRs, products } from '../data/mock';
import type { QRStatus, ParentQRStatus } from '../data/mock';

const statusColor: Record<string, string> = {
  Generated: 'text-slate-400 bg-slate-400/10 border-slate-400/20',
  Assigned: 'text-blue-400 bg-blue-400/10 border-blue-400/20',
  Activated: 'text-teal-400 bg-teal-400/10 border-teal-400/20',
  'In Stock': 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20',
  'In Transit': 'text-amber-400 bg-amber-400/10 border-amber-400/20',
  Sold: 'text-violet-400 bg-violet-400/10 border-violet-400/20',
  Registered: 'text-cyan-400 bg-cyan-400/10 border-cyan-400/20',
  Service: 'text-orange-400 bg-orange-400/10 border-orange-400/20',
  Replaced: 'text-slate-400 bg-slate-400/10 border-slate-400/20',
  Blocked: 'text-red-400 bg-red-400/10 border-red-400/20',
  Packed: 'text-blue-400 bg-blue-400/10 border-blue-400/20',
  Received: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20',
  Opened: 'text-amber-400 bg-amber-400/10 border-amber-400/20',
  Retired: 'text-slate-500 bg-slate-500/10 border-slate-500/20',
};

function StatusBadge({ status }: { status: string }) {
  return (
    <span className={`inline-flex items-center px-1.5 py-0.5 rounded border text-[10px] font-medium ${statusColor[status] ?? 'text-slate-400 bg-slate-400/10 border-slate-400/20'}`}>
      {status}
    </span>
  );
}

export default function QRManagement() {
  const [tab, setTab] = useState<'batches' | 'child' | 'parent'>('batches');
  const [search, setSearch] = useState('');
  const [showGenModal, setShowGenModal] = useState(false);

  const filteredChild = childQRs.filter(q =>
    search === '' || q.id.toLowerCase().includes(search.toLowerCase()) || q.productId.toLowerCase().includes(search.toLowerCase())
  );
  const filteredParent = parentQRs.filter(q =>
    search === '' || q.id.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-slate-100">QR Management</h2>
          <p className="text-xs text-slate-500 mt-0.5">Manage QR batches, product codes and parent packaging codes</p>
        </div>
        <button
          onClick={() => setShowGenModal(true)}
          className="flex items-center gap-2 px-3 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-black text-sm font-semibold rounded-md transition-colors"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4"><path d="M12 5v14M5 12h14"/></svg>
          Generate QR Batch
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-4 gap-3">
        <div className="bg-[#0f1623] border border-[#1e2d45] rounded-lg p-3">
          <div className="text-xl font-semibold text-blue-400 font-mono">1,150</div>
          <div className="text-xs text-slate-400 mt-1">Total QR Codes</div>
        </div>
        <div className="bg-[#0f1623] border border-[#1e2d45] rounded-lg p-3">
          <div className="text-xl font-semibold text-emerald-400 font-mono">982</div>
          <div className="text-xs text-slate-400 mt-1">Activated</div>
        </div>
        <div className="bg-[#0f1623] border border-[#1e2d45] rounded-lg p-3">
          <div className="text-xl font-semibold text-amber-400 font-mono">115</div>
          <div className="text-xs text-slate-400 mt-1">Parent QR Codes</div>
        </div>
        <div className="bg-[#0f1623] border border-[#1e2d45] rounded-lg p-3">
          <div className="text-xl font-semibold text-red-400 font-mono">1</div>
          <div className="text-xs text-slate-400 mt-1">Blocked</div>
        </div>
      </div>

      {/* Tab Nav */}
      <div className="flex items-center gap-1 border-b border-[#1e2d45] -mb-2">
        {(['batches', 'child', 'parent'] as const).map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-4 py-2 text-xs font-medium capitalize transition-colors border-b-2 -mb-px ${tab === t ? 'border-emerald-500 text-emerald-400' : 'border-transparent text-slate-500 hover:text-slate-300'}`}>
            {t === 'batches' ? 'QR Batches' : t === 'child' ? 'Product QR Codes' : 'Parent QR Codes'}
          </button>
        ))}
        {tab !== 'batches' && (
          <div className="ml-auto mb-2">
            <input value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search QR code..."
              className="bg-[#0f1623] border border-[#1e2d45] rounded px-3 py-1 text-xs text-slate-300 placeholder-slate-600 focus:outline-none focus:border-emerald-500/50 w-52 font-mono"
            />
          </div>
        )}
      </div>

      {/* QR Batches Tab */}
      {tab === 'batches' && (
        <div className="bg-[#0f1623] border border-[#1e2d45] rounded-lg overflow-hidden">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-[#1e2d45]">
                {['Batch ID', 'Production Batch', 'Type', 'Generated', 'Total QR', 'Parent QR', 'Assigned', 'Activated', 'Status'].map(h => (
                  <th key={h} className="px-3 py-2.5 text-left text-[10px] font-semibold text-slate-500 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1e2d45]">
              {qrBatches.map(b => (
                <tr key={b.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="px-3 py-2.5 font-mono text-blue-400">{b.id}</td>
                  <td className="px-3 py-2.5 font-mono text-slate-400">{b.batchId}</td>
                  <td className="px-3 py-2.5 text-slate-300">{b.type}</td>
                  <td className="px-3 py-2.5 text-slate-400">{b.generated}</td>
                  <td className="px-3 py-2.5 font-mono text-slate-300">{b.quantity}</td>
                  <td className="px-3 py-2.5 font-mono text-slate-300">{b.parentQty}</td>
                  <td className="px-3 py-2.5 font-mono text-slate-300">{b.assigned}</td>
                  <td className="px-3 py-2.5 font-mono text-emerald-400">{b.activated}</td>
                  <td className="px-3 py-2.5"><StatusBadge status={b.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Child QR Tab */}
      {tab === 'child' && (
        <div className="bg-[#0f1623] border border-[#1e2d45] rounded-lg overflow-hidden">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-[#1e2d45]">
                {['QR Code', 'Product', 'Parent QR', 'Batch', 'Status', 'Current Location', 'Last Scan', 'End User'].map(h => (
                  <th key={h} className="px-3 py-2.5 text-left text-[10px] font-semibold text-slate-500 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1e2d45]">
              {filteredChild.map(q => {
                const prod = products.find(p => p.id === q.productId);
                return (
                  <tr key={q.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="px-3 py-2.5 font-mono text-emerald-400 text-[11px]">{q.id}</td>
                    <td className="px-3 py-2.5 text-slate-300">{prod?.name ?? q.productId}</td>
                    <td className="px-3 py-2.5 font-mono text-slate-500 text-[10px]">{q.parentId}</td>
                    <td className="px-3 py-2.5 font-mono text-slate-500">{q.batch}</td>
                    <td className="px-3 py-2.5"><StatusBadge status={q.status} /></td>
                    <td className="px-3 py-2.5 font-mono text-slate-400 text-[10px]">{q.location}</td>
                    <td className="px-3 py-2.5 font-mono text-slate-500 text-[10px]">{q.lastScan}</td>
                    <td className="px-3 py-2.5 font-mono text-violet-400 text-[10px]">{q.endUser ?? '—'}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Parent QR Tab */}
      {tab === 'parent' && (
        <div className="bg-[#0f1623] border border-[#1e2d45] rounded-lg overflow-hidden">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-[#1e2d45]">
                {['Parent QR', 'Type', 'Pallet Parent', 'Product', 'Status', 'Child Count', 'Active Packed', 'Location', 'Last Scan'].map(h => (
                  <th key={h} className="px-3 py-2.5 text-left text-[10px] font-semibold text-slate-500 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1e2d45]">
              {filteredParent.map(q => {
                const prod = products.find(p => p.id === q.productId);
                return (
                  <tr key={q.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="px-3 py-2.5 font-mono text-amber-400 text-[11px]">{q.id}</td>
                    <td className="px-3 py-2.5">
                      <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded ${q.type === 'Pallet' ? 'bg-violet-500/10 text-violet-400' : 'bg-blue-500/10 text-blue-400'}`}>{q.type}</span>
                    </td>
                    <td className="px-3 py-2.5 font-mono text-slate-500 text-[10px]">{q.palletId ?? '—'}</td>
                    <td className="px-3 py-2.5 text-slate-300 text-[11px]">{prod?.name ?? q.productId}</td>
                    <td className="px-3 py-2.5"><StatusBadge status={q.status} /></td>
                    <td className="px-3 py-2.5 font-mono text-slate-300">{q.childCount}</td>
                    <td className="px-3 py-2.5 font-mono text-emerald-400">{q.activePacked}</td>
                    <td className="px-3 py-2.5 font-mono text-slate-400 text-[10px]">{q.location}</td>
                    <td className="px-3 py-2.5 font-mono text-slate-500 text-[10px]">{q.lastScan}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Generate Modal */}
      {showGenModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50" onClick={() => setShowGenModal(false)}>
          <div className="bg-[#0f1623] border border-[#1e2d45] rounded-xl p-6 w-[480px] shadow-2xl" onClick={e => e.stopPropagation()}>
            <h3 className="text-base font-semibold text-slate-100 mb-1">Generate QR Batch</h3>
            <p className="text-xs text-slate-500 mb-5">Create a new set of product and parent QR codes for a production batch</p>
            <div className="space-y-3">
              <div>
                <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-1 block">Product / SKU</label>
                <select className="w-full bg-[#060b14] border border-[#1e2d45] rounded px-3 py-2 text-xs text-slate-300 focus:outline-none focus:border-emerald-500/50">
                  {products.map(p => <option key={p.id} value={p.id}>{p.sku} – {p.name}</option>)}
                </select>
              </div>
              <div>
                <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-1 block">Production Batch</label>
                <input className="w-full bg-[#060b14] border border-[#1e2d45] rounded px-3 py-2 text-xs text-slate-300 font-mono focus:outline-none focus:border-emerald-500/50" placeholder="BATCH-2024-005" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-1 block">Product QR Quantity</label>
                  <input type="number" defaultValue={400} className="w-full bg-[#060b14] border border-[#1e2d45] rounded px-3 py-2 text-xs text-slate-300 font-mono focus:outline-none focus:border-emerald-500/50" />
                </div>
                <div>
                  <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-1 block">Parent QR Quantity</label>
                  <input type="number" defaultValue={40} className="w-full bg-[#060b14] border border-[#1e2d45] rounded px-3 py-2 text-xs text-slate-300 font-mono focus:outline-none focus:border-emerald-500/50" />
                </div>
              </div>
              <div>
                <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-1 block">QR Prefix</label>
                <input className="w-full bg-[#060b14] border border-[#1e2d45] rounded px-3 py-2 text-xs text-slate-300 font-mono focus:outline-none focus:border-emerald-500/50" defaultValue="QR-THERM-" />
              </div>
            </div>
            <div className="flex gap-2 mt-6">
              <button onClick={() => setShowGenModal(false)} className="flex-1 py-2 text-xs font-semibold text-slate-400 border border-[#1e2d45] rounded hover:border-slate-500 transition-colors">Cancel</button>
              <button onClick={() => setShowGenModal(false)} className="flex-1 py-2 text-xs font-semibold bg-emerald-500 hover:bg-emerald-400 text-black rounded transition-colors">Generate Batch</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
