import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  CalendarDays,
  Bell,
  Shield,
  ChevronLeft,
  ChevronRight,
  LogOut,
} from "lucide-react";

const LOGO_URL =
  "https://mgx-backend-cdn.metadl.com/generate/images/1019406/2026-03-11/079759d0-9eae-4b84-b8d8-662aa2880fb5.png";

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/" },
  { icon: CalendarDays, label: "Maintenance", path: "/maintenance" },
  { icon: Bell, label: "Alertes", path: "/", badge: 7 },
];

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

export default function Sidebar({ collapsed, onToggle }: SidebarProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isActive = (path: string, label: string) => {
    if (label === "Alertes") return false;
    return location.pathname === path;
  };

  const handleLogout = () => {
    localStorage.removeItem("bs_authenticated");
    navigate("/signup");
  };

  return (
    <aside
      className={`fixed top-0 left-0 h-screen bg-[#0D1321] border-r border-[#1E2A3A] flex flex-col z-50 transition-all duration-300 ${
        collapsed ? "w-[72px]" : "w-[260px]"
      } ${mounted ? "opacity-100" : "opacity-0"}`}
    >
      {/* Logo */}
      <div
        className="flex items-center gap-3 px-4 py-5 border-b border-[#1E2A3A] cursor-pointer"
        onClick={() => navigate("/")}
      >
        <div className="w-10 h-10 rounded-lg overflow-hidden flex-shrink-0 bg-gradient-to-br from-amber-500/20 to-amber-600/10 p-0.5">
          <img
            src={LOGO_URL}
            alt="Bouclier Solaire"
            className="w-full h-full object-cover rounded-md"
          />
        </div>
        {!collapsed && (
          <div className="overflow-hidden">
            <h1 className="text-[15px] font-bold text-amber-400 tracking-wide leading-tight">
              Bouclier Solaire
            </h1>
            <p className="text-[10px] text-slate-500 uppercase tracking-widest">
              Oriental • Morocco
            </p>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 px-2 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.path, item.label);
          return (
            <button
              key={item.label}
              onClick={() => navigate(item.path)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group relative ${
                active
                  ? "bg-amber-500/10 text-amber-400"
                  : "text-slate-400 hover:bg-white/5 hover:text-slate-200"
              }`}
            >
              {active && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 bg-amber-400 rounded-r-full" />
              )}
              <Icon className="w-5 h-5 flex-shrink-0" />
              {!collapsed && (
                <span className="text-sm font-medium">{item.label}</span>
              )}
              {item.badge && !collapsed && (
                <span className="ml-auto bg-red-500/20 text-red-400 text-[11px] font-semibold px-2 py-0.5 rounded-full">
                  {item.badge}
                </span>
              )}
              {item.badge && collapsed && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* AI Status */}
      <div className={`px-3 py-3 border-t border-[#1E2A3A] ${collapsed ? "text-center" : ""}`}>
        {!collapsed ? (
          <div className="bg-[#1A2332] rounded-lg p-3">
            <div className="flex items-center gap-2 mb-2">
              <Shield className="w-4 h-4 text-emerald-400" />
              <span className="text-xs font-semibold text-emerald-400">
                AI Protection Active
              </span>
            </div>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              Monitoring 6 sites across Oriental region. Next dust event predicted in 24h.
            </p>
          </div>
        ) : (
          <div className="flex justify-center">
            <div className="w-3 h-3 bg-emerald-400 rounded-full animate-pulse" />
          </div>
        )}
      </div>

      {/* Logout */}
      <div className="px-2 pb-3">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-500 hover:bg-red-500/10 hover:text-red-400 transition-all duration-200"
        >
          <LogOut className="w-5 h-5 flex-shrink-0" />
          {!collapsed && <span className="text-sm font-medium">Déconnexion</span>}
        </button>
      </div>

      {/* Collapse Toggle */}
      <button
        onClick={onToggle}
        className="absolute top-5 -right-3 w-6 h-6 bg-[#1A2332] border border-[#2A3A4E] rounded-full flex items-center justify-center text-slate-400 hover:text-white transition-colors z-50"
      >
        {collapsed ? (
          <ChevronRight className="w-3 h-3" />
        ) : (
          <ChevronLeft className="w-3 h-3" />
        )}
      </button>
    </aside>
  );
}