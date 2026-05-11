import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable, inject } from "@angular/core";
import { environment } from "../../../environments/environment";
import type { AttendanceRecord, PayrollSummary, Worker } from "./labour.models";

@Injectable({ providedIn: "root" })
export class LabourService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiBaseUrl}/api/labour`;

  listWorkers() {
    return this.http.get<Worker[]>(`${this.baseUrl}/workers`);
  }

  createWorker(payload: {
    name: string;
    type: "permanent" | "casual";
    wageRate?: string;
    monthlySalary?: string;
    casualPayMode?: "day" | "task";
    assignedTasks: string[];
  }) {
    return this.http.post<Worker>(`${this.baseUrl}/workers`, payload);
  }

  listAttendance(from?: string, to?: string) {
    let params = new HttpParams();
    if (from) params = params.set("from", from);
    if (to) params = params.set("to", to);
    return this.http.get<AttendanceRecord[]>(`${this.baseUrl}/attendance`, { params });
  }

  captureAttendance(payload: {
    workerId: string;
    date: string;
    hoursWorked: string;
    taskPerformed: string;
    allocationSystem: "crop" | "livestock";
    allocationGroup: string;
  }) {
    return this.http.post(`${this.baseUrl}/attendance`, payload);
  }

  getPayrollSummary(month: string) {
    return this.http.get<PayrollSummary>(`${this.baseUrl}/payroll-summary`, {
      params: new HttpParams().set("month", month)
    });
  }
}
