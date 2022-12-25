import type { ExecutionContext } from "@nestjs/common";
import { Injectable } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import type { Observable } from "rxjs";

@Injectable()
export class GoogleGuard extends AuthGuard("google") {
	canActivate(context: ExecutionContext): Observable<boolean> | Promise<boolean> | boolean {
		this["options"] = { state: context.switchToHttp().getRequest().headers.referer };
		return super.canActivate(context);
	}
}
