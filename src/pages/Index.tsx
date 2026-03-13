import DashboardLayout from "@/components/DashboardLayout";
import KPICards from "@/components/KPICards";
import RegionalMap from "@/components/RegionalMap";
import YieldLossGauge from "@/components/YieldLossGauge";
import PredictiveTimeline from "@/components/PredictiveTimeline";
import SiteTable from "@/components/SiteTable";
import { useDashboardMetrics } from "@/hooks/useDashboardMetrics";
import { Loader2, ServerCrash } from "lucide-react";

export default function Dashboard() {
  const { data, isLoading, isError } = useDashboardMetrics();

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center h-[70vh] gap-4">
          <Loader2 className="w-8 h-8 text-amber-500 animate-spin" />
          <p className="text-sm text-slate-400 font-medium animate-pulse">
            Chargement des prédictions de l'Intelligence Artificielle...
          </p>
        </div>
      </DashboardLayout>
    );
  }

  if (isError || !data) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center h-[70vh] gap-3">
          <ServerCrash className="w-10 h-10 text-red-500" />
          <p className="text-base text-white font-medium">
            Erreur de connexion au modèle IA
          </p>
          <p className="text-sm text-slate-400">
            Vérifiez que le backend Django est en cours d'exécution.
          </p>
        </div>
      </DashboardLayout>
    );
  }

  // Extract strictly the site owned by the logged in enterprise
  const ownedSite = data.sites.find(s => s.is_owned) || data.sites[0];

  return (
    <DashboardLayout>
      <div className="space-y-5">
        {/* KPI Cards Row */}
        <KPICards kpiData={data.kpi} />

        {/* Map + Gauge Row */}
        <div className="grid grid-cols-1 xl:grid-cols-5 gap-5">
          <div className="xl:col-span-3">
            <RegionalMap sites={data.sites} />
          </div>
          <div className="xl:col-span-2">
            <YieldLossGauge sites={[ownedSite]} />
          </div>
        </div>

        {/* Predictive Timeline */}
        <PredictiveTimeline forecasts={data.forecasts} siteName={ownedSite.name} />

        {/* Site Table */}
        <SiteTable sites={[ownedSite]} />
      </div>
    </DashboardLayout>
  );
}