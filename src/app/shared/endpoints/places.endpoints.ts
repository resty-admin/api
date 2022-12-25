import { DYNAMIC_ID } from "../shared";

export const PLACES_ENDPOINTS = {
	BASE: "places",
	CREATE_PLACE: "places",
	UPDATE_PLACE: `places/${DYNAMIC_ID}`,
	DELETE_PLACE: `places/${DYNAMIC_ID}`
};
