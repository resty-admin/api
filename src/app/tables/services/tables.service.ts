import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";

import { getFindOptionsByFilters } from "../../shared/crud";
import type { PaginationArgsDto } from "../../shared/dtos";
import type { CreateTableDto, UpdateTableDto } from "../dtos";
import type { CreateTableInput, UpdateTableInput } from "../dtos";
import { TableEntity } from "../entities";

@Injectable()
export class TablesService {
	private findRelations = ["hall", "orders", "file"];
	private findOneRelations = ["hall", "orders", "file"];

	constructor(@InjectRepository(TableEntity) private readonly _tablesRepository) {}

	async getTable(id: string) {
		return this._tablesRepository.findOne({
			where: { id },
			relations: this.findOneRelations
		});
	}

	async getTables({ take, skip, filtersArgs }: PaginationArgsDto) {
		const findOptions = getFindOptionsByFilters(filtersArgs) as any;

		const [data, count] = await this._tablesRepository.findAndCount({
			where: findOptions.where,
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

	async createTable(table: CreateTableDto | CreateTableInput): Promise<TableEntity> {
		const savedTable = await this._tablesRepository.save({ ...table, hall: { id: table.hall } });

		return this._tablesRepository.findOne({
			where: { id: savedTable.id }
		});
	}

	async updateTable(id: string, table: UpdateTableDto | UpdateTableInput): Promise<TableEntity> {
		await this._tablesRepository.save({ id, ...table });

		return this._tablesRepository.findOne({
			where: { id },
			relations: this.findOneRelations
		});
	}

	async deleteTable(id: string): Promise<string> {
		await this._tablesRepository.delete(id);
		return `${id} deleted`;
	}
}
