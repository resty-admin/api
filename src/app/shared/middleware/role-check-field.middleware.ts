import type { FieldMiddleware, MiddlewareContext, NextFn } from "@nestjs/graphql";

import { UserRoleEnum } from "../enums";

export const adminRoleFieldMiddleware: FieldMiddleware = async (ctx: MiddlewareContext, next: NextFn) => {
	const value = await next();
	const isAdmin = ctx.context.req.user.role === UserRoleEnum.ADMIN;
	return isAdmin ? value : null;
};

export const managerRoleFieldMiddleware: FieldMiddleware = async (ctx: MiddlewareContext, next: NextFn) => {
	const value = await next();
	const isManager = ctx.context.req.user.role === UserRoleEnum.MANAGER;
	return isManager ? value : null;
};

export const employeeRoleFieldMiddleware: FieldMiddleware = async (ctx: MiddlewareContext, next: NextFn) => {
	const value = await next();
	const isEmployee = [UserRoleEnum.WAITER, UserRoleEnum.HOOKAH, UserRoleEnum.HOSTESS].includes(
		ctx.context.req.user.role
	);
	return isEmployee ? value : null;
};

export const clientRoleFieldMiddleware: FieldMiddleware = async (ctx: MiddlewareContext, next: NextFn) => {
	const value = await next();
	const isClient = ctx.context.req.user.role === UserRoleEnum.CLIENT;
	return isClient ? value : null;
};
