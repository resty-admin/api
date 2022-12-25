import type { CanActivate, ExecutionContext } from "@nestjs/common";
import { mixin } from "@nestjs/common";
import { GqlExecutionContext } from "@nestjs/graphql";
import type { UserRoleEnum } from "src/app/shared/enums";

export const RolesGuard = (roles: UserRoleEnum[]) => {
	class RolesGuardMixin implements CanActivate {
		canActivate(context: ExecutionContext) {
			const isGql = (context as any).contextType === "graphql";
			let user = null;

			if (isGql) {
				const { req } = GqlExecutionContext.create(context).getContext();
				({ user } = req);
			} else {
				const request = context.switchToHttp().getRequest();
				({ user } = request);
			}

			return roles.includes(user.role);
		}
	}

	return mixin(RolesGuardMixin);
};
