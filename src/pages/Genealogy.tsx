import { useState } from 'react';
import { childQRs, parentQRs, products, productionBatches, movements, endUsers, locations } from '../data/mock';

const sampleQRs = ['QR-THERM-00001', 'QR-CAM-00001', 'QR-CAM-00002', 'QR-LOCK-00002', 'PAR-CART-0001', 'PAR-PALL-0001'];

type TreeNode = {
  id: string;
  type: 'Pallet' | 'Carton' | 'Product';
  status: string;
  children?: TreeNode[];
  highlight?: boolean;
};

function buildTree(rootId: string): TreeNode | null {
  const pallet = parentQRs.find(p => p.id === rootId && p.type === 'Pallet');
  if (pallet) {
    return {
      id: pallet.id,
      type: 'Pallet',
      status: pallet.status,
      children: pallet.children.map(cartId => {
        const cart = parentQRs.find(p => p.id === cartId);
        if (!cart) return { id: cartId, type: 'Carton' as const, status: 'Unknown' };
        return {
          id: cart.id,
          type: 'Carton' as const,
          status: cart.status,
          children: cart.children.map(qrId => {
            const qr = childQRs.find(q => q.id === qrId);
            return { id: qrId, type: 'Product' as const, status: qr?.status ?? 'Unknown', highlight: false };
          }),
        };
      }),
    };
  }

  const carton = parentQRs.find(p => p.id === rootId && p.type === 'Carton');
  if (carton) {
    return {
      id: carton.id,
      type: 'Carton',
      status: carton.status,
      children: carton.children.map(qrId => {
        const qr = childQRs.find(q => q.id === qrId);
        return { id: qrId, type: 'Product' as const, status: qr?.status ?? 'Unknown', highlight: false };
      }),
    };
  }

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

const nodeColors: Record<string, string> = {
  Pallet: 'border-violet-500/50 bg-violet-500/5 text-violet-400',
  Carton: 'border-blue-500/50 bg-blue-500/5 text-blue-400',
  Product: 'border-emerald-500/50 bg-emerald-500/5 text-emerald-400',
};
const nodeIcon: Record<string, string> = {
  Pallet: '⬛',
  Carton: '📦',
  Product: '🔲',
};

function TreeNodeEl({ node, depth = 0 }: { node: TreeNode; depth?: number }) {
  const [open, setOpen] = useState(depth < 2);
  const hasChildren = node.children && node.children.length > 0;
  const indent = depth * 20;

  return (
    <div>
      <div
        className={`flex items-center gap-2 py-1.5 px-2 rounded-md transition-colors cursor-pointer hover:bg-white/[0.03] ${node.highlight ? 'ring-1 ring-emerald-500/40' : ''}`}
        style={{ marginLeft: `${indent}px` }}
        onClick={() => setOpen(!open)}
      >
        {hasChildren && (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={`w-3 h-3 text-slate-500 flex-shrink-0 transition-transform ${open ? 'rotate-90' : ''}`}>
            <path d="M9 18l6-6-6-6"/>
          </svg>
        )}
        {!hasChildren && <div className="w-3" />}
        <div className={`flex items-center gap-2 flex-1 min-w-0 border rounded px-2 py-1 ${nodeColors[node.type]}`}>
          <span className="text-[10px]">{nodeIcon[node.type]}</span>
          <span className="font-mono text-[11px] flex-1 truncate">{node.id}</span>
          <span className="text-[10px] opacity-60">{node.type}</span>
          <span className="text-[9px] opacity-50 border border-current/30 rounded px-1">{node.status}</span>
        </div>
      </div>
      {open && hasChildren && (
        <div className="border-l border-[#1e2d45] ml-[calc({indent}px+12px)]" style={{ marginLeft: `${indent + 16}px` }}>
          {node.children!.map(child => (
            <TreeNodeEl key={child.id} node={child} depth={depth + 1} />
          ))}
        </div>
      )}
    </div>
  );
}

export default function Genealogy() {
  const [search, setSearch] = useState('');
  const [result, setResult] = useState<TreeNode | null>(null);
  const [qrDetail, setQRDetail] = useState<typeof childQRs[0] | null>(null);

  const handleSearch = (qr: string = search) => {
    const q = qr.trim();
    if (!q) return;
    setSearch(q);
    const tree = buildTree(q);
    setResult(tree);
    const detail = childQRs.find(c => c.id === q);
    setQRDetail(detail ?? null);
  };

  const qr = qrDetail;
  const prod = qr ? products.find(p => p.id === qr.productId) : null;
  const batch = qr ? productionBatches.find(b => b.qrBatch === qr.batch) : null;
  const eu = qr?.endUser ? endUsers.find(e => e.id === qr.endUser) : null;
  const loc = qr ? locations.find(l => l.id === qr.location) : null;

  return (
    <div className="p-6 space-y-4">
      <div>
        <h2 className="text-lg font-semibold text-slate-100">Product Genealogy</h2>
        <p className="text-xs text-slate-500 mt-0.5">Trace any product or package through its complete supply chain history</p>
      </div>

      {/* Search */}
      <div className="bg-[#0f1623] border border-[#1e2d45] rounded-xl p-5">
        <div className="flex gap-3">
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSearch()}
            placeholder="Enter product QR code or parent QR code..."
            className="flex-1 bg-[#060b14] border border-[#1e2d45] rounded-lg px-4 py-2.5 text-sm text-slate-300 font-mono focus:outline-none focus:border-emerald-500/50 placeholder-slate-600"
          />
          <button onClick={() => handleSearch()} className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-black text-sm font-semibold rounded-lg transition-colors">Trace</button>
        </div>
        <div className="flex gap-2 mt-3">
          <span className="text-[10px] text-slate-600">Examples:</span>
          {sampleQRs.map(q => (
            <button key={q} onClick={() => handleSearch(q)}
              className="font-mono text-[10px] text-blue-400 hover:text-blue-300 transition-colors">
              {q}
            </button>
          ))}
        </div>
      </div>

      {result && (
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
          {/* Tree Viewer */}
          <div className="xl:col-span-2 bg-[#0f1623] border border-[#1e2d45] rounded-lg">
            <div className="px-4 py-3 border-b border-[#1e2d45] flex items-center gap-3">
              <span className="text-sm font-semibold text-slate-200">Parent–Child Hierarchy</span>
              <div className="flex gap-3 text-[10px]">
                <span className="text-violet-400">■ Pallet</span>
                <span className="text-blue-400">■ Carton</span>
                <span className="text-emerald-400">■ Product QR</span>
              </div>
            </div>
            <div className="p-4 overflow-auto">
              <TreeNodeEl node={result} depth={0} />
            </div>
          </div>

          {/* Detail Panel */}
          <div className="space-y-3">
            {qr && prod && (
              <div className="bg-[#0f1623] border border-[#1e2d45] rounded-lg p-4">
                <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Product Details</div>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between"><span className="text-slate-500">QR Code</span><span className="font-mono text-emerald-400">{qr.id}</span></div>
                  <div className="flex justify-between"><span className="text-slate-500">SKU</span><span className="font-mono text-slate-300">{prod.sku}</span></div>
                  <div className="flex justify-between"><span className="text-slate-500">Product</span><span className="text-slate-300 text-right max-w-[60%]">{prod.name}</span></div>
                  <div className="flex justify-between"><span className="text-slate-500">Status</span><span className="text-slate-300">{qr.status}</span></div>
                  <div className="flex justify-between"><span className="text-slate-500">Location</span><span className="font-mono text-slate-400 text-[10px]">{loc?.name ?? qr.location}</span></div>
                  <div className="flex justify-between"><span className="text-slate-500">Last Scan</span><span className="font-mono text-slate-400">{qr.lastScan}</span></div>
                </div>
              </div>
            )}

            {batch && (
              <div className="bg-[#0f1623] border border-[#1e2d45] rounded-lg p-4">
                <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Production Batch</div>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between"><span className="text-slate-500">Batch ID</span><span className="font-mono text-blue-400">{batch.id}</span></div>
                  <div className="flex justify-between"><span className="text-slate-500">Mfg Date</span><span className="font-mono text-slate-300">{batch.mfgDate}</span></div>
                  <div className="flex justify-between"><span className="text-slate-500">Line</span><span className="text-slate-300">{batch.line}</span></div>
                  <div className="flex justify-between"><span className="text-slate-500">Qty</span><span className="font-mono text-slate-300">{batch.quantity}</span></div>
                </div>
              </div>
            )}

            {eu && (
              <div className="bg-[#0f1623] border border-emerald-500/20 rounded-lg p-4">
                <div className="text-xs font-semibold text-emerald-500 uppercase tracking-wider mb-3">Registered Owner</div>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between"><span className="text-slate-500">Name</span><span className="text-slate-300">{eu.name}</span></div>
                  <div className="flex justify-between"><span className="text-slate-500">Location</span><span className="text-slate-300">{eu.city}, {eu.country}</span></div>
                  <div className="flex justify-between"><span className="text-slate-500">Registered</span><span className="font-mono text-slate-300">{eu.registrationDate}</span></div>
                  <div className="flex justify-between"><span className="text-slate-500">Warranty</span><span className={`font-medium ${eu.warrantyStatus === 'Active' ? 'text-emerald-400' : 'text-amber-400'}`}>{eu.warrantyStatus}</span></div>
                </div>
              </div>
            )}

            {/* Journey Timeline */}
            <div className="bg-[#0f1623] border border-[#1e2d45] rounded-lg p-4">
              <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Supply Chain Journey</div>
              <div className="space-y-0">
                {[
                  { event: 'Production', desc: 'TechFlow Factory – Line A', time: batch?.mfgDate, color: 'bg-slate-500' },
                  { event: 'QR Assigned', desc: `Batch ${qr?.batch}`, time: '2024-09-10', color: 'bg-blue-500' },
                  { event: 'Factory Exit', desc: 'Shipped via DHL Freight', time: '2024-10-16', color: 'bg-amber-500' },
                  { event: 'Warehouse Entry', desc: 'Gulf Trade – Main Warehouse', time: '2024-10-28', color: 'bg-teal-500' },
                  ...(eu ? [{ event: 'Sold & Registered', desc: eu.dealer, time: eu.registrationDate, color: 'bg-emerald-500' }] : []),
                ].map((step, i, arr) => (
                  <div key={step.event} className="flex gap-3">
                    <div className="flex flex-col items-center">
                      <div className={`w-2 h-2 rounded-full flex-shrink-0 mt-1.5 ${step.color}`} />
                      {i < arr.length - 1 && <div className="w-px flex-1 bg-[#1e2d45] mt-1 mb-1" />}
                    </div>
                    <div className="pb-3 flex-1 min-w-0">
                      <div className="text-xs font-medium text-slate-300">{step.event}</div>
                      <div className="text-[10px] text-slate-500">{step.desc}</div>
                      {step.time && <div className="font-mono text-[10px] text-slate-600">{step.time}</div>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {!result && (
        <div className="flex flex-col items-center justify-center py-20 text-slate-600">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="w-12 h-12 mb-3 opacity-30">
            <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
          </svg>
          <p className="text-sm">Enter a QR code to view its complete genealogy</p>
        </div>
      )}
    </div>
  );
}
