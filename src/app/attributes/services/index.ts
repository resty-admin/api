import { AttributeGroupsService } from "./attribute-groups.service";
import { AttributesService } from "./attributes.service";

export const ATTRIBUTES_SERVICES = [AttributesService, AttributeGroupsService];

export * from "./attribute-groups.service";
export * from "./attributes.service";
