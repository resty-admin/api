import { Field, InputType, ObjectType } from "@nestjs/graphql";
import { GraphQLJSONObject } from "graphql-type-json";
import { Column, Entity } from "typeorm";

import { BaseEntity } from "../../shared";
import { Pagination } from "../../shared/entities/pagination.type";
import { ACCOUNTING_SYSTEMS } from "../constant";

@ObjectType()
@InputType("AccountingSystemEntityInput")
@Entity({ name: ACCOUNTING_SYSTEMS })
export class AccountingSystemEntity extends BaseEntity {
	@Field(() => String)
	@Column()
	name: string;

	@Field(() => GraphQLJSONObject, { nullable: true })
	@Column({
		type: "json",
		default: () => `('${JSON.stringify({})}')`,
		nullable: true
	})
	configFields?: object;
}

@ObjectType()
export class PaginatedAccountingSystem extends Pagination(AccountingSystemEntity) {}
