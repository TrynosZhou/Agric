import { Component, inject, signal } from "@angular/core";
import { ActivatedRoute, RouterLink } from "@angular/router";
import { HealthEventsFormComponent } from "../health-events-form/health-events-form.component";
import type { LivestockAnimal } from "../livestock.models";
import { LivestockService } from "../livestock.service";

@Component({
  selector: "app-livestock-animal-detail",
  standalone: true,
  imports: [RouterLink, HealthEventsFormComponent],
  templateUrl: "./livestock-animal-detail.component.html",
  styleUrl: "./livestock-animal-detail.component.scss"
})
export class LivestockAnimalDetailComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly livestockService = inject(LivestockService);

  readonly animal = signal<LivestockAnimal | null>(null);
  readonly loading = signal(false);
  readonly error = signal<string | null>(null);

  constructor() {
    this.reload();
  }

  reload(): void {
    const id = this.route.snapshot.paramMap.get("id");
    if (!id) {
      this.error.set("Missing animal id");
      return;
    }
    this.loading.set(true);
    this.error.set(null);
    this.livestockService.getAnimal(id).subscribe({
      next: (animal) => {
        this.animal.set(animal as LivestockAnimal);
        this.loading.set(false);
      },
      error: (err: { error?: { message?: string } }) => {
        this.error.set(err?.error?.message ?? "Failed to load animal");
        this.loading.set(false);
      }
    });
  }
}
