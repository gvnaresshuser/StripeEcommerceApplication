import { MigrationInterface, QueryRunner } from "typeorm";

export class AddStripePaymentToOrder1790002000000
  implements MigrationInterface
{
  name = "AddStripePaymentToOrder1790002000000";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "ecommerce"."orders"
      ADD COLUMN "stripe_session_id" varchar(255)
    `);

    await queryRunner.query(`
      ALTER TABLE "ecommerce"."orders"
      ADD COLUMN "stripe_payment_intent_id" varchar(255)
    `);

    await queryRunner.query(`
      ALTER TABLE "ecommerce"."orders"
      ADD COLUMN "payment_status"
      varchar(20) NOT NULL DEFAULT 'PENDING'
    `);

    await queryRunner.query(`
      CREATE UNIQUE INDEX "IDX_orders_stripe_session_id"
      ON "ecommerce"."orders" ("stripe_session_id")
      WHERE "stripe_session_id" IS NOT NULL
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DROP INDEX "ecommerce"."IDX_orders_stripe_session_id"
    `);

    await queryRunner.query(`
      ALTER TABLE "ecommerce"."orders"
      DROP COLUMN "payment_status"
    `);

    await queryRunner.query(`
      ALTER TABLE "ecommerce"."orders"
      DROP COLUMN "stripe_payment_intent_id"
    `);

    await queryRunner.query(`
      ALTER TABLE "ecommerce"."orders"
      DROP COLUMN "stripe_session_id"
    `);
  }
}