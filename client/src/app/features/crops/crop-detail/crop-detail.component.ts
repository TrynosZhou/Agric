import { Component, inject, signal } from "@angular/core";
import { ActivatedRoute, RouterLink } from "@angular/router";
import { CropActivityFormComponent } from "../crop-activity-form/crop-activity-form.component";
import type { CropRecord } from "../crop.models";
import { CropsService } from "../crops.service";

@Component({
  selector: "app-crop-detail",
  standalone: true,
  imports: [RouterLink, CropActivityFormComponent],
  templateUrl: "./crop-detail.component.html",
  styleUrl: "./crop-detail.component.scss"
})
export class CropDetailComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly cropsService = inject(CropsService);

  readonly crop = signal<CropRecord | null>(null);
  readonly loading = signal(false);
  readonly error = signal<string | null>(null);

  constructor() {
    this.reload();
  }

  reload(): void {
    const id = this.route.snapshot.paramMap.get("id");
    if (!id) {
      this.error.set("Missing crop id");
      return;
    }
    this.loading.set(true);
    this.error.set(null);
    this.cropsService.getById(id).subscribe({
      next: (crop) => {
        this.crop.set(crop);
        this.loading.set(false);
      },
      error: (err: { error?: { message?: string } }) => {
        this.error.set(err?.error?.message ?? "Failed to load crop");
        this.loading.set(false);
      }
    });
  }
}
