import { cherguiForecast } from "@/data/mockData";
import { Wind, Eye, Thermometer, Zap, AlertTriangle } from "lucide-react";

const DUST_STORM_BG =
  "https://mgx-backend-cdn.metadl.com/generate/images/1019406/2026-03-11/978b2a70-161d-491b-a6bd-8d229ad3562d.png";

function getWindColor(speed: number) {
  if (speed < 25) return "#10B981";
  if (speed < 45) return "#F59E0B";
  if (speed < 65) return "#F97316";
  return "#EF4444";
}

function getDustColor(prob: number) {
  if (prob < 25) return "#10B981";
  if (prob < 50) return "#F59E0B";
  if (prob < 75) return "#F97316";
  return "#EF4444";
}

function getVisibilityColor(vis: string) {
  switch (vis) {
    case "Excellent":
      return "#10B981";
    case "Good":
      return "#3B82F6";
    case "Moderate":
      return "#F59E0B";
    case "Low":
      return "#F97316";
    case "Very Low":
      return "#EF4444";
    case "Critical":
      return "#DC2626";
    default:
      return "#64748B";
  }
}

export default function PredictiveTimeline() {
  const maxWind = Math.max(...cherguiForecast.map((f) => f.windSpeedKmh));
  const peakDay = cherguiForecast.reduce((max, f) =>
    f.dustProbability > max.dustProbability ? f : max
  );

  return (
    <div className="bg-[#1A2332] border border-[#2A3A4E] rounded-xl overflow-hidden">
      {/* Header with background */}
      <div className="relative px-5 pt-5 pb-4">
        <div
          className="absolute inset-0 opacity-[0.07] bg-cover bg-center"
          style={{ backgroundImage: `url(${DUST_STORM_BG})` }}
        />
        <div className="relative flex items-center justify-between">
          <div>
            <h3 className="text-base font-semibold text-white flex items-center gap-2">
              <Wind className="w-4 h-4 text-orange-400" />
              Chergui Wind — 7-Day Predictive Timeline
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Impact forecast on Oriental region energy production
            </p>
          </div>
          <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-1.5">
            <AlertTriangle className="w-3.5 h-3.5 text-red-400" />
            <span className="text-xs font-semibold text-red-400">
              Peak: {peakDay.day} — {peakDay.dustProbability}% dust probability
            </span>
          </div>
        </div>
      </div>

      {/* Timeline grid */}
      <div className="px-5 pb-5">
        <div className="grid grid-cols-7 gap-2">
          {cherguiForecast.map((forecast, index) => {
            const windColor = getWindColor(forecast.windSpeedKmh);
            const dustColor = getDustColor(forecast.dustProbability);
            const visColor = getVisibilityColor(forecast.visibility);
            const windBarHeight = (forecast.windSpeedKmh / maxWind) * 100;
            const isToday = forecast.day === "Today";
            const isPeak =
              forecast.dustProbability === peakDay.dustProbability;

            return (
              <div
                key={forecast.date}
                className={`relative rounded-xl p-3 transition-all duration-300 hover:scale-[1.02] ${
                  isPeak
                    ? "bg-red-500/10 border-2 border-red-500/30"
                    : isToday
                    ? "bg-amber-500/10 border-2 border-amber-500/20"
                    : "bg-[#111827] border border-[#1E2A3A] hover:border-[#2A3A4E]"
                }`}
              >
                {/* Day header */}
                <div className="text-center mb-3">
                  <p
                    className={`text-sm font-bold ${
                      isToday
                        ? "text-amber-400"
                        : isPeak
                        ? "text-red-400"
                        : "text-white"
                    }`}
                  >
                    {forecast.day}
                  </p>
                  <p className="text-[10px] text-slate-500">
                    {forecast.date.slice(5)}
                  </p>
                </div>

                {/* Wind speed bar */}
                <div className="relative h-20 mb-3 flex items-end justify-center">
                  <div className="relative w-8 h-full bg-[#0A0F1C] rounded-md overflow-hidden">
                    <div
                      className="absolute bottom-0 w-full rounded-md transition-all duration-1000 ease-out"
                      style={{
                        height: `${windBarHeight}%`,
                        background: `linear-gradient(to top, ${windColor}40, ${windColor})`,
                        boxShadow: `0 0 10px ${windColor}40`,
                      }}
                    />
                  </div>
                  <div className="absolute -top-1 left-1/2 -translate-x-1/2">
                    <Wind
                      className="w-3.5 h-3.5"
                      style={{ color: windColor }}
                    />
                  </div>
                </div>

                {/* Metrics */}
                <div className="space-y-2">
                  {/* Wind */}
                  <div className="flex items-center justify-between">
                    <Wind className="w-3 h-3 text-slate-500" />
                    <span
                      className="text-xs font-mono font-bold"
                      style={{ color: windColor }}
                    >
                      {forecast.windSpeedKmh} km/h
                    </span>
                  </div>

                  {/* Dust probability */}
                  <div className="flex items-center justify-between">
                    <div className="w-3 h-3 rounded-full bg-[#D4A574]/30 flex items-center justify-center">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#D4A574]" />
                    </div>
                    <span
                      className="text-xs font-mono font-bold"
                      style={{ color: dustColor }}
                    >
                      {forecast.dustProbability}%
                    </span>
                  </div>

                  {/* Energy impact */}
                  <div className="flex items-center justify-between">
                    <Zap className="w-3 h-3 text-slate-500" />
                    <span className="text-xs font-mono font-bold text-red-400">
                      {forecast.energyImpactPercent}%
                    </span>
                  </div>

                  {/* Temperature */}
                  <div className="flex items-center justify-between">
                    <Thermometer className="w-3 h-3 text-slate-500" />
                    <span className="text-xs font-mono text-slate-300">
                      {forecast.temperature}°C
                    </span>
                  </div>

                  {/* Visibility */}
                  <div className="flex items-center justify-between">
                    <Eye className="w-3 h-3 text-slate-500" />
                    <span
                      className="text-[10px] font-semibold"
                      style={{ color: visColor }}
                    >
                      {forecast.visibility}
                    </span>
                  </div>
                </div>

                {/* Peak/Today badge */}
                {(isPeak || isToday) && (
                  <div
                    className={`absolute -top-2 left-1/2 -translate-x-1/2 text-[9px] font-bold uppercase px-2 py-0.5 rounded-full ${
                      isPeak
                        ? "bg-red-500 text-white"
                        : "bg-amber-500 text-black"
                    }`}
                  >
                    {isPeak ? "PEAK" : "NOW"}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Legend */}
        <div className="flex items-center justify-center gap-6 mt-4 pt-3 border-t border-[#1E2A3A]">
          <div className="flex items-center gap-1.5">
            <Wind className="w-3 h-3 text-slate-500" />
            <span className="text-[10px] text-slate-500">Wind Speed</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-[#D4A574]" />
            <span className="text-[10px] text-slate-500">Dust Probability</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Zap className="w-3 h-3 text-red-400" />
            <span className="text-[10px] text-slate-500">Energy Impact</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Eye className="w-3 h-3 text-slate-500" />
            <span className="text-[10px] text-slate-500">Visibility</span>
          </div>
        </div>
      </div>
    </div>
  );
}