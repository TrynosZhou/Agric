import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialSchema1777309768370 implements MigrationInterface {
    name = 'InitialSchema1777309768370'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "livestock_animals" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "tagNumber" character varying NOT NULL, "species" character varying NOT NULL, "breed" character varying, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "batchId" uuid, CONSTRAINT "PK_2d156b00fc49659f72c0ee0e471" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "livestock_batches" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "batchCode" character varying NOT NULL, "species" character varying NOT NULL, "quantity" integer NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_3ebe6c82a77987429ee0f6060bd" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "hay_bales" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "baleCode" character varying NOT NULL, "weightKg" numeric(10,2) NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "customerId" uuid, CONSTRAINT "PK_b27039b84100a150a22ef2755ac" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "hay_bale_customers" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "fullName" character varying NOT NULL, "phoneNumber" character varying, "email" character varying, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_b8398d187843975176cbe741947" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "finance_entries" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "entryType" character varying NOT NULL, "amount" numeric(12,2) NOT NULL, "notes" text, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "saleRecordId" uuid, CONSTRAINT "PK_550c7243f4fb3952224a6a7616d" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "sale_records" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "saleDate" date NOT NULL, "amount" numeric(12,2) NOT NULL, "itemDescription" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "cropId" uuid, "livestockBatchId" uuid, "customerId" uuid, CONSTRAINT "PK_180a250f151372fa1a38ab656c8" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "crops" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "cropType" character varying NOT NULL, "plantedOn" date NOT NULL, "expectedHarvestOn" date, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "fieldId" uuid, CONSTRAINT "PK_098dbeb7c803dc7c08a7f02b805" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "irrigation_systems" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "systemType" character varying NOT NULL, "isActive" boolean NOT NULL DEFAULT true, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "fieldId" uuid, CONSTRAINT "PK_148f83be564b712092e1bb3f76a" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "fields" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "sizeHectares" numeric(10,2) NOT NULL, "location" character varying, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_ee7a215c6cd77a59e2cb3b59d41" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "assets" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "serialNumber" character varying, "condition" character varying, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "fieldId" uuid, CONSTRAINT "PK_da96729a8b113377cfb6a62439c" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "worker_attendance" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "attendanceDate" date NOT NULL, "present" boolean NOT NULL DEFAULT false, "notes" character varying, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "workerId" uuid, CONSTRAINT "PK_0786f57012743a973437064af1a" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "workers" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "firstName" character varying NOT NULL, "lastName" character varying NOT NULL, "employeeNumber" character varying NOT NULL, "role" character varying, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_bd2a4be200643c68a06bfa61d5c" UNIQUE ("employeeNumber"), CONSTRAINT "PK_e950c9aba3bd84a4f193058d838" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "notifications" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "title" character varying NOT NULL, "message" text NOT NULL, "isRead" boolean NOT NULL DEFAULT false, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "workerId" uuid, CONSTRAINT "PK_6a72c3c0f683f6462415e653c3a" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "livestock_animals" ADD CONSTRAINT "FK_9cf860de559e99a4baa265bc6e0" FOREIGN KEY ("batchId") REFERENCES "livestock_batches"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "hay_bales" ADD CONSTRAINT "FK_17811ce03d6c10d21091131a6aa" FOREIGN KEY ("customerId") REFERENCES "hay_bale_customers"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "finance_entries" ADD CONSTRAINT "FK_63e0ab571c16b766d94f123d2d0" FOREIGN KEY ("saleRecordId") REFERENCES "sale_records"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "sale_records" ADD CONSTRAINT "FK_17b88e5a88326ebd82425e43a56" FOREIGN KEY ("cropId") REFERENCES "crops"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "sale_records" ADD CONSTRAINT "FK_7cdc82010ade333c75715838c64" FOREIGN KEY ("livestockBatchId") REFERENCES "livestock_batches"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "sale_records" ADD CONSTRAINT "FK_010b7482cd6eb6f63471d53b534" FOREIGN KEY ("customerId") REFERENCES "hay_bale_customers"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "crops" ADD CONSTRAINT "FK_25fdc9bbc32d36d7065b0a5f039" FOREIGN KEY ("fieldId") REFERENCES "fields"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "irrigation_systems" ADD CONSTRAINT "FK_0c0206ae5b8375c731a45301555" FOREIGN KEY ("fieldId") REFERENCES "fields"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "assets" ADD CONSTRAINT "FK_8edec3746173549e90e90af2103" FOREIGN KEY ("fieldId") REFERENCES "fields"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "worker_attendance" ADD CONSTRAINT "FK_21aec243096a869df48959529d9" FOREIGN KEY ("workerId") REFERENCES "workers"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "notifications" ADD CONSTRAINT "FK_89fa3ce544f6b5c36b8ea60668a" FOREIGN KEY ("workerId") REFERENCES "workers"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "notifications" DROP CONSTRAINT "FK_89fa3ce544f6b5c36b8ea60668a"`);
        await queryRunner.query(`ALTER TABLE "worker_attendance" DROP CONSTRAINT "FK_21aec243096a869df48959529d9"`);
        await queryRunner.query(`ALTER TABLE "assets" DROP CONSTRAINT "FK_8edec3746173549e90e90af2103"`);
        await queryRunner.query(`ALTER TABLE "irrigation_systems" DROP CONSTRAINT "FK_0c0206ae5b8375c731a45301555"`);
        await queryRunner.query(`ALTER TABLE "crops" DROP CONSTRAINT "FK_25fdc9bbc32d36d7065b0a5f039"`);
        await queryRunner.query(`ALTER TABLE "sale_records" DROP CONSTRAINT "FK_010b7482cd6eb6f63471d53b534"`);
        await queryRunner.query(`ALTER TABLE "sale_records" DROP CONSTRAINT "FK_7cdc82010ade333c75715838c64"`);
        await queryRunner.query(`ALTER TABLE "sale_records" DROP CONSTRAINT "FK_17b88e5a88326ebd82425e43a56"`);
        await queryRunner.query(`ALTER TABLE "finance_entries" DROP CONSTRAINT "FK_63e0ab571c16b766d94f123d2d0"`);
        await queryRunner.query(`ALTER TABLE "hay_bales" DROP CONSTRAINT "FK_17811ce03d6c10d21091131a6aa"`);
        await queryRunner.query(`ALTER TABLE "livestock_animals" DROP CONSTRAINT "FK_9cf860de559e99a4baa265bc6e0"`);
        await queryRunner.query(`DROP TABLE "notifications"`);
        await queryRunner.query(`DROP TABLE "workers"`);
        await queryRunner.query(`DROP TABLE "worker_attendance"`);
        await queryRunner.query(`DROP TABLE "assets"`);
        await queryRunner.query(`DROP TABLE "fields"`);
        await queryRunner.query(`DROP TABLE "irrigation_systems"`);
        await queryRunner.query(`DROP TABLE "crops"`);
        await queryRunner.query(`DROP TABLE "sale_records"`);
        await queryRunner.query(`DROP TABLE "finance_entries"`);
        await queryRunner.query(`DROP TABLE "hay_bale_customers"`);
        await queryRunner.query(`DROP TABLE "hay_bales"`);
        await queryRunner.query(`DROP TABLE "livestock_batches"`);
        await queryRunner.query(`DROP TABLE "livestock_animals"`);
    }

}
