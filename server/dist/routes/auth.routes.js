"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const bcrypt_1 = __importDefault(require("bcrypt"));
const data_source_1 = require("../data-source");
const User_1 = require("../entities/User");
const jwt_1 = require("../utils/jwt");
const router = (0, express_1.Router)();
const userRepo = () => data_source_1.AppDataSource.getRepository(User_1.User);
const BCRYPT_ROUNDS = 12;
function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}
router.post("/register", async (req, res) => {
    try {
        const email = String(req.body?.email ?? "").trim().toLowerCase();
        const password = String(req.body?.password ?? "");
        const requestedRole = String(req.body?.role ?? User_1.UserRole.WORKER);
        if (!email || !password) {
            res.status(400).json({ message: "Email and password are required" });
            return;
        }
        if (!isValidEmail(email)) {
            res.status(400).json({ message: "Invalid email" });
            return;
        }
        if (password.length < 8) {
            res.status(400).json({ message: "Password must be at least 8 characters" });
            return;
        }
        const allowedRoles = [User_1.UserRole.ADMIN, User_1.UserRole.MANAGER, User_1.UserRole.WORKER];
        if (!allowedRoles.includes(requestedRole)) {
            res.status(400).json({ message: "Invalid role" });
            return;
        }
        const count = await userRepo().count();
        let role = requestedRole;
        if (count > 0 && (requestedRole === User_1.UserRole.ADMIN || requestedRole === User_1.UserRole.MANAGER)) {
            res.status(403).json({
                message: "Only worker self-registration is allowed. Ask an admin to create manager or admin accounts."
            });
            return;
        }
        if (count === 0 && requestedRole !== User_1.UserRole.ADMIN) {
            role = User_1.UserRole.ADMIN;
        }
        const existing = await userRepo().findOne({ where: { email } });
        if (existing) {
            res.status(409).json({ message: "Email already registered" });
            return;
        }
        const passwordHash = await bcrypt_1.default.hash(password, BCRYPT_ROUNDS);
        const user = userRepo().create({ email, passwordHash, role });
        await userRepo().save(user);
        const accessToken = (0, jwt_1.signAccessToken)({ id: user.id, email: user.email, role: user.role });
        res.status(201).json({
            accessToken,
            user: { id: user.id, email: user.email, role: user.role }
        });
    }
    catch (error) {
        res.status(500).json({ message: "Registration failed" });
    }
});
router.post("/login", async (req, res) => {
    try {
        const email = String(req.body?.email ?? "").trim().toLowerCase();
        const password = String(req.body?.password ?? "");
        if (!email || !password) {
            res.status(400).json({ message: "Email and password are required" });
            return;
        }
        const user = await userRepo().findOne({
            where: { email },
            select: ["id", "email", "role", "passwordHash", "createdAt", "updatedAt"]
        });
        if (!user?.passwordHash) {
            res.status(401).json({ message: "Invalid credentials" });
            return;
        }
        const match = await bcrypt_1.default.compare(password, user.passwordHash);
        if (!match) {
            res.status(401).json({ message: "Invalid credentials" });
            return;
        }
        const accessToken = (0, jwt_1.signAccessToken)({ id: user.id, email: user.email, role: user.role });
        res.json({
            accessToken,
            user: { id: user.id, email: user.email, role: user.role }
        });
    }
    catch {
        res.status(500).json({ message: "Login failed" });
    }
});
exports.default = router;
