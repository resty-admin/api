import type { MigrationInterface, QueryRunner } from "typeorm";

export class migrationName1678470981260 implements MigrationInterface {
	name = "migrationName1678470981260";

	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(`ALTER TABLE "attributes"
			ADD "accountingSystemsFields" json DEFAULT ('{}')`);
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(`ALTER TABLE "attributes"
			DROP COLUMN "accountingSystemsFields"`);
	}
}
