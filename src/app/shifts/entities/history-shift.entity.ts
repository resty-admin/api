import { ObjectType } from "@nestjs/graphql";
import { Entity } from "typeorm";

import { Pagination } from "../../shared/entities/pagination.type";
import { HISTORY_SHIFTS } from "../constants";
import { ActiveShiftEntity } from "./active-shift.entity";

@ObjectType()
@Entity({ name: HISTORY_SHIFTS })
export class HistoryShiftEntity extends ActiveShiftEntity {}

@ObjectType()
export class PaginatedHistoryShift extends Pagination(HistoryShiftEntity) {}
