import jwt, { type SignOptions } from "jsonwebtoken";
import { UserRole } from "../entities/User";

export function signAccessToken(user: { id: string; email: string; role: UserRole }): string {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("JWT_SECRET is not set");
  }
  const options: SignOptions = {
    expiresIn: (process.env.JWT_EXPIRES_IN || "7d") as SignOptions["expiresIn"]
  };
  return jwt.sign(
    {
      sub: user.id,
      email: user.email,
      role: user.role
    },
    secret,
    options
  );
}
