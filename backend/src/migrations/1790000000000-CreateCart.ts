import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateCart1790000000000
  implements MigrationInterface
{
  name = "CreateCart1790000000000";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "ecommerce"."carts" (
        "id" SERIAL NOT NULL,
        "user_id" integer NOT NULL,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "UQ_carts_user_id"
          UNIQUE ("user_id"),
        CONSTRAINT "PK_carts_id"
          PRIMARY KEY ("id"),
        CONSTRAINT "FK_carts_user_id"
          FOREIGN KEY ("user_id")
          REFERENCES "ecommerce"."users"("id")
          ON DELETE CASCADE
      )
    `);

    await queryRunner.query(`
      CREATE TABLE "ecommerce"."cart_items" (
        "id" SERIAL NOT NULL,
        "cart_id" integer NOT NULL,
        "product_id" integer NOT NULL,
        "quantity" integer NOT NULL,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_cart_items_id"
          PRIMARY KEY ("id"),
        CONSTRAINT "UQ_cart_items_cart_product"
          UNIQUE ("cart_id", "product_id"),
        CONSTRAINT "FK_cart_items_cart_id"
          FOREIGN KEY ("cart_id")
          REFERENCES "ecommerce"."carts"("id")
          ON DELETE CASCADE,
        CONSTRAINT "FK_cart_items_product_id"
          FOREIGN KEY ("product_id")
          REFERENCES "ecommerce"."products"("id")
          ON DELETE CASCADE,
        CONSTRAINT "CHK_cart_items_quantity"
          CHECK ("quantity" > 0)
      )
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DROP TABLE "ecommerce"."cart_items"
    `);

    await queryRunner.query(`
      DROP TABLE "ecommerce"."carts"
    `);
  }
}