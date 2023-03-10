import { HttpService } from "@nestjs/axios";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { GraphQLError } from "graphql/error";
import { flattenDeep } from "lodash";
import { Repository } from "typeorm";

import { HistoryOrderEntity } from "../../../orders/entities";
import { ProductEntity } from "../../../products/entities";
import { OrderTypeEnum } from "../../../shared/enums";
import { TableEntity } from "../../../tables/entities";
import { AccountingSystemsEnum } from "../../enums";

@Injectable()
export class PosterOrdersService {
	constructor(
		private readonly _httpService: HttpService,
		@InjectRepository(HistoryOrderEntity) private readonly _historyOrdersRepo: Repository<HistoryOrderEntity>,
		@InjectRepository(TableEntity) private readonly _tablesRepo: Repository<TableEntity>,
		@InjectRepository(ProductEntity) private readonly _productsRepo: Repository<ProductEntity>
	) {}

	async syncHistoryOrders(placeId: string, token: string) {
		const [currDate] = new Date().toISOString().split("T");
		const url = `https://joinposter.com/api/transactions.getTransactions?token=${token}&date_from=2021-11-30&date_to=${currDate}`;

		const {
			response: { data: posterHistoryOrders }
		} = (await this._httpService.get(url).toPromise()).data;

		const historyOrders = await this._historyOrdersRepo.find({
			where: {
				place: {
					id: placeId
				}
			}
		});

		const existedOrders = historyOrders.filter((el) => el.accountingSystem === AccountingSystemsEnum.POSTER);

		const newPosterOrders = posterHistoryOrders
			.filter((pHo) => !existedOrders.some((eO) => Number(eO.accountingSystemId) === Number(pHo["transaction_id"])))
			.map(async (nO) => {
				let table = null;
				if (nO["table_id"] !== "0") {
					const tables = await this._tablesRepo.find({
						where: {
							hall: {
								place: {
									id: placeId
								}
							}
						},
						relations: ["hall", "hall.place"]
					});

					table = tables
						.filter((el) => el.accountingSystemsFields.hasOwnProperty("posterId"))
						.find((el) => Number(el.accountingSystemsFields["posterId"]) === Number(nO["table_id"]));
				}

				let products = [];

				if (nO["products"].length > 0) {
					const posterOrderProducts = flattenDeep(nO["products"]);
					const existedProducts = await this._productsRepo.find({
						where: {
							category: {
								place: {
									id: placeId
								}
							}
						},
						relations: ["category", "category.place"]
					});

					products = existedProducts
						.filter((el) => el.accountingSystemsFields.hasOwnProperty("posterId"))
						.filter((el) =>
							posterOrderProducts.find((pP) => pP["product_id"] === Number(el.accountingSystemsFields["posterId"]))
						);
				}

				return {
					place: {
						id: placeId
					},
					accountingSystem: AccountingSystemsEnum.POSTER,
					accountingSystemId: nO["transaction_id"],
					totalPrice: Number(nO["sum"]).toFixed(2),
					startDate: nO["date_close"],
					productsToOrders: products,
					table,
					type: !table ? OrderTypeEnum.OUT_OF_PLACE : OrderTypeEnum.IN_PLACE
				};
			});

		const newPosterOrdersPromised = await Promise.all(newPosterOrders);

		try {
			await this._historyOrdersRepo.save(newPosterOrdersPromised);
			return "sync done!";
		} catch {
			throw new GraphQLError("jopa", {
				extensions: {
					code: 500
				}
			});
		}
	}
}
