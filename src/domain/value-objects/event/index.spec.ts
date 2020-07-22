import { isRight } from "fp-ts/lib/Either";
import { pipe } from "fp-ts/lib/pipeable";
import * as Event from ".";

describe("event", () => {
  test("construct, encode, decode", () => {
    pipe(Event.C(), event => expect(event).toBeTruthy());
    pipe(Event.C(), Event.Codec.encode, event => expect(event).toBeTruthy());
    pipe(Event.C(), Event.Codec.encode, Event.Codec.decode, event =>
      expect(isRight(event)).toBeTruthy()
    );
  });
});
