import DashboardLayout from "@/components/DashboardLayout";
import {
  CalendarDays,
  Droplets,
  Wind,
  CloudRain,
  CheckCircle2,
  Clock,
  AlertTriangle,
  TrendingUp,
  Sparkles,
} from "lucide-react";

interface DaySchedule {
  date: string;
  dayLabel: string;
  roiScore: number; // 0-100
  status: "vert" | "orange" | "rouge";
  dustForecast: number; // 0-100
  precipMm: number;
  windKmh: number;
  recommendation: string;
  sites: string[];
}

const weekSchedule: DaySchedule[] = [
  {
    date: "2026-03-12",
    dayLabel: "Jeudi",
    roiScore: 28,
    status: "rouge",
    dustForecast: 88,
    precipMm: 0,
    windKmh: 62,
    recommendation: "Tempête Chergui imminente. Nettoyage interdit.",
    sites: [],
  },
  {
    date: "2026-03-13",
    dayLabel: "Vendredi",
    roiScore: 12,
    status: "rouge",
    dustForecast: 95,
    precipMm: 0,
    windKmh: 78,
    recommendation: "Pic de tempête. Aucune intervention recommandée.",
    sites: [],
  },
  {
    date: "2026-03-14",
    dayLabel: "Samedi",
    roiScore: 45,
    status: "orange",
    dustForecast: 70,
    precipMm: 2,
    windKmh: 55,
    recommendation: "Vents en baisse. Attendre confirmation.",
    sites: ["Jerada"],
  },
  {
    date: "2026-03-15",
    dayLabel: "Dimanche",
    roiScore: 82,
    status: "vert",
    dustForecast: 42,
    precipMm: 0,
    windKmh: 35,
    recommendation: "Conditions favorables. Nettoyage prioritaire.",
    sites: ["Bouarfa", "Figuig", "Tendrara"],
  },
  {
    date: "2026-03-16",
    dayLabel: "Lundi",
    roiScore: 91,
    status: "vert",
    dustForecast: 18,
    precipMm: 0,
    windKmh: 20,
    recommendation: "Conditions optimales. Nettoyage de masse recommandé.",
    sites: ["Ain Beni Mathar", "Oujda", "Bouarfa", "Figuig"],
  },
  {
    date: "2026-03-17",
    dayLabel: "Mardi",
    roiScore: 88,
    status: "vert",
    dustForecast: 8,
    precipMm: 0,
    windKmh: 12,
    recommendation: "Fenêtre idéale. Compléter les sites restants.",
    sites: ["Jerada", "Tendrara"],
  },
  {
    date: "2026-03-18",
    dayLabel: "Mercredi",
    roiScore: 55,
    status: "orange",
    dustForecast: 35,
    precipMm: 8,
    windKmh: 28,
    recommendation: "Pluie prévue l'après-midi. Nettoyage matinal possible.",
    sites: ["Oujda"],
  },
];

const statusConfig = {
  vert: {
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/30",
    text: "text-emerald-400",
    label: "Optimal",
    icon: CheckCircle2,
    barColor: "bg-emerald-500",
  },
  orange: {
    bg: "bg-amber-500/10",
    border: "border-amber-500/30",
    text: "text-amber-400",
    label: "Attendre",
    icon: Clock,
    barColor: "bg-amber-500",
  },
  rouge: {
    bg: "bg-red-500/10",
    border: "border-red-500/30",
    text: "text-red-400",
    label: "Tempête",
    icon: AlertTriangle,
    barColor: "bg-red-500",
  },
};

