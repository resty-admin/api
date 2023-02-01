import type { ServeStaticModuleOptions } from "@nestjs/serve-static";
import { join } from "path";

export const SERVER_STATIC_CONFIG: ServeStaticModuleOptions = {
	rootPath: join(__dirname, "./assets"),
	serveRoot: "/assets"
};
