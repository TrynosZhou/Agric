import { MigrationInterface, QueryRunner } from "typeorm";

export class LabourManagementModule1777323000000 implements MigrationInterface {
  name = "LabourManagementModule1777323000000";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "workers" ADD "name" character varying`);
    await queryRunner.query(
      `UPDATE "workers" SET "name" = TRIM(COALESCE("firstName",'') || ' ' || COALESCE("lastName",'')) WHERE "name" IS NULL`
    );
    await queryRunner.query(
      `ALTER TABLE "workers" ADD "type" character varying(20) NOT NULL DEFAULT 'casual'`
    );
    await queryRunner.query(`ALTER TABLE "workers" ADD "wageRate" numeric(12,2)`);
    await queryRunner.query(
      `ALTER TABLE "workers" ADD "casualPayMode" character varying(20) NOT NULL DEFAULT 'day'`
    );
    await queryRunner.query(`ALTER TABLE "workers" ADD "monthlySalary" numeric(12,2)`);
    await queryRunner.query(`ALTER TABLE "workers" ADD "assignedTasks" jsonb NOT NULL DEFAULT '[]'::jsonb`);

    await queryRunner.query(
      `ALTER TABLE "worker_attendance" ADD "hoursWorked" numeric(6,2) NOT NULL DEFAULT 0`
    );
    await queryRunner.query(`ALTER TABLE "worker_attendance" ADD "taskPerformed" character varying`);
    await queryRunner.query(
      `ALTER TABLE "worker_attendance" ADD "allocationSystem" character varying(20)`
    );
    await queryRunner.query(`ALTER TABLE "worker_attendance" ADD "allocationGroup" character varying`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "worker_attendance" DROP COLUMN "allocationGroup"`);
    await queryRunner.query(`ALTER TABLE "worker_attendance" DROP COLUMN "allocationSystem"`);
    await queryRunner.query(`ALTER TABLE "worker_attendance" DROP COLUMN "taskPerformed"`);
    await queryRunner.query(`ALTER TABLE "worker_attendance" DROP COLUMN "hoursWorked"`);

    await queryRunner.query(`ALTER TABLE "workers" DROP COLUMN "assignedTasks"`);
    await queryRunner.query(`ALTER TABLE "workers" DROP COLUMN "monthlySalary"`);
    await queryRunner.query(`ALTER TABLE "workers" DROP COLUMN "casualPayMode"`);
    await queryRunner.query(`ALTER TABLE "workers" DROP COLUMN "wageRate"`);
    await queryRunner.query(`ALTER TABLE "workers" DROP COLUMN "type"`);
    await queryRunner.query(`ALTER TABLE "workers" DROP COLUMN "name"`);
  }
}
