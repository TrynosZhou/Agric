export type WorkerType = "permanent" | "casual";
export type CasualPayMode = "day" | "task";

export interface Worker {
  id: string;
  name: string;
  type: WorkerType;
  wageRate?: string;
  monthlySalary?: string;
  casualPayMode: CasualPayMode;
  assignedTasks: string[];
}

export interface AttendanceRecord {
  id: string;
  attendanceDate: string;
  hoursWorked: string;
  taskPerformed?: string;
  allocationSystem?: "crop" | "livestock";
  allocationGroup?: string;
  worker: Worker;
}

export interface PayrollSummary {
  month: string;
  totals: {
    permanentMonthly: number;
    casual: number;
    totalLabourCost: number;
  };
  cropBreakdown: Array<{ group: string; cost: number }>;
  livestockBreakdown: Array<{ group: string; cost: number }>;
}
