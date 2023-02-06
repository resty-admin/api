import type { MigrationInterface, QueryRunner } from "typeorm";

export class Admin1675617506058 implements MigrationInterface {
	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(`
			INSERT INTO users(name, role, email, password,
												status)
			VALUES ('ADMIN',
							'ADMIN',
							'admin@resty.od.ua',
							'$2a$10$aOi31kAD6xD45rZh90/pmOAyjMcn1VBr3qfwHbtLfef5bUQ/EXASO',
							'VERIFIED');
		`);
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(`DELETE
														 FROM users
														 where role = 'ADMIN'`);
	}
}
