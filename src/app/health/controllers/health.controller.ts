import { Controller, Get } from "@nestjs/common";
import { ApiOperation } from "@nestjs/swagger";
import {
	DiskHealthIndicator,
	HealthCheck,
	HealthCheckService,
	HttpHealthIndicator,
	MemoryHealthIndicator,
	TypeOrmHealthIndicator
} from "@nestjs/terminus";

import { HEALTH } from "../constants/health.constant";

@Controller(HEALTH)
export class HealthController {
	constructor(
		private health: HealthCheckService,
		private http: HttpHealthIndicator,
		private db: TypeOrmHealthIndicator,
		private disk: DiskHealthIndicator,
		private memory: MemoryHealthIndicator
	) {}

	@Get("/check")
	checkApi() {
		return false;
	}

	@Get()
	@HealthCheck()
	@ApiOperation({ summary: `Health check` })
	check() {
		return this.health.check([
			() => this.http.pingCheck("basic check", "http://192.168.68.52:3000/api/health/check"),
			// () => this.disk.checkStorage('diskStorage', { thresholdPercent: 0.5, path: 'C:\\' }),
			() => this.db.pingCheck("database"),
			() => this.memory.checkHeap("memory_heap", 300 * 1024 * 1024),
			() => this.memory.checkRSS("memory_rss", 300 * 1024 * 1024)
		]);
	}
}
