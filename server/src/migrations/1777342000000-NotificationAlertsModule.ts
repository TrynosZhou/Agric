import { MigrationInterface, QueryRunner } from "typeorm";

export class NotificationAlertsModule1777342000000 implements MigrationInterface {
  name = "NotificationAlertsModule1777342000000";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "notifications" ADD "priority" character varying(20) NOT NULL DEFAULT 'reminder'`);
    await queryRunner.query(`ALTER TABLE "notifications" ADD "status" character varying(20) NOT NULL DEFAULT 'unread'`);
    await queryRunner.query(`ALTER TABLE "notifications" ADD "module" character varying(30) NOT NULL DEFAULT 'general'`);
    await queryRunner.query(`ALTER TABLE "notifications" ADD "dedupeKey" character varying`);
    await queryRunner.query(`UPDATE "notifications" SET "status" = CASE WHEN "isRead" = true THEN 'read' ELSE 'unread' END`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "notifications" DROP COLUMN "dedupeKey"`);
    await queryRunner.query(`ALTER TABLE "notifications" DROP COLUMN "module"`);
    await queryRunner.query(`ALTER TABLE "notifications" DROP COLUMN "status"`);
    await queryRunner.query(`ALTER TABLE "notifications" DROP COLUMN "priority"`);
  }
}

