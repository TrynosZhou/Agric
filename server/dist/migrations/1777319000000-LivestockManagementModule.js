"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LivestockManagementModule1777319000000 = void 0;
class LivestockManagementModule1777319000000 {
    constructor() {
        this.name = "LivestockManagementModule1777319000000";
    }
    async up(queryRunner) {
        await queryRunner.query(`ALTER TABLE "livestock_animals" RENAME COLUMN "tagNumber" TO "tagIdNumber"`);
        await queryRunner.query(`ALTER TABLE "livestock_animals" DROP COLUMN "breed"`);
        await queryRunner.query(`ALTER TABLE "livestock_animals" DROP COLUMN "batchId"`);
        await queryRunner.query(`ALTER TABLE "livestock_animals" ADD "dateOfBirth" date`);
        await queryRunner.query(`UPDATE "livestock_animals" SET "dateOfBirth" = CURRENT_DATE WHERE "dateOfBirth" IS NULL`);
        await queryRunner.query(`ALTER TABLE "livestock_animals" ALTER COLUMN "dateOfBirth" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "livestock_animals" ADD "weightHistory" jsonb NOT NULL DEFAULT '[]'::jsonb`);
        await queryRunner.query(`ALTER TABLE "livestock_animals" ADD "vaccinationRecords" jsonb NOT NULL DEFAULT '[]'::jsonb`);
        await queryRunner.query(`ALTER TABLE "livestock_animals" ADD "dippingRecords" jsonb NOT NULL DEFAULT '[]'::jsonb`);
        await queryRunner.query(`ALTER TABLE "livestock_animals" ADD "treatmentHistory" jsonb NOT NULL DEFAULT '[]'::jsonb`);
        await queryRunner.query(`ALTER TABLE "livestock_animals" ADD "isDead" boolean NOT NULL DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "livestock_animals" ADD "mortalityDate" date`);
        await queryRunner.query(`ALTER TABLE "livestock_animals" ADD "mortalityNotes" text`);
        await queryRunner.query(`ALTER TABLE "livestock_animals" ADD "dailyMilkProduction" jsonb NOT NULL DEFAULT '[]'::jsonb`);
        await queryRunner.query(`ALTER TABLE "livestock_animals" ADD CONSTRAINT "UQ_livestock_animals_tagIdNumber" UNIQUE ("tagIdNumber")`);
        await queryRunner.query(`
      CREATE TABLE "poultry_batches" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "batchCode" character varying NOT NULL,
        "flockSize" integer NOT NULL,
        "mortalityCount" integer NOT NULL DEFAULT 0,
        "feedConsumptionKg" numeric(12,2) NOT NULL DEFAULT 0,
        "eggProduction" integer NOT NULL DEFAULT 0,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_poultry_batches" PRIMARY KEY ("id"),
        CONSTRAINT "UQ_poultry_batches_batchCode" UNIQUE ("batchCode")
      )
    `);
    }
    async down(queryRunner) {
        await queryRunner.query(`DROP TABLE "poultry_batches"`);
        await queryRunner.query(`ALTER TABLE "livestock_animals" DROP CONSTRAINT "UQ_livestock_animals_tagIdNumber"`);
        await queryRunner.query(`ALTER TABLE "livestock_animals" DROP COLUMN "dailyMilkProduction"`);
        await queryRunner.query(`ALTER TABLE "livestock_animals" DROP COLUMN "mortalityNotes"`);
        await queryRunner.query(`ALTER TABLE "livestock_animals" DROP COLUMN "mortalityDate"`);
        await queryRunner.query(`ALTER TABLE "livestock_animals" DROP COLUMN "isDead"`);
        await queryRunner.query(`ALTER TABLE "livestock_animals" DROP COLUMN "treatmentHistory"`);
        await queryRunner.query(`ALTER TABLE "livestock_animals" DROP COLUMN "dippingRecords"`);
        await queryRunner.query(`ALTER TABLE "livestock_animals" DROP COLUMN "vaccinationRecords"`);
        await queryRunner.query(`ALTER TABLE "livestock_animals" DROP COLUMN "weightHistory"`);
        await queryRunner.query(`ALTER TABLE "livestock_animals" DROP COLUMN "dateOfBirth"`);
        await queryRunner.query(`ALTER TABLE "livestock_animals" ADD "batchId" uuid`);
        await queryRunner.query(`ALTER TABLE "livestock_animals" ADD "breed" character varying`);
        await queryRunner.query(`ALTER TABLE "livestock_animals" RENAME COLUMN "tagIdNumber" TO "tagNumber"`);
    }
}
exports.LivestockManagementModule1777319000000 = LivestockManagementModule1777319000000;
