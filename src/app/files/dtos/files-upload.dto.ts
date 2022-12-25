
export class FilesUploadDto {
	// @ApiProperty({ type: "array", items: { type: "string", format: "binary" } })
	files: Express.Multer.File[];
}
