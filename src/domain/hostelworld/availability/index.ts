import axios from "axios";
import Joi from "@hapi/joi";
import {
  booleanType,
  wholeNumberType,
  positiveFloatType,
  stringType,
  emptyStringType,
  stringFloatType,
  stringIntegerType,
  unknownArrayType,
} from "../common";
import { Moment } from "moment";
import { TravellerCount } from "../../core";

export type RoomType =
  | "Twin Private"
  | "Mixed Dorm"
  | "Female Dorm"
  | "Private"
  | "Single Private"
  | "Double Bed Private"
  | "Apartment"
  | "Family Room"
  | "Male Dorm"
  | "Dbl Private"
  | "FAMILYROOM"
  | "APARTMENT"
  | "";

const roomType = Joi.string()
  .valid(
    "Twin Private",
    "Mixed Dorm",
    "Female Dorm",
    "Private",
    "Single Private",
    "Double Bed Private",
    "Apartment",
    "Family Room",
    "Male Dorm",
    "Dbl Private",
    "FAMILYROOM",
    "APARTMENT",
    ""
  )
  .required();

export type RatePlanType = "STANDARD" | "BED_AND_BREAKFAST";

const ratePlanType = Joi.string()
  .valid("STANDARD", "BED_AND_BREAKFAST")
  .required();

export type Pricing = {
  [key: number]: {
    [key: string]: number;
  };
};

export type RatePlan = {
  id: number;
  procedure: {
    id: string;
    label: string;
    description: string;
  };
  type: RatePlanType;
  hasRateViolations: boolean;
  isRefundable: boolean;
  isDefault: boolean;
  rateRuleViolations: any[];
};

export type Room = {
  id: number;
  beds: number;
  type: RoomType;
  ensuite: boolean;
  private: boolean;
  minUnitsRemaining: number;
  minGuests: number;
  ratePlans: RatePlan[];
  pricing: Pricing;
};

const roomSchema = Joi.array()
  .items(
    Joi.object({
      beds: stringIntegerType,
      type: roomType,
      basicType: roomType,
      ensuite: stringIntegerType,
      id: wholeNumberType,
      totalPricePerGuest: Joi.object()
        .pattern(/^\d+$/, positiveFloatType)
        .required(),
      fullAvailability: booleanType,
      labelToRender: emptyStringType,
      numofbeds: emptyStringType,
      roomtypename: roomType,
      roomtypedescription: stringType,
      labeldescriptionToRender: emptyStringType,
      images: Joi.array()
        .items(
          Joi.object({
            prefix: stringType,
            suffix: stringType,
          }) // NOT REQUIRED
        )
        .required(),
      minUnitsRemaining: wholeNumberType,
      ensuiteorshared: emptyStringType,
      priceBreakdown: Joi.object()
        .pattern(
          /^\d+$/,
          Joi.object()
            .pattern(
              /\d{4}-\d{2}-\d{2}/,
              Joi.object({
                dow: stringType,
                dom: stringIntegerType,
                month: Joi.string()
                  .alphanum()
                  .required(),
                year: stringIntegerType,
                price: stringFloatType,
              }).required()
            )
            .required()
        )
        .required(),
      isPrivate: booleanType,
      minGuests: wholeNumberType,
      ratePlans: Joi.array()
        .items(
          Joi.object({
            id: wholeNumberType,
            paymentProcedure: Joi.object({
              id: stringType,
              label: stringType,
              description: stringType,
            }).required(),
            isDefault: booleanType,
            isRefundable: booleanType,
            rateRuleViolations: unknownArrayType,
            hasRateViolation: booleanType,
            ratePlanType: ratePlanType,
          }).required()
        )
        .required(),
      fullyRestricted: booleanType,
      averagePrice: Joi.object()
        .pattern(/^\d+$/, stringFloatType)
        .required(),
      isLowestPrice: booleanType,
      name: stringType,
    }) // NOT REQUIRED
  )
  .required();

export type CancellationPolicy = {
  label: string;
  description: string;
};

const cancellationPolicy = Joi.object({
  label: stringType,
  description: stringType,
}).required();

export type PropertyAvailability = {
  rooms: Room[];
  cancellationPolicies: CancellationPolicy[];
  freeCancellationAvailable: boolean;
  freeCancellationUntil: string;
};

const availabilitySchema = Joi.object({
  hasAvailability: booleanType,
  violations: unknownArrayType,
  events: unknownArrayType,
  rooms: {
    dorms: roomSchema,
    privates: roomSchema,
  },
  fullyRestrictedViolations: unknownArrayType,
  roomsForGtm: Joi.object({
    nonRefundableCount: Joi.object({
      dorms: wholeNumberType,
      privates: wholeNumberType,
    }).required(),
    roomTypesShown: wholeNumberType,
    roomTypesFullyAvail: wholeNumberType,
    totalDorms: wholeNumberType,
    totalPrivates: wholeNumberType,
  }),
  pricesForGtm: Joi.object({
    base_price_value_string: positiveFloatType,
    tax_price_value_string: positiveFloatType,
    total_price_value_string: positiveFloatType,
  }).required(),
  roomsForJs: Joi.object()
    .pattern(
      /^\d+$/,
      Joi.object({
        id: wholeNumberType,
        isPrivate: booleanType,
        roomtypename: roomType,
        ensuiteorshared: Joi.string()
          .valid("", "Ensuite", "Shared Bathroom")
          .required(),
        beds: stringIntegerType,
        numofbeds: emptyStringType,
        labelToRender: emptyStringType,
        minGuests: wholeNumberType,
        priceperbed: Joi.object()
          .pattern(/^\d+$/, positiveFloatType)
          .required(),
        isLowestPrice: booleanType,
      }).required()
    )
    .required(),
  cancellationPolicies: Joi.array()
    .items(cancellationPolicy)
    .required(),
  freeCancellationAvailable: booleanType,
  freeCancellationUntil: stringType,
}).required();

const room = (a: any): Room => {
  const pricing: Pricing = {};
  Object.entries(a.priceBreakdown).forEach(([ratePlanID, x]: [string, any]) => {
    pricing[Number(ratePlanID)] = {};
    Object.entries(x).forEach(([date, y]: [string, any]) => {
      pricing[Number(ratePlanID)][date] = Number(y.price);
    });
  });
  return {
    id: Number(a.id),
    beds: Number(a.beds),
    type: a.type,
    ensuite: a.ensuite === "1",
    private: a.isPrivate,
    minGuests: a.minGuests,
    minUnitsRemaining: a.minUnitsRemaining,
    ratePlans: a.ratePlans,
    pricing,
  };
};

export const getProperty = async (
  propertyID: number,
  arrival: Moment,
  departure: Moment,
  numOfGuests: TravellerCount.T
): Promise<PropertyAvailability> => {
  const res = await axios({
    url: `https://www.hostelworld.com/properties/${propertyID}/availability`,
    params: {
      dateFrom: arrival.format("YYYY-MM-DD"),
      dateTo: departure.format("YYYY-MM-DD"),
      number_of_guests: numOfGuests,
    },
  });
  const value = await availabilitySchema.validateAsync(res.data);
  return {
    rooms: [...value.rooms.dorms.map(room), ...value.rooms.privates.map(room)],
    cancellationPolicies: value.cancellationPolicies,
    freeCancellationAvailable: value.freeCancellationAvailable,
    freeCancellationUntil: value.freeCancellationUntil,
  };
};
