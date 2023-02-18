import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { GraphQLError } from "graphql/error";
import { Repository } from "typeorm";
import { v4 as uuidv4 } from "uuid";

import { CompanyEntity } from "../../companies/entities";
import { UserToPlaceEntity } from "../../places/entities";
import { ErrorsEnum, UserRoleEnum } from "../../shared/enums";
import type { IUser } from "../../shared/interfaces";
import { SpacesService } from "../../shared/spaces";
import { FileEntity } from "../entities";

@Injectable()
export class FilesService {
	constructor(
		@InjectRepository(FileEntity) private readonly _mediasRepository: Repository<FileEntity>,
		@InjectRepository(CompanyEntity) private readonly _companyRepository: Repository<CompanyEntity>,
		@InjectRepository(UserToPlaceEntity) private readonly _uTpRepository: Repository<UserToPlaceEntity>,
		private readonly _spacesService: SpacesService
	) {}

	async uploadOne(file: Express.Multer.File, user: IUser) {
		const rootPath = await this.defineCompanyRootFolder(user);
		const url = await this._spacesService.uploadToS3(
			`${rootPath}/images`,
			this.generateFileName(file),
			file.buffer,
			file.mimetype
		);

		return this._mediasRepository.save({ url });
	}

	async uploadMany(files: Express.Multer.File[], user: IUser) {
		const rootPath = await this.defineCompanyRootFolder(user);

		const urls = await Promise.all(
			files.map((file) =>
				this._spacesService.uploadToS3(`${rootPath}/images`, this.generateFileName(file), file.buffer, file.mimetype)
			)
		);

		return this._mediasRepository.save(urls.map((url) => ({ url })));
	}

	generateFileName(file) {
		return `${uuidv4()}-${file.originalname}`;
	}

	async defineCompanyRootFolder(user: IUser) {
		const company = await this._companyRepository.findOne({
			where: {
				owner: {
					id: user.id
				}
			}
		});

		if (!company) {
			throw new GraphQLError(ErrorsEnum.Forbidden.toString(), {
				extensions: {
					code: 500
				}
			});
		}

		const uTp = await this._uTpRepository.findOne({
			where: {
				user: {
					id: user.id
				}
			},
			relations: ["user", "place", "place.company"]
		});

		if (!uTp || uTp.user.role === UserRoleEnum.CLIENT) {
			throw new GraphQLError(ErrorsEnum.Forbidden.toString(), {
				extensions: {
					code: 500
				}
			});
		}

		return `${company.id}_${company.name}` || `${uTp.place.company.id}_${uTp.place.company.name}`;
	}
}
