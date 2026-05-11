import { Router } from "express";
import { AppDataSource } from "../data-source";
import { HayBale } from "../entities/HayBale";
import { HayBaleCustomer } from "../entities/HayBaleCustomer";
import { HayBaleSale, paymentStatuses, type PaymentStatus } from "../entities/HayBaleSale";

const router = Router();
const hayRepo = () => AppDataSource.getRepository(HayBale);
const customerRepo = () => AppDataSource.getRepository(HayBaleCustomer);
const saleRepo = () => AppDataSource.getRepository(HayBaleSale);

function isValidDate(value: string): boolean {
  return /^\d{4}-\d{2}-\d{2}$/.test(value);
}

async function getOrCreateStockRecord(): Promise<HayBale> {
  const existing = await hayRepo().findOne({ where: { baleCode: null as unknown as string } });
  if (existing) return existing;
  const threshold = Number(process.env.HAY_LOW_STOCK_THRESHOLD ?? 50);
  const stock = hayRepo().create({
    baleCode: null as unknown as string,
    weightKg: null as unknown as string,
    totalBalesProduced: 0,
    balesInStock: 0,
    balesSold: 0,
    pricePerBale: "0",
    lowStockThreshold: Number.isFinite(threshold) ? threshold : 50
  });
  return await hayRepo().save(stock);
}

router.get("/stock", async (_req, res) => {
  const stock = await getOrCreateStockRecord();
  res.json({
    id: stock.id,
    totalBalesProduced: stock.totalBalesProduced,
    balesInStock: stock.balesInStock,
    balesSold: stock.balesSold,
    pricePerBale: stock.pricePerBale,
    lowStockThreshold: stock.lowStockThreshold,
    lowStock: stock.balesInStock < stock.lowStockThreshold
  });
});

router.put("/stock", async (req, res) => {
  const stock = await getOrCreateStockRecord();
  if (req.body.totalBalesProduced !== undefined) stock.totalBalesProduced = Number(req.body.totalBalesProduced);
  if (req.body.balesInStock !== undefined) stock.balesInStock = Number(req.body.balesInStock);
  if (req.body.balesSold !== undefined) stock.balesSold = Number(req.body.balesSold);
  if (req.body.pricePerBale !== undefined) stock.pricePerBale = String(req.body.pricePerBale);
  if (req.body.lowStockThreshold !== undefined) stock.lowStockThreshold = Number(req.body.lowStockThreshold);
  await hayRepo().save(stock);
  res.json(stock);
});

router.get("/customers", async (_req, res) => {
  const customers = await customerRepo().find({ order: { createdAt: "DESC" } });
  res.json(customers);
});

router.post("/customers", async (req, res) => {
  const fullName = String(req.body?.fullName ?? "").trim();
  const phoneNumber = String(req.body?.phoneNumber ?? "").trim();
  const email = String(req.body?.email ?? "").trim();
  if (!fullName) {
    res.status(400).json({ message: "fullName is required" });
    return;
  }
  const customer = customerRepo().create({
    fullName,
    phoneNumber: phoneNumber || undefined,
    email: email || undefined
  });
  await customerRepo().save(customer);
  res.status(201).json(customer);
});

router.get("/sales", async (_req, res) => {
  const sales = await saleRepo().find({ relations: { customer: true }, order: { saleDate: "DESC" } });
  res.json(sales);
});

router.post("/sales", async (req, res) => {
  const customerId = String(req.body?.customerId ?? "").trim();
  const quantity = Number(req.body?.quantity ?? 0);
  const price = String(req.body?.price ?? "").trim();
  const saleDate = String(req.body?.saleDate ?? "").trim();
  const paymentStatus = String(req.body?.paymentStatus ?? "pending").trim().toLowerCase() as PaymentStatus;

  if (!customerId || Number.isNaN(quantity) || quantity <= 0 || !price || !isValidDate(saleDate)) {
    res.status(400).json({ message: "customerId, quantity, price and saleDate are required" });
    return;
  }
  if (!paymentStatuses.includes(paymentStatus)) {
    res.status(400).json({ message: "paymentStatus must be paid or pending" });
    return;
  }

  const customer = await customerRepo().findOne({ where: { id: customerId } });
  if (!customer) {
    res.status(404).json({ message: "Customer not found" });
    return;
  }

  const stock = await getOrCreateStockRecord();
  if (stock.balesInStock < quantity) {
    res.status(400).json({ message: "Not enough bales in stock" });
    return;
  }

  const result = await AppDataSource.transaction(async (trx) => {
    const stockRepo = trx.getRepository(HayBale);
    const salesRepo = trx.getRepository(HayBaleSale);

    const lockedStock = await stockRepo.findOne({ where: { id: stock.id } });
    if (!lockedStock) {
      throw new Error("Stock record not found");
    }
    if (lockedStock.balesInStock < quantity) {
      return { error: "Not enough bales in stock" as const };
    }

    lockedStock.balesInStock -= quantity;
    lockedStock.balesSold += quantity;
    await stockRepo.save(lockedStock);

    const sale = salesRepo.create({
      customer,
      quantity,
      price,
      saleDate,
      paymentStatus
    });
    await salesRepo.save(sale);

    return { sale, stock: lockedStock } as const;
  });

  if ("error" in result) {
    res.status(400).json({ message: result.error });
    return;
  }

  res.status(201).json({
    sale: result.sale,
    stock: {
      balesInStock: result.stock.balesInStock,
      balesSold: result.stock.balesSold,
      lowStock: result.stock.balesInStock < result.stock.lowStockThreshold
    }
  });
});

router.put("/sales/:id/payment-status", async (req, res) => {
  const sale = await saleRepo().findOne({ where: { id: req.params.id }, relations: { customer: true } });
  if (!sale) {
    res.status(404).json({ message: "Sale not found" });
    return;
  }
  const paymentStatus = String(req.body?.paymentStatus ?? "").trim().toLowerCase() as PaymentStatus;
  if (!paymentStatuses.includes(paymentStatus)) {
    res.status(400).json({ message: "paymentStatus must be paid or pending" });
    return;
  }
  sale.paymentStatus = paymentStatus;
  await saleRepo().save(sale);
  res.json(sale);
});

export default router;

