import { Component, computed, inject, signal } from "@angular/core";
import { FormBuilder, ReactiveFormsModule, Validators } from "@angular/forms";
import type { HayCustomer } from "../hay.models";
import { HayService } from "../hay.service";

@Component({
  selector: "app-customer-list",
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: "./customer-list.component.html",
  styleUrl: "./customer-list.component.scss"
})
export class CustomerListComponent {
  private readonly hayService = inject(HayService);
  private readonly fb = inject(FormBuilder);

  readonly customers = signal<HayCustomer[]>([]);
  readonly error = signal<string | null>(null);
  readonly hasCustomers = computed(() => this.customers().length > 0);

  readonly form = this.fb.nonNullable.group({
    fullName: ["", Validators.required],
    phoneNumber: [""],
    email: [""]
  });

  constructor() {
    this.load();
  }

  load(): void {
    this.hayService.listCustomers().subscribe({
      next: (customers) => this.customers.set(customers),
      error: () => this.error.set("Failed to load customers")
    });
  }

  create(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const raw = this.form.getRawValue();
    this.hayService.createCustomer(raw).subscribe({
      next: () => {
        this.form.reset({ fullName: "", phoneNumber: "", email: "" });
        this.load();
      },
      error: (err: { error?: { message?: string } }) => this.error.set(err?.error?.message ?? "Failed to create customer")
    });
  }
}

