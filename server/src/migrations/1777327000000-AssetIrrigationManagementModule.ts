import { MigrationInterface, QueryRunner } from "typeorm";

export class AssetIrrigationManagementModule1777327000000 implements MigrationInterface {
  name = "AssetIrrigationManagementModule1777327000000";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "assets" DROP COLUMN "serialNumber"`);
    await queryRunner.query(`ALTER TABLE "assets" ADD "category" character varying(20)`);
    await queryRunner.query(`UPDATE "assets" SET "category" = 'tool' WHERE "category" IS NULL`);
    await queryRunner.query(`ALTER TABLE "assets" ALTER COLUMN "category" SET NOT NULL`);
    await queryRunner.query(`ALTER TABLE "assets" ADD "quantityAvailable" integer NOT NULL DEFAULT 0`);
    await queryRunner.query(`ALTER TABLE "assets" ADD "quantityInUse" integer NOT NULL DEFAULT 0`);
    await queryRunner.query(`ALTER TABLE "assets" DROP COLUMN "condition"`);
    await queryRunner.query(
      `ALTER TABLE "assets" ADD "condition" character varying(20) NOT NULL DEFAULT 'good'`
    );
    await queryRunner.query(`ALTER TABLE "assets" ADD "currentAssignedUser" character varying`);
    await queryRunner.query(
      `ALTER TABLE "assets" ADD "maintenanceLogEntries" jsonb NOT NULL DEFAULT '[]'::jsonb`
    );

    await queryRunner.query(
      `ALTER TABLE "irrigation_systems" ALTER COLUMN "systemType" TYPE character varying(20)`
    );
    await queryRunner.query(`ALTER TABLE "irrigation_systems" RENAME COLUMN "isActive" TO "statusLegacy"`);
    await queryRunner.query(`ALTER TABLE "irrigation_systems" ADD "coverageAreaOrCapacity" character varying`);
    await queryRunner.query(`ALTER TABLE "irrigation_systems" ADD "powerSource" character varying(20)`);
    await queryRunner.query(`UPDATE "irrigation_systems" SET "powerSource" = 'diesel' WHERE "powerSource" IS NULL`);
    await queryRunner.query(`ALTER TABLE "irrigation_systems" ALTER COLUMN "powerSource" SET NOT NULL`);
    await queryRunner.query(`ALTER TABLE "irrigation_systems" ADD "status" character varying(20)`);
    await queryRunner.query(
      `UPDATE "irrigation_systems" SET "status" = CASE WHEN "statusLegacy" = true THEN 'active' ELSE 'inactive' END`
    );
    await queryRunner.query(`ALTER TABLE "irrigation_systems" ALTER COLUMN "status" SET NOT NULL`);
    await queryRunner.query(`ALTER TABLE "irrigation_systems" ALTER COLUMN "status" SET DEFAULT 'inactive'`);
    await queryRunner.query(
      `ALTER TABLE "irrigation_systems" ADD "waterUsageLog" jsonb NOT NULL DEFAULT '[]'::jsonb`
    );
    await queryRunner.query(
      `ALTER TABLE "irrigation_systems" ADD "fuelUsageLog" jsonb NOT NULL DEFAULT '[]'::jsonb`
    );
    await queryRunner.query(
      `ALTER TABLE "irrigation_systems" ADD "scheduledMaintenanceDates" jsonb NOT NULL DEFAULT '[]'::jsonb`
    );
    await queryRunner.query(`ALTER TABLE "irrigation_systems" DROP COLUMN "statusLegacy"`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "irrigation_systems" ADD "statusLegacy" boolean NOT NULL DEFAULT true`);
    await queryRunner.query(
      `UPDATE "irrigation_systems" SET "statusLegacy" = CASE WHEN "status" = 'active' THEN true ELSE false END`
    );
    await queryRunner.query(`ALTER TABLE "irrigation_systems" DROP COLUMN "scheduledMaintenanceDates"`);
    await queryRunner.query(`ALTER TABLE "irrigation_systems" DROP COLUMN "fuelUsageLog"`);
    await queryRunner.query(`ALTER TABLE "irrigation_systems" DROP COLUMN "waterUsageLog"`);
    await queryRunner.query(`ALTER TABLE "irrigation_systems" DROP COLUMN "status"`);
    await queryRunner.query(`ALTER TABLE "irrigation_systems" DROP COLUMN "powerSource"`);
    await queryRunner.query(`ALTER TABLE "irrigation_systems" DROP COLUMN "coverageAreaOrCapacity"`);
    await queryRunner.query(`ALTER TABLE "irrigation_systems" RENAME COLUMN "statusLegacy" TO "isActive"`);

    await queryRunner.query(`ALTER TABLE "assets" DROP COLUMN "maintenanceLogEntries"`);
    await queryRunner.query(`ALTER TABLE "assets" DROP COLUMN "currentAssignedUser"`);
    await queryRunner.query(`ALTER TABLE "assets" DROP COLUMN "condition"`);
    await queryRunner.query(`ALTER TABLE "assets" ADD "condition" character varying`);
    await queryRunner.query(`ALTER TABLE "assets" DROP COLUMN "quantityInUse"`);
    await queryRunner.query(`ALTER TABLE "assets" DROP COLUMN "quantityAvailable"`);
    await queryRunner.query(`ALTER TABLE "assets" DROP COLUMN "category"`);
    await queryRunner.query(`ALTER TABLE "assets" ADD "serialNumber" character varying`);
  }
}
