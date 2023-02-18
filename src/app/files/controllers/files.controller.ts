// import "multer";

import { Controller, Post, UploadedFile, UploadedFiles, UseGuards, UseInterceptors } from "@nestjs/common";
import { FileInterceptor, FilesInterceptor } from "@nestjs/platform-express";
import { ApiBody, ApiConsumes } from "@nestjs/swagger";

import { JwtGuard } from "../../auth";
import { User } from "../../shared";
import { IUser } from "../../shared/interfaces";
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
	@UseGuards(JwtGuard)
	async uploadOne(@UploadedFile() media: any, @User() user: IUser) {
		return this._filesService.uploadOne(media, user);
	}

	@Post(FILES_ENDPOINTS.UPLOAD_MANY)
	@UseInterceptors(FilesInterceptor("files", 10))
	@ApiConsumes("multipart/form-data")
	@ApiBody({
		description: "List of files",
		type: FilesUploadDto
	})
	@UseGuards(JwtGuard)
	async uploadMany(@UploadedFiles() files: any, @User() user: IUser) {
		return this._filesService.uploadMany(files, user);
	}
}