export default function Maintenance() {
  const optimalDays = weekSchedule.filter((d) => d.status === "vert").length;
  const avgROI =
    weekSchedule.reduce((sum, d) => sum + d.roiScore, 0) / weekSchedule.length;

  return (
    <DashboardLayout>
      <div className="space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <CalendarDays className="w-5 h-5 text-amber-400" />
              Calendrier de Maintenance Intelligent
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              Planification IA sur 7 jours basée sur les prévisions météo et poussière
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="bg-[#1A2332] border border-[#2A3A4E] rounded-lg px-4 py-2 text-center">
              <p className="text-[10px] text-slate-500 uppercase">Jours Optimaux</p>
              <p className="text-lg font-bold text-emerald-400 font-mono">{optimalDays}/7</p>
            </div>
            <div className="bg-[#1A2332] border border-[#2A3A4E] rounded-lg px-4 py-2 text-center">
              <p className="text-[10px] text-slate-500 uppercase">ROI Moyen</p>
              <p className="text-lg font-bold text-amber-400 font-mono">{avgROI.toFixed(0)}%</p>
            </div>
          </div>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-6">
          {(["vert", "orange", "rouge"] as const).map((s) => {
            const cfg = statusConfig[s];
            const Icon = cfg.icon;
            return (
              <div key={s} className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${cfg.barColor}`} />
                <Icon className={`w-3.5 h-3.5 ${cfg.text}`} />
                <span className={`text-xs font-semibold ${cfg.text}`}>{cfg.label}</span>
              </div>
            );
          })}
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-7 gap-3">
          {weekSchedule.map((day) => {
            const cfg = statusConfig[day.status];
            const StatusIcon = cfg.icon;

            return (
              <div
                key={day.date}
                className={`${cfg.bg} border-2 ${cfg.border} rounded-xl p-4 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg hover:shadow-black/20`}
              >
                {/* Day header */}
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <p className="text-sm font-bold text-white">{day.dayLabel}</p>
                    <p className="text-[10px] text-slate-500">{day.date.slice(5)}</p>
                  </div>
                  <StatusIcon className={`w-5 h-5 ${cfg.text}`} />
                </div>

                {/* ROI Score */}
                <div className="mb-3">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] text-slate-500 uppercase">Score ROI</span>
                    <span className={`text-sm font-bold font-mono ${cfg.text}`}>
                      {day.roiScore}%
                    </span>
                  </div>
                  <div className="w-full h-2 bg-[#0A0F1C] rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${cfg.barColor} transition-all duration-700`}
                      style={{ width: `${day.roiScore}%` }}
                    />
                  </div>
                </div>

                {/* Weather metrics */}
                <div className="space-y-1.5 mb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <Droplets className="w-3 h-3 text-[#D4A574]" />
                      <span className="text-[10px] text-slate-500">Poussière</span>
                    </div>
                    <span className="text-[11px] font-mono text-slate-300">{day.dustForecast}%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <CloudRain className="w-3 h-3 text-blue-400" />
                      <span className="text-[10px] text-slate-500">Pluie</span>
                    </div>
                    <span className="text-[11px] font-mono text-slate-300">{day.precipMm} mm</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <Wind className="w-3 h-3 text-orange-400" />
                      <span className="text-[10px] text-slate-500">Vent</span>
                    </div>
                    <span className="text-[11px] font-mono text-slate-300">{day.windKmh} km/h</span>
                  </div>
                </div>

                {/* Recommendation */}
                <div className="bg-[#0A0F1C]/50 rounded-lg p-2 mb-2">
                  <p className="text-[10px] text-slate-400 leading-relaxed">
                    <Sparkles className="w-3 h-3 inline mr-1 text-amber-400" />
                    {day.recommendation}
                  </p>
                </div>

                {/* Sites to clean */}
                {day.sites.length > 0 && (
                  <div>
                    <p className="text-[9px] text-slate-500 uppercase mb-1">Sites à nettoyer :</p>
                    <div className="flex flex-wrap gap-1">
                      {day.sites.map((site) => (
                        <span
                          key={site}
                          className="text-[9px] bg-[#0A0F1C] text-slate-300 px-1.5 py-0.5 rounded"
                        >
                          {site}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Summary bar */}
        <div className="bg-[#1A2332] border border-[#2A3A4E] rounded-xl p-5">
          <div className="flex items-center gap-3 mb-3">
            <TrendingUp className="w-5 h-5 text-amber-400" />
            <h3 className="text-base font-semibold text-white">
              Résumé de la Semaine
            </h3>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-[#111827] rounded-lg p-3 text-center">
              <p className="text-[10px] text-slate-500 uppercase mb-1">Sites à Nettoyer</p>
              <p className="text-xl font-bold text-white font-mono">6</p>
            </div>
            <div className="bg-[#111827] rounded-lg p-3 text-center">
              <p className="text-[10px] text-slate-500 uppercase mb-1">Nettoyages Planifiés</p>
              <p className="text-xl font-bold text-emerald-400 font-mono">12</p>
            </div>
            <div className="bg-[#111827] rounded-lg p-3 text-center">
              <p className="text-[10px] text-slate-500 uppercase mb-1">Économies Prévues</p>
              <p className="text-xl font-bold text-amber-400 font-mono">340K MAD</p>
            </div>
            <div className="bg-[#111827] rounded-lg p-3 text-center">
              <p className="text-[10px] text-slate-500 uppercase mb-1">Jours Bloqués</p>
              <p className="text-xl font-bold text-red-400 font-mono">2</p>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}