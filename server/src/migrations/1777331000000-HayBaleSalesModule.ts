import { MigrationInterface, QueryRunner } from "typeorm";

export class HayBaleSalesModule1777331000000 implements MigrationInterface {
  name = "HayBaleSalesModule1777331000000";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "hay_bales" ALTER COLUMN "baleCode" DROP NOT NULL`);
    await queryRunner.query(`ALTER TABLE "hay_bales" ALTER COLUMN "weightKg" DROP NOT NULL`);

    await queryRunner.query(`ALTER TABLE "hay_bales" ADD "totalBalesProduced" integer NOT NULL DEFAULT 0`);
    await queryRunner.query(`ALTER TABLE "hay_bales" ADD "balesInStock" integer NOT NULL DEFAULT 0`);
    await queryRunner.query(`ALTER TABLE "hay_bales" ADD "balesSold" integer NOT NULL DEFAULT 0`);
    await queryRunner.query(
      `ALTER TABLE "hay_bales" ADD "pricePerBale" numeric(12,2) NOT NULL DEFAULT 0`
    );
    await queryRunner.query(`ALTER TABLE "hay_bales" ADD "lowStockThreshold" integer NOT NULL DEFAULT 50`);

    await queryRunner.query(`
      CREATE TABLE "hay_bale_sales" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "quantity" integer NOT NULL,
        "price" numeric(12,2) NOT NULL,
        "saleDate" date NOT NULL,
        "paymentStatus" character varying(20) NOT NULL DEFAULT 'pending',
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        "customerId" uuid,
        CONSTRAINT "PK_hay_bale_sales" PRIMARY KEY ("id")
      )
    `);

    await queryRunner.query(`
      ALTER TABLE "hay_bale_sales"
      ADD CONSTRAINT "FK_hay_bale_sales_customer"
      FOREIGN KEY ("customerId") REFERENCES "hay_bale_customers"("id") ON DELETE SET NULL ON UPDATE NO ACTION
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "hay_bale_sales" DROP CONSTRAINT "FK_hay_bale_sales_customer"`);
    await queryRunner.query(`DROP TABLE "hay_bale_sales"`);

    await queryRunner.query(`ALTER TABLE "hay_bales" DROP COLUMN "lowStockThreshold"`);
    await queryRunner.query(`ALTER TABLE "hay_bales" DROP COLUMN "pricePerBale"`);
    await queryRunner.query(`ALTER TABLE "hay_bales" DROP COLUMN "balesSold"`);
    await queryRunner.query(`ALTER TABLE "hay_bales" DROP COLUMN "balesInStock"`);
    await queryRunner.query(`ALTER TABLE "hay_bales" DROP COLUMN "totalBalesProduced"`);

    await queryRunner.query(`ALTER TABLE "hay_bales" ALTER COLUMN "weightKg" SET NOT NULL`);
    await queryRunner.query(`ALTER TABLE "hay_bales" ALTER COLUMN "baleCode" SET NOT NULL`);
  }
}

