"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const data_source_1 = require("../data-source");
const Field_1 = require("../entities/Field");
const requireRoles_middleware_1 = require("../middleware/requireRoles.middleware");
const User_1 = require("../entities/User");
const router = (0, express_1.Router)();
router.get("/", async (_req, res) => {
    const fields = await data_source_1.AppDataSource.getRepository(Field_1.Field).find({ order: { name: "ASC" } });
    res.json(fields);
});
router.post("/", (0, requireRoles_middleware_1.requireRoles)(User_1.UserRole.ADMIN), async (req, res) => {
    const name = String(req.body?.name ?? "").trim();
    const sizeHectares = String(req.body?.sizeHectares ?? "").trim();
    const location = String(req.body?.location ?? "").trim();
    if (!name || !sizeHectares) {
        res.status(400).json({ message: "name and sizeHectares are required" });
        return;
    }
    const field = data_source_1.AppDataSource.getRepository(Field_1.Field).create({
        name,
        sizeHectares,
        location: location || undefined
    });
    await data_source_1.AppDataSource.getRepository(Field_1.Field).save(field);
    res.status(201).json(field);
});
exports.default = router;
