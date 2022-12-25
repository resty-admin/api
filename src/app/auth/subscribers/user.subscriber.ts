import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { InjectConnection } from "@nestjs/typeorm";
import { CryptoService } from "src/app/shared/crypto";
import type { EntitySubscriberInterface, InsertEvent } from "typeorm";
import { Connection } from "typeorm";

import { UserEntity } from "../../users/entities";

@Injectable()
export class UserSubscriber implements EntitySubscriberInterface {
	constructor(@InjectConnection() readonly connection: Connection, private readonly _cryptoService: CryptoService) {
		connection.subscribers.push(this);
	}

	listenTo() {
		return UserEntity;
	}

	async beforeInsert(event: InsertEvent<UserEntity>) {
		if (event.entity.password) {
			try {
				event.entity.password = await this._cryptoService.hash(event.entity.password);
			} catch (error) {
				console.error(error);
				throw new InternalServerErrorException();
			}
		}
	}
}
