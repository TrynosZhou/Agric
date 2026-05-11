import type { NextFunction, Request, Response } from "express";
import { UserRole } from "../entities/User";

export function requireRoles(...allowed: UserRole[]) {
  return (req: Request, res: Response, next: NextFunction): void => {
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
