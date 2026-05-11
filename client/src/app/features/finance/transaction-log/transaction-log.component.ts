import { Component, computed, inject, signal } from "@angular/core";
import { FormBuilder, ReactiveFormsModule } from "@angular/forms";
import type { FinanceTransaction } from "../finance.models";
import { FinanceService } from "../finance.service";

@Component({
  selector: "app-transaction-log",
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: "./transaction-log.component.html",
  styleUrl: "./transaction-log.component.scss"
})
export class TransactionLogComponent {
  private readonly financeService = inject(FinanceService);
  private readonly fb = inject(FormBuilder);

  readonly rows = signal<FinanceTransaction[]>([]);
  readonly error = signal<string | null>(null);
  readonly loading = signal(false);
  readonly hasRows = computed(() => this.rows().length > 0);

  readonly form = this.fb.nonNullable.group({
    from: [""],
    to: [""],
    type: [""],
    category: [""]
  });

  constructor() {
    this.fetch();
  }

  fetch(): void {
    this.loading.set(true);
    this.error.set(null);
    const { from, to, type, category } = this.form.getRawValue();
    this.financeService.listTransactions({ from: from || undefined, to: to || undefined, type: type || undefined, category: category || undefined }).subscribe({
      next: (rows) => {
        this.rows.set(rows);
        this.loading.set(false);
      },
      error: (err: { error?: { message?: string } }) => {
        this.error.set(err?.error?.message ?? "Failed to load transactions");
        this.loading.set(false);
      }
    });
  }
}

