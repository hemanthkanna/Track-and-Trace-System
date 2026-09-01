import { useState, useRef } from 'react';
import { movements, locations, childQRs, parentQRs } from '../data/mock';
import type { MovementStatus } from '../data/mock';

/* ── helpers ─────────────────────────────────────────────── */
const statusColor: Record<MovementStatus, { text: string; bg: string; border: string; dot: string }> = {
  Planned:         { text: '#94a3b8', bg: 'rgba(148,163,184,0.08)', border: 'rgba(148,163,184,0.2)', dot: '#94a3b8' },
  'Exit Scanned':  { text: '#60a5fa', bg: 'rgba(96,165,250,0.08)',  border: 'rgba(96,165,250,0.2)',  dot: '#60a5fa' },
  'In Transit':    { text: '#fbbf24', bg: 'rgba(251,191,36,0.08)',   border: 'rgba(251,191,36,0.2)',   dot: '#fbbf24' },
  'Entry Scanned': { text: '#2dd4bf', bg: 'rgba(45,212,191,0.08)',   border: 'rgba(45,212,191,0.2)',   dot: '#2dd4bf' },
  Completed:       { text: '#34d399', bg: 'rgba(52,211,153,0.08)',   border: 'rgba(52,211,153,0.2)',   dot: '#34d399' },
  Exception:       { text: '#f87171', bg: 'rgba(248,113,113,0.08)',  border: 'rgba(248,113,113,0.2)',  dot: '#f87171' },
  Cancelled:       { text: '#64748b', bg: 'rgba(100,116,139,0.08)',  border: 'rgba(100,116,139,0.2)',  dot: '#64748b' },
};

const riskColor: Record<string, string> = {
  Low: '#34d399', Medium: '#fbbf24', High: '#f97316', Critical: '#ef4444',
};

type ScanEntry = { qr: string; type: 'matched' | 'extra' | 'invalid'; timestamp: string };

const EXPECTED_QRS = ['QR-THERM-00004', 'QR-THERM-00005', 'PAR-CART-0002'];

function StatusPill({ status }: { status: MovementStatus }) {
  const c = statusColor[status];
  return (
    <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded border text-[10px] font-semibold"
      style={{ color: c.text, background: c.bg, borderColor: c.border }}>
      <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: c.dot }} />
      {status}
    </span>
  );
}

/* ── Scan Modal ──────────────────────────────────────────── */
type ModalMode = 'create' | 'exit' | 'entry' | 'view';

