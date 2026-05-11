import { Router } from "express";
import { AppDataSource } from "../data-source";
import { Worker, type WorkerType, workerTypes } from "../entities/Worker";
import { WorkerAttendance } from "../entities/WorkerAttendance";

const router = Router();
const workerRepo = () => AppDataSource.getRepository(Worker);
const attendanceRepo = () => AppDataSource.getRepository(WorkerAttendance);

function isValidDate(value: string): boolean {
  return /^\d{4}-\d{2}-\d{2}$/.test(value);
}

router.get("/workers", async (_req, res) => {
  const workers = await workerRepo().find({ order: { createdAt: "DESC" } });
  res.json(
    workers.map((worker) => ({
      ...worker,
      name: worker.name || `${worker.firstName} ${worker.lastName}`.trim()
    }))
  );
});

router.post("/workers", async (req, res) => {
  const name = String(req.body?.name ?? "").trim();
  const type = String(req.body?.type ?? "").trim().toLowerCase() as WorkerType;
  const wageRate = String(req.body?.wageRate ?? "").trim();
  const monthlySalary = String(req.body?.monthlySalary ?? "").trim();
  const casualPayMode = String(req.body?.casualPayMode ?? "day").trim().toLowerCase() as "day" | "task";
  const assignedTasks = Array.isArray(req.body?.assignedTasks)
    ? req.body.assignedTasks.map((task: unknown) => String(task))
    : [];

  if (!name) {
    res.status(400).json({ message: "name is required" });
    return;
  }
  if (!workerTypes.includes(type)) {
    res.status(400).json({ message: "type must be permanent or casual" });
    return;
  }
  if (type === "permanent" && !monthlySalary) {
    res.status(400).json({ message: "monthlySalary is required for permanent workers" });
    return;
  }
  if (type === "casual" && !wageRate) {
    res.status(400).json({ message: "wageRate is required for casual workers" });
    return;
  }

  const normalized = name.toLowerCase().replace(/[^a-z0-9]+/g, "");
  const seed = Math.floor(Math.random() * 10000)
    .toString()
    .padStart(4, "0");
  const employeeNumber = `EMP-${normalized.slice(0, 4).toUpperCase() || "WORK"}-${seed}`;
  const parts = name.split(/\s+/);
  const firstName = parts[0] || name;
  const lastName = parts.slice(1).join(" ") || "-";

  const worker = workerRepo().create({
    name,
    firstName,
    lastName,
    employeeNumber,
    type,
    wageRate: wageRate || undefined,
    monthlySalary: monthlySalary || undefined,
    casualPayMode,
    assignedTasks
  });
  await workerRepo().save(worker);
  res.status(201).json(worker);
});

router.get("/attendance", async (req, res) => {
  const from = String(req.query.from ?? "").trim();
  const to = String(req.query.to ?? "").trim();
  const qb = attendanceRepo()
    .createQueryBuilder("attendance")
    .leftJoinAndSelect("attendance.worker", "worker")
    .orderBy("attendance.attendanceDate", "DESC");

  if (from) qb.andWhere("attendance.attendanceDate >= :from", { from });
  if (to) qb.andWhere("attendance.attendanceDate <= :to", { to });

  const records = await qb.getMany();
  res.json(records);
});

router.post("/attendance", async (req, res) => {
  const workerId = String(req.body?.workerId ?? "").trim();
  const date = String(req.body?.date ?? "").trim();
  const hoursWorked = String(req.body?.hoursWorked ?? "").trim();
  const taskPerformed = String(req.body?.taskPerformed ?? "").trim();
  const allocationSystem = String(req.body?.allocationSystem ?? "").trim().toLowerCase();
  const allocationGroup = String(req.body?.allocationGroup ?? "").trim();

  if (!workerId || !isValidDate(date) || !hoursWorked || !taskPerformed) {
    res.status(400).json({ message: "workerId, date, hoursWorked and taskPerformed are required" });
    return;
  }
  if (!["crop", "livestock"].includes(allocationSystem)) {
    res.status(400).json({ message: "allocationSystem must be crop or livestock" });
    return;
  }
  if (!allocationGroup) {
    res.status(400).json({ message: "allocationGroup is required" });
    return;
  }

  const worker = await workerRepo().findOne({ where: { id: workerId } });
  if (!worker) {
    res.status(404).json({ message: "Worker not found" });
    return;
  }

  const record = attendanceRepo().create({
    worker,
    attendanceDate: date,
    present: true,
    hoursWorked,
    taskPerformed,
    allocationSystem: allocationSystem as "crop" | "livestock",
    allocationGroup
  });
  await attendanceRepo().save(record);
  res.status(201).json(record);
});

