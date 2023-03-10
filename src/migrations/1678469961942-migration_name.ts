import type { MigrationInterface, QueryRunner } from "typeorm";

export class AttrGroupPoster1678469961942 implements MigrationInterface {
	name = "AttrGroupPoster1678469961942";

	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(`ALTER TABLE "attribute-groups"
			ADD "accountingSystemsFields" json DEFAULT ('{}')`);
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(`ALTER TABLE "attribute-groups"
			DROP COLUMN "accountingSystemsFields"`);
	}
}
