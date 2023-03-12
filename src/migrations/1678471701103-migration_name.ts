import type { MigrationInterface, QueryRunner } from "typeorm";

export class migrationName1678471701103 implements MigrationInterface {
	name = "migrationName1678471701103";

	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(`ALTER TABLE "attribute-groups_attributes_attributes"
			DROP CONSTRAINT "FK_80251df37496acbfbc31cd50d2a"`);
		await queryRunner.query(`ALTER TABLE "attribute-groups_attributes_attributes"
			ADD CONSTRAINT "FK_80251df37496acbfbc31cd50d2a" FOREIGN KEY ("attributesId") REFERENCES "attributes" ("id") ON DELETE CASCADE ON UPDATE CASCADE`);
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(`ALTER TABLE "attribute-groups_attributes_attributes"
			DROP CONSTRAINT "FK_80251df37496acbfbc31cd50d2a"`);
		await queryRunner.query(`ALTER TABLE "attribute-groups_attributes_attributes"
			ADD CONSTRAINT "FK_80251df37496acbfbc31cd50d2a" FOREIGN KEY ("attributesId") REFERENCES "attributes" ("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
	}
}
