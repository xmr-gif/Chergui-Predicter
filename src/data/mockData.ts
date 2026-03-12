// Mock data for Bouclier Solaire Dashboard

export interface SolarSite {
  id: string;
  name: string;
  lat: number;
  lng: number;
  capacityMW: number;
  currentOutputMW: number;
  dustLevel: number; // 0-100
  status: "operational" | "warning" | "critical" | "maintenance";
  nextCleaning: string;
  yieldLossMAD: number;
  efficiency: number; // percentage
}

export interface CherguiForecast {
  date: string;
  day: string;
  windSpeedKmh: number;
  dustProbability: number; // 0-100
  energyImpactPercent: number; // negative = loss
  temperature: number;
  visibility: string;
}

export interface KPIData {
  totalOutputMW: number;
  totalOutputChange: number;
  cleaningEfficiency: number;
  cleaningEfficiencyChange: number;
  activeAlerts: number;
  alertsChange: number;
  costSavingsMAD: number;
  costSavingsChange: number;
}

export const solarSites: SolarSite[] = [
  {
    id: "abm",
    name: "Ain Beni Mathar",
    lat: 34.0,
    lng: -2.05,
    capacityMW: 472,
    currentOutputMW: 389,
    dustLevel: 34,
    status: "operational",
    nextCleaning: "2026-03-13 06:00",
    yieldLossMAD: 128500,
    efficiency: 82.4,
  },
  {
    id: "bouarfa",
    name: "Bouarfa",
    lat: 32.52,
    lng: -1.95,
    capacityMW: 320,
    currentOutputMW: 241,
    dustLevel: 58,
    status: "warning",
    nextCleaning: "2026-03-12 05:30",
    yieldLossMAD: 245300,
    efficiency: 75.3,
  },
  {
    id: "jerada",
    name: "Jerada",
    lat: 34.31,
    lng: -2.16,
    capacityMW: 185,
    currentOutputMW: 162,
    dustLevel: 22,
    status: "operational",
    nextCleaning: "2026-03-14 06:00",
    yieldLossMAD: 54200,
    efficiency: 87.6,
  },
  {
    id: "figuig",
    name: "Figuig",
    lat: 32.11,
    lng: -1.23,
    capacityMW: 250,
    currentOutputMW: 158,
    dustLevel: 72,
    status: "critical",
    nextCleaning: "2026-03-11 14:00",
    yieldLossMAD: 389700,
    efficiency: 63.2,
  },
  {
    id: "oujda",
    name: "Oujda Solar Park",
    lat: 34.68,
    lng: -1.91,
    capacityMW: 210,
    currentOutputMW: 185,
    dustLevel: 18,
    status: "operational",
    nextCleaning: "2026-03-15 06:00",
    yieldLossMAD: 42100,
    efficiency: 88.1,
  },
  {
    id: "tendrara",
    name: "Tendrara",
    lat: 33.05,
    lng: -2.02,
    capacityMW: 150,
    currentOutputMW: 98,
    dustLevel: 65,
    status: "warning",
    nextCleaning: "2026-03-12 07:00",
    yieldLossMAD: 198400,
    efficiency: 65.3,
  },
];

export const cherguiForecast: CherguiForecast[] = [
  {
    date: "2026-03-11",
    day: "Today",
    windSpeedKmh: 45,
    dustProbability: 72,
    energyImpactPercent: -18,
    temperature: 31,
    visibility: "Low",
  },
  {
    date: "2026-03-12",
    day: "Thu",
    windSpeedKmh: 62,
    dustProbability: 88,
    energyImpactPercent: -32,
    temperature: 34,
    visibility: "Very Low",
  },
  {
    date: "2026-03-13",
    day: "Fri",
    windSpeedKmh: 78,
    dustProbability: 95,
    energyImpactPercent: -45,
    temperature: 37,
    visibility: "Critical",
  },
  {
    date: "2026-03-14",
    day: "Sat",
    windSpeedKmh: 55,
    dustProbability: 70,
    energyImpactPercent: -25,
    temperature: 33,
    visibility: "Low",
  },
  {
    date: "2026-03-15",
    day: "Sun",
    windSpeedKmh: 35,
    dustProbability: 42,
    energyImpactPercent: -12,
    temperature: 29,
    visibility: "Moderate",
  },
  {
    date: "2026-03-16",
    day: "Mon",
    windSpeedKmh: 20,
    dustProbability: 18,
    energyImpactPercent: -5,
    temperature: 26,
    visibility: "Good",
  },
  {
    date: "2026-03-17",
    day: "Tue",
    windSpeedKmh: 12,
    dustProbability: 8,
    energyImpactPercent: -2,
    temperature: 24,
    visibility: "Excellent",
  },
];

export const kpiData: KPIData = {
  totalOutputMW: 1233,
  totalOutputChange: -8.2,
  cleaningEfficiency: 91.4,
  cleaningEfficiencyChange: 3.1,
  activeAlerts: 7,
  alertsChange: 2,
  costSavingsMAD: 1847000,
  costSavingsChange: 12.5,
};

export const yieldLossData = {
  currentLossMAD: 1058200,
  maxLossMAD: 3000000,
  dailyLossMAD: 458700,
  monthlyLossMAD: 8234500,
  trend: "increasing" as const,
};

// Map coordinates for Oriental Morocco region (simplified SVG path data)
export const orientalRegionPath =
  "M 120 20 L 280 15 L 320 45 L 340 120 L 330 200 L 310 280 L 280 340 L 220 360 L 160 350 L 100 310 L 80 240 L 70 180 L 85 100 L 100 50 Z";

export const algerianBorderPath =
  "M 340 120 L 360 80 L 370 40 L 380 10";

export const siteMapPositions: Record<string, { x: number; y: number }> = {
  abm: { x: 195, y: 105 },
  bouarfa: { x: 210, y: 230 },
  jerada: { x: 175, y: 80 },
  figuig: { x: 265, y: 295 },
  oujda: { x: 200, y: 45 },
  tendrara: { x: 205, y: 175 },
};