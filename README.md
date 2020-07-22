## Add functionality

- Find optimal Hostels based on single search
- Log data
  - Price over time
  - Availability over time
  - Lowest all in cost over time
  - Risk score
- Review Processing
  - Sentiment Analysis
  - Sentiment Analysis over time
  - Keywords
  - Health Hazard Keywords (Bed Bugs/Mold/etc)
- Link to Booking Page, Google Maps, Hostelworld
- Preferred Areas
- Walkability Score

## Optimize for Correctness

- figure out
  - schema of unknown arrays
  - missing propertyTypes
  - missing roomtypes
  - differentiate between BasicType and Type
  - decode facilities
  - what is fabsort
  - annotate scraper
- scrapers return simplified data with value objects, no need to store all the crap that HW returns
- write tests for scraper

### Possibly Useful Properties

- mainImage
- images
- violations?
- fullyRestrictedViolations?
- rooms
  - fullAvailability?
  - isPrivate?
  - minGuests?
  - ratePlans?
  - fullyRestricted?

## process reviews using NLP

- https://www.hostelworld.com/properties/34160/reviews?sort=newest&page=1&monthCount=36
