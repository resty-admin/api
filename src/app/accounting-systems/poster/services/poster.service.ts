import { HttpService } from "@nestjs/axios";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import * as console from "console";
import { GraphQLError } from "graphql/error";
import { flattenDeep } from "lodash";
import { Repository } from "typeorm";

import { AttributesEntity, AttributesGroupEntity } from "../../../attributes/entities";
import { CategoryEntity } from "../../../categories/entities";
import { FilesService } from "../../../files/services";
import { HallEntity } from "../../../halls/entities";
import { ProductEntity } from "../../../products/entities";
import { AttributeGroupTypeEnum } from "../../../shared/enums";
import { TableEntity } from "../../../tables/entities";

@Injectable()
export class PosterService {
	constructor(
		@InjectRepository(HallEntity) private readonly _hallRepo: Repository<HallEntity>,
		@InjectRepository(TableEntity) private readonly _tableRepo: Repository<TableEntity>,
		@InjectRepository(CategoryEntity) private readonly _categoriesRepo: Repository<CategoryEntity>,
		@InjectRepository(ProductEntity) private readonly _productRepo: Repository<ProductEntity>,
		@InjectRepository(AttributesGroupEntity) private readonly _attrGroupRepo: Repository<AttributesGroupEntity>,
		@InjectRepository(AttributesEntity) private readonly _attrRepo: Repository<AttributesEntity>,
		private readonly _filesService: FilesService,
		private readonly _httpService: HttpService
	) {}

