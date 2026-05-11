"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const data_source_1 = require("../data-source");
const Asset_1 = require("../entities/Asset");
const IrrigationSystem_1 = require("../entities/IrrigationSystem");
const router = (0, express_1.Router)();
const assetRepo = () => data_source_1.AppDataSource.getRepository(Asset_1.Asset);
const irrigationRepo = () => data_source_1.AppDataSource.getRepository(IrrigationSystem_1.IrrigationSystem);
function isValidDate(value) {
    return /^\d{4}-\d{2}-\d{2}$/.test(value);
}
router.get("/assets", async (_req, res) => {
    const assets = await assetRepo().find({ order: { createdAt: "DESC" } });
    res.json(assets);
});
router.post("/assets", async (req, res) => {
    const name = String(req.body?.name ?? "").trim();
    const category = String(req.body?.category ?? "").trim().toLowerCase();
    const quantityAvailable = Number(req.body?.quantityAvailable ?? 0);
    const quantityInUse = Number(req.body?.quantityInUse ?? 0);
    const condition = String(req.body?.condition ?? "good").trim().toLowerCase();
    const currentAssignedUser = String(req.body?.currentAssignedUser ?? "").trim();
    if (!name) {
        res.status(400).json({ message: "name is required" });
        return;
    }
    if (!Asset_1.assetCategories.includes(category)) {
        res.status(400).json({ message: "category must be machinery, tool, vehicle or irrigation" });
        return;
    }
    if (!Asset_1.assetConditions.includes(condition)) {
        res.status(400).json({ message: "condition must be good, fair or damaged" });
        return;
    }
    if (Number.isNaN(quantityAvailable) || Number.isNaN(quantityInUse) || quantityAvailable < 0 || quantityInUse < 0) {
        res.status(400).json({ message: "quantityAvailable and quantityInUse must be non-negative numbers" });
        return;
    }
    const asset = assetRepo().create({
        name,
        category,
        quantityAvailable,
        quantityInUse,
        condition,
        currentAssignedUser: currentAssignedUser || undefined,
        maintenanceLogEntries: []
    });
    await assetRepo().save(asset);
    res.status(201).json(asset);
});
router.put("/assets/:id", async (req, res) => {
    const asset = await assetRepo().findOne({ where: { id: req.params.id } });
    if (!asset) {
        res.status(404).json({ message: "Asset not found" });
        return;
    }
    if (req.body.name !== undefined)
        asset.name = String(req.body.name ?? "").trim();
    if (req.body.category !== undefined) {
        const category = String(req.body.category).trim().toLowerCase();
        if (!Asset_1.assetCategories.includes(category)) {
            res.status(400).json({ message: "Invalid category" });
            return;
        }
        asset.category = category;
    }
    if (req.body.condition !== undefined) {
        const condition = String(req.body.condition).trim().toLowerCase();
        if (!Asset_1.assetConditions.includes(condition)) {
            res.status(400).json({ message: "Invalid condition" });
            return;
        }
        asset.condition = condition;
    }
    if (req.body.quantityAvailable !== undefined)
        asset.quantityAvailable = Number(req.body.quantityAvailable);
    if (req.body.quantityInUse !== undefined)
        asset.quantityInUse = Number(req.body.quantityInUse);
    if (req.body.currentAssignedUser !== undefined) {
        asset.currentAssignedUser = String(req.body.currentAssignedUser ?? "").trim() || undefined;
    }
    await assetRepo().save(asset);
    res.json(asset);
});
router.post("/assets/:id/usage-log", async (req, res) => {
    const asset = await assetRepo().findOne({ where: { id: req.params.id } });
    if (!asset) {
        res.status(404).json({ message: "Asset not found" });
        return;
    }
    const quantityInUse = Number(req.body?.quantityInUse ?? asset.quantityInUse);
    const currentAssignedUser = String(req.body?.currentAssignedUser ?? "").trim();
    if (Number.isNaN(quantityInUse) || quantityInUse < 0 || quantityInUse > asset.quantityAvailable) {
        res.status(400).json({ message: "quantityInUse must be between 0 and quantityAvailable" });
        return;
    }
    asset.quantityInUse = quantityInUse;
    asset.currentAssignedUser = currentAssignedUser || undefined;
    await assetRepo().save(asset);
    res.status(201).json(asset);
});
router.post("/assets/:id/maintenance", async (req, res) => {
    const asset = await assetRepo().findOne({ where: { id: req.params.id } });
    if (!asset) {
        res.status(404).json({ message: "Asset not found" });
        return;
    }
    const date = String(req.body?.date ?? "").trim();
    const description = String(req.body?.description ?? "").trim();
    const performedBy = String(req.body?.performedBy ?? "").trim();
    const nextDueDate = String(req.body?.nextDueDate ?? "").trim();
    if (!isValidDate(date) || !description) {
        res.status(400).json({ message: "date (YYYY-MM-DD) and description are required" });
        return;
    }
    asset.maintenanceLogEntries = [
        ...(asset.maintenanceLogEntries ?? []),
        {
            date,
            description,
            performedBy: performedBy || undefined,
            nextDueDate: isValidDate(nextDueDate) ? nextDueDate : undefined
        }
    ];
    await assetRepo().save(asset);
    res.status(201).json(asset);
});
router.get("/irrigation-systems", async (_req, res) => {
    const systems = await irrigationRepo().find({ order: { createdAt: "DESC" } });
    res.json(systems);
});
router.post("/irrigation-systems", async (req, res) => {
    const systemType = String(req.body?.systemType ?? "").trim().toLowerCase();
    const coverageAreaOrCapacity = String(req.body?.coverageAreaOrCapacity ?? "").trim();
    const powerSource = String(req.body?.powerSource ?? "").trim().toLowerCase();
    const status = String(req.body?.status ?? "inactive").trim().toLowerCase();
    if (!IrrigationSystem_1.irrigationTypes.includes(systemType)) {
        res.status(400).json({ message: "systemType must be center pivot or pump" });
        return;
    }
    if (!IrrigationSystem_1.powerSources.includes(powerSource)) {
        res.status(400).json({ message: "powerSource must be diesel, electric or solar" });
        return;
    }
    if (!IrrigationSystem_1.irrigationStatuses.includes(status)) {
        res.status(400).json({ message: "status must be active, faulty or inactive" });
        return;
    }
    const system = irrigationRepo().create({
        systemType,
        coverageAreaOrCapacity: coverageAreaOrCapacity || undefined,
        powerSource,
        status,
        waterUsageLog: [],
        fuelUsageLog: [],
        scheduledMaintenanceDates: []
    });
    await irrigationRepo().save(system);
    res.status(201).json(system);
});
router.put("/irrigation-systems/:id", async (req, res) => {
    const system = await irrigationRepo().findOne({ where: { id: req.params.id } });
    if (!system) {
        res.status(404).json({ message: "Irrigation system not found" });
        return;
    }
    if (req.body.systemType !== undefined) {
        const type = String(req.body.systemType).trim().toLowerCase();
        if (!IrrigationSystem_1.irrigationTypes.includes(type)) {
            res.status(400).json({ message: "Invalid systemType" });
            return;
        }
        system.systemType = type;
    }
    if (req.body.coverageAreaOrCapacity !== undefined) {
        system.coverageAreaOrCapacity = String(req.body.coverageAreaOrCapacity ?? "").trim() || undefined;
    }
    if (req.body.powerSource !== undefined) {
        const source = String(req.body.powerSource).trim().toLowerCase();
        if (!IrrigationSystem_1.powerSources.includes(source)) {
            res.status(400).json({ message: "Invalid powerSource" });
            return;
        }
        system.powerSource = source;
    }
    if (req.body.status !== undefined) {
        const status = String(req.body.status).trim().toLowerCase();
        if (!IrrigationSystem_1.irrigationStatuses.includes(status)) {
            res.status(400).json({ message: "Invalid status" });
            return;
        }
        system.status = status;
    }
    await irrigationRepo().save(system);
    res.json(system);
});
router.post("/irrigation-systems/:id/water-usage", async (req, res) => {
    const system = await irrigationRepo().findOne({ where: { id: req.params.id } });
    if (!system) {
        res.status(404).json({ message: "Irrigation system not found" });
        return;
    }
    const date = String(req.body?.date ?? "").trim();
    const usageLiters = String(req.body?.usageLiters ?? "").trim();
    if (!isValidDate(date) || !usageLiters) {
        res.status(400).json({ message: "date and usageLiters are required" });
        return;
    }
    system.waterUsageLog = [...(system.waterUsageLog ?? []), { date, usageLiters }];
    await irrigationRepo().save(system);
    res.status(201).json(system);
});
router.post("/irrigation-systems/:id/fuel-usage", async (req, res) => {
    const system = await irrigationRepo().findOne({ where: { id: req.params.id } });
    if (!system) {
        res.status(404).json({ message: "Irrigation system not found" });
        return;
    }
    const date = String(req.body?.date ?? "").trim();
    const amount = String(req.body?.amount ?? "").trim();
    const unit = String(req.body?.unit ?? "").trim().toLowerCase();
    if (!isValidDate(date) || !amount || !["liters", "kwh"].includes(unit)) {
        res.status(400).json({ message: "date, amount and unit (liters|kwh) are required" });
        return;
    }
    system.fuelUsageLog = [...(system.fuelUsageLog ?? []), { date, amount, unit }];
    await irrigationRepo().save(system);
    res.status(201).json(system);
});
router.post("/irrigation-systems/:id/maintenance-schedule", async (req, res) => {
    const system = await irrigationRepo().findOne({ where: { id: req.params.id } });
    if (!system) {
        res.status(404).json({ message: "Irrigation system not found" });
        return;
    }
    const scheduledDate = String(req.body?.scheduledDate ?? "").trim();
    if (!isValidDate(scheduledDate)) {
        res.status(400).json({ message: "scheduledDate (YYYY-MM-DD) is required" });
        return;
    }
    const set = new Set([...(system.scheduledMaintenanceDates ?? []), scheduledDate]);
    system.scheduledMaintenanceDates = Array.from(set).sort();
    await irrigationRepo().save(system);
    res.status(201).json(system);
});
router.get("/maintenance-schedule", async (_req, res) => {
    const assets = await assetRepo().find();
    const irrigationSystems = await irrigationRepo().find();
    const assetEntries = assets.flatMap((asset) => (asset.maintenanceLogEntries ?? [])
        .filter((entry) => entry.nextDueDate)
        .map((entry) => ({
        sourceType: "asset",
        sourceId: asset.id,
        sourceName: asset.name,
        scheduledDate: entry.nextDueDate
    })));
    const irrigationEntries = irrigationSystems.flatMap((system) => (system.scheduledMaintenanceDates ?? []).map((date) => ({
        sourceType: "irrigation",
        sourceId: system.id,
        sourceName: `${system.systemType} (${system.powerSource})`,
        scheduledDate: date
    })));
    const entries = [...assetEntries, ...irrigationEntries].sort((a, b) => String(a.scheduledDate).localeCompare(String(b.scheduledDate)));
    res.json(entries);
});
exports.default = router;
