import { HttpClient } from "@angular/common/http";
import { Component, computed, inject, signal } from "@angular/core";
import { FormBuilder, ReactiveFormsModule, Validators } from "@angular/forms";
import { Router, RouterLink } from "@angular/router";
import { environment } from "../../../../environments/environment";
import { CropsService } from "../crops.service";

type FieldOption = { id: string; name: string };

@Component({
  selector: "app-crop-form",
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: "./crop-form.component.html",
  styleUrl: "./crop-form.component.scss"
})
export class CropFormComponent {
  private readonly fb = inject(FormBuilder);
  private readonly cropsService = inject(CropsService);
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);

  readonly fields = signal<FieldOption[]>([]);
  readonly error = signal<string | null>(null);
  readonly busy = signal(false);
  readonly fieldsLoading = signal(false);

  readonly form = this.fb.nonNullable.group({
    cropType: ["barley", Validators.required],
    customCropType: [""],
    fieldId: ["", Validators.required],
    plantingDate: ["", Validators.required],
    growthStage: ["planned", Validators.required],
    irrigationSchedule: [""],
    estimatedYield: [""]
  });

  readonly isCustom = computed(() => this.form.controls.cropType.value === "custom");

  constructor() {
    this.loadFields();
  }

  loadFields(): void {
    this.fieldsLoading.set(true);
    this.http.get<FieldOption[]>(`${environment.apiBaseUrl}/api/fields`).subscribe({
      next: (fields) => {
        this.fields.set(fields);
        this.fieldsLoading.set(false);
      },
      error: () => {
        this.fieldsLoading.set(false);
        this.error.set("Failed to load fields");
      }
    });
  }

  submit(): void {
    this.error.set(null);
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const form = this.form.getRawValue();
    if (form.cropType === "custom" && !form.customCropType.trim()) {
      this.error.set("Custom crop type is required");
      return;
    }
    this.busy.set(true);
    this.cropsService.create(form).subscribe({
      next: (crop) => {
        this.busy.set(false);
        void this.router.navigate(["/crops", crop.id]);
      },
      error: (err: { error?: { message?: string } }) => {
        this.busy.set(false);
        this.error.set(err?.error?.message ?? "Failed to create crop");
      }
    });
  }
}
