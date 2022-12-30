import { Field, InputType, ObjectType } from "@nestjs/graphql";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne } from "typeorm";

import { AttributesGroupEntity } from "../../attributes/entities";
import { CategoryEntity } from "../../categories/entities";
import { CompanyEntity } from "../../companies/entities";
import { FileEntity } from "../../files/entities";
import { HallEntity } from "../../halls/entities";
import { ActiveOrderEntity } from "../../orders/entities";
import { BaseEntity } from "../../shared/entities";
import { Pagination } from "../../shared/entities/pagination.type";
import { PlaceStatusEnum } from "../../shared/enums";
import { IFile } from "../../shared/interfaces";
import { PLACES } from "../constant";
import { WorkingHoursDto } from "../dtos";

@ObjectType()
@InputType("PlaceEntityInput")
@Entity({ name: PLACES })
export class PlaceEntity extends BaseEntity {
	// @ApiProperty()
	@Column()
	@Field(() => String)
	name: string;

	// @ApiProperty()
	@Field(() => CompanyEntity)
	@ManyToOne(() => CompanyEntity, (company) => company.places, { cascade: true })
	company: CompanyEntity;

	// @ApiProperty()
	@Column({ nullable: true })
	@Field(() => String, { nullable: true })
	address?: string;

	// @ApiProperty()
	@Column("enum", { enum: PlaceStatusEnum, default: PlaceStatusEnum.CLOSED })
	@Field(() => PlaceStatusEnum)
	status: PlaceStatusEnum;

	// @ApiProperty()
	@Field(() => [HallEntity])
	@OneToMany(() => HallEntity, (hall) => hall.place)
	halls: HallEntity[];

	// @ApiProperty()
	@Field(() => [CategoryEntity], { nullable: true })
	@OneToMany(() => CategoryEntity, (category) => category.place, { nullable: true })
	categories?: CategoryEntity[];

	// @ApiProperty()
	@Field(() => FileEntity, { nullable: true })
	@OneToOne(() => FileEntity, { cascade: true, eager: true, nullable: true })
	@JoinColumn()
	file?: IFile;

	// @ApiProperty({ type: "json", default: { delivery: false, takeaway: true, booking: true, order: true } })
	@Field(() => String)
	@Column({
		type: "json",
		default: () => `('${JSON.stringify({ delivery: false, takeaway: true, booking: true, order: true })}')`
	})
	a11y: any;

	// @ApiProperty({ type: "json", default: { start: null, end: null } })
	@Field(() => String)
	@Column({
		type: "json",
		default: () => `('${JSON.stringify({ start: null, end: null })}')`
	})
	weekDays: WorkingHoursDto;

	// @ApiProperty({ type: "json", default: { start: null, end: null } })
	@Field(() => String)
	@Column({
		type: "json",
		default: () => `('${JSON.stringify({ start: null, end: null })}')`
	})
	weekendDays: WorkingHoursDto;

	// @ApiProperty({ type: "json", default: {} })
	@Field(() => String)
	@Column({
		type: "json",
		default: () => `('${JSON.stringify({})}')`
	})
	holidayDays: Map<Date, WorkingHoursDto>;

	@OneToMany(() => AttributesGroupEntity, (attrGroups) => attrGroups.place, { nullable: true })
	@Field(() => [AttributesGroupEntity])
	// @ApiProperty()
	attrGroups?: AttributesGroupEntity[];

	// @ApiProperty()
	@Field(() => [ActiveOrderEntity], { nullable: true })
	@OneToMany(() => ActiveOrderEntity, (order) => order.place, { nullable: true })
	orders?: ActiveOrderEntity[];
}

@ObjectType()
export class PaginatedPlace extends Pagination(PlaceEntity) {}
