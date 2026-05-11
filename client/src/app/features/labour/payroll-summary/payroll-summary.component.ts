import { Component, inject, signal } from "@angular/core";
import { FormBuilder, ReactiveFormsModule, Validators } from "@angular/forms";
import type { PayrollSummary } from "../labour.models";
import { LabourService } from "../labour.service";

@Component({
  selector: "app-payroll-summary",
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: "./payroll-summary.component.html",
  styleUrl: "./payroll-summary.component.scss"
})
export class PayrollSummaryComponent {
  private readonly labourService = inject(LabourService);
  private readonly fb = inject(FormBuilder);

  readonly summary = signal<PayrollSummary | null>(null);
  readonly loading = signal(false);
  readonly error = signal<string | null>(null);

  readonly form = this.fb.nonNullable.group({
    month: ["", [Validators.required, Validators.pattern(/^\d{4}-\d{2}$/)]]
  });

  fetch(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const month = this.form.getRawValue().month;
    this.loading.set(true);
    this.error.set(null);
    this.labourService.getPayrollSummary(month).subscribe({
      next: (summary) => {
        this.summary.set(summary);
        this.loading.set(false);
      },
      error: (err: { error?: { message?: string } }) => {
        this.error.set(err?.error?.message ?? "Failed to load payroll summary");
        this.loading.set(false);
      }
    });
  }
}
