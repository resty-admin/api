import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { ActiveOrderEntity } from "../../orders/entities";
import { getFindOptionsByFilters } from "../../shared";
import type { PaginationArgsDto } from "../../shared/dtos";
import { OrderStatusEnum } from "../../shared/enums";
import type { CreateHallInput, UpdateHallInput } from "../dtos";
import { HallEntity } from "../entities";

@Injectable()
export class HallsService {
	private findRelations = ["place", "tables", "file"];
	private findOneRelations = ["place", "tables", "file"];

	constructor(
		@InjectRepository(HallEntity) private readonly _hallsRepository: Repository<HallEntity>,
		@InjectRepository(ActiveOrderEntity) private readonly _ordersRepository: Repository<ActiveOrderEntity>
	) {}

	async getHall(id: string) {
		return this._hallsRepository.findOne({
			where: { id },
			relations: this.findOneRelations
		});
	}

	async getHalls({ take, skip, filtersArgs }: PaginationArgsDto) {
		const findOptions = getFindOptionsByFilters(filtersArgs) as any;

		const [data, count] = await this._hallsRepository.findAndCount({
			where: findOptions.where,
			relations: this.findRelations,
			order: {
				orderNumber: "ASC"
			},
			take,
			skip
		});

		return {
			data,
			totalCount: count,
			page: skip / take + 1
		};
	}

	async createHall(hall: CreateHallInput): Promise<HallEntity> {
		const savedHall = await this._hallsRepository.save({ ...hall, place: { id: hall.place } });

		return this._hallsRepository.findOne({
			where: { id: savedHall.id }
		});
	}

	async updateHall(id: string, hall: UpdateHallInput): Promise<HallEntity> {
		this._hallsRepository.save({ id, ...hall });

		return this._hallsRepository.findOne({
			where: { id },
			relations: this.findOneRelations
		});
	}

	async deleteHall(id: string): Promise<string> {
		const orders: ActiveOrderEntity[] = await this._ordersRepository.find({
			where: {
				table: {
					hall: { id }
				}
			},
			relations: ["table", "table.hall"]
		});

		const isActiveOrdersPresent = orders.some((el) => el.status !== OrderStatusEnum.CLOSED);

		if (isActiveOrdersPresent) {
			await this._hallsRepository.save({ id, isHide: true });

			return `Hall is using in active order(s). Hall will be hide for now`;
		}

		await this._hallsRepository.delete(id);
		return `${id} deleted`;
	}
}
