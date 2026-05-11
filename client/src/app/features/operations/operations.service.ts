import { HttpClient } from "@angular/common/http";
import { Injectable, inject } from "@angular/core";
import { environment } from "../../../environments/environment";
import type { AssetRecord, IrrigationSystemRecord, MaintenanceScheduleEntry } from "./operations.models";

@Injectable({ providedIn: "root" })
export class OperationsService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiBaseUrl}/api/operations`;

  listAssets() {
    return this.http.get<AssetRecord[]>(`${this.baseUrl}/assets`);
  }

  createAsset(payload: {
    name: string;
    category: string;
    quantityAvailable: number;
    quantityInUse: number;
    condition: string;
    currentAssignedUser?: string;
  }) {
    return this.http.post<AssetRecord>(`${this.baseUrl}/assets`, payload);
  }

  logAssetUsage(assetId: string, payload: { quantityInUse: number; currentAssignedUser?: string }) {
    return this.http.post<AssetRecord>(`${this.baseUrl}/assets/${assetId}/usage-log`, payload);
  }

  listIrrigationSystems() {
    return this.http.get<IrrigationSystemRecord[]>(`${this.baseUrl}/irrigation-systems`);
  }

  createIrrigationSystem(payload: {
    systemType: string;
    coverageAreaOrCapacity?: string;
    powerSource: string;
    status: string;
  }) {
    return this.http.post<IrrigationSystemRecord>(`${this.baseUrl}/irrigation-systems`, payload);
  }

  addIrrigationMaintenanceDate(systemId: string, payload: { scheduledDate: string }) {
    return this.http.post<IrrigationSystemRecord>(
      `${this.baseUrl}/irrigation-systems/${systemId}/maintenance-schedule`,
      payload
    );
  }

  listMaintenanceSchedule() {
    return this.http.get<MaintenanceScheduleEntry[]>(`${this.baseUrl}/maintenance-schedule`);
  }
}
