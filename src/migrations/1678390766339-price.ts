import type { MigrationInterface, QueryRunner } from "typeorm";

export class PriceString1678390766339 implements MigrationInterface {
	name = "PriceString1678390766339";

	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(`ALTER TABLE "products"
			DROP COLUMN "price"`);
		await queryRunner.query(`ALTER TABLE "products"
			ADD "price" real NOT NULL DEFAULT '0'`);
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(`ALTER TABLE "products"
			DROP COLUMN "price"`);
		await queryRunner.query(`ALTER TABLE "products"
			ADD "price" integer NOT NULL DEFAULT '0'`);
	}
}
