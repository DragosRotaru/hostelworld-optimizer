import * as iots from "io-ts";
import { WholeNumber } from "../../value-objects";

export const Name = "traveller-count";

export interface Brand {
  readonly [Name]: unique symbol;
}

export const Codec = iots.brand(
  iots.number,
  (input): input is iots.Branded<number, Brand> => Is(input),
  Name
);

export type T = iots.TypeOf<typeof Codec>;

export const Is = (input: unknown): input is T =>
  WholeNumber.Is(input) && input >= 1 && input < 2;
