import Joi from "@hapi/joi";

export const unknownArrayType = Joi.array().required();
export const booleanType = Joi.boolean().required();
export const positiveFloatType = Joi.number()
  .min(0)
  .required();
export const wholeNumberNotReqType = Joi.number()
  .integer()
  .min(0);
export const wholeNumberType = wholeNumberNotReqType.required();
export const wholeNumberRatingType = wholeNumberType.max(100);
export const floatRatingType = Joi.number()
  .min(0)
  .max(100)
  .required();
export const stringType = Joi.string().required();
export const emptyStringType = stringType.allow("");
export const urlType = Joi.string()
  .uri()
  .required();
export const stringIntegerNotReqType = Joi.string().regex(/^\d+$/);
export const stringIntegerType = stringIntegerNotReqType.required();
export const stringFloatType = Joi.string()
  .regex(/[+-]?([0-9]*[.])?[0-9]+/)
  .required();
