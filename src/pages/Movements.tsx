import { useState } from 'react';
import { movements, locations } from '../data/mock';
import type { MovementStatus } from '../data/mock';

const statusColor: Record<MovementStatus, string> = {
  Planned: 'text-slate-400 bg-slate-400/10 border-slate-400/20',
  'Exit Scanned': 'text-blue-400 bg-blue-400/10 border-blue-400/20',
  'In Transit': 'text-amber-400 bg-amber-400/10 border-amber-400/20',
  'Entry Scanned': 'text-teal-400 bg-teal-400/10 border-teal-400/20',
  Completed: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20',
  Exception: 'text-red-400 bg-red-400/10 border-red-400/20',
  Cancelled: 'text-slate-500 bg-slate-500/10 border-slate-500/20',
};

const riskColor: Record<string, string> = {
  Low: 'text-emerald-400',
  Medium: 'text-amber-400',
  High: 'text-red-400',
  Critical: 'text-red-500',
};

function ScanStepTimeline({ mov }: { mov: typeof movements[0] }) {
  const steps = [
    { label: 'Movement Created', done: true, time: mov.created, event: 'Planned' },
    { label: 'Origin Exit Scan', done: !!mov.exitScan, time: mov.exitScan, event: 'Exit Scanned' },
    { label: 'In Transit', done: !!mov.exitScan, time: mov.exitScan ? 'Shipment en route' : null, event: 'In Transit' },
    { label: 'Destination Entry Scan', done: !!mov.entryScan, time: mov.entryScan, event: 'Entry Scanned' },
    { label: 'Completed', done: mov.status === 'Completed', time: mov.status === 'Completed' ? mov.entryScan : null, event: 'Completed' },
  ];

  return (
    <div className="mt-4 flex items-start gap-0">
      {steps.map((s, i) => (
        <div key={s.label} className="flex-1 flex flex-col items-center">
          <div className="flex items-center w-full">
            <div className={`w-6 h-6 rounded-full flex items-center justify-center border-2 flex-shrink-0 z-10 ${
              s.done ? 'bg-emerald-500 border-emerald-500' : 'bg-[#0f1623] border-[#1e2d45]'
            } ${i === 0 ? 'ml-0' : ''}`}>
              {s.done && <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" className="w-3 h-3"><polyline points="20 6 9 17 4 12"/></svg>}
            </div>
            {i < steps.length - 1 && (
              <div className={`flex-1 h-px ${steps[i+1].done ? 'bg-emerald-500/50' : 'bg-[#1e2d45]'}`} />
            )}
          </div>
          <div className="mt-1.5 text-center px-1">
            <div className={`text-[9px] font-medium ${s.done ? 'text-slate-300' : 'text-slate-600'}`}>{s.label}</div>
            {s.time && <div className="text-[9px] font-mono text-slate-500 mt-0.5">{s.time}</div>}
          </div>
        </div>
      ))}
    </div>
  );
}

export default function Movements() {
  const [selected, setSelected] = useState<string | null>(null);
  const [scanInput, setScanInput] = useState('');
  const [scanResult, setScanResult] = useState<null | 'success' | 'error'>(null);
  const [tab, setTab] = useState<'list' | 'scan'>('list');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const selectedMov = movements.find(m => m.id === selected);
  const filtered = movements.filter(m => filterStatus === 'all' || m.status === filterStatus);

  const handleScan = () => {
    if (scanInput.trim()) {
      setScanResult(scanInput.includes('QR-') || scanInput.includes('PAR-') ? 'success' : 'error');
      setTimeout(() => setScanResult(null), 3000);
    }
  };

  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-slate-100">Movements & Scanning</h2>
          <p className="text-xs text-slate-500 mt-0.5">Track entry/exit scan events and supply chain movements</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setTab('list')} className={`px-3 py-1.5 text-xs font-medium rounded transition-colors ${tab === 'list' ? 'bg-[#1e2d45] text-slate-200' : 'text-slate-500 hover:text-slate-300'}`}>Movement List</button>
          <button onClick={() => setTab('scan')} className={`px-3 py-1.5 text-xs font-medium rounded transition-colors ${tab === 'scan' ? 'bg-[#1e2d45] text-slate-200' : 'text-slate-500 hover:text-slate-300'}`}>Scan Simulator</button>
          <button className="flex items-center gap-2 px-3 py-1.5 bg-blue-500 hover:bg-blue-400 text-white text-xs font-semibold rounded transition-colors">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3.5 h-3.5"><path d="M12 5v14M5 12h14"/></svg>
            New Movement
          </button>
        </div>
      </div>

      {tab === 'scan' && (
        <div className="bg-[#0f1623] border border-[#1e2d45] rounded-xl p-6 max-w-lg">
          <h3 className="text-sm font-semibold text-slate-200 mb-1">Scan Simulator</h3>
          <p className="text-xs text-slate-500 mb-5">Enter or scan a QR code to simulate an entry or exit scan event</p>

          <div className="space-y-3">
            <div>
              <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-1 block">Movement Reference</label>
              <select className="w-full bg-[#060b14] border border-[#1e2d45] rounded px-3 py-2 text-xs text-slate-300 focus:outline-none focus:border-blue-500/50">
                {movements.map(m => <option key={m.id}>{m.id} – {m.type}</option>)}
              </select>
            </div>
            <div>
              <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-1 block">Scan Type</label>
              <div className="flex gap-2">
                <button className="flex-1 py-1.5 text-xs font-medium bg-blue-500/20 border border-blue-500/40 text-blue-400 rounded">Exit Scan</button>
                <button className="flex-1 py-1.5 text-xs font-medium bg-[#060b14] border border-[#1e2d45] text-slate-500 rounded">Entry Scan</button>
              </div>
            </div>
            <div>
              <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-1 block">QR Code</label>
              <div className="flex gap-2">
                <input
                  value={scanInput}
                  onChange={e => setScanInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleScan()}
                  placeholder="Scan or type QR code..."
                  className="flex-1 bg-[#060b14] border border-[#1e2d45] rounded px-3 py-2 text-xs text-slate-300 font-mono focus:outline-none focus:border-blue-500/50 placeholder-slate-600"
                />
                <button onClick={handleScan} className="px-4 py-2 bg-blue-500 hover:bg-blue-400 text-white text-xs font-semibold rounded transition-colors">Scan</button>
              </div>
            </div>

            {scanResult && (
              <div className={`rounded-lg p-3 border ${scanResult === 'success' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-red-500/10 border-red-500/20 text-red-400'}`}>
                {scanResult === 'success' ? (
                  <div>
                    <div className="flex items-center gap-2 text-sm font-semibold mb-1">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4"><polyline points="20 6 9 17 4 12"/></svg>
                      QR Validated — Exit Scan Recorded
                    </div>
                    <div className="text-[11px] opacity-80">QR code <span className="font-mono">{scanInput}</span> verified. Status updated to Exit Scanned. Movement now In Transit.</div>
                  </div>
                ) : (
                  <div>
                    <div className="flex items-center gap-2 text-sm font-semibold mb-1">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                      QR Not Found
                    </div>
                    <div className="text-[11px] opacity-80">Code not recognized. Verify QR and try again.</div>
                  </div>
                )}
              </div>
            )}

            <div className="bg-[#060b14] rounded-lg p-3 border border-[#1e2d45]">
              <div className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-2">Quick Scan Codes</div>
              <div className="flex flex-wrap gap-1">
                {['QR-THERM-00004', 'QR-THERM-00005', 'PAR-CART-0002', 'PAR-PALL-0001'].map(code => (
                  <button key={code} onClick={() => setScanInput(code)}
                    className="font-mono text-[10px] px-2 py-0.5 bg-[#1e2d45] text-emerald-400 rounded hover:bg-[#2d4a78] transition-colors">
                    {code}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {tab === 'list' && (
        <>
          {/* Filter Bar */}
          <div className="flex gap-1.5">
            {['all', 'Planned', 'Exit Scanned', 'In Transit', 'Completed', 'Exception'].map(f => (
              <button key={f} onClick={() => setFilterStatus(f)}
                className={`px-3 py-1 text-[11px] font-medium rounded transition-colors ${filterStatus === f ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' : 'text-slate-500 hover:text-slate-300 border border-transparent hover:border-[#1e2d45]'}`}>
                {f === 'all' ? 'All' : f}
              </button>
            ))}
          </div>

          <div className="grid gap-3">
            {filtered.map(m => (
              <div key={m.id}
                onClick={() => setSelected(selected === m.id ? null : m.id)}
                className={`bg-[#0f1623] border rounded-lg cursor-pointer transition-all ${selected === m.id ? 'border-blue-500/40' : 'border-[#1e2d45] hover:border-[#2d4a78]'}`}>
                <div className="p-4 flex items-center gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-1">
                      <span className="font-mono text-[11px] text-blue-400">{m.id}</span>
                      <span className={`inline-flex items-center px-1.5 py-0.5 rounded border text-[10px] font-medium ${statusColor[m.status]}`}>{m.status}</span>
                      <span className={`text-[10px] font-medium ${riskColor[m.risk]}`}>Risk: {m.risk}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-slate-400">
                      <span className="text-slate-300">{m.originName}</span>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-3 h-3 text-slate-600 flex-shrink-0"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                      <span className="text-slate-300">{m.destinationName}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-6 text-xs text-right flex-shrink-0">
                    <div>
                      <div className="text-slate-500 text-[10px]">Items</div>
                      <div className="font-mono text-slate-300">{m.items}</div>
                    </div>
                    <div>
                      <div className="text-slate-500 text-[10px]">Carrier</div>
                      <div className="text-slate-400 text-[11px]">{m.carrier}</div>
                    </div>
                    <div>
                      <div className="text-slate-500 text-[10px]">Created</div>
                      <div className="font-mono text-slate-400">{m.created}</div>
                    </div>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={`w-4 h-4 text-slate-600 transition-transform ${selected === m.id ? 'rotate-180' : ''}`}><path d="M6 9l6 6 6-6"/></svg>
                  </div>
                </div>

                {selected === m.id && (
                  <div className="border-t border-[#1e2d45] px-4 pb-4 pt-4">
                    <div className="grid grid-cols-3 gap-4 mb-4 text-xs">
                      <div>
                        <div className="text-[10px] text-slate-500 uppercase tracking-wider mb-0.5">Reference</div>
                        <div className="font-mono text-slate-300">{m.reference}</div>
                      </div>
                      <div>
                        <div className="text-[10px] text-slate-500 uppercase tracking-wider mb-0.5">Type</div>
                        <div className="text-slate-300">{m.type}</div>
                      </div>
                      <div>
                        <div className="text-[10px] text-slate-500 uppercase tracking-wider mb-0.5">Parent QR Units</div>
                        <div className="font-mono text-slate-300">{m.parentItems}</div>
                      </div>
                      <div>
                        <div className="text-[10px] text-slate-500 uppercase tracking-wider mb-0.5">Exit Scan</div>
                        <div className="font-mono text-slate-300">{m.exitScan ?? '—'}</div>
                      </div>
                      <div>
                        <div className="text-[10px] text-slate-500 uppercase tracking-wider mb-0.5">Entry Scan</div>
                        <div className="font-mono text-slate-300">{m.entryScan ?? '—'}</div>
                      </div>
                    </div>
                    <ScanStepTimeline mov={m} />
                  </div>
                )}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
