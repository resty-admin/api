import type { MigrationInterface, QueryRunner } from "typeorm";

export class migrationName1678795456515 implements MigrationInterface {
	name = "migrationName1678795456515";

	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(`ALTER TABLE "active-orders"
			ALTER COLUMN "totalPrice" SET NOT NULL`);
		await queryRunner.query(`ALTER TABLE "active-orders"
			ALTER COLUMN "totalPrice" SET DEFAULT '0'`);
		await queryRunner.query(`ALTER TABLE "history-orders"
			ALTER COLUMN "totalPrice" SET NOT NULL`);
		await queryRunner.query(`ALTER TABLE "history-orders"
			ALTER COLUMN "totalPrice" SET DEFAULT '0'`);
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(`ALTER TABLE "history-orders"
			ALTER COLUMN "totalPrice" DROP DEFAULT`);
		await queryRunner.query(`ALTER TABLE "history-orders"
			ALTER COLUMN "totalPrice" DROP NOT NULL`);
		await queryRunner.query(`ALTER TABLE "active-orders"
			ALTER COLUMN "totalPrice" DROP DEFAULT`);
		await queryRunner.query(`ALTER TABLE "active-orders"
			ALTER COLUMN "totalPrice" DROP NOT NULL`);
	}
}
