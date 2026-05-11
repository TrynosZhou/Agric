import { HttpClient } from "@angular/common/http";
import { Injectable, inject } from "@angular/core";
import { environment } from "../../../environments/environment";
import type { HayCustomer, HaySale, HayStock, PaymentStatus } from "./hay.models";

@Injectable({ providedIn: "root" })
export class HayService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiBaseUrl}/api/hay`;

  getStock() {
    return this.http.get<HayStock>(`${this.baseUrl}/stock`);
  }

  updateStock(payload: Partial<Omit<HayStock, "id" | "lowStock">>) {
    return this.http.put<HayStock>(`${this.baseUrl}/stock`, payload);
  }

  listCustomers() {
    return this.http.get<HayCustomer[]>(`${this.baseUrl}/customers`);
  }

  createCustomer(payload: { fullName: string; phoneNumber?: string; email?: string }) {
    return this.http.post<HayCustomer>(`${this.baseUrl}/customers`, payload);
  }

  listSales() {
    return this.http.get<HaySale[]>(`${this.baseUrl}/sales`);
  }

  createSale(payload: { customerId: string; quantity: number; price: string; saleDate: string; paymentStatus: PaymentStatus }) {
    return this.http.post<{ sale: HaySale; stock: { balesInStock: number; balesSold: number; lowStock: boolean } }>(
      `${this.baseUrl}/sales`,
      payload
    );
  }

  updateSalePaymentStatus(saleId: string, paymentStatus: PaymentStatus) {
    return this.http.put<HaySale>(`${this.baseUrl}/sales/${saleId}/payment-status`, { paymentStatus });
  }
}

