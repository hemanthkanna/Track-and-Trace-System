import { useState } from 'react';
import { organizations, auditLogs } from '../data/mock';

const typeColor: Record<string, string> = {
  Manufacturer: 'text-blue-400 bg-blue-500/10',
  Warehouse: 'text-teal-400 bg-teal-500/10',
  Distributor: 'text-violet-400 bg-violet-500/10',
  Dealer: 'text-emerald-400 bg-emerald-500/10',
  'Service Centre': 'text-amber-400 bg-amber-500/10',
};

const roles = [
  { role: 'Super Admin', desc: 'Organizations, platform settings, QR batch generation, monitoring', org: 'Platform', access: 'Full platform access', count: 2 },
  { role: 'Organization Admin', desc: 'Products, production, QR assignment, partners, policies, reports', org: 'TechFlow Electronics', access: 'Org-scoped admin', count: 4 },
  { role: 'Factory Operator', desc: 'Production packing, parent-child aggregation, factory exit scans', org: 'TechFlow Electronics', access: 'Factory scan + pack', count: 12 },
  { role: 'Warehouse Operator', desc: 'Entry/exit scans, stock, internal movements, receiving and dispatch', org: 'Gulf Trade Logistics', access: 'Warehouse operations', count: 18 },
  { role: 'Distributor Operator', desc: 'Distributor receipt, stock, transfer and exit scans', org: 'Al Faris Distribution', access: 'Distributor ops', count: 9 },
  { role: 'Dealer Operator', desc: 'Dealer receipt, stock, sale allocation and customer handover', org: 'SmartHome Gadgets LLC', access: 'Dealer ops', count: 5 },
  { role: 'Service Centre', desc: 'Warranty/service claims, repair, replacement and closure', org: 'ProFix Service Centre', access: 'Service ops', count: 6 },
  { role: 'End User', desc: 'Product scan, authentication, registration, warranty view and service', org: 'Public', access: 'Self-service', count: 5 },
];

export default function Admin() {
  const [tab, setTab] = useState<'orgs' | 'roles' | 'audit'>('orgs');

  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-slate-100">System Administration</h2>
          <p className="text-xs text-slate-500 mt-0.5">Organizations, roles, access control, and audit management</p>
        </div>
        <button className="flex items-center gap-2 px-3 py-1.5 bg-blue-500 hover:bg-blue-400 text-white text-xs font-semibold rounded transition-colors">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3.5 h-3.5"><path d="M12 5v14M5 12h14"/></svg>
          Add Organization
        </button>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 border-b border-[#1e2d45]">
        {(['orgs', 'roles', 'audit'] as const).map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-4 py-2 text-xs font-medium transition-colors border-b-2 -mb-px ${tab === t ? 'border-blue-500 text-blue-400' : 'border-transparent text-slate-500 hover:text-slate-300'}`}>
            {t === 'orgs' ? 'Organizations' : t === 'roles' ? 'Roles & Access' : 'Audit Log'}
          </button>
        ))}
      </div>

      {tab === 'orgs' && (
        <div className="bg-[#0f1623] border border-[#1e2d45] rounded-lg overflow-hidden">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-[#1e2d45]">
                {['Org ID', 'Organization', 'Type', 'Country', 'City', 'Users', 'Status', 'Actions'].map(h => (
                  <th key={h} className="px-4 py-2.5 text-left text-[10px] font-semibold text-slate-500 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1e2d45]">
              {organizations.map(org => (
                <tr key={org.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="px-4 py-3 font-mono text-slate-500 text-[10px]">{org.id}</td>
                  <td className="px-4 py-3 font-medium text-slate-200">{org.name}</td>
                  <td className="px-4 py-3">
                    <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded ${typeColor[org.type] ?? 'text-slate-400 bg-slate-500/10'}`}>{org.type}</span>
                  </td>
                  <td className="px-4 py-3 text-slate-400">{org.country}</td>
                  <td className="px-4 py-3 text-slate-400">{org.city}</td>
                  <td className="px-4 py-3 font-mono text-slate-300">{org.users}</td>
                  <td className="px-4 py-3">
                    <span className={`text-[10px] px-1.5 py-0.5 rounded border font-medium ${org.status === 'Active' ? 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20' : 'text-red-400 bg-red-400/10 border-red-400/20'}`}>{org.status}</span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button className="text-[10px] text-blue-400 hover:text-blue-300 transition-colors">Edit</button>
                      <button className="text-[10px] text-slate-500 hover:text-slate-300 transition-colors">Users</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {tab === 'roles' && (
        <div className="grid grid-cols-1 gap-3">
          {roles.map(r => (
            <div key={r.role} className="bg-[#0f1623] border border-[#1e2d45] rounded-lg p-4 flex items-center gap-4">
              <div className="w-8 h-8 rounded-lg bg-[#1e2d45] flex items-center justify-center flex-shrink-0">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-4 h-4 text-slate-400">
                  <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/>
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="text-sm font-semibold text-slate-200">{r.role}</span>
                  <span className="text-[10px] font-medium px-1.5 py-0.5 bg-[#1e2d45] text-slate-400 rounded">{r.access}</span>
                </div>
                <div className="text-[11px] text-slate-500">{r.desc}</div>
                <div className="text-[10px] text-slate-600 mt-0.5">Default org: {r.org}</div>
              </div>
              <div className="flex items-center gap-4 flex-shrink-0">
                <div className="text-right">
                  <div className="font-mono text-lg font-semibold text-slate-300">{r.count}</div>
                  <div className="text-[10px] text-slate-500">users</div>
                </div>
                <button className="text-[11px] text-blue-400 hover:text-blue-300 transition-colors">Configure</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === 'audit' && (
        <div className="bg-[#0f1623] border border-[#1e2d45] rounded-lg overflow-hidden">
          <div className="px-4 py-3 border-b border-[#1e2d45] flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            <span className="text-xs text-slate-400">Immutable audit log — events cannot be deleted or modified</span>
          </div>
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-[#1e2d45]">
                {['Log ID', 'Timestamp', 'Action', 'Entity', 'Actor', 'Organization', 'Details'].map(h => (
                  <th key={h} className="px-4 py-2.5 text-left text-[10px] font-semibold text-slate-500 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1e2d45]">
              {auditLogs.map(log => (
                <tr key={log.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="px-4 py-3 font-mono text-slate-600 text-[10px]">{log.id}</td>
                  <td className="px-4 py-3 font-mono text-slate-400 text-[10px]">{log.timestamp}</td>
                  <td className="px-4 py-3 font-medium text-slate-300">{log.action}</td>
                  <td className="px-4 py-3 font-mono text-blue-400 text-[10px]">{log.entity}</td>
                  <td className="px-4 py-3 text-slate-400">{log.user}</td>
                  <td className="px-4 py-3 text-slate-500 text-[11px]">{log.org}</td>
                  <td className="px-4 py-3 text-slate-500 text-[11px]">{log.details}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
