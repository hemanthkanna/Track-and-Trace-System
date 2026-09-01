import { useState } from 'react';
import { qrBatches, childQRs, parentQRs, products } from '../data/mock';

const statusStyle: Record<string, { color: string; bg: string; border: string }> = {
  Generated:    { color: '#94a3b8', bg: 'rgba(148,163,184,0.1)', border: 'rgba(148,163,184,0.2)' },
  Assigned:     { color: '#60a5fa', bg: 'rgba(96,165,250,0.1)',  border: 'rgba(96,165,250,0.2)'  },
  Activated:    { color: '#2dd4bf', bg: 'rgba(45,212,191,0.1)',  border: 'rgba(45,212,191,0.2)'  },
  'In Stock':   { color: '#34d399', bg: 'rgba(52,211,153,0.1)',  border: 'rgba(52,211,153,0.2)'  },
  'In Transit': { color: '#fbbf24', bg: 'rgba(251,191,36,0.1)',  border: 'rgba(251,191,36,0.2)'  },
  Sold:         { color: '#a78bfa', bg: 'rgba(167,139,250,0.1)', border: 'rgba(167,139,250,0.2)' },
  Registered:   { color: '#22d3ee', bg: 'rgba(34,211,238,0.1)',  border: 'rgba(34,211,238,0.2)'  },
  Service:      { color: '#fb923c', bg: 'rgba(251,146,60,0.1)',  border: 'rgba(251,146,60,0.2)'  },
  Replaced:     { color: '#94a3b8', bg: 'rgba(148,163,184,0.1)', border: 'rgba(148,163,184,0.2)' },
  Blocked:      { color: '#f87171', bg: 'rgba(248,113,113,0.1)', border: 'rgba(248,113,113,0.2)' },
  Packed:       { color: '#60a5fa', bg: 'rgba(96,165,250,0.1)',  border: 'rgba(96,165,250,0.2)'  },
  Received:     { color: '#34d399', bg: 'rgba(52,211,153,0.1)',  border: 'rgba(52,211,153,0.2)'  },
  Opened:       { color: '#fbbf24', bg: 'rgba(251,191,36,0.1)',  border: 'rgba(251,191,36,0.2)'  },
  Retired:      { color: '#64748b', bg: 'rgba(100,116,139,0.1)', border: 'rgba(100,116,139,0.2)' },
};

function StatusBadge({ status }: { status: string }) {
  const s = statusStyle[status] ?? statusStyle.Generated;
  return (
    <span className="inline-flex items-center px-1.5 py-0.5 rounded border text-[10px] font-semibold"
      style={{ color: s.color, background: s.bg, borderColor: s.border }}>
      {status}
    </span>
  );
}

function Th({ children }: { children: React.ReactNode }) {
  return <th className="px-3 py-2.5 text-left text-[10px] font-semibold uppercase tracking-wider whitespace-nowrap" style={{ color: 'var(--tt-text-3)' }}>{children}</th>;
}

