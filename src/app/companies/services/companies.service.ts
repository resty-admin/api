import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";

import { getFindOptionsByFilters } from "../../shared";
import type { PaginationArgsDto } from "../../shared/dtos";
import { OrderStatusEnum } from "../../shared/enums";
import type { IUser } from "../../shared/interfaces";
import type { CreateCompanyInput, UpdateCompanyInput } from "../dtos";
import { CompanyEntity } from "../entities";

@Injectable()
export class CompaniesService {
	private findRelations = ["owner", "places", "logo"];
	private findOneRelations = ["owner", "places", "logo"];

	constructor(@InjectRepository(CompanyEntity) private readonly _companiesRepository) {}

	async getCompany(id: string) {
		return this._companiesRepository.findOne({
			where: { id },
			relations: this.findOneRelations
		});
	}

	async getCompanies({ take, skip, filtersArgs }: PaginationArgsDto) {
		const findOptions = getFindOptionsByFilters(filtersArgs) as any;

		const [data, totalCount] = await this._companiesRepository.findAndCount({
			where: findOptions.where,
			relations: this.findRelations,
			take,
			skip
		});

		return {
			data,
			totalCount,
			page: skip / take + 1
		};
	}

	async createCompany(company: CreateCompanyInput, user: IUser): Promise<CompanyEntity> {
		const savedCompany = await this._companiesRepository.save({ ...company, owner: { id: user.id } });

		return this._companiesRepository.findOne({
			where: { id: savedCompany.id }
		});
	}

	async updateCompany(id: string, company: UpdateCompanyInput): Promise<CompanyEntity> {
		await this._companiesRepository.save({
			...company,
			id,
			...(company.employees?.length > 0 && { employees: company.employees.map((el) => ({ id: el })) })
		});

		return this._companiesRepository.findOne({
			where: { id },
			relations: this.findOneRelations
		});
	}

	async deleteCompany(id: string): Promise<string> {
		const company: CompanyEntity = await this._companiesRepository.findOne({
			where: { id },
			relations: [...this.findOneRelations, "places.commands"]
		});

		const isActiveOrdersPresent = company.places.some((place) =>
			place.orders.some((el) => el.status !== OrderStatusEnum.CLOSED)
		);

		if (isActiveOrdersPresent) {
			await this._companiesRepository.save({ ...company, isHide: true });

			return `Company is having active order(s). Company will be hide for now`;
		}

		await this._companiesRepository.delete(id);
		return `${id} deleted`;
	}
}
