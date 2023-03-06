import { HttpService } from "@nestjs/axios";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { GraphQLError } from "graphql/error";
import { flattenDeep } from "lodash";
import { Repository } from "typeorm";

import { CategoryEntity } from "../../../categories/entities";
import { HallEntity } from "../../../halls/entities";
import { ProductEntity } from "../../../products/entities";
import { TableEntity } from "../../../tables/entities";
import { PosterCoreService } from "./poster-core.service";

@Injectable()
export class PosterService {
	constructor(
		@InjectRepository(HallEntity) private readonly _hallRepo: Repository<HallEntity>,
		@InjectRepository(TableEntity) private readonly _tableRepo: Repository<TableEntity>,
		@InjectRepository(CategoryEntity) private readonly _categoriesRepo: Repository<CategoryEntity>,
		@InjectRepository(ProductEntity) private readonly _productRepo: Repository<ProductEntity>,
		private readonly _httpService: HttpService,
		private readonly _posterCoreService: PosterCoreService
	) {}

	async syncHalls(placeId: string) {
		const token = await this._posterCoreService.getToken(placeId);
		const url = `https://joinposter.com/api/spots.getSpotTablesHalls?token=${token}`;

		const { response: posterHalls } = (await this._httpService.get(url).toPromise()).data;

		const halls = await this._hallRepo.find({
			where: {
				place: {
					id: placeId
				}
			},
			relations: ["place"]
		});

		const existedHalls = halls.filter((el) => el.accountingSystemsFields.hasOwnProperty("posterId"));
		const updatedHalls = existedHalls.map((hall) => {
			const posterHall = posterHalls.find((el) => el.hall_id === hall.accountingSystemsFields["posterId"]);
			return {
				...hall,
				name: posterHall["hall_name"]
			};
		});

		const newHalls = posterHalls
			.filter((pH) => !existedHalls.some((eH) => eH.accountingSystemsFields["posterId"] === pH["hall_id"]))
			.map((nH) => ({
				name: nH["hall_name"],
				place: {
					id: placeId
				},
				accountingSystemsFields: {
					posterId: nH["hall_id"]
				}
			}));

		try {
			await this._hallRepo.save([...updatedHalls, ...newHalls]);
			return "sync done!";
		} catch {
			throw new GraphQLError("jopa", {
				extensions: {
					code: 500
				}
			});
		}
	}

	async syncTables(placeId: string) {
		const token = await this._posterCoreService.getToken(placeId);
		const url = `https://joinposter.com/api/spots.getTableHallTables?token=${token}`;

		const { response: posterTables } = (await this._httpService.get(url).toPromise()).data;

		const tables = await this._tableRepo.find({
			where: {
				hall: {
					place: {
						id: placeId
					}
				}
			},
			relations: ["hall", "hall.place"]
		});

		const existedTables = tables.filter((el) => el.accountingSystemsFields.hasOwnProperty("posterId"));
		const updatedTables = existedTables.map((table) => {
			const posterTable = posterTables.find((el) => el.table_id === table.accountingSystemsFields["posterId"]);
			return {
				...table,
				name: posterTable["table_title"] || posterTable["table_num"]
			};
		});

		const existedHalls = await this._hallRepo.find({
			where: {
				place: {
					id: placeId
				}
			},
			relations: ["place"]
		});

		const newTables = posterTables
			.filter((pT) => !existedTables.some((eT) => eT.accountingSystemsFields["posterId"] === pT["table_id"]))
			.map(async (nT) => {
				let hall = null;

				hall = existedHalls.find((el) => el.accountingSystemsFields["posterId"] === nT["hall_id"]);

				if (!hall) {
					hall = await this._hallRepo.save({
						name: "poster_hall",
						place: { id: placeId },
						accountingSystemsFields: { posterId: nT["hall_id"] }
					});
				}
				return {
					name: nT["table_title"] || nT["table_num"],
					place: {
						id: placeId
					},
					hall,
					code: Number.parseInt((Math.random() * 100).toString()),
					accountingSystemsFields: {
						posterId: nT["table_id"]
					}
				};
			});

		const newTablesPromised = await Promise.all(newTables);
		try {
			await this._tableRepo.save([...updatedTables, ...newTablesPromised]);
			return "sync done!";
		} catch {
			throw new GraphQLError("jopa", {
				extensions: {
					code: 500
				}
			});
		}
	}

	async syncCategories(placeId: string) {
		const token = await this._posterCoreService.getToken(placeId);
		const url = `https://joinposter.com/api/menu.getCategories?token=${token}`;

		const { response: posterCategories } = (await this._httpService.get(url).toPromise()).data;

		const categories = await this._categoriesRepo.find({
			where: {
				place: {
					id: placeId
				}
			}
		});

		const existedCategories = categories.filter((el) => el.accountingSystemsFields.hasOwnProperty("posterId"));
		const updatedCategories = existedCategories.map((category) => {
			const posterCategory = posterCategories.find(
				(el) => el.category_id === category.accountingSystemsFields["posterId"]
			);
			return {
				...category,
				name: posterCategory["category_name"]
			};
		});

		const newCategories = posterCategories
			.filter((pC) => !existedCategories.some((eC) => eC.accountingSystemsFields["posterId"] === pC["category_id"]))
			.map((nC) => ({
				name: nC["category_name"],
				place: {
					id: placeId
				},
				accountingSystemsFields: {
					posterId: nC["category_id"]
				}
			}));

		try {
			await this._categoriesRepo.save([...updatedCategories, ...newCategories]);
			return "sync done!";
		} catch {
			throw new GraphQLError("jopa", {
				extensions: {
					code: 500
				}
			});
		}
	}

	async syncProducts(placeId: string) {
		const token = await this._posterCoreService.getToken(placeId);
		const categories = await this._categoriesRepo.find({
			where: {
				place: {
					id: placeId
				}
			}
		});

		const existedCategories = categories.filter((el) => el.accountingSystemsFields.hasOwnProperty("posterId"));

		const posterProductsPromises = existedCategories.map(async (category) => {
			const url = `https://joinposter.com/api/menu.getProducts
			?token=${token}
			&category_id=${(category.accountingSystemsFields as any).posterId}
			&type=products`;

			const { response } = (await this._httpService.get(url).toPromise()).data;
			return response;
		});

		const posterProducts = flattenDeep(await Promise.all(posterProductsPromises));

		const products = await this._productRepo.find({
			where: {
				category: {
					place: {
						id: placeId
					}
				}
			},
			relations: ["category", "category.place"]
		});

		const existedProducts = products.filter((el) => el.accountingSystemsFields.hasOwnProperty("posterId"));
		const updatedProducts = existedProducts.map((product) => {
			const posterProduct = posterProducts.find((el) => el.product_id === product.accountingSystemsFields["posterId"]);

			return {
				...product,
				price: posterProduct["cost"],
				isHide: posterProduct["hidden"],
				name: posterProduct["product_name"]
			};
		});

		const newProducts = posterProducts
			.filter((pP) => !existedProducts.some((eP) => eP.accountingSystemsFields["posterId"] === pP["product_id"]))
			.map((nP) => {
				const category = categories.find((el) => el.accountingSystemsFields["posterId"] === nP["menu_category_id"]);
				return {
					name: nP["product_name"],
					price: nP["cost"],
					isHide: nP["hidden"],
					category: {
						id: category.id
					},
					accountingSystemsFields: {
						posterId: nP["product_id"]
					}
				};
			});

		try {
			await this._productRepo.save([...updatedProducts, ...newProducts]);
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
