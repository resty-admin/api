import { DYNAMIC_ID } from "../shared";

export const COMMANDS_ENDPOINTS = {
	CREATE_COMMAND: "commands",
	UPDATE_COMMAND: `commands/${DYNAMIC_ID}`,
	DELETE_COMMAND: `commands/${DYNAMIC_ID}`
};
