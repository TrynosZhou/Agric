import { Component, Input, inject, signal } from "@angular/core";
import { FormBuilder, ReactiveFormsModule, Validators } from "@angular/forms";
import { LivestockService } from "../livestock.service";

@Component({
  selector: "app-health-events-form",
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: "./health-events-form.component.html",
  styleUrl: "./health-events-form.component.scss"
})
export class HealthEventsFormComponent {
  @Input({ required: true }) animalId!: string;
  @Input({ required: true }) species!: string;
  @Input({ required: true }) onSaved!: () => void;

  private readonly fb = inject(FormBuilder);
  private readonly livestockService = inject(LivestockService);

  readonly busy = signal(false);
  readonly error = signal<string | null>(null);

  readonly form = this.fb.nonNullable.group({
    eventType: ["vaccination", Validators.required],
    date: ["", Validators.required],
    weightKg: [""],
    vaccineType: [""],
    nextDueDate: [""],
    product: [""],
    treatment: [""],
    diagnosis: [""],
    liters: [""],
    notes: [""]
  });

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.error.set(null);
    this.busy.set(true);
    this.livestockService.logHealthEvent(this.animalId, this.form.getRawValue()).subscribe({
      next: () => {
        this.busy.set(false);
        this.form.reset({
          eventType: "vaccination",
          date: "",
          weightKg: "",
          vaccineType: "",
          nextDueDate: "",
          product: "",
          treatment: "",
          diagnosis: "",
          liters: "",
          notes: ""
        });
        this.onSaved();
      },
      error: (err: { error?: { message?: string } }) => {
        this.busy.set(false);
        this.error.set(err?.error?.message ?? "Failed to save health event");
      }
    });
  }
}
