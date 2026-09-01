import { useState } from 'react';
import { warranties, warrantyPolicies, serviceClaims, endUsers, products } from '../data/mock';

const statusStyle: Record<string, { color: string; bg: string; border: string }> = {
  'Not Eligible': { color: '#94a3b8', bg: 'rgba(148,163,184,0.1)', border: 'rgba(148,163,184,0.2)' },
  Eligible:       { color: '#60a5fa', bg: 'rgba(96,165,250,0.1)',  border: 'rgba(96,165,250,0.2)'  },
  Active:         { color: '#34d399', bg: 'rgba(52,211,153,0.1)',  border: 'rgba(52,211,153,0.2)'  },
  'Claim Open':   { color: '#fbbf24', bg: 'rgba(251,191,36,0.1)',  border: 'rgba(251,191,36,0.2)'  },
  'Under Service':{ color: '#fb923c', bg: 'rgba(251,146,60,0.1)',  border: 'rgba(251,146,60,0.2)'  },
  Approved:       { color: '#2dd4bf', bg: 'rgba(45,212,191,0.1)',  border: 'rgba(45,212,191,0.2)'  },
  Rejected:       { color: '#f87171', bg: 'rgba(248,113,113,0.1)', border: 'rgba(248,113,113,0.2)' },
  Closed:         { color: '#64748b', bg: 'rgba(100,116,139,0.1)', border: 'rgba(100,116,139,0.2)' },
  Expired:        { color: '#f87171', bg: 'rgba(248,113,113,0.1)', border: 'rgba(248,113,113,0.2)' },
};

function StatusBadge({ status }: { status: string }) {
  const s = statusStyle[status] ?? statusStyle.Closed;
  return (
    <span className="inline-flex px-1.5 py-0.5 rounded border text-[10px] font-semibold"
      style={{ color: s.color, background: s.bg, borderColor: s.border }}>
      {status}
    </span>
  );
}

function pct(start: string, end: string) {
  const s = new Date(start).getTime(), e = new Date(end).getTime(), n = new Date('2024-11-21').getTime();
  return Math.max(0, Math.min(100, Math.round(((n - s) / (e - s)) * 100)));
}

