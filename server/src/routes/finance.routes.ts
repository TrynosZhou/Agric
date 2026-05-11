import { Router } from "express";
import { AppDataSource } from "../data-source";
import { Crop } from "../entities/Crop";
import { FinanceEntry, financeCategories, type FinanceCategory } from "../entities/FinanceEntry";

const router = Router();
const financeRepo = () => AppDataSource.getRepository(FinanceEntry);
const cropRepo = () => AppDataSource.getRepository(Crop);

function isValidDate(value: string): boolean {
  return /^\d{4}-\d{2}-\d{2}$/.test(value);
}

router.get("/transactions", async (req, res) => {
  const from = String(req.query.from ?? "").trim();
  const to = String(req.query.to ?? "").trim();
  const entryType = String(req.query.type ?? "").trim().toLowerCase();
  const category = String(req.query.category ?? "").trim().toLowerCase();

  const qb = financeRepo()
    .createQueryBuilder("f")
    .leftJoinAndSelect("f.crop", "crop")
    .orderBy("f.date", "DESC")
    .addOrderBy("f.createdAt", "DESC");

  if (from) qb.andWhere("f.date >= :from", { from });
  if (to) qb.andWhere("f.date <= :to", { to });
  if (entryType && ["income", "expense"].includes(entryType)) qb.andWhere("f.entryType = :entryType", { entryType });
  if (category && financeCategories.includes(category as FinanceCategory)) qb.andWhere("f.category = :category", { category });

  const entries = await qb.getMany();
  res.json(entries);
});

router.post("/transactions", async (req, res) => {
  const entryType = String(req.body?.type ?? req.body?.entryType ?? "").trim().toLowerCase();
  const category = String(req.body?.category ?? "").trim().toLowerCase();
  const amount = String(req.body?.amount ?? "").trim();
  const date = String(req.body?.date ?? "").trim();
  const notes = String(req.body?.notes ?? "").trim();
  const cropId = String(req.body?.cropId ?? "").trim();
  const livestockGroup = String(req.body?.livestockGroup ?? "").trim();

  if (!["income", "expense"].includes(entryType)) {
    res.status(400).json({ message: "type must be income or expense" });
    return;
  }
  if (!financeCategories.includes(category as FinanceCategory)) {
    res.status(400).json({ message: "Invalid category" });
    return;
  }
  if (!amount || !isValidDate(date)) {
    res.status(400).json({ message: "amount and date (YYYY-MM-DD) are required" });
    return;
  }

  const entry = financeRepo().create({
    entryType: entryType as "income" | "expense",
    category: category as FinanceCategory,
    amount,
    date,
    notes: notes || undefined,
    livestockGroup: livestockGroup || undefined
  });

  if (cropId) {
    const crop = await cropRepo().findOne({ where: { id: cropId } });
    if (!crop) {
      res.status(404).json({ message: "Crop not found" });
      return;
    }
    entry.crop = crop;
  }

  await financeRepo().save(entry);
  res.status(201).json(entry);
});

router.get("/summary", async (req, res) => {
  const from = String(req.query.from ?? "").trim();
  const to = String(req.query.to ?? "").trim();

  const qb = financeRepo().createQueryBuilder("f");
  if (from) qb.andWhere("f.date >= :from", { from });
  if (to) qb.andWhere("f.date <= :to", { to });

  const entries = await qb.getMany();
  const totalIncome = entries
    .filter((e) => e.entryType === "income")
    .reduce((sum, e) => sum + Number(e.amount || 0), 0);
  const totalExpense = entries
    .filter((e) => e.entryType === "expense")
    .reduce((sum, e) => sum + Number(e.amount || 0), 0);

  res.json({
    from: from || null,
    to: to || null,
    totalIncome: Number(totalIncome.toFixed(2)),
    totalExpense: Number(totalExpense.toFixed(2)),
    netProfitLoss: Number((totalIncome - totalExpense).toFixed(2))
  });
});

router.get("/profit-per-crop", async (req, res) => {
  const from = String(req.query.from ?? "").trim();
  const to = String(req.query.to ?? "").trim();

  const qb = financeRepo().createQueryBuilder("f").leftJoinAndSelect("f.crop", "crop");
  if (from) qb.andWhere("f.date >= :from", { from });
  if (to) qb.andWhere("f.date <= :to", { to });

  const entries = await qb.getMany();
  const byCrop = new Map<string, { cropId: string; cropName: string; income: number; expense: number }>();

  for (const e of entries) {
    if (!e.crop?.id) continue;
    const key = e.crop.id;
    const row = byCrop.get(key) ?? { cropId: key, cropName: e.crop.fieldName, income: 0, expense: 0 };
    const amount = Number(e.amount || 0);
    if (e.entryType === "income") row.income += amount;
    else row.expense += amount;
    byCrop.set(key, row);
  }

  const result = Array.from(byCrop.values()).map((r) => ({
    cropId: r.cropId,
    cropName: r.cropName,
    income: Number(r.income.toFixed(2)),
    expense: Number(r.expense.toFixed(2)),
    profit: Number((r.income - r.expense).toFixed(2))
  }));

  res.json(result.sort((a, b) => b.profit - a.profit));
});

router.get("/profit-per-livestock-group", async (req, res) => {
  const from = String(req.query.from ?? "").trim();
  const to = String(req.query.to ?? "").trim();

  const qb = financeRepo().createQueryBuilder("f");
  if (from) qb.andWhere("f.date >= :from", { from });
  if (to) qb.andWhere("f.date <= :to", { to });

  const entries = await qb.getMany();
  const byGroup = new Map<string, { group: string; income: number; expense: number }>();

  for (const e of entries) {
    const group = (e.livestockGroup ?? "").trim();
    if (!group) continue;
    const row = byGroup.get(group) ?? { group, income: 0, expense: 0 };
    const amount = Number(e.amount || 0);
    if (e.entryType === "income") row.income += amount;
    else row.expense += amount;
    byGroup.set(group, row);
  }

  const result = Array.from(byGroup.values()).map((r) => ({
    group: r.group,
    income: Number(r.income.toFixed(2)),
    expense: Number(r.expense.toFixed(2)),
    profit: Number((r.income - r.expense).toFixed(2))
  }));

  res.json(result.sort((a, b) => b.profit - a.profit));
});

export default router;

