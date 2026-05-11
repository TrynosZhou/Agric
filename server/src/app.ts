import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.routes";
import protectedRoutes from "./routes/protected.routes";
import { authMiddleware } from "./middleware/auth.middleware";

const app = express();

const corsOrigin = process.env.CORS_ORIGIN || "http://localhost:4200";
app.use(
  cors({
    origin: corsOrigin,
    credentials: true
  })
);
app.use(express.json());

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.use("/api/auth", authRoutes);
app.use("/api", authMiddleware, protectedRoutes);

export default app;
