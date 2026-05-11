"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const dotenv_1 = __importDefault(require("dotenv"));
const app_1 = __importDefault(require("./app"));
const data_source_1 = require("./data-source");
const notifications_cron_1 = require("./jobs/notifications.cron");
dotenv_1.default.config({ override: true });
const port = Number(process.env.PORT || 4000);
data_source_1.AppDataSource.initialize()
    .then(() => {
    (0, notifications_cron_1.startNotificationsCron)();
    app_1.default.listen(port, () => {
        // eslint-disable-next-line no-console
        console.log(`API listening on port ${port}`);
    });
})
    .catch((error) => {
    // eslint-disable-next-line no-console
    console.error("Database initialization failed:", error);
    process.exit(1);
});
