import DashboardLayout from "@/components/DashboardLayout";
import KPICards from "@/components/KPICards";
import RegionalMap from "@/components/RegionalMap";
import YieldLossGauge from "@/components/YieldLossGauge";
import PredictiveTimeline from "@/components/PredictiveTimeline";
import SiteTable from "@/components/SiteTable";

export default function Dashboard() {
  return (
    <DashboardLayout>
      <div className="space-y-5">
        {/* KPI Cards Row */}
        <KPICards />

        {/* Map + Gauge Row */}
        <div className="grid grid-cols-1 xl:grid-cols-5 gap-5">
          <div className="xl:col-span-3">
            <RegionalMap />
          </div>
          <div className="xl:col-span-2">
            <YieldLossGauge />
          </div>
        </div>

        {/* Predictive Timeline */}
        <PredictiveTimeline />

        {/* Site Table */}
        <SiteTable />
      </div>
    </DashboardLayout>
  );
}