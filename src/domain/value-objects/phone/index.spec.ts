import * as Phone from "./index";
import { map } from "fp-ts/lib/Either";
import { pipe } from "fp-ts/lib/pipeable";

describe("phone", () => {
  test("it decodes", () => {
    pipe(
      Phone.C("9055823651"),
      map(input => expect(typeof input === "string").toBe(true))
    );
  });
});

/* 
describe("phone", () => {
  test("it parses", () => {
    pipe(
      Phone.C("6474489603"),
      map(input => expect(typeof input === "string").toBe(true))
    );
  });
  test("it encodes to international", () => {
    pipe(
      Phone.C("6474489603"),
      map(num => Phone.Codec.encode(num)),
      map(num => expect(num).toBe("+16474489603"))
    );
  });
});
*/
