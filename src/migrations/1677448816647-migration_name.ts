import type { MigrationInterface, QueryRunner } from "typeorm";

export class InitDb1677448816647 implements MigrationInterface {
	name = "migrationName1677448816647";

	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(`CREATE TABLE "accounting-systems"
														 (
															 "id"           uuid              NOT NULL DEFAULT uuid_generate_v4(),
															 "name"         character varying NOT NULL,
															 "configFields" json                       DEFAULT ('{}'),
															 CONSTRAINT "PK_ad720b645c43742f73c82c155a5" PRIMARY KEY ("id")
														 )`);
		await queryRunner.query(`CREATE TABLE "files"
														 (
															 "id"  uuid              NOT NULL DEFAULT uuid_generate_v4(),
															 "url" character varying NOT NULL,
															 CONSTRAINT "PK_6c16b9093a142e0e7613b04a3d9" PRIMARY KEY ("id")
														 )`);
		await queryRunner.query(`CREATE TABLE "categories"
														 (
															 "id"                      uuid              NOT NULL DEFAULT uuid_generate_v4(),
															 "name"                    character varying NOT NULL DEFAULT '',
															 "isHide"                  boolean           NOT NULL DEFAULT false,
															 "accountingSystemsFields" json                       DEFAULT ('{}'),
															 "placeId"                 uuid,
															 "fileId"                  uuid,
															 CONSTRAINT "REL_36c4778d5a9b6f7368973d053a" UNIQUE ("fileId"),
															 CONSTRAINT "PK_24dbc6126a28ff948da33e97d3b" PRIMARY KEY ("id")
														 )`);
		await queryRunner.query(`CREATE TABLE "products"
														 (
															 "id"                      uuid              NOT NULL DEFAULT uuid_generate_v4(),
															 "name"                    character varying NOT NULL,
															 "description"             character varying          DEFAULT '',
															 "price"                   integer           NOT NULL DEFAULT '0',
															 "isHide"                  boolean           NOT NULL DEFAULT false,
															 "accountingSystemsFields" json                       DEFAULT ('{}'),
															 "categoryId"              uuid,
															 "fileId"                  uuid,
															 CONSTRAINT "REL_d6408dea56eea4f9cd8ee7e45e" UNIQUE ("fileId"),
															 CONSTRAINT "PK_0806c755e0aca124e67c0cf6d7d" PRIMARY KEY ("id")
														 )`);
		await queryRunner.query(`CREATE TYPE "public"."attribute-groups_type_enum" AS ENUM('ADD', 'REMOVE')`);
		await queryRunner.query(`CREATE TABLE "attribute-groups"
														 (
															 "id"              uuid                                  NOT NULL DEFAULT uuid_generate_v4(),
															 "name"            character varying                     NOT NULL,
															 "type"            "public"."attribute-groups_type_enum" NOT NULL DEFAULT 'ADD',
															 "maxItemsForPick" integer                               NOT NULL DEFAULT '5',
															 "placeId"         uuid,
															 CONSTRAINT "PK_cc74ff30323f4f9b2a2e52d6578" PRIMARY KEY ("id")
														 )`);
		await queryRunner.query(`CREATE TABLE "attributes"
														 (
															 "id"      uuid              NOT NULL DEFAULT uuid_generate_v4(),
															 "name"    character varying NOT NULL,
															 "price"   integer,
															 "placeId" uuid,
															 CONSTRAINT "PK_32216e2e61830211d3a5d7fa72c" PRIMARY KEY ("id")
														 )`);
		await queryRunner.query(`CREATE TABLE "commands"
														 (
															 "id"          uuid              NOT NULL DEFAULT uuid_generate_v4(),
															 "name"        character varying NOT NULL,
															 "description" character varying NOT NULL,
															 "placeId"     uuid,
															 CONSTRAINT "PK_7ac292c3aa19300482b2b190d1e" PRIMARY KEY ("id")
														 )`);
		await queryRunner.query(`CREATE TABLE "halls"
														 (
															 "id"                      uuid              NOT NULL DEFAULT uuid_generate_v4(),
															 "name"                    character varying NOT NULL,
															 "isHide"                  boolean           NOT NULL DEFAULT false,
															 "accountingSystemsFields" json                       DEFAULT ('{}'),
															 "placeId"                 uuid,
															 "fileId"                  uuid,
															 CONSTRAINT "REL_a0870c696a08727f3fe8ca38d0" UNIQUE ("fileId"),
															 CONSTRAINT "PK_4665c2f3b1e718e12b06278bae8" PRIMARY KEY ("id")
														 )`);
		await queryRunner.query(`CREATE TABLE "tables"
														 (
															 "id"                      uuid              NOT NULL DEFAULT uuid_generate_v4(),
															 "name"                    character varying NOT NULL,
															 "code"                    integer           NOT NULL,
															 "isHide"                  boolean           NOT NULL DEFAULT false,
															 "accountingSystemsFields" json                       DEFAULT ('{}'),
															 "hallId"                  uuid,
															 "fileId"                  uuid,
															 CONSTRAINT "REL_2d33a59f73cf02375ddabee131" UNIQUE ("fileId"),
															 CONSTRAINT "PK_7cf2aca7af9550742f855d4eb69" PRIMARY KEY ("id")
														 )`);
		await queryRunner.query(`CREATE TABLE "attribute-to-product"
														 (
															 "id"               uuid    NOT NULL DEFAULT uuid_generate_v4(),
															 "count"            integer NOT NULL,
															 "attributeId"      uuid,
															 "productToOrderId" uuid,
															 CONSTRAINT "PK_0754c844b75882895cffa7abad8" PRIMARY KEY ("id")
														 )`);
		await queryRunner.query(
			`CREATE TYPE "public"."product-to-order_status_enum" AS ENUM('WAITING_FOR_APPROVE', 'REJECTED', 'APPROVED')`
		);
		await queryRunner.query(
			`CREATE TYPE "public"."product-to-order_paidstatus_enum" AS ENUM('PAID', 'NOT_PAID', 'WAITING')`
		);
		await queryRunner.query(`CREATE TABLE "product-to-order"
														 (
															 "id"         uuid                                        NOT NULL DEFAULT uuid_generate_v4(),
															 "count"      integer                                     NOT NULL,
															 "status"     "public"."product-to-order_status_enum"     NOT NULL DEFAULT 'WAITING_FOR_APPROVE',
															 "paidStatus" "public"."product-to-order_paidstatus_enum" NOT NULL DEFAULT 'NOT_PAID',
															 "userId"     uuid,
															 "productId"  uuid,
															 "orderId"    uuid,
															 CONSTRAINT "PK_0a7ad9bedc7e8521b3854a23783" PRIMARY KEY ("id")
														 )`);
		await queryRunner.query(
			`CREATE TYPE "public"."active-orders_type_enum" AS ENUM('RESERVE', 'PICKUP', 'IN_PLACE', 'DELIVERY')`
		);
		await queryRunner.query(
			`CREATE TYPE "public"."active-orders_status_enum" AS ENUM('CREATED', 'CANCEL', 'CLOSED', 'APPROVED', 'REJECTED', 'REQUEST_TO_CONFIRM')`
		);
		await queryRunner.query(`CREATE TABLE "active-orders"
														 (
															 "id"          uuid                                 NOT NULL DEFAULT uuid_generate_v4(),
															 "code"        integer                              NOT NULL,
															 "orderNumber" SERIAL                               NOT NULL,
															 "type"        "public"."active-orders_type_enum"   NOT NULL,
															 "status"      "public"."active-orders_status_enum" NOT NULL DEFAULT 'CREATED',
															 "totalPrice"  integer,
															 "createdAt"   TIMESTAMP                            NOT NULL,
															 "startDate"   TIMESTAMP                            NOT NULL,
															 "comments"    character varying,
															 "tableId"     uuid,
															 "placeId"     uuid,
															 CONSTRAINT "UQ_4fc135c49faaca451438c4ea8b7" UNIQUE ("code"),
															 CONSTRAINT "UQ_a42c2b8de67fa0dcd8052e162aa" UNIQUE ("orderNumber"),
															 CONSTRAINT "PK_4f3b067740bac5d468b4b43e1dc" PRIMARY KEY ("id")
														 )`);
		await queryRunner.query(
			`CREATE TYPE "public"."history-orders_type_enum" AS ENUM('RESERVE', 'PICKUP', 'IN_PLACE', 'DELIVERY')`
		);
		await queryRunner.query(
			`CREATE TYPE "public"."history-orders_status_enum" AS ENUM('CREATED', 'CANCEL', 'CLOSED', 'APPROVED', 'REJECTED', 'REQUEST_TO_CONFIRM')`
		);
		await queryRunner.query(`CREATE TABLE "history-orders"
														 (
															 "id"               uuid                                  NOT NULL DEFAULT uuid_generate_v4(),
															 "orderNumber"      integer                               NOT NULL,
															 "table"            jsonb                                          DEFAULT ('{}'),
															 "users"            jsonb                                          DEFAULT ('{}'),
															 "type"             "public"."history-orders_type_enum"   NOT NULL,
															 "status"           "public"."history-orders_status_enum" NOT NULL DEFAULT 'CLOSED',
															 "totalPrice"       integer,
															 "productsToOrders" jsonb                                          DEFAULT '[]',
															 "placeId"          uuid,
															 CONSTRAINT "UQ_205ae4d23bcfda3a3cb3207cf01" UNIQUE ("orderNumber"),
															 CONSTRAINT "PK_0cbb3e43314df7ea5834462d3a9" PRIMARY KEY ("id")
														 )`);
		await queryRunner.query(
			`CREATE TYPE "public"."users_role_enum" AS ENUM('ADMIN', 'MANAGER', 'WAITER', 'HOSTESS', 'HOOKAH', 'CLIENT')`
		);
		await queryRunner.query(`CREATE TYPE "public"."users_theme_enum" AS ENUM('light', 'dark')`);
		await queryRunner.query(`CREATE TYPE "public"."users_status_enum" AS ENUM('NOT_VERIFIED', 'VERIFIED')`);
		await queryRunner.query(`CREATE TABLE "users"
														 (
															 "id"               uuid                         NOT NULL DEFAULT uuid_generate_v4(),
															 "name"             character varying            NOT NULL DEFAULT '',
															 "role"             "public"."users_role_enum"   NOT NULL DEFAULT 'CLIENT',
															 "theme"            "public"."users_theme_enum"  NOT NULL DEFAULT 'light',
															 "email"            character varying,
															 "googleId"         character varying,
															 "telegramId"       bigint,
															 "telegramToken"    character varying,
															 "tel"              character varying,
															 "verificationCode" integer,
															 "status"           "public"."users_status_enum" NOT NULL DEFAULT 'NOT_VERIFIED',
															 "password"         character varying                     DEFAULT '',
															 CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"),
															 CONSTRAINT "UQ_f382af58ab36057334fb262efd5" UNIQUE ("googleId"),
															 CONSTRAINT "UQ_df18d17f84763558ac84192c754" UNIQUE ("telegramId"),
															 CONSTRAINT "UQ_5d03187613c5c33a458821cba6d" UNIQUE ("telegramToken"),
															 CONSTRAINT "UQ_a383ac5d1cc34720ea56a937a13" UNIQUE ("tel"),
															 CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id")
														 )`);
		await queryRunner.query(`CREATE TYPE "public"."companies_status_enum" AS ENUM('APPROVED', 'REJECTED', 'PENDING')`);
		await queryRunner.query(`CREATE TABLE "companies"
														 (
															 "id"      uuid                             NOT NULL DEFAULT uuid_generate_v4(),
															 "name"    character varying                NOT NULL,
															 "status"  "public"."companies_status_enum" NOT NULL DEFAULT 'PENDING',
															 "isHide"  boolean                          NOT NULL DEFAULT false,
															 "ownerId" uuid,
															 "logoId"  uuid,
															 CONSTRAINT "REL_652da5b265918d45aaba9d3a3a" UNIQUE ("logoId"),
															 CONSTRAINT "PK_d4bc3e82a314fa9e29f652c2c22" PRIMARY KEY ("id")
														 )`);
		await queryRunner.query(`CREATE TABLE "payment-systems"
														 (
															 "id"           uuid              NOT NULL DEFAULT uuid_generate_v4(),
															 "name"         character varying NOT NULL,
															 "configFields" json                       DEFAULT ('{}'),
															 CONSTRAINT "PK_1bb437a7fe5e485171052384b53" PRIMARY KEY ("id")
														 )`);
		await queryRunner.query(`CREATE TABLE "place-to-payment-system"
														 (
															 "id"                uuid NOT NULL DEFAULT uuid_generate_v4(),
															 "placeConfigFields" json          DEFAULT ('{}'),
															 "placeId"           uuid,
															 "paymentSystemId"   uuid,
															 CONSTRAINT "PK_64bf17871be372b0609577a967d" PRIMARY KEY ("id")
														 )`);
		await queryRunner.query(
			`CREATE TYPE "public"."user-to-place_role_enum" AS ENUM('ADMIN', 'MANAGER', 'WAITER', 'HOSTESS', 'HOOKAH', 'CLIENT')`
		);
		await queryRunner.query(`CREATE TABLE "user-to-place"
														 (
															 "id"      uuid                               NOT NULL DEFAULT uuid_generate_v4(),
															 "role"    "public"."user-to-place_role_enum" NOT NULL DEFAULT 'CLIENT',
															 "visits"  integer                            NOT NULL DEFAULT '1',
															 "userId"  uuid,
															 "placeId" uuid,
															 CONSTRAINT "PK_c375165de3373b21e8e01f4a0df" PRIMARY KEY ("id")
														 )`);
		await queryRunner.query(`CREATE TYPE "public"."places_status_enum" AS ENUM('OPENED', 'CLOSED')`);
		await queryRunner.query(
			`CREATE TYPE "public"."places_verificationstatus_enum" AS ENUM('VERIFIED', 'NOT_VERIFIED')`
		);
		await queryRunner.query(`CREATE TABLE "places"
														 (
															 "id"                 uuid                                      NOT NULL DEFAULT uuid_generate_v4(),
															 "name"               character varying                         NOT NULL,
															 "address"            character varying,
															 "status"             "public"."places_status_enum"             NOT NULL DEFAULT 'CLOSED',
															 "verificationStatus" "public"."places_verificationstatus_enum" NOT NULL DEFAULT 'NOT_VERIFIED',
															 "a11y"               json                                      NOT NULL DEFAULT ('{"delivery":false,"takeaway":true,"booking":true,"order":true}'),
															 "weekDays"           json                                      NOT NULL DEFAULT ('{"start":null,"end":null}'),
															 "weekendDays"        json                                      NOT NULL DEFAULT ('{"start":null,"end":null}'),
															 "holidayDays"        json                                      NOT NULL DEFAULT ('{}'),
															 "waiterCode"         integer,
															 "isHide"             boolean                                   NOT NULL DEFAULT false,
															 "companyId"          uuid,
															 "fileId"             uuid,
															 CONSTRAINT "REL_65d2096fa5ad709a65925e3e3a" UNIQUE ("fileId"),
															 CONSTRAINT "PK_1afab86e226b4c3bc9a74465c12" PRIMARY KEY ("id")
														 )`);
		await queryRunner.query(`CREATE TABLE "place-to-accounting-system"
														 (
															 "id"                 uuid NOT NULL DEFAULT uuid_generate_v4(),
															 "placeConfigFields"  json          DEFAULT ('{}'),
															 "placeId"            uuid,
															 "accountingSystemId" uuid,
															 CONSTRAINT "PK_420a01711ab2c036ceefc902e67" PRIMARY KEY ("id")
														 )`);
		await queryRunner.query(`CREATE TABLE "languages"
														 (
															 "id"     uuid              NOT NULL DEFAULT uuid_generate_v4(),
															 "name"   character varying NOT NULL DEFAULT '',
															 "fileId" uuid,
															 CONSTRAINT "REL_90243d24ae54b41468764e7961" UNIQUE ("fileId"),
															 CONSTRAINT "PK_b517f827ca496b29f4d549c631d" PRIMARY KEY ("id")
														 )`);
		await queryRunner.query(`CREATE TABLE "active-shifts"
														 (
															 "id"        uuid      NOT NULL DEFAULT uuid_generate_v4(),
															 "shiftDate" TIMESTAMP NOT NULL DEFAULT now(),
															 "waiterId"  uuid,
															 "placeId"   uuid,
															 CONSTRAINT "PK_87d3f5075a3aa227dffff693f4d" PRIMARY KEY ("id")
														 )`);
		await queryRunner.query(`CREATE TABLE "history-shifts"
														 (
															 "id"             uuid      NOT NULL DEFAULT uuid_generate_v4(),
															 "waiter"         json               DEFAULT ('{}'),
															 "tables"         jsonb              DEFAULT '[]',
															 "place"          json               DEFAULT ('{}'),
															 "shiftDateStart" TIMESTAMP NOT NULL,
															 "shiftDateEnd"   TIMESTAMP NOT NULL DEFAULT now(),
															 CONSTRAINT "PK_0296d32ac14925b61d79ae3653c" PRIMARY KEY ("id")
														 )`);
		await queryRunner.query(`CREATE TABLE "products_attrs_groups_attribute-groups"
														 (
															 "productsId"        uuid NOT NULL,
															 "attributeGroupsId" uuid NOT NULL,
															 CONSTRAINT "PK_e8e7d45df9a0deef9ba147ff0bc" PRIMARY KEY ("productsId", "attributeGroupsId")
														 )`);
		await queryRunner.query(
			`CREATE INDEX "IDX_ae3408b36bffbfb36168fb248a" ON "products_attrs_groups_attribute-groups" ("productsId") `
		);
		await queryRunner.query(
			`CREATE INDEX "IDX_309edc0cf3cf334f1a1100233e" ON "products_attrs_groups_attribute-groups" ("attributeGroupsId") `
		);
		await queryRunner.query(`CREATE TABLE "attribute-groups_attributes_attributes"
														 (
															 "attributeGroupsId" uuid NOT NULL,
															 "attributesId"      uuid NOT NULL,
															 CONSTRAINT "PK_b26033745d9529c62bb57a78ba5" PRIMARY KEY ("attributeGroupsId", "attributesId")
														 )`);
		await queryRunner.query(
			`CREATE INDEX "IDX_ddf5a3d4e918ad912305454fe7" ON "attribute-groups_attributes_attributes" ("attributeGroupsId") `
		);
		await queryRunner.query(
			`CREATE INDEX "IDX_80251df37496acbfbc31cd50d2" ON "attribute-groups_attributes_attributes" ("attributesId") `
		);
		await queryRunner.query(`CREATE TABLE "active-orders_users_users"
														 (
															 "activeOrdersId" uuid NOT NULL,
															 "usersId"        uuid NOT NULL,
															 CONSTRAINT "PK_8fbf8d895d88eb66b122a43924b" PRIMARY KEY ("activeOrdersId", "usersId")
														 )`);
		await queryRunner.query(
			`CREATE INDEX "IDX_58e7b92afd1331e10f42e48b2c" ON "active-orders_users_users" ("activeOrdersId") `
		);
		await queryRunner.query(
			`CREATE INDEX "IDX_1850acac05948e82573f67a750" ON "active-orders_users_users" ("usersId") `
		);
		await queryRunner.query(`CREATE TABLE "active-orders_waiters_users"
														 (
															 "activeOrdersId" uuid NOT NULL,
															 "usersId"        uuid NOT NULL,
															 CONSTRAINT "PK_f8a800a7d53fcec068bbfd49361" PRIMARY KEY ("activeOrdersId", "usersId")
														 )`);
		await queryRunner.query(
			`CREATE INDEX "IDX_52c2cdd8d47045aecdf3d03aac" ON "active-orders_waiters_users" ("activeOrdersId") `
		);
		await queryRunner.query(
			`CREATE INDEX "IDX_8bf54ca18a904af6ed6de32dc1" ON "active-orders_waiters_users" ("usersId") `
		);
		await queryRunner.query(`CREATE TABLE "active-shifts_tables_tables"
														 (
															 "activeShiftsId" uuid NOT NULL,
															 "tablesId"       uuid NOT NULL,
															 CONSTRAINT "PK_5669820a230f6b1c22e519efced" PRIMARY KEY ("activeShiftsId", "tablesId")
														 )`);
		await queryRunner.query(
			`CREATE INDEX "IDX_92f1b8856fa52391edc4e44a85" ON "active-shifts_tables_tables" ("activeShiftsId") `
		);
		await queryRunner.query(
			`CREATE INDEX "IDX_9e4724615997a85fc8f91e8a24" ON "active-shifts_tables_tables" ("tablesId") `
		);
		await queryRunner.query(`ALTER TABLE "categories"
			ADD CONSTRAINT "FK_7f85b26b7d374aa8a305235d32d" FOREIGN KEY ("placeId") REFERENCES "places" ("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
		await queryRunner.query(`ALTER TABLE "categories"
			ADD CONSTRAINT "FK_36c4778d5a9b6f7368973d053a7" FOREIGN KEY ("fileId") REFERENCES "files" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
		await queryRunner.query(`ALTER TABLE "products"
			ADD CONSTRAINT "FK_ff56834e735fa78a15d0cf21926" FOREIGN KEY ("categoryId") REFERENCES "categories" ("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
		await queryRunner.query(`ALTER TABLE "products"
			ADD CONSTRAINT "FK_d6408dea56eea4f9cd8ee7e45e6" FOREIGN KEY ("fileId") REFERENCES "files" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
		await queryRunner.query(`ALTER TABLE "attribute-groups"
			ADD CONSTRAINT "FK_f4c592aa81c81622c5385a5cd63" FOREIGN KEY ("placeId") REFERENCES "places" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
		await queryRunner.query(`ALTER TABLE "attributes"
			ADD CONSTRAINT "FK_09d0fb006462168ca3900c10491" FOREIGN KEY ("placeId") REFERENCES "places" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
		await queryRunner.query(`ALTER TABLE "commands"
			ADD CONSTRAINT "FK_ca9d3509b09680dcb3aabbb9cd2" FOREIGN KEY ("placeId") REFERENCES "places" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
		await queryRunner.query(`ALTER TABLE "halls"
			ADD CONSTRAINT "FK_67ae0051bb5961c50a48f65f7d1" FOREIGN KEY ("placeId") REFERENCES "places" ("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
		await queryRunner.query(`ALTER TABLE "halls"
			ADD CONSTRAINT "FK_a0870c696a08727f3fe8ca38d0e" FOREIGN KEY ("fileId") REFERENCES "files" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
		await queryRunner.query(`ALTER TABLE "tables"
			ADD CONSTRAINT "FK_2fb8e7945ebe0f19d64ec38a46f" FOREIGN KEY ("hallId") REFERENCES "halls" ("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
		await queryRunner.query(`ALTER TABLE "tables"
			ADD CONSTRAINT "FK_2d33a59f73cf02375ddabee1316" FOREIGN KEY ("fileId") REFERENCES "files" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
		await queryRunner.query(`ALTER TABLE "attribute-to-product"
			ADD CONSTRAINT "FK_b56ea1388e0d6be45a2e67cec1c" FOREIGN KEY ("attributeId") REFERENCES "attributes" ("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
		await queryRunner.query(`ALTER TABLE "attribute-to-product"
			ADD CONSTRAINT "FK_05291f29bd37332972a879d0364" FOREIGN KEY ("productToOrderId") REFERENCES "product-to-order" ("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
		await queryRunner.query(`ALTER TABLE "product-to-order"
			ADD CONSTRAINT "FK_92934ebf36486f00cb614792b37" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
		await queryRunner.query(`ALTER TABLE "product-to-order"
			ADD CONSTRAINT "FK_6d5f0627bf0249b032ad2521e9b" FOREIGN KEY ("productId") REFERENCES "products" ("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
		await queryRunner.query(`ALTER TABLE "product-to-order"
			ADD CONSTRAINT "FK_f47df4c488f7afc9cd6eb85cc89" FOREIGN KEY ("orderId") REFERENCES "active-orders" ("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
		await queryRunner.query(`ALTER TABLE "active-orders"
			ADD CONSTRAINT "FK_d611326eb42a42f612092001cc6" FOREIGN KEY ("tableId") REFERENCES "tables" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
		await queryRunner.query(`ALTER TABLE "active-orders"
			ADD CONSTRAINT "FK_496b404172bafbed425adfbdf33" FOREIGN KEY ("placeId") REFERENCES "places" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
		await queryRunner.query(`ALTER TABLE "history-orders"
			ADD CONSTRAINT "FK_8ebd894715a1d9e2498ad4dc35d" FOREIGN KEY ("placeId") REFERENCES "places" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
		await queryRunner.query(`ALTER TABLE "companies"
			ADD CONSTRAINT "FK_6dcdcbb7d72f64602307ec4ab39" FOREIGN KEY ("ownerId") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
		await queryRunner.query(`ALTER TABLE "companies"
			ADD CONSTRAINT "FK_652da5b265918d45aaba9d3a3a1" FOREIGN KEY ("logoId") REFERENCES "files" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
		await queryRunner.query(`ALTER TABLE "place-to-payment-system"
			ADD CONSTRAINT "FK_44868f6f79d7c9b0d731268632f" FOREIGN KEY ("placeId") REFERENCES "places" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
		await queryRunner.query(`ALTER TABLE "place-to-payment-system"
			ADD CONSTRAINT "FK_32e645817c9474d3ed8936302f0" FOREIGN KEY ("paymentSystemId") REFERENCES "payment-systems" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
		await queryRunner.query(`ALTER TABLE "user-to-place"
			ADD CONSTRAINT "FK_630b111ecd709a2d001e2e906a1" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
		await queryRunner.query(`ALTER TABLE "user-to-place"
			ADD CONSTRAINT "FK_c7edb84efc46ed5d11ed37d7e0c" FOREIGN KEY ("placeId") REFERENCES "places" ("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
		await queryRunner.query(`ALTER TABLE "places"
			ADD CONSTRAINT "FK_fd173428a711ad0f0f879ef976c" FOREIGN KEY ("companyId") REFERENCES "companies" ("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
		await queryRunner.query(`ALTER TABLE "places"
			ADD CONSTRAINT "FK_65d2096fa5ad709a65925e3e3a4" FOREIGN KEY ("fileId") REFERENCES "files" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
		await queryRunner.query(`ALTER TABLE "place-to-accounting-system"
			ADD CONSTRAINT "FK_fe71b7ee10c16f707a077bfdb3d" FOREIGN KEY ("placeId") REFERENCES "places" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
		await queryRunner.query(`ALTER TABLE "place-to-accounting-system"
			ADD CONSTRAINT "FK_abecd98adc95b17f811c69933e3" FOREIGN KEY ("accountingSystemId") REFERENCES "accounting-systems" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
		await queryRunner.query(`ALTER TABLE "languages"
			ADD CONSTRAINT "FK_90243d24ae54b41468764e79617" FOREIGN KEY ("fileId") REFERENCES "files" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
		await queryRunner.query(`ALTER TABLE "active-shifts"
			ADD CONSTRAINT "FK_e5c5595aeeeda4301a2d5924c3e" FOREIGN KEY ("placeId") REFERENCES "places" ("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
		await queryRunner.query(`ALTER TABLE "products_attrs_groups_attribute-groups"
			ADD CONSTRAINT "FK_ae3408b36bffbfb36168fb248af" FOREIGN KEY ("productsId") REFERENCES "products" ("id") ON DELETE CASCADE ON UPDATE CASCADE`);
		await queryRunner.query(`ALTER TABLE "products_attrs_groups_attribute-groups"
			ADD CONSTRAINT "FK_309edc0cf3cf334f1a1100233ea" FOREIGN KEY ("attributeGroupsId") REFERENCES "attribute-groups" ("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
		await queryRunner.query(`ALTER TABLE "attribute-groups_attributes_attributes"
			ADD CONSTRAINT "FK_ddf5a3d4e918ad912305454fe70" FOREIGN KEY ("attributeGroupsId") REFERENCES "attribute-groups" ("id") ON DELETE CASCADE ON UPDATE CASCADE`);
		await queryRunner.query(`ALTER TABLE "attribute-groups_attributes_attributes"
			ADD CONSTRAINT "FK_80251df37496acbfbc31cd50d2a" FOREIGN KEY ("attributesId") REFERENCES "attributes" ("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
		await queryRunner.query(`ALTER TABLE "active-orders_users_users"
			ADD CONSTRAINT "FK_58e7b92afd1331e10f42e48b2ca" FOREIGN KEY ("activeOrdersId") REFERENCES "active-orders" ("id") ON DELETE CASCADE ON UPDATE CASCADE`);
		await queryRunner.query(`ALTER TABLE "active-orders_users_users"
			ADD CONSTRAINT "FK_1850acac05948e82573f67a7509" FOREIGN KEY ("usersId") REFERENCES "users" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
		await queryRunner.query(`ALTER TABLE "active-orders_waiters_users"
			ADD CONSTRAINT "FK_52c2cdd8d47045aecdf3d03aac8" FOREIGN KEY ("activeOrdersId") REFERENCES "active-orders" ("id") ON DELETE CASCADE ON UPDATE CASCADE`);
		await queryRunner.query(`ALTER TABLE "active-orders_waiters_users"
			ADD CONSTRAINT "FK_8bf54ca18a904af6ed6de32dc15" FOREIGN KEY ("usersId") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE`);
		await queryRunner.query(`ALTER TABLE "active-shifts_tables_tables"
			ADD CONSTRAINT "FK_92f1b8856fa52391edc4e44a854" FOREIGN KEY ("activeShiftsId") REFERENCES "active-shifts" ("id") ON DELETE CASCADE ON UPDATE CASCADE`);
		await queryRunner.query(`ALTER TABLE "active-shifts_tables_tables"
			ADD CONSTRAINT "FK_9e4724615997a85fc8f91e8a241" FOREIGN KEY ("tablesId") REFERENCES "tables" ("id") ON DELETE CASCADE ON UPDATE CASCADE`);
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(`ALTER TABLE "active-shifts_tables_tables"
			DROP CONSTRAINT "FK_9e4724615997a85fc8f91e8a241"`);
		await queryRunner.query(`ALTER TABLE "active-shifts_tables_tables"
			DROP CONSTRAINT "FK_92f1b8856fa52391edc4e44a854"`);
		await queryRunner.query(`ALTER TABLE "active-orders_waiters_users"
			DROP CONSTRAINT "FK_8bf54ca18a904af6ed6de32dc15"`);
		await queryRunner.query(`ALTER TABLE "active-orders_waiters_users"
			DROP CONSTRAINT "FK_52c2cdd8d47045aecdf3d03aac8"`);
		await queryRunner.query(`ALTER TABLE "active-orders_users_users"
			DROP CONSTRAINT "FK_1850acac05948e82573f67a7509"`);
		await queryRunner.query(`ALTER TABLE "active-orders_users_users"
			DROP CONSTRAINT "FK_58e7b92afd1331e10f42e48b2ca"`);
		await queryRunner.query(`ALTER TABLE "attribute-groups_attributes_attributes"
			DROP CONSTRAINT "FK_80251df37496acbfbc31cd50d2a"`);
		await queryRunner.query(`ALTER TABLE "attribute-groups_attributes_attributes"
			DROP CONSTRAINT "FK_ddf5a3d4e918ad912305454fe70"`);
		await queryRunner.query(`ALTER TABLE "products_attrs_groups_attribute-groups"
			DROP CONSTRAINT "FK_309edc0cf3cf334f1a1100233ea"`);
		await queryRunner.query(`ALTER TABLE "products_attrs_groups_attribute-groups"
			DROP CONSTRAINT "FK_ae3408b36bffbfb36168fb248af"`);
		await queryRunner.query(`ALTER TABLE "active-shifts"
			DROP CONSTRAINT "FK_e5c5595aeeeda4301a2d5924c3e"`);
		await queryRunner.query(`ALTER TABLE "languages"
			DROP CONSTRAINT "FK_90243d24ae54b41468764e79617"`);
		await queryRunner.query(`ALTER TABLE "place-to-accounting-system"
			DROP CONSTRAINT "FK_abecd98adc95b17f811c69933e3"`);
		await queryRunner.query(`ALTER TABLE "place-to-accounting-system"
			DROP CONSTRAINT "FK_fe71b7ee10c16f707a077bfdb3d"`);
		await queryRunner.query(`ALTER TABLE "places"
			DROP CONSTRAINT "FK_65d2096fa5ad709a65925e3e3a4"`);
		await queryRunner.query(`ALTER TABLE "places"
			DROP CONSTRAINT "FK_fd173428a711ad0f0f879ef976c"`);
		await queryRunner.query(`ALTER TABLE "user-to-place"
			DROP CONSTRAINT "FK_c7edb84efc46ed5d11ed37d7e0c"`);
		await queryRunner.query(`ALTER TABLE "user-to-place"
			DROP CONSTRAINT "FK_630b111ecd709a2d001e2e906a1"`);
		await queryRunner.query(`ALTER TABLE "place-to-payment-system"
			DROP CONSTRAINT "FK_32e645817c9474d3ed8936302f0"`);
		await queryRunner.query(`ALTER TABLE "place-to-payment-system"
			DROP CONSTRAINT "FK_44868f6f79d7c9b0d731268632f"`);
		await queryRunner.query(`ALTER TABLE "companies"
			DROP CONSTRAINT "FK_652da5b265918d45aaba9d3a3a1"`);
		await queryRunner.query(`ALTER TABLE "companies"
			DROP CONSTRAINT "FK_6dcdcbb7d72f64602307ec4ab39"`);
		await queryRunner.query(`ALTER TABLE "history-orders"
			DROP CONSTRAINT "FK_8ebd894715a1d9e2498ad4dc35d"`);
		await queryRunner.query(`ALTER TABLE "active-orders"
			DROP CONSTRAINT "FK_496b404172bafbed425adfbdf33"`);
		await queryRunner.query(`ALTER TABLE "active-orders"
			DROP CONSTRAINT "FK_d611326eb42a42f612092001cc6"`);
		await queryRunner.query(`ALTER TABLE "product-to-order"
			DROP CONSTRAINT "FK_f47df4c488f7afc9cd6eb85cc89"`);
		await queryRunner.query(`ALTER TABLE "product-to-order"
			DROP CONSTRAINT "FK_6d5f0627bf0249b032ad2521e9b"`);
		await queryRunner.query(`ALTER TABLE "product-to-order"
			DROP CONSTRAINT "FK_92934ebf36486f00cb614792b37"`);
		await queryRunner.query(`ALTER TABLE "attribute-to-product"
			DROP CONSTRAINT "FK_05291f29bd37332972a879d0364"`);
		await queryRunner.query(`ALTER TABLE "attribute-to-product"
			DROP CONSTRAINT "FK_b56ea1388e0d6be45a2e67cec1c"`);
		await queryRunner.query(`ALTER TABLE "tables"
			DROP CONSTRAINT "FK_2d33a59f73cf02375ddabee1316"`);
		await queryRunner.query(`ALTER TABLE "tables"
			DROP CONSTRAINT "FK_2fb8e7945ebe0f19d64ec38a46f"`);
		await queryRunner.query(`ALTER TABLE "halls"
			DROP CONSTRAINT "FK_a0870c696a08727f3fe8ca38d0e"`);
		await queryRunner.query(`ALTER TABLE "halls"
			DROP CONSTRAINT "FK_67ae0051bb5961c50a48f65f7d1"`);
		await queryRunner.query(`ALTER TABLE "commands"
			DROP CONSTRAINT "FK_ca9d3509b09680dcb3aabbb9cd2"`);
		await queryRunner.query(`ALTER TABLE "attributes"
			DROP CONSTRAINT "FK_09d0fb006462168ca3900c10491"`);
		await queryRunner.query(`ALTER TABLE "attribute-groups"
			DROP CONSTRAINT "FK_f4c592aa81c81622c5385a5cd63"`);
		await queryRunner.query(`ALTER TABLE "products"
			DROP CONSTRAINT "FK_d6408dea56eea4f9cd8ee7e45e6"`);
		await queryRunner.query(`ALTER TABLE "products"
			DROP CONSTRAINT "FK_ff56834e735fa78a15d0cf21926"`);
		await queryRunner.query(`ALTER TABLE "categories"
			DROP CONSTRAINT "FK_36c4778d5a9b6f7368973d053a7"`);
		await queryRunner.query(`ALTER TABLE "categories"
			DROP CONSTRAINT "FK_7f85b26b7d374aa8a305235d32d"`);
		await queryRunner.query(`DROP INDEX "public"."IDX_9e4724615997a85fc8f91e8a24"`);
		await queryRunner.query(`DROP INDEX "public"."IDX_92f1b8856fa52391edc4e44a85"`);
		await queryRunner.query(`DROP TABLE "active-shifts_tables_tables"`);
		await queryRunner.query(`DROP INDEX "public"."IDX_8bf54ca18a904af6ed6de32dc1"`);
		await queryRunner.query(`DROP INDEX "public"."IDX_52c2cdd8d47045aecdf3d03aac"`);
		await queryRunner.query(`DROP TABLE "active-orders_waiters_users"`);
		await queryRunner.query(`DROP INDEX "public"."IDX_1850acac05948e82573f67a750"`);
		await queryRunner.query(`DROP INDEX "public"."IDX_58e7b92afd1331e10f42e48b2c"`);
		await queryRunner.query(`DROP TABLE "active-orders_users_users"`);
		await queryRunner.query(`DROP INDEX "public"."IDX_80251df37496acbfbc31cd50d2"`);
		await queryRunner.query(`DROP INDEX "public"."IDX_ddf5a3d4e918ad912305454fe7"`);
		await queryRunner.query(`DROP TABLE "attribute-groups_attributes_attributes"`);
		await queryRunner.query(`DROP INDEX "public"."IDX_309edc0cf3cf334f1a1100233e"`);
		await queryRunner.query(`DROP INDEX "public"."IDX_ae3408b36bffbfb36168fb248a"`);
		await queryRunner.query(`DROP TABLE "products_attrs_groups_attribute-groups"`);
		await queryRunner.query(`DROP TABLE "history-shifts"`);
		await queryRunner.query(`DROP TABLE "active-shifts"`);
		await queryRunner.query(`DROP TABLE "languages"`);
		await queryRunner.query(`DROP TABLE "place-to-accounting-system"`);
		await queryRunner.query(`DROP TABLE "places"`);
		await queryRunner.query(`DROP TYPE "public"."places_verificationstatus_enum"`);
		await queryRunner.query(`DROP TYPE "public"."places_status_enum"`);
		await queryRunner.query(`DROP TABLE "user-to-place"`);
		await queryRunner.query(`DROP TYPE "public"."user-to-place_role_enum"`);
		await queryRunner.query(`DROP TABLE "place-to-payment-system"`);
		await queryRunner.query(`DROP TABLE "payment-systems"`);
		await queryRunner.query(`DROP TABLE "companies"`);
		await queryRunner.query(`DROP TYPE "public"."companies_status_enum"`);
		await queryRunner.query(`DROP TABLE "users"`);
		await queryRunner.query(`DROP TYPE "public"."users_status_enum"`);
		await queryRunner.query(`DROP TYPE "public"."users_theme_enum"`);
		await queryRunner.query(`DROP TYPE "public"."users_role_enum"`);
		await queryRunner.query(`DROP TABLE "history-orders"`);
		await queryRunner.query(`DROP TYPE "public"."history-orders_status_enum"`);
		await queryRunner.query(`DROP TYPE "public"."history-orders_type_enum"`);
		await queryRunner.query(`DROP TABLE "active-orders"`);
		await queryRunner.query(`DROP TYPE "public"."active-orders_status_enum"`);
		await queryRunner.query(`DROP TYPE "public"."active-orders_type_enum"`);
		await queryRunner.query(`DROP TABLE "product-to-order"`);
		await queryRunner.query(`DROP TYPE "public"."product-to-order_paidstatus_enum"`);
		await queryRunner.query(`DROP TYPE "public"."product-to-order_status_enum"`);
		await queryRunner.query(`DROP TABLE "attribute-to-product"`);
		await queryRunner.query(`DROP TABLE "tables"`);
		await queryRunner.query(`DROP TABLE "halls"`);
		await queryRunner.query(`DROP TABLE "commands"`);
		await queryRunner.query(`DROP TABLE "attributes"`);
		await queryRunner.query(`DROP TABLE "attribute-groups"`);
		await queryRunner.query(`DROP TYPE "public"."attribute-groups_type_enum"`);
		await queryRunner.query(`DROP TABLE "products"`);
		await queryRunner.query(`DROP TABLE "categories"`);
		await queryRunner.query(`DROP TABLE "files"`);
		await queryRunner.query(`DROP TABLE "accounting-systems"`);
	}
}