	async syncHalls(placeId: string, token: string) {
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
		const updatedHalls = existedHalls
			.map((hall) => {
				const posterHall = posterHalls.find((el) => el.hall_id === hall.accountingSystemsFields["posterId"]);
				return posterHall
					? {
							...hall,
							name: posterHall["hall_name"]
					  }
					: null;
			})
			.filter((el) => el);

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

	async syncTables(placeId: string, token: string) {
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

				hall = existedHalls.find((el) => Number(el.accountingSystemsFields["posterId"]) === Number(nT["hall_id"]));

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

	async syncCategories(placeId: string, token: string, account: string) {
		const url = `https://joinposter.com/api/menu.getCategories?token=${token}`;

		const { response: posterCategories } = (await this._httpService.get(url).toPromise()).data;

		// console.log('posterCategories', posterCategories);

		const categories = await this._categoriesRepo.find({
			where: {
				place: {
					id: placeId
				}
			}
		});

		const posterParentCategories = posterCategories.filter((el) => el["parent_category"] === "0");

		const existedCategories = categories.filter((el) => el.accountingSystemsFields.hasOwnProperty("posterId"));
		const updatedCategories = existedCategories.map(async (category) => {
			const posterCategory = posterParentCategories.find(
				(el) => el.category_id === category.accountingSystemsFields["posterId"]
			);

			const file = posterCategory["category_photo_origin"]
				? await this._filesService.downloadOne(
						`https://${account}.joinposter.com${posterCategory["category_photo_origin"]}`
				  )
				: null;
			return {
				...category,
				file,
				name: posterCategory["category_name"]
			};
		});

		const newCategories = posterParentCategories
			.filter((pC) => !existedCategories.some((eC) => eC.accountingSystemsFields["posterId"] === pC["category_id"]))
			.map(async (nC) => {
				const file = nC["category_photo_origin"]
					? await this._filesService.downloadOne(`https://${account}.joinposter.com${nC["category_photo_origin"]}`)
					: null;

				return {
					name: nC["category_name"],
					place: {
						id: placeId
					},
					file,
					accountingSystemsFields: {
						posterId: nC["category_id"],
						childrenIds: posterCategories
							.filter((el) => el["parent_category"] === nC["category_id"])
							.map((el) => el["category_id"])
					}
				};
			});

		const promisedCategories = await Promise.all([...updatedCategories, ...newCategories]);

		try {
			await this._categoriesRepo.save(promisedCategories);
			return "sync done!";
		} catch (error) {
			console.log("categories", error);
			throw new GraphQLError("jopa", {
				extensions: {
					code: 500
				}
			});
		}
	}

	async syncProducts(placeId: string, token: string, account: string) {
		const categories = await this._categoriesRepo.find({
			where: {
				place: {
					id: placeId
				}
			}
		});

		const existedCategories = categories.filter((el) => el.accountingSystemsFields.hasOwnProperty("posterId"));
		const existedCategoriesIds = flattenDeep(
			existedCategories.map((el) => [
				el.accountingSystemsFields["posterId"],
				...el.accountingSystemsFields["childrenIds"]
			])
		);

		const posterProductsPromises = existedCategoriesIds.map(async (id) => {
			const batchticketsUrl = `https://joinposter.com/api/menu.getProducts?token=${token}&category_id=${id}&type=batchtickets`;
			const productsUrl = `https://joinposter.com/api/menu.getProducts?token=${token}&category_id=${id}&type=products`;

			const { response: batchTiketsData } = (await this._httpService.get(batchticketsUrl).toPromise()).data;
			const { response: productsData } = (await this._httpService.get(productsUrl).toPromise()).data;

			return [...batchTiketsData, ...productsData];
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
		const updatedProducts = existedProducts.map(async (product) => {
			const posterProduct = posterProducts.find((el) => el.product_id === product.accountingSystemsFields["posterId"]);
			const file =
				posterProduct && posterProduct["photo_origin"]
					? await this._filesService.downloadOne(`https://${account}.joinposter.com${posterProduct["photo_origin"]}`)
					: null;

			return {
				...product,
				file,
				price: Number(posterProduct["price"]["1"]) / 100,
				isHide: posterProduct["hidden"],
				name: posterProduct["product_name"]
			};
		});

		const newProducts = posterProducts
			.filter((pP) => !existedProducts.some((eP) => eP.accountingSystemsFields["posterId"] === pP["product_id"]))
			.map(async (nP) => {
				const category = existedCategories.find(
					(el) =>
						el.accountingSystemsFields["posterId"] === nP["menu_category_id"] ||
						el.accountingSystemsFields["childrenIds"].includes(nP["menu_category_id"])
				);

				const file =
					nP && nP["photo_origin"]
						? await this._filesService.downloadOne(`https://${account}.joinposter.com${nP["photo_origin"]}`)
						: null;
				return {
					name: nP["product_name"],
					price: Number(nP["price"]["1"]) / 100,
					isHide: nP["hidden"],
					file,
					category: {
						id: category.id
					},
					accountingSystemsFields: {
						posterId: nP["product_id"]
					}
				};
			});

		const promisedProducts = await Promise.all([...updatedProducts, ...newProducts]);
		try {
			await this._productRepo.save(promisedProducts);
			return "sync done!";
		} catch (error) {
			console.log("products", error);
			throw new GraphQLError("jopa", {
				extensions: {
					code: 500
				}
			});
		}
	}

	async syncIngredientsGroups(placeId: string, token: string) {
		const url = `https://joinposter.com/api/menu.getCategoriesIngredients?token=${token}`;

		const { response: posterIngredientsGroups } = (await this._httpService.get(url).toPromise()).data;

		const attrGroups = await this._attrGroupRepo.find({
			where: {
				place: {
					id: placeId
				}
			}
		});

		const existedAttrGroups = attrGroups.filter((el) => el.accountingSystemsFields.hasOwnProperty("posterId"));
		const updatedAttrGroups = existedAttrGroups.map((attrGroup) => {
			const posterAttrGroup = posterIngredientsGroups.find(
				(el) => el["category_id"] === attrGroup.accountingSystemsFields["posterId"]
			);
			return {
				...attrGroup,
				name: posterAttrGroup["name"]
			};
		});

		const newAttrGroups = posterIngredientsGroups
			.filter((pI) => !existedAttrGroups.some((eI) => eI.accountingSystemsFields["posterId"] === pI["category_id"]))
			.map((nI) => ({
				name: nI["name"],
				attributes: [],
				products: [],
				place: { id: placeId },
				type: AttributeGroupTypeEnum.ADD,
				maxItemsForPick: 10,
				accountingSystemsFields: {
					posterId: nI["category_id"]
				}
			}));

		try {
			await this._attrGroupRepo.save([...updatedAttrGroups, ...newAttrGroups]);
			return "sync done!";
		} catch (error) {
			console.log("attr groups", error);
			throw new GraphQLError("jopa", {
				extensions: {
					code: 500
				}
			});
		}
	}

	async syncIngredients(placeId: string, token: string) {
		const url = `https://joinposter.com/api/menu.getIngredients?token=${token}`;

		const { response: posterIngredients } = (await this._httpService.get(url).toPromise()).data;

		const attrs = await this._attrRepo.find({
			where: {
				place: {
					id: placeId
				}
			}
		});

		const attrGroups = await this._attrGroupRepo.find({
			where: {
				place: {
					id: placeId
				}
			},
			relations: ["attributes"]
		});

		const existedAttrs = attrs.filter((el) => el.accountingSystemsFields.hasOwnProperty("posterId"));
		const existedAttrGroups = attrGroups.filter((el) => el.accountingSystemsFields.hasOwnProperty("posterId"));

		const updatedAttrs = existedAttrs.map((attr) => {
			const posterAttr = posterIngredients.find(
				(el) => Number(el["ingredient_id"]) === Number(attr.accountingSystemsFields["posterId"])
			);
			return {
				...attr,
				name: posterAttr["ingredient_name"],
				place: {
					id: placeId
				}
			};
		});

		const newAttrs = posterIngredients
			.filter((pI) => !existedAttrs.some((eI) => eI.accountingSystemsFields["posterId"] === pI["ingredient_id"]))
			.map((nI) => {
				const attributesGroup = existedAttrGroups.find(
					(el) => Number(el.accountingSystemsFields["posterId"]) === Number(nI["category_id"])
				);

				return {
					name: nI["ingredient_name"],
					place: { id: placeId },
					price: 0,
					attributesGroup: attributesGroup ? [{ id: attributesGroup.id }] : [],
					type: AttributeGroupTypeEnum.ADD,
					maxItemsForPick: 10,
					accountingSystemsFields: {
						posterId: nI["ingredient_id"]
					}
				};
			});

		try {
			await this._attrRepo.save([...updatedAttrs, ...newAttrs]);
			return "sync done!";
		} catch (error) {
			console.log("attrs", error);
			throw new GraphQLError("jopa", {
				extensions: {
					code: 500
				}
			});
		}
	}
}
