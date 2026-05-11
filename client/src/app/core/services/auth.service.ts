import { HttpClient } from "@angular/common/http";
import { Injectable, computed, inject, signal } from "@angular/core";
import { Router } from "@angular/router";
import { tap } from "rxjs/operators";
import { environment } from "../../../environments/environment";
import type { UserRole } from "../models/user-role";

export interface AuthUser {
  id: string;
  email: string;
  role: UserRole;
}

const TOKEN_KEY = "farm_auth_token";
const USER_KEY = "farm_auth_user";

@Injectable({ providedIn: "root" })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);

  private readonly _token = signal<string | null>(null);
  private readonly _user = signal<AuthUser | null>(null);

  readonly token = this._token.asReadonly();
  readonly user = this._user.asReadonly();
  readonly isAuthenticated = computed(() => !!this._token());

  constructor() {
    const storedToken = localStorage.getItem(TOKEN_KEY);
    const storedUser = localStorage.getItem(USER_KEY);
    if (storedToken) {
      this._token.set(storedToken);
    }
    if (storedUser) {
      try {
        this._user.set(JSON.parse(storedUser) as AuthUser);
      } catch {
        localStorage.removeItem(USER_KEY);
      }
    }
  }

  hasRole(...roles: UserRole[]): boolean {
    const role = this._user()?.role;
    return !!role && roles.includes(role);
  }

  login(email: string, password: string) {
    return this.http
      .post<{ accessToken: string; user: AuthUser }>(`${environment.apiBaseUrl}/api/auth/login`, {
        email,
        password
      })
      .pipe(tap((res) => this.persistSession(res.accessToken, res.user)));
  }

  register(body: { email: string; password: string; role?: UserRole }) {
    return this.http
      .post<{ accessToken: string; user: AuthUser }>(`${environment.apiBaseUrl}/api/auth/register`, body)
      .pipe(tap((res) => this.persistSession(res.accessToken, res.user)));
  }

  loadProfile() {
    return this.http.get<AuthUser>(`${environment.apiBaseUrl}/api/me`).pipe(
      tap((user) => {
        this._user.set(user);
        localStorage.setItem(USER_KEY, JSON.stringify(user));
      })
    );
  }

  logout(): void {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    this._token.set(null);
    this._user.set(null);
    void this.router.navigate(["/login"]);
  }

  private persistSession(accessToken: string, user: AuthUser): void {
    localStorage.setItem(TOKEN_KEY, accessToken);
    localStorage.setItem(USER_KEY, JSON.stringify(user));
    this._token.set(accessToken);
    this._user.set(user);
  }
}
