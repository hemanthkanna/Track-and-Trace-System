import { useState } from 'react';
import { warranties, warrantyPolicies, serviceClaims, endUsers, products } from '../data/mock';

const statusColor: Record<string, string> = {
  'Not Eligible': 'text-slate-400 bg-slate-400/10 border-slate-400/20',
  Eligible: 'text-blue-400 bg-blue-400/10 border-blue-400/20',
  Active: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20',
  'Claim Open': 'text-amber-400 bg-amber-400/10 border-amber-400/20',
  'Under Service': 'text-orange-400 bg-orange-400/10 border-orange-400/20',
  Approved: 'text-teal-400 bg-teal-400/10 border-teal-400/20',
  Rejected: 'text-red-400 bg-red-400/10 border-red-400/20',
  Closed: 'text-slate-500 bg-slate-500/10 border-slate-500/20',
  Expired: 'text-red-400 bg-red-400/10 border-red-400/20',
};

function warrantyProgress(start: string, end: string): number {
  const s = new Date(start).getTime();
  const e = new Date(end).getTime();
  const now = new Date('2024-11-21').getTime();
  return Math.max(0, Math.min(100, Math.round(((now - s) / (e - s)) * 100)));
}

export default function Warranty() {
  const [tab, setTab] = useState<'warranties' | 'policies' | 'claims'>('warranties');

  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-slate-100">Warranty Management</h2>
          <p className="text-xs text-slate-500 mt-0.5">Policies, activations, claims and service history</p>
        </div>
        <button className="flex items-center gap-2 px-3 py-1.5 bg-violet-500 hover:bg-violet-400 text-white text-xs font-semibold rounded transition-colors">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3.5 h-3.5"><path d="M12 5v14M5 12h14"/></svg>
          New Policy
        </button>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-4 gap-3">
        <div className="bg-[#0f1623] border border-[#1e2d45] rounded-lg p-3">
          <div className="text-xl font-semibold font-mono text-emerald-400">{warranties.filter(w => w.status === 'Active').length}</div>
          <div className="text-xs text-slate-400 mt-1">Active Warranties</div>
        </div>
        <div className="bg-[#0f1623] border border-[#1e2d45] rounded-lg p-3">
          <div className="text-xl font-semibold font-mono text-amber-400">{warranties.filter(w => w.status === 'Claim Open').length}</div>
          <div className="text-xs text-slate-400 mt-1">Open Claims</div>
        </div>
        <div className="bg-[#0f1623] border border-[#1e2d45] rounded-lg p-3">
          <div className="text-xl font-semibold font-mono text-orange-400">{serviceClaims.filter(c => c.status === 'Under Service').length}</div>
          <div className="text-xs text-slate-400 mt-1">Under Service</div>
        </div>
        <div className="bg-[#0f1623] border border-[#1e2d45] rounded-lg p-3">
          <div className="text-xl font-semibold font-mono text-blue-400">{warrantyPolicies.length}</div>
          <div className="text-xs text-slate-400 mt-1">Active Policies</div>
        </div>
      </div>

      {/* Tab Nav */}
      <div className="flex items-center gap-1 border-b border-[#1e2d45]">
        {(['warranties', 'claims', 'policies'] as const).map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-4 py-2 text-xs font-medium capitalize transition-colors border-b-2 -mb-px ${tab === t ? 'border-violet-500 text-violet-400' : 'border-transparent text-slate-500 hover:text-slate-300'}`}>
            {t === 'warranties' ? 'Active Warranties' : t === 'claims' ? 'Service Claims' : 'Warranty Policies'}
          </button>
        ))}
      </div>

      {tab === 'warranties' && (
        <div className="space-y-3">
          {warranties.map(w => {
            const eu = endUsers.find(e => e.id === w.endUserId);
            const pct = warrantyProgress(w.startDate, w.endDate);
            return (
              <div key={w.id} className="bg-[#0f1623] border border-[#1e2d45] rounded-lg p-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-1">
                      <span className="font-mono text-[11px] text-violet-400">{w.id}</span>
                      <span className={`inline-flex px-1.5 py-0.5 rounded border text-[10px] font-medium ${statusColor[w.status]}`}>{w.status}</span>
                    </div>
                    <div className="text-sm font-medium text-slate-200">{w.product}</div>
                    <div className="font-mono text-[10px] text-emerald-400 mt-0.5">{w.qr}</div>
                    {eu && <div className="text-xs text-slate-500 mt-0.5">Owner: {eu.name} · {eu.city}, {eu.country}</div>}
                  </div>
                  <div className="flex gap-6 text-right text-xs flex-shrink-0">
                    <div>
                      <div className="text-slate-500 text-[10px]">Start</div>
                      <div className="font-mono text-slate-300">{w.startDate}</div>
                    </div>
                    <div>
                      <div className="text-slate-500 text-[10px]">Expires</div>
                      <div className="font-mono text-slate-300">{w.endDate}</div>
                    </div>
                    <div>
                      <div className="text-slate-500 text-[10px]">Claims</div>
                      <div className="font-mono text-slate-300">{w.claims}/{w.maxClaims}</div>
                    </div>
                  </div>
                </div>
                <div className="mt-3">
                  <div className="flex justify-between text-[10px] text-slate-500 mb-1">
                    <span>Warranty used</span>
                    <span className="font-mono">{pct}%</span>
                  </div>
                  <div className="bg-[#1e2d45] rounded-full h-1.5">
                    <div className={`h-1.5 rounded-full transition-all ${pct > 80 ? 'bg-amber-500' : pct > 50 ? 'bg-blue-500' : 'bg-emerald-500'}`} style={{ width: `${pct}%` }} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {tab === 'claims' && (
        <div className="space-y-3">
          {serviceClaims.map(c => (
            <div key={c.id} className="bg-[#0f1623] border border-[#1e2d45] rounded-lg p-4">
              <div className="flex items-start justify-between gap-4 mb-3">
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <span className="font-mono text-[11px] text-amber-400">{c.id}</span>
                    <span className={`inline-flex px-1.5 py-0.5 rounded border text-[10px] font-medium ${
                      c.status === 'Under Service' ? 'text-orange-400 bg-orange-400/10 border-orange-400/20' :
                      c.status === 'Open' ? 'text-amber-400 bg-amber-400/10 border-amber-400/20' :
                      'text-emerald-400 bg-emerald-400/10 border-emerald-400/20'
                    }`}>{c.status}</span>
                  </div>
                  <div className="text-sm font-medium text-slate-200">{c.product}</div>
                  <div className="font-mono text-[10px] text-emerald-400">{c.qr}</div>
                </div>
                <div className="text-right text-xs">
                  <div className="text-slate-500 text-[10px]">Raised</div>
                  <div className="font-mono text-slate-300">{c.raised}</div>
                  {c.eta && <>
                    <div className="text-slate-500 text-[10px] mt-1">ETA</div>
                    <div className="font-mono text-slate-300">{c.eta}</div>
                  </>}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <div className="text-[10px] text-slate-500 mb-0.5">Issue Reported</div>
                  <div className="text-slate-300">{c.issue}</div>
                </div>
                {c.diagnosis && (
                  <div>
                    <div className="text-[10px] text-slate-500 mb-0.5">Diagnosis</div>
                    <div className="text-slate-300">{c.diagnosis}</div>
                  </div>
                )}
                {c.technician && (
                  <div>
                    <div className="text-[10px] text-slate-500 mb-0.5">Technician</div>
                    <div className="text-slate-300">{c.technician}</div>
                  </div>
                )}
                {c.centre && (
                  <div>
                    <div className="text-[10px] text-slate-500 mb-0.5">Service Centre</div>
                    <div className="text-slate-300">{c.centre}</div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === 'policies' && (
        <div className="bg-[#0f1623] border border-[#1e2d45] rounded-lg overflow-hidden">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-[#1e2d45]">
                {['Policy ID', 'SKU', 'Product', 'Period', 'Start Event', 'Coverage', 'Max Claims'].map(h => (
                  <th key={h} className="px-4 py-2.5 text-left text-[10px] font-semibold text-slate-500 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1e2d45]">
              {warrantyPolicies.map(p => {
                const prod = products.find(pr => pr.id === p.productId);
                return (
                  <tr key={p.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="px-4 py-3 font-mono text-violet-400">{p.id}</td>
                    <td className="px-4 py-3 font-mono text-slate-300">{p.sku}</td>
                    <td className="px-4 py-3 text-slate-300">{prod?.name}</td>
                    <td className="px-4 py-3 font-mono text-slate-300">{p.months} mo</td>
                    <td className="px-4 py-3 text-slate-400">{p.startEvent}</td>
                    <td className="px-4 py-3">
                      <div className="flex gap-1 flex-wrap">
                        {p.coverage.map(c => (
                          <span key={c} className="text-[10px] px-1.5 py-0.5 bg-[#1e2d45] text-slate-400 rounded">{c}</span>
                        ))}
                      </div>
                    </td>
                    <td className="px-4 py-3 font-mono text-slate-300">{p.maxClaims}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
