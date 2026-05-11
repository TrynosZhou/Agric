import { HttpClient } from "@angular/common/http";
import { Injectable, inject } from "@angular/core";
import { environment } from "../../../environments/environment";

export interface DashboardSummary {
  generatedAt: string;
  crops: { active: Array<{ id: string; fieldName: string; cropType: string; growthStage: string }> };
  livestock: { counts: Record<string, number> };
  labour: { attendanceTodayCount: number; totalWageCostThisMonth: number; month: string };
  assets: { total: number; inUse: number; damaged: number };
  irrigation: { active: number; faulty: number };
  finance: { month: string; income: number; expenses: number; netProfit: number };
  recentAlerts: Array<{
    id: string;
    title: string;
    message: string;
    priority: "warning" | "critical";
    status: "read" | "unread";
    module: string;
    createdAt: string;
  }>;
}

@Injectable({ providedIn: "root" })
export class DashboardService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiBaseUrl}/api/dashboard`;

  getSummary() {
    return this.http.get<DashboardSummary>(`${this.baseUrl}/summary`);
  }
}

