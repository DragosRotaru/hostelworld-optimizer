import moment from "moment";
import * as iots from "io-ts";
import * as NonEmptyString from "../non-empty-string";

export const Name = "timestamp";

export interface Brand {
  readonly [Name]: unique symbol;
}

export const Codec = iots.brand(
  iots.string,
  (input): input is iots.Branded<string, Brand> => Is(input),
  Name
);

export type T = iots.TypeOf<typeof Codec>;

export const Is = (input: unknown): input is T =>
  NonEmptyString.Is(input) && moment(input, moment.ISO_8601).isValid();

export const C = () => moment().toISOString() as T;

export const ToUnix = (input: T) => moment(input).unix();

export const Compare = (left: T, right: T): number =>
  moment.utc(left).diff(moment.utc(right));

export const Format = (input: T, format: string): string =>
  moment(input).format(format);
