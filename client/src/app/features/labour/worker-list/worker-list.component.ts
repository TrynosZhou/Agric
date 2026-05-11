import { Component, computed, inject, signal } from "@angular/core";
import { FormBuilder, ReactiveFormsModule, Validators } from "@angular/forms";
import { LabourService } from "../labour.service";
import type { Worker } from "../labour.models";

@Component({
  selector: "app-worker-list",
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: "./worker-list.component.html",
  styleUrl: "./worker-list.component.scss"
})
export class WorkerListComponent {
  private readonly labourService = inject(LabourService);
  private readonly fb = inject(FormBuilder);

  readonly workers = signal<Worker[]>([]);
  readonly loading = signal(false);
  readonly error = signal<string | null>(null);
  readonly query = signal("");

  readonly filteredWorkers = computed(() => {
    const q = this.query().trim().toLowerCase();
    const list = this.workers();
    if (!q) return list;
    return list.filter((w) => w.name.toLowerCase().includes(q) || w.type.toLowerCase().includes(q));
  });

  readonly hasWorkers = computed(() => this.filteredWorkers().length > 0);

  readonly form = this.fb.nonNullable.group({
    name: ["", Validators.required],
    type: ["casual" as "permanent" | "casual", Validators.required],
    wageRate: [""],
    monthlySalary: [""],
    casualPayMode: ["day" as "day" | "task", Validators.required],
    assignedTasks: [""]
  });

  constructor() {
    this.load();
  }

  load(): void {
    this.loading.set(true);
    this.error.set(null);
    this.labourService.listWorkers().subscribe({
      next: (workers) => {
        this.workers.set(workers);
        this.loading.set(false);
      },
      error: (err: { error?: { message?: string } }) => {
        this.error.set(err?.error?.message ?? "Failed to load workers");
        this.loading.set(false);
      }
    });
  }

  save(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const raw = this.form.getRawValue();
    const assignedTasks = raw.assignedTasks
      .split(",")
      .map((task) => task.trim())
      .filter(Boolean);
    this.labourService
      .createWorker({
        name: raw.name,
        type: raw.type,
        wageRate: raw.wageRate || undefined,
        monthlySalary: raw.monthlySalary || undefined,
        casualPayMode: raw.casualPayMode,
        assignedTasks
      })
      .subscribe({
        next: () => {
          this.form.reset({
            name: "",
            type: "casual",
            wageRate: "",
            monthlySalary: "",
            casualPayMode: "day",
            assignedTasks: ""
          });
          this.load();
        },
        error: (err: { error?: { message?: string } }) => {
          this.error.set(err?.error?.message ?? "Failed to create worker");
        }
      });
  }
}
