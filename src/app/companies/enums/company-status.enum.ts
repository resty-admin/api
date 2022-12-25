import { registerEnumType } from "@nestjs/graphql";

export enum CompanyStatusEnum {
	APPROVED = "APPROVED",
	REJECTED = "REJECTED",
	PENDING = "PENDING"
}

registerEnumType(CompanyStatusEnum, {
	name: "CompanyStatusEnum"
});
