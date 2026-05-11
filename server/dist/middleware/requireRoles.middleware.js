"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireRoles = requireRoles;
function requireRoles(...allowed) {
    return (req, res, next) => {
        const role = req.auth?.role;
        if (!role) {
            res.status(401).json({ message: "Unauthorized" });
            return;
        }
        if (!allowed.includes(role)) {
            res.status(403).json({ message: "Forbidden" });
            return;
        }
        next();
    };
}
