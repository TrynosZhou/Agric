"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CropManagementModule1777315000000 = void 0;
class CropManagementModule1777315000000 {
    constructor() {
        this.name = "CropManagementModule1777315000000";
    }
    async up(queryRunner) {
        await queryRunner.query(`ALTER TABLE "crops" RENAME COLUMN "plantedOn" TO "plantingDate"`);
        await queryRunner.query(`ALTER TABLE "crops" DROP COLUMN "expectedHarvestOn"`);
        await queryRunner.query(`ALTER TABLE "crops" ADD "customCropType" character varying`);
        await queryRunner.query(`ALTER TABLE "crops" ADD "fieldName" character varying`);
        await queryRunner.query(`UPDATE "crops" SET "fieldName" = f."name" FROM "fields" f WHERE "crops"."fieldId" = f."id"`);
        await queryRunner.query(`UPDATE "crops" SET "fieldName" = 'Unknown field' WHERE "fieldName" IS NULL`);
        await queryRunner.query(`ALTER TABLE "crops" ALTER COLUMN "fieldName" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "crops" ADD "growthStage" character varying NOT NULL DEFAULT 'planned'`);
        await queryRunner.query(`ALTER TABLE "crops" ADD "irrigationSchedule" text`);
        await queryRunner.query(`ALTER TABLE "crops" ADD "estimatedYield" numeric(12,2)`);
        await queryRunner.query(`ALTER TABLE "crops" ADD "fertilizerApplications" jsonb NOT NULL DEFAULT '[]'::jsonb`);
        await queryRunner.query(`ALTER TABLE "crops" ADD "pesticideApplications" jsonb NOT NULL DEFAULT '[]'::jsonb`);
        await queryRunner.query(`
      CREATE TABLE "detasseling_tasks" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "assignedWorker" character varying NOT NULL,
        "rowsCompleted" integer NOT NULL DEFAULT 0,
        "field" character varying NOT NULL,
        "status" character varying NOT NULL DEFAULT 'pending',
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        "cropId" uuid,
        CONSTRAINT "PK_detasseling_tasks" PRIMARY KEY ("id")
      )
    `);
        await queryRunner.query(`
      CREATE TABLE "tomato_harvest_cycles" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "cycleNumber" integer NOT NULL,
        "harvestedOn" date NOT NULL,
        "quantityKg" numeric(12,2) NOT NULL,
        "notes" character varying,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        "cropId" uuid,
        CONSTRAINT "PK_tomato_harvest_cycles" PRIMARY KEY ("id")
      )
    `);
        await queryRunner.query(`
      ALTER TABLE "detasseling_tasks"
      ADD CONSTRAINT "FK_detasseling_tasks_crop"
      FOREIGN KEY ("cropId") REFERENCES "crops"("id") ON DELETE CASCADE ON UPDATE NO ACTION
    `);
        await queryRunner.query(`
      ALTER TABLE "tomato_harvest_cycles"
      ADD CONSTRAINT "FK_tomato_harvest_cycles_crop"
      FOREIGN KEY ("cropId") REFERENCES "crops"("id") ON DELETE CASCADE ON UPDATE NO ACTION
    `);
    }
    async down(queryRunner) {
        await queryRunner.query(`ALTER TABLE "tomato_harvest_cycles" DROP CONSTRAINT "FK_tomato_harvest_cycles_crop"`);
        await queryRunner.query(`ALTER TABLE "detasseling_tasks" DROP CONSTRAINT "FK_detasseling_tasks_crop"`);
        await queryRunner.query(`DROP TABLE "tomato_harvest_cycles"`);
        await queryRunner.query(`DROP TABLE "detasseling_tasks"`);
        await queryRunner.query(`ALTER TABLE "crops" DROP COLUMN "pesticideApplications"`);
        await queryRunner.query(`ALTER TABLE "crops" DROP COLUMN "fertilizerApplications"`);
        await queryRunner.query(`ALTER TABLE "crops" DROP COLUMN "estimatedYield"`);
        await queryRunner.query(`ALTER TABLE "crops" DROP COLUMN "irrigationSchedule"`);
        await queryRunner.query(`ALTER TABLE "crops" DROP COLUMN "growthStage"`);
        await queryRunner.query(`ALTER TABLE "crops" DROP COLUMN "fieldName"`);
        await queryRunner.query(`ALTER TABLE "crops" DROP COLUMN "customCropType"`);
        await queryRunner.query(`ALTER TABLE "crops" ADD "expectedHarvestOn" date`);
        await queryRunner.query(`ALTER TABLE "crops" RENAME COLUMN "plantingDate" TO "plantedOn"`);
    }
}
exports.CropManagementModule1777315000000 = CropManagementModule1777315000000;
