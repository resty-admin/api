import type { MigrationInterface, QueryRunner } from "typeorm";

export class OrderNumberNull1678366744741 implements MigrationInterface {
	name = "OrderNumberNull1678366744741";

	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(`ALTER TABLE "history-orders"
			ALTER COLUMN "orderNumber" DROP NOT NULL`);
		await queryRunner.query(`ALTER TABLE "history-orders"
			DROP CONSTRAINT "UQ_205ae4d23bcfda3a3cb3207cf01"`);
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(`ALTER TABLE "history-orders"
			ADD CONSTRAINT "UQ_205ae4d23bcfda3a3cb3207cf01" UNIQUE ("orderNumber")`);
		await queryRunner.query(`ALTER TABLE "history-orders"
			ALTER COLUMN "orderNumber" SET NOT NULL`);
	}
}
