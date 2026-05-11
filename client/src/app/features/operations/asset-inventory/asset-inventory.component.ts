import { Component, computed, inject, signal } from "@angular/core";
import { FormBuilder, ReactiveFormsModule, Validators } from "@angular/forms";
import type { AssetRecord } from "../operations.models";
import { OperationsService } from "../operations.service";

@Component({
  selector: "app-asset-inventory",
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: "./asset-inventory.component.html",
  styleUrl: "./asset-inventory.component.scss"
})
export class AssetInventoryComponent {
  private readonly operationsService = inject(OperationsService);
  private readonly fb = inject(FormBuilder);

  readonly assets = signal<AssetRecord[]>([]);
  readonly loading = signal(false);
  readonly error = signal<string | null>(null);
  readonly hasAssets = computed(() => this.assets().length > 0);

  readonly form = this.fb.nonNullable.group({
    name: ["", Validators.required],
    category: ["machinery", Validators.required],
    quantityAvailable: [0, [Validators.required, Validators.min(0)]],
    quantityInUse: [0, [Validators.required, Validators.min(0)]],
    condition: ["good", Validators.required],
    currentAssignedUser: [""]
  });

  constructor() {
    this.load();
  }

  load(): void {
    this.loading.set(true);
    this.error.set(null);
    this.operationsService.listAssets().subscribe({
      next: (assets) => {
        this.assets.set(assets);
        this.loading.set(false);
      },
      error: (err: { error?: { message?: string } }) => {
        this.error.set(err?.error?.message ?? "Failed to load assets");
        this.loading.set(false);
      }
    });
  }

  create(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.operationsService.createAsset(this.form.getRawValue()).subscribe({
      next: () => {
        this.form.reset({
          name: "",
          category: "machinery",
          quantityAvailable: 0,
          quantityInUse: 0,
          condition: "good",
          currentAssignedUser: ""
        });
        this.load();
      },
      error: (err: { error?: { message?: string } }) => {
        this.error.set(err?.error?.message ?? "Failed to create asset");
      }
    });
  }
}
