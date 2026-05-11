import cron from "node-cron";
import { AppDataSource } from "../data-source";
import { Crop } from "../entities/Crop";
import { DetasselingTask } from "../entities/DetasselingTask";
import { HayBale } from "../entities/HayBale";
import { IrrigationSystem } from "../entities/IrrigationSystem";
import { LivestockAnimal } from "../entities/LivestockAnimal";
import { Notification } from "../entities/Notification";
import { Asset } from "../entities/Asset";

function startOfDay(date: Date): Date {
  return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), 0, 0, 0, 0));
}

function daysAgo(days: number): Date {
  const d = new Date();
  d.setUTCDate(d.getUTCDate() - days);
  return d;
}

function isValidDate(value: string): boolean {
  return /^\d{4}-\d{2}-\d{2}$/.test(value);
}

function parseDate(value: string): Date | null {
  if (!isValidDate(value)) return null;
  const [y, m, d] = value.split("-").map((x) => Number(x));
  return new Date(Date.UTC(y, m - 1, d, 0, 0, 0, 0));
}

async function ensureNotificationOncePerDay(input: {
  dedupeKey: string;
  title: string;
  message: string;
  priority: "reminder" | "warning" | "critical";
  module: string;
}): Promise<void> {
  const repo = AppDataSource.getRepository(Notification);
  const today = new Date();
  const from = startOfDay(today);
  const to = new Date(from);
  to.setUTCDate(to.getUTCDate() + 1);

  const existing = await repo
    .createQueryBuilder("n")
    .where("n.dedupeKey = :key", { key: input.dedupeKey })
    .andWhere("n.createdAt >= :from", { from })
    .andWhere("n.createdAt < :to", { to })
    .getOne();

  if (existing) return;

  const n = repo.create({
    title: input.title,
    message: input.message,
    module: input.module,
    priority: input.priority,
    status: "unread",
    isRead: false,
    dedupeKey: input.dedupeKey
  });
  await repo.save(n);
}

