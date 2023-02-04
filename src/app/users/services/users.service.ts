import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { GraphQLError } from "graphql/error";
import type { IUser } from "src/app/shared/interfaces";
import type { FindOptionsWhere } from "typeorm";
import { Repository } from "typeorm";

import { getFindOptionsByFilters } from "../../shared";
import type { PaginationArgsDto } from "../../shared/dtos";
import type { FiltersArgsDto } from "../../shared/dtos";
import { ErrorsEnum } from "../../shared/enums";
import { UserEntity } from "../entities";

@Injectable()
export class UsersService {
	constructor(@InjectRepository(UserEntity) private readonly _userRepository: Repository<UserEntity>) {}

	async getUser(where: FindOptionsWhere<UserEntity> | FindOptionsWhere<UserEntity>[], filtersArgs?: FiltersArgsDto[]) {
		const findOptions = filtersArgs?.length > 0 ? getFindOptionsByFilters(filtersArgs) : ([] as any);

		const user = await this._userRepository.findOne({
			where: {
				...(where || []),
				...findOptions.where
			}
		});

		if (!user) {
			throw new GraphQLError(ErrorsEnum.NotFound.toString(), {
				extensions: {
					code: 500
				}
			});
		}

		return user;
	}

	async getUsers({ take, skip, filtersArgs }: PaginationArgsDto) {
		const findOptions = getFindOptionsByFilters(filtersArgs) as any;

		const [data, count] = await this._userRepository.findAndCount({
			where: findOptions.where,
			relations: [],
			take,
			skip
		});

		return {
			data,
			totalCount: count,
			page: skip / take + 1
		};
	}

	async createUser(user: Partial<IUser>): Promise<UserEntity> {
		try {
			const savedUser = await this._userRepository.save(user);

			return await this._userRepository.findOne({ where: { id: savedUser.id } });
		} catch (error) {
			console.error(error);
			throw new InternalServerErrorException();
		}
	}

	async updateUser(id: string, user: Partial<IUser>): Promise<UserEntity> {
		try {
			await this._userRepository.save({ id, ...user });
			return await this._userRepository.findOne({ where: { id }, relations: [] });
		} catch (error) {
			console.error(error);
			throw new InternalServerErrorException();
		}
	}

	async deleteUser(id: string): Promise<string> {
		try {
			await this._userRepository.delete(id);
			return "DELETED";
		} catch (error) {
			console.error(error);
			throw new InternalServerErrorException();
		}
	}
}
