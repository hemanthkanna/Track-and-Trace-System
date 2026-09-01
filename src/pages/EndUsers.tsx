import { useState } from 'react';
import { endUsers, childQRs, products } from '../data/mock';

const warrantyStyle: Record<string, { color: string; bg: string; border: string }> = {
  Active:       { color: '#34d399', bg: 'rgba(52,211,153,0.1)',  border: 'rgba(52,211,153,0.2)'  },
  'Claim Open': { color: '#fbbf24', bg: 'rgba(251,191,36,0.1)',  border: 'rgba(251,191,36,0.2)'  },
  Expired:      { color: '#f87171', bg: 'rgba(248,113,113,0.1)', border: 'rgba(248,113,113,0.2)' },
  'Not Eligible': { color: '#94a3b8', bg: 'rgba(148,163,184,0.1)', border: 'rgba(148,163,184,0.2)' },
};

const authResults = [
  { type: 'Authentic – Valid Product',       icon: '✓', color: '#34d399', bg: 'rgba(52,211,153,0.08)',  border: 'rgba(52,211,153,0.2)'  },
  { type: 'Authentic – Already Registered',  icon: 'ℹ', color: '#60a5fa', bg: 'rgba(96,165,250,0.08)',  border: 'rgba(96,165,250,0.2)'  },
  { type: 'Authentic – Warranty Active',     icon: '✓', color: '#2dd4bf', bg: 'rgba(45,212,191,0.08)',  border: 'rgba(45,212,191,0.2)'  },
  { type: 'Suspicious Movement / Anomaly',   icon: '⚠', color: '#fbbf24', bg: 'rgba(251,191,36,0.08)',  border: 'rgba(251,191,36,0.2)'  },
  { type: 'QR Blocked / Invalid',            icon: '✕', color: '#f87171', bg: 'rgba(248,113,113,0.08)', border: 'rgba(248,113,113,0.2)' },
  { type: 'Potential Counterfeit',           icon: '⛔', color: '#ef4444', bg: 'rgba(239,68,68,0.1)',   border: 'rgba(239,68,68,0.25)'  },
];

