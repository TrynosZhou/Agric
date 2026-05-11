import { Router } from "express";
import { AppDataSource } from "../data-source";
import { Field } from "../entities/Field";
import { requireRoles } from "../middleware/requireRoles.middleware";
import { UserRole } from "../entities/User";

const router = Router();

router.get("/", async (_req, res) => {
  const fields = await AppDataSource.getRepository(Field).find({ order: { name: "ASC" } });
  res.json(fields);
});

router.post("/", requireRoles(UserRole.ADMIN), async (req, res) => {
  const name = String(req.body?.name ?? "").trim();
  const sizeHectares = String(req.body?.sizeHectares ?? "").trim();
  const location = String(req.body?.location ?? "").trim();

  if (!name || !sizeHectares) {
    res.status(400).json({ message: "name and sizeHectares are required" });
    return;
  }

  const field = AppDataSource.getRepository(Field).create({
    name,
    sizeHectares,
    location: location || undefined
  });
  await AppDataSource.getRepository(Field).save(field);
  res.status(201).json(field);
});

export default router;
