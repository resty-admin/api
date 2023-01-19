import { Field, ObjectType } from "@nestjs/graphql";
import { Column, Entity } from "typeorm";

import { BaseEntity } from "../../shared";
import { Pagination } from "../../shared/entities/pagination.type";
import { ACCOUNTING_SYSTEMS } from "../constant";

@ObjectType()
@Entity({ name: ACCOUNTING_SYSTEMS })
export class AccountingSystemEntity extends BaseEntity {
	@Field(() => String)
	@Column()
	name: string;
}

@ObjectType()
export class PaginatedAccountingSystem extends Pagination(AccountingSystemEntity) {}
