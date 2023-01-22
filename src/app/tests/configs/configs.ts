import { GenericContainer } from "testcontainers";
import type { ConnectionOptions } from "typeorm";

export const configs = () =>
	new GenericContainer("postgres")
		.withEnvironment({
			POSTGRES_USER: "test",
			POSTGRES_PASSWORD: "test"
		})
		.withExposedPorts(5432);

export const typeOrmConfig = (pgContainer: any, entities?: any[]): ConnectionOptions => ({
	type: "postgres",
	host: "192.168.68.102",
	port: pgContainer.getMappedPort(5432),
	username: "test",
	password: "test",
	database: "test",
	entities: [...entities],
	synchronize: true
});
