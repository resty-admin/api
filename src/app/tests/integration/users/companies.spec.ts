import type { INestApplication } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import { TypeOrmModule } from "@nestjs/typeorm";
import type { IUser } from "src/app/shared/interfaces";
// import type { IUser } from "src/app/shared/interfaces";
import type { DataSource } from "typeorm";
import { createConnection } from "typeorm";

import { CompaniesModule } from "../../../companies/companies.module";
import { CompanyEntity } from "../../../companies/entities";
import { CompaniesService } from "../../../companies/services";
import { PlaceEntity } from "../../../places/entities";
import { UsersModule, UsersService } from "../../../users";
import { UserEntity } from "../../../users/entities";
import { configs, typeOrmConfig } from "../../configs/configs";
import { CompaniesMock, UsersMock } from "../../mocks";

describe("Companies module", () => {
	let pgContainer;
	let app: INestApplication;

	let companiesService: CompaniesService;
	let usersService: UsersService;

	const companiesMockData = new CompaniesMock();
	const usersMockData = new UsersMock();

	let connection: DataSource;

	beforeEach(async () => {
		pgContainer = configs();
		pgContainer = await pgContainer.start();

		connection = await createConnection(typeOrmConfig(pgContainer, [CompanyEntity, UserEntity, PlaceEntity]));
		await connection.synchronize();
		await connection.close();
		const module = await Test.createTestingModule({
			imports: [
				CompaniesModule,
				UsersModule,
				TypeOrmModule.forRoot({
					...typeOrmConfig(pgContainer, [CompanyEntity, UserEntity, PlaceEntity])
				})
			],
			controllers: [],
			providers: [CompaniesService, UsersService]
		}).compile();

		app = module.createNestApplication();
		await app.init();

		companiesService = module.get<CompaniesService>(CompaniesService);
		usersService = module.get<UsersService>(UsersService);
	}, 100_000);

	afterAll(async () => {
		await pgContainer.stop();
		await app.close();
	});

	it("/POST create company", async () => {
		const user = usersMockData.createUser();
		const company = companiesMockData.createCompany();

		await usersService.createUser(user);
		const userEntity = await usersService.getUser({ name: "TEST_USER" });
		await companiesService.createCompany(company, userEntity as IUser);
		const createdCompany = await companiesService.getCompany(company.id);

		expect(createdCompany).not.toBeNull();
		expect(createdCompany.name).toEqual(company.name);
	});

	it("/PATCH update company", async () => {
		const user = usersMockData.createUser();
		const company = companiesMockData.createCompany();

		await usersService.createUser(user);
		const userEntity = await usersService.getUser({ name: "TEST_USER" });
		await companiesService.createCompany(company, userEntity as IUser);
		const createdCompany = await companiesService.getCompany(company.id);
		const updatedCompany = await companiesService.updateCompany(createdCompany.id, {
			...createdCompany,
			name: "TEST_COMPANY_2"
		} as unknown as any);

		expect(updatedCompany).not.toBeNull();
		expect(updatedCompany.name).toEqual("TEST_COMPANY_2");
	});

	it("/DELETE delete company", async () => {
		const user = usersMockData.createUser();
		const company = companiesMockData.createCompany();

		await usersService.createUser(user);
		const userEntity = await usersService.getUser({ name: "TEST_USER" });
		await companiesService.createCompany(company, userEntity as IUser);
		const createdCompany = await companiesService.getCompany(company.id);
		await companiesService.deleteCompany(createdCompany.id);
		const companies = await companiesService.getCompanies({ take: 10, skip: 0 });

		expect(companies.data).toHaveLength(0);
	});
});
