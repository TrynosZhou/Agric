import { Component, computed, inject, signal } from "@angular/core";
import { FormBuilder, ReactiveFormsModule, Validators } from "@angular/forms";
import { LabourService } from "../labour.service";
import type { AttendanceRecord, Worker } from "../labour.models";

@Component({
  selector: "app-attendance-capture",
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: "./attendance-capture.component.html",
  styleUrl: "./attendance-capture.component.scss"
})
export class AttendanceCaptureComponent {
  private readonly labourService = inject(LabourService);
  private readonly fb = inject(FormBuilder);

  readonly workers = signal<Worker[]>([]);
  readonly records = signal<AttendanceRecord[]>([]);
  readonly loading = signal(false);
  readonly error = signal<string | null>(null);
  readonly hasRecords = computed(() => this.records().length > 0);

  readonly form = this.fb.nonNullable.group({
    workerId: ["", Validators.required],
    date: ["", Validators.required],
    hoursWorked: ["8", Validators.required],
    taskPerformed: ["", Validators.required],
    allocationSystem: ["crop" as "crop" | "livestock", Validators.required],
    allocationGroup: ["", Validators.required]
  });

  constructor() {
    this.loadWorkers();
    this.loadAttendance();
  }

  loadWorkers(): void {
    this.labourService.listWorkers().subscribe({
      next: (workers) => this.workers.set(workers),
      error: () => this.error.set("Failed to load workers")
    });
  }

  loadAttendance(): void {
    this.loading.set(true);
    this.labourService.listAttendance().subscribe({
      next: (records) => {
        this.records.set(records);
        this.loading.set(false);
      },
      error: (err: { error?: { message?: string } }) => {
        this.error.set(err?.error?.message ?? "Failed to load attendance");
        this.loading.set(false);
      }
    });
  }

  save(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.labourService.captureAttendance(this.form.getRawValue()).subscribe({
      next: () => {
        this.form.reset({
          workerId: "",
          date: "",
          hoursWorked: "8",
          taskPerformed: "",
          allocationSystem: "crop",
          allocationGroup: ""
        });
        this.loadAttendance();
      },
      error: (err: { error?: { message?: string } }) => {
        this.error.set(err?.error?.message ?? "Failed to capture attendance");
      }
    });
  }
}
