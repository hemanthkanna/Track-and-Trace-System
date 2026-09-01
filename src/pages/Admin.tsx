import { useState } from 'react';
import { organizations, auditLogs } from '../data/mock';

const typeStyle: Record<string, { color: string; bg: string }> = {
  Manufacturer:    { color: '#60a5fa', bg: 'rgba(96,165,250,0.1)'  },
  Warehouse:       { color: '#2dd4bf', bg: 'rgba(45,212,191,0.1)'  },
  Distributor:     { color: '#a78bfa', bg: 'rgba(167,139,250,0.1)' },
  Dealer:          { color: '#34d399', bg: 'rgba(52,211,153,0.1)'  },
  'Service Centre':{ color: '#fbbf24', bg: 'rgba(251,191,36,0.1)'  },
};

const roles = [
  { role: 'Super Admin', desc: 'Organizations, platform settings, QR batch generation, monitoring', access: 'Full platform', count: 2, color: '#f87171' },
  { role: 'Organization Admin', desc: 'Products, production, QR assignment, partners, policies, reports', access: 'Org-scoped admin', count: 4, color: '#fb923c' },
  { role: 'Factory Operator', desc: 'Production packing, parent-child aggregation, factory exit scans', access: 'Factory ops', count: 12, color: '#fbbf24' },
  { role: 'Warehouse Operator', desc: 'Entry/exit scans, stock, internal movements, receiving and dispatch', access: 'Warehouse ops', count: 18, color: '#34d399' },
  { role: 'Distributor Operator', desc: 'Distributor receipt, stock, transfer and exit scans', access: 'Distributor ops', count: 9, color: '#2dd4bf' },
  { role: 'Dealer Operator', desc: 'Dealer receipt, stock, sale allocation and customer handover', access: 'Dealer ops', count: 5, color: '#60a5fa' },
  { role: 'Service Centre', desc: 'Warranty/service claims, repair, replacement and closure', access: 'Service ops', count: 6, color: '#a78bfa' },
  { role: 'End User', desc: 'Product scan, authentication, registration, warranty view and service', access: 'Self-service', count: 5, color: '#94a3b8' },
];

