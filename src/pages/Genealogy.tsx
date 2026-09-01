import { useState } from 'react';
import { childQRs, parentQRs, products, productionBatches, endUsers, locations } from '../data/mock';

const SAMPLES = ['QR-THERM-00001', 'QR-CAM-00001', 'QR-CAM-00002', 'QR-LOCK-00002', 'PAR-CART-0001', 'PAR-PALL-0001'];

type TreeNode = { id: string; type: 'Pallet' | 'Carton' | 'Product'; status: string; children?: TreeNode[]; highlight?: boolean };

function buildTree(rootId: string): TreeNode | null {
  const pallet = parentQRs.find(p => p.id === rootId && p.type === 'Pallet');
  if (pallet) return { id: pallet.id, type: 'Pallet', status: pallet.status, children: pallet.children.map(cid => {
    const cart = parentQRs.find(p => p.id === cid);
    if (!cart) return { id: cid, type: 'Carton' as const, status: 'Unknown' };
    return { id: cart.id, type: 'Carton' as const, status: cart.status, children: cart.children.map(qid => {
      const qr = childQRs.find(q => q.id === qid);
      return { id: qid, type: 'Product' as const, status: qr?.status ?? 'Unknown' };
    })};
  })};
  const carton = parentQRs.find(p => p.id === rootId && p.type === 'Carton');
  if (carton) return { id: carton.id, type: 'Carton', status: carton.status, children: carton.children.map(qid => {
    const qr = childQRs.find(q => q.id === qid);
    return { id: qid, type: 'Product' as const, status: qr?.status ?? 'Unknown' };
  })};
  const qr = childQRs.find(q => q.id === rootId);
  if (qr) {
    const cartonParent = parentQRs.find(p => p.children.includes(rootId) && p.type === 'Carton');
    const palletParent = cartonParent ? parentQRs.find(p => p.children.includes(cartonParent.id) && p.type === 'Pallet') : null;
    if (palletParent) return buildTree(palletParent.id);
    if (cartonParent) return buildTree(cartonParent.id);
    return { id: rootId, type: 'Product', status: qr.status, highlight: true };
  }
  return null;
}

const nodeStyle: Record<string, { color: string; border: string; bg: string }> = {
  Pallet:  { color: '#a78bfa', border: 'rgba(167,139,250,0.4)', bg: 'rgba(167,139,250,0.06)' },
  Carton:  { color: '#60a5fa', border: 'rgba(96,165,250,0.4)',  bg: 'rgba(96,165,250,0.06)'  },
  Product: { color: '#34d399', border: 'rgba(52,211,153,0.4)',  bg: 'rgba(52,211,153,0.06)'  },
};

function TreeNodeEl({ node, depth = 0 }: { node: TreeNode; depth?: number }) {
  const [open, setOpen] = useState(depth < 2);
  const has = node.children && node.children.length > 0;
  const ns = nodeStyle[node.type];

  return (
    <div>
      <div className="flex items-center gap-1.5 py-1 cursor-pointer group"
        style={{ paddingLeft: `${depth * 20}px` }}
        onClick={() => setOpen(!open)}>
        <div className="w-4 h-4 flex items-center justify-center flex-shrink-0">
          {has && (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={`w-3 h-3 transition-transform ${open ? 'rotate-90' : ''}`} style={{ color: 'var(--tt-text-3)' }}>
              <path d="M9 18l6-6-6-6" strokeLinecap="round"/>
            </svg>
          )}
        </div>
        <div className="flex items-center gap-2 flex-1 min-w-0 px-2 py-1 rounded-md border transition-colors"
          style={{ background: ns.bg, borderColor: ns.border }}>
          <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: ns.color }} />
          <span className="font-mono text-[11px] flex-1 truncate" style={{ color: ns.color }}>{node.id}</span>
          <span className="text-[9px] font-semibold uppercase tracking-wider flex-shrink-0" style={{ color: ns.color, opacity: 0.6 }}>{node.type}</span>
          <span className="text-[9px] px-1 py-0.5 rounded border flex-shrink-0"
            style={{ color: ns.color, borderColor: ns.border, opacity: 0.7 }}>{node.status}</span>
        </div>
      </div>
      {open && has && (
        <div style={{ borderLeft: `1px solid var(--tt-border)`, marginLeft: `${depth * 20 + 11}px` }}>
          {node.children!.map(c => <TreeNodeEl key={c.id} node={c} depth={depth + 1} />)}
        </div>
      )}
    </div>
  );
}

