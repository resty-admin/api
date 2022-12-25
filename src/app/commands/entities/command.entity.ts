import { Field, ObjectType } from "@nestjs/graphql";
import { Column, Entity } from "typeorm";

import { BaseEntity } from "../../shared/entities";
import { Pagination } from "../../shared/entities/pagination.type";
import { COMMANDS } from "../constant";

@ObjectType()
@Entity({ name: COMMANDS })
export class CommandEntity extends BaseEntity {
	@Column()
	// @ApiProperty()
	@Field(() => String)
	name: string;
}

@ObjectType()
export class PaginatedCommand extends Pagination(CommandEntity) {}
