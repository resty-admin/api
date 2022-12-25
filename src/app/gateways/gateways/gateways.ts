import { WebSocketServer } from "@nestjs/websockets";
import { WebSocketGateway } from "@nestjs/websockets";
import { Server } from "socket.io";

@WebSocketGateway({
	cors: {
		origin: "*"
	}
})
export class Gateways {
	@WebSocketServer()
	server: Server;

	emitEvent(eventName: string, ...arguments_: unknown[]) {
		this.server.emit(eventName, ...arguments_);
	}
}
