import { useState, useEffect } from "react";
import Sidebar from "@/components/Sidebar";
import { Bell, Search, Shield, Clock, Sun } from "lucide-react";

const HERO_BG =
  "https://mgx-backend-cdn.metadl.com/generate/images/1019406/2026-03-11/1ee75861-33e6-41be-a4e4-9941fc0ac121.png";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (date: Date) =>
    date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    });

  const formatDate = (date: Date) =>
    date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });

  return (
    <div className="min-h-screen bg-[#0A0F1C] text-white">
      <Sidebar collapsed={collapsed} onToggle={() => setCollapsed(!collapsed)} />

      <main
        className={`transition-all duration-300 ${
          collapsed ? "ml-[72px]" : "ml-[260px]"
        }`}
      >
        {/* Top Bar */}
        <header className="sticky top-0 z-40 bg-[#0A0F1C]/80 backdrop-blur-xl border-b border-[#1E2A3A]">
          <div className="flex items-center justify-between px-6 py-3">
            <div className="flex items-center gap-4">
              <div
                className="relative h-10 rounded-lg overflow-hidden flex items-center px-4 min-w-[280px]"
                style={{
                  backgroundImage: `url(${HERO_BG})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-[#0A0F1C]/90 to-[#0A0F1C]/60" />
                <div className="relative flex items-center gap-2">
                  <Sun className="w-4 h-4 text-amber-400" />
                  <span className="text-xs font-semibold text-amber-300">
                    Oriental Morocco — Solar Grid Active
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="text"
                  placeholder="Rechercher sites, alertes..."
                  className="bg-[#111827] border border-[#1E2A3A] rounded-lg pl-9 pr-4 py-2 text-sm text-slate-300 placeholder-slate-600 focus:outline-none focus:border-amber-500/50 w-56 transition-colors"
                />
              </div>

              <div className="flex items-center gap-2 text-slate-400">
                <Clock className="w-4 h-4" />
                <div className="text-right">
                  <p className="text-xs font-mono font-bold text-white">
                    {formatTime(currentTime)}
                  </p>
                  <p className="text-[10px] text-slate-500">
                    {formatDate(currentTime)}
                  </p>
                </div>
              </div>

              <button className="relative w-9 h-9 rounded-lg bg-[#111827] border border-[#1E2A3A] flex items-center justify-center text-slate-400 hover:text-white hover:border-[#2A3A4E] transition-colors">
                <Bell className="w-4 h-4" />
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                  7
                </span>
              </button>

              <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 rounded-lg px-3 py-1.5">
                <Shield className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-xs font-semibold text-emerald-400">
                  AI Active
                </span>
                <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="p-6">{children}</div>
      </main>
    </div>
  );
}