export default function QRManagement() {
  const [tab, setTab] = useState<'batches' | 'child' | 'parent'>('batches');
  const [search, setSearch] = useState('');
  const [showGenModal, setShowGenModal] = useState(false);

  const filteredChild = childQRs.filter(q =>
    !search || q.id.toLowerCase().includes(search.toLowerCase()) || q.productId.toLowerCase().includes(search.toLowerCase())
  );
  const filteredParent = parentQRs.filter(q =>
    !search || q.id.toLowerCase().includes(search.toLowerCase())
  );

  const tabs = [
    { id: 'batches' as const, label: 'QR Batches' },
    { id: 'child' as const, label: 'Product QR Codes' },
    { id: 'parent' as const, label: 'Parent QR Codes' },
  ];

  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold" style={{ color: 'var(--tt-text-1)' }}>QR Management</h2>
          <p className="text-xs mt-0.5" style={{ color: 'var(--tt-text-3)' }}>Manage QR batches, product codes and parent packaging codes</p>
        </div>
        <button onClick={() => setShowGenModal(true)}
          className="flex items-center gap-2 px-3 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-semibold rounded transition-colors">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3.5 h-3.5"><path d="M12 5v14M5 12h14"/></svg>
          Generate QR Batch
        </button>
      </div>

      <div className="grid grid-cols-4 gap-3">
        {[
          { label: 'Total QR Codes', value: '1,150', color: '#60a5fa' },
          { label: 'Activated', value: '982', color: '#34d399' },
          { label: 'Parent QR Codes', value: '115', color: '#fbbf24' },
          { label: 'Blocked', value: '1', color: '#f87171' },
        ].map(k => (
          <div key={k.label} className="rounded-lg border p-3"
            style={{ background: 'var(--tt-surface)', borderColor: 'var(--tt-border)' }}>
            <div className="text-xl font-semibold font-mono" style={{ color: k.color }}>{k.value}</div>
            <div className="text-xs mt-1 text-slate-400">{k.label}</div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-0" style={{ borderBottom: '1px solid var(--tt-border)' }}>
        {tabs.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className="px-4 py-2 text-xs font-medium transition-colors border-b-2 -mb-px"
            style={{
              borderColor: tab === t.id ? '#10b981' : 'transparent',
              color: tab === t.id ? '#10b981' : 'var(--tt-text-3)',
            }}>
            {t.label}
          </button>
        ))}
        {tab !== 'batches' && (
          <div className="ml-auto mb-2 pl-4">
            <input value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search QR code…"
              className="rounded px-3 py-1 text-xs font-mono focus:outline-none w-52"
              style={{ background: 'var(--tt-raised)', border: '1px solid var(--tt-border)', color: 'var(--tt-text-1)' }} />
          </div>
        )}
      </div>

      {/* Batches */}
      {tab === 'batches' && (
        <div className="rounded-lg border overflow-hidden"
          style={{ background: 'var(--tt-surface)', borderColor: 'var(--tt-border)' }}>
          <table className="w-full text-xs">
            <thead><tr style={{ borderBottom: '1px solid var(--tt-border)' }}>
              {['Batch ID','Production Batch','Type','Generated','Total QR','Parent QR','Assigned','Activated','Status'].map(h => <Th key={h}>{h}</Th>)}
            </tr></thead>
            <tbody>
              {qrBatches.map(b => (
                <tr key={b.id} style={{ borderBottom: '1px solid var(--tt-border)' }}
                  onMouseEnter={e => (e.currentTarget.style.background = 'var(--tt-hover)')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                  <td className="px-3 py-2.5 font-mono text-blue-400">{b.id}</td>
                  <td className="px-3 py-2.5 font-mono" style={{ color: 'var(--tt-text-3)' }}>{b.batchId}</td>
                  <td className="px-3 py-2.5" style={{ color: 'var(--tt-text-2)' }}>{b.type}</td>
                  <td className="px-3 py-2.5 font-mono" style={{ color: 'var(--tt-text-2)' }}>{b.generated}</td>
                  <td className="px-3 py-2.5 font-mono" style={{ color: 'var(--tt-text-1)' }}>{b.quantity}</td>
                  <td className="px-3 py-2.5 font-mono" style={{ color: 'var(--tt-text-1)' }}>{b.parentQty}</td>
                  <td className="px-3 py-2.5 font-mono" style={{ color: 'var(--tt-text-1)' }}>{b.assigned}</td>
                  <td className="px-3 py-2.5 font-mono text-emerald-400">{b.activated}</td>
                  <td className="px-3 py-2.5"><StatusBadge status={b.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Child QRs */}
      {tab === 'child' && (
        <div className="rounded-lg border overflow-hidden"
          style={{ background: 'var(--tt-surface)', borderColor: 'var(--tt-border)' }}>
          <table className="w-full text-xs">
            <thead><tr style={{ borderBottom: '1px solid var(--tt-border)' }}>
              {['QR Code','Product','Parent QR','Batch','Status','Location','Last Scan','End User'].map(h => <Th key={h}>{h}</Th>)}
            </tr></thead>
            <tbody>
              {filteredChild.map(q => {
                const prod = products.find(p => p.id === q.productId);
                return (
                  <tr key={q.id} style={{ borderBottom: '1px solid var(--tt-border)' }}
                    onMouseEnter={e => (e.currentTarget.style.background = 'var(--tt-hover)')}
                    onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                    <td className="px-3 py-2.5 font-mono text-emerald-400 text-[11px]">{q.id}</td>
                    <td className="px-3 py-2.5 text-xs" style={{ color: 'var(--tt-text-1)' }}>{prod?.name ?? q.productId}</td>
                    <td className="px-3 py-2.5 font-mono text-[10px]" style={{ color: 'var(--tt-text-3)' }}>{q.parentId}</td>
                    <td className="px-3 py-2.5 font-mono text-[10px]" style={{ color: 'var(--tt-text-3)' }}>{q.batch}</td>
                    <td className="px-3 py-2.5"><StatusBadge status={q.status} /></td>
                    <td className="px-3 py-2.5 font-mono text-[10px]" style={{ color: 'var(--tt-text-2)' }}>{q.location}</td>
                    <td className="px-3 py-2.5 font-mono text-[10px]" style={{ color: 'var(--tt-text-3)' }}>{q.lastScan}</td>
                    <td className="px-3 py-2.5 font-mono text-[10px] text-violet-400">{q.endUser ?? '—'}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Parent QRs */}
      {tab === 'parent' && (
        <div className="rounded-lg border overflow-hidden"
          style={{ background: 'var(--tt-surface)', borderColor: 'var(--tt-border)' }}>
          <table className="w-full text-xs">
            <thead><tr style={{ borderBottom: '1px solid var(--tt-border)' }}>
              {['Parent QR','Type','Pallet Parent','Product','Status','Children','Active Packed','Location','Last Scan'].map(h => <Th key={h}>{h}</Th>)}
            </tr></thead>
            <tbody>
              {filteredParent.map(q => {
                const prod = products.find(p => p.id === q.productId);
                return (
                  <tr key={q.id} style={{ borderBottom: '1px solid var(--tt-border)' }}
                    onMouseEnter={e => (e.currentTarget.style.background = 'var(--tt-hover)')}
                    onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                    <td className="px-3 py-2.5 font-mono text-amber-400 text-[11px]">{q.id}</td>
                    <td className="px-3 py-2.5">
                      <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded"
                        style={{ background: q.type === 'Pallet' ? 'rgba(167,139,250,0.1)' : 'rgba(96,165,250,0.1)', color: q.type === 'Pallet' ? '#a78bfa' : '#60a5fa' }}>
                        {q.type}
                      </span>
                    </td>
                    <td className="px-3 py-2.5 font-mono text-[10px]" style={{ color: 'var(--tt-text-3)' }}>{q.palletId ?? '—'}</td>
                    <td className="px-3 py-2.5 text-[11px]" style={{ color: 'var(--tt-text-1)' }}>{prod?.name}</td>
                    <td className="px-3 py-2.5"><StatusBadge status={q.status} /></td>
                    <td className="px-3 py-2.5 font-mono" style={{ color: 'var(--tt-text-1)' }}>{q.childCount}</td>
                    <td className="px-3 py-2.5 font-mono text-emerald-400">{q.activePacked}</td>
                    <td className="px-3 py-2.5 font-mono text-[10px]" style={{ color: 'var(--tt-text-2)' }}>{q.location}</td>
                    <td className="px-3 py-2.5 font-mono text-[10px]" style={{ color: 'var(--tt-text-3)' }}>{q.lastScan}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Generate Modal */}
      {showGenModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50"
          onClick={() => setShowGenModal(false)}>
          <div className="rounded-xl w-[480px] shadow-2xl overflow-hidden"
            style={{ background: 'var(--tt-surface)', border: '1px solid var(--tt-border)' }}
            onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between px-5 py-4"
              style={{ borderBottom: '1px solid var(--tt-border)', background: 'var(--tt-raised)' }}>
              <div>
                <div className="text-sm font-semibold" style={{ color: 'var(--tt-text-1)' }}>Generate QR Batch</div>
                <div className="text-[11px] mt-0.5" style={{ color: 'var(--tt-text-3)' }}>Create a new set of product and parent QR codes</div>
              </div>
              <button onClick={() => setShowGenModal(false)} style={{ color: 'var(--tt-text-3)' }} className="hover:opacity-60">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4"><path d="M18 6L6 18M6 6l12 12"/></svg>
              </button>
            </div>
            <div className="px-5 py-4 space-y-3">
              {[
                { label: 'Product / SKU', el: <select className="w-full rounded px-3 py-2 text-xs focus:outline-none"
                    style={{ background: 'var(--tt-raised)', border: '1px solid var(--tt-border)', color: 'var(--tt-text-1)' }}>
                    {products.map(p => <option key={p.id}>{p.sku} – {p.name}</option>)}
                  </select> },
                { label: 'Production Batch', el: <input className="w-full rounded px-3 py-2 text-xs font-mono focus:outline-none"
                    placeholder="BATCH-2024-005"
                    style={{ background: 'var(--tt-raised)', border: '1px solid var(--tt-border)', color: 'var(--tt-text-1)' }} /> },
              ].map(f => (
                <div key={f.label}>
                  <label className="text-[10px] font-semibold uppercase tracking-wider mb-1 block" style={{ color: 'var(--tt-text-3)' }}>{f.label}</label>
                  {f.el}
                </div>
              ))}
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: 'Product QR Quantity', val: 400 },
                  { label: 'Parent QR Quantity', val: 40 },
                ].map(f => (
                  <div key={f.label}>
                    <label className="text-[10px] font-semibold uppercase tracking-wider mb-1 block" style={{ color: 'var(--tt-text-3)' }}>{f.label}</label>
                    <input type="number" defaultValue={f.val} className="w-full rounded px-3 py-2 text-xs font-mono focus:outline-none"
                      style={{ background: 'var(--tt-raised)', border: '1px solid var(--tt-border)', color: 'var(--tt-text-1)' }} />
                  </div>
                ))}
              </div>
              <div>
                <label className="text-[10px] font-semibold uppercase tracking-wider mb-1 block" style={{ color: 'var(--tt-text-3)' }}>QR ID Prefix</label>
                <input className="w-full rounded px-3 py-2 text-xs font-mono focus:outline-none"
                  defaultValue="QR-THERM-"
                  style={{ background: 'var(--tt-raised)', border: '1px solid var(--tt-border)', color: 'var(--tt-text-1)' }} />
              </div>
            </div>
            <div className="flex gap-2 px-5 py-3" style={{ borderTop: '1px solid var(--tt-border)' }}>
              <button onClick={() => setShowGenModal(false)} className="flex-1 py-2 text-xs font-semibold rounded transition-colors"
                style={{ border: '1px solid var(--tt-border)', color: 'var(--tt-text-2)' }}>Cancel</button>
              <button onClick={() => setShowGenModal(false)}
                className="flex-1 py-2 text-xs font-semibold bg-emerald-500 hover:bg-emerald-400 text-black rounded transition-colors">
                Generate Batch
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
