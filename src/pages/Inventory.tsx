import { inventorySummary, childQRs, parentQRs, products, locations } from '../data/mock';

export default function Inventory() {
  const totalChild = inventorySummary.reduce((s, l) => s + l.child, 0);
  const totalParent = inventorySummary.reduce((s, l) => s + l.parent, 0);
  const totalTransit = inventorySummary.reduce((s, l) => s + l.inTransit, 0);

  return (
    <div className="p-6 space-y-4">
      <div>
        <h2 className="text-lg font-semibold text-slate-100">Inventory</h2>
        <p className="text-xs text-slate-500 mt-0.5">Current custody and stock levels across all locations</p>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-4 gap-3">
        {[
          { label: 'Total Child QRs In Stock', value: totalChild, color: 'text-emerald-400' },
          { label: 'Total Parent Units In Stock', value: totalParent, color: 'text-blue-400' },
          { label: 'Units In Transit', value: totalTransit, color: 'text-amber-400' },
          { label: 'Active Locations', value: inventorySummary.filter(l => l.child > 0 || l.parent > 0).length, color: 'text-slate-300' },
        ].map(k => (
          <div key={k.label} className="bg-[#0f1623] border border-[#1e2d45] rounded-lg p-4">
            <div className={`text-2xl font-semibold font-mono ${k.color}`}>{k.value}</div>
            <div className="text-xs text-slate-400 mt-1">{k.label}</div>
          </div>
        ))}
      </div>

      {/* Location Stock Table */}
      <div className="bg-[#0f1623] border border-[#1e2d45] rounded-lg overflow-hidden">
        <div className="px-4 py-3 border-b border-[#1e2d45]">
          <span className="text-sm font-semibold text-slate-200">Stock by Location</span>
        </div>
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-[#1e2d45]">
              {['Location', 'Type', 'Parent QR Units', 'Child QR Units', 'In Transit', 'Utilisation'].map(h => (
                <th key={h} className="px-4 py-2.5 text-left text-[10px] font-semibold text-slate-500 uppercase tracking-wider">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[#1e2d45]">
            {inventorySummary.map(l => {
              const locInfo = locations.find(loc => loc.id === l.locationId);
              const utilPct = Math.round((l.child / 300) * 100);
              return (
                <tr key={l.locationId} className="hover:bg-white/[0.02] transition-colors">
                  <td className="px-4 py-3">
                    <div className="text-slate-300 font-medium">{l.locationName}</div>
                    <div className="font-mono text-[10px] text-slate-600">{l.locationId}</div>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${
                      locInfo?.type === 'Factory' ? 'bg-slate-500/10 text-slate-400' :
                      locInfo?.type === 'Warehouse' ? 'bg-blue-500/10 text-blue-400' :
                      locInfo?.type === 'Distributor' ? 'bg-violet-500/10 text-violet-400' :
                      'bg-teal-500/10 text-teal-400'
                    }`}>{locInfo?.type ?? 'Unknown'}</span>
                  </td>
                  <td className="px-4 py-3 font-mono text-blue-400">{l.parent}</td>
                  <td className="px-4 py-3 font-mono text-emerald-400">{l.child}</td>
                  <td className="px-4 py-3 font-mono text-amber-400">{l.inTransit > 0 ? l.inTransit : '—'}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 bg-[#1e2d45] rounded-full h-1.5 max-w-24">
                        <div className={`h-1.5 rounded-full ${utilPct > 70 ? 'bg-amber-500' : 'bg-emerald-500'}`} style={{ width: `${Math.min(utilPct, 100)}%` }} />
                      </div>
                      <span className="font-mono text-[10px] text-slate-500">{utilPct}%</span>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Parent QR Stock Detail */}
      <div className="bg-[#0f1623] border border-[#1e2d45] rounded-lg overflow-hidden">
        <div className="px-4 py-3 border-b border-[#1e2d45]">
          <span className="text-sm font-semibold text-slate-200">Parent QR Stock Detail</span>
        </div>
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-[#1e2d45]">
              {['Parent QR', 'Type', 'Product', 'Location', 'Status', 'Child Count', 'Active Packed', 'Last Scan'].map(h => (
                <th key={h} className="px-3 py-2.5 text-left text-[10px] font-semibold text-slate-500 uppercase tracking-wider">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[#1e2d45]">
            {parentQRs.filter(p => ['In Stock', 'Received', 'Packed'].includes(p.status)).map(p => {
              const prod = products.find(pr => pr.id === p.productId);
              const loc = locations.find(l => l.id === p.location);
              return (
                <tr key={p.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="px-3 py-2.5 font-mono text-amber-400 text-[11px]">{p.id}</td>
                  <td className="px-3 py-2.5">
                    <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${p.type === 'Pallet' ? 'bg-violet-500/10 text-violet-400' : 'bg-blue-500/10 text-blue-400'}`}>{p.type}</span>
                  </td>
                  <td className="px-3 py-2.5 text-slate-300 text-[11px]">{prod?.name}</td>
                  <td className="px-3 py-2.5 text-slate-400 text-[10px]">{loc?.name ?? p.location}</td>
                  <td className="px-3 py-2.5">
                    <span className={`text-[10px] px-1.5 py-0.5 rounded border font-medium ${
                      p.status === 'Received' ? 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20' :
                      p.status === 'Opened' ? 'text-amber-400 bg-amber-400/10 border-amber-400/20' :
                      'text-blue-400 bg-blue-400/10 border-blue-400/20'
                    }`}>{p.status}</span>
                  </td>
                  <td className="px-3 py-2.5 font-mono text-slate-300">{p.childCount}</td>
                  <td className="px-3 py-2.5 font-mono text-emerald-400">{p.activePacked}</td>
                  <td className="px-3 py-2.5 font-mono text-slate-500 text-[10px]">{p.lastScan}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
