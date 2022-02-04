import { FieldPath, FieldPathValue } from 'react-hook-form/dist/types/utils';
import { Validate, ValidateResult } from 'react-hook-form/dist/types/validator';
import { FieldValues } from 'react-hook-form/dist/types/fields';

import { EMAIL_REGEX } from 'src/constants/regex';

type ValueType<TFieldValues extends FieldValues, TFieldName extends FieldPath<TFieldValues>> = FieldPathValue<
  TFieldValues,
  TFieldName
>;
type ValidatorType<TFieldValues extends FieldValues, TFieldName extends FieldPath<TFieldValues>> = Validate<
  FieldPathValue<TFieldValues, TFieldName>
>;

export interface ValidatorOptions<TFieldValues extends FieldValues, TFieldName extends FieldPath<TFieldValues>> {
  refine?: (value: ValueType<TFieldValues, TFieldName>) => ValueType<TFieldValues, TFieldName>;
  validators: ValidatorType<TFieldValues, TFieldName>[];
}

export const validate = <
  TFieldValues extends FieldValues = FieldValues,
  TFieldName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  refine,
  validators,
}: ValidatorOptions<TFieldValues, TFieldName>): ValidatorType<TFieldValues, TFieldName> => {
  return value => {
    let val = value;
    if (refine) {
      val = refine(value);
    }

    return getValidatorsResult<TFieldValues, TFieldName>(val, validators);
  };
};

export const patternValidator =
  <
    TFieldValues extends FieldValues = FieldValues,
    TFieldName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
  >(
    pattern: RegExp,
    message?: string,
    reverse = false,
  ): ValidatorType<TFieldValues, TFieldName> =>
  (value: ValueType<TFieldValues, TFieldName>) =>
    getValidatorResult(!reverse ? pattern.test(value as string) : !pattern.test(value as string), message);

export const emailValidator = <
  TFieldValues extends FieldValues = FieldValues,
  TFieldName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>(
  message?: string,
) => patternValidator<TFieldValues, TFieldName>(EMAIL_REGEX, message, false);

function getValidatorResult(valid: boolean, message?: string): ValidateResult {
  return valid ? true : message ?? false;
}

function getValidatorsResult<TFieldValues extends FieldValues, TFieldName extends FieldPath<TFieldValues>>(
  value: ValueType<TFieldValues, TFieldName>,
  validators: ValidatorType<TFieldValues, TFieldName>[],
): ValidateResult | Promise<ValidateResult> {
  for (const validator of validators) {
    const error = validator(value);

    if (error === false || typeof error === 'string') {
      return error;
    }
  }

  return true;
}
