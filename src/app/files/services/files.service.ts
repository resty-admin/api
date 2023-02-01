import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { v4 as uuidv4 } from "uuid";

import { SpacesService } from "../../shared/spaces";
import { FileEntity } from "../entities";

@Injectable()
export class FilesService {
	constructor(
		@InjectRepository(FileEntity) private readonly _mediasRepository: Repository<FileEntity>,
		private readonly _spacesService: SpacesService
	) {}

	async uploadOne(file: Express.Multer.File) {
		const url = await this._spacesService.uploadToS3("images", this.generateFileName(file), file.buffer, file.mimetype);

		return this._mediasRepository.save({ url });
	}

	async uploadMany(files: Express.Multer.File[]) {
		const urls = await Promise.all(
			files.map((file) =>
				this._spacesService.uploadToS3("images", this.generateFileName(file), file.buffer, file.mimetype)
			)
		);

		return this._mediasRepository.save(urls.map((url) => ({ url })));
	}

	generateFileName(file) {
		return `${uuidv4()}-${file.originalname}`;
	}
}
