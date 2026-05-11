"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddUsers1777310000000 = void 0;
class AddUsers1777310000000 {
    constructor() {
        this.name = "AddUsers1777310000000";
    }
    async up(queryRunner) {
        await queryRunner.query(`
      CREATE TABLE "users" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "email" character varying NOT NULL,
        "passwordHash" character varying NOT NULL,
        "role" character varying(32) NOT NULL DEFAULT 'worker',
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "UQ_users_email" UNIQUE ("email"),
        CONSTRAINT "PK_users" PRIMARY KEY ("id")
      )
    `);
    }
    async down(queryRunner) {
        await queryRunner.query(`DROP TABLE "users"`);
    }
}
exports.AddUsers1777310000000 = AddUsers1777310000000;
