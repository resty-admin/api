import { Injectable } from "@nestjs/common";
import { WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Server } from "socket.io";

@WebSocketGateway({
	cors: {
		origin: "*"
	}
})
@Injectable()
export class OrdersGateway {
	@WebSocketServer()
	server: Server;

	emitEvent(eventName: string, ...arguments_: unknown[]) {
		this.server.emit(eventName, ...arguments_);
	}
}
