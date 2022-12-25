import { HttpService } from "@nestjs/axios";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { CommandsEvents } from "src/app/shared/events";

import { GatewaysService } from "../../gateways/services";
import { getFiltersByUrl, getFindOptionsByFilters } from "../../shared";
import type { PaginationArgsDto } from "../../shared/dtos";
import { TablesService } from "../../tables/services";
import type { CreateCommandDto, UpdateCommandDto } from "../dtos";
import { CommandEntity } from "../entities";

@Injectable()
export class CommandsService {
	constructor(
		@InjectRepository(CommandEntity) private readonly _commandsRepository,
		private readonly _tablesService: TablesService,
		private readonly _httpService: HttpService,
		private readonly _gatewaysService: GatewaysService
	) {}

	async emitCommand(body: any) {
		const { id, table } = body;
		const command = await this._commandsRepository.findOneById(id);
		const tableEntity = await this._tablesService.getTable(table);

		this._gatewaysService.emitEvent(CommandsEvents, { command, table: tableEntity });
	}

	async getCommand(id: string) {
		return this._commandsRepository.findOne({
			where: { id }
		});
	}

	async getCommands({ take, skip, filtersString }: PaginationArgsDto) {
		const filters = getFiltersByUrl(filtersString);
		const findOptions = getFindOptionsByFilters(filters) as any;

		const [data, count] = await this._commandsRepository.findAndCount({
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

	async createCommand(command: CreateCommandDto): Promise<CommandEntity> {
		const savedCommand = await this._commandsRepository.save(command);

		return this._commandsRepository.findOne({
			where: { id: savedCommand.id }
		});
	}

	async updateCommand(id: string, user: UpdateCommandDto): Promise<CommandEntity> {
		return this._commandsRepository.save({ id, ...user });
	}

	async deleteCommand(id: string): Promise<string> {
		await this._commandsRepository.delete(id);
		return "DELETED";
	}
}
