import { dashboardKPIs, movements, riskEvents, auditLogs, inventorySummary } from '../data/mock';

const riskTextColor: Record<string, string> = {
  Low: '#34d399', Medium: '#fbbf24', High: '#f97316', Critical: '#ef4444',
};
const riskBorderColor: Record<string, string> = {
  Low: 'rgba(52,211,153,0.2)', Medium: 'rgba(251,191,36,0.2)',
  High: 'rgba(249,115,22,0.2)', Critical: 'rgba(239,68,68,0.25)',
};
const riskBgColor: Record<string, string> = {
  Low: 'rgba(52,211,153,0.05)', Medium: 'rgba(251,191,36,0.05)',
  High: 'rgba(249,115,22,0.05)', Critical: 'rgba(239,68,68,0.08)',
};
const movDotColor: Record<string, string> = {
  Planned: '#64748b', 'Exit Scanned': '#3b82f6', 'In Transit': '#fbbf24',
  'Entry Scanned': '#2dd4bf', Completed: '#34d399', Exception: '#ef4444', Cancelled: '#475569',
};

function Th({ children }: { children: React.ReactNode }) {
  return <th className="px-3 py-2.5 text-left text-[10px] font-semibold uppercase tracking-wider" style={{ color: 'var(--tt-text-3)' }}>{children}</th>;
}
function Td({ children, mono, color }: { children: React.ReactNode; mono?: boolean; color?: string }) {
  return (
    <td className={`px-3 py-2.5 text-xs ${mono ? 'font-mono' : ''}`} style={{ color: color ?? 'var(--tt-text-2)' }}>
      {children}
    </td>
  );
}

