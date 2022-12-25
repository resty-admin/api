import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";

import { getFiltersByUrl, getFindOptionsByFilters } from "../../shared";
import type { PaginationArgsDto } from "../../shared/dtos";
import type { CreateAccountingSystemDto, UpdateAccountingSystemDto } from "../dtos";
import { AccountingSystemEntity } from "../entities";

@Injectable()
export class AccountingSystemsService {
	constructor(@InjectRepository(AccountingSystemEntity) private readonly _accountingSystemRepository) {}

	async getAccountingSystem(id: string) {
		return this._accountingSystemRepository.findOne({
			where: { id }
		});
	}

	async getAccountingSystems({ take, skip, filtersString }: PaginationArgsDto) {
		const filters = getFiltersByUrl(filtersString);
		const findOptions = getFindOptionsByFilters(filters) as any;

		const [data, count] = await this._accountingSystemRepository.findAndCount({
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

	async creatAccountingSystem(accountingSystemDto: CreateAccountingSystemDto): Promise<AccountingSystemEntity> {
		const savedOrder = await this._accountingSystemRepository.save(accountingSystemDto);

		return this._accountingSystemRepository.findOne({
			where: { id: savedOrder.id }
		});
	}

	async updateAccountingSystem(
		id: string,
		accountingSystemDto: UpdateAccountingSystemDto
	): Promise<AccountingSystemEntity> {
		return this._accountingSystemRepository.save({ id, ...accountingSystemDto });
	}

	async deleteAccountingSystem(id: string): Promise<string> {
		await this._accountingSystemRepository.delete(id);
		return "DELETED";
	}
}
