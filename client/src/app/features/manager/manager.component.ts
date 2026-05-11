import { Component } from "@angular/core";

@Component({
  selector: "app-manager",
  standalone: true,
  template: `
    <div class="page">
      <h1>Manager area</h1>
      <p>This route is available to <strong>admin</strong> and <strong>manager</strong> roles.</p>
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
export class ManagerComponent {}
