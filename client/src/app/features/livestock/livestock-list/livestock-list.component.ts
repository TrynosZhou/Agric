import { Component, computed, inject, signal } from "@angular/core";
import { FormBuilder, ReactiveFormsModule, Validators } from "@angular/forms";
import { RouterLink } from "@angular/router";
import type { LivestockAnimal, LivestockTypeFilter, PoultryBatch } from "../livestock.models";
import { LivestockService } from "../livestock.service";

@Component({
  selector: "app-livestock-list",
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: "./livestock-list.component.html",
  styleUrl: "./livestock-list.component.scss"
})
export class LivestockListComponent {
  private readonly livestockService = inject(LivestockService);
  private readonly fb = inject(FormBuilder);

  readonly typeFilter = signal<LivestockTypeFilter>("all");
  readonly speciesFilter = signal<string>("");
  readonly animals = signal<LivestockAnimal[]>([]);
  readonly poultry = signal<PoultryBatch[]>([]);
  readonly loading = signal(false);
  readonly error = signal<string | null>(null);
  readonly query = signal("");

  readonly animalForm = this.fb.nonNullable.group({
    species: ["cattle", Validators.required],
    tagIdNumber: ["", Validators.required],
    dateOfBirth: ["", Validators.required]
  });

  readonly poultryForm = this.fb.nonNullable.group({
    batchCode: ["", Validators.required],
    flockSize: [1, [Validators.required, Validators.min(1)]],
    mortalityCount: [0, [Validators.required, Validators.min(0)]],
    feedConsumptionKg: ["0", Validators.required],
    eggProduction: [0, [Validators.required, Validators.min(0)]]
  });

  readonly hasAnimals = computed(() => this.animals().length > 0);
  readonly hasPoultry = computed(() => this.poultry().length > 0);

  readonly filteredAnimals = computed(() => {
    const q = this.query().trim().toLowerCase();
    const list = this.animals();
    if (!q) return list;
    return list.filter((a) => a.tagIdNumber.toLowerCase().includes(q) || a.species.toLowerCase().includes(q));
  });

  readonly poultrySummary = computed(() => {
    const batches = this.poultry();
    const flock = batches.reduce((sum, b) => sum + (b.flockSize ?? 0), 0);
    const mortality = batches.reduce((sum, b) => sum + (b.mortalityCount ?? 0), 0);
    return { batches: batches.length, flock, mortality };
  });

  constructor() {
    this.load();
  }

  load(): void {
    this.loading.set(true);
    this.error.set(null);
    this.livestockService.list(this.typeFilter(), this.speciesFilter() || undefined).subscribe({
      next: (response) => {
        this.animals.set(response.animals);
        this.poultry.set(response.poultry);
        this.loading.set(false);
      },
      error: (err: { error?: { message?: string } }) => {
        this.error.set(err?.error?.message ?? "Failed to load livestock");
        this.loading.set(false);
      }
    });
  }

  updateTypeFilter(value: string): void {
    this.typeFilter.set(value as LivestockTypeFilter);
    this.load();
  }

  updateSpeciesFilter(value: string): void {
    this.speciesFilter.set(value);
    this.load();
  }

  createAnimal(): void {
    if (this.animalForm.invalid) {
      this.animalForm.markAllAsTouched();
      return;
    }
    this.livestockService.createAnimal(this.animalForm.getRawValue()).subscribe({
      next: () => {
        this.animalForm.reset({ species: "cattle", tagIdNumber: "", dateOfBirth: "" });
        this.load();
      },
      error: (err: { error?: { message?: string } }) => {
        this.error.set(err?.error?.message ?? "Failed to create animal");
      }
    });
  }

  createPoultry(): void {
    if (this.poultryForm.invalid) {
      this.poultryForm.markAllAsTouched();
      return;
    }
    this.livestockService.createPoultryBatch(this.poultryForm.getRawValue()).subscribe({
      next: () => {
        this.poultryForm.reset({
          batchCode: "",
          flockSize: 1,
          mortalityCount: 0,
          feedConsumptionKg: "0",
          eggProduction: 0
        });
        this.load();
      },
      error: (err: { error?: { message?: string } }) => {
        this.error.set(err?.error?.message ?? "Failed to create poultry batch");
      }
    });
  }
}
