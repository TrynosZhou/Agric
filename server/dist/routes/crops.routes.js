"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const data_source_1 = require("../data-source");
const Crop_1 = require("../entities/Crop");
const Field_1 = require("../entities/Field");
const DetasselingTask_1 = require("../entities/DetasselingTask");
const TomatoHarvestCycle_1 = require("../entities/TomatoHarvestCycle");
const router = (0, express_1.Router)();
const cropRepo = () => data_source_1.AppDataSource.getRepository(Crop_1.Crop);
const fieldRepo = () => data_source_1.AppDataSource.getRepository(Field_1.Field);
const taskRepo = () => data_source_1.AppDataSource.getRepository(DetasselingTask_1.DetasselingTask);
const cycleRepo = () => data_source_1.AppDataSource.getRepository(TomatoHarvestCycle_1.TomatoHarvestCycle);
function isValidDate(value) {
    return /^\d{4}-\d{2}-\d{2}$/.test(value);
}
router.get("/", async (_req, res) => {
    const crops = await cropRepo().find({
        relations: { field: true, detasselingTasks: true, harvestCycles: true },
        order: { createdAt: "DESC" }
    });
    res.json(crops);
});
router.get("/:id", async (req, res) => {
    const crop = await cropRepo().findOne({
        where: { id: req.params.id },
        relations: { field: true, detasselingTasks: true, harvestCycles: true }
    });
    if (!crop) {
        res.status(404).json({ message: "Crop not found" });
        return;
    }
    res.json(crop);
});
router.post("/", async (req, res) => {
    const cropType = String(req.body?.cropType ?? "").trim().toLowerCase();
    const customCropType = String(req.body?.customCropType ?? "").trim();
    const fieldId = String(req.body?.fieldId ?? "").trim();
    const plantingDate = String(req.body?.plantingDate ?? "").trim();
    const growthStage = String(req.body?.growthStage ?? "").trim();
    const irrigationSchedule = String(req.body?.irrigationSchedule ?? "").trim();
    const estimatedYieldRaw = String(req.body?.estimatedYield ?? "").trim();
    if (!Crop_1.cropTypes.includes(cropType)) {
        res.status(400).json({ message: "Invalid crop type" });
        return;
    }
    if (cropType === "custom" && !customCropType) {
        res.status(400).json({ message: "Custom crop type name is required" });
        return;
    }
    if (!fieldId) {
        res.status(400).json({ message: "Field is required" });
        return;
    }
    if (!isValidDate(plantingDate)) {
        res.status(400).json({ message: "Valid planting date is required (YYYY-MM-DD)" });
        return;
    }
    const field = await fieldRepo().findOne({ where: { id: fieldId } });
    if (!field) {
        res.status(404).json({ message: "Field not found" });
        return;
    }
    const crop = cropRepo().create({
        cropType,
        customCropType: cropType === "custom" ? customCropType : undefined,
        field,
        fieldName: field.name,
        plantingDate,
        growthStage: growthStage || "planned",
        irrigationSchedule: irrigationSchedule || undefined,
        estimatedYield: estimatedYieldRaw || undefined,
        fertilizerApplications: [],
        pesticideApplications: []
    });
    await cropRepo().save(crop);
    const saved = await cropRepo().findOne({
        where: { id: crop.id },
        relations: { field: true, detasselingTasks: true, harvestCycles: true }
    });
    res.status(201).json(saved);
});
router.put("/:id", async (req, res) => {
    const crop = await cropRepo().findOne({
        where: { id: req.params.id },
        relations: { field: true }
    });
    if (!crop) {
        res.status(404).json({ message: "Crop not found" });
        return;
    }
    if (req.body.cropType) {
        const cropType = String(req.body.cropType).trim().toLowerCase();
        if (!Crop_1.cropTypes.includes(cropType)) {
            res.status(400).json({ message: "Invalid crop type" });
            return;
        }
        crop.cropType = cropType;
        if (cropType !== "custom") {
            crop.customCropType = undefined;
        }
    }
    if (req.body.customCropType !== undefined) {
        crop.customCropType = String(req.body.customCropType ?? "").trim() || undefined;
    }
    if (req.body.fieldId) {
        const field = await fieldRepo().findOne({ where: { id: String(req.body.fieldId) } });
        if (!field) {
            res.status(404).json({ message: "Field not found" });
            return;
        }
        crop.field = field;
        crop.fieldName = field.name;
    }
    if (req.body.plantingDate !== undefined) {
        const plantingDate = String(req.body.plantingDate ?? "").trim();
        if (!isValidDate(plantingDate)) {
            res.status(400).json({ message: "Valid planting date is required (YYYY-MM-DD)" });
            return;
        }
        crop.plantingDate = plantingDate;
    }
    if (req.body.growthStage !== undefined) {
        crop.growthStage = String(req.body.growthStage ?? "").trim() || "planned";
    }
    if (req.body.irrigationSchedule !== undefined) {
        crop.irrigationSchedule = String(req.body.irrigationSchedule ?? "").trim() || undefined;
    }
    if (req.body.estimatedYield !== undefined) {
        const estimatedYield = String(req.body.estimatedYield ?? "").trim();
        crop.estimatedYield = estimatedYield || undefined;
    }
    await cropRepo().save(crop);
    const saved = await cropRepo().findOne({
        where: { id: crop.id },
        relations: { field: true, detasselingTasks: true, harvestCycles: true }
    });
    res.json(saved);
});
router.delete("/:id", async (req, res) => {
    const crop = await cropRepo().findOne({ where: { id: req.params.id } });
    if (!crop) {
        res.status(404).json({ message: "Crop not found" });
        return;
    }
    await cropRepo().remove(crop);
    res.status(204).send();
});
router.post("/:id/activities", async (req, res) => {
    const crop = await cropRepo().findOne({ where: { id: req.params.id } });
    if (!crop) {
        res.status(404).json({ message: "Crop not found" });
        return;
    }
    const activityType = String(req.body?.activityType ?? "").trim().toLowerCase();
    const date = String(req.body?.date ?? "").trim();
    const product = String(req.body?.product ?? "").trim();
    const quantity = String(req.body?.quantity ?? "").trim();
    const notes = String(req.body?.notes ?? "").trim();
    if (!["fertilizer", "pesticide"].includes(activityType)) {
        res.status(400).json({ message: "activityType must be fertilizer or pesticide" });
        return;
    }
    if (!isValidDate(date) || !product || !quantity) {
        res.status(400).json({ message: "date, product and quantity are required" });
        return;
    }
    const record = { date, product, quantity, notes: notes || undefined };
    if (activityType === "fertilizer") {
        crop.fertilizerApplications = [...(crop.fertilizerApplications ?? []), record];
    }
    else {
        crop.pesticideApplications = [...(crop.pesticideApplications ?? []), record];
    }
    await cropRepo().save(crop);
    res.status(201).json(crop);
});
router.post("/:id/detasseling-tasks", async (req, res) => {
    const crop = await cropRepo().findOne({ where: { id: req.params.id } });
    if (!crop) {
        res.status(404).json({ message: "Crop not found" });
        return;
    }
    if (crop.cropType !== "seed maize") {
        res.status(400).json({ message: "Detasseling tasks are only available for seed maize" });
        return;
    }
    const assignedWorker = String(req.body?.assignedWorker ?? "").trim();
    const field = String(req.body?.field ?? crop.fieldName).trim();
    const rowsCompleted = Number(req.body?.rowsCompleted ?? 0);
    const status = String(req.body?.status ?? "pending").trim().toLowerCase();
    if (!assignedWorker || !field || Number.isNaN(rowsCompleted) || rowsCompleted < 0) {
        res.status(400).json({ message: "assignedWorker, field and non-negative rowsCompleted are required" });
        return;
    }
    if (!DetasselingTask_1.detasselingStatuses.includes(status)) {
        res.status(400).json({ message: "Invalid status" });
        return;
    }
    const task = taskRepo().create({ crop, assignedWorker, field, rowsCompleted, status });
    await taskRepo().save(task);
    res.status(201).json(task);
});
router.put("/:id/detasseling-tasks/:taskId", async (req, res) => {
    const task = await taskRepo().findOne({
        where: { id: req.params.taskId, crop: { id: req.params.id } },
        relations: { crop: true }
    });
    if (!task) {
        res.status(404).json({ message: "Detasseling task not found" });
        return;
    }
    if (req.body.assignedWorker !== undefined) {
        task.assignedWorker = String(req.body.assignedWorker ?? "").trim();
    }
    if (req.body.field !== undefined) {
        task.field = String(req.body.field ?? "").trim();
    }
    if (req.body.rowsCompleted !== undefined) {
        const rowsCompleted = Number(req.body.rowsCompleted);
        if (Number.isNaN(rowsCompleted) || rowsCompleted < 0) {
            res.status(400).json({ message: "rowsCompleted must be a non-negative number" });
            return;
        }
        task.rowsCompleted = rowsCompleted;
    }
    if (req.body.status !== undefined) {
        const status = String(req.body.status).trim().toLowerCase();
        if (!DetasselingTask_1.detasselingStatuses.includes(status)) {
            res.status(400).json({ message: "Invalid status" });
            return;
        }
        task.status = status;
    }
    await taskRepo().save(task);
    res.json(task);
});
router.post("/:id/harvest-cycles", async (req, res) => {
    const crop = await cropRepo().findOne({ where: { id: req.params.id } });
    if (!crop) {
        res.status(404).json({ message: "Crop not found" });
        return;
    }
    if (crop.cropType !== "tomatoes") {
        res.status(400).json({ message: "Harvest cycles are only available for tomatoes" });
        return;
    }
    const cycleNumber = Number(req.body?.cycleNumber);
    const harvestedOn = String(req.body?.harvestedOn ?? "").trim();
    const quantityKg = String(req.body?.quantityKg ?? "").trim();
    const notes = String(req.body?.notes ?? "").trim();
    if (Number.isNaN(cycleNumber) || cycleNumber <= 0 || !isValidDate(harvestedOn) || !quantityKg) {
        res.status(400).json({ message: "cycleNumber, harvestedOn and quantityKg are required" });
        return;
    }
    const cycle = cycleRepo().create({
        crop,
        cycleNumber,
        harvestedOn,
        quantityKg,
        notes: notes || undefined
    });
    await cycleRepo().save(cycle);
    res.status(201).json(cycle);
});
exports.default = router;
