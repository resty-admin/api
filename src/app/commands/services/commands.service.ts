import { HttpService } from "@nestjs/axios";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";

import { COMMAND_EMITTED } from "../../gateways/events";
import { GatewaysService } from "../../gateways/services";
import { ActiveOrderEntity } from "../../orders/entities";
import { getFindOptionsByFilters } from "../../shared";
import type { PaginationArgsDto } from "../../shared/dtos";
import { ActiveShiftEntity } from "../../shifts/entities";
import { TablesService } from "../../tables/services";
import type { CreateCommandInput, UpdateCommandInput } from "../dtos";
import { CommandEntity } from "../entities";

@Injectable()
export class CommandsService {
	constructor(
		@InjectRepository(CommandEntity) private readonly _commandsRepository,
		@InjectRepository(ActiveOrderEntity) private readonly _ordersRepository,
		@InjectRepository(ActiveShiftEntity) private readonly _shiftsRepository,
		private readonly _tablesService: TablesService,
		private readonly _httpService: HttpService,
		private readonly _gatewaysService: GatewaysService
	) {}

	async emitCommand(commandId: string, tableId: string) {
		const command = await this._commandsRepository.findOne({ where: { id: commandId } });
		const waiters = [];

		const shifts: ActiveShiftEntity[] = await this._shiftsRepository.find({
			where: {
				tables: {
					id: tableId
				}
			},
			relations: ["waiter", "tables"]
		});

		const table = shifts[0].tables.find((el) => el.id === tableId);

		for (const shift of shifts) {
			waiters.push(shift.waiter);
		}

		this._gatewaysService.emitEvent(COMMAND_EMITTED, { command, table, waiters });

		return "emitted";
	}

	async getCommand(id: string) {
		return this._commandsRepository.findOne({
			where: { id }
		});
	}

	async getCommands({ take, skip, filtersArgs }: PaginationArgsDto) {
		const findOptions = getFindOptionsByFilters(filtersArgs) as any;

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

	async createCommand(command: CreateCommandInput): Promise<CommandEntity> {
		const savedCommand = await this._commandsRepository.save(command);

		return this._commandsRepository.findOne({
			where: { id: savedCommand.id }
		});
	}

	async updateCommand(id: string, command: UpdateCommandInput): Promise<CommandEntity> {
		return this._commandsRepository.save({ id, ...command });
	}

	async deleteCommand(id: string): Promise<string> {
		await this._commandsRepository.delete(id);
		return "DELETED";
	}
}
