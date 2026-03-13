import { useEffect, useState } from "react";
import {
  Zap,
  ShieldCheck,
  TrendingDown,
  ArrowUpRight,
  ArrowDownRight,
  Bot,
  AlertTriangle,
  Target,
} from "lucide-react";

// --- TES Gauge Component ---
// TES Gauge SVG removed in favor of standard KPI Card component

// --- Standard KPI Card ---
interface KPICardProps {
  title: string;
  value: string;
  change: number;
  changeLabel: string;
  icon: React.ReactNode;
  iconBg: string;
  iconColor: string;
  statusDot?: string;
}

function KPICard({ title, value, change, changeLabel, icon, iconBg, iconColor, statusDot }: KPICardProps) {
  const isPositive = change >= 0;

  return (
    <div className="bg-[#1A2332] border border-[#2A3A4E] rounded-xl p-5 hover:border-[#3A4A5E] transition-all duration-300 group hover:shadow-lg hover:shadow-black/20">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-2">
          <div
            className={`w-11 h-11 rounded-lg flex items-center justify-center ${iconBg} transition-transform duration-300 group-hover:scale-110`}
          >
            <div className={iconColor}>{icon}</div>
          </div>
          {statusDot && (
            <span className={`w-2.5 h-2.5 rounded-full ${statusDot} animate-pulse`} />
          )}
        </div>
        <div
          className={`flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full ${
            isPositive
              ? "bg-emerald-500/10 text-emerald-400"
              : "bg-red-500/10 text-red-400"
          }`}
        >
          {isPositive ? (
            <ArrowUpRight className="w-3 h-3" />
          ) : (
            <ArrowDownRight className="w-3 h-3" />
          )}
          {Math.abs(change)}%
        </div>
      </div>
      <p className="text-slate-400 text-xs font-medium uppercase tracking-wider mb-1">
        {title}
      </p>
      <p className="text-2xl font-bold text-white font-mono tracking-tight">
        {value}
      </p>
      <p className="text-[11px] text-slate-500 mt-1">{changeLabel}</p>
    </div>
  );
}

// --- AI Action Card ---
function AIActionCard() {
  return (
    <div className="bg-gradient-to-br from-amber-500/10 to-red-500/10 border-2 border-amber-500/30 rounded-xl p-5 hover:border-amber-500/50 transition-all duration-300 group hover:shadow-lg hover:shadow-amber-900/20 xl:col-span-2">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-xl bg-amber-500/20 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
          <Bot className="w-6 h-6 text-amber-400" />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <p className="text-xs font-bold text-amber-400 uppercase tracking-wider">
              Recommandation IA
            </p>
            <span className="flex items-center gap-1 text-[10px] font-semibold bg-red-500/20 text-red-400 px-2 py-0.5 rounded-full">
              <AlertTriangle className="w-3 h-3" />
              Priorité Haute
            </span>
          </div>
          <p className="text-base font-semibold text-white leading-snug">
            Reporter le nettoyage. Tempête Chergui détectée à J+1.
          </p>
          <p className="text-[11px] text-slate-400 mt-2 leading-relaxed">
            Les vents de Chergui prévus à 78 km/h vendredi réduiront la visibilité à un niveau critique. Le nettoyage programmé sera inefficace. Report recommandé au dimanche.
          </p>
        </div>
      </div>
    </div>
  );
}

import { KPI } from "@/hooks/useDashboardMetrics";

// --- Main Export ---
export default function KPICards({ kpiData }: { kpiData: KPI }) {
  return (
    <div className="space-y-4">
      {/* Top row: 4 metric cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <KPICard
          title="Production Actuelle (MW)"
          value={`${kpiData.totalOutputMW.toLocaleString()} MW`}
          change={kpiData.totalOutputChange}
          changeLabel="vs. moyenne d'hier"
          icon={<Zap className="w-5 h-5" />}
          iconBg="bg-blue-500/15"
          iconColor="text-blue-400"
          statusDot="bg-emerald-400"
        />
        <KPICard
          title="Pertes Évitées (MAD)"
          value={`${(kpiData.costSavingsMAD / 1000000).toFixed(2)}M MAD`}
          change={kpiData.costSavingsChange}
          changeLabel="économies grâce à l'IA ce mois"
          icon={<ShieldCheck className="w-5 h-5" />}
          iconBg="bg-emerald-500/15"
          iconColor="text-emerald-400"
        />
        <KPICard
          title="TES (Énergie Sauvegardée)"
          value={`${kpiData.cleaningEfficiency}%`}
          change={kpiData.cleaningEfficiencyChange > 0 ? kpiData.cleaningEfficiencyChange : 0}
          changeLabel="précision robotique IA"
          icon={<Target className="w-5 h-5" />}
          iconBg="bg-cyan-500/15"
          iconColor="text-cyan-400"
        />
        <KPICard
          title="Perte de Rendement"
          value={`${kpiData.cleaningEfficiencyChange > 0 ? '+' : ''}${kpiData.cleaningEfficiencyChange}%`}
          change={kpiData.cleaningEfficiencyChange}
          changeLabel="impact poussière + Chergui"
          icon={<TrendingDown className="w-5 h-5" />}
          iconBg="bg-red-500/15"
          iconColor="text-red-400"
        />
      </div>
      {/* AI Action Card */}
      <AIActionCard />
    </div>
  );
}