export default function Warranty() {
  const [tab, setTab] = useState<'warranties' | 'policies' | 'claims'>('warranties');

  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold" style={{ color: 'var(--tt-text-1)' }}>Warranty Management</h2>
          <p className="text-xs mt-0.5" style={{ color: 'var(--tt-text-3)' }}>Policies, activations, claims and service lifecycle</p>
        </div>
        <button className="flex items-center gap-2 px-3 py-1.5 text-white text-xs font-semibold rounded transition-colors"
          style={{ background: '#8b5cf6' }}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3.5 h-3.5"><path d="M12 5v14M5 12h14"/></svg>
          New Policy
        </button>
      </div>

      <div className="grid grid-cols-4 gap-3">
        {[
          { label: 'Active Warranties', value: warranties.filter(w => w.status === 'Active').length, color: '#34d399' },
          { label: 'Open Claims', value: warranties.filter(w => w.status === 'Claim Open').length, color: '#fbbf24' },
          { label: 'Under Service', value: serviceClaims.filter(c => c.status === 'Under Service').length, color: '#fb923c' },
          { label: 'Active Policies', value: warrantyPolicies.length, color: '#60a5fa' },
        ].map(k => (
          <div key={k.label} className="rounded-lg border p-3"
            style={{ background: 'var(--tt-surface)', borderColor: 'var(--tt-border)' }}>
            <div className="text-xl font-semibold font-mono" style={{ color: k.color }}>{k.value}</div>
            <div className="text-xs mt-1" style={{ color: 'var(--tt-text-3)' }}>{k.label}</div>
          </div>
        ))}
      </div>

      <div className="flex items-center gap-0" style={{ borderBottom: '1px solid var(--tt-border)' }}>
        {([
          { id: 'warranties' as const, label: 'Active Warranties' },
          { id: 'claims' as const, label: 'Service Claims' },
          { id: 'policies' as const, label: 'Warranty Policies' },
        ]).map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className="px-4 py-2 text-xs font-medium transition-colors border-b-2 -mb-px"
            style={{ borderColor: tab === t.id ? '#8b5cf6' : 'transparent', color: tab === t.id ? '#a78bfa' : 'var(--tt-text-3)' }}>
            {t.label}
          </button>
        ))}
      </div>

      {tab === 'warranties' && (
        <div className="space-y-3">
          {warranties.map(w => {
            const eu = endUsers.find(e => e.id === w.endUserId);
            const p = pct(w.startDate, w.endDate);
            return (
              <div key={w.id} className="rounded-lg border p-4"
                style={{ background: 'var(--tt-surface)', borderColor: 'var(--tt-border)' }}>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-mono text-[11px] text-violet-400">{w.id}</span>
                      <StatusBadge status={w.status} />
                    </div>
                    <div className="text-sm font-semibold" style={{ color: 'var(--tt-text-1)' }}>{w.product}</div>
                    <div className="font-mono text-[10px] text-emerald-400 mt-0.5">{w.qr}</div>
                    {eu && <div className="text-xs mt-0.5" style={{ color: 'var(--tt-text-3)' }}>{eu.name} · {eu.city}, {eu.country}</div>}
                  </div>
                  <div className="flex gap-5 text-right text-xs flex-shrink-0">
                    {[['Start', w.startDate], ['Expires', w.endDate], ['Claims', `${w.claims}/${w.maxClaims}`]].map(([l, v]) => (
                      <div key={l as string}>
                        <div className="text-[10px]" style={{ color: 'var(--tt-text-3)' }}>{l}</div>
                        <div className="font-mono" style={{ color: 'var(--tt-text-1)' }}>{v}</div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="mt-3">
                  <div className="flex justify-between text-[10px] mb-1" style={{ color: 'var(--tt-text-3)' }}>
                    <span>Warranty consumed</span><span className="font-mono">{p}%</span>
                  </div>
                  <div className="rounded-full h-1.5" style={{ background: 'var(--tt-raised)' }}>
                    <div className="h-1.5 rounded-full transition-all"
                      style={{ width: `${p}%`, background: p > 80 ? '#f59e0b' : p > 50 ? '#3b82f6' : '#10b981' }} />
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
            <div key={c.id} className="rounded-lg border p-4"
              style={{ background: 'var(--tt-surface)', borderColor: 'var(--tt-border)' }}>
              <div className="flex items-start justify-between gap-4 mb-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-mono text-[11px] text-amber-400">{c.id}</span>
                    <span className="inline-flex px-1.5 py-0.5 rounded border text-[10px] font-semibold"
                      style={{
                        color: c.status === 'Under Service' ? '#fb923c' : c.status === 'Open' ? '#fbbf24' : '#34d399',
                        background: c.status === 'Under Service' ? 'rgba(251,146,60,0.1)' : c.status === 'Open' ? 'rgba(251,191,36,0.1)' : 'rgba(52,211,153,0.1)',
                        borderColor: c.status === 'Under Service' ? 'rgba(251,146,60,0.25)' : c.status === 'Open' ? 'rgba(251,191,36,0.25)' : 'rgba(52,211,153,0.25)',
                      }}>{c.status}</span>
                  </div>
                  <div className="text-sm font-semibold" style={{ color: 'var(--tt-text-1)' }}>{c.product}</div>
                  <div className="font-mono text-[10px] text-emerald-400">{c.qr}</div>
                </div>
                <div className="text-right text-xs">
                  <div className="text-[10px]" style={{ color: 'var(--tt-text-3)' }}>Raised</div>
                  <div className="font-mono" style={{ color: 'var(--tt-text-1)' }}>{c.raised}</div>
                  {c.eta && <><div className="text-[10px] mt-1" style={{ color: 'var(--tt-text-3)' }}>ETA</div><div className="font-mono" style={{ color: 'var(--tt-text-1)' }}>{c.eta}</div></>}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3 text-xs">
                {[['Issue', c.issue], ...(c.diagnosis ? [['Diagnosis', c.diagnosis]] : []), ...(c.technician ? [['Technician', c.technician]] : []), ...(c.centre ? [['Service Centre', c.centre]] : [])].map(([l, v]) => (
                  <div key={l as string}>
                    <div className="text-[10px] mb-0.5" style={{ color: 'var(--tt-text-3)' }}>{l}</div>
                    <div style={{ color: 'var(--tt-text-1)' }}>{v}</div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === 'policies' && (
        <div className="rounded-lg border overflow-hidden"
          style={{ background: 'var(--tt-surface)', borderColor: 'var(--tt-border)' }}>
          <table className="w-full text-xs">
            <thead>
              <tr style={{ borderBottom: '1px solid var(--tt-border)' }}>
                {['Policy ID','SKU','Product','Period','Start Event','Coverage','Max Claims'].map(h => (
                  <th key={h} className="px-4 py-2.5 text-left text-[10px] font-semibold uppercase tracking-wider"
                    style={{ color: 'var(--tt-text-3)' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {warrantyPolicies.map((p, i) => {
                const prod = products.find(pr => pr.id === p.productId);
                return (
                  <tr key={p.id}
                    style={{ borderBottom: i < warrantyPolicies.length - 1 ? '1px solid var(--tt-border)' : 'none' }}
                    onMouseEnter={e => (e.currentTarget.style.background = 'var(--tt-hover)')}
                    onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                    <td className="px-4 py-3 font-mono text-violet-400">{p.id}</td>
                    <td className="px-4 py-3 font-mono text-emerald-400">{p.sku}</td>
                    <td className="px-4 py-3" style={{ color: 'var(--tt-text-1)' }}>{prod?.name}</td>
                    <td className="px-4 py-3 font-mono" style={{ color: 'var(--tt-text-1)' }}>{p.months} mo</td>
                    <td className="px-4 py-3" style={{ color: 'var(--tt-text-2)' }}>{p.startEvent}</td>
                    <td className="px-4 py-3">
                      <div className="flex gap-1 flex-wrap">
                        {p.coverage.map(c => (
                          <span key={c} className="text-[10px] px-1.5 py-0.5 rounded"
                            style={{ background: 'var(--tt-raised)', color: 'var(--tt-text-2)' }}>{c}</span>
                        ))}
                      </div>
                    </td>
                    <td className="px-4 py-3 font-mono" style={{ color: 'var(--tt-text-1)' }}>{p.maxClaims}</td>
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
