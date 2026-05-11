import { Component, computed, inject, signal } from "@angular/core";
import { FormBuilder, ReactiveFormsModule, Validators } from "@angular/forms";
import type { IrrigationSystemRecord } from "../operations.models";
import { OperationsService } from "../operations.service";

@Component({
  selector: "app-irrigation-status-dashboard",
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: "./irrigation-status-dashboard.component.html",
  styleUrl: "./irrigation-status-dashboard.component.scss"
})
export class IrrigationStatusDashboardComponent {
  private readonly operationsService = inject(OperationsService);
  private readonly fb = inject(FormBuilder);

  readonly systems = signal<IrrigationSystemRecord[]>([]);
  readonly error = signal<string | null>(null);
  readonly hasSystems = computed(() => this.systems().length > 0);

  readonly form = this.fb.nonNullable.group({
    systemType: ["center pivot", Validators.required],
    coverageAreaOrCapacity: [""],
    powerSource: ["diesel", Validators.required],
    status: ["inactive", Validators.required]
  });

  constructor() {
    this.load();
  }

  load(): void {
    this.operationsService.listIrrigationSystems().subscribe({
      next: (systems) => this.systems.set(systems),
      error: () => this.error.set("Failed to load irrigation systems")
    });
  }

  create(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.operationsService.createIrrigationSystem(this.form.getRawValue()).subscribe({
      next: () => {
        this.form.reset({
          systemType: "center pivot",
          coverageAreaOrCapacity: "",
          powerSource: "diesel",
          status: "inactive"
        });
        this.load();
      },
      error: (err: { error?: { message?: string } }) => {
        this.error.set(err?.error?.message ?? "Failed to create irrigation system");
      }
    });
  }
}
