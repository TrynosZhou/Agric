import { Component } from "@angular/core";

@Component({
  selector: "app-worker",
  standalone: true,
  template: `
    <div class="page">
      <h1>Worker area</h1>
      <p>Only users with the <strong>worker</strong> role can open this route.</p>
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
export class WorkerComponent {}
