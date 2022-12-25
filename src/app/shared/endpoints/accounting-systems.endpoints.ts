import { DYNAMIC_ID } from "../shared";

export const ACCOUNTING_SYSTEMS_ENDPOINTS = {
	CREATE_ACCOUNTING_SYSTEM: "accounting-systems",
	UPDATE_ACCOUNTING_SYSTEM: `accounting-systems/${DYNAMIC_ID}`,
	DELETE_ACCOUNTING_SYSTEM: `accounting-systems/${DYNAMIC_ID}`
};
