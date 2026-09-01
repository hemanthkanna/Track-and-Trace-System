import { useState } from 'react';
import { products, productionBatches, qrBatches } from '../data/mock';

const catColor: Record<string, string> = {
  'Climate Control': 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20',
  'Security': 'text-blue-400 bg-blue-500/10 border-blue-500/20',
  'Access Control': 'text-violet-400 bg-violet-500/10 border-violet-500/20',
  'Networking': 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
  'Sensors': 'text-amber-400 bg-amber-500/10 border-amber-500/20',
};

const batchStatusColor: Record<string, string> = {
  Complete: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
  'In Progress': 'text-amber-400 bg-amber-500/10 border-amber-500/20',
  Planned: 'text-slate-400 bg-slate-500/10 border-slate-500/20',
};

function SurfaceCard({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`rounded-lg border ${className}`}
      style={{ background: 'var(--tt-surface)', borderColor: 'var(--tt-border)' }}>
      {children}
    </div>
  );
}

function TableHeader({ cols }: { cols: string[] }) {
  return (
    <tr style={{ borderBottom: '1px solid var(--tt-border)' }}>
      {cols.map(h => (
        <th key={h} className="px-4 py-2.5 text-left text-[10px] font-semibold uppercase tracking-wider"
          style={{ color: 'var(--tt-text-3)' }}>{h}</th>
      ))}
    </tr>
  );
}

