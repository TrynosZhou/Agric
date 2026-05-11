import { Component, computed, inject, signal } from "@angular/core";
import { RouterLink } from "@angular/router";
import { CropsService } from "../crops.service";
import type { CropRecord } from "../crop.models";

@Component({
  selector: "app-crop-list",
  standalone: true,
  imports: [RouterLink],
  templateUrl: "./crop-list.component.html",
  styleUrl: "./crop-list.component.scss"
})
export class CropListComponent {
  private readonly cropsService = inject(CropsService);
  readonly crops = signal<CropRecord[]>([]);
  readonly loading = signal(false);
  readonly error = signal<string | null>(null);
  readonly query = signal("");

  readonly filtered = computed(() => {
    const q = this.query().trim().toLowerCase();
    const list = this.crops();
    if (!q) return list;
    return list.filter((c) => {
      const type = (c.cropType === "custom" ? c.customCropType : c.cropType) ?? "";
      return (
        c.fieldName.toLowerCase().includes(q) ||
        type.toLowerCase().includes(q) ||
        (c.growthStage ?? "").toLowerCase().includes(q)
      );
    });
  });

  readonly hasData = computed(() => this.filtered().length > 0);

  constructor() {
    this.fetchCrops();
  }

  fetchCrops(): void {
    this.loading.set(true);
    this.error.set(null);
    this.cropsService.list().subscribe({
      next: (crops) => {
        this.crops.set(crops);
        this.loading.set(false);
      },
      error: (err: { error?: { message?: string } }) => {
        this.error.set(err?.error?.message ?? "Failed to load crops");
        this.loading.set(false);
      }
    });
  }

  deleteCrop(crop: CropRecord): void {
    const shouldDelete = window.confirm(`Delete crop record for ${crop.fieldName}?`);
    if (!shouldDelete) {
      return;
    }
    this.cropsService.remove(crop.id).subscribe({
      next: () => this.fetchCrops(),
      error: (err: { error?: { message?: string } }) => {
        this.error.set(err?.error?.message ?? "Failed to delete crop");
      }
    });
  }
}
