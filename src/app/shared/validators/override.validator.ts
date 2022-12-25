import {
	IsArray as _IsArray,
	IsDate as _IsDate,
	IsEmail as _IsEmail,
	IsEnum as _IsEnum,
	IsNotEmpty as _IsNotEmpty,
	IsNumber as _IsNumber,
	IsObject as _IsObject,
	IsOptional as _IsOptional,
	IsString as _IsString,
	Max as _Max,
	MaxLength as _MaxLength,
	Min as _Min,
	MinLength as _MinLength
} from "class-validator";
import { ErrorsEnum } from "src/app/shared/enums";

function getProps(propertyKey: string, code: ErrorsEnum, count?: number) {
	return { message: `${code}_${propertyKey.toString()}_${count ? `_${count}` : ""}` };
}

export const IsString = () => (target: Object, propertyKey: string) =>
	_IsString(getProps(propertyKey, ErrorsEnum.IsString))(target, propertyKey);

export const IsEmail = () => (target: Object, propertyKey: string) =>
	_IsEmail({}, getProps(propertyKey, ErrorsEnum.IsEmail))(target, propertyKey);

export const IsNumber = () => (target: Object, propertyKey: string) =>
	_IsNumber({}, getProps(propertyKey, ErrorsEnum.IsNumber))(target, propertyKey);

export const IsNotEmpty = () => (target: Object, propertyKey: string) =>
	_IsNotEmpty(getProps(propertyKey, ErrorsEnum.IsNotEmpty))(target, propertyKey);

export const MinLength = (count: number) => (target: Object, propertyKey: string) =>
	_MinLength(count, getProps(propertyKey, ErrorsEnum.MinLength, count))(target, propertyKey);

export const MaxLength = (count: number) => (target: Object, propertyKey: string) =>
	_MaxLength(count, getProps(propertyKey, ErrorsEnum.MaxLength, count))(target, propertyKey);

export const IsEnum = (_enum: Object) => (target: Object, properyKey: string) =>
	_IsEnum(_enum, getProps(properyKey, ErrorsEnum.InvalidEnum))(target, properyKey);

export const IsOptional = () => (target: Object, properyKey: string) => _IsOptional()(target, properyKey);

export const Min = (count: number) => (target: Object, propertyKey: string) =>
	_Min(count, getProps(propertyKey, ErrorsEnum.Min, count))(target, propertyKey);

export const Max = (count: number) => (target: Object, propertyKey: string) =>
	_Max(count, getProps(propertyKey, ErrorsEnum.Max, count))(target, propertyKey);

export const IsObject = () => (target: Object, propertyKey: string) =>
	_IsObject(getProps(propertyKey, ErrorsEnum.IsObject))(target, propertyKey);

export const IsDate = () => (target: Object, propertyKey: string) =>
	_IsDate(getProps(propertyKey, ErrorsEnum.IsDate))(target, propertyKey);

export const IsArray = () => (target: Object, propertyKey: string) =>
	_IsArray(getProps(propertyKey, ErrorsEnum.IsArray))(target, propertyKey);