function ScanModal({
  movId,
  onClose,
}: {
  movId: string | '__new__';
  onClose: () => void;
}) {
  const mov = movements.find(m => m.id === movId);
  const isNew = movId === '__new__';
  const [mode, setMode] = useState<ModalMode>(isNew ? 'create' : 'exit');
  const [scanInput, setScanInput] = useState('');
  const [scanned, setScanned] = useState<ScanEntry[]>([]);
  const [note, setNote] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const expected = EXPECTED_QRS;
  const matchedIds = scanned.filter(s => s.type === 'matched').map(s => s.qr);
  const missing = expected.filter(q => !matchedIds.includes(q));
  const extras = scanned.filter(s => s.type === 'extra');
  const invalids = scanned.filter(s => s.type === 'invalid');
  const pct = expected.length ? Math.round((matchedIds.length / expected.length) * 100) : 0;

  const handleScan = () => {
    const q = scanInput.trim();
    if (!q || scanned.find(s => s.qr === q)) return;
    const ts = new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    const isExpected = expected.includes(q);
    const isKnown = childQRs.find(c => c.id === q) || parentQRs.find(p => p.id === q);
    const type: ScanEntry['type'] = !isKnown ? 'invalid' : isExpected ? 'matched' : 'extra';
    setScanned(prev => [{ qr: q, type, timestamp: ts }, ...prev]);
    setScanInput('');
    inputRef.current?.focus();
  };

  const canComplete = mode === 'entry' && missing.length === 0 && invalids.length === 0;

  return (
    <div className="fixed inset-0 bg-black/70 flex items-end sm:items-center justify-center z-50 p-0 sm:p-4"
      onClick={onClose}>
      <div
        className="w-full sm:max-w-3xl rounded-t-2xl sm:rounded-2xl overflow-hidden flex flex-col shadow-2xl"
        style={{ background: 'var(--tt-surface)', border: '1px solid var(--tt-border)', maxHeight: '92vh' }}
        onClick={e => e.stopPropagation()}>

        {/* Modal header */}
        <div className="flex items-start justify-between px-5 py-4 flex-shrink-0"
          style={{ borderBottom: '1px solid var(--tt-border)', background: 'var(--tt-raised)' }}>
          <div className="flex-1 min-w-0">
            {mov ? (
              <>
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-mono text-sm font-semibold text-blue-400">{mov.id}</span>
                  <StatusPill status={mov.status} />
                  <span className="text-[10px] font-semibold" style={{ color: riskColor[mov.risk] }}>Risk: {mov.risk}</span>
                </div>
                <div className="flex items-center gap-2 text-xs" style={{ color: 'var(--tt-text-2)' }}>
                  <span className="font-medium" style={{ color: 'var(--tt-text-1)' }}>{mov.originName}</span>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-3 h-3 flex-shrink-0"><path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round"/></svg>
                  <span className="font-medium" style={{ color: 'var(--tt-text-1)' }}>{mov.destinationName}</span>
                </div>
                <div className="text-[10px] mt-0.5 font-mono" style={{ color: 'var(--tt-text-3)' }}>
                  {mov.carrier} · Ref: {mov.reference} · {mov.items} items · {mov.parentItems} parent units
                </div>
              </>
            ) : (
              <div className="text-sm font-semibold" style={{ color: 'var(--tt-text-1)' }}>Create New Movement</div>
            )}
          </div>
          <button onClick={onClose} className="p-1 hover:opacity-60 transition-opacity ml-3 flex-shrink-0" style={{ color: 'var(--tt-text-3)' }}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5"><path d="M18 6L6 18M6 6l12 12" strokeLinecap="round"/></svg>
          </button>
        </div>

        {/* Mode tabs (only for existing movements) */}
        {!isNew && (
          <div className="flex flex-shrink-0" style={{ borderBottom: '1px solid var(--tt-border)' }}>
            {([
              { id: 'exit', label: '1 · Exit Scan', icon: '↑' },
              { id: 'entry', label: '2 · Entry Scan', icon: '↓' },
              { id: 'view', label: 'Details', icon: '≡' },
            ] as { id: ModalMode; label: string; icon: string }[]).map(t => (
              <button key={t.id} onClick={() => { setMode(t.id); setScanned([]); setScanInput(''); }}
                className="flex-1 flex items-center justify-center gap-1.5 py-2.5 text-xs font-semibold transition-colors border-b-2"
                style={{
                  borderColor: mode === t.id ? '#3b82f6' : 'transparent',
                  color: mode === t.id ? '#60a5fa' : 'var(--tt-text-3)',
                  background: mode === t.id ? 'rgba(59,130,246,0.06)' : 'transparent',
                }}>
                <span>{t.icon}</span>{t.label}
              </button>
            ))}
          </div>
        )}

        {/* ── Content ── */}
        <div className="flex-1 overflow-y-auto">

          {/* CREATE MODE */}
          {mode === 'create' && (
            <div className="p-5 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: 'Origin Location', type: 'select', opts: locations.map(l => l.name) },
                  { label: 'Destination Location', type: 'select', opts: locations.map(l => l.name) },
                  { label: 'Carrier', type: 'text', placeholder: 'e.g. DHL Freight' },
                  { label: 'Reference / AWB', type: 'text', placeholder: 'Carrier reference number', mono: true },
                ].map(f => (
                  <div key={f.label}>
                    <label className="text-[10px] font-semibold uppercase tracking-wider mb-1 block" style={{ color: 'var(--tt-text-3)' }}>{f.label}</label>
                    {f.type === 'select' ? (
                      <select className="w-full rounded px-3 py-2 text-xs focus:outline-none"
                        style={{ background: 'var(--tt-raised)', border: '1px solid var(--tt-border)', color: 'var(--tt-text-1)' }}>
                        <option value="">Select location…</option>
                        {(f.opts ?? []).map(o => <option key={o}>{o}</option>)}
                      </select>
                    ) : (
                      <input type="text" placeholder={f.placeholder}
                        className={`w-full rounded px-3 py-2 text-xs focus:outline-none ${f.mono ? 'font-mono' : ''}`}
                        style={{ background: 'var(--tt-raised)', border: '1px solid var(--tt-border)', color: 'var(--tt-text-1)' }} />
                    )}
                  </div>
                ))}
              </div>
              <div>
                <label className="text-[10px] font-semibold uppercase tracking-wider mb-1 block" style={{ color: 'var(--tt-text-3)' }}>Items to Dispatch</label>
                <div className="rounded-lg p-3 space-y-2" style={{ background: 'var(--tt-raised)', border: '1px solid var(--tt-border)' }}>
                  {EXPECTED_QRS.map(q => (
                    <div key={q} className="flex items-center justify-between py-1">
                      <span className="font-mono text-[11px] text-emerald-400">{q}</span>
                      <span className="text-[10px]" style={{ color: 'var(--tt-text-3)' }}>
                        {parentQRs.find(p => p.id === q) ? `${parentQRs.find(p => p.id === q)!.childCount} child items` : 'Product QR'}
                      </span>
                    </div>
                  ))}
                  <div className="flex items-center gap-2 pt-1" style={{ borderTop: '1px solid var(--tt-border)' }}>
                    <input placeholder="Add QR code…" className="flex-1 bg-transparent text-xs font-mono focus:outline-none"
                      style={{ color: 'var(--tt-text-1)' }} />
                    <button className="text-[11px] text-blue-400 hover:text-blue-300">+ Add</button>
                  </div>
                </div>
              </div>
              <div>
                <label className="text-[10px] font-semibold uppercase tracking-wider mb-1 block" style={{ color: 'var(--tt-text-3)' }}>Notes</label>
                <textarea rows={2} placeholder="Optional dispatch notes…"
                  className="w-full rounded px-3 py-2 text-xs resize-none focus:outline-none"
                  style={{ background: 'var(--tt-raised)', border: '1px solid var(--tt-border)', color: 'var(--tt-text-1)' }} />
              </div>
            </div>
          )}

          {/* EXIT / ENTRY SCAN MODE */}
          {(mode === 'exit' || mode === 'entry') && (
            <div className="p-5">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {/* Left: scan input */}
                <div className="space-y-3">
                  <div className="rounded-xl p-4 space-y-3"
                    style={{ background: 'var(--tt-raised)', border: '1px solid var(--tt-border)' }}>
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-2 h-2 rounded-full animate-pulse" style={{ background: mode === 'exit' ? '#60a5fa' : '#34d399' }} />
                      <span className="text-xs font-semibold" style={{ color: 'var(--tt-text-1)' }}>
                        {mode === 'exit' ? 'Origin Exit Scan' : 'Destination Entry Scan'}
                      </span>
                      <span className="ml-auto text-[10px] font-mono" style={{ color: 'var(--tt-text-3)' }}>
                        {mov?.originName ?? '—'} {mode === 'exit' ? '→' : '←'} {mov?.destinationName ?? '—'}
                      </span>
                    </div>

                    <div className="flex gap-2">
                      <input
                        ref={inputRef}
                        value={scanInput}
                        onChange={e => setScanInput(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && handleScan()}
                        placeholder="Scan QR code or type ID…"
                        className="flex-1 rounded px-3 py-2.5 text-xs font-mono focus:outline-none transition-colors"
                        style={{ background: 'var(--tt-bg)', border: '1px solid var(--tt-border)', color: 'var(--tt-text-1)' }}
                        onFocus={e => (e.currentTarget.style.borderColor = mode === 'exit' ? '#60a5fa' : '#34d399')}
                        onBlur={e => (e.currentTarget.style.borderColor = 'var(--tt-border)')}
                        autoFocus
                      />
                      <button onClick={handleScan}
                        className="px-4 py-2.5 text-xs font-bold rounded transition-colors text-white"
                        style={{ background: mode === 'exit' ? '#3b82f6' : '#10b981' }}>
                        Scan
                      </button>
                    </div>

                    {/* Quick scan helpers */}
                    <div>
                      <div className="text-[10px] mb-1.5" style={{ color: 'var(--tt-text-3)' }}>Expected QR codes:</div>
                      <div className="flex flex-wrap gap-1">
                        {expected.map(q => {
                          const isScanned = matchedIds.includes(q);
                          return (
                            <button key={q} onClick={() => { setScanInput(q); setTimeout(handleScan, 50); }}
                              className="font-mono text-[10px] px-2 py-0.5 rounded transition-colors"
                              style={{
                                background: isScanned ? 'rgba(52,211,153,0.12)' : 'var(--tt-bg)',
                                border: `1px solid ${isScanned ? 'rgba(52,211,153,0.3)' : 'var(--tt-border)'}`,
                                color: isScanned ? '#34d399' : '#60a5fa',
                                textDecoration: isScanned ? 'line-through' : 'none',
                              }}>
                              {q}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  {/* Scan feed */}
                  {scanned.length > 0 && (
                    <div className="rounded-lg overflow-hidden" style={{ border: '1px solid var(--tt-border)' }}>
                      <div className="px-3 py-2 text-[10px] font-semibold uppercase tracking-wider" style={{ background: 'var(--tt-raised)', color: 'var(--tt-text-3)', borderBottom: '1px solid var(--tt-border)' }}>
                        Scan Feed
                      </div>
                      <div className="max-h-40 overflow-y-auto">
                        {scanned.map((s, i) => (
                          <div key={i} className="flex items-center gap-2 px-3 py-1.5"
                            style={{ borderBottom: '1px solid var(--tt-border)', background: i === 0 ? 'var(--tt-hover)' : 'transparent' }}>
                            <div className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                              style={{ background: s.type === 'matched' ? '#34d399' : s.type === 'extra' ? '#fbbf24' : '#f87171' }} />
                            <span className="font-mono text-[11px] flex-1" style={{ color: 'var(--tt-text-1)' }}>{s.qr}</span>
                            <span className="text-[10px]"
                              style={{ color: s.type === 'matched' ? '#34d399' : s.type === 'extra' ? '#fbbf24' : '#f87171' }}>
                              {s.type === 'matched' ? '✓ Matched' : s.type === 'extra' ? '⚠ Extra' : '✕ Invalid'}
                            </span>
                            <span className="font-mono text-[10px]" style={{ color: 'var(--tt-text-3)' }}>{s.timestamp}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Right: summary */}
                <div className="space-y-3">
                  {/* Progress */}
                  <div className="rounded-xl p-4" style={{ background: 'var(--tt-raised)', border: '1px solid var(--tt-border)' }}>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-semibold" style={{ color: 'var(--tt-text-1)' }}>Scan Progress</span>
                      <span className="font-mono text-lg font-bold text-emerald-400">{pct}%</span>
                    </div>
                    <div className="rounded-full h-2 mb-3" style={{ background: 'var(--tt-bg)' }}>
                      <div className="h-2 rounded-full transition-all duration-300"
                        style={{ width: `${pct}%`, background: pct === 100 ? '#10b981' : '#3b82f6' }} />
                    </div>
                    <div className="grid grid-cols-3 gap-2 text-center">
                      {[
                        { label: 'Expected', value: expected.length, color: '#94a3b8' },
                        { label: 'Scanned', value: matchedIds.length, color: '#34d399' },
                        { label: 'Missing', value: missing.length, color: missing.length > 0 ? '#f87171' : '#34d399' },
                      ].map(s => (
                        <div key={s.label} className="rounded-lg py-2" style={{ background: 'var(--tt-bg)' }}>
                          <div className="font-mono text-lg font-bold" style={{ color: s.color }}>{s.value}</div>
                          <div className="text-[10px]" style={{ color: 'var(--tt-text-3)' }}>{s.label}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Missing items */}
                  {missing.length > 0 && (
                    <div className="rounded-lg p-3" style={{ background: 'rgba(248,113,113,0.06)', border: '1px solid rgba(248,113,113,0.2)' }}>
                      <div className="flex items-center gap-1.5 text-red-400 text-xs font-semibold mb-2">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3.5 h-3.5"><path d="M12 9v4M12 17h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" strokeLinecap="round"/></svg>
                        {missing.length} Missing Item{missing.length > 1 ? 's' : ''}
                      </div>
                      {missing.map(q => (
                        <div key={q} className="font-mono text-[11px] text-red-400 opacity-80">{q}</div>
                      ))}
                    </div>
                  )}

                  {/* Extra items */}
                  {extras.length > 0 && (
                    <div className="rounded-lg p-3" style={{ background: 'rgba(251,191,36,0.06)', border: '1px solid rgba(251,191,36,0.2)' }}>
                      <div className="flex items-center gap-1.5 text-amber-400 text-xs font-semibold mb-2">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3.5 h-3.5"><circle cx="12" cy="12" r="10"/><path d="M12 8v4M12 16h.01" strokeLinecap="round"/></svg>
                        {extras.length} Unexpected Item{extras.length > 1 ? 's' : ''}
                      </div>
                      {extras.map(s => (
                        <div key={s.qr} className="font-mono text-[11px] text-amber-400 opacity-80">{s.qr}</div>
                      ))}
                    </div>
                  )}

                  {/* Notes */}
                  <div>
                    <label className="text-[10px] font-semibold uppercase tracking-wider mb-1 block" style={{ color: 'var(--tt-text-3)' }}>Scan Notes</label>
                    <textarea rows={2} value={note} onChange={e => setNote(e.target.value)}
                      placeholder="Optional notes for this scan event…"
                      className="w-full rounded px-3 py-2 text-xs resize-none focus:outline-none"
                      style={{ background: 'var(--tt-raised)', border: '1px solid var(--tt-border)', color: 'var(--tt-text-1)' }} />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* DETAILS / VIEW MODE */}
          {mode === 'view' && mov && (
            <div className="p-5 space-y-4">
              {/* Step timeline */}
              <div>
                <div className="text-[10px] font-semibold uppercase tracking-wider mb-3" style={{ color: 'var(--tt-text-3)' }}>Movement Timeline</div>
                <div className="flex items-start gap-0">
                  {[
                    { label: 'Created', done: true, time: mov.created, color: '#94a3b8' },
                    { label: 'Exit Scan', done: !!mov.exitScan, time: mov.exitScan, color: '#60a5fa' },
                    { label: 'In Transit', done: !!mov.exitScan, time: null, color: '#fbbf24' },
                    { label: 'Entry Scan', done: !!mov.entryScan, time: mov.entryScan, color: '#2dd4bf' },
                    { label: 'Completed', done: mov.status === 'Completed', time: mov.status === 'Completed' ? mov.entryScan : null, color: '#34d399' },
                  ].map((s, i, arr) => (
                    <div key={s.label} className="flex-1 flex flex-col items-center">
                      <div className="flex items-center w-full">
                        <div className="w-6 h-6 rounded-full flex items-center justify-center border-2 flex-shrink-0 z-10"
                          style={{ background: s.done ? s.color : 'var(--tt-bg)', borderColor: s.done ? s.color : 'var(--tt-border)' }}>
                          {s.done && <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" className="w-3 h-3"><polyline points="20 6 9 17 4 12"/></svg>}
                        </div>
                        {i < arr.length - 1 && (
                          <div className="flex-1 h-px" style={{ background: arr[i + 1].done ? s.color : 'var(--tt-border)' }} />
                        )}
                      </div>
                      <div className="mt-1.5 text-center px-0.5">
                        <div className="text-[9px] font-medium" style={{ color: s.done ? 'var(--tt-text-2)' : 'var(--tt-text-3)' }}>{s.label}</div>
                        {s.time && <div className="text-[9px] font-mono" style={{ color: 'var(--tt-text-3)' }}>{s.time}</div>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Details grid */}
              <div className="grid grid-cols-2 gap-3 text-xs">
                {[
                  ['Movement ID', mov.id],
                  ['Type', mov.type],
                  ['Carrier', mov.carrier],
                  ['Reference', mov.reference],
                  ['Items', String(mov.items)],
                  ['Parent Units', String(mov.parentItems)],
                  ['Exit Scan', mov.exitScan ?? '—'],
                  ['Entry Scan', mov.entryScan ?? '—'],
                ].map(([label, val]) => (
                  <div key={label} className="rounded-lg p-3" style={{ background: 'var(--tt-raised)', border: '1px solid var(--tt-border)' }}>
                    <div className="text-[10px] uppercase tracking-wider mb-0.5" style={{ color: 'var(--tt-text-3)' }}>{label}</div>
                    <div className="font-mono font-medium" style={{ color: 'var(--tt-text-1)' }}>{val}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer actions */}
        <div className="flex items-center gap-2 px-5 py-3 flex-shrink-0"
          style={{ borderTop: '1px solid var(--tt-border)', background: 'var(--tt-raised)' }}>
          <button onClick={onClose}
            className="px-4 py-2 text-xs font-semibold rounded transition-colors"
            style={{ border: '1px solid var(--tt-border)', color: 'var(--tt-text-2)' }}>
            Close
          </button>

          {mode === 'create' && (
            <button onClick={onClose}
              className="px-4 py-2 text-xs font-bold text-white rounded transition-colors bg-blue-500 hover:bg-blue-400 ml-auto">
              Create Movement
            </button>
          )}

          {mode === 'exit' && (
            <>
              {scanned.length > 0 && invalids.length === 0 && (
                <button className="px-4 py-2 text-xs font-bold text-white rounded transition-colors ml-auto"
                  style={{ background: '#3b82f6' }}
                  onClick={onClose}>
                  Confirm Exit Scan ({matchedIds.length}/{expected.length})
                </button>
              )}
              {invalids.length > 0 && (
                <button className="px-4 py-2 text-xs font-bold text-white rounded bg-red-500 hover:bg-red-400 transition-colors ml-auto"
                  onClick={onClose}>
                  Flag Exception & Proceed
                </button>
              )}
            </>
          )}

          {mode === 'entry' && (
            <>
              {canComplete ? (
                <button className="px-4 py-2 text-xs font-bold text-black rounded bg-emerald-500 hover:bg-emerald-400 transition-colors ml-auto"
                  onClick={onClose}>
                  ✓ Complete — All {expected.length} Items Received
                </button>
              ) : scanned.length > 0 ? (
                <div className="ml-auto flex items-center gap-2">
                  {missing.length > 0 && (
                    <button className="px-4 py-2 text-xs font-bold text-white rounded bg-amber-500 hover:bg-amber-400 transition-colors"
                      onClick={onClose}>
                      Raise Exception ({missing.length} missing)
                    </button>
                  )}
                  <button className="px-4 py-2 text-xs font-bold text-white rounded bg-blue-500 hover:bg-blue-400 transition-colors"
                    onClick={onClose}>
                    Partial Confirm ({matchedIds.length}/{expected.length})
                  </button>
                </div>
              ) : null}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

/* ── Main Movements page ─────────────────────────────────── */
export default function Movements() {
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [modalMovId, setModalMovId] = useState<string | null>(null);

  const filtered = movements.filter(m => filterStatus === 'all' || m.status === filterStatus);

  const counts = {
    total: movements.length,
    transit: movements.filter(m => m.status === 'In Transit' || m.status === 'Exit Scanned').length,
    exception: movements.filter(m => m.status === 'Exception').length,
    completed: movements.filter(m => m.status === 'Completed').length,
  };

  return (
    <div className="p-6 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold" style={{ color: 'var(--tt-text-1)' }}>Movements & Scanning</h2>
          <p className="text-xs mt-0.5" style={{ color: 'var(--tt-text-3)' }}>Entry/exit scan workflows for every supply chain movement</p>
        </div>
        <button onClick={() => setModalMovId('__new__')}
          className="flex items-center gap-2 px-3 py-1.5 text-white text-xs font-semibold rounded transition-colors"
          style={{ background: '#3b82f6' }}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3.5 h-3.5"><path d="M12 5v14M5 12h14"/></svg>
          New Movement
        </button>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-4 gap-3">
        {[
          { label: 'Total Movements', value: counts.total, color: '#94a3b8' },
          { label: 'In Transit / Exit Scanned', value: counts.transit, color: '#fbbf24' },
          { label: 'Exceptions', value: counts.exception, color: '#f87171' },
          { label: 'Completed', value: counts.completed, color: '#34d399' },
        ].map(k => (
          <div key={k.label} className="rounded-lg p-3 border"
            style={{ background: 'var(--tt-surface)', borderColor: 'var(--tt-border)' }}>
            <div className="text-xl font-semibold font-mono" style={{ color: k.color }}>{k.value}</div>
            <div className="text-xs mt-1 text-slate-400">{k.label}</div>
          </div>
        ))}
      </div>

      {/* Filter chips */}
      <div className="flex gap-1.5 flex-wrap">
        {['all', 'Planned', 'Exit Scanned', 'In Transit', 'Entry Scanned', 'Completed', 'Exception'].map(f => (
          <button key={f} onClick={() => setFilterStatus(f)}
            className="px-3 py-1 text-[11px] font-medium rounded border transition-colors"
            style={{
              background: filterStatus === f ? 'rgba(59,130,246,0.12)' : 'transparent',
              borderColor: filterStatus === f ? 'rgba(59,130,246,0.35)' : 'var(--tt-border)',
              color: filterStatus === f ? '#60a5fa' : 'var(--tt-text-3)',
            }}>
            {f === 'all' ? 'All' : f}
          </button>
        ))}
      </div>

      {/* Movement rows */}
      <div className="rounded-lg overflow-hidden" style={{ border: '1px solid var(--tt-border)' }}>
        {/* Table header */}
        <div className="grid text-[10px] font-semibold uppercase tracking-wider px-4 py-2.5"
          style={{ background: 'var(--tt-raised)', borderBottom: '1px solid var(--tt-border)', color: 'var(--tt-text-3)',
            gridTemplateColumns: '1fr 2fr 2fr 1fr 80px 80px 80px' }}>
          <span>ID</span><span>Origin</span><span>Destination</span><span>Carrier</span>
          <span>Items</span><span>Risk</span><span>Status</span>
        </div>

        {filtered.map((m, i) => (
          <div key={m.id}
            onClick={() => setModalMovId(m.id)}
            className="grid items-center px-4 py-3 cursor-pointer transition-colors"
            style={{
              gridTemplateColumns: '1fr 2fr 2fr 1fr 80px 80px 80px',
              borderBottom: i < filtered.length - 1 ? '1px solid var(--tt-border)' : 'none',
              background: 'var(--tt-surface)',
            }}
            onMouseEnter={e => (e.currentTarget.style.background = 'var(--tt-hover)')}
            onMouseLeave={e => (e.currentTarget.style.background = 'var(--tt-surface)')}>

            <div>
              <div className="font-mono text-[11px] text-blue-400">{m.id}</div>
              <div className="text-[10px] font-mono mt-0.5" style={{ color: 'var(--tt-text-3)' }}>{m.created}</div>
            </div>
            <div className="min-w-0 pr-3">
              <div className="text-xs truncate font-medium" style={{ color: 'var(--tt-text-1)' }}>{m.originName}</div>
              {m.exitScan && <div className="font-mono text-[10px]" style={{ color: 'var(--tt-text-3)' }}>Exit: {m.exitScan}</div>}
            </div>
            <div className="min-w-0 pr-3">
              <div className="text-xs truncate font-medium" style={{ color: 'var(--tt-text-1)' }}>{m.destinationName}</div>
              {m.entryScan && <div className="font-mono text-[10px]" style={{ color: 'var(--tt-text-3)' }}>Entry: {m.entryScan}</div>}
            </div>
            <div className="text-xs truncate" style={{ color: 'var(--tt-text-2)' }}>{m.carrier}</div>
            <div className="font-mono text-xs" style={{ color: 'var(--tt-text-1)' }}>{m.items}</div>
            <div className="text-xs font-semibold" style={{ color: riskColor[m.risk] }}>{m.risk}</div>
            <div><StatusPill status={m.status} /></div>
          </div>
        ))}
      </div>

      {/* ── Scan actions quick-bar ── */}
      <div className="flex gap-3">
        {movements.filter(m => m.status === 'Planned' || m.status === 'Exit Scanned' || m.status === 'In Transit').map(m => (
          <button key={m.id} onClick={() => setModalMovId(m.id)}
            className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold transition-all"
            style={{ background: 'var(--tt-surface)', border: '1px solid var(--tt-border)', color: 'var(--tt-text-1)' }}
            onMouseEnter={e => (e.currentTarget.style.borderColor = m.status === 'Planned' ? '#60a5fa' : '#34d399')}
            onMouseLeave={e => (e.currentTarget.style.borderColor = 'var(--tt-border)')}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-3.5 h-3.5"
              style={{ color: m.status === 'Planned' ? '#60a5fa' : '#34d399' }}>
              <path d="M3 3h7v7H3zM14 3h7v7h-7zM3 14h7v7H3z" strokeLinejoin="round"/>
              <path d="M14 14h2v2h-2zM18 14h2v2h-2zM14 18h2v2h-2zM18 18h2v2h-2z"/>
            </svg>
            <span style={{ color: m.status === 'Planned' ? '#60a5fa' : m.status === 'In Transit' ? '#34d399' : '#fbbf24' }}>
              {m.status === 'Planned' ? 'Start Exit Scan' : m.status === 'In Transit' ? 'Confirm Entry' : 'Continue Exit'}
            </span>
            <span className="font-mono text-[10px]" style={{ color: 'var(--tt-text-3)' }}>{m.id}</span>
          </button>
        ))}
      </div>

      {/* Modal */}
      {modalMovId && (
        <ScanModal movId={modalMovId} onClose={() => setModalMovId(null)} />
      )}
    </div>
  );
}