router.get("/payroll-summary", async (req, res) => {
  const month = String(req.query.month ?? "").trim();
  if (!/^\d{4}-\d{2}$/.test(month)) {
    res.status(400).json({ message: "month query is required in YYYY-MM format" });
    return;
  }
  const [yearText, monthText] = month.split("-");
  const year = Number(yearText);
  const monthNum = Number(monthText);
  const from = `${yearText}-${monthText}-01`;
  const toDate = new Date(Date.UTC(year, monthNum, 0));
  const to = `${yearText}-${monthText}-${String(toDate.getUTCDate()).padStart(2, "0")}`;

  const workers = await workerRepo().find();
  const attendance = await attendanceRepo()
    .createQueryBuilder("attendance")
    .leftJoinAndSelect("attendance.worker", "worker")
    .where("attendance.attendanceDate >= :from", { from })
    .andWhere("attendance.attendanceDate <= :to", { to })
    .getMany();

  const costByWorkerId = new Map<string, number>();
  for (const row of attendance) {
    const worker = row.worker;
    if (!worker) continue;
    let cost = 0;
    if (worker.type === "permanent") {
      const monthly = Number(worker.monthlySalary || 0);
      const daysInMonth = toDate.getUTCDate();
      cost = monthly / daysInMonth;
    } else {
      const rate = Number(worker.wageRate || 0);
      if (worker.casualPayMode === "task") {
        cost = rate;
      } else {
        const hours = Number(row.hoursWorked || 0);
        cost = rate * (hours > 0 ? hours / 8 : 1);
      }
    }
    costByWorkerId.set(worker.id, (costByWorkerId.get(worker.id) ?? 0) + cost);
  }

  const cropBreakdown = new Map<string, number>();
  const livestockBreakdown = new Map<string, number>();
  for (const row of attendance) {
    const worker = row.worker;
    if (!worker) continue;
    const cost = costByWorkerId.get(worker.id) ?? 0;
    const current = row.allocationSystem === "crop" ? cropBreakdown : livestockBreakdown;
    const key = row.allocationGroup || "Unassigned";
    current.set(key, (current.get(key) ?? 0) + cost / Math.max(1, attendance.filter((a) => a.worker?.id === worker.id).length));
  }

  const totalMonthlySalaries = workers
    .filter((worker) => worker.type === "permanent")
    .reduce((sum, worker) => sum + Number(worker.monthlySalary || 0), 0);
  const totalCasual = Array.from(costByWorkerId.entries())
    .filter(([id]) => workers.find((w) => w.id === id)?.type === "casual")
    .reduce((sum, [, amount]) => sum + amount, 0);

  res.json({
    month,
    totals: {
      permanentMonthly: Number(totalMonthlySalaries.toFixed(2)),
      casual: Number(totalCasual.toFixed(2)),
      totalLabourCost: Number((totalMonthlySalaries + totalCasual).toFixed(2))
    },
    cropBreakdown: Array.from(cropBreakdown.entries()).map(([group, cost]) => ({
      group,
      cost: Number(cost.toFixed(2))
    })),
    livestockBreakdown: Array.from(livestockBreakdown.entries()).map(([group, cost]) => ({
      group,
      cost: Number(cost.toFixed(2))
    }))
  });
});

export default router;
