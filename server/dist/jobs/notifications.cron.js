"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateDailyAlerts = generateDailyAlerts;
exports.startNotificationsCron = startNotificationsCron;
const node_cron_1 = __importDefault(require("node-cron"));
const data_source_1 = require("../data-source");
const Crop_1 = require("../entities/Crop");
const DetasselingTask_1 = require("../entities/DetasselingTask");
const HayBale_1 = require("../entities/HayBale");
const IrrigationSystem_1 = require("../entities/IrrigationSystem");
const LivestockAnimal_1 = require("../entities/LivestockAnimal");
const Notification_1 = require("../entities/Notification");
const Asset_1 = require("../entities/Asset");
function startOfDay(date) {
    return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), 0, 0, 0, 0));
}
function daysAgo(days) {
    const d = new Date();
    d.setUTCDate(d.getUTCDate() - days);
    return d;
}
function isValidDate(value) {
    return /^\d{4}-\d{2}-\d{2}$/.test(value);
}
function parseDate(value) {
    if (!isValidDate(value))
        return null;
    const [y, m, d] = value.split("-").map((x) => Number(x));
    return new Date(Date.UTC(y, m - 1, d, 0, 0, 0, 0));
}
async function ensureNotificationOncePerDay(input) {
    const repo = data_source_1.AppDataSource.getRepository(Notification_1.Notification);
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
    if (existing)
        return;
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
async function generateDailyAlerts() {
    if (!data_source_1.AppDataSource.isInitialized)
        return;
    const crops = await data_source_1.AppDataSource.getRepository(Crop_1.Crop).find({ relations: { detasselingTasks: true, harvestCycles: true } });
    const tasks = await data_source_1.AppDataSource.getRepository(DetasselingTask_1.DetasselingTask).find({ relations: { crop: true } });
    const animals = await data_source_1.AppDataSource.getRepository(LivestockAnimal_1.LivestockAnimal).find();
    const stock = await data_source_1.AppDataSource.getRepository(HayBale_1.HayBale).findOne({ where: { baleCode: null } });
    const irrigationSystems = await data_source_1.AppDataSource.getRepository(IrrigationSystem_1.IrrigationSystem).find();
    const assets = await data_source_1.AppDataSource.getRepository(Asset_1.Asset).find();
    const now = new Date();
    const sevenDaysAgo = daysAgo(7);
    // 1) Overdue irrigation schedules (simple heuristic: irrigationSchedule contains YYYY-MM-DD)
    for (const crop of crops) {
        const schedule = (crop.irrigationSchedule ?? "").trim();
        const match = schedule.match(/\d{4}-\d{2}-\d{2}/);
        if (!match)
            continue;
        const nextDate = parseDate(match[0]);
        if (!nextDate)
            continue;
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
            if (!v.nextDueDate)
                continue;
            const due = parseDate(v.nextDueDate);
            if (!due)
                continue;
            const diffDays = Math.ceil((due.getTime() - startOfDay(now).getTime()) / (1000 * 60 * 60 * 24));
            if (diffDays < 0) {
                await ensureNotificationOncePerDay({
                    dedupeKey: `vaccination-missed:${animal.id}:${v.nextDueDate}:${v.vaccineType}`,
                    title: "Missed vaccination due date",
                    message: `Animal ${tag} (${animal.species}) missed vaccination "${v.vaccineType}" due on ${v.nextDueDate}.`,
                    priority: "critical",
                    module: "livestock"
                });
            }
            else if (diffDays <= 7) {
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
        const dips = (animal.dippingRecords ?? []).map((d) => parseDate(d.date)).filter(Boolean);
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
            }
            else if (diffDays <= 7) {
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
        if (task.status === "done")
            continue;
        const created = task.createdAt ?? null;
        if (!created)
            continue;
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
        if (system.status !== "faulty")
            continue;
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
        if (asset.condition !== "damaged")
            continue;
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
        const activityDates = [];
        for (const rec of crop.fertilizerApplications ?? []) {
            const d = parseDate(rec.date);
            if (d)
                activityDates.push(d);
        }
        for (const rec of crop.pesticideApplications ?? []) {
            const d = parseDate(rec.date);
            if (d)
                activityDates.push(d);
        }
        for (const t of crop.detasselingTasks ?? []) {
            if (t.createdAt)
                activityDates.push(new Date(t.createdAt));
        }
        for (const h of crop.harvestCycles ?? []) {
            const d = parseDate(h.harvestedOn);
            if (d)
                activityDates.push(d);
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
function startNotificationsCron() {
    const schedule = process.env.NOTIFICATIONS_CRON || "0 6 * * *";
    node_cron_1.default.schedule(schedule, () => {
        void generateDailyAlerts();
    }, { timezone: process.env.TZ || "UTC" });
}
