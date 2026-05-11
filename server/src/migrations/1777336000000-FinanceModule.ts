import { MigrationInterface, QueryRunner } from "typeorm";

export class FinanceModule1777336000000 implements MigrationInterface {
  name = "FinanceModule1777336000000";

  public async up(queryRunner: QueryRunner): Promise<void> {
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

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "finance_entries" DROP CONSTRAINT "FK_finance_entries_crop"`);
    await queryRunner.query(`ALTER TABLE "finance_entries" DROP COLUMN "cropId"`);
    await queryRunner.query(`ALTER TABLE "finance_entries" DROP COLUMN "livestockGroup"`);
    await queryRunner.query(`ALTER TABLE "finance_entries" DROP COLUMN "date"`);
    await queryRunner.query(`ALTER TABLE "finance_entries" DROP COLUMN "category"`);
  }
}

