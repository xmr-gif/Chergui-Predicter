import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export interface Forecast {
  date: string;
  day: string;
  windSpeedKmh: number;
  dustProbability: number;
  energyImpactPercent: number;
  temperature: number;
  visibility: string;
}

export interface Site {
  id: string;
  name: string;
  lat: number;
  lng: number;
  capacityMW: number;
  currentOutputMW: number;
  dustLevel: number;
  status: "operational" | "warning" | "critical" | "maintenance";
  nextCleaning: string;
  yieldLossMAD: number;
  efficiency: number;
  is_owned: boolean;
}

export interface KPI {
  totalOutputMW: number;
  totalOutputChange: number;
  cleaningEfficiency: number;
  cleaningEfficiencyChange: number;
  activeAlerts: number;
  alertsChange: number;
  costSavingsMAD: number;
  costSavingsChange: number;
}

export interface Alert {
  id: string;
  type: "warning" | "info" | "critical";
  title: string;
  message: string;
  date: string;
}

export interface DashboardData {
  forecasts: Forecast[];
  sites: Site[];
  kpi: KPI;
  alerts: Alert[];
}

export function useDashboardMetrics() {
  return useQuery({
    queryKey: ["dashboardMetrics"],
    queryFn: async () => {
      const { data } = await axios.get<DashboardData>("/api/dashboard/metrics/");
      return data;
    },
    // Refresh every 30 seconds for real-time feel
    refetchInterval: 30000,
    retry: 1, // Fail fast on errors to prevent long loading states
  });
}
