import { Component, inject } from "@angular/core";
import { RouterLink, RouterOutlet } from "@angular/router";
import { AuthService } from "../core/services/auth.service";
import { NotificationBellComponent } from "../core/components/notification-bell/notification-bell.component";

@Component({
  selector: "app-main-layout",
  standalone: true,
  imports: [RouterOutlet, RouterLink, NotificationBellComponent],
  templateUrl: "./main-layout.component.html",
  styleUrl: "./main-layout.component.scss"
})
export class MainLayoutComponent {
  readonly auth = inject(AuthService);
}
