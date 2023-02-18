import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { getFindOptionsByFilters } from "../../shared";
import type { PaginationArgsDto } from "../../shared/dtos";
import type { CreatePaymentSystemInput, UpdatePaymentSystemInput } from "../dtos";
import type { ConnectPaymentSystemToPlaceInput } from "../dtos/connect-payment-system-to-place.dto";
import { PaymentSystemEntity } from "../entities";
import { PlaceToPaymentSystemEntity } from "../entities/place-to-payment-system.entity";

@Injectable()
export class PaymentSystemsService {
	constructor(
		@InjectRepository(PaymentSystemEntity) private readonly _paymentSystemRepository: Repository<PaymentSystemEntity>,
		@InjectRepository(PlaceToPaymentSystemEntity)
		private readonly _paymentSystemToPlaceRepository: Repository<PlaceToPaymentSystemEntity>
	) {}

	async getPaymentSystem(id: string) {
		return this._paymentSystemRepository.findOne({
			where: { id }
		});
	}

	async getPaymentSystems({ take, skip, filtersArgs }: PaginationArgsDto) {
		const findOptions = getFindOptionsByFilters(filtersArgs) as any;

		const [data, count] = await this._paymentSystemRepository.findAndCount({
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

	async creatPaymentSystem(paymentSystemDto: CreatePaymentSystemInput): Promise<PaymentSystemEntity> {
		const savedOrder = await this._paymentSystemRepository.save(paymentSystemDto);

		return this._paymentSystemRepository.findOne({
			where: { id: savedOrder.id }
		});
	}

	async updatePaymentSystem(id: string, paymentSystemDto: UpdatePaymentSystemInput): Promise<PaymentSystemEntity> {
		return this._paymentSystemRepository.save({ id, ...paymentSystemDto });
	}

	async deletePaymentSystem(id: string): Promise<string> {
		await this._paymentSystemRepository.delete(id);
		return "DELETED";
	}

	async connectPaymentSystemToPlace(body: ConnectPaymentSystemToPlaceInput) {
		return this._paymentSystemToPlaceRepository.save({ ...body });
	}
}
