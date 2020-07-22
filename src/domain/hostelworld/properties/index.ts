import axios from "axios";
import Joi from "@hapi/joi";
import {
  wholeNumberType,
  stringType,
  wholeNumberNotReqType,
  stringIntegerNotReqType,
  wholeNumberRatingType,
  booleanType,
  positiveFloatType,
  urlType,
  floatRatingType,
  unknownArrayType,
} from "../common";
import { Moment } from "moment";
import { TravellerCount } from "../../core";

const latitudeType = Joi.number()
  .min(-90)
  .max(90)
  .required();
const longitudeType = Joi.number()
  .min(-180)
  .max(180)
  .required();

export type PaymentType = "debitCard" | "creditCard" | "alipay" | "paypal";

const paymentType = Joi.string()
  .valid("debitCard", "creditCard", "alipay", "paypal")
  .required();

export type PropertyType = "HOSTEL" | "HOTEL" | "APARTMENT" | "GUESTHOUSE";

const propertyType = Joi.string()
  .valid("HOSTEL", "HOTEL", "APARTMENT", "GUESTHOUSE")
  .required();

const roomType = Joi.string()
  .valid(
    "single",
    "double",
    "triple",
    "mixed",
    "twin",
    "family",
    "male",
    "female"
  )
  .required();

export type PropertyInfo = {
  id: number;
  name: string;
  type: PropertyType;
  facilities: string[];
  address: string;
  payment: PaymentType[];
  latitude: number;
  longitude: number;
  city: string;
  images: string[];
  hasFreeWifi: boolean;
  hasFreeBreakfest: boolean;
  mainImage: string;
  url: string;
  ratings: {
    count: number;
    average: number;
    security: number;
    location: number;
    staff: number;
    fun: number;
    clean: number;
    facilities: number;
    valueForMoney: number;
    period: number;
  };
};

const schema = Joi.array()
  .items(
    Joi.object({
      id: wholeNumberType,
      name: stringType,
      propertyName: stringType,
      districtIds: Joi.array() // Districts within City
        .items(wholeNumberNotReqType)
        .required(),
      propertyType: propertyType,
      facilities: Joi.array()
        .items(stringIntegerNotReqType)
        .required(),
      averageRating: wholeNumberRatingType,
      rooms: Joi.array()
        .items(
          Joi.object({
            type: roomType,
            ensuite: booleanType,
          }) // NOT REQUIRED
        )
        .required(),
      currency: "EUR", // Browsing Currency
      numReviews: wholeNumberType,
      noRating: booleanType,
      distance: positiveFloatType, // From City Center
      address: stringType,
      minPriceInBrowsingCurrency: positiveFloatType,
      dormPriceInBrowsingCurrency: positiveFloatType,
      privatePriceInBrowsingCurrency: positiveFloatType,
      lowestAveragePricePerNight: positiveFloatType,
      lowestAverageDormPricePerNight: positiveFloatType,
      lowestAveragePrivatePricePerNight: positiveFloatType,
      ratingBarsRemoved: booleanType,
      paymentTypes: Joi.array()
        .items(paymentType)
        .required(),
      latitude: latitudeType,
      longitude: longitudeType,
      cityName: stringType,
      images: Joi.array().items(urlType),
      imagesGallery: Joi.array()
        .items(
          Joi.object({
            prefix: stringType,
            suffix: stringType,
          }).required()
        )
        .required(),
      position: wholeNumberType,
      hasOwnTranslation: booleanType,
      totalScore: wholeNumberType,
      isNew: booleanType,
      isNewToHw: booleanType,
      description: stringType,
      isFeatured: booleanType,
      isHRP: booleanType, // Hostelworld Recommends Programme
      hasFreeWifi: booleanType,
      hasFreeBreakfast: booleanType,
      freeCancellationAvailable: booleanType,
      mainImage: urlType,
      fabSort: Joi.object()
        .pattern(/rank\d+/, wholeNumberType)
        .required(),
      hasRestrictions: booleanType,
      hasRoomRestrictions: booleanType,
      hasSomeRoomRestriction: booleanType,
      url: urlType,
      reviewsUrl: urlType,
      ratings: Joi.object({
        reviewsNum: wholeNumberType,
        propertyReview: Joi.object({
          Security: wholeNumberRatingType,
          Location: wholeNumberRatingType,
          Staff: wholeNumberRatingType,
          Fun: wholeNumberRatingType,
          Clean: wholeNumberRatingType,
          Facilities: wholeNumberRatingType,
          ValueForMoney: wholeNumberRatingType,
          Average: floatRatingType,
          Reviews: wholeNumberType,
          Period: wholeNumberType,
        }).required(),
        propertyReviewOverall: wholeNumberRatingType,
        hideReviewsLink: booleanType,
        noRatings: booleanType,
        hideRatingBar: booleanType,
        isNewProperty: booleanType,
        minPositiveReviewScore: wholeNumberRatingType,
        hasReviewFactors: booleanType,
      }).required(),
      hw20Party: unknownArrayType, // Hostelworld 20th aniversary Parties
    }).required()
  )
  .required();

const get = (url: string) => async (
  cityID: number,
  arrival: Moment,
  departure: Moment,
  numOfGuests: TravellerCount.T
): Promise<PropertyInfo[]> => {
  const res = await axios({
    url,
    params: {
      cityId: cityID.toString(),
      arrival: arrival.format("YYYY-MM-DD"),
      departure: departure.format("YYYY-MM-DD"),
      numberOfGuests: numOfGuests.toString(),
      currency: "EUR",
      language: "en",
    },
  });
  const value = await schema.validateAsync(res.data.properties);
  return value.map(
    (prop: any): PropertyInfo => ({
      id: prop.id,
      name: prop.name,
      type: prop.propertyType,
      facilities: prop.facilities,
      address: prop.address,
      payment: prop.paymentTypes,
      latitude: prop.latitude,
      longitude: prop.longitude,
      city: prop.cityName,
      images: prop.images,
      hasFreeWifi: prop.hasFreeWifi,
      hasFreeBreakfest: prop.hasFreeBreakfast,
      mainImage: prop.mainImage,
      url: prop.url,
      ratings: {
        count: prop.ratings.propertyReview.Reviews,
        average: prop.ratings.propertyReview.Average,
        security: prop.ratings.propertyReview.Security,
        location: prop.ratings.propertyReview.Location,
        staff: prop.ratings.propertyReview.Staff,
        fun: prop.ratings.propertyReview.Fun,
        clean: prop.ratings.propertyReview.Clean,
        facilities: prop.ratings.propertyReview.Facilities,
        valueForMoney: prop.ratings.propertyReview.ValueForMoney,
        period: prop.ratings.propertyReview.Period,
      },
    })
  );
};

export const getUnavailableProperties = get(
  "https://www.hostelworld.com/city/unavailable-properties"
);

export const getAvailableProperties = get(
  "https://www.hostelworld.com/city/list-properties"
);
