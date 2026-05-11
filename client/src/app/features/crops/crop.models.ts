export type CropType = "barley" | "seed maize" | "tomatoes" | "custom";
export type DetasselingStatus = "pending" | "in-progress" | "done";

export interface CropActivityRecord {
  date: string;
  product: string;
  quantity: string;
  notes?: string;
}

export interface DetasselingTask {
  id: string;
  assignedWorker: string;
  rowsCompleted: number;
  field: string;
  status: DetasselingStatus;
}

export interface TomatoHarvestCycle {
  id: string;
  cycleNumber: number;
  harvestedOn: string;
  quantityKg: string;
  notes?: string;
}

export interface CropRecord {
  id: string;
  cropType: CropType;
  customCropType?: string;
  fieldName: string;
  plantingDate: string;
  growthStage: string;
  irrigationSchedule?: string;
  estimatedYield?: string;
  fertilizerApplications: CropActivityRecord[];
  pesticideApplications: CropActivityRecord[];
  detasselingTasks: DetasselingTask[];
  harvestCycles: TomatoHarvestCycle[];
}
