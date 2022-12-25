import { DYNAMIC_ID } from "../shared";

export const USERS_ENDPOINTS = {
	CREATE_USER: "users",
	UPDATE_USER: `users/${DYNAMIC_ID}`,
	DELETE_USER: `users/${DYNAMIC_ID}`
};
