import { ObjectType } from "@nestjs/graphql";
import { Entity } from "typeorm";

import { Pagination } from "../../shared/entities/pagination.type";
import { HISTORY_ORDERS } from "../constant";
import { ActiveOrderEntity } from "./active-order.entity";

@ObjectType()
@Entity({ name: HISTORY_ORDERS })
export class HistoryOrderEntity extends ActiveOrderEntity {}

@ObjectType()
export class PaginatedHistoryOrder extends Pagination(HistoryOrderEntity) {}
