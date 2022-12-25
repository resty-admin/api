import { Inject, Injectable } from "@nestjs/common";
import * as AWS from "aws-sdk";
import { v4 as uuidv4 } from "uuid";

import { environment } from "../../../environments/environment";
import { spacesServiceLibrary } from "../configs";

@Injectable()
export class SpacesService {
	constructor(@Inject(spacesServiceLibrary) private readonly s3: AWS.S3) {}

	async uploadFile(file: Express.Multer.File): Promise<string> {
		const fileName = this.generateFileName(file);

		return this.uploadToS3(fileName, file);
	}

	async uploadMany(files: Express.Multer.File[]): Promise<string[]> {
		return Promise.all(
			files.map(async (file) => {
				const fileName = this.generateFileName(file);

				return this.uploadToS3(fileName, file);
			})
		);
	}

	async uploadToS3(fileName: string, file: Express.Multer.File): Promise<string> {
		return new Promise((resolve, reject) => {
			this.s3.putObject(
				{
					Bucket: environment.digitalOceanSpaces.bucketName,
					Key: fileName,
					Body: file.buffer,
					ContentType: file.mimetype,
					ACL: "public-read"
				},
				(error: AWS.AWSError) => {
					if (!error) {
						resolve(`${fileName}`);
					} else {
						reject(new Error(`${error || "Something went wrong"}`));
					}
				}
			);
		});
	}

	generateFileName(file) {
		return `${uuidv4()}-${file.originalname}`;
	}
}
