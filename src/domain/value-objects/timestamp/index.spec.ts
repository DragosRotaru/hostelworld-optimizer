import { pipe } from "fp-ts/lib/pipeable";
import { map } from "fp-ts/lib/Either";
import { Is, C, Codec, T, Compare } from ".";

describe("timestamp", () => {
  test("it constructs", () => {
    expect(C()).toBeTruthy();
  });
  test("it guards", () => {
    expect(Is(C())).toBeTruthy();
  });
  test("it encodes/decodes", () => {
    pipe(
      C(),
      Codec.encode,
      Codec.decode,
      map(timestamp => expect(Is(timestamp)).toBeTruthy())
    );
  });
  test("it compares two dates", () => {
    expect(
      Compare("2020-01-24T06:38:00.000Z" as T, "2020-01-24T06:38:00.000Z" as T)
    ).toEqual(0);
    expect(
      Compare("2020-01-24T06:38:00.000Z" as T, "2020-01-24T06:38:10.000Z" as T)
    ).toEqual(-10000);
    expect(
      Compare("2020-01-24T06:38:10.000Z" as T, "2020-01-24T06:38:00.000Z" as T)
    ).toEqual(10000);
  });
});
