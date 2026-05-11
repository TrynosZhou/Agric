import { HttpClient } from "@angular/common/http";
import { Injectable, inject, signal } from "@angular/core";
import { environment } from "../../../environments/environment";

export type NotificationPriority = "reminder" | "warning" | "critical";
export type NotificationStatus = "unread" | "read";

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  priority: NotificationPriority;
  status: NotificationStatus;
  module: string;
  createdAt: string;
}

@Injectable({ providedIn: "root" })
export class NotificationsService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiBaseUrl}/api/notifications`;

  readonly unreadCount = signal(0);

  list() {
    return this.http.get<AppNotification[]>(this.baseUrl);
  }

  refreshUnreadCount() {
    return this.http.get<{ unreadCount: number }>(`${this.baseUrl}/unread-count`);
  }

  markRead(id: string) {
    return this.http.put<AppNotification>(`${this.baseUrl}/${id}/read`, {});
  }

  markAllRead() {
    return this.http.put<{ ok: true }>(`${this.baseUrl}/mark-all-read`, {});
  }
}

