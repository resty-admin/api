import { DYNAMIC_ID } from "../shared";

export const PRODUCTS_ENDPOINTS = {
	CREATE_PRODUCT: "products",
	UPDATE_PRODUCT: `products/${DYNAMIC_ID}`,
	DELETE_PRODUCT: `products/${DYNAMIC_ID}`
};
