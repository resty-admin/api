import { Field, InputType, Int, ObjectType } from "@nestjs/graphql";
import { Column, Entity, ManyToOne } from "typeorm";

import { BaseEntity } from "../../shared";
import { Pagination } from "../../shared/entities/pagination.type";
import { UserRoleEnum } from "../../shared/enums";
import { UserEntity } from "../../users/entities";
import { PlaceEntity } from "./place.entity";

@ObjectType()
@InputType("UserToPlaceEntityInput")
@Entity({ name: "user-to-place" })
export class UserToPlaceEntity extends BaseEntity {
	@Field(() => UserEntity)
	@ManyToOne(() => UserEntity, { onDelete: "CASCADE" })
	user: UserEntity;

	@Field(() => PlaceEntity)
	@ManyToOne(() => PlaceEntity, (place) => place.usersToPlaces, { onDelete: "CASCADE" })
	place: PlaceEntity;

	@Field(() => UserRoleEnum)
	@Column("enum", { enum: UserRoleEnum, default: UserRoleEnum.CLIENT })
	role: UserRoleEnum;

	@Field(() => Int)
	@Column("int", { default: 1 })
	visits: number;
}

@ObjectType()
export class PaginatedUserToPlace extends Pagination(UserToPlaceEntity) {}
