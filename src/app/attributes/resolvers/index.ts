import { AttributeGroupsResolver } from "./attribute-groups.resolver";
import { AttributesResolver } from "./attributes.resolver";

export const ATTRIBUTES_RESOLVERS = [AttributesResolver, AttributeGroupsResolver];

export * from "./attribute-groups.resolver";
export * from "./attributes.resolver";
