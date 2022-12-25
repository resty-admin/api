import * as AWS from "aws-sdk";

import { environment } from "../../../environments/environment";

export const spacesServiceLibrary = "lib:spaces-service";

const spacesEndpoint = new AWS.Endpoint(environment.digitalOceanSpaces.endpoint);

export const SPACES_BUCKET = new AWS.S3({
	endpoint: spacesEndpoint.href,
	credentials: new AWS.Credentials({
		accessKeyId: environment.digitalOceanSpaces.accessKeyId,
		secretAccessKey: environment.digitalOceanSpaces.secretAccessKey
	})
});
