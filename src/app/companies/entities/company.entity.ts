import { Field, ObjectType } from "@nestjs/graphql";
import { IFile } from "src/app/shared/interfaces";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne } from "typeorm";

import { FileEntity } from "../../files/entities";
import { FondyEntity } from "../../payment-systems/entities/fondy.entity";
import { PlaceEntity } from "../../places/entities";
import { BaseEntity } from "../../shared";
import { Pagination } from "../../shared/entities/pagination.type";
import { UserEntity } from "../../users/entities";
import { COMPANIES } from "../constant";
import { CompanyStatusEnum } from "../enums";

@ObjectType()
@Entity({ name: COMPANIES })
export class CompanyEntity extends BaseEntity {
	// @ApiProperty()
	@Column()
	@Field(() => String)
	name: string;

	// @ApiProperty()
	@ManyToOne(() => UserEntity)
	@JoinColumn()
	@Field(() => UserEntity)
	owner: UserEntity;

	// @ApiProperty()
	@Field(() => [PlaceEntity], { nullable: true })
	@OneToMany(() => PlaceEntity, (places) => places.company, { nullable: true })
	places?: PlaceEntity[];

	// @ApiProperty()
	@Field(() => [UserEntity], { nullable: true })
	@OneToMany(() => UserEntity, (user) => user.company, { nullable: true })
	employees: UserEntity[];

	// @ApiProperty()
	@Column("enum", { enum: CompanyStatusEnum, default: CompanyStatusEnum.PENDING })
	@Field(() => CompanyStatusEnum)
	status: CompanyStatusEnum;

	// @ApiProperty()
	@Field(() => FileEntity, { nullable: true })
	@OneToOne(() => FileEntity, { cascade: true, eager: true, nullable: true })
	@JoinColumn()
	logo?: IFile;

	// @ApiProperty()
	@Field(() => FondyEntity, { nullable: true })
	@OneToOne(() => FondyEntity, { cascade: true, nullable: true })
	@JoinColumn()
	fondy: FondyEntity;
}

@ObjectType()
export class PaginatedCompany extends Pagination(CompanyEntity) {}

// TODO city field?
// TODO owner could be a team-member ?
