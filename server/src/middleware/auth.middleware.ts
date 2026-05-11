import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { UserRole } from "../entities/User";

type JwtPayload = {
  sub: string;
  role: UserRole;
  email: string;
};

export function authMiddleware(req: Request, res: Response, next: NextFunction): void {
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
    const payload = jwt.verify(token, secret) as JwtPayload;
    req.auth = {
      userId: payload.sub,
      role: payload.role,
      email: payload.email
    };
    next();
  } catch {
    res.status(401).json({ message: "Invalid or expired token" });
  }
}