export default function Products() {
  const [tab, setTab] = useState<'catalog' | 'batches' | 'qr-assign'>('catalog');
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [showAddBatch, setShowAddBatch] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<string | null>(null);

  const selectedProd = products.find(p => p.id === selectedProduct);
  const prodBatches = productionBatches.filter(b => b.productId === selectedProduct);

  return (
    <div className="p-6 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold" style={{ color: 'var(--tt-text-1)' }}>Products & Production Batches</h2>
          <p className="text-xs mt-0.5" style={{ color: 'var(--tt-text-3)' }}>Product master, SKUs, manufacturing runs and QR associations</p>
        </div>
        <div className="flex gap-2">
          {tab === 'catalog' && (
            <button onClick={() => setShowAddProduct(true)}
              className="flex items-center gap-2 px-3 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-semibold rounded transition-colors">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3.5 h-3.5"><path d="M12 5v14M5 12h14"/></svg>
              New Product
            </button>
          )}
          {tab === 'batches' && (
            <button onClick={() => setShowAddBatch(true)}
              className="flex items-center gap-2 px-3 py-1.5 bg-blue-500 hover:bg-blue-400 text-white text-xs font-semibold rounded transition-colors">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3.5 h-3.5"><path d="M12 5v14M5 12h14"/></svg>
              New Batch
            </button>
          )}
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-4 gap-3">
        {[
          { label: 'Total Products', value: products.length, color: '#60a5fa' },
          { label: 'Production Batches', value: productionBatches.length, color: '#10b981' },
          { label: 'Completed Batches', value: productionBatches.filter(b => b.status === 'Complete').length, color: '#34d399' },
          { label: 'QR Batches Generated', value: qrBatches.length, color: '#a78bfa' },
        ].map(k => (
          <SurfaceCard key={k.label} className="p-3">
            <div className="text-xl font-semibold font-mono" style={{ color: k.color }}>{k.value}</div>
            <div className="text-xs mt-1 text-slate-400">{k.label}</div>
          </SurfaceCard>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1" style={{ borderBottom: '1px solid var(--tt-border)' }}>
        {([
          { id: 'catalog', label: 'Product Catalog' },
          { id: 'batches', label: 'Production Batches' },
          { id: 'qr-assign', label: 'QR Assignment' },
        ] as const).map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className="px-4 py-2 text-xs font-medium transition-colors border-b-2 -mb-px"
            style={{
              borderColor: tab === t.id ? '#10b981' : 'transparent',
              color: tab === t.id ? '#10b981' : 'var(--tt-text-3)',
            }}>
            {t.label}
          </button>
        ))}
      </div>

      {/* ── Product Catalog ── */}
      {tab === 'catalog' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Product list */}
          <div className="lg:col-span-2 space-y-2">
            {products.map(p => (
              <div key={p.id}
                onClick={() => setSelectedProduct(selectedProduct === p.id ? null : p.id)}
                className="rounded-lg border cursor-pointer transition-all"
                style={{
                  background: 'var(--tt-surface)',
                  borderColor: selectedProduct === p.id ? '#10b981' : 'var(--tt-border)',
                  boxShadow: selectedProduct === p.id ? '0 0 0 1px rgba(16,185,129,0.3)' : 'none',
                }}>
                <div className="p-4 flex items-start gap-4">
                  {/* Product icon */}
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ background: 'var(--tt-raised)' }}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5 text-emerald-400">
                      <path d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="text-sm font-semibold" style={{ color: 'var(--tt-text-1)' }}>{p.name}</span>
                      <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded border ${catColor[p.category] ?? 'text-slate-400 bg-slate-500/10 border-slate-500/20'}`}>{p.category}</span>
                    </div>
                    <div className="font-mono text-[11px] text-emerald-400">{p.sku}</div>
                    <div className="text-[11px] mt-1" style={{ color: 'var(--tt-text-3)' }}>{p.description}</div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <div className="text-[10px]" style={{ color: 'var(--tt-text-3)' }}>Warranty</div>
                    <div className="font-mono text-sm font-semibold text-violet-400">{p.warrantyMonths}mo</div>
                  </div>
                </div>

                {selectedProduct === p.id && (
                  <div className="px-4 pb-4 pt-0" style={{ borderTop: '1px solid var(--tt-border)' }}>
                    <div className="pt-3 grid grid-cols-3 gap-4 text-xs mb-3">
                      <div>
                        <div className="text-[10px] uppercase tracking-wider mb-0.5" style={{ color: 'var(--tt-text-3)' }}>Product ID</div>
                        <div className="font-mono text-blue-400">{p.id}</div>
                      </div>
                      <div>
                        <div className="text-[10px] uppercase tracking-wider mb-0.5" style={{ color: 'var(--tt-text-3)' }}>Batches</div>
                        <div className="font-mono" style={{ color: 'var(--tt-text-1)' }}>{productionBatches.filter(b => b.productId === p.id).length}</div>
                      </div>
                      <div>
                        <div className="text-[10px] uppercase tracking-wider mb-0.5" style={{ color: 'var(--tt-text-3)' }}>Total Units Produced</div>
                        <div className="font-mono" style={{ color: 'var(--tt-text-1)' }}>
                          {productionBatches.filter(b => b.productId === p.id).reduce((s, b) => s + b.quantity, 0)}
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button className="px-3 py-1.5 text-[11px] font-semibold rounded border transition-colors"
                        style={{ color: 'var(--tt-text-2)', borderColor: 'var(--tt-border)', background: 'var(--tt-raised)' }}>
                        View Batches
                      </button>
                      <button className="px-3 py-1.5 text-[11px] font-semibold text-blue-400 rounded border border-blue-500/30 bg-blue-500/10 hover:bg-blue-500/20 transition-colors">
                        Edit Product
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Summary / Stats panel */}
          <div className="space-y-3">
            <SurfaceCard className="p-4">
              <div className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: 'var(--tt-text-3)' }}>Categories</div>
              <div className="space-y-2">
                {Object.entries(
                  products.reduce((acc, p) => ({ ...acc, [p.category]: (acc[p.category] ?? 0) + 1 }), {} as Record<string, number>)
                ).map(([cat, count]) => (
                  <div key={cat} className="flex items-center justify-between">
                    <span className={`text-[11px] font-medium px-1.5 py-0.5 rounded border ${catColor[cat] ?? ''}`}>{cat}</span>
                    <span className="font-mono text-xs" style={{ color: 'var(--tt-text-2)' }}>{count} product{count > 1 ? 's' : ''}</span>
                  </div>
                ))}
              </div>
            </SurfaceCard>

            <SurfaceCard className="p-4">
              <div className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: 'var(--tt-text-3)' }}>Warranty Periods</div>
              <div className="space-y-2">
                {products.map(p => (
                  <div key={p.id} className="flex items-center gap-2">
                    <div className="flex-1 min-w-0">
                      <div className="text-[11px] truncate" style={{ color: 'var(--tt-text-2)' }}>{p.sku}</div>
                    </div>
                    <div className="flex-1 rounded-full h-1.5" style={{ background: 'var(--tt-raised)' }}>
                      <div className="h-1.5 rounded-full bg-violet-500" style={{ width: `${(p.warrantyMonths / 36) * 100}%` }} />
                    </div>
                    <span className="font-mono text-[11px] text-violet-400 w-8 text-right">{p.warrantyMonths}mo</span>
                  </div>
                ))}
              </div>
            </SurfaceCard>
          </div>
        </div>
      )}

      {/* ── Production Batches ── */}
      {tab === 'batches' && (
        <SurfaceCard className="overflow-hidden">
          <table className="w-full text-xs">
            <thead>
              <TableHeader cols={['Batch ID', 'Product / SKU', 'Mfg Date', 'Line', 'Quantity', 'QR Batch', 'Status', 'Actions']} />
            </thead>
            <tbody>
              {productionBatches.map(b => {
                const prod = products.find(p => p.id === b.productId);
                return (
                  <tr key={b.id} className="transition-colors"
                    style={{ borderBottom: '1px solid var(--tt-border)' }}
                    onMouseEnter={e => (e.currentTarget.style.background = 'var(--tt-hover)')}
                    onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                    <td className="px-4 py-3 font-mono text-blue-400">{b.id}</td>
                    <td className="px-4 py-3">
                      <div className="font-medium" style={{ color: 'var(--tt-text-1)' }}>{prod?.name}</div>
                      <div className="font-mono text-emerald-400 text-[10px]">{b.sku}</div>
                    </td>
                    <td className="px-4 py-3 font-mono" style={{ color: 'var(--tt-text-2)' }}>{b.mfgDate}</td>
                    <td className="px-4 py-3" style={{ color: 'var(--tt-text-2)' }}>{b.line}</td>
                    <td className="px-4 py-3 font-mono" style={{ color: 'var(--tt-text-1)' }}>{b.quantity.toLocaleString()}</td>
                    <td className="px-4 py-3 font-mono text-amber-400">{b.qrBatch ?? <span style={{ color: 'var(--tt-text-3)' }}>—</span>}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex px-1.5 py-0.5 rounded border text-[10px] font-medium ${batchStatusColor[b.status]}`}>{b.status}</span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <button className="text-[10px] text-blue-400 hover:text-blue-300 transition-colors">Details</button>
                        {b.status === 'Complete' && !b.qrBatch && (
                          <button className="text-[10px] text-emerald-400 hover:text-emerald-300 transition-colors">Assign QR</button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </SurfaceCard>
      )}

      {/* ── QR Assignment ── */}
      {tab === 'qr-assign' && (
        <div className="space-y-3">
          {qrBatches.map(qb => {
            const batch = productionBatches.find(b => b.id === qb.batchId);
            const prod = products.find(p => p.id === batch?.productId);
            const assignPct = Math.round((qb.assigned / qb.quantity) * 100);
            const activePct = Math.round((qb.activated / qb.quantity) * 100);
            return (
              <SurfaceCard key={qb.id} className="p-4">
                <div className="flex items-start gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-mono text-amber-400 text-[11px]">{qb.id}</span>
                      <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded border ${
                        qb.status === 'Assigned' ? 'text-blue-400 bg-blue-500/10 border-blue-500/20' :
                        'text-slate-400 bg-slate-500/10 border-slate-500/20'
                      }`}>{qb.status}</span>
                    </div>
                    <div className="text-sm font-semibold mb-0.5" style={{ color: 'var(--tt-text-1)' }}>{prod?.name ?? 'Unknown'}</div>
                    <div className="text-[11px]" style={{ color: 'var(--tt-text-3)' }}>Production Batch: <span className="font-mono text-blue-400">{qb.batchId}</span> · Generated: <span className="font-mono">{qb.generated}</span></div>
                  </div>
                  <div className="flex gap-6 flex-shrink-0 text-xs">
                    <div className="text-right">
                      <div className="text-[10px]" style={{ color: 'var(--tt-text-3)' }}>Product QR</div>
                      <div className="font-mono font-semibold" style={{ color: 'var(--tt-text-1)' }}>{qb.quantity}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-[10px]" style={{ color: 'var(--tt-text-3)' }}>Parent QR</div>
                      <div className="font-mono font-semibold text-amber-400">{qb.parentQty}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-[10px]" style={{ color: 'var(--tt-text-3)' }}>Activated</div>
                      <div className="font-mono font-semibold text-emerald-400">{qb.activated}</div>
                    </div>
                  </div>
                </div>
                <div className="mt-3 grid grid-cols-2 gap-3">
                  <div>
                    <div className="flex justify-between text-[10px] mb-1" style={{ color: 'var(--tt-text-3)' }}>
                      <span>Assigned</span><span className="font-mono">{assignPct}%</span>
                    </div>
                    <div className="rounded-full h-1.5" style={{ background: 'var(--tt-raised)' }}>
                      <div className="h-1.5 rounded-full bg-blue-500" style={{ width: `${assignPct}%` }} />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-[10px] mb-1" style={{ color: 'var(--tt-text-3)' }}>
                      <span>Activated</span><span className="font-mono">{activePct}%</span>
                    </div>
                    <div className="rounded-full h-1.5" style={{ background: 'var(--tt-raised)' }}>
                      <div className="h-1.5 rounded-full bg-emerald-500" style={{ width: `${activePct}%` }} />
                    </div>
                  </div>
                </div>
              </SurfaceCard>
            );
          })}
        </div>
      )}

      {/* ── Add Product Modal ── */}
      {showAddProduct && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4"
          onClick={() => setShowAddProduct(false)}>
          <div className="rounded-xl w-[520px] shadow-2xl overflow-hidden"
            style={{ background: 'var(--tt-surface)', border: '1px solid var(--tt-border)' }}
            onClick={e => e.stopPropagation()}>
            {/* Modal header */}
            <div className="flex items-center justify-between px-5 py-4"
              style={{ borderBottom: '1px solid var(--tt-border)' }}>
              <div>
                <div className="text-sm font-semibold" style={{ color: 'var(--tt-text-1)' }}>Add New Product</div>
                <div className="text-[11px] mt-0.5" style={{ color: 'var(--tt-text-3)' }}>Create a new product SKU in the system</div>
              </div>
              <button onClick={() => setShowAddProduct(false)} style={{ color: 'var(--tt-text-3)' }} className="hover:opacity-70 transition-opacity">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4"><path d="M18 6L6 18M6 6l12 12"/></svg>
              </button>
            </div>
            {/* Form */}
            <div className="px-5 py-4 space-y-3">
              {[
                { label: 'Product Name', placeholder: 'e.g. SmartTemp Pro Thermostat', type: 'text' },
                { label: 'SKU / Model Code', placeholder: 'e.g. TF-THERM-300', type: 'text', mono: true },
                { label: 'Description', placeholder: 'Brief product description', type: 'text' },
              ].map(f => (
                <div key={f.label}>
                  <label className="text-[10px] font-semibold uppercase tracking-wider mb-1 block" style={{ color: 'var(--tt-text-3)' }}>{f.label}</label>
                  <input type={f.type} placeholder={f.placeholder}
                    className={`w-full rounded px-3 py-2 text-xs focus:outline-none transition-colors ${f.mono ? 'font-mono' : ''}`}
                    style={{ background: 'var(--tt-raised)', border: '1px solid var(--tt-border)', color: 'var(--tt-text-1)' }}
                    onFocus={e => (e.currentTarget.style.borderColor = '#10b981')}
                    onBlur={e => (e.currentTarget.style.borderColor = 'var(--tt-border)')}
                  />
                </div>
              ))}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-semibold uppercase tracking-wider mb-1 block" style={{ color: 'var(--tt-text-3)' }}>Category</label>
                  <select className="w-full rounded px-3 py-2 text-xs focus:outline-none"
                    style={{ background: 'var(--tt-raised)', border: '1px solid var(--tt-border)', color: 'var(--tt-text-1)' }}>
                    {Object.keys(catColor).map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-semibold uppercase tracking-wider mb-1 block" style={{ color: 'var(--tt-text-3)' }}>Warranty (months)</label>
                  <input type="number" defaultValue={24} className="w-full rounded px-3 py-2 text-xs font-mono focus:outline-none"
                    style={{ background: 'var(--tt-raised)', border: '1px solid var(--tt-border)', color: 'var(--tt-text-1)' }} />
                </div>
              </div>
            </div>
            <div className="px-5 py-3 flex gap-2" style={{ borderTop: '1px solid var(--tt-border)' }}>
              <button onClick={() => setShowAddProduct(false)}
                className="flex-1 py-2 text-xs font-semibold rounded transition-colors"
                style={{ border: '1px solid var(--tt-border)', color: 'var(--tt-text-2)' }}>Cancel</button>
              <button onClick={() => setShowAddProduct(false)}
                className="flex-1 py-2 text-xs font-semibold bg-emerald-500 hover:bg-emerald-400 text-black rounded transition-colors">
                Create Product
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Add Batch Modal ── */}
      {showAddBatch && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4"
          onClick={() => setShowAddBatch(false)}>
          <div className="rounded-xl w-[520px] shadow-2xl overflow-hidden"
            style={{ background: 'var(--tt-surface)', border: '1px solid var(--tt-border)' }}
            onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between px-5 py-4"
              style={{ borderBottom: '1px solid var(--tt-border)' }}>
              <div>
                <div className="text-sm font-semibold" style={{ color: 'var(--tt-text-1)' }}>New Production Batch</div>
                <div className="text-[11px] mt-0.5" style={{ color: 'var(--tt-text-3)' }}>Record a new manufacturing run</div>
              </div>
              <button onClick={() => setShowAddBatch(false)} style={{ color: 'var(--tt-text-3)' }} className="hover:opacity-70 transition-opacity">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4"><path d="M18 6L6 18M6 6l12 12"/></svg>
              </button>
            </div>
            <div className="px-5 py-4 space-y-3">
              <div>
                <label className="text-[10px] font-semibold uppercase tracking-wider mb-1 block" style={{ color: 'var(--tt-text-3)' }}>Product</label>
                <select className="w-full rounded px-3 py-2 text-xs focus:outline-none"
                  style={{ background: 'var(--tt-raised)', border: '1px solid var(--tt-border)', color: 'var(--tt-text-1)' }}>
                  {products.map(p => <option key={p.id}>{p.sku} – {p.name}</option>)}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-semibold uppercase tracking-wider mb-1 block" style={{ color: 'var(--tt-text-3)' }}>Batch ID</label>
                  <input className="w-full rounded px-3 py-2 text-xs font-mono focus:outline-none"
                    defaultValue="BATCH-2024-006"
                    style={{ background: 'var(--tt-raised)', border: '1px solid var(--tt-border)', color: 'var(--tt-text-1)' }} />
                </div>
                <div>
                  <label className="text-[10px] font-semibold uppercase tracking-wider mb-1 block" style={{ color: 'var(--tt-text-3)' }}>Mfg Date</label>
                  <input type="date" className="w-full rounded px-3 py-2 text-xs focus:outline-none"
                    style={{ background: 'var(--tt-raised)', border: '1px solid var(--tt-border)', color: 'var(--tt-text-1)' }} />
                </div>
                <div>
                  <label className="text-[10px] font-semibold uppercase tracking-wider mb-1 block" style={{ color: 'var(--tt-text-3)' }}>Production Line</label>
                  <select className="w-full rounded px-3 py-2 text-xs focus:outline-none"
                    style={{ background: 'var(--tt-raised)', border: '1px solid var(--tt-border)', color: 'var(--tt-text-1)' }}>
                    <option>Line A</option><option>Line B</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-semibold uppercase tracking-wider mb-1 block" style={{ color: 'var(--tt-text-3)' }}>Quantity</label>
                  <input type="number" defaultValue={300} className="w-full rounded px-3 py-2 text-xs font-mono focus:outline-none"
                    style={{ background: 'var(--tt-raised)', border: '1px solid var(--tt-border)', color: 'var(--tt-text-1)' }} />
                </div>
              </div>
            </div>
            <div className="px-5 py-3 flex gap-2" style={{ borderTop: '1px solid var(--tt-border)' }}>
              <button onClick={() => setShowAddBatch(false)}
                className="flex-1 py-2 text-xs font-semibold rounded transition-colors"
                style={{ border: '1px solid var(--tt-border)', color: 'var(--tt-text-2)' }}>Cancel</button>
              <button onClick={() => setShowAddBatch(false)}
                className="flex-1 py-2 text-xs font-semibold bg-blue-500 hover:bg-blue-400 text-white rounded transition-colors">
                Create Batch
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
