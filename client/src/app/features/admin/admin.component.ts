import { Component } from "@angular/core";

@Component({
  selector: "app-admin",
  standalone: true,
  template: `
    <div class="page">
      <h1>Admin area</h1>
      <p>Only users with the <strong>admin</strong> role can open this route.</p>
    </div>
  `,
  styles: [
    `
      .page {
        max-width: 720px;
      }
      h1 {
        margin: 0 0 0.5rem;
      }
    `
  ]
})
export class AdminComponent {}
