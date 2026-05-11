import { Component, computed, inject, signal } from "@angular/core";
import { FormBuilder, ReactiveFormsModule, Validators } from "@angular/forms";
import type { IrrigationSystemRecord, MaintenanceScheduleEntry } from "../operations.models";
import { OperationsService } from "../operations.service";

@Component({
  selector: "app-maintenance-schedule",
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: "./maintenance-schedule.component.html",
  styleUrl: "./maintenance-schedule.component.scss"
})
export class MaintenanceScheduleComponent {
  private readonly operationsService = inject(OperationsService);
  private readonly fb = inject(FormBuilder);

  readonly systems = signal<IrrigationSystemRecord[]>([]);
  readonly entries = signal<MaintenanceScheduleEntry[]>([]);
  readonly error = signal<string | null>(null);
  readonly hasEntries = computed(() => this.entries().length > 0);

  readonly form = this.fb.nonNullable.group({
    systemId: ["", Validators.required],
    scheduledDate: ["", Validators.required]
  });

  constructor() {
    this.reload();
  }

  reload(): void {
    this.operationsService.listIrrigationSystems().subscribe({
      next: (systems) => this.systems.set(systems),
      error: () => this.error.set("Failed to load irrigation systems")
    });
    this.operationsService.listMaintenanceSchedule().subscribe({
      next: (entries) => this.entries.set(entries),
      error: () => this.error.set("Failed to load maintenance schedule")
    });
  }

  addSchedule(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const raw = this.form.getRawValue();
    this.operationsService.addIrrigationMaintenanceDate(raw.systemId, { scheduledDate: raw.scheduledDate }).subscribe({
      next: () => {
        this.form.reset({ systemId: "", scheduledDate: "" });
        this.reload();
      },
      error: (err: { error?: { message?: string } }) => {
        this.error.set(err?.error?.message ?? "Failed to add maintenance date");
      }
    });
  }
}
