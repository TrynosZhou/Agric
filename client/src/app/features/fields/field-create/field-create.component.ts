import { Component, computed, inject, signal } from "@angular/core";
import { FormBuilder, ReactiveFormsModule, Validators } from "@angular/forms";
import { FieldsService, type FieldRecord } from "../fields.service";

@Component({
  selector: "app-field-create",
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: "./field-create.component.html",
  styleUrl: "./field-create.component.scss"
})
export class FieldCreateComponent {
  private readonly fieldsService = inject(FieldsService);
  private readonly fb = inject(FormBuilder);

  readonly fields = signal<FieldRecord[]>([]);
  readonly loading = signal(false);
  readonly error = signal<string | null>(null);
  readonly hasFields = computed(() => this.fields().length > 0);

  readonly form = this.fb.nonNullable.group({
    name: ["", Validators.required],
    sizeHectares: ["", Validators.required],
    location: [""]
  });

  constructor() {
    this.load();
  }

  load(): void {
    this.loading.set(true);
    this.error.set(null);
    this.fieldsService.list().subscribe({
      next: (fields) => {
        this.fields.set(fields);
        this.loading.set(false);
      },
      error: (err: { error?: { message?: string } }) => {
        this.error.set(err?.error?.message ?? "Failed to load fields");
        this.loading.set(false);
      }
    });
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const raw = this.form.getRawValue();
    this.fieldsService.create({ name: raw.name, sizeHectares: raw.sizeHectares, location: raw.location || undefined }).subscribe({
      next: () => {
        this.form.reset({ name: "", sizeHectares: "", location: "" });
        this.load();
      },
      error: (err: { error?: { message?: string } }) => this.error.set(err?.error?.message ?? "Failed to create field")
    });
  }
}

