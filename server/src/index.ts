import "reflect-metadata";
import dotenv from "dotenv";
import app from "./app";
import { AppDataSource } from "./data-source";
import { startNotificationsCron } from "./jobs/notifications.cron";

dotenv.config({ override: true });

const port = Number(process.env.PORT || 4000);

AppDataSource.initialize()
  .then(() => {
    startNotificationsCron();
    app.listen(port, () => {
      // eslint-disable-next-line no-console
      console.log(`API listening on port ${port}`);
    });
  })
  .catch((error) => {
    // eslint-disable-next-line no-console
    console.error("Database initialization failed:", error);
    process.exit(1);
  });
