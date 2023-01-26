import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";

import { CompanyEntity } from "../../companies/entities";
import { getFindOptionsByFilters } from "../../shared";
import type { PaginationArgsDto } from "../../shared/dtos";
import type { PlaceVerificationStatusEnum } from "../../shared/enums";
import { OrderStatusEnum, UserRoleEnum } from "../../shared/enums";
import type { IUser } from "../../shared/interfaces";
import { UserEntity } from "../../users/entities";
import type { CreatePlaceInput, UpdatePlaceInput } from "../dtos";
import type { AddEmployeeInput } from "../dtos/add-employee.dto";
import { PlaceEntity } from "../entities";

@Injectable()
export class PlacesService {
	private findRelations = [
		"company",
		"company.owner",
		"employees",
		"halls",
		"file",
		"paymentSystems",
		"paymentSystems.paymentSystem"
	];

	private findOneRelations = [
		"company",
		"company.owner",
		"employees",
		"halls",
		"file",
		"paymentSystems",
		"paymentSystems.paymentSystem"
	];

	constructor(
		@InjectRepository(PlaceEntity) private readonly _placesRepository,
		@InjectRepository(CompanyEntity) private readonly _companiesRepository,
		@InjectRepository(UserEntity) private readonly _usersRepository
	) {}

	async getPlace(id: string) {
		return this._placesRepository.findOne({
			where: { id },
			relations: this.findOneRelations
		});
	}

	async getPlaces({ take, skip, filtersArgs }: PaginationArgsDto, user: IUser) {
		const findOptions = getFindOptionsByFilters(filtersArgs) as any;

		const [data, count] = await this._placesRepository.findAndCount({
			where: {
				...findOptions.where,
				...(user.role !== UserRoleEnum.ADMIN && user.role !== UserRoleEnum.CLIENT
					? {
							company: {
								owner: {
									id: user.id
								}
							}
					  }
					: {})
			},
			relations: this.findRelations,
			take,
			skip
		});

		return {
			data,
			totalCount: count,
			page: skip / take + 1
		};
	}

	async createPlace(place: CreatePlaceInput): Promise<PlaceEntity> {
		const savedPlace = await this._placesRepository.save({ ...place, company: { id: place.company } });

		return this._placesRepository.findOne({ where: { id: savedPlace.id } });
	}

	async updatePlace(id: string, place: UpdatePlaceInput): Promise<PlaceEntity> {
		await this._placesRepository.save({ id, ...place });

		return this._placesRepository.findOne({ where: { id }, relations: this.findOneRelations });
	}

	async deletePlace(id: string): Promise<string> {
		const place: PlaceEntity = await this._placesRepository.findOne({
			where: { id },
			relations: [...this.findOneRelations, "orders"]
		});

		const isActiveOrdersPresent = place.orders.some((el) => el.status !== OrderStatusEnum.CLOSED);

		if (isActiveOrdersPresent) {
			await this._placesRepository.save({ ...place, isHide: true });

			return `${place.name} is having active order(s). Place will be hide for now`;
		}

		await this._placesRepository.delete(id);
		return `${id} deleted`;
	}

	async addEmployeeToPlace(employee: AddEmployeeInput) {
		const place = await this._placesRepository.findOne({
			where: {
				id: employee.placeId
			},
			relations: ["employees"]
		});

		const user = await this._usersRepository.findOne({ where: { id: employee.userId } });

		return this._placesRepository.save({ ...place, employees: [...(place.employees || []), { ...user }] });
	}

	async removeEmployeeFromPlace(employee: AddEmployeeInput) {
		const place = await this._placesRepository.findOne({
			where: {
				id: employee.placeId
			},
			relations: ["employees"]
		});

		return this._placesRepository.save({
			...place,
			employees: place.employees.filter((el) => el.id !== employee.userId)
		});
	}

	async updatePlaceVerification(placeId: string, status: PlaceVerificationStatusEnum) {
		const place: PlaceEntity = await this._placesRepository.findOne({
			where: {
				id: placeId
			}
		});

		return this._placesRepository.save({ ...place, verificationStatus: status });
	}
}
