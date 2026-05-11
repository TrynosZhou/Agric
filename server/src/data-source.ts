import "reflect-metadata";
import dotenv from "dotenv";
import { DataSource } from "typeorm";
import { Asset } from "./entities/Asset";
import { Crop } from "./entities/Crop";
import { Field } from "./entities/Field";
import { FinanceEntry } from "./entities/FinanceEntry";
import { HayBale } from "./entities/HayBale";
import { HayBaleCustomer } from "./entities/HayBaleCustomer";
import { HayBaleSale } from "./entities/HayBaleSale";
import { IrrigationSystem } from "./entities/IrrigationSystem";
import { LivestockAnimal } from "./entities/LivestockAnimal";
import { LivestockBatch } from "./entities/LivestockBatch";
import { PoultryBatch } from "./entities/PoultryBatch";
import { Notification } from "./entities/Notification";
import { SaleRecord } from "./entities/SaleRecord";
import { Worker } from "./entities/Worker";
import { WorkerAttendance } from "./entities/WorkerAttendance";
import { User } from "./entities/User";
import { DetasselingTask } from "./entities/DetasselingTask";
import { TomatoHarvestCycle } from "./entities/TomatoHarvestCycle";

dotenv.config({ override: true });

export const AppDataSource = new DataSource({
  type: "postgres",
  host: process.env.DB_HOST || "localhost",
  port: Number(process.env.DB_PORT || 5432),
  username: process.env.DB_USER as string,
  password: process.env.DB_PASSWORD as string,
  database: process.env.DB_NAME as string,
  entities: [
    Crop,
    Field,
    LivestockAnimal,
    LivestockBatch,
    PoultryBatch,
    Worker,
    WorkerAttendance,
    Asset,
    IrrigationSystem,
    SaleRecord,
    HayBale,
    HayBaleCustomer,
    HayBaleSale,
    Notification,
    FinanceEntry,
    User,
    DetasselingTask,
    TomatoHarvestCycle
  ],
  migrations: ["src/migrations/*.ts"],
  synchronize: false,
  logging: false
});
