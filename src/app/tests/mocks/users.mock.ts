import { Builder } from "builder-pattern";

import type { UserEntity } from "../../users/entities";

export class UsersMock {
	createUser() {
		return Builder<UserEntity>()
			.name("TEST_USER")
			.tel("+380981111111")
			.email("test@gmail.com")
			.password("password")
			.build();
	}
}
