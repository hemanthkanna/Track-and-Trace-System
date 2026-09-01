import { inventorySummary, parentQRs, products, locations } from '../data/mock';

export default function Inventory() {
  const totalChild = inventorySummary.reduce((s, l) => s + l.child, 0);
  const totalParent = inventorySummary.reduce((s, l) => s + l.parent, 0);
  const totalTransit = inventorySummary.reduce((s, l) => s + l.inTransit, 0);

  const locTypeStyle: Record<string, { color: string; bg: string }> = {
    Factory:      { color: '#94a3b8', bg: 'rgba(148,163,184,0.1)' },
    Warehouse:    { color: '#60a5fa', bg: 'rgba(96,165,250,0.1)'  },
    Distributor:  { color: '#a78bfa', bg: 'rgba(167,139,250,0.1)' },
    Dealer:       { color: '#34d399', bg: 'rgba(52,211,153,0.1)'  },
    'Service Centre': { color: '#fbbf24', bg: 'rgba(251,191,36,0.1)' },
  };

  return (
    <div className="p-6 space-y-4">
      <div>
        <h2 className="text-lg font-semibold" style={{ color: 'var(--tt-text-1)' }}>Inventory</h2>
        <p className="text-xs mt-0.5" style={{ color: 'var(--tt-text-3)' }}>Current custody and stock levels across all locations</p>
      </div>

      <div className="grid grid-cols-4 gap-3">
        {[
          { label: 'Total Child QRs In Stock', value: totalChild, color: '#34d399' },
          { label: 'Total Parent Units In Stock', value: totalParent, color: '#60a5fa' },
          { label: 'Units In Transit', value: totalTransit, color: '#fbbf24' },
          { label: 'Active Locations', value: inventorySummary.filter(l => l.child > 0 || l.parent > 0).length, color: 'var(--tt-text-1)' },
        ].map(k => (
          <div key={k.label} className="rounded-lg border p-4"
            style={{ background: 'var(--tt-surface)', borderColor: 'var(--tt-border)' }}>
            <div className="text-2xl font-semibold font-mono" style={{ color: k.color }}>{k.value}</div>
            <div className="text-xs mt-1" style={{ color: 'var(--tt-text-3)' }}>{k.label}</div>
          </div>
        ))}
      </div>

      <div className="rounded-lg border overflow-hidden"
        style={{ background: 'var(--tt-surface)', borderColor: 'var(--tt-border)' }}>
        <div className="px-4 py-3" style={{ borderBottom: '1px solid var(--tt-border)' }}>
          <span className="text-sm font-semibold" style={{ color: 'var(--tt-text-1)' }}>Stock by Location</span>
        </div>
        <table className="w-full text-xs">
          <thead>
            <tr style={{ borderBottom: '1px solid var(--tt-border)' }}>
              {['Location', 'Type', 'Parent Units', 'Child Units', 'In Transit', 'Utilisation'].map(h => (
                <th key={h} className="px-4 py-2.5 text-left text-[10px] font-semibold uppercase tracking-wider"
                  style={{ color: 'var(--tt-text-3)' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {inventorySummary.map((l, i) => {
              const locInfo = locations.find(loc => loc.id === l.locationId);
              const utilPct = Math.min(100, Math.round((l.child / 300) * 100));
              const ts = locTypeStyle[locInfo?.type ?? ''] ?? locTypeStyle.Warehouse;
              return (
                <tr key={l.locationId}
                  style={{ borderBottom: i < inventorySummary.length - 1 ? '1px solid var(--tt-border)' : 'none' }}
                  onMouseEnter={e => (e.currentTarget.style.background = 'var(--tt-hover)')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                  <td className="px-4 py-3">
                    <div className="text-xs font-medium" style={{ color: 'var(--tt-text-1)' }}>{l.locationName}</div>
                    <div className="font-mono text-[10px]" style={{ color: 'var(--tt-text-3)' }}>{l.locationId}</div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded"
                      style={{ color: ts.color, background: ts.bg }}>{locInfo?.type ?? '—'}</span>
                  </td>
                  <td className="px-4 py-3 font-mono text-blue-400">{l.parent}</td>
                  <td className="px-4 py-3 font-mono text-emerald-400">{l.child}</td>
                  <td className="px-4 py-3 font-mono" style={{ color: l.inTransit > 0 ? '#fbbf24' : 'var(--tt-text-3)' }}>
                    {l.inTransit > 0 ? l.inTransit : '—'}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 rounded-full h-1.5 max-w-24" style={{ background: 'var(--tt-raised)' }}>
                        <div className="h-1.5 rounded-full transition-all"
                          style={{ width: `${utilPct}%`, background: utilPct > 70 ? '#f59e0b' : '#10b981' }} />
                      </div>
                      <span className="font-mono text-[10px]" style={{ color: 'var(--tt-text-3)' }}>{utilPct}%</span>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="rounded-lg border overflow-hidden"
        style={{ background: 'var(--tt-surface)', borderColor: 'var(--tt-border)' }}>
        <div className="px-4 py-3" style={{ borderBottom: '1px solid var(--tt-border)' }}>
          <span className="text-sm font-semibold" style={{ color: 'var(--tt-text-1)' }}>Parent QR Stock Detail</span>
        </div>
        <table className="w-full text-xs">
          <thead>
            <tr style={{ borderBottom: '1px solid var(--tt-border)' }}>
              {['Parent QR', 'Type', 'Product', 'Location', 'Status', 'Child Count', 'Active Packed', 'Last Scan'].map(h => (
                <th key={h} className="px-3 py-2.5 text-left text-[10px] font-semibold uppercase tracking-wider"
                  style={{ color: 'var(--tt-text-3)' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {parentQRs.filter(p => ['In Stock', 'Received', 'Packed'].includes(p.status)).map((p, i, arr) => {
              const prod = products.find(pr => pr.id === p.productId);
              const loc = locations.find(l => l.id === p.location);
              return (
                <tr key={p.id}
                  style={{ borderBottom: i < arr.length - 1 ? '1px solid var(--tt-border)' : 'none' }}
                  onMouseEnter={e => (e.currentTarget.style.background = 'var(--tt-hover)')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                  <td className="px-3 py-2.5 font-mono text-amber-400 text-[11px]">{p.id}</td>
                  <td className="px-3 py-2.5">
                    <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded"
                      style={{ color: p.type === 'Pallet' ? '#a78bfa' : '#60a5fa', background: p.type === 'Pallet' ? 'rgba(167,139,250,0.1)' : 'rgba(96,165,250,0.1)' }}>
                      {p.type}
                    </span>
                  </td>
                  <td className="px-3 py-2.5 text-[11px]" style={{ color: 'var(--tt-text-1)' }}>{prod?.name}</td>
                  <td className="px-3 py-2.5 text-[10px]" style={{ color: 'var(--tt-text-2)' }}>{loc?.name ?? p.location}</td>
                  <td className="px-3 py-2.5">
                    <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded border"
                      style={{
                        color: p.status === 'Received' ? '#34d399' : p.status === 'Opened' ? '#fbbf24' : '#60a5fa',
                        background: p.status === 'Received' ? 'rgba(52,211,153,0.1)' : p.status === 'Opened' ? 'rgba(251,191,36,0.1)' : 'rgba(96,165,250,0.1)',
                        borderColor: p.status === 'Received' ? 'rgba(52,211,153,0.25)' : p.status === 'Opened' ? 'rgba(251,191,36,0.25)' : 'rgba(96,165,250,0.25)',
                      }}>{p.status}</span>
                  </td>
                  <td className="px-3 py-2.5 font-mono" style={{ color: 'var(--tt-text-1)' }}>{p.childCount}</td>
                  <td className="px-3 py-2.5 font-mono text-emerald-400">{p.activePacked}</td>
                  <td className="px-3 py-2.5 font-mono text-[10px]" style={{ color: 'var(--tt-text-3)' }}>{p.lastScan}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
