import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateProduct1789995935897 implements MigrationInterface {
    name = 'CreateProduct1789995935897'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "ecommerce"."products" ("id" SERIAL NOT NULL, "name" character varying(150) NOT NULL, "description" text, "price" numeric(10,2) NOT NULL, "stock" integer NOT NULL DEFAULT '0', "image_url" character varying(500), "category" character varying(100), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_0806c755e0aca124e67c0cf6d7d" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "ecommerce"."products"`);
    }

}
