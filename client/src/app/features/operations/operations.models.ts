export type AssetCategory = "machinery" | "tool" | "vehicle" | "irrigation";
export type AssetCondition = "good" | "fair" | "damaged";
export type IrrigationType = "center pivot" | "pump";
export type IrrigationPowerSource = "diesel" | "electric" | "solar";
export type IrrigationStatus = "active" | "faulty" | "inactive";

export interface AssetRecord {
  id: string;
  name: string;
  category: AssetCategory;
  quantityAvailable: number;
  quantityInUse: number;
  condition: AssetCondition;
  currentAssignedUser?: string;
  maintenanceLogEntries: Array<{
    date: string;
    description: string;
    performedBy?: string;
    nextDueDate?: string;
  }>;
}

export interface IrrigationSystemRecord {
  id: string;
  systemType: IrrigationType;
  coverageAreaOrCapacity?: string;
  powerSource: IrrigationPowerSource;
  status: IrrigationStatus;
  waterUsageLog: Array<{ date: string; usageLiters: string }>;
  fuelUsageLog: Array<{ date: string; amount: string; unit: "liters" | "kwh" }>;
  scheduledMaintenanceDates: string[];
}

export interface MaintenanceScheduleEntry {
  sourceType: "asset" | "irrigation";
  sourceId: string;
  sourceName: string;
  scheduledDate: string;
}
