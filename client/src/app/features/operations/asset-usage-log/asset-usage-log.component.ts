import { Component, computed, inject, signal } from "@angular/core";
import { FormBuilder, ReactiveFormsModule, Validators } from "@angular/forms";
import type { AssetRecord } from "../operations.models";
import { OperationsService } from "../operations.service";

@Component({
  selector: "app-asset-usage-log",
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: "./asset-usage-log.component.html",
  styleUrl: "./asset-usage-log.component.scss"
})
export class AssetUsageLogComponent {
  private readonly operationsService = inject(OperationsService);
  private readonly fb = inject(FormBuilder);

  readonly assets = signal<AssetRecord[]>([]);
  readonly error = signal<string | null>(null);
  readonly hasAssets = computed(() => this.assets().length > 0);

  readonly form = this.fb.nonNullable.group({
    assetId: ["", Validators.required],
    quantityInUse: [0, [Validators.required, Validators.min(0)]],
    currentAssignedUser: [""]
  });

  constructor() {
    this.loadAssets();
  }

  loadAssets(): void {
    this.operationsService.listAssets().subscribe({
      next: (assets) => this.assets.set(assets),
      error: () => this.error.set("Failed to load assets")
    });
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const raw = this.form.getRawValue();
    this.operationsService
      .logAssetUsage(raw.assetId, {
        quantityInUse: raw.quantityInUse,
        currentAssignedUser: raw.currentAssignedUser || undefined
      })
      .subscribe({
        next: () => {
          this.form.reset({ assetId: "", quantityInUse: 0, currentAssignedUser: "" });
          this.loadAssets();
        },
        error: (err: { error?: { message?: string } }) => {
          this.error.set(err?.error?.message ?? "Failed to save usage log");
        }
      });
  }
}
