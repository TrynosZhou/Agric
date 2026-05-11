"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const data_source_1 = require("../data-source");
const LivestockAnimal_1 = require("../entities/LivestockAnimal");
const PoultryBatch_1 = require("../entities/PoultryBatch");
const router = (0, express_1.Router)();
const animalRepo = () => data_source_1.AppDataSource.getRepository(LivestockAnimal_1.LivestockAnimal);
const poultryRepo = () => data_source_1.AppDataSource.getRepository(PoultryBatch_1.PoultryBatch);
function isValidDate(value) {
    return /^\d{4}-\d{2}-\d{2}$/.test(value);
}
router.get("/", async (req, res) => {
    const type = String(req.query.type ?? "all").toLowerCase();
    const species = String(req.query.species ?? "").toLowerCase();
    if (type === "poultry") {
        const poultry = await poultryRepo().find({ order: { createdAt: "DESC" } });
        res.json({ animals: [], poultry });
        return;
    }
    const where = {};
    if (species && LivestockAnimal_1.individualSpecies.includes(species)) {
        where.species = species;
    }
    const animals = await animalRepo().find({ where, order: { createdAt: "DESC" } });
    if (type === "individual") {
        res.json({ animals, poultry: [] });
        return;
    }
    const poultry = await poultryRepo().find({ order: { createdAt: "DESC" } });
    res.json({ animals, poultry });
});
router.post("/animals", async (req, res) => {
    const species = String(req.body?.species ?? "").trim().toLowerCase();
    const tagIdNumber = String(req.body?.tagIdNumber ?? "").trim();
    const dateOfBirth = String(req.body?.dateOfBirth ?? "").trim();
    if (!LivestockAnimal_1.individualSpecies.includes(species)) {
        res.status(400).json({ message: "species must be cattle, goats or pigs" });
        return;
    }
    if (!tagIdNumber || !dateOfBirth || !isValidDate(dateOfBirth)) {
        res.status(400).json({ message: "tagIdNumber and valid dateOfBirth are required" });
        return;
    }
    const existing = await animalRepo().findOne({ where: { tagIdNumber } });
    if (existing) {
        res.status(409).json({ message: "Tag/ID number already exists" });
        return;
    }
    const animal = animalRepo().create({
        species,
        tagIdNumber,
        dateOfBirth,
        weightHistory: [],
        vaccinationRecords: [],
        dippingRecords: [],
        treatmentHistory: [],
        dailyMilkProduction: [],
        isDead: false
    });
    await animalRepo().save(animal);
    res.status(201).json(animal);
});
router.get("/animals/:id", async (req, res) => {
    const animal = await animalRepo().findOne({ where: { id: req.params.id } });
    if (!animal) {
        res.status(404).json({ message: "Animal not found" });
        return;
    }
    res.json(animal);
});
router.put("/animals/:id", async (req, res) => {
    const animal = await animalRepo().findOne({ where: { id: req.params.id } });
    if (!animal) {
        res.status(404).json({ message: "Animal not found" });
        return;
    }
    if (req.body.species !== undefined) {
        const species = String(req.body.species).trim().toLowerCase();
        if (!LivestockAnimal_1.individualSpecies.includes(species)) {
            res.status(400).json({ message: "Invalid species" });
            return;
        }
        animal.species = species;
    }
    if (req.body.dateOfBirth !== undefined) {
        const dateOfBirth = String(req.body.dateOfBirth).trim();
        if (!isValidDate(dateOfBirth)) {
            res.status(400).json({ message: "dateOfBirth must use YYYY-MM-DD" });
            return;
        }
        animal.dateOfBirth = dateOfBirth;
    }
    await animalRepo().save(animal);
    res.json(animal);
});
router.post("/animals/:id/health-events", async (req, res) => {
    const animal = await animalRepo().findOne({ where: { id: req.params.id } });
    if (!animal) {
        res.status(404).json({ message: "Animal not found" });
        return;
    }
    const eventType = String(req.body?.eventType ?? "").trim().toLowerCase();
    const date = String(req.body?.date ?? "").trim();
    if (!isValidDate(date)) {
        res.status(400).json({ message: "A valid event date (YYYY-MM-DD) is required" });
        return;
    }
    if (eventType === "weight") {
        const weightKg = String(req.body?.weightKg ?? "").trim();
        if (!weightKg) {
            res.status(400).json({ message: "weightKg is required" });
            return;
        }
        animal.weightHistory = [...animal.weightHistory, { date, weightKg }];
    }
    else if (eventType === "vaccination") {
        const vaccineType = String(req.body?.vaccineType ?? "").trim();
        const nextDueDate = String(req.body?.nextDueDate ?? "").trim();
        if (!vaccineType) {
            res.status(400).json({ message: "vaccineType is required" });
            return;
        }
        animal.vaccinationRecords = [
            ...animal.vaccinationRecords,
            {
                date,
                vaccineType,
                nextDueDate: isValidDate(nextDueDate) ? nextDueDate : undefined,
                notes: String(req.body?.notes ?? "").trim() || undefined
            }
        ];
    }
    else if (eventType === "dipping") {
        const product = String(req.body?.product ?? "").trim();
        if (!product) {
            res.status(400).json({ message: "product is required" });
            return;
        }
        animal.dippingRecords = [
            ...animal.dippingRecords,
            { date, product, notes: String(req.body?.notes ?? "").trim() || undefined }
        ];
    }
    else if (eventType === "treatment") {
        const treatment = String(req.body?.treatment ?? "").trim();
        if (!treatment) {
            res.status(400).json({ message: "treatment is required" });
            return;
        }
        animal.treatmentHistory = [
            ...animal.treatmentHistory,
            {
                date,
                treatment,
                diagnosis: String(req.body?.diagnosis ?? "").trim() || undefined,
                notes: String(req.body?.notes ?? "").trim() || undefined
            }
        ];
    }
    else if (eventType === "milk-production") {
        if (animal.species !== "cattle") {
            res.status(400).json({ message: "Milk production is tracked only for cattle" });
            return;
        }
        const liters = String(req.body?.liters ?? "").trim();
        if (!liters) {
            res.status(400).json({ message: "liters is required" });
            return;
        }
        animal.dailyMilkProduction = [...animal.dailyMilkProduction, { date, liters }];
    }
    else if (eventType === "mortality") {
        animal.isDead = true;
        animal.mortalityDate = date;
        animal.mortalityNotes = String(req.body?.notes ?? "").trim() || undefined;
    }
    else {
        res.status(400).json({
            message: "eventType must be one of: weight, vaccination, dipping, treatment, milk-production, mortality"
        });
        return;
    }
    await animalRepo().save(animal);
    res.status(201).json(animal);
});
router.post("/poultry-batches", async (req, res) => {
    const batchCode = String(req.body?.batchCode ?? "").trim();
    const flockSize = Number(req.body?.flockSize ?? 0);
    if (!batchCode || Number.isNaN(flockSize) || flockSize <= 0) {
        res.status(400).json({ message: "batchCode and a positive flockSize are required" });
        return;
    }
    const existing = await poultryRepo().findOne({ where: { batchCode } });
    if (existing) {
        res.status(409).json({ message: "Batch code already exists" });
        return;
    }
    const batch = poultryRepo().create({
        batchCode,
        flockSize,
        mortalityCount: Number(req.body?.mortalityCount ?? 0),
        feedConsumptionKg: String(req.body?.feedConsumptionKg ?? "0"),
        eggProduction: Number(req.body?.eggProduction ?? 0)
    });
    await poultryRepo().save(batch);
    res.status(201).json(batch);
});
router.put("/poultry-batches/:id", async (req, res) => {
    const batch = await poultryRepo().findOne({ where: { id: req.params.id } });
    if (!batch) {
        res.status(404).json({ message: "Poultry batch not found" });
        return;
    }
    if (req.body.flockSize !== undefined)
        batch.flockSize = Number(req.body.flockSize);
    if (req.body.mortalityCount !== undefined)
        batch.mortalityCount = Number(req.body.mortalityCount);
    if (req.body.feedConsumptionKg !== undefined)
        batch.feedConsumptionKg = String(req.body.feedConsumptionKg);
    if (req.body.eggProduction !== undefined)
        batch.eggProduction = Number(req.body.eggProduction);
    await poultryRepo().save(batch);
    res.json(batch);
});
exports.default = router;
