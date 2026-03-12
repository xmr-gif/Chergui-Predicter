import { useEffect, useState } from "react";
import { Site } from "@/hooks/useDashboardMetrics";
import { TrendingDown, ArrowUp, Clock } from "lucide-react";

export default function YieldLossGauge({ sites }: { sites: Site[] }) {
  const currentLossMAD = sites.reduce((sum, site) => sum + site.yieldLossMAD, 0);
  const maxLossMAD = 3000000;
  
  // Example daily/monthly calculation relative to current loss
  const dailyLossMAD = currentLossMAD * 0.45;
  const monthlyLossMAD = currentLossMAD * 8.2;
  const trend = "increasing" as const;

  const [animatedValue, setAnimatedValue] = useState(0);
  const percentage = Math.min((currentLossMAD / maxLossMAD) * 100, 100);

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedValue(percentage);
    }, 300);
    return () => clearTimeout(timer);
  }, [percentage]);

  // SVG gauge parameters
  const size = 220;
  const strokeWidth = 18;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const startAngle = 135;
  const endAngle = 405;
  const totalAngle = endAngle - startAngle;
  const arcLength = (totalAngle / 360) * circumference;
  const filledLength = (animatedValue / 100) * arcLength;
  const emptyLength = arcLength - filledLength;

  // Determine color based on percentage
  const getColor = (pct: number) => {
    if (pct < 30) return { main: "#10B981", label: "Low Risk" };
    if (pct < 60) return { main: "#F59E0B", label: "Moderate Risk" };
    if (pct < 80) return { main: "#F97316", label: "High Risk" };
    return { main: "#EF4444", label: "Critical" };
  };

  const colorInfo = getColor(percentage);

  const formatMAD = (value: number) => {
    if (value >= 1000000) return `${(value / 1000000).toFixed(2)}M`;
    if (value >= 1000) return `${(value / 1000).toFixed(0)}K`;
    return value.toString();
  };

  return (
    <div className="bg-[#1A2332] border border-[#2A3A4E] rounded-xl p-5 h-full flex flex-col">
      <div className="flex items-center justify-between mb-2">
        <div>
          <h3 className="text-base font-semibold text-white flex items-center gap-2">
            <TrendingDown className="w-4 h-4 text-red-400" />
            Yield Loss Gauge
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time revenue impact in MAD
          </p>
        </div>
        <span
          className="text-[10px] font-bold uppercase px-2.5 py-1 rounded-full"
          style={{
            backgroundColor: `${colorInfo.main}20`,
            color: colorInfo.main,
          }}
        >
          {colorInfo.label}
        </span>
      </div>

      {/* Gauge */}
      <div className="flex-1 flex items-center justify-center relative">
        <svg
          width={size}
          height={size * 0.7}
          viewBox={`0 0 ${size} ${size * 0.75}`}
          className="overflow-visible"
        >
          <defs>
            <linearGradient id="gaugeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#10B981" />
              <stop offset="40%" stopColor="#F59E0B" />
              <stop offset="70%" stopColor="#F97316" />
              <stop offset="100%" stopColor="#EF4444" />
            </linearGradient>
            <filter id="gaugeGlow">
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
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
            strokeDashoffset={-(circumference - arcLength) / 2 - (circumference * (startAngle - 90)) / 360 + circumference / 4}
            strokeLinecap="round"
            transform={`rotate(${startAngle - 90}, ${size / 2}, ${size / 2})`}
            style={{ transform: `rotate(${startAngle}deg)`, transformOrigin: "center" }}
          />

          {/* Filled arc */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="url(#gaugeGradient)"
            strokeWidth={strokeWidth}
            strokeDasharray={`${filledLength} ${circumference - filledLength}`}
            strokeLinecap="round"
            filter="url(#gaugeGlow)"
            style={{
              transform: `rotate(${startAngle}deg)`,
              transformOrigin: "center",
              transition: "stroke-dasharray 1.5s ease-out",
            }}
          />

          {/* Tick marks */}
          {[0, 25, 50, 75, 100].map((tick) => {
            const angle = startAngle + (tick / 100) * totalAngle;
            const rad = (angle * Math.PI) / 180;
            const innerR = radius - strokeWidth / 2 - 6;
            const outerR = radius - strokeWidth / 2 - 2;
            const x1 = size / 2 + innerR * Math.cos(rad);
            const y1 = size / 2 + innerR * Math.sin(rad);
            const x2 = size / 2 + outerR * Math.cos(rad);
            const y2 = size / 2 + outerR * Math.sin(rad);
            const labelR = radius - strokeWidth / 2 - 16;
            const lx = size / 2 + labelR * Math.cos(rad);
            const ly = size / 2 + labelR * Math.sin(rad);

            return (
              <g key={tick}>
                <line
                  x1={x1}
                  y1={y1}
                  x2={x2}
                  y2={y2}
                  stroke="#4B5563"
                  strokeWidth="1"
                />
                <text
                  x={lx}
                  y={ly}
                  fill="#64748B"
                  fontSize="8"
                  fontFamily="Inter"
                  textAnchor="middle"
                  dominantBaseline="middle"
                >
                  {tick}%
                </text>
              </g>
            );
          })}

          {/* Center text */}
          <text
            x={size / 2}
            y={size / 2 - 8}
            fill="#F1F5F9"
            fontSize="28"
            fontFamily="JetBrains Mono, monospace"
            fontWeight="700"
            textAnchor="middle"
            dominantBaseline="middle"
          >
            {formatMAD(currentLossMAD)}
          </text>
          <text
            x={size / 2}
            y={size / 2 + 14}
            fill="#F59E0B"
            fontSize="12"
            fontFamily="Inter"
            fontWeight="600"
            textAnchor="middle"
          >
            MAD
          </text>
        </svg>
      </div>

      {/* Bottom stats */}
      <div className="grid grid-cols-3 gap-3 mt-2 pt-3 border-t border-[#2A3A4E]">
        <div className="text-center">
          <div className="flex items-center justify-center gap-1 mb-1">
            <Clock className="w-3 h-3 text-slate-500" />
            <span className="text-[10px] text-slate-500 uppercase">Today</span>
          </div>
          <p className="text-sm font-bold text-white font-mono">
            {(dailyLossMAD / 1000).toFixed(1)}K MAD
          </p>
          <p className="text-[10px] text-slate-500">MAD</p>
        </div>
        <div className="text-center border-x border-[#2A3A4E]">
          <div className="flex items-center justify-center gap-1 mb-1">
            <ArrowUp className="w-3 h-3 text-red-400" />
            <span className="text-[10px] text-slate-500 uppercase">Monthly</span>
          </div>
          <p className="text-sm font-bold text-white font-mono">
            {(monthlyLossMAD / 1000000).toFixed(2)}M MAD
          </p>
          <p className="text-[10px] text-slate-500">MAD</p>
        </div>
        <div className="text-center">
          <div className="flex items-center justify-center gap-1 mb-1">
            <TrendingDown className="w-3 h-3 text-amber-400" />
            <span className="text-[10px] text-slate-500 uppercase">Trend</span>
          </div>
          <p className="text-sm font-bold text-amber-400 capitalize">
            {trend === "increasing" ? (
              <>
                <ArrowUp className="inline-block w-3 h-3 mr-1 text-red-400" />
                Increasing
              </>
            ) : (
              <>
                <TrendingDown className="inline-block w-3 h-3 mr-1 text-green-400" />
                Decreasing
              </>
            )}
          </p>
          <p className="text-[10px] text-slate-500">↑ Rising</p>
        </div>
      </div>
    </div>
  );
}