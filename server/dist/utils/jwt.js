"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.signAccessToken = signAccessToken;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
function signAccessToken(user) {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
        throw new Error("JWT_SECRET is not set");
    }
    const options = {
        expiresIn: (process.env.JWT_EXPIRES_IN || "7d")
    };
    return jsonwebtoken_1.default.sign({
        sub: user.id,
        email: user.email,
        role: user.role
    }, secret, options);
}
