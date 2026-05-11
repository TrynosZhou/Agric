import { Component, computed, inject, signal } from "@angular/core";
import { FormBuilder, ReactiveFormsModule, Validators } from "@angular/forms";
import type { HayCustomer, HayStock } from "../hay.models";
import { HayService } from "../hay.service";

@Component({
  selector: "app-new-sale",
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: "./new-sale.component.html",
  styleUrl: "./new-sale.component.scss"
})
export class NewSaleComponent {
  private readonly hayService = inject(HayService);
  private readonly fb = inject(FormBuilder);

  readonly customers = signal<HayCustomer[]>([]);
  readonly stock = signal<HayStock | null>(null);
  readonly error = signal<string | null>(null);
  readonly hasCustomers = computed(() => this.customers().length > 0);

  readonly form = this.fb.nonNullable.group({
    customerId: ["", Validators.required],
    quantity: [1, [Validators.required, Validators.min(1)]],
    price: ["0", Validators.required],
    saleDate: ["", Validators.required],
    paymentStatus: ["pending" as "paid" | "pending", Validators.required]
  });

  constructor() {
    this.load();
  }

  load(): void {
    this.hayService.listCustomers().subscribe({
      next: (customers) => this.customers.set(customers),
      error: () => this.error.set("Failed to load customers")
    });
    this.hayService.getStock().subscribe({
      next: (stock) => {
        this.stock.set(stock);
        this.form.patchValue({ price: stock.pricePerBale });
      },
      error: () => this.error.set("Failed to load stock")
    });
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.error.set(null);
    this.hayService.createSale(this.form.getRawValue()).subscribe({
      next: () => {
        this.form.reset({ customerId: "", quantity: 1, price: this.stock()?.pricePerBale ?? "0", saleDate: "", paymentStatus: "pending" });
        this.load();
      },
      error: (err: { error?: { message?: string } }) => this.error.set(err?.error?.message ?? "Failed to record sale")
    });
  }
}

