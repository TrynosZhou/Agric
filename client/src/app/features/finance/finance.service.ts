import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable, inject } from "@angular/core";
import { environment } from "../../../environments/environment";
import type { FinanceSummary, FinanceTransaction } from "./finance.models";

@Injectable({ providedIn: "root" })
export class FinanceService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiBaseUrl}/api/finance`;

  listTransactions(params: { from?: string; to?: string; type?: string; category?: string }) {
    let httpParams = new HttpParams();
    if (params.from) httpParams = httpParams.set("from", params.from);
    if (params.to) httpParams = httpParams.set("to", params.to);
    if (params.type) httpParams = httpParams.set("type", params.type);
    if (params.category) httpParams = httpParams.set("category", params.category);
    return this.http.get<FinanceTransaction[]>(`${this.baseUrl}/transactions`, { params: httpParams });
  }

  getSummary(params: { from?: string; to?: string }) {
    let httpParams = new HttpParams();
    if (params.from) httpParams = httpParams.set("from", params.from);
    if (params.to) httpParams = httpParams.set("to", params.to);
    return this.http.get<FinanceSummary>(`${this.baseUrl}/summary`, { params: httpParams });
  }
}

