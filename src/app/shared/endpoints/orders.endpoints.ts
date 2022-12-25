import { DYNAMIC_ID } from "../shared";

export const ORDERS_ENDPOINTS = {
	GET_ACTIVE: "get-active",
	RESERVE: `${DYNAMIC_ID}/reserve`,
	ADD_PRODUCT_TO_ORDER: `${DYNAMIC_ID}/add-product-to-order`,
	REMOVE_PRODUCT_FROM_ORDER: `${DYNAMIC_ID}/remove-product-from-order`,
	REQUEST_TO_CONFIRM_ORDER: `${DYNAMIC_ID}/request-to-confirm-order`,
	REQUEST_TO_CONFIRM_PAYMENT: `${DYNAMIC_ID}/request-to-confirm-payment`,
	CONFRIM_ORDER: `${DYNAMIC_ID}/confirm-order`,
	CONFIRM_PAYMENT: `${DYNAMIC_ID}/confirm-payment`,
	CREATE_ORDER: "orders",
	UPDATE_ORDER: `orders/${DYNAMIC_ID}`,
	DELETE_ORDER: `orders/${DYNAMIC_ID}`
};
