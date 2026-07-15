export type DeviceStatus = 'PRODUCTION' | 'STANDBY' | 'CRITICAL' | 'DECOMMISSIONED';
export type Criticality = 'LOW' | 'MEDIUM' | 'HIGH';

export interface DeviceRequest {
  hostname: string;
  siteId: number;
  deviceRoleId: number;
  manufacturerId: number;
  model?: string;
  serialNumber?: string;
  managementIp?: string;
  os?: string;
  currentVersion?: string;
  rack?: string;
  rackPosition?: string;
  status: DeviceStatus;
  criticality?: Criticality;
  owner?: string;
  lastReview?: string;
}

export interface DeviceResponse {
  id: number;
  hostname: string;
  site: { id: number; nom: string; ville: string; pays: string; responsable?: string };
  deviceRole: { id: number; nom: string };
  manufacturer: { id: number; nom: string };
  model?: string;
  serialNumber?: string;
  managementIp?: string;
  os?: string;
  currentVersion?: string;
  rack?: string;
  rackPosition?: string;
  status: DeviceStatus;
  criticality?: Criticality;
  owner?: string;
  lastReview?: string;
  createdAt: string;
  updatedAt: string;
}