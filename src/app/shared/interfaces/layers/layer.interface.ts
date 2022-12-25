import type { LayerTypeEnum } from "../../enums";
import type { IModel } from "../models";

export interface ILayer {
	id: string;
	model: IModel;
	x: number;
	y: number;
	width: number;
	height: number;
	name: string;
	hidden: boolean;
	selected: boolean;
	locked: boolean;
	type: LayerTypeEnum;
	group: ILayer;
	layers: ILayer[];
	order: number;
	hue: number;
}
