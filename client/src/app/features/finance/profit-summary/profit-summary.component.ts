import { Component, inject, signal } from "@angular/core";
import { FormBuilder, ReactiveFormsModule } from "@angular/forms";
import type { FinanceSummary } from "../finance.models";
import { FinanceService } from "../finance.service";

@Component({
  selector: "app-profit-summary",
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: "./profit-summary.component.html",
  styleUrl: "./profit-summary.component.scss"
})
export class ProfitSummaryComponent {
  private readonly financeService = inject(FinanceService);
  private readonly fb = inject(FormBuilder);

  readonly summary = signal<FinanceSummary | null>(null);
  readonly error = signal<string | null>(null);

  readonly form = this.fb.nonNullable.group({
    from: [""],
    to: [""]
  });

  constructor() {
    this.fetch();
  }

  fetch(): void {
    const { from, to } = this.form.getRawValue();
    this.financeService.getSummary({ from: from || undefined, to: to || undefined }).subscribe({
      next: (summary) => this.summary.set(summary),
      error: () => this.error.set("Failed to load profit summary")
    });
  }
}

