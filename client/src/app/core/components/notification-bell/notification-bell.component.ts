import { Component, computed, inject, signal } from "@angular/core";
import { NotificationsService, type AppNotification } from "../../services/notifications.service";

@Component({
  selector: "app-notification-bell",
  standalone: true,
  templateUrl: "./notification-bell.component.html",
  styleUrl: "./notification-bell.component.scss"
})
export class NotificationBellComponent {
  private readonly notificationsService = inject(NotificationsService);

  readonly open = signal(false);
  readonly notifications = signal<AppNotification[]>([]);
  readonly error = signal<string | null>(null);

  readonly unreadCount = computed(() => this.notifications().filter((n) => n.status === "unread").length);

  constructor() {
    this.reload();
  }

  toggle(): void {
    this.open.set(!this.open());
    if (this.open()) {
      this.reload();
    }
  }

  reload(): void {
    this.error.set(null);
    this.notificationsService.list().subscribe({
      next: (items) => this.notifications.set(items),
      error: () => this.error.set("Failed to load notifications")
    });
  }

  markRead(n: AppNotification): void {
    if (n.status === "read") return;
    this.notificationsService.markRead(n.id).subscribe({ next: () => this.reload() });
  }

  markAllRead(): void {
    this.notificationsService.markAllRead().subscribe({ next: () => this.reload() });
  }
}

