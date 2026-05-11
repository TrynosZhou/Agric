import { Routes } from "@angular/router";
import { authGuard } from "./core/guards/auth.guard";
import { roleGuard } from "./core/guards/role.guard";
import { MainLayoutComponent } from "./layout/main-layout.component";

export const routes: Routes = [
  { path: "login", loadComponent: () => import("./features/auth/login/login.component").then((m) => m.LoginComponent) },
  { path: "register", loadComponent: () => import("./features/auth/register/register.component").then((m) => m.RegisterComponent) },
  {
    path: "",
    component: MainLayoutComponent,
    canActivate: [authGuard],
    children: [
      { path: "", pathMatch: "full", redirectTo: "dashboard" },
      {
        path: "dashboard",
        loadComponent: () => import("./features/dashboard/dashboard.component").then((m) => m.DashboardComponent)
      },
      {
        path: "fields",
        loadComponent: () =>
          import("./features/fields/field-create/field-create.component").then((m) => m.FieldCreateComponent),
        canActivate: [roleGuard],
        data: { roles: ["admin"] }
      },
      {
        path: "crops",
        loadComponent: () => import("./features/crops/crop-list/crop-list.component").then((m) => m.CropListComponent)
      },
      {
        path: "crops/new",
        loadComponent: () => import("./features/crops/crop-form/crop-form.component").then((m) => m.CropFormComponent)
      },
      {
        path: "crops/:id",
        loadComponent: () => import("./features/crops/crop-detail/crop-detail.component").then((m) => m.CropDetailComponent)
      },
      {
        path: "livestock",
        loadComponent: () =>
          import("./features/livestock/livestock-list/livestock-list.component").then((m) => m.LivestockListComponent)
      },
      {
        path: "livestock/animals/:id",
        loadComponent: () =>
          import("./features/livestock/livestock-animal-detail/livestock-animal-detail.component").then(
            (m) => m.LivestockAnimalDetailComponent
          )
      },
      {
        path: "labour/workers",
        loadComponent: () => import("./features/labour/worker-list/worker-list.component").then((m) => m.WorkerListComponent)
      },
      {
        path: "labour/attendance",
        loadComponent: () =>
          import("./features/labour/attendance-capture/attendance-capture.component").then(
            (m) => m.AttendanceCaptureComponent
          )
      },
      {
        path: "labour/payroll",
        loadComponent: () =>
          import("./features/labour/payroll-summary/payroll-summary.component").then((m) => m.PayrollSummaryComponent)
      },
      {
        path: "operations/assets",
        loadComponent: () =>
          import("./features/operations/asset-inventory/asset-inventory.component").then((m) => m.AssetInventoryComponent)
      },
      {
        path: "operations/assets/usage",
        loadComponent: () =>
          import("./features/operations/asset-usage-log/asset-usage-log.component").then((m) => m.AssetUsageLogComponent)
      },
      {
        path: "operations/irrigation",
        loadComponent: () =>
          import("./features/operations/irrigation-status-dashboard/irrigation-status-dashboard.component").then(
            (m) => m.IrrigationStatusDashboardComponent
          )
      },
      {
        path: "operations/maintenance",
        loadComponent: () =>
          import("./features/operations/maintenance-schedule/maintenance-schedule.component").then(
            (m) => m.MaintenanceScheduleComponent
          )
      },
      {
        path: "hay/stock",
        loadComponent: () => import("./features/hay/stock-overview/stock-overview.component").then((m) => m.StockOverviewComponent)
      },
      {
        path: "hay/customers",
        loadComponent: () => import("./features/hay/customer-list/customer-list.component").then((m) => m.CustomerListComponent)
      },
      {
        path: "hay/new-sale",
        loadComponent: () => import("./features/hay/new-sale/new-sale.component").then((m) => m.NewSaleComponent)
      },
      {
        path: "hay/sales-history",
        loadComponent: () => import("./features/hay/sales-history/sales-history.component").then((m) => m.SalesHistoryComponent)
      },
      {
        path: "finance/transactions",
        loadComponent: () =>
          import("./features/finance/transaction-log/transaction-log.component").then((m) => m.TransactionLogComponent)
      },
      {
        path: "finance/chart",
        loadComponent: () =>
          import("./features/finance/income-expense-chart/income-expense-chart.component").then(
            (m) => m.IncomeExpenseChartComponent
          )
      },
      {
        path: "finance/summary",
        loadComponent: () =>
          import("./features/finance/profit-summary/profit-summary.component").then((m) => m.ProfitSummaryComponent)
      },
      {
        path: "admin",
        loadComponent: () => import("./features/admin/admin.component").then((m) => m.AdminComponent),
        canActivate: [roleGuard],
        data: { roles: ["admin"] }
      },
      {
        path: "manager",
        loadComponent: () => import("./features/manager/manager.component").then((m) => m.ManagerComponent),
        canActivate: [roleGuard],
        data: { roles: ["admin", "manager"] }
      },
      {
        path: "worker",
        loadComponent: () => import("./features/worker/worker.component").then((m) => m.WorkerComponent),
        canActivate: [roleGuard],
        data: { roles: ["worker"] }
      }
    ]
  },
  { path: "**", redirectTo: "dashboard" }
];
