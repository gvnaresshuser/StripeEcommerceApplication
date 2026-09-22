import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateOrder1790001000000
  implements MigrationInterface
{
  name = "CreateOrder1790001000000";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "ecommerce"."orders" (
        "id" SERIAL NOT NULL,
        "user_id" integer NOT NULL,
        "total_amount" numeric(10,2) NOT NULL,
        "status" character varying(20) NOT NULL DEFAULT 'PENDING',
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),

        CONSTRAINT "PK_orders_id"
          PRIMARY KEY ("id"),

        CONSTRAINT "FK_orders_user_id"
          FOREIGN KEY ("user_id")
          REFERENCES "ecommerce"."users"("id")
          ON DELETE CASCADE,

        CONSTRAINT "CHK_orders_total_amount"
          CHECK ("total_amount" >= 0)
      )
    `);

    await queryRunner.query(`
      CREATE TABLE "ecommerce"."order_items" (
        "id" SERIAL NOT NULL,
        "order_id" integer NOT NULL,
        "product_id" integer NOT NULL,
        "product_name" character varying(150) NOT NULL,
        "unit_price" numeric(10,2) NOT NULL,
        "quantity" integer NOT NULL,
        "subtotal" numeric(10,2) NOT NULL,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),

        CONSTRAINT "PK_order_items_id"
          PRIMARY KEY ("id"),

        CONSTRAINT "FK_order_items_order_id"
          FOREIGN KEY ("order_id")
          REFERENCES "ecommerce"."orders"("id")
          ON DELETE CASCADE,

        CONSTRAINT "FK_order_items_product_id"
          FOREIGN KEY ("product_id")
          REFERENCES "ecommerce"."products"("id")
          ON DELETE RESTRICT,

        CONSTRAINT "CHK_order_items_quantity"
          CHECK ("quantity" > 0),

        CONSTRAINT "CHK_order_items_unit_price"
          CHECK ("unit_price" >= 0),

        CONSTRAINT "CHK_order_items_subtotal"
          CHECK ("subtotal" >= 0)
      )
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DROP TABLE "ecommerce"."order_items"
    `);

    await queryRunner.query(`
      DROP TABLE "ecommerce"."orders"
    `);
  }
}