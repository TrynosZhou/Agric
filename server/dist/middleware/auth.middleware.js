"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = authMiddleware;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
function authMiddleware(req, res, next) {
    const header = req.headers.authorization;
    if (!header?.startsWith("Bearer ")) {
        res.status(401).json({ message: "Missing or invalid authorization header" });
        return;
    }
    const token = header.slice("Bearer ".length).trim();
    const secret = process.env.JWT_SECRET;
    if (!secret) {
        res.status(500).json({ message: "Server misconfiguration" });
        return;
    }
    try {
        const payload = jsonwebtoken_1.default.verify(token, secret);
        req.auth = {
            userId: payload.sub,
            role: payload.role,
            email: payload.email
        };
        next();
    }
    catch {
        res.status(401).json({ message: "Invalid or expired token" });
    }
}
