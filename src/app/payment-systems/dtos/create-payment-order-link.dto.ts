import { IsNotEmpty } from "../../shared";

export class CreatePaymentOrderLinkDto {
	@IsNotEmpty()
	productsToOrders: string[];
}
