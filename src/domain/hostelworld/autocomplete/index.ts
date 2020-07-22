import { Either, left, right } from "fp-ts/lib/Either";
import axios from "axios";
import Joi from "@hapi/joi";
import * as SearchTerm from "./search-term";
import { stringIntegerType, stringType } from "../common";

const cityArraySchema = Joi.array()
  .items(
    Joi.object({
      id: stringIntegerType,
      label: stringType,
      highlighted: stringType,
      category: Joi.string()
        .valid("City")
        .required(),
      type: Joi.string()
        .valid("city")
        .required(),
    })
  )
  .required();

type City = {
  id: number;
  name: string;
};

const searchCities = async (
  term: SearchTerm.T
): Promise<Either<Error, City[]>> => {
  const res = await axios({
    url: "https://www.hostelworld.com/find/autocomplete",
    params: {
      term,
    },
  });
  const cities = res.data.filter((entry: any) => entry.type === "city");
  const validatedCities = await cityArraySchema.validateAsync(cities);
  if (validatedCities.length === 0) return left(new Error("no results found"));
  return right(
    validatedCities.map(
      (city: any): City => ({
        name: city.label,
        id: Number(city.id),
      })
    )
  );
};

export { SearchTerm, searchCities };
