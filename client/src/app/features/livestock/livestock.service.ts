import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable, inject } from "@angular/core";
import { environment } from "../../../environments/environment";
import type { LivestockListResponse, LivestockTypeFilter } from "./livestock.models";

@Injectable({ providedIn: "root" })
export class LivestockService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiBaseUrl}/api/livestock`;

  list(type: LivestockTypeFilter, species?: string) {
    let params = new HttpParams().set("type", type);
    if (species) params = params.set("species", species);
    return this.http.get<LivestockListResponse>(this.baseUrl, { params });
  }

  getAnimal(id: string) {
    return this.http.get(`${this.baseUrl}/animals/${id}`);
  }

  createAnimal(payload: { species: string; tagIdNumber: string; dateOfBirth: string }) {
    return this.http.post(`${this.baseUrl}/animals`, payload);
  }

  logHealthEvent(
    animalId: string,
    payload: {
      eventType: string;
      date: string;
      weightKg?: string;
      vaccineType?: string;
      nextDueDate?: string;
      product?: string;
      treatment?: string;
      diagnosis?: string;
      liters?: string;
      notes?: string;
    }
  ) {
    return this.http.post(`${this.baseUrl}/animals/${animalId}/health-events`, payload);
  }

  createPoultryBatch(payload: {
    batchCode: string;
    flockSize: number;
    mortalityCount?: number;
    feedConsumptionKg?: string;
    eggProduction?: number;
  }) {
    return this.http.post(`${this.baseUrl}/poultry-batches`, payload);
  }
}
