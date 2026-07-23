export interface DashboardStats {
  totalDevices: number;
  totalSites: number;
  totalManufacturers: number;
  productionCount: number;
  standbyCount: number;
  criticalCount: number;
  decommissionedCount: number;
  devicesBySite: Record<string, number>;
  devicesByManufacturer: Record<string, number>;
  devicesByRole: Record<string, number>;
}