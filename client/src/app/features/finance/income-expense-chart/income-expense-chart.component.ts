import { Component, computed, inject, signal } from "@angular/core";
import { FormBuilder, ReactiveFormsModule } from "@angular/forms";
import { FinanceService } from "../finance.service";

@Component({
  selector: "app-income-expense-chart",
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: "./income-expense-chart.component.html",
  styleUrl: "./income-expense-chart.component.scss"
})
export class IncomeExpenseChartComponent {
  private readonly financeService = inject(FinanceService);
  private readonly fb = inject(FormBuilder);

  readonly income = signal(0);
  readonly expense = signal(0);
  readonly error = signal<string | null>(null);

  readonly form = this.fb.nonNullable.group({
    from: [""],
    to: [""]
  });

  readonly maxValue = computed(() => Math.max(this.income(), this.expense(), 1));
  readonly incomePct = computed(() => (this.income() / this.maxValue()) * 100);
  readonly expensePct = computed(() => (this.expense() / this.maxValue()) * 100);

  constructor() {
    this.fetch();
  }

  fetch(): void {
    const { from, to } = this.form.getRawValue();
    this.financeService.getSummary({ from: from || undefined, to: to || undefined }).subscribe({
      next: (summary) => {
        this.income.set(summary.totalIncome);
        this.expense.set(summary.totalExpense);
      },
      error: () => this.error.set("Failed to load summary")
    });
  }
}

