import { useState, useEffect } from "react";
import Sidebar from "@/components/Sidebar";
import { Bell, Search, Shield, Clock, Sun, AlertTriangle, Info } from "lucide-react";
import { useDashboardMetrics } from "@/hooks/useDashboardMetrics";

const HERO_BG =
  "https://mgx-backend-cdn.metadl.com/generate/images/1019406/2026-03-11/1ee75861-33e6-41be-a4e4-9941fc0ac121.png";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [collapsed, setCollapsed] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  
  const { data: metricsData } = useDashboardMetrics();
  const alerts = metricsData?.alerts || [];

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

              <div className="relative">
                <button 
                  onClick={() => setShowNotifications(!showNotifications)}
                  className={`relative w-9 h-9 rounded-lg border flex items-center justify-center transition-colors ${
                    showNotifications 
                      ? "bg-[#1E2A3A] border-[#3B82F6] text-white" 
                      : "bg-[#111827] border-[#1E2A3A] text-slate-400 hover:text-white hover:border-[#2A3A4E]"
                  }`}
                >
                  <Bell className="w-4 h-4" />
                  {alerts.length > 0 && (
                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center animate-pulse">
                      {alerts.length}
                    </span>
                  )}
                </button>

                {/* Notifications Dropdown */}
                {showNotifications && (
                  <div className="absolute right-0 mt-3 w-80 bg-[#111827] border border-[#1E2A3A] rounded-xl shadow-2xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="flex items-center justify-between px-4 py-3 border-b border-[#1E2A3A] bg-[#0A0F1C]">
                      <h3 className="text-sm font-semibold text-white">Alertes IA</h3>
                      <span className="text-[10px] font-medium bg-[#1E2A3A] text-slate-300 px-2 py-0.5 rounded-full">
                        {alerts.length} Nouveaux
                      </span>
                    </div>
                    
                    <div className="max-h-[320px] overflow-y-auto">
                      {alerts.length === 0 ? (
                        <div className="p-6 text-center text-sm text-slate-500">
                          Aucune alerte pour le moment.
                        </div>
                      ) : (
                        <div className="divide-y divide-[#1E2A3A]">
                          {alerts.map((alert) => (
                            <div key={alert.id} className="p-4 hover:bg-[#1A2332] transition-colors cursor-default">
                              <div className="flex gap-3">
                                <div className="mt-0.5">
                                  {alert.type === 'warning' || alert.type === 'critical' ? (
                                    <div className="w-8 h-8 rounded-full bg-red-500/10 flex items-center justify-center border border-red-500/20">
                                      <AlertTriangle className="w-4 h-4 text-red-500" />
                                    </div>
                                  ) : (
                                    <div className="w-8 h-8 rounded-full bg-blue-500/10 flex items-center justify-center border border-blue-500/20">
                                      <Info className="w-4 h-4 text-blue-400" />
                                    </div>
                                  )}
                                </div>
                                <div className="flex-1">
                                  <h4 className="text-sm font-medium text-white mb-1">
                                    {alert.title}
                                  </h4>
                                  <p className="text-xs text-slate-400 leading-relaxed">
                                    {alert.message}
                                  </p>
                                  <p className="text-[10px] text-slate-500 mt-2 font-mono">
                                    {alert.date}
                                  </p>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

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