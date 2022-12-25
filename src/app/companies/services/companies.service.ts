import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { getFiltersByUrl, getFindOptionsByFilters } from "../../shared/crud";
import type { PaginationArgsDto } from "../../shared/dtos";
import type { IUser } from "../../shared/interfaces";
import type { CreateCompanyDto, UpdateCompanyDto } from "../dtos";
import type { CreateCompanyInput, UpdateCompanyInput } from "../dtos";
import { CompanyEntity } from "../entities";

@Injectable()
export class CompaniesService {
	private findRelations = ["owner", "places", "logo"];
	private findOneRelations = ["owner", "places", "logo"];

	constructor(@InjectRepository(CompanyEntity) private readonly _companiesRepository: Repository<CompanyEntity>) {}

	async getCompany(id: string) {
		return this._companiesRepository.findOne({
			where: { id },
			relations: this.findOneRelations
		});
	}

	async getCompanies({ take, skip, filtersString }: PaginationArgsDto) {
		const filters = getFiltersByUrl(filtersString);
		const findOptions = getFindOptionsByFilters(filters) as any;

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

	async createCompany(company: CreateCompanyDto | CreateCompanyInput, user: IUser): Promise<CompanyEntity> {
		const savedCompany = await this._companiesRepository.save({ ...company, owner: { id: user.id } });

		return this._companiesRepository.findOne({
			where: { id: savedCompany.id }
		});
	}

	async updateCompany(id: string, company: UpdateCompanyDto | UpdateCompanyInput): Promise<CompanyEntity> {
		return this._companiesRepository.save({
			...company,
			id,
			...(company.employees?.length > 0 && { employees: company.employees.map((el) => ({ id: el })) })
			// employees: [...company.employees?.map((el) => ({ id: el }))]
		});
	}

	async deleteCompany(id: string): Promise<string> {
		await this._companiesRepository.delete(id);
		return `${id} deleted`;
	}
}
