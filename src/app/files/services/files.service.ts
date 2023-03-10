import { HttpService } from "@nestjs/axios";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import * as fs from "fs";
import { readFileSync } from "fs";
import { join } from "path";
import { Repository } from "typeorm";
import { v4 as uuidv4 } from "uuid";

import { CompanyEntity } from "../../companies/entities";
import { UserToPlaceEntity } from "../../places/entities";
import { SpacesService } from "../../shared/spaces";
import { FileEntity } from "../entities";

@Injectable()
export class FilesService {
	constructor(
		@InjectRepository(FileEntity) private readonly _mediasRepository: Repository<FileEntity>,
		@InjectRepository(CompanyEntity) private readonly _companyRepository: Repository<CompanyEntity>,
		@InjectRepository(UserToPlaceEntity) private readonly _uTpRepository: Repository<UserToPlaceEntity>,
		private readonly _httpService: HttpService,
		private readonly _spacesService: SpacesService
	) {}

	async uploadOne(file: Express.Multer.File) {
		const url = await this._spacesService.uploadToS3(`images`, this.generateFileName(file), file.buffer, file.mimetype);

		return this._mediasRepository.save({ url });
	}

	async uploadMany(files: Express.Multer.File[]) {
		const urls = await Promise.all(
			files.map((file) =>
				this._spacesService.uploadToS3(`images`, this.generateFileName(file), file.buffer, file.mimetype)
			)
		);

		return this._mediasRepository.save(urls.map((url) => ({ url })));
	}

	async downloadOne(url: string) {
		const splitUrl = url.split(".");
		const type = splitUrl.at(-1);
		const fileName = `${this.generateFileName("poster")}.${type}`;
		const writer = fs.createWriteStream(join(process.cwd(), fileName));

		const response = await this._httpService.axiosRef({
			url,
			method: "GET",
			responseType: "stream"
		});

		response.data.pipe(writer);

		return new Promise((resolve, reject) => {
			writer.on("finish", async () => {
				const file = readFileSync(join(process.cwd(), fileName));
				const url = await this._spacesService.uploadToS3(`images`, fileName, file, type);
				const fileEntity = await this._mediasRepository.save({ url });
				await fs.unlink(join(process.cwd(), fileName), (err) => {
					if (err) {
						console.error(err);
						return err;
					}
				});
				resolve(fileEntity);
			});
			writer.on("error", reject);
		});
	}

	generateFileName(file) {
		return `${uuidv4()}-${file.originalname ? file.originalname : file}`;
	}
}
