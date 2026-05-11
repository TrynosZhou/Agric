import { Component, Input, computed, inject, signal } from "@angular/core";
import { FormBuilder, ReactiveFormsModule, Validators } from "@angular/forms";
import { CropsService } from "../crops.service";
import type { CropRecord } from "../crop.models";

@Component({
  selector: "app-crop-activity-form",
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: "./crop-activity-form.component.html",
  styleUrl: "./crop-activity-form.component.scss"
})
export class CropActivityFormComponent {
  @Input({ required: true }) crop!: CropRecord;
  @Input({ required: true }) onSaved!: () => void;

  private readonly fb = inject(FormBuilder);
  private readonly cropsService = inject(CropsService);
  readonly busy = signal(false);
  readonly error = signal<string | null>(null);

  readonly activityForm = this.fb.nonNullable.group({
    activityType: ["fertilizer" as "fertilizer" | "pesticide", Validators.required],
    date: ["", Validators.required],
    product: ["", Validators.required],
    quantity: ["", Validators.required],
    notes: [""]
  });

  readonly detasselingForm = this.fb.nonNullable.group({
    assignedWorker: ["", Validators.required],
    rowsCompleted: [0, [Validators.required, Validators.min(0)]],
    field: [""],
    status: ["pending" as "pending" | "in-progress" | "done", Validators.required]
  });

  readonly harvestForm = this.fb.nonNullable.group({
    cycleNumber: [1, [Validators.required, Validators.min(1)]],
    harvestedOn: ["", Validators.required],
    quantityKg: ["", Validators.required],
    notes: [""]
  });

  readonly isSeedMaize = computed(() => this.crop?.cropType === "seed maize");
  readonly isTomatoes = computed(() => this.crop?.cropType === "tomatoes");

  submitActivity(): void {
    if (this.activityForm.invalid) {
      this.activityForm.markAllAsTouched();
      return;
    }
    this.busy.set(true);
    this.error.set(null);
    this.cropsService.logActivity(this.crop.id, this.activityForm.getRawValue()).subscribe({
      next: () => {
        this.busy.set(false);
        this.activityForm.reset({ activityType: "fertilizer", date: "", product: "", quantity: "", notes: "" });
        this.onSaved();
      },
      error: (err: { error?: { message?: string } }) => {
        this.busy.set(false);
        this.error.set(err?.error?.message ?? "Failed to save activity");
      }
    });
  }

  submitDetasseling(): void {
    if (this.detasselingForm.invalid) {
      this.detasselingForm.markAllAsTouched();
      return;
    }
    this.busy.set(true);
    this.error.set(null);
    const payload = this.detasselingForm.getRawValue();
    this.cropsService
      .addDetasselingTask(this.crop.id, { ...payload, field: payload.field || this.crop.fieldName })
      .subscribe({
        next: () => {
          this.busy.set(false);
          this.detasselingForm.reset({
            assignedWorker: "",
            rowsCompleted: 0,
            field: "",
            status: "pending"
          });
          this.onSaved();
        },
        error: (err: { error?: { message?: string } }) => {
          this.busy.set(false);
          this.error.set(err?.error?.message ?? "Failed to add detasseling task");
        }
      });
  }

  submitHarvestCycle(): void {
    if (this.harvestForm.invalid) {
      this.harvestForm.markAllAsTouched();
      return;
    }
    this.busy.set(true);
    this.error.set(null);
    this.cropsService.addHarvestCycle(this.crop.id, this.harvestForm.getRawValue()).subscribe({
      next: () => {
        this.busy.set(false);
        this.harvestForm.reset({ cycleNumber: 1, harvestedOn: "", quantityKg: "", notes: "" });
        this.onSaved();
      },
      error: (err: { error?: { message?: string } }) => {
        this.busy.set(false);
        this.error.set(err?.error?.message ?? "Failed to add harvest cycle");
      }
    });
  }
}
