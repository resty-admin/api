import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { getFindOptionsByFilters } from "../../shared";
import type { PaginationArgsDto } from "../../shared/dtos";
import type { CreateAccountingSystemInput } from "../dtos";
import type { UpdateAccountingSystemInput } from "../dtos";
import type { ConnectAccountingSystemToPlaceInput } from "../dtos";
import { AccountingSystemEntity, PlaceToAccountingSystemEntity } from "../entities";

@Injectable()
export class AccountingSystemsService {
	constructor(
		@InjectRepository(AccountingSystemEntity)
		private readonly _accountingSystemRepository: Repository<AccountingSystemEntity>,
		@InjectRepository(PlaceToAccountingSystemEntity)
		private readonly _pTa: Repository<PlaceToAccountingSystemEntity>
	) {}

	async getAccountingSystem(id: string) {
		return this._accountingSystemRepository.findOne({
			where: { id }
		});
	}

	async getAccountingSystems({ take, skip, filtersArgs }: PaginationArgsDto) {
		const findOptions = getFindOptionsByFilters(filtersArgs) as any;

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

	async creatAccountingSystem(accountingSystemDto: CreateAccountingSystemInput): Promise<AccountingSystemEntity> {
		const savedOrder = await this._accountingSystemRepository.save(accountingSystemDto);

		return this._accountingSystemRepository.findOne({
			where: { id: savedOrder.id }
		});
	}

	async updateAccountingSystem(accountingSystemDto: UpdateAccountingSystemInput): Promise<AccountingSystemEntity> {
		return this._accountingSystemRepository.save({ ...accountingSystemDto });
	}

	async deleteAccountingSystem(id: string): Promise<string> {
		await this._accountingSystemRepository.delete(id);
		return "DELETED";
	}

	async connectAccountingSystemToPlace(body: ConnectAccountingSystemToPlaceInput) {
		const currPta = await this._pTa.findOne({
			where: {
				place: {
					id: body.place.id
				},
				accountingSystem: {
					id: body.accountingSystem.id
				}
			}
		});

		if (currPta) {
			return currPta;
		}

		return this._pTa.save({ ...body });
	}
}
