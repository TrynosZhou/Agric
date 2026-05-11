"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FinanceModule1777336000000 = void 0;
class FinanceModule1777336000000 {
    constructor() {
        this.name = "FinanceModule1777336000000";
    }
    async up(queryRunner) {
        await queryRunner.query(`ALTER TABLE "finance_entries" ADD "category" character varying(40)`);
        await queryRunner.query(`UPDATE "finance_entries" SET "category" = 'maintenance' WHERE "category" IS NULL`);
        await queryRunner.query(`ALTER TABLE "finance_entries" ALTER COLUMN "category" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "finance_entries" ADD "date" date`);
        await queryRunner.query(`UPDATE "finance_entries" SET "date" = DATE("createdAt") WHERE "date" IS NULL`);
        await queryRunner.query(`ALTER TABLE "finance_entries" ALTER COLUMN "date" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "finance_entries" ADD "livestockGroup" character varying`);
        await queryRunner.query(`ALTER TABLE "finance_entries" ADD "cropId" uuid`);
        await queryRunner.query(`
      ALTER TABLE "finance_entries"
      ADD CONSTRAINT "FK_finance_entries_crop"
      FOREIGN KEY ("cropId") REFERENCES "crops"("id") ON DELETE SET NULL ON UPDATE NO ACTION
    `);
    }
    async down(queryRunner) {
        await queryRunner.query(`ALTER TABLE "finance_entries" DROP CONSTRAINT "FK_finance_entries_crop"`);
        await queryRunner.query(`ALTER TABLE "finance_entries" DROP COLUMN "cropId"`);
        await queryRunner.query(`ALTER TABLE "finance_entries" DROP COLUMN "livestockGroup"`);
        await queryRunner.query(`ALTER TABLE "finance_entries" DROP COLUMN "date"`);
        await queryRunner.query(`ALTER TABLE "finance_entries" DROP COLUMN "category"`);
    }
}
exports.FinanceModule1777336000000 = FinanceModule1777336000000;
