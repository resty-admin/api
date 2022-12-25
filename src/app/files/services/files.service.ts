import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { FileEntity } from "../entities";
import { SpacesService } from "./spaces.service";

@Injectable()
export class FilesService {
	constructor(
		@InjectRepository(FileEntity) private readonly _mediasRepository: Repository<FileEntity>,
		private readonly _spacesService: SpacesService
	) {}

	async uploadOne(file: Express.Multer.File) {
		const url: string = await this._spacesService.uploadFile(file);

		return this._mediasRepository.save({ url });
	}

	async uploadMany(files: Express.Multer.File[]) {
		const urls: string[] = await this._spacesService.uploadMany(files);

		return this._mediasRepository.save(urls.map((url) => ({ url })));
	}
}