export default function Genealogy() {
  const [search, setSearch] = useState('');
  const [result, setResult] = useState<TreeNode | null>(null);
  const [qrDetail, setQRDetail] = useState<typeof childQRs[0] | null>(null);

  const doSearch = (q: string = search) => {
    const id = q.trim(); if (!id) return;
    setSearch(id);
    setResult(buildTree(id));
    setQRDetail(childQRs.find(c => c.id === id) ?? null);
  };

  const qr = qrDetail;
  const prod = qr ? products.find(p => p.id === qr.productId) : null;
  const batch = qr ? productionBatches.find(b => b.qrBatch === qr.batch) : null;
  const eu = qr?.endUser ? endUsers.find(e => e.id === qr.endUser) : null;
  const loc = qr ? locations.find(l => l.id === qr.location) : null;

  return (
    <div className="p-6 space-y-4">
      <div>
        <h2 className="text-lg font-semibold" style={{ color: 'var(--tt-text-1)' }}>Product Genealogy</h2>
        <p className="text-xs mt-0.5" style={{ color: 'var(--tt-text-3)' }}>Trace any product or package through its complete supply chain history</p>
      </div>

      <div className="rounded-xl p-5 border" style={{ background: 'var(--tt-surface)', borderColor: 'var(--tt-border)' }}>
        <div className="flex gap-3">
          <input value={search} onChange={e => setSearch(e.target.value)} onKeyDown={e => e.key === 'Enter' && doSearch()}
            placeholder="Enter product QR code or parent QR code…"
            className="flex-1 rounded-lg px-4 py-2.5 text-sm font-mono focus:outline-none transition-colors"
            style={{ background: 'var(--tt-raised)', border: '1px solid var(--tt-border)', color: 'var(--tt-text-1)' }}
            onFocus={e => (e.currentTarget.style.borderColor = '#10b981')}
            onBlur={e => (e.currentTarget.style.borderColor = 'var(--tt-border)')}
          />
          <button onClick={() => doSearch()}
            className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-black text-sm font-semibold rounded-lg transition-colors">
            Trace
          </button>
        </div>
        <div className="flex gap-2 mt-3 flex-wrap">
          <span className="text-[10px]" style={{ color: 'var(--tt-text-3)' }}>Examples:</span>
          {SAMPLES.map(q => (
            <button key={q} onClick={() => doSearch(q)}
              className="font-mono text-[10px] text-blue-400 hover:text-blue-300 transition-colors">{q}</button>
          ))}
        </div>
      </div>

      {result && (
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
          <div className="xl:col-span-2 rounded-lg border overflow-hidden"
            style={{ background: 'var(--tt-surface)', borderColor: 'var(--tt-border)' }}>
            <div className="px-4 py-3 flex items-center gap-4" style={{ borderBottom: '1px solid var(--tt-border)' }}>
              <span className="text-sm font-semibold" style={{ color: 'var(--tt-text-1)' }}>Parent–Child Hierarchy</span>
              <div className="flex gap-3 text-[10px]">
                {[['#a78bfa','Pallet'],['#60a5fa','Carton'],['#34d399','Product QR']].map(([c,l]) => (
                  <span key={l} className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-sm inline-block" style={{ background: c }} />{l}
                  </span>
                ))}
              </div>
            </div>
            <div className="p-4 overflow-auto">
              <TreeNodeEl node={result} />
            </div>
          </div>

          <div className="space-y-3">
            {qr && prod && (
              <div className="rounded-lg border p-4" style={{ background: 'var(--tt-surface)', borderColor: 'var(--tt-border)' }}>
                <div className="text-[10px] font-semibold uppercase tracking-wider mb-3" style={{ color: 'var(--tt-text-3)' }}>Product Details</div>
                {[['QR Code', qr.id, '#34d399'], ['SKU', prod.sku, '#60a5fa'], ['Product', prod.name, null], ['Status', qr.status, null], ['Location', loc?.name ?? qr.location, null], ['Last Scan', qr.lastScan, null]].map(([label, val, color]) => (
                  <div key={label as string} className="flex justify-between py-1 text-xs" style={{ borderBottom: '1px solid var(--tt-border)' }}>
                    <span style={{ color: 'var(--tt-text-3)' }}>{label}</span>
                    <span className={color ? 'font-mono' : ''} style={{ color: (color as string) ?? 'var(--tt-text-1)', maxWidth: '60%', textAlign: 'right' }}>{val}</span>
                  </div>
                ))}
              </div>
            )}
            {batch && (
              <div className="rounded-lg border p-4" style={{ background: 'var(--tt-surface)', borderColor: 'var(--tt-border)' }}>
                <div className="text-[10px] font-semibold uppercase tracking-wider mb-3" style={{ color: 'var(--tt-text-3)' }}>Production Batch</div>
                {[['Batch ID', batch.id, '#60a5fa'], ['Mfg Date', batch.mfgDate, null], ['Line', batch.line, null], ['Qty', String(batch.quantity), null]].map(([l, v, c]) => (
                  <div key={l as string} className="flex justify-between py-1 text-xs" style={{ borderBottom: '1px solid var(--tt-border)' }}>
                    <span style={{ color: 'var(--tt-text-3)' }}>{l}</span>
                    <span className="font-mono" style={{ color: (c as string) ?? 'var(--tt-text-1)' }}>{v}</span>
                  </div>
                ))}
              </div>
            )}
            {eu && (
              <div className="rounded-lg border p-4" style={{ background: 'var(--tt-surface)', borderColor: 'rgba(52,211,153,0.25)' }}>
                <div className="text-[10px] font-semibold uppercase tracking-wider mb-3 text-emerald-400">Registered Owner</div>
                {[['Name',eu.name],['Location',`${eu.city}, ${eu.country}`],['Registered',eu.registrationDate]].map(([l,v]) => (
                  <div key={l} className="flex justify-between py-1 text-xs" style={{ borderBottom: '1px solid var(--tt-border)' }}>
                    <span style={{ color: 'var(--tt-text-3)' }}>{l}</span>
                    <span style={{ color: 'var(--tt-text-1)' }}>{v}</span>
                  </div>
                ))}
                <div className="flex justify-between py-1 text-xs">
                  <span style={{ color: 'var(--tt-text-3)' }}>Warranty</span>
                  <span className="font-semibold" style={{ color: eu.warrantyStatus === 'Active' ? '#34d399' : '#fbbf24' }}>{eu.warrantyStatus}</span>
                </div>
              </div>
            )}
            {/* Journey */}
            <div className="rounded-lg border p-4" style={{ background: 'var(--tt-surface)', borderColor: 'var(--tt-border)' }}>
              <div className="text-[10px] font-semibold uppercase tracking-wider mb-3" style={{ color: 'var(--tt-text-3)' }}>Supply Chain Journey</div>
              {[
                { e: 'Production', d: 'TechFlow Factory – Line A', t: batch?.mfgDate, c: '#64748b' },
                { e: 'QR Assigned', d: `Batch ${qr?.batch}`, t: '2024-09-10', c: '#3b82f6' },
                { e: 'Factory Exit', d: 'Shipped via DHL Freight', t: '2024-10-16', c: '#fbbf24' },
                { e: 'Warehouse Entry', d: 'Gulf Trade – Main Warehouse', t: '2024-10-28', c: '#2dd4bf' },
                ...(eu ? [{ e: 'Sold & Registered', d: eu.dealer, t: eu.registrationDate, c: '#34d399' }] : []),
              ].map((s, i, arr) => (
                <div key={s.e} className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <div className="w-2 h-2 rounded-full mt-1.5 flex-shrink-0" style={{ background: s.c }} />
                    {i < arr.length - 1 && <div className="w-px flex-1 my-1" style={{ background: 'var(--tt-border)' }} />}
                  </div>
                  <div className="pb-2.5 flex-1 min-w-0">
                    <div className="text-xs font-medium" style={{ color: 'var(--tt-text-1)' }}>{s.e}</div>
                    <div className="text-[10px]" style={{ color: 'var(--tt-text-3)' }}>{s.d}</div>
                    {s.t && <div className="font-mono text-[10px]" style={{ color: 'var(--tt-text-3)', opacity: 0.7 }}>{s.t}</div>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {!result && (
        <div className="flex flex-col items-center justify-center py-20" style={{ color: 'var(--tt-text-3)' }}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="w-12 h-12 mb-3 opacity-30">
            <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
          </svg>
          <p className="text-sm">Enter a QR code to view its complete genealogy</p>
        </div>
      )}
    </div>
  );
}
