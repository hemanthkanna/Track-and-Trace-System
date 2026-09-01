import { useState } from "react";
import { ThemeProvider, useTheme } from "./ThemeContext";
import Dashboard from "./pages/Dashboard";
import QRManagement from "./pages/QRManagement";
import Movements from "./pages/Movements";
import Genealogy from "./pages/Genealogy";
import Inventory from "./pages/Inventory";
import EndUsers from "./pages/EndUsers";
import Warranty from "./pages/Warranty";
import RiskAnalysis from "./pages/RiskAnalysis";
import Reports from "./pages/Reports";
import Admin from "./pages/Admin";
import Products from "./pages/Products";

import logo from "./assets/sowbaghya.png";

type Page =
  | "dashboard"
  | "products"
  | "qr"
  | "movements"
  | "genealogy"
  | "inventory"
  | "end-users"
  | "warranty"
  | "risk"
  | "reports"
  | "admin";

type NavItem = { id: Page; label: string; icon: React.ReactNode };
type NavGroup = { title: string; items: NavItem[] };

function Icon({
  path,
  className = "w-4 h-4",
}: {
  path: string;
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d={path} />
    </svg>
  );
}

const navGroups: NavGroup[] = [
  {
    title: "Overview",
    items: [
      {
        id: "dashboard",
        label: "Dashboard",
        icon: (
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            className="w-4 h-4"
          >
            <rect x="3" y="3" width="7" height="7" rx="1" />
            <rect x="3" y="14" width="7" height="7" rx="1" />
            <rect x="14" y="3" width="7" height="7" rx="1" />
            <rect x="14" y="14" width="7" height="7" rx="1" />
          </svg>
        ),
      },
    ],
  },
  {
    title: "Products",
    items: [
      {
        id: "products",
        label: "Products & Batches",
        icon: (
          <Icon path="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
        ),
      },
      {
        id: "qr",
        label: "QR Management",
        icon: (
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            className="w-4 h-4"
          >
            <rect x="3" y="3" width="7" height="7" rx="0.5" />
            <rect x="14" y="3" width="7" height="7" rx="0.5" />
            <rect x="3" y="14" width="7" height="7" rx="0.5" />
            <path d="M14 14h2v2h-2zM18 14h2v2h-2zM14 18h2v2h-2zM18 18h2v2h-2z" />
          </svg>
        ),
      },
    ],
  },
  {
    title: "Supply Chain",
    items: [
      {
        id: "movements",
        label: "Movements & Scanning",
        icon: <Icon path="M8 7h12M8 12h12M8 17h12M3 7h.01M3 12h.01M3 17h.01" />,
      },
      {
        id: "inventory",
        label: "Inventory",
        icon: (
          <Icon path="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
        ),
      },
    ],
  },
  {
    title: "Traceability",
    items: [
      {
        id: "genealogy",
        label: "Product Genealogy",
        icon: (
          <Icon path="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
        ),
      },
    ],
  },
  {
    title: "Customers",
    items: [
      {
        id: "end-users",
        label: "End Users",
        icon: (
          <Icon path="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2M9 7a4 4 0 100 8 4 4 0 000-8zM23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" />
        ),
      },
      {
        id: "warranty",
        label: "Warranty",
        icon: <Icon path="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />,
      },
    ],
  },
  {
    title: "Compliance",
    items: [
      {
        id: "risk",
        label: "Risk Analysis",
        icon: (
          <Icon path="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0zM12 9v4M12 17h.01" />
        ),
      },
      {
        id: "reports",
        label: "Reports",
        icon: (
          <Icon path="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8zM14 2v6h6M16 13H8M16 17H8M10 9H8" />
        ),
      },
    ],
  },
  {
    title: "System",
    items: [
      {
        id: "admin",
        label: "Administration",
        icon: (
          <Icon path="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        ),
      },
    ],
  },
];

const pageTitles: Record<Page, string> = {
  dashboard: "Dashboard",
  products: "Products & Production Batches",
  qr: "QR Management",
  movements: "Movements & Scanning",
  genealogy: "Product Genealogy",
  inventory: "Inventory",
  "end-users": "End Users",
  warranty: "Warranty",
  risk: "Risk Analysis",
  reports: "Reports",
  admin: "Administration",
};

const roles = [
  "Super Admin",
  "Org Admin",
  "Factory Operator",
  "Warehouse Operator",
  "Distributor Operator",
  "Dealer Operator",
  "Service Centre",
];

function ThemeToggle() {
  const { isDark, toggle } = useTheme();
  return (
    <button
      onClick={toggle}
      title={isDark ? "Switch to Day mode" : "Switch to Night mode"}
      className="relative flex items-center w-14 h-7 rounded-full border transition-all duration-300 focus:outline-none"
      style={{
        background: isDark ? "#1a2844" : "#dbeafe",
        borderColor: isDark ? "#2d4a78" : "#93c5fd",
      }}
    >
      {/* Track icons */}
      <span className="absolute left-1.5 text-[11px]">🌙</span>
      <span className="absolute right-1.5 text-[11px]">☀️</span>
      {/* Thumb */}
      <span
        className="absolute w-5 h-5 rounded-full shadow-sm transition-all duration-300 flex items-center justify-center text-[10px]"
        style={{
          left: isDark ? "2px" : "calc(100% - 22px)",
          background: isDark ? "#3b82f6" : "#f59e0b",
        }}
      />
    </button>
  );
}

function AppShell() {
  const { isDark } = useTheme();
  const [activePage, setActivePage] = useState<Page>("dashboard");
  const [activeRole, setActiveRole] = useState("Super Admin");
  const [notifications] = useState(3);
  const [collapsed, setCollapsed] = useState(false);

  const pageComponents: Record<Page, React.ReactNode> = {
    dashboard: <Dashboard />,
    products: <Products />,
    qr: <QRManagement />,
    movements: <Movements />,
    genealogy: <Genealogy />,
    inventory: <Inventory />,
    "end-users": <EndUsers />,
    warranty: <Warranty />,
    risk: <RiskAnalysis />,
    reports: <Reports />,
    admin: <Admin />,
  };

  const roleInitials = activeRole
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div
      className={`flex h-full overflow-hidden transition-colors duration-300 ${isDark ? "" : "tt-light"}`}
      style={{ background: "var(--tt-bg)", color: "var(--tt-text-1)" }}
    >
      {/* ── Sidebar ── */}
      <aside
        className={`flex flex-col flex-shrink-0 border-r transition-all duration-200 ${collapsed ? "w-14" : "w-56"}`}
        style={{
          background: `linear-gradient(180deg, var(--tt-sidebar-from) 0%, var(--tt-sidebar-to) 100%)`,
          borderColor: isDark ? "#1e2d45" : "#334155",
        }}
      >
        {/* Logo row */}
        {/* <div
          className="flex items-center gap-3 px-4 py-4 flex-shrink-0"
          style={{
            borderBottom: `1px solid ${isDark ? "#1e2d45" : "#334155"}`,
          }}
        >
          <div
            className="w-7 h-7 rounded-md flex items-center justify-center flex-shrink-0"
            style={{
              background: "linear-gradient(135deg, #00c896 0%, #0077ff 100%)",
            }}
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              strokeWidth="2"
              className="w-4 h-4"
            >
              <rect x="3" y="3" width="7" height="7" rx="1" />
              <rect x="14" y="3" width="7" height="7" rx="1" />
              <rect x="3" y="14" width="7" height="7" rx="1" />
              <path d="M14 14h2v2h-2zM18 14h2v2h-2zM14 18h2v2h-2zM18 18h2v2h-2z" />
            </svg>
          </div>
          {!collapsed && (
            <div>
              <div className="text-[13px] font-bold leading-none text-white">
                TrackTrace
              </div>
              <div
                className="text-[9px] mt-0.5 uppercase tracking-widest"
                style={{ color: "#4a6080" }}
              >
                Platform
              </div>
            </div>
          )}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className={`transition-colors hover:opacity-70 ${collapsed ? "mx-auto" : "ml-auto"}`}
            style={{ color: "#4a6080" }}
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              className="w-3.5 h-3.5"
            >
              <path
                d={collapsed ? "M9 18l6-6-6-6" : "M15 18l-6-6 6-6"}
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div> */}

        {/* Logo row */}
        <div
          className="relative flex flex-col items-center px-4 py-3 flex-shrink-0"
          style={{
            borderBottom: `1px solid ${isDark ? "#1e2d45" : "#334155"}`,
          }}
        >
          {/* Collapse button */}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="absolute right-3 top-3 transition-colors hover:opacity-70"
            style={{ color: "#4a6080" }}
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              className="w-3.5 h-3.5"
            >
              <path
                d={collapsed ? "M9 18l6-6-6-6" : "M15 18l-6-6 6-6"}
                strokeLinecap="round"
              />
            </svg>
          </button>

          {collapsed ? (
            /* Original SVG when collapsed */
            <div
              className="w-7 h-7 rounded-md flex items-center justify-center"
              style={{
                background: "linear-gradient(135deg, #00c896 0%, #0077ff 100%)",
              }}
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="white"
                strokeWidth="2"
                className="w-4 h-4"
              >
                <rect x="3" y="3" width="7" height="7" rx="1" />
                <rect x="14" y="3" width="7" height="7" rx="1" />
                <rect x="3" y="14" width="7" height="7" rx="1" />
                <path d="M14 14h2v2h-2zM18 14h2v2h-2zM14 18h2v2h-2zM18 18h2v2h-2z" />
              </svg>
            </div>
          ) : (
            /* Logo image when expanded */
            <>
              <img
                src={logo}
                alt="TrackTrace"
                className="w-28 h-10 object-contain"
              />
            </>
          )}
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto py-3 space-y-3">
          {navGroups.map((group) => (
            <div key={group.title}>
              {!collapsed && (
                <div className="px-4 mb-1">
                  <span
                    className="text-[9px] font-bold uppercase tracking-widest"
                    style={{ color: "#3d5570" }}
                  >
                    {group.title}
                  </span>
                </div>
              )}
              <div className="space-y-0.5 px-2">
                {group.items.map((item) => {
                  const isActive = activePage === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setActivePage(item.id)}
                      title={collapsed ? item.label : undefined}
                      className={`w-full flex items-center gap-2.5 px-2 py-1.5 rounded-md text-[12px] font-medium transition-all border ${collapsed ? "justify-center" : ""}`}
                      style={{
                        background: isActive
                          ? "rgba(0, 200, 150, 0.12)"
                          : "transparent",
                        borderColor: isActive
                          ? "rgba(0, 200, 150, 0.25)"
                          : "transparent",
                        color: isActive ? "#00c896" : "#5a7a9a",
                      }}
                      onMouseEnter={(e) => {
                        if (!isActive) e.currentTarget.style.color = "#8aaabe";
                      }}
                      onMouseLeave={(e) => {
                        if (!isActive) e.currentTarget.style.color = "#5a7a9a";
                      }}
                    >
                      <span className="flex-shrink-0">{item.icon}</span>
                      {!collapsed && (
                        <span className="truncate">{item.label}</span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>
        {/* Role selector */}
        {!collapsed && (
          <div
            className="px-3 py-3"
            style={{ borderTop: `1px solid ${isDark ? "#1e2d45" : "#334155"}` }}
          >
            <div
              className="text-[9px] uppercase tracking-wider mb-1"
              style={{ color: "#3d5570" }}
            >
              Active Role
            </div>
            <select
              value={activeRole}
              onChange={(e) => setActiveRole(e.target.value)}
              className="w-full rounded px-2 py-1.5 text-[11px] font-medium focus:outline-none"
              style={{
                background: isDark ? "#060b14" : "#0f172a",
                border: `1px solid ${isDark ? "#1e2d45" : "#334155"}`,
                color: "#00c896",
              }}
            >
              {roles.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </div>
        )}
      </aside>

      {/* ── Main area ── */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header
          className="flex items-center gap-4 px-5 py-2.5 flex-shrink-0"
          style={{
            background: "var(--tt-header)",
            borderBottom: "1px solid var(--tt-border)",
          }}
        >
          <div className="flex items-center gap-1.5 text-xs">
            <span style={{ color: "var(--tt-text-3)" }}>TrackTrace</span>
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              className="w-3 h-3"
              style={{ color: "var(--tt-border-2)" }}
            >
              <path d="M9 18l6-6-6-6" strokeLinecap="round" />
            </svg>
            <span className="font-medium" style={{ color: "var(--tt-text-1)" }}>
              {pageTitles[activePage]}
            </span>
          </div>

          <div className="ml-auto flex items-center gap-3">
            {/* System status */}
            <div
              className="flex items-center gap-1.5 text-[10px]"
              style={{ color: "var(--tt-text-3)" }}
            >
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              System Online
            </div>

            {/* Theme toggle */}
            <ThemeToggle />

            {/* Notifications */}
            <button
              className="relative p-1.5 transition-colors hover:opacity-70"
              style={{ color: "var(--tt-text-3)" }}
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                className="w-4 h-4"
              >
                <path
                  d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0"
                  strokeLinecap="round"
                />
              </svg>
              {notifications > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 text-white text-[8px] font-bold rounded-full flex items-center justify-center">
                  {notifications}
                </span>
              )}
            </button>

            {/* User badge */}
            <div
              className="flex items-center gap-2 rounded-md px-2.5 py-1.5"
              style={{
                background: "var(--tt-surface)",
                border: "1px solid var(--tt-border)",
              }}
            >
              <div
                className="w-5 h-5 rounded-full flex items-center justify-center"
                style={{ background: "rgba(0,200,150,0.15)" }}
              >
                <span className="text-[8px] font-bold text-emerald-400">
                  {roleInitials}
                </span>
              </div>
              <span
                className="text-[11px] font-medium"
                style={{ color: "var(--tt-text-1)" }}
              >
                {activeRole}
              </span>
            </div>
          </div>
        </header>

        {/* Stats bar */}
        <div
          className="flex items-center gap-6 px-5 py-2 flex-shrink-0 overflow-x-auto"
          style={{
            background: "var(--tt-statsbar)",
            borderBottom: "1px solid var(--tt-border)",
          }}
        >
          {[
            { label: "QR CODES", value: "1,150", color: "#3b82f6" },
            { label: "IN TRANSIT", value: "3 movements", color: "#f59e0b" },
            { label: "RISK ALERTS", value: "3 open", color: "#ef4444" },
            { label: "ACTIVE WARRANTIES", value: "4", color: "#10b981" },
            { label: "DAILY SCANS", value: "2,847", color: "#06b6d4" },
          ].map((s) => (
            <div
              key={s.label}
              className="flex items-center gap-2 flex-shrink-0"
            >
              <span
                className="text-[9px] font-semibold uppercase tracking-widest"
                style={{ color: "var(--tt-text-3)" }}
              >
                {s.label}
              </span>
              <span
                className="text-[11px] font-mono font-semibold"
                style={{ color: s.color }}
              >
                {s.value}
              </span>
            </div>
          ))}
        </div>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto">
          {pageComponents[activePage]}
        </main>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AppShell />
    </ThemeProvider>
  );
}
