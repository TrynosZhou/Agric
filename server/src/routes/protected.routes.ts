import { Router } from "express";
import { AppDataSource } from "../data-source";
import { User, UserRole } from "../entities/User";
import { requireRoles } from "../middleware/requireRoles.middleware";
import cropsRoutes from "./crops.routes";
import fieldsRoutes from "./fields.routes";
import livestockRoutes from "./livestock.routes";
import labourRoutes from "./labour.routes";
import assetsIrrigationRoutes from "./assets-irrigation.routes";
import hayRoutes from "./hay.routes";
import financeRoutes from "./finance.routes";
import notificationsRoutes from "./notifications.routes";
import dashboardRoutes from "./dashboard.routes";

const router = Router();
router.use("/crops", cropsRoutes);
router.use("/fields", fieldsRoutes);
router.use("/livestock", livestockRoutes);
router.use("/labour", labourRoutes);
router.use("/operations", assetsIrrigationRoutes);
router.use("/hay", hayRoutes);
router.use("/finance", financeRoutes);
router.use("/notifications", notificationsRoutes);
router.use("/dashboard", dashboardRoutes);

router.get("/me", async (req, res) => {
  if (!req.auth) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }

  const user = await AppDataSource.getRepository(User).findOne({
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

router.get("/admin/ping", requireRoles(UserRole.ADMIN), (_req, res) => {
  res.json({ scope: "admin" });
});

router.get("/manager/ping", requireRoles(UserRole.ADMIN, UserRole.MANAGER), (_req, res) => {
  res.json({ scope: "manager" });
});

router.get("/worker/ping", requireRoles(UserRole.WORKER), (_req, res) => {
  res.json({ scope: "worker" });
});

export default router;
