import { inject } from "@angular/core";
import { CanActivateFn, Router } from "@angular/router";
import type { UserRole } from "../models/user-role";
import { AuthService } from "../services/auth.service";

export const roleGuard: CanActivateFn = (route) => {
  const auth = inject(AuthService);
  const router = inject(Router);
  const allowed = (route.data["roles"] as UserRole[] | undefined) ?? [];
  const userRole = auth.user()?.role;
  if (!auth.isAuthenticated() || !userRole) {
    return router.createUrlTree(["/login"]);
  }
  if (allowed.length === 0 || allowed.includes(userRole)) {
    return true;
  }
  return router.createUrlTree(["/dashboard"]);
};
