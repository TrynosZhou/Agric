import { Component, inject, signal } from "@angular/core";
import { FormBuilder, ReactiveFormsModule, Validators } from "@angular/forms";
import { HayService } from "../hay.service";
import type { HayStock } from "../hay.models";

@Component({
  selector: "app-stock-overview",
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: "./stock-overview.component.html",
  styleUrl: "./stock-overview.component.scss"
})
export class StockOverviewComponent {
  private readonly hayService = inject(HayService);
  private readonly fb = inject(FormBuilder);

  readonly stock = signal<HayStock | null>(null);
  readonly error = signal<string | null>(null);

  readonly form = this.fb.nonNullable.group({
    totalBalesProduced: [0, [Validators.required, Validators.min(0)]],
    balesInStock: [0, [Validators.required, Validators.min(0)]],
    balesSold: [0, [Validators.required, Validators.min(0)]],
    pricePerBale: ["0", Validators.required],
    lowStockThreshold: [50, [Validators.required, Validators.min(0)]]
  });

  constructor() {
    this.load();
  }

  load(): void {
    this.hayService.getStock().subscribe({
      next: (stock) => {
        this.stock.set(stock);
        this.form.patchValue({
          totalBalesProduced: stock.totalBalesProduced,
          balesInStock: stock.balesInStock,
          balesSold: stock.balesSold,
          pricePerBale: stock.pricePerBale,
          lowStockThreshold: stock.lowStockThreshold
        });
      },
      error: () => this.error.set("Failed to load stock")
    });
  }

  save(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.hayService.updateStock(this.form.getRawValue()).subscribe({
      next: (stock) => this.stock.set({ ...stock, lowStock: stock.balesInStock < stock.lowStockThreshold }),
      error: (err: { error?: { message?: string } }) => this.error.set(err?.error?.message ?? "Failed to update stock")
    });
  }
}

