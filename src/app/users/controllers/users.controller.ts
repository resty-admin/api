import { Body, Controller, Delete, Param, ParseUUIDPipe, Patch, Post } from "@nestjs/common";
import { ApiCreatedResponse, ApiOperation } from "@nestjs/swagger";

import { USERS } from "../constant";
import { CreateUserDto, UpdateUserDto } from "../dtos";
import { UserEntity } from "../entities";
import { UsersService } from "../services";

@Controller(USERS)
export class UsersController {
	constructor(private readonly _usersService: UsersService) {}

	@Post()
	@ApiOperation({ summary: `Create user` })
	@ApiCreatedResponse({
		description: "The record has been successfully created.",
		type: UserEntity
	})
	async createUser(@Body() user: CreateUserDto): Promise<Promise<UserEntity> | string> {
		return this._usersService.createUser(user);
	}

	@Patch("/:id")
	@ApiOperation({ summary: `Update user` })
	@ApiCreatedResponse({
		description: "The record has been successfully updated.",
		type: UserEntity
	})
	async updateUser(
		@Param("id", ParseUUIDPipe) id: string,
		@Body() user: UpdateUserDto
	): Promise<Promise<UserEntity> | string> {
		return this._usersService.updateUser(id, user);
	}

	@Delete("/:id")
	@ApiOperation({ summary: `Delete user` })
	async deleteUser(@Param("id", ParseUUIDPipe) id: string): Promise<string> {
		return this._usersService.deleteUser(id);
	}
}
