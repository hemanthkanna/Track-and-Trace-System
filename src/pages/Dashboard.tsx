import { dashboardKPIs, movements, riskEvents, auditLogs, inventorySummary } from '../data/mock';

const riskColor: Record<string, string> = {
  Low: 'text-emerald-400',
  Medium: 'text-amber-400',
  High: 'text-orange-400',
  Critical: 'text-red-400',
};
const riskBg: Record<string, string> = {
  Low: 'bg-emerald-500/10 border-emerald-500/20',
  Medium: 'bg-amber-500/10 border-amber-500/20',
  High: 'bg-orange-500/10 border-orange-500/20',
  Critical: 'bg-red-500/10 border-red-500/20',
};
const movStatusColor: Record<string, string> = {
  Planned: 'text-slate-400',
  'Exit Scanned': 'text-blue-400',
  'In Transit': 'text-amber-400',
  'Entry Scanned': 'text-teal-400',
  Completed: 'text-emerald-400',
  Exception: 'text-red-400',
  Cancelled: 'text-slate-500',
};

export default function Dashboard() {
  const kpis = [
    { label: 'Total QR Codes', value: dashboardKPIs.totalQRCodes.toLocaleString(), sub: 'across all batches', accent: 'text-blue-400', icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5">
        <rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/>
        <path d="M14 14h2v2h-2zM18 14h2v2h-2zM14 18h2v2h-2zM18 18h2v2h-2z"/>
      </svg>
    )},
    { label: 'Active Products', value: dashboardKPIs.activeProducts.toLocaleString(), sub: 'in supply chain', accent: 'text-teal-400', icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5">
        <path d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/>
      </svg>
    )},
    { label: 'In-Transit Movements', value: dashboardKPIs.inTransitMovements.toString(), sub: 'awaiting entry scan', accent: 'text-amber-400', icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5">
        <path d="M5 12h14M12 5l7 7-7 7"/>
      </svg>
    )},
    { label: 'Open Risk Events', value: dashboardKPIs.openRiskEvents.toString(), sub: 'require attention', accent: 'text-red-400', icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5">
        <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
      </svg>
    )},
    { label: 'Registered End Users', value: dashboardKPIs.registeredEndUsers.toString(), sub: '+2 this week', accent: 'text-violet-400', icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5">
        <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/>
      </svg>
    )},
    { label: 'Weekly Scans', value: dashboardKPIs.weeklyScans.toLocaleString(), sub: 'authentication events', accent: 'text-cyan-400', icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5">
        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
      </svg>
    )},
  ];

  const openRisks = riskEvents.filter(r => r.status === 'Open');

  return (
    <div className="p-6 space-y-6">
      {/* KPI Row */}
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3">
        {kpis.map((k) => (
          <div key={k.label} className="bg-[#0f1623] border border-[#1e2d45] rounded-lg p-4 flex flex-col gap-2">
            <div className={`${k.accent} opacity-80`}>{k.icon}</div>
            <div className={`text-2xl font-semibold tracking-tight ${k.accent}`}>{k.value}</div>
            <div>
              <div className="text-xs font-medium text-slate-300">{k.label}</div>
              <div className="text-[10px] text-slate-500 mt-0.5">{k.sub}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        {/* Recent Movements */}
        <div className="xl:col-span-2 bg-[#0f1623] border border-[#1e2d45] rounded-lg">
          <div className="px-4 py-3 border-b border-[#1e2d45] flex items-center justify-between">
            <span className="text-sm font-semibold text-slate-200">Recent Movements</span>
            <span className="text-[10px] font-mono text-slate-500">LIVE</span>
          </div>
          <div className="divide-y divide-[#1e2d45]">
            {movements.slice(0, 6).map((m) => (
              <div key={m.id} className="px-4 py-3 flex items-center gap-3 hover:bg-white/[0.02] transition-colors">
                <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${
                  m.status === 'Completed' ? 'bg-emerald-400' :
                  m.status === 'In Transit' ? 'bg-amber-400' :
                  m.status === 'Exception' ? 'bg-red-400' :
                  m.status === 'Exit Scanned' ? 'bg-blue-400' : 'bg-slate-500'
                }`} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[10px] text-slate-400">{m.id}</span>
                    <span className="text-[10px] text-slate-600">·</span>
                    <span className="text-xs text-slate-300 truncate">{m.type}</span>
                  </div>
                  <div className="text-[11px] text-slate-500 mt-0.5 truncate">{m.originName} → {m.destinationName}</div>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <span className={`text-[10px] font-medium ${movStatusColor[m.status]}`}>{m.status}</span>
                  <span className="text-[10px] text-slate-600">{m.items} items</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Risk Alerts */}
        <div className="bg-[#0f1623] border border-[#1e2d45] rounded-lg">
          <div className="px-4 py-3 border-b border-[#1e2d45] flex items-center justify-between">
            <span className="text-sm font-semibold text-slate-200">Risk Alerts</span>
            <span className="font-mono text-[10px] text-red-400">{openRisks.length} OPEN</span>
          </div>
          <div className="divide-y divide-[#1e2d45]">
            {riskEvents.slice(0, 5).map((r) => (
              <div key={r.id} className={`px-4 py-3 ${riskBg[r.level]} border-l-2 ${
                r.level === 'Critical' ? 'border-l-red-500' :
                r.level === 'High' ? 'border-l-orange-500' :
                r.level === 'Medium' ? 'border-l-amber-500' : 'border-l-emerald-500'
              }`}>
                <div className="flex items-center justify-between mb-1">
                  <span className={`text-[10px] font-semibold uppercase tracking-wider ${riskColor[r.level]}`}>{r.level}</span>
                  <span className={`font-mono text-[10px] ${riskColor[r.level]}`}>{r.score}</span>
                </div>
                <div className="text-xs text-slate-300 font-medium">{r.type}</div>
                <div className="font-mono text-[10px] text-slate-500 mt-0.5">{r.qr}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        {/* Inventory Snapshot */}
        <div className="bg-[#0f1623] border border-[#1e2d45] rounded-lg">
          <div className="px-4 py-3 border-b border-[#1e2d45]">
            <span className="text-sm font-semibold text-slate-200">Inventory by Location</span>
          </div>
          <div className="divide-y divide-[#1e2d45]">
            {inventorySummary.map((loc) => (
              <div key={loc.locationId} className="px-4 py-2.5 flex items-center gap-3">
                <div className="flex-1 min-w-0">
                  <div className="text-xs text-slate-300 truncate">{loc.locationName}</div>
                </div>
                <div className="flex items-center gap-4 text-[11px]">
                  <span className="text-slate-500">Parent: <span className="text-slate-300 font-mono">{loc.parent}</span></span>
                  <span className="text-slate-500">Child: <span className="text-slate-300 font-mono">{loc.child}</span></span>
                  {loc.inTransit > 0 && <span className="text-amber-400 font-mono">{loc.inTransit} transit</span>}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Audit Feed */}
        <div className="bg-[#0f1623] border border-[#1e2d45] rounded-lg">
          <div className="px-4 py-3 border-b border-[#1e2d45]">
            <span className="text-sm font-semibold text-slate-200">Audit Feed</span>
          </div>
          <div className="divide-y divide-[#1e2d45]">
            {auditLogs.map((log) => (
              <div key={log.id} className="px-4 py-3">
                <div className="flex items-center justify-between mb-0.5">
                  <span className="text-xs font-medium text-slate-300">{log.action}</span>
                  <span className="font-mono text-[10px] text-slate-500">{log.timestamp.split(' ')[0]}</span>
                </div>
                <div className="text-[11px] text-slate-500">{log.details}</div>
                <div className="flex gap-2 mt-1">
                  <span className="font-mono text-[10px] text-blue-400">{log.entity}</span>
                  <span className="text-[10px] text-slate-600">· {log.user}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
