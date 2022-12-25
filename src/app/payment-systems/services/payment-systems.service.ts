import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";

import { getFiltersByUrl, getFindOptionsByFilters } from "../../shared";
import type { PaginationArgsDto } from "../../shared/dtos";
import type { CreatePaymentSystemDto, UpdatePaymentSystemDto } from "../dtos";
import { PaymentSystemEntity } from "../entities";

@Injectable()
export class PaymentSystemsService {
	constructor(@InjectRepository(PaymentSystemEntity) private readonly _paymentSystemRepository) {}

	async getPaymentSystem(id: string) {
		return this._paymentSystemRepository.findOne({
			where: { id }
		});
	}

	async getPaymentSystems({ take, skip, filtersString }: PaginationArgsDto) {
		const filters = getFiltersByUrl(filtersString);
		const findOptions = getFindOptionsByFilters(filters) as any;

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

	async creatPaymentSystem(paymentSystemDto: CreatePaymentSystemDto): Promise<PaymentSystemEntity> {
		const savedOrder = await this._paymentSystemRepository.save(paymentSystemDto);

		return this._paymentSystemRepository.findOne({
			where: { id: savedOrder.id }
		});
	}

	async updatePaymentSystem(id: string, paymentSystemDto: UpdatePaymentSystemDto): Promise<PaymentSystemEntity> {
		return this._paymentSystemRepository.save({ id, ...paymentSystemDto });
	}

	async deletePaymentSystem(id: string): Promise<string> {
		await this._paymentSystemRepository.delete(id);
		return "DELETED";
	}
}