export default function Dashboard() {
  const kpis = [
    { label: 'Total QR Codes', value: dashboardKPIs.totalQRCodes.toLocaleString(), sub: 'across all batches', color: '#60a5fa', icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5"><rect x="3" y="3" width="7" height="7" rx="0.5"/><rect x="14" y="3" width="7" height="7" rx="0.5"/><rect x="3" y="14" width="7" height="7" rx="0.5"/><path d="M14 14h2v2h-2zM18 14h2v2h-2zM14 18h2v2h-2zM18 18h2v2h-2z"/></svg> },
    { label: 'Active Products', value: dashboardKPIs.activeProducts.toLocaleString(), sub: 'in supply chain', color: '#2dd4bf', icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5"><path d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" strokeLinecap="round" strokeLinejoin="round"/></svg> },
    { label: 'In-Transit Movements', value: dashboardKPIs.inTransitMovements.toString(), sub: 'awaiting entry scan', color: '#fbbf24', icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5"><path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round"/></svg> },
    { label: 'Open Risk Events', value: dashboardKPIs.openRiskEvents.toString(), sub: 'require attention', color: '#f87171', icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg> },
    { label: 'Registered End Users', value: dashboardKPIs.registeredEndUsers.toString(), sub: '+2 this week', color: '#c084fc', icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/></svg> },
    { label: 'Weekly Scans', value: dashboardKPIs.weeklyScans.toLocaleString(), sub: 'authentication events', color: '#22d3ee', icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg> },
  ];

  const openRisks = riskEvents.filter(r => r.status === 'Open');

  return (
    <div className="p-6 space-y-5">
      {/* KPI Row */}
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3">
        {kpis.map(k => (
          <div key={k.label} className="rounded-lg p-4 flex flex-col gap-2 border"
            style={{ background: 'var(--tt-surface)', borderColor: 'var(--tt-border)' }}>
            <div style={{ color: k.color, opacity: 0.85 }}>{k.icon}</div>
            <div className="text-2xl font-semibold tracking-tight font-mono" style={{ color: k.color }}>{k.value}</div>
            <div>
              <div className="text-xs font-medium" style={{ color: 'var(--tt-text-1)' }}>{k.label}</div>
              <div className="text-[10px] mt-0.5" style={{ color: 'var(--tt-text-3)' }}>{k.sub}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        {/* Recent Movements */}
        <div className="xl:col-span-2 rounded-lg border overflow-hidden"
          style={{ background: 'var(--tt-surface)', borderColor: 'var(--tt-border)' }}>
          <div className="px-4 py-3 flex items-center justify-between"
            style={{ borderBottom: '1px solid var(--tt-border)' }}>
            <span className="text-sm font-semibold" style={{ color: 'var(--tt-text-1)' }}>Recent Movements</span>
            <span className="text-[10px] font-mono" style={{ color: 'var(--tt-text-3)' }}>LIVE</span>
          </div>
          {movements.slice(0, 6).map((m, i) => (
            <div key={m.id} className="px-4 py-3 flex items-center gap-3 transition-colors"
              style={{ borderBottom: i < 5 ? '1px solid var(--tt-border)' : 'none' }}
              onMouseEnter={e => (e.currentTarget.style.background = 'var(--tt-hover)')}
              onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
              <div className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                style={{ background: movDotColor[m.status] ?? '#64748b' }} />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-[10px] text-blue-400">{m.id}</span>
                  <span className="text-[10px]" style={{ color: 'var(--tt-text-3)' }}>·</span>
                  <span className="text-xs truncate" style={{ color: 'var(--tt-text-2)' }}>{m.type}</span>
                </div>
                <div className="text-[11px] mt-0.5 truncate" style={{ color: 'var(--tt-text-3)' }}>{m.originName} → {m.destinationName}</div>
              </div>
              <div className="flex flex-col items-end gap-0.5">
                <span className="text-[10px] font-semibold" style={{ color: movDotColor[m.status] }}>{m.status}</span>
                <span className="text-[10px] font-mono" style={{ color: 'var(--tt-text-3)' }}>{m.items} items</span>
              </div>
            </div>
          ))}
        </div>

        {/* Risk Alerts */}
        <div className="rounded-lg border overflow-hidden"
          style={{ background: 'var(--tt-surface)', borderColor: 'var(--tt-border)' }}>
          <div className="px-4 py-3 flex items-center justify-between"
            style={{ borderBottom: '1px solid var(--tt-border)' }}>
            <span className="text-sm font-semibold" style={{ color: 'var(--tt-text-1)' }}>Risk Alerts</span>
            <span className="font-mono text-[10px]" style={{ color: '#f87171' }}>{openRisks.length} OPEN</span>
          </div>
          {riskEvents.slice(0, 5).map((r, i) => (
            <div key={r.id} className="px-4 py-3 border-l-2"
              style={{
                borderBottom: i < 4 ? '1px solid var(--tt-border)' : 'none',
                borderLeftColor: riskTextColor[r.level],
                background: riskBgColor[r.level],
              }}>
              <div className="flex items-center justify-between mb-0.5">
                <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: riskTextColor[r.level] }}>{r.level}</span>
                <span className="font-mono text-[10px] font-semibold" style={{ color: riskTextColor[r.level] }}>{r.score}</span>
              </div>
              <div className="text-xs font-medium" style={{ color: 'var(--tt-text-1)' }}>{r.type}</div>
              <div className="font-mono text-[10px] mt-0.5" style={{ color: 'var(--tt-text-3)' }}>{r.qr}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        {/* Inventory Snapshot */}
        <div className="rounded-lg border overflow-hidden"
          style={{ background: 'var(--tt-surface)', borderColor: 'var(--tt-border)' }}>
          <div className="px-4 py-3" style={{ borderBottom: '1px solid var(--tt-border)' }}>
            <span className="text-sm font-semibold" style={{ color: 'var(--tt-text-1)' }}>Inventory by Location</span>
          </div>
          {inventorySummary.map((loc, i) => (
            <div key={loc.locationId} className="px-4 py-2.5 flex items-center gap-3"
              style={{ borderBottom: i < inventorySummary.length - 1 ? '1px solid var(--tt-border)' : 'none' }}>
              <div className="flex-1 min-w-0 text-xs truncate" style={{ color: 'var(--tt-text-2)' }}>{loc.locationName}</div>
              <div className="flex items-center gap-4 text-[11px] flex-shrink-0">
                <span style={{ color: 'var(--tt-text-3)' }}>Parent: <span className="font-mono" style={{ color: 'var(--tt-text-1)' }}>{loc.parent}</span></span>
                <span style={{ color: 'var(--tt-text-3)' }}>Child: <span className="font-mono" style={{ color: 'var(--tt-text-1)' }}>{loc.child}</span></span>
                {loc.inTransit > 0 && <span className="font-mono" style={{ color: '#fbbf24' }}>{loc.inTransit} transit</span>}
              </div>
            </div>
          ))}
        </div>

        {/* Audit Feed */}
        <div className="rounded-lg border overflow-hidden"
          style={{ background: 'var(--tt-surface)', borderColor: 'var(--tt-border)' }}>
          <div className="px-4 py-3" style={{ borderBottom: '1px solid var(--tt-border)' }}>
            <span className="text-sm font-semibold" style={{ color: 'var(--tt-text-1)' }}>Audit Feed</span>
          </div>
          {auditLogs.map((log, i) => (
            <div key={log.id} className="px-4 py-3"
              style={{ borderBottom: i < auditLogs.length - 1 ? '1px solid var(--tt-border)' : 'none' }}>
              <div className="flex items-center justify-between mb-0.5">
                <span className="text-xs font-medium" style={{ color: 'var(--tt-text-1)' }}>{log.action}</span>
                <span className="font-mono text-[10px]" style={{ color: 'var(--tt-text-3)' }}>{log.timestamp.split(' ')[0]}</span>
              </div>
              <div className="text-[11px]" style={{ color: 'var(--tt-text-3)' }}>{log.details}</div>
              <div className="flex gap-2 mt-0.5">
                <span className="font-mono text-[10px] text-blue-400">{log.entity}</span>
                <span className="text-[10px]" style={{ color: 'var(--tt-text-3)' }}>· {log.user}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
