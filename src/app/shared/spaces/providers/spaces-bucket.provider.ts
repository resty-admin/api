import type { Provider } from "@nestjs/common";
import * as AWS from "aws-sdk";

import { environment } from "../../../../environments/environment";
import { SPACES_BUCKET } from "../injection-tokens";

export const SPACES_BUCKET_PROVIDER: Provider<AWS.S3> = {
	provide: SPACES_BUCKET,
	useValue: new AWS.S3({
		endpoint: new AWS.Endpoint(environment.digitalOceanSpaces.endpoint).href,
		credentials: new AWS.Credentials({
			accessKeyId: environment.digitalOceanSpaces.accessKeyId,
			secretAccessKey: environment.digitalOceanSpaces.secretAccessKey
		})
	})
};
