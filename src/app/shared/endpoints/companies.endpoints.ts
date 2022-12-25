import { DYNAMIC_ID } from "../shared";

export const COMPANIES_ENDPOINTS = {
	BASE: "companies",
	CREATE_COMPANY: "companies",
	UPDATE_COMPANY: `companies/${DYNAMIC_ID}`,
	DELETE_COMPANY: `companies/${DYNAMIC_ID}`
};
