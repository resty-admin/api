import { HttpService } from "@nestjs/axios";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { GatewaysService } from "../../gateways/services";
import { ActiveOrderEntity } from "../../orders/entities";
import { OrdersNotificationsService } from "../../orders/services";
import { getFindOptionsByFilters } from "../../shared";
import type { PaginationArgsDto } from "../../shared/dtos";
import { ActiveShiftEntity } from "../../shifts/entities";
import { TablesService } from "../../tables/services";
import type { CreateCommandInput, UpdateCommandInput } from "../dtos";
import { CommandEntity } from "../entities";

@Injectable()
export class CommandsService {
	constructor(
		@InjectRepository(CommandEntity) private readonly _commandsRepository: Repository<CommandEntity>,
		@InjectRepository(ActiveOrderEntity) private readonly _ordersRepository: Repository<ActiveOrderEntity>,
		@InjectRepository(ActiveShiftEntity) private readonly _shiftsRepository: Repository<ActiveShiftEntity>,
		private readonly _ordersNotifications: OrdersNotificationsService,
		private readonly _tablesService: TablesService,
		private readonly _httpService: HttpService,
		private readonly _gatewaysService: GatewaysService
	) {}

	async emitCommand(commandId: string, orderId: string) {
		const command = await this._commandsRepository.findOne({ where: { id: commandId } });
		const waiters = await this._ordersNotifications.buildEmployeesList(orderId);

		const order = await this._ordersRepository.findOne({
			where: { id: orderId },
			relations: ["table"]
		});

		await this._ordersNotifications.emitOrderCommand(orderId, { command, table: order.table, waiters });

		return commandId;
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
		console.log("comand", command);
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
