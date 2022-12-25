import { DYNAMIC_ID } from "../shared";

export const PAYMENT_SYSTEMS_ENDPOINTS = {
	CREATE_PAYMENT_SYSTEM: "payment-systems",
	UPDATE_PAYMENT_SYSTEM: `payment-systems/${DYNAMIC_ID}`,
	DELETE_PAYMENT_SYSTEM: `payment-systems/${DYNAMIC_ID}`
};
