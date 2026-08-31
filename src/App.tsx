import { useState } from 'react';
import Dashboard from './pages/Dashboard';
import QRManagement from './pages/QRManagement';
import Movements from './pages/Movements';
import Genealogy from './pages/Genealogy';
import Inventory from './pages/Inventory';
import EndUsers from './pages/EndUsers';
import Warranty from './pages/Warranty';
import RiskAnalysis from './pages/RiskAnalysis';
import Reports from './pages/Reports';
import Admin from './pages/Admin';

type Page = 'dashboard' | 'qr' | 'movements' | 'genealogy' | 'inventory' | 'end-users' | 'warranty' | 'risk' | 'reports' | 'admin';

type NavItem = { id: Page; label: string; icon: React.ReactNode };
type NavGroup = { title: string; items: NavItem[] };

function Icon({ path, ...rest }: { path: string; className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" {...rest}>
      <path d={path} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

const navGroups: NavGroup[] = [
  {
    title: 'Overview',
    items: [
      { id: 'dashboard', label: 'Dashboard', icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-4 h-4"><rect x="3" y="3" width="7" height="7" rx="0.5"/><rect x="3" y="14" width="7" height="7" rx="0.5"/><rect x="14" y="3" width="7" height="7" rx="0.5"/><rect x="14" y="14" width="7" height="7" rx="0.5"/></svg> },
    ],
  },
  {
    title: 'Supply Chain',
    items: [
      { id: 'qr', label: 'QR Management', icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-4 h-4"><rect x="3" y="3" width="7" height="7" rx="0.5"/><rect x="14" y="3" width="7" height="7" rx="0.5"/><rect x="3" y="14" width="7" height="7" rx="0.5"/><path d="M14 14h2v2h-2zM18 14h2v2h-2zM14 18h2v2h-2zM18 18h2v2h-2z"/></svg> },
      { id: 'movements', label: 'Movements & Scanning', icon: <Icon path="M8 7h12M8 12h12M8 17h12M3 7h.01M3 12h.01M3 17h.01" className="w-4 h-4" /> },
      { id: 'inventory', label: 'Inventory', icon: <Icon path="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" className="w-4 h-4" /> },
    ],
  },
  {
    title: 'Traceability',
    items: [
      { id: 'genealogy', label: 'Product Genealogy', icon: <Icon path="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" className="w-4 h-4" /> },
    ],
  },
  {
    title: 'Customers',
    items: [
      { id: 'end-users', label: 'End Users', icon: <Icon path="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2M9 7a4 4 0 100 8 4 4 0 000-8zM23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" className="w-4 h-4" /> },
      { id: 'warranty', label: 'Warranty', icon: <Icon path="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" className="w-4 h-4" /> },
    ],
  },
  {
    title: 'Compliance',
    items: [
      { id: 'risk', label: 'Risk Analysis', icon: <Icon path="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0zM12 9v4M12 17h.01" className="w-4 h-4" /> },
      { id: 'reports', label: 'Reports', icon: <Icon path="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8zM14 2v6h6M16 13H8M16 17H8M10 9H8" className="w-4 h-4" /> },
    ],
  },
  {
    title: 'System',
    items: [
      { id: 'admin', label: 'Administration', icon: <Icon path="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" className="w-4 h-4" /> },
    ],
  },
];

const pageComponents: Record<Page, React.ReactNode> = {
  dashboard: <Dashboard />,
  qr: <QRManagement />,
  movements: <Movements />,
  genealogy: <Genealogy />,
  inventory: <Inventory />,
  'end-users': <EndUsers />,
  warranty: <Warranty />,
  risk: <RiskAnalysis />,
  reports: <Reports />,
  admin: <Admin />,
};

const pageTitles: Record<Page, string> = {
  dashboard: 'Dashboard',
  qr: 'QR Management',
  movements: 'Movements & Scanning',
  genealogy: 'Product Genealogy',
  inventory: 'Inventory',
  'end-users': 'End Users',
  warranty: 'Warranty',
  risk: 'Risk Analysis',
  reports: 'Reports',
  admin: 'Administration',
};

const roles = ['Super Admin', 'Org Admin', 'Factory Operator', 'Warehouse Operator', 'Distributor Operator', 'Dealer Operator', 'Service Centre'];

export default function App() {
  const [activePage, setActivePage] = useState<Page>('dashboard');
  const [activeRole, setActiveRole] = useState('Super Admin');
  const [notifications] = useState(3);
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="flex h-full bg-[#060b14] text-slate-200 overflow-hidden">
      {/* Sidebar */}
      <aside className={`flex flex-col flex-shrink-0 border-r border-[#1e2d45] transition-all duration-200 ${collapsed ? 'w-14' : 'w-56'}`}
        style={{ background: 'linear-gradient(180deg, #0a1220 0%, #060b14 100%)' }}>
        {/* Logo */}
        <div className="flex items-center gap-3 px-4 py-4 border-b border-[#1e2d45] flex-shrink-0">
          <div className="w-7 h-7 rounded-md flex items-center justify-center flex-shrink-0" style={{ background: 'linear-gradient(135deg, #00c896 0%, #0077ff 100%)' }}>
            <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" className="w-4 h-4">
              <path d="M3 3h7v7H3zM14 3h7v7h-7zM3 14h7v7H3z" strokeLinejoin="round"/>
              <path d="M14 14h2v2h-2zM18 14h2v2h-2zM14 18h2v2h-2zM18 18h2v2h-2z"/>
            </svg>
          </div>
          {!collapsed && (
            <div>
              <div className="text-[13px] font-bold text-slate-100 leading-none">TrackTrace</div>
              <div className="text-[9px] text-slate-500 mt-0.5 uppercase tracking-widest">Platform</div>
            </div>
          )}
          <button onClick={() => setCollapsed(!collapsed)} className={`ml-auto text-slate-600 hover:text-slate-400 transition-colors ${collapsed ? 'mx-auto' : ''}`}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-3.5 h-3.5">
              <path d={collapsed ? "M9 18l6-6-6-6" : "M15 18l-6-6 6-6"}/>
            </svg>
          </button>
        </div>

        {/* Nav Groups */}
        <nav className="flex-1 overflow-y-auto py-3 space-y-4">
          {navGroups.map(group => (
            <div key={group.title}>
              {!collapsed && (
                <div className="px-4 mb-1">
                  <span className="text-[9px] font-bold text-slate-600 uppercase tracking-widest">{group.title}</span>
                </div>
              )}
              <div className="space-y-0.5 px-2">
                {group.items.map(item => {
                  const isActive = activePage === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setActivePage(item.id)}
                      title={collapsed ? item.label : undefined}
                      className={`w-full flex items-center gap-2.5 px-2 py-1.5 rounded-md text-[12px] font-medium transition-all ${
                        isActive
                          ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/20'
                          : 'text-slate-500 hover:text-slate-300 hover:bg-white/[0.04] border border-transparent'
                      } ${collapsed ? 'justify-center' : ''}`}
                    >
                      <span className={`flex-shrink-0 ${isActive ? 'text-emerald-400' : ''}`}>{item.icon}</span>
                      {!collapsed && <span className="truncate">{item.label}</span>}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* Role Indicator */}
        {!collapsed && (
          <div className="px-3 py-3 border-t border-[#1e2d45]">
            <div className="text-[9px] text-slate-600 uppercase tracking-wider mb-1">Active Role</div>
            <select
              value={activeRole}
              onChange={e => setActiveRole(e.target.value)}
              className="w-full bg-[#060b14] border border-[#1e2d45] rounded px-2 py-1.5 text-[11px] text-emerald-400 font-medium focus:outline-none"
            >
              {roles.map(r => <option key={r} value={r}>{r}</option>)}
            </select>
          </div>
        )}
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Header */}
        <header className="flex items-center gap-4 px-5 py-2.5 border-b border-[#1e2d45] flex-shrink-0" style={{ background: '#08101c' }}>
          {/* Breadcrumb */}
          <div className="flex items-center gap-1.5 text-xs">
            <span className="text-slate-600">TrackTrace</span>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-3 h-3 text-slate-700"><path d="M9 18l6-6-6-6"/></svg>
            <span className="text-slate-300 font-medium">{pageTitles[activePage]}</span>
          </div>

          <div className="ml-auto flex items-center gap-3">
            {/* System Status */}
            <div className="flex items-center gap-1.5 text-[10px] text-slate-500">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              <span>System Online</span>
            </div>

            {/* Notifications */}
            <button className="relative p-1.5 text-slate-500 hover:text-slate-300 transition-colors">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-4 h-4">
                <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0"/>
              </svg>
              {notifications > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 text-white text-[8px] font-bold rounded-full flex items-center justify-center">{notifications}</span>
              )}
            </button>

            {/* Current Role Badge */}
            <div className="flex items-center gap-2 bg-[#0f1623] border border-[#1e2d45] rounded-md px-2.5 py-1.5">
              <div className="w-5 h-5 rounded-full bg-emerald-500/20 flex items-center justify-center">
                <span className="text-[8px] font-bold text-emerald-400">SA</span>
              </div>
              <span className="text-[11px] font-medium text-slate-300">{activeRole}</span>
            </div>
          </div>
        </header>

        {/* Stats Bar */}
        <div className="flex items-center gap-6 px-5 py-2 border-b border-[#1e2d45] flex-shrink-0 overflow-x-auto" style={{ background: '#09111f' }}>
          {[
            { label: 'QR CODES', value: '1,150', color: 'text-blue-400' },
            { label: 'IN TRANSIT', value: '3 movements', color: 'text-amber-400' },
            { label: 'RISK ALERTS', value: '3 open', color: 'text-red-400' },
            { label: 'ACTIVE WARRANTIES', value: '4', color: 'text-emerald-400' },
            { label: 'DAILY SCANS', value: '2,847', color: 'text-teal-400' },
          ].map(s => (
            <div key={s.label} className="flex items-center gap-2 flex-shrink-0">
              <span className="text-[9px] font-semibold text-slate-600 uppercase tracking-widest">{s.label}</span>
              <span className={`text-[11px] font-mono font-semibold ${s.color}`}>{s.value}</span>
            </div>
          ))}
        </div>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto">
          {pageComponents[activePage]}
        </main>
      </div>
    </div>
  );
}
