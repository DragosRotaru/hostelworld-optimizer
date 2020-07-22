import moment from "moment";
import * as HW from "./domain/hostelworld";
import { SearchTerm } from "./domain/hostelworld/autocomplete";
import { TravellerCount } from "./domain/core";
import { isLeft } from "fp-ts/lib/Either";

(async () => {
  try {
    const travellerCount = 1 as TravellerCount.T;
    const searchTerm = "berlin" as SearchTerm.T;
    const arrival = moment();
    const departure = moment(arrival).add(4, "days");
    console.log(
      `city search term: ${searchTerm}, arrival: ${arrival.format(
        "YYYY-MM-DD"
      )}, departure: ${departure.format(
        "YYYY-MM-DD"
      )}, travellers: ${travellerCount}`
    );
    const citiesMaybe = await HW.autocomplete.searchCities(searchTerm);
    if (isLeft(citiesMaybe)) throw new Error("no cities found by search term");
    const cities = citiesMaybe.right;
    console.log(cities.length, " cities found, choosing ", cities[0].name);
    const city = cities[0];
    const propertiesInfo = await HW.properties.getAvailableProperties(
      city.id,
      arrival,
      departure,
      travellerCount
    );
    console.log(propertiesInfo.length, " properties found");
    const properties = await Promise.all(
      propertiesInfo.map(async info => ({
        info,
        availability: await HW.availability.getProperty(
          info.id,
          arrival,
          departure,
          travellerCount
        ),
      }))
    );
    console.log(JSON.stringify(properties, null, 2));
  } catch (error) {
    console.log(error);
  }
})();
