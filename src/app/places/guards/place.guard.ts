import type { CanActivate, ExecutionContext } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { PlaceEntity } from "../entities";

export class PlaceGuard implements CanActivate {
	constructor(@InjectRepository(PlaceEntity) private readonly _placesRepository: Repository<PlaceEntity>) {}

	async canActivate(context: ExecutionContext) {
		const request = context.switchToHttp().getRequest();

		const {
			user,
			params: { id }
		} = request;

		const place = await this._placesRepository.findOne({ where: { id }, relations: ["company", "company.owner"] });

		return user.id === place.company.owner.id;
	}
}
