import { useState } from 'react';
import { endUsers, childQRs, products } from '../data/mock';

const warrantyColor: Record<string, string> = {
  Active: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20',
  'Claim Open': 'text-amber-400 bg-amber-400/10 border-amber-400/20',
  Expired: 'text-red-400 bg-red-400/10 border-red-400/20',
  'Not Eligible': 'text-slate-400 bg-slate-400/10 border-slate-400/20',
};

const authResults = [
  { type: 'Authentic – Valid Product', icon: '✓', color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' },
  { type: 'Authentic – Already Registered', icon: 'ℹ', color: 'text-blue-400 bg-blue-500/10 border-blue-500/20' },
  { type: 'Authentic – Warranty Active', icon: '✓', color: 'text-teal-400 bg-teal-500/10 border-teal-500/20' },
  { type: 'Suspicious Movement', icon: '⚠', color: 'text-amber-400 bg-amber-500/10 border-amber-500/20' },
  { type: 'QR Blocked / Invalid', icon: '✕', color: 'text-red-400 bg-red-500/10 border-red-500/20' },
  { type: 'Potential Counterfeit', icon: '⛔', color: 'text-red-500 bg-red-500/15 border-red-500/30' },
];

export default function EndUsers() {
  const [tab, setTab] = useState<'list' | 'auth'>('list');
  const [authQR, setAuthQR] = useState('');
  const [authResult, setAuthResult] = useState<null | typeof authResults[0] & { qr: typeof childQRs[0] | null }>(null);

  const handleAuth = () => {
    if (!authQR.trim()) return;
    const qr = childQRs.find(q => q.id === authQR.trim());
    if (!qr) {
      setAuthResult({ type: 'QR Blocked / Invalid', icon: '✕', color: 'text-red-400 bg-red-500/10 border-red-500/20', qr: null });
      return;
    }
    if (qr.status === 'Blocked') {
      setAuthResult({ ...authResults[4], qr });
    } else if (qr.status === 'Registered') {
      setAuthResult({ ...authResults[1], qr });
    } else {
      setAuthResult({ ...authResults[0], qr });
    }
  };

  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-slate-100">End Users & Registration</h2>
          <p className="text-xs text-slate-500 mt-0.5">Customer product registrations and authentication results</p>
        </div>
        <div className="flex gap-1.5">
          <button onClick={() => setTab('list')} className={`px-3 py-1.5 text-xs font-medium rounded transition-colors ${tab === 'list' ? 'bg-[#1e2d45] text-slate-200' : 'text-slate-500 hover:text-slate-300'}`}>Registrations</button>
          <button onClick={() => setTab('auth')} className={`px-3 py-1.5 text-xs font-medium rounded transition-colors ${tab === 'auth' ? 'bg-[#1e2d45] text-slate-200' : 'text-slate-500 hover:text-slate-300'}`}>Auth Simulator</button>
        </div>
      </div>

      {tab === 'auth' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Auth Input */}
          <div className="bg-[#0f1623] border border-[#1e2d45] rounded-xl p-6">
            <h3 className="text-sm font-semibold text-slate-200 mb-1">Authentication Simulator</h3>
            <p className="text-xs text-slate-500 mb-5">Simulate what a customer sees when they scan a product QR code</p>
            <div className="space-y-3">
              <div>
                <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-1 block">Product QR Code</label>
                <div className="flex gap-2">
                  <input value={authQR} onChange={e => setAuthQR(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleAuth()}
                    placeholder="Scan product QR code..."
                    className="flex-1 bg-[#060b14] border border-[#1e2d45] rounded px-3 py-2 text-xs text-slate-300 font-mono focus:outline-none focus:border-emerald-500/50 placeholder-slate-600"
                  />
                  <button onClick={handleAuth} className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-semibold rounded transition-colors">Verify</button>
                </div>
              </div>
              <div className="flex flex-wrap gap-1">
                <span className="text-[10px] text-slate-600 self-center">Try:</span>
                {['QR-THERM-00001', 'QR-CAM-00003', 'QR-CAM-00002', 'QR-LOCK-00002'].map(q => (
                  <button key={q} onClick={() => setAuthQR(q)} className="font-mono text-[10px] text-blue-400 hover:text-blue-300 px-1.5 py-0.5 bg-blue-500/10 rounded">{q}</button>
                ))}
              </div>
            </div>

            {authResult && (
              <div className={`mt-4 p-4 rounded-lg border ${authResult.color}`}>
                <div className="flex items-center gap-2 text-sm font-semibold mb-2">
                  <span>{authResult.icon}</span>
                  <span>{authResult.type}</span>
                </div>
                {authResult.qr && (() => {
                  const prod = products.find(p => p.id === authResult.qr!.productId);
                  const eu = endUsers.find(e => e.registeredQR === authResult.qr!.id);
                  return (
                    <div className="space-y-1 text-[11px] opacity-80">
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

          {/* Auth Result Types */}
          <div className="bg-[#0f1623] border border-[#1e2d45] rounded-xl p-5">
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Possible Authentication Results</div>
            <div className="space-y-2">
              {authResults.map(r => (
                <div key={r.type} className={`flex items-center gap-3 p-2.5 rounded-lg border ${r.color}`}>
                  <span className="text-base w-5 text-center">{r.icon}</span>
                  <span className="text-xs font-medium">{r.type}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {tab === 'list' && (
        <>
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-[#0f1623] border border-[#1e2d45] rounded-lg p-3">
              <div className="text-xl font-semibold font-mono text-slate-200">{endUsers.length}</div>
              <div className="text-xs text-slate-400 mt-1">Total Registered</div>
            </div>
            <div className="bg-[#0f1623] border border-[#1e2d45] rounded-lg p-3">
              <div className="text-xl font-semibold font-mono text-emerald-400">{endUsers.filter(e => e.warrantyStatus === 'Active').length}</div>
              <div className="text-xs text-slate-400 mt-1">Active Warranty</div>
            </div>
            <div className="bg-[#0f1623] border border-[#1e2d45] rounded-lg p-3">
              <div className="text-xl font-semibold font-mono text-amber-400">{endUsers.filter(e => e.warrantyStatus === 'Claim Open').length}</div>
              <div className="text-xs text-slate-400 mt-1">Open Claims</div>
            </div>
          </div>

          <div className="bg-[#0f1623] border border-[#1e2d45] rounded-lg overflow-hidden">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-[#1e2d45]">
                  {['ID', 'Customer', 'Country', 'Product', 'QR Code', 'Dealer', 'Purchase Date', 'Registered', 'Warranty'].map(h => (
                    <th key={h} className="px-3 py-2.5 text-left text-[10px] font-semibold text-slate-500 uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1e2d45]">
                {endUsers.map(eu => (
                  <tr key={eu.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="px-3 py-3 font-mono text-slate-500 text-[10px]">{eu.id}</td>
                    <td className="px-3 py-3">
                      <div className="text-slate-300 font-medium">{eu.name}</div>
                      <div className="text-slate-500 text-[10px]">{eu.email}</div>
                    </td>
                    <td className="px-3 py-3 text-slate-400">{eu.city}, {eu.country}</td>
                    <td className="px-3 py-3 text-slate-300 text-[11px]">{eu.product}</td>
                    <td className="px-3 py-3 font-mono text-emerald-400 text-[10px]">{eu.registeredQR}</td>
                    <td className="px-3 py-3 text-slate-400 text-[11px]">{eu.dealer}</td>
                    <td className="px-3 py-3 font-mono text-slate-400">{eu.purchaseDate}</td>
                    <td className="px-3 py-3 font-mono text-slate-400">{eu.registrationDate}</td>
                    <td className="px-3 py-3">
                      <span className={`inline-flex px-1.5 py-0.5 rounded border text-[10px] font-medium ${warrantyColor[eu.warrantyStatus] ?? 'text-slate-400 bg-slate-400/10 border-slate-400/20'}`}>{eu.warrantyStatus}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}
