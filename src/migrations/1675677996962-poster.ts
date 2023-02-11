import type { MigrationInterface, QueryRunner } from "typeorm";

export class PosterAccountSystem1675677996962 implements MigrationInterface {
	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(`
			INSERT INTO "accounting-systems"(name, "configFields")
			VALUES ('POSTER', '{"posterId": "required"}')`);
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(`
			DELETE
			FROM "accounting-systems"
			WHERE name = 'POSTER'
		`);
	}
}
