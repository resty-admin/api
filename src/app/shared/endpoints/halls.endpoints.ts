import { DYNAMIC_ID } from "../shared";

export const HALLS_ENDPOINTS = {
	CREATE_HALL: "halls",
	UPDATE_HALL: `halls/${DYNAMIC_ID}`,
	DELETE_HALL: `halls/${DYNAMIC_ID}`
};
