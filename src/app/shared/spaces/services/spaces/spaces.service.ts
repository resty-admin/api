import { Inject, Injectable } from "@nestjs/common";
import * as AWS from "aws-sdk";

import { environment } from "../../../../../environments/environment";
import { SPACES_BUCKET } from "../../injection-tokens";

@Injectable()
export class SpacesService {
	constructor(@Inject(SPACES_BUCKET) private readonly s3: AWS.S3) {}

	async uploadToS3(folder: string, fileName: string, body: any, contentType: string): Promise<string> {
		return new Promise((resolve, reject) => {
			this.s3.putObject(
				{
					Bucket: environment.digitalOceanSpaces.bucketName + folder,
					Key: fileName,
					Body: body,
					ContentType: contentType,
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
}