export default function Admin() {
  const [tab, setTab] = useState<'orgs' | 'roles' | 'audit'>('orgs');

  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold" style={{ color: 'var(--tt-text-1)' }}>System Administration</h2>
          <p className="text-xs mt-0.5" style={{ color: 'var(--tt-text-3)' }}>Organizations, roles, access control, and audit management</p>
        </div>
        <button className="flex items-center gap-2 px-3 py-1.5 text-white text-xs font-semibold rounded transition-colors bg-blue-500 hover:bg-blue-400">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3.5 h-3.5"><path d="M12 5v14M5 12h14"/></svg>
          Add Organization
        </button>
      </div>

      <div className="flex items-center gap-0" style={{ borderBottom: '1px solid var(--tt-border)' }}>
        {([
          { id: 'orgs' as const, label: 'Organizations' },
          { id: 'roles' as const, label: 'Roles & Access' },
          { id: 'audit' as const, label: 'Audit Log' },
        ]).map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className="px-4 py-2 text-xs font-medium transition-colors border-b-2 -mb-px"
            style={{ borderColor: tab === t.id ? '#3b82f6' : 'transparent', color: tab === t.id ? '#60a5fa' : 'var(--tt-text-3)' }}>
            {t.label}
          </button>
        ))}
      </div>

      {tab === 'orgs' && (
        <div className="rounded-lg border overflow-hidden"
          style={{ background: 'var(--tt-surface)', borderColor: 'var(--tt-border)' }}>
          <table className="w-full text-xs">
            <thead>
              <tr style={{ borderBottom: '1px solid var(--tt-border)' }}>
                {['Org ID','Organization','Type','Country','City','Users','Status','Actions'].map(h => (
                  <th key={h} className="px-4 py-2.5 text-left text-[10px] font-semibold uppercase tracking-wider"
                    style={{ color: 'var(--tt-text-3)' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {organizations.map((org, i) => {
                const ts = typeStyle[org.type] ?? typeStyle.Warehouse;
                return (
                  <tr key={org.id}
                    style={{ borderBottom: i < organizations.length - 1 ? '1px solid var(--tt-border)' : 'none' }}
                    onMouseEnter={e => (e.currentTarget.style.background = 'var(--tt-hover)')}
                    onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                    <td className="px-4 py-3 font-mono text-[10px]" style={{ color: 'var(--tt-text-3)' }}>{org.id}</td>
                    <td className="px-4 py-3 font-medium" style={{ color: 'var(--tt-text-1)' }}>{org.name}</td>
                    <td className="px-4 py-3">
                      <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded"
                        style={{ color: ts.color, background: ts.bg }}>{org.type}</span>
                    </td>
                    <td className="px-4 py-3" style={{ color: 'var(--tt-text-2)' }}>{org.country}</td>
                    <td className="px-4 py-3" style={{ color: 'var(--tt-text-2)' }}>{org.city}</td>
                    <td className="px-4 py-3 font-mono" style={{ color: 'var(--tt-text-1)' }}>{org.users}</td>
                    <td className="px-4 py-3">
                      <span className="text-[10px] px-1.5 py-0.5 rounded border font-semibold"
                        style={{
                          color: org.status === 'Active' ? '#34d399' : '#f87171',
                          background: org.status === 'Active' ? 'rgba(52,211,153,0.1)' : 'rgba(248,113,113,0.1)',
                          borderColor: org.status === 'Active' ? 'rgba(52,211,153,0.25)' : 'rgba(248,113,113,0.25)',
                        }}>{org.status}</span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <button className="text-[10px] text-blue-400 hover:text-blue-300 transition-colors">Edit</button>
                        <button className="text-[10px] hover:opacity-70 transition-opacity" style={{ color: 'var(--tt-text-3)' }}>Users</button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {tab === 'roles' && (
        <div className="grid gap-2">
          {roles.map(r => (
            <div key={r.role} className="rounded-lg border p-4 flex items-center gap-4"
              style={{ background: 'var(--tt-surface)', borderColor: 'var(--tt-border)' }}>
              <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                style={{ background: 'var(--tt-raised)', border: '1px solid var(--tt-border)' }}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-4 h-4"
                  style={{ color: r.color }}>
                  <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" strokeLinecap="round"/>
                  <circle cx="12" cy="7" r="4"/>
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="text-sm font-semibold" style={{ color: 'var(--tt-text-1)' }}>{r.role}</span>
                  <span className="text-[10px] font-medium px-1.5 py-0.5 rounded"
                    style={{ background: 'var(--tt-raised)', color: 'var(--tt-text-2)' }}>{r.access}</span>
                </div>
                <div className="text-[11px]" style={{ color: 'var(--tt-text-3)' }}>{r.desc}</div>
              </div>
              <div className="flex items-center gap-4 flex-shrink-0">
                <div className="text-right">
                  <div className="font-mono text-lg font-semibold" style={{ color: r.color }}>{r.count}</div>
                  <div className="text-[10px]" style={{ color: 'var(--tt-text-3)' }}>users</div>
                </div>
                <button className="text-[11px] text-blue-400 hover:text-blue-300 transition-colors">Configure</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === 'audit' && (
        <div className="rounded-lg border overflow-hidden"
          style={{ background: 'var(--tt-surface)', borderColor: 'var(--tt-border)' }}>
          <div className="px-4 py-2.5 flex items-center gap-2"
            style={{ borderBottom: '1px solid var(--tt-border)', background: 'var(--tt-raised)' }}>
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            <span className="text-[11px]" style={{ color: 'var(--tt-text-3)' }}>Immutable audit log — events cannot be deleted or modified</span>
          </div>
          <table className="w-full text-xs">
            <thead>
              <tr style={{ borderBottom: '1px solid var(--tt-border)' }}>
                {['Log ID','Timestamp','Action','Entity','Actor','Organization','Details'].map(h => (
                  <th key={h} className="px-4 py-2.5 text-left text-[10px] font-semibold uppercase tracking-wider"
                    style={{ color: 'var(--tt-text-3)' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {auditLogs.map((log, i) => (
                <tr key={log.id}
                  style={{ borderBottom: i < auditLogs.length - 1 ? '1px solid var(--tt-border)' : 'none' }}
                  onMouseEnter={e => (e.currentTarget.style.background = 'var(--tt-hover)')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                  <td className="px-4 py-3 font-mono text-[10px]" style={{ color: 'var(--tt-text-3)' }}>{log.id}</td>
                  <td className="px-4 py-3 font-mono text-[10px]" style={{ color: 'var(--tt-text-2)' }}>{log.timestamp}</td>
                  <td className="px-4 py-3 font-medium" style={{ color: 'var(--tt-text-1)' }}>{log.action}</td>
                  <td className="px-4 py-3 font-mono text-blue-400 text-[10px]">{log.entity}</td>
                  <td className="px-4 py-3" style={{ color: 'var(--tt-text-2)' }}>{log.user}</td>
                  <td className="px-4 py-3 text-[11px]" style={{ color: 'var(--tt-text-3)' }}>{log.org}</td>
                  <td className="px-4 py-3 text-[11px]" style={{ color: 'var(--tt-text-3)' }}>{log.details}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
