import type { ValidationOptions } from "class-validator";
import { isObject, registerDecorator } from "class-validator";

export function IsMap(
	keyValidators: ((value: unknown) => boolean)[],
	valueValidators: ((value: unknown) => boolean)[],
	validationOptions?: ValidationOptions
) {
	return function (object: unknown, propertyName: string) {
		registerDecorator({
			name: "isMap",
			target: (object as any).constructor,
			propertyName,
			options: validationOptions,
			validator: {
				validate(value: unknown) {
					if (!isObject(value)) {
						return false;
					}

					const keys = [...(value as Map<any, any>).keys()];

					const isInvalid = keys.some((key) => {
						const currValue = (value as Map<any, any>).get(key);

						const isInvalidKey = keyValidators.some((validator) => !validator(key));

						if (isInvalidKey) {
							return true;
						}

						return valueValidators.some((validator) => !validator(currValue));
					});

					return !isInvalid;
				}
			}
		});
	};
}
