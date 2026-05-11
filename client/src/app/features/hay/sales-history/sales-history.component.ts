import { Component, computed, inject, signal } from "@angular/core";
import type { HaySale, PaymentStatus } from "../hay.models";
import { HayService } from "../hay.service";

@Component({
  selector: "app-sales-history",
  standalone: true,
  templateUrl: "./sales-history.component.html",
  styleUrl: "./sales-history.component.scss"
})
export class SalesHistoryComponent {
  private readonly hayService = inject(HayService);

  readonly sales = signal<HaySale[]>([]);
  readonly error = signal<string | null>(null);
  readonly hasSales = computed(() => this.sales().length > 0);

  constructor() {
    this.load();
  }

  load(): void {
    this.hayService.listSales().subscribe({
      next: (sales) => this.sales.set(sales),
      error: () => this.error.set("Failed to load sales history")
    });
  }

  setPaymentStatus(sale: HaySale, status: PaymentStatus): void {
    this.hayService.updateSalePaymentStatus(sale.id, status).subscribe({
      next: () => this.load(),
      error: () => this.error.set("Failed to update payment status")
    });
  }
}