export default function EndUsers() {
  const [tab, setTab] = useState<'list' | 'auth'>('list');
  const [authQR, setAuthQR] = useState('');
  const [authResult, setAuthResult] = useState<null | typeof authResults[0] & { qr: typeof childQRs[0] | null }>(null);

  const handleAuth = () => {
    if (!authQR.trim()) return;
    const qr = childQRs.find(q => q.id === authQR.trim());
    if (!qr) { setAuthResult({ ...authResults[4], qr: null }); return; }
    if (qr.status === 'Blocked') { setAuthResult({ ...authResults[4], qr }); return; }
    if (qr.status === 'Registered') { setAuthResult({ ...authResults[1], qr }); return; }
    setAuthResult({ ...authResults[0], qr });
  };

  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold" style={{ color: 'var(--tt-text-1)' }}>End Users & Registration</h2>
          <p className="text-xs mt-0.5" style={{ color: 'var(--tt-text-3)' }}>Customer product registrations and authentication results</p>
        </div>
        <div className="flex gap-1.5">
          {(['list', 'auth'] as const).map(t => (
            <button key={t} onClick={() => setTab(t)}
              className="px-3 py-1.5 text-xs font-medium rounded transition-colors"
              style={{
                background: tab === t ? 'var(--tt-raised)' : 'transparent',
                border: `1px solid ${tab === t ? 'var(--tt-border-2)' : 'var(--tt-border)'}`,
                color: tab === t ? 'var(--tt-text-1)' : 'var(--tt-text-3)',
              }}>
              {t === 'list' ? 'Registrations' : 'Auth Simulator'}
            </button>
          ))}
        </div>
      </div>

      {tab === 'auth' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="rounded-xl border p-6" style={{ background: 'var(--tt-surface)', borderColor: 'var(--tt-border)' }}>
            <h3 className="text-sm font-semibold mb-1" style={{ color: 'var(--tt-text-1)' }}>Authentication Simulator</h3>
            <p className="text-xs mb-5" style={{ color: 'var(--tt-text-3)' }}>Simulate what a customer sees when they scan a product QR code</p>
            <div className="space-y-3">
              <div>
                <label className="text-[10px] font-semibold uppercase tracking-wider mb-1 block" style={{ color: 'var(--tt-text-3)' }}>Product QR Code</label>
                <div className="flex gap-2">
                  <input value={authQR} onChange={e => setAuthQR(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleAuth()}
                    placeholder="Scan product QR code…"
                    className="flex-1 rounded px-3 py-2 text-xs font-mono focus:outline-none"
                    style={{ background: 'var(--tt-raised)', border: '1px solid var(--tt-border)', color: 'var(--tt-text-1)' }} />
                  <button onClick={handleAuth}
                    className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-semibold rounded transition-colors">
                    Verify
                  </button>
                </div>
              </div>
              <div className="flex flex-wrap gap-1">
                <span className="text-[10px] self-center" style={{ color: 'var(--tt-text-3)' }}>Try:</span>
                {['QR-THERM-00001','QR-CAM-00003','QR-CAM-00002','QR-LOCK-00002'].map(q => (
                  <button key={q} onClick={() => setAuthQR(q)}
                    className="font-mono text-[10px] text-blue-400 hover:text-blue-300 px-1.5 py-0.5 rounded"
                    style={{ background: 'rgba(96,165,250,0.1)' }}>{q}</button>
                ))}
              </div>
            </div>
            {authResult && (
              <div className="mt-4 p-4 rounded-lg border" style={{ background: authResult.bg, borderColor: authResult.border }}>
                <div className="flex items-center gap-2 text-sm font-semibold mb-2" style={{ color: authResult.color }}>
                  <span>{authResult.icon}</span><span>{authResult.type}</span>
                </div>
                {authResult.qr && (() => {
                  const prod = products.find(p => p.id === authResult.qr!.productId);
                  const eu = endUsers.find(e => e.registeredQR === authResult.qr!.id);
                  return (
                    <div className="space-y-1 text-[11px]" style={{ color: authResult.color, opacity: 0.8 }}>
                      <div>Product: <span className="font-medium">{prod?.name}</span></div>
                      <div>SKU: <span className="font-mono">{prod?.sku}</span></div>
                      {eu && <div>Owner: <span className="font-medium">{eu.name}</span></div>}
                      <div>Status: <span className="font-medium">{authResult.qr.status}</span></div>
                    </div>
                  );
                })()}
              </div>
            )}
          </div>
          <div className="rounded-xl border p-5" style={{ background: 'var(--tt-surface)', borderColor: 'var(--tt-border)' }}>
            <div className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: 'var(--tt-text-3)' }}>Possible Authentication Results</div>
            <div className="space-y-2">
              {authResults.map(r => (
                <div key={r.type} className="flex items-center gap-3 p-2.5 rounded-lg border"
                  style={{ background: r.bg, borderColor: r.border }}>
                  <span className="text-base w-5 text-center">{r.icon}</span>
                  <span className="text-xs font-medium" style={{ color: r.color }}>{r.type}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {tab === 'list' && (
        <>
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: 'Total Registered', value: endUsers.length, color: 'var(--tt-text-1)' },
              { label: 'Active Warranty', value: endUsers.filter(e => e.warrantyStatus === 'Active').length, color: '#34d399' },
              { label: 'Open Claims', value: endUsers.filter(e => e.warrantyStatus === 'Claim Open').length, color: '#fbbf24' },
            ].map(k => (
              <div key={k.label} className="rounded-lg border p-3"
                style={{ background: 'var(--tt-surface)', borderColor: 'var(--tt-border)' }}>
                <div className="text-xl font-semibold font-mono" style={{ color: k.color }}>{k.value}</div>
                <div className="text-xs mt-1" style={{ color: 'var(--tt-text-3)' }}>{k.label}</div>
              </div>
            ))}
          </div>

          <div className="rounded-lg border overflow-hidden"
            style={{ background: 'var(--tt-surface)', borderColor: 'var(--tt-border)' }}>
            <table className="w-full text-xs">
              <thead>
                <tr style={{ borderBottom: '1px solid var(--tt-border)' }}>
                  {['ID','Customer','Country','Product','QR Code','Dealer','Purchase Date','Registered','Warranty'].map(h => (
                    <th key={h} className="px-3 py-2.5 text-left text-[10px] font-semibold uppercase tracking-wider"
                      style={{ color: 'var(--tt-text-3)' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {endUsers.map((eu, i) => {
                  const ws = warrantyStyle[eu.warrantyStatus] ?? warrantyStyle['Not Eligible'];
                  return (
                    <tr key={eu.id}
                      style={{ borderBottom: i < endUsers.length - 1 ? '1px solid var(--tt-border)' : 'none' }}
                      onMouseEnter={e => (e.currentTarget.style.background = 'var(--tt-hover)')}
                      onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                      <td className="px-3 py-3 font-mono text-[10px]" style={{ color: 'var(--tt-text-3)' }}>{eu.id}</td>
                      <td className="px-3 py-3">
                        <div className="font-medium" style={{ color: 'var(--tt-text-1)' }}>{eu.name}</div>
                        <div className="text-[10px]" style={{ color: 'var(--tt-text-3)' }}>{eu.email}</div>
                      </td>
                      <td className="px-3 py-3" style={{ color: 'var(--tt-text-2)' }}>{eu.city}, {eu.country}</td>
                      <td className="px-3 py-3 text-[11px]" style={{ color: 'var(--tt-text-1)' }}>{eu.product}</td>
                      <td className="px-3 py-3 font-mono text-emerald-400 text-[10px]">{eu.registeredQR}</td>
                      <td className="px-3 py-3 text-[11px]" style={{ color: 'var(--tt-text-2)' }}>{eu.dealer}</td>
                      <td className="px-3 py-3 font-mono" style={{ color: 'var(--tt-text-2)' }}>{eu.purchaseDate}</td>
                      <td className="px-3 py-3 font-mono" style={{ color: 'var(--tt-text-2)' }}>{eu.registrationDate}</td>
                      <td className="px-3 py-3">
                        <span className="inline-flex px-1.5 py-0.5 rounded border text-[10px] font-semibold"
                          style={{ color: ws.color, background: ws.bg, borderColor: ws.border }}>{eu.warrantyStatus}</span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}
