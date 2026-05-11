"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const data_source_1 = require("../data-source");
const Asset_1 = require("../entities/Asset");
const Crop_1 = require("../entities/Crop");
const FinanceEntry_1 = require("../entities/FinanceEntry");
const IrrigationSystem_1 = require("../entities/IrrigationSystem");
const LivestockAnimal_1 = require("../entities/LivestockAnimal");
const PoultryBatch_1 = require("../entities/PoultryBatch");
const Notification_1 = require("../entities/Notification");
const Worker_1 = require("../entities/Worker");
const WorkerAttendance_1 = require("../entities/WorkerAttendance");
const router = (0, express_1.Router)();
function toDateText(d) {
    return `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, "0")}-${String(d.getUTCDate()).padStart(2, "0")}`;
}
function monthRangeUtc(now) {
    const yearText = String(now.getUTCFullYear());
    const monthText = String(now.getUTCMonth() + 1).padStart(2, "0");
    const from = `${yearText}-${monthText}-01`;
    const toDate = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() + 1, 0));
    const to = `${yearText}-${monthText}-${String(toDate.getUTCDate()).padStart(2, "0")}`;
    return { from, to, yearText, monthText };
}
router.get("/summary", async (_req, res) => {
    try {
        const now = new Date();
        const today = toDateText(now);
        const { from: monthFrom, to: monthTo, yearText, monthText } = monthRangeUtc(now);
        const month = `${yearText}-${monthText}`;
        const cropsPromise = data_source_1.AppDataSource.getRepository(Crop_1.Crop).find({ order: { createdAt: "DESC" } });
        const animalsPromise = data_source_1.AppDataSource.getRepository(LivestockAnimal_1.LivestockAnimal).find();
        const poultryPromise = data_source_1.AppDataSource.getRepository(PoultryBatch_1.PoultryBatch).find();
        const attendanceTodayPromise = data_source_1.AppDataSource.getRepository(WorkerAttendance_1.WorkerAttendance).count({
            where: { attendanceDate: today, present: true }
        });
        const assetsPromise = data_source_1.AppDataSource.getRepository(Asset_1.Asset).find();
        const irrigationPromise = data_source_1.AppDataSource.getRepository(IrrigationSystem_1.IrrigationSystem).find();
        const financePromise = data_source_1.AppDataSource.getRepository(FinanceEntry_1.FinanceEntry)
            .createQueryBuilder("f")
            .where("f.date >= :from", { from: monthFrom })
            .andWhere("f.date <= :to", { to: monthTo })
            .getMany();
        const notificationsPromise = data_source_1.AppDataSource.getRepository(Notification_1.Notification)
            .createQueryBuilder("n")
            .where("n.priority IN (:...p)", { p: ["critical", "warning"] })
            .orderBy("n.createdAt", "DESC")
            .limit(5)
            .getMany();
        const workersPromise = data_source_1.AppDataSource.getRepository(Worker_1.Worker).find();
        const attendanceMonthPromise = data_source_1.AppDataSource.getRepository(WorkerAttendance_1.WorkerAttendance)
            .createQueryBuilder("a")
            .leftJoinAndSelect("a.worker", "worker")
            .where("a.attendanceDate >= :from", { from: monthFrom })
            .andWhere("a.attendanceDate <= :to", { to: monthTo })
            .andWhere("a.present = true")
            .getMany();
        const [crops, animals, poultryBatches, attendanceTodayCount, assets, irrigationSystems, financeEntries, recentAlerts, workers, attendanceMonth] = await Promise.all([
            cropsPromise,
            animalsPromise,
            poultryPromise,
            attendanceTodayPromise,
            assetsPromise,
            irrigationPromise,
            financePromise,
            notificationsPromise,
            workersPromise,
            attendanceMonthPromise
        ]);
        const activeCrops = crops.map((c) => ({
            id: c.id,
            fieldName: c.fieldName,
            cropType: c.cropType === "custom" ? c.customCropType ?? "custom" : c.cropType,
            growthStage: c.growthStage
        }));
        const livestockCounts = { cattle: 0, goats: 0, pigs: 0, poultry: 0 };
        for (const a of animals) {
            livestockCounts[a.species] = (livestockCounts[a.species] ?? 0) + 1;
        }
        const poultryCurrent = poultryBatches.reduce((sum, b) => sum + Math.max(0, (b.flockSize ?? 0) - (b.mortalityCount ?? 0)), 0);
        livestockCounts.poultry = poultryCurrent;
        // Labour cost this month (reuse same logic as payroll-summary totals)
        const toDate = new Date(Date.UTC(Number(yearText), Number(monthText), 0));
        const daysInMonth = toDate.getUTCDate();
        const workerById = new Map(workers.map((w) => [w.id, w]));
        let casualCost = 0;
        const permanentMonthly = workers
            .filter((w) => w.type === "permanent")
            .reduce((sum, w) => sum + Number(w.monthlySalary || 0), 0);
        for (const row of attendanceMonth) {
            const worker = row.worker ?? workerById.get(row.workerId);
            if (!worker)
                continue;
            if (worker.type !== "casual")
                continue;
            const rate = Number(worker.wageRate || 0);
            if (worker.casualPayMode === "task") {
                casualCost += rate;
            }
            else {
                const hours = Number(row.hoursWorked || 0);
                casualCost += rate * (hours > 0 ? hours / 8 : 1);
            }
        }
        const labourThisMonthTotal = Number((permanentMonthly + casualCost).toFixed(2));
        const totalAssets = assets.reduce((sum, a) => sum + Number(a.quantityAvailable || 0), 0);
        const inUseAssets = assets.reduce((sum, a) => sum + Number(a.quantityInUse || 0), 0);
        const damagedAssets = assets.filter((a) => a.condition === "damaged").length;
        const irrigationStatus = irrigationSystems.reduce((acc, s) => {
            acc[s.status] = (acc[s.status] ?? 0) + 1;
            return acc;
        }, { active: 0, faulty: 0, inactive: 0 });
        const totalIncome = financeEntries
            .filter((e) => e.entryType === "income")
            .reduce((sum, e) => sum + Number(e.amount || 0), 0);
        const totalExpense = financeEntries
            .filter((e) => e.entryType === "expense")
            .reduce((sum, e) => sum + Number(e.amount || 0), 0);
        const netProfit = Number((totalIncome - totalExpense).toFixed(2));
        res.json({
            generatedAt: now.toISOString(),
            crops: { active: activeCrops },
            livestock: { counts: livestockCounts },
            labour: { attendanceTodayCount, totalWageCostThisMonth: labourThisMonthTotal, month },
            assets: { total: totalAssets, inUse: inUseAssets, damaged: damagedAssets },
            irrigation: { active: irrigationStatus.active ?? 0, faulty: irrigationStatus.faulty ?? 0 },
            finance: {
                month,
                income: Number(totalIncome.toFixed(2)),
                expenses: Number(totalExpense.toFixed(2)),
                netProfit
            },
            recentAlerts: recentAlerts.map((n) => ({
                id: n.id,
                title: n.title,
                message: n.message,
                priority: n.priority,
                status: n.status,
                module: n.module,
                createdAt: n.createdAt
            }))
        });
    }
    catch (error) {
        // eslint-disable-next-line no-console
        console.error("Dashboard summary failed:", error);
        res.status(500).json({ message: "Dashboard summary failed" });
    }
});
exports.default = router;
