import { Component, inject, signal } from "@angular/core";
import { FormBuilder, ReactiveFormsModule, Validators } from "@angular/forms";
import { Router, RouterLink } from "@angular/router";
import type { UserRole } from "../../../core/models/user-role";
import { AuthService } from "../../../core/services/auth.service";

@Component({
  selector: "app-register",
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: "./register.component.html",
  styleUrl: "./register.component.scss"
})
export class RegisterComponent {
  private readonly fb = inject(FormBuilder);
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  readonly error = signal<string | null>(null);
  readonly busy = signal(false);

  readonly roles: { value: UserRole; label: string }[] = [
    { value: "worker", label: "Worker" },
    { value: "manager", label: "Manager" },
    { value: "admin", label: "Admin" }
  ];

  readonly form = this.fb.nonNullable.group({
    email: ["", [Validators.required, Validators.email]],
    password: ["", [Validators.required, Validators.minLength(8)]],
    role: this.fb.nonNullable.control<UserRole>("worker", [Validators.required])
  });

  submit(): void {
    this.error.set(null);
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.busy.set(true);
    const { email, password, role } = this.form.getRawValue();
    this.auth.register({ email, password, role }).subscribe({
      next: () => {
        this.busy.set(false);
        void this.router.navigateByUrl("/dashboard");
      },
      error: (err: { error?: { message?: string } }) => {
        this.busy.set(false);
        this.error.set(err?.error?.message ?? "Registration failed");
      }
    });
  }
}
