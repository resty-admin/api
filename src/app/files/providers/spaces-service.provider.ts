import type { Provider } from "@nestjs/common";
import type * as AWS from "aws-sdk";

import { SPACES_BUCKET, spacesServiceLibrary } from "../configs";

export const SPACES_SERVICE_PROVIDER: Provider<AWS.S3> = {
	provide: spacesServiceLibrary,
	useValue: SPACES_BUCKET
};
