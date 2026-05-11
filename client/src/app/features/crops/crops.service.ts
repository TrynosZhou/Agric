import { HttpClient } from "@angular/common/http";
import { Injectable, inject } from "@angular/core";
import { environment } from "../../../environments/environment";
import type { CropRecord } from "./crop.models";

@Injectable({ providedIn: "root" })
export class CropsService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiBaseUrl}/api/crops`;

  list() {
    return this.http.get<CropRecord[]>(this.baseUrl);
  }

  getById(id: string) {
    return this.http.get<CropRecord>(`${this.baseUrl}/${id}`);
  }

  create(payload: {
    cropType: string;
    customCropType?: string;
    fieldId: string;
    plantingDate: string;
    growthStage: string;
    irrigationSchedule?: string;
    estimatedYield?: string;
  }) {
    return this.http.post<CropRecord>(this.baseUrl, payload);
  }

  update(
    id: string,
    payload: Partial<{
      cropType: string;
      customCropType?: string;
      fieldId: string;
      plantingDate: string;
      growthStage: string;
      irrigationSchedule?: string;
      estimatedYield?: string;
    }>
  ) {
    return this.http.put<CropRecord>(`${this.baseUrl}/${id}`, payload);
  }

  remove(id: string) {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

  logActivity(
    cropId: string,
    payload: { activityType: "fertilizer" | "pesticide"; date: string; product: string; quantity: string; notes?: string }
  ) {
    return this.http.post<CropRecord>(`${this.baseUrl}/${cropId}/activities`, payload);
  }

  addDetasselingTask(
    cropId: string,
    payload: { assignedWorker: string; rowsCompleted: number; field: string; status: "pending" | "in-progress" | "done" }
  ) {
    return this.http.post(`${this.baseUrl}/${cropId}/detasseling-tasks`, payload);
  }

  addHarvestCycle(cropId: string, payload: { cycleNumber: number; harvestedOn: string; quantityKg: string; notes?: string }) {
    return this.http.post(`${this.baseUrl}/${cropId}/harvest-cycles`, payload);
  }
}
