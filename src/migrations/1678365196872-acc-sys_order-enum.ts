import type { MigrationInterface, QueryRunner } from "typeorm";

export class AccSysOrderEnum1678365196872 implements MigrationInterface {
	name = "AccSysOrderEnum1678365196872";

	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(`CREATE TYPE "public"."history-orders_accountingsystem_enum" AS ENUM('RESTY', 'POSTER')`);
		await queryRunner.query(`ALTER TABLE "history-orders"
			ADD "accountingSystem" "public"."history-orders_accountingsystem_enum" NOT NULL DEFAULT 'RESTY'`);
		await queryRunner.query(`ALTER TABLE "history-orders"
			ADD "accountingSystemId" character varying`);
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(`ALTER TABLE "history-orders"
			DROP COLUMN "accountingSystemId"`);
		await queryRunner.query(`ALTER TABLE "history-orders"
			DROP COLUMN "accountingSystem"`);
		await queryRunner.query(`DROP TYPE "public"."history-orders_accountingsystem_enum"`);
	}
}
