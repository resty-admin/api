import type { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateOrderNumber1677609137157 implements MigrationInterface {
	name = "UpdateOrderNumber1677609137157";

	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(`ALTER TABLE "accounting-systems"
			ALTER COLUMN "configFields" SET DEFAULT ('{}')`);
		await queryRunner.query(`ALTER TABLE "categories"
			ALTER COLUMN "accountingSystemsFields" SET DEFAULT ('{}')`);
		await queryRunner.query(`ALTER TABLE "categories"
			DROP CONSTRAINT IF EXISTS "UQ_a6d723774c196c45c4fcf8d3d4d"`);
		await queryRunner.query(`ALTER TABLE "categories"
			ALTER COLUMN "orderNumber" DROP DEFAULT`);
		await queryRunner.query(`DROP SEQUENCE IF EXISTS "categories_orderNumber_seq"`);
		await queryRunner.query(`ALTER TABLE "categories"
			ALTER COLUMN "orderNumber" SET DEFAULT '0'`);
		await queryRunner.query(`ALTER TABLE "products"
			ALTER COLUMN "accountingSystemsFields" SET DEFAULT ('{}')`);
		await queryRunner.query(`ALTER TABLE "products"
			DROP CONSTRAINT IF EXISTS "UQ_0cea8dd475a54dc5ae686b9adfe"`);
		await queryRunner.query(`ALTER TABLE "products"
			ALTER COLUMN "orderNumber" DROP DEFAULT`);
		await queryRunner.query(`DROP SEQUENCE IF EXISTS "products_orderNumber_seq"`);
		await queryRunner.query(`ALTER TABLE "products"
			ALTER COLUMN "orderNumber" SET DEFAULT '0'`);
		await queryRunner.query(`ALTER TABLE "attribute-groups"
			ALTER COLUMN "type" SET DEFAULT 'ADD'`);
		await queryRunner.query(`ALTER TABLE "halls"
			ALTER COLUMN "accountingSystemsFields" SET DEFAULT ('{}')`);
		await queryRunner.query(`ALTER TABLE "halls"
			DROP CONSTRAINT IF EXISTS "UQ_072ab05d0587ad721e2a9ff0a17"`);
		await queryRunner.query(`ALTER TABLE "halls"
			ALTER COLUMN "orderNumber" DROP DEFAULT`);
		await queryRunner.query(`DROP SEQUENCE IF EXISTS "halls_orderNumber_seq"`);
		await queryRunner.query(`ALTER TABLE "halls"
			ALTER COLUMN "orderNumber" SET DEFAULT '0'`);
		await queryRunner.query(`ALTER TABLE "tables"
			ALTER COLUMN "accountingSystemsFields" SET DEFAULT ('{}')`);
		await queryRunner.query(`ALTER TABLE "tables"
			DROP CONSTRAINT IF EXISTS "UQ_d0d0e275550de023ffa6950f702"`);
		await queryRunner.query(`ALTER TABLE "tables"
			ALTER COLUMN "orderNumber" DROP DEFAULT`);
		await queryRunner.query(`DROP SEQUENCE IF EXISTS "tables_orderNumber_seq"`);
		await queryRunner.query(`ALTER TABLE "tables"
			ALTER COLUMN "orderNumber" SET DEFAULT '0'`);
		await queryRunner.query(`ALTER TABLE "product-to-order"
			ALTER COLUMN "status" SET DEFAULT 'WAITING_FOR_APPROVE'`);
		await queryRunner.query(`ALTER TABLE "product-to-order"
			ALTER COLUMN "paidStatus" SET DEFAULT 'NOT_PAID'`);
		await queryRunner.query(`ALTER TABLE "active-orders"
			ALTER COLUMN "status" SET DEFAULT 'CREATED'`);
		await queryRunner.query(`ALTER TABLE "history-orders"
			ALTER COLUMN "table" SET DEFAULT ('{}')`);
		await queryRunner.query(`ALTER TABLE "history-orders"
			ALTER COLUMN "users" SET DEFAULT ('{}')`);
		await queryRunner.query(`ALTER TABLE "history-orders"
			ALTER COLUMN "status" SET DEFAULT 'CLOSED'`);
		await queryRunner.query(`ALTER TABLE "payment-systems"
			ALTER COLUMN "configFields" SET DEFAULT ('{}')`);
		await queryRunner.query(`ALTER TABLE "place-to-payment-system"
			ALTER COLUMN "placeConfigFields" SET DEFAULT ('{}')`);
		await queryRunner.query(`ALTER TABLE "user-to-place"
			ALTER COLUMN "role" SET DEFAULT 'CLIENT'`);
		await queryRunner.query(`ALTER TABLE "places"
			ALTER COLUMN "a11y" SET DEFAULT ('{"delivery":false,"takeaway":true,"booking":true,"order":true}')`);
		await queryRunner.query(`ALTER TABLE "places"
			ALTER COLUMN "weekDays" SET DEFAULT ('{"start":null,"end":null}')`);
		await queryRunner.query(`ALTER TABLE "places"
			ALTER COLUMN "weekendDays" SET DEFAULT ('{"start":null,"end":null}')`);
		await queryRunner.query(`ALTER TABLE "places"
			ALTER COLUMN "holidayDays" SET DEFAULT ('{}')`);
		await queryRunner.query(`ALTER TABLE "place-to-accounting-system"
			ALTER COLUMN "placeConfigFields" SET DEFAULT ('{}')`);
		await queryRunner.query(`ALTER TABLE "history-shifts"
			ALTER COLUMN "waiter" SET DEFAULT ('{}')`);
		await queryRunner.query(`ALTER TABLE "history-shifts"
			ALTER COLUMN "place" SET DEFAULT ('{}')`);
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(`ALTER TABLE "history-shifts"
			ALTER COLUMN "place" SET DEFAULT '{}'`);
		await queryRunner.query(`ALTER TABLE "history-shifts"
			ALTER COLUMN "waiter" SET DEFAULT '{}'`);
		await queryRunner.query(`ALTER TABLE "place-to-accounting-system"
			ALTER COLUMN "placeConfigFields" SET DEFAULT '{}'`);
		await queryRunner.query(`ALTER TABLE "places"
			ALTER COLUMN "holidayDays" SET DEFAULT '{}'`);
		await queryRunner.query(`ALTER TABLE "places"
			ALTER COLUMN "weekendDays" SET DEFAULT '{"start":null,"end":null}'`);
		await queryRunner.query(`ALTER TABLE "places"
			ALTER COLUMN "weekDays" SET DEFAULT '{"start":null,"end":null}'`);
		await queryRunner.query(`ALTER TABLE "places"
			ALTER COLUMN "a11y" SET DEFAULT '{"delivery":false,"takeaway":true,"booking":true,"order":true}'`);
		await queryRunner.query(`ALTER TABLE "user-to-place"
			ALTER COLUMN "role" SET DEFAULT 'CLIENT' - to -place_role_enum "`);
		await queryRunner.query(`ALTER TABLE "place-to-payment-system"
			ALTER COLUMN "placeConfigFields" SET DEFAULT '{}'`);
		await queryRunner.query(`ALTER TABLE "payment-systems"
			ALTER COLUMN "configFields" SET DEFAULT '{}'`);
		await queryRunner.query(`ALTER TABLE "history-orders"
			ALTER COLUMN "status" SET DEFAULT 'CLOSED' - orders_status_enum "`);
		await queryRunner.query(`ALTER TABLE "history-orders"
			ALTER COLUMN "users" SET DEFAULT '{}'`);
		await queryRunner.query(`ALTER TABLE "history-orders"
			ALTER COLUMN "table" SET DEFAULT '{}'`);
		await queryRunner.query(`ALTER TABLE "active-orders"
			ALTER COLUMN "status" SET DEFAULT 'CREATED' - orders_status_enum "`);
		await queryRunner.query(`ALTER TABLE "product-to-order"
			ALTER COLUMN "paidStatus" SET DEFAULT 'NOT_PAID' - to -order_paidstatus_enum "`);
		await queryRunner.query(`ALTER TABLE "product-to-order"
			ALTER COLUMN "status" SET DEFAULT 'WAITING_FOR_APPROVE' - to -order_status_enum "`);
		await queryRunner.query(`ALTER TABLE "tables"
			ALTER COLUMN "orderNumber" DROP DEFAULT`);
		await queryRunner.query(`CREATE SEQUENCE IF NOT EXISTS "tables_orderNumber_seq" OWNED BY "tables"."orderNumber"`);
		await queryRunner.query(`ALTER TABLE "tables"
			ALTER COLUMN "orderNumber" SET DEFAULT nextval('"tables_orderNumber_seq"')`);
		await queryRunner.query(`ALTER TABLE "tables"
			ADD CONSTRAINT "UQ_d0d0e275550de023ffa6950f702" UNIQUE ("orderNumber")`);
		await queryRunner.query(`ALTER TABLE "tables"
			ALTER COLUMN "accountingSystemsFields" SET DEFAULT '{}'`);
		await queryRunner.query(`ALTER TABLE "halls"
			ALTER COLUMN "orderNumber" DROP DEFAULT`);
		await queryRunner.query(`CREATE SEQUENCE IF NOT EXISTS "halls_orderNumber_seq" OWNED BY "halls"."orderNumber"`);
		await queryRunner.query(`ALTER TABLE "halls"
			ALTER COLUMN "orderNumber" SET DEFAULT nextval('"halls_orderNumber_seq"')`);
		await queryRunner.query(`ALTER TABLE "halls"
			ADD CONSTRAINT "UQ_072ab05d0587ad721e2a9ff0a17" UNIQUE ("orderNumber")`);
		await queryRunner.query(`ALTER TABLE "halls"
			ALTER COLUMN "accountingSystemsFields" SET DEFAULT '{}'`);
		await queryRunner.query(`ALTER TABLE "attribute-groups"
			ALTER COLUMN "type" SET DEFAULT 'ADD' - groups_type_enum "`);
		await queryRunner.query(`ALTER TABLE "products"
			ALTER COLUMN "orderNumber" DROP DEFAULT`);
		await queryRunner.query(
			`CREATE SEQUENCE IF NOT EXISTS "products_orderNumber_seq" OWNED BY "products"."orderNumber"`
		);
		await queryRunner.query(`ALTER TABLE "products"
			ALTER COLUMN "orderNumber" SET DEFAULT nextval('"products_orderNumber_seq"')`);
		await queryRunner.query(`ALTER TABLE "products"
			ADD CONSTRAINT "UQ_0cea8dd475a54dc5ae686b9adfe" UNIQUE ("orderNumber")`);
		await queryRunner.query(`ALTER TABLE "products"
			ALTER COLUMN "accountingSystemsFields" SET DEFAULT '{}'`);
		await queryRunner.query(`ALTER TABLE "categories"
			ALTER COLUMN "orderNumber" DROP DEFAULT`);
		await queryRunner.query(
			`CREATE SEQUENCE IF NOT EXISTS "categories_orderNumber_seq" OWNED BY "categories"."orderNumber"`
		);
		await queryRunner.query(`ALTER TABLE "categories"
			ALTER COLUMN "orderNumber" SET DEFAULT nextval('"categories_orderNumber_seq"')`);
		await queryRunner.query(`ALTER TABLE "categories"
			ADD CONSTRAINT "UQ_a6d723774c196c45c4fcf8d3d4d" UNIQUE ("orderNumber")`);
		await queryRunner.query(`ALTER TABLE "categories"
			ALTER COLUMN "accountingSystemsFields" SET DEFAULT '{}'`);
		await queryRunner.query(`ALTER TABLE "accounting-systems"
			ALTER COLUMN "configFields" SET DEFAULT '{}'`);
	}
}
