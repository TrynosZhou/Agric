"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationAlertsModule1777342000000 = void 0;
class NotificationAlertsModule1777342000000 {
    constructor() {
        this.name = "NotificationAlertsModule1777342000000";
    }
    async up(queryRunner) {
        await queryRunner.query(`ALTER TABLE "notifications" ADD "priority" character varying(20) NOT NULL DEFAULT 'reminder'`);
        await queryRunner.query(`ALTER TABLE "notifications" ADD "status" character varying(20) NOT NULL DEFAULT 'unread'`);
        await queryRunner.query(`ALTER TABLE "notifications" ADD "module" character varying(30) NOT NULL DEFAULT 'general'`);
        await queryRunner.query(`ALTER TABLE "notifications" ADD "dedupeKey" character varying`);
        await queryRunner.query(`UPDATE "notifications" SET "status" = CASE WHEN "isRead" = true THEN 'read' ELSE 'unread' END`);
    }
    async down(queryRunner) {
        await queryRunner.query(`ALTER TABLE "notifications" DROP COLUMN "dedupeKey"`);
        await queryRunner.query(`ALTER TABLE "notifications" DROP COLUMN "module"`);
        await queryRunner.query(`ALTER TABLE "notifications" DROP COLUMN "status"`);
        await queryRunner.query(`ALTER TABLE "notifications" DROP COLUMN "priority"`);
    }
}
exports.NotificationAlertsModule1777342000000 = NotificationAlertsModule1777342000000;
