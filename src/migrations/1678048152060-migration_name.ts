import type { MigrationInterface, QueryRunner } from "typeorm";

export class historyOrderDate1678048152060 implements MigrationInterface {
	name = "historyOrderDate1678048152060";

	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(`ALTER TABLE "history-orders"
			ADD "startDate" TIMESTAMP`);
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(`ALTER TABLE "history-orders"
			DROP COLUMN "startDate"`);
	}
}
