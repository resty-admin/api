// import "multer";

import { Controller, Post, UploadedFile, UploadedFiles, UseInterceptors } from "@nestjs/common";
import { FileInterceptor, FilesInterceptor } from "@nestjs/platform-express";
import { ApiBody, ApiConsumes } from "@nestjs/swagger";

import { FILES_ENDPOINTS } from "../constants";
import { FilesUploadDto, FileUploadDto } from "../dtos";
import { FilesService } from "../services";

@Controller()
export class FilesController {
	constructor(private readonly _filesService: FilesService) {}

	@Post(FILES_ENDPOINTS.UPLOAD_ONE)
	@UseInterceptors(FileInterceptor("file"))
	@ApiConsumes("multipart/form-data")
	@ApiBody({
		description: "List of files",
		type: FileUploadDto
	})
	async uploadOne(@UploadedFile() media: any) {
		return this._filesService.uploadOne(media);
	}

	@Post(FILES_ENDPOINTS.UPLOAD_MANY)
	@UseInterceptors(FilesInterceptor("files", 10))
	@ApiConsumes("multipart/form-data")
	@ApiBody({
		description: "List of files",
		type: FilesUploadDto
	})
	async uploadMany(@UploadedFiles() files: any) {
		return this._filesService.uploadMany(files);
	}
}
