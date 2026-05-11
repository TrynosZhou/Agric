"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppDataSource = void 0;
require("reflect-metadata");
const dotenv_1 = __importDefault(require("dotenv"));
const typeorm_1 = require("typeorm");
const Asset_1 = require("./entities/Asset");
const Crop_1 = require("./entities/Crop");
const Field_1 = require("./entities/Field");
const FinanceEntry_1 = require("./entities/FinanceEntry");
const HayBale_1 = require("./entities/HayBale");
const HayBaleCustomer_1 = require("./entities/HayBaleCustomer");
const HayBaleSale_1 = require("./entities/HayBaleSale");
const IrrigationSystem_1 = require("./entities/IrrigationSystem");
const LivestockAnimal_1 = require("./entities/LivestockAnimal");
const LivestockBatch_1 = require("./entities/LivestockBatch");
const PoultryBatch_1 = require("./entities/PoultryBatch");
const Notification_1 = require("./entities/Notification");
const SaleRecord_1 = require("./entities/SaleRecord");
const Worker_1 = require("./entities/Worker");
const WorkerAttendance_1 = require("./entities/WorkerAttendance");
const User_1 = require("./entities/User");
const DetasselingTask_1 = require("./entities/DetasselingTask");
const TomatoHarvestCycle_1 = require("./entities/TomatoHarvestCycle");
dotenv_1.default.config({ override: true });
exports.AppDataSource = new typeorm_1.DataSource({
    type: "postgres",
    host: process.env.DB_HOST || "localhost",
    port: Number(process.env.DB_PORT || 5432),
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    entities: [
        Crop_1.Crop,
        Field_1.Field,
        LivestockAnimal_1.LivestockAnimal,
        LivestockBatch_1.LivestockBatch,
        PoultryBatch_1.PoultryBatch,
        Worker_1.Worker,
        WorkerAttendance_1.WorkerAttendance,
        Asset_1.Asset,
        IrrigationSystem_1.IrrigationSystem,
        SaleRecord_1.SaleRecord,
        HayBale_1.HayBale,
        HayBaleCustomer_1.HayBaleCustomer,
        HayBaleSale_1.HayBaleSale,
        Notification_1.Notification,
        FinanceEntry_1.FinanceEntry,
        User_1.User,
        DetasselingTask_1.DetasselingTask,
        TomatoHarvestCycle_1.TomatoHarvestCycle
    ],
    migrations: ["src/migrations/*.ts"],
    synchronize: false,
    logging: false
});
