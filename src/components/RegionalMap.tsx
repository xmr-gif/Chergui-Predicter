import { useState } from "react";
import { solarSites, siteMapPositions } from "@/data/mockData";
import type { SolarSite } from "@/data/mockData";
import { MapPin, Zap, Droplets, Wind } from "lucide-react";

const statusColors: Record<string, string> = {
  operational: "#10B981",
  warning: "#F59E0B",
  critical: "#EF4444",
  maintenance: "#6366F1",
};

const statusGlow: Record<string, string> = {
  operational: "rgba(16,185,129,0.4)",
  warning: "rgba(245,158,11,0.4)",
  critical: "rgba(239,68,68,0.5)",
  maintenance: "rgba(99,102,241,0.4)",
};

function SiteTooltip({ site }: { site: SolarSite }) {
  return (
    <div className="absolute z-50 bg-[#0D1321]/95 backdrop-blur-md border border-[#2A3A4E] rounded-xl p-4 w-64 shadow-2xl shadow-black/40 pointer-events-none -translate-x-1/2 -translate-y-full -mt-3">
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-sm font-bold text-white">{site.name}</h4>
        <span
          className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full"
          style={{
            backgroundColor: `${statusColors[site.status]}20`,
            color: statusColors[site.status],
          }}
        >
          {site.status}
        </span>
      </div>
      <div className="grid grid-cols-2 gap-2 text-xs">
        <div className="flex items-center gap-1.5 text-slate-400">
          <Zap className="w-3 h-3 text-blue-400" />
          <span>
            {site.currentOutputMW}/{site.capacityMW} MW
          </span>
        </div>
        <div className="flex items-center gap-1.5 text-slate-400">
          <Droplets className="w-3 h-3 text-amber-400" />
          <span>Dust: {site.dustLevel}%</span>
        </div>
        <div className="flex items-center gap-1.5 text-slate-400">
          <Wind className="w-3 h-3 text-emerald-400" />
          <span>Eff: {site.efficiency}%</span>
        </div>
        <div className="flex items-center gap-1.5 text-slate-400">
          <MapPin className="w-3 h-3 text-red-400" />
          <span>Loss: {(site.yieldLossMAD / 1000).toFixed(0)}K MAD</span>
        </div>
      </div>
      <div className="mt-3 pt-2 border-t border-[#2A3A4E]">
        <p className="text-[11px] text-slate-500">
          Next cleaning: {site.nextCleaning}
        </p>
      </div>
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-full w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[6px] border-t-[#2A3A4E]" />
    </div>
  );
}

export default function RegionalMap() {
  const [hoveredSite, setHoveredSite] = useState<string | null>(null);

  return (
    <div className="bg-[#1A2332] border border-[#2A3A4E] rounded-xl p-5 h-full">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-base font-semibold text-white flex items-center gap-2">
            <MapPin className="w-4 h-4 text-amber-400" />
            Oriental Region — Solar Sites
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time monitoring of 6 solar installations
          </p>
        </div>
        <div className="flex items-center gap-3">
          {["operational", "warning", "critical"].map((status) => (
            <div key={status} className="flex items-center gap-1.5">
              <div
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: statusColors[status] }}
              />
              <span className="text-[10px] text-slate-500 capitalize">
                {status}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* SVG Map */}
      <div className="relative w-full aspect-[4/3] bg-[#111827] rounded-lg overflow-hidden border border-[#1E2A3A]">
        <svg
          viewBox="0 0 420 380"
          className="w-full h-full"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <radialGradient id="mapGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#F59E0B" stopOpacity="0.08" />
              <stop offset="100%" stopColor="#F59E0B" stopOpacity="0" />
            </radialGradient>
            <filter id="glow">
              <feGaussianBlur stdDeviation="3" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <linearGradient id="regionGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#1E3A5F" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#1A2332" stopOpacity="0.3" />
            </linearGradient>
            {/* Dust zone gradients */}
            <radialGradient id="dustZone" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#D4A574" stopOpacity="0.15" />
              <stop offset="70%" stopColor="#D4A574" stopOpacity="0.05" />
              <stop offset="100%" stopColor="#D4A574" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* Background grid */}
          <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
            <path
              d="M 20 0 L 0 0 0 20"
              fill="none"
              stroke="#1E2A3A"
              strokeWidth="0.5"
            />
          </pattern>
          <rect width="420" height="380" fill="url(#grid)" />

          {/* Map glow */}
          <ellipse cx="210" cy="190" rx="180" ry="170" fill="url(#mapGlow)" />

          {/* Oriental Region outline */}
          <path
            d="M 130 25 L 200 15 L 270 18 L 320 35 L 350 80 L 360 140 L 355 210 L 340 270 L 310 320 L 260 350 L 200 360 L 150 345 L 110 310 L 85 260 L 75 200 L 78 140 L 90 80 L 110 45 Z"
            fill="url(#regionGrad)"
            stroke="#3B82F6"
            strokeWidth="1.5"
            strokeOpacity="0.4"
            strokeDasharray="none"
          />

          {/* Algeria border (east) */}
          <path
            d="M 350 80 L 370 50 L 385 20"
            fill="none"
            stroke="#4B5563"
            strokeWidth="1"
            strokeDasharray="4 4"
            strokeOpacity="0.5"
          />
          <text x="375" y="55" fill="#4B5563" fontSize="8" fontFamily="Inter">
            Algeria
          </text>

          {/* Mediterranean coast (north) */}
          <path
            d="M 80 30 L 130 25 L 200 15 L 270 18 L 320 35 L 360 50"
            fill="none"
            stroke="#3B82F6"
            strokeWidth="1.5"
            strokeOpacity="0.3"
          />
          <text x="170" y="10" fill="#3B82F6" fontSize="8" fontFamily="Inter" opacity="0.5">
            Mediterranean Sea
          </text>

          {/* Dust storm zones */}
          <ellipse cx="240" cy="280" rx="80" ry="60" fill="url(#dustZone)">
            <animate
              attributeName="rx"
              values="80;90;80"
              dur="4s"
              repeatCount="indefinite"
            />
            <animate
              attributeName="opacity"
              values="1;0.6;1"
              dur="4s"
              repeatCount="indefinite"
            />
          </ellipse>
          <ellipse cx="210" cy="180" rx="60" ry="45" fill="url(#dustZone)">
            <animate
              attributeName="rx"
              values="60;68;60"
              dur="5s"
              repeatCount="indefinite"
            />
          </ellipse>

          {/* Chergui wind arrows */}
          <g opacity="0.3">
            <line x1="380" y1="200" x2="300" y2="180" stroke="#FF6B35" strokeWidth="1" markerEnd="url(#arrowhead)" />
            <line x1="390" y1="250" x2="310" y2="240" stroke="#FF6B35" strokeWidth="1" markerEnd="url(#arrowhead)" />
            <line x1="385" y1="300" x2="290" y2="290" stroke="#FF6B35" strokeWidth="1" markerEnd="url(#arrowhead)" />
            <text x="370" y="195" fill="#FF6B35" fontSize="7" fontFamily="Inter">
              Chergui
            </text>
          </g>
          <defs>
            <marker
              id="arrowhead"
              markerWidth="6"
              markerHeight="4"
              refX="6"
              refY="2"
              orient="auto"
            >
              <polygon points="0 0, 6 2, 0 4" fill="#FF6B35" />
            </marker>
          </defs>

          {/* City labels */}
          <text x="120" y="70" fill="#64748B" fontSize="7" fontFamily="Inter">
            Nador
          </text>
          <text x="90" y="200" fill="#64748B" fontSize="7" fontFamily="Inter">
            Guercif
          </text>

          {/* Solar site markers */}
          {solarSites.map((site) => {
            const pos = siteMapPositions[site.id];
            if (!pos) return null;
            const color = statusColors[site.status];
            const glow = statusGlow[site.status];
            const isHovered = hoveredSite === site.id;

            return (
              <g
                key={site.id}
                onMouseEnter={() => setHoveredSite(site.id)}
                onMouseLeave={() => setHoveredSite(null)}
                className="cursor-pointer"
              >
                {/* Outer pulse ring */}
                <circle cx={pos.x} cy={pos.y} r={isHovered ? 22 : 16} fill="none" stroke={color} strokeWidth="0.5" opacity="0.3">
                  <animate
                    attributeName="r"
                    values={isHovered ? "22;28;22" : "16;22;16"}
                    dur="2s"
                    repeatCount="indefinite"
                  />
                  <animate
                    attributeName="opacity"
                    values="0.3;0;0.3"
                    dur="2s"
                    repeatCount="indefinite"
                  />
                </circle>
                {/* Glow */}
                <circle
                  cx={pos.x}
                  cy={pos.y}
                  r={isHovered ? 14 : 10}
                  fill={glow}
                  filter="url(#glow)"
                />
                {/* Main dot */}
                <circle
                  cx={pos.x}
                  cy={pos.y}
                  r={isHovered ? 7 : 5}
                  fill={color}
                  stroke="#0A0F1C"
                  strokeWidth="2"
                  className="transition-all duration-200"
                />
                {/* Inner dot */}
                <circle cx={pos.x} cy={pos.y} r="2" fill="white" opacity="0.8" />
                {/* Label */}
                <text
                  x={pos.x}
                  y={pos.y + (isHovered ? 18 : 15)}
                  fill={isHovered ? "#F1F5F9" : "#94A3B8"}
                  fontSize={isHovered ? "9" : "8"}
                  fontFamily="Inter"
                  fontWeight={isHovered ? "600" : "400"}
                  textAnchor="middle"
                  className="transition-all duration-200"
                >
                  {site.name}
                </text>
              </g>
            );
          })}
        </svg>

        {/* Tooltip overlay */}
        {hoveredSite && siteMapPositions[hoveredSite] && (
          <div
            className="absolute"
            style={{
              left: `${(siteMapPositions[hoveredSite].x / 420) * 100}%`,
              top: `${(siteMapPositions[hoveredSite].y / 380) * 100}%`,
            }}
          >
            <SiteTooltip
              site={solarSites.find((s) => s.id === hoveredSite)!}
            />
          </div>
        )}
      </div>
    </div>
  );
}