import { Field, InputType, ObjectType } from "@nestjs/graphql";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne } from "typeorm";

import { AttributesGroupEntity } from "../../attributes/entities";
import { CategoryEntity } from "../../categories/entities";
import { CommandEntity } from "../../commands/entities";
import { CompanyEntity } from "../../companies/entities";
import { FileEntity } from "../../files/entities";
import { HallEntity } from "../../halls/entities";
import { ActiveOrderEntity } from "../../orders/entities";
import { PlaceToPaymentSystemEntity } from "../../payment-systems/entities/place-to-payment-system.entity";
import { BaseEntity } from "../../shared/entities";
import { Pagination } from "../../shared/entities/pagination.type";
import { PlaceStatusEnum, PlaceVerificationStatusEnum } from "../../shared/enums";
import { IFile } from "../../shared/interfaces";
import { UserEntity } from "../../users/entities";
import { PLACES } from "../constant";
import { WorkingHoursDto } from "../dtos";

@ObjectType()
@InputType("PlaceEntityInput")
@Entity({ name: PLACES })
export class PlaceEntity extends BaseEntity {
	@Column()
	@Field(() => String)
	name: string;

	@Field(() => CompanyEntity)
	@ManyToOne(() => CompanyEntity, (company) => company.places, { cascade: true, onDelete: "CASCADE" })
	company: CompanyEntity;

	@Column({ nullable: true })
	@Field(() => String, { nullable: true })
	address?: string;

	@Column("enum", { enum: PlaceStatusEnum, default: PlaceStatusEnum.CLOSED })
	@Field(() => PlaceStatusEnum)
	status: PlaceStatusEnum;

	@Column("enum", { enum: PlaceVerificationStatusEnum, default: PlaceVerificationStatusEnum.NOT_VERIFIED })
	@Field(() => PlaceVerificationStatusEnum)
	verificationStatus: PlaceVerificationStatusEnum;

	@Field(() => [HallEntity])
	@OneToMany(() => HallEntity, (hall) => hall.place)
	halls: HallEntity[];

	@Field(() => [CategoryEntity], { nullable: true })
	@OneToMany(() => CategoryEntity, (category) => category.place, { nullable: true })
	categories?: CategoryEntity[];

	@Field(() => FileEntity, { nullable: true })
	@OneToOne(() => FileEntity, { cascade: true, eager: true, nullable: true })
	@JoinColumn()
	file?: IFile;

	@Field(() => String)
	@Column({
		type: "json",
		default: () => `('${JSON.stringify({ delivery: false, takeaway: true, booking: true, order: true })}')`
	})
	a11y: any;

	@Field(() => String)
	@Column({
		type: "json",
		default: () => `('${JSON.stringify({ start: null, end: null })}')`
	})
	weekDays: WorkingHoursDto;

	@Field(() => String)
	@Column({
		type: "json",
		default: () => `('${JSON.stringify({ start: null, end: null })}')`
	})
	weekendDays: WorkingHoursDto;

	@Field(() => String)
	@Column({
		type: "json",
		default: () => `('${JSON.stringify({})}')`
	})
	holidayDays: Map<Date, WorkingHoursDto>;

	@OneToMany(() => AttributesGroupEntity, (attrGroups) => attrGroups.place, { nullable: true })
	@Field(() => [AttributesGroupEntity])
	attrGroups?: AttributesGroupEntity[];

	@Field(() => [ActiveOrderEntity], { nullable: true })
	@OneToMany(() => ActiveOrderEntity, (order) => order.place, { nullable: true })
	orders?: ActiveOrderEntity[];

	@Field(() => [CommandEntity], { nullable: true })
	@OneToMany(() => CommandEntity, (command) => command.place, { nullable: true })
	commands?: CommandEntity[];

	@Field(() => [UserEntity], { nullable: true })
	@OneToMany(() => UserEntity, (user) => user.place, { nullable: true })
	employees?: UserEntity[];

	@Field(() => Boolean)
	@Column("boolean", { default: false })
	isHide: boolean;

	@Field(() => [PlaceToPaymentSystemEntity], { nullable: true })
	@OneToMany(() => PlaceToPaymentSystemEntity, (pTp) => pTp.place, { nullable: true })
	paymentSystems: PlaceToPaymentSystemEntity[];
}

@ObjectType()
export class PaginatedPlace extends Pagination(PlaceEntity) {}
