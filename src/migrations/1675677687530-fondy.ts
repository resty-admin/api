import type { MigrationInterface, QueryRunner } from "typeorm";

export class FondyPaymentSystem1675677687530 implements MigrationInterface {
	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(`
			INSERT INTO "payment-systems"(name, "configFields")
			VALUES ('FONDY', '{"merchantId": "required"}')`);
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(`
			DELETE
			FROM "payment-systems"
			WHERE name = 'FONDY'
		`);
	}
}