export async function generateDailyAlerts(): Promise<void> {
  if (!AppDataSource.isInitialized) return;

  const crops = await AppDataSource.getRepository(Crop).find({ relations: { detasselingTasks: true, harvestCycles: true } });
  const tasks = await AppDataSource.getRepository(DetasselingTask).find({ relations: { crop: true } });
  const animals = await AppDataSource.getRepository(LivestockAnimal).find();
  const stock = await AppDataSource.getRepository(HayBale).findOne({ where: { baleCode: null as unknown as string } });
  const irrigationSystems = await AppDataSource.getRepository(IrrigationSystem).find();
  const assets = await AppDataSource.getRepository(Asset).find();

  const now = new Date();
  const sevenDaysAgo = daysAgo(7);

  // 1) Overdue irrigation schedules (simple heuristic: irrigationSchedule contains YYYY-MM-DD)
  for (const crop of crops) {
    const schedule = (crop.irrigationSchedule ?? "").trim();
    const match = schedule.match(/\d{4}-\d{2}-\d{2}/);
    if (!match) continue;
    const nextDate = parseDate(match[0]);
    if (!nextDate) continue;
    if (nextDate.getTime() < startOfDay(now).getTime()) {
      await ensureNotificationOncePerDay({
        dedupeKey: `irrigation-overdue:${crop.id}`,
        title: "Overdue irrigation schedule",
        message: `Crop in field "${crop.fieldName}" has an irrigation schedule date ${match[0]} that appears overdue.`,
        priority: "warning",
        module: "crop"
      });
    }
  }

  // 2) Upcoming or missed vaccinations + dipping dates
  for (const animal of animals) {
    const tag = animal.tagIdNumber;
    for (const v of animal.vaccinationRecords ?? []) {
      if (!v.nextDueDate) continue;
      const due = parseDate(v.nextDueDate);
      if (!due) continue;
      const diffDays = Math.ceil((due.getTime() - startOfDay(now).getTime()) / (1000 * 60 * 60 * 24));
      if (diffDays < 0) {
        await ensureNotificationOncePerDay({
          dedupeKey: `vaccination-missed:${animal.id}:${v.nextDueDate}:${v.vaccineType}`,
          title: "Missed vaccination due date",
          message: `Animal ${tag} (${animal.species}) missed vaccination "${v.vaccineType}" due on ${v.nextDueDate}.`,
          priority: "critical",
          module: "livestock"
        });
      } else if (diffDays <= 7) {
        await ensureNotificationOncePerDay({
          dedupeKey: `vaccination-upcoming:${animal.id}:${v.nextDueDate}:${v.vaccineType}`,
          title: "Upcoming vaccination due",
          message: `Animal ${tag} (${animal.species}) has vaccination "${v.vaccineType}" due on ${v.nextDueDate}.`,
          priority: "reminder",
          module: "livestock"
        });
      }
    }

    // Dipping: assume due every 30 days from last dipping record
    const dips = (animal.dippingRecords ?? []).map((d) => parseDate(d.date)).filter(Boolean) as Date[];
    if (dips.length > 0) {
      const last = dips.sort((a, b) => b.getTime() - a.getTime())[0];
      const due = new Date(last);
      due.setUTCDate(due.getUTCDate() + 30);
      const diffDays = Math.ceil((due.getTime() - startOfDay(now).getTime()) / (1000 * 60 * 60 * 24));
      const dueText = `${due.getUTCFullYear()}-${String(due.getUTCMonth() + 1).padStart(2, "0")}-${String(due.getUTCDate()).padStart(2, "0")}`;
      if (diffDays < 0) {
        await ensureNotificationOncePerDay({
          dedupeKey: `dipping-missed:${animal.id}:${dueText}`,
          title: "Missed dipping due date",
          message: `Animal ${tag} (${animal.species}) appears overdue for dipping (estimated due ${dueText}).`,
          priority: "warning",
          module: "livestock"
        });
      } else if (diffDays <= 7) {
        await ensureNotificationOncePerDay({
          dedupeKey: `dipping-upcoming:${animal.id}:${dueText}`,
          title: "Upcoming dipping due",
          message: `Animal ${tag} (${animal.species}) is due for dipping soon (estimated due ${dueText}).`,
          priority: "reminder",
          module: "livestock"
        });
      }
    }
  }

  // 3) Detasseling tasks delayed (older than 7 days and not done)
  for (const task of tasks) {
    if (task.status === "done") continue;
    const created = task.createdAt ?? null;
    if (!created) continue;
    if (created.getTime() < sevenDaysAgo.getTime()) {
      await ensureNotificationOncePerDay({
        dedupeKey: `detasseling-delayed:${task.id}`,
        title: "Delayed detasseling task",
        message: `Detasseling task for field "${task.field}" assigned to "${task.assignedWorker}" is still "${task.status}" after 7+ days.`,
        priority: "warning",
        module: "crop"
      });
    }
  }

  // 4) Hay bale stock below threshold
  if (stock && stock.balesInStock < stock.lowStockThreshold) {
    await ensureNotificationOncePerDay({
      dedupeKey: `hay-low-stock:${stock.id}`,
      title: "Hay bale stock low",
      message: `Hay stock is low: ${stock.balesInStock} bales in stock (threshold ${stock.lowStockThreshold}).`,
      priority: "critical",
      module: "hay"
    });
  }

  // 5) Equipment marked faulty with no maintenance record
  for (const system of irrigationSystems) {
    if (system.status !== "faulty") continue;
    const scheduled = system.scheduledMaintenanceDates ?? [];
    if (scheduled.length === 0) {
      await ensureNotificationOncePerDay({
        dedupeKey: `irrigation-faulty-no-maint:${system.id}`,
        title: "Faulty irrigation system without maintenance",
        message: `Irrigation system (${system.systemType}, ${system.powerSource}) is marked "faulty" but has no scheduled maintenance dates.`,
        priority: "critical",
        module: "asset"
      });
    }
  }

  for (const asset of assets) {
    if (asset.condition !== "damaged") continue;
    const logs = asset.maintenanceLogEntries ?? [];
    if (logs.length === 0) {
      await ensureNotificationOncePerDay({
        dedupeKey: `asset-damaged-no-maint:${asset.id}`,
        title: "Damaged equipment without maintenance log",
        message: `Asset "${asset.name}" is marked damaged but has no maintenance log entries.`,
        priority: "warning",
        module: "asset"
      });
    }
  }

  // 6) Crop with no activity logged in over 7 days
  for (const crop of crops) {
    const activityDates: Date[] = [];
    for (const rec of crop.fertilizerApplications ?? []) {
      const d = parseDate(rec.date);
      if (d) activityDates.push(d);
    }
    for (const rec of crop.pesticideApplications ?? []) {
      const d = parseDate(rec.date);
      if (d) activityDates.push(d);
    }
    for (const t of crop.detasselingTasks ?? []) {
      if (t.createdAt) activityDates.push(new Date(t.createdAt));
    }
    for (const h of crop.harvestCycles ?? []) {
      const d = parseDate(h.harvestedOn);
      if (d) activityDates.push(d);
    }

    const lastActivity = activityDates.sort((a, b) => b.getTime() - a.getTime())[0] ?? null;
    if (!lastActivity || lastActivity.getTime() < sevenDaysAgo.getTime()) {
      await ensureNotificationOncePerDay({
        dedupeKey: `crop-no-activity:${crop.id}`,
        title: "No recent crop activity",
        message: `No field activity has been logged for crop in field "${crop.fieldName}" for over 7 days.`,
        priority: "reminder",
        module: "crop"
      });
    }
  }
}

export function startNotificationsCron(): void {
  const schedule = process.env.NOTIFICATIONS_CRON || "0 6 * * *";
  cron.schedule(
    schedule,
    () => {
      void generateDailyAlerts();
    },
    { timezone: process.env.TZ || "UTC" }
  );
}

