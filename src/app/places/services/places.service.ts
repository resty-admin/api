import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { GraphQLError } from "graphql/error";
import { Repository } from "typeorm";

import { CompanyEntity } from "../../companies/entities";
import { getFindOptionsByFilters } from "../../shared";
import type { FiltersArgsDto, PaginationArgsDto } from "../../shared/dtos";
import { ErrorsEnum, OrderStatusEnum, PlaceVerificationStatusEnum, UserRoleEnum } from "../../shared/enums";
import type { IUser } from "../../shared/interfaces";
import { UserEntity } from "../../users/entities";
import type { CreatePlaceInput, UpdatePlaceInput, UserToPlaceInput } from "../dtos";
import { PlaceEntity, UserToPlaceEntity } from "../entities";

@Injectable()
export class PlacesService {
	private findRelations = [
		"company",
		"company.owner",
		// "employees",
		"halls",
		"file",
		"usersToPlaces",
		// "guests",
		"paymentSystems",
		"paymentSystems.paymentSystem"
	];

	private findOneRelations = [
		"company",
		"company.owner",
		// "employees",
		"halls",
		"file",
		"usersToPlaces",
		// "guests",
		"paymentSystems",
		"paymentSystems.paymentSystem"
	];

	constructor(
		@InjectRepository(PlaceEntity) private readonly _placesRepository: Repository<PlaceEntity>,
		@InjectRepository(CompanyEntity) private readonly _companiesRepository: Repository<CompanyEntity>,
		@InjectRepository(UserEntity) private readonly _usersRepository: Repository<UserEntity>,
		@InjectRepository(UserToPlaceEntity) private readonly _uTpRepository: Repository<UserToPlaceEntity>
	) {}

	async getPlace(id: string, filtersArgs?: FiltersArgsDto[]) {
		const findOptions = filtersArgs?.length > 0 ? getFindOptionsByFilters(filtersArgs) : ([] as any);

		return this._placesRepository.findOne({
			where: {
				id,
				...findOptions.where
			},
			relations: this.findOneRelations
		});
	}

	// async getPlaceGuests(id: string, { take, skip, filtersArgs }: PaginationArgsDto) {
	// 	const findOptions = filtersArgs?.length > 0 ? getFindOptionsByFilters(filtersArgs) : ([] as any);
	//
	// 	const [data, count] = await this._usersRepository.findAndCount({
	// 		where: {
	// 			placesGuest: {
	// 				id
	// 			},
	// 			...findOptions.where
	// 		},
	// 		relations: ["place", "placesGuest"],
	// 		take,
	// 		skip
	// 	});
	//
	// 	return {
	// 		data,
	// 		totalCount: count,
	// 		page: skip / take + 1
	// 	};
	// }

	async getPlaces({ take, skip, filtersArgs }: PaginationArgsDto, user: IUser) {
		const findOptions = getFindOptionsByFilters(filtersArgs) as any;

		const [data, count] = await this._placesRepository.findAndCount({
			where: {
				...findOptions.where,
				...(user.role === UserRoleEnum.ADMIN
					? {}
					: user.role === UserRoleEnum.CLIENT
					? {
							verificationStatus: PlaceVerificationStatusEnum.VERIFIED
					  }
					: user.role === UserRoleEnum.MANAGER
					? {
							company: {
								owner: {
									id: user.id
								}
							}
					  }
					: {
							usersToPlaces: {
								user: {
									id: user.id
								}
							}
					  })
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

	async getUserToPlace({ take, skip, filtersArgs }: PaginationArgsDto) {
		const findOptions = getFindOptionsByFilters(filtersArgs) as any;

		const [data, count] = await this._uTpRepository.findAndCount({
			where: {
				...findOptions.where
			},
			relations: ["user", "place"],
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
		const waiterCode = Math.floor(1000 + Math.random() * 9000);
		const savedPlace = await this._placesRepository.save({ ...place, waiterCode, company: { id: place.company } });

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

	async addUserToPlace(data: UserToPlaceInput) {
		const place = await this._placesRepository.findOne({
			where: {
				id: data.place
			}
		});

		const user = await this._usersRepository.findOne({ where: { id: data.user } });

		return this._uTpRepository.save({ role: data.role, place, user });
	}

	// async addEmployeeToPlace(employee: AddEmployeeInput) {
	// 	const place = await this._placesRepository.findOne({
	// 		where: {
	// 			id: employee.placeId
	// 		},
	// 		relations: ["employees"]
	// 	});
	//
	// 	const user = await this._usersRepository.findOne({ where: { id: employee.userId } });
	//
	// 	return this._placesRepository.save({ ...place, employees: [...(place.employees || []), { ...user }] });
	// }

	async addWaiterToPlace(code: number, user: IUser) {
		const place = await this._placesRepository.findOne({
			where: {
				waiterCode: code
			}
		});

		if (!place) {
			throw new GraphQLError(ErrorsEnum.InvalidWaiterCode.toString(), {
				extensions: {
					code: 500
				}
			});
		}

		const waiterExist = await this._uTpRepository.findOne({
			where: {
				user: {
					id: user.id
				},
				place: {
					id: place.id
				}
			},
			relations: ["place", "user"]
		});

		if (waiterExist) {
			return waiterExist;
		}

		const userEntity = await this._usersRepository.findOne({ where: { id: user.id } });
		return this._uTpRepository.save({ user: userEntity, place, role: UserRoleEnum.WAITER });
	}

	async removeUserFromPlace(utpId: string) {
		await this._uTpRepository.delete(utpId);
		return `${utpId} deleted`;
	}

	async updatePlaceVerification(placeId: string, status: PlaceVerificationStatusEnum, user: IUser) {
		if (user.role === UserRoleEnum.MANAGER && status === PlaceVerificationStatusEnum.VERIFIED) {
			throw new GraphQLError(ErrorsEnum.Forbidden.toString(), {
				extensions: {
					code: 500
				}
			});
		}
		const place: PlaceEntity = await this._placesRepository.findOne({
			where: {
				id: placeId
			}
		});

		return this._placesRepository.save({ ...place, verificationStatus: status });
	}
}
