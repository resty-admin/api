import { Field, InputType, Int, ObjectType } from "@nestjs/graphql";
import { Exclude } from "class-transformer";
import { Column, Entity, ManyToMany, OneToMany } from "typeorm";

import { CompanyEntity } from "../../companies/entities";
import { ActiveOrderEntity } from "../../orders/entities";
import { BaseEntity } from "../../shared";
import { Pagination } from "../../shared/entities/pagination.type";
import { ThemeEnum, UserRoleEnum, UserStatusEnum } from "../../shared/enums";
import type { IUser } from "../../shared/interfaces";
import { USERS } from "../constant";

@ObjectType()
@InputType("UserEntityInput")
@Entity({ name: USERS })
export class UserEntity extends BaseEntity implements IUser {
	@Column({ default: "" })
	@Field(() => String)
	name: string;

	@Column("enum", { enum: UserRoleEnum, default: UserRoleEnum.CLIENT })
	@Field(() => UserRoleEnum)
	role: UserRoleEnum;

	// @ManyToOne(() => LanguageEntity)
	// language: ILanguage;

	@Column("enum", { enum: ThemeEnum, default: ThemeEnum.LIGHT })
	@Field(() => ThemeEnum)
	theme: ThemeEnum;

	@Column({ unique: true, nullable: true })
	@Field(() => String, { nullable: true })
	email?: string;

	@Column({ unique: true, nullable: true })
	@Field(() => String, { nullable: true })
	googleId?: string;

	@Column("bigint", { unique: true, nullable: true })
	@Field(() => Int, { nullable: true })
	telegramId?: number;

	@Column({ unique: true, nullable: true })
	@Field(() => String, { nullable: true })
	telegramToken?: string;

	@Column({ unique: true, nullable: true })
	@Field(() => String, { nullable: true })
	tel?: string;

	@Column("int", { nullable: true })
	@Field(() => Int, { nullable: true })
	verificationCode?: number;

	@Column("enum", { enum: UserStatusEnum, default: UserStatusEnum.NOT_VERIFIED })
	@Field(() => UserStatusEnum)
	status: UserStatusEnum;

	@Column({ default: "", nullable: true })
	@Field(() => String, { nullable: true })
	@Exclude({ toPlainOnly: true })
	password?: string;

	// @ApiProperty()
	@Field(() => [ActiveOrderEntity], { nullable: true })
	@ManyToMany(() => ActiveOrderEntity, (order) => order.users, { nullable: true })
	orders?: ActiveOrderEntity[];

	// @Field(() => PlaceEntity, { nullable: true })
	// @ManyToOne(() => PlaceEntity, (place) => place.employees, { nullable: true })
	// place?: PlaceEntity;

	@Field(() => CompanyEntity, { nullable: true })
	@OneToMany(() => CompanyEntity, (company) => company.employees, { nullable: true })
	companies?: CompanyEntity;

	// @Field(() => [PlaceEntity], { nullable: true })
	// @ManyToMany(() => PlaceEntity, { nullable: true })
	// @JoinTable()
	// placesGuest?: PlaceEntity[];
}

@ObjectType()
export class PaginatedUser extends Pagination(UserEntity) {}
