import { Site } from "@/hooks/useDashboardMetrics";
import { ArrowUpDown, MoreHorizontal, Wrench, Zap } from "lucide-react";

const statusConfig: Record<
  string,
  { bg: string; text: string; dot: string }
> = {
  operational: {
    bg: "bg-emerald-500/10",
    text: "text-emerald-400",
    dot: "bg-emerald-400",
  },
  warning: {
    bg: "bg-amber-500/10",
    text: "text-amber-400",
    dot: "bg-amber-400",
  },
  critical: {
    bg: "bg-red-500/10",
    text: "text-red-400",
    dot: "bg-red-400",
  },
  maintenance: {
    bg: "bg-indigo-500/10",
    text: "text-indigo-400",
    dot: "bg-indigo-400",
  },
};

function DustBar({ level }: { level: number }) {
  const getColor = (l: number) => {
    if (l < 30) return "bg-emerald-500";
    if (l < 50) return "bg-amber-500";
    if (l < 70) return "bg-orange-500";
    return "bg-red-500";
  };

  return (
    <div className="flex items-center gap-2">
      <div className="w-20 h-2 bg-[#0A0F1C] rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-500 ${getColor(level)}`}
          style={{ width: `${level}%` }}
        />
      </div>
      <span className="text-xs font-mono text-slate-300 w-8">{level}%</span>
    </div>
  );
}

export default function SiteTable({ sites }: { sites: Site[] }) {
  const sortedSites = [...sites].sort(
    (a, b) => b.yieldLossMAD - a.yieldLossMAD
  );

  return (
    <div className="bg-[#1A2332] border border-[#2A3A4E] rounded-xl overflow-hidden">
      <div className="px-5 py-4 flex items-center justify-between border-b border-[#2A3A4E]">
        <div>
          <h3 className="text-base font-semibold text-white flex items-center gap-2">
            <Zap className="w-4 h-4 text-blue-400" />
            Site Performance Overview
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            All solar installations in Oriental Morocco
          </p>
        </div>
        <button className="text-xs text-slate-400 hover:text-white flex items-center gap-1 px-3 py-1.5 rounded-lg border border-[#2A3A4E] hover:border-[#3A4A5E] transition-colors">
          <ArrowUpDown className="w-3 h-3" />
          Sort by Loss
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[#1E2A3A]">
              <th className="text-left text-[10px] font-semibold text-slate-500 uppercase tracking-wider px-5 py-3">
                Site
              </th>
              <th className="text-left text-[10px] font-semibold text-slate-500 uppercase tracking-wider px-4 py-3">
                Status
              </th>
              <th className="text-left text-[10px] font-semibold text-slate-500 uppercase tracking-wider px-4 py-3">
                Output
              </th>
              <th className="text-left text-[10px] font-semibold text-slate-500 uppercase tracking-wider px-4 py-3">
                Efficiency
              </th>
              <th className="text-left text-[10px] font-semibold text-slate-500 uppercase tracking-wider px-4 py-3">
                Dust Level
              </th>
              <th className="text-left text-[10px] font-semibold text-slate-500 uppercase tracking-wider px-4 py-3">
                Yield Loss
              </th>
              <th className="text-left text-[10px] font-semibold text-slate-500 uppercase tracking-wider px-4 py-3">
                Next Cleaning
              </th>
              <th className="text-left text-[10px] font-semibold text-slate-500 uppercase tracking-wider px-4 py-3">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {sortedSites.map((site, index) => {
              const status = statusConfig[site.status];
              return (
                <tr
                  key={site.id}
                  className={`border-b border-[#1E2A3A]/50 hover:bg-white/[0.02] transition-colors ${
                    index === sortedSites.length - 1 ? "border-b-0" : ""
                  }`}
                >
                  {/* Site name */}
                  <td className="px-5 py-3.5">
                    <div>
                      <p className="text-sm font-semibold text-white">
                        {site.name}
                      </p>
                      <p className="text-[11px] text-slate-500">
                        {site.capacityMW} MW capacity
                      </p>
                    </div>
                  </td>

                  {/* Status */}
                  <td className="px-4 py-3.5">
                    <span
                      className={`inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase px-2.5 py-1 rounded-full ${status.bg} ${status.text}`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${status.dot} ${
                          site.status === "critical" ? "animate-pulse" : ""
                        }`}
                      />
                      {site.status}
                    </span>
                  </td>

                  {/* Output */}
                  <td className="px-4 py-3.5">
                    <span className="text-sm font-mono font-bold text-white">
                      {site.currentOutputMW}
                    </span>
                    <span className="text-xs text-slate-500 ml-1">MW</span>
                  </td>

                  {/* Efficiency */}
                  <td className="px-4 py-3.5">
                    <span
                      className={`text-sm font-mono font-bold ${
                        site.efficiency >= 80
                          ? "text-emerald-400"
                          : site.efficiency >= 65
                          ? "text-amber-400"
                          : "text-red-400"
                      }`}
                    >
                      {site.efficiency}%
                    </span>
                  </td>

                  {/* Dust Level */}
                  <td className="px-4 py-3.5">
                    <DustBar level={site.dustLevel} />
                  </td>

                  {/* Yield Loss */}
                  <td className="px-4 py-3.5">
                    <span className="text-sm font-mono font-bold text-red-400">
                      {(site.yieldLossMAD / 1000).toFixed(0)}K
                    </span>
                    <span className="text-xs text-slate-500 ml-1">MAD</span>
                  </td>

                  {/* Next Cleaning */}
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-1.5">
                      <Wrench className="w-3 h-3 text-slate-500" />
                      <span className="text-xs text-slate-300">
                        {site.nextCleaning}
                      </span>
                    </div>
                  </td>

                  {/* Actions */}
                  <td className="px-4 py-3.5">
                    <button className="w-7 h-7 rounded-lg border border-[#2A3A4E] flex items-center justify-center text-slate-400 hover:text-white hover:border-[#3A4A5E] transition-colors">
                      <MoreHorizontal className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}