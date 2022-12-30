import { Field, InputType, ObjectType } from "@nestjs/graphql";
import { Column, Entity, ManyToOne } from "typeorm";

import { PlaceEntity } from "../../places/entities";
import { BaseEntity } from "../../shared/entities";
import { Pagination } from "../../shared/entities/pagination.type";
import { COMMANDS } from "../constant";

@ObjectType()
@Entity({ name: COMMANDS })
@InputType("CommandEntityInput")
export class CommandEntity extends BaseEntity {
	@Column()
	// @ApiProperty()
	@Field(() => String)
	name: string;

	@ManyToOne(() => PlaceEntity, (place) => place.commands, { cascade: true })
	@Field(() => PlaceEntity)
	// @ApiProperty()
	place: PlaceEntity;
}

@ObjectType()
export class PaginatedCommand extends Pagination(CommandEntity) {}
