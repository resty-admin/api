import type { MigrationInterface, QueryRunner } from "typeorm";

export class migrationName1678391284340 implements MigrationInterface {
	name = "migrationName1678391284340";

	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(`ALTER TABLE "active-orders"
			DROP COLUMN "totalPrice"`);
		await queryRunner.query(`ALTER TABLE "active-orders"
			ADD "totalPrice" real`);
		await queryRunner.query(`ALTER TABLE "history-orders"
			DROP COLUMN "totalPrice"`);
		await queryRunner.query(`ALTER TABLE "history-orders"
			ADD "totalPrice" real`);
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(`ALTER TABLE "history-orders"
			DROP COLUMN "totalPrice"`);
		await queryRunner.query(`ALTER TABLE "history-orders"
			ADD "totalPrice" integer`);
		await queryRunner.query(`ALTER TABLE "active-orders"
			DROP COLUMN "totalPrice"`);
		await queryRunner.query(`ALTER TABLE "active-orders"
			ADD "totalPrice" integer`);
	}
}
