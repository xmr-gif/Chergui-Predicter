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
function TESGauge() {
  const value = 45;
  const target = 50;
  const size = 100;
  const strokeWidth = 10;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const startAngle = 135;
  const totalAngle = 270;
  const arcLength = (totalAngle / 360) * circumference;
  const [animVal, setAnimVal] = useState(0);

  useEffect(() => {
    const t = setTimeout(() => setAnimVal(value), 200);
    return () => clearTimeout(t);
  }, []);

  const filledLength = (animVal / 100) * arcLength;
  const targetAngle = startAngle + (target / 100) * totalAngle;
  const targetRad = (targetAngle * Math.PI) / 180;
  const tx = size / 2 + (radius) * Math.cos(targetRad);
  const ty = size / 2 + (radius) * Math.sin(targetRad);

  return (
    <div className="bg-[#1A2332] border border-[#2A3A4E] rounded-xl p-5 hover:border-[#3A4A5E] transition-all duration-300 group hover:shadow-lg hover:shadow-black/20">
      <div className="flex items-start justify-between mb-3">
        <div className="w-11 h-11 rounded-lg flex items-center justify-center bg-cyan-500/15 transition-transform duration-300 group-hover:scale-110">
          <Target className="w-5 h-5 text-cyan-400" />
        </div>
        <div className="flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full bg-amber-500/10 text-amber-400">
          <Target className="w-3 h-3" />
          Cible: {target}%
        </div>
      </div>
      <p className="text-slate-400 text-xs font-medium uppercase tracking-wider mb-2">
        TES (Taux d'Énergie Sauvegardée)
      </p>
      <div className="flex items-center gap-3">
        <svg width={size} height={size * 0.65} viewBox={`0 0 ${size} ${size * 0.7}`} className="overflow-visible flex-shrink-0">
          <defs>
            <linearGradient id="tesGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#EF4444" />
              <stop offset="50%" stopColor="#F59E0B" />
              <stop offset="100%" stopColor="#10B981" />
            </linearGradient>
          </defs>
          {/* Background arc */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="#1E2A3A"
            strokeWidth={strokeWidth}
            strokeDasharray={`${arcLength} ${circumference - arcLength}`}
            strokeLinecap="round"
            style={{ transform: `rotate(${startAngle}deg)`, transformOrigin: "center" }}
          />
          {/* Filled arc */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="url(#tesGrad)"
            strokeWidth={strokeWidth}
            strokeDasharray={`${filledLength} ${circumference - filledLength}`}
            strokeLinecap="round"
            style={{
              transform: `rotate(${startAngle}deg)`,
              transformOrigin: "center",
              transition: "stroke-dasharray 1.2s ease-out",
            }}
          />
          {/* Target marker */}
          <circle cx={tx} cy={ty} r="4" fill="#F59E0B" stroke="#0A0F1C" strokeWidth="2" />
          {/* Center value */}
          <text x={size / 2} y={size / 2 - 2} fill="#F1F5F9" fontSize="20" fontFamily="JetBrains Mono, monospace" fontWeight="700" textAnchor="middle" dominantBaseline="middle">
            {value}%
          </text>
        </svg>
        <div>
          <p className="text-[11px] text-slate-500">
            {value < target ? (
              <span className="text-amber-400">↓ {target - value}% sous la cible</span>
            ) : (
              <span className="text-emerald-400">✓ Cible atteinte</span>
            )}
          </p>
        </div>
      </div>
    </div>
  );
}

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

// --- Main Export ---
export default function KPICards() {
  return (
    <div className="space-y-4">
      {/* Top row: 4 metric cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <KPICard
          title="Production Actuelle (MW)"
          value="1,233 MW"
          change={-8.2}
          changeLabel="vs. moyenne d'hier"
          icon={<Zap className="w-5 h-5" />}
          iconBg="bg-blue-500/15"
          iconColor="text-blue-400"
          statusDot="bg-emerald-400"
        />
        <KPICard
          title="Pertes Évitées (MAD)"
          value="1.85M MAD"
          change={12.5}
          changeLabel="économies grâce à l'IA ce mois"
          icon={<ShieldCheck className="w-5 h-5" />}
          iconBg="bg-emerald-500/15"
          iconColor="text-emerald-400"
        />
        <TESGauge />
        <KPICard
          title="Perte de Rendement"
          value="-12.5%"
          change={-4.3}
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