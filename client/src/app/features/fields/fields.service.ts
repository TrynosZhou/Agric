import { HttpClient } from "@angular/common/http";
import { Injectable, inject } from "@angular/core";
import { environment } from "../../../environments/environment";

export interface FieldRecord {
  id: string;
  name: string;
  sizeHectares: string;
  location?: string;
}

@Injectable({ providedIn: "root" })
export class FieldsService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiBaseUrl}/api/fields`;

  list() {
    return this.http.get<FieldRecord[]>(this.baseUrl);
  }

  create(payload: { name: string; sizeHectares: string; location?: string }) {
    return this.http.post<FieldRecord>(this.baseUrl, payload);
  }
}

