import type { MigrationInterface, QueryRunner } from "typeorm";

export class OrderTypeUpdate1678374700679 implements MigrationInterface {
	name = "OrderTypeUpdate1678374700679";

	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(`ALTER TYPE "public"."active-orders_type_enum" RENAME TO "active-orders_type_enum_old"`);
		await queryRunner.query(
			`CREATE TYPE "public"."active-orders_type_enum" AS ENUM('RESERVE', 'PICKUP', 'IN_PLACE', 'DELIVERY', 'OUT_OF_PLACE')`
		);
		await queryRunner.query(`ALTER TABLE "active-orders"
			ALTER COLUMN "type" TYPE "public"."active-orders_type_enum" USING "type"::"text"::"public"."active-orders_type_enum"`);
		await queryRunner.query(`DROP TYPE "public"."active-orders_type_enum_old"`);
		await queryRunner.query(`ALTER TYPE "public"."history-orders_type_enum" RENAME TO "history-orders_type_enum_old"`);
		await queryRunner.query(
			`CREATE TYPE "public"."history-orders_type_enum" AS ENUM('RESERVE', 'PICKUP', 'IN_PLACE', 'DELIVERY', 'OUT_OF_PLACE')`
		);
		await queryRunner.query(`ALTER TABLE "history-orders"
			ALTER COLUMN "type" TYPE "public"."history-orders_type_enum" USING "type"::"text"::"public"."history-orders_type_enum"`);
		await queryRunner.query(`DROP TYPE "public"."history-orders_type_enum_old"`);
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(
			`CREATE TYPE "public"."history-orders_type_enum_old" AS ENUM('RESERVE', 'PICKUP', 'IN_PLACE', 'DELIVERY')`
		);
		await queryRunner.query(`ALTER TABLE "history-orders"
			ALTER COLUMN "type" TYPE "public"."history-orders_type_enum_old" USING "type"::"text"::"public"."history-orders_type_enum_old"`);
		await queryRunner.query(`DROP TYPE "public"."history-orders_type_enum"`);
		await queryRunner.query(`ALTER TYPE "public"."history-orders_type_enum_old" RENAME TO "history-orders_type_enum"`);
		await queryRunner.query(
			`CREATE TYPE "public"."active-orders_type_enum_old" AS ENUM('RESERVE', 'PICKUP', 'IN_PLACE', 'DELIVERY')`
		);
		await queryRunner.query(`ALTER TABLE "active-orders"
			ALTER COLUMN "type" TYPE "public"."active-orders_type_enum_old" USING "type"::"text"::"public"."active-orders_type_enum_old"`);
		await queryRunner.query(`DROP TYPE "public"."active-orders_type_enum"`);
		await queryRunner.query(`ALTER TYPE "public"."active-orders_type_enum_old" RENAME TO "active-orders_type_enum"`);
	}
}
