import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import type { IUser } from "src/app/shared/interfaces";
import { Repository } from "typeorm";
import type { FindOptionsWhere } from "typeorm/find-options/FindOptionsWhere";

import { getFiltersByUrl, getFindOptionsByFilters } from "../../shared";
import type { PaginationArgsDto } from "../../shared/dtos";
import { UserEntity } from "../entities";

@Injectable()
export class UsersService {
	constructor(@InjectRepository(UserEntity) private readonly _userRepository: Repository<UserEntity>) {}

	async getUser(where: FindOptionsWhere<UserEntity> | FindOptionsWhere<UserEntity>[]) {
		return this._userRepository.findOne({ where });
	}

	async getUsers({ take, skip, filtersString }: PaginationArgsDto) {
		const filters = getFiltersByUrl(filtersString);
		const findOptions = getFindOptionsByFilters(filters) as any;

		const [data, count] = await this._userRepository.findAndCount({
			where: findOptions.where,
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
			return await this._userRepository.save({ id, ...user });
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
