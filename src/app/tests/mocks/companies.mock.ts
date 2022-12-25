import { Builder } from "builder-pattern";

import type { CompanyEntity } from "../../companies/entities";

export class CompaniesMock {
	createCompany() {
		return Builder<CompanyEntity>().name("TEST_COMPANY").build();
	}
}
