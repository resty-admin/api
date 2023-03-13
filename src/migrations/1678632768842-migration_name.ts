import type { MigrationInterface, QueryRunner } from "typeorm";

export class migrationName1678632768842 implements MigrationInterface {
	name = "migrationName1678632768842";

	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(`ALTER TABLE "active-orders"
			DROP COLUMN "startDate"`);
		await queryRunner.query(`ALTER TABLE "active-orders"
			ADD "startDate" TIMESTAMP WITH TIME ZONE NOT NULL`);
		await queryRunner.query(`ALTER TABLE "history-orders"
			DROP COLUMN "startDate"`);
		await queryRunner.query(`ALTER TABLE "history-orders"
			ADD "startDate" TIMESTAMP WITH TIME ZONE`);
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(`ALTER TABLE "history-orders"
			DROP COLUMN "startDate"`);
		await queryRunner.query(`ALTER TABLE "history-orders"
			ADD "startDate" TIMESTAMP`);
		await queryRunner.query(`ALTER TABLE "active-orders"
			DROP COLUMN "startDate"`);
		await queryRunner.query(`ALTER TABLE "active-orders"
			ADD "startDate" TIMESTAMP NOT NULL`);
	}
}
