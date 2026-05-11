"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const data_source_1 = require("../data-source");
const User_1 = require("../entities/User");
const requireRoles_middleware_1 = require("../middleware/requireRoles.middleware");
const crops_routes_1 = __importDefault(require("./crops.routes"));
const fields_routes_1 = __importDefault(require("./fields.routes"));
const livestock_routes_1 = __importDefault(require("./livestock.routes"));
const labour_routes_1 = __importDefault(require("./labour.routes"));
const assets_irrigation_routes_1 = __importDefault(require("./assets-irrigation.routes"));
const hay_routes_1 = __importDefault(require("./hay.routes"));
const finance_routes_1 = __importDefault(require("./finance.routes"));
const notifications_routes_1 = __importDefault(require("./notifications.routes"));
const dashboard_routes_1 = __importDefault(require("./dashboard.routes"));
const router = (0, express_1.Router)();
router.use("/crops", crops_routes_1.default);
router.use("/fields", fields_routes_1.default);
router.use("/livestock", livestock_routes_1.default);
router.use("/labour", labour_routes_1.default);
router.use("/operations", assets_irrigation_routes_1.default);
router.use("/hay", hay_routes_1.default);
router.use("/finance", finance_routes_1.default);
router.use("/notifications", notifications_routes_1.default);
router.use("/dashboard", dashboard_routes_1.default);
router.get("/me", async (req, res) => {
    if (!req.auth) {
        res.status(401).json({ message: "Unauthorized" });
        return;
    }
    const user = await data_source_1.AppDataSource.getRepository(User_1.User).findOne({
        where: { id: req.auth.userId },
        select: ["id", "email", "role", "createdAt", "updatedAt"]
    });
    if (!user) {
        res.status(404).json({ message: "User not found" });
        return;
    }
    res.json({
        id: user.id,
        email: user.email,
        role: user.role
    });
});
router.get("/admin/ping", (0, requireRoles_middleware_1.requireRoles)(User_1.UserRole.ADMIN), (_req, res) => {
    res.json({ scope: "admin" });
});
router.get("/manager/ping", (0, requireRoles_middleware_1.requireRoles)(User_1.UserRole.ADMIN, User_1.UserRole.MANAGER), (_req, res) => {
    res.json({ scope: "manager" });
});
router.get("/worker/ping", (0, requireRoles_middleware_1.requireRoles)(User_1.UserRole.WORKER), (_req, res) => {
    res.json({ scope: "worker" });
});
exports.default = router;
