import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialSchema1789979079950 implements MigrationInterface {
  name = "InitialSchema1789979079950";

  public async up(queryRunner: QueryRunner): Promise<void> {

    // Create E-Commerce schema
    await queryRunner.query(`
      CREATE SCHEMA IF NOT EXISTS "ecommerce"
    `);

    // Create users table
    await queryRunner.query(`
      CREATE TABLE "ecommerce"."users" (
        "id" SERIAL NOT NULL,
        "name" character varying(100) NOT NULL,
        "email" character varying(150) NOT NULL,
        "password" character varying(255) NOT NULL,
        "mobile" character varying(20),
        "role" character varying(20) NOT NULL DEFAULT 'CUSTOMER',
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),

        CONSTRAINT "UQ_users_email"
          UNIQUE ("email"),

        CONSTRAINT "PK_users_id"
          PRIMARY KEY ("id")
      )
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {

    // Remove users table
    await queryRunner.query(`
      DROP TABLE "ecommerce"."users"
    `);

    // Remove schema
    await queryRunner.query(`
      DROP SCHEMA IF EXISTS "ecommerce"
    `);
  }
}